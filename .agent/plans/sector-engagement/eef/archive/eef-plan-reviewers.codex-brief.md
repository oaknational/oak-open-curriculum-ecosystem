# Next-session brief (Codex) - EEF plan reviewer pass

**For**: a Codex session. Self-contained; read this in full before starting.
**Authored**: 2026-05-31 by Tidal Charting Hull (codex/GPT-5), after the EEF
plan consistency and graph-native-boundary repairs. **Scope owner**: the `eef`
thread.

## Why this session exists

The live EEF plan has just been tightened in two owner-directed ways:

1. MCP tool input and output schemas must each be derived by a **single Zod call**
   on the appropriate subset of the constructed graph-native EEF view. If that
   proves impossible at implementation time, the next step is an owner
   conversation, not an executor-chosen workaround.
2. The raw EEF corpus is now explicitly the source snapshot and type source, not
   automatically the graph contract. D5 owns a pure graph-native
   construction/adaptation boundary. That boundary may materialise a standard
   graph shape or expose a lazy view; if no distinct graph-native shape adds
   value, treating raw and graph-native shapes as intentionally identical requires
   owner ratification before implementation proceeds.

Before implementation continues, the plan needs reviewer scrutiny rather than
another authoring pass. Run the documentation reviewer, a general type reviewer,
and a second type reviewer with a narrow preservation brief.

## Required Reviewer Invocations

Resolve the Codex reviewer adapters before invoking them:

```bash
pnpm agent-tools:codex-reviewer-resolve docs-adr-expert
pnpm agent-tools:codex-reviewer-resolve type-expert
```

Expected resolved agents:

- `docs-adr-expert` - adapter `.codex/agents/docs-adr-expert.toml`, canonical
  template `.agent/sub-agents/templates/docs-adr-expert.md`.
- `type-expert` - adapter `.codex/agents/type-expert.toml`, canonical template
  `.agent/sub-agents/templates/type-expert.md`.

Run three read-only reviews:

1. `docs-adr-expert` over the EEF live plan as documentation/decision guidance.
2. `type-expert` over the EEF live plan as a general type-system plan review.
3. A separate `type-expert` instance with the special **type-preservation through
   the value chain** brief below.

If the Codex project-agent invocation surface is unavailable, fall back to
manually applying the resolved reviewer templates and clearly label that fallback
in the output. Do not silently substitute a generic review.

## Read First

- `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
  - the plan under review.
- `.agent/plans/sector-engagement/eef/README.md`
  - live EEF lane framing.
- `.agent/plans/sector-engagement/eef/current/eef-d0-decontamination-ledger.md`
  - D0 dispositions and expected later-D-step code residue.
- `.agent/plans/sector-engagement/eef/current/eef-plan-consistency-sweep.codex-brief.md`
  - prior sweep lens and residue classes.
- `.agent/memory/operational/threads/eef.next-session.md`
  - current EEF thread banner and continuity notes.
- `.agent/sub-agents/templates/docs-adr-expert.md`
  - required reviewer template for the document pass.
- `.agent/sub-agents/templates/type-expert.md`
  - required reviewer template for both type passes.

Optional but useful if a reviewer needs doctrine context:

- `.agent/directives/principles.md`
- `.agent/directives/schema-first-execution.md`
- `docs/architecture/architectural-decisions/038-compilation-time-revolution.md`
- `.agent/practice-core/decision-records/PDR-089-conservation-reflex-external-check.md`

## Review Boundaries

This is a review session. Do not repair the plan during the reviewer pass unless
the owner explicitly widens the session. The expected output is reviewer findings,
not implementation.

Do not review archive history as current guidance. Preserve `archive/`,
historical thread sections, and the historical conservation map as history unless
the live plan links to them as current authority.

Do not re-open settled owner decisions:

- No Zod over the corpus.
- No runtime corpus parse.
- No `unknown` at the fixed-data boundary.
- No freshness gate / ADR-175 code obligation.
- No response cap or rank-and-cut over graph results.
- Raw corpus is not automatically the graph contract.
- A graph-native construction/adaptation boundary exists unless owner-ratified as
  intentionally identical to raw shape.
- MCP input/output schemas are single-Zod-call declarations over graph-native
  view subsets, with owner conversation if impossible.

## Docs/ADR Reviewer Brief

Ask `docs-adr-expert` to review the live EEF plan as documentation and decision
guidance. The reviewer should answer:

- Does the plan read as a coherent executable plan after the raw-corpus vs
  graph-native-boundary update?
- Are D0-D7, Ratified Decisions, Known-vs-Unknown Doctrine, Fully Specified End
  State, Definition of Done, Non-Goals, Risk Assessment, Foundation Alignment,
  and Readiness Reviewers mutually consistent?
- Are any surfaces still misleading a future implementer into thinking the raw
  corpus is the graph contract?
- Are the owner-conversation fallback points clear and placed only where they
  belong?
- Are links and cited surfaces sufficient for a next implementer?
- Does any plan wording drift into ADR-level canon where it should remain
  execution-plan detail, or vice versa?

Output expected from `docs-adr-expert`:

- Findings first, ordered by severity.
- For each finding: file/line reference, why it matters, and recommended
  disposition: `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.
- A short residual-risk note, especially around docs/ADR drift.

## General Type Reviewer Brief

Ask the first `type-expert` to review the plan as a type-system execution plan.
The reviewer should answer:

- Does D2 correctly preserve `EEF_TOOLKIT_DATA as const` as the raw-corpus type
  authority?
- Does D5 define a graph-native construction/adaptation boundary without
  reintroducing a hand-authored parallel schema?
- Does D6 keep Zod limited to SDK-required MCP input/output declarations?
- Are predicates (`isValidStrandKey`, vocabulary membership) correctly placed at
  semantic boundaries rather than replacing known compile-time structure?
- Does the plan avoid `unknown`, `any`, type assertions, `z.infer` over corpus
  schemas, and widening to `string` where literal unions are available?
- Are any proposed graph-core or MCP abstractions likely to erase literal type
  information?

Output expected from the general `type-expert`:

- Findings first, ordered by severity.
- For each finding: file/line reference, type-flow concern, and concrete plan
  correction strategy.
- Classify each as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Special Type-Preservation Brief

Run a second `type-expert` with this exact focus:

> Review whether the plan guarantees that the type information specified by the
> original `as const` EEF data structure is preserved all the way through the
> value chain. We NEVER throw away type information and then attempt to narrow it
> again. We know ALL possible semantic inputs and responses at compile time, apart
> from the external MCP argument envelope before boundary narrowing. The review
> should trace raw corpus -> typed raw foundation -> graph-native EEF view ->
> graph operations -> MCP schema declarations -> MCP structuredContent ->
> teacher-facing value proof, and identify any point where the plan permits type
> erasure, widening, re-parsing, re-narrowing, or hand-authored parallel shapes.

Specific checks for this special pass:

- The source of truth is `EEF_TOOLKIT_DATA` annotated `as const`.
- `EefStrand`, `EefStrandId`, key-stage/priority/phase vocabularies, raw lookup
  tables, edge facts, and metadata derive from that constant by `typeof`, indexed
  access, mapped types, literal tuples, and predicates.
- The graph-native EEF view may wrap/project/index raw data only if the type-level
  relationship to the raw constant is preserved. It must not erase to a generic
  node shape and later recover EEF specificity.
- If the graph-native shape is intentionally identical to the raw shape, that
  choice must be owner-ratified and recorded. It must not happen by inertia.
- MCP schemas are SDK declarations derived by one Zod call over the graph-native
  view subset. They are not corpus parsers, not a second source of truth, and not
  hand-maintained parallel schemas.
- Unknown data exists only at true external request boundaries. The MCP envelope
  may be unknown before parsing, and a key may arrive as a string before
  `isValidStrandKey`. After narrowing, the key is in the finite compile-time key
  space and downstream values remain exact.
- The value proof must not validate "field presence" tautologically; it must show
  known real corpus literal values flowing into the assistant-facing payload
  without widening then rediscovering them.

Forbidden reviewer recommendations for this special pass:

- Do not recommend `unknown`, `Record<string, unknown>`, generic JSON-like graph
  nodes, or `string` keys as a simplification.
- Do not recommend a normalized common node interface that flattens literal
  per-strand structure unless it is a graph-native projection with a preserved
  type-level relationship to the raw constant and is justified by D5 value.
- Do not recommend runtime corpus validation or Zod parsing of the corpus.
- Do not recommend hand-authored Zod or TypeScript shapes that shadow
  `EEF_TOOLKIT_DATA`.

Output expected from the special `type-expert`:

- A type-flow trace in bullets from raw constant to teacher-facing payload.
- Findings first, ordered by severity.
- Each finding must name the exact type information that would be lost, where it
  is lost, and what plan wording should close the loss.
- Classify each as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if the plan fully preserves type information end to end.

## Host Synthesis Task

After the three reviewer passes:

1. Merge duplicate findings.
2. Keep disagreements visible; do not flatten them away.
3. Mark findings as:
   - `must-fix before implementation`
   - `optional plan polish`
   - `incorrect reviewer recommendation`
   - `owner judgment call`
4. For any `owner judgment call`, state the decision needed in one sentence.
5. Do not implement fixes unless the owner explicitly widens the session.

## Suggested Searches

Use these to orient and to verify reviewer claims:

```bash
rg -n "raw-corpus|raw corpus|graph-native|construction/adaptation|single Zod call|owner-ratified|owner ratification|owner conversation" .agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md
rg -n "unknown|Record<string, unknown>|any|as |z\\.infer|EefStrandSchema|EefToolkitSchema|safeParse|zod|Zod|normalized|widen|string" .agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md
rg -n "EEF_TOOLKIT_DATA|EefStrand|EefStrandId|StrandByStrandId|isValidStrandKey|structuredContent|graph-native EEF view" .agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md
```

Treat search hits as evidence to classify, not automatic findings; some hits are
expected historical or forbidden-list language.

## Acceptance

The session is complete when it has:

- Resolved `docs-adr-expert` and `type-expert`.
- Run the docs/ADR reviewer.
- Run the general type reviewer.
- Run the special type-preservation type reviewer.
- Produced a consolidated findings list with dispositions.
- Clearly stated whether the plan is ready for implementation, needs specific
  plan repairs, or needs an owner decision before implementation.

No code gates are required because this is read-only review work. If the owner
widens the session to edit the plan, run targeted markdownlint and Prettier on
the edited markdown, then the root markdown/format gates if scope justifies it.
