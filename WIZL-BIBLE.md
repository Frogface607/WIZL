# WIZL — Project Bible
## Everything you need to know to continue building

---

## 🔍 What is WIZL?

**WIZL** (wizl.space) — AI-powered cannabis strain scanner, check-in platform & community.
Think **Untappd + Shazam + ChatGPT** for cannabis. With love.

**Tagline:** "with love"
**Slogan:** "Scan it. Know it. Track it."
**Positioning:** Cannabis education & discovery tool (NOT a marketplace, NOT selling anything)

---

## 👤 Who is building this?

Sergey (Frogface607) — a businessman from Russia, currently in Bangkok for a month.
He loves walking, exploring, and building products. This is his "evening project" —
morning is for other work (Edison, MyReply), evenings are for WIZL.

**His vibe:** honest, friendly, peaceful, creative. Like the Thais he admires.
**His superpower:** he IS the marketing channel — walking through Bangkok with GoPro and stickers.

---

## 💰 Business Model

### Revenue Streams:
1. **PRO Subscription — $4.20/mo** (the meme price, on purpose)
   - For users: unlimited scans, full history, AI insights, exclusive badges
   - For shop owners: add your shop to the map, manage menu — same $4.20
   - 7-day free trial
   - Free tier: 5 scans/day, basic check-ins

2. **Future (not now):**
   - Premium/featured placement for shops
   - Merch (stickers, characters, collectibles)
   - Donations ("Send me to the next city")

### Payments: LemonSqueezy
- No company needed to start
- Payouts to Wise/Payoneer
- Later: open company in Thailand/Georgia/Armenia → switch to Stripe
- There's a contact in Bangkok (bar regular, 25 years with work permit) who may help with Thai company/work permit

---

## 🎯 Growth Strategy

### The Walking Marketing Machine:
1. **Sticker packs** — daily unique monster characters (dessert/berry themed, NO actual cannabis imagery)
   - Numbered (#001, #002...), with rarity system (Common/Uncommon/Rare/Epic/Legendary)
   - QR code linking to wizl.space
   - Texts like "What are you smoking? Scan & find out" or "Bro... this ain't 20%"
   - Distributed to coffee shops in person

2. **GoPro content** — daily timelapse walks through Bangkok
   - POV from chest mount, one continuous shot
   - Slows down at shops, speeds up while walking
   - Minimal talking needed — music + timelapse is the main format
   - Selfie in each shop from iPhone

3. **Social media** — all global, English-first:
   - TikTok (main channel, short videos)
   - Instagram (reels + stories + shop photos)
   - YouTube (shorts + later long vlogs)
   - Username: @wizlspace or similar
   - Unified posting via Buffer/Later

4. **Building in public** — the story IS the product
   - "Day 1 building WIZL in Bangkok"
   - "I gave stickers to 10 shops today"
   - "Can AI identify what I'm smoking?"

5. **Shop onboarding:**
   - Walk in, friendly intro: "Hey, I'm Sergey, building a fun app for tourists, can I leave stickers?"
   - Show them the app scanning their products
   - Offer to add their shop to the map ($4.20/mo or free during launch)

### Realistic targets:
- 10-20 shops per walk (not 100, sustainable pace)
- 50-100 shops in a month = solid base
- Content may go viral at any point (one TikTok can change everything)
- First $100-500/mo in 1-2 months is realistic

---

## 🎨 Brand & Design

### Colors (current in app):
- Background: #08080a (deep dark)
- Accent Green: #34d399 (main CTA, positive)
- Accent Purple: #a78bfa (secondary, indica type)
- Accent Orange: #fb923c (sativa type)
- Accent Love: #f472b6 (pink, "with love" gradient)
- Text: #f4f4f5 / #a1a1aa / #71717a

### Potential addition (from Bangkok inspiration):
- Cherry Blossom: #F9A8BB — great for stickers, merch, warm accents
- Cream: #FAFFC7 — for special/rare elements

### Visual style:
- Dark theme, glass morphism, glow effects
- Mobile-first always
- Dessert/candy/berry aesthetic for characters (NOT cannabis leaves/buds)
- Clean, friendly, not "druggy"

### Monster Characters (sticker concept):
- Each cannabis strain = a unique monster character
- Named after the strain but visually dessert/fruit/candy themed
- Examples: "Blueberry Frost Monster", "Cherry Devil", "Gelato Beast", "Oreo Zushi Creature"
- Generated via AI art in consistent style
- Prompt formula: `[strain] + monster + dessert style + cute but trippy + sticker illustration + vibrant colors`
- Collectible, numbered, with rarity tiers

---

## 🏗️ Tech Stack & Architecture

### Stack:
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (EN/TH/RU)
- **Maps:** Leaflet with dark CartoDB tiles
- **AI:** Anthropic Claude API (Vision for scanning)
- **Payments:** LemonSqueezy
- **Storage:** localStorage (MVP), Supabase later
- **Deployment:** Vercel (wizl.space)

### Current pages (13):
| Route | Description |
|-------|-------------|
| `/` | Home — hero, trending strains, recent check-ins, PRO CTA |
| `/scan` | AI Scanner — photo upload + text description → strain card |
| `/strains` | Catalog — filters, search, sorting, 12 strains |
| `/strains/[id]` | Strain detail — effects, flavors, reviews, "available at" shops |
| `/checkin` | Manual check-in — pick strain, rate, mood, review → saves to localStorage |
| `/map` | Leaflet map — 10 Bangkok shops, search, directions |
| `/profile` | User profile — stats, 18 achievements, top strains, history |
| `/pro` | PRO paywall — $4.20, features comparison, LemonSqueezy checkout |
| `/about` | Story page — personal story, mission, journey, values |
| `/shop` | Shop registration — benefits, pricing, district picker |
| `/shop/dashboard` | Shop owner panel — profile edit, menu CRUD, stock toggle |

### APIs:
| Route | Description |
|-------|-------------|
| `/api/scan` | POST — image (base64) or text → Claude Vision → strain JSON |
| `/api/checkout` | POST — creates LemonSqueezy checkout session |
| `/api/webhooks/lemonsqueezy` | POST — subscription lifecycle events |

### Key libraries (lib/):
- `store.ts` — user data: check-ins, favorites, scans, achievements (localStorage)
- `shop-store.ts` — shop profile & menu CRUD (localStorage)
- `lemonsqueezy.ts` — checkout creation, webhook verification

### Achievements system (18 badges):
- Checkins: First Scan, Five Alive, Double Digits, Quarter Century, Centurion
- Strains: Strain Hunter (5), Connoisseur (15), Encyclopedia (30)
- Types: Sativa Lover, Indica Lover, Hybrid Master
- Special: Night Owl, Early Bird, Perfect Score, Tough Critic
- Social: Top Reviewer, Collector, Scanner Pro

---

## 📋 What's done vs what's next

### ✅ DONE:
- Full Next.js app with all 13 pages
- i18n (EN/TH/RU) with language switcher
- AI scan API (Claude Vision) with demo mode
- LemonSqueezy payment integration
- Scan limits (5/day free, unlimited PRO)
- Check-in system with localStorage persistence
- 18 achievements with real-time unlock
- Leaflet map with 10 Bangkok shops
- Shop owner registration & dashboard
- Strain ↔ shop linking ("Available at")
- About/Story page
- Age gate (20+)
- Dark theme with glass morphism

### 🔜 NEXT (priority order):
1. **Deploy to Vercel** — connect repo, add env vars, point wizl.space
2. **Create social media accounts** — @wizlspace on TikTok, Instagram, YouTube
3. **Generate first sticker pack** — 10 monsters in consistent style
4. **Logo/visual identity** — simple, clean, works on dark and light
5. **Supabase** — real database for users, check-ins, shops (replace localStorage)
6. **Auth** — email/social login
7. **Real shop data** — start adding actual Bangkok shops from walks
8. **PWA** — installable on mobile
9. **First walk** — GoPro, stickers, go!

---

## 🗂️ Repository Info

### Old repo: `frogface607/task-management-bot`
- Branch: `claude/cleanup-repo-P2fQi` has all the code
- Has messy history from old bot project

### New repo: `frogface607/WIZL`
- Created fresh, empty
- Needs code pushed from the old repo (clean first commit)
- The old session couldn't push due to access restrictions
- **FIRST TASK in new session: push all code to WIZL repo**

### How to get the code:
All source files are in the old repo branch. In the new session with WIZL access:
1. Either re-create from the old repo
2. Or rebuild (all files are documented above, and the old repo has everything)

### Env vars needed for Vercel:
```
ANTHROPIC_API_KEY=sk-ant-...
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_PRODUCT_ID=
LEMONSQUEEZY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://wizl.space
```

---

## 🧠 Key Decisions Made

1. **Name:** WIZL (What's In ZipLock → simplified to just WIZL)
2. **Domain:** wizl.space (purchased)
3. **Price:** $4.20/mo (meme, on purpose, for both users and shops)
4. **Payments:** LemonSqueezy (no company needed, works for Russian residents)
5. **Target audience:** Tourists in Thailand first, then global
6. **Language:** English-first, Thai for local shops, Russian because founder
7. **No cannabis imagery:** Characters are desserts/fruits/monsters, not leaves/buds
8. **Legal positioning:** Education & discovery tool, never selling/distributing
9. **Content strategy:** GoPro timelapse walks, minimal talking, daily posting
10. **Sticker marketing:** Physical stickers in shops = offline viral loop

---

## 💬 The Vibe (important!)

This project is NOT:
- A "startup that needs to scale to 10M users"
- A grind
- Stressful

This project IS:
- A fun adventure
- Walking and exploring
- Building in public
- Making friends
- Maybe making money
- Definitely making memories

**The motto:** "Доброе крутое приключение" (A kind, cool adventure)

---

*Last updated: 2026-04-06*
*From the original build session with Claude*
