# Fleet, survey, and concept-space exploration design — lessons from landscape survey round 1a

Date: 2026-08-17. Provenance: the workspace-taxonomy landscape survey
round 1a (46 walkers, archive at
`.agent/reports/workspace-taxonomy-landscape-survey/round-1-raw.json`),
its three data probes, and the owner's design rulings the same hour.
The owner's framing, verbatim: "This is good, we are learning about
survey design, fleet design and concept space exploration design."
These lessons generalise beyond this survey (`survey-method` class);
graduation to a PDR is a candidate once a second campaign exercises
them.

## The persona-uptake gradient (owner ruling, verbatim-anchored)

"I don't think persona works for Haiku, only differently stringent
constraints to give different perspectives... Sonnet needs constraints
but can take a little persona, Opus more persona, Fable a lot of
persona."

Round 1a's data is the worked instance: 41% of walkers converged on
one design shape REGARDLESS of persona — persona vocabulary changed
("Substance Type" vs "UNIT-TYPE" vs "Purpose Class") while the design
tuple did not. Small models wear a persona as a costume over an
unchanged prior; the perspective knob that actually moves them is
CONSTRAINT STRINGENCY. Fleet-design consequence: seed variation must
be tier-matched — constraint grades for the small tiers, persona depth
increasing with capability tier. (This also generalises the cricket
bindings' tier logic: the instrument you can vary depends on the tier
you address.)

## Baseline-then-deflection (the missing control, now standard)

Round 1a gave every walker a constraint, so the natural attractor was
never measured and "convergence despite constraints" conflated
weak-constraint with strong-attractor. Standard shape from here: every
seeded fleet carries an UNSEEDED baseline arm per model tier — the
tier's raw prior fingerprint — and seed effects are measured as
deflection from the tier's own baseline, never against a global
average. Cross-tier baseline agreement is the real attractor test: a
shape that every tier's baseline reaches is territory; a shape only
one tier's baseline reaches is that tier's prior.

## Challenge-not-extend (anti-anchoring for successive rounds)

The owner's requirement, verbatim: 1b "properly challenges 1a, that we
don't get stuck with the 1a lens even though we know it is
incomplete... 1a is an interesting point in the landscape that can
enrich our understanding, but we know it is biased and twisted in ways
that surprised us." Mechanisms adopted:

1. **Generation blindness**: later-round walkers never see earlier
   archives (forbidden-path lists grow to include the survey's own
   report home).
2. **Independent reduction**: each round's archive is reduced FRESH
   (own descriptor derivation) by a DIFFERENT model tier than the
   prior round's reducer; a comparator stage then joins archives and
   treats descriptor mismatch as a finding — if a new round's natural
   cell structure needs different descriptors, the old descriptors
   were partly instrument.
3. **A falsification arm**: the prior round's dominant elite design is
   handed verbatim to a few high-tier challengers whose brief is to
   find what is wrong with it and design the fix — the incumbent is
   used as a POINT to attack, never as a frame the free walkers see.
4. **Rubric blinding with variants**: requirements as prose scenarios,
   no enumerable list (1a's six-item decision-needs list correlates
   with the walkers' 5-6 classification mode — the instrument likely
   taught part of the answer it was measuring); two phrasing variants
   run in parallel so rubric-induced structure is measurable.

## Instrument economics

- **Schema stringency is tier-priced**: both 1a failures were
  small-model StructuredOutput retry exhaustion. Walker schemas stay
  minimal (prose design + a small structured summary); self-scores
  are removed entirely (they add grading bias and schema weight —
  scoring belongs to the scorer stage).
- **Read traffic dominates walker budgets**: 1a cost ~3.2× its
  estimate because repo-grounded walkers' file reads were unpriced.
  Fleet budgets price tool-read tokens explicitly, and repo-grounded
  walkers carry a read cap in-prompt.
- **Cross-vendor relays must be parsers, not transcribers**: 1a's
  codex leg had a native agent restructure codex prose (prior
  contamination). The relay pattern from here: the cross-vendor model
  emits a fenced JSON block against a stated shape; the relay
  extracts it verbatim and validates, adding nothing.

## Day-2 lessons (added at the 1b launch, same date — measured, not speculative)

- **Fleet budget estimates run ~2× under, twice measured.** 1a: ~3.5M
  actual vs ≤1.1M estimated (3.2×). 1b: 6.14M measured subagent tokens
  at the first run's end vs the 3.25M cap presented — with read
  traffic and CLI fixed overhead explicitly priced this time. The
  surviving mechanism: estimates price walker OUTPUT plus named
  overheads, while measured totals count per-agent system prompts,
  tool schemas, and essay-length design outputs. From here: derive
  fleet budgets from MEASURED per-agent totals of the nearest prior
  round (the journal carries per-agent usage), and state caps as
  all-tokens-counted numbers.
- **The fleet-design review pays for itself before launch.** Worked
  instance: the 1b panel (~300k tokens) found a verdict-invalidating
  confound — the ADR-041/README blindness leak, on exactly the
  attractor-test axis — plus the missing stimulus-side control, and
  the zero-cost 1a probe then CONFIRMED the leak class (20/46 walkers
  echo ratified-layout vocabulary; 7 sealed walkers echo tier-paths =
  convention-prior evidence). An enumerated deny-list over ~10,900
  files cannot be closed; ban CLASSES and seal non-repo groundings.
- **Workflow `args` can arrive JSON-encoded.** The 1b first run
  silently missed its `extraCorpusEntries` injection because the
  script tested `args?.extraCorpusEntries` on a stringified args.
  Scripts that read `args` normalise first
  (`typeof args === 'string' ? JSON.parse(args) : args`).
- **Quota deaths concentrate at the synthesis tail, and the
  archive-per-round + resume design absorbs them.** The 1b first run
  lost 4 of 75 agents to an Anthropic session-quota wall — both
  reducers among them — and the resume replayed 71 agents from cache
  for a ~0.5M completion cost. Single-point synthesis stages are the
  natural quota casualties; keep them last, cheap to re-run, and
  behind a committed corpus.
- **Mechanical partitions need confound surgery before they mean
  anything.** First co-change pass fused the estate into one blob:
  estate-wide sweep commits manufacture pairwise co-change, and
  coordination surfaces ride along with every lane's commits. Cures:
  exclude sweeps (>5 subjects per commit), restrict the universe to
  code subjects, and separate high-in-degree substrate before
  clustering imports. After surgery the two independent measurements
  cross-confirmed one real community (the graph stack) that today's
  layout splits.
- **Corpus-test a monitor's filter AND its cursor before trusting it**
  (the watcher rule's own discipline, re-learned live): the first F-75
  peer-liveness poll used flags the CLI does not have (silent
  blindness), and the second diffed on an age column that increments
  every tick (permanent noise). Probe the real output, then diff on
  stable fields only.

## Day-2 lessons, post-completion (1b harvest, same date — measured)

- **No timing dependence — correct by construction (OWNER RULING,
  2026-08-17, verbatim: "nothing we do should ever, ever rely on
  timing or races, we build things so they WORK"; named an important
  principle of fleet mechanics and in general).** The 1b CLI relay
  brief said "call it p.txt" to every codex seat in one shared
  session scratchpad. The full provenance audit measured the harm: 7
  of 28 codex spawns executed a DIFFERENT seat's prompt; one seat
  returned a stale foreign output as its own design (a 73-second
  "terra completion"); one arm died refusing mutated instructions;
  and file writes made via shell heredocs were invisible to the
  Write-event audit, so the measured count is a lower bound. Cures
  are structural, never probabilistic: per-seat directories
  (eliminate the shared resource, don't shrink the window), a task-id
  echoed through the output schema and verified on return (make
  contamination detectable in-band), and unverifiable-provenance
  rows STRUCK from analysis, not down-weighted.
- **The terra "template-lock" reading is WITHDRAWN as unsafe.** The
  identical-designs-across-groundings evidence cannot be
  distinguished from prompt-crossing under the same race that
  produced the byte-identical pair — with crossed spawns measured,
  "different groundings" were not reliably different prompts at spawn
  time. Tier-uptake claims about terra await a collision-free re-run.
- **Probe sets teach the answer unless designed as blind tests.** The
  instrument-falsifier showed every 1b probe named its own
  discriminating dimension, so cross-fleet facet convergence measured
  the prompt; reducer Y independently confirmed the facet dimensions
  did not discriminate. Findings survive only on dimensions the
  instrument did not name (path-load, byte custody,
  boundary-feedback). Future survey probes must be minimal pairs that
  do NOT state their contrast, with an instrument-critique channel in
  the schema (`forcedFit`-style fields that can only blame the
  respondent are one-way error terms).

## What survived 1a as probable signal

Checked against the probes: the dominant shape is grounding-invariant
(repo-direct 9/15, facts-sheet 10/16, requirements-only 8/15 — NOT an
incumbent echo); generated-in-VCS survived almost universally except
where forbidden by constraint; the model-prior question is OPEN (40/46
walkers one model) and is exactly what 1b's tier-split baselines
measure.
