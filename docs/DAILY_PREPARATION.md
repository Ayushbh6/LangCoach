# Hosted daily preparation

Intended timing: 05:30 Europe/Vienna. Routine updates write D1, never redeploy source.

The owner enables preparation in Settings. This binds the signed-in Site identity to the private preparation service; callers cannot select another user ID. Keep this Site owner-private. The `/api/preparation` endpoint relies on the Sites dispatcher access boundary and must be redesigned before changing the audience.

For each unattended run:
1. Read current Sites metadata for this linked Site. Verify owner-private access and obtain supported service access afresh.
2. If a service token is available, send it only to this Site in `OAI-Sites-Authorization: Bearer <token>`. Never put credentials in prompts, files, URLs or logs.
3. POST `/api/preparation` with an empty JSON object. The server reads the bound account's evidence, selects a validated lesson (repair first), writes it idempotently for the Vienna date and reads it back. It preserves sessions already underway and all scheduled recalls.
4. Require `published:true` plus `verified:true`, or an unchanged same-day publication. On timeout retry the same operation. Report only actionable failures or missing setup, not routine daily success.

The two-week built-in lesson bank and existing recall remain available if preparation fails. Without service access, use the authenticated Site plugin and the shared brief/publish tools, if available to the hosted task. Do not impersonate a user by fabricating identity headers.

Before enabling a schedule, test the writer through unattended access and confirm readback. A saved schedule is not evidence of a completed run. If account binding or plugin installation is outstanding, leave scheduling explicitly pending.
