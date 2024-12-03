var Element = require('./Element');
var GiftParser = function(sTokenize, sParsedSymb) {
    this.parsedElement = [];
    this.symb = ["::", "{~", "~=", "~", '{', '}', '[html]', ':', '//'];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
};


// tokenize : transformer les données en une liste
GiftParser.prototype.tokenize = function(data) {
    // Expression régulière pour capturer les séparateurs, y compris \r\n
    var separator = /(::|{~|~=|~|{|}|\[html\]|:|\/\/|\r\n)/g;

    var result = data.split(separator);

    result = result.filter((val) => val !== "" && val !== "\r\n" && val.trim() !== "");

    return result;
};

GiftParser.prototype.parse = function(data) {
    var tData = this.tokenize(data);
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

// fichier-texte = *element
GiftParser.prototype.listElement = function(input) {
    while (input.length > 0) {
        this.element(input);
    }
};

// element = question / commentaire / instruction / texte-libre
GiftParser.prototype.element = function(input) {
    var elt = new Element();
    if (this.check("//", input)) {
        var comment = this.comment(input);
        elt.comments.push(comment);
    } else if (this.check("::", input)) {
        elt.questions.push("Question");
    }
    this.parsedElement.push(elt);
};

// traiter les commentaires
GiftParser.prototype.comment = function(input) {
    this.expect("//", input);
    return this.next(input);
};

// question = question-header question-body
GiftParser.prototype.question = function(input) {
    var elt = new Element();
    elt.questions.push(this.questionHeader(input));
    elt.questions.push(this.questionBody(input));
    return elt;
};

//question-header = "::" question-id "::"
//question-id = 1*VCHAR
//question-body = [html-tag] question-text question-options [question-text]
//question-text = 1*CHAR
//question-options = "{" answers "}"
//answers = answer *( [CRLF] answer )
// answer = correct-answer / incorrect-answer
// correct-answer = ["~"] "=" answer-text feedback
// incorrect-answer = "~" answer-text feedback
// answer-text = 1*CHAR
// feedback = ["#" 1*CHAR ]

// Traiter du texte libre (question ou autre texte)
GiftParser.prototype.text = function(input) {
    return this.next(input);
};

module.exports = GiftParser;
