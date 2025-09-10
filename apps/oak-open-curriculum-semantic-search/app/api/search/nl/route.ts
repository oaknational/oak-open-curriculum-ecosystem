import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseQuery } from "@lib/query-parser";
import { llmEnabled } from "@lib/env";
import { runHybridSearch, type StructuredQuery } from "@lib/run-hybrid-search";
import { isKeyStage } from "@adapters/sdk-guards";

const BodySchema = z.object({
  q: z.string().min(1),
  scope: z.enum(["units", "lessons"]).optional(),
  size: z.number().int().min(1).max(100).optional()
});

export async function POST(req: NextRequest): Promise<Response> {
  if (!llmEnabled()) {
    return NextResponse.json(
      { error: "LLM_DISABLED", message: "Natural-language parsing is disabled on this deployment. Use /api/search with a structured body." },
      { status: 501 }
    );
  }

  const body = BodySchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const { q, scope, size } = body.data;
  const parsed = await parseQuery(q);

  const structured: StructuredQuery = {
    scope: scope ?? parsed.intent,
    text: parsed.text.length > 0 ? parsed.text : q,
    subject: parsed.subject,
    keyStage: isKeyStage(parsed.keyStage ?? "") ? parsed.keyStage : undefined,
    minLessons: parsed.minLessons,
    size
  };

  const out = await runHybridSearch(structured);
  return NextResponse.json({ derived: structured, results: out.results });
}
