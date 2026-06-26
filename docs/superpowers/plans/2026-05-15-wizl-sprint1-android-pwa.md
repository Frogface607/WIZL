# WIZL Sprint 1 — Android Capacitor + iOS PWA Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship WIZL to Google Play (Android via Capacitor) and give iOS users a polished PWA install flow, in 5–7 days plus a Day 0 pre-flight.

**Architecture:** Two builds from one Next.js 16 codebase via env switch — Vercel web (full Next.js with API routes) and Capacitor Android (`output: 'export'` static bundle, API calls go to wizl.space over the network). PWA install UX with iOS-specific variants (Safari, Chrome-on-iOS, in-app browsers). RU locale removed entirely. Push gated on sign-in. Venue map feature-flagged off in Capacitor build for first submission.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Capacitor 7, Firebase FCM, Sentry, Supabase, Vercel Edge Middleware. New: Vitest + @testing-library/react for unit tests (none existed before).

**Spec:** [docs/superpowers/specs/2026-05-15-wizl-sprint1-android-pwa-design.md](../specs/2026-05-15-wizl-sprint1-android-pwa-design.md)

**Coordination:** Parallel "content factory" session owns all visual assets (mascot, splash, icons, animations, screenshots). This plan creates placeholders only; sibling drops real files Day 6, zero code change.

---

## File Structure

### New files
| File | Responsibility |
|---|---|
| `capacitor.config.ts` | Capacitor 7 config (appId, webDir, plugin settings) |
| `android/` | Generated Android project from `npx cap add android` |
| `middleware.ts` (repo root) | Vercel Edge Middleware: RU geo-block on web |
| `vercel.json` | Vercel `/ru/*` redirect rules |
| `vitest.config.ts` | Vitest config (jsdom env, alias `@`) |
| `src/test/setup.ts` | Testing Library globals + cleanup |
| `src/lib/platform.ts` | iOS/Safari/in-app/standalone detection |
| `src/lib/native.ts` | Capacitor plugin wrappers with web fallbacks |
| `src/lib/cooldown.ts` | localStorage cooldown helper for dismissals |
| `src/lib/feature-flags.ts` | `isVenueMapEnabled()` and other Capacitor-aware flags |
| `src/components/IosPwaInstallPrompt.tsx` | Three-variant install modal |
| `src/components/OfflineBanner.tsx` | "You're offline" status banner |
| `src/app/region-unavailable/page.tsx` | RU redirect destination |
| `src/app/api/push/register/route.ts` | POST endpoint for FCM token registration (web build only) |
| `supabase/migrations/<ts>_device_tokens.sql` | `device_tokens` table |
| `supabase/migrations/<ts>_remove_cyrillic_strain_data.sql` | DB-side RU content cleanup (if Day 0 finds any) |
| `supabase/functions/cron-checkin-reminder/index.ts` | Hourly cron, sends FCM reminders |
| `public/sw.js` | Hand-rolled service worker for strain data caching |
| `docs/build.md` | Two-build pipeline documentation |
| `docs/store-listing/google-play-listing.md` | All Play Console listing copy |

### Modified files
| File | Change |
|---|---|
| `package.json` | Add Capacitor 7, Sentry, Vitest, testing-library deps + scripts |
| `next.config.ts` | Env-gated `output: 'export'` for Capacitor build |
| `src/i18n/routing.ts` | Remove `ru` from locales |
| `src/i18n/request.ts` | Verify no RU branches |
| `src/app/layout.tsx` | iOS meta tags, manifest link, Sentry init, IosPwaInstallPrompt mount |
| `src/app/[locale]/checkin/page.tsx` (164-168) | Replace placeholder share buttons with native share |
| `src/app/[locale]/profile/page.tsx` | Add "Install on iOS" link (mobile-only) |
| `src/app/[locale]/shop/**` | Wrap venue/map rendering with `isVenueMapEnabled()` |
| `public/manifest.json` | Upgrade per spec |
| `public/robots.txt` | Disallow `/ru/` |
| `.gitignore` | `android/build/`, `android/.gradle/`, etc. |

### Deleted files
| File | Reason |
|---|---|
| `messages/ru.json` | RU locale removed |

---

## Testing Strategy

- **Vitest + @testing-library/react** for new TypeScript code: `platform.ts`, `native.ts`, `cooldown.ts`, `feature-flags.ts`, `IosPwaInstallPrompt.tsx`, `OfflineBanner.tsx`, `/api/push/register` route
- **Manual verification** for native integration (FCM push, splash, deep links, share sheets) — documented expected-behavior steps, smoke-tested on Android emulator (Day 2) and real device (Day 5–7)
- **No e2e test framework added** — outside Sprint 1 scope; covered by manual acceptance verification

---

## Chunk 1: Day 0 — Pre-Flight Audit

Goal: produce a written go/no-go artifact before Day 1 code touches anything.

### Task 1.1: Capacitor 7 + Next.js 16 compat probe

**Files:**
- Create (throwaway): `D:\PROJECTS\WIZL\.preflight\next-export-test.txt`

- [ ] **Step 1: Probe `output: 'export'` build**

```bash
cd D:\PROJECTS\WIZL
# Temporary branch — do not commit
git checkout -b preflight/next-export-probe
```

Edit `next.config.ts` temporarily:
```ts
export default { output: 'export' };
```

```bash
pnpm build
```

Expected: `out/` directory generated. If `next.config.ts` errors, capture exact error.

- [ ] **Step 2: Verify API routes are stripped**

```bash
ls out/
```

Expected: `out/index.html`, locale folders, but NO `api/` folder. Route Handlers should be excluded.

- [ ] **Step 3: Probe Capacitor 7 install**

```bash
pnpm add -D @capacitor/cli@7 @capacitor/core@7
npx cap --version
```

Expected: `7.x.x`. If install fails, capture error.

- [ ] **Step 4: Document findings**

Write `D:\PROJECTS\WIZL\.preflight\next-export-test.txt`:
```
Next.js: <version>
Capacitor CLI: <version>
output: 'export' build: PASS/FAIL <details>
API routes stripped: YES/NO
Findings: <any errors>
Verdict: GO / NO-GO
```

- [ ] **Step 5: Clean up probe branch**

```bash
git checkout main
git branch -D preflight/next-export-probe
pnpm install
```

### Task 1.2: Cyrillic source sweep

- [ ] **Step 1: Run sweep across source tree**

```bash
cd D:\PROJECTS\WIZL
# Using ripgrep via Grep tool, NOT shell, to keep context small
# Pattern: [\p{Cyrillic}]
```

Use Grep tool with pattern `[А-Яа-яЁё]` across `src`, `public`, `messages`, `supabase`. Capture every match in `.preflight/cyrillic-findings.md`.

- [ ] **Step 2: Categorize findings**

For each match, classify:
- **Delete:** RU-only file like `messages/ru.json`
- **Translate:** RU string that should become EN
- **Remove:** RU-located row in `src/data/shops.ts`, etc.

Save as table in `.preflight/cyrillic-findings.md`.

### Task 1.3: Supabase Cyrillic data audit

- [ ] **Step 1: Connect to Supabase WIZL project**

Use the Supabase MCP tools to query the WIZL project (ID: `qbhyrhvpmavsrpasxnoz`).

- [ ] **Step 2: Find Cyrillic in strain text columns**

Run via `execute_sql`:
```sql
select id, name from strains where name ~ '[А-Яа-я]'
   or description ~ '[А-Яа-я]'
   or lore ~ '[А-Яа-я]'
   or fun_fact ~ '[А-Яа-я]';
```

Capture row IDs.

- [ ] **Step 3: Audit shops table**

```sql
select id, name, city, country from shops where name ~ '[А-Яа-я]'
   or city ~ '[А-Яа-я]'
   or country in ('Russia', 'Россия', 'RU');
```

- [ ] **Step 4: Document findings**

Save `D:\PROJECTS\WIZL\.preflight\supabase-cyrillic-audit.md` with row IDs + recommended action (translate or delete).

### Task 1.4: Account + project setup

- [ ] **Step 1: Google Play Developer Console**

Босс completes enrollment at https://play.google.com/console with $25 payment. Provides email used.

- [ ] **Step 2: Firebase project**

Create `wizl-prod` in Firebase Console. Enable Cloud Messaging (FCM). Capture: project ID, server key, sender ID. Save to `.preflight/firebase.md` (gitignored).

- [ ] **Step 3: Sentry project**

Create `wizl-mobile` project at sentry.io. Capture DSN. Save to `.preflight/sentry.md` (gitignored).

### Task 1.5: Android upload keystore generation

- [ ] **Step 1: Generate keystore**

```bash
cd D:\PROJECTS\WIZL
keytool -genkeypair -v -keystore wizl-upload-key.keystore -alias wizl-upload -keyalg RSA -keysize 2048 -validity 10000
```

Strong password, store in password manager. Back up `wizl-upload-key.keystore` to encrypted location (NOT in git). Add `*.keystore` to `.gitignore`.

- [ ] **Step 2: Document storage location**

`.preflight/android-signing.md` (gitignored): keystore path, alias, password storage location reference (e.g., 1Password item name).

### Task 1.6: Day 0 go/no-go artifact

- [ ] **Step 1: Write `docs/build.md`**

Document the two-build pipeline:

```markdown
# WIZL Build Pipeline

## Web (Vercel)
`pnpm build` → `.next/` → Vercel deploys to wizl.space
Includes: API routes (/api/push/register, etc.), middleware.ts, full Next.js features.

## Capacitor Android
`pnpm build:capacitor` → `out/` static export → `pnpm cap:sync` → `npx cap build android` → signed AAB
Excludes: API routes (stripped by output: 'export'), middleware.
API calls in the APK hit https://wizl.space/api/* over the network.

## Env switch
BUILD_TARGET=capacitor toggles output: 'export' in next.config.ts.
```

- [ ] **Step 2: Write Day 0 final report**

`.preflight/day-0-report.md`:
```
Pre-flight Sprint 1 WIZL — 2026-05-15

Compat:
- Next 16 + output: 'export': PASS/FAIL
- Capacitor 7: PASS/FAIL

Audits:
- Cyrillic source findings: <count> files, see cyrillic-findings.md
- Cyrillic Supabase findings: <count> rows, see supabase-cyrillic-audit.md

Accounts:
- Play Console: ENROLLED, email: ...
- Firebase: PROJECT_ID=...
- Sentry: DSN captured

Signing:
- Upload keystore: GENERATED, backed up

Verdict: GO / NO-GO for Day 1
```

- [ ] **Step 3: Commit Day 0 docs (preflight artifacts gitignored)**

```bash
git add docs/build.md .gitignore
git commit -m "docs: WIZL Sprint 1 Day 0 pre-flight pipeline + gitignore"
```

---

## Chunk 2: Day 1 — Setup, Testing Infra, RU Removal, Manifest

### Task 2.1: Install Vitest + Testing Library

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `src/test/setup.ts`

- [ ] **Step 1: Install deps**

```bash
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
```

- [ ] **Step 3: Install vite plugin react**

```bash
pnpm add -D @vitejs/plugin-react
```

- [ ] **Step 4: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());
```

- [ ] **Step 5: Add test scripts**

In `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Sanity test**

Create `src/test/sanity.test.ts`:
```ts
import { test, expect } from 'vitest';
test('vitest works', () => expect(1 + 1).toBe(2));
```

```bash
pnpm test
```

Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts src/test/
git commit -m "test: add Vitest + Testing Library for WIZL Sprint 1"
```

### Task 2.2: Env-gated `output: 'export'` in next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Write the change**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const isCapacitor = process.env.BUILD_TARGET === 'capacitor';

const nextConfig: NextConfig = {
  output: isCapacitor ? 'export' : undefined,
  images: isCapacitor ? { unoptimized: true } : undefined,
  // existing config preserved
};

export default withNextIntl(nextConfig);
```

(Adapt to actual existing `next.config.ts` content — preserve all existing options, add only the conditional ones.)

- [ ] **Step 2: Verify Vercel build still works**

```bash
pnpm build
```

Expected: `.next/` directory, API routes present.

- [ ] **Step 3: Verify Capacitor static export builds**

```bash
$env:BUILD_TARGET="capacitor"; pnpm build; Remove-Item env:BUILD_TARGET
```

Expected: `out/` directory, no `api/` inside.

- [ ] **Step 4: Add script for clarity**

In `package.json`:
```json
"scripts": {
  "build:capacitor": "cross-env BUILD_TARGET=capacitor next build"
}
```

```bash
pnpm add -D cross-env
```

- [ ] **Step 5: Commit**

```bash
git add next.config.ts package.json pnpm-lock.yaml
git commit -m "build: env-gated output:'export' for Capacitor builds"
```

### Task 2.3: Install Capacitor 7 + add Android platform

**Files:**
- Create: `capacitor.config.ts`, `android/`
- Modify: `package.json`, `.gitignore`

- [ ] **Step 1: Install Capacitor core + plugins**

```bash
pnpm add @capacitor/core@7 @capacitor/android@7 @capacitor/push-notifications@7 @capacitor/share@7 @capacitor/app@7 @capacitor/splash-screen@7 @capacitor/preferences@7 @capacitor/status-bar@7 @capacitor/browser@7
pnpm add -D @capacitor/cli@7 @capacitor/assets
```

- [ ] **Step 2: Init Capacitor**

```bash
npx cap init "WIZL" "space.wizl.app" --web-dir=out
```

Generates `capacitor.config.ts`.

- [ ] **Step 3: Edit `capacitor.config.ts`**

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'space.wizl.app',
  appName: 'WIZL',
  webDir: 'out',
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0a0a0a',
      androidSplashResourceName: 'splash',
    },
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
  },
};

export default config;
```

- [ ] **Step 4: First static build (placeholder until RU removed)**

```bash
pnpm build:capacitor
```

Expected: `out/` directory present.

- [ ] **Step 5: Add Android platform**

```bash
npx cap add android
```

Generates `android/` directory.

- [ ] **Step 6: Update `.gitignore`**

Add:
```
# Capacitor
android/.gradle/
android/build/
android/app/build/
android/app/release/
android/local.properties
*.keystore
.preflight/
```

- [ ] **Step 7: First sync**

```bash
npx cap sync android
```

Expected: copies `out/` into `android/app/src/main/assets/public/`.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml capacitor.config.ts .gitignore android/
git commit -m "feat: add Capacitor 7 + Android platform"
```

### Task 2.4: Delete RU locale

**Files:**
- Delete: `messages/ru.json`
- Modify: `src/i18n/routing.ts`, `src/i18n/request.ts`, `public/manifest.json`, `public/robots.txt`

- [ ] **Step 1: Read current routing.ts to write the test**

Read `src/i18n/routing.ts`. Note the structure (likely `defineRouting({ locales: ['en', 'ru', 'th'], ... })`).

- [ ] **Step 2: Write failing test**

Create `src/i18n/routing.test.ts`:
```ts
import { describe, test, expect } from 'vitest';
import { routing } from './routing';

describe('i18n routing', () => {
  test('does not include ru locale', () => {
    expect(routing.locales).not.toContain('ru');
  });
  test('includes en and th', () => {
    expect(routing.locales).toContain('en');
    expect(routing.locales).toContain('th');
  });
  test('default locale is en', () => {
    expect(routing.defaultLocale).toBe('en');
  });
});
```

```bash
pnpm test
```

Expected: FAIL on "does not include ru locale".

- [ ] **Step 3: Edit `src/i18n/routing.ts`**

Remove `'ru'` from the `locales` array. Ensure `defaultLocale: 'en'`.

- [ ] **Step 4: Run test, verify PASS**

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 5: Delete `messages/ru.json`**

```bash
Remove-Item D:\PROJECTS\WIZL\messages\ru.json
```

- [ ] **Step 6: Update `public/manifest.json`**

Set `"lang": "en"`, remove any `lang_ru` variants.

- [ ] **Step 7: Update `public/robots.txt`**

Add: `Disallow: /ru/`.

- [ ] **Step 8: Verify build still passes**

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/i18n/ messages/ public/manifest.json public/robots.txt
git commit -m "feat: remove RU locale per legal risk assessment"
```

### Task 2.5: Apply Cyrillic findings from Day 0

For each finding in `.preflight/cyrillic-findings.md`:

- [ ] **Step 1: Translate or remove each match**

For source files: replace with English equivalent or i18n key.
For shop rows in `src/data/shops.ts`: remove RU-located entries.

- [ ] **Step 2: Re-run Cyrillic sweep — must return zero matches in `src/`, `public/`, `messages/`**

- [ ] **Step 3: Apply Supabase migration if needed**

If `.preflight/supabase-cyrillic-audit.md` has rows:

Create `supabase/migrations/<timestamp>_remove_cyrillic_strain_data.sql`:
```sql
-- Generated from Day 0 audit, IDs listed
update strains set description = '...' where id = '...';
delete from shops where country in ('Russia', 'Россия');
```

Apply via Supabase MCP `apply_migration`.

- [ ] **Step 4: Commit**

```bash
git add src/ messages/ supabase/
git commit -m "feat: translate or remove all Cyrillic content (Day 0 audit follow-up)"
```

### Task 2.6: Vercel `/ru/*` redirect + RU geo-block middleware

**Files:**
- Create: `vercel.json`, `middleware.ts`, `src/app/region-unavailable/page.tsx`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "redirects": [
    { "source": "/ru", "destination": "/en", "permanent": true },
    { "source": "/ru/:path*", "destination": "/en/:path*", "permanent": true }
  ]
}
```

- [ ] **Step 2: Create `middleware.ts` at repo root**

**Critical:** `request.geo` was removed in Next.js 15. Use the `x-vercel-ip-country` header (set by Vercel Edge Network), or `@vercel/functions`' `geolocation(request)`. Header is simpler and zero-dependency.

```ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country');
  if (country === 'RU') {
    const url = req.nextUrl.clone();
    url.pathname = '/region-unavailable';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!region-unavailable|_next/static|_next/image|favicon|api).*)'],
};
```

Note: the matcher excludes `/api/*` — a RU user calling `/api/push/register` directly is not blocked, but push registration also requires sign-in. Acceptable. Tighten in v1.1 if needed.

- [ ] **Step 3: Create `src/app/region-unavailable/page.tsx`**

```tsx
export const dynamic = 'force-static';

export default function RegionUnavailablePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-black mb-4">WIZL is not available in your region.</h1>
        <p className="text-text-muted">We share wisdom with love, but local laws come first.</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify the middleware is NOT bundled in Capacitor build**

```bash
pnpm build:capacitor
ls out
```

`middleware.ts` and `vercel.json` should not affect static export output. Confirm `region-unavailable/index.html` exists in `out/`.

- [ ] **Step 5: Commit**

```bash
git add vercel.json middleware.ts src/app/region-unavailable/
git commit -m "feat: RU redirect + geo-block middleware (web only)"
```

### Task 2.7: PWA manifest upgrade + iOS meta tags

**Files:**
- Modify: `public/manifest.json`, `src/app/layout.tsx`

- [ ] **Step 1: Rewrite `public/manifest.json`**

```json
{
  "name": "WIZL — Cannabis Magic Book",
  "short_name": "WIZL",
  "description": "Your cannabis wizard. Discover strains, build your taste profile, explore cannabis-friendly venues.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#8C6FB8",
  "orientation": "portrait",
  "lang": "en",
  "categories": ["education", "lifestyle", "reference"],
  "icons": [
    { "src": "/assets/v1/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/assets/v1/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

- [ ] **Step 2: Add iOS meta tags to `src/app/layout.tsx`**

In the `<head>` (or via `metadata` object if using Next 16 metadata API):
```tsx
export const metadata = {
  // ...existing
  appleWebApp: {
    capable: true,
    title: 'WIZL',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/assets/v1/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};
```

- [ ] **Step 3: Create placeholder assets**

Stub the three referenced PNGs as solid-purple squares using `sharp` or copy of `mascot.png`:

```bash
mkdir public\assets\v1
# Copy existing mascot.png as placeholder for icon-192, icon-512, apple-touch-icon
copy public\mascot.png public\assets\v1\icon-192.png
copy public\mascot.png public\assets\v1\icon-512.png
copy public\mascot.png public\assets\v1\apple-touch-icon.png
```

Real assets land Day 6 from sibling session.

- [ ] **Step 4: Verify build works**

```bash
pnpm build:capacitor
npx cap sync android
```

- [ ] **Step 5: Commit Day 1 close**

```bash
git add public/ src/app/layout.tsx
git commit -m "feat: PWA manifest upgrade + iOS meta tags + placeholder icons"
```

---

## Chunk 3: Day 2 — Push, Native Share, Sentry

### Task 3.1: `platform.ts` — runtime detection (TDD)

**Files:**
- Create: `src/lib/platform.ts`, `src/lib/platform.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/platform.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { isIOS, isSafari, isInAppBrowser, isStandalone, shouldOfferIosInstall } from './platform';

describe('platform', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  test('isIOS detects iPhone', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', maxTouchPoints: 5, platform: 'iPhone' });
    expect(isIOS()).toBe(true);
  });

  test('isIOS detects iPad in desktop mode (iPadOS 13+)', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', maxTouchPoints: 5, platform: 'MacIntel' });
    expect(isIOS()).toBe(true);
  });

  test('isIOS returns false on desktop Safari Mac', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', maxTouchPoints: 0, platform: 'MacIntel' });
    expect(isIOS()).toBe(false);
  });

  test('isSafari detects Safari, not Chrome on iOS', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (iPhone) AppleWebKit/605 Version/17.0 Safari/605' });
    expect(isSafari()).toBe(true);
  });

  test('isSafari rejects Chrome on iOS', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (iPhone) CriOS/120 Safari/605' });
    expect(isSafari()).toBe(false);
  });

  test('isInAppBrowser detects Line', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (iPhone) Line/12.0' });
    expect(isInAppBrowser()).toBe(true);
  });

  test('isStandalone returns true when navigator.standalone is set', () => {
    vi.stubGlobal('navigator', { standalone: true });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
    expect(isStandalone()).toBe(true);
  });

  test('shouldOfferIosInstall composite check', () => {
    vi.stubGlobal('navigator', { userAgent: 'iPhone Safari', maxTouchPoints: 5, platform: 'iPhone' });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: false }), localStorage: { getItem: () => null } });
    expect(shouldOfferIosInstall()).toBe(true);
  });
});
```

```bash
pnpm test src/lib/platform.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 2: Implement `src/lib/platform.ts`**

```ts
const DISMISSAL_KEY = 'wizl-ios-install-dismissed-at';
const COOLDOWN_DAYS = 3;

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(ua)) return true;
  // iPadOS 13+ in desktop mode reports as MacIntel with touch points
  return navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1;
}

export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

const IN_APP_BROWSERS = ['Line', 'FBAN', 'FBAV', 'Instagram', 'MicroMessenger', 'TikTok'];
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return IN_APP_BROWSERS.some((p) => ua.includes(p));
}

export function isStandalone(): boolean {
  if (typeof navigator === 'undefined') return false;
  if ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true) return true;
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

function recentlyDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = window.localStorage.getItem(DISMISSAL_KEY);
  if (!raw) return false;
  const dismissedAt = parseInt(raw, 10);
  if (Number.isNaN(dismissedAt)) return false;
  const cutoff = Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return dismissedAt > cutoff;
}

export function shouldOfferIosInstall(): boolean {
  return isIOS() && !isStandalone() && !recentlyDismissed();
}

export function dismissIosInstall(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DISMISSAL_KEY, String(Date.now()));
}
```

- [ ] **Step 3: Run tests**

```bash
pnpm test src/lib/platform.test.ts
```

Expected: PASS, all 9 tests.

- [ ] **Step 4: Commit**

```bash
git add src/lib/platform.ts src/lib/platform.test.ts
git commit -m "feat: platform detection utilities for iOS PWA install flow"
```

### Task 3.2: `native.ts` — Capacitor wrappers (TDD)

**Files:**
- Create: `src/lib/native.ts`, `src/lib/native.test.ts`

- [ ] **Step 1: Write tests for share fallback behavior**

```ts
// src/lib/native.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest';

describe('native.share', () => {
  beforeEach(() => vi.resetModules());

  test('uses Web Share API when available', async () => {
    const webShareMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share: webShareMock });
    const { share } = await import('./native');
    await share({ title: 't', text: 'x', url: 'https://wizl.space/' });
    expect(webShareMock).toHaveBeenCalledWith({ title: 't', text: 'x', url: 'https://wizl.space/' });
  });

  test('falls back to clipboard when no Web Share', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { share } = await import('./native');
    await share({ title: 't', text: 'x', url: 'https://wizl.space/' });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('https://wizl.space/'));
  });
});
```

```bash
pnpm test src/lib/native.test.ts
```

Expected: FAIL.

- [ ] **Step 2: Implement `src/lib/native.ts`**

```ts
import { Capacitor } from '@capacitor/core';
import { Share as CapShare } from '@capacitor/share';

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export interface ShareInput { title: string; text: string; url: string; }

export async function share(input: ShareInput): Promise<void> {
  if (isNative()) {
    await CapShare.share({ title: input.title, text: input.text, url: input.url, dialogTitle: input.title });
    return;
  }
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share(input);
      return;
    } catch {
      // fall through to clipboard
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(`${input.text}\n${input.url}`);
  }
}
```

- [ ] **Step 3: Tests pass**

```bash
pnpm test src/lib/native.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/native.ts src/lib/native.test.ts
git commit -m "feat: native plugin wrappers with web fallbacks"
```

### Task 3.3: `feature-flags.ts` — venue map gate (TDD)

**Files:**
- Create: `src/lib/feature-flags.ts`, `src/lib/feature-flags.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, test, expect, vi, afterEach } from 'vitest';

describe('feature-flags', () => {
  afterEach(() => vi.resetModules());

  test('venue map disabled in Capacitor build', async () => {
    vi.doMock('./native', () => ({ isNative: () => true }));
    const { isVenueMapEnabled } = await import('./feature-flags');
    expect(isVenueMapEnabled()).toBe(false);
  });

  test('venue map enabled on web', async () => {
    vi.doMock('./native', () => ({ isNative: () => false }));
    const { isVenueMapEnabled } = await import('./feature-flags');
    expect(isVenueMapEnabled()).toBe(true);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/feature-flags.ts
import { isNative } from './native';

/**
 * Venue/shop map is hidden in Capacitor build for first Play submission.
 * Re-enable after Play approval in v1.1.
 */
export function isVenueMapEnabled(): boolean {
  return !isNative();
}
```

- [ ] **Step 3: Tests pass + commit**

```bash
pnpm test src/lib/feature-flags.test.ts
git add src/lib/feature-flags.ts src/lib/feature-flags.test.ts
git commit -m "feat: venue map feature flag (off in Capacitor build)"
```

### Task 3.4: Apply feature flag to shop pages

**Files:**
- Modify: `src/app/[locale]/shop/page.tsx`, `src/app/[locale]/shop/dashboard/page.tsx`, anywhere else shop UI renders

- [ ] **Step 1: Wrap shop list/map renders**

In each shop UI file:
```tsx
import { isVenueMapEnabled } from '@/lib/feature-flags';

// In the component:
if (!isVenueMapEnabled()) {
  return (
    <main className="...">
      <p>Venue atlas is coming soon to mobile. Explore the strain library!</p>
    </main>
  );
}
// existing render
```

- [ ] **Step 2: Also gate the nav link to /shop in any header/nav components**

Find the nav component, conditionally render the Shop link.

- [ ] **Step 3: Build both targets and verify**

```bash
pnpm build  # web: shop visible
pnpm build:capacitor  # capacitor: shop renders "coming soon"
```

Manual verification: open `out/en/shop/index.html` and confirm the "coming soon" content is what gets rendered (note: client-side flag, server will pre-render based on `isNative()`'s false default).

Decision: since `isNative()` is false at static-export build time, the static HTML will pre-render the full shop UI. The hide happens at hydration. This is correct — the Play reviewer launches the APK, hydration runs, `isNative()` returns true, UI hides. For belt-and-suspenders we can also exclude `/shop` from the static export sitemap if needed — defer to Day 5 if there's still concern.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/shop/ src/components/  # nav files
git commit -m "feat: hide venue map in Capacitor build for first Play submission"
```

### Task 3.5: Sentry Capacitor SDK

**Files:**
- Modify: `package.json`, `src/app/layout.tsx`

- [ ] **Step 1: Install**

```bash
pnpm add @sentry/capacitor @sentry/react
```

- [ ] **Step 2: Initialize in `src/app/layout.tsx`**

Create `src/lib/sentry.ts`:
```ts
import * as Sentry from '@sentry/react';
import * as CapacitorSentry from '@sentry/capacitor';
import { isNative } from './native';

let initialized = false;
export function initSentry() {
  if (initialized) return;
  initialized = true;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  const init = isNative() ? CapacitorSentry.init : Sentry.init;
  init({ dsn, tracesSampleRate: 1.0, environment: process.env.NODE_ENV });
}
```

Call `initSentry()` in a top-level client component mounted in `layout.tsx`. (Add a small `<SentryBoot />` client component to do this.)

- [ ] **Step 3: Add DSN to env**

`.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=<from Day 0>
```

- [ ] **Step 4: Verify with a deliberate error trigger**

Add a hidden test route or a button that calls `throw new Error('Sentry test')`. Trigger in browser. Check Sentry dashboard within 30s.

- [ ] **Step 5: Remove the test trigger + commit**

```bash
git add package.json pnpm-lock.yaml src/lib/sentry.ts src/app/layout.tsx src/components/SentryBoot.tsx
git commit -m "feat: Sentry crash reporting (web + Capacitor)"
```

### Task 3.6: Supabase `device_tokens` migration

- [ ] **Step 1: Create migration file**

`supabase/migrations/<timestamp>_device_tokens.sql`:
```sql
create table device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('android','ios','web')),
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);
create index on device_tokens (user_id);

alter table device_tokens enable row level security;

create policy "users insert own tokens" on device_tokens
  for insert with check (auth.uid() = user_id);
create policy "users read own tokens" on device_tokens
  for select using (auth.uid() = user_id);
create policy "users delete own tokens" on device_tokens
  for delete using (auth.uid() = user_id);
```

- [ ] **Step 2: Apply via Supabase MCP**

Use `apply_migration` tool against project `qbhyrhvpmavsrpasxnoz`.

- [ ] **Step 3: Verify table exists**

`list_tables` should show `device_tokens`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/
git commit -m "feat: device_tokens table with RLS for FCM"
```

### Task 3.7: `/api/push/register` route (TDD)

**Files:**
- Create: `src/app/api/push/register/route.ts`, `src/app/api/push/register/route.test.ts`

- [ ] **Step 1: Write test**

**Critical:** mocks must be hoisted with `vi.mock` (not `vi.doMock` after import), or the real module is already bound when the test runs. Pattern below uses hoisted factory + dynamic import inside each test to swap mock implementation per case.

```ts
// route.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockGetUser = vi.fn();
const mockUpsert = vi.fn();

vi.mock('@/lib/supabase-server', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({ upsert: mockUpsert }),
  }),
}));

describe('POST /api/push/register', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockUpsert.mockReset();
  });

  test('rejects without auth', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const { POST } = await import('./route');
    const req = new Request('http://localhost/api/push/register', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc', platform: 'android' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  test('rejects invalid platform', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    const { POST } = await import('./route');
    const req = new Request('http://localhost/api/push/register', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc', platform: 'symbian' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  test('upserts token for authed user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    mockUpsert.mockResolvedValue({ error: null });
    const { POST } = await import('./route');
    const req = new Request('http://localhost/api/push/register', {
      method: 'POST',
      body: JSON.stringify({ token: 'abc', platform: 'android' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'u1', token: 'abc', platform: 'android' }),
      expect.objectContaining({ onConflict: 'token' })
    );
  });
});
```

- [ ] **Step 2: Implement route**

```ts
// route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.token !== 'string' || !['android', 'ios', 'web'].includes(body.platform)) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { error } = await supabase.from('device_tokens').upsert({
    user_id: user.id,
    token: body.token,
    platform: body.platform,
    last_seen_at: new Date().toISOString(),
  }, { onConflict: 'token' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

(Note: existing `src/lib/auth.tsx` is client; check if there's a server Supabase client. If not, create `src/lib/supabase-server.ts`.)

- [ ] **Step 3: Tests pass + commit**

```bash
pnpm test src/app/api/push/register/route.test.ts
git add src/app/api/push/register/ src/lib/supabase-server.ts
git commit -m "feat: /api/push/register endpoint (signed-in users only)"
```

### Task 3.8: Push permission + registration after first checkin

**Files:**
- Modify: `src/lib/native.ts` (add registerPushNotifications), `src/app/[locale]/checkin/page.tsx` (trigger after submit)

- [ ] **Step 1: Add push init + request to native.ts**

**Critical:** the `registration` listener must be added ONCE at app boot, not inside `requestAndRegisterPush()` — calling that multiple times would attach duplicate listeners.

```ts
import { PushNotifications } from '@capacitor/push-notifications';

let pushListenerAttached = false;

export function initPushListeners() {
  if (!isNative() || pushListenerAttached) return;
  pushListenerAttached = true;
  PushNotifications.addListener('registration', async (token) => {
    await fetch('https://wizl.space/api/push/register', {
      method: 'POST',
      body: JSON.stringify({ token: token.value, platform: 'android' }),
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    }).catch(() => {});
  });
}

export async function requestAndRegisterPush(): Promise<void> {
  if (!isNative()) return;
  initPushListeners(); // idempotent
  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== 'granted') return;
  await PushNotifications.register();
}
```

Call `initPushListeners()` from a top-level client mount component (same place as `initSentry()`). `requestAndRegisterPush()` is the user-facing trigger, fired after first checkin.

- [ ] **Step 2: Trigger after first successful checkin**

In `src/app/[locale]/checkin/page.tsx` `handleSubmit`, after `setStep('done')`:
```tsx
if (typeof window !== 'undefined') {
  const hasAsked = window.localStorage.getItem('wizl-push-asked');
  if (!hasAsked) {
    window.localStorage.setItem('wizl-push-asked', '1');
    requestAndRegisterPush().catch(() => {});
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/native.ts src/app/[locale]/checkin/page.tsx
git commit -m "feat: request push permission contextually after first checkin"
```

### Task 3.9: Replace placeholder share buttons in checkin done

**Files:**
- Modify: `src/app/[locale]/checkin/page.tsx` (lines 161-170 region)

- [ ] **Step 1: Replace the placeholder share grid**

Find the share block in the `done` step (around `{["📱", "📋", "💬"].map(...)}` — currently shows three emoji placeholder buttons). Replace with:

```tsx
import { Share2 } from 'lucide-react';
import { share } from '@/lib/native';

<button
  onClick={() => share({
    title: `${selectedStrain?.name} on WIZL`,
    text: review || `I just logged ${selectedStrain?.name}`,
    url: `https://wizl.space/strains/${selectedStrain?.id}`,
  })}
  className="w-full py-3 rounded-xl bg-bg-primary border border-border flex items-center justify-center gap-2 hover:bg-bg-card-hover transition-colors"
>
  <Share2 className="w-5 h-5" /> Share
</button>
```

- [ ] **Step 2: Manual verify on Android emulator**

```bash
pnpm build:capacitor && npx cap sync android && npx cap run android
```

Emulator: complete a checkin, tap Share, system share sheet opens.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/checkin/page.tsx
git commit -m "feat: native share replaces emoji placeholder buttons in checkin done"
```

---

## Chunk 4: Day 3 — iOS PWA Install Flow

### Task 4.1: `cooldown.ts` helper (TDD)

**Files:**
- Create: `src/lib/cooldown.ts`, `src/lib/cooldown.test.ts`

- [ ] **Step 1: Test**

**Critical:** `vi.advanceTimersByTime` does NOT move `Date.now()` unless paired with `vi.setSystemTime`. Use `setSystemTime` explicitly.

```ts
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { setCooldown, isOnCooldown } from './cooldown';

describe('cooldown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns false when no cooldown set', () => {
    expect(isOnCooldown('k', 3)).toBe(false);
  });

  test('returns true within cooldown window', () => {
    setCooldown('k');
    expect(isOnCooldown('k', 3)).toBe(true);
  });

  test('returns false after cooldown expires', () => {
    setCooldown('k');
    vi.setSystemTime(new Date('2026-05-19T13:00:00Z')); // +4 days 1h
    expect(isOnCooldown('k', 3)).toBe(false);
  });

  test('returns true at boundary (cooldown is exclusive)', () => {
    setCooldown('k');
    vi.setSystemTime(new Date('2026-05-18T11:59:00Z')); // ~3 days minus 1m
    expect(isOnCooldown('k', 3)).toBe(true);
  });
});
```

- [ ] **Step 2: Implement**

```ts
export function setCooldown(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, String(Date.now()));
}

export function isOnCooldown(key: string, days: number): boolean {
  if (typeof window === 'undefined') return false;
  const raw = window.localStorage.getItem(key);
  if (!raw) return false;
  const setAt = parseInt(raw, 10);
  if (Number.isNaN(setAt)) return false;
  return Date.now() - setAt < days * 24 * 60 * 60 * 1000;
}
```

- [ ] **Step 3: Tests pass + commit**

```bash
pnpm test src/lib/cooldown.test.ts
git add src/lib/cooldown.ts src/lib/cooldown.test.ts
git commit -m "feat: localStorage cooldown helper"
```

### Task 4.2: `IosPwaInstallPrompt` component — three variants (TDD)

**Files:**
- Create: `src/components/IosPwaInstallPrompt.tsx`, `src/components/IosPwaInstallPrompt.test.tsx`

- [ ] **Step 1: Test rendering for each variant**

```tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IosPwaInstallPrompt } from './IosPwaInstallPrompt';

describe('IosPwaInstallPrompt', () => {
  test('renders Safari variant when iOS Safari', () => {
    vi.doMock('@/lib/platform', () => ({
      shouldOfferIosInstall: () => true,
      isSafari: () => true,
      isInAppBrowser: () => false,
      dismissIosInstall: () => {},
    }));
    render(<IosPwaInstallPrompt />);
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
  });

  test('renders in-app browser variant with Open in Safari CTA', () => {
    vi.doMock('@/lib/platform', () => ({
      shouldOfferIosInstall: () => true,
      isSafari: () => false,
      isInAppBrowser: () => true,
      dismissIosInstall: () => {},
    }));
    render(<IosPwaInstallPrompt />);
    expect(screen.getByText(/Open in Safari/i)).toBeInTheDocument();
  });

  test('renders nothing when shouldOfferIosInstall returns false', () => {
    vi.doMock('@/lib/platform', () => ({
      shouldOfferIosInstall: () => false,
      isSafari: () => false,
      isInAppBrowser: () => false,
      dismissIosInstall: () => {},
    }));
    const { container } = render(<IosPwaInstallPrompt />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Implement component**

```tsx
'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { shouldOfferIosInstall, isSafari, isInAppBrowser, dismissIosInstall } from '@/lib/platform';

export function IosPwaInstallPrompt() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<'safari' | 'chrome' | 'inapp'>('safari');

  useEffect(() => {
    if (!shouldOfferIosInstall()) return;
    if (isInAppBrowser()) setVariant('inapp');
    else if (isSafari()) setVariant('safari');
    else setVariant('chrome');
    setOpen(true);
  }, []);

  function dismiss() {
    dismissIosInstall();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4">
      <div className="glass-card rounded-3xl p-6 max-w-md w-full relative">
        <button onClick={dismiss} aria-label="Dismiss" className="absolute top-4 right-4 text-text-muted">
          <X className="w-5 h-5" />
        </button>
        {variant === 'safari' && <SafariContent />}
        {variant === 'chrome' && <ChromeOnIosContent />}
        {variant === 'inapp' && <InAppBrowserContent />}
      </div>
    </div>
  );
}

function SafariContent() {
  return (
    <>
      <img src="/assets/v1/ios-install-header.png" alt="" className="w-20 h-20 mx-auto mb-3" />
      <h2 className="text-xl font-black text-center mb-2">Install WIZL on your iPhone</h2>
      <ol className="text-sm text-text-secondary space-y-3 mt-4">
        <li><strong>1.</strong> Tap the <strong>Share</strong> button at the bottom</li>
        <li><strong>2.</strong> Scroll and tap <strong>Add to Home Screen</strong></li>
        <li><strong>3.</strong> Tap <strong>Add</strong></li>
      </ol>
      <p className="text-xs text-text-muted text-center mt-4">Opens fullscreen from your home screen.</p>
    </>
  );
}

function ChromeOnIosContent() {
  return (
    <>
      <h2 className="text-xl font-black text-center mb-2">WIZL installs from Safari</h2>
      <p className="text-sm text-text-secondary text-center mb-4">
        To install WIZL on iPhone, open this page in Safari, then tap Share → Add to Home Screen.
      </p>
      <button
        onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
        className="w-full py-3 rounded-xl bg-accent-purple text-white font-bold"
      >
        Copy URL
      </button>
    </>
  );
}

function InAppBrowserContent() {
  return (
    <>
      <h2 className="text-xl font-black text-center mb-2">Open in Safari to install</h2>
      <p className="text-sm text-text-secondary text-center mb-4">
        You&apos;re in an in-app browser. Tap the menu (•••) and choose <strong>Open in Safari</strong>, then install from there.
      </p>
    </>
  );
}
```

- [ ] **Step 3: Tests pass + commit**

```bash
pnpm test src/components/IosPwaInstallPrompt.test.tsx
git add src/components/IosPwaInstallPrompt.tsx src/components/IosPwaInstallPrompt.test.tsx
git commit -m "feat: iOS PWA install prompt with three variants"
```

### Task 4.3: Mount IosPwaInstallPrompt after AgeGate

**Files:**
- Modify: `src/app/layout.tsx` (or wherever AgeGate is mounted)

- [ ] **Step 1: Mount conditionally**

In the layout file that wraps `AgeGate`:
```tsx
import { IosPwaInstallPrompt } from '@/components/IosPwaInstallPrompt';

// inside the JSX, after AgeGate:
<AgeGate>
  {children}
  <IosPwaInstallPrompt />
</AgeGate>
```

(Check actual structure of `AgeGate.tsx` and adapt.)

- [ ] **Step 2: Manual test on real iPhone Safari**

Open `https://wizl.space/` in Safari on Босс's iPhone. Confirm:
- Age gate appears first
- After confirming age, install prompt appears with Safari variant
- Tapping X dismisses; reopening within 3 days does NOT re-show
- After 3 days (or clearing localStorage), it re-shows

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx  # or appropriate file
git commit -m "feat: mount IosPwaInstallPrompt after age gate"
```

### Task 4.4: "Install on iOS" link in profile

**Files:**
- Modify: `src/app/[locale]/profile/page.tsx`

- [ ] **Step 1: Add mobile-only install entry**

In the settings section:
```tsx
import { isIOS, isStandalone } from '@/lib/platform';
import { Download } from 'lucide-react';

{isIOS() && !isStandalone() && (
  <button
    onClick={() => {
      window.localStorage.removeItem('wizl-ios-install-dismissed-at');
      window.location.reload();
    }}
    className="glass-card rounded-xl p-3 flex items-center gap-3 w-full text-left hover:bg-bg-card-hover transition-all"
  >
    <Download className="w-4 h-4 text-accent-purple" />
    <span className="text-sm text-text-secondary">Install WIZL on iPhone</span>
  </button>
)}
```

(Reload triggers the prompt; cooldown is reset by removing the key.)

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/profile/page.tsx
git commit -m "feat: profile entry point for iOS install prompt"
```

---

## Chunk 5: Day 4 — Offline Cache, Splash, Deep Links

### Task 5.1: Service worker for strain cache

**Files:**
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx` (register sw)

- [ ] **Step 1: Write `public/sw.js`**

```js
const CACHE_VERSION = 'wizl-v1';
const STRAIN_PATTERNS = [/\/api\/strains/, /\/_next\/data\/.+\/strains/];

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isStrainData = STRAIN_PATTERNS.some((re) => re.test(url.pathname));
  if (!isStrainData) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(event.request);
    const fetchAndUpdate = fetch(event.request).then((res) => {
      if (res.ok) cache.put(event.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fetchAndUpdate;
  })());
});
```

- [ ] **Step 2: Register sw in layout (web only, not in Capacitor)**

In a top-level client component. Gate on `!isNative()` — Capacitor app already serves from local assets and doesn't benefit from a service worker; the SW could also intercept Supabase REST calls in untested ways.

```tsx
import { isNative } from '@/lib/native';

useEffect(() => {
  if (isNative()) return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}, []);
```

Note on cache patterns: `STRAIN_PATTERNS` targets `/api/strains` and `/_next/data/.+/strains`. If strains are fetched directly from Supabase REST (e.g. `https://qbhyrhvpmavsrpasxnoz.supabase.co/rest/v1/strains`), add that pattern too:
```js
const STRAIN_PATTERNS = [
  /\/api\/strains/,
  /\/_next\/data\/.+\/strains/,
  /supabase\.co\/rest\/v1\/strains/,
];
```
Verify the actual fetch URL in DevTools Network tab before settling on the patterns.

- [ ] **Step 3: Manual verify**

DevTools → Application → Service Workers → confirm registered. Network tab → throttle to Offline → reload `/strains` → strain list still renders from cache.

- [ ] **Step 4: Commit**

```bash
git add public/sw.js src/app/layout.tsx
git commit -m "feat: service worker for strain data caching"
```

### Task 5.2: `OfflineBanner` component (TDD)

**Files:**
- Create: `src/components/OfflineBanner.tsx`, `.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner', () => {
  test('hidden when online', () => {
    vi.stubGlobal('navigator', { onLine: true });
    render(<OfflineBanner />);
    expect(screen.queryByText(/offline/i)).toBeNull();
  });

  test('visible when offline event fires', () => {
    vi.stubGlobal('navigator', { onLine: true });
    render(<OfflineBanner />);
    act(() => {
      vi.stubGlobal('navigator', { onLine: false });
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
'use client';
import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(typeof navigator !== 'undefined' && !navigator.onLine);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  if (!offline) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-40 bg-bg-card border-b border-border px-4 py-2 flex items-center gap-2 text-xs">
      <WifiOff className="w-4 h-4 text-text-muted" />
      <span className="text-text-muted">You&apos;re offline — showing cached content</span>
    </div>
  );
}
```

- [ ] **Step 3: Mount in layout + commit**

```bash
git add src/components/OfflineBanner.tsx src/components/OfflineBanner.test.tsx src/app/layout.tsx
git commit -m "feat: offline status banner"
```

### Task 5.3: Splash screen placeholder

**Files:**
- Create: `resources/icon.png`, `resources/splash.png` (placeholders)
- Modify: Android splash resources

- [ ] **Step 1: Create placeholder assets**

```bash
mkdir resources
copy public\mascot.png resources\icon.png
copy public\mascot.png resources\splash.png
```

Real assets from sibling Day 6.

- [ ] **Step 2: Generate Capacitor assets**

```bash
npx capacitor-assets generate
```

Generates per-density Android resources.

- [ ] **Step 3: Sync**

```bash
npx cap sync android
```

- [ ] **Step 4: Build APK and verify splash on emulator**

```bash
npx cap run android
```

Cold start → splash visible briefly → app loads.

- [ ] **Step 5: Commit**

```bash
git add resources/ android/
git commit -m "feat: placeholder splash and icon for Capacitor"
```

### Task 5.4: Deep links

**Files:**
- Modify: `android/app/src/main/AndroidManifest.xml`, `src/app/layout.tsx`

- [ ] **Step 1: Add intent-filter to AndroidManifest.xml**

Inside the `<activity>` block, add:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="wizl.space" />
</intent-filter>
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="space.wizl.app" />
</intent-filter>
```

- [ ] **Step 2: URL listener in a client component**

Create `src/components/DeepLinkHandler.tsx`:
```tsx
'use client';
import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/navigation';
import { isNative } from '@/lib/native';

export function DeepLinkHandler() {
  const router = useRouter();
  useEffect(() => {
    if (!isNative()) return;
    const sub = App.addListener('appUrlOpen', (event) => {
      try {
        const url = new URL(event.url);
        const path = url.pathname || event.url.replace(/^space\.wizl\.app:\/\//, '/');
        router.push(path);
      } catch {}
    });
    return () => { sub.then((s) => s.remove()); };
  }, [router]);
  return null;
}
```

Mount in layout.

- [ ] **Step 3: Place assetlinks.json with UPLOAD key fingerprint (placeholder until Day 5)**

**Critical:** Google Play App Signing re-signs the APK with Google's key. The fingerprint that validates Android App Links in production is the **App Signing key**, NOT the upload key. We can't get the App Signing key SHA-256 until the first AAB is uploaded to Internal Testing (Day 5), so we ship a placeholder now and swap on Day 5.

Place `public/.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "space.wizl.app",
    "sha256_cert_fingerprints": ["<UPLOAD_KEY_SHA256_PLACEHOLDER>"]
  }
}]
```

Fill placeholder with output from:
```bash
keytool -list -v -keystore wizl-upload-key.keystore -alias wizl-upload | grep SHA256
```

This works for sideloaded debug builds. **Day 5 will swap this for the Play App Signing key fingerprint** — see Task 6.4 follow-up.

- [ ] **Step 4: Manual test**

Build APK, install. Open `https://wizl.space/strains/og-kush` in Chrome on phone → should offer to open in WIZL app.

- [ ] **Step 5: Commit**

```bash
git add android/app/src/main/AndroidManifest.xml src/components/DeepLinkHandler.tsx public/.well-known/
git commit -m "feat: Android App Links + Capacitor deep link routing"
```

---

## Chunk 6: Day 5 — Play Listing + Submit Internal Testing

### Task 6.1: Listing copy committed

**Files:**
- Create: `docs/store-listing/google-play-listing.md`

- [ ] **Step 1: Copy listing copy from spec**

Paste the Title, Short Description, Long Description blocks from spec verbatim into `docs/store-listing/google-play-listing.md`. This is the source of truth for what gets pasted into Play Console.

- [ ] **Step 2: Commit**

```bash
git add docs/store-listing/
git commit -m "docs: Google Play Store listing copy"
```

### Task 6.2: Privacy policy update

**Files:**
- Modify: existing `/privacy` route or page

- [ ] **Step 1: Locate privacy page**

```bash
# Use Glob: src/app/**/privacy*
```

- [ ] **Step 2: Add mobile + Sentry disclosure sections**

Append to the policy:

> **Mobile app data (Android)**
>
> If you use the WIZL Android app, we collect:
> - **Device push token** (only if you are signed in and grant push permission) — used to send you check-in reminders. Stored in our database, never shared.
> - **Crash diagnostics** (Sentry) — anonymized error reports including device model, OS version, and stack traces. Used to fix bugs.
>
> We do not collect: precise location, contacts, photos, microphone, or financial data.

- [ ] **Step 3: Commit**

```bash
git add <privacy page path>
git commit -m "docs: privacy policy mobile + Sentry disclosure"
```

### Task 6.3: Build signed AAB

- [ ] **Step 1: Configure signing**

`android/app/build.gradle` — add signingConfigs (use the upload keystore from Day 0). Reference path via env var or `local.properties` (not committed).

- [ ] **Step 2: Build**

```bash
pnpm build:capacitor
npx cap sync android
cd android
./gradlew bundleRelease
```

Expected: `android/app/build/outputs/bundle/release/app-release.aab`

- [ ] **Step 3: Verify size and contents**

```bash
ls -lh android/app/build/outputs/bundle/release/
```

Should be under 50MB.

### Task 6.4: Upload to Internal Testing

- [ ] **Step 1: Manual — Play Console**

In Play Console:
1. Create app: package `space.wizl.app`, default language EN, app/game = App, free, declarations checked
2. Internal Testing track → Create release → upload AAB
3. Fill release notes: "Sprint 1 — initial launch"
4. Save

- [ ] **Step 2: App content sections**

Complete all required sections:
- Privacy policy URL: `https://wizl.space/privacy`
- App access: no login restrictions (anonymous works) — note that sign-in unlocks push only
- Ads: No
- Content rating: complete IARC questionnaire — Adults Only 18+
- Target audience: 18+
- Data safety form: complete per spec (device token + Sentry diagnostics + optional email)
- App category: Lifestyle
- Contact email + privacy policy URL set
- Tags: cannabis education, strain reference

- [ ] **Step 3: Country availability**

Production track → Countries/regions → select All worldwide → **uncheck Russia**.

- [ ] **Step 4: Submit to Internal Testing review**

- [ ] **Step 5: Capture App Signing key SHA-256 from Play Console**

After AAB upload, Play Console → Setup → App integrity → App Signing key certificate → copy SHA-256 fingerprint.

- [ ] **Step 6: Update assetlinks.json with the App Signing fingerprint**

Replace the placeholder in `public/.well-known/assetlinks.json` with the SHA-256 from Step 5. Redeploy web (Vercel auto-deploys on push to main).

Verify:
```bash
curl https://wizl.space/.well-known/assetlinks.json
```

Should return the JSON with the new fingerprint. Test with Google's verifier:
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https%3A%2F%2Fwizl.space&relation=delegate_permission%2Fcommon.handle_all_urls

- [ ] **Step 7: Commit local config**

```bash
git add android/  # signing config gradle (without keystore secrets)
git add public/.well-known/assetlinks.json
git commit -m "build: signed release AAB pipeline + Play App Signing fingerprint"
```

---

## Chunk 7: Day 6 — Internal Testing + Visual Asset Swap

### Task 7.1: Install via internal link, smoke test

- [ ] **Step 1: Get tester opt-in URL from Play Console**

Internal Testing → Testers tab → copy opt-in URL → open on Босс's phone → install WIZL.

- [ ] **Step 2: Run acceptance criteria**

For each criterion in spec acceptance section, verify on the installed app. Document any FAIL.

### Task 7.2: Swap placeholder visual assets

- [ ] **Step 1: Sibling visual session drops real files**

In `public/assets/v1/`:
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`
- `ios-install-step-1.png`, `ios-install-step-2.png`, `ios-install-step-3.png`, `ios-install-header.png`

In `resources/`:
- `icon.png` (1024×1024 final mascot)
- `splash.png` (2732×2732 final splash)

In `docs/store-listing/`:
- `play-feature-graphic.png` (1024×500)
- `play-screenshot-1.png` ... `play-screenshot-5.png`

- [ ] **Step 2: Regenerate Capacitor assets**

```bash
npx capacitor-assets generate
npx cap sync android
```

- [ ] **Step 3: Rebuild signed AAB**

```bash
pnpm build:capacitor
cd android && ./gradlew bundleRelease
```

- [ ] **Step 4: Upload new build to Internal Testing**

Play Console → Internal Testing → new release → upload.

- [ ] **Step 5: Upload store listing assets to Play Console**

Feature graphic, screenshots.

- [ ] **Step 6: Commit**

```bash
git add public/assets/ resources/ docs/store-listing/ android/
git commit -m "feat: integrate real visual assets from sibling session"
```

### Task 7.3: Fix any issues found

For each FAIL from smoke test, create a focused commit fixing only that issue. Re-build, re-upload.

---

## Chunk 8: Day 7 — Production Release

### Task 8.1: Promote to Production

- [ ] **Step 1: Confirm Internal Testing build passed review**

- [ ] **Step 2: Production track → Create release**

Reuse the build from Internal Testing (Play offers "Promote release" option). Add release notes:
> WIZL v1.0 — Cannabis Magic Book. Browse strains, build your taste profile, ask Wizl anything. 18+ only.

- [ ] **Step 3: Country availability check (Russia excluded)**

- [ ] **Step 4: Submit for review**

### Task 8.2: Monitor first 24h

- [ ] **Step 1: Sentry dashboard**

Check `wizl-mobile` project hourly for first 4h, then every few hours.

- [ ] **Step 2: Play Console crash + ANR reports**

### Task 8.3: iOS PWA verification

- [ ] **Step 1: On Босс's iPhone Safari**

Open wizl.space → age gate → install prompt → Add to Home Screen → open from icon → confirm fullscreen, no Safari chrome, login session retained.

- [ ] **Step 2: Test Chrome-on-iOS variant**

Open same URL in Chrome on iPhone → see "Open in Safari" variant → tap Copy URL → confirm clipboard.

- [ ] **Step 3: Test in-app browser variant**

Send wizl.space link to yourself in Telegram/Line → open in-app → see "Open in Safari" CTA.

### Task 8.4: Sprint 1 wrap-up

- [ ] **Step 1: Update memory**

Save to `D:\claude-data\projects\D--PROJECTS\memory\`:
- `project_wizl_sprint1_done.md` — outcomes, learnings, what's on Play, what's in PWA flow
- Index in MEMORY.md

- [ ] **Step 2: Update CLAUDE.md WIZL section**

Note: Android live on Play Store. iOS PWA ready. Cabinet redesign (v1.1) next.

- [ ] **Step 3: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: WIZL Sprint 1 complete — Android live, iOS PWA ready"
```

- [ ] **Step 4: Trigger v1.1 brainstorm**

In a follow-up session: cabinet redesign per saved feedback memories (no emojis, multi-mood, stoned-friendly UX).

---

## Acceptance Verification (post-implementation gate)

Run each spec acceptance criterion against the installed app. Each must pass or have known reason:

- [ ] APK installs and launches on Android, cold-start under 3s
- [ ] No RU locale, /ru/* redirects, no Cyrillic in source/DB
- [ ] Push permission prompt appears after first checkin (contextual, not on open)
- [ ] Signed-in user push token registered, test push delivers within 30s
- [ ] Airplane mode: app opens, strains list visible, AI chat shows offline state
- [ ] iOS Safari first visit: install prompt with Safari variant
- [ ] Chrome-on-iOS: Open-in-Safari variant
- [ ] In-app browser: Open-in-Safari CTA variant
- [ ] Installed PWA opens fullscreen, retains login
- [ ] Native share opens Android share sheet / iOS share sheet
- [ ] Deep link wizl.space/strains/{id} opens inside Android app
- [ ] Sentry test exception arrives within 30s
- [ ] Google Play Internal Testing approved
- [ ] Public release approved (or feedback documented)
- [ ] Russia not in Play Console country list
- [ ] Geo-block middleware redirects RU IPs on wizl.space

---

## Rollback Strategy

If Production release is rejected or produces critical bugs:

1. **Play Console:** halt rollout (Play allows pausing percentage rollouts; set to 0%)
2. **Internal Testing:** keep accessible to Босс for testing fixes
3. **Hotfix path:** small fix → new AAB → Internal Testing → Production patch release
4. **Worst case:** unpublish from Production (preserves Internal Testing, removes public availability)

Web wizl.space is unaffected by Play rollback — separate deploy.

---

## Open Questions Resolved During Implementation

These were carried from spec; resolve at the indicated task:

- Google Play Developer email → Task 1.4
- Listing copy approval → Task 6.1 (Босс reviews before paste)
- Push notification text → Task 3.8 implementation choice
- AppId confirmation → Task 2.3 (`space.wizl.app` default; switch if Босс objects)
- 5-screenshot storyboard → Task 7.2 (sibling session decides composition; Босс approves before Play upload)
- In-app feedback email → defer to v1.1
