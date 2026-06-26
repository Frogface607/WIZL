# Recipe: Shop Visit Video Loop (atmospheric, 5-8s)

**Goal:** Short atmospheric loop showing Wizl entering / browsing a Bangkok cannabis shop. Used as: Reel intro, story background, B-roll for Сергея's GoPro footage.

**Variables:** `$Shop` (name, e.g. "Space Herbs"), `$Action` (e.g. "Wizl walking past glowing jars on wooden shelves"), `$World` (default: `apothecary` or `night-market`), `$Duration` (5 or 8 seconds)

**Output:** `content/posts/{Date}-shop-{shop-slug}/`
- `loop.mp4`
- `cover.png` (first frame extract for thumbnail)
- `caption.md`

---

## Step 1 — Generate start frame (model: `nano_banana_2`, aspect `9:16`)

```bash
higgsfield generate create nano_banana_2 \
  --prompt "$(cat nodes/character.txt) $Action $(cat nodes/worlds/$World.txt) Cinematic still frame, slight motion blur on the cat in his satchel, magical green dust drifting in the air. $(cat nodes/style.txt)" \
  --image public/mascot.png \
  --aspect_ratio 9:16 \
  --resolution 2k \
  --wait
```

**Save the result URL as `start.png`.**

## Step 2 — Animate via Seedance 2.0

```bash
higgsfield generate create seedance_2_0 \
  --prompt "Camera slowly dollies forward following Wizl as he $Action. Subtle parallax on the background shelves and lanterns. Magical green dust drifts gently. The cat in his satchel turns its head. Smoke wisps curl up. Loop-friendly motion, gentle, dreamy. Mystic Street Futurism aesthetic preserved." \
  --start-image start.png \
  --duration $Duration \
  --aspect_ratio 9:16 \
  --wait --wait-timeout 20m
```

## Step 3 — Extract cover

```bash
ffmpeg -i loop.mp4 -vframes 1 cover.png
```

---

## Cheap alternative (model: `kling3_0`)

When Seedance budget is tight, use Kling 3.0 instead — single-plane motion, no cuts. Same start-image, same prompt structure. Cheaper.

---

## Action library

| Action | Best World |
|---|---|
| Wizl walking past glowing jars on wooden shelves | apothecary |
| Wizl opening the magical book and reading by lamplight | study |
| Wizl examining a single bud held to the emerald crystal | apothecary or secret-garden |
| Wizl walking through a neon-lit Bangkok night market | night-market |
| Wizl sitting on a rooftop sipping tea, peace-sign flag waving | rooftop |
| Wizl entering through a glowing magical portal | portal-chamber |
| Wizl tending to tall cannabis plants in the garden | secret-garden |
| Wizl walking along a misty mountain road, airships above | travel-route |

---

## Caption template

```markdown
# Main caption (IG Reel)
Day [X] in Bangkok — visiting $Shop with Wizl 🌿

$ShopShortDescription

What's your favorite Bangkok shop? Drop a name in the comments — Wizl might visit.

wizl.space — every strain has a story.

# Hashtags
#bangkokweed #cannabisthailand #shopvisit #wizl #cannabis #buildinpublic
```
