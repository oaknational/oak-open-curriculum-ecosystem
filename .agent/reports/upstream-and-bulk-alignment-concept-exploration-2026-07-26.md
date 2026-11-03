# Upstream API Spec Alignment (MCP-152) + Bulk Data Download Schema Check (MCP-153) — Concept Exploration

Dated report, 2026-07-26. Author seat: Swallow guards Tailwind (805902), claude-code /
claude-fable-5, implementer on the `upstream-api-alignment` thread (claim 3ccb1b7e).
Method: the four-movement concept-exploration workflow run under an owner-specified
ultracode fleet — one guiding Fable seat, four Opus seam leads, six Sonnet perspectives
per seam (confirming / disconfirming / adversarial / counterfactual / alternative /
free-play), 306 Haiku micro-checks with tightly scoped read-only tasks. Every
load-bearing claim below was re-verified first-hand by the guide seat before acceptance
(evidence classes: **Fact** = cited and checked; **Inference**; **Owner-call**;
**To-verify** = names the missing observation). Owner constraint in force throughout:
exploration only, no fixing; a type-fixing spiral is a hard STOP.

Spec snapshots compared: committed cache `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`
(`0.7.0-8eceb702…`, pinned since 2026-06-30) versus live swagger fetched 2026-07-26
(`0.7.0-c83593ca…`). Bulk corpus measured: the 2026-06-10 download on the primary
checkout (30 subject files, 635 MB, 12,864 lesson records) — gitignored, hence invisible
to fresh worktrees; its absence from a worktree is not its absence from the estate.

## 1. The problem frame that survived

The ticket pair frames this as "regenerate types, fix breaks, then regenerate data and
maybe indexes". The exploration replaces that frame with three sharper ones:

1. **MCP-152 is a shape-novelty problem, not a diff-size problem.** The spec delta is
   tiny and additive at path level, but it introduces the FIRST POST operation, the
   FIRST `requestBody`, and the FIRST dictionary-shaped response the generator has ever
   been offered. The generator is a total function over the spec with no allowlist and
   no method conditioning — every new operation becomes an MCP tool automatically. The
   failure modes are product-level false-greens, not type errors.
2. **MCP-153's "schema check" presupposes an answer to "which truth?" — and the
   presumed answer is wrong.** The committed bulk `schema.json` is read by no code, and
   is violated by its own co-packaged data on required fields across 100% of records.
   The hand-authored templates the ticket-adjacent records call a schema-first
   violation are the only artefact that matches the real data structurally — exactly
   (12/12 unit keys, 18/18 lesson keys, every record).
3. **The chain from spec to deployed search surface is severed at the generator
   boundary; the chain from bulk data to the index is live and unversioned.** ES
   mappings are hand-authored constants behind an assert-then-discard ceremony
   (ADR-067's derivation claim does not hold); the deployed index records no
   provenance; the MRR "regression compare" has no mechanised comparator; rollback is a
   single slot.

## 2. Load-bearing observations (all Fact unless marked; every one re-verified first-hand)

### The upstream delta, correctly classified

- ADDED: `GET /key-stages/{keyStage}/subject/{subject}/check-restricted`,
  `POST /lessons/check-restricted`. Nothing removed; component-schema key set
  unchanged; one schema body changed description-only (`LessonSummaryResponseSchema`,
  hackathon note removed).
- **Five existing operations changed `limit`**: default 10→20, example 10→20, maximum
  100→300, plus rewritten description text (lessons, questions ×2, programmes/assets,
  sequences/questions). The alignment runbook's own fingerprint recipe (operationId +
  param names + response refs) is structurally blind to parameter values — this report's
  first classification inherited that blindness and was corrected by the fleet.
- Method histogram flips {get:32} → {get:33, post:1}; `requestBody` 0→1; `propertyNames`
  0→2. (An interim fleet figure of "14 requestBody occurrences" was falsified in
  synthesis — it is 1; do not re-transmit 14.)
- The repo sits at a generation fixed point: cache and both committed generated schema
  copies carry the same version pin; 29 definitions rows = 29 tool files = 32 GET paths
  minus 3 skipped.

### What a naive refresh would mint (the three chains)

- **Uncallable tool**: `buildParamMetadataForOperation` reads only path/query params
  (`mcp-tool-generator.ts:149,153`); `requestBody` appears nowhere in
  `code-generation/` outside one test fixture; generated input schemas are
  `additionalProperties: false`. A minted `post-lessons-check-restricted` compiles,
  registers, advertises — and its required `lessonSlugs` body has no route in. Every
  type gate passes. Permanently uncallable.
- **Mislabelled safety, test-certified**: `emit-index.ts:135-142` emits
  `readOnlyHint: true` unconditionally (comment: "all Oak tools are read-only …GET").
  Worse: `served-surface-registration.integration.test.ts:52-54` asserts EVERY
  registered tool carries `readOnlyHint: true` — an **anti-guard**: a live POST tool
  passes it; the correct generator fix (method-conditional annotation) fails it. The
  estate holds a green test that defends the defect and reads its cure as a regression.
- **Map-shaped response fails LOUD, not silent** (fleet inverted its own seam frame
  here): the vendored generator emits single-argument `z.record(...)` for the
  properties-less map response; zod 4.4.3 declares `record(keyType, valueType)` with
  two required parameters and the repo's v3→v4 transform has no record rule — so the
  regenerated Zod near-certainly fails type-check (To-verify: needs one actual regen).
  Runtime semantics of the corrected two-arg form were probed and are correct. A
  second, quieter hazard sits beside it: the same vendor's TypeScript half returns a
  bare `{}` for the identical shape (early `if (!schema.properties) return {}` guard)
  with `shouldExportAllTypes: true` engaged — Zod-correct, TS-empty, two halves of one
  artefact disagreeing (To-verify at regen).
- Consumer split: **designed tripwire** — `served-surface.ts` totality (`satisfies` +
  a recomputed-totality unit test): a codegen-added tool is a deliberate compile error,
  the system working, on an app file (which is why "never edit consumers" needs its
  boundary stated: discharging a designed tripwire by reviewed classification is not
  type-chasing). **Silent drift** — `tool-guidance-data.ts` (no totality over
  ToolName; new tools never appear in `get-curriculum-model`), the UAT guide, the
  agent-facing content registry. **Anti-guard** — the readOnlyHint assertion above; a
  third class the tripwire/drift binary had no room for.
- Content asymmetry in the new operations: the GET's description is byte-copied from
  the sibling lessons-listing operation (describes listing, not restriction-checking),
  inherits the pre-existing swapped offset/limit descriptions, and carries a
  `Link: rel="next"` claim while the string "Link" appears zero times in the live spec
  (a standing upstream fiction, imported verbatim). The POST's description is genuinely
  authored and accurate.
- The `maximum` keyword is dropped by the generator entirely: zero `.max(` across all
  29 generated tools. The 100→300 change therefore has zero validation effect and full
  agent-instruction effect — the bound is prose-only and has now moved twice unenforced
  (Owner-call below).
- Neither prospective check-restricted tool is in `PUBLIC_TOOLS`; both operations carry
  `security: [{bearerAuth}]`, UNAUTHORIZED responses, a closed verdict enum
  `["ogl-compatible","restricted"]`, and a 400 description referencing content blocked
  for copyright reasons — a rights/licensing capability, not curriculum content.

### The bulk surface, decomposed

- The three candidate truths do not compete on one axis — the "which is authoritative?"
  question was a category error:
  - **Structure**: the hand-authored templates are exactly right. Unit-key union across
    all 30 files = precisely the 12-key `.strict()` unitSchema set (including
    `examBoards` plural, which `schema.json` lacks); lesson records carry exactly the
    18 template keys, 12,864/12,864.
  - **Vocabulary**: `schema.json` is exactly right. Every enum is a valid superset of
    observed values, zero violations; the generated bulk Zod carries 0 `z.enum` against
    13 enum-bearing definitions — all available vocabulary fidelity lives in
    `schema.json` alone.
  - **`schema.json`'s structural claims are false and were never true**: its required
    `oakUrl`/`canonicalUrl` (lesson) and `canonicalUrl`/`subjectSlug` (unit) occur in
    zero of 12,864 records — in the SAME ZIP that shipped the schema (manifest
    byte-counts match the files on disk; the download script writes only
    manifest.json). Not drift: a freshness diff would report all-clear on a schema that
    never described its payload. ADR-093 confirms those fields were already absent in
    March — nothing was added or removed; a wrong document arrived.
  - `schema.json` matches the API's shapes no better (Inference): its flat unit
    composite corresponds to neither the bulk payload nor any swagger schema
    (`unitOptionGroup` appears in no API schema at all). It reads as a third,
    synthesised document.
- `schema.json` has **zero executable readers** anywhere in the estate — yet
  `.agent/rules/verify-data-supports-shape-before-building.md:30-31` names it "the
  ground truth" and is loaded into sessions estate-wide. The rule written to stop
  agents building on fields the corpus lacks currently directs them to a document
  asserting exactly such fields (Owner-call: doctrine re-point).
- The strict runtime gate (`bulk/reader.ts:79`, bare `.parse()`, unguarded loop) is not
  a fragile artefact enforcing a weak truth — it is the only artefact matching reality,
  and today's data passes it. The live hazard is its inverse: a "schema check" built
  against `schema.json` goes red on 100% of working data, and the obvious-looking
  remedy (regenerate templates to match schema.json) would break a working gate. That
  is MCP-153's rabbit hole, the exact shape the owner warned about on the type side.
- **The `restricted` concept is six weeks old in our own tree, not new**: `schema.json`
  has declared a lesson-level `restricted` boolean (asset-access prevention) since the
  2026-06-10 download; 0/12,864 records carry it; the check-restricted endpoints
  surface the same concept as an authed API. The indexed lesson document has no home
  for it; the only restriction concept in the search stack is transcript-scoped
  `legally_restricted` (ADR-109). If a refreshed export starts populating it, every
  lesson record fails the `.strict()` parse and ingest aborts loudly at read time —
  which makes the fresh download's parse outcome the cheapest discriminator for the
  whole MCP-153 question (no ES touch, no rollback spend, no go-moment).
- **A silent partial delivery already sits in the committed baseline**: the download
  script requests 32 subjects; the manifest records 31 files = 30 subjects +
  schema.json; `rshe-pshe-primary` and `rshe-pshe-secondary` are requested, README-
  expected, and absent — from the manifest, from disk, and from anything that could
  have noticed (`writeManifest` reads `readdir`, never the request; the manifest has
  zero readers). Whether the deployed index lacks RSHE/PSHE content is now MCP-153's
  most specific pre-flight probe target (To-verify, operator-run).

### Instruments and records (the process seam)

- The OpenAPI drift check's referent is "canonicalised texts differ" — one boolean, no
  classification, four silent-pass paths, always exit 0; and because `info.version` is
  commit-suffixed it flips on any upstream commit. Its CI step sits inside the `build`
  job that three later jobs `needs:` — its advisory polarity survives only because the
  script never exits non-zero (PDR-126 context for any new check's polarity).
- The canary test (`meta-examples-roundtrip.integration.test.ts`) covers ONE tool's
  example values. The thread record's description of it was wrong twice: it never
  asserted `[100]` (git blame: `[10]` since 2026-04-10), and its "cause unestablished"
  green was established in git all along (`f02a7ba1b`, 2026-06-30, deliberately aligned
  `[50]`→`[0]` with rationale in the commit body). **Falsifiable prediction**: the next
  regen turns line 31 RED (`[10]` vs live `[20]`) — same shape, same blind-fix
  temptation; the correct disposition is a documented alignment, never a blind edit.
- The stale-record class is real and measured: the runbook's "bulk schema.json not
  committed / still gitignored" claim was falsified 3h24m after it was written (commit
  `2fffb80ff`, a cross-lane WIP snapshot, un-ignored and committed schema.json +
  manifest.json on 2026-07-01); the active plan, the thread record, and
  `bulk-downloads/README.md` ("Only the .gitkeep and README.md are tracked") repeat
  variants of it; `last_reviewed` frontmatter is bound by no validator. The class:
  permanent documents asserting mutable repo state with no binding to that state.
- Sandbox is not a fidelity rehearsal for production ingest: `sandbox-ingest` (live,
  registered) builds documents through the API-shaped path while `versioned-ingest`
  goes through the bulk transformer — different field-extraction paths into the same
  builder. A green sandbox run is not evidence about primary-path document correctness.
- The "assert-then-discard across 12 generator sites" extrapolation was cut down in
  synthesis to two confirmed families (ES mappings, bulkgen) — the micro-check that
  suggested twelve was methodologically broken and its result is not carried.

## 3. Assumptions and inherited shapes that changed

1. "Additive + prose-only delta" → additive at spec-structure level, **agent-facing
   contract change** across every limit-bearing tool, plus three structurally novel
   shapes the generator has never seen.
2. "The bulk templates are the schema-first violation to fix by deriving from
   schema.json" → **inverted**: the templates are structurally correct; schema.json is
   the wrong document (right only on vocabulary). WS3's "derive from schema.json"
   as-written would reject 100% of real data.
3. "MCP-152's risk is type breaks / consumer chasing" → the type layer is mostly
   silent; the risks are product-level (uncallable tool, false read-only labelling,
   wrong descriptions) and the one loud compile failure is well-placed.
4. "The delta may require index regeneration" → nothing in the delta reaches an indexed
   field; the real index question is data vintage (six weeks) + the restriction
   concept's product status + a baseline that silently lacks two requested subjects.
5. "Add a bulk drift check" → the first instrument the bulk surface needs is
   **request-vs-result reconciliation** (the defect that has already fired), and any
   schema check must name its referent (corpus-vs-templates structural, corpus-vs-
   schema.json vocabulary) or it manufactures permanent reds/greens.
6. "The 1.3 GB authenticated ZIP makes bulk checks expensive" → unverified assumption
   inherited from the script's chosen call shape; the endpoint takes a subjects array
   and a one-subject probe is untried (To-verify, one authenticated call).
7. The consumer-guard taxonomy needs three classes, not two: designed tripwire /
   silent drift / **anti-guard** (a green test that defends a defect and fails its
   cure).

## 4. Proposals (each with warrant and falsifier; none executed — exploration only)

**Decision-owning: the owner** (routed per the estate's decision discipline):

- **P1 — Rule the check-restricted MCP exposure question first.** It is a
  rights/licensing capability (bearer-auth, OGL verdict enum, copyright-blocking error
  text) wearing curriculum clothing. A "not now" ruling collapses all three MCP-152
  harm chains to zero cost and turns requestBody/non-GET/map-response support into
  schedulable capability work; a "yes" makes them a named deliverable. WARRANT: every
  harm chain is downstream of this one question engineering cannot answer; SKIPPED_PATHS
  offers no method/shape-exclusion precedent, so even "exclude it" is a policy
  extension needing a ruling. FALSIFIER: an existing ruling on exposure, or upstream
  removing bearerAuth (reframing them as ordinary public reads).
- **P2 — Rule the lesson-restriction-in-search question before any index work.**
  Upstream has declared the concept in our bulk contract since June; our generator
  drops it; the indexed document cannot express it; the deployed surface cannot filter
  on it. The engineering shape (field, filter, exclusion, or nothing) is downstream of
  the product/legal answer. FALSIFIER: an existing ruling or ADR placing lesson-level
  restriction in/out of search scope.
- **P3 — Re-point the ground-truth clause of
  `verify-data-supports-shape-before-building.md` at the bulk data files** (and say
  plainly that the co-shipped schema.json describes fields absent from the payload).
  Doctrine edit, owner-ratified. WARRANT: the rule currently directs every session to
  build on fields with zero occurrences in 635 MB — the exact failure class it exists
  to prevent. FALSIFIER: any of those fields observed in the corpus, or an owner ruling
  that schema.json is an aspirational contract to design toward.
- **P4 — Report the schema/payload contradiction upstream** (same-ZIP, four required
  fields, zero occurrences, byte-counts attached) and ask which intent holds: schema
  wrong, or fields coming. The two answers imply opposite local designs; the
  check-restricted endpoints make "fields coming" credible. External communication —
  owner call. FALSIFIER: a fresh download whose schema validates its own data (defect
  already fixed).
- **P5 — Decide whether the generator should enforce upstream `maximum`** (currently
  prose-only across 29 tools, moved twice unenforced). Enforcing it is a generator
  change with client-rejection consequences; leaving it is a standing contract fiction.
  FALSIFIER: an existing ruling that unenforced bounds are deliberate.

**The MCP-152 landing shape (the "better solution" the owner asked for — no
type-chasing anywhere in it):**

- **P6 — One throwaway artefact-diff probe before any landing**: regenerate into scratch,
  diff, discard, commit nothing. Deliverable = every failure classified into three named
  buckets: (1) generator-cannot-model (requestBody, non-GET annotations, map response);
  (2) designed tripwire, discharged by reviewed classification (served-surface
  totality); (3) anti-guard, re-referented before any generator change (the
  readOnlyHint assertion). The bucket assignment IS the output; a bucket-2 compile
  error is the system working. WARRANT: three load-bearing unknowns (does the Zod fail
  tsc; does the TS `{}` ship; what does openapi-typescript emit) have no in-repo
  precedent and cannot be settled read-only. FALSIFIER: the regen picks up nothing new
  (which would falsify the whole blast-radius model).
- **P7 — Re-referent the anti-guard test before any generator change** (assert the
  annotation matches the method, not `true` unconditionally) — a guard-layer edit,
  prerequisite to correctness, not a consumer type edit.
- **P8 — Review the agent-facing artefact byte-diff as MCP-152's primary review
  object** (tool JSON-schema + description bytes), not the TypeScript diff — the type
  diff reads near-empty while every limit-bearing tool's client-visible contract
  changes. Sequence the description-only change as its own trivial landing.
- **P9 — Land by pathspec partition as the STOP observable**: a legitimate regen commit
  confines itself to `{schema-cache/**, code-generation/**, src/types/generated/**}`
  (+ the named bucket-2/3 discharges); any other file in the commit is the rabbit-hole
  tripwire firing. Untested shape — validated or falsified by P6's probe.
- **P10 — Route the GET-side content defects upstream** (copy-pasted description,
  swapped offset/limit prose, phantom Link-header claim — the last is estate-wide and
  pre-existing); schema-first bars local edits; the `schema-enhancement-404` decorator
  precedent is the only local alternative if the owner prefers it.

**The MCP-153 shape:**

- **P11 — Make the fresh download's strict parse the first act and the decision
  instrument**: run download + `readAllBulkFiles` only. Clean parse ⇒ upstream field
  set unchanged ⇒ the index question collapses to data vintage + P2's answer. ZodError
  on an unknown key ⇒ upstream began emitting (likely `restricted`) ⇒ product
  conversation before any ingest. Costs one download; touches no index; spends no
  rollback slot. FALSIFIER: the download script normalising records before the parse.
- **P12 — Build request-vs-result reconciliation as the bulk surface's first
  instrument** (the defect that has already fired), ahead of any schema check; and scope
  any schema check to one named referent per axis (structural: corpus vs generated Zod;
  vocabulary: corpus vs schema.json enums) with the narrowing written at the
  instrument (the `INDEXING.md:87` house pattern). New checks land strict per PDR-126.
- **P13 — Do NOT build a schema.json freshness diff this cycle** (currency is not the
  failure mode; it would report all-clear on a never-true document). Named reversal
  condition: upstream confirming schema.json is generated from the payload source.
- **P14 — Probe a single-subject bulk POST once** (authenticated, cheap) to falsify the
  "1.3 GB or nothing" assumption before designing any recurring check.
- **P15 — Harvest schema.json's enums as the one thing it is right about**: owner
  conversation on narrowing the seven vocabulary fields from `z.string()` to `z.enum`
  at the generator (39 strings today; the type-chasing ban makes the scope call
  owner-first). FALSIFIER: evidence the vocabularies are open-ended upstream.
- **P16 — Record that sandbox-ingest is not a production-path rehearsal** at the
  lifecycle doc's sandbox section (a live referent-narrowing trap for regen rehearsal).

**Records (the re-true sweep, riding execution):** the runbook's bulk rows + delta
recipe (add a parameter-values leg), the active plan's WS3.2 line, the thread record's
canary item (falsified twice over), `bulk-downloads/README.md`, and the stale-docs
class finding (population unknown — count before designing any validator; the
INDEXING.md pointer discipline may suffice).

## 5. Unresolved evidence that could change the synthesis

1. Whether a fresh bulk download parses clean / still ships the contradictory
   schema.json / restores rshe-pshe (one authenticated download; settles most of the
   bulk seam).
2. Whether the regenerated Zod actually fails tsc, whether the TS `{}` reaches a
   shipped artefact, and what openapi-typescript emits for the map shape (P6's probe).
3. Whether the deployed index contains RSHE/PSHE content; the live `oak_meta` version /
   previous_version and the real rollback budget (operator-run probes).
4. Whether the check-restricted verdict enum is semantically the bulk `restricted`
   boolean or a narrower OGL distinction (upstream question).
5. Whether upstream intends `maximum` 300 as a client capability or an internal bound.
6. Whether upstream's current ZIP still ships the never-true schema (vs already fixed).
7. The unswept adversarial classes on Seam A (registration-time false-greens,
   OAuth/scope emission for a body-bearing tool, response-map operationId collisions —
   no uniqueness check exists in zodgen-core).

## 6. Fleet process notes (honest bounds)

- 334 agents; 4 of 306 micro-checks died (explicit placeholders, no silent loss); Seam
  A's adversarial Sonnet returned a schema-valid but content-free placeholder — caught
  at synthesis because the lead READ the content; its partial self-substitute produced
  the anti-guard finding, so the unrun sweep was demonstrably not redundant. Lesson for
  fleet authors: schema-forced output validates shape, not substance; synthesis stages
  must read, not trust.
- Two fleet-internal corrections prove the critical-assessment layer worked: the
  "requestBody ×14" figure (Opus frame) was falsified at synthesis; the guide seat's
  own "additive + prose-only" classification was falsified by a Seam-D micro-check and
  re-verified first-hand.
- The exploration's sharpest single instance of its own subject matter: the Seam B lead
  declared the data question unsettleable without a download while 635 MB of the data
  sat in the primary checkout — a worktree's untracked absence is not the estate's
  absence.

## Related records

- Tickets: MCP-152, MCP-153 (contracts quoted in the session plan).
- Thread: `.agent/memory/operational/threads/upstream-api-alignment.next-session.md`
  (correction entry dated 2026-07-26 points here).
- Runbook: `docs/engineering/upstream-api-alignment-runbook.md` (amendments proposed
  above, not yet applied).
- Heritage mined: the active alignment plan's WS3 block;
  `semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md`
  (now known to describe a schema that was never true of the payload — period piece);
  ADR-093; ADR-067 (derivation claim does not hold); ADR-109; ADR-130; PDR-126.

_Record locations, 2026-09-06: of the thread records named above by their paths of the
time, those the 2026-09-06 consolidation paused moved under
`.agent/memory/operational/threads/paused/` (the threads README's lifecycle layout; the
paused index in `repo-continuity.md` names each); a record still active keeps its root path
under `.agent/memory/operational/threads/`; the paths here are the historical ones._
