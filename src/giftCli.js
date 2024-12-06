const fs = require('fs');
const colors = require('colors');
const GiftParser = require('./GiftParser.js');
const Exam = require('./Exam.js');
const vega = require('vega');
const vegaLite = require('vega-lite');
const { createCanvas } = require('canvas');
const {parse} = require("vega");

const cli = require("@caporal/core").default;

const exam = new Exam();


cli
    .version('0.1')
    .command('check', 'Check if <file> is a valid Gift file')
    .argument('<file>', 'The file to check with Gift parser')
    .option('-s, --showSymbols', 'log the analyzed symbol at each step', {validator: cli.BOOLEAN, default: false})
    .option('-t, --showTokenize', 'log the tokenization results', {validator: cli.BOOLEAN, default: false})
    .action(({args, options, logger}) => {
        fs.readFile(args.file, 'utf8', function (err, data) {
            if (err) {
                return logger.warn(err);
            }
            var parser = new GiftParser(options.showTokenize, options.showSymbols);
            parser.parse(data);

            if (parser.errorCount === 0) {
                logger.info("The .gift file is a valid gift file".green);
            } else {
                logger.info("The .gift file contains error".red);
            }

            logger.debug(parser.parsedElement);

        });

    })


    // search a question by the question text   EF01
	.command('search', 'Free text search on questions')
	.argument('<file>', 'The Vpf file to search')
	.argument('<bodyText>', 'The text to look for in the question body text or header')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){
			var textToSearch = new RegExp(args.bodyText);

			var filteredElements = []

			for (let i = 0; i < parser.parsedElement.length; i++) {		//iterate over parsedElement , on file
				for (let k = 0; k < parser.parsedElement[i].questions.length; k++) {	//iterate over questions of the file
					var question = parser.parsedElement[i].questions[k]

					if (question.header.match(textToSearch, 'i') || question.body[0].match(textToSearch, 'i')) {
						filteredElements.push(question)
					}
				}
			}
			logger.info("%s", JSON.stringify(filteredElements, null, 2));
		}else{
			logger.info("The .gift file contains error".red);
		}
		});
	})


    // select a question from it question header/ID  and add in exam EF01
	.command('append', 'Select and Add a question in the exam from its header text')
	.argument('<file>', 'The Gift file to search')
	.argument('<headerText>', 'The text to look for in question\'s header')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){
			var textToSearch = new RegExp(args.headerText);

			var filteredElements = []

			for (let i = 0; i < parser.parsedElement.length; i++) {		//iterate over parsedElement , on file
				for (let k = 0; k < parser.parsedElement[i].questions.length; k++) {	//iterate over questions of the file

					var question = parser.parsedElement[i].questions[k]

					if (question.header.match(textToSearch, 'i')) {
						filteredElements.push(question)
					}
				}
			}

			//check if lenght of filtered element ==1 to confirm selection
			switch (filteredElements.length) {
				case 0:
					logger.info("No question found, Please enter a more accurate Question header identifier !".red);
					break;
				case 1:
					exam.addQuestion(filteredElements[0])
					break;
				default:
					logger.info("%s", JSON.stringify(filteredElements, null, 2));
					logger.info("Too many question selected, Please enter a more accurate Question header identifier !".red);
					break;
			}


		}else{
			logger.info("The .gift file contains error".red);
		}
		});
	})

	// create empty exam  EF02
	.command('create', 'Create an empty exam')
	.action(({args, options, logger}) => {
		exam.create()
	})

	// remove last question exam  EF02
	.command('remove', 'Remove the last question of the exam')
	.action(({args, options, logger}) => {
		exam.removeLast()
	})

	// show every question in the exam  EF02
	.command('read', 'Display all question of the exam')
	.action(({args, options, logger}) => {
		exam.read()
	})

	// return lenght of exam  EF02
	.command('length', 'Display all question of the exam')
	.action(({args, options, logger}) => {
		logger.info(("There is " +exam.questions.length +" questions in the exam.").green)
	})

	// verify exam integrity  EF03 
	.command('compliant', 'Verify exam integrity')
	.action(({args, options, logger}) => {
		exam.isValid()
	})

	// ln check if the question is already in the exam  EF02
	.command('ln', 'Free text search on questions')
	.argument('<file>', 'The Vpf file to search')
	.argument('<headerText>', 'The text to look for in the question body text or header')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){
			var textToSearch = new RegExp(args.headerText);

			var filteredElements = []

			for (let i = 0; i < parser.parsedElement.length; i++) {		//iterate over parsedElement , on file
				for (let k = 0; k < parser.parsedElement[i].questions.length; k++) {	//iterate over questions of the file
					var question = parser.parsedElement[i].questions[k]

					if (question.header.match(textToSearch, 'i')) {
						filteredElements.push(question)
					}
				}
			}
			//check if lenght of filtered element ==1 to confirm selection
			switch (filteredElements.length) {
				case 0:
					logger.info("No question found, Please enter a more accurate Question header identifier !".red);
					break;
				case 1:
					if (!exam.isAlreadyInExam(filteredElements[0])) {
						logger.info("Question not in exam");
					}
					break;
				default:
					logger.info("%s", JSON.stringify(filteredElements, null, 2));
					logger.info("Too many question selected, Please enter a more accurate Question header identifier !".red);
					break;
			}

		}else{
			logger.info("The .gift file contains error".red);
		}
		});
	})

    // export exam in GIFT format   EF02
	.command('export', 'select a question with from it question header')
	.action(({args, options, logger}) => {
		if (exam.isValid()) {
			exam.export()
		}
	})

    // generate prof VCARD file    EF04
	.command('createProfVCARD', 'Generate a Professor VCARD file')
	.argument('<firstname>', 'Professor firstname')
	.argument('<lastname>', 'Professor lastname')
    .argument('<email>', 'Professor email address')
	.argument('<phone>', 'Professor phone number')
	.action(({ args, options, logger }) => {
		// Validate input fields
		const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const validatePhone = (phone) => /^\d{2}(\.\d{2}){4}$/.test(phone);

		if (!validateEmail(args.email)) {
			return logger.info("Invalid email format. Expected format: example@domain.com".red);
		}

		if (!validatePhone(args.phone)) {
			return logger.info("Invalid phone format. Expected format: xx.xx.xx.xx.xx".red);
		}

		// Split full name into first and last names
		const firstName = args.firstname;
		const lastName = args.lastname;

		// Encode special characters for VCard compliance (RFC 6868)
		const encodeForVCard = (text) =>
			text.replace(/\\/g, '\\\\')
				.replace(/\n/g, '\\n')
				.replace(/;/g, '\\;')
				.replace(/,/g, '\\,');

		// Generate VCard content
		const vCardContent = 
`BEGIN:VCARD
VERSION:4.0
N:${encodeForVCard(firstName)};${encodeForVCard(lastName)};;;
FN:${encodeForVCard(lastName)} ${encodeForVCard(firstName)}
TEL;TYPE=work:${encodeForVCard(args.phone)}
EMAIL:${encodeForVCard(args.email)}
END:VCARD`;

		// Define file name for VCard
		const filePath = `./export/prof_${firstName}_${lastName}.vcf`;

		// Write VCard file
		const fs = require('fs');
		fs.writeFile(filePath, vCardContent, (err) => {
			if (err) {
				logger.info(`Error writing VCard file: ${err.message}`.red);
			} else {
				logger.info(`VCard file created successfully: ${filePath}`.green);
			}
		});

	})

    //start  Start an exam   EF05
	.command('startSimulation', 'Start an exam')
	.action(({args, options, logger}) => {

		let exam = new Exam();
		exam.questions = [];
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}

		let parser = new GiftParser();
		parser.parse(data);
		if(parser.errorCount === 0){
			exam.load();
			for (let i = 0; i < parser.parsedElement.length; i++) {
				for (let k = 0; k < parser.parsedElement[i].questions.length; k++) {
					exam.addQuestion(parser.parsedElement[i].questions[k]);
				}
			}
			exam.start();
		}else{
			logger.info("The .gift file contains error".red);
		}

		});

	})

    //stats  Show a graph about questions types in exam   EF06
	.command('stats', 'Show a graph about questions types in exam')
	.action(({args, options, logger}) => {

		if (exam.isValid()) {
			QuestionsType = exam.getQuestionsTypes();

			//create graph stats //to modif
			var statsChart = {  
				"width": 230,
				"height": 280,
				"data" : {
						"values" : QuestionsType
				},
				"mark" : "bar",
				"encoding" : {
					"x" : {"field" : "type", "type" : "nominal",
							"axis" : {"title" : "Questions Types"}
						},
					"y" : {"field" : "count", "type" : "quantitative",
							"axis" : {"title" : "Question %"}
						},
				}
			}
		

			// Compile the Vega-Lite chart to a Vega specification
			const vegaSpec = vegaLite.compile(statsChart).spec;

			// Parse the Vega specification
			var runtime = vega.parse(vegaSpec);
			var view = new vega.View(runtime).renderer('canvas').background("#FFF").run();
			var myCanvas = view.toCanvas();
			myCanvas.then(function(res){
				fs.writeFileSync("./export/ExamStats.png", res.toBuffer());
				view.finalize();
				logger.info("Exam stats graph succesfully exported in Export Folder".green);
			})	
		} else {

		}

	})


    //compareExam  Show a graph who compare the % of question type betwin our exam and the typical/national exam   EF07
	.command('compare', 'show graph of comparaison to typical/national exam')
	.action(({args, options, logger}) => {

		if (exam.isValid()) {
			//get exam types
			QuestionsType = exam.getQuestionsTypes();

			//officla exam types proportion
			officialQuestionType = [
				{"type": "Choix Multiple", "officialCount": 30},
				{"type": "Vraie/Faux", "officialCount": 25},
				{"type": "Correspondance", "officialCount": 5},
				{"type": "Mot Manquant", "officialCount": 10},
				{"type": "Numérique", "officialCount": 10},
				{"type": "Question Ouverte", "officialCount": 20},
			]

			// Merge the two datasets based on the question type
			const combinedData = QuestionsType.map(qt => {
				const official = officialQuestionType.find(o => o.type === qt.type);
				return [
					{ type: qt.type, category: "Exam", value: qt.count },
					{ type: qt.type, category: "OfficialExam", value: official ? official.officialCount : 0 }
				];
			}).flat();

			//can't do combined graph , that work on online vega editor, but error :
			//WARN xOffset-encoding is dropped as xOffset is not a valid encoding channel.
			//when on local

			//create graph stats 
			var comparedGraph =  
				{
					"data": {
					"values": combinedData
					},
					"mark": "bar",
					"encoding": {
						"x": {
						"field": "type",
						"type": "nominal",
						"title": "Question Type"
						},
						"y": {
						"field": "value",
						"type": "quantitative",
						"title": "Quastion %"
						},
						"color": {
						"field": "category",
						"type": "nominal",
						"title": "Category",
						"legend": null 
						},
						"facet": {
						"field": "category",
						"type": "nominal",
						"columns": 2,
						"title": null  // This can be adjusted depending on your needs
						}
					}
					};


			// Compile the Vega-Lite chart to a Vega specification
			const vegaSpec = vegaLite.compile(comparedGraph).spec;

			// Parse the Vega specification
			var runtime = vega.parse(vegaSpec);
			var view = new vega.View(runtime).renderer('canvas').background("#FFF").run();
			var myCanvas = view.toCanvas();
			myCanvas.then(function(res){
				fs.writeFileSync("./export/ComparedExam.png", res.toBuffer());
				view.finalize();
				logger.info("Compared graph succesfully exported in Export Folder".green);
			})
		}
	})

cli.run(process.argv.slice(2));
