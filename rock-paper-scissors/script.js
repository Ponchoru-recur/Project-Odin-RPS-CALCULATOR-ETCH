const WINNING_SCORE = 5;

const choiceBtns = document.querySelectorAll(".choice");
const humanScoreEl = document.querySelector("#human-score");
const computerScoreEl = document.querySelector("#computer-score");
const roundResult = document.querySelector("#round-result");
const finalResult = document.querySelector("#final-result");
const resetBtn = document.querySelector("#reset-btn");

let humanScore = 0;
let computerScore = 0;

// Picks rock, paper or scissors at random for the compute
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// Capitalizes the first letter so messages read nicer.
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Plays one round, updates the scores and shows who won
function playRound(humanChoice, computerChoice) {
  if (humanChoice === computerChoice) {
    roundResult.textContent = `It's a tie! You both picked ${capitalize(humanChoice)}.`;
  } else if (
    (humanChoice === "rock" && computerChoice === "scissors") ||
    (humanChoice === "paper" && computerChoice === "rock") ||
    (humanChoice === "scissors" && computerChoice === "paper")
  ) {
    humanScore++;
    roundResult.textContent = `You win! ${capitalize(humanChoice)} beats ${capitalize(computerChoice)}.`;
  } else {
    computerScore++;
    roundResult.textContent = `You lose! ${capitalize(computerChoice)} beats ${capitalize(humanChoice)}.`;
  }

  humanScoreEl.textContent = humanScore;
  computerScoreEl.textContent = computerScore;
  checkForWinner();
}

// Announces the winner once someone reahes 5 points and locks the buttons.
function checkForWinner() {
  if (humanScore < WINNING_SCORE && computerScore < WINNING_SCORE) return;

  finalResult.textContent =
    humanScore > computerScore ? "You won the game! 🎉" : "The computer won the game!";
  choiceBtns.forEach((btn) => (btn.disabled = true));
  resetBtn.hidden = false;
}

//puts the scores back to zero for a fresh game.
function resetGame() {
  humanScore = 0;
  computerScore = 0;
  humanScoreEl.textContent = 0;
  computerScoreEl.textContent = 0;
  roundResult.textContent = "Pick a move to start.";
  finalResult.textContent = "";
  choiceBtns.forEach((btn) => (btn.disabled = false));
  resetBtn.hidden = true;
}

choiceBtns.forEach((btn) => {
  btn.addEventListener("click", () => playRound(btn.dataset.choice, getComputerChoice()));
});

resetBtn.addEventListener("click", resetGame);
