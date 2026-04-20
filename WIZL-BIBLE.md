# WIZL — Project Bible

> **Last updated:** 2026-04-20
>
> Everything you need to continue building WIZL. Shift happens fast — update this whenever the vision moves.

---

## 🔍 What is WIZL?

**WIZL** ([wizl.space](https://wizl.space)) — a cannabis strain explorer with 3,000+ strains, AI-powered budtender chat, check-ins, favorites, wishlist, shop map. Free forever. Club for $4.20/year (pay what you want, first 420 explorers free).

**Tagline:** `with love`
**Slogan:** `Scan it. Know it. Track it.`
**Positioning:** Education & discovery tool for the cannabis-curious. Not a marketplace. Not a dealer app.

**Brand formula:** `WIZL = Weasel + Wizard + Weed Wisdom + With Love`

---

## 👤 Who is building this

Sergey (Frogface607) — former owner of a 10-year music bar in Siberia (Edison Bar, closing May 2026). Currently in Bangkok (Vit38 Rent — cannabis-friendly hotel). Building WIZL on the streets — GoPro, Volta mic, peace-sign pendant, no team, no VC.

**Superpower:** he IS the distribution. Walks into real Bangkok shops, tests live with owners, films it, posts it.

**Tone:** honest, warm, slightly mystical, never corporate. Russian accent intact as a feature not a bug.

---

## 🧙‍♂️ The Character — WIZL The Wizard

An anthropomorphic weasel in a purple patched cloak, wizard hat with cannabis leaf pin, gnarled staff topped with a glowing emerald crystal. Leather satchel with potion vials and a sleeping orange cat. Travels the world, meets curious creatures, finds rare strains, records them in his magical book.

**Assets:**
- `public/mascot.png` — head close-up, transparent
- `public/logo-mark-transparent.png` — mascot with neon-green glow
- `public/hero-wizl.png` — full hero (2048×2048, mascot + wordmark + tagline on navy)
- `public/wizl-book.png` — wizard with magical book

**Style universe:** *Mystic Street Futurism* — Miyazaki warmth × Moomin linework × Adventure Time playfulness × street-culture neon. See `design/system.md` for full brand system.

---

## 💰 Business Model

### Revenue
- **WIZL Club** — $4.20/year, pay-what-you-want (min $4.20, suggested $20)
- **Processor:** Gumroad ([wizlspace.gumroad.com/l/wizlpro](https://wizlspace.gumroad.com/l/wizlpro))
- **First 420 explorers:** free Club forever (founder offer, honour system via `isPro` local flag)
- **Future:** sponsored shop placements on map, merch, Pinterest/Reddit affiliate, creator collabs

### Cost structure (low)
- Supabase — free tier
- Vercel — free tier (hobby)
- OpenRouter (Perplexity Sonar for AI chat) — ~$1/1000 requests
- Anthropic (Claude Sonnet 4.5 for scan) + web search — ~$0.03/scan
- ElevenLabs (Wizl voice) — $22/mo
- HeyGen (character avatar video) — $24/mo when subscribed
- Freepik Premium Plus — already owned, 84K credits

Break-even at 10 paying members.

---

## 🏗️ Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **Supabase** (Postgres + Auth + Storage) — project `qbhyrhvpmavsrpasxnoz`
- **Vercel** — prod deploy, auto on push to main
- **next-intl** — EN / RU / TH
- **PWA** — manifest + icons + installable
- **Auth** — anonymous sessions + magic-link email upgrade (via Supabase Auth)
- **AI chat** — OpenRouter → Perplexity Sonar (web-grounded)
- **AI scan** — Anthropic Claude Sonnet 4.5 + `web_search_20250305` tool
- **Content gen** — Freepik (Nano Banana Pro, Flux Kontext Max, Kling 2.5, Seedance 2.0), ElevenLabs (voice), HeyGen (character video)

---

## 🗺️ App Map

| Route | What |
|---|---|
| `/` | Hero (mascot + WIZL + tagline) + scan CTA + inline AI chat |
| `/strains` | **The Book** — 3,000+ strains, filters (type), sort (THC / name), search |
| `/strains/[id]` | Strain detail — hero, terpenes, effects, flavors, check-in CTA, empty-state reviews |
| `/checkin` | 3-step flow (select → rate → done). Accepts `?strain=ID`, `?shop=ID`, `?scan=1` (from scan page) |
| `/scan` | AI scanner — photo or description → strain identification via Claude + web_search |
| `/map` | Leaflet shop map with region filter, 1594 shops, check-in per shop |
| `/profile` | Stats, checkins, achievements, taste profile. Shows AuthPrompt if anonymous |
| `/pro` | WIZL Club — founders banner (first 420 free), Gumroad fallback, features comparison |
| `/about` | Serge's story — fully i18n (EN/RU/TH) |
| `/shop` | For shop owners — how to join the map |
| `/shop/dashboard` | Shop owner dashboard (placeholder) |
| `/privacy`, `/terms`, `/refund` | Legal |
| `/auth/callback` | Supabase magic-link exchange |

---

## 🗄️ Database (Supabase)

**Key tables:**
- `strains` — 3,123 rows. `id`, `name`, `type`, `thc_min/max`, `cbd_min/max`, `description`, `effects[]`, `flavors[]`, `terpenes` (JSONB), `genetics`, `difficulty`, `rating` (0 now — real ratings later), `rating_count`, `fts` (search index)
- `checkins` — user checkins, `user_id`, `strain_id`, `rating`, `mood`, `review`, `shop_id`

**Client-side:**
- `localStorage` key `wizl-user-data` — anonymous cache of checkins, favorites, wishlist, isPro flag
- Eventually migrates to Supabase when user does magic-link upgrade

**Ratings policy (critical):**
- `mapSupabaseToStrain` in `src/lib/strains-db.ts` forces `rating: 0, reviewCount: 0` regardless of seeded DB values
- UI shows "New on WIZL / Be the first to check in" until real community data exists
- Sort-by-rating / sort-by-reviews options hidden in catalog
- When check-ins accumulate — aggregate job will compute real values

---

## 🔑 API Routes

| Route | Purpose |
|---|---|
| `POST /api/chat` | AI chat via OpenRouter + Perplexity Sonar |
| `POST /api/scan` | AI scan via Anthropic + web_search_20250305 |
| `POST /api/checkout` | Gumroad redirect (returns the product URL) |
| `GET /auth/callback` | Supabase magic-link handler |

---

## 🌍 i18n

- `messages/en.json` — English (primary)
- `messages/ru.json` — Russian (личное, для понимания)
- `messages/th.json` — Thai (local market)

Locale in URL: `/en/...`, `/ru/...`, `/th/...`

**Rule:** all user-facing strings via `useTranslations("namespace")`. No hardcoded English.

---

## ♻️ Env Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://qbhyrhvpmavsrpasxnoz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<in .env.local>
OPENROUTER_API_KEY=<in .env.local>
ANTHROPIC_API_KEY=<in Vercel>
MUAPI_API_KEY=<optional, for image gen via MuAPI>
NEXT_PUBLIC_APP_URL=https://wizl.space
```

Gumroad is configured by redirect URL on their side: `https://wizl.space/en/pro?success=true`.

---

## 📱 Social

- **Instagram:** [@wizl.space](https://instagram.com/wizl.space) — primary, carousel+reels
- **TikTok:** [@wizl.space](https://tiktok.com/@wizl.space) — virality engine
- **YouTube:** `@wizl.space` — long-form shop visits, Puff & Walk
- **Twitter/X:** `@wizlspace` — builder-in-public, celebrity tags via Wizl

**Audience rule:** EN/TH only. No Russian cannabis content. Russia = legal risk.

Launch playbook: `D:\PROJECTS\knowledge\wizl-launch\` (Obsidian-ready, 9 files).

---

## 🎯 Current Focus (Apr 20)

1. ✅ Socials set up (IG / TikTok / YouTube / Twitter)
2. ✅ Mascot + voice + hero + palette
3. ✅ 3,000+ strains, zero fake ratings
4. ✅ First 420 founders offer
5. 🎬 **Tomorrow:** shoot intro video (Script 1 in playbook) + first shop visit
6. 🎬 **Tomorrow:** create 5 Freepik backgrounds for HeyGen Wizl videos
7. 📖 Grow strain DB toward 5,000+ via background agents

---

## 🛑 What NOT to do

- Don't auto-generate fake check-in data — integrity > engagement theater
- Don't post cannabis content on Serge's personal (Russian) accounts
- Don't use perfectly-American voice-cloning for Serge — accent is feature
- Don't add "Sign up to see results" dark patterns
- Don't overdesign — `done > perfect`, especially during launch week
- Don't break the mascot style — every Wizl image passes through brand style node
- Don't replace Serge in video with AI avatar. HeyGen is for **Wizl** the character, not the human

---

## 🧭 Key Files to Know

- `design/system.md` — full brand bible (palette, typography, character, world, motion)
- `content/content-plan.md` — 14-post content pipeline
- `D:\PROJECTS\knowledge\wizl-launch\` — 9-file launch playbook (IG, TikTok, YT, Twitter, Reddit, Freepik prompts, video scripts, 7-day queue, ElevenLabs voice)
- `src/lib/strains-db.ts` — Supabase data layer (rating forced to 0)
- `src/lib/auth.tsx` — Supabase anonymous + magic-link auth
- `src/app/api/chat/route.ts` — AI chat system prompt (Wizl persona, cannabis-only)
- `src/app/api/scan/route.ts` — Claude Sonnet 4.5 + web_search scanner

---

## 📞 Contact / Links

- Domain: [wizl.space](https://wizl.space)
- Gumroad: [wizlspace.gumroad.com/l/wizlpro](https://wizlspace.gumroad.com/l/wizlpro)
- Git: [github.com/Frogface607/WIZL](https://github.com/Frogface607/WIZL)
- Email: `hello@wizl.space`

---

## 🌿 Closing note

> WIZL is Serge's dream project — all the things he loves (walking, cannabis, building, stories, Bangkok) collapsed into one point. Treat every decision through that lens. If it doesn't fit the spirit — don't ship.
>
> *With love.*
