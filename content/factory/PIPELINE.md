# WIZL Content Factory Pipeline

This is the revived production lane for WIZL social content.

Before generating assets, read the brand kit:

- `docs/wizl-brand-kit.md`

## Default Stack

1. Plan the post folder and manifest:

```powershell
npm run factory:plan -- --recipe shop-visit-reel --shop "Space Herbs" --world night-market
npm run factory:plan -- --recipe adventure-reel --title "The Lost Page at the Night Market" --world night-market --episode 01
```

2. Generate the start frame with Higgsfield GPT Image 2:

```powershell
npm run factory:image -- --manifest content/posts/2026-06-21-shop-space-herbs/manifest.json
```

3. Animate the start frame with Higgsfield Seedance 2:

```powershell
npm run factory:video -- --manifest content/posts/2026-06-21-shop-space-herbs/manifest.json
```

4. Edit the final vertical reel with Remotion:

```powershell
npm run factory:render -- --manifest content/posts/2026-06-21-shop-space-herbs/manifest.json
```

5. Inspect recent Higgsfield jobs:

```powershell
npm run factory:status
```

## Contract

Each post folder owns a `manifest.json`. Remotion reads that manifest and renders a deterministic 1080x1920 edit.

Required output files:

- `prompt-image.txt`
- `prompt-motion.txt`
- `caption.md`
- `manifest.json`

Generated files:

- `start.png` from `gpt_image_2`
- `loop.mp4` from `seedance_2_0`
- `edit.mp4` from Remotion
- `cover.png` for thumbnails, when extracted later

## Model Rules

- Still frames: `gpt_image_2`
- Motion: `seedance_2_0`
- Editing/layout/export: Remotion
- Fallback stills only when needed: `seedream_v4_5`

Scene prompts use neutral visual wording. Overlay text may use real educational cannabis terms when the post needs it.

## Remotion Preview

```powershell
npm run remotion:studio
```

For a quick frame check:

```powershell
npm run remotion:still -- --props content/posts/2026-06-21-shop-space-herbs/remotion-props.json
```
