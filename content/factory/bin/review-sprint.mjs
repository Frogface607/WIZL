#!/usr/bin/env node
/**
 * Review generated WIZL slides with OpenAI vision.
 *
 * Usage:
 *   npm run factory:review -- content/posts/path-to-episode
 *
 * Reads OPENAI_API_KEY from the environment. For Sergey's local setup, it also
 * checks ~/.codex/secrets/openai.env without printing or copying the secret.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: review-sprint.mjs <episode-folder>");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY && fs.existsSync(path.resolve(".env.local"))) {
  process.loadEnvFile(path.resolve(".env.local"));
}

if (!process.env.OPENAI_API_KEY) {
  const envPath =
    process.env.WIZL_OPENAI_ENV ||
    path.join(os.homedir(), ".codex", "secrets", "openai.env");

  if (fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY.");
  process.exit(1);
}

const slides = fs
  .readdirSync(dir)
  .filter((file) => /^slide-.*\.(png|jpe?g|webp)$/i.test(file))
  .sort();

if (slides.length === 0) {
  console.error("No slide images found in the episode folder.");
  process.exit(1);
}

const RUBRIC = `
Review one generated slide for WIZL, an adult educational field-guide and
storybook brand.

Canonical WIZL:
- one small anthropomorphic weasel wizard
- warm 2D storybook-cartoon style, never photorealistic
- purple traveling cloak with simple moon-and-star patches
- weathered purple hat with an emerald crystal pin
- wooden staff with an emerald crystal
- leather satchel with a visible orange tabby cat
- natural body language, never a T-pose

Regenerate when any hard rule fails:
1. More than one WIZL, a duplicate, or a reflection that reads as a duplicate.
2. WIZL becomes an otter, bear, human, realistic animal, or 3D character.
3. The required cloak, hat, staff, satchel, or cat is missing without a clear
   story reason.
4. A minor or youth-coded person appears.
5. The slide depicts purchase, price, menu, delivery, seller promotion,
   consumption, impaired driving, a medical promise, or dangerous behavior.
6. A celebrity likeness, third-party logo, or implied endorsement appears.
7. Essential overlay text is misspelled, cropped, unreadable, or differs from
   the supplied design.

Also assess composition, mobile readability, palette, and whether the scene
feels warm, useful, and consistent with WIZL.
`.trim();

const REVIEW_SCHEMA = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    score: { type: "integer", minimum: 1, maximum: 10 },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["high", "medium", "low"] },
          what: { type: "string" }
        },
        required: ["severity", "what"],
        additionalProperties: false
      }
    },
    regenerate: { type: "boolean" },
    notes: { type: "string" }
  },
  required: ["ok", "score", "issues", "regenerate", "notes"],
  additionalProperties: false
};

function mediaType(file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  return "image/png";
}

function outputText(response) {
  for (const item of response.output || []) {
    for (const part of item.content || []) {
      if (part.type === "output_text" && part.text) return part.text;
    }
  }
  throw new Error("OpenAI response contained no output text.");
}

async function reviewSlide(fullPath) {
  const image = fs.readFileSync(fullPath).toString("base64");
  const body = {
    model: process.env.OPENAI_REVIEW_MODEL || "gpt-5-mini",
    store: false,
    max_output_tokens: 1200,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: RUBRIC },
          {
            type: "input_image",
            image_url: `data:${mediaType(fullPath)};base64,${image}`,
            detail: "high"
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "wizl_slide_review",
        strict: true,
        schema: REVIEW_SCHEMA
      }
    }
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI HTTP ${response.status}: ${errorText.slice(0, 240)}`);
  }

  return JSON.parse(outputText(await response.json()));
}

const reviews = [];
const regenerate = [];

for (const slide of slides) {
  const fullPath = path.join(dir, slide);
  process.stdout.write(`Reviewing ${slide}... `);

  try {
    const review = await reviewSlide(fullPath);
    reviews.push({ slide, ...review });
    if (review.regenerate) regenerate.push(slide);
    console.log(`${review.ok ? "OK" : "FAIL"} (${review.score}/10)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`ERROR: ${message.slice(0, 120)}`);
    reviews.push({
      slide,
      ok: false,
      score: 1,
      issues: [{ severity: "high", what: message.slice(0, 240) }],
      regenerate: true,
      notes: "Automated review failed."
    });
    regenerate.push(slide);
  }
}

fs.writeFileSync(
  path.join(dir, "review.json"),
  JSON.stringify(reviews, null, 2) + "\n",
  "utf8"
);

const okCount = reviews.filter((review) => review.ok).length;
const average =
  reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;
const report = [
  `# Sprint Review: ${path.basename(dir)}`,
  "",
  `Reviewed: ${new Date().toISOString()}`,
  `Slides: ${reviews.length} | OK: ${okCount} | Regenerate: ${regenerate.length} | Average: ${average.toFixed(1)}/10`,
  ""
];

for (const review of reviews) {
  report.push(`## ${review.slide}: ${review.score}/10 ${review.ok ? "OK" : "FAIL"}`);
  if (review.notes) report.push("", review.notes, "");
  for (const issue of review.issues || []) {
    report.push(`- ${issue.severity}: ${issue.what}`);
  }
  report.push("");
}

fs.writeFileSync(path.join(dir, "review.md"), report.join("\n"), "utf8");
fs.writeFileSync(
  path.join(dir, "regenerate.list"),
  regenerate.join("\n"),
  "utf8"
);

console.log(`Review complete: ${regenerate.length} slide(s) flagged.`);
