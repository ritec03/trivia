import { LS_CURRENT_QUESTION } from './constants.js';
import showCategoryTable from './trivia-table-ui.js';
import { questions as allQuestions } from './questions.js';
import { displayQuestion, showAnswerDiv } from './question-ui.js';

function main() {
  let currentS = JSON.parse(localStorage.getItem(LS_CURRENT_QUESTION));
  if (currentS === undefined) {
    currentS = { question_id: null, stage: 'none' };
  }
  if (currentS.question_id === null) {
    showCategoryTable();
  } else {
    const question = allQuestions.filter((q) => q.id === currentS.question_id)[0];
    if (currentS.stage === 'question') {
      displayQuestion(question, showCategoryTable);
    } else if (currentS.stage === 'answer') {
      showAnswerDiv(question, showCategoryTable);
    }
  }
}

main();
