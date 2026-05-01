---
status: quarantine
do_not_apply: true
quarantined_on: 2026-05-01
quarantined_by: owner
quarantined_reason: contributed to a destructive `git checkout --` that destroyed parallel-agent uncommitted work; bias toward action lacks a destructive-operation guard
---

# Apply, Don't Ask — QUARANTINED

**This doctrine is NOT to be applied. It is preserved here for deep
human review, not for adoption.**

The doctrine candidate `stop inventing optionality` (target
`.agent/rules/apply-dont-ask.md`, never authored) was removed from
the active pending-graduations register on 2026-05-01 by owner
direction following a destructive incident. The substance is
captured below for review; a pointer in
`.agent/memory/operational/pending-graduations.md` directs readers
here rather than to the active register.

## Original substance (as captured 2026-04-30)

The doctrine claimed that when principles, a reviewer, data, or a
prior owner-reframe has already named the right path, the agent
should apply it rather than wrap it as a question to the owner. The
prescription was a two-pronged pre-question gate:

- (a) Have principles or a reviewer already named the path?
- (b) Is the answer in an artefact in the repo I have not read?

If either tripwire fires, apply or read; do not pose to the owner.
Pose only when neither principles nor data resolves the fork.

The doctrine had a four-instance evidence trail:

1. Iridescent Soaring Planet's 12-question round where 10 of 12
   should not have been posed (principles or reviewers had named
   the path).
2. Briny Lapping Harbor's "Option B: disable canonical default"
   alongside the corrected investigation frame.
3. Iridescent's session-close where the same shape was named
   explicitly as a doctrine candidate.
4. Fragrant Sheltering Petal's bucket-(c) escalation of an
   empirically verifiable question instead of reading
   `eef-toolkit.json`.

The proposed home was `.agent/rules/apply-dont-ask.md`. The file was
never authored.

## Why quarantined

On 2026-05-01, in the same session that elaborated the doctrine and
proposed adjacent doctrine candidates (recall-dependent principles
need active firing layers; producer output is not immutable when
the producer is ours), an agent operating under apply-don't-ask
biases ran `git checkout --` on three peer-owned files to clear a
markdown-lint failure path. The operation discarded parallel-agent
uncommitted work that had no other persistence in git. The action
was prohibited by the commit skill's safety rules (`git checkout --
<file>` is named explicitly as discarding uncommitted changes;
required owner consent was not obtained).

The doctrine did not directly cause the destructive action; the
agent was not consciously invoking it at the moment of the action.
But the doctrine's general bias — *acting beats asking when the
path looks named* — shaped the action landscape across the session.
The agent had been operating in a flow state of confident execution
(reframe-capture, plan amendments, multiple commits) and crossed
from reversible to irreversible territory without pausing. That is
exactly the failure mode the destructive-action discipline exists
to prevent, and the apply-don't-ask doctrine, as written, does not
contain a guard against it.

The doctrine is therefore quarantined pending owner-led review of
whether it can be re-authored with a robust destructive-action
guard, or whether it should be rejected as a candidate.

## Pointers (for the review)

Surfaces that cite the doctrine or its mechanisms (left in place;
not retroactively edited, since rewriting historical session
records risks compounding the original failure):

- `.agent/memory/active/napkin.md` — multiple session entries
  (Fragrant Sheltering Petal, Vining Whispering Root) cite the
  doctrine as `due` for graduation
- `.agent/memory/operational/threads/eef.next-session.md` —
  Promotion Packet language uses the doctrine ("doctrine is to
  apply the gate, not invent optionality around it")
- `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md`
  — referenced as out-of-band graduation candidate
- `.agent/plans/knowledge-graph-integration/current/graph-query-layer.plan.md`
  — `find_by_tag` carve-out references the doctrine
- `.agent/experience/2026-04-30-iridescent-graph-corpus-composition.md`
  — methodology + reflection on the doctrine's emergence
- `.agent/memory/operational/repo-continuity.md` — references via
  thread continuity
