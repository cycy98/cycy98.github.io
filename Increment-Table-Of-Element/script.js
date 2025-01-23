// TAB FUNCTIONALITY
function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content) => content.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// GAME STATE
let hydrogen1 = 10; // Start with 10 Hydrogen1
let hydrogen2 = 0;
let hydrogen3 = 0;

const generators = [
    { name: "Basic Generator", cost: 10, production: 1, count: 0 },
    { name: "Advanced Generator", cost: 100, production: 10, count: 0 },
    { name: "Fusion Generator", cost: 1000, production: 100, count: 0 },
];

// Function to update the resource display
function updateDisplay() {
    document.getElementById('hydrogen1-count').textContent = hydrogen1.toFixed(1);
    document.getElementById('hydrogen2-count').textContent = hydrogen2.toFixed(1);
    document.getElementById('hydrogen3-count').textContent = hydrogen3.toFixed(1);
    updateGeneratorTable();
}

// Function to update the generator table
function updateGeneratorTable() {
    const generatorTable = document.getElementById('generator-table');
    if (generatorTable) {
        generatorTable.innerHTML = generators
            .map((gen, index) => `
                <tr>
                    <td>${gen.name}</td>
                    <td>${gen.cost}</td>
                    <td>${gen.production}</td>
                    <td>${gen.count}</td>
                    <td><button onclick="buyGenerator(${index})">Buy</button></td>
                </tr>
            `)
            .join('');
    }
}

// Function to buy a generator
function buyGenerator(index) {
    const generator = generators[index];
    if (hydrogen1 >= generator.cost) {
        hydrogen1 -= generator.cost;
        generator.count += 1;
        generator.cost = Math.ceil(generator.cost * 1.15); // Increment cost
        updateDisplay();
    }
}

// Produce hydrogen every 0.1 second
function produceHydrogen() {
    const totalProduction = generators.reduce((sum, gen) => sum + gen.production * gen.count, 0);
    hydrogen1 += totalProduction / 10; // Add production over time
    updateDisplay();
}

setInterval(produceHydrogen, 100);

// Initialize Display
document.addEventListener('DOMContentLoaded', () => {
    openTab('generator');
    updateDisplay();
});
