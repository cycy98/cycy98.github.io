const totalClicksElement = document.getElementById('totalClicks');
const userClicksElement = document.getElementById('userClicks');
const clickButton = document.getElementById('clickButton');
const leaderboardElement = document.getElementById('leaderboard');

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let totalClicks = 0;
const leaderboard = {};

server.on('connection', (socket) => {
    console.log('A user connected.');

    // Send initial data to the new client
    socket.send(JSON.stringify({ totalClicks, leaderboard }));

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        // Update total clicks and leaderboard
        totalClicks++;
        leaderboard[data.username] = (leaderboard[data.username] || 0) + 1;

        // Broadcast the updated data to all clients
        const update = JSON.stringify({ totalClicks, leaderboard });
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(update);
            }
        });
    });

    socket.on('close', () => {
        console.log('A user disconnected.');
    });
});

console.log('WebSocket server running on ws);

// Prompt for username
let username = prompt("Enter your username:");
if (!username) {
  username = `User${Math.floor(Math.random() * 1000)}`; // Default username
}

// Initialize user's click count
leaderboard[username] = leaderboard[username] || 0;

// Function to update the total click count
function updateTotalClicks() {
    totalClicksElement.textContent = totalClicks;
}

// Function to update the user's click count
function updateUserClicks() {
  userClicksElement.textContent = leaderboard[username];
}

// Function to update the leaderboard
function updateLeaderboard() {
// Convert the leaderboard object to an array and sort by clicks
  const sortedLeaderboard = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

// Clear the current leaderboard
  leaderboardElement.innerHTML = '';

// Populate the leaderboard
  sortedLeaderboard.forEach(([user, clicks]) => {
    const li = document.createElement('li');
    li.textContent = `${user}: ${clicks} clicks`;
    leaderboardElement.appendChild(li);
  });
}

// Event listener for the click button
function handleButtonClick() {
  totalClicks++;
  leaderboard[username] = (leaderboard[username] || 0) + 1;
  updateTotalClicks();
  updateUserClicks();
  updateLeaderboard();
}

        // Initialize the display
updateTotalClicks();
updateUserClicks();
updateLeaderboard();
