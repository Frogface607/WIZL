# WIZL — with love

WIZL is a cannabis field guide and pocket companion for adults.

The product combines:

- The Book with more than 3,000 strain reference pages
- a cautious AI label reader for clear package text and exact names
- private field notes, ratings, moods, favorites, and a personal taste trail
- Ask WIZL for concise educational guidance
- the WIZL character, lore, and serialized world

WIZL does not sell cannabis, arrange purchases, or claim that a flower photo can prove strain identity or potency.

## Product state

- Core web app: free
- Account sync: not active
- Field-note storage: browser local storage on the current device
- AI reads: five per device per day, with a best-effort server network limit
- WIZL Club checkout: paused pending provider and compliance approval
- Public venue atlas: paused pending listing and legal verification

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Supabase for the strain-reference catalog
- OpenAI Responses API for primary label reads
- OpenRouter for fallback label reads and Ask WIZL
- Vercel for hosting and aggregate product analytics

## Local development

1. Install dependencies with npm install.
2. Add required local environment variables to .env.local.
3. Start with npm run dev.
4. Run npm test and npm run lint before committing.
5. Run npm run build for the production build.

Open http://localhost:3000 after starting the development server.

## Key documents

- docs/gtm-launch-strategy.md — launch, positioning, monetization, Bangkok plan
- docs/launch-readiness.md — current audit and launch gates
- docs/wizl-brand-kit.md — world, character, voice, and visual rules
- content/content-plan.md — canonical 30-day editorial plan
- content/launch-publishing-kit.md — ready-to-publish launch packet
- WIZL-BIBLE.md — product and architecture context

Production: https://wizl.space
