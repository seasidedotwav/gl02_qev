var QUESTION = require('./QUESTION');

// VpfParser

var VpfParser = function(sTokenize, sParsedSymb){
	// The list of question parsed from the input file.
	this.parsedPOI = [];
	this.symb = ["::"]; 
	this.showTokenize = sTokenize;
	this.showParsedSymbols = sParsedSymb;
	this.errorCount = 0;
}


// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
VpfParser.prototype.tokenize = function(data){
	var separator = /(::)/;
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
	this.listQuestion(tData);
}

// Parser operand

VpfParser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}





module.exports = VpfParser;