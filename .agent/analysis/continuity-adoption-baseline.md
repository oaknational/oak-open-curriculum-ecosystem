# Continuity Adoption Baseline

**Captured**: 2026-04-02
**Purpose**: Pre-rollout baseline for the continuity/session-handoff adoption
lane

## Current Handoff Surfaces (Pre-Rollout)

1. `session-continuation.prompt.md`
   - Live operational prompt for the MCP App lane
   - Useful workstream summary, but no compact fixed continuity contract
2. Active plans
   - Authoritative for scope and sequencing
   - Strong on execution detail, heavier to scan for ordinary resumptions
3. `wrap-up`
   - Canonical surface existed, but bundled too much into one closeout ritual
   - Included review, deep consolidation, commit, push, and handover
   - Reported by the project owner as unused
4. Napkin
   - Strong for corrections, surprises, and emerging patterns
   - Not a compact session-resume surface on its own
5. `GO`
   - Valuable as a re-grounding and execution cadence
   - Role drifted because it was sometimes treated as a prompt artefact rather
     than as a command-backed workflow

## Current Consolidation Surfaces (Pre-Rollout)

1. `consolidate-docs`
   - Deep convergence workflow covering graduation, pattern extraction,
     distillation, fitness management, and practice exchange
2. Permanent docs
   - ADRs, governance docs, READMEs
3. Memory layers
   - napkin -> distilled -> permanent documentation

## Continuity Signals Trapped in Deep Consolidation

- Whether a session's learning has matured into doctrine
- Whether repeated surprises should become a pattern, governance rule, or ADR
- Whether prompt and plan drift has accumulated enough to need a full sweep
- Whether documentation drift and stale links have crossed the threshold for
  deep convergence work

These are important signals, but they are too heavy to require at every
ordinary session end.

## Where Ordinary Session Recovery Was Too Heavy

### 1. Closeout weight

The old `wrap-up` surface assumed that a session handoff should also trigger:

- reviewer invocation
- deep consolidation
- commit and push

That is too much machinery for everyday continuity.

### 2. No fixed continuity contract

The prompt carried useful status, but not a fixed, repeatable field set for:

- objective
- invariants
- surprises/corrections
- next safe step
- whether deep consolidation is due

### 3. Surprise capture existed, but informally

The napkin already captured corrections and surprises, but there was no
explicit structured format that made promotion decisions easier.

### 4. GO discoverability drift

Some live indexes still implied a missing `GO.md` prompt file, even though the
real surface was command/skill-backed.

## Adoption Constraints

- Keep active plans authoritative
- Do not mutate `.agent/practice-core/*` in wave 1
- Preserve the full depth of `consolidate-docs`
- Use the MCP App workstream as the evidence lane
- Keep outputs portable by design, but repo-local first
