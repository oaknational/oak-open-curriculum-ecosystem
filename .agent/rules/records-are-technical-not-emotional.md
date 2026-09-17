# Records Are Technical, Not Emotional

## Rule

Every durable record an agent writes about the owner or a session's
events — memory files, the napkin, comms events, commit and PR bodies,
thread records — states technical facts and corrections. It never records
the owner's tone, emotional state, or a characterisation of how a
correction was delivered. Describe the mistake and the cure factually
("owner corrected X; cure is Y"), never the owner's affect ("owner was
frustrated"; "owner sharply corrected").

## Records carry their authority honestly

A record's REGISTER encodes its authority, and readers obey the register
(a napkin observation written in the imperative hardened into a cited
"owner ruling" within thirty minutes and stood a peer's monitors down,
2026-07-28). The cure is a pair, and each half alone is insufficient:

- **Author side**: any entry that could be read as a constraint on future
  behaviour carries its SCOPE and EXPIRY in the same sentence ("true of X
  at time T, revisit when Y"). Observations get past tense and a named
  instance; **only owner-ratified doctrine gets the imperative.** When a
  constraint lifts, the correction goes to every surface that carried it
  AND to any seat observed acting on it — a stale entry is not neutralised
  by a newer entry sitting below it.
- **Reader side**: before citing a recorded constraint as authority,
  check WHOSE word it is — provenance of authority, not just of facts.
  A napkin entry is evidence of what one mind concluded at one moment;
  only an owner ruling — quoted, dated, attributable — is authority.
  When a record and your own durable memory disagree, the disagreement
  IS the finding: a seat transmitted an inherited record's contrary
  sentence about a merge gate over its own memory of the owner's ruling
  without reconciling the pair (2026-09-02); read the source before
  repeating either.
- **The register binds WITHIN a paragraph, not only per record.** A
  paragraph headed "owner ruling" accreted four review-derived sentences
  under that heading across cure rounds (PR #886, 2026-08-14) —
  review-channel content wearing owner authority skipped the design
  check. Cure: authority-split inside the paragraph, review-derived
  content labelled as reviewed-at-acceptance. The mechanical check: **an
  owner-attributed clause is a verbatim quote or a marked seat reading —
  nothing between.**
- **A rule that needs repeated shrinking corrections was never
  grounded.** When a constraint contracts correction by correction (a
  full prohibition, then a may-share residue, then coincidence-not-concept,
  then void-from-birth — one identities row, 2026-08-13 → 17), the
  signature says the constraint had no author's word behind it; trace its
  provenance at the FIRST correction, never the fourth. Agent-inscribed
  mechanics acquire rule-force with nobody's word behind them by the same
  route (an amend-as-evolution habit that invalidated published shas four
  times in one evening, 2026-08-17).

Before enacting the irreversible part of any correction, restate the
policy back to its giver first (the three minutes this costs is nothing;
a licence read as a mandate once deleted six weeks of archive inside the
hour, 2026-07-26).

## Evidence and instruction are two registers — never one line

The register discipline above governs *authority*; this one governs *decay*. A
durable artefact usually needs both registers. **The failure is mixing them in
one LINE**, because the instruction half then inherits the evidence half's expiry
date.

- **EVIDENCE** — state the fact, timestamp it, name who observed it, never
  generalise it to now. A historical record whose facts are timestamped is not
  stale when the world moves; it is still exactly true about its moment.
- **INSTRUCTION** — state the test and the branches, never bake in the current
  answer.

**The authoring-time tell:** *will someone ACT on this line, or only KNOW from
it?* If they will act, it must carry the test; if they will only know, a
timestamped fact is right and a test would be noise.

**The actionable form: if a line seems to need both registers, split it into two
lines** — one recording what was observed and when, one telling the reader what
to run now. The attempted hybrid is where the confusion lives.

The corollary for facts that keep going stale: **replace the fact with the TEST
that determines it** (three parts — the test, its PRECONDITIONS, and a branch
table). Faster corrections do not fix a perishable fact; they only move the
staleness window. Worked instance 2026-08-05: a deployment's auth realm moved
five times in three hours; an instruction asserting the realm needed a correction
per transition, and the same instruction rewritten to assert no realm at all
survived the fifth transition with no edit — same document, opposite answer, no
author involved.

Boundary, so the cure is not over-read: this moves the fragility **from the value
to the test**, it does not remove it. A test-and-branch instruction still rots if
the test itself becomes wrong — the discriminator stops discriminating, or the
branch table misses a state. A test is simply a far slower-moving thing than a
value.

## A record is a receipt or a promissory note — never an asset-word between

The sibling decay class for STATUS vocabulary (owner tripwires on "deferral"
and "banked" in one morning, 2026-08-06): status words that convert an open
obligation into a closed-sounding state. The write-time concept gate
enumerates words; the class is the MOVE. The discriminator: a record is a
**RECEIPT** when the value act completed (a posted review report, probe
results, tally rows) and a **PROMISSORY NOTE** when only intent or partial
state was conserved — and a note ages silently while reading as an asset
(worked instances: a mutation canary's "banked evidence" stood in for the
full run it never got; a report "drafted, awaiting read" aged the same way,
both described as assets across a whole day while their value acts remained
undone). The discipline: status vocabulary is either **"conserved — done"**
or **"recorded, unredeemed — next act + holder named"**, nothing between;
and a review disposition discharges when its test-pin LANDS, never when
adopted in prose.

## When an expunge request fires

If the owner asks for something to be removed from the record, the request
is never satisfied by editing the one file the owner happened to be looking
at. **Sweep every surface the content may have reached** — memory files,
napkin, comms events, commit and PR bodies — and confirm the sweep is
complete before telling the owner it is done. A single-file edit is not
"removed from the record" when the same content was mirrored into other
homes (a common shape: a napkin entry mirrored into a comms event for
untracked-tier visibility, or a lesson copied into both a pattern file and
a distilled entry).

## Scope boundary

This rule governs records **of the owner's state**. It does not reach the
agent's own voluntary `.agent/experience/` register — an agent's own felt
texture about a session is explicitly in scope for that register by design
(`experience/README.md`) and is never trimmed under this rule.

## Why this is strict

A durable record is read by future agents and (in this repo, literally) can
answer questions from PR or memory history. A technical record ages well:
the facts and the cure remain useful regardless of who reads them or when.
A record of someone's emotional state does not age well, is not the agent's
place to characterise, and is exactly the kind of content an expunge request
is likely to target — so keeping records technical from the start avoids
needing the sweep in the first place.

## Related

- [`permanent-doc-is-the-consolidation-record`](permanent-doc-is-the-consolidation-record.md)
  — the commit and the permanent home are the record; this rule constrains
  *what kind* of content that record may carry.
- `.agent/experience/README.md` — the voluntary, explicitly-out-of-scope
  register for the agent's own subjective texture.
