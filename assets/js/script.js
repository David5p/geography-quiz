/* jshint esversion: 11 */

// Shared variables which need to be kept global for multiple functions to access them
let shuffledCapitalQuestions = [];
let shuffledCountriesQuestions = [];
let capitalsQuiz = [];
let countriesQuiz = [];
let quizType = null;
let currentCapitalsQuestionIndex = 0;
let currentCountriesQuestionIndex = 0;
let timerInterval = null;
//Time for each question
let timeLeft = 20;
//Create variable to help quiz flow
let feedbackTimeout = null;

//Buttons that are accessed globally and used in many functions
const capitalsButton = document.getElementById('capitals-btn');
const countriesButton = document.getElementById('countries-btn');
const nextButton = document.getElementById('next-btn');
const nextButtonContainer = document.getElementById('nxt-btn');
const exitButton = document.getElementById('exit-btn');
const scoreArea = document.getElementById('score-area');

// Attach the exit button listener once
exitButton.addEventListener('click', handleExitClick);

nextButton.addEventListener('click', () => {
  if (nextButton.innerText === 'Return to Main Menu') {
    returnToCategories();
  } else {
    handleNextButtonClick();
  }
});

//Disable buttons
capitalsButton.disabled = true;

countriesButton.disabled = true;

// Load questions from JSON and initialize quizzes
fetch('assets/questions.json')
  .then((response) => response.json())
  .then((data) => {
    // Transform JSON into the format for the quiz
    capitalsQuiz = data.capitalsQuestions.map((q) => ({
      question: q.question,
      answers: q.options.map((option) => ({
        text: option,
        correct: option === q.answer,
      })),
    }));

    countriesQuiz = data.countriesQuestions.map((q) => ({
      question: q.question,

      answers: q.options.map((option) => ({
        text: option,
        correct: option === q.answer,
      })),
    }));

    // Questions shuffle after loading.
    //Credit: Web Dev Simplified for shuffling code. See Read Me for more details.
    shuffledCapitalQuestions = [...capitalsQuiz].sort(() => Math.random() - 0.5);
    shuffledCountriesQuestions = [...countriesQuiz].sort(() => Math.random() - 0.5);

    //Enable buttons
    capitalsButton.disabled = false;

    countriesButton.disabled = false;
  })
  .catch((err) => console.error('Error loading questions:', err));

/**
 * Allows user to return to the main menu at any point during the quiz
 */
function handleExitClick() {
  // Cancel any pending feedback timeout to avoid delayed UI changes
  clearTimeout(feedbackTimeout);
  feedbackTimeout = null;
  returnToCategories();
}

// Event listeners
capitalsButton.addEventListener('click', startCapitalsGame);
countriesButton.addEventListener('click', startCountriesGame);

/**
 *Allows the user to see the capitals questions
 */
// Credit: Web Dev Simplified for display none and remove hide class. See Read Me for more details.
function startCapitalsGame() {
  quizType = 'capital';
  currentCapitalsQuestionIndex = 0;
  shuffledCapitalQuestions = [...capitalsQuiz].sort(() => Math.random() - 0.5).slice(0, 10);

  //Hides menu buttons on quiz start and shows question and answer buttons
  capitalsButton.style.display = 'none';
  countriesButton.style.display = 'none';

  const capitalsQuestionContainer = document.getElementById('capitals-questions');
  const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');
  capitalsQuestionContainer.classList.remove('hide');
  capitalsAnswerButtons.classList.remove('hide');
  scoreArea.classList.remove('hide');

  replaceTitle('capital');
  setNextCapitalQuestion();

  //Moves user to question when the quiz starts
  setTimeout(() => {
    const capQuestionText = document.getElementById('capitals-question-text');
    if (capQuestionText) {
      capQuestionText.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, 100);

  showExitButton();
}

/**
 * Iniates 20 second countdown for each question
 */
function startTimer() {
  timeLeft = 20;
  const timerDisplay = document.getElementById('timer-seconds');
  if (timerDisplay) {
    timerDisplay.innerText = timeLeft;
  }
  // Clear any existing time left on timer
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerDisplay) {
      timerDisplay.innerText = timeLeft;
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

/**
 * Stops the timer after each question
 */
function stopTimer() {
  clearInterval(timerInterval);
}

/**
 * If the timer runs out the user will receive feedback.
 * Move onto the next question after 6 seconds.
 */
function handleTimeOut() {
  const questionTextElement = quizType === 'capital' ? document.getElementById('capitals-question-text') : document.getElementById('countries-question-text');
  const answerButtons = quizType === 'capital' ? document.getElementById('capitals-answer-btn') : document.getElementById('countries-answer-btn');
  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
  });
  const correctButton = Array.from(answerButtons.children).find((btn) => btn.dataset.correct === 'true');
  questionTextElement.innerHTML = `Time's up! The correct answer is: ${correctButton.innerHTML}`;
  questionTextElement.classList.add('incorrect-feedback');

  incrementWrongAnswer();
  showNextButton();

  //Automate progress to next question after 6 seconds
  feedbackTimeout = setTimeout(() => {
    handleNextButtonClick();
  }, 6000);
  scheduleAutoAdvance();
}

/**
 * Allows the user to see the countries questions
 */
// Credit: Web Dev Simplified for display none and remove hide class. See Read Me for more details.
function startCountriesGame() {
  quizType = 'country';
  currentCountriesQuestionIndex = 0;
  shuffledCountriesQuestions = [...countriesQuiz].sort(() => Math.random() - 0.5).slice(0, 10);

  // Hides menu buttons and shows question and answer buttons
  capitalsButton.style.display = 'none';
  countriesButton.style.display = 'none';

  const countriesQuestionContainer = document.getElementById('countries-questions');
  const countriesAnswerButtons = document.getElementById('countries-answer-btn');
  countriesQuestionContainer.classList.remove('hide');
  countriesAnswerButtons.classList.remove('hide');
  scoreArea.classList.remove('hide');

  replaceTitle('country');
  setNextCountryQuestion();

  //Ensures user's screen moves to the question once quiz starts
  setTimeout(() => {
    const countQuestionText = document.getElementById('countries-question-text');
    if (countQuestionText) {
      countQuestionText.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, 100);

  showExitButton();
}

/**
 * Makes the host page versatile by changing the title depending on the game choice chosen
 */
function replaceTitle(type) {
  const oldTitle = document.getElementsByTagName('h1')[0];
  const newTitle = document.createElement('h1');
  if (type === 'capital') {
    newTitle.textContent = 'Capitals Quiz';
  } else if (type === 'country') {
    newTitle.textContent = 'Countries Quiz';
  } else {
    newTitle.textContent = 'Countries and Capitals Quiz';
  }
  oldTitle.replaceWith(newTitle);
}

/**
 * Handle next button click for both quizzes so no need for function in event listener
 */
function handleNextButtonClick() {
  // Cancel pending auto-next
  clearTimeout(feedbackTimeout);
  feedbackTimeout = null;
  if (quizType === 'capital') {
    if (currentCapitalsQuestionIndex < shuffledCapitalQuestions.length - 1) {
      currentCapitalsQuestionIndex++;
      setNextCapitalQuestion();
    } else {
      lastQuestion();
    }
  } else if (quizType === 'country') {
    if (currentCountriesQuestionIndex < shuffledCountriesQuestions.length - 1) {
      currentCountriesQuestionIndex++;
      setNextCountryQuestion();
    } else {
      lastQuestion();
    }
  }
}
/**
 * Sets certain words in the question to bold.
 */
function boldWords(text) {
  // Credit: https://stackoverflow.com/questions/68994961/how-can-i-make-a-certain-word-bold-in-javascript
  const wordsToBold = ['not', 'one'];

  wordsToBold.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Will bold desired words
    text = text.replace(regex, `<strong>${word}</strong>`);
  });

  return text;
}

/**
 * Makes the countries quiz flow from one question to another
 */
function setNextCountryQuestion() {
  resetState();
  showCountriesQuestion(shuffledCountriesQuestions[currentCountriesQuestionIndex]);
}

/**
 * Makes the capitals quiz flow from one question to another
 */
// Credit: Web Dev Simplified for including this in the function structure. See Read Me for more details.
function setNextCapitalQuestion() {
  resetState();
  showCapitalsQuestion(shuffledCapitalQuestions[currentCapitalsQuestionIndex]);
}

/**
 * Shows the capitals questions and creates new answer buttons
 */
// Credit: Web Dev Simplified for including this in the function structure. See Read Me for more details.
function showCapitalsQuestion(question) {
  if (!question) {
    console.log('Error! Attempted to show capitals question but returned undefined');
    alert('Oops! There are no more questions.');
    returnToCategories();
    return;
  }

  const capitalsQuestionElement = document.getElementById('capitals-question-text');
  const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');

  capitalsQuestionElement.innerHTML = boldWords(question.question);

  // Clear any previous feedback styles
  capitalsQuestionElement.classList.remove('correct-feedback', 'incorrect-feedback');

  // clear previous buttons. Credit Web Dev Simplified. See Read Me for more details
  capitalsAnswerButtons.innerHTML = '';
  question.answers.forEach((answer) => {
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

  // Create and append mini timer "button"
  const timerButton = document.createElement('span');
  timerButton.id = 'question-timer';
  timerButton.classList.add('timer-button');
  timerButton.innerHTML = `<span id="timer-seconds">${timeLeft}</span>`;
  capitalsAnswerButtons.appendChild(timerButton);
  startTimer();
}

/*
 * Shows the countries questions and creates new answer buttons
 */
function showCountriesQuestion(question) {
  if (!question) {
    console.log('Error! Attempted to show countries question but returned undefined');
    alert('Oops! There are no more questions.');
    returnToCategories();
    return;
  }

  const countriesQuestionElement = document.getElementById('countries-question-text');
  const countriesAnswerButtons = document.getElementById('countries-answer-btn');

  countriesQuestionElement.innerHTML = boldWords(question.question);
  // Clear any previous feedback styles
  countriesQuestionElement.classList.remove('correct-feedback', 'incorrect-feedback');
  // clear previous buttons
  countriesAnswerButtons.innerHTML = '';

  // Credit Web Dev Simplified. See Read Me for more details
  question.answers.forEach((answer) => {
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

  // Create and append mini timer "button"
  const timerButton = document.createElement('span');
  timerButton.id = 'question-timer';
  timerButton.classList.add('timer-button');
  timerButton.innerHTML = `<span id="timer-seconds">${timeLeft}</span>`;
  countriesAnswerButtons.appendChild(timerButton);
  startTimer();
}

/**
 * Resets the quiz after each question. Credit Web Dev Simplified. See Read Me for more details
 */
function resetState() {
  nextButtonContainer.classList.add('hide');
  nextButton.classList.add('hide');
  const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');
  const countriesAnswerButtons = document.getElementById('countries-answer-btn');
  //Clear answer buttons
  while (capitalsAnswerButtons.firstChild) {
    capitalsAnswerButtons.removeChild(capitalsAnswerButtons.firstChild);
  }
  while (countriesAnswerButtons.firstChild) {
    countriesAnswerButtons.removeChild(countriesAnswerButtons.firstChild);
  }

  //Resets question background
  const capitalsText = document.getElementById('capitals-question-text');
  const countriesText = document.getElementById('countries-question-text');

  capitalsText?.classList.remove('correct-feedback', 'wrong-feedback');
  countriesText?.classList.remove('correct-feedback', 'wrong-feedback');
  //Timer restarts after each question
  const timerDisplay = document.getElementById('timer-seconds');
  if (timerDisplay) {
    timerDisplay.innerText = '';
  }
}

/**
 * Recognises correct answer and provides user with feedback
 */
function selectAnswer(e) {
  //When user answers the timer is stopped
  stopTimer();

  //Hides timer after each question
  const timerElement = document.getElementById('question-timer');
  if (timerElement) {
    timerElement.remove();
  }

  // Credit Web Dev Simplified. See Read Me for more details
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';

  // Mark all buttons and disable them
  const parent = selectedButton.parentElement;
  Array.from(parent.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === 'true');
    button.disabled = true;
  });

  // Show feedback to user
  const questionTextElement = quizType === 'capital' ? document.getElementById('capitals-question-text') : document.getElementById('countries-question-text');

  //Reset background
  questionTextElement.classList.remove('correct-feedback', 'wrong-feedback');

  if (correct) {
    questionTextElement.innerHTML = "<strong>Well Done!</strong> That's the correct answer.";
    questionTextElement.classList.add('correct-feedback');
    incrementScore();
  } else {
    const correctButton = Array.from(parent.children).find((btn) => btn.dataset.correct === 'true');
    questionTextElement.innerHTML = `Unfortunately, you selected the wrong answer. The correct answer is: ${correctButton.innerText}`;
    questionTextElement.classList.add('incorrect-feedback');
    incrementWrongAnswer();
  }

  //Determine to show the next question or button to return to the main menu
  if (quizType === 'capital') {
    if (shuffledCapitalQuestions.length > currentCapitalsQuestionIndex + 1) {
      nextButton.innerText = 'Next';
      nextButton.style.background = '#00008B';
      nextButton.classList.remove('hide');
      nextButtonContainer.classList.remove('hide');
    } else {
      // Delay showing final message to let feedback show first
      feedbackTimeout = setTimeout(() => {
        lastQuestion();
      }, 2000);
    }
  } else if (quizType === 'country') {
    if (shuffledCountriesQuestions.length > currentCountriesQuestionIndex + 1) {
      nextButton.innerText = 'Next';
      nextButton.style.background = '#00008B';
      nextButton.classList.remove('hide');
      nextButtonContainer.classList.remove('hide');
    } else {
      // Delay showing final message to let feedback show first
      feedbackTimeout = setTimeout(() => {
        lastQuestion();
      }, 2000);
    }
  }
  //Automate progress to next question after 6 seconds
  feedbackTimeout = setTimeout(() => {
    handleNextButtonClick();
  }, 6000);
  scheduleAutoAdvance();
}

/**
 * Reveal next button with custom styles added
 */
function showNextButton() {
  nextButton.innerText = 'Next';
  nextButton.style.background = '#00008B';
  nextButton.classList.remove('hide');
  nextButtonContainer.classList.remove('hide');
}

/**
 * Allow quiz to flow with 6 second wait period before quiz advances to the next question
 */
function scheduleAutoAdvance() {
  clearTimeout(feedbackTimeout); // Ensure no double-timeouts
  feedbackTimeout = setTimeout(() => {
    handleNextButtonClick();
  }, 6000);
}

/**
 * Gets the current score from the DOM and increments it by 1
 */
function incrementScore() {
  try {
    const correctElement = document.getElementById('correct');
    if (!correctElement) throw new Error('Element with ID correct cannot be found.');
    //function to increment score taken from the Love Maths Project
    let oldScore = parseInt(correctElement.innerText);
    if (isNaN(oldScore)) throw new Error("'correct' innertext is not a number");

    correctElement.innerText = ++oldScore;
  } catch (error) {
    console.log('Error incrementing score:', error);
    alert('Something went wrong while updating your correct answer score');
  }
}

/**
 * Gets the current score of incorrect answers from the DOM and increments it by 1
 */
function incrementWrongAnswer() {
  try {
    const incorrectElement = document.getElementById('incorrect');
    if (!incorrectElement) throw new Error('Element with ID incorrect cannot be found');
    //function to increment wrong answer score taken from the Love Maths Project
    let oldScore = parseInt(incorrectElement.innerText);
    if (isNaN(oldScore)) throw new Error("'incorrect' innertext is not a number");

    incorrectElement.innerText = ++oldScore;
  } catch (error) {
    console.log('Error incrementing incorrect answers', error);
    alert('Something went wrong while updating your incorrect answer score');
  }
}

/**
 * Preparation to return the user at the end of the quiz to return to the main menu getting the next button ready
 * Resets the quiz ui and state. Returns quiz to page user sees when they arrive at the website
 * Return to main menu UI and reset states
 */
function returnToCategories() {
  quizType = null;
  currentCapitalsQuestionIndex = 0;
  currentCountriesQuestionIndex = 0;

  document.getElementById('capitals-questions').classList.add('hide');
  document.getElementById('countries-questions').classList.add('hide');
  document.getElementById('capitals-answer-btn').classList.add('hide');
  document.getElementById('countries-answer-btn').classList.add('hide');
  scoreArea.classList.add('hide');

  capitalsButton.style.display = 'inline-block';
  countriesButton.style.display = 'inline-block';

  nextButton.classList.remove('bold-large-button');
  nextButton.innerText = 'Next';
  nextButton.style.background = 'blue';
  nextButtonContainer.classList.add('hide');
  nextButton.classList.add('hide');

  const title = document.getElementsByTagName('h1')[0];
  title.innerText = 'Countries and Capitals Quiz';

  exitButton.classList.add('hide');

  document.getElementById('correct').innerText = 0;
  document.getElementById('incorrect').innerText = 0;
}

/**
 * Allows user to return to the main menu at the end of the quiz
 */
function lastQuestion() {
  // Prevent function running if quiz was exited early
  if (!quizType) return;

  nextButton.innerText = 'Return to Main Menu';
  nextButton.classList.add('bold-large-button');
  nextButtonContainer.classList.remove('hide');
  nextButton.classList.remove('hide');

  const questionTextElement = quizType === 'capital' ? document.getElementById('capitals-question-text') : document.getElementById('countries-question-text');

  const countriesAnswerButtons = document.getElementById('countries-answer-btn');
  const capitalsAnswerButtons = document.getElementById('capitals-answer-btn');
  //Show message to let user know the quiz has ended
  capitalsAnswerButtons.classList.add('hide');
  countriesAnswerButtons.classList.add('hide');
  exitButton.classList.add('hide');
  questionTextElement.innerHTML = 'Well Done! The quiz is now finished! Click <strong>Return to Main Menu</strong> below to choose another quiz.';
  questionTextElement.classList.remove('correct-feedback', 'incorrect-feedback');
  questionTextElement.classList.add('final-feedback');
}

/**
 * Clears classes and then adds either correct or wrong based on whether the answer is right.
 */
// Credit Web Dev Simplified. See Read Me for more details
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

/**
 * Removes any previous correct or wrong classes from a button
 */
// Credit Web Dev Simplified. See Read Me for more details
function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

/**
 * Shows exit button
 */
function showExitButton() {
  exitButton.classList.remove('hide');
}
