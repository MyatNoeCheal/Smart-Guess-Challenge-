const factElem = document.getElementById('fact');
const explanationElem = document.getElementById('explanation');
const newFactBtn = document.getElementById('new-fact-btn');

newFactBtn.addEventListener('click', async () => {
  factElem.textContent = "Loading...";
  explanationElem.textContent = "";

  try {
    const response = await fetch('/get-fake-fact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Error fetching fact.');

    const data = await response.json();
    factElem.textContent = data.fact;
    explanationElem.textContent = data.explanation;
  } catch (err) {
    factElem.textContent = "Error fetching fact.";
    explanationElem.textContent = "";
    console.error(err);
  }
});
