# WIZL Launch Readiness

Updated: 2026-06-27

## Current Launch State

WIZL is close to a soft public launch.

The core web flow now explains the product quickly:

- Home: scan, Book, map, Ask WIZL.
- Scan: AI strain estimate with educational trust copy.
- Book: 3,000+ strains visible on production.
- Map: shop discovery and shop-owner CTA.
- Check-in: AI scan path, search path, and save flow.
- Club: free founder claim plus optional $4.20/year support.

Production smoke on `https://wizl.space/en`:

- No Russian text detected in the checked public pages.
- No 400/500 page responses detected during the mobile pass.
- AI scan returns real OpenAI results when the key is present.
- Age gate appears first for new users.
- Basic launch analytics events are wired in the client funnel.
- Latest production deploy is Ready on Vercel.
- Production Book shows 3,123 strains.
- Production text scan for a Cherry King-style prompt returned a cherry strain result, not the old OG Kush fallback.
- Production social preview is live: `og:image` and `twitter:image` point to `https://wizl.space/og-image.png`.
- Production sitemap is live at `https://wizl.space/sitemap.xml` with 6,268 URLs, and `robots.txt` points to it.
- The inherited global canonical was removed so deep pages do not all canonicalize to `/en`.
- Vercel Analytics is connected in production. Browser smoke confirmed the analytics script plus `POST /view` and `POST /event` returning 200.
- Mobile bottom navigation spacing was tightened by removing the duplicated layout-level bottom padding; page-level safe space still keeps bottom CTAs above the nav.
- Strain detail pages now generate strain-specific SEO metadata: title, description, canonical, OpenGraph, Twitter card, and keywords.
- Local Supabase env is verified: `.env.local` reaches the `strains` table and returns 3,123 rows, so local Book audits no longer silently depend on the 62-strain static fallback.
- Launch content assets have a repeatable verifier and a publishing kit with exact files, captions, story prompts, and week-1 metrics.
- Check-in rating and success states were polished with stable icon controls, cleaner secondary labels, and scroll-to-top behavior after saving.

## User Audit

### First Impression

The app now has a clear promise: scan what you got, learn it, save it. The character layer makes it memorable, but the interface still needs to keep proving that WIZL is useful in the first 10 seconds.

### Strong Points

- The home page finally says what the product does without requiring lore context.
- The Book count is impressive and gives instant substance.
- The AI scan flow has trust copy, which matters for cannabis and image recognition.
- The map creates a broader discovery angle beyond strain lookup.
- The $4.20 Club offer fits the brand and does not feel like a hard paywall.

### Friction

- Age gate blocks every direct URL for a new user. This is legally useful, but launch content should send people to one clear CTA after they enter.
- Check-in selection, rating, save, share, and success states are launch-polished; remaining improvements can wait for real user feedback.
- Strain cards are dense on mobile. Good for power users, but first-time users may need clearer "tap to open" affordance later.
- Build-time strain detail fallback noise has been cleaned up.
- The deprecated Next `middleware` convention has been migrated to `proxy`.
- Local dev now reaches Supabase for the full 3,123-strain Book; the 62-strain fallback remains only as an offline safety net.
- Mobile bottom navigation no longer adds a second layout-level bottom gutter on top of page safe space.
- Top strain detail pages no longer inherit the generic WIZL social metadata.

### Latest Mobile Pass - 2026-06-27

Checked with a verified age-gate state:

- Home: clear promise, primary scan CTA, quick links, Ask WIZL module.
- Scan: name search, photo path, description path, trust copy, free-scan card.
- Scan result: Cherry prompt returns a cherry strain estimate and exposes save/check-in CTA.
- Book: production shows 3,123 strains; local dev fallback shows 62 when Supabase fetch is unavailable.
- Strain detail: OG Kush page loads with check-in/favorite/want-to-try actions.
- Check-in: entry screen clearly offers AI scan and starting points; rating/save/success flow was checked end-to-end on mobile.
- Map: 1,594 shops load with filters and shop-owner CTA.
- Club, Story, Shop: pages load and explain their role without Russian text.

### Latest Strain SEO Pass - 2026-06-27

Checked the first 20 Book strain pages locally against the production build:

- All 20 returned HTTP 200.
- All 20 had strain-specific titles ending in `| WIZL`.
- All 20 had meta descriptions between 120 and 160 characters.
- All 20 had canonicals pointing to their exact `/en/strains/[id]` URL.
- OpenGraph titles matched the strain-specific page titles.

### Latest Local Book Data Pass - 2026-06-27

Checked local `.env.local` and browser dev mode:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present.
- Supabase REST count returned `0-0/3123`.
- Local `/en/strains` loaded `3123 strains`.
- No `Offline sample loaded` warning appeared.

## Launch Blockers

None for a founder-led soft launch.

Do not run a big paid campaign until:

- AI scan is tested with 20-30 real labels/photos.
- Founder story and first WIZL adventure assets are published and pinned.

## Soft Launch Definition

WIZL is soft-launch ready when:

- A new adult user can understand the product from the home page.
- A user can search The Book and open a strain.
- A user can run one AI scan and see a result that is not a demo fallback.
- A user can save/check in a strain.
- The founder story explains why WIZL exists.
- The first 7 days of content are ready to post.

Status on 2026-06-27: soft-launch ready for founder-led organic traffic; content publishing is now the main bottleneck.

## Next Product Sprint

1. Test AI scan with 20-30 real labels/photos using `docs/ai-scan-qa-log.md` and write down misses.

## Analytics Events

Client events now emit through `trackEvent()` to the official Vercel Analytics collector, with GA and `dataLayer` bridges still available:

- `home_primary_cta_clicked`
- `home_quick_link_clicked`
- `strain_search_submitted`
- `strain_filter_changed`
- `strain_sort_changed`
- `strain_opened`
- `scan_photo_selected`
- `scan_started`
- `scan_completed`
- `scan_failed`
- `scan_limit_reached`
- `scan_save_checkin_clicked`
- `checkin_scan_cta_clicked`
- `checkin_saved`
- `checkin_share_clicked`
- `club_free_claimed`
- `club_support_clicked`
- `club_checkout_success`

Privacy rule: do not send user photos, free-text strain descriptions, or full notes. Only send safe funnel metadata such as source, result type, confidence, text length, rating, and whether a shop was selected.

## Next Marketing Sprint

1. Publish founder story reel from the Hero video.
2. If Founder Story is not cut yet, publish "Meet WIZL" as the Day 1 fallback.
3. Publish the Product Hook scan-label reel.
4. Publish "THC Is Not The Whole Story" carousel.
5. Publish "The Lost Page at the Night Market" adventure reel.
6. Pin the founder story, product hook, and best WIZL lore post.
7. Track comments manually for the first week and turn good questions into posts.

Operational queue: `content/publish-queue.md`.

Launch week calendar: `content/launch-week-calendar.md`.

Launch publishing kit: `content/launch-publishing-kit.md`.

AI scan QA log: `docs/ai-scan-qa-log.md`.
