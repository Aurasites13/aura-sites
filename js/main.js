// --- Process section: per-tier timing tabs ---
const tierDayKeys = { launch: 'daysLaunch', grow: 'daysGrow', studio: 'daysStudio' };

function getTierDays(tier) {
  return window.AuraI18n.t(`process.${tierDayKeys[tier]}`);
}

const tierTabs = document.querySelectorAll('.tier-tab');
const stepDays = document.querySelectorAll('.timeline-step .step-day');
let activeTier = 'grow';

function setTier(tier, opts) {
  opts = opts || {};
  activeTier = tier;
  const days = getTierDays(tier);
  tierTabs.forEach(tab => {
    const selected = tab.dataset.tier === tier;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });

  if (opts.instant) {
    stepDays.forEach((el, i) => { el.textContent = days[i]; });
    return;
  }

  stepDays.forEach((el, i) => {
    el.classList.remove('pop');
    el.classList.add('swap');
    setTimeout(() => {
      el.textContent = days[i];
      el.classList.remove('swap');
      el.classList.add('pop');
      setTimeout(() => el.classList.remove('pop'), 420);
    }, 150);
  });
}

tierTabs.forEach(tab => {
  tab.addEventListener('click', () => setTier(tab.dataset.tier));
});

// keep the currently displayed tier's day labels in sync with the active language
window.AuraI18n.onChange(() => setTier(activeTier, { instant: true }));

// --- Founding clients: optional "what they say" row, only once real quotes
// exist in js/i18n-strings.js (founding.quotes). Empty for now by design.
const foundingQuotesRow = document.getElementById('founding-quotes');
const foundingQuotesGrid = document.getElementById('founding-quotes-grid');

if (foundingQuotesRow && foundingQuotesGrid) {
  function renderFoundingQuotes() {
    const dict = window.AURA_I18N[window.AuraI18n.lang] || window.AURA_I18N.en;
    const quotes = (dict.founding && dict.founding.quotes) || [];
    foundingQuotesRow.hidden = quotes.length === 0;
    foundingQuotesGrid.innerHTML = quotes.map(q => `
      <div class="founding-quote-card">
        <p class="founding-quote-text">${q.text}</p>
        <div class="founding-quote-attr">${q.attr}</div>
      </div>
    `).join('');
  }
  window.AuraI18n.onChange(renderFoundingQuotes);
}

// --- Info-tap tooltips ---
let activeTooltip = null;
let activeTrigger = null;

function closeTooltip() {
  if (!activeTooltip) return;
  const tip = activeTooltip;
  const trigger = activeTrigger;
  tip.classList.remove('show');
  trigger.classList.remove('active');
  setTimeout(() => tip.remove(), 200);
  activeTooltip = null;
  activeTrigger = null;
}

function openTooltip(trigger) {
  closeTooltip();
  const tip = document.createElement('div');
  tip.className = 'info-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.textContent = trigger.dataset.tooltip;
  document.body.appendChild(tip);

  const tipWidth = 220;
  const rect = trigger.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipWidth / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - tipWidth - 12));
  const top = rect.bottom + window.scrollY + 10;

  tip.style.width = `${tipWidth}px`;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;

  requestAnimationFrame(() => tip.classList.add('show'));
  trigger.classList.add('active');
  activeTooltip = tip;
  activeTrigger = trigger;
}

document.querySelectorAll('.info-tap').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeTrigger === btn) {
      closeTooltip();
    } else {
      openTooltip(btn);
    }
  });
});

document.addEventListener('click', closeTooltip);
window.addEventListener('scroll', closeTooltip, { passive: true });

// --- FAQ accordion ---
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    question.setAttribute('aria-expanded', String(!isOpen));
  });
});

// --- Mobile nav: hamburger toggle ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  // Below the 760px collapse breakpoint (see .nav-links in style.css), the
  // closed menu is hidden with opacity/pointer-events rather than display:none
  // so it can transition in, which otherwise leaves its links and language
  // buttons focusable by keyboard even while invisible. `inert` removes them
  // from tab order whenever the menu is closed on a narrow viewport, and is
  // re-synced on toggle and on resize since it must never apply at desktop
  // widths, where these same links are always visible.
  const mobileNavQuery = window.matchMedia('(max-width: 760px)');
  function syncNavInert() {
    navLinks.inert = mobileNavQuery.matches && !navLinks.classList.contains('open');
  }
  function closeNavMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    syncNavInert();
  }
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    syncNavInert();
  });
  mobileNavQuery.addEventListener('change', syncNavInert);
  syncNavInert();
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNavMenu);
  });
}

// --- Hero "See the work" button: scroll to the portfolio section ---
document.querySelectorAll('.js-scroll-work').forEach(el => {
  el.addEventListener('click', () => {
    const workSection = document.getElementById('work');
    if (workSection) workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
