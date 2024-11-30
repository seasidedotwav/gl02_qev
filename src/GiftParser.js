var Question = require('./Question');


// VpfParser

var VpfParser = function(sTokenize, sParsedSymb){
    // The list of POI parsed from the input file.
    this.parsedPOI = [];
    this.symb = ["START_POI","name","latlng","note","END_POI","$$"];
    this.showTokenize = sTokenize;
    this.showParsedSymbols = sParsedSymb;
    this.errorCount = 0;
}

// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
VpfParser.prototype.tokenize = function(data){
    var separator = /(\r\n|: )/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
}

// parse : analyze data by calling the first non terminal rule of the grammar
VpfParser.prototype.parse = function(data){
    var tData = this.tokenize(data);
    if(this.showTokenize){
        console.log(tData);
    }
    this.listPoi(tData);
}

// Parser operand

VpfParser.prototype.errMsg = function(msg, input){
    this.errorCount++;
    console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// Read and return a symbol from input
VpfParser.prototype.next = function(input){
    var curS = input.shift();
    if(this.showParsedSymbols){
        console.log(curS);
    }
    return curS
}

// accept : verify if the arg s is part of the language symbols.
VpfParser.prototype.accept = function(s){
    var idx = this.symb.indexOf(s);
    // index 0 exists
    if(idx === -1){
        this.errMsg("symbol "+s+" unknown", [" "]);
        return false;
    }

    return idx;
}



// check : check whether the arg elt is on the head of the list
VpfParser.prototype.check = function(s, input){
    if(this.accept(input[0]) === this.accept(s)){
        return true;
    }
    return false;
}

// expect : expect the next symbol to be s.
VpfParser.prototype.expect = function(s, input){
    if(s === this.next(input)){
        //console.log("Reckognized! "+s)
        return true;
    }else{
        this.errMsg("symbol "+s+" doesn't match", input);
    }
    return false;
}
