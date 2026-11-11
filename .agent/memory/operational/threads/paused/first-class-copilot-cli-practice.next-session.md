---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Thread: first-class Copilot CLI Practice citizenship

**Purpose:** Make GitHub Copilot CLI running locally an equal first-class
participant in the repository's canonical Practice and agentic tools.

## Current continuation

- Branch: none live — the replacement record landed via PR #529 (merged).
  The pre-supersession draft is preserved on PR #707
  (`docs/copilot-cli-practice-citizenship`, freeze commit `f96149836`),
  which closes at MCP-183's landing (the ruled test-slice harvest)
- Base: current `main` at the start of the replacement record landing
- Owner ratification (2026-07-24): direct in-session `Implement the plan`,
  recorded durably in the
  [PR #529 owner ratification record](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100).
  The original collaboration event
  `444463f6-d93f-41c1-81c5-a39b3205338f` was the source capture. Its policy
  portion was shape-bound to the then-current dual-route design, which is now
  deleted, so it must never be cited as ratifying the replacement
  single-dispatcher shape; the strategic, identity, projections, and lifecycle
  plan ratification remains anchored by the durable PR record.
- Owner re-ratification (2026-07-25, MCP-150): the replacement
  single-activation/single-dispatcher policy architecture carries its own fresh
  owner ratification at an owner card; the
  [`first-class-copilot-cli-policy-enforcement`](../../../../plans/delivery/first-class-copilot-cli-policy-enforcement.plan.md)
  plan records `ratified_by: "Jim Cresswell"`, `ratified_date: 2026-07-25`
- Superseded record: PR #522 was closed with a naming comment; its branch's
  evidence is extracted (the report's Finding 1 dated addendum, 2026-08-02,
  carries the version-pinned environment signals); preservation PR #708
  closes at that addendum's landing — commits stay reachable via the PR ref
- Controlling plan:
  [`agent-platform-citizenship`](../../../../plans/strategic/agent-platform-citizenship.plan.md)
  (formerly `first-class-copilot-cli-practice-citizenship`)
- Delivery plans:
  - [`first-class-copilot-cli-policy-enforcement`](../../../../plans/delivery/first-class-copilot-cli-policy-enforcement.plan.md)
    — MCP-150
  - [`copilot-cli-identity-and-practice-join`](../../../../plans/delivery/copilot-cli-identity-and-practice-join.plan.md)
    — MCP-154
  - [`copilot-cli-practice-projections`](../../../../plans/delivery/copilot-cli-practice-projections.plan.md)
    — MCP-155
  - [`copilot-cli-local-comms-and-lifecycle`](../../../../plans/delivery/copilot-cli-local-comms-and-lifecycle.plan.md)
    — MCP-156
- Current boundary: replacement documentation/ADR/matrix/plan landing only.
  Runtime work remains gated behind its merge.
- Next safe step after that merge: execute MCP-150's Claude-only canonical
  policy baseline under its accepted pre-execution constraints, then deliver
  the Copilot CLI vertical.
- Acceptance seat: a real local Copilot CLI process remains required whenever
  a delivery slice reaches acceptance-ready.

## Next-session grounding order

1. Read this record, then the controlling strategic plan and its four delivery
   plans before selecting work.
2. Run identity preflight; arm and verify the all-channels watcher; inspect
   active claims, comms, commit queue, and current git/worktree state.
3. Re-fetch PR #529 and main. If the PR is still open, treat its current
   review/check/base state as the only live authority and continue its
   shepherding before any runtime delivery.
4. If PR #529 is merged, verify main contains its final head, then route any
   remaining delivery work through the current Director and release board;
   never infer that an unmerged plan authorises runtime work.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Thistle rides Canopy | copilot | gpt-5.6-sol | 494337 | design authority and live evidence author | 2026-07-24 | 2026-07-24 |
| Thistle holds Blossom | codex | GPT-5 | 019f94 | replacement-plan implementer | 2026-07-24 | 2026-07-24 |
| Forge rides Brimstone | claude | claude-fable-5 | 398e24 | Director and owner-word relay | 2026-07-24 | 2026-07-24 |

## Standing decisions

- "Copilot" in this thread means **GitHub Copilot CLI running locally**.
  Coding-agent/cloud execution, remote transport, hosted bridges, and
  product-wide Copilot goals are drift.
- First-class means behavioural citizenship: honest identity, deliberate team
  join, canonical capability through native surfaces, communications, policy,
  lifecycle, and proof.
- `.agent/` remains canonical. GitHub files are thin or generated projections,
  never another Practice.
- `.agents/skills/` remains the chosen Copilot skill home under documented
  precedence; no duplicate `.github/skills/` tree is planned.
- Native Copilot startup supplies repository and identity context and creates
  no shared coordination state. It does **not** waive claim registration: any
  working session, quick-start included, must register a bounded active claim
  before its first edit, under the always-loaded
  `register-active-areas-at-session-open` rule that binds every session
  regardless of which start-right skill ran. `oak-start-right-team` remains the
  deliberate boundary for *continuous* team participation only — heartbeat
  emission, the all-channels watcher, and the handoff/retirement lifecycle.
- The policy lane begins with one Claude-only production baseline. It contains
  no dormant Copilot or Codex production branches.
- The inherited PascalCase `PreToolUse` route is the sole Claude/Copilot
  policy activation. One closed dispatcher requires exactly one recognised
  host schema, one validated policy snapshot, one evaluation, and matched-host
  rendering; zero or multiple matches fail closed.
- Native `.github/hooks` policy activation is excluded because repository
  hooks also run in Copilot cloud-agent jobs. Native hooks remain candidates
  only for separately probed non-policy lifecycle needs with an explicit cloud
  disposition.
- Exact-once policy proof covers successfully dispatched requests. The host
  timeout remains a fail-open ceiling.
- Communications reuse the existing local file-backed substrate. Native wake
  is primary; bounded drain and seen-file gap sweep are recovery.
- MCP tool projection cannot generate from another platform adapter. MCP-155
  first establishes a canonical secret-free server manifest with a total
  disposition over tracked platform candidates.
- Plans and ADRs describe the ratified target. The cross-platform matrix
  records target separately from wired and acceptance-proven state.

## Claude-baseline implementation constraints

1. Freeze the failure contract before code.
2. One policy snapshot means one read and parse.
3. Canonical decisions contain no platform response shapes.
4. Production adapters are Claude-only in the baseline; arbitration tests use
   synthetic adapters.
5. Tests use literal snapshots and injected dependencies, never the live
   `.agent` tree.
6. Every structural consumer of removed runner artefacts changes in the same
   landing.
7. Deliver the baseline as one PR with two atomic green TDD commits:
   snapshot/evaluator, then closed Claude composition and full migration.

## Evidence and handoff

- Ratified evidence report:
  [`first-class-copilot-cli-practice-support-2026-07-24.md`](../../../../reports/agentic-engineering/first-class-copilot-cli-practice-support-2026-07-24.md)
- Architectural authority:
  [ADR-125](../../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- Live target-versus-wired truth:
  [`cross-platform-agent-surface-matrix.md`](../../../executive/cross-platform-agent-surface-matrix.md)
- The repository plan estate is authoritative for target and mechanism.
  MCP-150/MCP-154/MCP-155/MCP-156 are supplementary Linear projections for
  execution state, sensitive details, and evidence that cannot be versioned
  safely; do not copy transient ticket state into this thread.
