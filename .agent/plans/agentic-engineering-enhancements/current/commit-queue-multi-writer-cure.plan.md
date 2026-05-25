---
name: "Commit Queue Multi-Writer Cure"
overview: >
  Make multi-agent commit handoff safe under concurrent writing by planning
  native intent-scoped commit messages, first-class marshal transfer metadata,
  and line-scoped staging support.
todos:
  - id: owner-review-gate
    content: "Obtain owner review on this plan body before any implementation tranche starts."
    status: pending
  - id: tranche-c-message-files
    content: "Tranche C: add native intent-scoped commit message storage so commit-queue commits do not depend on shared COMMIT_EDITMSG or ad hoc temporary files."
    status: pending
  - id: tranche-b-marshal-handoff
    content: "Tranche B: add first-class source-requester plus committing-marshal handoff metadata and guard semantics."
    status: pending
  - id: tranche-a-line-scoped-staging
    content: "Tranche A: add line-scoped staging intent support with human ranges and machine-verifiable hunk fingerprints."
    status: pending
  - id: closeout-consolidation
    content: "After implementation tranches land, consolidate learning into commit skill, collaboration guidance, schemas, and pending graduations."
    status: pending
isProject: false
---

# Commit Queue Multi-Writer Cure

**Last Updated**: 2026-05-23
**Status**: PLANNING — owner review required before implementation
**Collection**: `agentic-engineering-enhancements/current`
**Thread**: `agentic-engineering-enhancements`
**Owner Direction**: "Author now; an efficient commit pipeline is the single
biggest friction in agent team efficiency at the current time."

## Intent

The current commit queue protects staged-bundle integrity for a single
committing agent, but it does not yet model the real multi-agent flow used in
team sessions:

1. a source agent authors a bundle and validates it;
2. a commit marshal owns the short-lived `git:index/head` window;
3. dirty shared files often contain multiple agents' hunks at once;
4. commit message bodies can collide through shared editor paths.

This plan turns those observed handoff workarounds into explicit substrate.
It does not implement any tranche in this cycle.

## Evidence Base

Fresh in-session evidence:

- Gilded Drifting Meteor's PDR-071 queue item `d9124e3f` carried useful
  author intent, but Stratospheric had to translate it because the queued
  claim was a files claim rather than the marshal's `git:index/head` claim.
- Starlit Shimmering Dusk's ADR-184 bundle hit the same marshal-transfer
  gap and a shared `pending-graduations.md` hunk boundary problem.
- Lacustrine Sailing Lighthouse's `practice.md` bundle was a clean whole-file
  change, yet still needed source-agent to marshal-intent translation.
- Stratospheric's marshal report named the same failure across Gilded,
  Lacustrine, and Starlit handoffs: requester identity and marshal commit
  authority are different concepts but the intent model currently conflates
  them.
- Secret Creeping Moth's PDR-073 commit `6ebaae58` (2026-05-23 ~10:48Z) is
  direct evidence that the staged-file pre-commit hook path can WIDEN a
  line-scoped index patch. Stratospheric staged only Secret's PDR-073 hunks
  in `README.md` and `pending-graduations.md`, but the hook restaged whole
  shared Markdown files, sweeping Gilded's PDR-072 hunks into the same
  commit while the PDR-072 file itself remained uncommitted. Line-scoped
  staging is therefore not robust until it is robust across the pre-commit
  path, not only before hooks.

Historical evidence:

- Velvet's `COMMIT_EDITMSG` concurrent-write incident landed one agent's
  content under another agent's message label.
- Four agents independently adopted intent-scoped temporary message files
  during the 2026-05-22 to 2026-05-23 team window. That emergent convention
  is evidence that the CLI should own the pattern.

## Problem

The queue currently serialises commit order, but three gaps remain:

1. **Shared commit-message path** — `.git/COMMIT_EDITMSG` is a single-writer
   path. Agents compensate with manual temporary message files.
2. **Source requester versus marshal authority** — useful queue intents are
   linked to source-agent file claims, while `commit-queue guard` validates
   the committing agent's `git:index/head` claim.
3. **Whole-file staging only** — an intent names files, not owned hunks, so
   shared files such as `pending-graduations.md` can sweep peer work into the
   wrong commit.

The result is a protocol with the right instincts but too much hand-operated
translation at the most failure-prone moment.

## End Goal

Team sessions can hand commits to a marshal without losing authorial
traceability, message attribution, or hunk ownership.

Success means a future source agent can create one queue intent that says:

- who requested the commit;
- who is authorised to marshal it;
- which claim owns the source work;
- which claim owns the git commit window;
- where the commit message lives;
- whether each path is whole-file, generated/state, or line-scoped;
- which hunks are allowed to land.

## Mechanism

The cure is sequenced by risk and dependency:

1. **Tranche C first** because intent-scoped message storage is small,
   mechanical, and removes an immediate multi-writer race.
2. **Tranche B second** because line-scoped hunk handoff needs first-class
   source-versus-marshal identity to stay auditable.
3. **Tranche A third** because line-scoped staging is highest impact but also
   highest precision. It should build on the handoff model rather than invent
   its own source-trace mechanism.

This order differs from the first suggested `C -> A -> B` route. Stratospheric
recommended `C -> B -> A` from live marshal evidence, and this plan adopts
that order.

## Scope

In scope for downstream implementation:

- `agent-tools/src/commit-queue/**`
- `agent-tools/tests/commit-queue*.test.ts`
- `agent-tools/src/collaboration-state/**` queue consumers, including
  parsers, read models, TUI panes, and active-agent summaries
- `agent-tools/tests/collaboration-state/**` coverage for queue parsing and
  rendering after intent shape changes
- `.agent/state/collaboration/active-claims.schema.json`
- `.agent/state/collaboration/closed-claims.schema.json`
- `.agent/skills/commit/SKILL-CANONICAL.md`
- `.agent/directives/agent-collaboration.md`
- focused README or lifecycle documentation that describes the queue handoff

Out of scope:

- Any implementation in this plan-authoring cycle.
- A global mechanical git lock.
- Direct `git commit` by non-marshal agents during team sessions.
- Whole-repo cleanup of dirty collaboration state.
- Rewriting historical commits that exposed the failure mode.

## Prerequisite Classification

Blocking prerequisites:

- Owner review of this plan before `Status` becomes decision-complete.
- Architecture, assumptions, and type review findings must be resolved in the
  plan or explicitly carried to owner disposition before that owner review.
- Fresh live queue and claim grounding before each implementation tranche.
- Stratospheric or the current commit marshal must review Tranche B and
  Tranche A acceptance criteria before implementation starts.

Beneficial prerequisites:

- Additional code/config review for the implementation patches after each
  tranche has red/green evidence.

Minimum shippable shape without beneficial prerequisites:

- No tranche should start without owner approval, marshal review, and recorded
  disposition of architecture, assumptions, and type plan-readiness findings.
  Additional implementation reviewers can run inside each tranche.

## Workstreams

### WS0 — Plan Approval

Goal: make this plan decision-complete before implementation.

Acceptance:

- Owner has reviewed the plan body and approved the tranche order.
- Stratospheric's marshal-side input is reflected in the plan.
- Architecture, assumptions, and type reviewers have no blocking findings or
  their findings are resolved in the plan or recorded for owner disposition.

Validation:

```bash
pnpm markdownlint-check:root
pnpm format-check:root
```

### Tranche C — Native Intent-Scoped Commit Messages

Goal: remove shared commit-message path races.

Expected change shape:

- Tranche C is intentionally non-schema-bearing: it does not add fields to
  `commit_queue`.
- Queue-owned message storage is derived from `intent_id`, for example a
  repo-local unversioned path under `.git/commit-queue/messages/<intent_id>.md`.
  The final path is chosen in implementation, but it must be deterministic,
  repo-local, and never an absolute temporary path.
- `commit-queue enqueue` allocates the derived message path. It may accept
  `--message-body` to write content immediately, `--message-file` to copy an
  existing draft into the queue-owned path, or print the allocated path for the
  agent to fill before handoff. Existing explicit `--message-file` input
  remains accepted as a manual source, but the queue-owned copy is the default
  durable handoff location for the intent.
- `commit-queue list` and `show` expose the derived message path, presence, and
  content hash by deriving them from `intent_id`, not from a persisted schema
  field.
- `commit-queue commit` reads the intent-scoped message and does not depend on
  `.git/COMMIT_EDITMSG` unless explicitly requested.
- `complete` and `abandon` remove the derived message file or mark it for
  cleanup; expired intents are eligible for the same cleanup command.

Acceptance:

- Two queued intents can carry different message bodies without shared-path
  overwrite risk.
- The commit workflow uses the intended message for the selected intent.
- Existing explicit `--message-file` behaviour still works.
- `list` and `show` report the derived message source without a schema bump.
- Message cleanup is deterministic on complete, abandon, and expiry cleanup.
- Documentation tells agents to use queue-owned message storage rather than
  ad hoc temporary paths.

Validation:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm agent-tools:check-commit-message -m "docs(queue): test subject"
```

### Tranche B — Commit Marshal Handoff

Goal: model requester/source ownership separately from marshal commit
authority.

Expected change shape:

- Tranche B owns the commit-queue schema bump. It must update active and
  closed schemas, commit-queue types/parsers, collaboration-state parsers,
  TUI/read models, fixtures, and validation tests in one landing sequence.
- The intent shape must remove the current ambiguity around `agent_id` and
  `claim_id`. The implementation should introduce a discriminated direct
  versus transferred target shape, such as:
  - `direct`: requester and committer are the same agent; the commit-window
    claim is the validating claim.
  - `transferred`: `requester` carries source agent identity, source claim ids,
    and optional source intent id; `marshal` carries committing agent identity
    and marshal `git:index/head` claim id; transfer metadata carries timestamp,
    actor, and authorising comms event id.
- The final schema must have one canonical meaning for the validating commit
  claim. Legacy `agent_id` / `claim_id` semantics must not remain ambiguous
  after migration.
- Schema migration follows the active-claims additive-only evolution
  contract. The active-claims `schema_version` bump from `1.3.0` to `1.4.0`
  requires a drained-queue precondition at landing time: existing
  `commit_queue` entries written under the `1.3.0` flat-`agent_id` /
  `claim_id` shape are not auto-promoted to the discriminated `direct` /
  `transferred` shape. The bump landing refuses non-empty queue state and
  routes a brief queue-drain coordination through the active marshal before
  the schema commit lands. The closed-claims schema follows the same
  additive evolution model; the new `completed_commit_queue` top-level
  property increments the closed-claims schema version in the same landing
  bundle as the active-claims bump so the two registries cannot drift.
- The preferred shape is schema fields on the commit intent plus an
  authorising comms-event pointer. A comms-only `intent-handoff` ceremony is
  insufficient as the final mechanism because the guard and read models need a
  typed queue record to validate.
- Guard validates the marshal git claim while preserving requester/source
  identity.
- `list`, `show`, `verify-staged`, `commit`, `complete`, and `abandon`
  display the requester, marshal, source claim, marshal claim, and transfer
  linkage.
- A source-agent file-claim intent without handoff still fails guard for a
  different committing agent.
- Successful completion removes the active queue entry but writes a completed
  intent snapshot to a durable queue archive, proposed as
  `completed_commit_queue` in `closed-claims.archive.json`. That archive is the
  machine-readable home for requester/source/marshal provenance after active
  queue cleanup.

Acceptance:

- Source-agent intent can be transferred or assigned to a marshal
  `git:index/head` claim, and guard passes for the marshal.
- Guard still rejects untransferred source-agent file-claim intents.
- Completion clears the active queue entry without deleting the requester
  provenance, proven by the durable completed-intent archive.
- `list`, `show`, active-agent summaries, and TUI queue panes render direct and
  transferred intents without losing requester or marshal identity.
- Expiry and abandon semantics remain clear for both source and transferred
  intents.

Validation:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm agent-tools:collaboration-state -- check \
  --active .agent/state/collaboration/active-claims.json \
  --closed .agent/state/collaboration/closed-claims.archive.json \
  --comms-dir .agent/state/collaboration/comms
```

### Tranche A — Line-Scoped Intent Staging

Goal: allow shared files to land only the hunks named by the source intent.

Expected change shape:

- Tranche A starts with a discovery/design gate that proves the chosen Git
  primitive can apply named hunks non-interactively without accidentally
  committing all staged hunks for a named path.
- Intent file entries become a typed union rather than `string[]`:
  - `whole-file` for ordinary pathspec staging;
  - `generated-file` for generated artefacts where the complete regenerated
    file is the intended payload;
  - `append-only-state` for comms/state files where append-only identity or
    event ids, not arbitrary line ranges, define ownership. `verify-staged`
    semantics for this kind are settled at the Tranche A discovery gate from
    two candidate shapes: (a) intent records the list of identity / event ids
    the staged patch must add and verifies that no other identity additions
    appear; (b) intent records the previous tail blob oid and verifies the
    staged patch only appends past that oid. The plan does not pre-commit to
    either shape until the discovery-gate proof;
  - `line-scoped` for authored shared files where only named hunks may land.
- `line-scoped` entries record file path, base blob oid, human line ranges for
  review, canonical expected staged patch identity, per-hunk fingerprints, and
  whether unlisted hunks in the same file must remain unstaged.
- Staging applies named hunks only after the discovery gate chooses the exact
  noninteractive mechanism. The likely implementation is precomputed patch
  slices applied with `git apply --cached`; the plan does not assume
  interactive `git add -p` can be automated safely.
- Hook-robustness is a Tranche A constraint, not just a pre-hook invariant.
  The pre-commit hook path can restage whole shared files after the queue's
  index-patch step (direct evidence: `6ebaae58` — Stratospheric's line-scoped
  PDR-073 staging was widened by the hook to sweep Gilded's PDR-072 hunks).
  The implementation must either (a) re-verify the staged set AFTER the hook
  path runs and abort the commit if hooks widened the bundle beyond the
  intent's named hunks, or (b) install a hook contract that prevents
  whole-file restage of paths under line-scoped intent. The discovery gate
  chooses between these shapes.
- `verify-staged` compares staged patches against expected patch identity and
  rejects all unlisted staged hunks for affected paths before commit.

Acceptance:

- `verify-staged` rejects an extra staged file.
- `verify-staged` rejects an extra hunk in a named shared file.
- `verify-staged` accepts exactly the expected hunk in a named shared file.
- Failure output names the file and approximate hunk header for any extra hunk.
- An integration test proves the pre-commit hook path cannot widen a
  line-scoped intent's staged bundle; if the hook attempts to restage
  unlisted hunks, the commit aborts with a hook-widening rejection.
- A shared-file integration test proves two intents on the same file can land
  independently without sweeping each other's hunks.
- Collaboration-state parsers, queue summaries, and TUI panes understand the
  typed file-entry union.

Validation:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm agent-tools:commit-queue -- status
```

## Quality Gates

Each implementation tranche must run focused tests first, then the relevant
workspace checks, then the canonical aggregate gate for its touched surfaces.
See the quality-gates component:
[`quality-gates.md`](../../templates/components/quality-gates.md).

Minimum expected gates:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm markdownlint-check:root
pnpm format-check:root
pnpm check
```

If `pnpm check` is blocked by inherited unrelated work in a live team window,
the tranche owner must report the exact failing surface and rerun the focused
package gates plus any schema/collaboration-state validators for the touched
surfaces.

## Proof Contract

- `CQ-MSG-1` (`integration`): two intents carry distinct commit messages and
  the selected intent's message is used.
- `CQ-HANDOFF-1` (`integration`): transferred source intent validates against
  the marshal git claim while retaining requester provenance.
- `CQ-HANDOFF-2` (`unit`): untransferred source intent still fails guard for a
  different committing agent.
- `CQ-HANDOFF-3` (`integration`): completed transferred intent leaves a
  durable completed-queue archive snapshot with requester, source claim,
  marshal, marshal claim, source intent, and commit SHA.
- `CQ-READMODEL-1` (`integration`): collaboration-state parsers, active-agent
  summaries, and TUI/read models handle direct and transferred queue intents.
- `CQ-HUNK-1` (`integration`): exactly one expected hunk in a shared file can
  be staged and verified.
- `CQ-HUNK-2` (`integration`): extra hunks in a named shared file are rejected.
- `CQ-HUNK-3` (`integration`): typed file entries distinguish whole-file,
  generated-file, append-only-state, and line-scoped verification modes.
- `CQ-DOCS-1` (`non-code`): commit skill and collaboration guidance describe
  the new handoff flow and remove the ad hoc temporary-message workaround.

Completion language for the whole plan is valid only after all proof ids pass
and consolidation routes any durable doctrine updates.

## Risks

| Risk | Mitigation |
| --- | --- |
| Line-scoped staging becomes an under-specified partial index wrapper. | Require base blob oid plus expected patch fingerprints; reject drift. |
| Handoff metadata hides who authored the work. | Preserve requester/source fields in every queue read and completion output. |
| Message storage creates new local-file cleanup problems. | Derive message paths from intent ids and document lifecycle cleanup. |
| Schema migration becomes too large for one tranche. | Tranche C stays non-schema-bearing; Tranche B owns the schema bump and all read-model consumers together. |
| Agents treat line-scoped staging as permission to share files casually. | Commit skill must preserve narrow ownership and reviewer discipline. |

## Foundation Alignment

- `principles.md`: strict and complete modelling; no invented optionality;
  decompose at the tension between requester identity and marshal authority.
- `testing-strategy.md`: each implementation tranche lands test and product
  code together as a TDD pair.
- `schema-first-execution.md`: schema-bearing state changes must update the
  schema and parser/test surfaces together.
- **PDR-077 (Marshal-as-Cycle Discipline)** — canonical statement of the
  marshal role separation this plan installs at the commit-queue layer.
  Marshal commit authority is a distinct role from requester/source
  authorship; PDR-077 names the cycle protocol that keeps the two
  separable.
- **PDR-076a / PDR-076b (Identity Tuple)** — requester identity and
  marshal identity both reuse the PDR-076 (name, UUID, session_id_prefix)
  tuple. Claim-area schema amendments referencing the queue must align
  on this identity shape.

## Non-Goals

- No implementation in this plan-authoring cycle.
- No hidden fallback where marshal commits silently harvest dirty work.
- No compatibility bridge that keeps the old handoff ambiguity as a supported
  path.
- No new permanent role taxonomy beyond requester/source and commit marshal
  fields required by the queue domain.

## Plan-Body First-Principles Check

This plan is valid because the live failure is not "agents forgot process".
The process points to a missing substrate concept: requester/source ownership
and marshal commit authority are different roles in one commit intent. The
landing path is a repo-local agent-tools plan because the behaviour belongs to
the commit-queue CLI and collaboration-state schemas, not to portable Practice
Core.

## Lifecycle Triggers

See
[`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).

- Session entry: start-right-team grounding and live comms monitoring were
  already active when owner routed the plan.
- Work-shape declaration: this file is the executable plan artefact for the
  route.
- Pre-edit coordination: Stratospheric peer input was requested before plan
  drafting.
- Implementation start: each tranche must open fresh active claims and queue
  commit intents before staging.
- Handoff closure: session closeout must report which tranche, proof ids, and
  queue state remain.
- Consolidation: after tranche completion, run the consolidation workflow and
  route durable doctrine to the commit skill, collaboration directive, schemas,
  or pending graduations as appropriate.

## Readiness Reviewers

Before this plan is marked decision-complete:

- `architecture-expert-fred` reviews sequencing and boundary discipline.
- `assumptions-expert` reviews the root-cause claim and tranche order.
- `type-expert` reviews schema/type compatibility and migration implications.

### 2026-05-23 Reviewer Disposition

- Stratospheric peer input changed the tranche order from the first suggested
  `C -> A -> B` to `C -> B -> A`.
- `architecture-expert-fred` must-fixes were absorbed by adding
  `collaboration-state` queue consumers and tests to scope, and by choosing a
  completed-intent archive as the durable provenance home after active queue
  cleanup.
- `assumptions-expert` should-fixes were absorbed by tightening the
  decision-complete gate, adding a Tranche A discovery/design gate, and making
  Tranche C message storage/lifecycle explicit.
- `type-expert` must-fixes were absorbed by making Tranche C
  non-schema-bearing, defining Tranche B as the schema-bump tranche with direct
  versus transferred intent shape, choosing the completed queue archive as the
  provenance sink, and defining a typed file-entry union for Tranche A.
- Incandescent Banking Flame peer-sidebar input was absorbed by naming
  `enqueue` as the allocator for the intent-scoped message path, avoiding
  assumptions about automating interactive `git add -p`, and preferring typed
  intent fields plus an authorising comms pointer for marshal handoff.
- Incandescent Banking Flame second-pass fold (Velvet-authorised selective
  fold per directed event `12c70ecd`, 2026-05-23) absorbed plan-body-shape
  findings #2 (Tranche B schema migration story: drained-queue precondition
  with closed-claims version coupling) and #4 (Tranche A `append-only-state`
  verification semantics scoped to discovery-gate disposition between
  identity-list and tail-blob-oid candidate shapes), plus the
  Stratospheric-reported hook-widening incident `6ebaae58` as a fourth
  in-session friction-evidence instance and an explicit Tranche A
  hook-robustness constraint with matching acceptance criterion. The other
  three priority and five secondary findings from event `814deefc` remain
  available as supplementary review material rather than plan-body changes.

## Owner Review Gate

This plan stays in `PLANNING` until owner review approves:

- the `C -> B -> A` tranche order;
- the acceptance criteria for each tranche;
- the decision to make marshal handoff a first-class queue concept rather than
  documenting manual source-intent to marshal-intent translation as the final
  practice.
