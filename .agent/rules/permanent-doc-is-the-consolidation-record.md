# The Permanent Doc Is the Consolidation Record

Operationalises PDR-011 (capture → distil → graduate → enforce; the permanent
home is the endpoint, the buffer just empties) and generalises
[`collaboration-is-value-contingent`](collaboration-is-value-contingent.md) from
collaboration to knowledge-recording. Graduates the standing owner principle
captured in auto-memory `feedback_no_provenance_pointers`.

## The principle

When consolidation or curation homes a piece of knowledge, **the permanent
documentation it landed in, plus the git commit (message and diff), ARE the
record that the consolidation took place.** The value is the impact — the
knowledge now in its durable home and the behaviour it changes. The *accounting*
of having done the work is not valuable and must not be created.

This is value-contingent recording: a record earns its place only by the value
it provides, never by documenting that work happened. Mandated or
habitual record-keeping is ceremony — it feels productive while delivering
nothing a consumer needs.

## Rejected forms — all the same anti-pattern re-skinned

Do **not** create, append to, or accumulate any of these:

- **Disposition ledgers** — a file enumerating "item X graduated to Y, item Z was
  duplicate". The home Y is the record; the ledger restates it as accounting.
- **Closeout narratives / closeout proof** — "I ran a pass and here is what I
  dispositioned, with before/after counts". The commits are the proof.
- **Consolidation-status logs** — an accumulating section (for example a
  "Deep Consolidation Status" running list of past closeouts). Endless links
  accumulate; none is read for value.
- **Provenance pointers** — tombstones, "moved verbatim to X", "see ledger Y",
  "GRADUATED → home", "(N graduated, see …)" count-line citations. The commit and
  the home are the provenance (`feedback_no_provenance_pointers`).

A single **functional** navigation reference is not accounting: a fresh napkin
noting "prior capture in archive/" so it is findable, an ADR index entry, a
cross-reference a reader follows to use the content. The test is whether a
consumer reads it to do work (functional) or whether it merely records that work
happened (accounting).

## Trigger

About to write a curation ledger, a closeout summary with item dispositions or
before/after counts, an entry in a consolidation-status log, or any provenance
pointer for a graduated/removed item — or reading a skill or plan instruction
that mandates one.

## Action

1. Do the curation: verify the substance is live in its permanent home, then
   leave the buffer cleanly (smaller). The permanent doc + the commit are the
   record; write nothing else.
2. A skill or plan instruction that says "cite a durable disposition ledger",
   "record before/after counts", or "leave a provenance pointer" **is itself the
   anti-pattern; the instruction is not license.** Honour the curation, drop the
   accounting.
3. Report the work to the owner as value and impact — what was homed and what
   changed — not as an accounting of dispositions.

## Why a rule, not a clause

The owner has corrected this repeatedly ("many times") and it "keeps turning up
in various guises". It lived only in auto-memory (`feedback_no_provenance_pointers`,
`feedback_useful_work_over_ceremony`), which is passive — under the gravity of
skill instructions that mandate ledgers and closeout proof, the guidance did not
fire (the
[`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
failure). The rule corpus is the active behavioural-modifier layer; this rule is
that layer, and it stands against the skill instructions that generate the
ceremony.

## Related surfaces

- [`collaboration-is-value-contingent`](collaboration-is-value-contingent.md) —
  the same generator (value-contingent, anti-ceremony) for collaboration
  functionality.
- [`knowledge-preservation-over-fitness-warnings`](knowledge-preservation-over-fitness-warnings.md)
  — preserve the substance; this rule says do not also account for having
  preserved it.
- `consolidate-docs` and `consolidate-until-done` skills — reconciled to stop
  mandating ledgers, closeout proof, and provenance discipline; they defer to
  this rule.

## Enforcement

Behavioural at every consolidation/curation closeout. The check: *am I about to
write something whose only job is to record that work happened?* If yes, delete
it; the permanent doc and the commit already are the record.
