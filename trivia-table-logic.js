import { LS_USED_QUESTIONS, LS_TRIVIA_SCORES } from './state-constants.js';
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

/**
 * Retrieves the team scores from the local storage and calculates the total score for each team.
 * @returns {Object} An object containing the team names as keys and their total scores as values.
 * @example
 * {
 *   "Team A": 500,
 *   "Team B": 300,
 *   "Team C": 200
 * }
 */
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

/**
 * Retrieves the team name of the last scored team from the local storage.
 * Returns 'None' if no scores are available or if last score is part of
 * team initialization.
 * @returns {string} The team name of the last scored team.
 * @example
 * "Team A"
 */
export function getLastScoredTeam() {
  const scores = JSON.parse(localStorage.getItem(LS_TRIVIA_SCORES) || '[]');
  if (scores.length === 0) {
    return 'None';
  }
  const lastScore = scores.pop();
  if (lastScore.score === 0) {
    // if the lastScore score value is 0, then it is the initialization of trivia teams
    // so we need to skip it
    return 'None';
  }
  return lastScore.team_name;
}

/**
 * Retrieves the set of unique categories from the available questions.
 * @returns {Set} A set containing the unique categories.
 * @example
 * Set(3) { "Vancouver Landmarks", "Things", "Animals" }
 */
export function getCategories() {
  return new Set(allQuestions.map((q) => q.category));
}
