# WIZL Content Factory

The factory turns one approved idea into a consistent WIZL asset pack. It is a production tool for an adult, international education and character brand.

## Active Recipes

The orchestrator currently supports:

- `adventure-reel`: a short episode from The Lost Pages.
- `wisdom-card`: one useful, sourceable idea in a square card.
- `strain-carousel`: a reference carousel that separates general strain lore from label-specific facts.

Shop promotion and celebrity-tag recipes are paused. They must not be used as shortcuts for unverified endorsements, cannabis sales, or Thai shop advertising.

## Pipeline

```text
approved brief
  -> canonical character + style + world nodes
  -> GPT Image 2 start frame or carousel art
  -> Seedance 2 motion when the idea needs video
  -> Remotion edit
  -> human fact, rights, and policy review
  -> publish
```

WIZL's character reference is required for every character-led render. Use the original PNG references for generation quality; the optimized WebP files are for the web app.

## Commands

```powershell
npm run factory:plan -- --recipe adventure-reel --title "The Lost Page at the Night Market" --world night-market --episode 01
npm run factory:plan -- --recipe wisdom-card --quote "The label starts the story. Your notes finish it." --world study
npm run factory:plan -- --recipe strain-carousel --strain "Blue Dream" --source "https://source.example/reference" --type Hybrid --world secret-garden

npm run factory:image -- --manifest content/posts/YYYY-MM-DD-slug/manifest.json
npm run factory:video -- --manifest content/posts/YYYY-MM-DD-slug/manifest.json
npm run factory:render -- --manifest content/posts/YYYY-MM-DD-slug/manifest.json
npm run factory:status
```

Planning writes a manifest, prompts, caption, and Remotion props into `content/posts/{date}-{slug}/`. Generation is never an approval to publish.

## Editorial Rules

- Audience is adults of legal age in their own jurisdiction.
- Publish in English first. Thai requires a native-language review.
- Teach observation, labeling, journaling, tolerance awareness, breaks, and safer choices.
- Do not diagnose, prescribe, guarantee an effect, or invent potency.
- Do not identify a strain from flower appearance alone.
- Do not promote sellers, menus, prices, delivery, or unlicensed partners.
- Do not depict minors, driving, coercion, dangerous mixing, or irresponsible use.
- Do not fabricate testimonials, ratings, check-ins, collaborations, or community size.
- Keep Sergey human. AI may animate WIZL, but it does not impersonate the founder.
- Use trademarks, celebrity likenesses, and partner logos only with written permission.
- Do not evade a model's safety filters. Revise the concept or choose a compliant tool.

## Quality Gate

Before publishing, confirm:

- WIZL is recognizably on-model and not photorealistic.
- The cat, Book, cloak, crystal, and setting follow the episode brief.
- Text is readable on a phone and contains no generated spelling errors.
- Every factual claim has a saved source.
- Reference data is labeled as reference data, not a promise about a product or batch.
- The caption has one idea and one useful action.
- The asset has passed rights, platform, and local-law review.
- The final exported file opens correctly and matches its target aspect ratio.

Canonical strategy: [GTM launch strategy](../../docs/gtm-launch-strategy.md).
Canonical brand rules: [WIZL brand kit](../../docs/wizl-brand-kit.md).
