const {File, Question, Answer} = require('./File');

const GiftParser = function (sTokenize, sParsedSymb) {
    this.parsedElement = [];
    this.symb = ["::", "{~", "~=", "~", '{', '}', '[html]', ':', '//'];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
};


// tokenize : transformer les données en une liste
GiftParser.prototype.tokenize = function(data) {
    // Expression régulière pour capturer chaque séparateur individuellement, y compris '{~' et '~='
    const separator = /(::|{~|~=|~|{|}|\[html\]|\/\/|=|\r\n)/g;

    // Remplacer les combinaisons comme '{~' et '~=' par des tokens distincts
    let result = data.split(separator);

    // Filtrage des éléments vides ou de retour à la ligne
    result = result.filter((val) => val !== "" && val !== "\r\n" && val.trim() !== "");

    // Traiter les tokens '{~' et '~=' comme des tokens séparés
    result = result.flatMap(token => {
        if (token === "{~") return ["{", "~"];
        if (token === "~=") return ["~", "="];
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
    console.log("Parsing Error! on " + input + " -- msg : " + msg);
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
    if (this.check("//", input)) {
        const comment = this.comment(input);
        file.comments.push(comment);
    } else if (this.check("::", input)) {
        file.questions.push(this.question(input));
    }
};

// commentaire
GiftParser.prototype.comment = function (input) {
    this.expect("//", input);
    return this.next(input);
};

// question = en-tête + corps + réponses + texte additionnel
GiftParser.prototype.question = function (input) {
    const question = new Question();
    question.header.push(this.questionHeader(input));
    question.body = this.questionBody(input);
    return question;
};

// En-tête de la question
GiftParser.prototype.questionHeader = function (input) {
    this.expect("::", input);
    const header = this.next(input);
    this.expect("::", input);
    return header;
};

// Corps de la question
GiftParser.prototype.questionBody = function (input) {
    const body = [];
    while ("::" !== input[0] && input.length > 0) {
        if ("{" === input[0] ) {
            // Check if its a question or a text
            body.push(this.answers(input));
        }else{
            body.push(this.next(input));
        }

    }
    return body;

};

// Réponses
GiftParser.prototype.answers = function (input) {
    const answers = [];
    this.expect("{", input);

    // Texte optionnel avant les réponses (exemples : {1:MC:~with~=about})
    const optionalTextRegex = /^\d+:[A-Z]+:/; // Ex : 1:MC: ou 2:TF:, etc.
    if (optionalTextRegex.test(input[0])) {
        const match = input[0].match(optionalTextRegex);
        if (match) {
            const optionalText = match[0];
            answers.push(optionalText);
            this.next(input);
        }
    }

    while (!this.check("}", input) && input.length > 0) {
        let answer = this.answer(input);
        answers.push(answer);
    }
    this.expect("}", input);
    return answers;
};

// Une réponse individuelle
GiftParser.prototype.answer = function (input) {
    let answer = new Answer();
    const nextSymbol = this.next(input);
    if (nextSymbol === '~') {
        if (this.next(input) === '=') {
            answer.correct = true;
        }
    } else {
        answer.correct = false;
    }
    answer.text = this.text(input);
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
