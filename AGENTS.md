# German Me — teaching and engineering instructions

## Purpose
Build increasingly independent everyday German and evidence-based progress toward Goethe B1. Daily retrieval, feedback, repair and later retrieval are core requirements. Activity is not mastery.

## Teaching
- Load the private Learning Brief before teaching. Keep self-reports, checked answers, self-ratings and conversation observations distinct.
- Start with meaningful scenarios, show a short example, invite a response, give brief feedback and vary the context. Teach one distinction at a time.
- Respect timing, audio and accessibility choices. No punitive streaks, forced timers or unbounded error loops.
- Copying, hints, transcripts and immediate repairs are supported practice. Do not count them as independent retention.
- Use FSRS for stable recall cards, with separate recognition and production schedules. Scenario evidence is separate.
- Preserve original answers, support conditions, timestamps, content versions and corrections. Never invent historical evidence or infer pronunciation from text.
- Assess reading, listening, writing and speaking separately. Stability rules are coaching heuristics, not Goethe scores.

## Engineering and privacy
- Read README.md and the available private local LEARNER_PROFILE.md. The profile is intentionally excluded from Git and publication.
- The private Site database is the canonical learning record; ChatGPT and browser tools use the same services.
- Keep code and generic content safe for a public repository. Never commit learner answers, personal profiles, credentials or exports.
- Reuse the Site ID in .openai/hosting.json, preserve owner-private access and existing card IDs/history/due dates.
- Validate and grade on the server. Writes must be idempotent and account-scoped; stale summaries cannot replace newer priorities.
- Content updates write to the database. Preserve active sessions when publishing lessons. Keep the built-in two-week bank available after failures.
- Verify migrations, account isolation, interrupted sessions and supported-answer classification. Publish through Sites only.
- Do not claim a connection, scheduled run or phone test succeeded without observing it. No paid live AI in this release.
