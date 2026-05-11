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

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
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
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
});