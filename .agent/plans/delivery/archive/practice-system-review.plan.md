---
id: practice-system-review
node_type: delivery
name: The Practice as one system across two estates — a one-page model of how work is planned, implemented, reviewed and delivered, with the evidence behind it
overview: >-
  Read both estates fresh, as one system of development and value provision with two
  instantiations, and write one report whose first page is the model: what the Practice is in
  its layers, what transmits to a new context, what is created empty there, what stays the
  host's, how the system learns, and the divergences between the estates classed by kind with a
  direction each; the evidence behind the model follows, one coarse row per area of the system,
  for the owner's decision on whether the model is simple enough to proceed with.
status: archived
ratified_by: Jim Cresswell
ratified_date: 2026-10-04
ratified_where: >-
  The owner's card answer of 2026-10-04 13:3xZ in the session of Crucible binds Slag (7b999c),
  the Director seat across both estates. The card asked whether the owner ratifies this node as
  reshaped after two Cricket checks (a two-hour layer pass writing a one-page model, one hour of
  evidence rows, one landing, about four hours of one seat); the answer, verbatim, "Ratify as
  reshaped (Recommended)", ratifies the node in both estates as one system. This frontmatter is
  the record of the word in each estate; the card's full text is kept in the jimcresswell.net
  napkin block of 2026-10-04, a sibling-estate surface named here and not linked.
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-04
---

# The Practice as one system across two estates

**Completed and archived 2026-10-04.** The owner read the model and ratified the five-layer
definition as canonical by card answer ("Ratify as canonical"); the word is recorded as a dated
line in `best-of-each-practice` §Delivery, the definition in PDR-143 §Decision and `practice.md`,
and the report `practice-system-review-2026-10` under the agentic-engineering reports is the
evidence; the owner gate is cleared. The successor delivery node is written from the model.

The owner's words, 2026-10-03 20:4xZ, verbatim: "there are two estates with one system of
development and value provision and contracts and authority and so on, and that system currently
has divergences that we are trying to resolve." And: "forget what you think you know and review
the mechanisms in both estates for planning, implementing, and reviewing and delivering value.
What is in the repos that is not the delivered product but is the how and when and why of the
engineering and the developer experience and the user value and the strictness and the contracts
... everything that isn't 'the product'." And on the layers: "There is the Practice in general,
the Practice in a context, and the ephemeral state and memory and records that the Practice
accumulates over time in a context and learns from. There is the learning loop itself. I don't
think we have a definition of what the Practice is."

This is an n=1 session until the owner says otherwise: one seat reads, one report lands. Nothing
is aligned, carried or landed under this node; it produces understanding and a model, and the
owner decides when the model is simple enough to proceed from.

## Goal

One document the owner reads in one sitting: a one-page model of the development system that runs
in both estates, derived from reading what runs and governs rather than assumed before it, with
the divergences between the estates classed so that a decision is one word per class, never per
file; and the evidence behind the model, bounded to what the reading touched.

## User groups and value

- The owner: a single picture of the system instead of two trees and a ledger of hunks; a
  definition to ratify or correct; a decision per class; the extraction's design question
  answerable from a model instead of a copy.
- Seats in either estate: the same understanding of what governs their work and why.
- The next design (the entity, the directory contract, the install shape): its first input, which
  is the model, not an inventory.

## Problem frame

Gap: one system of development runs in two repositories and no ratified statement of what it is
exists. Three partial ones do: the one-sentence definition in `.agent/practice-core/practice.md`
(the same sentence in both estates), the functional reading in this estate's report
`what-the-practice-is.md` of 2026-09-13 (nine functions, provisional, this estate only), and
PDR-143's seven scope classes (Proposed, both estates); none is ratified, none reconciles the
others, and none names the layers the owner described. Who it harms: the owner, who cannot judge
alignment or decide the extraction without a model and has paid two days of work shaped around a
subset; the seats, who learn the same lesson twice and meet gates whose reasons differ by estate.
Mechanism (the causal hypothesis): the Practice grew by a transplant and then by local learning in
each estate; every attempt to describe it chose the copyable subset and measured bytes, so the
alignment work optimised the wrong object, and the learning loop, the records' structure and the
second ring (gates, hooks, configs, workflows, the standardisation of tooling across workspaces)
were never read as parts of one thing. Constraints: one seat; read-only; both estates in one pass;
the owner's guide of hours; a report, never a ledger. Success: the owner reads one page and can say
what the Practice is and what to do next.

## Mechanism

Why one reading of both estates produces the model: the mechanisms are the same system
instantiated twice, so reading them side by side exposes what is general (present in both for the
same reason), what is contextual (present in both, bound differently), what has diverged (present
in both, meaning different things), and what is one-sided; the layers and the learning loop fall
out of that rather than being imposed on it. The reading starts from what runs and governs, never
from the ledger or the survey: the root entry points, the package scripts and their gates, the
hooks, the workflows, the configurations shared across workspaces, the records and their
structure, the plan estate, the collaboration substrate; the doctrine that explains them is read
second, as claims to test against what runs.

1. **The layer pass, about two hours, both estates side by side.** Read the structure that runs
   and write the draft model as one page: the layers the owner named (general; contextual;
   accumulated in a context and learned from; the learning loop between them) as the hypothesis
   under test, with what transmits to a new context, what is created empty there, and what stays
   the host's; the candidate definition of the Practice in one paragraph, written against the
   three existing statements and saying what it keeps from each and what it replaces, and whether
   the layers refine or replace PDR-143's seven scope classes; and the divergence classes between
   the estates by kind, each with the resolution direction for the kind (PDR-142 §How each kind
   travels already fixes a direction per kind; the page cites it and names where its classes
   differ). The draft is posted to the owner at the two-hour mark as a report, never a pause;
   the reading continues unless the owner redirects it.
2. **The evidence, about one hour.** One coarse row per area of the system, the areas the owner
   named: planning; deciding and authority (the record kinds, where each lives, how they relate,
   who decides what); implementing (branches, folds, commit gates, the tooling, the configuration
   shared across workspaces and the custom lint rules on structure and complexity); reviewing;
   delivering value; developer experience and onboarding; strictness and contracts (what each
   contract protects and what enforces it); the learning loop (capture, distillation, graduation,
   the inbound path from a sibling); collaboration and roles; structure (which directories hold
   definitions and which hold instances, where host-specific and machine-local things live). A
   row names the mechanisms the area holds, where each estate instantiates them, and the layer
   each sits in; it records only the exceptions: a mechanism that fits no layer or two, a
   divergence the classes do not cover, a mechanism both estates rely on that neither
   instantiates in any artefact, and what the pass did not read, marked `unread`. The rows revise
   the page where they contradict it; a revision is named on the page.
3. **The report, once.** `.agent/reports/agentic-engineering/practice-system-review-2026-10.md`:
   page one is the model, the rows follow; it names the two tips it read; every path it cites
   exists in the estate the row names, checked by the author's shell at writing and recorded in
   the pull request's description, the other estate's paths written as names, never links. It
   lands in this estate by one pull request with its README row, reviewed once, merged. The copy
   for the sibling estate rides the landing that records the owner's word there, since the parent
   node's dated line must land in both estates then; no second review cycle and no byte proof.
4. **After the owner's word, in the successor step, never under this node:** the owner's words
   of 2026-10-03 quoted above and the ratified definition land as amendment entries on PDR-143
   (revising its §Decision) and PDR-142, labelled heard first-hand by this seat; the parent
   node's §Delivery takes the dated line; the successor delivery node is written from the model.

The reading's honesty rules: the ledger's categories, the survey's prefixes and this seat's
earlier conclusions are not inputs, while a prior seat's statement that is an artefact in the tree
is; a row cites what it read; the records that claim to define an area (PDR-134 §1, PDR-143 §1,
PDR-141, PDR-024, PDR-048, PDR-130 among them) are tested against the instantiations, never
re-derived; where the seat cannot tell the layer or the class, the row says so and why.

This node is the step that re-grounds the parent node's bet: `best-of-each-practice` bets on
alignment judged as text travels, measured by the dry-run merge, and the owner's word of
2026-10-03 20:4xZ sets that measure aside until the system is understood whole; the parent's
§Delivery carries that word as a dated line, so the plan estate does not hold a ratified bet and a
sketch that denies it with no link between them.

## Acceptance criteria (each with a proof)

1. The report exists at the path above, names the two tips it read, and its first page carries
   the candidate definition, the layered model with the transmission boundary, and the divergence
   classes with a resolution direction each; the area rows follow, every exception and every
   `unread` named. Proof, `repo-safe`: the file at the merged tip; the cited-paths check recorded
   in the pull request's description.
2. The owner reads page one and says whether the model is simple enough to proceed with. Proof,
   `owner-held`: the word recorded as a dated line in the parent node's §Delivery, the pattern
   that node already uses; it is this node's completion or its next revision.
3. Nothing else changed. Proof, `repo-safe`: the pull request touches the report, its README row
   and this node only.

## Size

One seat. The layer pass about two hours, the evidence rows about one hour, writing and landing
about one hour: about four hours in one sitting, the draft model visible to the owner at the
two-hour mark. The owner's guide is the bound: an area that would push the evidence past its hour
is marked `unread` and the reading moves on; a whole that passes one sitting stops and reports the
reason with what it has, and the owner decides, rather than the seat continuing or re-sizing.

## Out of scope

Aligning, carrying, landing or re-reading anything under the parity ledger; the two-landings
sketch; the extraction's design; product code; any new instrument (the report is written by hand
from the reading); a second seat; a row per mechanism or per file.

## Todos

1. The layer pass, both estates side by side; the draft page posted at two hours.
2. The evidence rows, one per area; the page revised where they contradict it.
3. The report landed here by one pull request with its README row; the owner's reading.

## Plan-body first-principles check

- Shape: the proofs are the file at a merged tip, the cited-paths check and the owner's recorded
  word on the model; nothing measures activity.
- Frame, from the frame cards: (A) the Practice as a document set, the frame the work of
  2026-10-02 and 2026-10-03 operated under, measuring bytes although the ratified frame is
  concepts, never bytes (PDR-142 §Concepts travel); (B) the Practice as one system of mechanisms
  that documents instantiate, the owner's frame, adopted; (C) the Practice as the learning loop
  with everything else as its state, kept inside B as one of its layers. The bridge claim B rests
  on: reading the instantiating artefacts side by side is enough to recover the system; its
  falsifier is a mechanism both estates rely on that neither instantiates in any artefact, which
  the honesty rules say becomes an exception row.
- Proportionality: one seat, a report, no fleet, no ledger, no new instrument; the model is
  written first and the evidence is bounded to one hour, so the instrument cannot grow into the
  inventory the first node became. The direct-trial gate does not apply: the owner's purpose is
  understanding an unshaped concept, so the exploration is the work and its budget is the size
  above.
- Reversibility: a report in a directory, one pull request; the model is a proposal the owner can
  decline by class.
- Landing path: `.agent/plans/delivery/` for this node, its body the same in both estates; the
  report under `.agent/reports/agentic-engineering/` here, the sibling's copy with the owner's
  word.
- Reviewers: the assumptions and documentation reviewers read the first sketch on 2026-10-03;
  two Cricket checks, one normal and one adversarial, read it on 2026-10-04 and returned
  DRIFTING and NARROWED on the same evidence: seven and a half hours against the owner's guide,
  a row per mechanism as the ledger's shape in prose, twin pull requests with a byte proof as the
  parity reflex under a new name, a contradiction between the third criterion and the mechanism,
  a three-week gate with no named successor. Each is cured in this revision: the model first at
  two hours, one row per area with exceptions only, one landing with the sibling's copy riding
  the owner's word, the amendments moved after the word, the gate dated and its successor named.
  Declined, with the reason: archiving the two-landings sketch (the owner's word keeps it a
  sketch as a perspective no longer held).
