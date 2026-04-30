---
pdr_kind: governance
---

# PDR-041: Composition-Obscurity Investigation Methodology

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-039](PDR-039-external-findings-reveal-local-detection-gaps.md)
(external-system findings reveal local detection gaps — a sibling
methodology principle: this PDR addresses the *investigation
discipline* when external systems catch what local gates miss; PDR-039
addresses the *response discipline* once a local gap is named);
[PDR-040](PDR-040-pin-to-maintainer-latest-not-highest-version.md)
(the supply-chain principle whose violation produced the empirical
instance for this PDR);
[PDR-018](PDR-018-planning-discipline.md) (planning discipline —
investigation methodology is upstream of planning).

## Context

When a bug spans multiple sensible-in-isolation layers, the obscurity
is *composition cost*, not bug cost. Every layer makes a defensible
local choice; the failure is emergent from their interaction. No
single layer is wrong; the composition fails. Investigation that
attacks any single layer in isolation will produce a fix-that-doesn't-
fix, because the composition keeps reassembling the failure.

Empirical instance (2026-04-29 + 2026-04-30, this repo): Vercel
production was failing on every `chore(release)` commit since 1.6.1.
Four layers composed badly:

1. `pnpm/action-setup@v6.0.2` was pinned by highest tag, not
   maintainer-Latest (sensible default of "use the newest version");
2. v6.0.x installs pnpm 11 as the launcher (sensible: support newer
   pnpm);
3. pnpm 11's launcher writes its env-lockfile as a separate first
   YAML document into `pnpm-lock.yaml` before delegating
   (sensible: record self-management state in the lockfile);
4. Vercel's fresh-state pnpm install rejects multi-document YAML and
   falls back to npm registry, hitting Node 24's strict
   `URLSearchParams` (sensible: each layer enforces a constraint
   correctly).

Each layer was reasonable. Three prior sessions had attempted fixes
that targeted one layer (delete the orphan YAML doc) and the
composition reassembled within a release cycle. The obscurity made
investigation expensive: agents read past the load-bearing build-log
line ("expected a single document in the stream, but found more")
across two sessions before recognising it as load-bearing. The thing
that changed in the closing session was not the signal — it was
knowing what the signal meant.

This is not a one-off pathology. Multi-tool pipelines
(monorepos with codegen + bundler + release automation; CI + cloud
deploys + framework-specific build systems; agent platforms +
hooks + memory systems) accumulate composition surfaces. The
methodology this PDR records is the discipline for navigating them.

## Decision

When investigating a failure that may be a composition error,
apply the following methodology in order. Each step is cheap and
falsifiable; deviation from order is permitted only when a step's
output explicitly redirects to a later step.

1. **Read the build log first.** The signal is in the artefact, not
   in the prior session's speculation list. Speculation lists are
   negative hypotheses (what to falsify), not narrowing tools.
   Build logs, runtime logs, deployment logs, and CI artefacts carry
   precise error messages naming the failure component. Parse the
   error message; do not start by hypothesising.

2. **Workspace-first before remote tooling.** Local artefacts
   (`vercel_logs/`, `test-results/`, `coverage/`, downloaded build
   logs) often contain the same evidence the remote MCP would expose.
   The owner may have already downloaded the complete artefact. Search
   the workspace before invoking remote tools — and certainly before
   asking the owner.

3. **Upstream issue tracker before local theory-spinning.** When a
   tool's behaviour seems inconsistent across environments
   (local-vs-CI, fresh-vs-cached, version-A-vs-version-B), the
   maintainer probably has an open issue with the precise reproduction,
   the version landscape, and any fix in flight. Search upstream
   issues before reasoning from first principles about the tool's
   internals.

4. **Version archaeology.** When a regression appeared, identify the
   precise pin that authored it. "Highest tag" pins
   ([per PDR-040](PDR-040-pin-to-maintainer-latest-not-highest-version.md))
   almost always reward this archaeology — a recently-bumped
   highest-tag pin is the most likely substrate of the regression.

The methodology is not a checklist; it is a *priority order*. Step 1
is cheaper and more decisive than step 4. The order encodes
information about where signal is most concentrated.

## Why this is PDR-shaped, not ADR-shaped

This PDR records investigation methodology — Practice substance, not
host architecture. Every Practice-bearing repo with a multi-tool
pipeline (which is approximately every modern repo) has composition-
obscurity exposure. The next contributor in any Practice repo would
re-derive this methodology if it is not recorded; the substance does
not change with stack.

There is no companion ADR. Methodology is enforced through reading
discipline and capture-distil-graduate-enforce flow, not through
host-side architectural decisions.

## Consequences

**Positive**:

- Investigation that finds the real layer faster, with less
  speculation cost and less owner-direction cost.
- Reframes "we keep reading past the build log" as a recognisable
  failure mode with a named cure.
- Provides a checklist agents can apply when investigation feels
  expensive — the cure for composition obscurity is methodology, not
  cleverness.

**Negative**:

- Methodology PDRs are easy to nod at and hard to follow under
  pressure. Step 1 (read the build log first) was load-bearing in
  three prior sessions on the empirical instance and still got
  skipped. Enforcement requires structural reinforcement (per
  [PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
  — likely as part of a session-open or investigation-open
  ritual).

## Adoption test

A session has applied this PDR when:

1. The first action after a failure surfaces is reading the relevant
   log (build, runtime, deployment, CI), and the agent can quote the
   load-bearing line.
2. Workspace-first search has happened before any remote MCP query.
3. Upstream issue search has happened before any local hypothesis
   exceeds one paragraph.
4. If a regression is named, the precise pin (commit, version,
   release) that authored it is identified before fix-shape is
   discussed.

## Evidence

- Triggering instances: 2026-04-29 Verdant Regrowing Pollen Surprise 1
  (lockfile-corruption diagnosis discipline; first instance);
  2026-04-30 Briny Lapping Harbor (full session as second instance,
  PR #92).
- Subjective experience: [`experience/2026-04-30-briny-the-frame-was-the-fix.md`](../../experience/2026-04-30-briny-the-frame-was-the-fix.md).
- Future plan: [`build-pipeline-composition-safeguards.plan.md`](../../plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md)
  (documents methodology as supporting insurance to the structural
  pin-to-Latest surface).
