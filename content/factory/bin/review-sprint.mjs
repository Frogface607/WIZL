#!/usr/bin/env node
/**
 * WIZL Sprint Review — automatic per-slide QA via Claude Vision (no SDK deps).
 *
 * Usage:
 *   node content/factory/bin/review-sprint.mjs content/posts/2026-05-14-adventures/05-og-kush-oath
 *
 * Output:
 *   review.md, review.json, regenerate.list (in episode folder)
 *
 * Requires env ANTHROPIC_API_KEY
 */
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("usage: review-sprint.mjs <episode-folder>");
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("missing ANTHROPIC_API_KEY env var");
  process.exit(1);
}

const slides = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith("slide-") && f.endsWith(".png"))
  .sort();

const RUBRIC = `
You are reviewing a single slide from a WIZL cannabis-storybook carousel.

CANONICAL CHARACTER (Wizl):
- Anthropomorphic otter wizard
- Purple traveling cloak with moon-and-star patches
- Pointed wizard hat with a small green crystal/leaf pin on brim
- Gnarled wooden staff topped with glowing emerald-green crystal
- Leather satchel with a sleeping orange cat peeking out
- Sturdy brown boots
- Warm storybook painterly cartoon style (NOT vector, NOT photoreal)

HARD RULES (any violation = regenerate=true):
1. Exactly ONE Wizl character per slide. No duplicates, no reflections that read as a second Wizl, no twin compositions.
2. NO humans. Only fantasy creatures (otter, mushroom-folk, tanuki, kinnari, badger, fox, monkey-spirits, dragonfly, mole, etc).
3. Cat in satchel present (orange tabby) unless story explicitly removes it (e.g. cat escaped scene).
4. Mascot palette: purple cloak (#8C6FB8), green crystal (#99F788). NOT red/gold/blue cloak.

SOFT CHECKS:
- Overlay text legible, no typos, English correct
- Caption box / speech bubble well-placed, doesn't crop important elements
- Bangkok-mystic vibe present where relevant
- Composition: breathable, character grounded

OUTPUT — strict JSON only, no fences, no prose:
{
  "ok": <bool>,
  "score": <1-10>,
  "issues": [{"severity": "high"|"med"|"low", "what": "<one-line>"}],
  "regenerate": <bool>,
  "notes": "<one sentence overall>"
}
`.trim();

async function reviewSlide(fullPath) {
  const imgData = fs.readFileSync(fullPath).toString("base64");
  const body = {
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: imgData },
          },
          { type: "text", text: RUBRIC },
        ],
      },
    ],
  };

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  const text = data.content[0].text.trim();
  const cleaned = text.replace(/^```(?:json)?\s*|```\s*$/g, "");
  return JSON.parse(cleaned);
}

const reviews = [];
const regenerate = [];

for (const slide of slides) {
  const fullPath = path.join(dir, slide);
  process.stdout.write(`  ${slide} … `);

  try {
    const json = await reviewSlide(fullPath);
    reviews.push({ slide, ...json });
    if (json.regenerate) regenerate.push(slide);
    console.log(`${json.ok ? "OK" : "❌"} (${json.score}/10)`);
  } catch (err) {
    console.log(`ERR: ${err.message.slice(0, 100)}`);
    reviews.push({
      slide,
      ok: false,
      score: 0,
      issues: [{ severity: "high", what: err.message.slice(0, 200) }],
      regenerate: true,
      notes: "API error",
    });
    regenerate.push(slide);
  }
}

fs.writeFileSync(path.join(dir, "review.json"), JSON.stringify(reviews, null, 2));

const okCount = reviews.filter((r) => r.ok).length;
const avg = reviews.reduce((a, r) => a + (r.score || 0), 0) / reviews.length;

const md = [
  `# Sprint Review — ${path.basename(dir)}`,
  `*${new Date().toISOString()}*`,
  ``,
  `**${reviews.length} slides · ${okCount} OK · ${regenerate.length} need regen · avg ${avg.toFixed(1)}/10**`,
  ``,
];

for (const r of reviews) {
  md.push(`## ${r.slide} — ${r.score}/10 ${r.ok ? "✅" : "❌"} ${r.regenerate ? "🔄" : ""}`);
  if (r.notes) md.push(`\n*${r.notes}*\n`);
  if (r.issues?.length) {
    for (const i of r.issues) md.push(`- **${i.severity}**: ${i.what}`);
  }
  md.push(``);
}

fs.writeFileSync(path.join(dir, "review.md"), md.join("\n"));
fs.writeFileSync(path.join(dir, "regenerate.list"), regenerate.join("\n"));

console.log(`\n→ review.md + ${regenerate.length} flagged`);
