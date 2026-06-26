# WIZL Launch Readiness

Updated: 2026-06-26

## Current Launch State

WIZL is close to a soft public launch.

The core web flow now explains the product quickly:

- Home: scan, Book, map, Ask WIZL.
- Scan: AI strain estimate with educational trust copy.
- Book: 3,000+ strains visible on production.
- Map: shop discovery and shop-owner CTA.
- Check-in: AI scan path, search path, and save flow.
- Club: free founder claim plus optional $4.20/year support.

Production smoke on `https://wizl.space/en`:

- No Russian text detected in the checked public pages.
- No 400/500 page responses detected during the mobile pass.
- AI scan returns real OpenAI results when the key is present.
- Age gate appears first for new users.

## User Audit

### First Impression

The app now has a clear promise: scan what you got, learn it, save it. The character layer makes it memorable, but the interface still needs to keep proving that WIZL is useful in the first 10 seconds.

### Strong Points

- The home page finally says what the product does without requiring lore context.
- The Book count is impressive and gives instant substance.
- The AI scan flow has trust copy, which matters for cannabis and image recognition.
- The map creates a broader discovery angle beyond strain lookup.
- The $4.20 Club offer fits the brand and does not feel like a hard paywall.

### Friction

- Age gate blocks every direct URL for a new user. This is legally useful, but launch content should send people to one clear CTA after they enter.
- Check-in still needs final polish after selection/rating: several secondary labels use older emoji-heavy language.
- Strain cards are dense on mobile. Good for power users, but first-time users may need clearer "tap to open" affordance later.
- Console still reports occasional Supabase fetch fallback noise during navigation. Production UI recovers, but this should be watched.
- Build still warns about the deprecated Next `middleware` convention. Not launch-blocking, but should be cleaned before heavier scaling.

## Launch Blockers

None for a founder-led soft launch.

Do not run a big paid campaign until:

- AI scan is tested with 20-30 real labels/photos.
- Top 20 strain detail pages are manually checked.
- Analytics events are wired for scan started, scan completed, strain opened, check-in saved, Club click.
- Founder story and first WIZL adventure assets are published and pinned.

## Soft Launch Definition

WIZL is soft-launch ready when:

- A new adult user can understand the product from the home page.
- A user can search The Book and open a strain.
- A user can run one AI scan and see a result that is not a demo fallback.
- A user can save/check in a strain.
- The founder story explains why WIZL exists.
- The first 7 days of content are ready to post.

Status on 2026-06-26: mostly ready, content production is the next bottleneck.

## Next Product Sprint

1. Add basic analytics events.
2. Polish post-check-in copy and share actions.
3. Fix deprecated Next middleware warning.
4. Investigate Supabase client fallback noise during fast page navigation.
5. Review top strain detail pages for missing or weak metadata.
6. Add one social share image / OG image for launch links.

## Next Marketing Sprint

1. Publish founder story reel from the Hero video.
2. Publish "Meet WIZL" carousel.
3. Generate "The Lost Page at the Night Market" adventure reel.
4. Pin the founder story, product hook, and best WIZL lore post.
5. Track comments manually for the first week and turn good questions into posts.
