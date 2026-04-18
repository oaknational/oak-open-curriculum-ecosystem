# PDR-003: Sub-Agent Protection of Foundational Practice Docs

**Status**: Accepted
**Date**: 2026-04-17
**Related**: [PDR-002](PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md)
(substantive doctrine this PDR operationalises).

## Context

The Practice distinguishes between the **primary conversation
agent** (the agent the human is actively working with) and
**sub-agents** (background workers, worktree-isolated agents,
batch unit agents, scoped reviewers dispatched for narrow tasks).

Sub-agents are scoped by design. A sub-agent dispatched to "fix
the verifyDocCounts helper" sees one slice of the codebase, not
the full practice history. This scoping is a feature — it is what
makes sub-agents fast, parallel, and safe to dispatch. But it
also means sub-agents lack the cross-session context, cross-file
awareness, and architectural perspective needed to make sound
changes to the foundational documents that govern the Practice
itself.

Repeated observations across sessions show a characteristic
failure mode when sub-agents are given editorial access to
foundational documents: they optimise for local metrics visible
within their scope. "Cut N lines." "Deduplicate these strings."
"Compress this paragraph." Each optimisation is locally
defensible and globally corrosive. The pedagogical reinforcement
named in PDR-002 is invisible to a sub-agent working in a narrow
window; the sub-agent sees only redundancy. Rules that have
survived many rotations are mechanically removed as duplicates.

Host repos have responded with permission-layer rules that forbid
sub-agents from writing to the Practice Core and foundational
directive files. These rules are correct and necessary but
incomplete: they describe what is forbidden without naming why.
Without the rationale, a future Practice steward can repeal the
permission rule under pressure — "why can't the sub-agent just
clean up the duplication?" — without recognising that the
permission rule is load-bearing on the pedagogy PDR-002 protects.

## Decision

The foundational-document protection rule has three stable
rationale components, recorded here so that host-repo permission
rules can cite this PDR as their justification:

1. **Sub-agents lack the cross-session and cross-file context
   needed to judge what repetition is deliberate.** The
   pedagogical reinforcement pattern named in PDR-002 is
   observable only across the full foundational-document set and
   across many sessions. A sub-agent operating within a single
   file, a single task, and a single session cannot distinguish
   reinforcement from duplication.

2. **Consolidation is curation, not optimisation.** The correct
   operation on a foundational document is "does this still
   serve its role?", not "how many lines can be removed?".
   Curation requires judgement about purpose; optimisation
   requires only metrics. Sub-agents have the inputs for
   optimisation and lack the inputs for curation.

3. **Pedagogical value is invisible to scoped agents.** A rule's
   operational weight accumulates across many sessions of
   application. The weight is legible in the session logs, the
   continuity surfaces, the surprise pipeline. A sub-agent given
   a file in isolation cannot see the weight. From the
   sub-agent's vantage, all statements of comparable syntactic
   shape have comparable pedagogical weight. They do not.

Therefore: **sub-agents MUST NOT create, edit, delete, or
rename files in the foundational Practice document set**. The
primary conversation agent — the one the human is actively
working with — retains full authority over these documents, with
the human's consent in the loop for changes of substance.

The foundational document set for this PDR's purpose includes:
the Practice Core plasmid trinity and its verification companion,
the agent entry point, the principles document, the
testing-strategy document, and any directive document that
operates at the same authoritative layer.

## Rationale

The three-component decision above already contains the
rationale. This section records why the PDR is needed
independently of the host-repo permission rule that already
operationalises the restriction.

A permission rule without recorded rationale is fragile. Under
pressure (fitness violations, deduplication passes, compression
requests), the rule reads as arbitrary. Recording the rationale
in a portable PDR ensures that:

1. Future Practice stewards, in this repo or any repo the
   Practice hydrates into, inherit the reasoning along with the
   rule.
2. A host-repo permission rule can cite the PDR as its
   justification, anchoring the local rule in portable Practice
   doctrine rather than in repo-local convention.
3. The decision survives sub-agent-induced rationale drift —
   the rationale itself lives in a file that sub-agents cannot
   edit (by the rule the PDR justifies).

## Consequences

**Required**:

- Host repos operationalising this doctrine as a rule file (under
  their local rule-layer convention) SHOULD cite this PDR as the
  substantive justification rather than restating the rationale.
- Consolidation commands dispatching sub-agent workers MUST
  exclude foundational documents from the sub-agent's writable
  scope. The consolidation workflow itself is performed by the
  primary conversation agent.

**Forbidden**:

- Sub-agents MUST NOT edit, create, delete, or rename files in
  the foundational Practice document set.
- Host-repo permission rules MUST NOT be weakened in response to
  fitness pressure without first reopening this PDR.

**Accepted cost**:

- Foundational-document edits cannot be parallelised via
  sub-agents. This is the intended trade. The volume of such
  edits is low; the consequence of mechanical error is high.

## Notes

The boundary between **sub-agent** and **primary conversation
agent** is the Practice's cleanest authority line. The primary
agent is visible to the human, part of the conversation loop, and
subject to the consent protocol that attends every substantive
edit. The sub-agent is background, autonomous, and scoped. The
authority asymmetry is intentional and should be preserved in
any evolution of the Practice's delegation model.

### Host-local context (this repo only, not part of the decision)

In the repo where this PDR was authored, the host-repo
permission rule operationalising this doctrine is
`.agent/rules/subagent-practice-core-protection.md`. That rule
currently cites host-repo ADRs for its authority chain. When
this PDR stabilises in practice, the rule's "Why" section
SHOULD be shortened to a reference to PDR-003 rather than
restating the rationale.
