const capitalsButton = document.getElementById("capitals-btn")
const countriesButton = document.getElementById("countries-btn")
const nextButton = document.getElementById("next-btn")
const nextButtonContainer = document.getElementById('nxt-btn');
const capitalsAnswerButtons = document.getElementById('capitals-answer-btn')
const capitalsQuestionContainer = document.getElementById('capitals-questions');
const countriesQuestionContainer = document.getElementById('countries-questions');
const countriesAnswerButtons = document.getElementById('countries-answer-btn')
const title = document.querySelectorAll('h1')
const capitalsQuestionElement = document.getElementById('capitals-question-text');
const countriesQuestionElement = document.getElementById('countries-question-text');
const exitButton = document.getElementById('exit-btn')

let capitalsQuiz = [];

let countriesQuiz = [];

let quizType = null;


//Disable buttons 

capitalsButton.disabled = true;

countriesButton.disabled = true;

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

    shuffledCapitalQuestions = capitalsQuiz.sort(() => Math.random() - 0.5);

    shuffledCountriesQuestions = countriesQuiz.sort(() => Math.random() - 0.5);

    //Enable buttons
     capitalsButton.disabled = false;

    countriesButton.disabled = false;

  })

  .catch(err => console.error('Error loading questions:', err));


let shuffledCapitalQuestions = capitalsQuiz.sort(() => Math.random() - 0.5)
let currentCapitalsQuestionIndex = 0

let shuffledCountriesQuestions = countriesQuiz.sort(() => Math.random() - 0.5)
let currentCountriesQuestionIndex = 0

capitalsButton.addEventListener('click', startCapitalsGame)
countriesButton.addEventListener('click', startCountriesGame)

nextButton.addEventListener('click', () => {
     // Set the title text based on the quizType
    if (quizType === "capital") {
        currentCapitalsQuestionIndex ++
        setNextCapitalQuestion()
    } else if
        (quizType === "country")
        {currentCountriesQuestionIndex ++
        setNextCountryQuestion()
    }
  
})

// Allows the user to see the capitals questions
function startCapitalsGame() {
    quizType = "capital";
    console.log('let the capitals games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    capitalsQuestionContainer.classList.remove('hide');
    capitalsAnswerButtons.classList.remove('hide');
   
   replaceTitle("capital");

   setNextCapitalQuestion();

   exitButton.classList.remove('hide');

}

// Allows the user to see the countries questions
function startCountriesGame() {
    quizType = "country";
    console.log('let the countries games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    countriesQuestionContainer.classList.remove('hide');
    countriesAnswerButtons.classList.remove('hide');

    replaceTitle("country");

    setNextCountryQuestion();

    exitButton.classList.remove('hide');

}

// Makes the host page versatile by changing the title depending on the game choice chosen
 function replaceTitle(quizType) {
    const title = document.getElementsByTagName("h1")[0];  // Gets the first <h1> element
    const newTitle = document.createElement("h1");

    // Set the title text based on the quizType
    if (quizType === "capital") {
        newTitle.textContent = 'Capitals Quiz';
    } else if (quizType === "country") {
        newTitle.textContent = 'Country Quiz';
    } else {
        newTitle.textContent = 'Countrys and capitals Quiz'; // Default title if no valid type is provided
    }

    title.replaceWith(newTitle);
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
    capitalsQuestionElement.innerText = question.question;

    capitalsAnswerButtons.innerHTML = ''; // clear previous buttons

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'btn-primary', 'col-6', 'col-md-5');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        capitalsAnswerButtons.appendChild(button);
    });

    capitalsAnswerButtons.classList.remove('hide'); // show answer buttons
    capitalsQuestionContainer.classList.remove('hide'); // show question container
}

//Shows the countries questions and creates new answer buttons
function showCountriesQuestion(question) {
    countriesQuestionElement.innerHTML = question.question;

    countriesAnswerButtons.innerHTML = ''; // clear previous buttons

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'btn-primary', 'col-6', 'col-md-5');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        countriesAnswerButtons.appendChild(button);
    });

    countriesAnswerButtons.classList.remove('hide'); // show answer buttons
    countriesQuestionContainer.classList.remove('hide'); // show question container
}

//Resets the quiz after each question
function resetState() {
    nextButtonContainer.classList.add('hide');
     nextButton.classList.add('hide');
    
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
    Array.from(selectedButton.parentElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true;
    });

    // Show feedback to user
    if (correct) {
        alert("Well Done!");
    } else {
        const allButtons = Array.from(selectedButton.parentElement.children);
        const correctAnswer = allButtons.find(btn => btn.dataset.correct === "true");
        alert(`Unfortunately, you selected the wrong answer. The correct answer is: ${correctAnswer.innerText}`);
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

//Preparation to return the user at the end of the quiz to return to the main menu getting the next button ready
function backToMainMenu() {
    if (quizType === "capital") {
        if (shuffledCapitalQuestions.length > currentCapitalsQuestionIndex + 1) {
            nextButtonContainer.classList.remove('hide');
        } else {
            nextButton.innerText = 'Return to main menu';
            nextButton.style.background = 'blue';
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

    capitalsButton.style.display = 'inline-block';
    countriesButton.style.display = 'inline-block';

    nextButton.innerText = 'Next'; 
    nextButton.style.background = 'blue';
    nextButtonContainer.classList.add('hide');
    nextButton.classList.add('hide');

    const title = document.getElementsByTagName('h1') [0];
    title.innerText = 'Countries and Capitals Quiz';

    exitButton.classList.add('hide');

    //Prevent event stack by removing event listener
    nextButton.removeEventListener('click', returnToCategories)
}

//Allows user to return to the main menu at the end of the quiz
function lastQuestion() {
    nextButton.innerText ='Return to Main Menu';
    nextButton.style.background = 'blue';
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
