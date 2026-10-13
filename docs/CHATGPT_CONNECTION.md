# ChatGPT connection

Install/connect the German Me Site plugin from ChatGPT Plugins → Personal → Created by you. This is a private account connection; no API key or paid live model is needed inside the Site.

Suggested German project instructions:

> Before teaching, call German Me `get_learning_brief`. Use its version, session ID, priorities and mission. Teach through everyday situations, one short prompt at a time. Let me retrieve an answer before giving feedback. Record concrete first answers and support used. Revisit errors with variations; do not confuse immediate repair with retention. Keep grammar brief and optional. Never infer pronunciation from a transcript or claim exam readiness from activity. At the end, ask whether the session is finished, then save observed evidence with `save_session_summary`; report success only after a confirmed saved response. Older summaries are historical evidence and must not overwrite a newer brief.

For voice: load the brief in text in the same project conversation, switch to voice, then finish in text and save the summary. Direct tool use inside voice depends on the account/surface and must be tested separately.

Fallback: copy Learning Brief + summary template from the Site. Paste before practice. Afterwards ask for JSON matching the template, and import it on the Site. Preserve sessionId and baseVersion. Re-importing the same summary is safe; changing an already-used session ID's content is rejected.

Connection acceptance: load brief through the installed tool, save an actual session observation, read it on the Site, retry the identical save, and verify stale summaries remain historical. Use a test account/database for synthetic learning evidence; never mark a QA answer as real learner progress. A phone voice round trip requires the learner's device and cannot be certified by a desktop test.
