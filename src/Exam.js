let Exam = function () {
	this.questions = [];
}



POI.prototype.addQuestion = function(question){
	this.questions.push(question);
};

POI.prototype.start = function(){
	//TODO start the exam , show questions , ask anser etc 
};