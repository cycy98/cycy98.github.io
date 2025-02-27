let startTime = 0;
let elapsedTime = 0;
let running = false;
let interval;

function formatTime(ns) {
    const microseconds = Math.floor((ns % 1000000000) / 1000)%1000;
    const milliseconds = Math.floor((ns % 1000000000) / 1000000);
    const totalSeconds = Math.floor(ns / 1000000000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms ${microseconds}µs`;
}

function updateDisplay() {
    const currentTime = running ? performance.now() * 1e6 - startTime : elapsedTime;
    document.getElementById("time").innerText = formatTime(currentTime);
}

function start() {
    if (!running) {
        startTime = performance.now() * 1e6 - elapsedTime;
        running = true;
        interval = setInterval(updateDisplay, 1);
    }
}

function stop() {
    if (running) {
        elapsedTime = performance.now() * 1e6 - startTime;
        running = false;
        clearInterval(interval);
    }
}



let laps = []; // Array to store lap times

function lap() {
    if (running) {
        const currentLapTime = performance.now() * 1e6 - startTime; // Current lap time in nanoseconds
        laps.push(formatTime(currentLapTime));
        displayLaps();
    }
}

function displayLaps() {
    const lapsDiv = document.getElementById("laps");
    lapsDiv.innerHTML = ""; // Clear previous laps
    // Reverse the laps array before displaying
    laps.slice().reverse().forEach((lapTime, index) => {
        lapsDiv.innerHTML += `<p>Lap ${laps.length - index}: ${lapTime}</p>`;
    });
}
function reset() {
    running = false;
    clearInterval(interval);
    startTime = 0;
    elapsedTime = 0;
    document.getElementById("time").innerText = "0h 0m 0s 0ms 0µs";
    laps = [];
    displayLaps();
}
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") { // Space key for start/stop
        if (running) {
            stop();
        } else {
            start();
        }
        event.preventDefault(); // Prevent scrolling when space is pressed
    } else if (event.code === "Digit0") { // 0 key for reset
      reset();
    } else if (event.code === "KeyR") { // 0 key for reset
      reset();
    } else if (event.code === "KeyS") {
      start();
    } else if (event.code === "KeyP") {
      stop();
    } else if (event.code === "KeyT") { // Space key for start/stop
      if (running) {
        stop();
      } else {
        start();
      }
    } else if (event.code === "KeyL") {
      lap();
      displayLaps();
    }
});
