import fs from 'fs';
import path from 'path';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const outPath = path.join(root, 'docs/client-updates/2026-03-11/screenshotone-urls.json');
const htmlPath = path.join(root, 'docs/client-updates/2026-03-11/rips-win-client-update-2026-03-11.html');
const screenshotsDir = path.join(root, 'docs/client-updates/2026-03-11/screenshots');
const productionUrls = {
  homepage: 'https://rips.win/',
  bonuses: 'https://rips.win/bonuses',
  clips: 'https://rips.win/#videos',
  footer: 'https://rips.win/',
};

function buildHtml(imageUrls) {
  const lede = 'Here’s a polished visual recap of the completed work. The screenshots below are embedded via CDN so this file stays fully portable, and the outbound links point to the live production build.';
  const footerNote = 'Status: reviewed, tested, shipped, and merged. This export is self-contained as a single HTML file with CDN-hosted screenshots and production links.';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rips.win Client Update — March 11, 2026</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin: 0; font: 16px/1.6 Inter, ui-sans-serif, system-ui, sans-serif; background: #09090b; color: #fafafa; }
      .wrap { max-width: 1180px; margin: 0 auto; padding: 48px 24px 72px; }
      .hero { margin-bottom: 32px; }
      .eyebrow { color: #f59e0b; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; }
      h1 { font-size: clamp(32px, 5vw, 56px); line-height: 1.05; margin: 8px 0 16px; }
      .lede { max-width: 820px; color: #d4d4d8; font-size: 18px; }
      .summary, .requests { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 24px 0 8px; padding: 0; list-style: none; }
      .summary li, .request, .card { background: linear-gradient(180deg, #18181b, #111114); border: 1px solid #27272a; border-radius: 20px; }
      .summary li { padding: 16px 18px; color: #e4e4e7; }
      .request { padding: 18px; }
      .request-label { color: #fbbf24; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .request h3 { margin: 8px 0 8px; font-size: 18px; }
      .request p { margin: 0; color: #d4d4d8; }
      .grid { display: grid; gap: 24px; }
      .card { overflow: hidden; }
      .card-copy { padding: 22px 22px 8px; }
      h2 { margin: 0 0 10px; font-size: 28px; }
      .card p { margin: 0; color: #d4d4d8; }
      .card ul { margin: 14px 0 0; padding-left: 20px; color: #e4e4e7; }
      .shot { display: block; width: 100%; height: auto; border-top: 1px solid #27272a; background: #050505; }
      .footer-note { margin-top: 28px; color: #a1a1aa; font-size: 14px; }
      a { color: #fbbf24; }
      @media (min-width: 960px) { .grid { grid-template-columns: 1fr 1fr; } .card.wide { grid-column: 1 / -1; } }
      @page { size: Letter; margin: .45in; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .wrap { max-width: none; padding: 0; }
        .hero { margin-bottom: 20px; }
        .eyebrow { font-size: 11px; }
        h1 { font-size: 34px; margin-bottom: 12px; }
        .lede { max-width: none; font-size: 15px; }
        .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }
        .requests { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }
        .summary li, .request { padding: 12px 14px; }
        .request-label { font-size: 11px; }
        .request h3 { margin: 6px 0; font-size: 15px; }
        .request p, .summary li, .card p, .card ul, .footer-note { font-size: 13px; line-height: 1.45; }
        .grid { grid-template-columns: 1fr !important; gap: 16px; }
        .request, .card, .card-copy, .shot, .footer-note { break-inside: avoid; page-break-inside: avoid; }
        h1, h2, h3, p, ul { break-after: avoid; page-break-after: avoid; }
        .request, .card { margin-bottom: 16px; }
        .card-copy { padding: 18px 18px 8px; }
        h2 { font-size: 22px; margin-bottom: 8px; }
        .card ul { margin-top: 10px; }
        .shot { width: auto; max-width: 100%; margin: 0 auto; }
        .card.wide .shot { max-height: 7.8in; }
        .card:not(.wide) .shot { max-height: 4.1in; }
        .footer-note { margin-top: 16px; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <header class="hero">
        <div class="eyebrow">Client update</div>
        <h1>Rips.win updates completed on March 11, 2026</h1>
        <p class="lede">${lede}</p>
        <ul class="summary">
          <li>Clearer Stake market guidance</li>
          <li>Manual market switcher in the footer</li>
          <li>Homepage bonuses now visible</li>
          <li>Full-card clickable bonus cards</li>
          <li>Clips updated to the new videos</li>
          <li>Shorts + standard videos display correctly</li>
        </ul>

        <section>
          <h2>Requested updates</h2>
          <div class="requests">
            <article class="request">
              <div class="request-label">Request 1</div>
              <h3>Clarify market guidance and move it into the footer</h3>
              <p>Simplify the Stake.us vs. Stake.com messaging, make it less intrusive, and allow visitors to switch manually if the default looks wrong.</p>
            </article>
            <article class="request">
              <div class="request-label">Request 2</div>
              <h3>Add the real bonuses to the homepage</h3>
              <p>Show the same shared bonus cards used on <code>/bonuses</code> and make the full card clickable instead of only the button.</p>
            </article>
            <article class="request">
              <div class="request-label">Request 3</div>
              <h3>Refresh the clips section with the new videos</h3>
              <p>Replace the old clips, support both Shorts and standard YouTube formats correctly, and keep the carousel visually consistent.</p>
            </article>
          </div>
        </section>
      </header>

      <section class="grid">
        <article class="card wide">
          <div class="card-copy">
            <h2>Homepage overview</h2>
            <p>This full-page capture shows how the updated homepage now flows after the requested changes were applied.</p>
            <p><a href="${productionUrls.homepage}" target="_blank" rel="noopener noreferrer">Open production homepage</a></p>
          </div>
          <img class="shot" src="${imageUrls.homepageFull}" alt="Full homepage overview" />
        </article>

        <article class="card">
          <div class="card-copy">
            <h2>Bonuses added to the homepage</h2>
            <ul>
              <li>Added the live bonus cards directly to the homepage.</li>
              <li>Matched homepage bonuses to the shared <code>/bonuses</code> content and cards.</li>
              <li>Made each full bonus card clickable for a cleaner experience.</li>
            </ul>
            <p><a href="${productionUrls.bonuses}" target="_blank" rel="noopener noreferrer">Open production bonuses page</a></p>
          </div>
          <img class="shot" src="${imageUrls.bonuses}" alt="Homepage bonuses section" />
        </article>

        <article class="card">
          <div class="card-copy">
            <h2>Clips section refreshed</h2>
            <ul>
              <li>Replaced the previous clips with the two new YouTube videos provided.</li>
              <li>Shorts now display in portrait while standard YouTube videos display in landscape.</li>
              <li>The carousel still keeps a consistent visual height.</li>
            </ul>
            <p><a href="${productionUrls.clips}" target="_blank" rel="noopener noreferrer">Open production clips section</a></p>
          </div>
          <img class="shot" src="${imageUrls.clips}" alt="Latest clips section" />
        </article>

        <article class="card wide">
          <div class="card-copy">
            <h2>Footer market guidance update</h2>
            <ul>
              <li>Moved the market guidance into the footer for a less intrusive layout.</li>
              <li>Reworded the copy to better explain United States vs. international link choice.</li>
              <li>Added a simple market switcher so visitors can override the default if needed.</li>
            </ul>
            <p><a href="${productionUrls.footer}" target="_blank" rel="noopener noreferrer">Open production homepage footer</a></p>
          </div>
          <img class="shot" src="${imageUrls.footer}" alt="Footer market guidance and market switcher" />
        </article>
      </section>

      <p class="footer-note">${footerNote}</p>
    </main>
  </body>
</html>
`;
}

function readEnv(name) {
  const text = fs.readFileSync(envPath, 'utf8');
  const match = text.match(new RegExp(`^${name}=(.*)$`, 'm'));
  if (!match) {
    throw new Error(`Missing ${name} in .env.local`);
  }
  const raw = match[1].trim();
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }
  return raw;
}

async function take(accessKey, paramsObj) {
  const requestBody = {
    access_key: accessKey,
    format: 'png',
    response_type: 'json',
    cache: true,
    cache_ttl: 2592000,
    block_cookie_banners: true,
    block_chats: true,
    block_ads: true,
    block_trackers: true,
    delay: 2,
    timeout: 60,
    ...paramsObj,
  };

  const response = await fetch('https://api.screenshotone.com/take', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  const body = await response.json();
  return {
    status: response.status,
    cache_url: body.cache_url ?? null,
    screenshot_url: body.screenshot_url ?? null,
    error_code: body.error_code ?? body.error ?? null,
    error_message: body.error_message ?? null,
  };
}

function buildDataUri(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const base64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${base64}`;
}

function buildEmbeddedImageHtml(filePath) {
  const src = buildDataUri(filePath);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: #050505; }
      img { display: block; width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <img src="${src}" alt="Embedded client update screenshot" />
  </body>
</html>`;
}

function requireCacheUrl(name, result) {
  if (!result.cache_url) {
    throw new Error(`Missing cache_url for ${name}: ${result.error_code ?? 'unknown_error'} ${result.error_message ?? ''}`.trim());
  }
  return result.cache_url;
}

async function main() {
  const accessKey = readEnv('SS_ONE_API');
  const jobs = {
    homepageFull: {
      html: buildEmbeddedImageHtml(path.join(screenshotsDir, 'homepage-full.png')),
      full_page: true,
      viewport_width: 1440,
      viewport_height: 2200,
      image_width: 1440,
      wait_until: ['load'],
      cache_key: 'ripswinclientupdate20260311homepagefullv5',
    },
    bonuses: {
      html: buildEmbeddedImageHtml(path.join(screenshotsDir, 'bonuses.png')),
      full_page: true,
      viewport_width: 1440,
      viewport_height: 1800,
      image_width: 1440,
      wait_until: ['load'],
      cache_key: 'ripswinclientupdate20260311bonusesv5',
    },
    clips: {
      html: buildEmbeddedImageHtml(path.join(screenshotsDir, 'clips.png')),
      full_page: true,
      viewport_width: 1440,
      viewport_height: 1600,
      image_width: 1440,
      wait_until: ['load'],
      cache_key: 'ripswinclientupdate20260311clipsv5',
    },
    footer: {
      html: buildEmbeddedImageHtml(path.join(screenshotsDir, 'footer-market.png')),
      full_page: true,
      viewport_width: 1440,
      viewport_height: 1800,
      image_width: 1440,
      wait_until: ['load'],
      cache_key: 'ripswinclientupdate20260311footerv5',
    },
  };

  const results = {};
  for (const [name, params] of Object.entries(jobs)) {
    results[name] = await take(accessKey, params);
  }

  const imageUrls = {
    homepageFull: requireCacheUrl('homepageFull', results.homepageFull),
    bonuses: requireCacheUrl('bonuses', results.bonuses),
    clips: requireCacheUrl('clips', results.clips),
    footer: requireCacheUrl('footer', results.footer),
  };
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n', 'utf8');
  fs.writeFileSync(htmlPath, buildHtml(imageUrls), 'utf8');
  console.log(`Wrote ${path.relative(root, outPath)}`);
  console.log(`Wrote ${path.relative(root, htmlPath)}`);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

