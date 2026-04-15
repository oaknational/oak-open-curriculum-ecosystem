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
- On this branch, the worktree is already dirty with doc/plan/memory
  changes. Treat them as pre-existing context and do not tidy or
  overwrite them while grounding
- Current safe next step from the continuation prompt remains:
  commit the pending doc-only changes before starting new Sentry or
  compliance work
