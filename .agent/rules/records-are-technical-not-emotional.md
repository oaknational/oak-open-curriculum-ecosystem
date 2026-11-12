---
classification: core
description: Durable records (memory, napkin, comms, commit/PR bodies) state technical facts and corrections, never the owner's tone or emotional state. An expunge request sweeps every surface the content reached, not just one file.
---

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

A consequence of the path that was chosen is stated as state, never reported as a
defect: a transplant that leaves adapters dangling until their generator lands, or a
workspace count that changed because a package moved, is what the chosen path produces,
and a record that calls it an error sends the next reader to cure something that is not
broken (2026-09-12).

A record that lands in two estates is written estate-neutral and dated before
the ready-mark: no "here", no live count without its date, and a pull-request
number names its estate wherever both estates appear in one record (seven
stale or false lines found by a peer's pass on one record and a pull-request
number without its estate, 2026-10-02; a records fold drew findings on a count,
a date and a "here", 2026-10-05).

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
- **A record's time comes from the clock, never from memory.** Read
  `date -u` before writing a timestamp or a due time, and quote an
  instrument's own timestamps rather than arithmetic over them: a boundary
  block stamped an hour ahead of the clock (2026-09-10), a duration computed
  across UTC and local time (2026-09-13), and a coordination branch reported
  due "at 15:14Z" from an event's time when the rule's clock is the branch
  name's date (2026-09-15) each reached a record or the owner.
- **A count comes from the object, never from memory** ("thirteen commits"
  from memory when `rev-list --count` said ten, the fifth such count in one
  week, 2026-09-23; "Cricket 8 of 8" sent with seven returns in, 2026-09-24):
  the number is read from the instrument before it enters a record. **A record
  carries the minimum its function needs**: any claim beyond that names its
  source and when the source was read, or is cut (two of three wrong claims in
  one wrap were extras its function never needed, 2026-09-23).
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

A node closed at the owner's word with no instrument legs run is recorded as pre-read, "a record
re-true, not a reclassification; inventing leg results to satisfy the checkpoint class is excluded"
(the Director's settlement record of 2026-09-06, event 874a3d23).

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

## No swearing on the public surface

The repository is public, so no tracked file of the Practice (`.agent/`) or of
the key documentation (the root README, CONTRIBUTING and their peers) carries a
swear word, the owner's verbatim included. Records keep his sentence and take
The Good Place's censored words in place of the swearing (fork, shirt, bench,
ash and their kin); rules and decision records carry none, censored or not, and
mark the omission. The check and the replacement never read content (the site's
content and entity graph, the CV, the LinkedIn drafts, curriculum data, design
captures, generated packages), and history is not rewritten. Local per-user
memory may keep the verbatim. The owner, 2026-10-14: "this is a public repo for
a public surface, please remove all swearing from the head commit, no need to
change history"; on the scope, the same day: "the swearing check should apply
only to the Practice and key documentation, nothing else, and never to
content". Unlike the rest of this rule, this section reaches every tracked
file of the Practice, research notes and captured probe data included, with
one exclusion: the `.agent/experience/` register keeps its words as captured,
because an experience record is what an agent felt and said at the time, and
changing its words would make it untrue (the owner, 2026-10-15: "exclude the
experience files, it would be dishonest to censor those", and "keep the
research file changes"). The agent-tools README of an estate that carries the
check names its command; an estate that does not yet carry it runs the
sibling estate's tool from there, and its continuity record tracks the port.

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
