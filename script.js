
/* script.js – Complete */

const questions = [
  { q: "1) What is the time complexity of binary search on a sorted array of size n?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], correct: 2 },
  { q: "2) Which HTML tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<hyper>"], correct: 1 },
  { q: "3) In CSS, which property controls the space *inside* an element between content and its border?", options: ["margin", "border", "padding", "gap"], correct: 2 },
  { q: "4) Which of these is NOT a primitive data type in JavaScript?", options: ["Number", "String", "Character", "Boolean"], correct: 2 },
  { q: "5) Which SQL statement is used to extract data from a database?", options: ["GET", "SELECT", "EXTRACT", "PULL"], correct: 1 },
  { q: "6) In OOP, what does 'encapsulation' primarily provide?", options: ["Code reuse", "Hide internal state and expose methods", "Multiple inheritance", "Faster execution"], correct: 1 },
  { q: "7) Which sorting algorithm has average case O(n log n) and is stable?", options: ["Quicksort", "Merge Sort", "Heap Sort", "Selection Sort"], correct: 1 },
  { q: "8) Which HTTP method is typically used to submit form data that modifies server state?", options: ["GET", "POST", "LINK", "OPEN"], correct: 1 },
  { q: "9) Which data structure uses LIFO order?", options: ["Queue", "Stack", "Heap", "Graph"], correct: 1 },
  { q: "10) What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Syntax"], correct: 1 },
  { q: "11) In databases, which normal form removes repeating groups?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 0 },
  { q: "12) Which of these is used to create a responsive web layout quickly?", options: ["CSS Grid / Flexbox", "XML", "SQL", "Assembly"], correct: 0 },
  { q: "13) What is the worst-case time complexity of linear search?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2 },
  { q: "14) Which keyword in Java indicates that a method can be overridden by subclasses?", options: ["static", "final", "protected", "abstract"], correct: 3 },
  { q: "15) In networking, what does 'IP' stand for?", options: ["Internet Protocol", "Internal Packet", "Internet Process", "Input Protocol"], correct: 0 },
  { q: "16) Which HTML input type provides a drop-down list?", options: ["<input type='dropdown'>", "<select>", "<list>", "<options>"], correct: 1 },
  { q: "17) Which structure is best to implement a priority queue?", options: ["Linked List", "Hash Table", "Heap", "Binary Search Tree"], correct: 2 },
  { q: "18) Which JavaScript method converts a JSON string into an object?", options: ["JSON.toObject()", "JSON.parse()", "JSON.stringify()", "parseJSON()"], correct: 1 },
  { q: "19) Which of these is useful for version control?", options: ["Git", "FTP", "HTTP", "SMTP"], correct: 0 },
  { q: "20) Which loop is guaranteed to execute its body at least once?", options: ["for", "while", "do...while", "foreach"], correct: 2 }
];

// State
let currentIndex = 0;
const total = questions.length;
const userState = Array.from({ length: total }, () => ({ selected: null, marked: false }));

// DOM refs
const qIndexEl = document.getElementById('qIndex');
const qTextEl = document.getElementById('qText');
const optionsForm = document.getElementById('optionsForm');
const qNumbersEl = document.getElementById('qNumbers');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const markBtn = document.getElementById('markBtn');
const submitBtn = document.getElementById('submitBtn');
const resultArea = document.getElementById('resultArea');
const themeToggle = document.getElementById('themeToggle');

// init
renderSidebar();
loadQuestion(0);
attachListeners();
restoreTheme();

function renderSidebar() {
  qNumbersEl.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const div = document.createElement('div');
    div.className = 'qnum';
    div.textContent = (i + 1);
    updateQnumClass(div, i);
    div.addEventListener('click', () => {
      saveAnswerFromForm();
      loadQuestion(i);
    });
    qNumbersEl.appendChild(div);
  }
}

function updateQnumClass(el, idx) {
  el.classList.remove('attempted', 'marked', 'unanswered');
  if (userState[idx].marked) el.classList.add('marked');
  else if (userState[idx].selected !== null) el.classList.add('attempted');
  else el.classList.add('unanswered');
}

function loadQuestion(index) {
  currentIndex = index;
  const q = questions[index];
  qIndexEl.textContent = `Question ${index + 1} / ${total}`;
  qTextEl.textContent = q.q;

  optionsForm.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.id = 'opt' + i;
    input.value = i;
    if (userState[index].selected === i) input.checked = true;

    const label = document.createElement('label');
    label.htmlFor = 'opt' + i;
    label.textContent = opt;

    div.appendChild(input);
    div.appendChild(label);

    div.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() !== 'input') input.checked = true;
      userState[currentIndex].selected = parseInt(input.value);
      refreshSidebarStatus();
    });

    optionsForm.appendChild(div);
  });

  markBtn.textContent = userState[index].marked ? 'Unmark Review' : 'Mark for Review';
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === total - 1;
  resultArea.classList.add('hidden');
  refreshSidebarStatus();
}

function saveAnswerFromForm() {
  const checked = optionsForm.querySelector('input[name="option"]:checked');
  if (checked) userState[currentIndex].selected = parseInt(checked.value);
  renderSidebar();
}

function attachListeners() {
  prevBtn.addEventListener('click', () => {
    saveAnswerFromForm();
    if (currentIndex > 0) loadQuestion(currentIndex - 1);
  });
  nextBtn.addEventListener('click', () => {
    saveAnswerFromForm();
    if (currentIndex < total - 1) loadQuestion(currentIndex + 1);
  });

  markBtn.addEventListener('click', () => {
    userState[currentIndex].marked = !userState[currentIndex].marked;
    markBtn.textContent = userState[currentIndex].marked ? 'Unmark Review' : 'Mark for Review';
    refreshSidebarStatus();
  });

  submitBtn.addEventListener('click', () => {
    if (!confirm("Submit the quiz?")) return;
    saveAnswerFromForm();
    submitQuiz();
  });

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      themeToggle.textContent = '☀️';
      localStorage.setItem('quizTheme', 'dark');
    } else {
      themeToggle.textContent = '🌙';
      localStorage.setItem('quizTheme', 'light');
    }
  });
}

function refreshSidebarStatus() {
  const children = qNumbersEl.children;
  for (let i = 0; i < children.length; i++) {
    updateQnumClass(children[i], i);
  }
}

function submitQuiz() {
  let score = 0, attempted = 0, markedCount = 0, wrong = 0;
  const reviewList = [];

  for (let i = 0; i < total; i++) {
    const user = userState[i];
    if (user.selected !== null) attempted++;
    if (user.marked) markedCount++;

    const correctIdx = questions[i].correct;
    const isCorrect = user.selected === correctIdx;
    if (isCorrect) score++;
    else if (user.selected !== null) wrong++;

    reviewList.push({ index: i, question: questions[i].q, selected: user.selected, correct: correctIdx, options: questions[i].options, correctBool: isCorrect });
  }

  const unattempted = total - attempted;
  const percent = Math.round((score / total) * 100);

  resultArea.classList.remove('hidden');
  resultArea.innerHTML = `
    <h3>Result</h3>
    <div class="stat-row">
      <div class="stat-card score-card">
        <div class="stat-value">${score}<span class="stat-total">/${total}</span></div>
        <div class="stat-label">Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${attempted}</div>
        <div class="stat-label">Attempted</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${markedCount}</div>
        <div class="stat-label">Marked</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${unattempted}</div>
        <div class="stat-label">Unattempted</div>
      </div>
    </div>
    <div class="chart-wrap">
      <canvas id="resultChart"></canvas>
      <div class="chart-center">
        <div class="chart-percent">${percent}%</div>
        <div class="chart-percent-label">Correct</div>
      </div>
    </div>
    <hr style="margin: 20px 0; border: 0; border-top: 1px solid rgba(0,0,0,0.1);" />
    <h4>Review Answers</h4>
    <div class="result-list" id="resultList"></div>
  `;

  // Chart.js — theme-aware doughnut with center label
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e2e8f0' : '#222';
  const gridBg = isDark ? '#1e293b' : '#fff';

  if (window.__resultChartInstance) {
    window.__resultChartInstance.destroy(); // avoid leaking old chart if quiz is ever re-submitted
  }

  const ctx = document.getElementById('resultChart').getContext('2d');
  window.__resultChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'Wrong', 'Unattempted'],
      datasets: [{
        data: [score, wrong, unattempted],
        backgroundColor: ['#4caf50', '#f44336', '#9e9e9e'],
        borderColor: gridBg,
        borderWidth: 3,
        hoverOffset: 10,
        borderRadius: 6,
        spacing: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '72%',
      animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, padding: 14, font: { size: 13, weight: '600' } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / total) * 100)}%)`
          }
        }
      }
    }
  });

  const resultList = resultArea.querySelector('#resultList');
  reviewList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item ' + (item.correctBool ? 'correct' : 'wrong');
    let selText = item.selected === null ? '<em>Not Answered</em>' : item.options[item.selected];
    let correctText = item.options[item.correct];
    div.innerHTML = `<div><strong>Q${item.index + 1}:</strong> ${item.question}</div>
      <div><strong>Your answer:</strong> ${selText}</div>
      <div><strong>Correct answer:</strong> ${correctText}</div>`;
    resultList.appendChild(div);
  });

  resultArea.scrollIntoView({ behavior: 'smooth' });
  disableQuizInteraction();
}

function disableQuizInteraction() {
  qNumbersEl.querySelectorAll('.qnum').forEach(n => n.style.pointerEvents = 'none');
  prevBtn.disabled = true; nextBtn.disabled = true; markBtn.disabled = true; submitBtn.disabled = true;
  optionsForm.querySelectorAll('input').forEach(o => o.disabled = true);
}

function restoreTheme() {
  const t = localStorage.getItem('quizTheme');
  if (t === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}