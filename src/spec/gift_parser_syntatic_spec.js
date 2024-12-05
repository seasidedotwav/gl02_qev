const giftParser = require('../GiftParser');
const fs = require('fs');

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
        console.log(parsed);
        console.log(parsed[0].questions);
        console.log(parsed[0].questions[0].body[2]);
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
        expect(parsed[0].questions.length).toBe(1);
        expect(parsed[0].questions[0].body.length).toBe(3);
    });

});