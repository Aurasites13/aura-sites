Project: Aura Sites, website for an AI-assisted web design studio

Attached is aura-sites.html, a working prototype with the hero (3D fly-through aura animation), an assembly demo, a portfolio section, and a pricing section already built. Treat its visual language (colors, typography, animation style, spacing) as the source of truth for everything below, match it, don't reinvent it. A CLAUDE.md file sits alongside it with standing brand rules (palette, pricing figures, copy rules) that should apply to everything you build.

Please build this incrementally, not all at once. Tackle the five sections below one at a time, in order. After finishing each one, stop and show me the result before moving to the next, don't build all five and then hand me one giant change to review.

Please also restructure this into a proper project (separate HTML/CSS/JS files, or a lightweight framework if you think it's warranted) as part of the first step, then build the following, which exist only as specs below, not in the file yet:

1. Process section upgrade: The existing assembly-block animation needs per-tier timing labels with a toggle (Launch / Grow / Studio tabs) above it. Same 3-step process for all tiers (Discovery call, First look, Live), but the day-counts change:
   - Launch: Day 1, Day 3, Day 7
   - Grow: Day 1, Day 5, Day 10 to 14
   - Studio: Day 1, scoped with you, scoped with you

2. Hosting add-on: Add an optional hosting line item, 3,500 to 5,000 yen per month, independent of tier (not bundled into any package, client opts in or out separately). Add small info-tap tooltips next to potentially unfamiliar terms:
   - Domain: "Your website's address, what people type to find you, like aurasites.com."
   - Hosting: "Where your website actually lives online. Without it, your site can't go live."
   - CMS: "A simple dashboard for editing your own text and photos later, no coding needed."

3. Smart branching questionnaire, replaces a static contact form, opens from any pricing tier's button or the nav Contact link:
   - Phase 1 (Basics): business name (text), one-line description (text), "Do you have a logo already?" Yes/No
   - Phase 2 (Scope): "Roughly how big is this?" then One page / A few pages (3 to 5) / A full site (6+, maybe a blog) / Not sure (if Not sure, show a checkbox list: Home, About, Services, Pricing, Testimonials, Contact, Blog, FAQ). Then: "Do you need online payments, bookings, or user logins?" Yes/No (if Yes, short text follow-up to describe it)
   - Phase 3 (Style and timeline): vibe pick, Clean & minimal / Warm & friendly / Bold & modern / Professional & corporate. Then: "When do you need it live?" ASAP / Within a month / Flexible
   - Phase 4 (Recommendation): suggest a tier based on scope, complexity, and timeline answers (roughly: 1 page and no complexity leads to Launch; 3 to 8 pages, no complexity leads to Grow; any payments/bookings/logins or 6+ pages leads to Studio). Capture name and email to submit.
   - Post-submit (optional, skippable): "You're in, got your logo or photos handy? Drop them now to speed things up, or skip and we'll sort it when we talk." Drag-and-drop upload or choose from folder, stock vs AI-generated choice if no photos, domain name field, hosting yes/no/not-sure question. All skippable with one tap, submission is already complete without this step.

4. Site-wide first-visit build-in animation: every section (nav, hero, portfolio cards, pricing cards, etc.) should snap/assemble into place the first time it scrolls into view, using the same visual language as the existing assembly-demo animation, short duration, small stagger between elements, restrained, not showy. Track "seen it before" (e.g. localStorage) so returning visitors don't see the build-in animation repeat on sections they've already scrolled past.

5. Remaining content sections (draft reasonable placeholder copy, I'll revise):
   - Social proof: generic-but-credible placeholder testimonials/stats, no real client feedback exists yet
   - "Why not a template": short two-line section contrasting templated vs designed-for-you
   - FAQ: turnaround, revisions, what's needed from the client, refund policy
   - Footer: shouldn't feel like an afterthought, carry the same dark/glow visual language down

Content style note: no em dashes anywhere in generated copy.
