// script.js — alekseitkachev.dev

/* ---- inject the logo glyph into every [data-logo] slot ---- */
function injectLogos() {
    const tpl = document.getElementById('logo-svg');
    if (!tpl) return;
    document.querySelectorAll('[data-logo]').forEach(slot => {
        slot.appendChild(tpl.content.cloneNode(true));
    });
}

/* ---- language (driven by <html lang>; CSS does the rest) ---- */
function setLanguage(lang) {
    document.documentElement.lang = lang;

    const en = document.getElementById('btn-en');
    const sr = document.getElementById('btn-sr');
    if (en && sr) {
        en.classList.toggle('active', lang === 'en');
        sr.classList.toggle('active', lang === 'sr');
    }

    localStorage.setItem('preferredLanguage', lang);
}

/* ---- theme ---- */
function getSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
}
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
}

/* ---- copy email ---- */
function copyEmail() {
    const email = 'contact@alekseitkachev.dev';
    const btn = document.getElementById('email-btn');
    const hint = document.getElementById('copy-hint');

    const done = () => {
        btn.classList.add('copied');
        hint.classList.add('ok');
        const lang = document.documentElement.lang || 'en';
        hint.dataset.prev = hint.innerHTML;
        hint.textContent = lang === 'sr' ? 'Kopirano u clipboard ✓' : 'Copied to clipboard ✓';
        clearTimeout(copyEmail._t);
        copyEmail._t = setTimeout(() => {
            btn.classList.remove('copied');
            hint.classList.remove('ok');
            if (hint.dataset.prev) hint.innerHTML = hint.dataset.prev;
        }, 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(() => {
            window.location.href = 'mailto:' + email;
        });
    } else {
        window.location.href = 'mailto:' + email;
    }
}

/* ---- reveal on scroll (scroll-based + failsafe, no reliance on IO) ---- */
function initReveal() {
    const els = Array.from(document.querySelectorAll('.reveal'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.forEach(el => el.classList.add('in'));
        return;
    }

    let pending = els;
    const revealVisible = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        pending = pending.filter(el => {
            const top = el.getBoundingClientRect().top;
            if (top < vh * 0.92) { el.classList.add('in'); return false; }
            return true;
        });
        if (!pending.length) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        }
    };

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { revealVisible(); ticking = false; });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // initial pass for above-the-fold content
    requestAnimationFrame(revealVisible);

    // failsafe: if the animation timeline is paused/broken (e.g. background tab,
    // reduced capabilities), force the visible end-state so content is never lost.
    // On normal browsers the transition has already finished, so this is a no-op.
    setTimeout(() => {
        const probe = els.find(el => el.classList.contains('in'));
        const broken = !probe || parseFloat(getComputedStyle(probe).opacity) < 0.9;
        if (broken) {
            els.forEach(el => {
                el.style.transition = 'none';
                el.classList.add('in');
                el.classList.remove('reveal');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    }, 1200);
}

/* ---- init ---- */
window.addEventListener('DOMContentLoaded', () => {
    injectLogos();

    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || getSystemTheme());

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    initReveal();
});
