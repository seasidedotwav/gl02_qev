const fs = require('fs');
const colors = require('colors');

const FILE_PATH = './exam.json';

let Exam = function () {
	this.questions = [];
	this.load();
}

// Add a method to save the state to a file
Exam.prototype.save = function () {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.questions, null, 2));
};

// Add a method to load the state from a file
Exam.prototype.load = function () {
    if (fs.existsSync(FILE_PATH)) {
        this.questions = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    }
};


// Clear the exam questions
Exam.prototype.clear = function () {
    this.questions = []
	console.log("Exam has been cleared".green)
	this.save()
};

// Add a question in exam , verify if not already in exam
Exam.prototype.addQuestion = function(question){
	var isDuplicated = false;

	//check if question already in exam
	this.questions.forEach((examQuestion) => {
		if (examQuestion.header == question.header) {
			console.log("Questin already in exam".red);
			isDuplicated = true;
		} 
	});	
	
	//if question not in exam add
	if (!isDuplicated) {
		this.questions.push(question);
		console.log("Question added to exam".green);
		this.save();
	
	}
}

Exam.prototype.start = function(){
	//TODO start the exam , show questions , ask anser etc 
};

//show exam's question
Exam.prototype.show = function(){
	console.log(this.questions)
	console.log("%s", JSON.stringify(this.questions, null, 2));
};

//check if exam is valid format
Exam.prototype.isValid = function(){
	if (this.questions.length < 15) {
		console.log("There is not enougth question in the exam, the minimu is 15".red)
		return false
	} else if (this.questions.length > 20) {
		console.log("There is not namy question in the exam, the maximum is 20".red)
		return false
	} else {
		console.log("The exam is valid".green)
		return true
	}
};


module.exports = Exam;