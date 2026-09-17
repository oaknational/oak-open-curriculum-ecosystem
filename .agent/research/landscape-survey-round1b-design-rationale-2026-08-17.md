# Landscape survey — round 1b design rationale

Why round 1b is shaped the way it is, decision by decision — including
the designs we considered and rejected, because the rejected roads
carry as much information as the taken ones. Companion documents: the
walker-visible texts (`landscape-survey-round1b-briefs-2026-08-17.md`),
the operational spec
(`landscape-survey-round1b-fleet-design-2026-08-17.md`), and the 1a
lessons record (`fleet-design-lessons-2026-08-17.md`, which carries the
owner rulings verbatim).

## 1. Decisions taken, and why

### 1.1 Per-tier unseeded baselines (14 seats — a third of the fleet)

1a gave every walker a constraint, so "convergence despite constraints"
could not distinguish a weak constraint from a strong attractor, and
40/46 walkers ran on one model, so the dominant shape might be one
model's prior. The baselines are the control 1a lacked: each tier's raw
fingerprint, measured before any seed deflects it. Spending a third of
the fleet on controls is deliberate — without them, NOTHING else in 1b
is interpretable, because every seeded result needs a
deflection-from-what answer.

### 1.2 Constraint grades that forbid the dominant carrier

The 1a dominant shape spends directory structure freely (role/tier
directory family). All three haiku constraint grades restrict
directory-borne classification — mildly (one directory-carried
classification), moderately (depth ≤ 1 + machine-checkable rules), or
severely (no classificatory directories at all, generated artefacts out
of VCS). This is the challenge mechanism, not arbitrary variety: if
5-6 near-orthogonal classifications keep appearing even where their
habitual carrier is BANNED, the classification count is probably
territory; if the count collapses with the carrier, the 1a mode was
partly a layout habit.

### 1.3 Tier-matched seeding (the persona-uptake gradient)

Owner ruling, verbatim-anchored in the lessons record: "I don't think
persona works for Haiku, only differently stringent constraints to give
different perspectives... Sonnet needs constraints but can take a
little persona, Opus more persona, Fable a lot of persona." 1a's data
is the evidence: 41% of walkers converged on one design shape
regardless of persona — small models wear a persona as a costume; the
knob that actually moves them is constraint stringency.

### 1.4 A falsification arm instead of a defence

The owner's frame correction governs: the survey exists because the
prior target architecture was WRONG, and instruments that ask "is the
settled decision right?" reproduce their anchors. So 1b never asks
anyone to evaluate walker 35's design in the round's free arms — the
only seats that see it are four adversaries briefed to break it and
then beat it. The elite gets exactly one role: a point to attack. Its
fix-designs re-enter the corpus as ordinary candidates tagged
`origin=falsifier`.

### 1.5 Two independent reducers plus a comparator

1a's archive was reduced once, by one sonnet reducer, deriving one
descriptor set — so the map's coordinate system is partly instrument.
1b reduces twice (opus and fable — both different from 1a's tier),
each blind to the other and to 1a's descriptors, and a comparator
treats every mismatch as a finding about the instrument. If two
independent reducers and the 1a scheme all converge on similar
coordinates, the coordinates are probably in the corpus, not the
reducer.

### 1.6 Prose requirements in three variants differing in concern cardinality

1a's six-item decision-needs list correlated with the walkers' 5-6
classification mode — the instrument likely taught part of the answer
it then measured. The FIRST 1b design here rendered requirements as
prose in two variants differing in VOICE (working-day vs
failure-story) — and the fleet-design review killed it: both variants
carried the same seven concerns in near-identical order, so the test
was built to return a null that would then be read as "no leakage".
The shipped design varies the suspected leak itself: three variants
carrying 3 / 7 / 12 concerns, explicitly balanced 6/6/6 over
grounding-c seats (index-parity assignment was also killed — it
correlated with the arm layout, 13/4/1 in the dry run). Classification
count tracking concern cardinality is now a positive, falsifiable
measurement.

### 1.7 Minimal schema, no self-scores, no trajectory

Both 1a walker failures were small-model schema-retry exhaustion, and
self-scores added grading bias the scorer stage then had to ignore.
The 1b schema is four keys. Scoring is the scorer's job; rubric
escapes travel as free text in `notes`.

### 1.8 The committed instrument

1a's walker-visible texts existed only inside the session-persisted
workflow script; reconstructing the probe texts for 1b required
consensus mining of walker echoes in the archive. Everything a 1b
agent sees is committed before launch: briefs, script, falsifier
packet. An instrument you cannot re-read is an instrument you cannot
challenge.

### 1.9 The codex CLI arms (owner-directed addition, 2026-08-17)

The owner's word, verbatim: "could we also invoke Codex via the
`codex` CLI? A few Sol ultra, many Terra medium? Not instead of but in
addition to?" Shape chosen for the addition:

- **Terra-medium ×12 mirrors the haiku arm exactly** (3 baselines +
  the same 3 constraint grades × 3 groundings). A mirror, not a new
  design, because paired seats are what turn "another vendor ran too"
  into a measurement: the same constraint at the same grounding on two
  vendors isolates the vendor term. Terra starts at the constraint end
  of the uptake gradient — the gradient is measured on OUR tiers, so
  treating it as transferable is an assumption the mirror itself
  tests.
- **Sol-ultra ×3 takes the top-tier seats**: one unseeded baseline
  (the vendor's high-capability fingerprint), one rich-persona walker
  (the cross-vendor test of top-tier persona uptake), one falsifier
  (the strongest attack available on the 1a elite). Few and expensive,
  spent where capability pays: fingerprint, uptake test, adversary.
- **Mechanics**: headless `codex exec`, `-s read-only` sandbox
  (mechanical write prevention — stronger than the native arms'
  honour system), `--output-schema` (CLI-level schema forcing), `-o`
  clean extraction, sonnet-low parser relays with a verbatim-or-named-
  shortfall contract. Probed live before being designed in: terra
  smoke returned a clean schema'd reply; the measured ~19k fixed
  overhead per invocation is priced in the budget.
- **Honest note**: the CLI runs from the repository root, so
  grounding-b/c CLI walkers COULD read the repo; their FORBIDDEN text
  and "must not seek them out" instruction carry the same
  honour-system status as every native tool-holding walker. Reads are
  honour-bound everywhere; only writes are mechanically fenced.

### 1.10 The fleet-design review round (2026-08-17) and what it changed

Per `fleet-design-review-before-expensive-fleets`, the package went to
an assumptions review, a frame-challenger, and a cricket check BEFORE
launch. The frame-challenger's verdict was "do not launch as
designed", with six challenges; five cures were absorbed:

1. **The ADR-041 blindness leak** (its headline, verified first-hand):
   the forbidden list left `docs/` and `README.md` readable, ADR-041
   states the ratified tiered layout verbatim, and README routes
   agents to it — so repo-direct walkers could read the incumbent
   answer, on exactly the tiers whose baseline agreement the attractor
   test measures. Cure: blocklist extended; grounding-a inverted to an
   ALLOWLIST; walkers list every path read. The leak was live in 1a
   too — recorded as a capped alternative explanation for part of the
   dominant basin (capped because 1a's grounding-invariance probe
   showed the dominant shape in facts-sheet and requirements-only
   walkers who could not read the repo at all).
2. **The instrument's own ontology** (task statement + schema DEMAND
   classifications-with-carriers — the 1a dominant mode's shape).
   Cure: the D-free arm — four seats, task statement stripped of the
   ontology demand, schema `{proposal, notes}`, no probes.
3. **No stimulus-side control** ("territory vs prior" missed the third
   pole: industry convention). Cure: the D-decoy arm — four seats,
   same task, a decoy estate where the dominant shape would be
   manifestly wrong.
4. **Falsifiers structurally unable to disconfirm** (schema required
   defects and a fix). Cure: verdict field with "sound" + nullable
   fixDesign; comparator reports basin mass with and without falsifier
   fix-designs; one seat re-briefed to attack the INSTRUMENT itself.
5. **Voice-only leakage variants and emergent variant imbalance**
   (§1.6). Cure: cardinality variants, explicit balanced assignment.

Its strongest economic point is also absorbed as a launch gate: the
mechanical baseline (co-change partition + import-graph partition
computed directly from the measured record, injected as
`origin=mechanical` corpus entries) — the round otherwise spent ~96%
generating and ~4% evaluating against reality.

The assumptions review (same gate, running concurrently) returned NOT
READY with twenty findings; the blocking set was absorbed:

1. **Host-process discipline** on all CLI spawns: the relay contract
   now uses the repo's bounded-spawn shape (`perl -e 'alarm 1800;
   exec @ARGV' --`, macOS having no timeout binary), notes the pid,
   and ends with a process census — bounded, owned, reaped, per
   `no-unbounded-host-load`; CLI concurrency is bounded by the
   workflow's own agent cap.
2. **The deny-list cannot be closed** over ~10,900 files
   (`.agent/plans/` does not match `.agent/plans-backlog-2026-07/`,
   and it found six more sibling classes): the FORBIDDEN list now bans
   whole classes — every dot-directory, `docs/`, `research/`, every
   Markdown file — and all non-repo-grounded seats carry an explicit
   READ-NOTHING seal.
3. **The read cap priced the wrong unit**: one full tracked-path
   listing is ~800k characters (~204k tokens) and registers zero
   "files read" — the likely 1a overshoot mechanism. The grounding now
   caps listings/searches at 5 alongside the 30 file reads, and both
   counts are self-reported.
4. **A seat that could not succeed**: the CLI falsifier's relay schema
   could not express a falsifier result (its outcome branch carried
   the walker shape); cured by parameterising the relay envelope over
   the inner schema. The falsifier packet is now INLINED at build time
   so no falsifier holds repository access at all — which also closes
   the leak where a packeted seat could list the directory and find
   the whole 1a archive beside the packet file.
5. **Replication and high-tier coverage** (its two funded upgrades,
   both taken): B2 — a second grounding-b baseline per tier, making
   grounding b the attractor test's balanced headline column at n=2
   (sol n=1, caveated); and grade-3 carrier-ban seats at opus and
   fable, because a ban tested only where the attractor never appears
   proves nothing about the attractor.
6. Smaller absorbed items: falsifier arms inside the arm-health check;
   reducer schema maxItems caps against the oversized-emit class;
   scorer glosses mapping the measured record's unit names to the
   probe worlds (a scorer cannot judge boundary splits over names it
   cannot identify); the relay-failure decision rule and the
   end-to-end both-paths relay smoke as a launch gate; budget
   re-derived (~3.1M, cap 3.25M) and explicitly PRESENTED to the
   owner at the launch-word gate, since the last agreed envelope was
   priced against a 42-seat fleet.

Two of its findings were REJECTED, with reasons on the record:

- *"One rejection loses the entire run's harvest"* (unprotected
  `parallel`; unbound `args`): the Workflow harness contract is
  explicit that a thunk that throws resolves to null and never rejects
  the call, and `args` is a defined script global — the finding
  describes a different runtime. No change.
- *"Rename `organisingRules` to escape the 1a ontology"*: the schema
  IS partly the 1a lens — conceded — but renaming the field mid-design
  buys vocabulary hygiene at the price of cross-round comparability,
  and the question the rename would answer is answered cleanly by the
  D-free arm plus the instrument falsifier. The comparator brief
  instead carries the caveat that classification-count and
  carrier-type agreement between reductions is forced by the schema
  and must never be counted as convergence evidence.

One frame-challenger challenge remains honesty-only: per-tier
attractor claims outside the grounding-b column stay n=1 per cell —
the comparator reports per-observation rows with the non-separability
caveat, and round 2 can replicate exactly the cells that turn out to
matter.

## 2. Roads considered and NOT taken, and why

### 2.1 NOT re-running the 1a fleet under the fixed schema

Considered: re-run all 46 draws with the minimal schema, cured relays,
and read caps, making 1a directly comparable. Rejected: it re-samples
the same seed pool through the same lens at full price and mostly
re-measures what the probes already established (the dominant shape is
grounding-invariant). 1a stands as what it is — a biased but
informative point in instrument space. The comparability we actually
need (probe placements, scorer dimensions) is preserved by keeping
probe identities and scorer schema stable.

### 2.2 NOT reusing the 1a persona and constraint pools

Considered: draw fresh combinations from the same 16-persona ×
12-constraint pool. Rejected: challenge-not-extend. The pool IS part of
the 1a lens; resampling it explores the same neighbourhood. Every 1b
persona and constraint is newly authored, and the haiku arm drops
personas entirely per the owner's gradient ruling.

### 2.3 NOT showing walkers the measured evidence record

Considered: ground walkers in the co-change and clock-rate
measurements (they are honest, independent data). Rejected: the
measurements enter at the SCORER stage only. A walker seeded with the
evidence record designs to the test; the survey's value is designs
that arrive at (or legitimately diverge from) the measured structure
independently. The cold-generation pass proved the anchor-avoidance
mechanism; 1b keeps it.

### 2.4 NOT prescribing perturbation/revision steps (the 1a move kernel)

Considered: keep the "take k revision steps, report the trajectory"
protocol — it is the owner's MCMC framing made concrete. Rejected for
1b specifically: trajectory reporting was schema weight exactly where
1a failed (small tiers), its value in 1a was unproven (endpoints
clustered regardless), and 1b's job is challenger sampling and
baseline fingerprints, not chain dynamics. The move kernel belongs to
round 2 annealing, where the archive's cell structure tells us WHERE
local moves are worth paying for. This is a deferral with a named
return point, not an abandonment.

### 2.5 NOT running a single bigger free-walker fleet

Considered: spend the whole budget on ~60 seeded walkers for maximum
coverage. Rejected: 1a already proved that seeded low-tier walkers
cluster; volume was not the binding constraint — interpretability was.
1b buys controls (baselines), adversaries (falsifiers), and instrument
checks (double reduction) instead of more of what 1a had plenty of.

### 2.6 NOT standing up a NEW vendor lane — and what superseded the first draft of this entry

First draft of this entry rejected "more cross-vendor lanes" on the
premise that only the codex-dialogues MCP lane was stood up. The owner
then directed the codex CLI addition (§1.9) — and the CLI probe showed
the premise was wrong for that path: the CLI was already installed,
authenticated, and headless-capable; standing it up cost one smoke
test. What REMAINS rejected is the original claim's honest core:
building a lane for a vendor with no existing local tooling during
incident-window prep. The lesson the correction carries: "not stood
up" is a probe-able fact, not an assumption to reason from —
`probe-the-deployment-before-planning` applied to vendor lanes.

### 2.7 NOT hard-enforcing the repo-direct read cap

Considered: a tool-level gate counting file reads per walker.
Rejected: no such primitive exists in the Workflow surface today, and
building one now is instrument-building beyond what this run needs
(`consolidate-at-second-consumer`). The cap is in-prompt with
self-reported counts in `notes` — a declared soft limitation. If 1b's
read spend overshoots anyway, that becomes the measured case for
building the gate before round 2.

### 2.8 NOT attacking multiple 1a elites

Considered: falsifier coverage over the top three 1a cells. Rejected:
the dominant basin (19 of 46 walkers) is the anchor risk; the smaller
cells are already diversity, not incumbency. Four adversaries
concentrated on one target produce deep attacks rather than shallow
sweeps. Secondary cells get their challenge implicitly — via reducers
that owe them nothing and fresh walkers free to rediscover or ignore
them.

### 2.9 NOT letting reducers see 1a descriptors (even labelled "prior")

Considered: give reducers the 1a scheme as a starting hypothesis to
refine. Rejected: that is exactly how an instrument's coordinate
system self-perpetuates. The comparator — one seat, downstream —
holds the only join, and a mismatch there is a deliverable, not a
defect.

### 2.10 NOT running the scorer over both reducers' elites

Considered: score X's and Y's elites for symmetry. Rejected: the
scorer exists for 1a comparability (same dimensions over the new
round's map), and one scored map suffices for that; scoring both
doubles cost to answer a question nobody has asked yet. If the
comparator finds X and Y radically disagree, THAT finding — not a
second scoring pass — is what escalates.

### 2.11 NOT making `organisingRules` optional in the main walker schema

The frame-challenger also suggested loosening the MAIN schema
(optional rules, a free-text boundary field). Rejected: the main
schema's stability is what keeps 1a probe-placement and scorer
comparability, and schema weight is the proven small-model failure
mode — loosening it for everyone buys ambiguity everywhere to answer a
question the D-free arm now answers cleanly in four seats.

### 2.12 NOT dropping the 1a probe set from the structured arms

The probe set is the largest block of walker-visible text and is 1a's
verbatim — a named lens risk. Kept anyway: probe placements are the
only cross-round comparable observable, and the D-free arm runs
without probes so the corpus contains both conditions. The instrument
falsifier audits the probe set's minimal-pair structure directly; if
it convicts the probes of teaching the answer, that lands in the
harvest as an instrument finding for round 2.

### 2.13 NOT waiting for the ledger/atoms lanes to converge first

Considered: sequence 1b after MCP-603 and the atoms ratification so
the survey sees a stabler estate description. Rejected: the survey
deliberately describes the estate at the level of measured facts and
neutral probes, which those lanes do not change; and the owner's
sequencing word is explicit — 889, then 1b.

## 3. Honest limitations (what 1b still cannot conclude)

- **Native-tier priors share a vendor.** Haiku/sonnet/opus/fable are
  one model family; a shape all four baselines reach could still be a
  family prior. This was the thinnest-named limitation of the first
  draft (three MCP codex seats); the owner-directed CLI arms (§1.9)
  raise the cross-vendor control to seven baseline seats across two
  invocation paths and two codex tiers. Two-vendor coverage is still
  two vendors — a shape both families share could yet be a
  training-corpus commons rather than territory. Named, accepted,
  priced.
- **The read cap and allowlist are honour-system.** Self-reported path
  lists make violations detectable after the fact, not impossible; a
  walker that reads a forbidden file and does not list it is invisible
  unless its output vocabulary betrays it.
- **Probe texts are reconstructions.** 1a's exact walker-visible probe
  phrasing was not committed; 1b's canonical texts were rebuilt from
  archive echoes and estate knowledge, keeping identities stable. Any
  1a↔1b probe-placement comparison carries that caveat.
- **The falsifier packet is one walker's articulation** of the dominant
  basin — attacking it attacks the basin's strongest expression, not
  every member's variant.
