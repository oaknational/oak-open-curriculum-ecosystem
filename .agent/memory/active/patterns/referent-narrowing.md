---
name: Referent Narrowing
polarity: anti-pattern
use_this_when: "Constructing ANY filter, gate, predicate, monitor, or verdict that keys on an instrument's signal (an exit code, an API status, a state field, a green check); and at any decision moment resting on a SINGLE source — before acting, name what the signal actually reports on and add one independent witness"
category: process
status: emerging
discovered: 2026-07-26
proven_in: >-
  Merge-monitor seat, 2026-07-26, twelve instances in ninety minutes, evenly
  split between catches and misses (full capture: napkin ~12:40Z entry, Aurora
  turns Gravity). The shape every time: an instrument returned a WELL-FORMED,
  TRUTHFUL answer about a narrower referent than the reader assumed, and the
  narrowing was silent. Exemplars: mergeStateStatus BEHIND reports behind-ness
  as PRIMARY blocker, not behind-ness (a babysitter filter would have stayed
  silent forever on the exact PR it was built for); HTTP 200 on a reviewers
  write reports request-well-formed, not state-changed (unrecognised reviewer
  names are silently ignored, twice); an installation-level permission grant
  reports the installation, not the token (mint-time scoping made a correct
  grant change nothing); "settled = review approved" waits forever on a gate
  the rulesets never ask for (required_approving_review_count: 0 everywhere);
  echo EXIT:$? after a pipe reports the LAST stage — an instance committed
  while HOLDING the rule that forbids it; lint exit 0 carries 331 warnings; a
  ruleset's review_on_push: true declares intent, not delivery (the service
  missed one PR in a window where its sibling got two reviews); "addressed"
  is not "resolved" (server counts threads, not fixes); a fixed finding
  anchored to a different file reads CURRENT forever; a monitor snapshot is
  truthful about SNAPSHOT time, silent about staleness; a dead monitor and a
  quiet one are the same observation.
proven_date: 2026-07-26
adjacent: >-
  description-is-not-a-check.md and frozen-text-false-authority.md are both
  CHILDREN of this shape specialised to stored text (a description reports
  what-was-written-about-X, not X; frozen text reports what-held-at-write-time,
  not what-holds) — this pattern covers LIVE instrument signals, where no
  stored text exists to blame. The estate's incident-level rules for specific
  instances: exit-codes-in-band-never-piped, verify-dont-trust,
  read-verdicts-by-name-never-column-parse,
  validators-must-recompute-not-just-record,
  stale-capture-wins-silent-merge-reverts, the Sonar dropped-trigger cure,
  PDR-133's liveness classes.
---

# Referent Narrowing

An instrument answers a NARROWER question than the one you asked, truthfully,
and says nothing about the difference. `EXIT:0` after a pipe truthfully reports
the last stage. `BEHIND` truthfully reports the primary blocker. HTTP 200
truthfully reports request acceptance. A green lint gate truthfully reports
zero errors. Every one of these is a correct answer — to the wrong question —
and the gap between the asked and the answered referent is exactly where false
greens live.

## Why incident rules did not stop it

At the moment this class's twelfth instance was committed, the estate already
carried ~8 rules that are instances of the shape — and the author of the
defective filter held them. They are indexed by INCIDENT (pipes, Sonar,
column-parsing), so nothing in the reaching-space fires when you are writing a
*new* predicate against a *new* signal. A ninth incident rule does not fix a
retrievability problem; naming the shape is the attempt. Falsifier for this
pattern: a future session builds a proxy-keyed filter or single-source verdict
AFTER this pattern exists and still ships the defect — that is
recurrence-despite-home (PDR-098) evidence that the cure needs a mechanical
gate, not a corpus entry.

## The two moves

1. **The construction-time question.** Before keying anything on a signal, ask:
   *"What exactly does this signal report on — and under what condition does
   that stop being the thing I care about?"* If you cannot answer from the
   source's own documentation or a probe, you do not know what you built.
2. **One independent witness per load-bearing claim.** Every catch in the
   proving session was the same cheap move: compare the instrument against a
   mechanically INDEPENDENT witness — one that cannot fail the same way
   (push exit code vs remote ref position; peer's "resolved" vs the server's
   thread count; sibling-PR timing vs this PR's silence; installation grant vs
   mint source). Every miss was a single source. This is not "check harder";
   redundant checks of the same source share its narrowing.

## The asymmetry that prices the risk

A false RED is self-correcting — someone investigates and kills it. A false
GREEN is not — it is believed and built upon. Instruments are mostly not
designed around that asymmetry, so the burden falls on the reader: spend the
independent witness on the claims whose false-green cost is high (a gate
passing, a merge "done", a permission "granted"), and accept single-source
reads where a false green merely wastes a retry.

## The transmitting dual

This pattern governs READING instruments. Its dual — what you owe when a
claim of yours is about to be consumed by another context — is
`verify-dont-trust` §"Claims Crossing Boundaries Carry Their Derivation"
(three-question transmission gate, scope/frame/rung carriage,
change-at-a-distance). The two compose: transmitters carry derivation
because receivers cannot re-derive; receivers keep the independent witness
because transmitters do not always carry it.

## Post-graduation record (2026-07-30 dedicated pass)

The §falsifier above FIRED: instances continued after this pattern landed
(a Director re-committed the piped-exit trap while holding the rule; a seat
retried an ambiguous write without reading state fifteen hours into a long
day; a rule paraphrase was obeyed as the rule). Honest reading, from the
same corpus: capture buys **recognition speed, not immunity** — later bites
cost seconds-to-minutes and were mostly self-caught where earlier ones cost
hours and were owner-caught. Both facts route together: the mechanical-gate
question is live at the PDR-098 lane (a hook guard for the piped-exit
signature is ticketed, MCP-358; the retrievability question — rules indexed
by incident are unreachable at construction time — is recurrence evidence
for the action-time structural-interrupt design space). Additional named
faces collected since graduation: manufactured absence (the absence you see
is usually your instrument — head-truncation, matched-nothing filters,
wrong-field projections); zero-match false-greens (a probe must prove it
SAW something before its silence means anything); always-succeeding
controls (ask what the instrument does on invalid input before using its
success as evidence); projection blindness (verify the instrument's input
domain matches the object you certify); coverage denominators taken from a
paged view; instruments that diff lines containing their own clocks.
