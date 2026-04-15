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
