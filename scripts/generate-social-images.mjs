import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'social-assets');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// ============================================
// WIZL Brand Palette (from globals.css)
// ============================================
const W = {
  bg: '#080c08',
  green: '#2d8a6e',
  purple: '#9678b8',
  orange: '#c4956a',
  love: '#b87da8',
  muted: '#6b7280',
};

// Geist font path
const GEIST = join(ROOT, 'node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf');
const geistFont = readFileSync(GEIST);

const wizlLogo = join(ROOT, 'public', 'logo-mark.png');

const sizes = {
  'profile-1080': { w: 1080, h: 1080 },
  'profile-400': { w: 400, h: 400 },
  'banner-twitter': { w: 1500, h: 500 },
  'banner-youtube': { w: 2560, h: 1440 },
  'banner-linkedin': { w: 1584, h: 396 },
  'story-1080x1920': { w: 1080, h: 1920 },
};

// Generate random fireflies SVG
function fireflies(w, h, count = 20) {
  const colors = [W.green, W.purple, W.orange, W.love];
  let dots = '';
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * w);
    const y = Math.round(Math.random() * h);
    const r = 1 + Math.random() * 3;
    const color = colors[i % colors.length];
    const opacity = 0.15 + Math.random() * 0.45;
    // Glow circle behind
    dots += `<circle cx="${x}" cy="${y}" r="${r * 6}" fill="${color}" opacity="${opacity * 0.3}" filter="url(#blur)"/>`;
    // Core dot
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  }
  return dots;
}

// "WIZL" text as SVG path-like with glow
function wizlText(w, h, fontSize, yPos) {
  return `
    <!-- Text glow layer -->
    <text x="${w/2}" y="${yPos}" text-anchor="middle"
          font-family="Geist, Arial, sans-serif" font-weight="800" font-size="${fontSize}"
          fill="none" stroke="#ffffff" stroke-width="2" opacity="0.15" filter="url(#textglow)"
          letter-spacing="${fontSize * 0.2}">WIZL</text>
    <!-- White text like interface -->
    <text x="${w/2}" y="${yPos}" text-anchor="middle"
          font-family="Geist, Arial, sans-serif" font-weight="800" font-size="${fontSize}"
          fill="#f0f0f0" letter-spacing="${fontSize * 0.2}">WIZL</text>
  `;
}

function tagline(w, yPos, size) {
  return `
    <text x="${w/2}" y="${yPos}" text-anchor="middle"
          font-family="Geist, Arial, sans-serif" font-weight="300" font-size="${size}"
          fill="#9ca3af" letter-spacing="${size * 0.3}" opacity="0.7">with love</text>
  `;
}

async function createWizlAssets() {
  const logo = await sharp(wizlLogo).toBuffer();

  for (const [name, { w, h }] of Object.entries(sizes)) {
    const isProfile = name.startsWith('profile');
    const isStory = name.startsWith('story');

    // Logo sizing
    const logoScale = isProfile ? 0.5 : isStory ? 0.35 : 0.22;
    const logoSize = Math.round(Math.min(w, h) * logoScale);
    const resizedLogo = await sharp(logo).resize(logoSize, logoSize, { fit: 'inside' }).toBuffer();
    const rMeta = await sharp(resizedLogo).metadata();

    const logoX = Math.round((w - rMeta.width) / 2);
    let logoY;
    if (isProfile) {
      logoY = Math.round(h * 0.18);
    } else if (isStory) {
      logoY = Math.round(h * 0.25);
    } else {
      logoY = Math.round(h * 0.1);
    }

    // Text positioning
    let textFontSize, textY, tagY, tagSize;
    if (isProfile) {
      textFontSize = Math.round(w * 0.18);
      textY = Math.round(h * 0.78);
      tagSize = Math.round(w * 0.05);
      tagY = textY + Math.round(tagSize * 1.8);
    } else if (isStory) {
      textFontSize = Math.round(w * 0.2);
      textY = Math.round(h * 0.6);
      tagSize = Math.round(w * 0.045);
      tagY = textY + Math.round(tagSize * 2);
    } else {
      textFontSize = Math.round(h * 0.22);
      textY = Math.round(h * 0.82);
      tagSize = Math.round(h * 0.065);
      tagY = textY + Math.round(tagSize * 1.8);
    }

    const fireflyCount = isProfile ? 15 : isStory ? 30 : 25;

    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wizl-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${W.green}"/>
          <stop offset="50%" stop-color="${W.purple}"/>
          <stop offset="100%" stop-color="${W.love}"/>
        </linearGradient>
        <radialGradient id="center-glow" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="${W.green}" stop-opacity="0.12"/>
          <stop offset="35%" stop-color="${W.purple}" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="${W.bg}" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="textglow"><feGaussianBlur stdDeviation="6"/></filter>
        <!-- Subtle noise texture -->
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply" result="noisy"/>
          <feComposite in="SourceGraphic" in2="noisy" operator="over"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${w}" height="${h}" fill="${W.bg}"/>

      <!-- Subtle radial glow -->
      <ellipse cx="${w/2}" cy="${h * 0.45}" rx="${w * 0.5}" ry="${h * 0.5}" fill="url(#center-glow)"/>

      <!-- Secondary glow spots -->
      <ellipse cx="${w * 0.2}" cy="${h * 0.7}" rx="${w * 0.15}" ry="${h * 0.15}" fill="${W.purple}" opacity="0.04" filter="url(#blur)"/>
      <ellipse cx="${w * 0.8}" cy="${h * 0.3}" rx="${w * 0.12}" ry="${h * 0.12}" fill="${W.green}" opacity="0.05" filter="url(#blur)"/>

      <!-- Fireflies -->
      ${fireflies(w, h, fireflyCount)}

      <!-- WIZL text with glow -->
      ${wizlText(w, h, textFontSize, textY)}

      <!-- Tagline -->
      ${tagline(w, tagY, tagSize)}

      <!-- Bottom accent line -->
      <rect x="${w * 0.3}" y="${h - 3}" width="${w * 0.4}" height="2" rx="1" fill="url(#wizl-gradient)" opacity="0.5"/>
    </svg>`;

    await sharp(Buffer.from(svg))
      .composite([{ input: resizedLogo, left: logoX, top: logoY }])
      .png({ quality: 95 })
      .toFile(join(OUT, `wizl-${name}.png`));

    console.log(`✅ wizl-${name}.png (${w}x${h})`);
  }
}

// ============================================
// MYREPLY
// ============================================
const MR = { bg: '#faf9f7', teal: '#1E8B8B', navy: '#1A2332' };
const mrLogoSvg = readFileSync(join(ROOT, '..', 'MYREPLY', 'public', 'logo.svg'), 'utf-8');

async function createMyReplyAssets() {
  const logoBuffer = await sharp(Buffer.from(mrLogoSvg)).resize(1600, null, { fit: 'inside' }).png().toBuffer();

  for (const [name, { w, h }] of Object.entries(sizes)) {
    const isProfile = name.startsWith('profile');
    const logoScale = isProfile ? 0.65 : 0.3;
    const logoWidth = Math.round(w * logoScale);

    const resizedLogo = await sharp(logoBuffer).resize(logoWidth, null, { fit: 'inside' }).toBuffer();
    const rMeta = await sharp(resizedLogo).metadata();
    const logoX = Math.round((w - rMeta.width) / 2);
    const logoY = Math.round((h - rMeta.height) / 2) - (isProfile ? 0 : 15);

    let tagSvg = '';
    if (!isProfile) {
      const tagSize = Math.round(h * 0.055);
      const tagY = Math.round(h * 0.8);
      tagSvg = `<text x="${w/2}" y="${tagY}" text-anchor="middle"
                font-family="Geist, Arial, sans-serif" font-weight="400" font-size="${tagSize}"
                fill="${MR.teal}" letter-spacing="3" opacity="0.9">SMART AI REPLIES FOR YOUR BUSINESS</text>`;
    }

    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${MR.teal}" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="${MR.bg}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="${MR.bg}"/>
      <ellipse cx="${w/2}" cy="${h/2}" rx="${w*0.3}" ry="${h*0.3}" fill="url(#mr-glow)"/>
      ${tagSvg}
      <rect x="0" y="${h - 3}" width="${w}" height="3" fill="${MR.teal}" opacity="0.8"/>
    </svg>`;

    await sharp(Buffer.from(svg))
      .composite([{ input: resizedLogo, left: logoX, top: logoY }])
      .png({ quality: 95 })
      .toFile(join(OUT, `myreply-${name}.png`));

    console.log(`✅ myreply-${name}.png (${w}x${h})`);
  }
}

console.log('\n🎨 Generating WIZL social assets v2...\n');
await createWizlAssets();
console.log('\n🎨 Generating MyReply social assets v2...\n');
await createMyReplyAssets();
console.log(`\n✅ All done! Assets in: ${OUT}\n`);
