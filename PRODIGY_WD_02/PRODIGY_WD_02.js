let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;

const display = document.querySelector('.display');
const startStopButton = document.getElementById('startStop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapList = document.getElementById('lapList');

function formatTime(time) {
  let hours = Math.floor(time / 3600000);
  let minutes = Math.floor((time % 3600000) / 60000);
  let seconds = Math.floor((time % 60000) / 1000);
  let milliseconds = Math.floor((time % 1000) / 10);

  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(milliseconds).padStart(2, '0')
  );
}

function startStop() {
  if (isRunning) {
    clearInterval(timerInterval);
    startStopButton.textContent = 'Start';
    isRunning = false;
  } else {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    startStopButton.textContent = 'Pause';
    isRunning = true;
  }
}

function updateTime() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;
  display.textContent = formatTime(elapsedTime);
}

function reset() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  display.textContent = '00:00:00';
  startStopButton.textContent = 'Start';
  isRunning = false;
  lapList.innerHTML = '';
}

function lap() {
  if (isRunning) {
    const lapTime = document.createElement('li');
    lapTime.textContent = formatTime(elapsedTime);
    lapList.appendChild(lapTime);
  }
}

startStopButton.addEventListener('click', startStop);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', lap);