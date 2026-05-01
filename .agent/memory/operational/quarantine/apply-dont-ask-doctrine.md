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

## 2026-05-01 owner reframe (both candidates)

**apply-don't-ask**: needs reworking into something like *"can this
question be answered empirically?"* The action-bias framing was
wrong; the load-bearing distinction is whether the question has a
determinate empirical answer (in code, data, vendor docs, generator
output, schema, log files) versus genuinely requiring owner
judgement. The pre-question gate is then "have I exhausted the
empirically-answerable surfaces?", not "have principles or a
reviewer named the path?". The two are related but not identical —
the empirical-answerability shape carries no inherent action-bias,
which is why the destructive-operation guard problem disappears
(reading is non-destructive; the rule never produces pressure to
*do* something irreversible).

**stop inventing optionality**: moves in the right direction, but
not necessarily at the right layer, level of abstraction, or
mechanism. The impact needs to be named first; the rule shape
follows from the impact, not the other way around. Three distinct
surfaces of "invented optionality" appear in the existing evidence
trail and may decompose into separate rules with different impacts:

- *Decision optionality* — bouncing forks to the owner that have
  a determinate empirical answer. Impact: wastes owner judgement;
  fragments decision authority. (This is the apply-don't-ask
  surface above; subsumed by the empirical-answerability reframe.)
- *Design optionality* — adding configurable / optional /
  extensible surface to a design that does not need it (e.g.
  `Record<string, unknown>` carve-outs for a schema with a closed
  shape; speculative future-proofing on type signatures). Impact:
  erodes types; bakes in fragility; mints maintenance load.
- *Outcome optionality* — writing acceptance criteria that hedge
  when there is a single right answer, or that depend on
  infrastructure that does not exist (e.g. fantasy LLM-graded
  evals when the eval infrastructure has not been built). Impact:
  produces unfalsifiable plans; sibling of the don't-shoehorn-a-
  value-claim candidate.

Both candidates remain quarantined. The reformulations are owed.
Drafting the new rule shape *before* naming the impact would itself
be an instance of the failure mode this doctrine is trying to
name — so the rethink is the work, and the rewrite waits on it.

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
- `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-query-layer.plan.md`
  — `find_by_tag` carve-out references the doctrine
- `.agent/experience/2026-04-30-iridescent-graph-corpus-composition.md`
  — methodology + reflection on the doctrine's emergence
- `.agent/memory/operational/repo-continuity.md` — references via
  thread continuity
