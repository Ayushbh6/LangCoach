import { env } from "cloudflare:workers";
import { prepare, LearningError } from "../../../lib/learning/service";
export const dynamic = "force-dynamic";
// This service endpoint is protected by the OWNER-PRIVATE Sites dispatcher.
// Never make this Site public without replacing this platform access boundary.
// The owner must explicitly bind their account in settings; no caller-selected account is accepted.
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    if (!env.DB) throw Error();
    return Response.json(await prepare(env.DB), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof LearningError
            ? e.message
            : "Preparation failed; existing lessons are preserved.",
      },
      { status: e instanceof LearningError ? e.status : 503 },
    );
  }
}
