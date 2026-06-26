# Recipe: Strain of the Day (3-slide carousel)

**Variables:** `$Strain`, `$Type` (sativa/indica/hybrid), `$Genetics`, `$Effects`, `$Flavors`, `$THC`, `$World` (apothecary | study | secret-garden | night-market), `$Date`

**Output:** `content/posts/{Date}-{Strain-slug}/`
- `slide-1.png` — Wizl with the strain in the chosen world (hero)
- `slide-2.png` — clean infographic card (THC, effects, flavors, terpenes)
- `slide-3.png` — CTA card ("Found in The Book — wizl.space")
- `caption.md` — copy-paste IG + Twitter + hashtags

---

## Slide 1 — Hero (model: `gpt_image_2`, aspect `3:4`)

> Pipeline: GPT Image 2 + `--image content/factory/refs/wizl-clean.png` (clean cartoon ref). NEUTRAL scene description (no "cannabis bud" — say "specimen" / "small crystal"). Strain NAMES go in overlay-text only, which GPT renders without NSFW reject.

**Prompt template:**
```
[CHARACTER] WIZL is examining a jar labeled "$Strain" in [WORLD]. He holds a small bud up to the emerald light of his staff, expression curious and delighted. The orange cat in his satchel sniffs the jar.

[STYLE]
```

**Command:**
```bash
higgsfield generate create gpt_image_2 \
  --prompt "$(cat nodes/character.txt) WIZL is examining a small glass jar labeled \"$Strain\" in $(cat nodes/worlds/$World.txt) He holds a single small specimen up to the emerald light of his staff, expression curious and delighted. The orange cat in his satchel sniffs the jar with interest. $(cat nodes/style.txt)" \
  --image content/factory/refs/wizl-clean.png \
  --aspect_ratio 3:4 \
  --wait
```

## Slide 2 — Infographic (model: `gpt_image_2`, aspect `3:4`)

> See `test-c-magic-pop-rocks.png` — the format is locked. Header is the strain name as-is, badge says "HYBRID BLEND", big stat says "INTENSITY 21%" (or use "THC 21%" — overlay-text rule allows it), three sections: LINEAGE / NOTES / EFFECTS. Hero illustration is a glowing emerald crystal nugget, NOT a cannabis bud.

**Prompt template:**
```
Editorial infographic card titled "$Strain" on deep navy #0B1218 background. Type: $Type. THC: $THC%. Genetics: $Genetics. Effects: $Effects. Flavors: $Flavors. Use cream #F2E8D4 for type, neon green #99F788 for the THC value, wizard purple #8C6FB8 for the type badge, warm gold #CE8E58 for accents. Top-left: small Wizl mascot silhouette as watermark (low opacity). Bottom-right: "wizl.space" in 10px uppercase letter-spacing 0.2em. Montserrat Black for the strain name, Montserrat Bold for labels, Montserrat Regular for values. Floating cannabis-leaf doodles and subtle smoke wisps in the background. Clean editorial layout, asymmetric, breathable. Subtle grain texture overlay.
```

## Slide 3 — CTA (model: `gpt_image_2`, aspect `1:1`)

> Universal CTA card. Already rendered once on 2026-05-12 (`content/posts/2026-05-12-cta-the-book/cta.png`, Seedream) — reuse the same asset across ALL carousels until brand evolves. Don't burn credits regenerating identical CTAs. Future regenerations should use `gpt_image_2` + clean ref + cartoon style.

**Prompt template:**
```
End-slide carousel card. Deep navy #0B1218 background. Centered: large cream text "Found in The Book." Below in smaller neon green #99F788: "3,000+ strains. Free forever." Below in warm gold #CE8E58 small text: "wizl.space". Wizl mascot silhouette holding the open magical book on the right side, faint green crystal glow on the book pages. Montserrat Black 96px for headline, Montserrat 32px for sub. Subtle grain, smoky haze top and bottom edges.
```

---

## Caption template (`caption.md`)

```markdown
# Main caption (IG)
STRAIN OF THE DAY: $Strain

$ShortDescription

Genetics: $Genetics
Type: $Type | THC: $THC%
Effects: $Effects
Flavors: $Flavors

$FunFact

Scan it on wizl.space

# Twitter (280 chars)
$Strain — $ShortDescription

$Type | $THC% THC
Effects: $Effects

wizl.space

# Hashtags
#${StrainSlug} #strainoftheday #wizl #cannabis #cannabiscommunity #${TypeTag} #bangkok
```

---

## Strain examples (from 30-day plan)

| Strain | Type | Genetics | World | THC |
|---|---|---|---|---|
| Blue Dream | Hybrid | Blueberry x Haze | secret-garden | 21% |
| OG Kush | Hybrid | Chemdawg x Lemon Thai x Hindu Kush | apothecary | 24% |
| Wedding Cake | Indica | Triangle Mints x Animal Mints | study | 25% |
| Gelato | Hybrid | Sunset Sherbet x Thin Mint GSC | night-market | 22% |
| Purple Haze | Sativa | Purple Thai x Haze | portal-chamber | 18% |
