---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

## Q-002 — which `.agent/rules/*` rules are actually impactful

- **Captured**: 2026-06-01 (Sunlit Gliding Twilight / `claude` / `2a4252`)
- **Question**: Of the ~70 rules injected into context via `CLAUDE.md`, which
  ones measurably change agent behaviour and earn their context cost, and which
  are inert? Prose rules have no "firing" event to count; hook-backed rules
  (e.g. write-time `no-moving-targets`, secrets-scan on Read, PreToolUse gates)
  do execute and could be instrumented.
- **Why it shapes future work**: directly informs the ~80k reliably-loaded
  context budget (`[[project_80k_reliably_loaded_context_budget]]`) — knowing
  which rules are inert is the evidence needed to move them on-demand or retire
  them, rather than carrying all ~70 always-on.
- **Why not answerable cheaply now**: prose rules are not measurable by design
  (continuously in effect, never discretely triggered); the only well-defined
  signal is hook-fire counts, which requires (a) instrumenting hook scripts to
  log invocations and (b) for behaviour-change attribution, auditing transcripts
  for evidence a rule altered a move. No built-in per-rule analytics exist.
- **Owning artefact / discussion home**: none yet; relates to context-budget
  governance. Does not block any current cycle.
- **Status**: lane-opened 2026-06-11 (owner decision at the dedicated
  consolidation walk) — a lean instrumentation lane is authorised: hook
  invocation fire-count logging only (the one mechanically measurable signal),
  routed to the agent-tools implementation lane queue; transcript-audit
  deferred until fire-count evidence exists. The question stays open pending
  that evidence; the 2b reappraisal-cartography pass remains the prose-rule
  rationalisation vehicle.

## Q-004 — does the capability taxonomy need a rights/licensing axis?

- **Captured**: 2026-06-03 (Blustery Lifting Gale / claude / Opus 4.8 / `9b33b0`).
- **Question**: ADR-189 ratifies two axes (audience, distribution locus) with
  packaging as mechanism. The first-party skills library's licensing split —
  MIT scaffolding, © Oak brand assets, curriculum content shared in a
  pedagogical spirit — maps onto neither axis. When Oak distributes
  capabilities externally, what may be copied, what must be attributed, and
  what stays Oak's are questions the current taxonomy cannot record. Is
  rights/licensing a third axis, a per-capability metadata field, or out of
  taxonomy scope (owned by LICENSE surfaces)?
- **Why not now**: one observation only; the repo's own discipline says one
  instance is an observation, not a category. Becomes decidable when a
  capability pack or skills-index publication forces a licensing declaration
  per artefact.
- **Owning artefact when it fires**: ADR-189 amendment +
  [`skills-classification-taxonomy.plan.md`][q4-taxonomy] inventory columns.
- **Status**: open — trigger is the first external capability publication or
  the oak-skills integration decision.

[q4-taxonomy]: ../../plans/discovery/future/skills-classification-taxonomy.plan.md

## Q-005 — can the repo professionalism assessment be cut into practical plans?

- **Captured**: 2026-06-03 (Airy Whirling Wing / codex / GPT-5 / `019e8e`).
- **Question**: The
  [`Oak Repository Professionalism and Engineering Quality Report — 2026-06-03`][q5-report]
  gives a blunt assessment and a friction-reduction roadmap. Can that roadmap
  become practical plan work, and if yes should it be one cross-cutting plan or
  separate plans under architecture/quality gates, developer experience,
  agentic-engineering, and agent-tooling?
- **Why it shapes future work**: the report names high-leverage improvements
  (repo-check failure classification, Playwright preflight, contributor fast
  path, generated authority map, collaboration CLI UX, active-surface reduction)
  but those recommendations should not become another passive doctrine layer.
  A planability pass decides whether the next move is executable work, routing
  into existing plans, or no new plan.
- **Why not answerable cheaply now**: requires cross-checking existing current
  and future plans across at least four collections to avoid duplicate plans or
  wrong ownership. The report was authored and indexed in this session; the
  owner explicitly asked that it receive assessment for practical planning.
- **Owning artefact / discussion home**: the
  [assessment thread record](threads/repo-professionalism-assessment.next-session.md).
- **Status**: open — trigger is the next owner-directed planning/triage
  session, or a dedicated follow-up asking whether to turn the assessment into
  plan work.

[q5-report]: ../../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md

## Q-006 — should the in-process mock runtime-config mirror the production EEF default?

- **Captured**: 2026-06-08 (Briny Charting Lagoon / claude / Opus 4.8 / `4dae1b`).
- **Question**: EEF is now default-ON in production resolution (kill-switch posture). The e2e
  fixture (`e2e-tests/helpers/test-config.ts`) was flipped to `eefEnabled: true` to mirror that,
  but the in-process `createMockRuntimeConfig` (`src/test-helpers/auth-error-test-helpers.ts`)
  still defaults `eefEnabled: false`. Should the in-process mock default also mirror production
  (true), or stay false as an explicit minimal fixture?
- **Why it shapes future work**: a mock default that diverges from production can let a real
  default-on regression pass in-process tests; aligning it is more faithful but has a blast
  radius across integration tests that build the server via the mock without setting the flag.
- **Why not answerable cheaply now**: requires assessing every in-process test that uses the mock
  default and asserts tool/resource counts, to size the change safely.
- **Owning artefact / discussion home**: the [`eef` thread record](threads/eef.next-session.md);
  decide alongside D7 work.
- **Status**: open — trigger is the next EEF/test-harness session touching these fixtures.

## Q-007 — should the e2e list-parity test derive its expected tool set from the SDK enumeration?

- **Captured**: 2026-06-08 (Briny Charting Lagoon / claude / Opus 4.8 / `4dae1b`).
- **Question**: `server.e2e.test.ts`'s `list_tools parity` asserts against a hardcoded
  `aggregatedTools` array (I added `get-eef-evidence` to it). Should it instead derive the
  expected set from `listUniversalTools(...)` so it proves "no projection drift" config-agnostically
  and stops needing a manual edit per new tool?
- **Why it shapes future work**: the hardcoded list re-breaks on every tool add/rename and
  couples the parity test to the live flag configuration; deriving it would make the test prove
  the mechanism (app registers exactly what the SDK enumerates) rather than a frozen inventory.
- **Why not answerable cheaply now**: needs care around flag-gated tools (the app skips gated
  entries when off; the derivation must account for the e2e fixture's flag state) and a check that
  the derived assertion still catches real projection drift.
- **Owning artefact / discussion home**: the
  [`unified-mcp-server-test-harness.plan.md`](../../plans/sdk-and-mcp-enhancements/current/unified-mcp-server-test-harness.plan.md)
  (WS0 smoke/parity) or the `eef` thread record.
- **Status**: open — trigger is the next test-harness (WS0/WS3) session.

## Q-009 — do memory/state files need schema-driven or agent-driven merge strategies?

- **Captured**: 2026-06-11 (Iridescent Threading Constellation / claude / Fable 5 / `f9454b`),
  owner-raised during the first coordination-home → main reconciliation.
- **Question**: git merges lines; our `.agent/memory` and `.agent/state` files carry semantic
  invariants git cannot see (a JSON set keyed by `claim_id`; a markdown file with exactly one
  Current State block; an append-only narrative buffer; an additive identity table). A
  textually-clean git merge can be semantically wrong. Should we implement custom merge
  strategies, and of what kind?
- **The spectrum (analysis, not decision)**: three tiers, prefer the lowest that works.
  (1) **Conflict-free by construction** — the comms event store already is this (immutable,
  content-addressed, one-file-per-event, append-only, single-writer); 1,863 events reconciled
  with zero risk on 2026-06-11 *because* of this model. Push more state toward it.
  (2) **Schema-driven merge drivers** — the structured registries (`active-claims.json`,
  `closed-claims.archive.json`, `comms-seen`) have algebraic merges (set-union keyed by id,
  last-writer-wins per key, append-dedup, line-set-union). Git's native `.gitattributes
  merge=<driver>` mechanism + one schema-aware tool per shape; makes ADR-197's
  branch-authoritative-for-state policy semantically safe rather than textually hopeful.
  (3) **Agent-driven merge** — narrative state (`repo-continuity.md` Current State, `napkin.md`,
  `distilled.md`, thread records) needs *meaning* (same-surprise-twice? supersede-vs-coexist?);
  no algebra suffices. A merge driver invoking a reasoning agent with the file's semantic
  contract is justified ONLY here, as a last resort, and MUST emit a reviewable diff, never a
  silent merge (an un-inspectable agent merge is the false-green failure at a new altitude).
- **Why it shapes future work**: every coordination-home → main reconciliation (and any
  multi-writer state convergence) relies on this; the 2026-06-11 reconciliation was clean only
  because of tier-1 + zero per-file overlap, not because git merged state safely.
- **Why not answerable cheaply now**: needs a per-file-class merge-semantics audit, a decision
  on git-merge-driver vs out-of-band tooling, and (for tier 3) the auditability/cost design.
- **Owning artefact / discussion home**: the mechanism follow-on to
  [ADR-197](../../../docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md)
  (which set the policy but assumed git's textual merge); the
  [team-opener generalisation exploration plan](../../plans/agent-tooling/current/team-opener-generalisation-exploration.plan.md).
- **Status**: OPEN — captured for the next dedicated agentic-engineering session; a strong ADR
  candidate (state-file merge-semantics architecture).

## Q-010 — repair or retire the curriculum-sdk committed typedoc markdown estate?

- **Captured**: 2026-06-12 (Tempest spins Stratosphere / claude-code / Fable 5 / `123098`),
  during the upstream-spec description-rewrite alignment.
- **Question**: `packages/sdks/oak-curriculum-sdk/docs/api-md/` is a committed,
  generated typedoc-markdown tree with no live generator flow: its `docs:api` script is wired
  into no root script and no turbo task; `typedoc.json` still lists a
  `docs/_typedoc_src/...` entrypoint deleted in the 2026-02-16 cleanup (every run warns and
  exits 2); and a bare regeneration today produces a structurally different, far smaller tree
  (135 files changed, −16k lines, `PATH_OPERATIONS.md`/`schema.md` deleted). Independently,
  config review found the turbo `doc-gen` task declares `**/docs/api-md/**` as an output that
  its script never writes. The committed tree now also embeds pre-rewrite upstream
  descriptions, so it is stale documentation on a doc surface.
- **The fork**: (a) repair the pipeline — fix the typedoc entrypoints, decide the intended
  output shape, wire `docs:api` into `doc-gen`, regenerate, and commit the fresh tree; or
  (b) retire the committed `api-md` tree (typedoc output is derivable on demand; committed
  copies drift by construction) and remove the dangling `doc-gen` output glob. Option (b) is
  the smaller, drift-proof shape unless a named consumer reads the committed markdown.
- **Why not resolved in the alignment PR**: the alignment is description-refresh +
  correction retirement; rebuilding or retiring a docs pipeline is a separable product
  decision with its own blast radius (a mis-fired bare regeneration during the alignment was
  restored forward from HEAD).
- **Owning artefact / discussion home**: `packages/sdks/oak-curriculum-sdk` README/typedoc
  config; turbo `doc-gen` task config.
- **Status**: OPEN — owner decision (repair vs retire); evidence in the 2026-06-12 napkin
  entry and the alignment PR discussion.

## Q-011 — Cursor agent shell truncates long git commit hook output

- **Captured**: 2026-06-15 (Sirius binds Spectrum / cursor / session handoff).
- **Question**: Why does the Cursor-integrated agent shell return exit code 1 and truncate
  `git commit` output after ~12s (stopping after `depcruise`, before the turbo build gate),
  while the same pre-commit hook completes successfully when run directly (`bash .husky/pre-commit`)
  or when `git commit` runs in the background — and how should agents verify commit outcome
  until the platform is fixed?
- **Why it shapes future work**: false-negative commit failures waste agent and owner time;
  agents may retry, amend, or report broken hooks when the commit actually landed. Owner
  direction: note as a platform issue and work towards a fix in future — not a repo hook defect.
- **Why not answerable cheaply now**: requires Cursor platform investigation (terminal buffer,
  subprocess lifecycle, hook timeout). Workaround is operational: verify with `git log -1` /
  `git status`, or commit in the user's external terminal.
- **Owning artefact / discussion home**: none in-repo yet; platform/Cursor. Does not block
  current cycles.
- **Status**: OPEN — workaround documented in napkin 2026-06-15; platform fix deferred.
