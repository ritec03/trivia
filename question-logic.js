import { LS_USED_QUESTIONS, LS_TRIVIA_SCORES } from './constants.js';

/**
 * Retrieves the team names from the trivia scores in local storage.
 *
 * @returns {string[]} An array of team names.
 */
export function getTeamNames() {
  const scores = JSON.parse(
    localStorage.getItem('trivia-scores') || '{}',
  );

  const teamNames = [];
  for (let i = 0; i < scores.length; i += 1) {
    const teamName = scores[i].team_name;
    if (!teamNames.includes(teamName)) {
      teamNames.push(teamName);
    }
  }
  return teamNames.filter((teamName) => teamName !== 'None');
}

/**
 * Adds the score for the question and team name to the local storage.
 * @param {object} question - The question object.
 * @param {string} teamName - The name of the team.
 */
export function addScoreToLocalStorage(question, teamName) {
  const scores = JSON.parse(localStorage.getItem(LS_TRIVIA_SCORES) || '[]');
  const score = {
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
export function updateUsedQuestionsList(question) {
  const usedQuestions = JSON.parse(localStorage.getItem(LS_USED_QUESTIONS) || '[]');
  usedQuestions.push(question.id);
  localStorage.setItem(LS_USED_QUESTIONS, JSON.stringify(usedQuestions));
}
