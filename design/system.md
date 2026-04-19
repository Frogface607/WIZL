# WIZL Design System

> **The visual language of WIZL — The Weasel Wizard sharing Weed Wisdom With Love.**
> Use this document as context when generating visuals, mockups, presentations, or variations. Built from the mascot illustration — palette, forms, and character flow from Wizl himself.

---

## Brand Soul

**WIZL** is a cannabis strain explorer built on the streets of Bangkok by one Russian dude with a GoPro. The product is **serious** (3,000+ strains, AI chat, strain tracking) but the brand is **warm** — a kind weasel wizard who travels the world, discovers the best herbs, and writes them in his magical book.

**Aesthetic movement:** *Mystic Street Futurism.* Miyazaki warmth meets Moomin linework meets Adventure Time playfulness meets street-culture neon. Cozy proportions. Hand-drawn feel. Deep navy skies lit by neon crystals and bioluminescent plants. Every frame feels like twilight in an enchanted Asian metropolis.

**Tone of voice:** kind, slightly mystical, never corporate. The Wizard speaks; he does not "provide information." Think *friendly budtender crossed with Gandalf on a tropical vacation*.

---

## Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--bg-primary` | `#0B1218` | Page background — deep navy |
| `--bg-hero` | `#10181F` | Hero / image-matching surface |
| `--bg-card` | `#17222C` | Raised surfaces (cards, panels) |
| `--bg-card-hover` | `#1F2D3A` | Hover state |
| `--accent-neon` | `#99F788` | **PRIMARY CTA** — the crystal on Wizl's staff. Use for main action buttons, active states, focus rings. |
| `--accent-green` | `#7DD87A` | Softer day-green — secondary accent |
| `--accent-purple` | `#8C6FB8` | Wizard cloak — for magic/AI elements, indica strains |
| `--accent-purple-deep` | `#5E3E7A` | Shadow purple, dark borders |
| `--accent-orange` | `#CE8E58` | Moon, belt buckle — warm gold, sativa strains |
| `--accent-love` | `#D48AB5` | Romantic pink — "with love" tagline |
| `--text-primary` | `#F2E8D4` | Cream — main type (matches WIZL wordmark) |
| `--text-secondary` | `#C9BCA4` | Quieter cream for secondary text |
| `--text-muted` | `#7F8A96` | Cool grey-blue — muted labels, distant stars |

### Strain type gradients
- **Sativa** — `linear-gradient(135deg, #CE8E58, #D4A678)` (warm gold)
- **Indica** — `linear-gradient(135deg, #8C6FB8, #A388C8)` (wizard purple)
- **Hybrid** — `linear-gradient(135deg, #7DD87A, #99F788)` (neon green)

### Brand gradients
- **WIZL text gradient:** `linear-gradient(135deg, #99F788 0%, #8C6FB8 55%, #F2E8D4 100%)` — neon → purple → cream
- **Love gradient:** `linear-gradient(135deg, #D48AB5, #CE8E58)` — pink → gold

---

## Typography

**Primary font:** Montserrat (Google Fonts, already loaded)

| Use | Weight | Notes |
|-----|--------|-------|
| Display (WIZL wordmark, H1) | 900 (Black) | Wide tracking 0.25em |
| Section headers (H2, H3) | 700-800 | Normal tracking |
| Body | 400-500 | |
| Taglines, labels | 300 | Letter-spacing 0.1-0.3em for "with love" style |
| Small meta | 500 | UPPERCASE 10px with 0.1em spacing |

No alternate display font. Keep it single-family. Italic used sparingly for "Wizl wisdom" quotes.

---

## Character & Mascot

**WIZL The Wizard** is a kind anthropomorphic weasel in a purple patched wizard's cloak. Carries a gnarled wooden staff topped with a glowing neon-green crystal. Small cat tucked in his satchel. Magical book of strains. Rounded friendly proportions — he is small, humble, curious.

**Don'ts:**
- No angry/aggressive poses
- No "serious business" expressions
- No mass-market cannabis stereotypes (giant leaves, red eyes, 420 jokes)
- Never in marketing-stock compositions — always with world context

**Do's:**
- Warm twilight lighting
- Small stature vs large mystical environments
- Interacting with book, crystal, herbs, potions, local creatures
- Each city gets its own local mythical creatures around him

---

## World

**Mystic Street Futurism cities:** real-place architecture filtered through enchanted cyberpunk lens. Floating transit rails, neon apothecary signs in local language, gothic spires + art-deco curves, cobblestones with bioluminescent plants growing from cracks, airships drifting in lavender skies, amber streetlamps, drifting magical smoke.

**Local creatures per city:**
- Bangkok — tuk-tuk kinnari, nagas, mushroom folk, Moomintrolls (as friendly cameos)
- Tokyo — kitsune, tanuki, lantern spirits
- Amsterdam — cycling gnomes, canal swans with lanterns
- Chiang Mai — garuda, forest deer, jungle fairies
- Barcelona — stone gargoyles, jamón merchants as satyrs

---

## Motion & Atmosphere

**Smoke overlay** — a thin, drifting SVG turbulence layer fixed at the top 180px of every page. Green-purple tinted. `mix-blend-mode: screen`, `opacity: 0.35`. Two independent drift animations (28s and 42s) for non-repeating motion.

**Fireflies** — warm amber (#fbbf24) particles at 50% opacity with soft blur, drifting on slow float keyframes (4-10s). Appear on hero, strain detail, and magical moments. Never on utilitarian pages (settings, forms).

**Animations:**
- Hover: `brightness(110%)` + 200ms ease
- Active press: `scale(0.98)` 150ms
- Enter: `slide-up` with 20px translate over 400ms
- Glow pulse on primary CTAs: 3s ease infinite
- NO parallax. NO loaders with spinners (use pulsing mascot instead).

---

## Components

### Primary CTA
Neon green bg `#99F788`, black text, bold, rounded-2xl, 24px glow shadow:
```
box-shadow: 0 0 24px rgba(153,247,136,0.3);
```

### Glass card
Linear gradient overlay on bg, backdrop blur + saturate, warm cream border:
```
background: linear-gradient(180deg, rgba(31,45,58,0.55) 0%, rgba(23,34,44,0.75) 100%);
backdrop-filter: blur(24px) saturate(1.2);
border: 1px solid rgba(242,232,212,0.08);
```

### Chat header pattern (Ask WIZL)
Round mascot avatar (36px) + "Ask WIZL The Wizard" bold + "your herbal guide" muted subtitle.

### Strain card
Type-gradient background. White text 90% opacity. Rating in top-right with yellow stars. Genetics with DNA icon. Effects as emoji chips at bottom.

---

## Voice & Copy

**Wizl speaks like:**
> "Welcome to the Space, traveler! What strain are you curious about today? 🧙‍♂️"

> "The best strain is the one that matches your moment, not someone else's review."

> "Terpenes tell you more than THC ever will. Learn to smell before you buy."

**Never:**
- "Unlock exclusive access!"
- "Don't miss out!"
- "Click here now!"
- Corporate punctuation. Em-dashes over semicolons.

**Signature sign-offs:**
- "with love 🌿"
- "— WIZL"
- "from the streets of Bangkok"

---

## Assets Inventory

| File | Purpose |
|------|---------|
| `public/hero-wizl.png` | Full hero — mascot + WIZL text + "with love" on navy bg |
| `public/mascot.png` | Round avatar source — head close-up, transparent |
| `public/logo-mark-transparent.png` | Mascot with green glow, no text, transparent |
| `public/wizl-book.png` | Wizard reading magical book — editorial use |
| `public/icons/icon-192.png` + `icon-512.png` | PWA icons |
| `public/favicon-32x32.png` + `favicon-16x16.png` | Browser favicons |
| `public/icons/apple-touch-icon.png` | iOS home screen |
| `social-assets/wizl-*.png` | Social media sized exports |

---

## Example Prompts for Visual Generation

Use these node-style prompts in Freepik / Claude Design / MuAPI:

**Style:**
> Soft hand-drawn illustration blending Miyazaki atmospheric warmth, Moomin gentle linework, Adventure Time playful simplicity. Rounded shapes, cozy proportions, dreamy pastel palette with neon accents (#99F788, #8C6FB8, #CE8E58). Smoky haze drifts through layered urban environments mixing fantasy architecture with retro-futuristic signage.

**Character:**
> Kind anthropomorphic weasel with warm expressive eyes and gentle smile. Wears oversized purple traveling cloak adorned with moon and star patches, weathered pointed wizard hat with cannabis leaf pin. Carries gnarled wooden staff topped with glowing emerald crystal. Leather satchel with mysterious vials and a sleeping orange cat. Soft brown fur. Small stature — compact, humble, shorter than average human characters in scene.

**Scene / Action:**
> Scene location: {CITY}. Architecture filtered through Mystic Street Futurism — enchanted version of real place. WIZL is {ACTION}. Camera: {medium shot, three-quarter view, golden hour}. Natural relaxed pose (never T-pose). Props interacted with naturally. Local mythical creatures populate the scene.
