// The key used to store the list of used questions in the local storage.
// This key is used to retrieve and store the list of questions that have been already used.
/* Example of the structure found at the "used-questions" local storage slot:
[
  "questionId1",
  "questionId2",
  "questionId3"
]
*/
export const LS_USED_QUESTIONS = 'used-questions';

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
export const LS_TRIVIA_SCORES = 'trivia-scores';
