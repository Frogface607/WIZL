# WIZL Launch Publishing Kit

Updated: 2026-06-27

Use this file when publishing the first organic WIZL posts. It assumes Founder Story is still waiting for video-cut approval, so Day 1 can start with the ready Meet WIZL carousel.

## Verified Asset Inventory

Run before publishing:

```bash
npm run verify:content-assets
```

Current verified assets:

| Asset | Files | Verified format |
|---|---|---|
| Meet WIZL carousel | `content/posts/2026-06-27-meet-wizl-carousel/slide-01.png` through `slide-06.png` | 6 PNG slides, 1080x1350 |
| Night Market reel | `content/posts/2026-06-26-adventure-01-the-lost-page-at-the-night-market/edit.mp4` + `cover.png` | 1080x1920, 12s |
| Product Hook reel | `content/posts/2026-06-27-product-hook-scan-label/edit.mp4` + `cover.png` | 1080x1920, 12s |
| THC education carousel | `content/posts/2026-06-27-thc-not-whole-story-carousel/slide-01.png` through `slide-06.png` | 6 PNG slides, 1080x1350 |
| Founder Q&A thread | `content/posts/2026-06-27-founder-qa-thread/caption.md` | Text thread + story prompts |
| Week 1 recap template | `content/posts/2026-06-27-week-1-recap-template/caption.md` | Text recap + story prompts |

## Profile Setup Before First Post

Use the same profile promise everywhere:

```text
WIZL
Scan it. Know it. Track it.
3,000+ strain notes, AI scan, and your own taste trail.
Free to use. Adults only where legal.
wizl.space
```

Pinned-post target after the first week:

1. Founder Story, once cut and approved.
2. Meet WIZL.
3. Product Hook.

Until Founder Story is cut, pin Meet WIZL first.

## Publishing Preflight

1. Run `npm run verify:content-assets`.
2. Run `npm run verify:launch-smoke`.
3. Open `https://wizl.space/en` and confirm the site loads.
4. Open `https://wizl.space/en/scan` and confirm the scan CTA is visible after the age gate.
5. Confirm every caption includes `wizl.space`.
6. Confirm every cannabis-facing post includes `Adults only where legal.` either in caption or profile bio.
7. After posting, paste URLs into `content/publish-queue.md`.

## Day 1 Fallback: Meet WIZL

Use if Founder Story is not cut yet.

Asset folder:

`content/posts/2026-06-27-meet-wizl-carousel/`

Instagram carousel:

```text
WIZL is not just a strain list.

It is a tiny field guide from a wizard who takes cannabis culture seriously, but never makes it boring.

Open The Book. Start with one scan.

wizl.space

Adults only where legal.

#wizl #cannabisculture #strainnotes #cannabiseducation #weedwisdom #indieapp
```

X post:

```text
Meet WIZL.

A weasel wizard.
An orange cat.
A living Book with 3,000+ strain notes.

Scan what you got.
Save what you learn.
Build your own taste trail.

Free to use: wizl.space

Adults only where legal.
```

Story stack:

1. Frame 1: "Meet WIZL."
2. Frame 2: "3,000+ strains in The Book."
3. Frame 3 poll: "What should WIZL find next? A strain / A shop"

Pin rule: pin this after posting if Founder Story is not ready.

## Day 2: Product Hook

Asset folder:

`content/posts/2026-06-27-product-hook-scan-label/`

Instagram Reel caption:

```text
When the label is confusing, ask the wizard.

WIZL gives an educational strain estimate, then helps you save the note in your own Book.

Try one scan: wizl.space

Adults only where legal.

#wizl #cannabisculture #strainfinder #weedwisdom #cannabiseducation #indieapp
```

TikTok caption:

```text
Not sure what you got?

Scan the label with WIZL.
Save it in The Book.
```

YouTube Shorts title:

```text
Scan a Label With WIZL
```

YouTube Shorts description:

```text
Scan what you got, learn the vibe, and save your notes in The Book.

wizl.space
```

X post:

```text
Not sure what the label is telling you?

WIZL can scan it, give an educational strain estimate, and save the note in your Book.

Try one scan: wizl.space

Adults only where legal.
```

Pin rule: pin this after Founder Story / Meet WIZL.

## Day 3: THC Is Not The Whole Story

Asset folder:

`content/posts/2026-06-27-thc-not-whole-story-carousel/`

Instagram carousel:

```text
High THC does not automatically mean better.

Aroma, terpenes, freshness, dose, and your own body all matter.

The Book is a guide. Your notes make it personal.

Save this before your next shop visit.

wizl.space

Adults only where legal.

#wizl #cannabiseducation #terpenes #strainnotes #weedwisdom #cannabisculture
```

X post:

```text
THC is only one clue.

Aroma, freshness, dose, terpenes, and your own notes matter too.

The Book is a guide. Your taste trail makes it personal.

wizl.space

Adults only where legal.
```

Story stack:

1. Frame 1: "THC is only one clue."
2. Frame 2 quiz: "What do you check first? THC / aroma / genetics / price"
3. Frame 3: "Scan it. Smell it. Take notes."

## Day 4: Night Market Reel

Asset folder:

`content/posts/2026-06-26-adventure-01-the-lost-page-at-the-night-market/`

Instagram Reel caption:

```text
The first missing page was hiding in the night market.

It smelled like citrus, rain, and trouble.

Every strain has a story.
Every story leaves a trace.

Where should WIZL go next?

wizl.space

Adults only where legal.

#wizl #cannabisculture #strainnotes #cannabiseducation #weedwisdom #nightmarket #aiart #indieapp
```

TikTok caption:

```text
WIZL found the first lost page at the night market.

Where should the wizard travel next?
```

X post:

```text
The first missing page appeared at the night market.

Citrus. Rain. Trouble.

WIZL opened The Book and followed the trace.

Every strain has a story.

wizl.space

Adults only where legal.
```

Story stack:

1. Frame 1: "The first page is missing."
2. Frame 2: "WIZL found a trace at the night market."
3. Frame 3 poll: "Where next? Bangkok rooftops / Secret garden"

## Day 6: Founder Q&A Thread

Asset folder:

`content/posts/2026-06-27-founder-qa-thread/`

Use after at least one post has comments, or whenever a real question appears.

Open `caption.md` for:

- X thread.
- Instagram story prompts.
- Follow-up reply.

## Day 7: Week 1 Recap Template

Asset folder:

`content/posts/2026-06-27-week-1-recap-template/`

Before posting, replace one placeholder with a real comment, question, or metric from week 1.

Open `caption.md` for:

- Instagram Feed/Reel text.
- X recap post.
- Story prompts.

## Founder Story Series

Do not cut `public/HERO.MOV` until Sergey confirms:

```text
Yes, cut the Founder Story with this strategy.
```

When approved, split the founder story into three reusable reels instead of forcing every detail into one post:

| Episode | Working title | Core point | CTA |
|---|---|---|---|
| 1 | Why I Built WIZL | Bangkok, Thailand, the adventure, and the honest founder intro | Follow WIZL |
| 2 | Meet The World | WIZL, the cat, The Book, and 3,000+ strains | Open The Book |
| 3 | Scan It, Know It, Track It | Scan, save, check in, and free-to-use promise | Try one scan |

Episode 1 voiceover:

```text
Hello world. My name is Sergey.
My English is not perfect, but this story is real.

I came to Bangkok this April and fell in love with Thailand:
kind people, open minds, and a cannabis culture that felt alive.

I started walking into shops, showing people what I was building,
and WIZL became more than an app.

It became an adventure.
```

Episode 2 voiceover:

```text
WIZL is not a boring encyclopedia.
It is a whole little world.

A weasel wizard travels with his orange cat,
finds strains, and writes them into The Book.

Now The Book has more than 3,000 strain notes.
And it is still growing.
```

Episode 3 voiceover:

```text
You can scan what you got,
learn the vibe,
save your favorites,
and check in where you found them.

WIZL is free to use.

If you want to support the road,
join the Club for $4.20 a year.

Follow WIZL.
The adventure starts now.
One love.
```

## Week 1 Metrics Table

Copy this table into a sheet or keep it updated here.

| Date | Platform | Asset | Hook | Views / reach | Saves | Shares | Comments | Profile visits | Link clicks | WIZL event notes |
|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
|  | Instagram | Meet WIZL | Meet WIZL |  |  |  |  |  |  |  |
|  | X | Meet WIZL | Weasel wizard + Book |  |  |  |  |  |  |  |
|  | TikTok | Product Hook | Not sure what you got? |  |  |  |  |  |  |  |
|  | Instagram | Product Hook | When the label is confusing |  |  |  |  |  |  |  |
|  | Instagram | THC education | THC is only one clue |  |  |  |  |  |  |  |
|  | Instagram | Night Market | The first missing page |  |  |  |  |  |  |  |

## Comment Capture

Turn comments into next posts:

| Comment / question | Source post | Reply now? | Follow-up content idea |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Reply bank: `content/launch-reply-bank.md`.
