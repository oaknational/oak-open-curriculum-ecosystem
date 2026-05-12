# Codex-Exec CLI Deep Dive — Strategic Plan

**Status**: NOT STARTED — strategic brief. Promotion to `current/` requires a
second concrete consumer (the trigger condition below).
**Domain**: Agentic Engineering Enhancements
**Captured**: 2026-05-12 (Lush Sprouting Thicket session)
**Related**:

- [ADR-180 — Codex-Exec Agent Delegation Pattern](../../../../docs/architecture/architectural-decisions/180-codex-exec-agent-delegation-pattern.md)
  — ships the minimal `last-message` extractor and defers richer surface to this plan
- [ADR-125 — Skill Canonicalisation and Adapter Topology](../../../../docs/architecture/architectural-decisions/125-skill-canonicalisation-and-adapter-topology.md)
- [ADR-178 — Agent-Tools Build Isolation](../../../../docs/architecture/architectural-decisions/178-agent-tools-build-isolation.md)
- [`.agent/skills/codex-helper/SKILL-CANONICAL.md`](../../../skills/codex-helper/SKILL-CANONICAL.md)
- [`.agent/rules/consolidate-at-third-consumer.md`](../../../rules/consolidate-at-third-consumer.md)

## Problem and Intent

**Problem.** ADR-180 established `codex exec` as the preferred surface for
scripted Codex delegation. The skill that documents the pattern relies on
raw shell idioms for two concerns the agent-tools workspace could own
better:

1. **Cross-platform timeout.** macOS does not ship GNU `timeout`. The skill
   currently documents a `perl -e 'alarm N; exec @ARGV'` substitute. A
   tested TypeScript wrapper around `AbortSignal.timeout` would unify the
   surface across platforms and eliminate the cross-platform footnote.
2. **Structured-output extraction beyond the final message.** `last-message`
   handles the most common case. Schema-validated extraction
   (`--output-schema` + JSON validation via the existing `ajv` dependency)
   would let callers treat Codex output as a typed return value.

A scoping experiment during the ADR-180 session built a full `run`
subcommand. The implementation was structurally large enough to fight
the repo's complexity discipline (function-length, file-length, cognitive
complexity, type-assertion bans). The experiment was reverted to keep
only `last-message` shipping cleanly. This plan captures the deferred
design space and names the trigger for re-opening it.

**Intent.** Re-evaluate the richer CLI surface when there is genuine demand
from a second consumer beyond the skill's own examples. Until then, the
shipped `last-message` plus the skill's shell templates are sufficient.

## Guiding Principle

**Could it be simpler without compromising quality?** The first attempt
answered yes — and proved it by making the simple thing (`last-message`)
ship cleanly while the complex thing (`run`) hit discipline limits. The
question for any future iteration is whether a real consumer's needs
justify the complexity, or whether the consumer's surface can be reshaped
to fit the simpler primitive.

## End Goal

A small, well-tested set of `pnpm agent-tools:codex-exec` subcommands that
captures the patterns multiple consumers genuinely need, without forcing
through the codebase's complexity discipline.

## Mechanism

Driven by real consumer demand, not anticipated demand. The
[`consolidate-at-third-consumer`](../../../rules/consolidate-at-third-consumer.md)
discipline applies: extract shared mechanism only after the third consumer
appears.

## Means (Candidate Subcommands)

These are candidates surfaced by Codex's peer review during the ADR-180
experiment. They are not commitments. Each requires a real consumer to
justify the surface.

### Candidate A: `run`

Spawn `codex exec --json` with a bounded cross-platform timeout, stream
progress events to stderr in a human-readable form, and write the final
assistant message to stdout. Exit code `124` on timeout.

**Why it was hard last time:**

- 10+ flags through `parseRunOptions` exceeded the function-complexity limit.
- Event-streaming and child-process lifecycle pushed `cli.ts` over the
  file-length limit.
- The injected-spawn pattern for testability required type definitions
  for a `SpawnResult` shape that pragmatically replicates parts of
  `ChildProcess`.

**Reshape ideas to test:**

- Table-driven flag parser as a separate module with one handler per flag.
- Spawn lifecycle in its own module with the wrapper kept narrow.
- Smaller default flag surface — only what consumers actually use, not
  the full `codex exec` flag set.

### Candidate B: `extract`

Read a `--output-last-message` file and optionally validate against a
JSON Schema using the existing `ajv` dependency.

**Use case shape required to justify:** a consumer that asks Codex for
structured output and needs the validation surface centralised.

### Candidate C: `validate-brief`

Check brief quality (target files named, output contract stated, grounding
required for repo-aware work, no dangerous flags without authorisation).
Reads from stdin, exits non-zero with explanatory stderr on violation.

**Use case shape required to justify:** routine programmatic brief
construction, not just hand-written briefs in skills.

## Non-Goals

- **Not a full `codex exec` replacement.** The raw CLI is the authoritative
  surface for advanced/uncommon flag combinations.
- **Not a general-purpose subprocess wrapper.** Scope is narrowly
  Codex-specific.
- **Not an event-stream API for callers.** If callers need event-level
  access they can use `codex exec --json` directly and pipe through
  `last-message`.

## Dependencies and Sequencing

- **Blocking**: a second concrete consumer for any candidate subcommand
  (a real script or skill that needs the surface, not just an example).
- **Beneficial**: review of Codex CLI flag stability — if the underlying
  flag set changes, the wrapper has to track it. A versioned wrapper may
  not pay for itself if the upstream surface is unstable.

## Strategic Acceptance Criteria

Promotion to `current/` requires:

1. A second concrete consumer for at least one candidate subcommand,
   captured as an example invocation in the skill or in another plan.
2. A reshape strategy (per the "reshape ideas to test" notes above) that
   keeps each candidate inside the repo's discipline limits without
   resorting to type assertions or `Record<string, unknown>`.
3. An assumptions-expert review of the reshaped scope before any code
   lands.

Acceptance for completed work (when promoted):

- Each subcommand has unit tests with injected child-process behaviour.
- Each subcommand stays under the 50-line function and 250-line file
  limits without splitting concerns artificially.
- The skill documentation references the new surface and removes the
  corresponding shell footnote.
- An ADR amendment to ADR-180 records what shipped and what stayed
  deferred.

## Risks and Unknowns

- **Codex event API drift.** Field names like `item.text` are not part of
  a versioned contract. A wrapper that locks in those names becomes a
  maintenance liability if Codex changes shape.
- **Discipline tension.** The first attempt showed that the codebase's
  complexity rules and `codex exec`'s flag surface are in genuine
  tension. The right reshape may be a much smaller flag surface, not a
  more clever implementation.
- **Premature abstraction.** Adding subcommands ahead of demand fragments
  the surface without producing value. The third-consumer rule is the
  guard.

## Promotion Trigger

Open this plan to `current/` when **two or more concrete consumers** for
the same candidate subcommand exist. A consumer is concrete when there is
a named script, skill, or plan that would use the surface — not a
hypothetical "someone might".

Until that trigger fires, the shipped `last-message` plus the skill's
shell templates are the agreed steady state.

## Plan-Body First-Principles Check

The shape, landing-path, and vendor-literal clauses fire at promotion to
`current/`. Specifically:

- **Shape**: confirm the candidate subcommand has a real consumer; if
  not, do not promote.
- **Landing-path**: any execution plan must show how each subcommand
  lands within the repo's complexity discipline; if the answer is
  "we'll figure it out", do not promote.
- **Vendor literals**: confirm whether `codex exec`'s flag set has
  changed since this plan was written; refresh the candidate flag
  surface against the live `--help` output before promotion.

## Foundation Alignment

- `principles.md` — strict-and-complete (no permissive fallbacks),
  architectural-excellence-over-expediency (no cheap-cure subcommand
  shapes), strict refactor limits (50-line functions, 250-line files,
  complexity ≤8).
- `consolidate-at-third-consumer.md` — extract only after demand.
- `local-broken-code-never-leaves.md` — observed proof of each subcommand
  is required before push.
