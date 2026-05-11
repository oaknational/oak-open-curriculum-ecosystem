---
name: primary agent tooling enhancements
overview: Complete the remaining primary agent-tooling enhancements by grouping collaboration, commit-queue, identity, build-isolation, and closeout work into coherent TDD workstreams. These are infrastructure improvements to the core tool set agents rely on during everyday repo work, not sideline friction fixes.
todos:
  - id: shared-cli-discoverability
    content: Implement shared help/error conventions and close discoverability frictions F-01, F-02, F-04, F-09, F-12, and F-13.
    status: completed
  - id: collaboration-read-apis
    content: Add comms list/show and claims filtering, then decide whether comms watch lands now or is promoted separately.
    status: pending
  - id: comms-render-resilience
    content: Make comms rendering resilient to malformed and legacy-schema event files with visible diagnostics.
    status: pending
  - id: commit-queue-safety
    content: Add commit-queue list/show and fix or guard the active-claims fingerprint recursion.
    status: pending
  - id: identity-build-isolation
    content: Split built/dev agent-tools invocation paths and document plus implement name-prefix identity routing expectations.
    status: pending
  - id: register-closeout
    content: Update friction statuses with evidence, verify F-16 routing, run gates/reviewers, and perform handoff/consolidation.
    status: pending
isProject: false
---

# Primary Agent Tooling Enhancements Plan

## Scope

This is the executable implementation plan for the remaining primary
agent-tooling improvements tracked in
[`.agent/plans/agent-tooling/frictions-register.md`](/.agent/plans/agent-tooling/frictions-register.md).
It is not a sideline cleanup plan and not a plan to create another plan.

The affected tools are part of the working substrate agents use to coordinate,
inspect collaboration state, queue commits, identify participants, and recover
from malformed shared-state inputs. Completing the remaining work improves the
daily operator path for every agent that uses `agent-tools`.

The friction register remains the source of truth for issue inventory:

- Completed in working tree: `F-01`, `F-02`, `F-04`, `F-09` for
  `collaboration-state`, `F-12`, and `F-13` via Workstream 1.
- Already addressed outside this plan: `F-03`, `F-14`.
- Routed elsewhere: `F-16` via [`.agent/plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](/.agent/plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md).
- Remaining implementation scope: `F-05`, `F-06`, `F-07`, `F-08`, `F-10`,
  `F-11`, and `F-15`, plus final register/docs closeout.

Non-goals:

- Do not reimplement `F-14`; only update its status after the working-tree fix
  lands.
- Do not duplicate `F-16`; keep that work in the existing skills standardisation
  plan.
- Do not turn the friction register into an execution plan; update statuses only
  after verified landings.
- Do not batch all remaining work into a single opaque landing. Workstreams 4
  and 5 touch commit safety and identity routing, so they need focused review.

## Bugs

Recorded bugs against agent-tooling CLIs and helpers. **Every bug fix in
this section MUST be test-first**: write the failing test that captures
the bug shape (red), then land the product code that makes it pass
(green), in one atomic commit per the TDD-as-design discipline. No
fixes-without-tests, no audit-shaped tests written after the fact.

| ID | Surface | Symptom | Reported | Status |
|---|---|---|---|---|
| B-01 | `pnpm agent-tools:collaboration-state -- comms send --title <t> --body <b> --platform <p> --model <m> --now <iso>` | Errors with `Error: missing required string field: created_at` despite `--now <iso>` being passed. Validator expects `created_at` that `--now` should populate. CLI prints full help on the failure (good), but the only working path today is direct append to `.agent/state/collaboration/shared-comms-log.md` per the bootstrap fast-path. | 2026-05-11 (Blooming Growing Thicket / `756c60`) | open |

### Bug-fix discipline (applies to every row above)

- **Test-first**: failing integration test (or unit test where the failure
  is pure-helper localisable) lands in the same atomic commit as the
  product-code fix. Test must describe the symptom from a user's
  invocation perspective (the CLI flag combination that fails today).
- **No skipped tests, no audit-shaped tests**: the test must exist
  because the bug exists, not because the fix exists.
- **Reviewer dispatch**: code-expert + test-expert at minimum; type-expert
  if the fix touches the validator type surface.
- **Update this table**: move the row from `open` to `fixed` with the
  commit SHA in the same commit that lands the fix.

## Current State

Workstream 1 is complete in the working tree and uncommitted by owner boundary.
It added shared `collaboration-state` CLI discoverability improvements, pure
helper tests, README/register evidence, and clean specialist review.

The remaining work is important infrastructure work, grouped as follows:

1. **Workstream 2 — collaboration read APIs**: make comms events and claims
   inspectable without ad hoc scripts.
2. **Workstream 3 — comms render resilience**: prevent one malformed event from
   blocking every agent's shared-log regeneration.
3. **Workstream 4 — commit-queue safety and read APIs**: improve queue
   inspection and close the active-claims fingerprint recursion hazard.
4. **Workstream 5 — identity and build isolation**: stop ordinary sessions from
   rebuilding the tools they are using and make identity routing drift visible.
5. **Workstream 6 — register, docs, and closeout**: finish evidence, routing,
   final gates, reviewer coverage, and handoff/consolidation.

## Sequencing

Start with the shared CLI ergonomics layer, then use it in the feature-specific
workstreams. This keeps fixes simple and avoids repeating help/error handling in
every command.

1. Establish shared CLI help/error conventions for collaboration-state and
   commit-queue commands. **Completed in working tree.**
2. Add missing read-side commands and filters.
3. Harden comms rendering and write confirmation.
4. Fix commit-queue protocol safety.
5. Resolve identity/build isolation and pair-key routing.
6. Refresh docs/register statuses and run specialist review.

## Workstream 1: Shared CLI Discoverability

Status: **completed in working tree, uncommitted by owner boundary**.

Issues covered: `F-01`, `F-02`, `F-04`, `F-09`, `F-12`, `F-13`.

Target files:

- [`agent-tools/src/collaboration-state/cli.ts`](/agent-tools/src/collaboration-state/cli.ts)
- [`agent-tools/src/collaboration-state/cli-options.ts`](/agent-tools/src/collaboration-state/cli-options.ts)
- [`agent-tools/src/collaboration-state/cli-specs.ts`](/agent-tools/src/collaboration-state/cli-specs.ts)
- [`agent-tools/src/collaboration-state/cli-claim-commands.ts`](/agent-tools/src/collaboration-state/cli-claim-commands.ts)
- [`agent-tools/src/collaboration-state/cli-comms-commands.ts`](/agent-tools/src/collaboration-state/cli-comms-commands.ts)
- [`agent-tools/src/commit-queue/args.ts`](/agent-tools/src/commit-queue/args.ts)
- [`agent-tools/src/commit-queue/options.ts`](/agent-tools/src/commit-queue/options.ts)

TDD cycles:

- Prove invalid options return full command help plus the specific error for
  `collaboration-state` commands.
- Prove `claims close --closure-summary` is accepted as an alias for
  `--summary`, or replace `--summary` everywhere if the implementation can be
  renamed without compatibility concerns.
- Prove `claims open --area-kind` help and unsupported-kind errors enumerate
  `files | workspace | plan | adr | git`.
- Prove `comms send` help names the required identity seed inputs and success
  output prints event id plus path.
- Add README examples for `claims open --file` and
  `claims open --area-pattern` so `F-04` fully closes.

Acceptance:

- Agents can recover from a bad command from the first error response.
- No accepted enum or repeatable-flag semantics require source-grep to discover.
- `F-01`, `F-02`, `F-04`, `F-09`, `F-12`, and `F-13` have updated register
  statuses with evidence.

## Workstream 2: Collaboration Read APIs

Issues covered: `F-07`, `F-08`.

Target files:

- [`agent-tools/src/collaboration-state/cli-comms-commands.ts`](/agent-tools/src/collaboration-state/cli-comms-commands.ts)
- [`agent-tools/src/collaboration-state/cli-claim-query-commands.ts`](/agent-tools/src/collaboration-state/cli-claim-query-commands.ts)
- [`agent-tools/src/collaboration-state/cli-specs.ts`](/agent-tools/src/collaboration-state/cli-specs.ts)
- [`agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts`](/agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts)

TDD cycles:

- Add `comms list` with filters for `--since`, `--audience`, and `--from`
  over immutable event JSON.
- Add `comms show --event-id <id>` for exact event inspection.
- Add optional `comms watch` as a polling command only if it can be implemented
  without long-running service assumptions; otherwise promote watch to a future
  plan and close the list/show part now.
- Extend `claims list` filters for `--prefix`, `--name`, `--thread`, and
  `--kind`.

Acceptance:

- Agents no longer need ad hoc Python to inspect comms events or filtered
  claims.
- `claims show` remains intact.
- `F-07` and `F-08` are closed or split into closed list/show plus deferred
  watch with an explicit future-plan trigger.

## Workstream 3: Comms Render Resilience

Issue covered: `F-05`.

Target files:

- [`agent-tools/src/collaboration-state/state-io.ts`](/agent-tools/src/collaboration-state/state-io.ts)
- [`agent-tools/src/collaboration-state/state-parsers.ts`](/agent-tools/src/collaboration-state/state-parsers.ts)
- [`agent-tools/src/collaboration-state/cli-comms-commands.ts`](/agent-tools/src/collaboration-state/cli-comms-commands.ts)

TDD cycles:

- Prove render can continue past one malformed JSON file while surfacing the
  offending path.
- Prove legacy-schema event files are reported distinctly from syntax errors.
- Decide whether degraded render exits non-zero after writing the partial log,
  or whether `--strict` is the only non-zero mode. Prefer the least surprising
  operator contract and document it in help.

Acceptance:

- One bad event no longer blocks every agent from regenerating
  `shared-comms-log.md`.
- The bad file path and reason are visible in command output.
- `F-05` is closed with tests for syntax and schema failures.

## Workstream 4: Commit-Queue Safety And Read APIs

Issues covered: `F-11`, `F-15`.

Target files:

- [`agent-tools/src/commit-queue/cli.ts`](/agent-tools/src/commit-queue/cli.ts)
- [`agent-tools/src/commit-queue/core.ts`](/agent-tools/src/commit-queue/core.ts)
- [`agent-tools/src/commit-queue/status.ts`](/agent-tools/src/commit-queue/status.ts)
- [`agent-tools/src/commit-queue/args.ts`](/agent-tools/src/commit-queue/args.ts)
- [`agent-tools/tests/commit-queue.unit.test.ts`](/agent-tools/tests/commit-queue.unit.test.ts)
- [`.agent/skills/commit/SKILL.md`](/.agent/skills/commit/SKILL.md)

TDD cycles:

- Add `commit-queue list` filters for `--prefix` and `--phase`, preserving
  `status` as the aggregate view.
- Add `commit-queue show --intent-id <id>` for exact queue entry inspection.
- Fix fingerprint recursion either by moving the staged fingerprint outside the
  staged registry payload or by adding an explicit verifier guard and documented
  `stage -> record -> do not re-stage` contract.
- If choosing the guard/documentation approach, add a test that detects an
  invalid re-stage shape and reports the corrective action.

Acceptance:

- Agents can inspect queue state without parsing the whole registry manually.
- The active-claims fingerprint loop is either structurally impossible or
  detected with an actionable error before repeated attempts.
- `F-11` and `F-15` are closed or split only if the structural
  fingerprint-store change needs its own migration plan.

## Workstream 5: Identity And Build Isolation

Issues covered: `F-06`, `F-10`.

Target files:

- [`package.json`](/package.json)
- [`agent-tools/package.json`](/agent-tools/package.json)
- [`agent-tools/src/core/agent-identity/`](/agent-tools/src/core/agent-identity/)
- [`agent-tools/src/collaboration-state/claim-reports.ts`](/agent-tools/src/collaboration-state/claim-reports.ts)
- [`.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md`](/.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)

TDD cycles:

- Split agent-tools scripts into built/no-rebuild and dev/rebuild paths, then
  update operational guidance to prefer built tools during ordinary agent
  sessions.
- Preserve deliberate development workflows with explicit dev scripts.
- Amend PDR-027 or adjacent identity docs to name
  `(agent_name, session_id_prefix)` as the routing key.
- Update collaboration-state matching/reporting so name-prefix mismatches are
  surfaced as drift signals, not silent wrong-recipient routing.

Acceptance:

- Live agent sessions stop rebuilding the tool they are using unless explicitly
  in dev mode.
- Identity routing expectations are documented and represented in the relevant
  query/mine/report code.
- `F-06` and `F-10` are closed with tests and docs.

## Workstream 6: Register, Docs, And Closeout

Issues covered: all remaining statuses plus `F-16` routing verification.

Target files:

- [`.agent/plans/agent-tooling/frictions-register.md`](/.agent/plans/agent-tooling/frictions-register.md)
- Existing follow-up plan for `F-16`: [`.agent/plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](/.agent/plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)

Actions:

- Update every friction status with commit evidence after each workstream lands.
- Keep `F-16` linked to the existing skills standardisation plan unless that
  plan is superseded by owner direction.
- Run consolidation/handoff workflow after implementation completes.
- Archive or split any residual future work with explicit promotion triggers.

## Validation

Run after each workstream:

- `pnpm --dir agent-tools exec vitest run <changed-test-file>` for exact focused
  proof.
- `pnpm --filter @oaknational/agent-tools type-check`.
- `pnpm --filter @oaknational/agent-tools lint`.
- `pnpm exec markdownlint --dot <changed-markdown-files>` for register/docs
  changes.

Run before final closeout:

- `pnpm --filter @oaknational/agent-tools test` if unrelated live adapter-state
  failures have been resolved; otherwise report exact unrelated failure and
  provide direct focused evidence for changed tests.
- `pnpm portability:check` if script, adapter, identity, or skills surfaces
  changed.
- Specialist reviewers: `code-expert`, `test-expert`,
  `docs-adr-expert`, and `architecture-expert-fred` for
  PDR-027/build-isolation changes.

## Risks

- `F-09` can sprawl if every CLI grows its own help/error implementation.
  Mitigation: extract a small shared helper first, then adopt incrementally.
- `F-05` degraded render semantics can hide bad events if output is too quiet.
  Mitigation: always report skipped paths and counts, and use `--strict` for
  gate contexts.
- `F-15` touches commit safety. Mitigation: land it as its own cycle with
  isolated commit-queue tests and reviewer scrutiny before other queue changes.
- `F-06` changes operational script behaviour. Mitigation: keep explicit
  dev/rebuild commands and update docs so tool authors know when rebuilds
  happen.
