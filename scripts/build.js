#!/usr/bin/env node
// --- Static per-language page generator ---
//
// What this does: reads the page templates in templates/*.html (written
// once, in the same data-i18n style the site has always used) and the
// single source of truth in js/i18n-strings.js, and writes out one fully
// static HTML file per page per language:
//   - Japanese at the repo root (index.html, privacy.html, about.html, ...)
//   - English under en/ (en/index.html, en/privacy.html, ...)
// Every data-i18n/-content/-placeholder/-alt/-aria-label/-tooltip binding
// is resolved to real text at build time, so a crawler reading the raw
// HTML of either version sees that language's real content, not a
// client-side toggle. The output is plain static files -- nothing here
// needs a server, so it still deploys on Netlify exactly like before.
//
// How to run it, whenever template or i18n content changes:
//   node scripts/build.js
//
// It has no npm dependencies (plain Node, no package.json needed).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const SITE_ORIGIN = 'https://aurasites.studio';

// --- load the i18n dictionary the same way the browser does ---
const sandbox = { window: {} };
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js', 'i18n-strings.js'), 'utf8');
// eslint-disable-next-line no-new-func
new Function('window', i18nSrc)(sandbox.window);
const AURA_I18N = sandbox.window.AURA_I18N;

// --- page registry: one entry per page, both languages generated from it ---
// changefreq/priority mirror this same site's own prior sitemap.xml values;
// carried here so the sitemap can be generated from this one registry too.
const PAGES = [
  { slug: '', templateFile: 'index.html', breadcrumbKey: null, changefreq: 'weekly', priority: '1.0' },
  { slug: 'privacy', templateFile: 'privacy.html', breadcrumbKey: null, changefreq: 'yearly', priority: '0.2' },
  { slug: 'about', templateFile: 'about.html', breadcrumbKey: 'aboutPage.breadcrumbCurrent', changefreq: 'monthly', priority: '0.7' },
  { slug: 'restaurant-websites-tokyo', templateFile: 'restaurant-websites-tokyo.html', breadcrumbKey: 'restaurantPage.breadcrumbCurrent', changefreq: 'monthly', priority: '0.9' },
  { slug: 'case-study-asiatis', templateFile: 'case-study-asiatis.html', breadcrumbKey: 'caseStudyAsiatis.breadcrumbCurrent', changefreq: 'monthly', priority: '0.6' }
];

// --- i18n lookup, mirroring js/i18n.js's own fallback chain ---
function getPath(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}
function translate(lang, key) {
  const dict = AURA_I18N[lang] || AURA_I18N.en;
  let v = getPath(dict, key);
  if (v === undefined) v = getPath(AURA_I18N.en, key);
  if (v === undefined) v = key;
  return v;
}
function stripHtml(s) {
  return String(s).replace(/<[^>]*>/g, '');
}

// --- URL helpers ---
// Absolute URL for a page in a given language (used in canonical, hreflang,
// JSON-LD). Japanese lives at the root, English under /en/.
function absoluteUrl(slug, lang) {
  if (slug === '') return lang === 'en' ? `${SITE_ORIGIN}/en/` : `${SITE_ORIGIN}/`;
  const prefix = lang === 'en' ? '/en' : '';
  return `${SITE_ORIGIN}${prefix}/${slug}.html`;
}
// Root-relative URL for internal links (extensionless, matching this
// site's existing Netlify pretty-URL convention, e.g. /privacy).
function relativeUrl(slug, lang) {
  const prefix = lang === 'en' ? '/en' : '';
  if (slug === '') return lang === 'en' ? '/en/' : '/';
  return `${prefix}/${slug}`;
}
function outputPath(slug, lang) {
  const dir = lang === 'en' ? path.join(ROOT, 'en') : ROOT;
  const filename = slug === '' ? 'index.html' : `${slug}.html`;
  return path.join(dir, filename);
}

// --- JSON-LD builders (generated fresh per language from the same i18n
// data the visible page uses, rather than text-patching hardcoded JSON) ---
function wrapJsonLd(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}
function buildProfessionalServiceJsonLd(lang) {
  return wrapJsonLd({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Aura Sites',
    url: absoluteUrl('', lang),
    logo: `${SITE_ORIGIN}/assets/logo/aura-sites-icon.svg`,
    description: translate(lang, 'meta.description'),
    inLanguage: lang,
    areaServed: [
      { '@type': 'City', name: 'Tokyo' },
      { '@type': 'Country', name: 'Japan' }
    ],
    availableLanguage: ['en', 'ja', 'fr'],
    // sameAs intentionally omitted (TODO: add once real Instagram/LinkedIn/
    // Google Business Profile URLs exist -- placeholder strings here would
    // make the schema invalid).
    founder: { '@type': 'Person', name: 'Maximilien' }
  });
}
function buildServiceJsonLd(lang) {
  const tierOffer = (tier, price) => {
    const offer = {
      '@type': 'Offer',
      name: translate(lang, `pricing.${tier}.name`),
      description: stripHtml(translate(lang, `pricing.${tier}.desc`))
    };
    if (price) {
      offer.price = price;
      offer.priceCurrency = 'JPY';
    }
    return offer;
  };
  return wrapJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Custom website design',
    provider: { '@type': 'ProfessionalService', name: 'Aura Sites' },
    areaServed: 'JP',
    inLanguage: lang,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Aura Sites pricing',
      itemListElement: [
        tierOffer('launch', '180000'),
        tierOffer('grow', '480000'),
        tierOffer('studio', null)
      ]
    }
  });
}
function buildFaqJsonLd(lang) {
  const dict = AURA_I18N[lang] || AURA_I18N.en;
  const faq = dict.faq || {};
  const mainEntity = [];
  for (let i = 1; faq['q' + i]; i++) {
    mainEntity.push({
      '@type': 'Question',
      name: faq['q' + i],
      acceptedAnswer: { '@type': 'Answer', text: faq['a' + i] }
    });
  }
  return wrapJsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity });
}
function buildBreadcrumbJsonLd(lang, slug, breadcrumbKey) {
  const homeName = lang === 'ja' ? 'ホーム' : 'Home';
  return wrapJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: lang,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: absoluteUrl('', lang) },
      { '@type': 'ListItem', position: 2, name: translate(lang, breadcrumbKey), item: absoluteUrl(slug, lang) }
    ]
  });
}

// --- language toggle: a real link to the other language's URL, not a
// button that swaps text client-side ---
function buildLangToggle(slug, lang) {
  const jaUrl = relativeUrl(slug, 'ja');
  const enUrl = relativeUrl(slug, 'en');
  const jaEl = lang === 'ja'
    ? '<span class="lang-btn active" aria-current="page">JP</span>'
    : `<a href="${jaUrl}" class="lang-btn">JP</a>`;
  const enEl = lang === 'en'
    ? '<span class="lang-btn active" aria-current="page">EN</span>'
    : `<a href="${enUrl}" class="lang-btn">EN</a>`;
  return `<div class="lang-toggle" role="group" aria-label="Language" data-i18n-aria-label="nav.langToggleAriaLabel">\n`
    + `    ${enEl}\n    <span class="lang-sep">/</span>\n    ${jaEl}\n  </div>`;
}

// --- canonical + hreflang block ---
function buildSeoHead(slug, lang) {
  const selfUrl = absoluteUrl(slug, lang);
  const jaUrl = absoluteUrl(slug, 'ja');
  const enUrl = absoluteUrl(slug, 'en');
  return [
    `<link rel="canonical" href="${selfUrl}">`,
    `<link rel="alternate" hreflang="ja" href="${jaUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${jaUrl}">`
  ].join('\n');
}

// --- data-i18n content substitution, tag-depth aware so a data-i18n
// element that itself contains a same-named nested tag (e.g. the price
// spans, <span data-i18n="...">¥120,000<span>〜</span></span>) resolves
// against its real matching close tag instead of the first one found ---
function findMatchingClose(html, searchStart, tagName) {
  const openRe = new RegExp(`<${tagName}(?=[\\s>])`, 'gi');
  const closeRe = new RegExp(`</${tagName}>`, 'gi');
  let depth = 1;
  let pos = searchStart;
  while (depth > 0) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const nextOpen = openRe.exec(html);
    const nextClose = closeRe.exec(html);
    if (!nextClose) throw new Error(`No matching </${tagName}> found`);
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      pos = nextOpen.index + nextOpen[0].length;
    } else {
      depth--;
      if (depth === 0) return nextClose.index;
      pos = nextClose.index + nextClose[0].length;
    }
  }
  return -1;
}
function replaceDataI18nContent(html, lang) {
  const openTagRe = /<([a-zA-Z0-9]+)(?:\s[^<>]*?)?\sdata-i18n="([a-zA-Z0-9_.]+)"[^<>]*>/g;
  let result = '';
  let lastIndex = 0;
  let match;
  while ((match = openTagRe.exec(html)) !== null) {
    const [full, tagName, key] = match;
    const openTagEnd = match.index + full.length;
    const closeIdx = findMatchingClose(html, openTagEnd, tagName);
    const value = translate(lang, key);
    result += html.slice(lastIndex, openTagEnd);
    result += value;
    result += `</${tagName}>`;
    lastIndex = closeIdx + tagName.length + 3; // length of "</tagName>"
    openTagRe.lastIndex = lastIndex;
  }
  result += html.slice(lastIndex);
  return result;
}

// --- attribute-only i18n bindings (data-i18n-X paired with a real
// attribute that appears just before it in the same tag) ---
const ATTR_PAIRS = [
  ['content', 'content'],
  ['placeholder', 'placeholder'],
  ['alt', 'alt'],
  ['aria-label', 'aria-label'],
  ['tooltip', 'data-tooltip']
];
function replaceAttrI18n(html, lang, i18nAttr, realAttr) {
  const re = new RegExp(
    `(<[a-zA-Z0-9]+[^<>]*?\\s${realAttr}=")[^"]*("[^<>]*?\\sdata-i18n-${i18nAttr}="([a-zA-Z0-9_.]+)"[^<>]*>)`,
    'g'
  );
  return html.replace(re, (m, pre, post, key) => {
    const value = String(translate(lang, key)).replace(/"/g, '&quot;');
    return `${pre}${value}${post}`;
  });
}

// --- build one page in one language ---
function buildPage(page, lang) {
  let html = fs.readFileSync(path.join(TEMPLATES_DIR, page.templateFile), 'utf8');

  // 1. lang attribute
  html = html.replace('__LANG__', lang);

  // 2. prefix this template's own internal PAGE links for English, before
  // any generated placeholder content (which already has correct URLs) is
  // inserted -- so the blind prefix below can never touch those. Excludes
  // /css/, /js/, /assets/: those are shared static files, not per-language
  // pages, and must resolve the same way from both root and en/ (the build
  // output's en/ pages are nested one level deeper on disk, but these are
  // root-relative URLs, which the browser resolves the same regardless of
  // nesting -- so they must NOT also get the /en prefix).
  if (lang === 'en') {
    html = html.replace(/href="\/(?!css\/|js\/|assets\/)/g, 'href="/en/');
  }

  // 3. SEO head (canonical + hreflang) and the literal __SELF_URL__ token
  // used in og:url
  html = html.replace('<!--__SEO_HEAD__-->', buildSeoHead(page.slug, lang));
  html = html.split('__SELF_URL__').join(absoluteUrl(page.slug, lang));

  // 4. JSON-LD blocks (only the ones each template actually has a
  // placeholder for)
  html = html.replace('<!--__JSONLD_PROFESSIONAL_SERVICE__-->', () => buildProfessionalServiceJsonLd(lang));
  html = html.replace('<!--__JSONLD_SERVICE__-->', () => buildServiceJsonLd(lang));
  html = html.replace('<!--__JSONLD_FAQ__-->', () => buildFaqJsonLd(lang));
  if (page.breadcrumbKey) {
    html = html.replace('<!--__JSONLD_BREADCRUMB__-->', () => buildBreadcrumbJsonLd(lang, page.slug, page.breadcrumbKey));
  }

  // 5. language toggle (real cross-language link, not a JS switch)
  html = html.replace('<!--__LANG_TOGGLE__-->', () => buildLangToggle(page.slug, lang));

  // 6. all data-i18n content, then attribute, bindings
  html = replaceDataI18nContent(html, lang);
  for (const [i18nAttr, realAttr] of ATTR_PAIRS) {
    html = replaceAttrI18n(html, lang, i18nAttr, realAttr);
  }

  // 7. the one i18n string that embeds its own internal link (the quiz's
  // privacy-policy consent line) -- everything else was already prefixed
  // in step 2, but this text only exists from this point on, once step 6
  // has pulled it in from js/i18n-strings.js.
  if (lang === 'en') {
    html = html.split('href="/privacy"').join('href="/en/privacy"');
  }

  const outPath = outputPath(page.slug, lang);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  return outPath;
}

// --- sitemap.xml: one <url> per page per language, each carrying
// xhtml:link alternates to its sibling and to x-default (always ja), so
// the two language versions are listed as a reciprocal pair rather than
// one URL standing in for both (now that they're genuinely separate
// static pages, not one URL behind a client-side toggle) ---
function buildSitemapEntry(page, lang, today) {
  const selfUrl = absoluteUrl(page.slug, lang);
  const jaUrl = absoluteUrl(page.slug, 'ja');
  const enUrl = absoluteUrl(page.slug, 'en');
  return [
    '  <url>',
    `    <loc>${selfUrl}</loc>`,
    `    <xhtml:link rel="alternate" hreflang="ja" href="${jaUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${jaUrl}"/>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    '  </url>'
  ].join('\n');
}
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [];
  for (const page of PAGES) {
    entries.push(buildSitemapEntry(page, 'ja', today));
    entries.push(buildSitemapEntry(page, 'en', today));
  }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!--',
    '  Generated by scripts/build.js from the same PAGES registry used to',
    '  build the HTML, so it can never list a page that does not exist or',
    '  miss one that does. lastmod is set to the date this file was last',
    '  generated; rerun the build after any content change to refresh it.',
    '',
    '  Each page now has two real, separate URLs (ja at the root, en under',
    '  /en/), so each gets its own url entry with reciprocal xhtml:link',
    '  alternates to its sibling and to x-default (always the ja version).',
    '-->',
    '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.join('\n'),
    '</urlset>',
    ''
  ].join('\n');
  const outPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  return outPath;
}

function main() {
  const written = [];
  for (const page of PAGES) {
    written.push(buildPage(page, 'ja'));
    written.push(buildPage(page, 'en'));
  }
  written.push(buildSitemap());
  console.log(`Built ${written.length} files:`);
  written.forEach(p => console.log('  ' + path.relative(ROOT, p)));
}

main();
