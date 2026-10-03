# German Me

Private Sites app for learning German with 500 distinct everyday vocabulary cards and 40 case cards. Built in `Me/German` with React/Vinext and a Cloudflare D1 database.

- Flip German ↔ English. Nouns include gender and plural; verbs include helpful forms.
- Due cards first, then up to 20 new cards per session. Add 20 more at session end.
- Again: 1 minute. New Hard: 6 minutes. New Good: 1 day, then 6 days. New Easy: 4 days. Successful reviews lengthen intervals using a small SM-2-inspired scheduler, not Anki FSRS.
- Translation directions have independent schedules. Cases use a separate deck.
- Progress is keyed by the authenticated ChatGPT user, stored in D1, and survives sessions/devices. Ratings use idempotency keys and optimistic concurrency protection.
- The daily goal and streak use Europe/Vienna. Browser speech uses available German system voices.
- Private access is enforced by Sites; protected page/API routes also require ChatGPT identity.

## Content

`data/vocabulary.ts` is an independently curated set combining A1 foundations and A2 everyday vocabulary; it is not the complete official exam word list. All English translations and case exercises were authored for this app. The case deck includes a brief genitive introduction. Goethe's official A2 exam resources are linked from the in-app guide: https://www.goethe.de/en/m/spr/prf/ueb/pa2.html

## Development

`npm run dev -- --port 5174` starts the portable local preview with simulated ChatGPT sign-in. `npx tsc --noEmit` checks types; `npm run build` produces Worker output. `npm run db:generate` creates migrations after schema edits. See Sites skills for publishing and local migration application; do not publish with Wrangler directly.

Cloud migrations under `drizzle/` are schema-only. Local preview data is ignored and is never shipped in a deployment.
