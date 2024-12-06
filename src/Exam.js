const fs = require('fs');
const colors = require('colors');
const path = require('path');


const FILE_PATH = './src/tempExam.json';

let Exam = function () {
	this.questions = [];
	this.load();
}


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

// create exam
Exam.prototype.create = function () {
	this.questions = []
	console.log("New exam succesfully created".green)
    fs.writeFileSync(FILE_PATH, JSON.stringify(this.questions, null, 2));
};


// remove last  question
Exam.prototype.removeLast = function () {
	if (this.questions.length =0) {
		console.log("This exam is already empty".red)
	} else {
		this.questions.pop()
		console.log("Last question has been removed".green)
		this.save()
	}
};

// verify if object already in exam
Exam.prototype.isAlreadyInExam = function (question) {
    const isInExam = this.questions.some((examQuestion) => examQuestion.header === question.header);
    if (isInExam) {
        console.log("Question already in exam".red);
    }
    return isInExam;
};

// Add a question in exam
Exam.prototype.addQuestion = function(question){

	//if question not in exam add
	if (!this.isAlreadyInExam(question)) {
		this.questions.push(question);
		console.log("Question added to exam".green);
		this.save();
	}
}

//show exam's question
Exam.prototype.read = function(){
	console.log("---------------------- Questions in the current Exam ------------------------".blue)
	console.log("%s", JSON.stringify(this.questions, null, 2));
	console.log("------------------------ End questions in the exam --------------------------".blue)

	this.questions.forEach((question)=> {
		console.log( this.convertObjectToString(question))
	})
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
	let QuestionsTypes = new Map([
			['Choix Multiple', 0],
			['Vraie/Faux', 0],
			['Correspondance', 0],
			['Mot Manquant', 0],
			['Numérique', 0],
			['Question Ouverte', 0],
			['Undefined', 0],
		]);

	this.questions.forEach((examQuestions) => {

		var type = examQuestions.type
		//console.log(type)
		//TODO add rest of questions type
		switch (type) {
			case "1:MC:":
				QuestionsTypes.set("Choix Multiple", QuestionsTypes.get("Choix Multiple") + 1);
				break;
			case "1:SA:":
				QuestionsTypes.set("Correspondance", QuestionsTypes.get("Correspondance") + 1);
				break;
			case "1:XX:":
				QuestionsTypes.set(type, QuestionsTypes.get("Choix Multiple") + 1);
				break;
			case "1:XX:":
				QuestionsTypes.set(type, QuestionsTypes.get("Choix Multiple") + 1);
				break;
			case "1:XX:":
				QuestionsTypes.set(type, QuestionsTypes.get("Choix Multiple") + 1);
				break;
		
			default:
				QuestionsTypes.set("Undefined", QuestionsTypes.get("Undefined") + 1);
				break;
		}

	})

	// Convert to array for Vega-Lite
	let questionTypesData = Array.from(QuestionsTypes, ([key, value]) => ({
		type: key,
		count: value /this.questions.length *100	//convert to %
	}));


	return questionTypesData;
}

//show exam's question
Exam.prototype.export = function () {
	let examExportContent = "";

	this.questions.forEach(question => {
		examExportContent += this.convertObjectToString(question)
	});

	const outputPath = path.join(process.cwd(), 'export/Exam.gift');
	fs.writeFileSync(outputPath, examExportContent, 'utf-8');
	console.log(`Exam successfully exported to ${outputPath}`.green);

};

Exam.prototype.convertObjectToString = function (question) {
	// Question header
	let line = `::${question.header}::`;

	// Question format (if applicable)
	if (question.format) {
		giftContent += `${question.format}`;
	}

	// Question body
	question.body.forEach(bodyPart => {
		if (typeof bodyPart === 'string') {
			line += `${bodyPart}`;
		} else if (bodyPart.list) {
			line += "{";
			bodyPart.list.forEach(answer => {
				const prefix = answer.correct ? "=" : "~";
				line += `${prefix}${answer.text}`;
				if (answer.feedback) {
					line += `#${answer.feedback}`;
				}
			});
			line += "}";
		}
	});
	return line
}


module.exports = Exam;