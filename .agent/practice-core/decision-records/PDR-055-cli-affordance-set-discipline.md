---
pdr_kind: governance
---

# PDR-055: CLI Affordance-Set Discipline for Coordination Tooling

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities belong to the Practice — coordination CLIs are
Practice substance);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — affordance gaps are
the failure mode this PDR closes);
[PDR-053](PDR-053-orchestrator-vs-gate-structural-cure.md)
(orchestrator-vs-gate structural cure — CLI affordances participate in
the polarity-at-three-surfaces shape).

## Context

When a Practice-bearing repo grows past a small N of concurrent agents,
coordination CLIs become first-class infrastructure. The 7-agent
coordinator session of 2026-05-05 surfaced an affordance set that is
load-bearing for cross-agent coordination at scale; the gaps in that
set produce friction visible in every session.

The minimum coordination affordance set on each first-class collaboration
surface is:

- `list [--filter ...]` — enumerate live entries
- `show <id>` — render a single entry's substance in human-readable form
- `watch [--filter ...]` — non-blocking streaming view of new entries
  on platforms with background services; bare polling-shaped JSON
  list output for platforms without
- consistent named-flag discoverability across surfaces (same flag
  name does the same thing across `claims`, `commit-queue`, `comms`,
  etc.)
- full-help output on every flag-validation failure (no single-line
  error responses)
- robust render boundaries: a single malformed entry does NOT block
  rendering or query operations on the broader surface

The session also surfaced a build-isolation question: the CLIs were
rebuilt-on-each-invocation under in-flight tooling refactors, causing
identity drift mid-session (a CLI built early in the session had
different behaviour from one built later when the source had moved).
This is the host-architectural concern; the affordance set above is the
portable Practice concern.

## Decision

For coordination CLIs on a Practice-bearing repo's collaboration surface
(`claims`, `commit-queue`, `comms`, identity, and any analogous future
surface):

1. **Full affordance triple**. Every first-class collaboration surface
   provides `list`, `show`, and `watch` (or its polling equivalent).
   The triple is the minimum; surfaces may add filter / mutation
   subcommands on top.

2. **List filters by core dimensions**. Every `list` command accepts
   filters by the surface's core dimensions: agent name (or prefix),
   thread, kind, and phase or status. Filter flags use the same names
   across surfaces (e.g. `--thread`, `--agent`, `--phase`) so an
   operator's muscle memory transfers.

3. **Watch command with non-blocking design**. Watch commands are
   non-blocking by default (return promptly with a polling iteration
   or a streamed batch), so they do not lock up an interactive shell
   or an agent-side pipeline. Long-running streaming is opt-in via
   an explicit flag (e.g. `--follow`), not the default.

4. **Full-help on flag failure**. Every CLI invocation with an
   invalid flag, missing required flag, or malformed argument prints
   the *full* help text (the same output as `--help`) before exiting
   non-zero. Single-line error responses are insufficient: the CLI's
   purpose is to teach the operator what it accepts, especially under
   failure.

5. **Robust render boundaries**. A malformed individual entry on a
   collaboration surface (a single bad JSON event, a single corrupted
   claim row) does NOT block rendering, listing, or querying the rest
   of the surface. The bad entry is reported with its identifier and
   the error context; the surrounding work continues.

6. **Use built artefacts, not source-on-each-invocation**. CLIs are
   invoked via their *built* dist artefact, not rebuilt from source
   per call. Build-on-each-invocation under in-flight tooling refactor
   produces identity drift across a single session — a CLI built early
   has different behaviour from one built later when the source has
   moved.

## Scope

**Adopter scope**: every Practice-bearing repo with multi-agent
collaboration CLIs. The affordance triple, filter conventions, full-help-
on-failure rule, robust-render rule, and built-not-source rule are
portable.

**Host-architectural concerns**: the specific build-isolation mechanism
(separate build step? watch-then-built dist? compiled binary?) is
host-architectural and lives in a host ADR. ADR-178 carries this repo's
choice.

**Not in scope**: feature additions beyond the affordance triple
(retention policies, analytics, archive views). Those are host concerns
that ride on top of the triple.

## Rationale

The coordination affordance set is load-bearing precisely *because* it
is invisible until missing. The 7-agent coordinator session surfaced
seven distinct affordance gaps in a single 24-hour window:

- No `comms list/show/watch` — agents could not query inbound
  coordination signals without grepping shared-comms-log directly.
- No `claims list/show` filtered by prefix/name/thread/kind — claims
  visibility required reading `active-claims.json` raw.
- No `commit-queue list/show` filtered by phase or agent — queue
  inspection required raw JSON parsing.
- Inconsistent flag names (`--summary` vs `--closure-summary`,
  `--file` vs `--area-pattern`) — agents had to re-learn the
  vocabulary at each surface.
- `comms render` fragile — a single malformed event blocked the entire
  rendered log regeneration.
- Build-on-each-CLI-invocation under tooling refactor — identity drift.
- Help-on-flag-failure inconsistent — agents got terse single-line
  errors when they needed the full vocabulary.

Each gap was crossed multiple times in the session. The friction
compounds with N: the cost of missing affordances scales with the
number of agents who hit each gap.

The full-help-on-failure rule is owner-stated standing direction:
*"all invocations of ALL agent tools with improper flags MUST print
the FULL help text"*. The built-CLI rule is owner-stated standing
direction: *"all agents use only the built agent tools, so that
development work can happen on them without causing this issue
again"*.

## Consequences

**Required**:

- Coordination CLIs on every collaboration surface implement the
  affordance triple (list / show / watch) with consistent filter
  flags.
- Every CLI prints full help on flag-validation failure.
- Render commands skip and report individual malformed entries; they
  do not abort the broader surface.
- CLIs are invoked via their built dist; build is a separate step.

**Forbidden**:

- Adding a new collaboration surface CLI without the affordance
  triple. The triple is the minimum cost of admission.
- Single-line error responses on flag failure.
- Render commands that abort on a single malformed entry.
- Source-on-each-invocation patterns under in-flight tooling work.

**Costs**:

- Adopter repos pay a one-time implementation cost for the affordance
  triple per surface. The cost is amortised across every multi-agent
  session.

## Implementation

The host-repo operational application lands as ADR-178 (agent-tools
build isolation) plus a follow-on plan in `.agent/plans/agent-tooling/`
that tracks the affordance-set implementation slices per surface. The
existing CLI surfaces in `agent-tools/` are extended incrementally; the
PDR's substance is the *requirement* shape, not the implementation
sequence.

User-memory references that reinforce specific corollaries (full-help
discipline; built-CLI discipline) cite this PDR.

## Source

This PDR graduates the substance of the
`pending-graduations.md` entry *"PDR/ADR candidate — agent-tools CLI
affordance set + build isolation"* (captured 2026-05-05 from the 7-agent
coordinator session; deferred under fabricated-gate vocabulary across
multiple sessions until owner reframe in the `knowledge graduation`
session 2026-05-10).
