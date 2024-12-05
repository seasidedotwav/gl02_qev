const giftParser = require('../GiftParser');
const fs = require('fs');
const {join} = require("node:path");

describe("Program Syntactic testing of GiftParser", function(){
    beforeEach(function() {
        this.analyzer = new giftParser();

    });

    xit("can read comments", function(){
        let input = ["//", "This is a comment"];
        expect(this.analyzer.comment(input)).toBe("This is a comment");
    });

    xit ("can read a question header", function(){
        let input = ["::", "U3 p31 6 -ed adjectives and prepositions"];
        expect(this.analyzer.questionHeader(input)).toBe("U3 p31 6 -ed adjectives and prepositions");
    }  );

    it("test basic question file", function () {
        // U3-p30-Reading.gift
        let file = fs.readFileSync('../SujetB_data/U3-p30-Reading.gift', 'utf8');
        this.analyzer.parse(file);
        let parsed = this.analyzer.parsedElement;
        expect(parsed.length).toBe(1);
        expect(parsed[0].comments.length).toBe(2);
        expect(parsed[0].questions.length).toBe(6);

    });

    xit("test with all files", function () {


    });
    // TODO U3-p31-Gra-ed_adjectives_prepositions.gift
    it("test optional text in questions ('1:MC:') U3-p31-Gra-ed_adjectives_prepositions.gift", function () {
        let file = fs.readFileSync('../SujetB_data/U3-p31-Gra-ed_adjectives_prepositions.gift', 'utf8');
        this.analyzer.parse(file);
        let parsed = this.analyzer.parsedElement;
        expect(parsed.length).toBe(1);
        expect(parsed[0].comments.length).toBe(0);
        expect(parsed[0].questions.length).toBe(1);
    });

    // TODO EM-U5-p38-Passive.gift

    // TODO U4-p42_43-Listening.gift

    // TODO U6-p59-Vocabulary.gift
    it('test tag', function () {
        let file = fs.readFileSync('../SujetB_data/U6-p59-Vocabulary.gift', 'utf8');
        this.analyzer.parse(file);
        let parsed = this.analyzer.parsedElement;

        expect(parsed.length).toBe(1);
        expect(parsed[0].comments.length).toBe(0);
        expect(parsed[0].questions.length).toBe(6);
        expect(parsed[0].questions[0].body.length).toBe(4);
    });

    // TEST U1-p8_9-Reading-Coachella.gift
    it('U1-p8_9-Reading-Coachella.gift', function () {
        let file = fs.readFileSync('../SujetB_data/U1-p8_9-Reading-Coachella.gift', 'utf8');
        this.analyzer.parse(file);
        let parsed = this.analyzer.parsedElement;

        expect(parsed.length).toBe(1);
        expect(parsed[0].comments.length).toBe(3);
        expect(parsed[0].questions.length).toBe(2);
        expect(parsed[0].questions[0].body[1].list.length).toBe(7);
        expect(parsed[0].instructions[0]).toBe("$CATEGORY: $course$/top/Gold B2, Unit 1");
    });

    // TEST ALL FILES
// TEST ALL FILES
    // TEST ALL FILES
    it('test all files', function () {
        let files = fs.readdirSync('../SujetB_data');
        files.forEach(file => {
            let fileContent = fs.readFileSync(join('../SujetB_data', file), 'utf8');
            console.log('Processing file:', file);
            this.analyzer.parse(fileContent);

        });


    });





});