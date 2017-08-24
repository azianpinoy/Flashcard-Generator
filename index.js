var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require('inquirer');
var fs = require('fs');

var basicCardsArray = [];
var clozeCardsArray = [];
var quizArray = [];

var countBasic = 0;
var countCloze = 0;
var score = 0;

function createBasicCard(){
	
	inquirer.prompt([
	   {
	    name: "front",
	    message: "What should the front of the card say?"
	  }, {
	    name: "back",
	    message: "What should the back of the card say?"
	  }
	]).then(function(answers) {
		var newCard = new BasicCard(answers.front, answers.back);

		basicCardsArray.push(newCard)

		var toLog = "\n" + answers.front + ", " + answers.back;

		fs.appendFile("basicCards.txt", toLog, function(err) {
		  console.log("Basic card was logged!");
		});

	})	

}

function createClozeCard(){
	inquirer.prompt([
	   {
	    name: "fullText",
	    message: "What should the full text be?"
	  }, {
	    name: "cloze",
	    message: "What should the cloze text be?"
	  }
	]).then(function(answers) {

		if(answers.fullText.includes(answers.cloze) == false){
			console.log('Error. Please check your paramaters.');
			createClozeCard();
		}
		else{
			var newCard = new ClozeCard(answers.fullText, answers.cloze);

			clozeCardsArray.push(newCard)

			var toLog = "\n" + answers.fullText + ", " + answers.cloze;

			fs.appendFile("clozeCards.txt", toLog, function(err) {
			  console.log("Cloze card was logged!");
			});
			
		}
	})	

}

function chooseCardType(){
	inquirer.prompt([
	  {
	    name: "cardType",
	    message: "What type of flashcard do you want to make (basic or cloze)?"
	  }, 
	]).then(function(answers) {
		if(answers.cardType == 'basic'){
			createBasicCard();
		}
		else if(answers.cardType == 'cloze'){
			createClozeCard();
		}
		else{
			console.log('Invalid input. Please try again');
			chooseCardType();
		}
	})
}

function chooseAction(){
	inquirer.prompt([
	  {
	    name: "action",
	    message: "Chose your action (create or quiz)?"
	  }, 
	]).then(function(answers) {
		if(answers.action == 'create'){
			chooseCardType();
		}
		else if(answers.action == 'quiz'){
			countBasic = 0;
			countCloze = 0;
			runBasicQuiz();
		}
		else{
			console.log('Invalid input. Please try again');
			chooseAction();
		}
	})
}	

function runBasicQuiz(){
	
	if(countBasic < basicCardsArray.length){
		var currentQuestion = basicCardsArray[countBasic].front;
		var currentAnswer = basicCardsArray[countBasic].back;

		inquirer.prompt([
		  {
		    name: "question",
		    message: currentQuestion
		  } 
		]).then(function(answers) {
			if(answers.question == currentAnswer){
				console.log('Correct!')
				score++;
			}
			else{
				console.log('Incorrect!')
			}

			countBasic++;

			runBasicQuiz();

		})
	}
	else{
		runClozeQuiz();
	}
}

function runClozeQuiz(){

	if(countCloze < clozeCardsArray.length){
		var currentPartial = clozeCardsArray[countCloze].partialText;
		var currentCloze = clozeCardsArray[countCloze].cloze;

		inquirer.prompt([
		  {
		    name: "question",
		    message: currentPartial
		  } 
		]).then(function(answers) {
			if(answers.question == currentCloze){
				console.log('Correct!')
				score++;
			}
			else{
				console.log('Incorrect!')
			}

			countCloze++;

			runClozeQuiz();

		})
	}
	else{
		endGameScreen();
	}

}

function populateArrays(){
	fs.readFile("basicCards.txt", "utf8", function(error, data) {

	  var dataArr = data.split("\n");

	  for(var i = 0; i < dataArr.length; i++){
	  	var paramsArr = dataArr[i].split(', ');
	  	var param1 = paramsArr[0];
	  	var param2 = paramsArr[1];

	  	var newCard = new BasicCard(param1, param2);

	  	basicCardsArray.push(newCard);
	  }

	});

	fs.readFile("clozeCards.txt", "utf8", function(error, data) {

	  var dataArr = data.split("\n");

	  for(var i = 0; i < dataArr.length; i++){
	  	var paramsArr = dataArr[i].split(', ');
	  	var param1 = paramsArr[0];
	  	var param2 = paramsArr[1];

	  	var newCard = new ClozeCard(param1, param2);

	  	clozeCardsArray.push(newCard);
	  }

	});	
}

function endGameScreen(){
	console.log('Quiz completed!');
	var totalQuestions = basicCardsArray.length + clozeCardsArray.length;
	console.log('You answered ' + score + ' questions correctly out of ' + totalQuestions);
}

populateArrays();
chooseAction();