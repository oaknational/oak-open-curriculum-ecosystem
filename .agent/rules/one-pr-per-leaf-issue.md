---
classification: core
description: HARD RULE (owner, 2026-09-02). A leaf issue is delivered by exactly ONE PR, and that PR closes it with the tracker's closing keyword (`Fixes <issue>`). Many leaves may map to one PR; one leaf never maps to two. Split across repo boundaries, across the in-repo/out-of-repo boundary, and between decision and delivery. `References`/`Refs:` do not close and are legitimate only for parent or related issues, with the reason stated. Parents close when their last child does.
---

# One PR Per Leaf Issue, and the PR Closes It

**HARD RULE.** Deliver a **leaf** issue — one with no children — with **exactly one**
pull request, and close the issue from that PR's body with a closing keyword:
`Fixes <issue>`, or the equivalent `Closes` / `Resolves`, in the tracker's own
form (an estate tracking work in GitHub issues writes `Fixes #nnn`; one on a
ticket tracker writes its issue id, such as `Fixes ABC-nnn`; an estate that
mints no leaf issue today, its work living in the plan estate, is bound from
the first leaf issue it mints, in that tracker's form). You settle this
twice — cardinality at ticket-scoping time, before a branch exists; the closing
keyword at PR-body authoring time, before the PR is opened. Many leaf issues may
map to one PR; one leaf issue may never map to two. A leaf needing a second PR is
mis-scoped: break it into leaves that each land in one PR, splitting at every
boundary the work crosses — one leaf per repository, in-repo work apart from
out-of-repo work, and decision apart from delivery. `References`, `Refs:`,
`Related:` and a bare issue mention do **not** close; they are correct only
against a parent issue, or a related issue this PR does not deliver, and the PR
must say which. A **parent** issue — including a childless ticket held open as a
durable record — sits outside the one-PR requirement: its children carry the
delivery, so it may carry many PRs, and it closes when its last child leaf closes.

Per [`rules-have-no-exceptions`](rules-have-no-exceptions.md), no convenience case
escapes the requirement.

## Origin

This rule became doctrine by the owner's ruling of 2026-09-02, given in OCE. The
quotation below is that ruling as recorded from chat, its ellipses included. The
operative statement of the rule is the prose above; this quotation is only its
source:

> "for future work it should have at most one PR per issue (unless it's parent issue)
> … so the leaf issues must be 1-1 (or many to one) with a single PR … if not then
> the issue should be broken down … or if the issue requires work across repos or
> some work in repos or outside them again should be split. This should be a HARD
> RULE. PRs should close issues automatically. HARD RULE"

## Trigger

This rule fires at **two** structural moments, and both are load-bearing:

1. **Ticket-scoping time** — minting or re-scoping an issue, briefing a lane,
   designing a stack. The cardinality question is settled here, before a branch
   exists.
2. **PR-body authoring time** — writing the PR body's tracker lines. The closing
   keyword is settled here, before the PR is opened.

Catching it only at the second moment is too late: a leaf issue that needs two PRs
is already mis-scoped by then, and splitting under review pressure is the expensive
path (see [`design-work-for-small-prs`](design-work-for-small-prs.md), whose bands
this rule sits beside rather than inside).

## Action

### 1. Leaf issues are one-to-one with a PR

A **leaf** issue — one with no children — is delivered by **exactly one** PR. Many
leaf issues may map to one PR; one leaf issue may never map to two.

If the work needs more than one PR, **the issue is mis-scoped: break it down** into
leaves that each land in one PR. Do not open a second PR against the same leaf.

### 2. Split across every boundary the work crosses

An issue is split — never stretched — when its work crosses:

- **repositories** (one leaf per repo; a leaf never spans two);
- **the repo boundary itself** — in-repo work and out-of-repo work (a vendor portal,
  a hosting dashboard, an identity provider's console, a knowledge-base page) are
  different leaves, because out-of-repo work has no PR to close it and would
  otherwise hold an in-repo leaf open indefinitely;
- **decision and delivery** — an issue that must be *decided* before it can be
  *built* is two leaves, or a decision leaf under a parent.

### 3. The PR closes the issue automatically

Every PR delivering a leaf names it with a **closing keyword** in the PR body, in
the tracker's form:

```text
Fixes <issue-id>
```

`Closes` and `Resolves` are equivalent. **`References`, `Refs:`, `Related:` and a
bare issue mention do NOT close** — they attach the PR and leave the issue open
forever unless a human remembers.

`References` remains legitimate for exactly two things, and the PR must say which:

- pointing at a **parent** issue the PR contributes to but does not complete;
- pointing at a **related** issue the PR does not deliver.

A PR whose tracker lines carry only `References` on a **leaf** it in fact delivers
is out of contract, whatever the reason given.

### 4. Parent issues close when their children do

A parent may carry many PRs. It is never closed by a keyword from a child's PR; it
closes when its last child leaf closes. A parent used as a **durable record** (a
domain-move record, a decision register) is a parent for this rule's purposes even
with no children — and its PRs correctly use `References`.

## The failure mode this prevents

**A shipped leaf issue that reads as live work for weeks, indistinguishable from
work nobody has started.**

Worked instance in OCE, measured 2026-09-02. A one-line configuration rename (the
plugin's server key aligned to its product name) was decided by the owner on
2026-08-10 and delivered entirely by one pull request merged about eighty minutes
after the decision. Verified on that estate's default branch: the shipped binding,
the landing-page snippet and its unit test agreed, and the sentinel guard carried
the rewritten comment recording the rename as deliberate. Every acceptance
criterion met.

**The ticket read `In Progress` / `Urgent` for twenty-three days.** The pull
request's tracker lines carried a bare mention ("Owner decision, <ticket>,
2026-08-10") and, on their last line, `Refs: <ticket>, <related ticket>`. Neither
closes. Its branch was named for the fix rather than in the tracker's suggested
branch form, so branch-name linking did not fire either.

The cost was not cosmetic. On 2026-09-01 a colleague commented a decision,
agreeing a decision that had already been made **and shipped three weeks
earlier**. Two people's attention was spent re-deciding finished work, and the
ticket sat on an `Urgent`, pre-publish board four days from a publicity deadline.

**Controls proving the mechanism itself works, so this is a discipline gap and not a
tooling defect:** in the same estate, one pull request carried `Fixes <ticket>` and
that ticket **is** `Done`; another carried `References <ticket>` *deliberately* —
"the ticket stays open as the domain-move record" — and that ticket correctly
stayed open. The integration does exactly what it is told; the mis-scoped pull
request told it nothing.

## Why this is a rule, not a clause

It was considered as a clause on [`design-work-for-small-prs`](design-work-for-small-prs.md)
and rejected. That rule governs changeset **size** (file-count bands) at work-shaping
time; this one governs issue↔PR **cardinality and closure**, and half of it fires at
PR-body-authoring time, which that rule explicitly disclaims ("It does not first fire
at PR-open"). Folding the closing-keyword discipline into a rule about file counts
would bury it where no author looks at the moment it matters.

The two are siblings and reinforce each other: sizing bands make a leaf small enough
to land in one PR; this rule makes that one PR close it.

## Enforcement

Behavioural at both trigger moments today. The reviewable hardening is a PR check
that reddens when a PR body's tracker lines name a **leaf** issue without a
closing keyword — and that check must demand a *stated reason* rather than banning
`References`, because the deliberate `References` above was correct. "Justified
exception" is currently justified to nobody, which is the gap. OCE tracks that
check on its own tracker beside its derived-label action, so it rides one piece of
PR automation rather than two; until a host lands the check, the rule is
behavioural there.

**Falsifier for this rule**: a leaf issue that genuinely cannot be delivered by one
PR without an indivisible-proof argument of the kind
`design-work-for-small-prs` §indivisibility already recognises. If that shape appears
twice, the cardinality claim is too strong and wants the same proof-shaped exception.

## Related Surfaces

- [`design-work-for-small-prs`](design-work-for-small-prs.md) — the sizing sibling.
- [`ticket-management`](../skills/planning/ticket-management/SKILL-CANONICAL.md) — one story
  per ticket; the scoping home this rule's clause 1 makes binding.
- [`pr-lifecycle`](../skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md) — where the PR body is
  authored and clause 3 is applied.
- [`rules-have-no-exceptions`](rules-have-no-exceptions.md) — why a hard rule admits
  no convenience case, and why a case that seems not to fit repairs the rule's stated
  domain instead of escaping it.
