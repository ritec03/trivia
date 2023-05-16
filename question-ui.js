import {
  getTeamNames, addScoreToLocalStorage, updateUsedQuestionsList, updateState,
  updateClickedChoiceList,
  getClickedChoiceList,
  calculateRemainingSeconds,
  getQuestionTimestamp,
} from './question-logic.js';

const QUESTION_TIME = 11; // time allocated per question

/**
 * Generates the markup for displaying the question.
 * @param {object} question - The question object.
 * @returns {string} The generated markup for the question.
 */
function generateQuestionMarkup(question) {
  const markup = `<div class="question-frame">
    <h1>The Category is: ${question.category}</h1> 
    <div class="question-content">
        <h2>${question.question}</h2>
        <div id="timer" style="display: none"></div>
        ${question.image ? `<img class="question-image" src="${question.image}">` : ''}
        ${question.choices ? `
            <ul class="choice-list">
                <button class="choice-item" id="choice-0">${question.choices[0]}</button>
                <button class="choice-item" id="choice-1">${question.choices[1]}</button>
                <button class="choice-item" id="choice-2">${question.choices[2]}</button>
                <button class="choice-item" id="choice-3">${question.choices[3]}</button>
            </ul>
        ` : ''}
        <div class="choice-button">
          ${!question.choices ? '<button class="btn grey-btn" id="correct-button">Correct</button>' : ''}
          <button class="btn grey-btn" id="go-back-button">Back</button>
        </div>
        <div class="team-selection" style="display: none;">
          <label for="team-select">Select team to award points to:</label>
          <select id="team-select"></select>
          <button class="btn grey-btn" id="team-ok-button">OK</button>
        </div>
    </div>
    </div>`;

  return markup;
}

/**
 * Sets the font color for the timer based on the remaining time.
 * @param {number} timeRemaining - The remaining time in seconds.
 * @returns {string} The color code for the timer font.
 */
function setTimerFontColor(timeRemaining) {
  let timeColor;
  if (timeRemaining <= 10 && timeRemaining > 5) {
    timeColor = 'red';
  } else if (timeRemaining <= 5 && timeRemaining > 0) {
    timeColor = 'red';
  } else {
    timeColor = 'white';
  }
  return timeColor;
}

/**
 * Generates the timer display based on the remaining time.
 * @param {number} timeRemaining - The remaining time in seconds.
 */
function generateTimerDiv(timeRemaining) {
  const timerDiv = document.getElementById('timer');
  const timerColor = setTimerFontColor(timeRemaining);
  if (timeRemaining > 0) {
    timerDiv.innerHTML = `<h2>Time remaining: <span style="color: ${timerColor};" id="time-remaining">${timeRemaining}</span></h2>`;
    if (timeRemaining <= 5 && timeRemaining > 0) {
      timerDiv.classList.add('pulsate');
    }
  } else {
    timerDiv.innerHTML = '<h2>Time is UP!</h2>';
  }
  timerDiv.style.display = 'block';
}

/**
 * Starts the timer with the specified initial timestamp and time limit.
 * The timer goes from current time until timestamp+timelimit time unless
 * time is up, in which case the timer shows "Time is up!".
 * @param {number} initialTimestamp - The initial timestamp in milliseconds.
 * @param {number} timeLimitSeconds - The time limit in seconds.
 */
function startTimer(initialTimestamp, timeLimitSeconds) {
  let timeRemaining = calculateRemainingSeconds(initialTimestamp, timeLimitSeconds);
  generateTimerDiv(timeRemaining);

  const intervalId = setInterval(() => {
    timeRemaining -= 1;
    generateTimerDiv(timeRemaining);
    if (timeRemaining <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);
}

/**
 * Populates the team select dropdown with team names from the given array.
 * Also adds a "None" option to the team select dropdown that is used
 * when no team receives the score for the question.
 */
function populateTeamSelect(teamNames) {
  const teamSelect = document.querySelector('#team-select');
  teamNames.forEach((teamName) => {
    if (
      !Array.from(teamSelect.options).some((option) => option.value === teamName)
    ) {
      const option = document.createElement('option');
      option.value = teamName;
      option.text = teamName;
      teamSelect.add(option);
    }
  });
  // create the None option
  const noneOption = document.createElement('option');
  noneOption.value = 'None';
  noneOption.text = 'None';
  teamSelect.add(noneOption);
}

/**
 * Displays the question scoring section.
 */
function showQuestionScoring() {
  const teamSelectionDiv = document.querySelector('.team-selection');
  teamSelectionDiv.style.display = 'block';
  // Populate the team select dropdown with team names from local storage
  const teamNames = getTeamNames();
  populateTeamSelect(teamNames);
}

/**
 * Adds click event listeners to the choice buttons for handling
 * user selection and displaying question scoring.
 *
 * @param {Object} question - The question object.
 */
function addChoicesListeners(question) {
  const choiceButtons = document.querySelectorAll('.choice-item');
  choiceButtons.forEach((button) => {
    const handleClick = () => {
      updateClickedChoiceList(button.id.split('-')[1]);
      console.log(`Adding the following index ${button.id.split('-')[1]}`);
      // if it is correct, turn green, if not, turn red.
      if (button.textContent === question.answer) {
        button.classList.add('correct-choice');
        updateState(question.id, 'scoring');
        showQuestionScoring();
      } else {
        button.classList.add('incorrect-choice');
      }
      button.removeEventListener('click', handleClick);
    };
    button.addEventListener('click', handleClick);
  });
}

function displaySelectedChoices(question) {
  const choiceList = getClickedChoiceList();
  if (!choiceList) {
    return;
  }
  const choiceButtons = document.querySelectorAll('.choice-item');
  choiceButtons.forEach((button) => {
    if (button.textContent === question.answer && choiceList.includes(button.id.split('-')[1])) {
      button.classList.add('correct-choice');
    } else if (button.textContent !== question.answer && choiceList.includes(button.id.split('-')[1])) {
      button.classList.add('incorrect-choice');
    }
  });
}

/**
 * Hides the question and team selection div.
 */
function hideQuestion() {
  const teamSelectionDiv = document.querySelector('.team-selection');
  const questionDiv = document.getElementById('question');
  teamSelectionDiv.style.display = 'none';
  questionDiv.style.display = 'none';
}

/**
 * Displays the answer div with the answer for the given question.
 * @param {object} question - The question object.
 * @param {function} goBackCallback - Callback to return from the question
 * to the main table
 */
export function showAnswerDiv(question, goBackCallback) {
  const answerDiv = document.getElementById('answer');
  answerDiv.innerHTML = `
      <div class="answer-frame">
        <h1>The Answer is: ...</h1>
        <div class="answer-content">
          <p>${question.answer}!!</p>
          ${question.answerImage ? `<img src="${question.answerImage}"/>` : ''}
          <button class="continue-button">Continue</button>
        </div>
      </div>`;
  answerDiv.style.display = 'block';

  const continueButton = document.querySelector('.continue-button');
  continueButton.addEventListener('click', () => {
    updateState(null, 'none');
    answerDiv.style.display = 'none';
    goBackCallback();
  });
}

/**
 * Displays the question and handles user interactions for answering the question.
 * @param {Object} question - The question object to display.
 * @param {function} goBackCallback - Callback to return from the question
 * to the main table
 */
export function displayQuestion(question, goBackCallback) {
  // Show the question and hide the table
  const questionDiv = document.getElementById('question');
  questionDiv.innerHTML = generateQuestionMarkup(question);

  if (question.choices) {
    addChoicesListeners(question);
  }
  questionDiv.style.display = 'block';
  const questionStartTime = getQuestionTimestamp();
  startTimer(questionStartTime, QUESTION_TIME);

  const correctButton = document.querySelector('#correct-button');
  const goBackButton = document.querySelector('#go-back-button');
  const teamSelect = document.querySelector('#team-select');
  const teamOkButton = document.querySelector('#team-ok-button');

  // Add event listeners
  if (!question.choices) {
    correctButton.addEventListener('click', () => {
      updateState(question.id, 'scoring');
      showQuestionScoring();
    });
  }

  goBackButton.addEventListener('click', () => {
    updateState(null, 'none');
    goBackCallback();
    questionDiv.style.display = 'none';
  });

  // Add event listener for the OK button in the team selection dropdown
  // this will add the score
  teamOkButton.addEventListener('click', () => {
    addScoreToLocalStorage(question, teamSelect.value);
    // Add the question id to the used questions list and store it in local storage
    updateUsedQuestionsList(question);
    // Show the answer and hide the question
    updateState(question.id, 'answer');
    hideQuestion();
    showAnswerDiv(question, goBackCallback);
  });
}

/**
 * Displays the question without scoring options.
 * @param {object} question - The question object.
 * @param {function} goBackCallback - The callback function to handle "Go Back" action.
 */
export function displayQuestionWithoutScoring(question, goBackCallback) {
  displayQuestion(question, goBackCallback);
  displaySelectedChoices(question);
}

/**
 * Displays the question with scoring options.
 * @param {object} question - The question object.
 * @param {function} goBackCallback - The callback function to handle "Go Back" action.
 */
export function displayQuestionWithScoring(question, goBackCallback) {
  displayQuestionWithoutScoring(question, goBackCallback);
  showQuestionScoring();
}
