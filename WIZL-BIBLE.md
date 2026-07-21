# WIZL Project Bible

Last updated: July 21, 2026

## The one-sentence product

WIZL is a kind cannabis field guide that helps adults read package clues, explore strain references, and remember their own experience in a private journal.

## The emotional product

A tiny weasel wizard lives in your pocket, walks beside you, and keeps the Book with love.

WIZL should feel like a companion, not a database wearing a costume. The useful tool earns repeat use. The world, cat, Book, artifacts, and adventures create memory, affection, and future brand value.

Brand formula:

WIZL = Weasel + Wizard + Weed Wisdom + With Love

Slogan:

Scan it. Know it. Track it.

Current product promise:

Read the label. Remember the experience.

## Founder truth

Sergey built a music bar for ten years and eventually closed that chapter. During a spring in Bangkok, he fell in love with the city’s warmth, openness, and cannabis culture. He built the first WIZL version, walked around showing it to people, then returned home without giving it a proper launch.

The launch story is not “overnight AI startup.” It is unfinished work returning to life.

Public founder opening:

Hello world. I’m Sergey. My English isn’t perfect, but this story is real.

Do not open with a defensive explanation about nationality or politics. Context can be answered later if genuinely relevant.

## Character and world

WIZL is an anthropomorphic weasel in a patched purple cloak and wizard hat, with an emerald staff and a leather satchel. He travels with an orange cat and records discoveries in the magic Book.

World tone:

- kind, curious, playful, slightly mystical
- warm street-level texture rather than luxury stoner stereotypes
- conscious adult use without shame or glorification
- funny enough to share, useful enough to save
- no red eyes, smoke-cloud clichés, fake intoxication, or reckless consumption

Primary visual sources remain in public as high-resolution originals for content production. The web app uses small WebP derivatives.

## Audience

Initial beachhead:

Adults in legal markets who try different labeled cannabis products or strains and want to remember what actually worked for them.

Important traits:

- privacy-sensitive
- curious about labels, chemistry, aroma, and personal response
- tired of generic ratings and inconsistent strain names
- willing to log one useful note if the flow is fast
- interested in moderation, tolerance, breaks, and responsible use

WIZL is not initially for:

- people trying to buy cannabis
- shop-menu discovery
- growers seeking a cultivation operating system
- medical diagnosis or treatment
- children or people below legal age
- mass-market paid acquisition

## Core job and loop

Job:

Help me make sense of the label and remember my own experience next time.

Core loop:

1. Search an exact name or read a clear label.
2. Compare cautious reference information.
3. Save a field note with rating, mood, and observation.
4. See the taste trail in Profile.
5. Return when the next labeled product appears.
6. Share a tasteful field-note card or WIZL lesson.

Activation:

First saved field note.

North-star metric:

Weekly users who save at least one field note.

Supporting metrics:

- visit to first field note
- label read to saved note
- seven-day return after first note
- notes per activated user
- export rate
- share rate
- AI cost per activated user
- qualified email replies expressing Club interest

## Product truth

The Book:

More than 3,000 reference entries. Names, reported effects, flavors, and potency ranges are references, not product-specific lab data.

Label reader:

OpenAI-assisted. Best with clear printed text or an exact name. It must return Unidentified flower when a naked flower image lacks identifying evidence.

Field notes:

Stored in browser local storage on the current device. No account or cross-device sync. Export is available in Profile.

Ask WIZL:

Educational assistant through OpenRouter. It must not provide sellers, purchase links, prices, delivery, or medical diagnosis.

Atlas:

Public venue listings are paused while provenance, freshness, legal status, and ownership are re-verified.

WIZL Club:

No checkout and no paid access are active. The current page is an interest path only.

## Routes

- / — product promise, scan entry, Book, journal, Ask WIZL
- /strains — The Book
- /strains/[id] — reference page and field-note entry
- /scan — exact-name search and cautious label reader
- /checkin — field-note creation
- /profile — local journal, taste trail, achievements, export
- /about — Sergey and WIZL origin story
- /pro — Club concept and interest email
- /map — paused Atlas notice
- /shop — licensed partner pilot information
- /privacy, /terms, /refund — current legal truth
- /api/scan — OpenAI-first label read with OpenRouter fallback and best-effort server rate limit
- /api/chat — OpenRouter educational chat with best-effort server rate limit
- /api/checkout — intentionally returns 410 while payments are paused

## Data and infrastructure

Stack:

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- next-intl with English and Thai routes
- Supabase strain catalog
- Vercel hosting and aggregate analytics
- OpenAI Responses API for primary label reads
- OpenRouter for fallback label reads and Ask WIZL

Local user data key:

wizl-user-data

The isPro field remains only as a legacy migration field. It must not grant active paid access or unlimited scans.

Server rate limiting is in-memory and best-effort. It helps against casual abuse but is not a distributed production quota. Before meaningful scale, add a durable limiter or Vercel firewall rule and a cost alert.

## Business model

Launch now:

Free product, no payment.

Next:

- compliance-approved supporter membership for the WIZL media world
- low-risk collectibles such as stickers, prints, apparel, and digital artifacts
- native premium only after real sync, deeper personal insights, and a defensible paid feature set
- licensed educational, quality, lab, or IP collaborations after legal review
- grinders and other paraphernalia only after processor, advertising, age-gating, shipping, and local-law review

Do not build revenue around cannabis sales, delivery, menus, paid listings, or affiliate purchase links.

The symbolic $4.20 yearly supporter idea is emotionally strong but cannot finance heavy AI usage. Treat it as a founding signal, not SaaS unit economics.

## Marketing system

Content mix:

- 35 percent useful education and harm reduction
- 30 percent WIZL adventures and lore
- 20 percent founder journey
- 15 percent product rituals and user field notes

Primary channels:

- Instagram for the visual canon and carousels
- YouTube Shorts and long-form founder chapters
- X for building in public and product learning
- Reddit for honest research and selected founder posts
- TikTok as an experimental organic channel, accepting age restriction or limited distribution

No paid cannabis ads at launch.

Every post has one job:

- follow WIZL
- try the free Book or label reader
- save a first field note
- answer one research question

## Bangkok rule

Thailand moved to stricter medical-only controls in June 2025. Public cannabis advertising and online sales are prohibited. The Bangkok return is a founder-story and research chapter, not a dispensary-promotion tour.

Allowed only after verification:

- interviews about education, lab quality, cultivation standards, traceability, design, culture, or compliance
- collaboration with a currently licensed organization
- no prices, menus, purchase links, addresses as calls to action, rankings, or “best shop” content
- written consent for filming and brand use
- local legal review before commercial partnership

## Berner and Cookies

The collaboration dream is a long-term quest, not launch positioning.

Do:

- build real audience and retention
- publish original WIZL IP
- make a respectful founder post about the dream after proof exists
- approach with specific data and an original collaboration concept

Do not:

- create unauthorized Cookies pages, sticker packs, logos, or endorsement claims
- spam tags
- imply a partnership
- rely on celebrity attention as a success metric

## Non-negotiables

- No fake reviews, users, check-ins, Club members, partner claims, or map listings.
- No exact strain or potency claim from flower appearance.
- No active checkout before written provider approval.
- No cannabis purchase facilitation.
- No “safe” medical promise.
- No Russian locale or Russian-targeted cannabis marketing.
- No founder video edit from HERO.MOV until Sergey gives the exact approval phrase recorded in the launch docs.
- Keep originals for the content factory; serve optimized derivatives in the app.
- Character consistency matters, but truth matters more.

## Key documents

- docs/gtm-launch-strategy.md
- docs/launch-readiness.md
- docs/wizl-brand-kit.md
- content/content-plan.md
- content/launch-publishing-kit.md
- .agents/product-marketing.md

## Contact

- Site: https://wizl.space
- Email: wizl.space.app@gmail.com
- Repository: https://github.com/Frogface607/WIZL
