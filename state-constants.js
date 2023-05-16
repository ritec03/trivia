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

/*
This key is used to store the information about the current quesiton,
including the question id, the stage the question is at, choices clicked
for multiple-choice questions, and time stamp for when the question was started.
Example of the structure found at the "current-question" local storage slot:
{
  question_id: "questionId1",
  stage: "question" || "scoring" || "answer",
  choicesClicked: null || [0,1,2,3],
  time_stamp: [timestamp]
} || null ||
*/
export const LS_CURRENT_QUESTION = 'current-question';

/*
States for the program:
1. at the category table
2. at a question before hitting correct button
3. at a question after hitting the correct button
3. at a question answer (which happens only after the score assignment)

CatTab -> ClCat -> Question -> ClCor -> QuestionScoring -> ClScore -> Answer
| |                   |                        |                       |
|  <----- ClBack <------                       |                       |
|  <------------------------- ClBack <---------                        |
|                                                  CatTabNext <- ClOk <-
*/
