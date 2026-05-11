// script.js

function setLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('[data-lang-inline]').forEach(el => {
        el.classList.remove('active');
    });
    
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.classList.add('active');
    });
    document.querySelectorAll(`[data-lang-inline="${lang}"]`).forEach(el => {
        el.classList.add('active');
    });
    
    document.getElementById('btn-en').classList.remove('active');
    document.getElementById('btn-sr').classList.remove('active');
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
}

function getSystemTheme() {
    // Проверяем системную тему через media query
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function downloadPrivacyPDF() {
    window.print();
}

function printPrivacy() {
    window.print();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Load saved language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);
    
    // Load theme: saved > system > default (light)
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || getSystemTheme();
    applyTheme(theme);
    
    // Listen for system theme changes (если пользователь меняет тему в системе)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Только если пользователь не выбрал тему вручную
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
});