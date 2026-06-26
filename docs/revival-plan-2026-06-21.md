# WIZL Revival Plan

**Date:** 2026-06-21  
**Mode:** revive, clean, relaunch  
**Owner:** Sergey / Frogface

## North Star

WIZL is the international cannabis discovery project: scan it, know it, track it.

The product stays honest and useful. The media layer makes it visible. The brand stays warm, mystical, street-level, and Bangkok-built.

## Boundaries

- Audience: EN/TH first.
- No restricted-market cannabis content.
- WIZL is education and discovery, not a marketplace, not delivery, not dealer tooling.
- No fake ratings, fake check-ins, fake community proof.
- Sergey stays human in content. AI video is for WIZL the character, not a replacement for Sergey.

## Current State

- Web app exists and has the core loop: scan, catalog, check-in, profile, map, Club.
- Supabase is the source of truth for the large strain catalog.
- Local fallback catalog has a smaller demo set.
- Content factory exists with recipes, style nodes, generated post packs, and launch playbooks.
- Repo has uncommitted UX/content changes that should be reviewed and either kept or split into clean commits.
- Mobile/Capacitor sprint is partially planned but not ready to ship.

## Phase 0 — Repo Recovery

Goal: make the project safe to work on again.

- Remove unrelated MyReply assets from the WIZL repo.
- Use npm as the single package manager and keep only `package-lock.json`.
- Rename package from legacy placeholder to `wizl`.
- Install dependencies and run baseline checks.
- Review current dirty tree and split it into clear commits:
  - UX atmosphere / wisdom copy
  - scan-checkin flow improvements
  - map/profile polish
  - content factory import
  - Android/PWA planning docs

Definition of done:
- `npm run lint`, `npm run test`, and `npm run build` have known status.
- Git status is understandable.
- No unrelated MyReply files remain.

## Phase 1 — Legal And Locale Cleanup

Goal: make WIZL safe for the international lane.

- Choose the live locale set for June relaunch.
- Recommended: keep `en` and `th`, remove public `ru` routes.
- Remove `ru` cannabis UI from `messages`, routing, wisdom copy, metadata, and generated public pages.
- Audit `src/data/shops.ts` for Cyrillic words inside imported Google names.
- Add a simple content rule to docs: no restricted-market posts, captions, hashtags, or account targeting.

Definition of done:
- Public app cannot be browsed under `/ru`.
- No restricted-market cannabis copy is intentionally shipped.
- Internal working docs can remain in project docs/knowledge when they are not public-facing.

## Phase 2 — Product Core Relaunch

Goal: make the web app useful in one sitting.

- Home: hero, scan CTA, Ask WIZL, and one clear route into The Book.
- Scan: search-by-name first, photo/description second, clean result screen, save to check-in.
- Check-in: fast path from scan and map; no heavy catalog load unless needed.
- The Book: honest unrated state, search/filter/sort, clean detail page.
- Profile: anonymous-first value, clear upgrade path to email login.
- Map: keep as discovery, but avoid implying commerce or delivery.

Definition of done:
- A new user can land, search/scan, save a check-in, and see it in profile within 2 minutes.
- No fake social proof is visible.
- API failures degrade cleanly.

## Phase 3 — Content Engine Relaunch

Goal: restart WIZL as a visible walking/content brand.

- Use `content/factory` as the production system for posts.
- Keep 3 recurring formats:
  - Strain of the Day
  - WIZL Wisdom
  - Bangkok shop/walk field notes
- Publish EN/TH only.
- Create one weekly batch rather than daily improvisation.
- Keep captions simple, human, and signed from Bangkok.

Definition of done:
- 7-day queue ready.
- Assets and captions live under `content/posts/YYYY-MM-DD-*`.
- Each post has a single CTA: try WIZL, scan a strain, or follow the journey.

## Phase 4 — Mobile Track

Goal: ship mobile only after web is clean.

- Treat Android as a separate release track.
- Finish Capacitor config only after web build is stable.
- Static Android shell must call live `https://wizl.space/api/*`, not relative `/api/*`.
- iOS remains PWA-first until Apple cannabis policy risk is resolved.
- Venue/map features can be feature-flagged off for first Android submission if needed.

Definition of done:
- `BUILD_TARGET=capacitor` build succeeds.
- Android shell works without local API routes.
- Store listing copy is policy-aware and education-focused.

## Phase 5 — Metrics

Track only useful signals:

- First scan/search completed.
- First check-in saved.
- Return visit.
- Club support click.
- Shop map open.
- Content clickthrough to `wizl.space`.

Do not optimize for vanity engagement before the core loop works.

## Immediate Next Actions

1. Finish repo cleanup and commit it.
2. Run baseline install/checks.
3. Remove or hide RU public locale.
4. Fix hardcoded English strings in scan/map/profile/not-found.
5. Verify production env: Supabase, OpenRouter, Anthropic, Gumroad, Vercel.
6. Prepare a 7-day EN/TH launch queue from existing content.
7. Relaunch web before touching Android release work.

## Revival Principle

Do not rebuild WIZL from scratch.

Revive the loop that already exists, clean the legal/product edges, and put Sergey back into the street-level distribution machine.
