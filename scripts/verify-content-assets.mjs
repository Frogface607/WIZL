import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const assets = [
  {
    name: "Meet WIZL carousel",
    dir: "content/posts/2026-06-27-meet-wizl-carousel",
    required: [
      ...Array.from({ length: 6 }, (_, i) => [`slide-0${i + 1}.png`, 1080, 1350]),
      ["qa-contact-sheet.jpg"],
      ["caption.md"],
      ["manifest.json"],
    ],
  },
  {
    name: "Night Market reel",
    dir: "content/posts/2026-06-26-adventure-01-the-lost-page-at-the-night-market",
    required: [
      ["edit.mp4", 1080, 1920],
      ["cover.png", 1080, 1920],
      ["start.png"],
      ["loop.mp4"],
      ["caption.md"],
      ["manifest.json"],
    ],
  },
  {
    name: "Product Hook reel",
    dir: "content/posts/2026-06-27-product-hook-scan-label",
    required: [
      ["edit.mp4", 1080, 1920],
      ["cover.png", 1080, 1920],
      ["start.png"],
      ["caption.md"],
      ["manifest.json"],
    ],
  },
  {
    name: "THC education carousel",
    dir: "content/posts/2026-06-27-thc-not-whole-story-carousel",
    required: [
      ...Array.from({ length: 6 }, (_, i) => [`slide-0${i + 1}.png`, 1080, 1350]),
      ["qa-contact-sheet.jpg"],
      ["caption.md"],
      ["manifest.json"],
    ],
  },
  {
    name: "Founder Q&A thread",
    dir: "content/posts/2026-06-27-founder-qa-thread",
    required: [["caption.md"], ["manifest.json"]],
  },
  {
    name: "Week 1 recap template",
    dir: "content/posts/2026-06-27-week-1-recap-template",
    required: [["caption.md"], ["manifest.json"]],
  },
];

function imageSize(path) {
  const buffer = readFileSync(path);
  const ext = extname(path).toLowerCase();

  if (ext === ".png") {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    let offset = 2;
    while (offset < buffer.length) {
      const marker = buffer.readUInt16BE(offset);
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xffc0 && marker <= 0xffc3) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  throw new Error(`Unsupported or unreadable image: ${path}`);
}

function videoSize(path) {
  const output = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,duration",
    "-of",
    "json",
    path,
  ], { encoding: "utf8" });

  const stream = JSON.parse(output).streams?.[0];
  return {
    width: Number(stream?.width),
    height: Number(stream?.height),
    duration: Number(stream?.duration || 0),
  };
}

let failures = 0;

for (const asset of assets) {
  console.log(`\n${asset.name}`);

  for (const [file, expectedWidth, expectedHeight] of asset.required) {
    const path = join(asset.dir, file);
    if (!existsSync(path)) {
      failures++;
      console.error(`  MISSING ${path}`);
      continue;
    }

    const size = statSync(path).size;
    if (size === 0) {
      failures++;
      console.error(`  EMPTY ${path}`);
      continue;
    }

    if (file === "caption.md") {
      const caption = readFileSync(path, "utf8");
      const hasLink = caption.includes("wizl.space");
      const hasAdultLine = caption.includes("Adults only where legal.");
      const ok = hasLink && hasAdultLine;
      failures += ok ? 0 : 1;
      console.log(`  ${ok ? "OK" : "BAD"} ${file}`);
      if (!hasLink) console.error(`    Missing wizl.space in ${path}`);
      if (!hasAdultLine) console.error(`    Missing adult/legal line in ${path}`);
      continue;
    }

    const ext = extname(file).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext) && expectedWidth && expectedHeight) {
      const actual = imageSize(path);
      const ok = actual.width === expectedWidth && actual.height === expectedHeight;
      failures += ok ? 0 : 1;
      console.log(`  ${ok ? "OK" : "BAD"} ${file} ${actual.width}x${actual.height}`);
      continue;
    }

    if (ext === ".mp4" && expectedWidth && expectedHeight) {
      const actual = videoSize(path);
      const ok = actual.width === expectedWidth && actual.height === expectedHeight;
      failures += ok ? 0 : 1;
      console.log(`  ${ok ? "OK" : "BAD"} ${file} ${actual.width}x${actual.height} ${actual.duration.toFixed(2)}s`);
      continue;
    }

    console.log(`  OK ${file}`);
  }
}

if (failures > 0) {
  console.error(`\nContent asset verification failed: ${failures} issue(s).`);
  process.exit(1);
}

console.log("\nContent assets OK.");
