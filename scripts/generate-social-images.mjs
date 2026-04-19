// Generate WIZL social media assets with new mascot branding.
// Usage: node scripts/generate-social-images.mjs

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, stat } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'social-assets');

// Brand palette
const C = {
  bg: '#10181F',
  bgDeep: '#0B1218',
  neon: '#99F788',
  purple: '#8C6FB8',
  gold: '#CE8E58',
  cream: '#F2E8D4',
  creamDim: '#C9BCA4',
  muted: '#7F8A96',
};

const FONT_STACK =
  "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, system-ui, sans-serif";

await mkdir(OUT, { recursive: true });

// ---------- helpers ----------

function solidBg(width, height, color = C.bg) {
  return sharp({
    create: { width, height, channels: 4, background: color },
  }).png();
}

async function radialGlow({ width, height, cx, cy, r, color, opacity = 0.55 }) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
        <stop offset="45%" stop-color="${color}" stop-opacity="${opacity * 0.35}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="transparent"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function verticalGradient(width, height, top, bottom) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${top}"/>
        <stop offset="100%" stop-color="${bottom}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function resizeTo(file, targetWidth) {
  const buf = await sharp(file).resize({ width: targetWidth }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

async function resizeToHeight(file, targetHeight) {
  const buf = await sharp(file).resize({ height: targetHeight }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

// ---------- profile pictures ----------

async function makeProfile(size, outName) {
  const mascotSize = Math.round(size * 0.78);
  const mascot = await resizeTo(path.join(PUBLIC, 'mascot.png'), mascotSize);

  const glow = await radialGlow({
    width: size, height: size,
    cx: size / 2, cy: size / 2,
    r: size * 0.42,
    color: C.neon, opacity: 0.45,
  });

  const out = path.join(OUT, outName);
  await (await solidBg(size, size, C.bg))
    .composite([
      { input: glow, left: 0, top: 0 },
      {
        input: mascot.buf,
        left: Math.round((size - mascot.w) / 2),
        top: Math.round((size - mascot.h) / 2),
      },
    ])
    .png()
    .toFile(out);
  return out;
}

// ---------- banners ----------

async function makeBanner({ width, height, outName, wordmarkSize, taglineSize, mascotHeight }) {
  const bg = await solidBg(width, height, C.bg);

  // Cap mascot height so it always fits
  const cappedMascotHeight = Math.min(mascotHeight, Math.round(height * 0.92));
  const mascot = await resizeToHeight(
    path.join(PUBLIC, 'logo-mark-transparent.png'),
    cappedMascotHeight
  );
  // Also clamp width so it doesn't blow past the left 40% of canvas
  let mascotBuf = mascot.buf, mW = mascot.w, mH = mascot.h;
  const maxMascotW = Math.round(width * 0.38);
  if (mW > maxMascotW) {
    const resized = await resizeTo(path.join(PUBLIC, 'logo-mark-transparent.png'), maxMascotW);
    mascotBuf = resized.buf; mW = resized.w; mH = resized.h;
  }
  const mascotLeft = Math.round(width * 0.05);
  const mascotTop = Math.round((height - mH) / 2);

  // Glow sized to canvas (never larger than canvas)
  const glow = await radialGlow({
    width, height,
    cx: mascotLeft + mW / 2,
    cy: mascotTop + mH / 2,
    r: Math.min(mW, mH) * 0.75,
    color: C.neon, opacity: 0.28,
  });

  const textCx = Math.round(width * 0.60);
  const textCy = Math.round(height / 2);
  const wm = wordmarkSize;
  const tg = taglineSize;
  const gap = Math.round(wm * 0.22);

  const textSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <style>
      .wm { font-family: ${FONT_STACK}; font-weight: 900; font-size: ${wm}px;
            fill: ${C.cream}; letter-spacing: ${Math.round(wm * 0.04)}px; }
      .tg { font-family: ${FONT_STACK}; font-weight: 300; font-size: ${tg}px;
            fill: ${C.creamDim}; letter-spacing: ${Math.round(tg * 0.12)}px; }
    </style>
    <text x="${textCx}" y="${textCy - gap}" class="wm"
          text-anchor="middle" dominant-baseline="alphabetic">WIZL</text>
    <text x="${textCx}" y="${textCy + tg + gap}" class="tg"
          text-anchor="middle" dominant-baseline="alphabetic">Scan it. Know it. Track it.</text>
  </svg>`;
  const textBuf = await sharp(Buffer.from(textSvg)).png().toBuffer();

  const out = path.join(OUT, outName);
  await bg
    .composite([
      { input: glow, left: 0, top: 0 },
      { input: mascotBuf, left: mascotLeft, top: mascotTop },
      { input: textBuf, left: 0, top: 0 },
    ])
    .png()
    .toFile(out);
  return out;
}

// ---------- story ----------

async function makeStory(width, height, outName) {
  const bgBuf = await verticalGradient(width, height, C.bg, C.bgDeep);

  const hero = await resizeTo(
    path.join(PUBLIC, 'hero-wizl.png'),
    Math.round(width * 0.92)
  );
  const heroTop = Math.round(height * 0.08);
  const heroLeft = Math.round((width - hero.w) / 2);

  const floorGlow = await radialGlow({
    width, height: Math.round(height * 0.5),
    cx: width / 2, cy: Math.round(height * 0.25),
    r: width * 0.55,
    color: C.neon, opacity: 0.14,
  });

  const out = path.join(OUT, outName);
  await sharp(bgBuf)
    .composite([
      { input: floorGlow, left: 0, top: Math.round(height * 0.55) },
      { input: hero.buf, left: heroLeft, top: heroTop },
    ])
    .png()
    .toFile(out);
  return out;
}

// ---------- run ----------

const jobs = [
  ['wizl-profile-1080.png', () => makeProfile(1080, 'wizl-profile-1080.png')],
  ['wizl-profile-400.png',  () => makeProfile(400,  'wizl-profile-400.png')],

  ['wizl-banner-twitter.png',  () => makeBanner({
    width: 1500, height: 500, outName: 'wizl-banner-twitter.png',
    wordmarkSize: 180, taglineSize: 34, mascotHeight: 420,
  })],
  ['wizl-banner-youtube.png',  () => makeBanner({
    width: 2560, height: 1440, outName: 'wizl-banner-youtube.png',
    wordmarkSize: 360, taglineSize: 64, mascotHeight: 900,
  })],
  ['wizl-banner-linkedin.png', () => makeBanner({
    width: 1584, height: 396, outName: 'wizl-banner-linkedin.png',
    wordmarkSize: 150, taglineSize: 28, mascotHeight: 330,
  })],

  ['wizl-story-1080x1920.png', () => makeStory(1080, 1920, 'wizl-story-1080x1920.png')],
];

for (const [name, fn] of jobs) {
  const p = await fn();
  const s = await stat(p);
  const meta = await sharp(p).metadata();
  console.log(`  ok  ${name}  ${meta.width}x${meta.height}  ${(s.size / 1024).toFixed(1)} KB`);
}

console.log('\nDone. Output:', OUT);
