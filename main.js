import './style.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let userSelectedDate;
let intervalId = null;
const startButton = document.querySelector('[data-start]');
const inputDateTime = document.querySelector('#datetime-picker');
const dateFields = document.querySelectorAll('.value');
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
  },
  onChange(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (!isDateInTheFuture(userSelectedDate)) {
      alert('Select a valid date in the future!');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

startButton.addEventListener('click', startCountdown);

function startCountdown() {
  startButton.disabled = true;
  intervalId = setInterval(() => {
    const timeRemaining = userSelectedDate.getTime() - new Date();

    if (!isDateInTheFuture(userSelectedDate)) {
      startButton.disabled = false;
      return clearInterval(intervalId);
    }
    updateTimer(convertMs(timeRemaining));
  }, 1000);
}

function isDateInTheFuture(date) {
  return date.getTime() > new Date().getTime();
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return {
    days: formatTime(days),
    hours: formatTime(hours),
    minutes: formatTime(minutes),
    seconds: formatTime(seconds),
  };
}

function formatTime(value) {
  return String(value).padStart(2, '0');
}

function updateTimer(time) {
  for (const field of dateFields) {
    const key = Object.keys(field.dataset)[0];

    field.textContent = time[key];
  }
}

flatpickr(inputDateTime, options);
