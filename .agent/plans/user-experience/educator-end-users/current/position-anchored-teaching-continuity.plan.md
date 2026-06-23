---
status: ready-for-execution
created: 2026-06-11
collection: user-experience/educator-end-users
implementer: >-
  Smouldering Stoking Hearth (owner-named 2026-06-11, ~10:58Z, in the
  authoring session: "your job is planning, theirs is implementation").
  Planning by Oceanic Flowing Harbour (e05bf4); execution claims open at the
  implementer's hand per §Lifecycle.
readiness: >-
  Reviewers run 2026-06-11 at authoring: assumptions-expert (not-ready ->
  conditions absorbed: the stale item-5 sequencing removed [claim closed at
  PR #175 mid-review]; the NC verify-and-ground item INVERTED — the field IS
  served via UnitSummaryResponseSchema -> get-units-summary, the plan
  author's original zero-hits grep used the wrong directory) and mcp-expert
  (ready-with-conditions -> all four absorbed: four registration surfaces
  named incl. prompt-schemas.ts + register-prompts.ts; explicit test
  enumeration incl. the 6->7 count assertion; ADR-123 reconcile-drift scope;
  single-anchor-mode misconception instruction + test). Every load-bearing
  reviewer claim re-verified first-hand before absorption.
todos:
  - id: w1-c0-owner-design-gate
    content: >-
      COMPLETED 2026-06-11 (owner, via AskUserQuestion in the authoring
      session): NEW PROMPT ratified — a seventh prompt owning ONLY
      position→next resolution, chaining into lesson-planning; argument set as
      recommended (subject, yearGroup, justCovered required; classNotes
      optional). The prompt NAME still lands through the S2 fixed vocabulary
      with owner sign-off at the PR (candidates: continue-teaching,
      plan-next-lesson, where-next — the get-keyword-graph /
      curriculum-mapping precedent).
    status: completed
  - id: w1-c1-prompt-cycle
    content: >-
      COMPLETED 2026-06-11: PR #178 merged (201e3eedb) — the seventh prompt
      shipped as continue-progression (owner name decision after a four-source
      definitions check; sign-off chain on the PR). One atomic w1-c1 landing
      (32ba1ceeb, Smouldering) + successor absorption under Nebulous: two
      Copilot fixes (b864f2279), the rename (5505a048d), and the Bugbot
      year-divergence cure (5eab2c322 — chain into lesson-planning on the NEXT
      unit's teaching year, surface divergence, teacher decides per ADR-194).
      All four registration surfaces, per-prompt module split, ADR-123
      reconciled, live P3 round-trip proven. — TDD cycle, ONE PR,
      Director-serialised. Tests first: SDK
      mcp-prompts.unit.test.ts count 6->7 + definition/arguments assertions;
      message-generator tests (orchestration incl. the KS4-science sequences
      caveat carried verbatim from curriculum-mapping, the OGL attribution
      block, AND an assertion that the misconception-graph step instructs ONE
      explicit anchor mode with <slug-from-step-N> placeholders — the tool's
      exactly-one-anchor contract errors on ambiguity); e2e
      prompts.e2e.test.ts list/get arrays. Implementation across ALL FOUR
      registration surfaces: mcp-prompts.ts (MCP_PROMPTS entry AND the
      getPromptMessages switch case — a missing case silently serves []),
      mcp-prompt-messages.ts (generator), apps prompt-schemas.ts (new Zod
      args schema — required args non-optional, classNotes .optional(); this
      is the spec-SHOULD -32602 enforcement surface), apps
      register-prompts.ts (PROMPT_REGISTRATIONS entry). The landing page
      renders prompts dynamically from MCP_PROMPTS — no manual edit. ADR-123:
      reconcile EXISTING drift, not append-a-row (table lists 5 with the old
      eef-evidence-grounded-lesson-plan name vs shipped adapt-lesson; prose
      says "four curriculum prompts" and "intentionally small (4)"; shipped
      count is 6 going to 7).
    status: completed
    depends_on: [w1-c0-owner-design-gate]
  - id: w2-c1-impact-language-alignment
    content: >-
      COMPLETED 2026-06-11: PR #181 merged (6048f337d) — outward capability
      claims aligned with the served estate (served-instructions
      sequenced-curriculum sentence RED-first; root + apps README primitives
      corrected to 37 tools = 24+13; ADR-123 counts + EEF tool name repaired;
      removed resources delisted; P4 per-sentence evidence table on the PR;
      one Copilot enumeration finding fixed with verdict recorded). —
      Bounded outward-language alignment pass: sequencing / builds-on /
      curriculum-connected impact vocabulary across the named surfaces, every
      claim verified against delivered tool behaviour. NC-coverage vocabulary
      is ALREADY GROUNDED (UnitSummaryResponseSchema.nationalCurriculumContent
      -> get-units-summary -> the curriculum-mapping coverage column) — no
      remediation; W2 may cite that chain. No live claim covers the
      landing-page file at authoring time; run the standard collision-safety
      read of active-claims.json at W2 execution start.
    status: completed
  - id: w3-c1-vocabulary-bridge
    content: >-
      UNBLOCKED 2026-06-11 (depends_on w1-c1 satisfied at PR #178's merge);
      remains a future cycle — routing is owner/Director-owned.
      FUTURE CYCLE (owner-directed fold 2026-06-11; additive — neither blocks
      nor sequences with w2-c1): extend this plan's prompt orchestration
      with the position-anchored vocabulary bridge — two get-keyword-graph
      calls within the same subject+keyStage anchor, narrowed by unitSlugs
      (the finished unit vs the resolved candidate next units); the agent
      set-compares the ranked terms and presents shared terms as continuity
      anchors, new terms as the pre-teach list (ADR-194: presented as
      information, never a decision). Data support verified at origin/main
      2026-06-11: unitSlugs narrowing, decorated canonical descriptions,
      firstYear on keyword nodes. Discovery grounding: story 3 of
      keyword-graph-teacher-user-stories.report.md (persona root). Proof
      shape at execution: prompt-message test asserting the bridge step's
      instruction text, plus a P3-style live round-trip; value remains
      release-and-observe. Queues behind w1-c1's merge (the prompt must
      exist); wider keyword-story prioritisation stays owner-owned in the
      discovery note.
    status: pending
    depends_on: [w1-c1-prompt-cycle]
---

# Position-Anchored Teaching Continuity (prompt + impact language)

## Problem and end goal

Every served MCP prompt today is **topic-anchored**: the teacher must already
know what to teach (`lesson-planning(topic, yearGroup)`,
`learning-progression(concept, subject)`, `curriculum-mapping(subject,
keyStage)`). The highest-frequency real entry point is **position-anchored**:
*"my class just finished X — plan what comes next, building on what they have
covered."* No surface owns the position→next resolution, while every tool it
needs shipped with Track-G (2026-06-11).

**End goal**: a teacher (through any MCP client) states where their class is
and receives a next-step lesson plan that demonstrably builds on what came
before — assumed prior knowledge surfaced as a checkable readiness list,
upcoming misconceptions anticipated, sequencing taken from Oak's threads
rather than model guesswork.

## Mechanism

A new MCP prompt owns ONLY the position→next resolution and then chains into
the existing `lesson-planning` flow for the resolved next lesson. This honours
the owner-ratified S3 reconciliation discipline ("extend/merge, never a third
planning surface", PR #162 precedent): planning substance stays single-sourced
in `lesson-planning`; the new prompt contributes the entry point that no
surface has.

Orchestration shape (agent-executed; the server stays a deterministic data
surface per ADR-191 — no server-side composition tool):

1. Resolve the stated position: `search` (scope units/lessons, year-narrowed)
   from the free-text `justCovered` to unit/lesson slugs; confirm the thread.
2. Derive what comes next: `get-thread-progressions` for the year-ordered
   sequence (KS4 science via `get-sequences` — carry the existing
   curriculum-mapping caveat verbatim).
3. Readiness check: `get-prior-knowledge-graph` anchored at the NEXT unit —
   its assumed prior knowledge is precisely what the class should now have
   secured; present it as a checkable list against `classNotes` if provided.
4. Anticipate: `get-misconception-graph` for the upcoming content.
5. Chain into the `lesson-planning` steps for the resolved topic (reference,
   not restatement), attribution carried.

Arguments: `subject` (required), `yearGroup` (required), `justCovered`
(required, free text — the topic/unit/lesson the class last completed),
`classNotes` (optional, e.g. "they struggled with equivalent fractions").
**Stateless by design** — the teacher states the position each invocation.

## Workstreams

### W1 — the prompt (c0 gate, then one TDD cycle)

- **c0 (owner design gate)**: COMPLETED 2026-06-11 — new prompt + argument
  set ratified by the owner; the name lands through the S2 fixed vocabulary
  with sign-off at the PR.
- **c1 (one cycle, one PR)**: full scope in the frontmatter todo — tests
  first (SDK unit count 6→7, generator assertions incl. the
  single-anchor-mode instruction for the misconception step, e2e list/get
  arrays), then the FOUR registration surfaces (SDK `mcp-prompts.ts` array +
  switch case, `mcp-prompt-messages.ts`, apps `prompt-schemas.ts`, apps
  `register-prompts.ts`), plus the ADR-123 drift reconciliation (5-row table
  with a stale prompt name; "four"/"(4)" prose; shipped count 6→7). The
  landing page renders prompts dynamically — no manual edit.

### W2 — outward impact-language alignment (one bounded pass)

Owner direction (2026-06-11): do not map tools/skills to the article
explicitly; align language, impact, and stated intent so readers draw the
conclusions naturally. One pass over the outward surfaces, with **every claim
verified against delivered behaviour** before it is written:

- MCP server instructions block (the "AI Agent Guidance" served text) and
  `get-curriculum-model` orientation copy.
- Prompt descriptions (sequencing / builds-on-what-came-before vocabulary).
- Root README + the MCP app landing page (hero/tools copy) — no live claim
  covers the landing-page file at authoring time (the item-5 claim closed at
  PR #175); run the standard collision-safety read of `active-claims.json`
  at W2 execution start.
- **NC vocabulary is grounded — cite, don't soften**: verified 2026-06-11
  (readiness review + first-hand):
  `UnitSummaryResponseSchema.nationalCurriculumContent`
  (`packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts`)
  flows
  through `get-units-summary` into the `curriculum-mapping` prompt's
  coverage step. W2 may use national-curriculum-coverage language for that
  chain. The deeper NC-statement surface remains owned by the future
  `nc-knowledge-taxonomy-surface` plan (separate; not pulled in here).

### W3 — position-anchored vocabulary bridge (future cycle; owner-directed fold 2026-06-11)

Additive future cycle, folded in by owner direction (2026-06-11; Director
routing event `56dcda07`); it neither blocks nor sequences with W2. At the
"my class just finished X — what next?" moment the prompt this plan ships
(served name owner-decided at its PR, per w1-c0) gains a vocabulary
bridge between the finished unit and the candidate next units:

- Two `get-keyword-graph` calls within the same `subject` + `keyStage`
  anchor, narrowed by `unitSlugs` — one for the finished unit, one for the
  resolved candidate next units.
- The agent set-compares the ranked terms: **shared terms** are presented as
  continuity anchors ("activate prior knowledge through familiar language");
  **new terms** become the pre-teach list, each carrying its canonical Oak
  description (the agent never invents definitions — ADR-194).

Data support verified at `origin/main` (2026-06-11): `unitSlugs` narrowing
within the anchor, decorated canonical descriptions, and `firstYear` on
keyword nodes. Discovery grounding and the wider story set (owner-owned
prioritisation):
[`keyword-graph-teacher-user-stories.report.md`](../keyword-graph-teacher-user-stories.report.md),
story 3. Proof at execution follows the established shape: a prompt-message
test asserting the bridge step's instruction text plus a P3-style live round
trip; delivered value remains release-and-observe (P5).

## Prerequisites

- Track-G graph tools — **blocking, satisfied** (merged through #173; tool
  registration verified in
  `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` +
  `executor.ts` beside it).
- S3 attribution-validation owner step — **not a prerequisite** (this prompt
  derives from no oak-skills content; it composes served tools only; the OGL
  attribution block is the landed static pattern).
- No other prerequisites. Item 5 closed at PR #175 before this plan reached
  readiness; the formerly planned landing-page sequencing is moot.

## Non-goals

- **Stateful class profiles / persistence** — privacy + user-identity gated
  (Clerk thread); the stateless teacher-stated position delivers the value
  without it. Revisit only on observed real demand post-release.
- **A server-side composition tool** (e.g. `get-class-position-context`) —
  rejected on ADR-191 (the agent is the only reasoner) and the EEF t6a
  precedent (server-side contextual narrowing rejected; the agent selects).
- **A public curriculum-alignment benchmark for third-party tools** — owner
  acknowledges this likely sits with a different Oak team; at most a future
  report, explicitly out of this plan.
- **Quoting or mapping to the Tes article** in any shipped text.

## Proof contract

| Id | Acceptance | Proof level | Command / observation |
| --- | --- | --- | --- |
| P1 | Prompt served with correct definition + arguments | integration | prompt unit/integration tests green (`pnpm --filter @oaknational/curriculum-sdk test`) |
| P2 | Prompt retrievable end-to-end | e2e | `prompts/get` e2e parity test green (`pnpm test:e2e`) |
| P3 | Workflow delivers position→next value on real data | value-proxy | live MCP round-trip (D6-style recipe: server on :3333, invoke the prompt, follow the orchestration with real tool calls, verify the readiness list matches the next unit's prior-knowledge subgraph) |
| P4 | Outward claims match delivered behaviour | non-code | W2 review checklist: each changed sentence paired with the tool/test that evidences it |
| P5 | Delivered teacher value | release-and-observe | post-merge observation per the value-proven-by-release doctrine; no pre-release proxy claimed |

## Risks

- **Position resolution ambiguity** (free-text `justCovered` matches several
  units): the prompt instructs candidate presentation + teacher confirmation
  rather than silent selection — mitigation lives in the message text; test
  asserts the instruction is present.
- **Prompt-estate sprawl** (a seventh prompt): mitigated by the c0 gate and
  the chaining shape — if the owner judges entry-point-by-argument is better
  served extending `lesson-planning` with an optional `justCovered` argument,
  c0 records that and c1 reshapes accordingly (the analysis verdict prefers
  the new prompt because `lesson-planning` requires `topic`, which the
  position-first teacher does not yet know; inverting a required argument's
  contract is the worse reconciliation).
- **Language drift in W2** (marketing-style over-claim): the per-sentence
  evidence pairing in P4 is the control.

## Foundation alignment and lifecycle

- `principles.md` first question: the simplest shape that delivers the value
  is one prompt + one language pass — no new tools, no new data surfaces, no
  state.
- `schema-first-execution.md`: no schema-derived surfaces change; prompts are
  static content (existing pattern).
- `testing-strategy.md` / TDD: w1-c1 is one cycle, tests + prompt landing
  together; e2e in the same PR.
- Plan-body first-principles check: fires at w1-c1 start (re-verify the
  prompt-test idiom against the then-current estate) and before any W2
  sentence lands (re-verify the evidenced behaviour).
- Lifecycle triggers: per
  [`lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md)
  — claim per workstream, handoff record on mid-cycle retirement,
  consolidation at completion.
- Readiness reviewers (before any DECISION-COMPLETE/execution-ready claim):
  `assumptions-expert` (proportionality + the chaining-shape assumption) +
  `mcp-expert` (prompt-surface correctness). Dispatch verdicts adjudicated
  first-hand.

## Relationship to the estate

- Source analysis: the 2026-06-11 research-appraisal session (this plan's c0
  carries the verdict; the owner ratified "absolutely our area" for the
  workflow and report-not-scope for third-party assessment).
- Single-sourced planning substance: `lesson-planning` prompt (S3 / PR #162).
- NC surface: future `nc-knowledge-taxonomy-surface` plan (unchanged).
- Distribution of the resulting capability: `external-facing-capability-
  distribution.plan.md` (unchanged; this plan only improves what is served).
