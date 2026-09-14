// --- First-visit build-in animation for every section ---
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORAGE_KEY = 'aura-seen-sections';

  function getSeen() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function markSeen(id) {
    try {
      const seen = getSeen();
      if (!seen.includes(id)) {
        seen.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
      }
    } catch (e) { /* localStorage unavailable, skip persistence */ }
  }
  function hasSeen(id) {
    return getSeen().includes(id);
  }

  const BUILD_GROUPS = [
    { id: 'nav', container: document.querySelector('nav'), items: document.querySelectorAll('nav .nav-links > a') },
    { id: 'process-head', container: document.querySelector('.assembly-head'), items: document.querySelectorAll('.assembly-head > *') },
    { id: 'process-tabs', container: document.querySelector('.tier-toggle'), items: document.querySelectorAll('.tier-toggle > .tier-tab') },
    { id: 'process-timeline', container: document.querySelector('.timeline'), items: document.querySelectorAll('.timeline > .timeline-step') },
    { id: 'work-head', container: document.querySelector('.work-head'), items: document.querySelectorAll('.work-head > *') },
    { id: 'work-cards', container: document.querySelector('.work-grid'), items: document.querySelectorAll('.work-grid > .work-card') },
    { id: 'why-not-template', container: document.querySelector('.why-not-template'), items: document.querySelectorAll('.why-not-template > *') },
    { id: 'social-stats', container: document.querySelector('.social-stats'), items: document.querySelectorAll('.social-stats > .stat-item') },
    { id: 'social-quotes', container: document.querySelector('.quote-grid'), items: document.querySelectorAll('.quote-grid > .quote-card') },
    { id: 'pricing-head', container: document.querySelector('.pricing-head'), items: document.querySelectorAll('.pricing-head > *') },
    { id: 'pricing-cards', container: document.querySelector('.pricing-grid'), items: document.querySelectorAll('.pricing-grid > .price-card') },
    { id: 'hosting-addon', container: document.querySelector('.hosting-addon'), items: [document.querySelector('.hosting-addon')] },
    { id: 'faq-head', container: document.querySelector('.faq-head'), items: document.querySelectorAll('.faq-head > *') },
    { id: 'faq-items', container: document.querySelector('.faq-list'), items: document.querySelectorAll('.faq-list > .faq-item') },
    { id: 'footer', container: document.querySelector('footer'), items: [document.querySelector('footer')] }
  ];

  BUILD_GROUPS.forEach(group => {
    if (!group.container || !group.items) return;
    const items = Array.from(group.items).filter(Boolean);
    if (!items.length) return;

    const alreadySeen = prefersReducedMotion || hasSeen(group.id);

    items.forEach((el, i) => {
      el.classList.add('build-el');
      el.style.transitionDelay = `${i * 70}ms`;
      if (alreadySeen) el.classList.add('instant', 'build-in');
    });

    if (alreadySeen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach(el => el.classList.add('build-in'));
          markSeen(group.id);
          observer.unobserve(group.container);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(group.container);
  });
})();
