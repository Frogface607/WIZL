# Recipe: Wizl Wisdom Card (square quote)

**Variables:** `$Quote`, `$World` (rooftop | study | hideaway), `$Action` (default: "sitting cross-legged with the open book", "looking out over the city", "examining a small bud")

**Output:** `content/posts/{Date}-wisdom-{slug}/`
- `card.png` — 1080×1080 square
- `card-vertical.png` — 1080×1920 stories version
- `caption.md`

---

## Card (model: `gpt_image_2`, aspect `1:1`)

> **Pipeline 12 мая 2026, фаза 3:** GPT Image 2 + `--image content/factory/refs/wizl-clean.png` (clean cartoon ref, no cannabis triggers) + GLOSSARY-applied scene description + free vocabulary in overlay-text. Best-in-class typography + canonical cartoon Wizl + no NSFW rejects. Seedream V4.5 ушёл в backup для B2B.

**Prompt template:**
```
Square editorial poster. Deep navy #0B1218 background with smoky haze drifting across the top and bottom. WIZL mascot on the left third — kind anthropomorphic otter-weasel in oversized purple cloak with moon and star patches, weathered wizard hat with cannabis leaf pin, gnarled wooden staff with glowing emerald crystal, leather satchel with sleeping orange cat. He is $Action in the [WORLD] setting. Right two-thirds reserved for the quote:

"$Quote"

— WIZL

Quote in Montserrat Black 56px, cream #F2E8D4 color, generous line height, hand-set with italic emphasis on the most important word. "— WIZL" attribution in 18px Montserrat Light, neon green #99F788, letter-spacing 0.3em. Bottom-right: "wizl.space" in 12px Montserrat Regular, muted grey #7F8A96, letter-spacing 0.1em. Soft drifting cannabis-leaf doodles and faint firefly particles around the quote. Subtle grain. Whimsical storybook charm, never corporate.
```

**Command:**
```bash
WORLD_TEXT=$(cat nodes/worlds/$World.txt)
higgsfield generate create gpt_image_2 \
  --prompt "Square editorial poster. ... [filled template above with $WORLD_TEXT and $Action and $Quote] ..." \
  --image content/factory/refs/wizl-clean.png \
  --aspect_ratio 1:1 \
  --wait
```

## Vertical version (model: `seedream_v4_5`, aspect `9:16`)

Re-frame: Wizl bottom-center, quote stacked vertically above. Same palette, same typography rules.

---

## Quote bank (rotation)

1. The best strain is the one that matches your moment, not someone else's review.
2. Terpenes tell you more than THC ever will. Learn to smell before you buy.
3. Don't chase the highest THC. Chase the right terpene profile.
4. Every strain has a story. Every smoker has a chapter.
5. Indica, Sativa, Hybrid — labels are guides, not rules. Your body knows best.
6. The difference between a good experience and a bad one is often just 5mg.
7. Cannabis is not a competition. There's no trophy for the highest tolerance.
8. A 15% strain with perfect terpenes will outperform a 30% strain with none.
9. The best budtender is a curious one. Never stop asking questions.
10. Respect the plant. It's been here longer than any of us.
11. Low and slow. The mantra of every wise smoker.
12. Your first strain shapes your relationship with cannabis forever. Choose wisely.
13. The nose knows. If it doesn't smell right, it probably isn't.
14. Hydrate. Seriously. The wizard has spoken.
15. There are over 100 cannabinoids. THC and CBD are just the beginning.

---

## Caption template

```markdown
# Main caption (IG / X)
"$Quote"
— WIZL 🧙‍♂️🌿

with love, from the streets of Bangkok.

wizl.space

# Hashtags
#wizlwisdom #cannabis #wizl #bangkok #stoner #cannabiscommunity #420 #cannabiseducation
```
