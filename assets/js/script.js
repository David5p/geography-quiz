const capitalsButton = document.getElementById("capitals-btn")
const countriesButton = document.getElementById("countries-btn")
const capitalsQuestions = document.getElementById('answer-btn')
const countriesQuestions = document.getElementById('answer-btn')
const title = document.querySelectorAll('h1')
const questionElement = document.getElementById('capitals-question')
const answerButtonsElement = document.getElementById('answer-button')

const shuffledCaptialQuestions, currentCapitalsQuestionIndex 


capitalsButton.addEventListener('click', startCapitalsGame)
countriesButton.addEventListener('click', startCountriesGame)


function startCapitalsGame() {
    console.log('let the capitals games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    shuffledCaptialQuestions = capitalsQuiz.sort(() => Math.random() - 0.5)
    currentCapitalsQuestionIndex = 0
    capitalsQuestions.classList.remove('hide')
   
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
    showQuestion(shuffledCaptialQuestions[currentQuestionIndex])

};

function showCapitalsQuestion (question)  {


}

function selectAnswer() {

};

const capitalsQuiz = [
    {question: 'Which of these is not a capital city in Europe?',
    answers:[
        {text: 'Zurich', correct: true},
        {text: 'Brussels', correct: false},
        {text: 'Lisbon', correct: false},
        {text: 'Brussels', correct: false}
    ]
 }
]
