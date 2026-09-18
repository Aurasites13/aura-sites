// Netlify Forms "submission-created" event function.
//
// Netlify invokes a function with exactly this filename automatically after
// every form submission on the site (this is Netlify's documented naming
// convention, not a name we chose; renaming this file stops it from firing).
// It does not change how the questionnaire submits in js/quiz.js, it only
// reacts to the submission Netlify already received and sends a nicely
// designed HTML email via Resend (https://resend.com) instead of relying on
// Netlify's own plain-text notification email.
//
// Before this works in production, set these in Netlify's dashboard under
// Site settings -> Environment variables:
//   RESEND_API_KEY   Your Resend API key (Resend dashboard -> API Keys)
//   TO_EMAIL         The address that should receive new inquiries
//   FROM_EMAIL       Optional. Defaults to onboarding@resend.dev (Resend's
//                    shared testing address). For production, verify your
//                    own sending domain in Resend and set this to an address
//                    on that domain, e.g. "Aura Sites <aurasitesstudio@gmail.com>".
//
// Steps still needed on the Resend side: sign up at resend.com, verify a
// sending domain (or use their onboarding@resend.dev domain for testing),
// then generate an API key.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Fields shown in the email body, in display order. `enum: true` fields get
// light formatting (hyphens to spaces, capitalized) since their values are
// fixed option-card choices like "few" or "notsure"; everything else is shown
// exactly as submitted since it's free text the visitor typed themselves.
const FIELD_DEFS = [
  { key: 'business-name', label: 'Business name' },
  { key: 'description', label: 'One-line description' },
  { key: 'has-logo', label: 'Has a logo already', enum: true },
  { key: 'size', label: 'Scope', enum: true },
  { key: 'pages', label: 'Pages needed' },
  { key: 'complexity', label: 'Needs payments, bookings, or logins', enum: true },
  { key: 'complexity-detail', label: 'Complexity details' },
  { key: 'vibe', label: 'Vibe', enum: true },
  { key: 'recommended-tier', label: 'Recommended tier', enum: true },
  { key: 'logo-design-request', label: 'Wants a logo designed', enum: true },
  { key: 'logo-files', label: 'Logo files uploaded', file: true },
  { key: 'photo-choice', label: 'Photo choice', enum: true },
  { key: 'files', label: 'Photo files uploaded', file: true },
  { key: 'domain', label: 'Domain' },
  { key: 'hosting-interest', label: 'Interested in hosting', enum: true }
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Known option-card values, matching the questionnaire's own English labels
// (js/i18n-strings.js) so the email reads naturally instead of showing raw
// values like "notsure" or "corporate". Anything not in this map falls back to a
// simple hyphen-to-space, capitalized rendering.
const VALUE_LABELS = {
  yes: 'Yes',
  no: 'No',
  notsure: 'Not sure',
  one: 'One page',
  few: 'A few pages (3 to 5)',
  full: 'A full site (6+, maybe a blog)',
  clean: 'Clean & minimal',
  warm: 'Warm & friendly',
  bold: 'Bold & modern',
  corporate: 'Professional & corporate',
  launch: 'Launch',
  grow: 'Grow',
  studio: 'Studio',
  stock: 'Use stock photos',
  ai: 'Use AI-generated'
};

function humanizeEnum(value) {
  const key = String(value).toLowerCase();
  if (VALUE_LABELS[key]) return VALUE_LABELS[key];
  return String(value)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldRowHtml(label, value, opts = {}) {
  const content = opts.raw ? value : escapeHtml(value);
  return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="font-family:Helvetica,Arial,sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#6E8291; margin-bottom:3px;">${escapeHtml(label)}</div>
        <div style="font-family:Helvetica,Arial,sans-serif; font-size:15px; line-height:1.5; color:#EAF6FF;">${content}</div>
      </td>
    </tr>`;
}

// Netlify's own default notification email resolves a file field straight to
// its stored-file URL as a plain string (confirmed against a real submission:
// same field, same file, shown correctly there). This function's webhook
// payload apparently doesn't always hand us that same plain string though -
// that's what was producing the literal "[object Object]" text, so this
// handles a string, a { url, filename } style object, or an array of either
// (for the `multiple` file inputs), and falls back to the raw JSON instead of
// a useless "[object Object]" for any shape not accounted for here.
function fileLinksHtml(value) {
  const files = Array.isArray(value) ? value : [value];
  return files
    .map((f) => {
      if (typeof f === 'string') {
        let label = f;
        try { label = decodeURIComponent(f.split('/').pop()); } catch (e) { /* keep raw */ }
        return `<a href="${escapeHtml(f)}" style="color:#4DE8FF; text-decoration:none;">${escapeHtml(label)}</a>`;
      }
      if (f && typeof f === 'object') {
        const url = f.url || f.Url || f.link || f.path;
        if (url) {
          const label = f.filename || f.name || url;
          return `<a href="${escapeHtml(url)}" style="color:#4DE8FF; text-decoration:none;">${escapeHtml(label)}</a>`;
        }
        return escapeHtml(JSON.stringify(f));
      }
      return escapeHtml(String(f));
    })
    .join('<br>');
}

function buildEmailHtml(data) {
  const name = data.name || '(no name given)';
  const email = data.email || '';
  const stage = data['submission-stage'];
  let stageBadgeColor = '#FF9F45';
  let stageBadgeText = 'Initial submission';
  if (stage === 'extras') {
    stageBadgeColor = '#4DE8FF';
    stageBadgeText = 'Includes post-submit extras';
  } else if (stage === 'partial') {
    // Fired right after Phase 1 (business name, description, email) so
    // there's a contactable record even if the visitor never finishes.
    stageBadgeColor = '#1F8FE8';
    stageBadgeText = 'Early capture (left after phase 1)';
  }

  const rows = FIELD_DEFS
    .filter((f) => data[f.key] && String(data[f.key]).trim() !== '')
    .map((f) => {
      if (f.file) return fieldRowHtml(f.label, fileLinksHtml(data[f.key]), { raw: true });
      return fieldRowHtml(f.label, f.enum ? humanizeEnum(data[f.key]) : data[f.key]);
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New project inquiry</title>
</head>
<body style="margin:0; padding:0; background-color:#05060A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#05060A; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#000000; border:1px solid rgba(77,232,255,0.25); border-radius:14px;">
          <tr>
            <td style="padding:32px 32px 20px; border-bottom:1px solid rgba(77,232,255,0.15);">
              <div style="font-family:Georgia,serif; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:#4DE8FF; margin-bottom:10px;">Aura Sites</div>
              <div style="font-family:Helvetica,Arial,sans-serif; font-size:22px; font-weight:700; color:#EAF6FF; margin-bottom:12px;">New project inquiry</div>
              <span style="display:inline-block; font-family:Helvetica,Arial,sans-serif; font-size:11px; font-weight:600; letter-spacing:0.03em; color:#05060A; background-color:${stageBadgeColor}; padding:4px 10px; border-radius:100px;">${stageBadgeText}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 4px;">
              <div style="font-family:Helvetica,Arial,sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#6E8291; margin-bottom:4px;">From</div>
              <div style="font-family:Helvetica,Arial,sans-serif; font-size:19px; font-weight:600; color:#EAF6FF; margin-bottom:4px;">${escapeHtml(name)}</div>
              ${email ? `<div style="font-family:Helvetica,Arial,sans-serif; font-size:15px;"><a href="mailto:${escapeHtml(email)}" style="color:#4DE8FF; text-decoration:none;">${escapeHtml(email)}</a></div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
            </td>
          </tr>
        </table>
        <div style="max-width:560px; margin:20px auto 0; font-family:Helvetica,Arial,sans-serif; color:#6E8291; font-size:12px; text-align:center;">
          Sent automatically from the Aura Sites questionnaire.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || '{}');
    const data = (payload && payload.data) || {};

    // Extra spam guard: Netlify's own honeypot check normally filters these
    // out before this function even runs, but skip sending just in case.
    if (data['bot-field']) {
      return { statusCode: 200, body: 'Skipped (honeypot triggered)' };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.TO_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'Aura Sites <onboarding@resend.dev>';

    if (!apiKey || !toEmail) {
      console.error('submission-created: missing RESEND_API_KEY or TO_EMAIL environment variable');
      return { statusCode: 200, body: 'Email not sent: missing configuration' };
    }

    const subjectName = data.name || data.email || 'a new lead';
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `New project inquiry: ${subjectName}`,
        html: buildEmailHtml(data)
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('submission-created: Resend API error', res.status, errText);
      return { statusCode: 200, body: 'Email not sent: Resend API error' };
    }

    return { statusCode: 200, body: 'Email sent' };
  } catch (err) {
    console.error('submission-created: unexpected error', err);
    return { statusCode: 200, body: 'Email not sent: unexpected error' };
  }
};
