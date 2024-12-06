const fs = require('fs');
const colors = require('colors');
const {Answers} = require("./File");
const readline = require('readline');
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

// start the exam
Exam.prototype.start = async function () {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	// Fonction pour poser une question et attendre la réponse
	const askQuestion = (question, index) => {
		console.log(`\nQuestion ${index + 1}: ${question.header}`);

		// Affiche le contenu de la question
		question.body.forEach((item) => {
			if (typeof item === 'string') {
				console.log(item); // Affiche le texte principal
			} else if (item.type === 'Answers') {
				// Affiche les options de réponse
				const answers = item.list;
				answers.forEach((answer, i) => {
					console.log(`${i + 1}. ${answer.text}`);
				});
			}
		});

		// Promesse pour attendre la réponse utilisateur
		return new Promise((resolve) => {
			rl.question('Enter your answer: ', (input) => {
				const answers = question.body.find((item) => item.type === 'Answers').list;
				const selectedIndex = parseInt(input) - 1;

				if (selectedIndex >= 0 && selectedIndex < answers.length) {
					const selectedAnswer = answers[selectedIndex];
					if (selectedAnswer.correct) {
						console.log('✅ Correct answer!');
					} else {
						console.log('❌ Wrong answer.');
					}
				} else {
					console.log('Invalid choice. Please enter a valid number.');
				}

				resolve(); // Passe à la prochaine question
			});
		});
	};

	// Pose les questions une par une
	for (let i = 0; i < this.questions.length; i++) {
		await askQuestion(this.questions[i], i); // Attend la réponse avant de continuer
	}

	console.log('\nExam finished. Thank you for participating!');
	rl.close();
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
	let giftContent = "";
	this.questions.forEach(question => {
		// Question header
		giftContent += `::${question.header}::\n`;

		// Question format (if applicable)
		if (question.format) {
			giftContent += `${question.format}\n`;
		}

		// Question body
		question.body.forEach(bodyPart => {
			if (typeof bodyPart === 'string') {
				giftContent += `${bodyPart}\n`;
			} else if (bodyPart.list) {
				giftContent += "{\n";
				bodyPart.list.forEach(answer => {
					const prefix = answer.correct ? "=" : "~";
					giftContent += `  ${prefix}${answer.text}`;
					if (answer.feedback) {
						giftContent += `#${answer.feedback}`;
					}
					giftContent += "\n";
				});
				giftContent += "}\n";
			}
		});

		giftContent += "\n"; // Add spacing between questions

	});
	const outputPath = path.join(process.cwd(), 'export/Exam.gift');
	fs.writeFileSync(outputPath, giftContent, 'utf-8');
	console.log(`Exam successfully exported to ${outputPath}`.green);

};




module.exports = Exam;