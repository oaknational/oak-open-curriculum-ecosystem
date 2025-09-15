#!/usr/bin/env bash
set -Eeuo pipefail

APP="apps/oak-open-curriculum-semantic-search"

echo ">> Adding OpenAPI generator + /api/openapi.json + /api/docs (Redoc CDN) to $APP"

write_file () {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "  wrote $path"
}

# 1) OpenAPI builder (Zod -> OpenAPI 3.1), used at runtime by /api/openapi.json
write_file "$APP/src/lib/openapi.ts" <<'TS'
import { z } from "zod";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
  type RouteConfig,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * These schemas mirror the validation used by your routes:
 *  - /api/search               (structured)
 *  - /api/search/nl            (natural language)
 *  - /api/sdk/search-lessons   (SDK passthrough)
 *  - /api/sdk/search-transcripts (SDK passthrough)
 *
 * Keep in sync with the route Zod schemas.
 */

const Subject = z.string().openapi({ description: "Subject slug, e.g. 'geography'" });
const KeyStage = z.string().openapi({ description: "Key stage code (ks1|ks2|ks3|ks4)" });

const LessonDoc = z.object({
  lesson_id: z.string(),
  lesson_slug: z.string(),
  lesson_title: z.string(),
  subject_slug: z.string(),
  key_stage: z.string(),
  unit_ids: z.array(z.string()).default([]),
  unit_titles: z.array(z.string()).default([]),
  transcript_text: z.string(),
}).openapi("LessonDoc");

const UnitDoc = z.object({
  unit_id: z.string(),
  unit_slug: z.string(),
  unit_title: z.string(),
  subject_slug: z.string(),
  key_stage: z.string(),
  lesson_ids: z.array(z.string()).default([]),
  lesson_count: z.number().int(),
  unit_topics: z.string().optional(),
}).openapi("UnitDoc");

const StructuredQuerySchema = z.object({
  scope: z.enum(["units", "lessons"]),
  text: z.string().min(1),
  subject: Subject.optional(),
  keyStage: KeyStage.optional(),
  minLessons: z.number().int().min(0).optional(),
  size: z.number().int().min(1).max(100).optional(),
  from: z.number().int().min(0).optional(),
  highlight: z.boolean().optional(),
}).openapi("StructuredQuery");

const LessonResult = z.object({
  id: z.string(),
  rankScore: z.number(),
  lesson: LessonDoc,
  highlights: z.array(z.string()).default([]),
}).openapi("LessonResult");

const UnitResult = z.object({
  id: z.string(),
  rankScore: z.number(),
  unit: UnitDoc.nullable(),
  highlights: z.array(z.string()).default([]),
}).openapi("UnitResult");

const StructuredResponseLessons = z.object({ results: z.array(LessonResult) })
  .openapi("StructuredResponseLessons");
const StructuredResponseUnits = z.object({ results: z.array(UnitResult) })
  .openapi("StructuredResponseUnits");

const ErrorSchema = z.object({
  error: z.unknown(),
  message: z.string().optional(),
}).openapi("Error");

const NaturalLanguageBody = z.object({
  q: z.string().min(1),
  scope: z.enum(["units", "lessons"]).optional(),
  size: z.number().int().min(1).max(100).optional(),
}).openapi("NaturalLanguageBody");

const NaturalLanguageResponse = z.object({
  derived: StructuredQuerySchema,
  results: z.array(z.union([LessonResult, UnitResult])),
}).openapi("NaturalLanguageResponse");

const SdkSearchLessonsBody = z.object({
  q: z.string().min(1),
  keyStage: KeyStage.optional(),
  subject: Subject.optional(),
  unit: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
}).openapi("SdkSearchLessonsBody");

const SdkSearchTranscriptsBody = z.object({
  q: z.string().min(1),
  keyStage: KeyStage.optional(),
  subject: Subject.optional(),
}).openapi("SdkSearchTranscriptsBody");

const SdkArrayAny = z.array(z.any()).openapi("SdkArrayAny");

export function buildOpenAPIDocument(origin?: string) {
  const registry = new OpenAPIRegistry();

  registry.registerComponent("schema", "Error", ErrorSchema);
  registry.registerComponent("schema", "LessonDoc", LessonDoc);
  registry.registerComponent("schema", "UnitDoc", UnitDoc);
  registry.registerComponent("schema", "StructuredQuery", StructuredQuerySchema);

  // Structured search
  registry.registerPath({
    method: "post",
    path: "/api/search",
    summary: "Structured hybrid search",
    description: "Hybrid (BM25 + semantic_text) with RRF using a structured body.",
    tags: ["search"],
    request: {
      body: { content: { "application/json": { schema: StructuredQuerySchema } } }
    },
    responses: {
      200: { description: "OK", content: { "application/json": { schema: z.union([StructuredResponseLessons, StructuredResponseUnits]) } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } }
    }
  } as RouteConfig);

  // Natural-language search
  registry.registerPath({
    method: "post",
    path: "/api/search/nl",
    summary: "Natural-language search (LLM optional)",
    description: "Parses a question into a structured query, then runs hybrid search.",
    tags: ["search"],
    request: { body: { content: { "application/json": { schema: NaturalLanguageBody } } } },
    responses: {
      200: { description: "OK", content: { "application/json": { schema: NaturalLanguageResponse } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } },
      501: { description: "LLM disabled", content: { "application/json": { schema: ErrorSchema } } }
    }
  } as RouteConfig);

  // SDK passthrough: lessons
  registry.registerPath({
    method: "post",
    path: "/api/sdk/search-lessons",
    summary: "SDK passthrough: title similarity.",
    description: "Direct passthrough to Oak SDK GET /search/lessons.",
    tags: ["sdk"],
    request: { body: { content: { "application/json": { schema: SdkSearchLessonsBody } } } },
    responses: {
      200: { description: "OK (opaque array)", content: { "application/json": { schema: SdkArrayAny } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } }
    }
  } as RouteConfig);

  // SDK passthrough: transcripts
  registry.registerPath({
    method: "post",
    path: "/api/sdk/search-transcripts",
    summary: "SDK passthrough: transcript similarity.",
    description: "Direct passthrough to Oak SDK GET /search/transcripts.",
    tags: ["sdk"],
    request: { body: { content: { "application/json": { schema: SdkSearchTranscriptsBody } } } },
    responses: {
      200: { description: "OK (opaque array)", content: { "application/json": { schema: SdkArrayAny } } },
      400: { description: "Validation error", content: { "application/json": { schema: ErrorSchema } } }
    }
  } as RouteConfig);

  const generator = new OpenApiGeneratorV31(registry.definitions);

  const doc = generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Oak Curriculum Search API",
      version: "1.0.0",
      description: "Hybrid (lexical + semantic) search API for Oak Curriculum content.",
    },
    servers: origin ? [{ url: origin }] : undefined,
    tags: [
      { name: "search", description: "Hybrid search endpoints" },
      { name: "sdk", description: "SDK passthrough endpoints" },
    ],
  });

  (doc as any).xTagGroups = [
    { name: "Search", tags: ["search"] },
    { name: "SDK", tags: ["sdk"] },
  ];

  return doc;
}
TS

# 2) The spec endpoint: GET /api/openapi.json
write_file "$APP/app/api/openapi.json/route.ts" <<'TS'
import { NextResponse, type NextRequest } from "next/server";
import { buildOpenAPIDocument } from "@lib/openapi";

/** Serves the generated OpenAPI JSON (OAS 3.1). */
export async function GET(req: NextRequest): Promise<Response> {
  const origin = new URL(req.url).origin;
  const doc = buildOpenAPIDocument(origin);
  return NextResponse.json(doc, {
    headers: {
      "cache-control": "public, max-age=60",
      "content-type": "application/json; charset=utf-8",
    },
  });
}
TS

# 3) The docs UI: GET /api/docs (Redoc via CDN, with link to schema)
#    (No NPM dependency; works with React you already have.)
write_file "$APP/app/api/docs/page.tsx" <<'TSX'
'use client';
import { useEffect, useRef } from "react";

export default function ApiDocsPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const specUrl = "/api/openapi.json";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error Redoc global provided by the CDN bundle
      if (window.Redoc && mountRef.current) {
        // @ts-expect-error Redoc global provided by the CDN bundle
        window.Redoc.init(
          specUrl,
          {
            hideDownloadButton: false,
            expandResponses: "all",
            jsonSampleExpandLevel: "all",
            pathInMiddlePanel: true
          },
          mountRef.current
        );
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Oak Curriculum Search API</h1>
        <p style={{ margin: '6px 0 0', color: '#4b5563' }}>
          OpenAPI schema:{" "}
          <a href={specUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
            {specUrl}
          </a>
        </p>
      </header>
      <div ref={mountRef} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }} />
    </main>
  );
}
TSX

echo ">> Done."
echo
echo "Next steps:"
echo "  1) Install generator runtime dependency:"
echo "     pnpm -w add -F $APP @asteasolutions/zod-to-openapi"
echo "  2) Start the app and open /api/docs (and /api/openapi.json)"
echo "     pnpm -C $APP dev"
