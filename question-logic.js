import { LS_USED_QUESTIONS, LS_TRIVIA_SCORES, LS_CURRENT_QUESTION } from './state-constants.js';

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

/**
 * Updates the current state in local storage.
 * @param {string|null} questionId - The ID of the question. Use null for no question.
 * @param {string} stage - The current stage of the question.
 */
export function updateState(questionId, stage) {
  if (questionId === null) {
    localStorage.setItem(LS_CURRENT_QUESTION, JSON.stringify({
      question_id: null,
      stage: 'none',
    }));
  } else {
    const state = JSON.parse(localStorage.getItem(LS_CURRENT_QUESTION));
    state.question_id = questionId;
    state.stage = stage;
    if (stage === 'question') {
      state.timestamp = new Date().getTime();
    }
    localStorage.setItem(LS_CURRENT_QUESTION, JSON.stringify(state));
  }
}

/**
 * Updates the clicked choice list in the current state in local storage.
 * @param {number} listIndex - The index of the clicked choice.
 */
export function updateClickedChoiceList(listIndex) {
  const state = JSON.parse(localStorage.getItem(LS_CURRENT_QUESTION));
  const choiceList = state.choiceList || [];
  if (!choiceList.includes(listIndex)) {
    choiceList.push(listIndex);
  }
  state.choiceList = choiceList;
  localStorage.setItem(LS_CURRENT_QUESTION, JSON.stringify(state));
}

/**
 * Retrieves the clicked choice list from the current state in local storage.
 * @returns {number[]} The clicked choice list.
 */
export function getClickedChoiceList() {
  const state = JSON.parse(localStorage.getItem(LS_CURRENT_QUESTION));
  return state.choiceList;
}

/**
 * Retrieves the timestamp of the current question from the current state in local storage.
 * @returns {number} The timestamp of the current question.
 */
export function getQuestionTimestamp() {
  const state = JSON.parse(localStorage.getItem(LS_CURRENT_QUESTION));
  return state.timestamp;
}

/**
 * Calculates the remaining seconds until given seconds have elapsed since the timstamp time.
 * @param {number} timestamp - The timestamp of the question start.
 * @param {number} seconds - The total seconds for the question.
 * @returns {number} The remaining seconds.
 */
export function calculateRemainingSeconds(timestamp, seconds) {
  const currentTimestamp = new Date().getTime();
  const elapsedMilliseconds = currentTimestamp - timestamp;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const remainingSeconds = seconds - elapsedSeconds;

  return remainingSeconds;
}
