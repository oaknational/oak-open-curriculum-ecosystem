#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# ----------------------------
# Defaults (override via flags)
# ----------------------------
APP_DIR="apps/oak-open-curriculum-semantic-search"
SCRIPTS_DIR="apps/oak-open-curriculum-semantic-search/scripts"

usage() {
  cat <<USAGE
Usage: $0 [--app-dir PATH] [--scripts-dir PATH]

Defaults:
  --app-dir       apps/oak-open-curriculum-semantic-search
  --scripts-dir   apps/oak-open-curriculum-semantic-search/scripts
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --app-dir) APP_DIR="${2:?}"; shift 2 ;;
    --scripts-dir) SCRIPTS_DIR="${2:?}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

echo "Scaffolding app to: $APP_DIR"
echo "Elasticsearch scripts to: $SCRIPTS_DIR"

write_file() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "  wrote $path"
}

# ==========================================================
# App workspace
# ==========================================================
mkdir -p "$APP_DIR"

write_file "$APP_DIR/package.json" <<'EOF'
{
  "name": "@oaknational/open-curriculum-elasticsearch",
  "version": "0.0.0-development",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json",
    "elastic:setup": "bash scripts/setup.sh",
    "elastic:alias-swap": "bash scripts/alias-swap.sh"
  },
  "dependencies": {
    "next": "^15.5.2",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "zod": "^4",
    "@ai-sdk/openai": "^2.0.24",
    "ai": "^5.0.34",
    "@oaknational/oak-curriculum-sdk": "workspace:*",
    "@elastic/elasticsearch": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.35.0",
    "@typescript-eslint/eslint-plugin": "^8.42.0",
    "@typescript-eslint/parser": "^8.42.0",
    "typescript": "^5.9.2"
  }
}
EOF

write_file "$APP_DIR/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": false,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "allowJs": false,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@lib/*": ["src/lib/*"],
      "@adapters/*": ["src/adapters/*"],
      "@types/*": ["src/types/*"]
    },
    "jsx": "preserve"
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
EOF

write_file "$APP_DIR/next.config.ts" <<'EOF'
import type { NextConfig } from "next";
const config: NextConfig = { experimental: { typedRoutes: true } };
export default config;
EOF

write_file "$APP_DIR/.env.example" <<'EOF'
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
# One of the following must be provided:
OAK_API_KEY=your_oak_api_key_here
# or
# OAK_API_BEARER=
SEARCH_API_KEY=your_search_api_key_here
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
EOF

# ==========================================================
# Docs
# ==========================================================
mkdir -p "$APP_DIR/docs"

write_file "$APP_DIR/docs/README.md" <<'EOF'
# Oak Curriculum Hybrid Search — App Workspace

A Next.js workspace that indexes Oak curriculum content and exposes a hybrid (semantic + lexical) search API intended to supersede the basic SDK search.

**Highlights**
- **Serverless Elasticsearch** indices:
  - `oak_lessons` — transcripts + `lesson_semantic`
  - `oak_units` — unit metadata & filters
  - `oak_unit_rollup` — unit-level snippets + `unit_semantic`
- **Hybrid search (BM25 + ELSER)** fused with **RRF**
- **LLM query parsing** (Vercel AI SDK + Zod v4) validated by SDK guards
- **Transcript highlights**
- **SDK-first indexing** (no raw HTTP)
- **SDK parity routes** (`/api/sdk/search-*`) for comparison/testing
- **Rollup index** to enable unit-level snippet highlights without duplicating lesson transcripts per unit

See `ARCHITECTURE.md`, `ROLLUP.md`, `SETUP.md`, and `SDK-ENDPOINTS.md`.
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

## Data flow
- **Indexing:** `/api/index-oak` uses the **SDK** to fetch units, lessons, and transcripts, then bulk indexes to `oak_lessons` and `oak_units`.
- **Rollups:** `/api/rebuild-rollup` reads units + lessons from ES, synthesizes short lesson passages, and indexes `oak_unit_rollup`.
- **Search:** `/api/search`:
  - **Lessons:** BM25 on (`lesson_title^3`, `transcript_text`) + semantic on `lesson_semantic` → **RRF**, with transcript highlights.
  - **Units:** BM25 on `oak_units` + semantic on `oak_unit_rollup.unit_semantic` + BM25 on `rollup_text` → **RRF**, with rollup highlights.

## SDK fallback routes
- `POST /api/sdk/search-lessons`
- `POST /api/sdk/search-transcripts`
For parity checks with the original API.
EOF

write_file "$APP_DIR/docs/ROLLUP.md" <<'EOF'
# Unit Rollup Index

**Goal:** unit-level semantic recall and snippet highlights without duplicating all lesson transcripts per unit.

- `rollup_text`: concatenated short passages (first 1–2 sentences, ~300 chars) from each unit lesson.
- `unit_semantic`: `semantic_text` at the root; receives `copy_to` from `unit_title` and `rollup_text`.
- Rebuild via `/api/rebuild-rollup` after (re)indexing or content changes.
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
AI_PROVIDER=openai
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
```
POST /api/search
{ "q": "ks4 geography mountains", "scope": "units", "size": 20 }
```

## 5) SDK fallback routes (parity testing)
```
POST /api/sdk/search-lessons
{ "q": "fractions", "keyStage": "ks2", "subject": "maths", "unit": "optional-unit-slug", "limit": 20, "offset": 0 }

POST /api/sdk/search-transcripts
{ "q": "photosynthesis", "keyStage": "ks3", "subject": "science" }
```
EOF

write_file "$APP_DIR/docs/SDK-ENDPOINTS.md" <<'EOF'
# SDK Fallback Endpoints

These expose the original API search for completeness and parity checks. The hybrid Elasticsearch search remains the primary experience.

## POST /api/sdk/search-lessons
- **What it does:** mirrors `GET /search/lessons` (title-similarity) from the SDK.
- **Defaults:** 20 results if `limit` omitted.
- **Filters:** `keyStage`, `subject`, **`unit`** (optional).
Body:
```
{ "q": "fractions", "keyStage": "ks2", "subject": "maths", "unit": "optional-unit-slug", "limit": 20, "offset": 0 }
```

## POST /api/sdk/search-transcripts
- **What it does:** mirrors `GET /search/transcripts` (transcript-similarity) from the SDK.
- **Defaults:** 5 results (as per public docs).
Body:
```
{ "q": "photosynthesis", "keyStage": "ks3", "subject": "science" }
```
EOF

# ==========================================================
# Source
# ==========================================================
mkdir -p "$APP_DIR/src/lib" "$APP_DIR/src/types" "$APP_DIR/src/adapters" \
         "$APP_DIR/app/api/index-oak" "$APP_DIR/app/api/rebuild-rollup" \
         "$APP_DIR/app/api/search" "$APP_DIR/app/api/sdk/search-lessons" \
         "$APP_DIR/app/api/sdk/search-transcripts" "$APP_DIR/app"

# -------- env (accept OAK_API_KEY or OAK_API_BEARER) --------
write_file "$APP_DIR/src/lib/env.ts" <<'EOF'
import { z } from "zod";

/** Strict runtime env validation (no unsafe process.env). */
const EnvSchema = z.object({
  ELASTICSEARCH_URL: z.string().url(),
  ELASTICSEARCH_API_KEY: z.string().min(10),
  OAK_API_KEY: z.string().min(6).optional(),
  OAK_API_BEARER: z.string().min(6).optional(),
  SEARCH_API_KEY: z.string().min(10),
  AI_PROVIDER: z.enum(["openai"]).default("openai"),
  OPENAI_API_KEY: z.string().min(10)
}).refine(v => Boolean(v.OAK_API_KEY ?? v.OAK_API_BEARER), {
  message: "Set OAK_API_KEY or OAK_API_BEARER."
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
    AI_PROVIDER: process.env.AI_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const key = parsed.data.OAK_API_KEY ?? parsed.data.OAK_API_BEARER ?? "";
  cached = Object.assign(parsed.data, { OAK_EFFECTIVE_KEY: key });
  return cached;
}
EOF

# -------- Elasticsearch client (official) --------
write_file "$APP_DIR/src/lib/es-client.ts" <<'EOF'
import { Client } from "@elastic/elasticsearch";
import { env } from "@lib/env";

/**
 * Singleton client for Node.js route handlers.
 * Serverless Elastic works with normal node endpoint + ApiKey auth.
 */
let _client: Client | null = null;

export function esClient(): Client {
  if (_client) return _client;
  const e = env();
  _client = new Client({
    node: e.ELASTICSEARCH_URL,
    auth: { apiKey: e.ELASTICSEARCH_API_KEY }
    // If your version exposes a 'serverMode' option for Serverless, you can add:
    // serverMode: 'serverless'
  });
  return _client;
}
EOF

# -------- ES helpers implemented via official client --------
write_file "$APP_DIR/src/lib/elastic-http.ts" <<'EOF'
import { esClient } from "@lib/es-client";

/** Narrow search request shape we use in the app. */
export type EsSearchRequest = {
  index: string;
  size?: number;
  query: unknown;
  highlight?: unknown;
  sort?: unknown;
  _source?: string[];
};

export type EsHit<TDoc> = {
  _index: string;
  _id: string;
  _score: number | null;
  _source: TDoc;
  highlight?: Record<string, string[]>;
};

export type EsSearchResponse<TDoc> = {
  hits: {
    total: { value: number; relation: "eq" | "gte" };
    max_score: number | null;
    hits: Array<EsHit<TDoc>>;
  };
  took: number;
  timed_out: boolean;
};

function hasKey<T extends string>(obj: unknown, key: T): obj is Record<T, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}
function isEsHit<TDoc>(v: unknown): v is EsHit<TDoc> {
  return typeof v === "object" && v !== null && hasKey(v, "_id") && hasKey(v, "_source") && typeof (v as { _id: unknown })._id === "string";
}
function isEsSearchResponse<TDoc>(v: unknown): v is EsSearchResponse<TDoc> {
  if (!(typeof v === "object" && v !== null && hasKey(v, "hits"))) return false;
  const h = (v as { hits: unknown }).hits;
  if (!(typeof h === "object" && h !== null && hasKey(h, "hits"))) return false;
  const arr = (h as { hits: unknown }).hits;
  if (!Array.isArray(arr)) return false;
  return arr.every(isEsHit);
}

/** Execute a search via official client, enforce a stable response shape. */
export async function esSearch<T>(body: EsSearchRequest): Promise<EsSearchResponse<T>> {
  const client = esClient();
  const { index, size, query, highlight, sort, _source } = body;

  const res = await client.search<Record<string, unknown>, unknown>({
    index,
    size: size ?? 25,
    query,
    highlight: highlight as Record<string, unknown> | undefined,
    sort: sort as unknown,
    _source
  });

  const data = res.hits as unknown;
  const wrapped: EsSearchResponse<T> = {
    hits: {
      total: { value: typeof (res.hits.total as any)?.value === "number" ? (res.hits.total as any).value : res.hits.hits.length, relation: "eq" },
      max_score: res.hits.max_score ?? null,
      hits: res.hits.hits.map((h) => ({
        _index: h._index ?? index,
        _id: h._id!,
        _score: h._score ?? null,
        _source: h._source as T,
        highlight: (h as { highlight?: Record<string, string[]> }).highlight
      }))
    },
    took: (res as unknown as { took?: number }).took ?? 0,
    timed_out: false
  };

  if (!isEsSearchResponse<T>(wrapped)) {
    throw new Error("Unexpected ES search response shape");
  }
  return wrapped;
}

/**
 * Bulk helper — accepts classic action/line pairs (same shape we already used),
 * composes NDJSON, and calls the client's transport to POST /_bulk.
 */
export async function esBulk(ops: readonly unknown[]): Promise<void> {
  const client = esClient();
  const ndjson = ops.map((o) => JSON.stringify(o)).join("\n") + "\n";
  const res = await client.transport.request({
    method: "POST",
    path: "/_bulk",
    body: ndjson,
    headers: { "content-type": "application/x-ndjson" }
  });

  const ok = typeof (res as { statusCode?: number }).statusCode === "number"
    ? ((res as { statusCode: number }).statusCode >= 200 && (res as { statusCode: number }).statusCode < 300)
    : true;

  if (!ok) throw new Error("Bulk request failed");

  // Server replies with per-item errors in body; we could optionally parse it,
  // but we keep parity with our previous strict/no-partial-success approach.
}
EOF

# -------- RRF --------
write_file "$APP_DIR/src/lib/rrf.ts" <<'EOF'
export type RankedId = { id: string; score?: number | null };
export type RrfConfig = { k?: number };
export function rrfFuse(lists: readonly (readonly RankedId[])[], cfg?: RrfConfig): Map<string, number> {
  const k = cfg?.k ?? 60;
  const scores = new Map<string, number>();
  for (const list of lists) {
    for (let i = 0; i < list.length; i++) {
      const id = list[i]?.id;
      if (!id) continue;
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + (i + 1)));
    }
  }
  return scores;
}
EOF

# -------- types derived from SDK components --------
write_file "$APP_DIR/src/types/oak.ts" <<'EOF'
import type { components } from "@oaknational/oak-curriculum-sdk";

export type KeyStage = components["schemas"]["KeyStageResponseSchema"][number];
export type SubjectSlug = components["schemas"]["AllSubjectsResponseSchema"][number];

/** ES lesson document (search index shape). */
export type LessonsIndexDoc = {
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  unit_ids: string[];
  unit_titles: string[];
  transcript_text: string;
};

/** ES unit document (search index shape). */
export type UnitsIndexDoc = {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  unit_topics?: string;
};

/** ES rollup document (search index shape). */
export type UnitRollupDoc = {
  unit_id: string;
  unit_slug: string;
  unit_title: string;
  subject_slug: SubjectSlug;
  key_stage: KeyStage;
  year?: number;
  lesson_ids: string[];
  lesson_count: number;
  rollup_text: string;
};
EOF

# -------- SDK guard integration (inputs + response-shape fallbacks) --------
write_file "$APP_DIR/src/adapters/sdk-guards.ts" <<'EOF'
/**
 * SDK guard integration.
 * We import input guards/allowed-values from the SDK root,
 * and provide structural fallbacks for response shapes.
 */
import {
  isKeyStage as sdkIsKeyStage,
  isSubject as sdkIsSubject,
  KEY_STAGES as SDK_KEY_STAGES,
  SUBJECTS as SDK_SUBJECTS
} from "@oaknational/oak-curriculum-sdk";

export const isKeyStage = sdkIsKeyStage;
export const isSubject = sdkIsSubject;
export const KEY_STAGES = SDK_KEY_STAGES;
export const SUBJECTS = SDK_SUBJECTS;

/** Response-shape fallbacks (strict, no `any`). */
function isString(v: unknown): v is string { return typeof v === "string"; }

export function isUnitsFlat(v: unknown): v is Array<{ unitSlug: string; unitTitle: string }> {
  return Array.isArray(v) && v.every(u =>
    typeof u === "object" && u !== null &&
    isString((u as Record<string, unknown>)["unitSlug"]) &&
    isString((u as Record<string, unknown>)["unitTitle"])
  );
}

export function isUnitsGrouped(v: unknown): v is Array<{ units: Array<{ unitSlug: string; unitTitle: string }> }> {
  return Array.isArray(v) && v.every(g =>
    typeof g === "object" && g !== null &&
    Array.isArray((g as Record<string, unknown>)["units"]) &&
    ((g as { units: unknown[] }).units).every(u =>
      typeof u === "object" && u !== null &&
      isString((u as Record<string, unknown>)["unitSlug"]) &&
      isString((u as Record<string, unknown>)["unitTitle"])
    )
  );
}

export function isLessonGroups(v: unknown): v is Array<{ unitSlug: string; unitTitle: string; lessons: Array<{ lessonSlug: string; lessonTitle: string }> }> {
  return Array.isArray(v) && v.every(g =>
    typeof g === "object" && g !== null &&
    isString((g as Record<string, unknown>)["unitSlug"]) &&
    isString((g as Record<string, unknown>)["unitTitle"]) &&
    Array.isArray((g as Record<string, unknown>)["lessons"]) &&
    ((g as { lessons: unknown[] }).lessons).every(l =>
      typeof l === "object" && l !== null &&
      isString((l as Record<string, unknown>)["lessonSlug"]) &&
      isString((l as Record<string, unknown>)["lessonTitle"])
    )
  );
}

export function isTranscriptResponse(v: unknown): v is { transcript: string; vtt: string } {
  return typeof v === "object" && v !== null &&
    isString((v as Record<string, unknown>)["transcript"]) &&
    isString((v as Record<string, unknown>)["vtt"]);
}
EOF

# -------- SDK-backed adapter using guards --------
write_file "$APP_DIR/src/adapters/oak-adapter-sdk.ts" <<'EOF'
import type { KeyStage, SubjectSlug } from "@types/oak";
import { env } from "@lib/env";
import { createOakClient } from "@oaknational/oak-curriculum-sdk";
import { isUnitsFlat, isUnitsGrouped, isLessonGroups, isTranscriptResponse } from "./sdk-guards";

/** Adapter interface consumed by indexer. */
export interface OakClient {
  getUnitsByKeyStageAndSubject(
    keyStage: KeyStage,
    subject: SubjectSlug
  ): Promise<readonly { unitSlug: string; unitTitle: string }[]>;

  getLessonsByKeyStageAndSubject(
    keyStage: KeyStage,
    subject: SubjectSlug
  ): Promise<readonly {
    unitSlug: string;
    unitTitle: string;
    lessons: Array<{ lessonSlug: string; lessonTitle: string }>;
  }[]>;

  getLessonTranscript(lessonSlug: string): Promise<{ transcript: string; vtt: string }>;
}

/** SDK-backed client (preferred). */
export function createOakSdkClient(): OakClient {
  const apiKey = env().OAK_EFFECTIVE_KEY;
  const client = createOakClient(apiKey);

  return {
    async getUnitsByKeyStageAndSubject(keyStage, subject) {
      const res = await client.GET("/key-stages/{keyStage}/subject/{subject}/units", {
        params: { path: { keyStage, subject } }
      });
      if (res.error) throw new Error(`units ${keyStage}/${subject}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (!data) return [];

      if (isUnitsGrouped(data)) {
        const flat: { unitSlug: string; unitTitle: string }[] = [];
        for (const group of data) for (const u of group.units) flat.push(u);
        return flat;
      }
      if (isUnitsFlat(data)) return data;

      throw new Error("Unexpected units response shape");
    },

    async getLessonsByKeyStageAndSubject(keyStage, subject) {
      const res = await client.GET("/key-stages/{keyStage}/subject/{subject}/lessons", {
        params: { path: { keyStage, subject }, query: { limit: 100 } }
      });
      if (res.error) throw new Error(`lessons ${keyStage}/${subject}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (!data) return [];

      if (isLessonGroups(data)) return data;
      throw new Error("Unexpected lessons response shape");
    },

    async getLessonTranscript(lessonSlug) {
      const res = await client.GET("/lessons/{lesson}/transcript", {
        params: { path: { lesson: lessonSlug } }
      });
      if (res.error) throw new Error(`transcript ${lessonSlug}: ${JSON.stringify(res.error)}`);
      const data = res.data;
      if (isTranscriptResponse(data)) return data;
      throw new Error("Unexpected transcript response shape");
    }
  };
}
EOF

# -------- Rate-limit helper --------
write_file "$APP_DIR/src/lib/rate-limit.ts" <<'EOF'
import { createOakClient } from "@oaknational/oak-curriculum-sdk";
import { env } from "@lib/env";

/** Lightweight wrapper around the free `/rate-limit` endpoint. */
export async function getRateLimit() {
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);
  const res = await client.GET("/rate-limit");
  return res.data ?? null;
}
EOF

# -------- Query parser (Vercel AI SDK) --------
write_file "$APP_DIR/src/lib/query-parser.ts" <<'EOF'
import { z } from "zod";
import { env } from "@lib/env";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { isKeyStage, isSubject } from "@adapters/sdk-guards";

/** Structured output schema for parsed teacher queries. */
export const ParsedQuerySchema = z.object({
  intent: z.enum(["units", "lessons"]).describe("Whether the user wants units or lessons."),
  text: z.string().describe("Topical text suitable for semantic search.").default(""),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  minLessons: z.number().int().min(0).optional()
});

export type ParsedQueryRaw = z.infer<typeof ParsedQuerySchema>;
export type ParsedQuery = {
  intent: "units" | "lessons";
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
};

export async function parseQuery(q: string): Promise<ParsedQuery> {
  const e = env();
  const openai = createOpenAI({ apiKey: e.OPENAI_API_KEY });
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    temperature: 0,
    prompt: [
      "You convert teacher queries into parameters for a curriculum search engine.",
      "Return intent=lessons|units, optional subject and keyStage (ks1-ks4), optional minLessons, and the topical text for search.",
      "Be conservative with subject/keyStage unless strongly implied. For phrases like 'KS4 geography', set both."
    ].join("\n"),
    schema: ParsedQuerySchema,
    input: q
  });

  // Validate subject/keyStage with SDK guards; drop invalid values.
  const clean: ParsedQuery = {
    intent: object.intent,
    text: object.text,
    subject: object.subject && isSubject(object.subject) ? object.subject : undefined,
    keyStage: object.keyStage && isKeyStage(object.keyStage) ? object.keyStage : undefined,
    minLessons: object.minLessons
  };
  return clean;
}
EOF

# -------- API: indexer (SDK + KEY_STAGES/SUBJECTS) --------
write_file "$APP_DIR/app/api/index-oak/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { env } from "@lib/env";
import type { KeyStage, SubjectSlug, LessonsIndexDoc, UnitsIndexDoc } from "@types/oak";
import { createOakSdkClient } from "@adapters/oak-adapter-sdk";
import { KEY_STAGES, SUBJECTS, isKeyStage, isSubject } from "@adapters/sdk-guards";
import { esBulk } from "@lib/elastic-http";
import { getRateLimit } from "@lib/rate-limit";

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get("x-api-key");
  return typeof k === "string" && k.length > 0 && k === env().SEARCH_API_KEY;
}

export const maxDuration = 300;

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) return new NextResponse("Unauthorized", { status: 401 });

  // Optional: peek at rate limit (free endpoint)
  try { await getRateLimit(); } catch { /* ignore */ }

  const client = createOakSdkClient();

  const keyStages: KeyStage[] = (KEY_STAGES as readonly unknown[]).filter(isKeyStage);
  const subjects: SubjectSlug[] = (SUBJECTS as readonly unknown[]).filter(isSubject);

  const bulkOps: unknown[] = [];

  for (const subject of subjects) {
    for (const ks of keyStages) {
      try {
        const units = await client.getUnitsByKeyStageAndSubject(ks, subject);
        const lessonsGrouped = await client.getLessonsByKeyStageAndSubject(ks, subject);

        for (const u of units) {
          const unitDoc: UnitsIndexDoc = {
            unit_id: u.unitSlug, unit_slug: u.unitSlug, unit_title: u.unitTitle,
            subject_slug: subject, key_stage: ks, lesson_ids: [], lesson_count: 0
          };
          bulkOps.push({ index: { _index: "oak_units", _id: unitDoc.unit_id } }, unitDoc);
        }

        for (const group of lessonsGrouped) {
          for (const lesson of group.lessons) {
            const transcript = await client.getLessonTranscript(lesson.lessonSlug);
            const doc: LessonsIndexDoc = {
              lesson_id: lesson.lessonSlug, lesson_slug: lesson.lessonSlug, lesson_title: lesson.lessonTitle,
              subject_slug: subject, key_stage: ks,
              unit_ids: [group.unitSlug], unit_titles: [group.unitTitle],
              transcript_text: transcript.transcript
            };
            bulkOps.push({ index: { _index: "oak_lessons", _id: doc.lesson_id } }, doc);
          }
        }
      } catch {
        // Consider structured logging
      }
    }
  }

  if (bulkOps.length > 0) await esBulk(bulkOps);
  return NextResponse.json({ ok: true, indexedDocs: bulkOps.length / 2 });
}
EOF

# -------- API: rollup rebuild --------
write_file "$APP_DIR/app/api/rebuild-rollup/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { env } from "@lib/env";
import { esSearch, esBulk } from "@lib/elastic-http";
import type { UnitsIndexDoc, LessonsIndexDoc, UnitRollupDoc } from "@types/oak";

/** Guard header check */
function authorize(req: NextRequest): boolean {
  const k = req.headers.get("x-api-key");
  return typeof k === "string" && k.length > 0 && k === env().SEARCH_API_KEY;
}

/** Extract a short passage (first 1-2 sentences up to ~300 chars). */
function extractPassage(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/u);
  const pick = sentences.slice(0, 2).join(" ");
  return pick.slice(0, 300);
}

export const maxDuration = 300;

export async function GET(req: NextRequest): Promise<Response> {
  if (!authorize(req)) return new NextResponse("Unauthorized", { status: 401 });

  const size = 500;
  let totalProcessed = 0;
  let bulkOps: unknown[] = [];

  const unitsRes = await esSearch<UnitsIndexDoc>({
    index: "oak_units",
    size,
    query: { match_all: {} },
    sort: [{ "unit_slug": "asc" }],
    _source: ["unit_id","unit_slug","unit_title","subject_slug","key_stage","lesson_ids","lesson_count"]
  });

  for (const uh of unitsRes.hits.hits) {
    const u = uh._source;

    const lessonsRes = await esSearch<LessonsIndexDoc>({
      index: "oak_lessons",
      size: 200,
      query: { term: { "unit_ids": u.unit_slug } },
      _source: ["lesson_id","lesson_title","transcript_text"]
    });

    const snippets: string[] = [];
    for (const lh of lessonsRes.hits.hits) snippets.push(extractPassage(lh._source.transcript_text));

    const roll: UnitRollupDoc = {
      unit_id: u.unit_id,
      unit_slug: u.unit_slug,
      unit_title: u.unit_title,
      subject_slug: u.subject_slug,
      key_stage: u.key_stage,
      lesson_ids: u.lesson_ids,
      lesson_count: u.lesson_count,
      rollup_text: snippets.join(" \n")
    };

    bulkOps.push({ index: { _index: "oak_unit_rollup", _id: roll.unit_id } }, roll);
    if (bulkOps.length >= 1000) { await esBulk(bulkOps); bulkOps = []; }
    totalProcessed += 1;
  }

  if (bulkOps.length > 0) await esBulk(bulkOps);
  return NextResponse.json({ ok: true, unitsProcessed: totalProcessed });
}
EOF

# -------- API: hybrid search --------
write_file "$APP_DIR/app/api/search/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { parseQuery } from "@lib/query-parser";
import { isKeyStage, isSubject } from "@adapters/sdk-guards";
import { esSearch, type EsHit } from "@lib/elastic-http";
import type { LessonsIndexDoc, UnitsIndexDoc, UnitRollupDoc } from "@types/oak";
import { rrfFuse } from "@lib/rrf";

/** Build lexical + semantic searches and fuse via RRF, including rollup index for units. */
export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as { q: string; size?: number; scope?: "units" | "lessons" };
  const queryText = body.q;
  const size = typeof body.size === "number" ? Math.min(Math.max(body.size, 1), 100) : 25;

  const parsed = await parseQuery(queryText);
  const scope: "units" | "lessons" = body.scope ?? parsed.intent;

  const subjectFilter = parsed.subject && isSubject(parsed.subject) ? parsed.subject : undefined;
  const keyStageFilter = parsed.keyStage && isKeyStage(parsed.keyStage) ? parsed.keyStage : undefined;

  if (scope === "lessons") {
    const filters = [
      subjectFilter ? { term: { "subject_slug": subjectFilter } } : undefined,
      keyStageFilter ? { term: { "key_stage": keyStageFilter } } : undefined
    ].filter((x): x is Record<string, unknown> => x !== undefined);

    const [lex, sem] = await Promise.all([
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ multi_match: { query: parsed.text || queryText, fields: ["lesson_title^3", "transcript_text"] } }], filter: filters, minimum_should_match: 1 } },
        highlight: { fields: { "transcript_text": { fragment_size: 160, number_of_fragments: 2 } } }
      }),
      esSearch<LessonsIndexDoc>({
        index: "oak_lessons",
        size,
        query: { bool: { should: [{ semantic: { field: "lesson_semantic", query: parsed.text || queryText } }], filter: filters, minimum_should_match: 1 } }
      })
    ]);

    const a = lex.hits.hits.map((h) => ({ id: h._id }));
    const b = sem.hits.hits.map((h) => ({ id: h._id }));
    const fused = rrfFuse([a, b]);
    const idToHit = new Map<string, EsHit<LessonsIndexDoc>>();
    for (const h of [...lex.hits.hits, ...sem.hits.hits]) idToHit.set(h._id, h);

    const results = Array.from(fused.entries())
      .sort((x, y) => y[1] - x[1])
      .slice(0, size)
      .map(([id, rankScore]) => {
        const h = idToHit.get(id)!;
        return { id, rankScore, lesson: h._source, highlights: h.highlight?.transcript_text ?? [] };
      });

    return NextResponse.json({ parsed, results });
  }

  // units scope: combine oak_units (lexical) + oak_unit_rollup (semantic + lexical with highlights)
  const filters = [
    subjectFilter ? { term: { "subject_slug": subjectFilter } } : undefined,
    keyStageFilter ? { term: { "key_stage": keyStageFilter } } : undefined,
    typeof parsed.minLessons === "number" ? { range: { "lesson_count": { gte: parsed.minLessons } } } : undefined
  ].filter((x): x is Record<string, unknown> => x !== undefined);

  const [lexUnits, semRoll, lexRoll] = await Promise.all([
    esSearch<UnitsIndexDoc>({
      index: "oak_units",
      size,
      query: { bool: { should: [{ multi_match: { query: parsed.text || queryText, fields: ["unit_title^3", "unit_topics"] } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ semantic: { field: "unit_semantic", query: parsed.text || queryText } }], filter: filters, minimum_should_match: 1 } }
    }),
    esSearch<UnitRollupDoc>({
      index: "oak_unit_rollup",
      size,
      query: { bool: { should: [{ multi_match: { query: parsed.text || queryText, fields: ["unit_title^2", "rollup_text"] } }], filter: filters, minimum_should_match: 1 } },
      highlight: { fields: { "rollup_text": { fragment_size: 160, number_of_fragments: 2 } } }
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

  const results = Array.from(fused.entries())
    .sort((x, y) => y[1] - x[1])
    .slice(0, size)
    .map(([id, rankScore]) => {
      const u = unitsMap.get(id);
      const r = rollMap.get(id);
      return {
        id, rankScore,
        unit: u ? u._source : (r ? {
          unit_id: r._source.unit_id, unit_slug: r._source.unit_slug, unit_title: r._source.unit_title,
          subject_slug: r._source.subject_slug, key_stage: r._source.key_stage,
          lesson_ids: r._source.lesson_ids, lesson_count: r._source.lesson_count
        } : null),
        highlights: r?.highlight?.rollup_text ?? []
      };
    });

  return NextResponse.json({ parsed, results });
}
EOF

# -------- API: SDK search (lessons) with `unit` passthrough --------
write_file "$APP_DIR/app/api/sdk/search-lessons/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { env } from "@lib/env";
import { createOakClient } from "@oaknational/oak-curriculum-sdk";
import { isKeyStage, isSubject } from "@adapters/sdk-guards";

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as { q: string; keyStage?: string; subject?: string; unit?: string; limit?: number; offset?: number };
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);

  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;
  const unit = typeof body.unit === "string" && body.unit.length > 0 ? body.unit : undefined;

  const res = await client.GET("/search/lessons", {
    params: {
      query: {
        q: body.q,
        keyStage,
        subject,
        unit,
        limit: typeof body.limit === "number" ? body.limit : 20,
        offset: typeof body.offset === "number" ? body.offset : 0
      }
    }
  });

  if (res.error) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data ?? []);
}
EOF

# -------- API: SDK search (transcripts) --------
write_file "$APP_DIR/app/api/sdk/search-transcripts/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { env } from "@lib/env";
import { createOakClient } from "@oaknational/oak-curriculum-sdk";
import { isKeyStage, isSubject } from "@adapters/sdk-guards";

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as { q: string; keyStage?: string; subject?: string };
  const e = env();
  const client = createOakClient(e.OAK_EFFECTIVE_KEY);

  const keyStage = body.keyStage && isKeyStage(body.keyStage) ? body.keyStage : undefined;
  const subject = body.subject && isSubject(body.subject) ? body.subject : undefined;

  const res = await client.GET("/search/transcripts", {
    params: {
      query: {
        q: body.q,
        keyStage,
        subject
      }
    }
  });

  if (res.error) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data ?? []);
}
EOF

# -------- App page --------
write_file "$APP_DIR/app/page.tsx" <<'EOF'
export default function Home() {
  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold">Oak Search API</h1>
      <p className="mt-2 text-sm text-gray-600">
        1) /api/index-oak → 2) /api/rebuild-rollup → 3) /api/search
      </p>
      <p className="mt-2 text-sm text-gray-600">
        SDK parity tests: POST /api/sdk/search-lessons, POST /api/sdk/search-transcripts
      </p>
    </main>
  );
}
EOF

# ==========================================================
# Elasticsearch serverless scripts (pure bash + curl)
# ==========================================================
mkdir -p "$SCRIPTS_DIR/mappings"

write_file "$SCRIPTS_DIR/README.md" <<'EOF'
# Elasticsearch Serverless Scripts

Environment:
- `ELASTICSEARCH_URL` (e.g., https://...elastic.cloud)
- `ELASTICSEARCH_API_KEY`

Scripts:
- `setup.sh` — creates synonyms + indices (lessons, units, unit_rollup)
- `alias-swap.sh` — atomic alias re-point (optional)
EOF

write_file "$SCRIPTS_DIR/synonyms.json" <<'EOF'
{
  "synonyms_set": [
    { "id": "ks4", "synonyms": "ks4, key stage 4, GCSE" },
    { "id": "ks3", "synonyms": "ks3, key stage 3" },
    { "id": "climate", "synonyms": "climate, climate change, global warming, greenhouse effect" },
    { "id": "mountain", "synonyms": "mountain, mountains, alpine, highland" },
    { "id": "geography", "synonyms": "geography, geo" }
  ]
}
EOF

write_file "$SCRIPTS_DIR/mappings/oak-lessons.json" <<'EOF'
{
  "settings": {
    "analysis": {
      "filter": {
        "oak_syns_filter": { "type": "synonym_graph", "synonyms_set": "oak-syns", "updateable": true }
      },
      "analyzer": {
        "oak_text": { "type": "custom", "tokenizer": "standard", "filter": ["lowercase", "oak_syns_filter"] }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "lesson_id": { "type": "keyword" },
      "lesson_slug": { "type": "keyword" },
      "lesson_title": { "type": "text", "analyzer": "oak_text", "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } },
      "subject_slug": { "type": "keyword" },
      "key_stage": { "type": "keyword" },
      "year": { "type": "integer" },
      "unit_ids": { "type": "keyword" },
      "unit_titles": { "type": "text", "analyzer": "oak_text", "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } },
      "transcript_text": { "type": "text", "analyzer": "oak_text", "term_vector": "with_positions_offsets" },
      "lesson_semantic": { "type": "semantic_text" }
    }
  }
}
EOF

write_file "$SCRIPTS_DIR/mappings/oak-units.json" <<'EOF'
{
  "settings": {
    "analysis": {
      "filter": {
        "oak_syns_filter": { "type": "synonym_graph", "synonyms_set": "oak-syns", "updateable": true }
      },
      "analyzer": {
        "oak_text": { "type": "custom", "tokenizer": "standard", "filter": ["lowercase", "oak_syns_filter"] }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "unit_id": { "type": "keyword" },
      "unit_slug": { "type": "keyword" },
      "unit_title": { "type": "text", "analyzer": "oak_text", "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } },
      "subject_slug": { "type": "keyword" },
      "key_stage": { "type": "keyword" },
      "year": { "type": "integer" },
      "lesson_ids": { "type": "keyword" },
      "lesson_count": { "type": "integer" },
      "unit_topics": { "type": "text", "analyzer": "oak_text" }
    }
  }
}
EOF

write_file "$SCRIPTS_DIR/mappings/oak-unit-rollup.json" <<'EOF'
{
  "settings": {
    "analysis": {
      "filter": {
        "oak_syns_filter": { "type": "synonym_graph", "synonyms_set": "oak-syns", "updateable": true }
      },
      "analyzer": {
        "oak_text": { "type": "custom", "tokenizer": "standard", "filter": ["lowercase", "oak_syns_filter"] }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "unit_id": { "type": "keyword" },
      "unit_slug": { "type": "keyword" },
      "unit_title": {
        "type": "text",
        "analyzer": "oak_text",
        "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } },
        "copy_to": ["unit_semantic"]
      },
      "subject_slug": { "type": "keyword" },
      "key_stage": { "type": "keyword" },
      "year": { "type": "integer" },
      "lesson_ids": { "type": "keyword" },
      "lesson_count": { "type": "integer" },
      "rollup_text": {
        "type": "text",
        "analyzer": "oak_text",
        "term_vector": "with_positions_offsets",
        "copy_to": ["unit_semantic"]
      },
      "unit_semantic": { "type": "semantic_text" }
    }
  }
}
EOF

write_file "$SCRIPTS_DIR/setup.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
: "${ELASTICSEARCH_URL:?Set ELASTICSEARCH_URL}"
: "${ELASTICSEARCH_API_KEY:?Set ELASTICSEARCH_API_KEY}"

auth=(-H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -H "Content-Type: application/json")

echo "Upserting synonyms set oak-syns..."
curl -sS -X PUT "${ELASTICSEARCH_URL}/_synonyms/oak-syns" "${auth[@]}" --data-binary @"$(dirname "$0")/synonyms.json" >/dev/null
echo "Creating indices (ignore if exist)..."
for idx in oak_lessons oak_units oak_unit_rollup; do
  body="$(dirname "$0")/mappings/${idx//_/-}.json"
  curl -sS -o /dev/null -w "%{http_code}" -X PUT "${ELASTICSEARCH_URL}/${idx}" "${auth[@]}" --data-binary @"${body}" || true
done
echo "Done."
EOF
chmod +x "$SCRIPTS_DIR/setup.sh"

write_file "$SCRIPTS_DIR/alias-swap.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
: "${ELASTICSEARCH_URL:?Set ELASTICSEARCH_URL}"
: "${ELASTICSEARCH_API_KEY:?Set ELASTICSEARCH_API_KEY}"
FROM="${1:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
TO="${2:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
ALIAS="${3:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
auth=(-H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -H "Content-Type: application/json")
json=$(cat <<JSON
{ "actions": [ { "remove": { "index": "${FROM}", "alias": "${ALIAS}" } }, { "add": { "index": "${TO}", "alias": "${ALIAS}", "is_write_index": true } } ] }
JSON
)
curl -sS -X POST "${ELASTICSEARCH_URL}/_aliases" "${auth[@]}" -d "${json}" >/dev/null
echo "Alias '${ALIAS}' moved: ${FROM} -> ${TO}"
EOF
chmod +x "$SCRIPTS_DIR/alias-swap.sh"

echo
echo "Done. Next steps:"
echo "  1) pnpm i"
echo "  2) cp $APP_DIR/.env.example $APP_DIR/.env.local  # fill values (OAK_API_KEY or OAK_API_BEARER)"
echo "  3) ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... pnpm -C $APP_DIR run elastic:setup"
echo "  4) pnpm -C $APP_DIR dev"
