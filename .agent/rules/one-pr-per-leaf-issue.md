# One PR Per Leaf Issue, and the PR Closes It

**HARD RULE.** A **leaf** issue — one with no children — is delivered by **exactly
one** pull request, and that pull request closes the issue itself by naming it with a
closing keyword in the PR body: `Fixes MCP-nnn`, or the equivalent `Closes` /
`Resolves`. Many leaf issues may map to one PR; one leaf issue may never map to two.
Work needing a second PR is work whose issue is **mis-scoped**: break it into leaves
that each land in one PR, splitting at every boundary the work crosses — one leaf per
repository, in-repo work apart from out-of-repo work, and decision apart from
delivery. `References`, `Refs:`, `Related:` and a bare `MCP-nnn` mention do **not**
close; they are correct only against a **parent** issue, or a genuinely related issue
this PR does not deliver, and the PR states which. A parent issue sits outside the
one-PR requirement — its children carry the delivery, so it may carry many PRs, and
it closes when its last child leaf closes.

The requirement is settled at **two** moments: at ticket-scoping time, where
cardinality is fixed before a branch exists, and at PR-body authoring time, where the
closing keyword is fixed before the PR is opened. Per
[`rules-have-no-exceptions`](rules-have-no-exceptions.md), no convenience case sits
outside it.

## Origin

This rule is doctrine on the owner's ruling of 2026-09-02, quoted here in full. The
ellipses are elisions made when the ruling was recorded from chat; the operative
statement of the rule is the text above, and this quotation is its source:

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
2. **PR-body authoring time** — writing the `## Linear` section. The closing
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
  a Cloudflare zone, a Clerk dashboard, a Notion page) are different leaves, because
  out-of-repo work has no PR to close it and would otherwise hold an in-repo leaf
  open indefinitely;
- **decision and delivery** — an issue that must be *decided* before it can be
  *built* is two leaves, or a decision leaf under a parent.

### 3. The PR closes the issue automatically

Every PR delivering a leaf names it with a **closing keyword** in the PR body:

```text
Fixes MCP-nnn
```

`Closes` and `Resolves` are equivalent. **`References`, `Refs:`, `Related:` and a
bare `MCP-nnn` mention do NOT close** — they attach the PR and leave the issue open
forever unless a human remembers.

`References` remains legitimate for exactly two things, and the PR must say which:

- pointing at a **parent** issue the PR contributes to but does not complete;
- pointing at a **related** issue the PR does not deliver.

A PR whose `## Linear` section carries only `References` on a **leaf** it in fact
delivers is out of contract, whatever the reason given.

### 4. Parent issues close when their children do

A parent may carry many PRs. It is never closed by a keyword from a child's PR; it
closes when its last child leaf closes. A parent used as a **durable record** (a
domain-move record, a decision register) is a parent for this rule's purposes even
with no children — and its PRs correctly use `References`.

## The failure mode this prevents

**A shipped leaf issue that reads as live work for weeks, indistinguishable from
work nobody has started.**

Worked instance, measured 2026-09-02. **MCP-536** (align the plugin's MCP server key
to `oak-open-curriculum`) was decided by the owner on 2026-08-10 and delivered
entirely by **PR #843, merged 2026-08-10T14:23:37Z** — about eighty minutes after the
decision. Verified on `origin/main`: the shipped binding reads `oak-open-curriculum`,
the landing-page snippet and its unit test agree, and the sentinel guard carries the
rewritten comment recording the rename as deliberate. Every acceptance criterion met.

**The ticket read `In Progress` / `Urgent` for twenty-three days.** #843's `## Linear`
section carried a bare mention ("Owner decision, MCP-536, 2026-08-10") and, on its
last line, `Refs: MCP-536, MCP-302`. Neither closes. Its branch was
`fix/mcp-plugin-server-key` rather than Linear's suggested `…/mcp-536-…`, so
branch-name linking did not fire either.

The cost was not cosmetic. On 2026-09-01 a colleague commented *"Decision: with
oak-open-curriculum"* — agreeing a decision that had already been made **and shipped
three weeks earlier**. Two people's attention was spent re-deciding finished work,
and the ticket sat on an `Urgent`, `pre-publish` board four days from a publicity
deadline.

**Controls proving the mechanism itself works, so this is a discipline gap and not a
tooling defect:** PR #946 carried `Fixes MCP-655` and MCP-655 **is** `Done`. PR #944
carried `References MCP-122` *deliberately* — "the ticket stays open as the
domain-move record" — and MCP-122 correctly stayed open. The integration does exactly
what it is told; #843 told it nothing.

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
that reddens when a PR body's `## Linear` section names a **leaf** issue without a
closing keyword — and that check must demand a *stated reason* rather than banning
`References`, because #944's use of it was correct. "Justified exception" is currently
justified to nobody, which is the gap. Tracked on
[MCP-664](https://linear.app/oaknational/issue/MCP-664) alongside the derived-label
Action, so it rides one piece of PR automation rather than two.

**Falsifier for this rule**: a leaf issue that genuinely cannot be delivered by one
PR without an indivisible-proof argument of the kind
`design-work-for-small-prs` §indivisibility already recognises. If that shape appears
twice, the cardinality claim is too strong and wants the same proof-shaped exception.

## Related Surfaces

- [`design-work-for-small-prs`](design-work-for-small-prs.md) — the sizing sibling.
- [`ticket-management`](../skills/ticket-management/SKILL-CANONICAL.md) — one story
  per ticket; the scoping home this rule's clause 1 makes binding.
- [`pr-lifecycle`](../skills/pr-lifecycle/SKILL-CANONICAL.md) — where the PR body is
  authored and clause 3 is applied.
- [`rules-have-no-exceptions`](rules-have-no-exceptions.md) — why "HARD RULE" needs
  no restatement here.
