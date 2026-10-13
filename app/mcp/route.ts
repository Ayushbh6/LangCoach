import { env } from "cloudflare:workers";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import * as learning from "../../lib/learning/service";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const user = request.headers.get("oai-authenticated-user-id");
  const server = new McpServer({ name: "german-me", version: "2.0.0" });
  const call =
    (fn: (db: D1Database, user: string) => Promise<unknown>) => async () => {
      if (!user || !env.DB)
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: "Authenticated learner identity is required. No private data was read or saved.",
            },
          ],
        };
      try {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(await fn(env.DB, user)),
            },
          ],
        };
      } catch (e) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text:
                e instanceof learning.LearningError
                  ? e.message
                  : "Operation not confirmed. Read the latest brief and retry with the same session/request ID.",
            },
          ],
        };
      }
    };
  server.registerTool(
    "get_learning_brief",
    {
      description:
        "Read the private latest learner record before teaching. Includes version, mission and a summary template.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    call(learning.brief),
  );
  server.registerTool(
    "get_practice_session",
    {
      description:
        "Read the current saved practice and conversation mission. Does not create or advance practice.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    call(async (db, u) => ({
      home: await learning.home(db, u),
      brief: await learning.brief(db, u),
    })),
  );
  server.registerTool(
    "get_progress",
    {
      description:
        "Read separate skill evidence, pending judgments, observations and next targets. Never equate activity with mastery.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    call(learning.progress),
  );
  server.registerTool(
    "save_session_summary",
    {
      description:
        "Save observed conversation evidence with the session ID and version from the brief. Idempotent; stale observations are historical. Report saved only if saved:true. Transcripts cannot prove pronunciation.",
      inputSchema: learning.summarySchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async (args) => call((db, u) => learning.saveSummary(db, u, args))(),
  );
  server.registerTool(
    "publish_lesson",
    {
      description:
        "Publish a validated lesson-bank entry for today using the latest brief version. Preserves active sessions.",
      inputSchema: learning.publishSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async (args) => call((db, u) => learning.publish(db, u, args))(),
  );
  // Discovery is public within the private Site boundary; all data-bearing calls require identity.
  const clone = request.clone();
  let body: unknown;
  try {
    body = await clone.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!user && JSON.stringify(body).includes("tools/call"))
    return Response.json(
      { error: "Authenticated learner identity required." },
      { status: 401 },
    );
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  await server.connect(transport);
  return transport.handleRequest(request);
}
export async function GET() {
  return new Response("Use POST for stateless MCP.", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
