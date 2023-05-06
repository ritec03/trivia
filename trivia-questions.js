import {questions as allQuestions} from '/questions.js';
// // Get references to relevant elements in the HTML document


// Define a function to generate a random question from the given category and difficulty level
function generateQuestion(category, difficulty) {
  // Retrieve the list of questions that have not been used yet from local storage
  const usedQuestions = JSON.parse(localStorage.getItem("used-questions")) ||
    [];
  const questions = allQuestions.filter((q) => (
    q.category === category && q.difficulty === difficulty &&
    !usedQuestions.includes(q.id)
  ));

  console.log(questions);

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
  const usedQuestions = JSON.parse(localStorage.getItem("used-questions")) || [];
  console.log(category);
  console.log(difficulty);
  console.log(allQuestions);
  const questions = allQuestions.filter((q) => (
    q.category === category && q.difficulty === difficulty &&
    !usedQuestions.includes(q.id)
  ));

  console.log(questions);
  // If there are no more unused questions matching the category and difficulty, return false
  return questions.length > 0;
}

function showCategoryTable() {
  const categoryTable = document.getElementById("table");
  const cells = categoryTable.getElementsByTagName("td");
  for (let i = 0; i < cells.length; i++) {
    const [category, difficulty] = cells[i].className.split("-");
    const diffDict = {
      100: 1,
      200: 2,
      300: 3,
    };
    if (hasUnusedQuestions(category, diffDict[difficulty])) {
      cells[i].innerHTML = `<button>${difficulty}</button>`;
    } else {
      cells[i].innerHTML = "CLOSED";
    }
  }
  document.getElementById("category-table").style.display = "block";
  registerTableButtons();
}

function registerTableButtons() {
  // Get all the buttons in the table
  const buttons = document.querySelectorAll("td button");

  // Loop through the buttons and add an event listener to each one
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const diffDict = {
        100: 1,
        200: 2,
        300: 3,
      };

      // Get the category and difficulty level from the class name of the button's parent cell
      console.log(button.parentElement.className);
      const [category, difficulty] = button.parentElement.className.split("-");
      console.log(category);
      console.log(diffDict[difficulty]);

      // Check if there is a question available for the given category and difficulty level
      const question = generateQuestion(category, diffDict[difficulty]);

      if (question) {
        // Show the question and hide the table
        const questionDiv = document.getElementById("question");
        questionDiv.innerHTML = `<div class="question-frame">
        <h1>The Category is: ${category}</h1>
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
            <button class="incorrect-button">Incorrect</button>
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
        const incorrectButton = document.querySelector(".incorrect-button");
        const teamSelectionDiv = document.querySelector(".team-selection");
        const teamSelect = document.querySelector(".team-select");
        const teamOkButton = document.querySelector(".team-ok-button");

        // Add event listeners for the Correct and Incorrect buttons
        correctButton.addEventListener("click", function (event) {
          teamSelectionDiv.style.display = "block";

          // Populate the team select dropdown with team names from local storage
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

        incorrectButton.addEventListener("click", function (event) {
          document.getElementById("category-table").style.display = "block";
          questionDiv.style.display = "none";
        });

        // Add event listener for the OK button in the team selection dropdown
        // this will add the score
        teamOkButton.addEventListener("click", function (event) {
          if (teamSelect.value !== "None") {
            let teamName = teamSelect.value;
            let scores = JSON.parse(
              localStorage.getItem("trivia-scores") || "[]",
            );
            let score = {
              question_id: question.id,
              team_name: teamName,
              score: question.difficulty * 100, // Replace with the actual score awarded for a correct answer
            };
            scores.push(score);
            localStorage.setItem("trivia-scores", JSON.stringify(scores));
          }

          // Add the question id to the used questions list and store it in local storage
          const usedQuestions =
            JSON.parse(localStorage.getItem("used-questions")) || [];
          usedQuestions.push(question.id);
          localStorage.setItem("used-questions", JSON.stringify(usedQuestions));

          teamSelectionDiv.style.display = "none";
          questionDiv.style.display = "none";
          // Show the answer and hide the question
          const answerDiv = document.getElementById("answer");
          console.log(question.answerImage);
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

        const answerOkButton = document.querySelector(".continue-button");
          answerOkButton.addEventListener("click", function (event) {
            answerDiv.style.display = "none";
              showCategoryTable();
          })

        });
      } else {
        // Display a message saying no questions are available for the selected category and difficulty level
        alert(`No questions available for ${category} - ${difficulty}`);
      }
    });
  });
}

showCategoryTable();
