// --- i18n engine: language detection, persistence, DOM binding ---
window.AuraI18n = (function () {
  const STORAGE_KEY = 'aura-lang';
  const listeners = [];
  let currentLang = 'en';

  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  // Each page is now a real, separate static file per language (see
  // scripts/build.mjs), with the correct <html lang="..."> already baked
  // in server-side -- that's the authoritative source of truth now, not
  // a client-side guess. localStorage/navigator detection is kept only as
  // a defensive fallback for the unlikely case that attribute is missing.
  function detectInitialLang() {
    const pageLang = document.documentElement.getAttribute('lang');
    if (pageLang === 'en' || pageLang === 'ja') return pageLang;

    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* localStorage unavailable */ }
    if (stored === 'en' || stored === 'ja') return stored;

    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
    return navLang.startsWith('ja') ? 'ja' : 'en';
  }

  // A few pricing keys (the meishi prices) are stored as a plain number
  // rather than a formatted string -- see the AuraFormatYen comment in
  // js/i18n-strings.js. Format here so re-applying translations client
  // side (e.g. after a future language switch) can't overwrite the
  // ¥-formatted text scripts/build.js already rendered with a bare number.
  function formatIfNumber(v) {
    return (typeof v === 'number') ? window.AuraFormatYen(v) : v;
  }

  // t(key): looks up a dot-path key in the current language, falling back to
  // English, then to the key itself, so a missing translation never renders blank.
  function t(key) {
    const dict = window.AURA_I18N[currentLang] || window.AURA_I18N.en;
    const val = getPath(dict, key);
    if (val !== undefined) return formatIfNumber(val);
    const fallback = getPath(window.AURA_I18N.en, key);
    return formatIfNumber(fallback !== undefined ? fallback : key);
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
    // Used for <meta> tags (e.g. name="description"), which have no text
    // content of their own, just a `content` attribute.
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
      el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
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

// The language toggle is now a normal link to the other language's own
// URL (generated per-page by scripts/build.mjs), not a button that
// swaps text client-side, so there's no click handler to wire up here.
