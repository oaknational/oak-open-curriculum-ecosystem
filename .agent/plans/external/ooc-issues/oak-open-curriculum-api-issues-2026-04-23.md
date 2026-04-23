# Oak Open Curriculum API — Issue Report (2026-04-23)

A consolidated set of issues observed against the Oak Open Curriculum
public REST API at `https://open-api.thenational.academy/api/v0`.
Findings are presented strictly at the API level. Each issue includes
observed behaviour, expected behaviour, why the observed behaviour is
a problem, why the expected behaviour is a benefit, and concrete `curl`
reproduction steps that run independently of any client tooling.

All examples assume an environment variable `OAK_API_KEY` containing a
valid bearer token.

---

## Issue 1 — Threads endpoints return HTTP 500 with a raw upstream GraphQL error

### Endpoints

- `GET /threads/{slug}`
- `GET /threads/{slug}/units`

### Observed behaviour

Both endpoints return HTTP 500 for slugs that the API itself treats as
valid identifiers elsewhere. The response body forwards a raw
GraphQL/Hasura schema-validation error string verbatim:

```json
{
  "message": "Upstream server error (500): field 'threads' not found in type: 'query_root'",
  "code": "INTERNAL_SERVER_ERROR"
}
```

A sibling endpoint on the same identifier
(`GET /threads/{slug}/progressions`) returns 200 with valid data, so
the slug is genuinely a known thread; only these two endpoints fail.

### Expected behaviour

1. The endpoint resolves the requested resource and returns 200 with
   the thread metadata or unit list.
2. If the resource is genuinely unavailable, return a typed
   application error such as `404 NOT_FOUND` rather than a 500.
3. In no case forward an internal storage-layer error message
   (GraphQL field names, Hasura signatures, etc.) to API consumers.

### Why the observed behaviour is a problem

- Two of the headline navigation paths for the "thread" concept
  (resolve a thread by slug, list its units) are unusable.
- A 500 response is indistinguishable from a transient outage, but the
  failure here is deterministic — retries do not help.
- The leaked error string exposes internal storage-layer topology
  (the existence and naming of GraphQL root fields backed by Hasura),
  which is a small-but-real information leak across the public
  boundary and an unactionable signal for clients.
- Inconsistency with the working `progressions` endpoint suggests the
  REST → GraphQL mapping is pointing at a missing/renamed resolver,
  which is the kind of regression an explicit typed contract would
  have caught.

### Why the expected behaviour is a benefit

- Restores two primary navigation paths in the curriculum thread model.
- Lets clients distinguish "my request was wrong" (4xx, actionable)
  from "the service is unhealthy" (5xx, retry/back off) reliably.
- Removes internal implementation strings from the public response
  surface, so the public contract is decoupled from the storage
  technology.

### Reproduce

```bash
# Failing — both return 500 with the GraphQL error string above
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/threads/number"

curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/threads/number/units"

# Working contrast — same slug, sibling endpoint returns 200 with data
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/threads/number/progressions"
```

---

## Issue 2 — KS4 lessons listing has repeated `lesson_slug` rows with no discriminator

### Endpoint

- `GET /key-stages/{keyStage}/subjects/{subject}/lessons`

### Observed behaviour

For `keyStage = ks4` on subjects with tier and/or exam-board variation
(clearly observable on `science`), the same `lesson_slug` appears in
multiple rows. The repeated rows look identical or near-identical in
the visible fields (title, unit, summary metadata). Nothing in the
payload distinguishes the rows: there is no `tier` field, no
`exam_board` field, no `programme_slug` field.

For comparison, the same query against a key stage without tier /
exam-board variation (e.g. `ks2 + science`) returns zero duplicates.

### Expected behaviour

Choose one of the following — the property the API team picks should
hold uniformly across the key-stage/subject listing family (lessons,
units, questions, assets):

1. **Deduplicate at source.** Return one row per `lesson_slug`, with
   a nested `available_in` array describing the tier / exam-board
   permutations the lesson appears in.
2. **One row per permutation, with explicit discriminator.** Add
   `tier` and `exam_board` (or `programme_slug`) fields to every row
   so that `(lesson_slug, tier, exam_board)` is unique and consumers
   can group by themselves.
3. **Programme-aware listing only.** Require `tier` and/or
   `exam_board` query parameters for KS4 subjects that have them, and
   reject ambiguous calls explicitly.

Option 2 most closely matches the curriculum model that other
endpoints already expose (programmes already encode tier and exam
board).

### Why the observed behaviour is a problem

- Consumers cannot reliably count "lessons in KS4 science" — the same
  lesson is silently double- or triple-counted.
- Naïve client-side deduplication over-collapses the data and
  silently drops the tier / exam-board variants the API is presumably
  trying to surface.
- Any indexing, aggregation, exporting, or display use case produces
  duplicate-looking output that confuses end users.
- The shape is inconsistent with sibling sequence-listing endpoints,
  which correctly enumerate the three KS4 science programmes
  (`science-secondary-aqa`, `science-secondary-edexcel`,
  `science-secondary-ocr`); the discriminating context exists in the
  system, it just is not surfaced on this listing.

### Why the expected behaviour is a benefit

- Consumers can answer real product questions ("how many distinct
  lessons does KS4 science have?", "which lessons are exclusive to
  AQA?") without out-of-band knowledge.
- The contract becomes uniform across key stages, removing a
  KS4-specific edge case from every consumer.
- Makes the relationship between lessons and programmes explicit on
  the wire, which reduces the volume of secondary lookups consumers
  need to make.

### Reproduce

```bash
# KS4 + science: duplicates exist
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks4/subjects/science/lessons" \
  | jq '[.[].lesson_slug] | group_by(.) | map(select(length > 1)) | map({slug: .[0], count: length})'

# KS2 + science: no duplicates expected
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks2/subjects/science/lessons" \
  | jq '[.[].lesson_slug] | group_by(.) | map(select(length > 1)) | length'
```

The first command prints the slugs that appear more than once together
with their multiplicity. The second prints `0` (or close to it),
demonstrating the issue is specific to key stages with tier /
exam-board variation.

---

## Issue 3 — Subject questions listing returns empty array with no signal for unsupported combinations

### Endpoint

- `GET /key-stages/{keyStage}/subjects/{subject}/questions`

### Observed behaviour

Returns `HTTP 200 []` for combinations where many lessons exist and
many of those lessons have quiz content reachable via
`GET /lessons/{lesson}/quiz`. Most clearly observable for
`keyStage = ks3, subject = science`.

There is no body field, header, or other signal that distinguishes
"this listing is supported but happens to be empty" from "this
listing is not produced for this combination". Both states return
the same bytes.

### Expected behaviour

Make the underlying state machine visible to clients. Either:

1. **Return data when it exists.** If question content is reachable
   via `GET /lessons/{slug}/quiz` for lessons in this combination,
   the bulk listing should aggregate it.

   *Or*

2. **Return a typed envelope when the listing is genuinely
   unsupported.** Replace `200 []` with a discriminated response,
   for example:

   ```json
   {
     "status": "no-bulk-export-available",
     "reason": "Bulk question export is not produced for ks3 / science.",
     "items": []
   }
   ```

   distinguishable on the wire from the supported-but-empty case:

   ```json
   {
     "status": "ok",
     "items": []
   }
   ```

### Why the observed behaviour is a problem

- Consumers cannot tell "no data here" from "this endpoint is not
  populated for this combination". They must either give up or
  assume one of the two states without evidence.
- Because the per-lesson `/quiz` endpoint clearly does have data for
  the same lessons, consumers fall back to N×lesson lookups when a
  bulk endpoint is advertised — a needless cost both to consumers
  and to the API.
- The same ambiguity likely affects sibling bulk endpoints in the
  family (`/key-stages/{ks}/subjects/{subj}/assets`,
  `/key-stages/{ks}/subjects/{subj}/units`, etc.), so the doctrine
  question generalises.

### Why the expected behaviour is a benefit

- Eliminates the ambiguity at the contract level: consumers can act
  on the discriminator instead of guessing.
- Removes the silent N×fallback pattern, reducing API load.
- A typed "not available" envelope also gives the API team a place
  to communicate *why* a listing is missing (data not yet produced,
  combination not supported, etc.) without coupling it to error
  semantics.

### Reproduce

```bash
# Empty listing — no discriminator
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subjects/science/questions" \
  | jq 'length'

# Many lessons exist for the same combination
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subjects/science/lessons" \
  | jq 'length'

# A representative lesson from that combination has quiz content via the per-lesson endpoint
LESSON_SLUG=$(curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/key-stages/ks3/subjects/science/lessons" \
  | jq -r '.[0].lesson_slug')

curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/lessons/${LESSON_SLUG}/quiz" \
  | jq '{has_quiz: (.questions != null and (.questions | length > 0))}'
```

The first call returns `0`. The second returns a non-zero count. The
third returns `{"has_quiz": true}` for typical KS3 science lessons.

---

## Issue 4 — Aggregate sequence slugs are not discoverable via `/sequences`

### Endpoints

- `GET /subjects/{subject}/sequences`
- `GET /curriculum/browse?subject={subject}&keyStage={keyStage}`

(The second path is the public REST shape backing the curriculum
browse / overview view; substitute the canonical path if it differs.)

### Observed behaviour

For `subject = science`:

- `GET /subjects/science/sequences` returns three sequence slugs:
  `science-secondary-aqa`, `science-secondary-edexcel`,
  `science-secondary-ocr`.
- `GET /curriculum/browse?subject=science&keyStage=ks4` returns a
  single aggregate sequence with `sequenceSlug = science-secondary`,
  containing 54 units and 400 lessons.

The aggregate slug `science-secondary` is **not** present in the
canonical `/sequences` listing for the subject, and is not accepted
by follow-up sequence-shaped endpoints (`/sequences/{slug}/units`
etc.).

### Expected behaviour

The two endpoints should agree on the universe of valid sequence
slugs. Either approach is acceptable:

1. **Surface aggregates as first-class sequences.** Add the aggregate
   to the canonical listing with an explicit type discriminator and
   constituent membership, for example:

   ```json
   {
     "sequenceSlug": "science-secondary",
     "type": "aggregate",
     "members": [
       "science-secondary-aqa",
       "science-secondary-edexcel",
       "science-secondary-ocr"
     ]
   }
   ```

   and ensure follow-up calls (`/sequences/{slug}/units`, etc.)
   accept it.

2. **Stop returning aggregate slugs from the browse endpoint.** Return
   the constituent programme slugs together with a `members`-shaped
   payload, and let the client compose the aggregate view itself.

### Why the observed behaviour is a problem

- A consumer that begins on `/sequences` cannot discover the
  aggregate view at all.
- A consumer that begins on `/curriculum/browse` is given a slug
  (`science-secondary`) that fails when used against the rest of the
  sequence API, with no way to know in advance whether a slug is real
  or aggregate.
- The two endpoints encode different definitions of "sequence" while
  using identical-shaped slugs, which silently breaks slug-based
  navigation, caching, and validation.

### Why the expected behaviour is a benefit

- A single, consistent universe of sequence slugs across the API.
- Slug → URL stability assumptions made by indexers, exporters, and
  consumers hold uniformly, instead of breaking only on KS4 subjects
  that have aggregates.
- The curriculum browse experience is preserved (whichever option is
  chosen), but the underlying contract becomes honest about what is
  a real navigable sequence and what is a synthesised view.

### Reproduce

```bash
# Canonical sequence listing — no "science-secondary" entry
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/subjects/science/sequences" \
  | jq '[.[].sequenceSlug] | sort'

# Curriculum browse advertising the aggregate "science-secondary" slug
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/curriculum/browse?subject=science&keyStage=ks4" \
  | jq '.facets.sequences[].sequenceSlug'
```

(Curriculum browse path is the public REST shape consumed by API
clients; substitute the project's canonical path if it differs.)

---

## Issue 5 — No consistent response doctrine for empty / no-match / unsupported / failure

### Scope

Cross-cutting. The shapes the API uses to communicate "I have no data
for you" or "something went wrong" are inconsistent across endpoints.
This is filed last because it generalises, and partially supersedes,
the per-endpoint asks above.

### Observed behaviour

Worked examples drawn directly from the API, all observable today:

| Conceptual condition                                       | Endpoint                                                | Current response                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ |
| Empty input rejected                                       | `GET /search?scope=lessons&query=`                      | Typed error with explicit hint about which fields are required.    |
| No semantic / lexical match                                | `GET /search?scope=lessons&query=asdfqwerzxcv-no-such-topic` | Returns top-N loosely-matching results with no "weak match" flag. |
| Endpoint not populated for the combination                 | `GET /key-stages/ks3/subjects/science/questions`        | `200 []` with no discriminator (see Issue 3).                       |
| Identifier valid but resolver missing                      | `GET /threads/{slug}/units`                             | `500` with raw GraphQL error string forwarded (see Issue 1).        |
| Identifier syntactically invalid                           | `GET /lessons/<malformed-id>` (and equivalent)          | Typed error: e.g. "Unsupported id prefix in <id>".                 |
| Identifier syntactically valid but unknown                 | `GET /lessons/does-not-exist-xyz-12345`                 | Typed `NOT_FOUND` error.                                            |

The good cases (typed input errors, typed not-found) live alongside
the problematic cases (silent empties, raw upstream-error leaks),
which means consumers cannot rely on any single contract holding
across the API.

### Expected behaviour

A uniform response doctrine across all endpoints, published in the
OpenAPI spec and the developer docs:

1. **Empty / invalid input** → `4xx` with a typed error envelope and
   a hint naming the missing or invalid field. (Already done well by
   `/search` — generalise across the API.)
2. **Valid input, no matches** → `200` with a discriminated envelope:

   ```json
   {
     "status": "ok",
     "items": [],
     "match_quality": "exact" | "weak" | "none"
   }
   ```

   Rather than synthesising weak results and presenting them with the
   same shape as confident hits, return `"items": []` with
   `"match_quality": "none"`, or expose a confidence threshold the
   consumer can tune.
3. **Valid input, endpoint genuinely not populated** → `200` with a
   discriminated envelope that says so (see Issue 3 for the concrete
   example):

   ```json
   {
     "status": "no-bulk-export-available",
     "reason": "Bulk question export is not produced for ks3 / science.",
     "items": []
   }
   ```

   Distinguishable on the wire from the "supported, no matches" case.
4. **Identifier syntactically invalid** → `400` with typed error.
   (Already done — generalise.)
5. **Identifier syntactically valid but unknown** → `404 NOT_FOUND`
   with typed error. (Already done — generalise.)
6. **Upstream / resolver failure** → `5xx` with a stable error code
   and a generic, opaque message. No internal implementation strings
   may be forwarded (see Issue 1). The detail belongs in server logs,
   not in the client response.

### Why the observed behaviour is a problem

- Consumers cannot apply uniform retry / fallback / "no result"
  handling without per-endpoint special-casing.
- The most damaging case is "valid input, no matches" being returned
  as confident irrelevant hits — consumers then misrepresent results
  to end users.
- Internal error string leaks (see Issue 1) compound this: a
  consumer that wants to distinguish "real outage" from "known
  limitation" must currently scrape error strings, which is brittle
  and an information-leak smell.
- The good cases (typed input errors, typed `NOT_FOUND`) lose their
  value when the rest of the surface does not match them — a partial
  contract is, in practice, no contract.

### Why the expected behaviour is a benefit

- One consistent contract across the API surface.
- Consumers — including aggregators, indexers, and downstream agents
  — can write generic handling code instead of per-endpoint shims.
- Eliminates an entire class of "is this empty intentional?"
  ambiguity at the contract level, not at the consumer side.
- Removes internal-state leaks from production responses, which is
  good both for security and for being able to evolve the storage
  layer without consumer breakage.

### Reproduce

The reproductions for the four worked examples that are themselves
defects appear in the corresponding issue sections above (Issue 1
for the 5xx leak, Issue 3 for the silent `[]`). The two well-behaved
contrasts are:

```bash
# Typed input error (good — generalise this shape):
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/search?scope=lessons&query="

# Typed not-found (good — generalise this shape):
curl -i -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/lessons/does-not-exist-xyz-12345"
```

---

## Summary

| # | Endpoint family                                  | Class of issue                                                    |
| - | ------------------------------------------------ | ----------------------------------------------------------------- |
| 1 | `/threads/{slug}` and `/threads/{slug}/units`    | Deterministic 5xx with raw upstream GraphQL error leak.           |
| 2 | `/key-stages/{ks}/subjects/{subj}/lessons`       | Repeated rows on KS4 with no discriminator (tier / exam board).   |
| 3 | `/key-stages/{ks}/subjects/{subj}/questions`     | `200 []` indistinguishable from "endpoint not populated".         |
| 4 | `/subjects/{subj}/sequences` vs curriculum browse | Aggregate sequence slugs not discoverable via canonical listing. |
| 5 | Cross-cutting                                    | No uniform doctrine for empty / no-match / unsupported / failure. |

Issues 1–4 are concrete; Issue 5 is the doctrine that, if adopted,
naturally closes Issues 1 and 3 and is consistent with how Issues 2
and 4 should land.
