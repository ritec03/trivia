import { displayQuestion } from './question-ui.js';
import {
  hasUnusedQuestions, generateQuestion, getTeamScores, getLastScoredTeam, getCategories,
} from './trivia-table-logic.js';
import {
  updateState,
} from './question-logic.js';

// // Get references to relevant elements in the HTML document

// dict to map category levels to levels of difficulty
const diffDict = {
  100: 1,
  200: 2,
  300: 3,
};

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
 * Generates the category table dynamically based on the available categories and difficulty levels.
 */
export function generateCategoryTable() {
  const categories = getCategories();
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

function makeLastScorerPuslate(lastScoredTeamDiv) {
  let timeRemaining = 4;

  const intervalId = setInterval(() => {
    timeRemaining -= 1;
    lastScoredTeamDiv.querySelector('span').classList.add('pulsate');

    if (timeRemaining === 0) {
      clearInterval(intervalId);
      lastScoredTeamDiv.querySelector('span').classList.remove('pulsate');
    }
  }, 1000);
}

function generateHorizontalScoreTable(teamScores) {
  const sortedTeams = Object.keys(teamScores).sort((a, b) => teamScores[b] - teamScores[a]);

  const lastScoredTeam = getLastScoredTeam();
  let lastScoredTeamDiv;

  // Generate a row for each team with its score
  const scoreTable = document.getElementById('scoreboard');
  const tableBody = scoreTable.querySelector('tbody');
  const teamNameRow = document.createElement('tr');
  const teamScoreRow = document.createElement('tr');

  // Remove existing rows from the table
  tableBody.innerHTML = '';

  const teamNameHeader = document.createElement('th');
  teamNameHeader.innerHTML = 'Team Name';
  const teamScoreHeader = document.createElement('th');
  teamScoreHeader.innerHTML = 'Score';
  teamNameRow.appendChild(teamNameHeader);
  teamScoreRow.appendChild(teamScoreHeader);

  for (let i = 0; i < sortedTeams.length; i += 1) {
    const teamName = sortedTeams[i];
    const teamNameCell = document.createElement('td');
    teamNameCell.innerHTML = teamName;
    teamNameRow.appendChild(teamNameCell);

    const teamScoreCell = document.createElement('td');
    teamScoreCell.innerHTML = `<span>${teamScores[teamName]}</span>`;
    teamScoreRow.appendChild(teamScoreCell);

    if (lastScoredTeam === teamName) {
      lastScoredTeamDiv = teamScoreCell;
    }
  }
  tableBody.appendChild(teamNameRow);
  tableBody.appendChild(teamScoreRow);
  makeLastScorerPuslate(lastScoredTeamDiv);
  scoreTable.style.display = 'block';
}

/**
 * Registers click event listeners for the category table buttons.
 * Each registered event listener generates and displays a question
 * based on the selected category and difficulty.
 */
function registerTableButtons() {
  const buttons = document.querySelectorAll('td button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const [category, difficulty] = button.parentElement.className.split('-');
      const categoryUnderscore = category.replace('_', ' ');
      const question = generateQuestion(categoryUnderscore, diffDict[difficulty]);
      if (question) {
        updateState(question.id, 'question');
        // eslint-disable-next-line no-use-before-define
        displayQuestion(question, showCategoryTable);
      } else {
        alert(`No questions available for ${categoryUnderscore} - ${difficulty}`);
      }
    });
  });
}

/**
 * Displays the category table and handles the button actions.
 */
export default function showCategoryTable() {
  generateCategoryTable();
  const scores = getTeamScores();
  generateHorizontalScoreTable(scores);
  document.getElementById('category-table').style.display = 'block';
  registerTableButtons();
}
