const fs = require('fs');
const colors = require('colors');

const FILE_PATH = './src/exam.json';

let Exam = function () {
	this.questions = [];
	this.load();
}

//question types for exam stats
let questionTypes = new Map([
    ['Choix Multiple', 0],
    ['Vraie/Faux', 0],
    ['Correspondance', 0],
    ['Mot Manquant', 0],
    ['Numérique', 0],
    ['Question Ouverte', 0]
]);


// save the exam
Exam.prototype.save = function () {
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.questions, null, 2));
};

// load exam
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
			console.log("Question already in exam".red);
			isDuplicated = true;
		} 
	});	
	
	//if question not in exam add
	if (!isDuplicated) {
		this.questions.push(question);
		console.log("Question added to exam".green);
		this.save();


		function incrementQuestionType(type) {
			if (questionTypesMap.has(type)) {
				let currentCount = questionTypesMap.get(type);
				questionTypesMap.set(type, currentCount + 1);  // Increment the count
	
	}
}

//show exam's question
Exam.prototype.show = function(){
	console.log("---------------------- Questions in the current Exam ------------------------".blue)
	console.log("%s", JSON.stringify(this.questions, null, 2));
	console.log("------------------------ End questions in the exam --------------------------".blue)
};

//check if exam is valid format
Exam.prototype.isValid = function(){
	if (this.questions.length < 15) {
		console.log("There is not enough question in the exam, the minimum is 15".red)
		return false
	} else if (this.questions.length > 20) {
		console.log("There is too many questions in the exam, the maximum is 20".red)
		return false
	} else {
		console.log("The exam is valid".green)
		return true
	}
};

Exam.prototype.getQuestionsTypes = function(){
	this.questions.forEach((examQuestions) => {
		type = examQuestions.type

		switch (type) {
			case value:
				
				break;
		
			default:
				break;
		}

	})


	// Convert to array for Vega-Lite
	let questionTypesData = Array.from(questionTypesMap, ([key, value]) => ({
		type: key,
		count: value
	}));
	console.log(questionTypesData);
	return questionTypesData;
}

//show exam's question
Exam.prototype.export = function(){
	console.log("Exam exported TODO !!!")

	//TODO exam export 

	this.questions = []
};




module.exports = Exam;