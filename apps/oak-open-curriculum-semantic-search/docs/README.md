# Oak Curriculum Hybrid Search — App Workspace

A Next.js workspace that indexes Oak curriculum content and exposes a hybrid (semantic + lexical) search API intended to supersede the basic SDK search.

**Highlights**

- **Serverless Elasticsearch** indices:
  - `oak_lessons` — transcripts + `lesson_semantic`
  - `oak_units` — unit metadata & filters
  - `oak_unit_rollup` — unit-level snippets + `unit_semantic`
- **Hybrid search (BM25 + ELSER)** fused with **RRF**
- **Two search endpoints**
  - **Structured**: `POST /api/search` (no LLM)
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
