---
surface_kind: pending-graduations-archive
created_on: 2026-05-24
created_by: Sylvan Sprouting Petal / codex / GPT-5 / 019e59
source_register: ../pending-graduations/
archive_status: active
---

# Pending Graduations Archive — 2026-05-24 Sylvan Sprouting Petal

This archive preserves original pending-graduations bodies processed by Sylvan
Sprouting Petal while the shared 2026-05-24 archive file was actively claimed by
Shaded Silencing Dusk. Entries here are processed bodies, not hidden unresolved
content; each disposition names the durable live home or live route.

## Processed Active-Shard Bodies Archived 2026-05-24

### Authorial-bundle integrity 3rd known instance — per-intent line-scoped staging cure for commit-queue CLI

`[CANDIDATE: authorial-bundle-integrity-line-scoped-staging | captured: 2026-05-23 | source: napkin+pattern-emergence+comms-log | target: multi:doc-amend:.agent/skills/commit/SKILL-CANONICAL.md+plan:agent-tooling-commit-queue-cli-per-intent-line-scoped-staging | trigger: n>=3-validation | size: L | status: pending]`

Three known instances of the failure mode `git add <file>` sweeps another
agent's unstaged edits in the same file when multiple agents touch the same
working-tree path concurrently:

1. Velvet's `e1b9561e` (2026-05-22 21:38Z) — Velvet's 4-file consolidation
   content landed under Lunar's WS4.1 commit message; `.git/COMMIT_EDITMSG`
   single-writer shared state was the proximate cause. Pathspec discipline
   protected Velvet's file scope but Lunar's message text leaked through.
2. Sparking's `968e3cb7` (2026-05-23 ~22:21Z) — Sparking's t13 plan amendment
   commit swept SVW's unstaged t10 plan-file edits along with Sparking's own
   edits. `git add <plan-file>` operates at file granularity; line-level scope
   is not protected by pathspec.
3. Implied 3rd in commit-queue-intent-scope-discipline plan's §Context —
   Mistbound's ff2 `e48d7f16` + Wooded's `2389ff5e` absorbing Shaded's bin
   Cycle 10 edits (worked instance pre-our-session; cited in
   [`agent-tooling/current/commit-queue-intent-scope-discipline.plan.md`](../../../plans/agent-tooling/current/commit-queue-intent-scope-discipline.plan.md)).

**Cure shape**: per-intent **line-scoped** staging in the commit-queue CLI —
e.g. patch-mode `git add -p` with a recorded patch fingerprint per intent. NOT
just file-scoped pathspec discipline (which only protects file membership, not
line-level scope within shared files).

Existing tactical cure (Cure-1 below) handles the message-text race but not the
content-sweep race. Both cures are needed.

Strong empirical evidence (n=3 with cross-agent worked instances) + clear
destination (`commit-queue` workflow primitive amendment plus
`.agent/skills/commit/SKILL-CANONICAL.md` §"Intent-Scoped End-to-End"
extension). Ready for `consolidate-docs` to graduate as a `plan:` work item.

**Owner decision 2026-05-23**: all agent commits must go through the appropriate
agent tools. Git commit collisions and queueing are the primary current friction
in team collaboration, so this is high-impact agent-tooling work rather than
optional process polish.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`97f6fdaa-cbfc-4991-9339-ca93ba008cf3` after verifying the durable live work
surface:
`.agent/plans/agentic-engineering-enhancements/current/commit-queue-multi-writer-cure.plan.md`.
That plan carries line-scoped staging as Tranche A with evidence, scope,
acceptance, and sequencing. No implementation or skill amendment was performed
in this curation slice.

### Cure-1 emergent default across 4 agents — commit-queue CLI per-intent message file natively

`[CANDIDATE: commit-queue-per-intent-message-file-native | captured: 2026-05-23 | source: napkin+pattern-emergence+comms-log | target: multi:doc-amend:.agent/skills/commit/SKILL-CANONICAL.md+plan:agent-tooling-commit-queue-cli-per-intent-message-file | trigger: n>=3-validation+owner-implicit | size: M | status: pending]`

The team converged on intent-scoped message file paths
(`/tmp/<agent>-<cycle>-commit-msg.txt`) passed to `commit-queue commit
--message-file <path>` as a workaround for the `.git/COMMIT_EDITMSG`
concurrent-write hazard exposed by the Velvet `e1b9561e` incident. Adopted by
**Foamy, SVW, Sparking, Stormbound** without coordination — emergent default
across 4 agents.

Currently the commit-queue CLI's `--message-file` flag accepts an arbitrary
path. The Cure-1 discipline lives in the agent's head.

**Cure shape**: commit-queue CLI should accept `--message-file` with a per-intent
**default** path natively (auto-derive `.git/.commit-queue/<intent-id>.msg` if
`--message-file` unspecified). This removes the manual file-naming discipline
that currently lives in agent practice. Strict superset of the current behaviour
— explicit `--message-file <path>` still works.

Pairs with the line-scoped staging cure above. Both are amendments to the same
`commit-queue` CLI surface; can land as one work-item or two.

**Owner decision 2026-05-23**: this should be treated as part of the same
high-impact agent-tooling cure as line-scoped staging and queueing. The correct
durable home is commit-queue tooling, not agent convention.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`97f6fdaa-cbfc-4991-9339-ca93ba008cf3` after verifying the durable live work
surface:
`.agent/plans/agentic-engineering-enhancements/current/commit-queue-multi-writer-cure.plan.md`.
That plan carries native intent-scoped commit message storage as Tranche C with
evidence, expected change shape, acceptance, and sequencing. No implementation
or skill amendment was performed in this curation slice.
