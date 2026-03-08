export const translations = {
    en: {
        title: "Stop Timer",
        stopwatch: "Stopwatch",
        countdown: "Countdown",
        start: "Start",
        pause: "Pause",
        resume: "Resume",
        clear: "Clear",
        back: "Back",
        setCountdown: "Set Countdown",
        go: "Go",
        timeUp: "Time is up!",
        stopwatchLabel: "Stopwatch",
        countdownLabel: "Countdown"
    },
    vi: {
        title: "Đồng Hồ Bấm Giờ",
        stopwatch: "Bấm Giờ",
        countdown: "Đếm Ngược",
        start: "Bắt Đầu",
        pause: "Tạm Dừng",
        resume: "Tiếp Tục",
        clear: "Xóa",
        back: "Quay Lại",
        setCountdown: "Thiết Lập Đếm Ngược",
        go: "Chạy",
        timeUp: "Hết giờ rồi!",
        stopwatchLabel: "Chế Độ Bấm Giờ",
        countdownLabel: "Chế Độ Đếm Ngược"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

export const i18n = {
    get lang() {
        return currentLang;
    },
    set lang(value) {
        currentLang = value;
        localStorage.setItem('lang', value);
    },
    t(key) {
        return translations[currentLang][key] || key;
    },
    toggle() {
        this.lang = currentLang === 'en' ? 'vi' : 'en';
        return currentLang;
    }
};
