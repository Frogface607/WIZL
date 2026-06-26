# Recipe: Story Background (9:16 vertical)

**Goal:** Atmospheric backdrop for IG/TikTok stories. Wizl present but compositionally subordinate — top 60% of frame is "negative space" for text overlays, bottom 40% has the character.

**Variables:** `$World`, `$Mood` (calm | mystical | playful | reflective), `$TimeOfDay` (golden hour | twilight | night | dawn)

**Output:** `content/factory/stories-pack/{World}-{Mood}.png`

(These are reusable — pack of ~24 backgrounds covers most weeks.)

---

## Background (model: `nano_banana_2`, aspect `9:16`)

**Prompt template:**
```
[CHARACTER] WIZL is in [WORLD] at $TimeOfDay, posed at the bottom 30% of the frame so the top 60% remains atmospheric and clean for text overlay. Composition leaves room overhead — sky, ceiling, smoke wisps, distant skyline. Mood: $Mood. Looking thoughtful, never blocking the upper space.

[STYLE]

Specifically: vertical 9:16 composition. Wizl bottom-center, small in frame. Bokeh smoke, drifting fireflies, soft glow at edges. Top portion deliberately quiet and uncluttered.
```

**Command:**
```bash
higgsfield generate create nano_banana_2 \
  --prompt "[filled template]" \
  --image public/mascot.png \
  --aspect_ratio 9:16 \
  --resolution 2k \
  --wait
```

---

## Pack list — Generate once, reuse forever

| World | Mood | Time | Use case |
|---|---|---|---|
| rooftop | reflective | golden hour | wisdom quotes, talking-to-audience |
| apothecary | mystical | twilight | strain announcements |
| night-market | playful | night | shop visits, community |
| study | calm | candle-lit | "did you know" facts |
| secret-garden | mystical | dawn | new strain reveals |
| portal-chamber | mystical | starlight | special / launch announcements |
| hideaway | calm | warm lamp | personal / story content |
| travel-route | reflective | dusk | city tour announcements |

8 worlds × 3 mood variations = 24 reusable backgrounds.

---

## Sticker-pack version

For each background, also render a `-sticker.png` variant where Wizl is replaced by a strain-monster (see `sticker-monster.md`). Use for stories announcing new sticker drops.
