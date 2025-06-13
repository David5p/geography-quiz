const capitalsButton = document.getElementById("capitals-btn")
const countriesButton = document.getElementById("countries-btn")
const capitalsQuestions = document.getElementById('answer-btn')
const countriesQuestions = document.getElementById('answer-btn')
let title = document.querySelectorAll('h1')

capitalsButton.addEventListener('click', startCapitalsGame)
countriesButton.addEventListener('click', startCountriesGame)


function startCapitalsGame() {
    console.log('let the capitals games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    capitalsQuestions.classList.remove('hide')
   
   replaceTitle("capital");

}

function startCountriesGame() {
    console.log('let the countries games begin')
    document.getElementById('capitals-btn').style.display = 'none'
    document.getElementById('countries-btn').style.display = 'none'
    countriesQuestions.classList.remove('hide')

    replaceTitle("country");

}

 function replaceTitle(quizType) {
    const title = document.getElementsByTagName("h1")[0];  // Get the first <h1> element
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

};

function selectAnswer() {

};
