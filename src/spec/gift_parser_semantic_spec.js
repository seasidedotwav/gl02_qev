const Exam = require('../Exam');
const {Element, Question, Answer} = require('../File');

describe("Program Semantic testing of Gift document", function(){

    beforeAll(function() {
        this.exam = new Exam()
        this.question = new Question()

    });

    

    it("can remove last question of exam", function(){

        let examLength = this.exam.questions.length
        this.exam.removeLast()
        expect(this.exam.questions.length).toEqual(examLength-1);

    });
    
    it("can add question in exam", function(){

        let examLength = this.exam.questions.length
        this.exam.addQuestion(this.question)
        expect(this.exam.questions.length).toEqual(examLength+1);

    });

});