import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isKeyStage, isSubject } from "@adapters/sdk-guards";
import type { StructuredQuery } from "@lib/run-hybrid-search";
import { runHybridSearch } from "@lib/run-hybrid-search";

const StructuredSchema = z.object({
  scope: z.enum(["units", "lessons"]),
  text: z.string().min(1),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional(),
  size: z.number().int().min(1).max(100).optional(),
  from: z.number().int().min(0).optional(),
  highlight: z.boolean().optional()
});

export async function POST(req: NextRequest): Promise<Response> {
  const parsed = StructuredSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const b = parsed.data;
  const subject = b.subject && isSubject(b.subject) ? b.subject : undefined;
  const keyStage = b.keyStage && isKeyStage(b.keyStage) ? b.keyStage : undefined;

  const q: StructuredQuery = {
    scope: b.scope,
    text: b.text,
    subject,
    keyStage,
    minLessons: b.minLessons,
    size: b.size,
    from: b.from,
    highlight: b.highlight
  };

  const out = await runHybridSearch(q);
  return NextResponse.json({ results: out.results });
}
