const weatherApi = "https://api.weather.gov/alerts/active?area=";

// ==============================
// DOM ELEMENTS
// ==============================
let input, button, alertsDiv, errorDiv;

function initElements() {
  input = document.getElementById('state-input');
  button = document.getElementById('fetch-alerts');
  alertsDiv = document.getElementById('alerts-display');
  errorDiv = document.getElementById('error-message');
}

// ==============================
// FETCH WEATHER ALERTS
// ==============================
async function fetchWeatherAlerts(state) {
  if (!state || state.length !== 2) {
    displayError('Please enter a valid 2-letter state code');
    return;
  }

  try {
    const response = await fetch(`${weatherApi}${state}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts');
    }

    const data = await response.json();
    displayAlerts(data);
    clearError();
    input.value = '';
  } catch (error) {
    displayError(error.message);
  }
}

// ==============================
// DISPLAY ALERTS
// ==============================
function displayAlerts(data) {
  alertsDiv.innerHTML = '';
  const alertCount = data.features.length;

  const title = document.createElement('h2');
  title.textContent = `Weather Alerts: ${alertCount}`;
  alertsDiv.appendChild(title);

  const ul = document.createElement('ul');
  data.features.forEach(alert => {
    const li = document.createElement('li');
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  alertsDiv.appendChild(ul);
}

// ==============================
// ERROR HANDLING
// ==============================
function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

// ==============================
// SETUP EVENT LISTENERS
// ==============================
function setupEventListeners() {
  if (!input || !button) return;

  button.addEventListener('click', () => {
    const state = input.value.trim().toUpperCase();
    fetchWeatherAlerts(state);
  });
}

// ==============================
// INITIALIZE
// ==============================
function initializeApp() {
  initElements();
  setupEventListeners();
}

// Only run in browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

// ==============================
// EXPORTS FOR JEST
// ==============================
module.exports = {
  fetchWeatherAlerts,
  displayAlerts,
  displayError,
  clearError,
  initElements,
  setupEventListeners,
  initializeApp,
};
