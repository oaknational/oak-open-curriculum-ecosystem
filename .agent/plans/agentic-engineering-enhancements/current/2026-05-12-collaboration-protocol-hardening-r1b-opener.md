# Collaboration Protocol Hardening — R1.b + Tail Session Opener

**Thread**: `agentic-engineering-enhancements`.
**Branch**: `feat/mcp-graph-support-foundation` (verify HEAD at session open;
R1.a landed `f7560339`, handoff landed `6f2f2b4d`).

## Why this session exists

R1.a (Smouldering Crackling Pyre, 2026-05-11) landed the canonical
`comms-event.schema.json` with three `$defs` (narrative / lifecycle /
directed) at `f7560339`. R1.b is the load-bearing code refactor that
projects the schema's `$defs` onto three sibling directories and
replaces the flat `parseCommsEvent` / `CommsEvent` with three
single-schema parsers and three TypeScript types. After R1.b, the
collaboration-protocol-hardening tail (R2 / R3 / R4b / R4-new / R5 /
Phase 4 / Phase 5) can proceed.

**Two refuted-premise re-decisions are now closed**; do not re-open them.

## Closed re-decisions (do not re-open)

- **Three families, not two.** Pre-flight fingerprint scan returned
  narrative 311+ / lifecycle 5 / directed 2 with accreted narrative
  variants. The two-family diagnosis is dead.
- **Shape A′ (three directories, one canonical schema).** Protocol SoT
  = `comms-event.schema.json`; application SoT = directory layout
  (projection of `$defs`). Owner-articulated criterion: *"single source
  of truth for the protocol, not the same as only having a single
  application for that protocol."*

## R1.b — the load-bearing landing

**Single atomic test-first commit.** Test and product code travel
together per `tdd-as-design.md`.

### File moves (atomic with code)

- Migrate 5 lifecycle events from `.agent/state/collaboration/comms-events/`
  to `.agent/state/collaboration/comms-lifecycle/` (no field renames —
  current shape is correct per the schema's `$defs.lifecycle`):
  `fe4acc7e-cons-doc-2026-04-29-14-30.json`,
  `fe4acc7e-cons-doc-close-2026-04-29-15-15.json`,
  `fe4acc7e-coord-pearly-2026-04-29-15-50.json`,
  `fe4acc7e-deep-cons-close-2026-04-29-16-30.json`,
  `fe4acc7e-deep-cons-open-2026-04-29-15-30.json`.
- Migrate 2 directed events to
  `.agent/state/collaboration/comms-messages/` **with `timestamp` →
  `created_at` field rename in each event JSON**:
  `3882213c-a6b1-4661-a1cd-a261f50ea5e8.json`,
  `b0353884-4026-4a24-b2a3-b6b7fca846d4.json`.
- Remaining 312 narrative events stay in `comms-events/` untouched.

### Code refactor

- **`agent-tools/src/collaboration-state/types.ts`** — replace flat
  `CommsEvent` interface with `NarrativeCommsEvent`,
  `LifecycleCommsEvent`, `DirectedCommsMessage` (three readonly
  interfaces; no discriminated union — directory carries the
  discriminator).
- **`agent-tools/src/collaboration-state/state-parsers.ts`** — replace
  `parseCommsEvent` with `parseNarrativeCommsEvent`,
  `parseLifecycleCommsEvent`, `parseDirectedCommsMessage`. Each is
  single-schema, no dispatch.
- **`agent-tools/src/collaboration-state/state-io.ts`** — `readCommsEvents`
  takes a kind parameter or splits into three reader functions;
  `writeCommsEvent` writes to the kind-appropriate directory.
- **`agent-tools/src/collaboration-state/comms.ts`** — `renderEvent` /
  `compareEvents` / `renderSharedCommsLog` handle three kinds (each
  kind has a kind-specific renderer; log aggregates across kinds in
  time order; `compareEvents` uses `created_at` uniformly because the
  schema canonicalises the field name).
- **`agent-tools/src/collaboration-state/cli-comms-commands.ts`** —
  `sendComms` writer path; `appendComms`; `renderComms` walks all
  three directories.
- **`agent-tools/src/practice-substrate/live-types.ts`** — add
  `CANONICAL_LIFECYCLE_ROOT` and `CANONICAL_MESSAGES_ROOT` alongside
  existing `CANONICAL_EVENTS_ROOT`.
- **`agent-tools/src/practice-substrate/live-json.ts`** — extend
  `evaluateCommsEvents` / `readCommsEventFiles` to walk all three
  directories. Each event validated against the appropriate `$def`
  via the schema authority.
- **`agent-tools/src/practice-substrate/live-json-support.ts`** —
  `collaborationAjv` loads `comms-event.schema.json` alongside the
  active-claims / closed-claims / conversation / escalation schemas.

### Tests (test-first; atomic with product)

- New parser unit tests for each parser: success cases for
  representative fixtures; failure cases for schema violations.
- Integration test: `evaluateCollaborationJsonSurfaces` reads all
  three directories, returns the union, reports zero parse failures
  against the migrated corpus.
- Rewrite existing tests that depended on the flat `CommsEvent`
  (collaboration-state.unit.test.ts).

### Per-step reviewers

- `code-expert` (gateway), `test-expert` (TDD pair audit), `type-expert`
  (schema/type flow), `docs-adr-expert` (schema authority +
  protocol-as-directory-projection framing).

## Phase 0 (at session open)

- Bootstrap fast-path: read `active-claims.json` + tail of
  `shared-comms-log.md`. Register a session claim covering the precise
  file/glob list, NOT all of `comms-events/**` (peer sessions may post
  narrative events during this work).
- Pre-flight: re-run the fingerprint scan; any new shape pauses and
  surfaces to owner.
- Confirm `f7560339` (R1.a) and `6f2f2b4d` (handoff) as ancestors.

## Tail items (after R1.b lands; explicitly deferred this session)

These are atomic landings independent of one another. Land in any
order after R1.b. Each is a separate commit with reviewer dispatch.

- **R2 — B-10 shell-mangling investigation.**
- **R3 — Identity caching for wordlist drift.**
- **R4b — Commit-skill mandates pathspec.**
- **R4-new — Native git pre-commit hook.**
- **R5 Path β migration** (5 sub-steps; R5.0 first).
- **R7 — B9 plan stub.**
- **R8 — Pattern capture.**

## Phase 4 — four-probe validation matrix (deferred)

After all tail landings, dispatch `architecture-expert-wilma`
adversarially across the four probes from the predecessor opener.

## Phase 5 — arc closure (deferred)

Update pending-graduations; mark sibling plans; refresh thread record;
full `/jc-consolidate-docs` pass; announce arc closure.

## Discipline carried into this session

- **Architectural excellence over expediency** — no cheap-cure shape
  ever surfaced.
- **Test-first for every fix; atomic test + product commits.** No
  audit-shaped tests; no skipped tests.
- **Stage by explicit pathspec; commit by explicit pathspec.**
- **Manual post-hook eyeball** per PDR-059 + ADR-177 amendment (gates
  not yet implemented; classification by hand at the
  post-hook-pre-commit window).
- **No `--no-verify`** without fresh per-commit owner authorisation.
- **No speed pressure** — R1.b is a full-session atomic landing;
  tail items deferred if budget consumed.
- **Inter-agent coordination via comms-events** — proven this session
  with Fronded Flowering Seed (sidebar `2e1a886f` → reply `544bf9bf`
  in 10 minutes, claim narrowed without owner mediation).

## Cross-references

- `.agent/state/collaboration/comms-event.schema.json` — canonical
  protocol authority landed `f7560339`.
- `agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts`
  — R1.a tests; TDD baseline for R1.b parser tests.
- `.agent/practice-core/decision-records/PDR-059-regenerator-output-classification.md`
  — post-hook classification doctrine.
- `docs/architecture/architectural-decisions/177-asymmetric-cure-enforcement-in-staging.md`
  — host-repo amendment for PDR-059.
- `.agent/plans/agentic-engineering-enhancements/current/primary-agent-tooling-enhancements.plan.md`
  — B-01 closure target on commit.
