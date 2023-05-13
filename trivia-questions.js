import {questions as allQuestions} from '/questions.js';
// // Get references to relevant elements in the HTML document


// The key used to store the list of used questions in the local storage.
// This key is used to retrieve and store the list of questions that have been already used.
/* Example of the structure found at the "used-questions" local storage slot:
[
  "questionId1",
  "questionId2",
  "questionId3"
]
*/
const LS_USED_QUESTIONS = "used-questions";

// The key used to store the trivia scores in the local storage.
// This key is used to retrieve and store the scores awarded for each question.
// The scores are stored as an array of objects, where each object represents 
// a score and includes properties like question_id, team_name, and score.
/* Example of the structure found at the "trivia-scores" local storage slot:
[
  {
    question_id: "questionId1",
    team_name: "Team A",
    score: 200
  },
  {
    question_id: "questionId2",
    team_name: "Team B",
    score: 100
  },
  {
    question_id: "questionId3",
    team_name: "Team A",
    score: 300
  }
]
*/
const LS_TRIVIA_SCORES = "trivia-scores";

const QUESTION_TIME = 11; // time allocated per question
// dict to map category levels to levels of difficulty
const diffDict = {
  100: 1,
  200: 2,
  300: 3,
};

/**
 * Generates a question from the given category and difficulty level.
 *
 * @param {string} category - The category of the question.
 * @param {number} difficulty - The difficulty level of the question.
 * @returns {Object|null} The generated question object, or null if no more unused questions are available.
 */
function generateQuestion(category, difficulty) {
  // Retrieve the list of questions that have not been used yet from local storage
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS)) ||
    [];
  const questions = allQuestions.filter((q) => (
    q.category.trim() === category && q.difficulty === difficulty &&
    !usedQuestions.includes(q.id)
  ));

  // If there are no more unused questions matching the category and difficulty, return null
  if (questions.length === 0) {
    return null;
  }

  //   // Pick a random question from the list of matching questions
  //   const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[0];
  return selectedQuestion;
}

/**
 * Checks if there are any unused questions left for the given category and difficulty level.
 *
 * @param {string} category - The category to check.
 * @param {number} difficulty - The difficulty level to check.
 * @returns {boolean} Returns true if there are unused questions matching the category
 * and difficulty, otherwise false.
 */
function hasUnusedQuestions(category, difficulty) {
  // Retrieve the list of questions that have not been used yet from local storage
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS)) || [];
  const questions = allQuestions.filter((q) => (
    q.category.trim() === category && q.difficulty === difficulty &&
    !usedQuestions.includes(q.id)
  ));
  // If there are no more unused questions matching the category and difficulty, return false
  return questions.length > 0;
}

/**
 * Generates the category table dynamically based on the available categories and difficulty levels.
 */
function generateCategoryTable() {
  const categories = new Set(allQuestions.map(q => q.category));
  const table = document.createElement('table');
  table.id = 'table';

  // Create table headers
  const tableHeaders = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const category of categories) {
    const headerCell = document.createElement('th');
    headerCell.textContent = category;
    headerRow.appendChild(headerCell);
  }
  tableHeaders.appendChild(headerRow);
  table.appendChild(tableHeaders);

  // Create table rows
  const tableBody = document.createElement('tbody');
  for (const difficulty of Object.keys(diffDict)) {
    const row = document.createElement('tr');
    for (const category of categories) {
      const cell = createTableCell(category, difficulty);      
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);

   // Remove any existing table
   const categoryTable = document.getElementById('category-table');
   const existingTable = categoryTable.querySelector('table');
   if (existingTable) {
     existingTable.remove();
   }

  // Append table to category table div
  categoryTable.appendChild(table);
}

/**
 * Creates a table cell element for the given category and difficulty.
 *
 * @param {string} category - The category of the table cell.
 * @param {number} difficulty - The difficulty level of the table cell.
 * @returns {HTMLTableCellElement} The created table cell element.
 */
function createTableCell(category, difficulty) {
  const cell = document.createElement('td');
  const cellClass = `${category}-${difficulty}`.trim().replace(/\s/g, '_'); // class doesn't accept whitespaces
  cell.classList.add(cellClass);
  if (hasUnusedQuestions(category, diffDict[difficulty])) {
    cell.innerHTML = `<button class="btn">${difficulty}</button>`;
  } else {
    cell.textContent = 'CLOSED';
  }
  return cell;
}

/**
 * Displays the category table and handles the button actions.
 */
function showCategoryTable() {
  generateCategoryTable();
  const scores = getTeamScores();
  generateHorizontalScoreTable(scores);
  document.getElementById("category-table").style.display = "block";
  registerTableButtons();
}

function getTeamScores() {
  // Get the scores from local storage
  let scores = JSON.parse(localStorage.getItem('trivia-scores') || '[]');

  // Calculate the total score for each team
  let teamScores = {};
  for (let i = 0; i < scores.length; i++) {
    let teamName = scores[i].team_name;
    let questionScore = scores[i].score;
    if (teamScores[teamName]) {
      teamScores[teamName] += questionScore;
    } else {
      teamScores[teamName] = questionScore;
    }
  }

  return teamScores;
}

function generateHorizontalScoreTable(teamScores) {
  let sortedTeams = Object.keys(teamScores).sort(function(a, b) {
    return teamScores[b] - teamScores[a];
  });

  
  // Generate a row for each team with its score
  let scoreTable = document.getElementById('scoreboard');
  let tableBody = scoreTable.querySelector('tbody');
  let teamNameRow = document.createElement('tr');
  let teamScoreRow = document.createElement('tr');
  
  // Remove existing rows from the table
  tableBody.innerHTML = '';
  
  let teamNameHeader = document.createElement('th');
  teamNameHeader.innerHTML = 'Team Name';
  let teamScoreHeader = document.createElement('th');
  teamScoreHeader.innerHTML = 'Score';
  teamNameRow.appendChild(teamNameHeader);
  teamScoreRow.appendChild(teamScoreHeader);

  for (let i = 0; i < sortedTeams.length; i++) {
    let teamName = sortedTeams[i];
    let teamNameCell = document.createElement('td');
    teamNameCell.innerHTML = teamName;
    teamNameRow.appendChild(teamNameCell);

    let teamScoreCell = document.createElement('td');
    teamScoreCell.innerHTML = teamScores[teamName];
    teamScoreRow.appendChild(teamScoreCell);
  }
  console.log(scoreTable);
  tableBody.appendChild(teamNameRow);
  tableBody.appendChild(teamScoreRow);
}

/**
 * Registers click event listeners for the category table buttons.
 * Each registered event listener generates and displays a question
 * based on the selected category and difficulty.
 */
function registerTableButtons() {
  const buttons = document.querySelectorAll("td button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      let [category, difficulty] = button.parentElement.className.split("-");
      category = category.replace('_', " ");
      const question = generateQuestion(category, diffDict[difficulty]);
      if (question) {
        displayQuestion(question);
      } else {
        alert(`No questions available for ${category} - ${difficulty}`);
      }
    });
  });
}

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
              <button class="choice-item" id="choice-1">${question.choices[0]}</button>
              <button class="choice-item" id="choice-2">${question.choices[1]}</button>
              <button class="choice-item" id="choice-3">${question.choices[2]}</button>
              <button class="choice-item" id="choice-4">${question.choices[3]}</button>
          </ul>
      ` : ''}
      <div class="choice-button">
        ${!question.choices ? `<button class="btn grey-btn" id="correct-button">Correct</button>` : ''}
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
 * Starts the timer with the given time limit.
 * @param {number} timeLimit - The time limit for the timer.
 */
function startTimer(timeLimit) {
  // Display the timer
  const timerDiv = document.getElementById("timer");
  timerDiv.style.display = "block";
  let timerColor = "white";
  timerDiv.innerHTML = `<h2>Time remaining: <span style="color: ${timerColor};" id="time-remaining">${timeLimit}</span></h2>`;

  // Start the timer
  let timeRemaining = timeLimit;
  let intervalId = setInterval(() => {
    timeRemaining--;
    timerColor = "white";
    if (timeRemaining <= 10 && timeRemaining > 5) {
      timerColor = "red";
    } else if (timeRemaining <= 5) {
      timerDiv.classList.add("pulsate");
      timerColor = "red";
    }
    timerDiv.innerHTML = `<h2>Time remaining: <span style="color: ${timerColor};" id="time-remaining">${timeRemaining}</span></h2>`;
    if (timeRemaining === 0) {
      clearInterval(intervalId);
      timerDiv.innerHTML = "<h2>Time is UP!</h2>";
    }
  }, 1000);
}

/**
 * Displays the question and handles user interactions for answering the question.
 * @param {Object} question - The question object to display.
 */
function displayQuestion(question) {
  // Show the question and hide the table
  const questionDiv = document.getElementById("question");
  questionDiv.innerHTML = generateQuestionMarkup(question);

  if (question.choices) {
    addChoicesListeners(question);
  }

  document.getElementById("category-table").style.display = "none";
  questionDiv.style.display = "block";
  startTimer(QUESTION_TIME);

  const correctButton = document.querySelector("#correct-button");
  const goBackButton = document.querySelector("#go-back-button");
  const teamSelect = document.querySelector("#team-select");
  const teamOkButton = document.querySelector("#team-ok-button");

  // Add event listeners
  if (!question.choices) {
    correctButton.addEventListener("click", function (event) {
      showQuestionScoring();
    });
  }

  goBackButton.addEventListener("click", function (event) {
    document.getElementById("category-table").style.display = "block";
    questionDiv.style.display = "none";
  });

  // Add event listener for the OK button in the team selection dropdown
  // this will add the score
  teamOkButton.addEventListener("click", function (event) {
    if (teamSelect.value !== "None") {
      addScoreToLocalStorage(question, teamSelect.value);
    }
    // Add the question id to the used questions list and store it in local storage
    updateUsedQuestionsList(question);
    hideQuestion();
    // Show the answer and hide the question
    showAnswerDiv(question);
  });
}

/**
 * Adds the score for the question and team name to the local storage.
 * @param {object} question - The question object.
 * @param {string} teamName - The name of the team.
 */
function addScoreToLocalStorage(question, teamName) {
  let scores = JSON.parse(localStorage.getItem(LS_TRIVIA_SCORES) || "[]");
  let score = {
    question_id: question.id,
    team_name: teamName,
    score: question.difficulty * 100,
  };
  scores.push(score);
  localStorage.setItem(LS_TRIVIA_SCORES, JSON.stringify(scores));
}

/**
 * Updates the used questions list in the local storage with the given question ID.
 * @param {object} question - The question object.
 */
function updateUsedQuestionsList(question) {
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS) || "[]");
  usedQuestions.push(question.id);
  localStorage.setItem(LS_USED_QUESTIONS, JSON.stringify(usedQuestions));
}

/**
 * Hides the question and team selection div.
 */
function hideQuestion() {
  const teamSelectionDiv = document.querySelector(".team-selection");
  const questionDiv = document.getElementById("question");
  teamSelectionDiv.style.display = "none";
  questionDiv.style.display = "none";
}

/**
 * Displays the answer div with the answer for the given question.
 * @param {object} question - The question object.
 */
function showAnswerDiv(question) {
  const answerDiv = document.getElementById("answer");
  answerDiv.innerHTML = `
    <div class="answer-frame">
      <h1>The Answer is: ...</h1>
      <div class="answer-content">
        <p>${question.answer}!!</p>
        ${question.answerImage ? `<img src="${question.answerImage}"/>` : ''}
        <button class="continue-button">Continue</button>
      </div>
    </div>`;
  answerDiv.style.display = "block";

  const continueButton = document.querySelector(".continue-button");
  continueButton.addEventListener("click", function (event) {
    answerDiv.style.display = "none";
    showCategoryTable();
  });
}

/**
 * Displays the question scoring section.
 */
function showQuestionScoring() {
  const teamSelectionDiv = document.querySelector(".team-selection");
  teamSelectionDiv.style.display = "block";
    // Populate the team select dropdown with team names from local storage
    let teamNames = getTeamNames();
    populateTeamSelect(teamNames);
}

/**
 * Populates the team select dropdown with team names from the given array.
 * Also adds a "None" option to the team select dropdown that is used
 * when no team receives the score for the question.
 */
function populateTeamSelect(teamNames) {
  const teamSelect = document.querySelector("#team-select");
  for (const teamName of teamNames) {
    if (
      !Array.from(teamSelect.options).some((option) =>
        option.value === teamName
      )
    ) {
      let option = document.createElement("option");
      option.value = teamName;
      option.text = teamName;
      teamSelect.add(option);
    }
  }
  // create the None option
  let noneOption = document.createElement("option");
  noneOption.value = "None";
  noneOption.text = "None";
  teamSelect.add(noneOption);
}

/**
 * Adds click event listeners to the choice buttons for handling
 * user selection and displaying question scoring.
 *
 * @param {Object} question - The question object.
 */
function addChoicesListeners(question) {
  const choiceButtons = document.querySelectorAll(".choice-item");
  choiceButtons.forEach((button) => {
    const handleClick = () => {
      // if it is correct, turn green, if not, turn red.
      if (button.textContent === question.answer) {
        button.classList.add("correct-choice");
        showQuestionScoring();
      } else {
        button.classList.add("incorrect-choice");
      }
      button.removeEventListener("click", handleClick);
    }
    button.addEventListener("click", handleClick);
  })
}

/**
 * Retrieves the team names from the trivia scores in local storage.
 *
 * @returns {string[]} An array of team names.
 */
function getTeamNames() {
  let scores = JSON.parse(
    localStorage.getItem("trivia-scores") || "{}",
  );

  let teamNames = [];
  for (let i = 0; i < scores.length; i++) {
    let teamName = scores[i].team_name;
    if (!teamNames.includes(teamName)) {
      teamNames.push(teamName);
    }
  }
  return teamNames;
}

showCategoryTable();
