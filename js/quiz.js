// --- Smart branching questionnaire ---
const t = (key) => window.AuraI18n.t(key);

// --- Netlify Forms submission ---
// Posts to the static form declared in index.html (name="project-inquiry").
// Always sent as multipart/form-data (via FormData) rather than urlencoded,
// since the logo/photo fields carry actual File objects and Netlify Forms
// requires multipart for any submission that includes a file upload; plain
// text fields are just as happy to travel this way, so one encoding covers
// both stages. The Content-Type header is left for the browser to set, since
// it must include the multipart boundary fetch/FormData generates.
// Outside of Netlify hosting (e.g. the local dev server) this endpoint doesn't
// exist, so failures are expected there and are swallowed rather than shown
// to the user; the questionnaire flow never blocks on this.
function submitToNetlify(fields) {
  const formData = new FormData();
  formData.append('form-name', 'project-inquiry');
  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, v));
    } else {
      formData.append(key, value);
    }
  });
  fetch('/', {
    method: 'POST',
    body: formData
  }).catch((err) => {
    console.warn('Netlify Forms submission failed (expected when not hosted on Netlify):', err);
  });
}

function buildFormFields() {
  return {
    'business-name': quiz.answers.businessName || '',
    'description': quiz.answers.description || '',
    'has-logo': quiz.answers.hasLogo || '',
    'size': quiz.answers.size || '',
    'pages': (quiz.answers.pages || []).join(', '),
    'complexity': quiz.answers.complexity || '',
    'complexity-detail': quiz.answers.complexityDetail || '',
    'vibe': quiz.answers.vibe || '',
    'recommended-tier': quiz.answers.recommendedTier || '',
    'name': quiz.answers.name || '',
    'email': quiz.answers.email || '',
    'logo-design-request': quiz.answers.logoDesignRequest || '',
    'logo-files': quiz.answers.logoFileObjects || [],
    'photo-choice': quiz.answers.photoChoice || '',
    'files': quiz.answers.fileObjects || [],
    'domain': quiz.answers.domain || '',
    'hosting-interest': quiz.answers.hostingInterest || ''
  };
}

// When quiz.answers.preselectedTier is set (entered via a specific pricing
// card's button rather than a generic "get started" entry point), the tier
// is already known, so the whole Scope phase (page count, complexity) is
// skipped -- there's nothing left for it to determine.
const STEP_DEFS = [
  { id: 'business-name', phaseKey: 'quiz.phaseBasics' },
  { id: 'description', phaseKey: 'quiz.phaseBasics' },
  { id: 'email', phaseKey: 'quiz.phaseBasics' },
  { id: 'size', phaseKey: 'quiz.phaseScope', when: a => !a.preselectedTier },
  { id: 'pages-checklist', phaseKey: 'quiz.phaseScope', when: a => !a.preselectedTier && a.size === 'notsure' },
  { id: 'complexity', phaseKey: 'quiz.phaseScope', when: a => !a.preselectedTier },
  { id: 'complexity-detail', phaseKey: 'quiz.phaseScope', when: a => !a.preselectedTier && a.complexity === 'yes' },
  { id: 'vibe', phaseKey: 'quiz.phaseStyleTimeline' },
  { id: 'recommendation', phaseKey: 'quiz.phaseRecommendation' }
];

function getTierInfo(tier) {
  return {
    name: t(`pricing.${tier}.name`),
    price: t(`pricing.${tier}.price`),
    turnaround: t(`pricing.${tier}.turnaround`)
  };
}

const quiz = {
  answers: {},
  currentStepId: STEP_DEFS[0].id
};

const overlay = document.getElementById('quiz-overlay');
const modal = document.getElementById('quiz-modal');
const progressFill = document.getElementById('quiz-progress-fill');
const phaseLabel = document.getElementById('quiz-phase');
const stepEls = document.querySelectorAll('.quiz-step');

function getActiveSteps() {
  return STEP_DEFS.filter(s => !s.when || s.when(quiz.answers));
}

function renderStep(id) {
  stepEls.forEach(el => el.classList.toggle('active', el.dataset.step === id));
  const def = STEP_DEFS.find(s => s.id === id);
  const active = getActiveSteps();
  const idx = active.findIndex(s => s.id === id);
  if (def) phaseLabel.textContent = t(def.phaseKey);
  if (idx >= 0) progressFill.style.width = `${((idx + 1) / active.length) * 100}%`;
  const first = active[0];
  const stepEl = document.querySelector(`.quiz-step[data-step="${id}"] .quiz-input`);
  if (stepEl) setTimeout(() => stepEl.focus(), 350);
}

function goToStep(id) {
  quiz.currentStepId = id;
  renderStep(id);
}

function goNext() {
  const active = getActiveSteps();
  const idx = active.findIndex(s => s.id === quiz.currentStepId);
  if (idx < active.length - 1) goToStep(active[idx + 1].id);
}

function goBack() {
  const active = getActiveSteps();
  const idx = active.findIndex(s => s.id === quiz.currentStepId);
  if (idx > 0) goToStep(active[idx - 1].id);
}

// --- open / close ---
// `tier` is set when opened from a specific pricing card's button (Launch,
// Grow, or Studio), rather than a generic entry point like the nav link,
// which doesn't know a tier yet.
function openQuiz(tier) {
  quiz.answers = {};
  if (tier) quiz.answers.preselectedTier = tier;
  quiz.currentStepId = STEP_DEFS[0].id;
  document.querySelectorAll('.quiz-input').forEach(el => { el.value = ''; el.style.borderColor = ''; });
  document.querySelectorAll('.option-card.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('#quiz-pages-checklist input').forEach(el => { el.checked = false; });
  document.querySelectorAll('#quiz-pages-checklist .check-card').forEach(el => el.classList.remove('checked'));
  document.getElementById('dropzone-files').innerHTML = '';
  document.getElementById('quiz-no-photos').style.display = '';
  document.getElementById('logo-dropzone-files').innerHTML = '';
  document.getElementById('quiz-logo-dropzone').hidden = true;
  document.getElementById('quiz-logo-design-block').hidden = true;
  document.getElementById('quiz-booking-heading').hidden = false;
  document.getElementById('quiz-booking-subtext').hidden = false;
  document.getElementById('quiz-booking-confirmed-heading').hidden = true;
  document.getElementById('quiz-booking-confirmed-subtext').hidden = true;
  document.getElementById('quiz-skip-booking').hidden = false;
  document.getElementById('quiz-booking-done').hidden = true;
  renderStep(quiz.currentStepId);
  overlay.classList.add('open');
  requestAnimationFrame(() => overlay.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

function closeQuiz() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => overlay.classList.remove('open'), 300);
}

document.querySelectorAll('.js-open-quiz').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openQuiz(el.dataset.tier);
  });
});

document.getElementById('quiz-close').addEventListener('click', closeQuiz);

// First-screen shortcut for visitors who don't want the guided questions at
// all: jump straight to the booking step, skipping every phase and the
// post-submit extras step. Cal's own booker form collects name/email itself,
// so no contact info is lost even though our own fields are bypassed.
document.getElementById('quiz-skip-to-booking').addEventListener('click', () => goToStep('booking'));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeQuiz();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeQuiz();
});

// --- text input steps ---
// Enter advances a step the same way clicking its primary button would,
// for every single-line field (including quiz-name and quiz-domain, which
// have no data-field since they're read directly by id rather than via
// quiz.answers). Textareas are excluded so Enter keeps its normal job of
// inserting a newline instead of submitting the step.
document.querySelectorAll('.quiz-input').forEach(input => {
  if (input.tagName === 'TEXTAREA') return;
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    input.closest('.quiz-step').querySelector('.quiz-nav .btn.primary')?.click();
  });
});

document.querySelectorAll('.quiz-step .quiz-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.closest('.quiz-step');
    const input = step.querySelector('.quiz-input[data-field]');

    if (step.dataset.step === 'email') {
      const email = input.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      input.style.borderColor = emailValid ? '' : 'rgba(255,120,120,0.6)';
      if (!emailValid) return;
      quiz.answers.email = email;
      // Captured as soon as Phase 1 is done, so an inquiry with just a
      // business name, description, and email on file isn't lost entirely
      // if the visitor abandons the questionnaire before ever hitting Submit.
      submitToNetlify({ 'submission-stage': 'partial', ...buildFormFields() });
      goNext();
      return;
    }

    if (input) quiz.answers[input.dataset.field] = input.value.trim();
    if (step.dataset.step === 'pages-checklist') {
      quiz.answers.pages = Array.from(step.querySelectorAll('input:checked')).map(el => el.value);
    }
    goNext();
  });
});

document.querySelectorAll('.quiz-step .quiz-back').forEach(btn => {
  btn.addEventListener('click', goBack);
});

// --- single-select option cards (auto-advance) ---
document.querySelectorAll('.quiz-options[data-field]').forEach(group => {
  const field = group.dataset.field;
  group.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      quiz.answers[field] = card.dataset.value;
      if (group.closest('.quiz-step').dataset.step === 'post-submit') return;
      setTimeout(goNext, 320);
    });
  });
});

// --- pages checklist ---
document.querySelectorAll('#quiz-pages-checklist .check-card input').forEach(cb => {
  cb.addEventListener('change', () => {
    cb.closest('.check-card').classList.toggle('checked', cb.checked);
  });
});

// --- recommendation ---
function blurbKeyForTier(tier) {
  if (tier === 'studio') return 'quiz.recommendation.blurbStudio';
  if (tier === 'launch') return 'quiz.recommendation.blurbLaunch';
  return 'quiz.recommendation.blurbGrow';
}

function computeRecommendation() {
  const a = quiz.answers;
  let pageCount;
  if (a.size === 'one') pageCount = 1;
  else if (a.size === 'few') pageCount = 4;
  else if (a.size === 'full') pageCount = 7;
  else pageCount = (a.pages && a.pages.length) || 4;

  const complex = a.complexity === 'yes';
  let tier;
  if (complex || pageCount >= 6) tier = 'studio';
  else if (pageCount === 1) tier = 'launch';
  else tier = 'grow';

  const blurbKey = complex ? 'quiz.recommendation.blurbComplex' : blurbKeyForTier(tier);
  return { tier, blurb: t(blurbKey) };
}

// The recommendation step doubles as a confirmation screen when the tier was
// already chosen (a specific pricing card's button), rather than computed
// from Scope-phase answers that were never asked in that path.
function renderRecommendation() {
  const preselected = quiz.answers.preselectedTier;
  const { tier, blurb } = preselected
    ? { tier: preselected, blurb: t(blurbKeyForTier(preselected)) }
    : computeRecommendation();
  const info = getTierInfo(tier);
  quiz.answers.recommendedTier = tier;
  document.getElementById('quiz-recommend-question').textContent =
    t(preselected ? 'quiz.recommendation.questionConfirm' : 'quiz.recommendation.question');
  document.getElementById('recommend-tier').textContent = info.name;
  document.getElementById('recommend-price').innerHTML = info.price;
  document.getElementById('recommend-turnaround').textContent = info.turnaround;
  document.getElementById('recommend-blurb').textContent = blurb;
}

// recompute the recommendation right as that step becomes visible
const recommendationStepEl = document.querySelector('.quiz-step[data-step="recommendation"]');
const stepObserver = new MutationObserver(() => {
  if (recommendationStepEl.classList.contains('active')) renderRecommendation();
});
stepObserver.observe(recommendationStepEl, { attributes: true, attributeFilter: ['class'] });

// keep the recommendation and thanks heading in sync with the active language
let lastFirstName = '';
window.AuraI18n.onChange(() => {
  if (recommendationStepEl.classList.contains('active')) renderRecommendation();
  if (lastFirstName) {
    document.getElementById('quiz-thanks-heading').textContent =
      t('quiz.thanks.headingTemplate').replace('{name}', lastFirstName);
  }
});

document.getElementById('quiz-submit').addEventListener('click', () => {
  const nameInput = document.getElementById('quiz-name');
  const name = nameInput.value.trim();

  nameInput.style.borderColor = name ? '' : 'rgba(255,120,120,0.6)';
  if (!name) return;

  quiz.answers.name = name;

  // email was already captured (and validated) at the end of Phase 1; this
  // submission just carries the fuller answer set now that Phase 4 is done.
  // Captured now so the lead isn't lost even if the visitor closes the modal
  // before reaching (or instead of completing) the optional extras step.
  submitToNetlify({ 'submission-stage': 'initial', ...buildFormFields() });

  lastFirstName = name.split(' ')[0];
  const heading = document.getElementById('quiz-thanks-heading');
  heading.textContent = t('quiz.thanks.headingTemplate').replace('{name}', lastFirstName);
  goToStep('post-submit');
});

// --- post-submit optional extras ---

// Reusable dropzone wiring: click-to-choose, drag/drop, and rendering the
// list of chosen filenames. Used for both the logo upload and the photos
// upload, which are otherwise independent (different trigger, different
// answer field).
function setupDropzone(dropzoneEl, fileInputEl, filesContainerEl, onFilesChosen) {
  function handleFiles(files) {
    if (!files || !files.length) return;
    filesContainerEl.innerHTML = '';
    const names = [];
    const fileObjects = Array.from(files);
    fileObjects.forEach(f => {
      const tag = document.createElement('span');
      tag.textContent = f.name;
      filesContainerEl.appendChild(tag);
      names.push(f.name);
    });
    onFilesChosen(names, fileObjects);
  }
  dropzoneEl.addEventListener('click', () => fileInputEl.click());
  fileInputEl.addEventListener('change', () => handleFiles(fileInputEl.files));
  ['dragover', 'dragenter'].forEach(evt => {
    dropzoneEl.addEventListener(evt, (e) => { e.preventDefault(); dropzoneEl.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dropzoneEl.addEventListener(evt, (e) => { e.preventDefault(); dropzoneEl.classList.remove('dragover'); });
  });
  dropzoneEl.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
}

const noPhotos = document.getElementById('quiz-no-photos');

setupDropzone(
  document.getElementById('quiz-dropzone'),
  document.getElementById('quiz-file-input'),
  document.getElementById('dropzone-files'),
  (names, fileObjects) => {
    quiz.answers.fileCount = names.length;
    quiz.answers.fileNames = names;
    quiz.answers.fileObjects = fileObjects;
    noPhotos.style.display = 'none';
  }
);

setupDropzone(
  document.getElementById('quiz-logo-dropzone'),
  document.getElementById('quiz-logo-file-input'),
  document.getElementById('logo-dropzone-files'),
  (names, fileObjects) => {
    quiz.answers.logoFileNames = names;
    quiz.answers.logoFileObjects = fileObjects;
  }
);

// "Do you have a logo already?" (post-submit): reveal the upload immediately
// on Yes, or the design-request follow-up on No.
const logoDropzoneEl = document.getElementById('quiz-logo-dropzone');
const logoDesignBlockEl = document.getElementById('quiz-logo-design-block');
document.querySelectorAll('#post-submit-logo-options .option-card').forEach(card => {
  card.addEventListener('click', () => {
    const hasLogo = card.dataset.value === 'yes';
    logoDropzoneEl.hidden = !hasLogo;
    logoDesignBlockEl.hidden = hasLogo;
  });
});

function captureDomainField() {
  const domain = document.getElementById('quiz-domain').value.trim();
  if (domain) quiz.answers.domain = domain;
}

function finishExtras() {
  captureDomainField();
  // A second, fuller submission, only when the visitor actually completed this
  // step (not skipped) since skipping adds no new information over the
  // initial submission already sent when they hit Submit.
  submitToNetlify({ 'submission-stage': 'extras', ...buildFormFields() });
  goToStep('thanks');
}

function skipExtras() {
  goToStep('thanks');
}

document.getElementById('quiz-finish-extras').addEventListener('click', finishExtras);
document.getElementById('quiz-skip-extras').addEventListener('click', skipExtras);
document.getElementById('quiz-thanks-continue').addEventListener('click', () => goToStep('booking'));

// --- final step: book a discovery call (Cal.com inline embed) ---

// The embed step is display:none until active, and Cal's inline embed needs
// a visible container to size itself into, so it's initialized lazily on
// first activation rather than eagerly on page load.
let calEmbedInitialized = false;

// Swap the booking step into its post-booking state: hide the "book later"
// escape hatch (no longer relevant once a call is on the calendar) and
// replace the heading/subtext with a brief confirmation, matching the
// pattern used elsewhere in the quiz of two static, i18n-bound blocks with
// only one visible at a time rather than mutating text at runtime.
function onBookingSuccessful() {
  document.getElementById('quiz-booking-heading').hidden = true;
  document.getElementById('quiz-booking-subtext').hidden = true;
  document.getElementById('quiz-booking-confirmed-heading').hidden = false;
  document.getElementById('quiz-booking-confirmed-subtext').hidden = false;
  document.getElementById('quiz-skip-booking').hidden = true;
  document.getElementById('quiz-booking-done').hidden = false;
}

function initCalEmbed() {
  if (calEmbedInitialized || typeof Cal !== 'function') return;
  calEmbedInitialized = true;
  Cal.ns['discovery-call']('inline', {
    elementOrSelector: '#quiz-cal-embed',
    // name/email prefill the booker form with what the Recommendation step
    // already collected, so the client isn't asked for the same info twice.
    config: {
      layout: 'month_view',
      theme: 'dark',
      name: quiz.answers.name || '',
      email: quiz.answers.email || ''
    },
    calLink: 'maximilien-cat-ljsq1g/discovery-call'
  });
  Cal.ns['discovery-call']('on', {
    action: 'bookingSuccessful',
    callback: onBookingSuccessful
  });
}

const bookingStepEl = document.querySelector('.quiz-step[data-step="booking"]');
const bookingObserver = new MutationObserver(() => {
  if (bookingStepEl.classList.contains('active')) initCalEmbed();
});
bookingObserver.observe(bookingStepEl, { attributes: true, attributeFilter: ['class'] });

document.getElementById('quiz-skip-booking').addEventListener('click', closeQuiz);
document.getElementById('quiz-booking-done').addEventListener('click', closeQuiz);
