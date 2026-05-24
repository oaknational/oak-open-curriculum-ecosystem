---
pdr_kind: governance
---

# PDR-057: Empirical-Answerability Pre-Question Gate

**Status**: Accepted
**Date**: 2026-05-10
**Related**:
[PDR-026](PDR-026-per-session-landing-commitment.md) (deferral
honesty — the empirical-answerability gate is the inbound mirror of
deferral honesty: it disciplines what the agent escalates, where
PDR-026 disciplines what the agent defers);
[PDR-046](PDR-046-layered-knowledge-processing.md) §Move 3
(processing layer 3 — read repo state before posing forks);
[PDR-058](PDR-058-three-tier-optionality-decomposition.md)
(three-tier optionality decomposition — decision optionality is the
surface this PDR governs, alongside two sibling surfaces).

**Supersedes**: the quarantined `apply-don't-ask` doctrine candidate
([`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md))
under the 2026-05-01 owner-named reformulation.

## Context

Across multiple sessions in early 2026 the agent fleet exhibited a
recurring failure mode: posing forks to the owner whose answers were
already determinately reachable by reading the repo, the schema, the
generator output, or vendor documentation. Examples on the evidence
trail:

- Iridescent Soaring Planet's twelve-question round where ten of
  twelve forks were resolvable from principles already authored or
  reviewer reports already produced.
- Briny Lapping Harbor's *"Option B: disable canonical default"*
  posed alongside the corrected investigation frame the principles
  layer named.
- Fragrant Sheltering Petal's bucket-(c) escalation of a question
  whose answer sat in `eef-toolkit.json`, unread.

A doctrine candidate `apply-don't-ask` was authored to address this:
*when principles, a reviewer, or prior owner-reframe has already
named the path, apply rather than ask*. The candidate was quarantined
on 2026-05-01 after a destructive-action incident in which an agent
operating under apply-don't-ask biases ran `git checkout --` on three
peer-owned files, discarding parallel-agent uncommitted work. The
doctrine's general bias — *acting beats asking when the path looks
named* — shaped the action landscape; the rule, as written,
contained no destructive-operation guard.

The owner reframed at the same close: the load-bearing distinction
is not action-vs-asking. It is *empirical answerability* — whether
the question has a determinate answer in code, data, vendor docs,
generator output, schema, or log files, versus genuinely requiring
owner judgement.

## Decision

**Before posing a fork to the owner, the agent MUST first determine
whether the question is empirically answerable. If it is, the agent
reads the empirically-answerable surfaces and resolves the question
itself. The fork reaches the owner only after the empirical surfaces
are exhausted, or when the question genuinely requires owner
judgement that no surface can supply.**

The discipline has three load-bearing parts:

1. **The empirically-answerable surfaces**. A non-exhaustive but
   canonical list:
   - Source code in this repo (including tests, fixtures, generator
     code, schema files).
   - Generated outputs (`pnpm sdk-codegen`, `pnpm doc-gen`, etc.)
     and the configuration that drives them.
   - Vendor documentation (Clerk, Sentry, Vercel, Elasticsearch,
     MCP, Anthropic SDK), authoritative for the vendor's behaviour.
   - Repository data files (JSON, YAML, fixture corpora,
     `pending-graduations.md`, ADRs, PDRs, plans, rules).
   - Live system state observable via read-only commands
     (`git log`, `git blame`, file existence, hook output).
   - Reviewer reports and prior owner-reframes captured in
     `.agent/memory/active/distilled.md` or thread records.

2. **The discharge action is reading, not acting**. The gate
   produces no pressure toward irreversible operations. When the
   answer is reachable by reading, the agent reads. When reading
   resolves the question, the agent records the resolution and
   proceeds. There is no shape of this rule that produces
   *"therefore execute the destructive operation"*.

3. **What remains for the owner**. After the empirical surfaces are
   exhausted, three classes of question legitimately reach the
   owner:
   - Value-judgement questions (which trade-off, which priority,
     which user impact matters).
   - Decisions whose answer the owner has not yet authored anywhere
     (a fresh architectural fork, a fresh policy, a fresh
     direction).
   - Questions whose empirically-answerable component the agent has
     resolved but whose scope/value-claim component is owner-owned
     (the agent presents the resolved fragment alongside the
     genuinely-owner-owned fragment).

## Scope

**Adopter scope**: every Practice-bearing repo. The substance is
portable. The empirical-answerability frame is independent of the
host repo's product domain — it governs how an agent decides what
to read versus what to ask.

**What counts as the gate firing**:

- The agent has identified a fork or uncertainty.
- Before drafting the question for the owner, the agent enumerates
  the empirical surfaces that might carry the answer.
- The agent reads those surfaces.
- The agent records the answer (or the named gap) before any
  question reaches the owner.

**What does NOT count as the gate firing**:

- Listing surfaces without reading them.
- Reading one surface, declaring the answer absent, and posing the
  fork without checking the others.
- Treating *"I assumed it was here"* as equivalent to *"I read it
  and confirmed it is not here"*.

## Rationale

**Boundary with PDR-046 §Move 3**. PDR-046's third move governs the
layered processing of knowledge being absorbed into the agent's
working state (capture-surfaces → distilled → pending-graduations →
directives). PDR-057 governs the question-emission gate: before any
fork is drafted toward the owner, has the question's empirical
component been read? The two compose — PDR-046 §Move 3 disciplines
*what gets read into the working state*; PDR-057 disciplines *what
gets asked of the owner*. Neither subsumes the other.

The empirical-answerability frame carries no inherent action-bias.
The gate's *"if yes, read"* discharge is non-destructive by
construction; reading does not mutate state, does not commit, does
not run `git checkout`. The destructive-operation guard problem
that quarantined apply-don't-ask is therefore structurally absent.

The frame also names the genuine failure mode more precisely.
Apply-don't-ask conflated two distinct shapes: *the agent is bouncing
the answer to the owner instead of reading* (a discipline failure)
and *the agent is hesitating to act on a clear path* (which, as the
incident showed, is sometimes correct hesitation, not failure). The
empirical-answerability frame disambiguates: the gate fires on the
former and is silent on the latter.

The three classes of legitimate owner-bound question are exhaustive
under the frame. A question that does not fall into one of the three
classes is, by elimination, empirically answerable, and reading is
owed before posing.

## Consequences

**Enables**:

- The agent reaches the owner with questions whose empirical
  component is already discharged. Owner attention is spent on
  value-judgement, fresh decisions, or owner-owned scope, not on
  *"please look at the file I have not read"*.
- Reviewer findings and prior owner-reframes captured in repo
  surfaces become load-bearing — the gate makes them readable into
  every session that touches the same area.
- The destructive-action discipline (PDR-046, the never-disable-checks
  family of rules, the never-use-git-to-remove-work rule) is not in
  tension with the gate; the two compose by construction.

**Costs**:

- Sessions that previously raced to the owner with *"please
  decide"* rounds now pay an empirical-surface read cost first.
  This cost is the rule operating correctly — the alternative
  (owner reading the file the agent did not read) is more
  expensive, both directly and in attention fragmentation.
- The empirical-surface enumeration step is non-trivial and
  benefits from `find-and-grep` discipline rather than
  ad-hoc scanning.

**Forbids**:

- Drafting a substantive question to the owner before any
  empirical-surface read on a question whose investigation is
  authorised or implied by the active workstream. (Pre-investigation
  triage — *"is this even worth investigating now?"* — is a
  legitimate value-judgement question and falls outside the gate.)
- Treating *"the answer is probably in the code somewhere"* as a
  substitute for reading.
- Reframing the rule as *"act, do not ask"*. The rule does not
  prescribe action. Reading is the discharge; reading is the rule.

## Anti-Patterns

The gate has two named failure modes when it is misapplied:

1. **Action-bias re-import** — the agent reads the empirical
   surface, finds an answer, and acts on a destructive
   interpretation of the answer without owner authorisation. The
   gate did not fire on the action; the gate fired on the
   *question*. Destructive operations remain owner-authorised
   regardless of empirical-answerability. The destructive-action
   discipline family
   ([`never-use-git-to-remove-work`](../../rules/never-use-git-to-remove-work.md),
   [`never-disable-checks`](../../rules/never-disable-checks.md),
   [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md),
   the commit-skill safety rules) is fully load-bearing under this
   PDR. Empirical-answerability never discharges destructive-action
   authorisation; the two gates compose.

2. **Empirical-surface theatre** — the agent enumerates surfaces
   verbosely, reads none, and declares the answer absent. This is
   the rule's letter without its substance. The discipline is in
   the reading, not the enumeration.

## Implementation

The gate is presently agent-side discipline. The
[`read-before-asking`](../../rules/read-before-asking.md) rule is its
operational expression for the Claude / Codex / Cursor surfaces.
That rule's substance subsumes part of this PDR; this PDR provides
the doctrinal frame the rule implements.

Future hardening MAY add a pre-question-checklist surface (a tooling
prompt that asks *"which empirical surfaces did you read?"* before
the question is sent) but the substance is the discipline itself,
not its automation.

## Source

This PDR graduates the QUAR-1 entry of
[`pending-graduations.md`](../../memory/operational/pending-graduations.md)
under the 2026-05-01 owner-named reformulation. The original
candidate (`apply-don't-ask`) is preserved in
[`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](../../memory/operational/quarantine/apply-dont-ask-doctrine.md)
as historical evidence; that file is updated to mark the
quarantine cleared by this PDR.
