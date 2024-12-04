const {Element, Question, Answer} = require('../File');

describe("Program Semantic testing of Gift document", function(){

    beforeAll(function() {

        this.p = new Element("Café d'Albert", 48.857735, 2.394987, [1,3,2]);

    });

    xit("can create a new POI", function(){

        expect(this.p).toBeDefined();
        // toBe is === on simple values
        expect(this.p.name).toBe("Café d'Albert");
        expect(this.p).toEqual(jasmine.objectContaining({name: "Café d'Albert"}));

    });

    xit("can add a new ranking", function(){

        this.p.addRating(2);
        // toEqual is === on complex values - deepEquality
        expect(this.p.ratings).toEqual([1,3,2,2]);

    });


});