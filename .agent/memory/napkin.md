## Napkin rotation — 2026-04-14

Rotated at 641 lines after 14 sessions (2026-04-13 through
2026-04-14f) covering deep consolidation, schema resilience
planning, Graphify exploration, practice doc finessing, Sentry
canonical alignment (7 of 15 todos), plan review + build
tooling decision, composable tsup config, Sentry holistic
review, codegen fixes (silent fallback, content comparison),
compliance planning (Claude + ChatGPT), reviewer findings +
lint hardening, and upstream offset/limit description swap fix.
Archived to `archive/napkin-2026-04-14.md`. Merged 3 new
entries into `distilled.md`:

- Linting: `warn` severity = rule off (Linting section)
- `@ts-expect-error` is the smell, not the solution (Linting)
- Self-justifying eslint-disable comments (Linting)
Graduated 4 entries to permanent docs:

- MCP App UI debugging → troubleshooting.md
- `_meta.ui.visibility` array (API ref, removed)
- `addEventListener` for MCP Apps events (API ref, removed)
- Runtime derivation from schema (redundant with cardinal rule)
Previous rotation: 2026-04-13 at 969 lines.

---

### Session 2026-04-14g: Metacognitive correction — native wrapper

**Sunk-cost rationalisation in the native wrapper plan item.**
The plan said "adopt `wrapMcpServerWithSentry()` mode-conditional
at composition root" and "retain sentry-mcp for fixture mode."
This was sunk-cost bias: we chose the native approach (Barney:
"custom plumbing where a library provides the mechanism"), kept
the old approach, and invented "fixture mode needs it" as
justification. Fixture mode tests the adapter surface (setTag,
setUser, setContext, close) — it does not need a parallel
wrapping mechanism that isn't used in production.

**"Gate on mode" was sophistication on a false premise.** The
plan framed the task as "how do we make both approaches
coexist?" with mode-conditional logic at the composition root.
The correct question was "what (if anything) from
`@oaknational/sentry-mcp` survives replacement?" The mode-gating
made a sunk-cost decision look like engineering prudence.

**`sentry-mcp` is bigger than `wrapToolHandler`.** Investigation
of the package found: 3 handler wrappers (tool, resource,
prompt), `createInMemoryMcpObservationRecorder`, and observation
types — used across 8+ files in the HTTP app. Proper
investigation is needed before implementation, not assumptions
about what can be removed.

**Plan overhauled.** Split `wrap-mcp-server` into two todos:
investigation (6 questions, code reading + spike) then adoption
(blocked on investigation). Added "Native MCP Server Wrapping —
Investigation Required" section with metacognitive correction,
correct framing, investigation questions, and acceptance
criteria. Updated sequencing.

## Session: 2026-04-15 — Start-right thorough grounding

### What Was Done
- Read the canonical grounding workflow plus the foundation directives:
  `AGENT.md`, `principles.md`, `testing-strategy.md`, and
  `schema-first-execution.md`
- Re-read `distilled.md` and the current `napkin.md` before any new
  work
- Read the governance and architecture entrypoints linked as
  essential guidance, plus the root `README.md`
- Re-established live continuity from `git status --short`,
  `git log --oneline --decorate -10`, the active session prompt, and
  the active Sentry plan
- Confirmed `.agent/practice-core/incoming/` contains only `.gitkeep`
  (no incoming cross-repo practice payload to surface)

### Patterns to Remember
- When a user explicitly invokes `start-right-thorough`, treat the
  current branch's continuation prompt and active plan as part of the
  grounding pass, not optional extra reading
- Grounding must verify prompt state against live git state. In this
  session the prompt still said 7 doc files were uncommitted, but
  `git status --short` was clean and `ee3423ce` already contained the
  handoff. Treat stale continuity notes as candidate false blockers,
  not instructions to repeat work.
- For anti-sunk-cost investigations, the acceptance criteria need an
  explicit burden of proof for retention. "Tests use it" is evidence
  of a migration surface, not evidence that a package should survive.
- Native `wrapMcpServerWithSentry()` is materially broader than
  `@oaknational/sentry-mcp`: it wraps `tool`/`resource`/`prompt`
  registration, transport `onmessage`/`send`/`onclose`/`onerror`,
  request-response span correlation, initialize/session metadata, and
  protocol/transport error capture. Treat per-handler wrappers as only
  one slice of the current observability behaviour.
- `sendDefaultPii: false` does not disable native MCP instrumentation;
  it drives the default `recordInputs`/`recordOutputs` values to
  `false` and filters only network-PII span fields (client
  address/port, resource URI). Other MCP metadata still records unless
  explicitly removed elsewhere.

## Session: 2026-04-15 — Native wrapper compatibility gap

### What Was Verified
- `wrapMcpServerWithSentry()` patches `connect` plus the deprecated
  `tool`/`resource`/`prompt` methods, and its validation gate checks
  only for those method names on the server instance
- MCP SDK v1.29.0 implements `registerTool`,
  `registerResource`, and `registerPrompt` as separate public methods,
  not aliases that forward through `tool`/`resource`/`prompt`
- Oak's HTTP server registers every tool, resource, and prompt through
  `register*`, including `registerAppTool()`, which delegates to
  `server.registerTool(...)`
- Runtime spike confirmed the patch surface: after wrapping a real
  `McpServer`, `tool`/`resource`/`prompt` changed identity while
  `registerTool`/`registerResource`/`registerPrompt` did not

### Consequence
- This is a real compatibility blocker for replacing Oak's
  per-handler wrappers. Transport wrapping still creates request spans
  and captures transport / JSON-RPC error responses, but it does not
  wrap the handlers Oak actually registers. Tool exceptions are
  especially important: the SDK converts them into `CallToolResult`
  `{ isError: true }` responses before transport error capture sees a
  JSON-RPC error, so without handler wrapping those failures lose the
  native wrapper's explicit exception capture path.

## Session: 2026-04-15 — Native wrapper investigation answers

### What Was Verified
- Real Oak-path spike using `createMcpHandler` plus
  `StreamableHTTPServerTransport` and a wrapped `McpServer` emitted 3
  native `mcp.server` transactions:
  `tools/call get-curriculum-model`,
  `prompts/get find-lessons`,
  `resources/read docs://oak/getting-started.md`
- Direct error-parity spike proved the important tool gap:
  `registerTool('boom')` and deprecated `tool('boom')` both emitted
  `tools/call boom` transactions, but only `tool('boom')` produced a
  captured exception event; `registerTool('boom')` surfaced only
  `CallToolResult { isError: true }`
- With `sendDefaultPii: false`, those native transactions kept method
  names, tool/prompt names, request IDs, transport/protocol metadata,
  and dropped request arguments plus prompt/tool payload details and
  resource URI
- Native Sentry's stronger coverage is transport/session/protocol:
  request spans, response correlation, initialise/session metadata,
  protocol/transport error capture, and input/output capture controls
- Oak's current package surface splits cleanly into:
  runtime wrappers (`wrapToolHandler`, `wrapResourceHandler`,
  `wrapPromptHandler`) versus fixture/test recorder/types
  (`createInMemoryMcpObservationRecorder`, `McpObservation*`,
  `MergedMcpObservation*`)
- Recorder/types are used by app fixture mode and unit-test helpers,
  but there is still no evidence they must survive as a shared package
  rather than moving app-local or into fixture support elsewhere

### Recommendation To Carry Forward
- The honest recommendation is **reduce, not remove immediately**
- Do not rationalise keeping the runtime wrappers as the target design;
  native Sentry is the direction of travel
- Do not delete `@oaknational/sentry-mcp` outright yet, because native
  Sentry does not patch Oak's actual `registerTool` /
  `registerResource` / `registerPrompt` path, so immediate removal
  would lose handler-level capture on the live path
- Treat recorder/types as a separate migration question from runtime
  wrapping; the burden of proof is now on any proposed surviving
  surface

## Session: 2026-04-15 — Plan rewrite around value, not package fate

### What Changed
- Rewrote `sentry-canonical-alignment.plan.md` so the MCP section now
  optimises for production debugging value rather than package removal
  or wrapper purity
- Preserved the pre-rewrite plan exactly as a comparison snapshot at
  `.agent/plans/architecture-and-infrastructure/archive/superseded/`
  `sentry-canonical-alignment.plan.pre-value-reframe-2026-04-15.md`
- Marked the investigation todo as complete and rewrote the pending
  adoption work around three ideas:
  1. native Sentry is the canonical live-path baseline
  2. Oak adds only the missing `register*` failure signal
  3. package collapse is a consequence of simplification, not the goal

### Patterns To Carry Forward
- When a plan gets stuck on "what survives of package X?", step back:
  the real question is usually "what production value must survive, and
  where should that responsibility live?"
- Off-the-shelf plus a thin Oak-owned extension is cleaner than either
  native-purity ideology or indefinite shared-package preservation
- If a concern is single-consumer on the live path today, make the plan
  name the app-local owner explicitly instead of leaving a vague "right
  owner" decision for later

## Session: 2026-04-15 — Plan validation and simplification pass

### What Was Verified
- Ran independent reviews of both Sentry alignment plans against:
  repository reality, parent-plan authority boundaries, and current
  official Sentry/MCP documentation
- Specialist reviewers aligned on the same core correction:
  the active child plan is directionally right, but still carried
  unnecessary enhancement scope and stale cross-boundary content

### What Changed
- Reduced the active child plan to HTTP MCP live-path completion only
- Explicitly moved metrics/propagation/profiling/source-map and CLI
  enhancements out of child-plan execution scope
- Tightened acceptance criteria around real MCP failure modes:
  thrown `registerTool` failures plus non-throwing
  `CallToolResult.isError` classification
- Added explicit parent-plan handoff criteria for credentials,
  source-map automation, and deployment evidence
- Updated the parent execution plan Phase 3 wording to remove stale
  "per-request MCP wrapping" phrasing and align with native baseline +
  minimal app-local gap closure

## Session: 2026-04-15 — Quick grounding refresh

### What Was Done
- Ran the `start-right-quick` workflow end-to-end by reading:
  `AGENT.md`, `principles.md`, `testing-strategy.md`, and
  `schema-first-execution.md`
- Re-read `distilled.md` and `napkin.md` before any implementation work
- Checked `.agent/practice-core/incoming/` and confirmed no incoming
  practice files are present

### Active Orientation
- Keep schema-first and generator-first as non-negotiable defaults
- Maintain strict type integrity (no widening/type shortcuts) at all
  boundaries
- Apply session priority ordering: bugs first, unfinished planned work
  second, new work last

## Session: 2026-04-15 — Parent/child Sentry plan reconciliation

### What Changed
- Reconciled the parent execution plan with the rewritten child
  canonical-alignment plan so both now describe the same authority
  split and runtime direction
- Updated the parent plan to make the child authoritative for the
  remaining HTTP MCP live-path alignment while the parent remains
  authoritative for the shared foundation, credential provisioning,
  release/source-map evidence, and deployment proof
- Replaced the stale parent wording that still taught manual-only HTTP
  tracing and `@oaknational/sentry-mcp` as a long-term authority;
  parent runtime contract now reflects `@sentry/node/preload` plus the
  native MCP baseline with only minimal Oak-owned `register*` gap
  closure where needed
- Broadened the child verification checklist so broader finish-line
  proof is explicit again: HTTP route/request-context proof, outbound
  dependency tracing, user enrichment, source-map/release alignment,
  and CLI context remain visible alongside the MCP-specific checks

### Surprise

- **Expected**: once the child plan was rewritten, the broader plan set
  would still describe the same runtime architecture and finish-line
  proof
- **Actual**: the parent plan still taught manual-only HTTP tracing and
  `@oaknational/sentry-mcp` as a long-term authority, and the child
  verification checklist had narrowed away broader HTTP/source-map
  proof
- **Why expectation failed**: rewriting the most active plan did not
  automatically update the parent authority surface or the closure
  checklist that later sessions will follow
- **Behaviour change**: when a child plan changes runtime truth or
  authority, reconcile the parent plan and the closure proof in the
  same session before handoff

### Pattern To Carry Forward
- When a child plan evolves the runtime truth, reconcile the parent in
  the same session or the repo starts teaching two incompatible
  architectures at once

## Session: 2026-04-15 — Recovering removed Sentry scope into companion plans

### What Changed
- Added `sentry-observability-expansion.plan.md` to own the broader
  post-baseline Sentry capability tracks (metrics, mcp context,
  propagation, profiling, source maps, alerts, options)
- Added `sentry-cli-observability-extension.plan.md` to own explicit CLI
  expansion lanes (metrics, propagation, preload decision, context
  completeness, evidence)
- Added `sentry-observability-translation-crosswalk.plan.md` as a
  lossless mapping from superseded scope to current owner plans
- Updated the narrowed child plan to link every dropped todo item to a
  concrete owner plan instead of generic "post-launch tracking"
- Updated the active architecture/infrastructure README and parent plan so
  the expanded plan set is discoverable and authority boundaries are
  explicit

### Pattern To Carry Forward
- Scope narrowing is safe only when each removed item gets a named owner
  plan, explicit acceptance lane, and a crosswalk proving translation
  completeness against the superseded source

## Session: 2026-04-15 — Parent plan merged execution checklist

### What Changed
- Added an `Integrated Execution Order (Single Checklist)` section to
  `sentry-otel-integration.execution.plan.md` as the orchestration view
  across parent, child, expansion, CLI, and crosswalk plans
- Sequenced execution into eight ordered steps from HTTP live-path
  stabilisation through translation-completeness gate
- Kept implementation authority in owner plans while giving one parent
  checklist for execution flow

### Pattern To Carry Forward
- When work is split into companion plans, add a parent-level integrated
  execution order so implementation sequence is explicit and does not rely
  on cross-file inference

## Session: 2026-04-15 — Parent metadata parity for planned work

### What Changed
- Added parent frontmatter metadata todos for every integrated execution
  step using `integrated-*` ids in
  `sentry-otel-integration.execution.plan.md`
- Linked each metadata todo to its owner lane (child, expansion, CLI, or
  crosswalk plan) and kept existing parent credential/evidence todos
- Added an explicit note in the integrated checklist section that each
  step is mirrored in metadata

### Pattern To Carry Forward
- Any orchestration checklist in plan prose must have 1:1 metadata todos so
  planned work remains queryable and status-trackable from frontmatter

## Session: 2026-04-15 — Start-right + session-handoff readiness check

### What Changed
- Ran `start-right-quick` grounding workflow and refreshed the session
  continuation prompt's live continuity contract to reflect the reconciled
  parent/child/companion Sentry plan set
- Applied session-handoff updates to the continuity contract fields, including
  current objective, next safe step, and consolidation status
- Confirmed no incoming practice-core files are waiting in
  `.agent/practice-core/incoming/`

### Surprise

- **Expected**: prose execution order in the parent plan would be sufficient
  for restart readiness
- **Actual**: user required that all planned work also be represented in
  metadata, not only prose
- **Why expectation failed**: prose can be read by humans but is less reliable
  as a machine-queryable execution surface; metadata parity is a hard
  operational requirement
- **Behaviour change**: treat "all planned work in metadata" as a standing
  requirement whenever introducing orchestration checklists

## Session: 2026-04-15 — Education skills exploration and sector content planning

### What Was Done
- Researched the Agent Skills open standard (agentskills.io) and how
  remote skill surfacing works across Claude Code, Cursor, Gemini CLI,
  and Codex — no tool has a centralised marketplace; the industry has
  converged on format but distribution is fragmented
- Investigated GarethManning/claude-education-skills: 108 pedagogical
  skills, CC BY-SA 4.0, Agent Skills 1.0 compliant, machine-readable
  `registry.json`, includes a Vercel-hosted MCP server with meta-tools
- Researched EEF licensing in depth: EEF IP Policy says Crown Copyright
  under OGL v3.0, but website T&Cs say "all rights reserved" — these
  are in tension; the existing `eef-toolkit.json` licence field uses
  "Crown-adjacent public benefit" which is not a legal term
- Created `education-skills-mcp-surface.plan.md` as a child of the
  `open-education-knowledge-surfaces` parent plan
- Created root `ATTRIBUTION.md` covering Oak API, EEF (with full
  Higgins et al. citation), and Oak Curriculum Ontology
- Updated `README.md` credits section to link to `ATTRIBUTION.md`
- Updated `LICENCE-DATA.md` to cross-reference `ATTRIBUTION.md`
- Removed premature education skills references from attribution and
  licence docs after user correction — content not yet in the repo

### Patterns To Remember
- Do not add attribution or licence entries for content that is not yet
  in the repository. The first commit that brings in external content
  must also add the corresponding licence boundary and attribution.
- When researching content licensing for UK public-sector-adjacent
  bodies (EEF, research councils, etc.), check both the IP/publication
  policy AND the website terms — they can contradict each other.
- CC BY-SA 4.0 share-alike applies to derived content, not to server
  code that loads/serves it. A workspace boundary makes this scope a
  directory rather than a mental model.
- The Agent Skills open standard (agentskills.io) is the interoperable
  format across 30+ tools. MCP prompts are the semantically correct
  primitive for surfacing skills in an MCP server.

### Surprise
- **Expected**: EEF content would have a clear, single licence
- **Actual**: two contradictory positions (IP Policy says OGL/Crown
  Copyright; website T&Cs say all rights reserved)
- **Why expectation failed**: DfE-funded bodies operate under Crown
  Copyright rules but often add restrictive website terms separately
- **Behaviour change**: for future external content licensing checks,
  always check the funding body's IP policy separately from website T&Cs
