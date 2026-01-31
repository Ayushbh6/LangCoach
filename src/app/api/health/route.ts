import { validateProviderConfig } from "@/lib/config/providers";

export const runtime = "nodejs";

export async function GET() {
  const result = validateProviderConfig();

  if (!result.ok) {
    return Response.json(
      { status: "error", errors: result.errors },
      { status: 500 }
    );
  }

  return Response.json({ status: "ok" });
}
