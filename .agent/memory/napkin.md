## Napkin rotation — 2026-04-04

Rotated at 579 lines after Phase 4 closure. Archived to
`archive/napkin-2026-04-04.md`. Merged 1 new entry into
`distilled.md`: ESLint `lint:fix` value+type import merging.
Extracted 1 pattern: `review-intentions-not-just-code.md`.
Previous rotation: 2026-04-03 at 632 lines.

## Session 2026-04-05 — SDK adoption Phase 1 implementation

### What Was Done

- Implemented Phase 1 of the off-the-shelf MCP SDK adoption plan:
  added `.meta({ examples })` to generated Zod schemas at codegen time.
- Modified `buildZodType()` in `build-zod-type.ts`: removed early
  return on `.describe()`, restructured to accumulator pattern,
  added conditional `.meta()` emission for flat context with
  `isYearPreprocess` guard for Option A.
- TDD: 7 unit tests (string, number, nested exclusion, undefined
  exclusion, year preprocess exclusion, no-description, chain order)
  + 3 integration round-trip tests (z.toJSONSchema() produces examples).
- Regenerated 17 tool files via `pnpm sdk-codegen`.
- 5 specialist reviewers (code, type, MCP, test, Barney) — all passed.
  Addressed all findings: test renamed to `.integration.test.ts`,
  type assertions replaced with `toHaveProperty()`, speculative loop
  replaced with explicit assertions, TSDoc added to private helper.
- `pnpm check` green (19/19).

### Patterns to Remember

- **Accumulator pattern for chain builders**: when a string-building
  function has multiple conditional stages (base type, `.describe()`,
  `.meta()`), replacing early returns with sequential `base = ...`
  mutations creates a single exit point. Makes future chain additions
  trivial.
- **`toHaveProperty()` avoids unsafe index access**: for JSON Schema
  objects with `[k: string]: unknown` index signatures, `expect(obj)
  .toHaveProperty('a.b.c', value)` avoids intermediate `as` casts
  entirely. Cleaner than type guards for test assertions.
- **The shim's own comment was wrong**: `preserve-schema-examples.ts`
  line 49 claimed "the MCP SDK v1.28.0 uses its own internal converter
  that does NOT honour `.meta()`". This is incorrect — the SDK calls
  `z4mini.toJSONSchema()` which defaults to `globalRegistry`. The
  comment was likely written without verifying the actual code path.
  Comments about library behaviour degrade; verify against source.

### Corrections (from user)

- None this session.

### Mistakes Made

- Round-trip test initially placed at wrong directory depth (4 `../`
  instead of 3) — import path error caught immediately by test runner.
- Initial test file structure had extra closing brace — placed new
  describe block outside parent describe due to insertion point error.
- Both were mechanical errors caught in seconds by running tests.

---

## Session 2026-04-05 — Off-the-shelf MCP SDK adoption plan

### What Was Done

- Deep investigation of full pipeline: OpenAPI → adapter → codegen → SDK
  → app → host. Traced every stage where examples were captured, lost, or
  preserved.
- Discovered that Zod 4.3.6 `.meta()` preserves examples through the MCP
  SDK v1.28.0's native `z4mini.toJSONSchema()` converter. The
  `preserve-schema-examples.ts` shim's own removal condition #1 is met.
- Created 5-phase enhancement plan: codegen `.meta()` → aggregated tool
  Zod schemas → `registerAppTool`/`registerAppResource` → delete shim →
  prove pipeline.
- Launched 4 specialist reviewers (Barney, MCP, code, type). 7 blocking +
  14 non-blocking findings. All addressed in plan revision.

### Patterns to Remember

- **Workaround removal conditions go stale**: the shim documented three
  removal conditions. Condition #1 was met when the MCP SDK upgraded to
  Zod 4's native `toJSONSchema()`, but nobody re-checked. The shim
  persisted and compounded with `registerAppTool` to prevent rendering.
  Pattern extracted to `patterns/re-evaluate-removal-conditions.md`.
- **Multi-reviewer convergence builds confidence**: all 4 reviewers
  independently identified the `_meta` type mismatch as the critical
  issue. The solution converged on `toAppToolRegistrationConfig()` — a
  clean second projection function, not conditional narrowing or type
  assertions.
- **String-based codegen has a type-safety gap**: `.meta()` is emitted
  as a string literal. A typo like `example` (singular) instead of
  `examples` compiles but silently drops data. The only mitigation is
  a test that calls `z.toJSONSchema()` and asserts the output.

### Corrections (from user)

- **"We don't just want the SDK for this narrow piece — we want it for
  everything."** I was framing the fix as adopting `registerAppTool` for
  the rendering bug. The user reframed: rolling our own was never wanted.
  The fix is to use the official SDKs for ALL their plumbing.
- **"Let go of the assumptions encoded in the workspaces."** I was
  working within the existing architecture. The user wanted a fresh
  look at the pipeline from first principles — upstream API spec → MCP
  host, with no assumptions about existing code.

## Session 2026-04-05 — Practice Core evolution: concepts, ADRs, self-containment

### What Was Done

- Added ADR infrastructure section to `practice-bootstrap.md` — the
  graduation target of the learning loop was the only artefact type
  without a bootstrap template
- Discovered and promoted three foundational principles:
  1. **Concepts are the unit of exchange** — all Practice exchange
     operates at the concept level, not the file or name level
  2. **Substance before fitness** — write concepts at the weight they
     deserve first, deal with fitness holistically afterward
  3. **Self-containment requires concept export** — travelling content
     carries the substance, not pointers to host-repo artefacts
- Removed 6 specific ADR-144 references from Practice Core files and
  10 specific ADR references from Practice Context outgoing files
- Enhanced the ADR README with template, lifecycle, and creation guidance
- Wrote all three principles to their correct homes across 5+ locations
  each, then performed holistic fitness compression as a separate pass

### Patterns to Remember

- **Fitness budgets distort writing**: I repeatedly compressed concepts
  _during writing_ to stay within char limits. The user corrected this:
  write the concept fully first, then deal with fitness as a separate
  editorial concern. The distortion was subtle — I wasn't aware I was
  doing it until called out.
- **A descriptive name is still a pointer**: replacing "ADR-144" with
  "the two-threshold fitness model" is an improvement but not sufficient
  if the receiving context has never encountered the concept. The
  substance must travel, not just a better label.
- **Three levels of reference quality**: (1) opaque pointer ("ADR-144"),
  (2) descriptive name ("two-threshold fitness model"), (3) exported
  concept (what it is, how it works, why it matters). Only level 3 is
  sufficient for portable content.
- **Self-containment is concept-level, not file-level**: the Practice
  Core and Context travel between repos. They must carry concepts, not
  references to the host repo's specific artefact system.

### Corrections (from user)

- "The Practice Core MUST be self-contained — no ADR references in
  portable files." I had added a perfectly good ADR section to the
  bootstrap with host-repo-specific paths. The section was right; the
  location was wrong. Fixed by making the section portable (generic
  paths, no specific ADR numbers).
- "A name is still a pointer." I thought replacing ADR numbers with
  descriptive names was sufficient. The user showed it's not — the
  substance must travel. This is the deeper insight.
- "Write the concept fully first, deal with fitness after." I was
  self-censoring concepts to fit char limits. The user identified this
  as artificially underweighting vital understanding.
- "Concepts are the unit of exchange — that feels foundational." The
  user elevated what I'd framed as an exchange-mechanism guard to a
  fundamental principle of how the Practice thinks, teaches, and evolves.

### Mistakes Made

- Self-censored concept weight to stay within fitness limits
- Initially placed ADR infrastructure in Practice Core with host-repo
  references (specific directory path, specific numbering conventions
  that only make sense in this repo)
- Framed "export concepts not pointers" as a defensive guard rather
  than recognising it as the fundamental operating principle of
  Practice exchange
- Made 5+ round trips to compress 10-50 chars at a time instead of
  writing fully and compressing holistically

## Session 2026-04-04 — MCP App UI not rendering (investigation)

### What Was Done

- Called `get-curriculum-model` via the running `oak-local` MCP server
  in Claude Code (VS Code extension). The text content was returned
  correctly but no brand banner was displayed.
- Investigated and found four issues:

### Corrections (from user)

- **I guessed instead of verifying**: claimed Claude Code doesn't
  support MCP Apps. It does. The claude-code-guide agent confirmed
  with evidence. Never guess — verify.
- **I explained away the failure instead of acknowledging it**: listed
  possible reasons and suggested the user try things. The correct
  response was to acknowledge the implementation is unproven and
  investigate.

### Patterns to Remember

- **`registerAppTool` is canonical, not `server.registerTool`**: the
  ext-apps SDK's `registerAppTool()` normalises both modern
  (`_meta.ui.resourceUri`) and legacy (`_meta["ui/resourceUri"]`)
  metadata keys. Without this, hosts reading the legacy key skip the
  widget. The repo's own docs/tests/skills say to use it, but
  production code doesn't.
- **`preserve-schema-examples.ts` is a compatibility layer**: it
  overrides the `tools/list` handler to work around the MCP SDK's
  lossy Zod→JSON Schema conversion. This violates "no shims, no
  hacks, no workarounds." The canonical fix needs investigation
  (Zod 4 `.meta()`, direct JSON Schema passthrough, or upstream fix).
- **Test coverage proves pieces, not composition**: 16 widget tests +
  157 E2E tests + 3 UI tests all pass, but nothing proves the MCP App
  actually renders in a host. The test pyramid has a gap at the
  integration level between "tool response has `_meta.ui`" and
  "widget appears in an iframe."

### Mistakes Made

- Guessed that Claude Code doesn't support MCP Apps — it does.
- Tried to explain away the non-functional UI rather than
  acknowledging the problem.
- Did not inspect the wire protocol to verify what `tools/list`
  actually returns.
- Investigation brief written at
  `~/.claude/plans/glistening-sniffing-eich.md` for next session.

## Session 2026-04-05 — Session sidecars strategic brief consolidation

### What Was Done

- Created the future strategic brief at
  `.agent/plans/agentic-engineering-enhancements/future/`
  `cross-vendor-session-sidecars.plan.md` for local-first,
  cross-vendor session sidecars and arbitrary session metadata.
- Linked the brief from the collection README, roadmap, session
  continuation prompt, and `hooks-portability.plan.md` so the work is
  discoverable without promoting it prematurely.
- During `/jc-consolidate-docs`, found a drift bug: the future hooks
  plan had started reading like evidence of current repo-local support.
  Reframed it explicitly as target-state architecture and anchored the
  present-tense truth back to
  `.agent/reference/cross-platform-agent-surface-matrix.md`.

### Patterns to Remember

- **Future platform plans must separate target state from current
  support**: example configs and capability sketches are easily read as
  "already wired here". When a repo has an authoritative support matrix
  or execution surface, point to that as the source of present-tense
  truth and label speculative examples as target-state only.

## Session 2026-04-05 — Incoming Practice context analysis

### What Was Done

- Read all 13 files in `.agent/practice-context/incoming/` and compared
  them against the local Practice Core, ADRs, patterns, bridge, and
  operational workflows.
- Gave extra weight to `canonical-gate-and-strict-foundation.md` and
  `shared-strictness-requires-workspace-adoption.md`, then checked the
  current workspace task surface against their "honest participation"
  doctrine.

### Patterns to Remember

- **Incoming Practice notes can be recirculated doctrine, not net-new
  doctrine**: most of this incoming set had already been promoted into
  local Practice Core, ADR, or pattern surfaces. Compare against current
  canonical homes before treating incoming support notes as new work.
- **The strongest new signal may be repo-local rather than Core-level**:
  the hydration/continuity/platform notes were mostly already absorbed
  here, but the gate/strictness pair added a sharper monorepo doctrine:
  executable aggregate gates, single package-graph ownership, and
  workspace adoption as the proof of shared strictness.
- **Honest gate claims depend on workspace task exports**: a root gate
  can claim repo-wide coverage while a participating workspace still
  lacks a task. In this repo, `agent-tools/package.json` lacks `clean`
  even though root docs and scripts describe `pnpm clean` as cleaning
  all build products.
- **Filename reuse can create exchange-level semantic drift**: local
  outgoing `starter-templates.md` is a reviewer-template pack, while the
  incoming `starter-templates.md` is a self-sufficient-hydration seed
  pack. Same filename, different concept. This is easy to miss and can
  mislead future transfers.
- **Focused write-back value deserves a repo-targeted outgoing pack**:
  when the useful response is about what one source repo sent, keep it in
  a target-specific subdirectory instead of flattening it into the general
  outgoing note set. That preserves provenance and avoids pretending the
  feedback is generic doctrine.

### Follow-through

- Created the rollout plan, later archived at
  `.agent/plans/agentic-engineering-enhancements/archive/completed/`
  `agent-collaboration-incoming-practice-context-integration.plan.md`,
  and linked it from the collection README, current index, roadmap, and
  session continuation prompt during execution.
- Promoted **Shared Strictness Requires Workspace Adoption** into the
  local pattern set and indexed it in `.agent/memory/patterns/README.md`.
- Captured the companion aggregate-gate doctrine in
  `docs/engineering/build-system.md`: `pnpm check` is executable truth,
  it remains the only canonical aggregate verification command, design
  convergence should stay centred on one package-graph owner, and repo-
  wide claims must stay within workspace task exports.
- Added repo-targeted outgoing-pack guidance to Practice Context docs and
  created `.agent/practice-context/outgoing/agent-collaboration/` with
  two focused feedback notes for the source repo.
- Repaired the concrete honesty gap the incoming notes exposed by adding
  `clean` to `@oaknational/agent-tools`.
- Cleared the integrated incoming batch once the local adoption and
  write-back surfaces were in place.
- Ran `jc-consolidate-docs`, reviewed the relevant `~/.claude/plans/`
  artefacts, found no additional uncaptured doctrine for this round, and
  archived the rollout plan after confirming the durable content already
  lived in permanent docs, the local pattern set, the outgoing pack, and
  the napkin.
