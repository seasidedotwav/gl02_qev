const fs = require('fs');
const colors = require('colors');
const GiftParser = require('./GiftParser.js');
const vg = require('vega');
const vegalite = require('vega-lite');

const cli = require("@caporal/core").default;

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
            var analyzer = new GiftParser(options.showTokenize, options.showSymbols);
            analyzer.parse(data);

            if (analyzer.errorCount === 0) {
                logger.info("The .gift file is a valid vpf file".green);
            } else {
                logger.info("The .gift file contains error".red);
            }

            logger.debug(analyzer.parsedElement);

        });

    })

cli.run(process.argv.slice(2));
