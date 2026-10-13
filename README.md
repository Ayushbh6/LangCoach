# German Me v2

A private scenario-based German learning app, built with React/Vinext, Cloudflare Workers and D1. Source is public; learning records are private.

## Learning loop

Today → focused practice → feedback → repair after intervening tasks → later retrieval. Choose session length, block order and silent/headphone mode. Sessions are saved server-side; switching blocks preserves unfinished sessions. Browser drafts and pending submissions survive brief disconnections, with idempotent retry. This is online-first, not an offline PWA.

The original 600-word vocabulary library and stable review IDs remain available. Production (`:en`) and recognition (`:de`) use separate FSRS schedules through `ts-fsrs`, 90% desired retention and 1/10-minute learning steps. New material is capped at five items per day by default. Extra practice does not change schedules. New phrases are taught before retrieval. Copying, hints and repairs never count as unaided success.

Fourteen original scenarios cover groceries, cafés, clarification, appointments, weekends, plans, transit, training and related variations. Each has five phrases, a pattern, constrained practice, reading, original synthetic German audio, writing and a conversation mission. Audio is generated with macOS Anna and FFmpeg; it is clearly labelled synthetic. Goethe exam material is linked at its original source, not copied. A finite fresh-check bank supports baseline/weekly mixed checks; repeated prompts cease to count as fresh.

The 20-week route is provisional. Weeks 5–20 are curriculum goals, not a claim that a complete 20-week course or validated exam simulation exists. Independent writing/speaking assessments happen through coaching and official module practice. The app does not infer pronunciation from transcripts or manufacture a fluency percentage.

## One learning record

- `lib/learning/service.ts`: shared browser/MCP learning services.
- `learning_state`: account-scoped current settings, FSRS cards, session snapshots, priorities and published lesson.
- `learning_events`: append-only original attempts, support, summaries, corrections, publication and idempotency results.
- `preparation_binding`: explicit owner account binding for unattended preparation.
- `app/api/learning`: authenticated browser reads/writes.
- `app/mcp`: stateless Streamable HTTP MCP using the official SDK.
- `app/api/preparation`: owner-private hosted preparation writer with verified readback.

Five MCP tools: `get_learning_brief`, `get_practice_session`, `get_progress`, `save_session_summary`, `publish_lesson`. Tools require the platform-supplied learner identity; service access alone does not impersonate a learner. The Site UI provides copyable briefs and versioned summary import when tools are unavailable. Duplicate IDs with different content are rejected. Older summaries preserve newer priorities and remain historical evidence.

Rule-based checking is restricted to constrained exercises. Open writing is pending coaching. Flagged corrections are excluded from progress claims. Recognition, production, grammar, reading, listening, writing and speaking remain separate. Provisional pattern stability requires >=80% in at least two fresh mixed checks on separate days spanning a week, with at least two samples per day and transfer. This is a coaching heuristic, never a Goethe score.

## Privacy and migration

`LEARNER_PROFILE.md`, `private/`, exports, environment files and local runtime state are ignored. Never place private answers, profiles or credentials in public assets or fixtures. Public answer keys remain server-only. Tests use synthetic accounts and answers.

Existing `progress` and `reviews` are retained unchanged. Lazy per-account migration replays usable historical ratings into FSRS and preserves every original due date until an actual new review. Incomplete history is explicitly labelled. Old review-writing clients receive an upgrade response to avoid concurrent scheduling systems. Back up through the private export before operational recovery; do not reset production storage.

`archive/german-me-v1` preserves the pre-redesign app. Development is on `german-me-v2`; Sites publishes the exact pushed commit through its configured source branch. The older LangCoach `v1`/`v2` branches are unchanged.

## Development

- `npm run dev -- --port 5174`: local preview with synthetic local sign-in.
- `npm test`: service/database integration tests and legacy scheduler regressions.
- `npm run typecheck`: TypeScript.
- `npm run build`: Worker build.
- `npx tsx scripts/generate-audio.mjs`: regenerate original audio on macOS with Anna and FFmpeg.

After changing schema: `npm run db:generate`, inspect schema-only SQL, build, then apply only pending migrations locally:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_salty_black_crow.sql
```

Sites applies hosted migrations during publication. Never publish with Wrangler. Failed deployments may already have applied migrations; keep applied SQL immutable. Schema additions preserve the original tables, so an earlier app version remains recoverable without deleting new data.

## Connection and daily preparation

See [ChatGPT connection](docs/CHATGPT_CONNECTION.md) and [daily preparation](docs/DAILY_PREPARATION.md). Hosted publication is separate from plugin installation, actual tool verification and phone voice testing. Do not claim these steps are complete without observing them.
