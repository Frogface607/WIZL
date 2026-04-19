# Content Posts — Queue

Each post = one folder with:
- `image.png` (or `reel.mp4`)
- `caption.md` — caption + hashtags
- `meta.yaml` — platforms, status, scheduled date

**Workflow:**
1. Claude Code / you prepare a post folder
2. Review
3. Post manually on each platform (copy caption, upload image)
4. Move folder to `posts/_published/{YYYY-MM-DD}/`

---

## Template — copy `_template/` to new folder

### meta.yaml
```yaml
title: "Meet WIZL"
status: draft        # draft | ready | scheduled | published
platforms:
  - instagram        # grid post
  - tiktok           # reel
  - twitter
  - reddit           # r/trees, r/cannabis
scheduled: 2026-04-20T19:00:00+07:00
tags:
  - intro
  - launch
notes: |
  First post. Pin on all platforms.
```

### caption.md
```markdown
# Main caption (IG/FB/TikTok)

Meet WIZL 🧙‍♂️

A friendly weasel wizard who travels the world, discovers the best cannabis strains, and writes them in his magical book.

3,000+ strains. AI-powered. Free forever.

Built by one dude walking the streets of Bangkok with a GoPro and a dream.

Welcome to Space.

→ wizl.space

---

# Twitter version (280 chars)

Meet WIZL — a weasel wizard who writes strains in his magic book 🧙‍♂️

3000+ strains, AI chat, free. Built on the streets of Bangkok.

wizl.space

---

# Hashtags (IG/TikTok)

#wizl #cannabis #cannabiscommunity #bangkok #cannabisthailand #cannabisapp #indiemaker #buildinpublic #strainhunter #420community #weedwisdom #mysticstreet
```

---

## Published archive

Move to `_published/YYYY-MM-DD/` after posting. Keeps history + stats for later analysis.
