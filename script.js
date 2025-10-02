const intro = document.getElementById('intro');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const nameInput = document.getElementById('name');
const qCount = document.getElementById('q-count');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const scoreText = document.getElementById('score-text');
const suggestion = document.getElementById('suggestion');

let current = 0;
let score = 0;
let currentCorrect = null;
let player = 'Player';
const TOTAL = 5;

function setProgress() {
  const pct = Math.round((current / TOTAL) * 100);
  progressBar.style.width = pct + '%';
}

function setFeedback(text, isCorrect) {
  feedbackEl.classList.remove('hidden');
  feedbackEl.textContent = text;
  feedbackEl.style.borderColor = isCorrect ? '#3aa76d' : '#b84c4c';
}

function renderOptions(opts) {
  optionsEl.innerHTML = '';
  opts.forEach((txt) => {
    const div = document.createElement('button');
    div.className = 'option';
    div.textContent = txt;
    div.addEventListener('click', () => {
      Array.from(optionsEl.children).forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
      const letter = (txt.trim()[0] || '').toUpperCase();
      const isCorrect = letter === currentCorrect;
      nextBtn.disabled = false;
      setFeedback(isCorrect ? 'Correct!' : `Wrong. Correct is ${currentCorrect}.`, isCorrect);
    });
    optionsEl.appendChild(div);
  });
}

async function fetchQuestion() {
  try {
    const res = await fetch('/api/question');
    const data = await res.json();
    return data;
  } catch (e) {
    return {
      question: "What is SentientAGI's mission?",
      options: ["A) Maximize profit","B) Community-owned AI","C) Closed-source AGI","D) Ad targeting"],
      correct: 'B',
      explanation: 'Sentient promotes community-owned AI and open participation.'
    };
  }
}

async function showQuestion() {
  nextBtn.disabled = true;
  feedbackEl.classList.add('hidden');
  qCount.textContent = `Question ${current + 1} of ${TOTAL}`;
  setProgress();

  const q = await fetchQuestion();
  questionEl.textContent = q.question;
  currentCorrect = (q.correct || 'A').toUpperCase();
  renderOptions(q.options || []);

  // show explanation on next
  nextBtn.onclick = () => {
    const explanation = q.explanation ? ` Explanation: ${q.explanation}` : '';
    const selected = Array.from(optionsEl.children).find(c => c.classList.contains('selected'));
    if (!selected) return; // guard
    const pickedLetter = (selected.textContent.trim()[0] || '').toUpperCase();
    if (pickedLetter === currentCorrect) score += 1;
    setFeedback((pickedLetter === currentCorrect ? 'Correct!' : `Wrong. Correct is ${currentCorrect}.`) + explanation, pickedLetter === currentCorrect);

    current += 1;
    if (current < TOTAL) {
      // small delay for UX
      setTimeout(showQuestion, 600);
    } else {
      setTimeout(showResult, 600);
    }
  };
}

function showResult() {
  intro.classList.add('hidden');
  quiz.classList.add('hidden');
  result.classList.remove('hidden');
  setProgress();

  const pct = Math.round((score / TOTAL) * 100);
  scoreText.textContent = `${player}, your score: ${score}/${TOTAL} (${pct}%)`;
  if (pct < 60) {
    suggestion.textContent = 'Learn more: SentientAGI on X (ethics updates) and Fireworks docs.';
  } else if (pct >= 80) {
    suggestion.textContent = 'Great! Build with Dobby API at sentient.ai (builders) and Fireworks docs.';
  } else {
    suggestion.textContent = 'Nice work! Explore SentientAGI on X and builder resources at sentient.ai';
  }
}

startBtn.addEventListener('click', () => {
  player = (nameInput.value || 'Player').trim();
  current = 0; score = 0; currentCorrect = null;
  intro.classList.add('hidden');
  result.classList.add('hidden');
  quiz.classList.remove('hidden');
  showQuestion();
});

restartBtn && restartBtn.addEventListener('click', () => {
  nameInput.value = player;
  intro.classList.remove('hidden');
  quiz.classList.add('hidden');
  result.classList.add('hidden');
  progressBar.style.width = '0%';
});
