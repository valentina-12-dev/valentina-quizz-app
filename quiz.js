// Quiz Questions Data
const quizData = [
  {
    question: "Care este capitala României?",
    options: ["București", "Brașov", "Cluj-Napoca", "Timișoara"],
    correct: 0
  },
  {
    question: "Cât este 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1
  },
  {
    question: "Care este cel mai mare ocean din lume?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3
  },
  {
    question: "Cine a pictat Noapte Înstelată?",
    options: ["Picasso", "Van Gogh", "Da Vinci", "Michelangelo"],
    correct: 1
  },
  {
    question: "În ce an a căzut Zidul Berlinului?",
    options: ["1987", "1989", "1991", "1993"],
    correct: 1
  }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results');
const questionsContainer = document.getElementById('questions-container');
const quizInfo = document.getElementById('quiz-info');
const btnNext = document.getElementById('btn-next');
const btnRestartFinal = document.getElementById('btn-restart-final');
const progressFill = document.getElementById('progress-fill');
const finalScore = document.getElementById('final-score');

// Initialize quiz
function init() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  quizContainer.style.display = 'block';
  resultsContainer.style.display = 'none';
  showQuestion();
}

// Show current question
function showQuestion() {
  const question = quizData[currentQuestion];
  const questionNumber = currentQuestion + 1;
  const totalQuestions = quizData.length;
  
  // Update progress bar
  const progress = (questionNumber / totalQuestions) * 100;
  progressFill.style.width = progress + '%';
  
  // Update quiz info
  quizInfo.textContent = `Întrebarea ${questionNumber} din ${totalQuestions}`;
  
  // Display question
  questionsContainer.innerHTML = `
    <div class="question">
      <h2>${question.question}</h2>
      <div class="options">
        ${question.options.map((option, index) => `
          <label class="option">
            <input type="radio" name="answer" value="${index}" />
            <span>${option}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to options
  const options = document.querySelectorAll('input[type="radio"]');
  options.forEach(option => {
    option.addEventListener('change', (e) => {
      selectedAnswer = parseInt(e.target.value);
      btnNext.disabled = false;
    });
  });
  
  btnNext.disabled = true;
}

// Handle next button
btnNext.addEventListener('click', () => {
  if (selectedAnswer !== null) {
    // Check if answer is correct
    if (selectedAnswer === quizData[currentQuestion].correct) {
      score++;
    }
    
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
      selectedAnswer = null;
      showQuestion();
    } else {
      showResults();
    }
  }
});

// Show results
function showResults() {
  quizContainer.style.display = 'none';
  resultsContainer.style.display = 'block';
  
  const percentage = Math.round((score / quizData.length) * 100);
  finalScore.textContent = `${score} din ${quizData.length} (${percentage}%)`;
}

// Restart quiz
btnRestartFinal.addEventListener('click', init);

// Start quiz on page load
init();