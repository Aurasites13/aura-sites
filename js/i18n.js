// --- i18n engine: language detection, persistence, DOM binding ---
window.AuraI18n = (function () {
  const STORAGE_KEY = 'aura-lang';
  const listeners = [];
  let currentLang = 'en';

  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  function detectInitialLang() {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* localStorage unavailable */ }
    if (stored === 'en' || stored === 'ja') return stored;

    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
    return navLang.startsWith('ja') ? 'ja' : 'en';
  }

  // t(key): looks up a dot-path key in the current language, falling back to
  // English, then to the key itself, so a missing translation never renders blank.
  function t(key) {
    const dict = window.AURA_I18N[currentLang] || window.AURA_I18N.en;
    const val = getPath(dict, key);
    if (val !== undefined) return val;
    const fallback = getPath(window.AURA_I18N.en, key);
    return fallback !== undefined ? fallback : key;
  }

  function applyToDom() {
    document.documentElement.setAttribute('lang', currentLang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
      el.setAttribute('data-tooltip', t(el.getAttribute('data-i18n-tooltip')));
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === currentLang));
    });
  }

  function setLang(lang, opts) {
    opts = opts || {};
    if (lang !== 'en' && lang !== 'ja') return;
    currentLang = lang;
    if (!opts.silent) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* localStorage unavailable */ }
    }
    applyToDom();
    listeners.forEach(fn => fn(lang));
  }

  // onChange(fn): fn is called after every language switch (including the
  // initial one on load), so late-registering modules still sync immediately.
  function onChange(fn) {
    listeners.push(fn);
    fn(currentLang);
  }

  function init() {
    currentLang = detectInitialLang();
    applyToDom();
  }

  return {
    t,
    setLang,
    onChange,
    init,
    get lang() { return currentLang; }
  };
})();

window.AuraI18n.init();

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => window.AuraI18n.setLang(btn.dataset.lang));
});
