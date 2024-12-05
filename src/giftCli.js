const fs = require('fs');
const colors = require('colors');
const GiftParser = require('./GiftParser.js');
const Exam = require('./Exam.js');
const vg = require('vega');
const vegalite = require('vega-lite');

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
                logger.info("The .gift file is a valid vpf file".green);
            } else {
                logger.info("The .gift file contains error".red);
            }

            logger.debug(parser.parsedElement);

        });

    })


    // search a question by the question text   EF01
	.command('search', 'Free text search on questions body text')
	.argument('<file>', 'The Vpf file to search')
	.argument('<bodyText>', 'The text to look for in question\'s body')
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
	.argument('<file>', 'The Vpf file to search')
	.argument('<headerText>', 'The text to look for in question\'s body')
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
					logger.info("%s", JSON.stringify(filteredElements, null, 2));
					exam.addQuestion(question)
					exam.show()
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

	// verify exam integrity  EF03 
	.command('clearExam', 'Clear all question in the exam')
	.action(({args, options, logger}) => {
		exam.clear()
	})

    // verify exam integrity  EF03 
	.command('verifyExam', 'Verify exam integrity')
	.action(({args, options, logger}) => {
		exam.isValid()
	})

    // export exam in GIFT format   EF02
	.command('export', 'select a question with from it question header')
	.action(({args, options, logger}) => {

  
	
            //TODO export command
            //if betwin 15 and 20 question in exam , allow the export and no multiple same question
            //cal verify exam command, if true :
            //export the selected questions in a GIFT file
			


	})

    // generate prof VCARD file    EF04
	.command('createProfVCARD', 'Generate Prof VCARD file')
	.argument('<name>', 'prof name')
    .argument('<email>', 'prof email address')
	.argument('<phone>', 'prof phone number')
	.action(({args, options, logger}) => {

		
        //get elements from command
        var name = new RegExp(args.name);
        var email = new RegExp(args.email);
        var phone = new RegExp(args.phone);

        //verify well formed info : email with @xxx.xx
            //                         phone with xx.xx.xx.xx.xx
            //if wrong data : logger.info("Incorrect data format entered".red);

        //TODO  createProfVCARD command
        //get the info of proff and create the vcard file

			
	
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
	.argument('<file>', 'The GIFT file to use for create a graph')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){

			//TODO stats command
            //get question from exam, count question types, and make graph
			

            //create graph stats //to modif
            var statsChart = {  
				//"width": 320,
				//"height": 460,
				"data" : {
						"values" : value//value of the graph
				},
				"mark" : "bar",
				"encoding" : {
					"x" : {"field" : "name", "type" : "nominal",
							"axis" : {"title" : "Restaurants' name."}
						},
					"y" : {"field" : "averageRatings", "type" : "quantitative",
							"axis" : {"title" : "Average ratings for "+args.file+"."}
						}
				}
			}

            const myChart = vegalite.compile(statsChart).spec;
            //show the graph canvas
            var runtime = vg.parse(myChart);
			var view = new vg.View(runtime).renderer('canvas').background("#FFF").run();
			var myCanvas = view.toCanvas();
			myCanvas.then(function(res){
				fs.writeFileSync("./result.png", res.toBuffer());
				view.finalize();
				logger.info(myChart);
				logger.info("Chart output : ./result.png");
			})


		}else{
			logger.info("The .gift file contains error".red);
		}
		});
	})


    //compareExam  Show a graph who compare the % of question type betwin our exam and the typical/national exam   EF07
	.command('compare', 'show graph of comparaison to typical/national exam')
	.argument('<file>', 'the GIFT file to compare')
	.action(({args, options, logger}) => {
		fs.readFile(args.file, 'utf8', function (err,data) {
		if (err) {
			return logger.warn(err);
		}
  
		parser = new GiftParser();
		parser.parse(data);
		
		if(parser.errorCount === 0){

			//TODO compare command
            //get question type , like graph in EF05 and compare to officials exam
			

            //create graph stats //to modif
            var comparedGraph = {  
				//"width": 320,
				//"height": 460,
				"data" : {
						"values" : value//value of the graph
				},
				"mark" : "bar",
				"encoding" : {
					"x" : {"field" : "name", "type" : "nominal",
							"axis" : {"title" : "Restaurants' name."}
						},
					"y" : {"field" : "averageRatings", "type" : "quantitative",
							"axis" : {"title" : "Average ratings for "+args.file+"."}
						}
				}
			}

            const myChart = vegalite.compile(comparedGraph).spec;
            //show the graph canvas
            var runtime = vg.parse(myChart);
			var view = new vg.View(runtime).renderer('canvas').background("#FFF").run();
			var myCanvas = view.toCanvas();
			myCanvas.then(function(res){
				fs.writeFileSync("./result.png", res.toBuffer());
				view.finalize();
				logger.info(myChart);
				logger.info("Chart output : ./result.png");
			})


		}else{
			logger.info("The .gift file contains error".red);
		}
		});
	})

cli.run(process.argv.slice(2));
