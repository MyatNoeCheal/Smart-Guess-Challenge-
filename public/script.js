let currentFact = null;
let hasGuessed = false;

let userScore = parseInt(localStorage.getItem("userScore") || 0);
let aiScore = parseInt(localStorage.getItem("aiScore") || 0);
let usedIndexes = JSON.parse(localStorage.getItem("usedIndexes") || "[]");

const realBtn = document.querySelector("button.real");
const fakeBtn = document.querySelector("button.fake");
const elements = {
  realBtn,
  fakeBtn,
  result: document.getElementById("result"),
  explanation: document.getElementById("explanation"),
};

async function generateFact() {
  hasGuessed = false;

  realBtn.disabled = true;
  fakeBtn.disabled = true;
  elements.result.innerText = "";
  elements.explanation.innerText = "";
  document.getElementById("fact").innerText = "Loading fascinating fact...";

  try {
    const res = await fetch(`${window.location.origin}/facts`); // Load all facts
    const allFacts = await res.json();

    const availableFacts = allFacts.filter((_, i) => !usedIndexes.includes(i));

    if (availableFacts.length === 0 || userScore + aiScore >= 10) {
      window.location.href = "result.html";
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableFacts.length);
    const fact = availableFacts[randomIndex];
    const actualIndex = allFacts.findIndex(f => f.fact === fact.fact);

    usedIndexes.push(actualIndex);
    localStorage.setItem("usedIndexes", JSON.stringify(usedIndexes));

    currentFact = fact; // <-- Set currentFact for guess()
    document.getElementById("fact").innerText = fact.fact;
    realBtn.disabled = false;
    fakeBtn.disabled = false;
  } catch (err) {
    document.getElementById("fact").innerText = "⚠️ Error loading fact.";
    console.error("Fetch failed:", err);
  }
}

function guess(userGuess) {
  if (!currentFact) return;

  // Disable buttons after guess
  elements.realBtn.disabled = true;
  elements.fakeBtn.disabled = true;

  // Remove previous animation classes
  elements.realBtn.classList.remove('correct-answer', 'wrong-answer');
  elements.fakeBtn.classList.remove('correct-answer', 'wrong-answer');

  // Display result and animate
  if (userGuess === currentFact.answer) {
    elements.result.textContent = '🎉 Brilliant! You got it right!';
    elements.result.style.color = '#4cc9f0';

    // Add correct animation to the chosen button
    if (userGuess === 'Real') {
      elements.realBtn.classList.add('correct-answer');
    } else {
      elements.fakeBtn.classList.add('correct-answer');
    }

    createConfetti();
    userScore++;
  } else {
    elements.result.textContent = '🤔 Oops! That was incorrect.';
    elements.result.style.color = '#f72585';

    // Add wrong animation to the chosen button
    if (userGuess === 'Real') {
      elements.realBtn.classList.add('wrong-answer');
    } else {
      elements.fakeBtn.classList.add('wrong-answer');
    }
    aiScore++;
  }

  // Show explanation
  elements.explanation.innerHTML = `💡 <strong>Did you know?</strong> ${currentFact.explanation}`;

  localStorage.setItem("userScore", userScore);
  localStorage.setItem("aiScore", aiScore);

  if (userScore + aiScore >= 10) {
    setTimeout(() => {
      window.location.href = "result.html";
    }, 1200); // Short delay to show result
  }
}

// Confetti effect
function createConfetti() {
  const confettiCount = 100;
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '1000';

  document.body.appendChild(confettiContainer);

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.borderRadius = '50%';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = '-10px';
    confetti.style.opacity = Math.random();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    const animationDuration = `${2 + Math.random() * 3}s`;
    confetti.style.animation = `fall ${animationDuration} forwards`;

    confettiContainer.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }

  // Remove container after animation
  setTimeout(() => {
    confettiContainer.remove();
  }, 3000);
}

function getRandomColor() {
  const colors = ['#4cc9f0', '#f72585', '#4361ee', '#7209b7', '#3a0ca3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Add confetti animation to CSS if not already present
if (!document.getElementById('confetti-style')) {
  const style = document.createElement('style');
  style.id = 'confetti-style';
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Start the game
window.onload = generateFact;
document.getElementById("new-fact-btn").addEventListener("click", generateFact);


