// Shared variables which need to be kept global for multiple functions to access them
let shuffledCapitalQuestions = [];
let shuffledCountriesQuestions = [];
let capitalsQuiz = [];
let countriesQuiz = [];
let quizType = null;
let currentCapitalsQuestionIndex = 0;
let currentCountriesQuestionIndex = 0;

//Buttons that are accessed globally and used in many functions
const capitalsButton = document.getElementById("capitals-btn");
const countriesButton = document.getElementById("countries-btn");
const nextButton = document.getElementById("next-btn");
const nextButtonContainer = document.getElementById('nxt-btn');
const exitButton = document.getElementById('exit-btn');
const scoreArea = document.getElementById('score-area');



//Disable buttons 

capitalsButton.disabled = true;

countriesButton.disabled = true;


// Load questions from JSON and initialize quizzes

fetch('questions.json')

  .then(response => response.json())

  .then(data => {

    // Transform JSON into the format for the quiz

    capitalsQuiz = data.capitalsQuestions.map(q => ({

      question: q.question,

      answers: q.options.map(option => ({
        text: option,
        correct: option === q.answer
      }))

    }));



    countriesQuiz = data.countriesQuestions.map(q => ({

      question: q.question,

      answers: q.options.map(option => ({
        text: option,
        correct: option === q.answer
      }))

    }));



    // Questions shuffle after loading

    shuffledCapitalQuestions = [...capitalsQuiz].sort(() => Math.random() - 0.5);
    shuffledCountriesQuestions = [...countriesQuiz].sort(() => Math.random() - 0.5);

    //Enable buttons
     capitalsButton.disabled = false;

    countriesButton.disabled = false;

  })

  .catch(err => console.error('Error loading questions:', err));


// Event listeners
capitalsButton.addEventListener('click', startCapitalsGame);
countriesButton.addEventListener('click', startCountriesGame);
nextButton.addEventListener('click', handleNextButtonClick);
exitButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to exit the quiz?")) {
    returnToCategories();
  }
});

// Allows the user to see the capitals questions
function startCapitalsGame() {
  quizType = "capital";
  currentCapitalsQuestionIndex = 0;
  shuffledCapitalQuestions = [...capitalsQuiz].sort(() => Math.random() - 0.5);

  capitalsButton.style.display = 'none';
  countriesButton.style.display = 'none';

  const capitalsQuestionContainer = document.getElementById('capitals-questions');
  const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');
  capitalsQuestionContainer.classList.remove('hide');
  capitalsAnswerButtons.classList.remove('hide');
  scoreArea.classList.remove('hide');

  replaceTitle("capital");
  setNextCapitalQuestion();
  exitButton.classList.remove('hide');
}



// Allows the user to see the countries questions
function startCountriesGame() {
  quizType = "country";
  currentCountriesQuestionIndex = 0;
  shuffledCountriesQuestions = [...countriesQuiz].sort(() => Math.random() - 0.5);

  capitalsButton.style.display = 'none';
  countriesButton.style.display = 'none';

  const countriesQuestionContainer = document.getElementById('countries-questions');
  const countriesAnswerButtons = document.getElementById('countries-answer-btn');
  countriesQuestionContainer.classList.remove('hide');
  countriesAnswerButtons.classList.remove('hide');
  scoreArea.classList.remove('hide');

  replaceTitle("country");
  setNextCountryQuestion();
  exitButton.classList.remove('hide');
}


// Makes the host page versatile by changing the title depending on the game choice chosen
function replaceTitle(type) {
  const oldTitle = document.getElementsByTagName("h1")[0];
  const newTitle = document.createElement("h1");
  if (type === "capital") {
    newTitle.textContent = 'Capitals Quiz';
  } else if (type === "country") {
    newTitle.textContent = 'Country Quiz';
  } else {
    newTitle.textContent = 'Countries and Capitals Quiz';
  }
  oldTitle.replaceWith(newTitle);
}

// Handle next button click for both quizzes so no need for function in event listener
function handleNextButtonClick() {
  if (quizType === "capital") {
    if (currentCapitalsQuestionIndex < shuffledCapitalQuestions.length - 1) {
      currentCapitalsQuestionIndex++;
      setNextCapitalQuestion();
    } else {
      lastQuestion();
    }
  } else if (quizType === "country") {
    if (currentCountriesQuestionIndex < shuffledCountriesQuestions.length - 1) {
      currentCountriesQuestionIndex++;
      setNextCountryQuestion();
    } else {
      lastQuestion();
    }
  }
}



// Makes the quiz flow from one question to another
    function setNextCountryQuestion() {
        resetState()
    showCountriesQuestion(shuffledCountriesQuestions[currentCountriesQuestionIndex])

};

// Makes the quiz flow from one question to another
function setNextCapitalQuestion() {
    resetState()
    showCapitalsQuestion(shuffledCapitalQuestions[currentCapitalsQuestionIndex])
};

//Shows the capitals questions and creates new answer buttons
function showCapitalsQuestion(question) {

    if (!question) {
        console.log("Error! Attempted to show capitals question but returned undefined");
        alert("Oops! There are no more questions.");
        returnToCategories();
        return;
    }

const capitalsQuestionElement = document.getElementById('capitals-question-text');
const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');

    capitalsQuestionElement.innerText = question.question;
    capitalsAnswerButtons.innerHTML = ''; // clear previous buttons
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('col-6', 'col-md-5', 'answer-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        capitalsAnswerButtons.appendChild(button);
    });

    capitalsAnswerButtons.classList.remove('hide'); // show answer buttons
    document.getElementById('capitals-questions').classList.remove('hide'); // show question container
}
/*
* Shows the countries questions and creates new answer buttons
*/
function showCountriesQuestion(question) {
    if (!question) {
        console.log("Error! Attempted to show countries question but returned undefined");
        alert("Oops! There are no more questions.");
        returnToCategories();
        return;
    }

const countriesQuestionElement = document.getElementById('countries-question-text');
const countriesAnswerButtons = document.getElementById('countries-answer-btn');

    capitalsQuestionElement.innerText = question.question;

    countriesAnswerButtons.innerHTML = ''; // clear previous buttons

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('col-6', 'col-md-5', 'answer-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        countriesAnswerButtons.appendChild(button);
    });

    countriesAnswerButtons.classList.remove('hide'); // show answer buttons
    document.getElementById('countries-questions').classList.remove('hide'); // show question container

}

//Resets the quiz after each question
function resetState() {
    nextButtonContainer.classList.add('hide');
     nextButton.classList.add('hide');
 const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');
  const countriesAnswerButtons = document.getElementById('countries-answer-btn');

    while (capitalsAnswerButtons.firstChild) {
        capitalsAnswerButtons.removeChild(capitalsAnswerButtons.firstChild);
    }
    while (countriesAnswerButtons.firstChild) {
        countriesAnswerButtons.removeChild(countriesAnswerButtons.firstChild);
    }
}


// Recognises correct answer and provides user with feedback
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    // Mark all buttons and disable them
    const parent = selectedButton.parentElement;
    Array.from(parent.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true;
    });

    // Show feedback to user
    if (correct) {
        alert("Well Done!");
        incrementScore();
    } else { const correctButton = Array.from(parent.children)
        .find
        (btn => btn.dataset.correct === "true");
        alert(`Unfortunately, you selected the wrong answer. The correct answer is: ${correctAnswer.innerText}`);
        incrementWrongAnswer();
    }
    
    //Determine to show the next question or button to return to the main menu
    if (quizType ==="capital") {
        if (shuffledCapitalQuestions.length > currentCapitalsQuestionIndex + 1) {
            nextButton.innerText = 'Next';
            nextButton.style.background ='#00008B';
            nextButton.classList.remove('hide');
            nextButtonContainer.classList.remove('hide');

        } else {
            lastQuestion();
        }
        } else if (quizType ==="country") {
        if (shuffledCountriesQuestions.length > currentCountriesQuestionIndex + 1) {
            nextButton.innerText = 'Next';
            nextButton.style.background ='#00008B';
            nextButton.classList.remove('hide');
            nextButtonContainer.classList.remove('hide');
            
        } else {
            lastQuestion();
        }
    }
}
/**
 * Gets the current score from the DOM and increments it by 1
 */
function incrementScore() {
    
    let oldScore = parseInt(document.getElementById('correct').innerText);
    document.getElementById('correct').innerText = ++oldScore;

}

/**
 * Gets the current score of incorrect answers from the DOM and increments it by 1
 */

function incrementWrongAnswer() {
    
    let oldScore = parseInt(document.getElementById('incorrect').innerText);
    document.getElementById('incorrect').innerText = ++oldScore;

}

//Preparation to return the user at the end of the quiz to return to the main menu getting the next button ready
function backToMainMenu() {
    if (quizType === "capital") {
        if (shuffledCapitalQuestions.length > currentCapitalsQuestionIndex + 1) {
            nextButtonContainer.classList.remove('hide');
        } else {
            nextButton.innerText = 'Return to main menu';
            nextButtonContainer.classList.remove('hide');
            nextButton.classList.remove('hide');

            nextButton.addEventListener('click', returnToCategories)
        }
    } else if (quizType === "country") {
        if (shuffledCountriesQuestions.length > currentCountriesQuestionIndex + 1) {
            nextButtonContainer.classList.remove('hide');
            nextButton.classList.remove('hide');
        } else {
            nextButton.innerText = 'Return to main menu';
           nextButton.style.background = 'blue';
           nextButtonContainer.classList.remove('hide');
           nextButton.classList.remove('hide');

           nextButton.addEventListener('click', returnToCategories)
        }
    }
}
// Resets the quiz ui and state. Returns quiz to page user sees when they arrive at the website
function returnToCategories() {
    quizType = null;
    currentCapitalsQuestionIndex = 0;
    currentCountriesQuestionIndex = 0;

    capitalsQuestionContainer.classList.add('hide');
    countriesQuestionContainer.classList.add('hide');
    capitalsAnswerButtons.classList.add('hide');
    countriesAnswerButtons.classList.add('hide');
    scoreArea.classList.add('hide');

    capitalsButton.style.display = 'inline-block';
    countriesButton.style.display = 'inline-block';

    nextButton.classList.remove('bold-large-button');
    nextButton.innerText = 'Next'; 
    nextButton.style.background = 'blue';
    nextButtonContainer.classList.add('hide');
    nextButton.classList.add('hide');



    const title = document.getElementsByTagName('h1') [0];
    title.innerText = 'Countries and Capitals Quiz';

    exitButton.classList.add('hide');
    document.getElementById('correct').innerText = 0;
    document.getElementById('incorrect').innerText = 0;

    //Prevent event stack by removing event listener
    nextButton.removeEventListener('click', returnToCategories)
}

//Allows user to return to the main menu at the end of the quiz
function lastQuestion() {
    nextButton.innerText ='Return to Main Menu';
    nextButton.classList.add('bold-large-button');
    nextButtonContainer.classList.remove('hide');
    nextButton.classList.remove('hide');
    nextButton.addEventListener('click', returnToCategories, {once:true});
}




//Clears classes and then adds either correct or wrong based on whether the answer is right.
function setStatusClass (element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

//removes any previous correct or wrong classes from a button
function clearStatusClass (element) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
    }


exitButton.addEventListener('click', () => {
    const confirmExit = confirm("Are you sure you want to exit the quiz?")
        if (confirmExit) {
        returnToCategories();
}});
