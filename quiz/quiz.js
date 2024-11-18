let score = 0;

// Check answer and provide immediate feedback
function checkAnswer(button, isCorrect) {
  const allButtons = button.parentElement.querySelectorAll('button');

  // Disable all buttons after answering
  allButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('incorrect');
  }
}

// Show final score
function showScore() {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = `You scored ${score} out of 5!`;
}
