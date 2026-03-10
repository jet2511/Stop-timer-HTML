import { timeUtils } from './utils.js';
import { Timer } from './timer.js';
import { i18n } from './i18n.js';

// DOM Elements
const screenMenu = document.getElementById('screenMenu');
const screenTimer = document.getElementById('screenTimer');
const screenSettings = document.getElementById('screenSettings');

const displayHms = document.getElementById('displayHms');
const displayMs = document.getElementById('displayMs');
const timerLabel = document.getElementById('timerLabel');

const btnStart = document.getElementById('btnStart');
const btnClear = document.getElementById('btnClear');
const btnBack = document.getElementById('btnBack');

const settingsDisplay = document.getElementById('settingsDisplay');

// State
let currentMode = 'stopwatch'; // 'stopwatch' or 'countdown'
let countdownInput = '';
let timer = null;

// Audio
const alarmSound = new Audio('./sound/Alarm01.wav');
alarmSound.loop = true;

// Initialize translations
function updateUIStrings() {
    document.querySelector('h1').textContent = i18n.t('title');
    document.getElementById('toStopwatch').innerHTML = `⏱️ ${i18n.t('stopwatch')}`;
    document.getElementById('toCountdown').innerHTML = `⏲️ ${i18n.t('countdown')}`;
    
    document.getElementById('btnBack').textContent = i18n.t('back');
    document.getElementById('btnClear').textContent = i18n.t('clear');
    
    document.querySelector('#screenSettings h2').textContent = i18n.t('setCountdown');
    document.getElementById('btnSettingsBack').textContent = i18n.t('back');
    document.getElementById('btnSettingsGo').textContent = i18n.t('go');
    
    document.getElementById('langToggle').textContent = `🌐 ${i18n.lang.toUpperCase()}`;
    
    if (currentMode === 'stopwatch') {
        timerLabel.textContent = i18n.t('stopwatchLabel');
    } else {
        timerLabel.textContent = i18n.t('countdownLabel');
    }

    // Update start button text based on state
    if (timer.isPaused) {
        btnStart.textContent = i18n.t('resume');
    } else if (timer.interval) {
        btnStart.textContent = i18n.t('pause');
    } else {
        btnStart.textContent = i18n.t('start');
    }
}

// Initialize Timer
timer = new Timer({
    ontick: (ms) => {
        const data = timeUtils.formatMilliseconds(ms);
        displayHms.textContent = data.hms;
        displayMs.textContent = `.${data.ms}`;
        document.title = data.hms;
    },
    onend: () => {
        btnStart.textContent = i18n.t('start');
        alarmSound.currentTime = 0;
        alarmSound.play().catch(e => console.log("Sound play error:", e));
        document.body.classList.add('is-flashing');
    }
});

// Navigation
function showScreen(screen) {
    [screenMenu, screenTimer, screenSettings].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
    updateUIStrings();
}

document.getElementById('toStopwatch').onclick = () => {
    currentMode = 'stopwatch';
    resetTimerDisplay();
    showScreen(screenTimer);
};

document.getElementById('toCountdown').onclick = () => {
    currentMode = 'countdown';
    countdownInput = '';
    settingsDisplay.textContent = '00:00:00';
    showScreen(screenSettings);
};

btnBack.onclick = () => {
    timer.stop();
    showScreen(screenMenu);
};

document.getElementById('btnSettingsBack').onclick = () => showScreen(screenMenu);

function dismissAlarm() {
    if (document.body.classList.contains('is-flashing')) {
        document.body.classList.remove('is-flashing');
        alarmSound.pause();
        alarmSound.currentTime = 0;
        resetTimerDisplay();
        return true;
    }
    return false;
}

// Timer Controls
btnStart.onclick = () => {
    dismissAlarm();
    if (timer.isPaused) {
        timer.resume();
    } else if (timer.interval) {
        timer.pause();
    } else {
        if (currentMode === 'stopwatch') {
            timer.start();
        } else {
            const ms = timeUtils.timeToMill(settingsDisplay.textContent);
            timer.start(ms);
        }
    }
    updateUIStrings();
};

btnClear.onclick = () => {
    dismissAlarm();
    timer.stop();
    resetTimerDisplay();
    updateUIStrings();
};

function resetTimerDisplay() {
    if (currentMode === 'countdown' && settingsDisplay.textContent !== '00:00:00') {
        displayHms.textContent = settingsDisplay.textContent;
        displayMs.textContent = '.000';
        document.title = settingsDisplay.textContent;
    } else {
        displayHms.textContent = '00:00:00';
        displayMs.textContent = '.000';
        document.title = i18n.t('title');
    }
}

// Countdown Settings
document.querySelectorAll('.numpad button[data-num]').forEach(btn => {
    btn.onclick = () => {
        if (countdownInput.length >= 6) return;
        countdownInput += btn.dataset.num;
        updateSettingsDisplay();
    };
});

document.getElementById('btnSettingsClear').onclick = () => {
    countdownInput = '';
    updateSettingsDisplay();
};

document.getElementById('btnSettingsGo').onclick = () => {
    if (!countdownInput || countdownInput === '000000') return;
    showScreen(screenTimer);
    resetTimerDisplay();
    updateUIStrings();
};

function updateSettingsDisplay() {
    const padded = countdownInput.padStart(6, '0');
    const h = padded.slice(0, 2);
    const m = padded.slice(2, 4);
    const s = padded.slice(4, 6);
    settingsDisplay.textContent = `${h}:${m}:${s}`;
}

// Controls
document.getElementById('themeToggle').onclick = () => {
    const currentTheme = document.body.dataset.theme;
    document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
};

document.getElementById('langToggle').onclick = () => {
    i18n.toggle();
    updateUIStrings();
};

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (dismissAlarm()) {
        e.preventDefault();
        return; // stop further processing
    }

    if (e.code === 'Space') {
        if (!screenTimer.classList.contains('hidden')) {
            btnStart.click();
            e.preventDefault();
        }
    }
});

// Initial Load
updateUIStrings();
