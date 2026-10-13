import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { type Progress } from "../../../lib/scheduler";
export const dynamic = "force-dynamic";
function database() {
  if (!env.DB) throw new Error("Storage unavailable");
  return env.DB;
}
function fromRow(r: Record<string, unknown>): Progress {
  return {
    cardId: String(r.card_id),
    due: Number(r.due),
    interval: Number(r.interval),
    ease: Number(r.ease),
    reps: Number(r.reps),
    lapses: Number(r.lapses),
    state: String(r.state),
    updatedAt: Number(r.updated_at),
  };
}
export async function GET() {
  const user = await getChatGPTUser();
  if (!user)
    return Response.json(
      { error: "Please sign in to save your reviews." },
      { status: 401 },
    );
  try {
    const db = database();
    const [p, r] = await db.batch([
      db.prepare("SELECT * FROM progress WHERE user_id = ?").bind(user.userId),
      db
        .prepare(
          "SELECT card_id, rating, reviewed_at FROM reviews WHERE user_id = ? AND reviewed_at >= ? ORDER BY reviewed_at DESC",
        )
        .bind(user.userId, Date.now() - 366 * 86400000),
    ]);
    return Response.json(
      {
        progress: p.results.map((x) => fromRow(x as Record<string, unknown>)),
        reviews: r.results,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Your reviews could not be loaded. Please try again." },
      { status: 503 },
    );
  }
}
export async function POST() {
  return Response.json(
    {
      error:
        "German Me has been upgraded. Reload to continue with your preserved history and FSRS scheduling.",
    },
    { status: 409 },
  );
}
