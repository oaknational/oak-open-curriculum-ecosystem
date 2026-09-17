---
name: Query the Value, Never the Lookalike
polarity: anti-pattern
use_this_when: About to use an identifier, timestamp, ref, config value, or state reading that you constructed, inherited, defaulted into, or read from a copy — rather than derived from the thing that owns it, at the moment of use
category: agent
proven_in: .agent/memory/active/archive/napkin-2026-08-06.md (nine distinct shapes across ~six seats, 2026-07-31→2026-08-04); cited as doctrine by PDR-027 § field-role home
proven_date: 2026-08-04
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Using a value of the right TYPE and SHAPE in place of the value itself — an ambient default, a hand-extended identifier, a correct-when-read-but-now-stale reading, or the wrong copy of the right thing — where the substitution is invisible because the substitute validates"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to repeat. The name is the diagnostic: when the failure mode is about to fire, recognising the shape is the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

**A value of the right type, shape, and plausibility standing in for the value
itself.** The substitution is invisible precisely because the substitute
*validates* — it parses, it is a legal ref, it is a well-formed id, it is the
right kind of number. Nothing downstream can tell.

This pattern was cited by name across the estate for weeks — in continuity
records, a formation letter, the graduations register, and
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
§ field-role home — **before this file existed.** That is itself an instance of the
class it names: a citation of the right shape standing in for a home that was not
there.

## The shapes (each a first-hand instance from one fortnight)

**1. Ambient default substituted for the intended source.** A worktree helper
documented as branching from `origin/main` based new lane branches on the
primary's checked-out HEAD — a valid ref of exactly the right type, silently the
wrong one. Cost a close-and-recreate cycle on a PR that carried foreign commits.

**2. Hand-constructed identifier.** A merge pinned to a full SHA typed around a
9-character abbreviation; the invented tail 409'd because the remote compared
honestly. A short SHA is a **display** value. Sibling: a settle-watch armed on a
hand-extended SHA polled a 404 forever and its silence read as still-pending.

**3. Correct when derived, stale when used.** A "the successor is not observable
yet" assertion was true when composed and false by one minute when written; a
remote-ref read was correct at the instant of reading and had decayed by the
instant of the amend. The value did not have to be wrong to be wrong *here*.

**4. The wrong copy of the right thing.** A keyring diagnosis validated the
**local** copy and spoke about the **stored** value. A formatting gate passed
locally and failed in CI running the identical command — because **local reads the
working tree and CI reads the commit**. A pnpm pin read from another session's
uncommitted working-tree edit was reported as committed truth.

**5. Absence rendered as a well-typed value.** A settle-watch read
`copilotPending: 0` from a GraphQL-backed field that silently omits Bot
reviewers, while the re-review request was demonstrably pending. Zero is a
perfectly good number. **Any settle condition that keys on an entity's absence
must first prove the surface CAN carry that entity.**

**6. The adjacent value.** A config took an application id where a **user** id
belonged — both numbers sit in the same paragraph of the same document, one
labelled. The resulting address resolved to no user and broke an attribution chain
at its first hop. When a document names two ids of different kinds near each
other, the copy-target is ambiguous: **tables beat prose, and the value should be
derived from the API, never transcribed.**

**7. The hand-written timestamp.** Every hand-stamped `~HH:MMZ` in a day's records
was local time labelled `Z`; caught only when `date -u` read *earlier* than a
stamp written an hour before. Hand-written timestamps are lookalike values —
derive from `date -u` or the commit record.

**8. Anchoring on the derivation instead of the owner.** A premise that "bare
prefixes are ≤6 chars" anchored on the code that happened to produce them
(`slice(0,6)`) rather than the **schema that owns the field's domain**
(`min(1)`, unbounded). Familiarity is the tell: a derivation you have just worked
on arrives fluently as *the* contract.

**9. A grep hit standing in for a consumer.** A text match proves presence, never
participation; the engaged code path has to be settled separately.

## The cure

> **Derive the value from the thing that OWNS it, at the moment of use.**

Concretely, and in the order these bite:

- **Name what owns the value before you pin, copy, or assert it.** Pin against the
  owner's contract (the schema, the API, the registry), never through a machinery
  path that couples you to a non-invariant.
- **Fetch identifiers at the moment of use**, from `rev-parse` / `ls-remote` / the
  store — never extend, pad, or reconstruct one from a display form.
- **Re-derive any claim about another party's state in the same call that emits
  it**, not from an earlier read.
- **Ask which copy you are reading**: working tree or commit? local or stored?
  This checkout or the estate?
- **Before trusting an absence, prove the surface can express presence.**

## The producer-side dual: do not erase provenance

Graduated here from the pending-graduations register (captured 2026-07-30 on two
instances; the trigger's third instance arrived 2026-08-05, three times over).

Every shape above is a consumer failing. There is a **producer** design failure
that manufactures them wholesale:

> **An API that returns a resolved value while erasing whether it was CHOSEN or
> DEFAULTED forces every consumer to either bind a lookalike or privately
> re-derive.**

Worked instances, all read first-hand:

- An OAuth `issuer` field derived from a configured canonical host **or** a
  per-request fallback, returning the same answer either way — so reading it via
  the canonical host cannot distinguish configuration from derivation, and a
  consumer that needs to know must invent a discriminating probe (asking via a
  non-canonical alias).
- A platform token's `permissions` block that projects a **user**-shaped
  permission set over an application's granular grant, reporting `pull:false` for
  a token that demonstrably reads the repository. Every consumer that reads it for
  capability is reading a lookalike.
- A deployment API's region field returning a single legacy value that does **not**
  reflect the actual multi-region selection — so anyone re-verifying residency from
  that field concludes the opposite of the truth.

**The design rule: return the value together with its provenance, or expose the
discriminator.** A `get()` that answers "what is the value" while refusing "was
this chosen or defaulted" has moved its own ambiguity into every caller, and each
caller pays for it separately and invisibly. The same reasoning is why
[`validators-must-recompute-not-just-record`](../../../rules/validators-must-recompute-not-just-record.md)
prefers a computed answer to a stored one, and why
[`generator-first-mindset`](../../../rules/generator-first-mindset.md) fixes the
generator rather than its output.

## Falsifier

If a seat with this pattern loaded still pays an instance whose shape is
enumerated above, the class has outrun passive capture and wants an action-time
mechanism rather than another written cure (route via
[PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md)).
The estate's own evidence already leans that way: several of the nine shapes
recurred **at seats holding the note**, which is
[`passive-guidance-loses-to-artefact-gravity`](passive-guidance-loses-to-artefact-gravity.md)
firing on this exact class.

## Related

- [`observation-that-does-not-bear-on-the-claim`](observation-that-does-not-bear-on-the-claim.md)
  — the sibling failure in the step from output to claim; shape 3 above is shared
  between them.
- [`verify-dont-trust`](../../../rules/verify-dont-trust.md) — the action-moment
  rule surface, including § Name the Instrument and § Claims Crossing Boundaries.
- [`wrapped-exit-codes-false-green`](wrapped-exit-codes-false-green.md) — the
  same substitution on a command's exit status.
