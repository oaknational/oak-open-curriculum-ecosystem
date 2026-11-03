---
classification: core
description: On a ticket or board owned by someone else, only links to our own tickets and status updates are permitted; the description, comments, and priority stay theirs. Check the field before the write call. Where the surface has its own owner-set write rule, that rule takes precedence over this one.
---

# Foreign Board Write Discipline

**TRIGGER — the rule fires at the WRITE CALL to a ticket, board, or
tracker you do not own, never in the abstract:** name the field you are
about to touch and check it against the three-way split below. Links to
our own tickets and status updates are permitted; the description and
the comment thread are not; priority stays theirs. If the field is not
on the permitted list the write does not happen — the route is a message
asking the record's owner to make it. Where the surface carries its own
owner-set write rule, resolve THAT rule first: it can refuse the write
outright, and it can require prose this split would otherwise deny — see
**Precedence** below.

Owner instructions (2026-08-18, given in OCE, minutes apart, the second
narrowing the first — names redacted): "please don't post onto [a
colleague]'s board or tickets. I see you've edited it … please undo", then
"For each of those tickets on [their] board could we link them to their
related tickets on our board please? and update the status (this we _can_
do)".

The boundary generalises beyond that one board, and the generalisation
is the point — the next foreign board will not be theirs. **Links and
status are shared bookkeeping about work we own; the description and the
comments are the record owner's own voice, and stay theirs.**

## Trigger

About to write to any ticket, board, project, or tracker owned by
someone else: a colleague's tracker project, another team's issue, a
foreign repository's GitHub issue, a knowledge-base database that is not
ours. Reading is unceremonied; the rule fires at the write. A surface
with its own owner-set write rule stays in scope deliberately — such a
rule asks whether we may write at all, not which fields are ours to
author, so the two compose rather than duplicate. See **Precedence**.

Ownership is a property of the RECORD, not of the work. Holding the
dependency, owning the fix, or being demonstrably right about the
ticket's content does not make the record ours.

## Action

Split every intended write three ways.

- **PERMITTED** — `relatedTo` / `blockedBy` links pointing at our own
  tickets, and status/state updates so the board reflects reality. Both
  are statements about work we own, recorded where the dependency is
  visible.
- **NOT PERMITTED** — editing the description; posting comments. A
  description is the product owner's own statement of their need; a
  comment is us speaking on their record. Neither is ours to author,
  however accurate the content. Route the substance to the owner and
  let them write it.
- **STAYS THEIRS** — priority. The owner named links and status only;
  the priority edits were the part he asked undone. Absence from the
  permitted list is a prohibition, not an open question.

**Do not read the prohibition as blanket.** Withholding the links too
would leave the two boards permanently disconnected — which is the
disconnection the owner was objecting to in the first place. Being
factually right about someone else's ticket is not authority over their
words, but it IS a reason to keep the dependency graph honest.

## Precedence — a Per-Surface Owner-Set Rule Wins

This is a GENERAL cross-surface discipline. Where the surface being
written to has its own owner-set write rule, **that rule governs and
this one defers** — both when it is stricter than the split above and
when it MANDATES something the split would otherwise deny. A general
discipline must never loosen, override, or appear to contradict a
specific owner-authorised boundary. Resolve the per-surface rule first;
apply the three-way split inside whatever it leaves open. Nothing on
this rule's permitted list is authorisation: it is at most permission
that a per-surface rule may still withhold.

The worked example is OCE's knowledge-base pages, governed there by an
owner-set rule with two parts: a title designation that marks the pages
agents may edit, and a page-local change ledger every permitted edit
must update.

- **Whether we may write at all is that rule's question.** It permits
  edits only where the page's own title carries the designation or it
  sits beneath a page whose title does, and it refuses every unmarked or
  human-managed page, surfacing the request to the Director. So a
  foreign status update on an unmarked page is REFUSED, however plainly
  "status" sits on the permitted list here.
- **Which fields are ours to author once permitted is this rule's
  question.** The designation makes a page eligible for editing; it does
  not make a foreign record's description or comment thread ours to
  write. Both rules must be satisfied and the stricter answer stands.
- **The change-ledger entry that rule requires is mandated bookkeeping,
  not us speaking on their record.** It is prose we place on someone
  else's page, and this rule's comment prohibition does NOT reach it:
  the entry is the surface owner's own provenance requirement, in a
  fixed prescribed form, recording a change we made — the same category
  as the permitted links and status. A permitted change there is
  INCOMPLETE until its ledger line and traceability toggle are visible.
  Never withhold a ledger entry by appeal to this rule, and never log
  writing one as a violation of it.

The same reading applies to any surface whose owner sets its own write
rule: read that rule as the outer gate, this one as the field split
within it. The rule fires here at any write to a record this estate does
not own, whatever the surface: a foreign repository's issue, another
team's tracker project, a knowledge-base page that is not ours.

## Failure Mode Prevented

Silent authorship on someone else's record. Tracker writes are
attributed and permanent: a reverted description still shows as an edit
in the activity log, so our voice stays on their record after the
content is restored. The prohibition cannot be satisfied
retrospectively, which is why the check belongs before the call.

Also prevented: a seat meeting a general rule and a per-surface
owner-set rule that disagree, and resolving it by whichever reading
permits the write it wanted — or the mirror failure, refusing an
owner-mandated ledger entry as a forbidden comment and leaving a
half-finished edit on someone else's page.

## Worked Instance

2026-08-18, in OCE: a Director issued rulings requiring edits to three
tickets on the product owner's board, and the liaison seat executed them.
The ownership fact was established and stated plainly beforehand — nobody
lacked it. The generator was scope, not knowledge: "our board" was read
loosely, and a SHARED ISSUE-NUMBER SPACE across the two tracker projects
made adjacent tickets feel in-scope when their ownership had never
changed. The lesson: **authority to resolve a dependency is not
authority to edit its record.** Four tickets were reverted and re-read
to confirm; the tracker's activity log still shows the edits happened and
cannot be erased. A first record of the correction stated the
prohibition too broadly — as a blanket no-write fence — and had to be
corrected against the owner's narrowing.

## Why a Rule, Not a PDR Clause

Classifier #1 of [`new-rule-vs-pdr-clause`](./new-rule-vs-pdr-clause.md):
an always-applied, agent-general discipline that fires at a structural
moment — the write call to a record. Every seat holding tracker
credentials can make this write, so the boundary must be baseline
session context rather than something one ceremony carries. A rule on
where OUR tickets live is adjacent but governs placement, not what we may
do to someone else's record; no existing PDR owns the foreign-record
boundary.

## Related Surfaces

- [`bot-identity-on-third-party-systems`](./bot-identity-on-third-party-systems.md)
  — whose name a permitted write displays.
- [`ticket-management` SKILL](../skills/planning/ticket-management/SKILL-CANONICAL.md)
  — the authoring discipline for the ticket graph the permitted links
  belong to.
- OCE's per-surface owner-set rules (the placement of its own tickets,
  the knowledge-base edit boundary with its change ledger, and the
  read-only strategy page) are that estate's host-local instances of the
  outer gate this rule defers to. This estate's one such outer gate is
  [`downstream-checkout-never-writes-upstream-surfaces`](./downstream-checkout-never-writes-upstream-surfaces.md):
  a write to an upstream repository, tracker or chat is refused outright
  there, before this rule's field split is ever reached.

## Enforcement

Behavioural at the write call, and observable afterwards: every tracker
keeps an attributed activity log, so a description edit or comment
authored by one of our identities on a foreign ticket is visible to its
owner and to any later audit. Nothing mechanical can gate it — the same
credential makes permitted and forbidden writes possible — so the
field-by-field check before the call is the whole compliance mechanism.
