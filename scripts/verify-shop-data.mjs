import { readFileSync } from "node:fs";

const text = readFileSync("src/data/shops.ts", "utf8");

const rowPattern =
  /\{ id: "([^"]+)", name: "([^"]+)", lat: ([^,]+), lng: ([^,]+), city: "([^"]+)", country: "([^"]+)"[^\n]+address: "([^"]*)"/g;

const countryPatterns = [
  ["Thailand", /Thailand$/],
  ["USA", /USA$/],
  ["Canada", /Canada$/],
  ["Netherlands", /Netherlands$/],
  ["Portugal", /Portugal$/],
  ["Australia", /Australia$/],
  ["Colombia", /Colombia$/],
  ["Israel", /Israel$/],
  ["Italy", /Italy$/],
  ["Mexico", /, Mexico$/],
  ["UK", /UK$/],
  ["Germany", /Germany$/],
  ["Jamaica", /Jamaica$/],
];

const issues = [];
const rows = [...text.matchAll(rowPattern)];

for (const match of rows) {
  const [, id, name, , , city, country, address] = match;
  const expectedCountry = countryPatterns.find(([, pattern]) =>
    pattern.test(address),
  )?.[0];

  if (expectedCountry && country !== expectedCountry) {
    issues.push({ id, name, city, country, expectedCountry, address });
  }
}

if (issues.length > 0) {
  console.error(`Shop data verification failed: ${issues.length} mismatched records.`);
  for (const issue of issues.slice(0, 20)) {
    console.error(
      `- ${issue.id}: ${issue.name} is ${issue.city}, ${issue.country}; address ends as ${issue.expectedCountry}`,
    );
  }
  process.exit(1);
}

console.log(`Shop data OK: ${rows.length.toLocaleString("en-US")} records checked.`);
