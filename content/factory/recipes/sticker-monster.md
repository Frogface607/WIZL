# Recipe: Sticker Monster (strain → collectible character)

**Goal:** Collectible series. Each strain gets a unique cute monster character — vinyl-toy style, sticker-ready, dark background. Print 500, leave 5-10 per shop visit, QR → wizl.space.

**Variables:** `$Strain`, `$Personality` (e.g. "dreamy and floating, half-asleep"), `$Colors` (e.g. "blue and purple with soft glow"), `$Number` (sticker pack number, e.g. "#001"), `$Date`

**Output:** `content/posts/{Date}-sticker-{strain-slug}/`
- `sticker.png` — square 1:1, transparent or dark bg
- `sticker-pack.png` — 4-up sheet for printing
- `caption.md`

---

## Single sticker (model: `nano_banana_flash`, aspect `1:1`)

**Prompt template:**
```
Cute monster character for "$Strain" cannabis strain. The monster is $Personality. Small round creature, big expressive eyes, $Colors color scheme. Collectible vinyl toy style — like a Kidrobot Dunny or a Kaws figure crossed with a Pokémon plush. Dark background #0a0a0e. Tiny text "wizl.space — $Number" at the bottom center in muted grey, letter-spacing 0.1em. NO cannabis leaves, NO red eyes, NO weed stereotypes. Sticker-ready design with slight drop shadow. Storybook charm meets street culture. Subtle grain texture.
```

**Command:**
```bash
higgsfield generate create nano_banana_flash \
  --prompt "[filled template]" \
  --aspect_ratio 1:1 \
  --wait
```

## Pack sheet (model: `gpt_image_2`, aspect `1:1`)

Compose 4 stickers in 2×2 grid with crop marks for cutting. Add "WIZL STICKER PACK $Number-$NumberEnd" header in Montserrat Black cream on dark navy.

---

## Strain → Monster mapping (from `WIZL/docs/sticker-prompts.md`)

| # | Strain | Personality | Colors |
|---|---|---|---|
| 001 | Blue Dream | dreamy and floating, half-asleep with a blissful smile, surrounded by tiny blue sparkles | blue and purple with soft glow |
| 002 | OG Kush | grumpy zen master, sitting cross-legged with one eye open | dark green and earthy brown |
| 003 | Sour Diesel | electric and buzzing, hyperactive grin, lightning bolts around | bright yellow and chrome |
| 004 | Girl Scout Cookies | mischievous baker, holding a tiny rolling pin | mint green and chocolate brown |
| 005 | Gorilla Glue #4 | sticky-handed wrestler, oversized hands, goofy smile | amber resin and forest green |
| 006 | Wedding Cake | elegant dessert spirit, frosting crown, dreamy expression | vanilla cream and soft purple |
| 007 | Gelato | gelato-cone-headed, multicolor scoops melting | pink lavender mint |
| 008 | Runtz | candy-shell creature, rainbow speckles, sugar-rush energy | rainbow on dark base |
| 009 | Purple Haze | psychedelic guru, eyes closed in trance, swirling smoke | deep purple and magenta |
| 010 | White Widow | mysterious and frosty, covered in crystalline ice, glowing white aura | white silver pale blue |
| 011 | Northern Lights | aurora-haired sleepy giant, blanket-cape | aurora teal indigo |
| 012 | Pineapple Express | tropical mail-courier, tiny pineapple hat, flying scarf | yellow and tropical green |

(Continue series — every strain in the database eventually gets a monster.)

---

## Caption template

```markdown
# Main caption (IG)
WIZL Sticker $Number — $Strain 🌿

$Personality. Now collectible.

Find them in Bangkok shops or grab the digital pack on wizl.space.

# Hashtags
#wizl #cannabisart #stickerart #vinyltoy #cannabisstrains #$StrainSlug #bangkok
```
