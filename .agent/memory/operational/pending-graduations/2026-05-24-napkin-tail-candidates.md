---
surface_kind: pending-graduations-recovery-file
created_on: 2026-05-24
source_register: ../pending-graduations.md
source_window: 2026-05-24 active napkin tail
status: active
archive_status: not-archived
recovery_status: active
processing_status: owner-gated-only
processing_claim_id: a6098196-5f85-4d60-8c93-0168c251fcf8
latest_disposition_ledger: ../curator-passes/2026-05-27-airy-napkin-tail-owner-gates.md
---

# 2026-05-24 Napkin Tail Candidates

This legacy recovery file carries fresh second-instance-gated candidates processed from
the 2026-05-24 active napkin tail. This is live buffer debt, not an archive.
The entries below were verified and routed on 2026-05-24; they remain live
because their promotion triggers have not fired. As of 2026-05-27, the
remaining entries are explicitly owner-gated: they are not complete, but each
now names the user decision needed before the item can either stay live,
graduate, or be withdrawn.

## Entries

### Owner-authorised redundant config marker preserves architectural truth

`[captured: 2026-05-24 | source: active-napkin Charcoal owner-authz Sonar capture | target: pattern:owner-authorised-redundant-config-marker | trigger: second owner-authorised redundant-config marker | size: M | status: owner-gated]`

Charcoal captured a Sonar `sonar.cpd.exclusions` case where owner direction
authorised adding a narrow generated-code path even though a broader existing
glob already covered it. The action was still useful because the narrow entry
made the owner-ratified boundary visible in mechanical config, while the policy
and inline comment preserved the architectural truth that the analyser scope
was already covered.

Natural home: repo-local pattern if a second owner-authorised redundant config
marker appears. The exact 2026-05-24 Sonar instance already lives in
`docs/governance/sonar-disposition-policy.md` Block 2; this recovery-file
entry tracks the broader repeatable shape only.

Falsifiability: a second owner-authorised config change intentionally keeps a
functionally redundant marker for audit-trail visibility, and the landing
records both facts: owner-ratified boundary and actual mechanical redundancy.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. The exact Sonar instance has its
durable home in `docs/governance/sonar-disposition-policy.md` Block 2, including
the explicit statement that the narrower glob is mechanically redundant and
owner-ratified as an audit-trail marker. This recovery file keeps only the repeatable
pattern watch. Do not promote until a second owner-authorised redundant config
marker appears.

Owner gate: decide whether this one-instance repeatable-shape watch should
remain as a live owner-gated watch despite the persistent buffer-drain goal, or
be withdrawn because the exact Sonar instance is already homed in
`docs/governance/sonar-disposition-policy.md`.

### Heterogeneous working-tree owner direction splits by attribution

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture E | target: pattern:heterogeneous-working-tree-split-by-attribution | trigger: second commit-all split-by-attribution instance | size: M | status: owner-gated]`

Mistbound captured an owner direction to "commit all files" against a
heterogeneous dirty tree: an in-flight Twilit CLI bootstrap refactor, an
unattributed source-class `mcp-handler.ts` fix, and a large substrate /
shared-state bundle. The chosen cure was not a literal bulk commit; it was a
three-commit split by attribution and atomicity so owner intent (durable
progress) and Practice constraints (reviewer convergence, atomic landing, and
source/substrate separation) all remained true.

Natural home: repo-local coordination pattern if a second owner "commit all"
window encounters mixed peer/source/substrate ownership and is resolved by an
attribution-preserving split.

Falsifiability: a second worked instance names the mixed file classes, the
owner-intent vs literal-form tension, the split chosen, and the evidence that
atomic peer work and unattributed source work were not hidden in a hygiene
commit.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Current repo search found no existing
repo-local pattern carrying this exact split-by-attribution shape outside the
active napkin, main-register pointer, and this file. Keep pending until a
second mixed owner-"commit all" window is resolved by attribution-preserving
split. Do not generalise one emergency split into doctrine.

Owner gate: decide whether this one-instance mixed-tree / attribution-preserving
commit watch should remain live until a second worked instance appears, or be
withdrawn as insufficiently proven for the current buffer-drain goal.

### Substrate-write commit window under high team cadence

`[captured: 2026-05-24 | source: active-napkin Mistbound Capture F | target: pattern:substrate-write-window-coordination | trigger: second multi-writer shared-state staging race | size: M | status: owner-gated]`

Mistbound captured a staging-window race while landing substrate hygiene:
shared-state writers modified `.agent/memory/` and
`.agent/state/collaboration/` during the staging window, producing staged-count
drift and an `MM` active-claims state. The immediate repair was to rebuild the
pathspec list and audit the staged set. The durable question is the
coordination shape for short substrate-write windows under high team cadence.

Natural home: repo-local coordination pattern after a second shared-state
staging race. The candidate must preserve the existing rule that shared-state
files remain writable and commit-includable; the question is whether a brief
"substrate-write window open" broadcast or an explicit residue policy is the
cleaner coordination move.

Falsifiability: a second substrate hygiene commit observes concurrent
shared-state mutations during staging, records the coordination decision, and
shows whether a short broadcast window or residue policy reduced re-stage churn
without blocking knowledge capture.

Processing disposition: verified 2026-05-24 under Shaded claim
`a6098196-5f85-4d60-8c93-0168c251fcf8`. Existing claim and commit-window rules
cover `git:index/head`, commit-queue ordering, and active file ownership; they
do not yet settle the narrower shared-state substrate-write window question.
Keep pending until a second shared-state staging race shows whether the durable
cure is a short broadcast window, an explicit residue policy, or no new pattern.
Any future cure must preserve the rule that shared-state knowledge writes remain
writable and commit-includable.

Owner gate: decide whether this one-instance substrate-write staging-race watch
should remain live until a second race clarifies the durable cure, or be
withdrawn because current commit-window and claim rules already cover the known
portion.

### Goal-backed handoff state must be explicit

`[captured: 2026-05-24 | source: active-napkin Sylvan persistent-goal handoff capture | target: session-handoff-or-platform-pattern:goal-backed-session-close | trigger: second goal-backed stop/wind-down conflict or owner-direction to codify handoff step | size: S | status: owner-gated]`

Sylvan captured a handoff failure mode where the owner repeatedly asked to wind
down or stop, but a persistent goal wrapper kept reactivating the Knowledge
Curator objective. The reusable shape is not "always mark blocked"; the
reusable shape is that handoff must make the goal state explicit when an
unfinished long-running objective remains active after owner stop/wind-down
language.

Natural home: `session-handoff` amendment if this is repo-workflow doctrine, or
a platform/goal-runner pattern if the behaviour belongs to the wrapper that
resumes active goals. The repo-facing handoff move should be precise: complete
only with proof, block only when the blocked-audit threshold is satisfied, or
state that the persistent goal remains active and can resume.

Falsifiability: a second long-running goal-backed session reaches owner
wind-down/stop while unfinished, and the closeout either resolves the goal state
or visibly carries the active-goal continuation risk.

Processing disposition: verified 2026-05-24 under Shaded claim
`d7fe5974-56b1-45d4-92aa-b09d23911313`. Keep pending because the rule boundary
crosses repo workflow and platform goal-runner behaviour. Do not promote until
the trigger clarifies whether the durable cure belongs in `session-handoff`,
platform memory, or the goal wrapper itself.

Owner gate: decide the durable home for goal-backed closeout state: repo
`session-handoff`, platform goal-runner behaviour, or the already-landed
`consolidate-until-done` wrapper. Until that boundary is owner-ratified, this
entry stays live as an explicit user-decision item.
