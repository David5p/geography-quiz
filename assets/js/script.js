const capitalsButton = document.getElementById("capitals-btn")
const countriesButton = document.getElementById("countries-btn")
const capitalsAnswerButtons = document.getElementById('capitals-answer-btn')
const capitalsQuestionContainer = document.getElementById('capitals-questions');
const countriesQuestionContainer = document.getElementById('countries-questions');
const countriesAnswerButtons = document.getElementById('countries-answer-btn')
const title = document.querySelectorAll('h1')
const capitalsQuestionElement = document.getElementById('capitals-question-text');
const countriesQuestionElement = document.getElementById('countries-question-text');


let capitalsQuiz = [];

let countriesQuiz = [];


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


function startCapitalsGame() {
    console.log('let the capitals games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    capitalsQuestionContainer.classList.remove('hide');
    capitalsAnswerButtons.classList.remove('hide');
   
   replaceTitle("capital");

   setNextCapitalQuestion();

}

function startCountriesGame() {
    console.log('let the countries games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    countriesQuestionContainer.classList.remove('hide');
    countriesAnswerButtons.classList.remove('hide');

    replaceTitle("country");

    setNextCountryQuestion();

}

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



    function setNextCountryQuestion() {
    showCountriesQuestion(shuffledCountriesQuestions[currentCountriesQuestionIndex])


};

function setNextCapitalQuestion() {
    showCapitalsQuestion(shuffledCapitalQuestions[currentCapitalsQuestionIndex])

};

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




function selectAnswer() {

};


