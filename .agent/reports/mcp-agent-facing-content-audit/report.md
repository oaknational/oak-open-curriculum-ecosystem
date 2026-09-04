# Oak MCP agent-facing content — audit & registry report

**Date:** 2026-07-09 · **Delta-refreshed 2026-07-22** (MCP-103 phase a — see [§12](#12-delta-refresh--workspace-shape-recommendation-2026-07-22--mcp-103-phase-a))
**Status:** Historical audit baseline plus generated current-source projection.
**Companion files:** [`registry.md`](./registry.md) (historical human index) · [`registry.json`](./registry.json) (phase-(a) audit registry as maintained on main, 717 items) · [`current-source.json`](./current-source.json) (generated current source, additions, lineage, custody, word authority, item-evidence summary, and HTTP registration evidence) · [`current-source-anchors.json`](./current-source-anchors.json) (machine-verifiable evidence for each current baseline item) · [`current-source-delta-inventory.json`](./current-source-delta-inventory.json) (recomputed post-baseline file-and-item inventory, including explicit reviewed exclusions) · [`rendered-wholes.md`](./rendered-wholes.md) (historical assembled surfaces) · [`content-registry.html`](./content-registry.html) (historical filterable browser).

---

<!-- current-source-summary:start -->
> **Current-source refresh (MCP-103 phase c):**
> `current-source.json` accounts for all 717 immutable phase-(a) `C` ids and 11 governed post-baseline additions.
> Its 665 available baseline dispositions and 11 additions carry reviewed token evidence; 52 baseline rows are explicitly retired.
> Revisions: 478 unchanged, 0 expanded, 118 modified, 68 relocated, and 12 added.
> Workspace scope is 612 in / 116 upstream-API out; word authority is 601 workspace, 116 API, 2 skills, and 9 external.
> The HTTP root is also walked through initialize, tool/resource listing, resource reads, and prompt absence. Host delivery is not inferred.
<!-- current-source-summary:end -->

## 1. Purpose and stance

This report and its registry make **all repo-controlled content that can reach an MCP consumer trivially discoverable and auditable** — so that the right experts (pedagogy, curriculum, legal, safety, UX) can *see* and review the content Oak puts in front of agents, independently of the code it is buried in.

What this is **not**, deliberately:

- **Not a wording validator or approval gate.** The phase-(c) validator protects item-level source evidence, total accounting, explicit lineage, independent custody/authority classification, and observed registration drift. It does not promote current wording to approved or canonical content. Much of that wording evolved organically and still needs pedagogical, editorial, legal, safety, and UX review.
- **Not an eval harness.** Behavioural evaluation is a later, separate decision (see §9).
- **Not the workspace build.** The content-workspace direction is now owner-DECIDED (§7 records it), but this report only records those decisions — nothing is restructured, built, or migrated here. The build is a separate, owner-scheduled session.

The immediate deliverable is **visibility**.

## 2. What counts as in scope (boundary)

In scope: content **authored or controlled in this repo** that reaches an MCP consumer (an agent, or its human user) and can shape behaviour — server instructions, tool/resource titles & descriptions, parameter descriptions, tool guidance, MCP prompts, response-format templates, error/empty/refusal copy, attribution, orientation content, landing-page and widget UI, auth/consent copy, discovery metadata.

Exempt: **raw curriculum data bytes** fetched from the Oak Open Curriculum HTTP API or the bulk export (lesson/quiz/unit content). The exemption's precondition is "the bytes came from the API/bulk export".

Three refinements, per owner rulings during the audit:

1. A **response template that interpolates exempt data is in scope** — the template is ours; only the interpolated value is exempt.
2. Content our **tools deliver that we author** (the curriculum model, the simple public-API ontology) is in scope, even though it describes curriculum.
3. A **verbatim copy of external data we cannot change** (the EEF Teaching & Learning Toolkit corpus; anything imported unchanged from the `oak-curriculum-ontology` repo) is exempt — but the **framing we author around it** is in scope. Where provenance was unprovable from the file, the item was **surveyed and flagged**, never dropped.

## 3. Method and confidence

- **Two-pass exhaustive extraction.** Pass 1: 17 parallel readers over every content-bearing slice of the SDK `mcp/` layer, the app, and the codegen layer (452 items). Pass 2: 5 readers filling a gap the completeness critic found — the 29 generated tool descriptions, their codegen authoring templates, and app-side error/consent copy (264 items). Combined and de-duplicated: **716 items across 143 files**.
- **Adversarial verification.** Every claim relied upon here was checked first-hand against source. The subagents were caught in two errors (a tool count of "~38" that is actually 29; a fabricated-looking path pair that in fact existed — my own truncated listing, corrected). Treat subagent-only claims as *reported*; claims marked *confirmed* below were verified directly.
- **Enrichment is deterministic.** `review_domain`, `extraction_kind`, and the risk `flags` are derived by rule from each item's surface type, provenance, and path (scripts in the session scratchpad; rules documented in the registry). They are a **lens, not ground truth** — a few items are genuinely multi-domain and were assigned a primary.
- **Known residual tail (no silent caps).** Two tiny surfaces remain lightly covered: `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts` (the authoritative OAuth scope labels) and the rendered `AI-REFERENCE.md` catalogue emitted by `generate-ai-doc-catalog.ts`. Both are named here rather than silently omitted.

### 3.1 How generators, functions, and cohesive wholes are represented

The registry's unit is **authored content, not code**. This has three consequences a reader should know:

- **A content-bearing function appears as the text it emits, not as a symbol.** `generateServerInstructions()`, for example, is captured as its emitted parts — the scaffold/template (C053), the hand-authored "fully sequenced" paragraph (C054), the "under-the-hood" paragraph (C055), and the `AGENT_SUPPORT_TOOL_METADATA` fields it interpolates (C049–C052) — plus the downstream export `SERVER_INSTRUCTIONS` (C006). The same holds for `generateContextHint()` (C056), the codegen description assembly, and the response formatters. Splitting a generator into its authored fragments is deliberate: those are the parts a reviewer edits.
- **Pure machinery is correctly absent.** Functions with no authored agent-facing text — `isAgentSupportTool`, `getSeeAlsoForTool`, `typeSafeValues`, the `toToolDescription` concatenation helper — emit no content and are not in the registry. Their *output* (the tool descriptions) is captured; their logic is not "content".
- **Cohesive wholes are shown assembled, not only as fragments.** Because the registry lists a delivered surface as its authored parts, a reviewer also needs the surface as an agent actually receives it. [`rendered-wholes.md`](./rendered-wholes.md) provides that: the assembled server instructions, per-response hint, all 42 tool definitions, the 7 prompt workflow messages, and the doc/curriculum-model/EEF resources — **rendered directly from the built SDK** (exact where deterministic; `{{placeholder}}` where a value is supplied at runtime, e.g. a user prompt argument or interpolated curriculum data). The registry is the itemised inventory; `rendered-wholes.md` is the meaning-preserving companion for review.

The deterministic generators live in [`generators/`](./generators/): `build-registry.mjs` (audit output → `registry.json`, the durable snapshot), `build-registry-md.mjs` and `build-registry-html.mjs` (→ `registry.md` / `content-registry.html` from `registry.json`), and `render-wholes.mjs` (→ `rendered-wholes.md` from the built SDK). `registry.json` is the SSOT of this snapshot; the views regenerate from it.

## 4. What the corpus is — four layers, split ownership

The content is **not one surface with one owner**. It spans four layers:

| Layer | Location | Authored by |
| --- | --- | --- |
| SDK `mcp/` | `packages/sdks/oak-curriculum-sdk/src/mcp/**` | this repo |
| Codegen | `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/**` and its generated `.../mcp-tools/tools/*.ts` (29 tools) | this repo *transforms* upstream OpenAPI base text |
| App | `apps/oak-curriculum-mcp-streamable-http/src/**` (+ `widget/src`, landing page) | this repo |
| Sibling SDK | `packages/sdks/graph-corpus-sdk/.../eef-toolkit.external-data.ts` | **external EEF** copy + embedded Oak editorial framing |

The single most consequential structural fact: **the highest-leverage content — the per-tool descriptions — is split-ownership.** Each generated tool's `description` is the upstream OpenAPI `summary` + `description` (transformed here: `This endpoint`→`This tool`, whitespace collapsed) **plus** in-repo authored injections (the `PREREQUISITE: call get-curriculum-model first` line on authenticated tools; per-tool notes; the title-cased annotation). To iterate the biggest lever, the change path is partly the **oak-api OpenAPI spec**, not this repo — which ties directly to the standing roadmap item to integrate the oak-api repo.

### 4.1 Source locus — where a reviewer must go

Every item carries a `source_locus` so a reviewer is never left guessing which repo owns the words. **This is distinct from the exemption boundary:** content can be sourced from the upstream API and still be fully in scope and reviewable — it is only *curriculum data bytes* that are exempt, not API-authored *metadata* such as tool and parameter descriptions.

| Source locus | Items | Where the reviewer goes |
| --- | ---: | --- |
| `this-repo` | 589 | authored here — review in this repository |
| `upstream-in-house-api` | 116 | **Oak Open Curriculum API (OCA) OpenAPI spec — in-house `oaknational/oak-api`.** Authoritative source `https://open-api.thenational.academy/api/v0/swagger.json`; a **committed local snapshot** is readable at `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`. Base tool/param prose is authored upstream; to change it, change the spec. The "bulk download" is **not** a separate source — it is the same OCA data from the same repo, presented differently (different metadata focus) |
| `external-third-party` | 9 | **EEF Teaching & Learning Toolkit — external.** Cite, do not rewrite; review citation accuracy + any Oak editorial framing |
| `upstream-in-house-skills` | 2 | **Oak Skills — in-house `oaknational/oak-skills`.** The `lesson-planning` (C198) and `curriculum-mapping` (C201) prompt workflows are *derived/adapted* from named skills (`oak-lesson-builder`, `oak-curriculum-mapper`); the authoritative pedagogy workflow lives there |

Every non-`this-repo` locus is **in scope and reviewable** — the locus tells a reviewer *which repo owns the words*, never where underlying data comes from. Each in-house upstream is a different Oak repo, not an external party (only EEF is external): the base tool/param prose lives in the **Oak Open Curriculum API (OCA)** spec in `oak-api` (with the committed schema-cache as a read-only local copy; the bulk export is the same OCA data/repo presented differently, not a distinct source); two prompt workflows are adapted from `oak-skills` skills and must be kept in step with them. Two words-vs-data distinctions the locus deliberately encodes (PR #337 review): generated tool **annotation blocks** are authored by *this repo's* generator (`emit-index.ts` hard-codes the hint values), so they are `this-repo` even where the surrounding description is OCA-based; and the `OAK_KG` **attribution wording** (C009) is authored locally (`this-repo`) even though the knowledge-graph *data* derives from `oaknational/oak-curriculum-ontology` — that data relationship is recorded in the notes below, not as a locus. (Owner-floated future rename, not adopted: "Open Resource Curriculum API" → **Orca**.)

Two provenance notes the per-item count understates:

- **Knowledge-graph corpora.** The graph tools (`get-keyword-graph`, `get-misconception-graph`, `get-prior-knowledge-graph`, `get-thread-progressions`) serve corpus content that derives from the Oak Curriculum Ontology (via `graph-corpus-sdk`) — but the delivered graph *nodes* are runtime data, not authored strings, so they do not appear as registry items; only their attribution (C009) and their in-repo tool *framing* (this-repo) do. Reviewers of graph *facts* should nonetheless consult `oak-curriculum-ontology`. (The vocabulary the graph tools use is derived at codegen time from the OCA bulk export — the same OCA data/repo, a presentation of it, not a separate source.)
- **`ontology-data.ts` is not a copy.** It is a repo-authored *simple* ontology for the public-API surface (this-repo), explicitly distinct from the fuller official ontology in `oak-curriculum-ontology` — its subject/key-stage slug lists derive from the generated OpenAPI schema, its display names/exam-boards/pathways are hand-authored here. Reviewers get the authored model here and the authoritative fuller ontology in that repo.

## 5. Classification

### 5.1 By review domain (who should audit)

| Review domain | Items | What it is |
| --- | ---: | --- |
| tool-usability | 304 | How an agent discovers/uses tools — titles, descriptions, param descriptions, prerequisite/orientation directives |
| recovery-copy | 151 | What the agent receives on failure/empty — validation, empty-state, degradation; shapes recover-vs-fabricate |
| engineering-structural | 90 | Annotations, schemas, scopes, discovery/branding metadata |
| pedagogy | 99 | Prompts, orientation, curriculum-model doctrine, EEF interpretation — **education-expert target** |
| other | 2 | Mixed/uncategorised |
| curriculum-accuracy | 27 | The authored conceptual model — ontology, domain concepts — **curriculum-expert target** |
| legal-licensing | 19 | Attribution, OGL v3.0, trademark, EEF-citation obligations |
| pedagogy-external | 8 | External EEF corpus (exempt) that is pedagogy-relevant and carries Oak editorial framing |
| ux-accessibility | 16 | Human-facing landing page, widget, auth/consent copy (WCAG 2.2 AA applies) |

**The education-expert reviewable slice = pedagogy (99) + curriculum-accuracy (27) + pedagogy-external (8) = 134 items.** This is the set that can be handed to Oak's education experts without asking them to read TypeScript — the direct enabler of the stated goal.

### 5.2 By extraction kind (the i18n movability question)

| Extraction kind | Items | Movable to a content catalogue? |
| --- | ---: | --- |
| leaf-authored | 418 | **Yes** — pure authored strings; the i18n-extractable core |
| generated-from-openapi | 130 | No — base text transformed from upstream OpenAPI; would *invert* (generator reads the catalogue) |
| authored-template | 98 | Partly — the sentence frame extracts; the interpolated data stays |
| generated-from-repo-code | 26 | No — emitted by a repo generator; stays generated |
| authored-framing-of-external | 35 | The framing yes; the wrapped EEF corpus no |
| external-copy | 9 | No — verbatim external data; can be cited, not rewritten |

## 6. The i18n / localisation reframe

The productive framing (owner's): this is like internationalisation, except the "translation" is **into safer, more rigorous, more intentional forms** rather than between languages. i18n works by extracting hardcoded strings into a structured, reviewable message catalogue that domain specialists (translators) can work on without touching code. The same move here would let pedagogy and curriculum experts review and improve agent-facing content directly.

The reframe is sound, **and its limit is the single most useful design input in this report**: this corpus is not uniformly leaf strings.

- The **418 leaf-authored items are genuinely i18n-shaped.** Prompts, orientation, guidance prose, per-tool notes, attribution, and error/empty copy could be lifted into a catalogue as-is.
- The **156 generated items (130 OpenAPI + 26 repo-code) are not.** They are emitted by generators that are, by this repo's cardinal rule, the source of truth. A naive "extract all strings" would break `schema-first` and lose the generation logic. In a catalogue model these would **invert**: the generator would consume authored copy *from* the catalogue, rather than the catalogue being scraped from generated code.
- The **98 templates** split: the authored frame is catalogue-able, the interpolated data is not.
- The **44 external items** (framing + copy) split along the boundary already established: rewrite the framing, cite the corpus.

So any future "content workspace" is not one uniform extraction. It is (at least) three distinct relationships: *own* (leaf), *invert* (generated), and *wrap/cite* (external). Designing as if it were uniform is the main risk to avoid.

## 7. Content workspaces — decided direction (owner, 2026-07-09)

The audit's neutral A/B/C framing is superseded. The owner has set the direction; it is recorded here as the standing decision.

**Decisions:**

1. **Review will happen** — it is committed, not conditional. The design's job is to *operationalise* it, not to justify it.
2. **A variety of reviews, by content intent + audience — not one monolithic "content review."** This is the `review_domain` dimension: pedagogy, curriculum-accuracy, legal-licensing, safety, ux-accessibility, etc., each with its own reviewer and protocol.
3. **Content Oak controls moves into separate content workspace(s)** — chosen deliberately to *lower the cognitive load of finding and changing it*. This overrides co-location for controlled content: it is a product surface, not incidental plumbing.
4. **Stratify by impact/risk, and require protocols for the high tier.** Within the content workspace(s), **high-impact / risky** content is separated from **simple string config** (UI, branding). High-impact content **must** carry **review protocols and eval protocols**; simple config need not. The registry now carries an `impact_tier` field: **697 high-impact, 19 simple-config** (conservative default — anything behaviour-shaping is high-impact; any risk flag forces high-impact).
5. **Upstream in-house content is highlighted, not wrapped.** Where high-impact content is imported from another in-house source (`oak-api`, `oak-skills`, `oak-curriculum-ontology`), do **not** build a pointless local wrapper — flag it (the `source_locus` field) and point reviewers to the owning repo. The eventual answer is to bring those repos into this monorepo; not now.
6. **The content workspace(s) are the SSOT, not copies.** Consumers (SDK, generators, app) read *from* the workspace. This is precisely why they cannot hold upstream content — you cannot be the source of truth for words another repo owns.
7. **Design l10n-ready (2026-07-09).** No other-language localisation now, but structure the workspace so genuine localisation can be added later without a rebuild — the leaf-authored content's catalogue shape should be able to carry translations, and the "translate into safer/more rigorous forms" review and any future language translation share the same rails.

**How the impact tier lands (per decision 4/5):** protocol weight follows *impact*, not *location*. The `impact_tier × source_locus` cut shows **116 high-impact items are authored upstream** (`oak-api`; all OCA-locus items are high-impact) plus 2 in `oak-skills` — these still require review + eval protocols, but the protocols run **cross-repo** against the assembled output / the upstream source until consolidation. "Don't wrap it" must not become "don't govern it."

**How this reconciles with "no validator yet" (§1):** the lifecycle is ordered — **review protocol** ratifies the *intended* shape → **eval protocol** measures whether the content produces good agent *behaviour* against that ratified intent → a drift-guard (if ever) comes last. Evals score behaviour; they do not freeze wording. That ordering is why requiring eval protocols (decision 4) does not contradict rejecting a shape-freezing validator.

**Open design questions this direction does not yet resolve** (for the workspace-build session, not this visibility pass):

- **The SSOT→consumer flow.** How workspace-owned content reaches the generators/SDK/app without breaking `schema-first`: the ~418 leaf items' author sites refactor to read from the workspace, and codegen pulls in-repo injections (PREREQUISITE, per-tool NOTEs) from it while base prose still comes from upstream. Note some SSOT content is *structured data that composes a string* (`AGENT_SUPPORT_TOOL_METADATA` → `SERVER_INSTRUCTIONS`), so the workspace holds parts and generation composes wholes — the reason `rendered-wholes.md` exists.
- **The partition axis.** "Workspaces" (plural) split by review regime (recommended — one reviewer + protocol per workspace, matching decision 2), with the impact/simple-config stratification *within* each — versus one workspace, or a split by consuming surface.
- **The review + eval protocol definitions.** What each domain's review cadence, reviewer role, and eval method are (decision 4 requires them; their content is a design task). **Hard requirement (owner, 2026-07-09): the eval protocols must follow strict, researched best practice, grounded in authoritative sources** — not an improvised candidate list. Agent-behaviour evaluation is a discipline with known failure modes (LLM-as-judge bias, ground-truth construction, inter-rater reliability, statistical power, data contamination, cross-model variance); a dedicated research pass on eval methodology precedes protocol design. "We have evals" is not "our evals are valid."
- **Whether simple-config also relocates** to a content workspace (stratified, no protocols) or stays co-located — decision 3's "all controlled content" reading versus decision 4's "eval-bound content" reading.

## 8. Findings for review

Presented as *candidates for the relevant expert*, not verdicts. The registry asserts what exists; quality judgement belongs to the humans this artefact is built to enable.

### 8.1 Confirmed defects (verified first-hand)

- **PII / prompt-injection surface — `classNotes` (C196, C204).** The `continue-progression` prompt interpolates teacher free-text `classNotes` directly into agent-instruction text with no delimiting or sanitisation. This is the corpus's clearest trust-boundary hole and touches the organisational "no PII" obligation. No item anywhere in the corpus describes escaping or delimiting user interpolants.
- **Shipped typos in agent-facing copy.** `kalan`→`Kalam` in the download font-install tip (C163); *"Use the **this** type…"* emitted verbatim in three asset tools' param descriptions (C507, C555, C585) — an upstream-OpenAPI defect surfaced unchanged.
- **Stale wording (C624).** Question and programme `limit` params read *"Limit the number of **lessons**… maximum of 100 lessons"* on tools that return questions — inherited from the upstream spec.
- **Consistency / drift.** The graph tools are named in `SERVER_INSTRUCTIONS` (C053–C055) but absent from the `toolCategories` arrays in `tool-guidance-data.ts`. `get-keywords` ships a rich description but bare, undescribed params. `download-asset` is annotated `idempotentHint: true` (C166) while each call mints a different short-lived signed URL — questionable for hosts that auto-retry on idempotent tools.

### 8.2 Structural risks (reported; for a review pass)

- **Duplication and context-cost.** The "call `get-curriculum-model` first" directive is restated 12+ times across five surfaces — the seed constants (C001–C003), the per-response hint `OAK_CONTEXT_HINT` (C005, C056, C062), the server instructions (C053–C055), tips, all seven prompts, and the codegen `DOMAIN_PREREQUISITE_GUIDANCE` (C455) on all 13 authenticated tools. `SERVER_INSTRUCTIONS` ships on connection and `OAK_CONTEXT_HINT` on **every** tool response; the value-vs-token trade-off is untested. Validation error strings are copy-pasted verbatim across four tool slices.
- **Editorial claims over external evidence.** `eef-toolkit.external-data.ts` mixes verbatim EEF corpus with Oak-authored superlative summaries; because the corpus is external and its acquisition path is unconfirmed in-file, both the citation accuracy and the editorial framing warrant a review (17 of the 24 boundary-flagged items sit here).
- **`user-input-interpolation` (166 flagged).** A deliberately broad heuristic superset for a safety sweep — most are benign result-framing echoes; `classNotes` is the confirmed live concern.

## 9. Gaps — what the brief did not ask for

1. **Prompt-injection defence is inverted from the framing.** Exempt curriculum data flows through the same channel as our framing; our framing is the *defence*. The corpus currently defends nothing.
2. **"Agent behaviour" is not singular.** The same content behaves differently across consuming models; any future measurement must span ≥2.
3. **Tool *selection*, not per-string quality.** The real failures are aggregate (wrong tool chosen from the whole set), invisible to per-item review.
4. **No wording-quality gate.** The current-source validator guards source accounting and registration drift; it deliberately does not freeze or approve wording. Behavioural quality still needs reviewed protocols and evals.
5. **"Good" is undefined.** Behavioural evals need a rubric; that rubric is an owner/expert decision, not an engineering default.
6. **Production telemetry is the ground truth.** Offline evals only proxy it; real signal is owner-gated on the privacy/analytics lane.
7. **Context-cost is a behaviour property.** Bloated always-on content degrades every downstream call.
8. **Split upstream ownership** (§4) — the biggest lever's change path is not local.
9. **No content SSOT or review workflow today** — 716 items, 143 files, no owner map, no route to the right reviewer. This registry is the first version of that map.
10. **Accessibility** of the human-facing surfaces (landing, widget) — WCAG 2.2 AA — is in scope for anything shipped and for any artefact built from this work.

## 10. How to use this

Start with [`current-source.json`](./current-source.json) for present source
custody, word authority, lifecycle, revision state, and the HTTP registration
snapshot. [`current-source-anchors.json`](./current-source-anchors.json) is the
technical evidence ledger behind baseline dispositions, while
[`current-source-delta-inventory.json`](./current-source-delta-inventory.json)
detects changed and newly added governed source and binds it to current item ids
or an explicit no-content review. Reviewers do not need to read the hashes, but
any source edit must still satisfy them. The older
[`rendered-wholes.md`](./rendered-wholes.md), `registry.md`, and filterable
HTML are phase-(a) visibility artefacts: useful for historical meaning and
review-domain classification, but not evidence of what the app serves now.

- **Education / curriculum experts:** start from the historical 134-item review slice — `review_domain` of `pedagogy`, `curriculum-accuracy`, `pedagogy-external` in [`registry.md`](./registry.md) — then use each `C` id in `current-source.json` to find its current source or explicit retirement.
- **Legal:** the 19 `legal-licensing` items (attribution, OGL, EEF-citation).
- **Safety:** the `user-input-interpolation` and `pii-adjacent` flags, starting with `classNotes`.
- **Reviewers of tool/parameter wording:** filter `source_locus`. The 116 `upstream-in-house-api` items are reviewed and edited in the **`oak-api` repo** (OpenAPI spec), not here — the committed snapshot `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json` is the read-only local copy of that base text; the in-repo injections around them (PREREQUISITE, per-tool notes) are separate `this-repo` items.
- **Engineers:** `registry.json` is the immutable audit baseline; `current-source-anchors.json` proves each current item; `current-source.json` is the recomputed source/registration projection. Run `pnpm --dir agent-tools validate-mcp-content-current-source` to check drift. `refresh-mcp-content-current-source-anchors` is an explicit compliance-review operation for intentional item edits or moves, not a routine formatting step. The confirmed defects in §8.1 are historical findings and must be rechecked against current source before action.

## 11. Reserved decisions

The direction is decided (§7). What remains open, to be surfaced to the owner as explicit question cards when each becomes live (not buried in prose):

- **Localisation — DECIDED 2026-07-09: safer-forms now, l10n later.** No other-language localisation happens now, but the content workspace(s) are designed **l10n-ready** — a catalogue structure that can accept translation later without a rebuild. Optionality is preserved up-front; the rigour/safety review and any future translation share the same rails.
- **Eval best-practice research — DECIDED 2026-07-09: do both, gated on owner go.** A foundational authoritative-source pass on eval methodology **and** build-session grounding against concrete content are both wanted — but **not started**; they wait for an explicit owner go-ahead.
- **Workspace partition axis** — resolved to a recommendation 2026-07-22: [§12.2](#122-recommendation-one-content-workspace-views-not-partitions-owner-decides) recommends **one workspace with per-domain views** and engages this bullet's earlier per-review-regime lean directly; the owner decides. *(This bullet's 2026-07-09 "recommended" tag is superseded by §12.2.)*
- **What relocates** — all controlled content stratified by impact tier, vs only high-impact/eval-bound content with simple config left co-located. *(Build session.)*
- **The SSOT→consumer flow** — the generator-inversion mechanism (engineering design, §7). *(Build session.)*
- **This registry's permanent home** and how it is kept current (this copy is a manual snapshot; the SSOT direction would make it generated from the workspace).

## 12. Delta-refresh + workspace-shape recommendation (2026-07-22 — MCP-103 phase a)

The registry was delta-refreshed against the 2026-07-22 owner rulings (the release decisions register: D2, D11, D12; delivery tickets MCP-101, MCP-102). The audit snapshot itself (item ids, classification, original counts) is unchanged; two fields were added — `workspace_scope` on every item, `ruling_note` on ruled items — and the full delta list lives in the registry meta (`registry.json` → `meta.refresh_2026_07_22`, rendered in [`registry.md`](./registry.md) §Delta-refresh). In brief:

1. **D12 scope cut, predicated on upstream ownership** — the 116 items whose words are owned by the upstream Oak Open Curriculum API spec (`source_locus: upstream-in-house-api`) are **out** of the content workspace (upstream owns those words; generated files are never hand-edited). They remain registered, marked `out-upstream-api`, so the map to the owning repo survives. The 14 in-repo codegen-authored tool-annotation blocks (`generated-from-openapi` but `source_locus: this-repo` — the C607 family) stay **in**: their emitted files are never hand-edited, but the words are authored by this repo's generator, so their review path is the generator source (§4.1's words-vs-data note). *(Refined at PR #476 round 1 — the first cut used extraction kind alone and over-excluded these 14.)*
2. **D11 zero prompts** — the MCP prompt primitive unregisters entirely; the seven workflow bodies re-home as **agent resources**: the navigation three (find-lessons, explore-curriculum, learning-progression) live, the creation-oriented four (lesson-planning, adapt-lesson, curriculum-mapping, continue-progression) retained dormant behind the MCP-101 allowlist. 43 items annotated, including the landing page's prompt-catalogue section.
3. **D2 under-the-hood KEEP** (ratified 2026-07-22) — 17 items annotated (13 tool-file surfaces plus the 4 registered-resource entries); the surface remains served.
4. **Getting-started guidance (MCP-102)** joins as a forthcoming first-class content class — served guidance covering the Oak-branding prohibition, standards for generated materials, request-refusal criteria, and safety/safeguarding response criteria; authored by non-engineers on templated authoring surfaces, then ingested, sanitised, and served (a release gate, D5). It carries no items yet; its pipeline lands **into** the workspace shape, not beside it.
5. **Live-vs-dormant is a derived dimension** — once the MCP-101 visible-surface allowlist exists, the workspace's live view derives from it; the registry records ruled target state, dated, not runtime truth. (At refresh time the code still registers prompts and no allowlist module exists.)

### 12.1 What the deltas do to the workspace problem

The 2026-07-09 analysis (§6) warned that the corpus spans three relationships — *own* (leaf), *invert* (generated), *wrap/cite* (external) — and that designing as if it were uniform was the main risk. The deltas materially simplify that picture:

- The in-scope corpus is now **600 items**, of which 418 are leaf-authored (the genuinely catalogue-shaped core). The education-expert slice (134) is untouched by the cut.
- The **hardest inversion class is gone**: the OCA-owned tool text (116 items) was the case where a catalogue would have had to drive an upstream-fed generator. What remains of *invert* is in-repo generated content — the 26 `generated-from-repo-code` items plus the 14 codegen-authored annotation blocks — spread across **several distinct in-repo production mechanisms**, not one family: the SDK instruction/metadata builders (`agent-support-tool-metadata`, `prerequisite-guidance`, `ontology-data`, `scopes-supported`), the codegen emitters and their per-tool outputs (`mcp-tool-generator`, `ai-doc-render`, `emit-index` annotations), the widget bundle, and the auth-metadata builder. Each is a migration seam the build session must inventory separately. The load-bearing simplification is that **every remaining seam is in-repo** — no catalogue-drives-upstream-generator design is needed anywhere.
- A **new content class arrives with its own non-engineer pipeline** (MCP-102): authored outside the repo, ingested, sanitised, served. Whatever shape the workspace takes must absorb an externally-authored class as a first-class citizen, not an exception.
- **Live/dormant becomes a rendered property** (from the allowlist), not an authored one — the workspace needs a *view* dimension, not a storage partition, for it.

### 12.2 Recommendation: one content workspace, views not partitions (owner decides)

**Recommendation: a single content workspace, internally organised by content class, with per-review-domain views, impact stratification, and live/dormant rendered from the allowlist.** Not a collection of per-domain workspaces. Rationale:

1. **The reviewer experience is a view problem, not a topology problem.** The named persona (a safety and compliance officer who has never seen a TypeScript file) needs a complete, plain-English, per-domain view with provenance and diffs. All of that is a rendering product over one catalogue. Splitting the *storage* by review regime adds nothing the views don't already give — and every extra workspace multiplies exactly the engineering scaffolding (package manifests, tsconfigs, CI wiring) the persona should never meet.
2. **The domain taxonomy is still moving; repo topology is the most expensive place to pin it.** This refresh alone re-statused 43 items and re-scoped 116 — and its own scope predicate was refined within one review round. The 2026-07-09 domain counts shifted the same week they were tabulated. Encoding today's review-domain split as workspace boundaries would make every future reclassification a file-move across packages; a tag in one catalogue moves with one diff.
3. **Multi-domain items are real** (§3 records that some items were assigned a *primary* domain by lens, not by nature). A per-regime workspace forces single-homing at the package level; a single catalogue carries multiple domain tags honestly.
4. **The three content relationships are mechanism differences, not reviewer differences.** *Own / invert / wrap-cite* are properties of how content reaches its serving surface — already encoded per item (`extraction_kind`, `source_locus`). They belong in the item schema, not in workspace boundaries.
5. **The incoming MCP-102 class settles the marginal case.** A collection would force choosing which workspace a brand-new class belongs to before its content exists. A single workspace with a `content class` field absorbs it without a structural decision.
6. **Review protocols bind to views, not workspaces.** §7's earlier lean ("several workspaces split by review regime — one reviewer + protocol per workspace") is fully served by named per-domain views, each with its reviewer and protocol. The protocol-per-domain requirement (decision 2/4) never needed workspace-per-domain; it needed an enumerable, complete, per-domain surface — which a view is.
7. **l10n-readiness (decision 7) points the same way**: internationalisation practice is one catalogue with locale/variant dimensions, not per-domain catalogues.

The one split that remains architecturally right — per this repo's framework/consumer principle — is **mechanism vs content**: the generic catalogue/view/diff machinery is reusable tooling; the Oak content itself is the single content workspace this recommendation names. That is a two-layer separation, not a collection of content workspaces.

**This recommendation decides nothing.** The owner decides the shape (single vs collection); the build (phases c/d — workspace scaffold, migration, review affordances) follows that decision. The §7 open questions not touched by this refresh (the SSOT→consumer flow for the remaining in-repo generator family; whether simple-config relocates; the review/eval protocol definitions with their researched-best-practice bar) remain open for the build session.

## Appendix — governing ADRs

The surface is shaped by, among others: ADR-037 (embedded tool information), ADR-050 (tool-layering DAG), ADR-058 (context grounding for AI agents), ADR-059 (knowledge-graph for agent context), ADR-060 (agent-support-metadata system), ADR-107 (deterministic SDK / NL-in-MCP boundary), ADR-123 (MCP server-primitives strategy), ADR-189/135 (capability taxonomy), ADR-191 (deterministic data surface; the agent is the only reasoner), ADR-193 (egress membrane), ADR-195 (graph tools as a first-class category). These are the design rationale a content review should read alongside the content itself.
