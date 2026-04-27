# Oak Open Curriculum API — Issue Report

**History:** First drafted 2026-04-23; Issue 1 revised 2026-04-26.  
**Refreshed:** 2026-04-27 against the **live** OpenAPI document
[`https://open-api.thenational.academy/api/v0/swagger.json`](https://open-api.thenational.academy/api/v0/swagger.json)
(baseline build id at validation: `0.6.0-00e72e8d3260acea8a6b5177272f2d523c8f69f5`).

Findings are from **HTTP** calls to `https://open-api.thenational.academy/api/v0`
only. Each issue includes observed behaviour, expected behaviour, impact, benefit,
and `curl` reproduction steps.

All examples assume `OAK_API_KEY` is a valid bearer token for that host.

**Optional — implementation source:** The HTTP service is implemented in the
**`oak-openapi`** repository. File paths in **Implementation notes** are
relative to that repository’s root. This repository does not vend that
application.
The notes below summarise behaviour seen in that code; they are **not** a
substitute for the live contract (`swagger.json` + HTTP repro).

---

## Baseline — canonical paths (live spec)

Use the live `swagger.json` as the contract. Earlier drafts of this report
used paths that **do not** match the server.

| Wrong (404 `NOT_FOUND`) | Canonical in live spec |
| --- | --- |
| `.../key-stages/{ks}/subjects/{subject}/...` | `.../key-stages/{keyStage}/subject/{subject}/...` (**singular** `subject`) |
| `GET /search?scope=lessons&query=...` | `GET /search/lessons` with query param **`q`** (required) |

**Pagination:** `GET .../lessons` returns one page of **units**, each with a
`lessons` array (`lessonSlug`, `lessonTitle`). Follow `Link: <...>; rel="next"`
until absent. Counting lessons requires **flattening** all pages:
`[.[] | .lessons[]?.lessonSlug]`.

---

## Issue 1 — Thread units return HTTP 500 with a raw GraphQL schema error

### Endpoints (live OpenAPI)

- `GET /threads` — list threads  
- `GET /threads/{threadSlug}/units` — units for a thread  

The published spec does not define `GET /threads/{slug}` for a single thread
resource (list + units only).

### Observed behaviour

- `GET /threads/{threadSlug}/units` can return **HTTP 500** with a body that
  includes a **raw GraphQL schema validation error**, e.g.  
  `field 'threads' not found in type: 'query_root'`.
- `GET /threads` may still return **200** for the same token, so thread
  slugs remain discoverable while units-by-slug fails.
- Failure is **repeatable** (not transient-only).

### Expected behaviour

1. `GET /threads/{threadSlug}/units` returns **200** with a schema-shaped body
   when the slug exists and is published, or **4xx** with a stable, documented
   code when it does not.
2. **5xx** for genuine outages; responses should not echo internal schema
   field names to API clients.
3. Consistent behaviour with other thread operations for the same identifier.

### Why it matters

- Ordered units in a thread are a primary navigation path for integrators.
- **500** implies “retry” though a schema/config mismatch will not self-heal.
- Leaked Hasura-style messages are not actionable and expose integration detail.

### Steps to reproduce

```bash
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/threads" | head -c 500

curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/threads/number-multiplication-and-division/units"
```

Use any `slug` from the first response if the example thread is absent.

### Root cause (context only)

In **`oak-openapi`** (`src/lib/handlers/threads/threads.ts`), list vs
units-by-slug can target different GraphQL root fields; if `query_root.threads`
is absent in the schema the resolver uses, the observed error matches.
Internal to the API service, not a consumer workaround.

### Implementation notes (`oak-openapi`)

- `getAllThreads` issues a query against the view exported as `threadView`
  from `src/lib/owaClient.ts` (value `published_mv_threads_1`), not the
  `threads` root field.
- `getThreadUnits` embeds a separate document that selects GraphQL root
  **`threads`** with `thread_units` / `unit` (see `src/lib/handlers/threads/threads.ts`).
  That is exactly the name that appears in the schema validation error when
  the field is missing from `query_root`.

---

## Issue 2 — KS4 (and other stages) lessons: repeated `lessonSlug` with no programme / tier / exam-board discriminator

### Endpoint (live OpenAPI)

- `GET /key-stages/{keyStage}/subject/{subject}/lessons`

Response shape: **array of units**, each with `unitSlug`, `unitTitle`, and
`lessons: [{ lessonSlug, lessonTitle }, ...]`. There is no `tier`,
`exam_board`, or `programme_slug` on each lesson row in this listing.

### Observed behaviour

For **ks4** + **science**, the same `lessonSlug` can appear in **many** unit
rows (programme variants), so a flat list of `lessonSlug` over-counts “how many
lessons” and hides which programme each row belongs to.

**2026-04-27 check (paginated sample):** following `Link: rel="next"` for
`key-stages/ks4/subject/science/lessons` (first **80** pages) found **many**
`lessonSlug` values with count **> 1** (e.g. top multiplicity **31** for one
slug in that sample). The listing remains **undiscriminated** at the lesson
row.

**KS2 + science (full pagination in the same run):** flattening
`lessonSlug` across all pages also showed **non-zero** duplicate groups (**27**),
so “no duplicates outside KS4” is **not** true for a naive flat count — the
**KS4 + tier / exam board** case remains the main product example for missing
**programme** context on the wire.

### Expected behaviour

Same three options as before (dedupe with `available_in`, explicit
discriminators, or require programme/tier query params for ambiguous KS4
subjects). The API team should apply one approach consistently across
lessons, units, questions, and assets in this family.

### Why it matters

- Distinct lesson counts, exports, and displays are wrong without a clear rule.
- Sibling `GET /subjects/{subject}/sequences` exposes programme slugs; this
  listing does not connect lessons to that dimension.

### Reproduce (aligned with live spec + nested + pagination)

```bash
# One page: duplicate lessonSlug groups (fast signal)
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks4/subject/science/lessons" \
  | jq '[.[] | .lessons[]?.lessonSlug] | group_by(.) | map(select(length > 1)) | map({slug: .[0], count: length})'

# All pages: follow Link: rel="next" until absent (use a small script or
# curl in a loop), flatten [.[] | .lessons[]?.lessonSlug], then group/count.
# Validate duplicate groups and max multiplicity for KS4 science vs KS2 science.
```

### Implementation notes (`oak-openapi`)

- `getKeyStageSubjectLessons` (`src/lib/handlers/keyStageSubjectLessons/keyStageSubjectLessons.ts`)
  filters `unitVariantLessonsView` by `programme_fields` (JSON) for the given
  key stage and subject. For **ks4** + **science** it **drops**
  `subject_slug` and sets **`subject_parent: "Science"`** so the view returns
  rows across **all** KS4 science programmes. The handler then groups rows
  by `unit_slug` only; the response schema does not attach
  `examboard_slug` / `programme_slug` to each lesson, so the same
  `lessonSlug` can legitimately appear under more than one unit (programme
  variant) in one response.
- Pagination uses `offset` / `limit` and sets a `Link` header via
  `src/lib/pagination` when another page may exist.

---

## Issue 3 — Subject questions listing: no typed signal when bulk export is empty or partial

### Endpoint (live OpenAPI)

- `GET /key-stages/{keyStage}/subject/{subject}/questions`

### Observed behaviour (2026-04-27)

- The response is a **raw JSON array** (no `status` / `reason` envelope).
- For **ks3** + **science**, the bulk list was **not** empty in our check
  (length **6**), so the “always `200 []` for this pair” report from
  2026-04-23 is **not** reproduced as-stated on today’s service.
- **Per-lesson** `GET /lessons/{lesson}/quiz` can still return bodies **without**
  a `questions` array (e.g. copyright messaging) while the bulk questions
  endpoint returns some entries — the relationship between bulk and per-lesson
  quiz is not self-describing in the **bulk** array shape.

The **design** concern remains: without a discriminated envelope, clients
cannot tell “supported, zero rows”, “not populated for this pair”, and
“populated but incomplete vs per-lesson” apart from convention or sampling.

### Expected behaviour

Unchanged: either bulk aggregate where per-lesson quiz has questions, and/or
a **typed** empty / unsupported response (as in the 2026-04-23 sketch).

### Reproduce

```bash
# Bulk
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subject/science/questions" \
  | jq 'length, .[0]'

# Nested lessons (sum pages if you need a full count)
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subject/science/lessons" \
  | jq 'map(.lessons | length) | add'

# Per-lesson quiz (pick a lessonSlug from the nested structure)
SLUG=$(curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subject/science/lessons" \
  | jq -r '.[0].lessons[0].lessonSlug')

curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/lessons/${SLUG}/quiz" \
  | jq '{message, hasQuestions: (.questions != null), questionCount: (.questions | length?)}'
```

### Implementation notes (`oak-openapi`)

- `getQuestionsForKeyStageAndSubject` (`src/lib/handlers/questions/questions.ts`)
  loads lessons from `lessonView` for the key stage and subject, then filters
  out entries without quiz JSON, **quiz-blocked** lessons, and assets blocked
  by the gate. The **OpenAPI** response is still a **plain array** of
  `{ lessonTitle, lessonSlug, … }` with no `status` / `items` wrapper.
- There is a **special branch** for subjects in `blockedSubjects` (narrow
  `unitSlug` allow-list and inline comment in source); behaviour for those
  subjects differs from the default query even though the path is the same.
- `getQuestionsForLessons` (`/lessons/{lesson}/quiz`) is a different procedure
  with different gating and shaping; parity between the two is not expressed in
  the wire format of the bulk route.

---

## Issue 4 — Aggregate `science-secondary` routable on `/sequences/...` but not listed on `GET /subjects/.../sequences`

### Endpoints (live OpenAPI)

- `GET /subjects/{subject}/sequences`  
- `GET /sequences/{sequence}/units`  
- `GET /sequences/{sequence}/questions`  
- `GET /sequences/{sequence}/assets`  

### Observed behaviour (2026-04-27)

- `GET /subjects/science/sequences` returns slugs such as
  `science-primary`, `science-secondary-aqa`, `science-secondary-edexcel`,
  `science-secondary-ocr` — it does **not** include an aggregate slug
  **`science-secondary`** in the array we received.
- `GET /sequences/science-secondary/units` (and `.../questions`, `.../assets`)
  returned **200** — the **aggregate** slug is accepted on sequence
  sub-routes but **omitted** from the subject sequence listing.

**Impact:** a client that only uses `GET /subjects/{subject}/sequences` to
learn which sequence slugs exist may not discover that `science-secondary` is
valid for `GET /sequences/{sequence}/...`.

### Expected behaviour

Align listing and routability: either include the aggregate (with a field that
distinguishes it from programme entries), or do not accept aggregate slugs on
`/sequences/{sequence}/...` without documenting how clients should obtain them.

### Reproduce

```bash
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/subjects/science/sequences" \
  | jq 'map(.sequenceSlug) | sort'

curl -sS -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/sequences/science-secondary/units"
```

### Implementation notes (`oak-openapi`)

- `GET /subjects/{subject}/sequences` is built by `phaseToSequences` in
  `src/lib/handlers/subjects/helpers.ts`. When a subject has **ks4_options**
  (exam boards), the function **only** pushes one entry per board
  (`${subject}-${phase}-${examBoard.slug}`). It does **not** add a separate
  row for a phase-level slug with no board suffix, so
  `science-secondary-aqa` / `edexcel` / `ocr` can appear while
  `science-secondary` does not.
- `GET /sequences/{sequence}/…` uses `parseSubjectPhaseSlug` in
  `src/lib/sequenceSlugParser.ts`, which allows a **two-part** slug
  (e.g. `science-secondary`) with `ks4OptionSlug: null` — consistent with
  accepting the aggregate on sequence routes.
- `getSequenceUnits` (`src/lib/handlers/sequences/sequences.ts`) already
  contains logic for the **un-pinned** aggregate case: when the path slug has
  no exam-board segment, the implementation dedupes across exam boards and
  can attach which boards a unit appears in. That is **sequence** response
  shaping, not something `phaseToSequences` reuses for the **subject
  sequence list**.

---

## Issue 5 — No single response doctrine for empty / no-match / unsupported / failure

### Scope

Cross-cutting. Shapes for “no data” vs “error” still vary by endpoint, all
observable on the public routes below.

### Observed behaviour (2026-04-27)

| Condition | Example (live paths) | Notes (2026-04-27) |
| --- | --- | --- |
| Missing required search input | `GET /search/lessons` (omit **`q`**) | **400** with validation issues (typed). |
| Search with weak lexical matches | `GET /search/lessons?q=asdfqwerzxcv-no-such-topic` | **200** array; `similarity` on items — weak matches without a top-level `match_quality`. |
| Bulk questions ambiguous | `GET /key-stages/.../subject/.../questions` | Raw **array**; see Issue 3. |
| Resolver / upstream bug | `GET /threads/{slug}/units` | **500** with internal-style message (see Issue 1). |
| Unknown lesson | `GET /lessons/does-not-exist-xyz-12345/...` | **404** `NOT_FOUND` style. |

### Expected behaviour

Uniform doctrine: invalid input **4xx** with typed body; “no matches” and
“unsupported / empty resource” as discriminated **200** where appropriate; upstream
**5xx** with stable codes and no opaque implementation strings. (See 2026-04-23
sketches in the original thread for the full set.)

### Reproduce

```bash
# Validation error — missing required q
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/search/lessons"

# Search with a low-signal query (observe similarity field)
curl -sS -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/search/lessons?q=asdfqwerzxcv-no-such-topic" \
  | jq '.[0] | {lessonSlug, similarity}'

# Not-found
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/lessons/does-not-exist-xyz-12345"
```

Defects that anchor this theme are in Issues **1** and **3**; Issue **2** is
a data-shape / discrimination gap rather than a pure status-code problem.

### Implementation notes (`oak-openapi`)

- `GET /search/lessons` is implemented as `searchByTextSimilarity` in
  `src/lib/handlers/lesson/lesson.ts`: it calls a `lessonSearchView` with
  `search_term` and optional filters, then hydrates matches. The OpenAPI
  **output** is an array of lessons with a **`similarity`** field (see the
  GraphQL selection and follow-up mapping in that file) — not a
  `match_quality` envelope at the top level.
- Mixing that shape with the raw arrays from the key-stage questions route
  illustrates **handler-specific** response patterns across the tRPC/OpenAPI
  surface, not a single shared error/empty DTO.

---

## Summary

| # | Area | Class of issue |
| - | ---- | -------------- |
| 1 | `/threads`, `/threads/{threadSlug}/units` | **500** with raw GraphQL / schema string in body. |
| 2 | `/key-stages/{ks}/subject/{subj}/lessons` | Duplicate **`lessonSlug`** when flattened; no tier / programme on rows; paginate. |
| 3 | `/key-stages/{ks}/subject/{subj}/questions` | No envelope; bulk vs per-lesson unclear from contract alone. |
| 4 | `/subjects/.../sequences` vs `/sequences/...` | Aggregate **`science-secondary`** returned by sequence routes but **unlisted** on subject index. |
| 5 | Cross-cutting | Response doctrine still inconsistent; **`/search/lessons?q=`** in repro examples. |

---

## Changelog in this file

- **2026-04-27:** Re-baselined on live `swagger.json`; fixed `/subject/` path
  segment; search repros use `/search/lessons` + `q`; documented pagination and
  nested lesson model; re-ran checks (thread 500, KS4 duplicate sample, KS3
  questions non-empty, `science-secondary` list vs `GET /sequences/...`).
- **2026-04-27:** Added **Implementation notes** from `oak-openapi` (repo-relative
  paths only): thread list vs `threads` query; KS4 science lessons filter;
  questions procedures; subject `phaseToSequences` vs sequence routes; search
  handler shape.
