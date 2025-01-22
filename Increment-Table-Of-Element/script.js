// script.js
function showTab(tabId, button) {
    // Remove the active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Remove the active class from all tab panes
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    // Add the active class to the clicked button
    button.classList.add('active');

    // Add the active class to the corresponding tab pane
    const activePane = document.getElementById(tabId);
    activePane.classList.add('active');
}
// Game state
let _1H = 10;
let _1HPerSecond = 0;
let generatorCount = 1;
let generatorCost = 10;

// DOM elements
const _1HCountDisplay = document.getElementById('_1H-count');
const generatorCountDisplay = document.getElementById('_1H-count');
const generatorCostDisplay = document.getElementById('_1H-cost');

const buyGeneratorButton = document.getElementById('buy-generator');

// Function to update the resource display
function updateDisplay() {
    _1HCountDisplay.textContent = _1H.toFixed(1);
    generatorCountDisplay.textContent = generatorCount;
    generatorCostDisplay.textContent = generatorCost;
}


// Buy a generator
buyGeneratorButton.addEventListener('click', () => {
    if (_1H >= generatorCost) {
        _1H -= generatorCost;
        generatorCount += 1;
        _1HPerSecond += 1; // Each generator adds 1 gold per second
        generatorCost = Math.ceil(generatorCost * 1.15); // Increment cost
        updateDisplay();
    }
});

// Generate gold over time
function generate1H() {
    _1H += _1H / 10; // Increment gold every 100ms
    updateDisplay();
}

// Start generating gold every 100ms
setInterval(generate1H, 100);

// Initial display update
updateDisplay();
