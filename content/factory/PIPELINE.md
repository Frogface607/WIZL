# WIZL Content Factory Pipeline

This is the production lane for WIZL character, education, and adventure content.

Read first:

- docs/wizl-brand-kit.md
- content/content-plan.md
- .agents/product-marketing.md

## Default stack

1. Plan a post folder and manifest with an approved recipe.

Example:

npm run factory:plan -- --recipe adventure-reel --title "The Lost Page at the Night Market" --world night-market --episode 01

2. Generate a start frame with GPT Image 2 through the configured Higgsfield route.

npm run factory:image -- --manifest content/posts/POST_FOLDER/manifest.json

3. Animate with Seedance 2.

npm run factory:video -- --manifest content/posts/POST_FOLDER/manifest.json

4. Render captions and layout with Remotion.

npm run factory:render -- --manifest content/posts/POST_FOLDER/manifest.json

5. Inspect recent jobs.

npm run factory:status

## Approved recipe families

- WIZL adventure
- wisdom card
- strain-reference carousel with verified facts
- story background
- product ritual
- founder support graphics
- collectible character art without third-party branding

## Paused recipe families

- shop visit or dispensary promotion
- celebrity-tag campaigns
- unauthorized brand collaborations
- seller, menu, price, or map content
- paraphernalia sales creative

A paused recipe can be reactivated only after legal, platform, partner-permission, and factual review.

## Folder contract

Each post folder owns a manifest.json.

Required planning outputs:

- prompt-image.txt
- prompt-motion.txt
- caption.md
- manifest.json

Typical generated outputs:

- start.png
- loop.mp4
- edit.mp4
- cover.png

## Model rules

- still frame: configured GPT Image 2
- motion: configured Seedance 2
- deterministic text, layout, captions, and export: Remotion
- fallback still model only when necessary

## Quality gate

Before publishing:

- character anatomy and wardrobe match the reference
- cat and Book continuity are preserved
- text fits mobile crop
- factual claims use primary sources
- no exact visual-identification claim
- no purchase, seller, price, menu, or medical claim
- no third-party logo or implied endorsement
- one content job and one CTA
