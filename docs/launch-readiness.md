# WIZL Launch Readiness

Updated: July 21, 2026
Status: local release candidate verified; production deployment pending
Launch type: founder-led organic soft launch

## Verdict

WIZL has a real product heart and a memorable world. The current build is ready for a controlled founder-led soft launch after production smoke testing. It is not ready for a large paid or commercial launch, and scanner promotion still requires real-label QA.

The best product is not the old map or an AI strain guess. It is:

- The Book
- cautious label literacy
- a fast private field note
- the personal taste trail
- WIZL as a companion and serialized character

## Verification snapshot

Verified locally on July 21, 2026:

- 7 automated tests pass across analytics, scan rate limiting, and API rate limiting.
- ESLint and TypeScript pass.
- The production build generates 6,279 static pages.
- The Book verifier confirms 3,123 Supabase strain-reference entries.
- Content assets pass dimension, duration, and completeness checks through ffprobe.
- Launch smoke passes all core English routes, the /ru redirect, paused checkout, and a Cherry King then Gelato back-to-back lookup.
- Browser QA passes the age gate, mobile and desktop layout, English and Thai switching, field-note save, local profile persistence, and zero runtime page errors.
- English and Thai message trees match at 213 leaf keys each with no broken Thai encoding.
- The OpenAI credential is accepted, but the account currently returns insufficient_quota for generation. The structured OpenRouter fallback works; if providers fail, WIZL returns an honest unknown result instead of guessing.
- Legacy generated social visuals are treated as storyboards. The canonical publish queue blocks old otter-era art and the obsolete "Scan what you got" promise until Sergey replaces or approves them.

Production remains a separate gate for the exact pushed commit.

## What the current truth pass changed

Product:

- Journal replaced Map in bottom navigation.
- Home now leads with label understanding and memory.
- Public venue data is paused behind an honest Atlas notice.
- Check-in no longer asks the user to attach a shop.
- Strain pages no longer claim product availability at venues.
- Profile no longer promises account sync.
- Profile explains local storage and exports field notes as JSON.
- WIZL Club no longer grants browser-only fake paid access.
- Checkout now returns 410 while payments are paused.
- Shop owner checkout and dashboard prototype were removed.
- The partner page now describes only a licensed, compliance-reviewed pilot.
- “Blasted” was replaced by “Grounded.”

Trust and cost:

- The scanner prompt now forbids cultivar and potency claims from appearance alone.
- Unknown flower is a real result state and cannot be saved as a named field note.
- Images are resized to a maximum 1,600-pixel dimension before upload.
- Scan and chat endpoints have best-effort in-memory network limits.
- Rate-limit behavior has tests.
- Ask WIZL no longer assists with sellers, prices, delivery, or purchase directions.

Privacy and legal:

- Auth UI and callback code were removed because user data was not synced.
- Privacy and Terms now match local storage, OpenAI, OpenRouter, Supabase, and Vercel.
- Refund page says no paid service is active.
- Sitemap no longer advertises paused or no-index commercial routes.
- Age gate uses legal age in the user’s jurisdiction rather than a universal 20 or 21.

Performance:

- Original character PNG files remain available for content production.
- The app now uses optimized WebP versions.
- Approximate web asset reductions:
  - hero: 4.6 MB to about 76 KB
  - mascot: 6.6 MB to about 16 KB
  - Book: 8.0 MB to about 69 KB
  - avatar: 5.5 MB to about 19 KB
  - header mark: 3.3 MB to about 5 KB

## Strengths

### Memorability

WIZL has original IP, a protagonist, a cat, a magic object, recurring worlds, and a founder story. This can grow into a media and merchandise brand rather than remain a utility with a cannabis skin.

### Substance

The Book contains more than 3,000 reference entries. The app already supports exact-name search, field notes, ratings, moods, favorites, a wishlist, achievements, export, and taste patterns.

### Privacy wedge

No account is required and journal data remains on the device. User feedback across journal products repeatedly shows that privacy and low friction matter in this category.

### Founder-market fit

Sergey genuinely cares about Bangkok, cannabis culture, world-building, walking, and making useful things. The founder story is not manufactured.

## Critical risks

### Scanner accuracy

A flower photo cannot establish a named cultivar or potency. The new prompt and unknown state reduce false confidence, but twenty or more real packages and difficult cases must be tested before strong promotion.

Required QA classes:

- clear strain name
- clear full label
- reflective jar
- partial label
- handwritten label
- multiple products in frame
- naked flower
- unrelated plant
- screenshot or meme
- non-English label
- fake or misspelled strain
- second scan after a prior result

Pass condition:

No sticky prior result, no confident naked-flower guess, and no invented exact potency.

### Distributed abuse protection

The in-memory limiter is only a first line. Serverless instances do not share memory reliably.

Before more than a small launch:

- add a durable quota through Redis, Vercel Firewall, or another shared store
- set provider usage alerts and hard budgets
- record per-route cost without storing user content
- add bot and payload protection

### Local-only data loss

The privacy wedge is also a retention risk. Users can lose notes when browser storage is cleared.

Launch mitigation:

Visible explanation plus export.

Later decision:

Add opt-in sync only after user demand and a real migration design.

### Catalog trust

The Book is reference data, not product or batch data. THC numbers and effects must stay framed as references. Add source and update provenance to the data backlog.

### Thailand

The planned Bangkok return cannot use the old dispensary-tour playbook. Current official guidance describes medical controls, prescriptions, advertising restrictions, and online-sales restrictions. Use local legal review before any partner campaign.

### Payments

The project should not assume Gumroad, Stripe, Paddle, or Lemon Squeezy will support the business. Checkout stays off until the exact model is approved in writing.

### Platform distribution

Meta, TikTok, YouTube, and X all restrict drug-related advertising, sales, or promotional content. Organic educational and narrative content is the starting point. Reach suppression is possible and is not a reason to evade moderation.

## Launch gates

### Gate A: repository

- npm test passes
- npm run lint passes
- npm run build passes
- book-data verifier passes
- content-asset verifier passes
- no secrets are tracked
- no unintended large generated files are added
- HERO.MOV remains untouched unless explicitly approved

### Gate B: production

- deploy is Ready
- home, Book, label reader, field note, Profile, Story, Club, Privacy, and Terms return 200
- checkout returns 410
- old map displays the paused Atlas notice
- old shop URL displays partner pilot, not checkout
- no Russian locale or public Russian cannabis copy
- language button displays a flag
- mobile navigation does not overlap controls
- optimized images load
- analytics receives only safe metadata

### Gate C: product trust

- twenty real-label QA cases recorded
- naked flower returns unknown
- exact-name lookup remains fast
- back-to-back reads do not reuse the prior result
- first field note completes in under two minutes
- export produces valid JSON
- three people outside the project complete the core flow without coaching

### Gate D: launch content

- official handles confirmed
- bio and link-in-bio ready
- first seven assets exported and reviewed
- Founder Episode 1 recorded or Meet WIZL fallback selected
- captions contain no sales, menu, price, medical, or visual-identification claim
- reply bank ready
- one metric sheet owner: Sergey

## Remaining human decisions

1. Founder Story approval

Do not edit public/HERO.MOV until Sergey sends exactly:

Yes, cut the Founder Story with this strategy.

2. Social links

Confirm final Instagram, TikTok, YouTube, and X handles before linking them in the app.

3. Payment

Choose no provider yet. First obtain written approval for the exact supporter model.

4. Thailand

Obtain qualified local legal guidance before filming or signing a cannabis-adjacent commercial partner.

## Forty-eight-hour release checklist

1. Finish code and document diff.
2. Run all local verification.
3. Build production bundle.
4. Commit in English and push main.
5. Wait for Vercel Ready state.
6. Run production smoke.
7. Test checkout 410 and paused Atlas.
8. Test one exact-name lookup and one unknown image.
9. Test save, Profile, and export.
10. Publish Meet WIZL if founder video is not yet approved.
11. Answer every qualified reply personally.
12. Record baseline metrics at 24 and 72 hours.

## First sprint after launch

Do not begin with merch inventory, native apps, or a map rebuild.

Run:

- fifteen interviews
- twenty label tests
- activation analysis
- seven-day return analysis
- comment mining
- one evidence-backed retention improvement

Candidate improvements, in order of likely value:

- producer and batch fields
- faster repeat-note flow
- shareable field-note card
- weekly recap
- opt-in sync
- tolerance and break notes

## Current blockers for scale

- no durable distributed limiter
- no real account sync
- no product-level source provenance
- no written payment-provider approval
- no Thai legal review for partner activity
- no validated retention cohort
- no confirmed unit economics

These do not block a small founder-led learning launch. They do block spending money to acquire users or accepting commercial partner payments.
