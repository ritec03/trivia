import { LS_USED_QUESTIONS, LS_TRIVIA_SCORES } from './constants.js';
import { questions as allQuestions } from './questions.js';

/**
 * Checks if there are any unused questions left for the given category and difficulty level.
 *
 * @param {string} category - The category to check.
 * @param {number} difficulty - The difficulty level to check.
 * @returns {boolean} Returns true if there are unused questions matching the category
 * and difficulty, otherwise false.
 */
export function hasUnusedQuestions(category, difficulty) {
  // Retrieve the list of questions that have not been used yet from local storage
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS)) || [];
  const questions = allQuestions.filter((q) => (
    q.category.trim() === category && q.difficulty === difficulty
      && !usedQuestions.includes(q.id)
  ));
    // If there are no more unused questions matching the category and difficulty, return false
  return questions.length > 0;
}

/**
 * Generates a question from the given category and difficulty level.
 *
 * @param {string} category - The category of the question.
 * @param {number} difficulty - The difficulty level of the question.
 * @returns {Object|null} The generated question object, or null if no more unused
 * questions are available.
 */
export function generateQuestion(category, difficulty) {
  // Retrieve the list of questions that have not been used yet from local storage
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS))
      || [];
  const questions = allQuestions.filter((q) => (
    q.category.trim() === category && q.difficulty === difficulty
      && !usedQuestions.includes(q.id)
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

export function getTeamScores() {
  // Get the scores from local storage
  const scores = JSON.parse(localStorage.getItem('trivia-scores') || '[]');

  // Calculate the total score for each team
  const teamScores = {};
  for (let i = 0; i < scores.length; i += 1) {
    const teamName = scores[i].team_name;
    const questionScore = scores[i].score;
    if (teamScores[teamName]) {
      teamScores[teamName] += questionScore;
    } else {
      teamScores[teamName] = questionScore;
    }
  }

  // remvoe scores for "None"
  delete teamScores.None;

  return teamScores;
}

export function getLastScoredTeam() {
  const scores = JSON.parse(localStorage.getItem(LS_TRIVIA_SCORES) || '[]');
  const lastScore = scores.pop();
  return lastScore.team_name;
}

export function getCategories() {
  return new Set(allQuestions.map((q) => q.category));
}
