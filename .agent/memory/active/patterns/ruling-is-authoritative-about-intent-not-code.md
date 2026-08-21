---
name: A Ruling Is Authoritative About Intent, Not Evidence About the Code
polarity: anti-pattern
use_this_when: Relaying an owner instruction as a work item, or briefing a seat from a ruling that names files, mechanisms, couplings, or "its X" — especially when the instruction has already been relayed once and reads as settled
category: agent
proven_in: .agent/memory/operational/threads/mcp-submission-drive.next-session.md (2026-08-21 correction to the 2026-08-20 three-corrections block); Cloud-Config #558 apply failure the same day
proven_date: 2026-08-21
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Carrying an owner's incidental technical premise forward as established fact because the ruling it travelled inside is authoritative — deference to the intent extending silently to the engineering guess bundled with it"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a failure mode to avoid: an
> authority being over-extended from the domain where it is absolute into one
> where it is not. Recognising the shape is the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Principle

**An owner ruling is authoritative about INTENT. It is not evidence about the
codebase.** The two travel in the same sentence and get the same deference.

Rulings routinely carry incidental technical premises — a filename, a mechanism,
a coupling, a possessive *"its"* — which are ordinary engineering guesses made in
passing. **They need ordinary verification.** The intent does not.

The failure is not that anyone believed the owner over the code. It is that
nobody separated the two halves, because they arrived welded together and the
authoritative half licensed the whole sentence.

## The worked instance

The owner's teardown list read: *"Delete `public/carousel/` and its asset mount
(`ROUTED_ASSET_BASE`)"*.

**The possessive is the whole defect.** `ROUTED_ASSET_BASE` is not the carousel's
mount — it mounts the entire static root (design-system stylesheets, fonts,
icons, favicons), `mountStaticAssets()` **throws at boot** without its markers,
and **there is no carousel-specific mount at all**: the images were served purely
by sitting inside the static root.

**The premise survived seven relays** — six liaison seats and a Director's own
seat brief — and was written into a continuity block explicitly labelled *"inherit
these, they are the expensive part"*, which is the surface a successor trusts
most. Every relay was faithful. None was a check.

**What refuted it was the change that was supposed to justify it.** The
landing-page teardown PR — the very change the mount's removability was said to
be a consequence of — **KEEPS the mount and ADDS ~18 assertions against it.** The
teardown removes the mount's landing-page *consumers*, not the mount.

## Why deference is the mechanism, not carelessness

Owner-sourced statements are treated as settled, and **that is correct for
intent** — re-litigating a ruling wastes the owner's attention and this estate
rightly forbids it. The failure is that the same reflex covers the technical
clause riding alongside, where the owner has no special epistemic access and
would not claim any.

**A relayed ruling therefore hardens faster than a relayed measurement**, because
challenging it feels like challenging the ruling.

## Cure

**Split the sentence before relaying it.** Restate the intent verbatim and mark
every technical claim inside it as unverified until checked:

- *Intent (binding):* `mcp.thenational.academy` becomes only the MCP server.
- *Technical premise (needs checking):* that `ROUTED_ASSET_BASE` is the
  carousel's mount.

**Then check the premise against the code before it becomes a work item** — and
name it as unverified in the brief if you cannot.

**Corollary for the receiving seat: DECLINE ON EVIDENCE, do not defer.** A seat
handed a wrong premise should refute it and close the question. A deferred item
returns to the next seat with the wrong premise still attached — which is how
this one survived seven relays.

## Diagnostic tells

- A possessive or an "and its X" binding two things the code may not bind.
- A ruling that names a specific identifier, path, or mechanism.
- A premise you are about to brief a seat on that you have only ever *read*, in a
  record whose framing tells you to trust it.
- The thought *"the owner said so"* answering an engineering question.

## Falsifier

If a seat splits intent from premise as above and still ships a wrong technical
premise into a brief, the split is insufficient and the cure belongs at the
relay boundary as a mechanical check rather than a reading discipline — route via
[PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md).

## Related

- [`observation-that-does-not-bear-on-the-claim`](observation-that-does-not-bear-on-the-claim.md)
  — the instrument-side sibling; there an instrument misleads, here an authority
  is over-extended. Its *"Authority is not evidence"* section is the same
  discipline pointed at a Director rather than at the owner.
- [`landing-a-finding-is-not-holding-it`](landing-a-finding-is-not-holding-it.md)
  — the other way a known fact fails to bind the next artefact.
- [`substrate-pointer-read-as-current-state`](substrate-pointer-read-as-current-state.md)
  — a record's framing lending unearned currency to its content.
