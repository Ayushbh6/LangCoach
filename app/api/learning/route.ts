import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import * as learning from "../../../lib/learning/service";
import { ZodError } from "zod";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json(
      { error: "Sign in to your private learning space." },
      { status: 401, headers },
    );
  try {
    if (!env.DB) throw Error();
    const view = new URL(request.url).searchParams.get("view");
    const value =
      view === "library"
        ? learning.library(new URL(request.url).searchParams.get("q") ?? "")
        : view === "brief"
          ? await learning.brief(env.DB, user.userId)
          : view === "progress"
            ? await learning.progress(env.DB, user.userId)
            : view === "export"
              ? await learning.exportRecord(env.DB, user.userId)
              : await learning.home(env.DB, user.userId);
    return Response.json(value, { headers });
  } catch {
    return Response.json(
      { error: "Your learning record could not be loaded. Please retry." },
      { status: 503, headers },
    );
  }
}
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json(
      { error: "Sign in to save learning." },
      { status: 401, headers },
    );
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "Invalid origin." },
      { status: 403, headers },
    );
  try {
    if (!env.DB) throw Error();
    const body = await request.text();
    if (body.length > 40000)
      return Response.json(
        { error: "Request too large." },
        { status: 413, headers },
      );
    const { action, ...payload } = JSON.parse(body);
    const handlers: Record<
      string,
      (db: D1Database, user: string, raw: unknown) => Promise<unknown>
    > = {
      start: learning.start,
      support: learning.support,
      attempt: learning.attempt,
      settings: learning.saveSettings,
      summary: learning.saveSummary,
      publish: learning.publish,
      flag: learning.flag,
    };
    if (!handlers[action]) throw new learning.LearningError("Unknown action.");
    return Response.json(await handlers[action](env.DB, user.userId, payload), {
      headers,
    });
  } catch (error) {
    const status =
      error instanceof learning.LearningError
        ? error.status
        : error instanceof ZodError || error instanceof SyntaxError
          ? 400
          : 503;
    return Response.json(
      {
        error:
          status === 503
            ? "Save not confirmed. Your answer is kept on this device; retry when connected."
            : error instanceof learning.LearningError
              ? error.message
              : "Please check the submitted fields.",
      },
      { status, headers },
    );
  }
}
