/*   exemple question :
                id                                        question
::U3 p31 6 -ed adjectives and prepositions:: Choose the correct preposition.
    text                            answer                       text
What sports do you get excited {1:MC:~with~=about}? What sports do you find exciting?
Do you ever get frustrated {1:MC:~on~=with} a sportsperson/team? Which person/team do you find frustrating?
Who are you impressed {1:MC:~=by~for}? Who do you find impressive?
Who or what do you get annoyed {1:MC:~of~=by}?
What do you sometimes feel embarrassed {1:MC:~in~=by}? Who do you find embarrassing?
*/


let File = function () {
	this.questions = [];
    this.comments = [];
    this.questions = [];
}
let Question = function () {
    this.header = [];
    this.body = [];
    this.format = "";
    this.type = "";

}
let Answers = function () {
    this.list = [];
}

let Answer = function (correct, text, feedback) {
    this.correct = correct;
    this.text = text;
    this.feedback = feedback;
}


module.exports = {File, Question, Answer, Answers};