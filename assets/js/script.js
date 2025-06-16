const capitalsButton = document.getElementById("capitals-btn")
const countriesButton = document.getElementById("countries-btn")
const capitalsAnswerButtons = document.getElementById('capitals-answer-btn')
const capitalsQuestionContainer = document.getElementById('capitals-questions');
const countriesQuestions = document.getElementById('countries-answer-btn')
const title = document.querySelectorAll('h1')
const questionElement = document.getElementById('capitals-question-text');


const capitalsQuiz = [
    {question: 'Which of these is not a capital city in Europe?',
    answers:[
        {text: 'Zurich', correct: true},
        {text: 'Brussels', correct: false},
        {text: 'Lisbon', correct: false},
        {text: 'Belgrade', correct: false}
    ]
 }
]


const shuffledCapitalQuestions = capitalsQuiz.sort(() => Math.random() - 0.5)
 const currentCapitalsQuestionIndex = 0


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
    countriesQuestions.classList.remove('hide')

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

};

function setNextCapitalQuestion() {
    showCapitalsQuestion(shuffledCapitalQuestions[currentCapitalsQuestionIndex])

};

function showCapitalsQuestion(question) {
    questionElement.innerText = question.question;

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


function selectAnswer() {

};


