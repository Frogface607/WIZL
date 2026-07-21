const baseUrl = (process.env.LAUNCH_BASE_URL || "https://wizl.space").replace(/\/$/, "");
const timeoutMs = Number(process.env.LAUNCH_SMOKE_TIMEOUT_MS || 60000);

const pageChecks = [
  { path: "/en", mustInclude: ["Read the label. Remember the experience."], mustExclude: ["Find cannabis shops", "GB"] },
  { path: "/en/scan", mustInclude: ["WIZL Label Reader", "flower photo alone cannot prove identity or potency"] },
  { path: "/en/strains", mustInclude: ["The Book"] },
  { path: "/en/map", mustInclude: ["The map is being re-verified."], mustExclude: ["Find cannabis shops nearby"] },
  { path: "/en/checkin", mustInclude: ["New field note"] },
  { path: "/en/profile", mustInclude: ["Your field notes stay in this browser"] },
  { path: "/en/pro", mustInclude: ["Payments are paused"], mustExclude: ["Join Club - $4.20"] },
  { path: "/en/about", mustInclude: ["Hello world.", "This time, WIZL is going into the world."] },
  { path: "/en/privacy", mustInclude: ["does not require an account"] },
  { path: "/robots.txt", mustInclude: ["sitemap"] },
  { path: "/sitemap.xml", mustInclude: ["/en/strains/"], mustExclude: ["/en/map", "/en/shop"] }
];

function withTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, done: () => clearTimeout(timeout) };
}

async function fetchText(path, init = {}) {
  const { signal, done } = withTimeout();
  try {
    const response = await fetch(`${baseUrl}${path}`, { ...init, signal });
    const text = await response.text();
    return { response, text };
  } finally {
    done();
  }
}

async function followRedirects(path, maxHops = 5) {
  const chain = [];
  let url = `${baseUrl}${path}`;

  for (let hop = 0; hop < maxHops; hop++) {
    const { signal, done } = withTimeout();
    try {
      const response = await fetch(url, { redirect: "manual", signal });
      const location = response.headers.get("location") || "";
      chain.push({ status: response.status, url, location });

      if (![301, 302, 307, 308].includes(response.status)) {
        return { finalUrl: url, finalStatus: response.status, chain };
      }

      url = new URL(location, url).toString();
    } finally {
      done();
    }
  }

  return { finalUrl: url, finalStatus: 0, chain };
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

console.log(`Launch smoke target: ${baseUrl}`);

for (const check of pageChecks) {
  const { response, text } = await fetchText(check.path);
  const label = `${response.status} ${check.path}`;

  if (!response.ok) {
    fail(`BAD ${label}`);
    continue;
  }

  const missing = check.mustInclude.filter((needle) => !text.includes(needle));
  const forbidden = (check.mustExclude || []).filter((needle) => text.includes(needle));
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);

  if (missing.length > 0 || forbidden.length > 0 || hasCyrillic) {
    fail(
      `BAD ${label}` +
      (missing.length ? ` missing: ${missing.join(", ")}` : "") +
      (forbidden.length ? ` forbidden: ${forbidden.join(", ")}` : "") +
      (hasCyrillic ? " contains Cyrillic text" : "")
    );
    continue;
  }

  console.log(`OK ${label}`);
}

{
  const redirect = await followRedirects("/ru");
  const final = new URL(redirect.finalUrl);
  const chainLabel = redirect.chain
    .map((hop) => `${hop.status} ${new URL(hop.url).pathname}${hop.location ? ` -> ${hop.location}` : ""}`)
    .join(" | ");

  if (redirect.finalStatus !== 200 || final.pathname !== "/en") {
    fail(`BAD /ru redirect chain: ${chainLabel}`);
  } else {
    console.log(`OK /ru redirect chain: ${chainLabel}`);
  }
}

{
  const { response, text } = await fetchText("/api/checkout", { method: "POST" });
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}

  if (response.status !== 410 || data.code !== "CHECKOUT_PAUSED") {
    fail(`BAD checkout pause: ${response.status}/${data.code || "missing"}`);
  } else {
    console.log("OK checkout is paused");
  }
}

async function scan(description) {
  const { response, text } = await fetchText("/api/scan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ description, locale: "en" })
  });

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Scan returned non-JSON response: ${text.slice(0, 160)}`);
  }

  return { status: response.status, data };
}

const firstScan = await scan("Exact printed strain name: Cherry King.");
const secondScan = await scan("Exact printed strain name: Gelato.");

const firstName = firstScan.data?.name || "";
const secondName = secondScan.data?.name || "";
const scanOk =
  firstScan.status === 200 &&
  secondScan.status === 200 &&
  firstName &&
  secondName &&
  firstName.toLowerCase().includes("cherry king") &&
  secondName.toLowerCase().includes("gelato") &&
  firstName !== secondName &&
  !firstScan.data?._demo &&
  !secondScan.data?._demo;

if (!scanOk) {
  fail(
    `BAD scan smoke: first=${firstScan.status}/${firstName || "missing"} demo=${Boolean(firstScan.data?._demo)}; second=${secondScan.status}/${secondName || "missing"} demo=${Boolean(secondScan.data?._demo)}`
  );
} else {
  console.log(`OK scan smoke: ${firstName} -> ${secondName}`);
}

if (process.exitCode) {
  console.error("Launch smoke failed.");
  process.exit(process.exitCode);
}

console.log("Launch smoke OK.");
