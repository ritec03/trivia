const correctButton = document.querySelector('.correct-button');
const incorrectButton = document.querySelector('.incorrect-button');
const teamSelectionDiv = document.querySelector('.team-selection');
const teamSelect = document.querySelector('.team-select');
const teamOkButton = document.querySelector('.team-ok-button');


const questionId = 1; // Replace with the actual question ID

// Add event listeners for the Correct and Incorrect buttons
correctButton.addEventListener('click', function(event) {
    teamSelectionDiv.style.display = 'block';

    // Populate the team select dropdown with team names from local storage
    let scores = JSON.parse(localStorage.getItem('trivia-scores') || '{}');
    let teamNames = [];
    for (let i = 0; i < scores.length; i++) {
        let teamName = scores[i].team_name;
        if (!teamNames.includes(teamName)) {
            teamNames.push(teamName);
        }
    }
    for (teamName of teamNames) {
        if (!Array.from(teamSelect.options).some(option => option.value === teamName)) {
            let option = document.createElement('option');
            option.value = teamName;
            option.text = teamName;
            teamSelect.add(option);
        }
    }
});

incorrectButton.addEventListener('click', function(event) {
    alert('Incorrect!');
});

// Add event listener for the OK button in the team selection dropdown
teamOkButton.addEventListener('click', function(event) {
    let teamName = teamSelect.value;
    let scores = JSON.parse(localStorage.getItem('trivia-scores') || '[]');
    let score = {
        question_id: questionId,
        team_name: teamName,
        score: 1 // Replace with the actual score awarded for a correct answer
    };
    scores.push(score);
    localStorage.setItem('trivia-scores', JSON.stringify(scores));

    teamSelectionDiv.style.display = 'none';
});