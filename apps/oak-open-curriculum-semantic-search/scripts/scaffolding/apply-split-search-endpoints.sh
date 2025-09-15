#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

APP_DIR="apps/oak-open-curriculum-semantic-search"

echo "Applying split-search-endpoints patch to: ${APP_DIR}"

write_file () {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "  wrote $path"
}

# 1) env.ts — allow AI_PROVIDER=none and optional OPENAI_API_KEY + helper
write_file "$APP_DIR/src/lib/env.ts" <<'EOF'
import { z } from "zod";

/** Strict runtime env validation (no unsafe process.env). */
const BaseEnvSchema = z.object({
  ELASTICSEARCH_URL: z.string().url(),
  ELASTICSEARCH_API_KEY: z.string().min(10),
  OAK_API_KEY: z.string().min(6).optional(),
  OAK_API_BEARER: z.string().min(6).optional(),
  SEARCH_API_KEY: z.string().min(10),
  AI_PROVIDER: z.enum(["openai", "none"]).default("openai"),
  OPENAI_API_KEY: z.string().min(10).optional()
});

const EnvSchema = BaseEnvSchema.superRefine((v, ctx) => {
  if (!(v.OAK_API_KEY)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Set OAK_API_KEY or OAK_API_BEARER." });
  }
  if (v.AI_PROVIDER === "openai" && (!v.OPENAI_API_KEY || v.OPENAI_API_KEY.length < 10)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "OPENAI_API_KEY is required when AI_PROVIDER=openai." });
  }
});

export type Env = z.infer<typeof EnvSchema>;
let cached: (Env & { OAK_EFFECTIVE_KEY: string }) | null = null;

export function env(): Env & { OAK_EFFECTIVE_KEY: string } {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse({
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
    OAK_API_KEY: process.env.OAK_API_KEY,
    OAK_API_BEARER: process.env.OAK_API_BEARER,
    SEARCH_API_KEY: process.env.SEARCH_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER ?? "openai",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const key = parsed.data.OAK_API_KEY ?? parsed.data.OAK_API_BEARER ?? "";
  cached = Object.assign(parsed.data, { OAK_EFFECTIVE_KEY: key });
  return cached;
}

/** True when natural-language parsing (OpenAI) is available. */
export function llmEnabled(): boolean {
  const e = env();
  return e.AI_PROVIDER === "openai" && typeof e.OPENAI_API_KEY === "string" && e.OPENAI_API_KEY.length > 0;
}
EOF

# 2) NEW: Shared hybrid search core
write_file "$APP_DIR/src/lib/run-hybrid-search.ts" <<'EOF'
import { esSearch, type EsHit } from "@lib/elastic-http";
import type { LessonsIndexDoc, UnitsIndexDoc, UnitRollupDoc, SubjectSlug, KeyStage } from "@types/oak";
import { rrfFuse } from "@lib/rrf";

export type StructuredQuery = {
  scope: "units" | "lessons";
  text: string;
  subject?: SubjectSlug;
  keyStage?: KeyStage;
  minLessons?: number;
  size?: number;
  from?: number;
  highlight?: boolean;
};

export type UnitResult = {
  id: string;
  rankScore: number;
  unit: UnitsIndexDoc | null;
  highlights: string[];
};
export type LessonResult = {
  id: string;
  rankScore: number;
  lesson: LessonsIndexDoc;
  highlights: string[];
};

export type HybridSearchResult =
  | { scope: "units"; results: UnitResult[] }
  | { scope: "lessons"; results: LessonResult[] };

export async function runHybridSearch(q: StructuredQuery): Promise<HybridSearchResult> {
  const size = typeof q.size === "number" ? Math.min(Math.max(q.size, 1), 100) : 25;
  const from = typeof q.from === "number" ? Math.max(q.from, 0) : 0;
  const doHighlight = q.highlight !== false; // default true

  if (q.scope === "lessons") {
    const filters = [
      q.subject ? { term: { "subject_slug": q.subject } } : undefined,
      q.keyStage ? { term: { "key_stage": q.keyStage } } : undefined
    ].filter((x): x is Record<string, unknown> => x !== undefined);

    const [lex, sem] = await Promise.all([
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ multi_match: { query: q.text, fields: ["lesson_title^3", "transcript_text"] } }], filter: filters, minimum_should_match: 1 } },
        highlight: doHighlight ? { fields: { "transcript_text": { fragment_size: 160, number_of_fragments: 2 } } } : undefined,
        sort: from > 0 ? [{ _score: "desc" }] : undefined
      }),
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ semantic: { field: "lesson_semantic", query: q.text } }], filter: filters, minimum_should_match: 1 } },
        sort: from > 0 ? [{ _score: "desc" }] : undefined
      })
    ]);

    const a = lex.hits.hits.map((h) => ({ id: h._id }));
    const b = sem.hits.hits.map((h) => ({ id: h._id }));
    const fused = rrfFuse([a, b]);
    const idToHit = new Map<string, EsHit<LessonsIndexDoc>>();
    for (const h of [...lex.hits.hits, ...sem.hits.hits]) idToHit.set(h._id, h);

    const results: LessonResult[] = Array.from(fused.entries())
      .sort((x, y) => y[1] - x[1])
      .slice(from, from + size)
      .map(([id, rankScore]) => {
        const h = idToHit.get(id)!;
        return { id, rankScore, lesson: h._source, highlights: h.highlight?.transcript_text ?? [] };
      });

    return { scope: "lessons", results };
  }

  // units scope: combine oak_units (lexical) + oak_unit_rollup (semantic + lexical with highlights)
  const filters = [
    q.subject ? { term: { "subject_slug": q.subject } } : undefined,
    q.keyStage ? { term: { "key_stage": q.keyStage } } : undefined,
    typeof q.minLessons === "number" ? { range: { "lesson_count": { gte: q.minLessons } } } : undefined
  ].filter((x): x is Record<string, unknown> => x !== undefined);

  const [lexUnits, semRoll, lexRoll] = await Promise.all([
    esSearch<UnitsIndexDoc>({
      index: "oak_units",
      size,
      query: { bool: { should: [{ multi_match: { query: q.text, fields: ["unit_title^3", "unit_topics"] } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ semantic: { field: "unit_semantic", query: q.text } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ multi_match: { query: q.text, fields: ["unit_title^2", "rollup_text"] } }], filter: filters, minimum_should_match: 1 } },
      highlight: doHighlight ? { fields: { "rollup_text": { fragment_size: 160, number_of_fragments: 2 } } } : undefined
    })
  ]);

  const a = lexUnits.hits.hits.map((h) => ({ id: h._id }));
  const b = semRoll.hits.hits.map((h) => ({ id: h._id }));
  const c = lexRoll.hits.hits.map((h) => ({ id: h._id }));
  const fused = rrfFuse([a, b, c]);

  const unitsMap = new Map<string, EsHit<UnitsIndexDoc>>();
  for (const h of lexUnits.hits.hits) unitsMap.set(h._id, h);

  const rollMap = new Map<string, EsHit<UnitRollupDoc>>();
  for (const h of [...semRoll.hits.hits, ...lexRoll.hits.hits]) rollMap.set(h._id, h);

  const results: UnitResult[] = Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(from, from + size)
    .map(([id, rankScore]) => {
      const u = unitsMap.get(id);
      const r = rollMap.get(id);
      return {
        id, rankScore,
        unit: u ? u._source : (r ? {
          unit_id: r._source.unit_id, unit_slug: r._source.unit_slug, unit_title: r._source.unit_title,
          subject_slug: r._source.subject_slug, key_stage: r._source.key_stage,
          lesson_ids: r._source.lesson_ids, lesson_count: r._source.lesson_count
        } as UnitsIndexDoc : null),
        highlights: r?.highlight?.rollup_text ?? []
      };
    });

  return { scope: "units", results };
}
EOF

# 3) Structured endpoint: overwrite /api/search/route.ts
write_file "$APP_DIR/app/api/search/route.ts" <<'EOF'
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
EOF

# 4) Natural-language endpoint: NEW /api/search/nl/route.ts
write_file "$APP_DIR/app/api/search/nl/route.ts" <<'EOF'
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
EOF

# 5) Docs updates (README, SETUP, ARCHITECTURE)
write_file "$APP_DIR/docs/README.md" <<'EOF'
# Oak Curriculum Hybrid Search — App Workspace

A Next.js workspace that indexes Oak curriculum content and exposes a hybrid (semantic + lexical) search API intended to supersede the basic SDK search.

**Highlights**
- **Serverless Elasticsearch** indices:
  - `oak_lessons` — transcripts + `lesson_semantic`
  - `oak_units` — unit metadata & filters
  - `oak_unit_rollup` — unit-level snippets + `unit_semantic`
- **Hybrid search (BM25 + ELSER)** fused with **RRF**
- **Two search endpoints**
  - **Structured**: `POST /api/search`
  - **Natural language**: `POST /api/search/nl` (LLM parsing; returns 501 if disabled)
- **Transcript & rollup highlights**
- **SDK-first indexing** (no raw HTTP)
- **SDK parity routes** (`/api/sdk/search-*`) for comparison/testing
- **Rollup index** to enable unit-level snippet highlights without duplicating full transcripts per unit

See `ARCHITECTURE.md`, `ROLLUP.md`, `SETUP.md`, and `SDK-ENDPOINTS.md`.

## Quick examples

**Structured units search**
```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{ "scope":"units", "text":"mountains", "subject":"geography", "keyStage":"ks4", "minLessons": 3 }'
```

**Natural language (LLM)**
```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q":"what KS4 geography units with more than two lessons about mountains?" }'
```
EOF

write_file "$APP_DIR/docs/SETUP.md" <<'EOF'
# Setup

## 1) Environment
Create `apps/oak-open-curriculum-semantic-search/.env.local`:
```
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here

# LLM parsing (optional):
AI_PROVIDER=openai         # or 'none' to disable NL endpoint
OPENAI_API_KEY=your_openai_api_key_here
```

## 2) Bootstrap ES (Serverless)
```
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
```

## 3) Index + Rollup
```
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/index-oak
curl -H "x-api-key: $SEARCH_API_KEY" http://localhost:3000/api/rebuild-rollup
```

## 4) Search

**Structured (LLM-free)**
```
POST /api/search
{ "scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3 }
```

**Natural-language (LLM)**
```
POST /api/search/nl
{ "q":"ks4 geography units about mountains with at least 3 lessons" }
```

If LLM is disabled (`AI_PROVIDER=none` or no OPENAI_API_KEY), `/api/search/nl` returns `501` with `{ "error":"LLM_DISABLED" }`.
EOF

write_file "$APP_DIR/docs/ARCHITECTURE.md" <<'EOF'
# Architecture

## Indices
- `oak_lessons`
  - `lesson_title` (text), `subject_slug` (keyword), `key_stage` (keyword)
  - `transcript_text` (text, term vectors, highlightable)
  - `lesson_semantic` (`semantic_text`)
- `oak_units`
  - `unit_title` (text), `subject_slug` (keyword), `key_stage` (keyword)
  - `lesson_ids` (keyword), `lesson_count` (integer), optional `unit_topics`
- `oak_unit_rollup`
  - `unit_title` (text, copy_to `unit_semantic`)
  - `rollup_text` (text, term vectors, copy_to `unit_semantic`)
  - `unit_semantic` (`semantic_text`)

## Endpoints
- **Structured**: `POST /api/search` – requires a structured body.
- **Natural language**: `POST /api/search/nl` – converts `q` into a structured query via LLM (disabled if no OPENAI_API_KEY).
- **Indexer**: `GET /api/index-oak` (admin header `x-api-key`).
- **Rollup**: `GET /api/rebuild-rollup` (admin header `x-api-key`).
- **SDK parity**: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.

## Data flow
- **Indexing:** `/api/index-oak` uses the **SDK** to fetch units, lessons, and transcripts, then bulk indexes to `oak_lessons` and `oak_units`.
- **Rollups:** `/api/rebuild-rollup` reads units + lessons from ES, synthesizes short lesson passages, and indexes `oak_unit_rollup`.
- **Search:** both endpoints call a shared core (`runHybridSearch`) that:
  - **Lessons:** BM25 on (`lesson_title^3`, `transcript_text`) + semantic on `lesson_semantic` → **RRF**, with transcript highlights.
  - **Units:** BM25 on `oak_units` + semantic on `oak_unit_rollup.unit_semantic` + BM25 on `rollup_text` → **RRF**, with rollup highlights.
EOF

echo "Patch applied successfully ✅"
echo
echo "Next steps:"
echo "  1) Ensure env has AI_PROVIDER=openai and OPENAI_API_KEY set (for /api/search/nl), or AI_PROVIDER=none to disable it."
echo "  2) pnpm -C ${APP_DIR} dev"
echo "  3) Try:"
echo "     curl -X POST http://localhost:3000/api/search -H 'content-type: application/json' -d '{\"scope\":\"units\",\"text\":\"mountains\",\"subject\":\"geography\",\"keyStage\":\"ks4\",\"minLessons\":3}'"
echo "     curl -X POST http://localhost:3000/api/search/nl -H 'content-type: application/json' -d '{\"q\":\"ks4 geography units about mountains with at least 3 lessons\"}'"
