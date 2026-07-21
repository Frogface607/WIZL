#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const configPath = path.join(root, "content/factory/factory.config.json");
const config = readJson(configPath);
const command = process.argv[2] || "help";
const flags = parseFlags(process.argv.slice(3));
const implementedRecipes = ["adventure-reel", "wisdom-card", "strain-carousel"];

const usage = `
WIZL Content Factory

Commands:
  plan    Create a post folder, manifest, and prompts
  image   Run Higgsfield GPT Image 2 for the manifest start frame
  video   Run Higgsfield Seedance 2 for the manifest loop
  render  Render the final edit with Remotion
  status  List recent Higgsfield jobs

Examples:
  node content/factory/bin/wizl-factory.mjs plan --recipe adventure-reel --title "The Lost Page at the Night Market" --world night-market --episode 01
  node content/factory/bin/wizl-factory.mjs plan --recipe wisdom-card --quote "The nose knows." --world rooftop
  node content/factory/bin/wizl-factory.mjs plan --recipe strain-carousel --strain "Blue Dream" --source "https://source.example/reference" --type Hybrid --world secret-garden
  npm run factory:image -- --manifest content/posts/2026-06-21-adventure-01-the-lost-page-at-the-night-market/manifest.json
  npm run factory:video -- --manifest content/posts/2026-06-21-adventure-01-the-lost-page-at-the-night-market/manifest.json
  npm run factory:render -- --manifest content/posts/2026-06-21-adventure-01-the-lost-page-at-the-night-market/manifest.json
`;

try {
  if (command === "help" || flags.help) {
    console.log(usage.trim());
  } else if (command === "plan") {
    plan();
  } else if (command === "image") {
    await runImage();
  } else if (command === "video") {
    await runVideo();
  } else if (command === "render") {
    render();
  } else if (command === "status") {
    run("higgsfield", ["generate", "list", "--json", "--size", flags.size || "20"], { inherit: true });
  } else {
    throw new Error(`Unknown command: ${command}\n\n${usage}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

function plan() {
  const recipe = flags.recipe || flags._[0] || "adventure-reel";
  if (!implementedRecipes.includes(recipe)) {
    throw new Error(`Recipe '${recipe}' is not implemented in the orchestrator yet. Available: ${implementedRecipes.join(", ")}`);
  }

  const planData = getPlanData(recipe);
  const date = flags.date || planData.date || new Date().toISOString().slice(0, 10);
  const slug = planData.slug;
  const relDir = path.join(config.paths.posts, `${date}-${slug}`).replaceAll("\\", "/");
  const outDir = path.join(root, relDir);
  fs.mkdirSync(outDir, { recursive: true });
  const format = planData.format || config.formats.reel;
  const startImageName = planData.startImageName || "start.png";

  const manifest = {
    schema: "wizl.content.manifest.v1",
    recipe,
    createdAt: new Date().toISOString(),
    title: planData.title,
    subtitle: planData.subtitle,
    locale: "en",
    aspectRatio: format.aspectRatio,
    durationSeconds: Number(flags.duration || flags._[4] || config.formats.reel.durationSeconds),
    models: {
      image: config.models.image,
      motion: config.models.motion,
      edit: "remotion"
    },
    source: planData.source,
    paths: {
      postDir: relDir,
      promptImage: `${relDir}/prompt-image.txt`,
      promptMotion: `${relDir}/prompt-motion.txt`,
      caption: `${relDir}/caption.md`,
      startImage: `${relDir}/${startImageName}`,
      loopVideo: `${relDir}/loop.mp4`,
      editVideo: `${relDir}/edit.mp4`,
      coverImage: `${relDir}/cover.png`,
      remotionProps: `${relDir}/remotion-props.json`
    },
    prompts: planData.prompts,
    assets: planData.assets?.map((asset) => ({
      ...asset,
      output: `${relDir}/${asset.output}`,
      promptPath: `${relDir}/${asset.promptPath}`
    })),
    render: {
      composition: "WIZLFactoryReel",
      width: format.width,
      height: format.height,
      fps: config.formats.reel.fps
    },
    status: {
      planned: true,
      image: "pending",
      video: "pending",
      render: "pending"
    }
  };

  writeText(manifest.paths.promptImage, planData.prompts.image);
  writeText(manifest.paths.promptMotion, planData.prompts.motion);
  writeText(manifest.paths.caption, planData.caption);
  if (manifest.assets) {
    manifest.assets.forEach((asset) => writeText(asset.promptPath, asset.prompt));
  }
  writeJson(path.join(relDir, "manifest.json"), manifest);
  writeRemotionProps(manifest);

  console.log(`Planned ${manifest.title}`);
  console.log(`Manifest: ${relDir}/manifest.json`);
  console.log(`Image model: ${manifest.models.image}`);
  console.log(`Motion model: ${manifest.models.motion}`);
}

function getPlanData(recipe) {
  if (recipe === "adventure-reel") {
    return planAdventureReel();
  }
  if (recipe === "wisdom-card") {
    return planWisdomCard();
  }
  if (recipe === "strain-carousel") {
    return planStrainCarousel();
  }
  throw new Error(`Recipe '${recipe}' is not implemented.`);
}

function planAdventureReel() {
  const title = flags.title || flags._[1] || "The Lost Page";
  const world = flags.world || flags._[2] || "night-market";
  const action =
    flags.action ||
    "following a glowing missing page through the scene while holding The Book";
  const hook = flags.hook || flags._[5] || "Every strain has a story. Every story leaves a trace.";
  const episode = flags.episode || flags._[3] || "01";

  return {
    slug: `adventure-${episode}-${slugify(title)}`,
    date: flags.date || flags._[4],
    title,
    subtitle: `The Lost Pages #${episode}`,
    source: { episode, world, action, hook },
    prompts: buildAdventurePrompts({ title, world, action, hook }),
    caption: [
      `${title}`,
      "",
      hook,
      "",
      "WIZL opened The Book and followed the trace.",
      "",
      "wizl.space"
    ].join("\n")
  };
}

function planWisdomCard() {
  const quote =
    flags.quote ||
    flags._[1] ||
    pickByDay([
      "The label starts the story. Your notes finish it.",
      "A strain name is a clue, not a guarantee.",
      "Producer and batch matter. Write them down.",
      "Tolerance is feedback, not a contest.",
      "The wisest choice is sometimes not today."
    ]);
  const world = flags.world || flags._[2] || "rooftop";
  const action = flags.action || "studying The Book under a warm lantern";

  return {
    slug: `wisdom-${slugify(quote).slice(0, 48)}`,
    date: flags.date || flags._[3],
    title: "WIZL Wisdom",
    subtitle: quote,
    format: config.formats.square,
    startImageName: "card.png",
    source: { quote, world, action },
    prompts: buildWisdomPrompts({ quote, world, action }),
    assets: [
      {
        id: "card",
        promptPath: "prompt-card.txt",
        output: "card.png",
        aspectRatio: config.formats.square.aspectRatio,
        prompt: buildWisdomPrompts({ quote, world, action }).image,
        status: "pending"
      }
    ],
    caption: [
      `"${quote}"`,
      "- WIZL",
      "",
      "A field note from The Book.",
      "",
      "wizl.space",
      "",
      "#wizl #wizlwisdom #cannabiseducation #strainnotes #terpenes"
    ].join("\n")
  };
}

function planStrainCarousel() {
  const strain = flags.strain || flags._[1];
  const sourceUrl = flags.source;

  if (!strain) {
    throw new Error("strain-carousel requires --strain.");
  }
  if (!sourceUrl) {
    throw new Error("strain-carousel requires --source with the reference used for fact-checking.");
  }

  const type = flags.type || "Reference profile";
  const thc = flags.thc ? normalizePercent(flags.thc) : "Check the package label";
  const genetics = flags.genetics || "Varies by producer and batch";
  const effects = flags.effects || "Responses vary by person";
  const flavors = flags.flavors || "Record the label and your own aroma notes";
  const world = flags.world || flags._[4] || "secret-garden";
  const prompts = buildStrainCarouselPrompts({ strain, type, thc, genetics, effects, flavors, world });

  return {
    slug: `strain-${slugify(strain)}`,
    date: flags.date || flags._[5],
    title: `Reference Profile: ${strain}`,
    subtitle: `${type} | ${thc}`,
    format: config.formats.carouselPortrait,
    startImageName: "slide-1.png",
    source: {
      strain,
      type,
      thc,
      genetics,
      effects,
      flavors,
      world,
      sourceUrl,
      disclaimer: "Strain names are not reliable product identities; producer, batch, label, and personal response matter."
    },
    prompts: {
      image: prompts.slide1,
      motion: ""
    },
    assets: [
      {
        id: "slide-1",
        promptPath: "prompt-slide-01.txt",
        output: "slide-1.png",
        aspectRatio: config.formats.carouselPortrait.aspectRatio,
        prompt: prompts.slide1,
        status: "pending"
      },
      {
        id: "slide-2",
        promptPath: "prompt-slide-02.txt",
        output: "slide-2.png",
        aspectRatio: config.formats.carouselPortrait.aspectRatio,
        prompt: prompts.slide2,
        status: "pending"
      },
      {
        id: "slide-3",
        promptPath: "prompt-slide-03.txt",
        output: "slide-3.png",
        aspectRatio: config.formats.carouselPortrait.aspectRatio,
        prompt: prompts.slide3,
        status: "pending"
      }
    ],
    caption: [
      `REFERENCE PROFILE: ${strain}`,
      "",
      `${type} | ${thc}`,
      `Reported lineage: ${genetics}`,
      `Reported effects: ${effects}`,
      `Reported notes: ${flavors}`,
      "",
      "A strain name is a clue, not a guarantee. Compare the producer, batch, and package label, then record your own response.",
      "",
      `Source reviewed: ${sourceUrl}`,
      "Adults only where legal.",
      "wizl.space"
    ].join("\n")
  };
}

async function runImage() {
  const manifest = loadManifest();
  const ref = chooseReference();
  if (manifest.assets?.length > 0) {
    await runImageAssets(manifest, ref);
    return;
  }

  const args = [
    "generate",
    "create",
    manifest.models.image || config.models.image,
    "--json",
    "--prompt",
    manifest.prompts.image,
    "--aspect_ratio",
    manifest.aspectRatio || config.formats.reel.aspectRatio,
    "--wait",
    "--wait-timeout",
    flags.timeout || "15m"
  ];

  if (ref) {
    args.push("--image", ref);
  }

  const manifestDir = path.dirname(toAbs(flags.manifest));
  let result;
  try {
    result = run("higgsfield", args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeText(path.join(manifestDir, "higgsfield-image.log"), message);
    manifest.status.image = message.includes("Not authenticated") ? "auth-required" : "failed";
    saveManifest(manifest);
    writeRemotionProps(manifest);
    throw error;
  }

  writeText(path.join(manifestDir, "higgsfield-image.log"), result.stdout + result.stderr);
  const urls = extractUrls(result.stdout + result.stderr);

  if (urls.length > 0) {
    await download(urls[0], toAbs(manifest.paths.startImage));
    manifest.status.image = "done";
    manifest.results = { ...manifest.results, imageUrl: urls[0] };
  } else {
    manifest.status.image = "check-higgsfield-list";
  }

  saveManifest(manifest);
  writeRemotionProps(manifest);
  console.log(`Image stage: ${manifest.status.image}`);
}

async function runImageAssets(manifest, ref) {
  const manifestDir = path.dirname(toAbs(flags.manifest));
  for (const asset of manifest.assets) {
    if (asset.status === "done" && fs.existsSync(toAbs(asset.output))) {
      continue;
    }

    const prompt = asset.prompt || fs.readFileSync(toAbs(asset.promptPath), "utf8");
    const args = [
      "generate",
      "create",
      manifest.models.image || config.models.image,
      "--json",
      "--prompt",
      prompt,
      "--aspect_ratio",
      asset.aspectRatio || manifest.aspectRatio || config.formats.square.aspectRatio,
      "--wait",
      "--wait-timeout",
      flags.timeout || "15m"
    ];

    if (ref) {
      args.push("--image", ref);
    }

    let result;
    try {
      result = run("higgsfield", args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      writeText(path.join(manifestDir, `higgsfield-image-${asset.id}.log`), message);
      asset.status = message.includes("Not authenticated") ? "auth-required" : "failed";
      manifest.status.image = asset.status;
      saveManifest(manifest);
      writeRemotionProps(manifest);
      throw error;
    }

    writeText(path.join(manifestDir, `higgsfield-image-${asset.id}.log`), result.stdout + result.stderr);
    const urls = extractUrls(result.stdout + result.stderr);

    if (urls.length > 0) {
      await download(urls[0], toAbs(asset.output));
      asset.status = "done";
      asset.resultUrl = urls[0];
      if (asset.output === manifest.paths.startImage) {
        manifest.results = { ...manifest.results, imageUrl: urls[0] };
      }
    } else {
      asset.status = "check-higgsfield-list";
    }

    manifest.status.image = manifest.assets.every((item) => item.status === "done") ? "done" : "partial";
    saveManifest(manifest);
    writeRemotionProps(manifest);
    console.log(`${asset.id}: ${asset.status}`);
  }

  manifest.status.image = manifest.assets.every((item) => item.status === "done") ? "done" : "partial";
  saveManifest(manifest);
  writeRemotionProps(manifest);
  console.log(`Image stage: ${manifest.status.image}`);
}

async function runVideo() {
  const manifest = loadManifest();
  const startImage = toAbs(manifest.paths.startImage);
  if (!fs.existsSync(startImage)) {
    throw new Error(`Missing start image: ${manifest.paths.startImage}`);
  }

  const args = [
    "generate",
    "create",
    manifest.models.motion || config.models.motion,
    "--json",
    "--prompt",
    manifest.prompts.motion,
    "--start-image",
    startImage,
    "--duration",
    String(Math.min(manifest.durationSeconds || 8, 12)),
    "--aspect_ratio",
    manifest.aspectRatio || config.formats.reel.aspectRatio,
    "--wait",
    "--wait-timeout",
    flags.timeout || "25m"
  ];

  const manifestDir = path.dirname(toAbs(flags.manifest));
  let result;
  try {
    result = run("higgsfield", args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeText(path.join(manifestDir, "higgsfield-video.log"), message);
    manifest.status.video = message.includes("Not authenticated")
      ? "auth-required"
      : message.includes("grace_daily_limit_reached")
        ? "limit-reached"
        : "failed";
    saveManifest(manifest);
    writeRemotionProps(manifest);
    throw error;
  }

  writeText(path.join(manifestDir, "higgsfield-video.log"), result.stdout + result.stderr);
  const urls = extractUrls(result.stdout + result.stderr);

  if (urls.length > 0) {
    await download(urls[0], toAbs(manifest.paths.loopVideo));
    manifest.status.video = "done";
    manifest.results = { ...manifest.results, videoUrl: urls[0] };
  } else {
    manifest.status.video = "check-higgsfield-list";
  }

  saveManifest(manifest);
  writeRemotionProps(manifest);
  console.log(`Video stage: ${manifest.status.video}`);
}

function render() {
  const manifest = loadManifest();
  writeRemotionProps(manifest);
  const output = toAbs(flags.output || manifest.paths.editVideo);
  fs.mkdirSync(path.dirname(output), { recursive: true });

  run(
    "remotion",
    [
      "render",
      "remotion/index.ts",
      manifest.render.composition,
      output,
      "--props",
      manifest.paths.remotionProps,
      "--public-dir",
      manifest.paths.postDir,
      "--overwrite"
    ],
    { inherit: true }
  );

  manifest.status.render = "done";
  saveManifest(manifest);
  console.log(`Rendered: ${output}`);
}

function buildAdventurePrompts({ title, world, action, hook }) {
  const character = readNode("nodes/character.txt");
  const style = readNode("nodes/style.txt");
  const worldText = readNode(`nodes/worlds/${world}.txt`);
  const cleanWorld = cleanPrompt(worldText);
  const cleanAction = cleanPrompt(action);

  const image = cleanPrompt(`
Vertical 9:16 cinematic key frame for a WIZL adventure reel.

Title: "${title}"
Story hook: "${hook}"

${character}

${mascotStyleLock()}

Scene: ${cleanWorld}

Action: WIZL is ${cleanAction}. The Book is open and glowing with emerald light. A torn magical page fragment floats ahead of him like a clue. The orange cat is clearly visible in the satchel, curious but calm. Keep WIZL in the lower middle third with atmospheric space above for Remotion text.

${style}

Premium illustrated social reel frame. One WIZL only. No humans in foreground. No photorealism. No hard cannabis symbols in the scene description. Mystical, useful, kind, street-folklore energy.
`).trim();

  const motion = cleanPrompt(`
Animate this WIZL adventure key frame into a loop-friendly 9:16 reel. Camera slowly pushes toward the floating page fragment while WIZL follows it. The page glows, lanterns flicker, mist drifts, small green spark particles move through the air, and the orange cat blinks once from the satchel. Keep the character on-model, keep The Book visible, no extra WIZL duplicates, no hard cuts. Dreamy cinematic motion for a 10-12 second Remotion edit.
`).trim();

  return { image, motion };
}

function buildWisdomPrompts({ quote, world, action }) {
  const character = readNode("nodes/character.txt");
  const style = readNode("nodes/style.txt");
  const worldText = readNode(`nodes/worlds/${world}.txt`);
  const cleanWorld = cleanPrompt(worldText);
  const cleanAction = cleanPrompt(action);

  const image = cleanPrompt(`
Square 1:1 editorial WIZL wisdom card.

Exact quote text to render large and clean:
"${quote}"
- WIZL

${character}

${mascotStyleLock()}

Scene: ${cleanWorld}

Action: WIZL is ${cleanAction}. Keep WIZL on the left third or lower-left corner. The orange cat is visible in the satchel. The right side has a calm typographic quote layout with generous spacing.

${style}

Design system: deep navy background, cream quote text, neon green small accents, wizard purple cloak, warm gold details. Premium social poster quality, subtle grain, soft haze, tiny firefly particles. One WIZL only, no humans in foreground, no photorealism, no hard cannabis symbols, no consumption scene.
`).trim();

  return { image, motion: "" };
}

function buildStrainCarouselPrompts({ strain, type, thc, genetics, effects, flavors, world }) {
  const character = readNode("nodes/character.txt");
  const style = readNode("nodes/style.txt");
  const worldText = readNode(`nodes/worlds/${world}.txt`);
  const cleanWorld = cleanPrompt(worldText);

  const slide1 = cleanPrompt(`
Portrait 3:4 carousel hero card for WIZL.

Visible title text: "${strain}"
Small badge text: "${type}"

${character}

${mascotStyleLock()}

Scene: ${cleanWorld}

Action: WIZL examines a small glass jar labeled "${strain}" under the emerald light of his staff. The orange cat in the satchel looks curious. Leave the upper third clean for title text.

${style}

Premium editorial card, no duplicate characters, no humans in foreground, no photorealism, no hard cannabis symbols, no consumption scene.
`).trim();

  const slide2 = cleanPrompt(`
Portrait 3:4 WIZL strain notes infographic.

Text to render:
${strain}
REFERENCE PROFILE
TYPE: ${type}
LABEL THC: ${thc}
REPORTED LINEAGE: ${genetics}
REPORTED NOTES: ${flavors}
REPORTED EFFECTS: ${effects}
Footer: Names vary by producer and batch.

Deep navy background, cream typography, neon green intensity value, wizard purple badge, warm gold dividers. Include a small low-opacity WIZL silhouette watermark and tiny magical crystal illustration, not a plant close-up. Clean editorial layout, readable hierarchy, subtle grain, no photorealism.
`).trim();

  const slide3 = cleanPrompt(`
Portrait 3:4 WIZL carousel end card.

Text to render:
Found in The Book.
Read the label. Keep a field note.
wizl.space

Deep navy background, large cream headline, neon green supporting line, warm gold site text. WIZL stands on the right holding The Book open with emerald page glow. The orange cat peeks from the satchel. Premium illustrated storybook style, subtle grain, soft haze, no photorealism.
`).trim();

  return { slide1, slide2, slide3 };
}

function mascotStyleLock() {
  return `
STRICT WIZL MASCOT STYLE LOCK:
Use the clean WIZL avatar as the character style target: 2D hand-drawn cartoon mascot, simplified rounded shapes, big friendly eyes, compact cute proportions, thick clean dark outline, soft cel-shading, smooth color blocks, subtle painterly brush only inside large shapes.
Fur must be simplified into broad color areas. Do NOT render individual fur strands, whisker-heavy realism, realistic animal anatomy, cinematic creature design, high-fantasy painting, oil painting, photoreal lighting, 3D render, hyper-detailed costume texture, ornate jewelry overload, dramatic realistic shadows, or gritty realism.
The character should feel like a reusable app mascot/sticker from a storybook brand, not a fantasy novel cover. Keep the silhouette close to the reference: rounded friendly weasel face, simple smile, purple wizard hat and cloak, emerald crystal accent, open readable expression.
`.trim();
}

function cleanPrompt(text) {
  return cleanText(text);
}

function cleanText(text) {
  return text
    .replaceAll("\r\n", "\n")
    .replaceAll("\u00A0", " ");
}

function writeRemotionProps(manifest) {
  const props = {
    manifest,
    hasStartImage: fs.existsSync(toAbs(manifest.paths.startImage)),
    hasLoopVideo: fs.existsSync(toAbs(manifest.paths.loopVideo))
  };
  writeJson(manifest.paths.remotionProps, props);
}

function chooseReference() {
  const candidates = [
    config.paths.cleanReference,
    config.paths.fallbackReference,
    config.paths.legacyReference
  ];
  const found = candidates.find((candidate) => fs.existsSync(toAbs(candidate)));
  if (!found) {
    console.warn("No WIZL reference image found; continuing without --image.");
    return null;
  }

  if (found !== config.paths.cleanReference) {
    console.warn(`Clean reference missing; using ${found}.`);
  }

  return toAbs(found);
}

function loadManifest() {
  flags.manifest = flags.manifest || flags._[0];
  if (!flags.manifest) {
    throw new Error("Missing --manifest <path>");
  }
  return readJson(toAbs(flags.manifest));
}

function saveManifest(manifest) {
  writeJson(flags.manifest, manifest);
}

function readNode(relative) {
  const file = path.join(root, config.paths.factory, relative);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing node: ${file}`);
  }
  return fs.readFileSync(file, "utf8").trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function writeJson(file, data) {
  const abs = toAbs(file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(file, text) {
  const abs = toAbs(file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text, "utf8");
}

function toAbs(file) {
  return path.isAbsolute(file) ? file : path.join(root, file);
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function pickByDay(items) {
  const day = Math.floor(Date.now() / 86400000);
  return items[day % items.length];
}

function normalizePercent(value) {
  const text = String(value).trim();
  return text.endsWith("%") ? text : `${text}%`;
}

function parseFlags(args) {
  const parsed = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (!item.startsWith("--")) {
      parsed._.push(item);
      continue;
    }
    const [rawKey, inlineValue] = item.slice(2).split("=");
    if (inlineValue !== undefined) {
      parsed[rawKey] = inlineValue;
    } else if (args[index + 1] && !args[index + 1].startsWith("--")) {
      parsed[rawKey] = args[index + 1];
      index += 1;
    } else {
      parsed[rawKey] = true;
    }
  }
  return parsed;
}

function run(bin, args, options = {}) {
  const command = resolveCommand(bin, args);
  const result = spawnSync(command.bin, command.args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    stdio: options.inherit ? "inherit" : "pipe"
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${bin} ${args.join(" ")} failed with exit ${result.status}\n${result.stderr || ""}`);
  }
  return {
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function resolveCommand(bin, args) {
  if (process.platform !== "win32") {
    return { bin, args };
  }

  if (bin === "higgsfield") {
    const script = path.join(
      process.env.APPDATA || "",
      "npm",
      "node_modules",
      "@higgsfield",
      "cli",
      "bin",
      "higgsfield.js"
    );
    return {
      bin: "node.exe",
      args: [script, ...args]
    };
  }

  if (bin === "npx") {
    return { bin: "npx.cmd", args };
  }

  if (bin === "remotion") {
    return {
      bin: "node.exe",
      args: [path.join(root, "node_modules", "@remotion", "cli", "remotion-cli.js"), ...args]
    };
  }

  return { bin, args };
}

function extractUrls(text) {
  const urls = new Set();
  const direct = text.match(/https?:\/\/[^\s"'<>]+/g) || [];
  direct.forEach((url) => urls.add(url.replace(/[),.]+$/, "")));

  try {
    collectUrls(JSON.parse(text), urls);
  } catch {
    // Higgsfield may print multiple JSON records or progress text.
  }

  return [...urls];
}

function collectUrls(value, urls) {
  if (!value) {
    return;
  }
  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      urls.add(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, urls));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectUrls(item, urls));
  }
}

async function download(url, output) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed ${response.status}: ${url}`);
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(output, buffer);
  console.log(`Downloaded: ${output}`);
}
