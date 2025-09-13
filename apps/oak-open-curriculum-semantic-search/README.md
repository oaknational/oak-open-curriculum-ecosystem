# Oak Open Curriculum Semantic Search

A Next.js workspace that indexes Oak Open Curriculum content into **Elasticsearch Serverless** and exposes a **hybrid (lexical + semantic)** search API. This project complements (and can ultimately replace) the SDK’s legacy search endpoints by providing richer recall, highlights, and flexible filters.

> This workspace uses the Elasticsearch JS client, and the Oak Open Curriculum SDK for all source fetching.

---

## Primary usage endpoints

- search: `POST /api/search`
- natural language search (uses an LLM to parse the query): `POST /api/search/nl`
- admin: `GET /api/index-oak` and `GET /api/rebuild-rollup`
- sdk parity: `POST /api/sdk/search-lessons` and `POST /api/sdk/search-transcripts`

## Technical features at a glance

- **Serverless Elasticsearch indices**
  - `oak_lessons`: lesson metadata + full transcript + `lesson_semantic` (`semantic_text`).
  - `oak_units`: unit metadata (`lesson_count`, filters, etc.).
  - `oak_unit_rollup`: concatenated, short per‑lesson passages + `unit_semantic` for unit‑level semantic recall and **unit highlights**.
- **Hybrid retrieval**: BM25 + `semantic_text` results combined with **RRF** (reciprocal rank fusion).
- **Highlights**: transcript and rollup snippets in API responses.
- **LLM parsing (optional)**: natural language → structured query via Vercel AI SDK + OpenAI.
- **SDK parity endpoints**: basic pass‑through to the public search for comparison.
- **Strict types & guards**: subject and keyStage validated using the SDK’s exported type guards.

---

## Directory

```text
apps/oak-open-curriculum-semantic-search/
├─ app/
│  ├─ api/
│  │  ├─ index-oak/route.ts        # Admin: index lessons/units (SDK → ES)
│  │  ├─ rebuild-rollup/route.ts   # Admin: rebuild `oak_unit_rollup`
│  │  ├─ search/route.ts           # Structured search
│  │  ├─ search/nl/route.ts        # Natural-language search (LLM optional)
│  │  └─ sdk/...
│  └─ page.tsx                     # Canonical search page (UI moved here)
├─ src/
│  ├─ adapters/                    # SDK guards + adapter
│  ├─ lib/                         # env, ES client, RRF, query parser, runner
│  └─ types/
├─ scripts/                        # ES serverless setup & alias swap
└─ docs/                           # Deep‑dive docs (ARCHITECTURE, ROLLUP, SETUP, ...)
```

---

## Quick start

1. **Install** (from repo root):

```bash
pnpm install
```

2. **Configure environment**: copy and fill `.env.local`:

```bash
cp apps/oak-open-curriculum-semantic-search/.env.example \
   apps/oak-open-curriculum-semantic-search/.env.local
```

Required values:

| Variable                | Required | Notes                                                       |
| ----------------------- | -------- | ----------------------------------------------------------- |
| `ELASTICSEARCH_URL`     | ✅       | Elastic Cloud Serverless endpoint (HTTPS).                  |
| `ELASTICSEARCH_API_KEY` | ✅       | ApiKey with index manage permissions.                       |
| `OAK_API_KEY`           | ✅       | Auth for Oak Open Curriculum API (via the SDK).             |
| `SEARCH_API_KEY`        | ✅       | Any long random string; used to guard admin routes.         |
| `AI_PROVIDER`           | ➖       | `openai` (default) or `none`. Controls NL parsing endpoint. |
| `OPENAI_API_KEY`        | ➖       | Required iff `AI_PROVIDER=openai`.                          |

1. **Create indices & analyzers** in Elasticsearch Serverless:

```bash
ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... \
pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

4. **Run the app**:

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev
```

5. **Index content** (admin route; protected by `x-api-key`):

```bash
curl -H "x-api-key: $SEARCH_API_KEY" \
  http://localhost:3000/api/index-oak

curl -H "x-api-key: $SEARCH_API_KEY" \
  http://localhost:3000/api/rebuild-rollup
```

6. **Search**:

- **Structured (LLM‑free):**

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{
    "scope":"units",
    "text":"mountains",
    "subject":"geography",
    "keyStage":"ks4",
    "minLessons":3,
    "size":20
  }'
```

- **Natural language (LLM):**

```bash
curl -X POST http://localhost:3000/api/search/nl \
  -H 'content-type: application/json' \
  -d '{ "q":"what KS4 geography units with more than two lessons about mountains?" }'
```

If LLM is disabled (`AI_PROVIDER=none` or no `OPENAI_API_KEY`), `/api/search/nl` returns `501` with `{ "error":"LLM_DISABLED" }`.

---

## Endpoints

### Admin

- `GET /api/index-oak` → Index units and lessons (SDK → ES). **Header:** `x-api-key: ${SEARCH_API_KEY}`
- `GET /api/rebuild-rollup` → Build `oak_unit_rollup` from existing lesson docs. **Header:** `x-api-key: ${SEARCH_API_KEY}`

### Search (primary)

- `POST /api/search` → **Structured** search. Body:

  ```json
  {
    "scope": "units" | "lessons",
    "text": "mountains and glaciation",
    "subject": "geography",
    "keyStage": "ks4",
    "minLessons": 3,
    "size": 25,
    "from": 0,
    "highlight": true
  }
  ```

- `POST /api/search/nl` → **Natural-language** search (LLM parses `q` to a structured query). Body:

  ```json
  {
    "q": "ks4 geography units about mountains with at least 3 lessons",
    "scope": "units",
    "size": 20
  }
  ```

### SDK parity (for comparison)

- `POST /api/sdk/search-lessons` → mirrors SDK `GET /search/lessons` (title similarity). Supports `unit`.
- `POST /api/sdk/search-transcripts` → mirrors SDK `GET /search/transcripts` (transcript similarity).

---

## How hybrid search works

1. **Lexical** queries:
   - Lessons: `lesson_title^3`, `transcript_text` (BM25).
   - Units: `unit_title^3` (in `oak_units`) and `rollup_text` (in `oak_unit_rollup`).
2. **Semantic** queries:
   - Lessons: `semantic` over `lesson_semantic` (`oak_lessons`).
   - Units: `semantic` over `unit_semantic` (`oak_unit_rollup`).
3. **RRF fusion** merges the ranked lists.
4. **Highlights** returned for `transcript_text` (lessons) and `rollup_text` (units).

The **rollup** index lets us surface unit‑level snippets without duplicating full transcripts into each unit.

---

## Elasticsearch resources

- **Setup script**: `apps/oak-open-curriculum-semantic-search/scripts/setup.sh` creates:
  - An updateable **synonyms set** (`oak-syns`).
  - The three indices with analyzers/mappings, including `semantic_text` fields.
- **Alias management**: `scripts/alias-swap.sh` for zero‑downtime reindex flows.

> Serverless specifics: mappings use `term_vector` for highlight efficiency and `semantic_text` for semantic queries.

---

## Development & commands

**Workspace scripts** (from repo root):

```bash
pnpm -C apps/oak-open-curriculum-semantic-search dev       # Next.js dev
pnpm -C apps/oak-open-curriculum-semantic-search build     # Next.js build
pnpm -C apps/oak-open-curriculum-semantic-search start     # Next.js start
pnpm -C apps/oak-open-curriculum-semantic-search lint      # ESLint (extends repo base + Next.js rules)
pnpm -C apps/oak-open-curriculum-semantic-search type-check# TypeScript strict (lint tsconfig)
pnpm -C apps/oak-open-curriculum-semantic-search format    # Prettier (if configured at root)
pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

Root‑run quality gates (see `docs/agent-guidance/development-practice.md`):

```bash
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build
```

Turbo wiring: this workspace participates in `turbo.json` pipelines for `build`, `lint`, `type-check`, `test`, and `format`.

**Node runtime**: This app targets the Node server runtime (Vercel supported). The official Elasticsearch client is used for `_search` and `_bulk`.

---

## Security

- Admin routes require `x-api-key: ${SEARCH_API_KEY}`.
- Store **Oak API** and **Elastic** keys only in server-side env.
- Rate limit externally if exposing admin endpoints beyond your private network.

---

## Troubleshooting

- **501 from `/api/search/nl`** → LLM disabled. Set `AI_PROVIDER=openai` and `OPENAI_API_KEY`.
- **Index missing** → run `elastic:setup` and re‑try indexing.
- **Empty results** → ensure indexing finished and rollup rebuilt.
- **SDK errors** → verify `OAK_API_KEY`

---

## Further reading

See the deep‑dive docs in `docs/`:

- `docs/SETUP.md` — environment, bootstrap, curl examples.
- `docs/ARCHITECTURE.md` — indices, endpoints, data flow.
- `docs/ROLLUP.md` — motivation and details for the rollup index.
- `docs/SDK-ENDPOINTS.md` — parity routes and payload examples.

---

## Data storage & transmission (development)

- Client storage
  - `localStorage`: `theme-mode` → user's theme preference (`system|light|dark`).
  - Cookie: `theme-mode=...; Path=/; SameSite=Lax; Max-Age=31536000` mirrors the preference for SSR/early render. No identifiers; used only for UI.

- Server storage
  - None for user state. Admin operations do not persist user data; they run ES setup/indexing.

- Network
  - Search endpoints (`/api/search`, `/api/search/nl`) receive query payloads only. Cookie is not required by these endpoints.
  - Admin endpoints (`/api/admin/*`) stream text output; protected by `x-api-key`.
  - External services: Elasticsearch and Oak API via server-side env vars; never exposed to clients.

- Rendering & performance
  - Early inline script in `app/layout.tsx` reads `theme-mode` cookie (fallback to `localStorage`) to set `data-theme` pre-hydration, minimizing FOUC.
  - Only the Providers subtree consumes theme hint; the rest of the page remains statically rendered.
