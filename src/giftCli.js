const fs = require('fs');
const colors = require('colors');
const GiftParser = require('./GiftParser.js');
const Exam = require('./Exam.js');
const vega = require('vega');
const vegaLite = require('vega-lite');
const { createCanvas } = require('canvas');

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
	.command('search', 'Free text search on questions body text')
	.argument('<file>', 'The Vpf file to search')
	.argument('<bodyText>', 'The text to look for in question\'s header')
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

					if (question.header.match(textToSearch, 'i')) {
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


    // select a question from it question header/ID   EF01
	.command('select', 'select a question with from it question header')
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

	// clear exam  EF02
	.command('clearExam', 'Clear all question in the exam')
	.action(({args, options, logger}) => {
		exam.clear()
	})

    // export exam in GIFT format   EF02
	.command('exportExam', 'select a question with from it question header')
	.action(({args, options, logger}) => {

		if (exam.isValid()) {
			//TODO export command
            //if betwin 15 and 20 question in exam , allow the export and no multiple same question
            //cal verify exam command, if true :
            //export the selected questions in a GIFT file

		}
  
	})

	// verify exam integrity  EF03 
	.command('verifyExam', 'Verify exam integrity')
	.action(({args, options, logger}) => {
		exam.isValid()
	})

    // generate prof VCARD file    EF04
	.command('createProfVCARD', 'Generate Prof VCARD file')
	.argument('<name>', 'prof name')
    .argument('<email>', 'prof email address')
	.argument('<phone>', 'prof phone number')
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
		const [firstName, ...lastNameParts] = args.name.split(' ');
		const lastName = lastNameParts.join(' ') || 'Unknown';

		// Encode special characters for VCard compliance (RFC 6868)
		const encodeForVCard = (text) =>
			text.replace(/\\/g, '\\\\')
				.replace(/\n/g, '\\n')
				.replace(/;/g, '\\;')
				.replace(/,/g, '\\,');

		// Generate VCard content
		const vCardContent = `BEGIN:VCARD
			VERSION:3.0
			N:${encodeForVCard(lastName)};${encodeForVCard(firstName)};;;
			FN:${encodeForVCard(args.name)}
			EMAIL;TYPE=WORK:${encodeForVCard(args.email)}
			TEL;TYPE=WORK,VOICE:${encodeForVCard(args.phone)}
			END:VCARD`;

		// Define file name for VCard
		const fileName = `prof_${args.name.replace(/\s+/g, '_')}.vcf`;

		// Write VCard file
		const fs = require('fs');
		fs.writeFile(fileName, vCardContent, (err) => {
			if (err) {
				logger.info(`Error writing VCard file: ${err.message}`.red);
			} else {
				logger.info(`VCard file created successfully: ${fileName}`.green);
				logger.info(vCardContent.cyan);
			}
		});

	})

    //start  Start an exam   EF05
	.command('start', 'Start an exam')
    .argument('<file>', 'Exam file to start')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){
			
            //TODO start command
            //start the exam , give point for good answer etc..
			

		}else{
			logger.info("The .gift file contains error".red);
		}
		
		});
	})

    //stats  Show a graph about questions types in exam   EF06
	.command('stats', 'Show a graph about questions types in exam')
	.action(({args, options, logger}) => {

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
			fs.writeFileSync("./src/ExamStats.png", res.toBuffer());
			view.finalize();
			logger.info("Chart output : ./src/ExamStats.png");
		})	

	})


    //compareExam  Show a graph who compare the % of question type betwin our exam and the typical/national exam   EF07
	.command('compare', 'show graph of comparaison to typical/national exam')
	.action(({args, options, logger}) => {

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

		console.log(combinedData)

		//can't do combined graph , that work on online vega editor, but error :
		//WARN xOffset-encoding is dropped as xOffset is not a valid encoding channel.
		//when on local

		//create graph stats //to modif
		var comparedGraph =  
			{
				"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
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
			fs.writeFileSync("./src/ComparedExam.png", res.toBuffer());
			view.finalize();
			logger.info("Chart output : ./src/ComparedExam.png");
		})
	})

cli.run(process.argv.slice(2));
