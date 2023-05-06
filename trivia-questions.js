import {questions as allQuestions} from '/questions.js';
// // Get references to relevant elements in the HTML document

const LS_USED_QUESTIONS = "used-questions";
const LS_TRIVIA_SCORES = "trivia-scores";
const diffDict = {
  100: 1,
  200: 2,
  300: 3,
};

// Define a function to generate a random question from the given category and difficulty level
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

// Define a function to check if there are any unused questions left for the given category and difficulty level
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

function createTableCell(category, difficulty) {
  const cell = document.createElement('td');
  const cellClass = `${category}-${difficulty}`.trim().replace(/\s/g, '_'); // class doesn't accept whitespaces
  cell.classList.add(cellClass);
  if (hasUnusedQuestions(category, diffDict[difficulty])) {
    cell.innerHTML = `<button>${difficulty}</button>`;
  } else {
    cell.textContent = 'CLOSED';
  }
  return cell;
}

function showCategoryTable() {
  generateCategoryTable();
  document.getElementById("category-table").style.display = "block";
  registerTableButtons();
}

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

function displayQuestion(question) {
  // Show the question and hide the table
  const questionDiv = document.getElementById("question");
  questionDiv.innerHTML = `<div class="question-frame">
  <h1>The Category is: ${question.category}</h1>
  <div class="question-content">
      <h2>${question.question}</h2>
      ${question.image ? `<img class="question-image" src="${question.image}">` : ''}
      ${question.choices ? `
          <ul class="choice-list">
              <li class="choice-item">${question.choices[0]}</li>
              <li class="choice-item">${question.choices[1]}</li>
              <li class="choice-item">${question.choices[2]}</li>
              <li class="choice-item">${question.choices[3]}</li>
          </ul>
      ` : ''}
      <div class="choice-button">
      <button class="correct-button">Correct</button>
      <button class="go-back-button">Back</button>
      </div>
      <div class="team-selection" style="display: none;">
      <label for="team-select">Select team:</label>
      <select class="team-select"></select>
      <button class="team-ok-button">OK</button>
      </div>
  </div>
  </div>`;


  document.getElementById("category-table").style.display = "none";
  questionDiv.style.display = "block";

  const correctButton = document.querySelector(".correct-button");
  const goBackButton = document.querySelector(".go-back-button");
  const teamSelectionDiv = document.querySelector(".team-selection");
  const teamSelect = document.querySelector(".team-select");
  const teamOkButton = document.querySelector(".team-ok-button");

  // Add event listeners
  correctButton.addEventListener("click", function (event) {
    teamSelectionDiv.style.display = "block";

    // Populate the team select dropdown with team names from local storage
    let teamNames = getTeamNames();
    console.log(`team names are ${teamNames}`);
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
  });

  goBackButton.addEventListener("click", function (event) {
    document.getElementById("category-table").style.display = "block";
    questionDiv.style.display = "none";
  });

  // Add event listener for the OK button in the team selection dropdown
  // this will add the score
  teamOkButton.addEventListener("click", function (event) {
    if (teamSelect.value !== "None") {
      let teamName = teamSelect.value;
      let scores = JSON.parse(
        localStorage.getItem(LS_TRIVIA_SCORES) || "[]",
      );
      let score = {
        question_id: question.id,
        team_name: teamName,
        score: question.difficulty * 100, // Replace with the actual score awarded for a correct answer
      };
      scores.push(score);
      localStorage.setItem(LS_TRIVIA_SCORES, JSON.stringify(scores));
    }

    // Add the question id to the used questions list and store it in local storage
    const usedQuestions =
      JSON.parse(localStorage.getItem(LS_USED_QUESTIONS)) || [];
    usedQuestions.push(question.id);
    localStorage.setItem(LS_USED_QUESTIONS, JSON.stringify(usedQuestions));

    teamSelectionDiv.style.display = "none";
    questionDiv.style.display = "none";
    // Show the answer and hide the question
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
    })

  });
}

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
