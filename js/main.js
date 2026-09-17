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
// the tier tabs (those only ever swap the day-count timeline above). Each
// element type has its own transition (fade/zoom/slide/pop) with a fixed
// CSS transition-delay, so replaying is just toggling .revealed on #stage -
// no per-tier bookkeeping needed since there's only ever this one demo.
const stageEl = document.getElementById('stage');
function playStageReveal() {
  stageEl.classList.remove('revealed');
  // force a reflow so the browser registers the pre-reveal state before
  // .revealed is re-added, otherwise a same-tick class toggle gets coalesced
  // and the transition never plays
  void stageEl.offsetWidth;
  requestAnimationFrame(() => stageEl.classList.add('revealed'));
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
