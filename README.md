# German Me

Owner-private Goethe A2–B1 study app in `Me/German`, built with React/Vinext and Cloudflare D1.

- 600 distinct vocabulary cards: 490 A2 core (including foundations), 110 B1 expansion, plus 40 case exercises.
- German ↔ English with independent schedules, noun articles/plurals, verb forms, and original B1 example sentences.
- Rated recall: Again 1 minute; new Hard 6 minutes; new Good 10 minutes, then 1 day after the next Good; new Easy 4 days. Hard at the second learning step repeats 10 minutes. Mature reviews retain the existing SM-2-inspired schedule, not Anki FSRS.
- Due cards first, then up to 20 new cards per session. When no other cards remain, short learning steps may appear up to 20 minutes early.
- Auto repeat: a fixed set of up to 20 due, reviewed-today, then unseen cards cycles through three rounds. Timed reveal/advance, three speeds, manual reveal, pause/resume, and tab-hidden pause. This practice does not infer recall, submit ratings, or change review intervals.
- Card faces are mounted individually with a fade/slide transition, avoiding mirrored text during card changes.
- D1 progress is keyed by authenticated ChatGPT identity. Reviews retain idempotency and optimistic concurrency protection. Existing IDs, due dates, and saved progress are preserved.
- Vienna-local daily goal/streak. Browser pronunciation uses installed German voices.

## Content and sources

This is an independently curated study bank for A2–B1 preparation, not the complete Goethe exam syllabus or an official Goethe product. Levels are study groupings: foundations remain in A2 core, and B1 expansion focuses on opinions, reasons, work, public services, travel problems, and connected sentences. Case exercises cover nominative, accusative, dative, two-way prepositions, and introductory genitive.

Headwords were checked against the official [Goethe A2 word list](https://www.goethe.de/pro/relaunch/prf/ms/Goethe-Zertifikat_A2_Wortliste.pdf) and [Goethe B1 word list](https://www.goethe.de/pro/relaunch/prf/id/Goethe-Zertifikat_B1_Wortliste.pdf). Inflections/reflexive forms and supporting foundations are retained where useful. Translations, learning notes, and examples are independently authored. Four older stretch terms outside these references remain API-valid for older clients but no longer appear in the active bank; their progress is not deleted.

Recall behavior draws on [Anki learning steps](https://docs.ankiweb.net/deck-options.html#learning-steps) and [Auto Advance](https://docs.ankiweb.net/deck-options.html#auto-advance). The app's hands-free practice is deliberately separate from remembered/forgotten ratings.

## Development and verification

- `npm run dev -- --port 5174`: portable preview with simulated sign-in.
- `node --experimental-strip-types --test tests/recall.test.mjs`: learning transitions, legacy scheduling, selection and repeat-order regressions.
- `npx tsc --noEmit`: type check.
- `npm run build`: Worker build. Publish via the Sites workflow, never directly with Wrangler.

Cloud migrations in `drizzle/` are schema-only. Local test data and source-reference downloads are ignored and never deployed. No schema migration is needed for the new learning-step state.
