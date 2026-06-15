---
pdr_kind: pattern
---

# PDR-096: Atomic Propagation of a Change Across Its Reader Surfaces

**Status**: Accepted
**Date**: 2026-06-15
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — a change recorded only in
doctrine that readers never consult is the unenforced-principle failure at the
propagation layer);
[PDR-092](PDR-092-mechanical-firing-moments-over-vigilance-clauses.md)
(mechanical firing moments — the durable cure for the recurrence is a mechanical
reader-surface enumeration, not author vigilance);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(knowledge-flow discipline — this PDR governs how one change moves across the
surfaces the flow has produced).

## Context

A change to a protocol, contract, schema, or doctrine is rarely confined to one
file. The thing changed has **reader surfaces** — every place an affected party
consults to act: skills, rules, READMEs, resolver or consumer code, decision
records, generated outputs, status displays. Recording the change in only one of
them — characteristically the decision record — leaves an **invisible half-broken
state**: each surface reads internally consistent, while the system as a whole is
wrong and no party has visibility that they are in a partway state.

This recurs across unrelated contexts. Four instances within one window:

- A schema relocation that did not repoint its readers, which kept resolving the
  old location.
- A communication-channel home-drift: the channel moved, but the documentation
  and a status-line scan still pointed at the old directory.
- A roster-detection mechanism that was never told a filename convention it
  depended on, so it silently never fired.
- An untrack of the live coordination state: recording the resulting standing
  curation obligation only in the decision record would have shipped the untrack
  with the lifecycle skills, rules, and README still silent — removing a
  knowledge-preservation safety net without wiring its replacement.

In each, the decision was *recorded* but did not *propagate*; the gap surfaced
later as a silent failure (a dangling reference, a never-firing detector, an
orphaned obligation).

## Decision

**When a change alters something other parties read to act, enumerate every
reader surface of the changed thing and land the change across all of them in one
tranche.** A change recorded only in its decision record, absent from the
operational surfaces affected parties actually read, is an unlanded change — the
same status as code written but never wired in.

The move is mechanical, not vigilance-based (PDR-092):

1. **Name the changed thing's reader surfaces.** Ask *who acts on this, and what
   do they read to act?* — not *which file did I edit?* Readers include skills,
   rules, READMEs, resolver and consumer code, generated artefacts, status
   surfaces, and the decision record itself.
2. **Land the change across all of them atomically.** If they cannot all land
   together, the change is not ready; a partial landing is the half-broken state.
3. **Where the reader-surface set is stable and known, prefer a structural
   enforcer** — a generator that emits all surfaces from one source, or a
   validator that asserts the surfaces agree — over re-enumeration by each future
   author.

This composes with the content-tier placement rule (`practice.md`
§ Content Tiers and the Placement Rule): a change may split across the Practice
tier (the principle) and the repo tier (its application), but both parts still
land **together** — split-tier recording is one change that must propagate
atomically across both.

## Rationale

The rejected alternative is *the decision record is the landing*: record the
change once, in the decision record, and treat downstream surfaces as eventually
catching up. That is the failure mode itself — the parties who act never read the
decision record; they read the operational surfaces, so the change does not exist
for them until it reaches those surfaces. Splitting a multi-surface change into
"land the decision now, propagate later" does not produce a smaller change; it
produces the same change shipped broken. Atomic landing across reader surfaces is
the only shape that is never partway.

## Consequences

- A change set is judged complete by reader-surface coverage, not by "the
  decision is recorded." The decision record is one reader surface among several,
  never the finish line.
- The failure mode has a name, so it is catchable in review: *which surfaces read
  this, and did they all change?*
- Where enforcement is structural, the discipline survives author turnover; where
  it is not yet, the enumeration is an explicit review step.
- A change that touches many reader surfaces is genuinely larger per commit. That
  is the real size of the change; splitting it to look smaller reproduces the
  half-broken state rather than producing a smaller change.
