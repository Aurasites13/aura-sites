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
  tierTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tier === tier));

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

// --- Assembly stage: a single standalone KOKU demo, fully independent of
// the tier tabs (those only ever swap the day-count timeline above). Driven
// by the Web Animations API instead of toggling a CSS class: each element
// type gets its own keyframe sequence, and calling .animate() again always
// starts a fresh animation instance regardless of current state - no
// reflow/rAF timing tricks that a browser can coalesce into a no-op, which
// is what made the old class-toggle approach unreliable on replay.
const stageEl = document.getElementById('stage');

const slideUp = (distance) => [
  { opacity: 0, transform: `translateY(${distance}px)` },
  { opacity: 1, transform: 'translateY(0)' }
];

const KOKU_SEQUENCE = [
  {
    selector: '.koku-nav',
    keyframes: [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    options: { delay: 0, duration: 300, easing: 'cubic-bezier(0.19,1,0.22,1)' }
  },
  {
    // elastic zoom: overshoots slightly smaller than full size before
    // settling, rather than a flat scale-down, for a more premium feel
    selector: '.koku-hero-img',
    keyframes: [
      { opacity: 0, transform: 'scale(1.18)' },
      { opacity: 1, transform: 'scale(0.99)', offset: 0.75 },
      { opacity: 1, transform: 'scale(1)' }
    ],
    options: { delay: 60, duration: 650, easing: 'cubic-bezier(0.19,1,0.22,1)' }
  },
  {
    selector: '.koku-heading',
    keyframes: slideUp(26),
    options: { delay: 160, duration: 450, easing: 'cubic-bezier(0.16,1,0.3,1)' }
  },
  {
    // satisfying pop: overshoots past full size, settles slightly under,
    // then eases to rest - a small bounce rather than a single ease-out
    selector: '.koku-cta',
    keyframes: [
      { opacity: 0, transform: 'scale(0.6)' },
      { opacity: 1, transform: 'scale(1.1)', offset: 0.6 },
      { opacity: 1, transform: 'scale(0.97)', offset: 0.82 },
      { opacity: 1, transform: 'scale(1)' }
    ],
    options: { delay: 230, duration: 520, easing: 'ease-out' }
  },
  {
    selector: '.koku-content-locations',
    keyframes: slideUp(30),
    options: { delay: 300, duration: 430, easing: 'cubic-bezier(0.19,1,0.22,1)' }
  },
  {
    selector: '.koku-content-philosophy',
    keyframes: slideUp(30),
    options: { delay: 350, duration: 430, easing: 'cubic-bezier(0.19,1,0.22,1)' }
  },
  {
    selector: '.koku-content-order',
    keyframes: slideUp(30),
    options: { delay: 400, duration: 430, easing: 'cubic-bezier(0.19,1,0.22,1)' }
  }
];

function playStageReveal() {
  KOKU_SEQUENCE.forEach(({ selector, keyframes, options }) => {
    const el = stageEl.querySelector(selector);
    if (!el) return;
    el.getAnimations().forEach(anim => anim.cancel());
    el.animate(keyframes, Object.assign({ fill: 'forwards' }, options));
  });
}

const stageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      playStageReveal();
      stageObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
stageObserver.observe(stageEl);

document.getElementById('stage-replay').addEventListener('click', playStageReveal);

tierTabs.forEach(tab => {
  tab.addEventListener('click', () => setTier(tab.dataset.tier));
});

// keep the currently displayed tier's day labels in sync with the active language
window.AuraI18n.onChange(() => setTier(activeTier, { instant: true }));

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
  function closeNavMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNavMenu);
  });
}
