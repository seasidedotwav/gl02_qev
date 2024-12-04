describe("Program Syntactic testing of GiftParser", function(){

    beforeAll(function() {
        const element = require('../Element');

        const giftParser = require('../GiftParser');
        this.analyzer = new giftParser();


    });

    it("can read comments", function(){
        let input = ["//", "This is a comment"];
        expect(this.analyzer.comment(input)).toBe("This is a comment");
    });

    it ("can read a question header", function(){
        let input = ["::", "U3 p31 6 -ed adjectives and prepositions"];
        expect(this.analyzer.questionHeader(input)).toBe("U3 p31 6 -ed adjectives and prepositions");
    }  );



});