const {File, Question, Answer,Answers} = require('./File');

const GiftParser = function (sTokenize, sParsedSymb) {
    this.parsedElement = [];
    this.symb = ["::", "{~", "~=", "~", '{', '}', '[html]', ':', '//', "=", '[markdown]', "$", '#'];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
};


// tokenize : transformer les données en une liste
GiftParser.prototype.tokenize = function(data) {
    // Expression régulière mise à jour pour inclure les séparateurs comme '[markdown]', '[html]', etc.
    const separator = /(::|{~|~=|~|{|}|\[markdown\]|\[html\]|\/\/|=|\r\n|#|\$)/g;

    // Découper la chaîne en utilisant les séparateurs définis
    let result = data.split(separator);

    // Filtrer les éléments vides, les espaces ou les retours à la ligne inutiles
    result = result.filter((val) => val !== "" && val !== "\r\n" && val.trim() !== "");

    // Traiter les cas spécifiques comme '{~' et '~=' pour les convertir en tokens séparés
    result = result.flatMap(token => {
        if (token === "{~") return ["{", "~"];
        if (token === "~=") return ["~", "="];
        if (token === "$") return ["$"]; // Ajout de la gestion pour le symbole '$'
        return [token];
    });

    return result;
};


GiftParser.prototype.parse = function(data) {
    const tData = this.tokenize(data);
    if (this.showTokenize) {
        console.log(tData);
    }
    this.listElement(tData);
};

// Parser operand

GiftParser.prototype.errMsg = function(msg, input) {
    this.errorCount++;

    // If the error count is less than or equal to 10, print the specific error message
    if (this.errorCount <= 10) {
        console.log(`Parsing Error! on "${input}" -- msg: ${msg}`);
    }

    // If the error count reaches 11, indicate that the error limit has been exceeded
    if (this.errorCount === 11) {
        console.log("Too many errors encountered. Suppressing further error messages.");
    }
};

// Lire et retourner un symbole de l'entrée
GiftParser.prototype.next = function(input) {
    var curS = input.shift();
    if (this.showParsedSymbols) {
        console.log(curS);
    }
    return curS;
};

// accept : vérifier si le symbole passé en argument est dans la liste des symboles
GiftParser.prototype.accept = function(s) {
    var idx = this.symb.indexOf(s);
    if (idx === -1) {
        this.errMsg("symbol " + s + " unknown", [" "]);
        return false;
    }

    return idx;
};

// check : vérifier si l'élément est en tête de la liste
GiftParser.prototype.check = function(s, input) {
    if (this.accept(input[0]) === this.accept(s)) {
        return true;
    }
    return false;
};

// expect : vérifier que le prochain symbole est celui attendu
GiftParser.prototype.expect = function(s, input) {
    if (s === this.next(input)) {
        return true;
    } else {
        this.errMsg("symbol " + s + " doesn't match", input);
    }
    return false;
};
// Liste des éléments
GiftParser.prototype.listElement = function (input) {
    const file = new File();
    while (input.length > 0) {
        this.element(input, file);
    }
    this.parsedElement.push(file);
};

// élément = question / commentaire
GiftParser.prototype.element = function (input, file) {
    if (this.check("$", input)) {
        file.instructions.push(this.instruction(input));

    }
    if (this.check("//", input)) {
        const comment = this.comment(input);
        file.comments.push(comment);
        return;
    }
    if (this.check("::", input)) {
        file.questions.push(this.question(input));
    }
};

// Instruction
GiftParser.prototype.instruction = function (input) {
    this.expect("$", input);
    return this.next(input);
};
// commentaire
GiftParser.prototype.comment = function (input) {
    this.expect("//", input);
    return this.next(input);
};

// question = en-tête + corps + réponses + texte additionnel
GiftParser.prototype.question = function (input) {
    const question = new Question();
    question.header = this.questionHeader(input);
    question.format = this.questionFormat(input);
    question.body = this.questionBody(input,question);
    return question;
};

// En-tête de la question
GiftParser.prototype.questionHeader = function (input) {
    this.expect("::", input);
    const header = this.next(input);
    this.expect("::", input);
    return header;
};

// Format de la question HTML ou Markdown
GiftParser.prototype.questionFormat = function (input) {
    if ("[html]" === input[0]) {
        return this.next(input);
    } else if ("[markdown]" === input[0]) {
        return this.next(input);
    }else{
        return "";
    }
};

// Corps de la question
GiftParser.prototype.questionBody = function (input,question) {
    const body = [];
    while ("::" !== input[0] && input.length > 0) {
        if ("{" === input[0] ) {
            // Check if its a question or a text
            body.push(this.answers(input,question));
        }else{
            body.push(this.next(input));
        }

    }
    return body;

};

// Réponses
GiftParser.prototype.typeQuestion = function (input) {
    // Expression régulière pour extraire tout ce qui est avant les symboles ['~', '=', '#']
    const optionalTextRegex = /^[^~=#]+/; // Correspond à tout avant '~', '=', ou '#'

    let type = "";
    if (optionalTextRegex.test(input[0])) {
        const match = input[0].match(optionalTextRegex);
        if (match) {
            type = match[0]; // Récupère la partie avant '~', '=', ou '#'
            this.next(input); // Passe à l'élément suivant
        }
    }

    else if (!type && input[0].startsWith('=')) {
        type = "=";
    }

    else if (!type && input[0].includes("{}")) {
        type = "Question Ouverte";
    }

    else if (type.startsWith("1:MC:") || input[0].startsWith("~") || input[0].includes("~")) {
        type = "~";
    }

    else if (type.startsWith("False") || type.startsWith("True")) {
        type = "Vraie/Faux";
    }

    return type;

};


GiftParser.prototype.answers = function (input,question) {
    const answers = new Answers();
    this.expect("{", input);

    if (input[0] === '}' ){
        return answers;
    }

    question.type = this.typeQuestion(input);

    while (!this.check("}", input) && input.length > 0) {
        let answer = this.answer(input);
        answers.list.push(answer);
    }
    this.expect("}", input);
    return answers;
};

// Une réponse individuelle
GiftParser.prototype.answer = function (input) {
    let answer = new Answer();
    let nextSymbol = this.next(input);


    // Si le symbole n'est ni ~, ni =, ni #, on l'assigne au texte de la réponse.
    if (!['~', '=', '#'].includes(nextSymbol)) {
        answer.text = nextSymbol;
        nextSymbol = this.next(input);  // Passe au prochain symbole.
    }

    // Traitement des réponses et du feedback.
    switch (nextSymbol) {
        case '~': {
            nextSymbol = this.next(input);
            if (nextSymbol === '=') {
                answer.correct = true;
                answer.text = this.next(input);  // Récupère le texte pour la réponse correcte.
            } else {
                answer.text = nextSymbol;
                answer.correct = false;  // Marque la réponse comme incorrecte.
            }
            break;
        }
        case '=': {
            answer.correct = true;
            answer.text = this.next(input);  // Récupère le texte pour la réponse correcte.
            break;
        }
        case '#': {
            nextSymbol = this.next(input);
            if (nextSymbol === '=') {
                answer.feedback = '=' + this.next(input);  // Récupère le feedback avec '='.
            } else {
                answer.feedback = nextSymbol;  // Sinon, récupère le feedback classique.
            }
            break;
        }
        default: {
            answer.text = nextSymbol;  // Si c'est un autre symbole, on l'assigne au texte de la réponse.
        }
    }

    return answer;
};


// Texte libre
GiftParser.prototype.text = function (input) {
    const text = [];
    while (input.length > 0 && !this.symb.includes(input[0])) {
        text.push(this.next(input));
    }
    return text.join(" ");
};

module.exports = GiftParser;
