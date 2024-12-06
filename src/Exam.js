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

Exam.prototype.create = function () {
	fs.writeFileSync(FILE_PATH, JSON.stringify(this.questions, null, 2));
	console.log("Exam succesfully created".green)
}

// start the exam
Exam.prototype.start = async function () {
	let points = 0; // Initialiser les points à 0
	let numQuestions = 0; // Initialiser le nombre de questions à 0
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log("Exam started".green);
	console.log(this.questions);
	console.log(this.questions[0].body);

	// Fonction pour poser une question et attendre la réponse
	const askQuestion = async (question, index) => {
		return new Promise((resolve) => {
			console.log(`\nQuestion ${index + 1}: ${question.header}`);
			let isMatchedQuestion = false;
			let matchedAnswers = [];
			let matchedQuestions = [];

			// Affiche le contenu de la question
			question.body.forEach((item) => {
				if (typeof item === 'string') {
					console.log(item); // Affiche le texte principal
				} else if (item.type === 'Answers') {
					const answers = item.list;

					// Gère les réponses de type "Matching"
					answers.forEach((answer, i) => {
						if (answer.text.includes('->')) {
							isMatchedQuestion = true;
							// Découpe la réponse en deux parties : la question et la bonne réponse
							matchedQuestions.push(answer.text.split('->')[0].trim());
							matchedAnswers.push({
								question: answer.text.split('->')[0].trim(),
								correctAnswer: answer.text.split('->')[1].trim()
							});
						}
						if (!isMatchedQuestion) {
							console.log(`${i + 1}. ${answer.text}`);
						}
					});

					// Si c'est une question de type "Matching", demande une correspondance
					if (isMatchedQuestion) {
						const handleMatchingAnswers = async () => {
							// Affiche les réponses possibles
							console.log("\nPossible answers to match:");
							matchedAnswers.forEach((answer, i) => {
								console.log(`${i + 1}. ${answer.correctAnswer}`);
							});
							// Demande à l'utilisateur de faire des correspondances pour chaque question
							for (let i = 0; i < matchedAnswers.length; i++) {
								const question = matchedQuestions[i];
								numQuestions++;
								await new Promise((resolve) => {
									rl.question(`Match answer for "${question}": `, (input) => {
										const selectedIndex = parseInt(input) - 1;
										if (selectedIndex >= 0 && selectedIndex < matchedAnswers.length) {
											const selectedAnswer = matchedAnswers[selectedIndex];
											if (selectedAnswer.question === question) {
												console.log('✅ Correct answer!'.green);
												points++; // Incrémente les points pour une bonne réponse
											} else {
												console.log('❌ Wrong answer.'.red);
											}
										} else {
											console.log('Invalid choice. Please enter a valid number.');
										}
										resolve(); // Passe à la prochaine question de matching
									});
								});
							}
							resolve(); // Passe à la question suivante une fois que tout est résolu
						};
						handleMatchingAnswers();

					} else {
						// Si ce n'est pas une question de "Matching", on pose la question classique
						numQuestions++;
						rl.question('Enter your answer: ', (input) => {
							const selectedIndex = parseInt(input) - 1;
							if (selectedIndex >= 0 && selectedIndex < answers.length) {
								const selectedAnswer = answers[selectedIndex];
								if (selectedAnswer.correct) {
									console.log('✅ Correct answer!'.green);
									points++; // Incrémente les points pour une bonne réponse
								} else {
									console.log('❌ Wrong answer.'.red);
								}
								resolve(); // Passe à la question suivante
							} else {
								console.log('Invalid choice. Please enter a valid number.');
								rl.question('Enter your answer: ', (input) => resolve()); // Redemander si l'entrée est invalide
							}
						});
					}
				}

				resolve(); // Passe à la prochaine question
			});
		});
	};

	// Pose les questions une par une et attend la réponse avant de passer à la suivante
	for (let i = 0; i < this.questions.length; i++) {
		await askQuestion(this.questions[i], i); // Attend la réponse avant de continuer
	}

	// Affiche le score final de l'examen
	console.log(`\nExam finished. Your total score is: ${points} out of ${numQuestions}`);
	rl.close();
};





Exam.prototype.removeLast = function () {
	if (this.questions.length === 0) {
		console.log("This exam is already empty".red)
	} else {
		let removed = this.questions.pop()
		console.log("Last question has been removed".green)
		this.save()
		return
	}
}

// verify if object already in exam
Exam.prototype.isAlreadyInExam = function (question) {
	const isInExam = this.questions.some((examQuestion) => examQuestion.header === question.header);
	if (isInExam) {
		console.log("Question already in exam".red);
	}
	return isInExam;
};

// Add a question in exam
Exam.prototype.addQuestion = function (question) {

	//if question not in exam add
	if (!this.isAlreadyInExam(question)) {
		this.questions.push(question);
		console.log("Question added to exam".green);
		this.save();
	}
}

//show exam's question
	Exam.prototype.read = function () {
		this.questions.forEach((question) => {
			console.log(this.convertObjectToString(question))
		})
	};


//check if exam is valid format
	Exam.prototype.isValid = function () {
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

	Exam.prototype.getQuestionsTypes = function () {
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
				case "~":
					QuestionsTypes.set("Choix Multiple", QuestionsTypes.get("Choix Multiple") + 1);
					break;
				case "Vraie/Faux":
					QuestionsTypes.set("Vraie/Faux", QuestionsTypes.get("Vraie/Faux") + 1);
					break;
				case "XX":
					QuestionsTypes.set("Correspondance", QuestionsTypes.get("Correspondance") + 1);
					break;
				case "=":
				case "1:SA:":
					QuestionsTypes.set("Mot Manquant", QuestionsTypes.get("Mot Manquant") + 1);
					break;
				case "XX":
					QuestionsTypes.set("Numérique", QuestionsTypes.get("Numérique") + 1);
					break;
				case "Question Ouverte":
					QuestionsTypes.set("Question Ouverte", QuestionsTypes.get("Question Ouverte") + 1);
					break;

				default:
					QuestionsTypes.set("Undefined", QuestionsTypes.get("Undefined") + 1);
					break;
			}

		})

		// Convert to array for Vega-Lite
		let questionTypesData = Array.from(QuestionsTypes, ([key, value]) => ({
			type: key,
			count: value / this.questions.length * 100	//convert to %
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