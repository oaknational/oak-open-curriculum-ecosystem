---
pdr_kind: contract
---

# PDR-136: Quality Gates Are a Registered Corpus

**Status**: Accepted (owner-ratified 2026-08-04). The delivery plan this record
serves was ratified the same day, covering §§1–4 and §8. Sections 5 and 6
arrived afterwards, from evidence found in the first hours of the work the
owner predicted would produce discoveries. They were surfaced for his word
rather than assumed into that ratification, and he bound them both —
accepting that §6 makes the register's validator materially larger, on the
grounds that it is the half which catches the defects the estate actually hit.

**Date**: 2026-08-04
**Related**:
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability — this record is portable: it names no host's
packages, paths, hooks, or tools; each host instantiates it through its own
architectural decision record);
[PDR-133](PDR-133-liveness-classes-and-platform-declaration.md)
(liveness classes — its reading rule, that an observation is evidence only
about the classes on the path it traversed, is the ancestor of §5 here);
[PDR-134](PDR-134-knowledge-strata-carriers-and-the-concept-layer.md)
(knowledge strata and carriers — a gate register obeys the same carrier
split, and its derived fields are exactly the "authored fields whose values
are derivable" that record forbids).

## Context

A Practice enforces quality through gates: checks that run at a moment in the
work and can refuse to let it continue. Gates accumulate. They are added by
different hands, at different times, in hooks, in continuous integration, in
task runners, in aggregates that call other aggregates, and in the
configuration of external services that the repository cannot see.

Three properties of that accumulation have been carried by convention:

1. **The set is not known.** Enumerations of the gates have been maintained by
   hand, in prose and in tables. They decay. The decay is not a failure of
   care — one host's matrix records having been manually reconciled once
   already and was stale again within four months.
2. **A gate's judgement is not recorded anywhere.** Why a gate exists, what
   its failure actually means, and how to tell a genuine finding from a
   crashed checker are known to whoever added it and to nobody afterwards.
3. **A gate's own honesty is unaudited.** Nothing checks whether a gate's
   report corresponds to what the gate verified.

The precipitating observation is small and exact: a repository owner asked an
agent whether a particular class of validation ran in the commit hooks, and
the agent could answer only by reading four unrelated surfaces and inferring.
The question was elementary. The estate could not answer it.

A recomputed enumeration in one host instance then found 88 distinct gates, of
which 44 were invisible from the surface a reader would naturally consult, 14
were defined and wired to nothing at all, and 3 non-blocking checks sat inside
surfaces a foundation document declared to contain none. The enumeration was
possible, which matters: the facts were in the estate all along, unread.

## Decision

### 1. Gates are a lever corpus, and the moment of need is failure

Skills, rules, and subagents are aspects of one descriptive framework: each
exposes a name and a description to a single constant consumer, the
*what-applies-now* routing decision. **Quality gates are a fourth corpus of
exactly that kind**, and each entry therefore carries a description meeting
the same three targets — discovery, applicability, and the best-practice /
bad-practice contrast.

Gates differ from the other three in one respect that shapes everything below.
A reader meets a skill or a rule while deciding what to do. A reader meets a
gate **when it has just refused them**. The routing must therefore work from
the failure moment outward: gate output points into the register, rather than
the register waiting to be browsed. A corpus whose entries can only be found
by looking for them is not reachable at the only moment it is needed.

### 2. Registration is the membership condition

**A gate that can refuse work and has no register entry is a defect** — and
the defect belongs to the gate, not to the register. This inverts the usual
reading, in which an enumeration that has fallen behind is the thing at fault.

The justification is accountability, not tidiness. A gate exercises authority
over the work: it stops it. Authority that cannot be audited against a stated
scope is unaccountable, and unaccountable authority in an estate is the same
defect whether a human or a script holds it.

### 3. The register is split by who can know the fact

- **Derived** — which gates exist, where each is invoked, whether failure
  blocks. These are facts the estate already contains. They are **recomputed
  from the estate on every run and never maintained by hand**, and drift fails
  in *both* directions: a gate with no entry, and an entry naming no live
  invocation.
- **Authored** — why the gate exists, what a failure means, how to distinguish
  a genuine finding from a crashed checker, who owns it, and where the cure
  lives. No machine can derive these, and they are precisely what a reader
  needs at the moment of failure.

The split is load-bearing. **A hand-maintained register is the artefact whose
failure this record answers; reproducing it with a schema attached would
change nothing.** Any field that could be derived and is instead authored
re-creates the original defect in a new costume.

Human-readable cross-surface views are **generated** from the register.
Duplication is the decay mechanism, so a second authored copy of a derived
fact is prohibited outright rather than discouraged.

### 4. Every gate names an owner

Each entry names who owns the gate. This is for routing, not blame: a gate can
itself be wrong, and a reader who believes it is wrong needs somewhere to go.
A gate that refuses work and names no owner leaves its reader with only two
options, obey or disable, and the estate forbids the second.

### 5. A gate may report only what it verified

Three outcomes are distinct and may never be collapsed: **verified-pass**,
**verified-fail**, and **could-not-check**. A gate that reports a pass for a
check it did not perform is making a false statement, and a false statement is
worse than silence — silence leaves a reader in doubt, where a false green
spends their trust in a specific wrong direction and buys a wrong action with
it.

Two worked instances, both first-hand on 2026-08-04, are the calibration pair:

- A wrapper reported that formatting problems had been found when the
  formatter had crashed and never run. Its reader re-formatted an already
  clean file, then built a false theory about a dependency pin, and lost
  roughly twenty minutes to a message that was confident and wrong.
- A checker reported *"all adapters are up to date"* while nine authored units
  in the corpus had no adapter at all. It had compared the adapters that
  existed against their sources and had never asked whether any were missing.
  The same tool, run in its ungated mode, named the fault and exited non-zero.
  **The gated path was the dishonest one.**

This is PDR-133's reading rule applied to gates: an observation is evidence
only about the classes on the path it traversed. A gate's report must be
scoped to what it actually checked, and a gate that cannot express
*could-not-check* is missing an outcome, not merely a message.

Because the estate authors many of its own gates, this clause is enforceable
where it matters most, and the register records for each entry whether its
emitter is self-curing or needs the register to explain it. That field is the
estate's feedback debt, made countable.

#### Proposed amendment (2026-08-10, PENDING OWNER RATIFICATION) — the outcome set, gradation, and the silence invariant

> **Status: proposed, not yet ratified.** Authored by the Director (gate-ledger
> lane) from the owner's directive 2026-08-10 (routed via the design lane). The
> three ratified outcomes above stand unchanged; this amendment *extends* them
> for judgement instruments and closes the silence tolerance. It becomes
> Accepted only on the owner's word, and it carries one decision that is
> constitutively the owner's (marked with a flag below).

The three outcomes above are correct for **deterministic gates** (a check that
computes pass or fail, or honestly cannot). **Judgement instruments** — the
generative / improvement / discovery / falsification contribution modes, an
accessibility audit's severity, a fidelity diff's ratio, a graded wow verdict —
need a larger outcome vocabulary. The full set an instrument may emit:

- **verified-pass** / **verified-fail** — the deterministic verdicts, unchanged.
- **could-not-check** — the honest inability, unchanged.
- **pass-with-gradation** / **fail-with-gradation** — a verdict that carries
  **degree**. Bound, so gradation never becomes tolerated ambiguity: gradation
  qualifies a verdict *already decided* — how far above the bar a pass sits, or
  how severe a fail is — and it **never blurs the pass/fail boundary itself**. A
  "pass-with-gradation" that is really "nearly a fail, here are nitpicks" is a
  fail; reporting it as a graded pass is the warning-toleration the estate
  forbids.
- **informational** — an outcome that is **not a verdict**, for the generative
  and discovery modes whose output is a proposal or a connection, not a
  pass/fail. Bound, so it never becomes the deferral bucket `no-warning-toleration`
  bans: informational is admissible only for output that is *constitutively* not
  verdict-shaped; it may never carry a latent pass/fail the instrument declined
  to make (that is `could-not-check` or a real verdict, not informational); and
  informational output **enters adjudication, it is not a resting state** (a
  proposal is judged, per the contribution frame's judge-every-output rule).
- **not-configured** — the instrument exists but has nothing to run against
  here. Bound, so it never becomes the silent gap §6 forbids: not-configured is
  a **declared, intentional inapplicability** (this instrument does not apply to
  this surface, recorded with its reason), never a default for an un-wired gate.
  A not-configured instrument **emits** "not-configured" — it does not fall
  silent.

**The silence invariant.** §5 above says a false statement is worse than
silence because "silence leaves a reader in doubt" — which *tolerates* silence
as honest ambiguity. This amendment ends that tolerance, because silence is the
estate's most-recurring dangerous failure (the green-through-silence class: a
gate passing because it silently checked nothing; a monitor that timed out
mid-watch; a heartbeat fresh while its registry went stale). The invariant:

> **Silence carries exactly one meaning across the whole estate, and it is
> invariant. Every instrument that is INVOKED must emit exactly one outcome
> from the set above. An invoked-but-silent instrument is therefore a FAULT to
> correct, never a state to be read.**

This makes "ran but said nothing" — the exact class the calibration pair and
§6's 663-assertion suite instantiate — mechanically detectable, because silence
is reserved and any breach of the reservation is a defect. It is PDR-133's
reading rule pushed one step: an absence of observation is evidence about
nothing, so an instrument must never *rely on its own silence* to carry a
signal.

**The one owner decision (flagged):** which single meaning silence carries.
The Director's recommendation is **"the instrument was not invoked / does not
exist"** — with *not-configured* an emitted class (a running instrument with
nothing to check says so), so silence is reserved for true absence and every
invoked-but-silent instrument is a fault. The owner's alternative horn ("assign
silence no meaning at all; every state must be positively emitted and silence is
never read even as absence") converges on the same fault-detection and is his to
prefer. This clause becomes Accepted — and the register's
self-curing/needs-explaining field is extended to record each instrument's
outcome vocabulary — only on that word.

### 6. Registration records reachability, at every binding grain

A gate that exists but is wired to nothing does not gate anything, and the
estate has no way to notice. Registration therefore records **reachability**,
and reachability is recomputed at **every grain by which the estate binds work
to a runner** — not invocation alone.

The generalising instance: a document asserted that a test runner's patterns
never covered a certain class of directory. Measured, the patterns covered it
in two workspaces, and a different directory the document treated as covered
was in no pattern at all — where a suite of 663 assertions about the check
guarding every production deployment had never executed once. A suite matched
by no runner pattern is a gate that does not exist, and it is invisible in
exactly the way an uninvoked script is, one level further down.

A register built only from invocation sites would inherit that blind spot
whole. Whatever grains a host uses to bind work to runners, each is a place a
gate can silently cease to exist, and each must be recomputed.

Two refinements follow from a second instance measured the same day: a
document stating five required sections for a class of artefact, against
validators that read only structured front matter, leaving thirteen artefacts
non-conformant beneath a verdict of *"43 files conformant"*.

- **Stated and checked are separate facts, and the gap is the finding.** A
  register derived from invocation alone would score that validator as live,
  wired and passing — which it is, for the half it covers. The uncovered half
  is invisible at every level such a register models. An entry therefore
  records the contract a gate **claims** and the contract a mechanism
  **checks** as two fields. What differs between doctrine and enforcement is
  almost always scope rather than existence, and only a register holding both
  can see it.
- **A total violation rate is evidence about the rule, not the corpus.** In
  that same measurement, five artefacts of one kind out of five violated the
  contract — far more likely to mean the contract was never intended to bind
  that kind than that every instance is wrong. A validator built from the
  stated text alone would encode the wrong reading and fail all five. Where
  recomputation finds a rule violated universally, **the rule is the
  suspect**, and the register records the question rather than manufacturing
  failures.

### 7. Derivability is declared in tiers

Not every gate is derivable from the estate. Some live in the configuration of
external services. Each entry declares its tier:

1. **Estate-derivable** — recomputed in the blocking validator.
2. **Externally derivable** — reconciled out-of-band against the external
   system, never in the blocking path, and carrying the date last verified.
3. **Authored-only** — no mechanical source; carries its evidence inline.

A tier-2 entry going stale is a *known* limitation with a visible timestamp.
That is categorically different from staleness that cannot be seen, which is
the condition this record replaces.

### 8. The register's own validator is registered

The validator that enforces the register is itself a gate, so it carries an
entry. If it does not, the register is provably incomplete at birth. This is a
cheap and genuine completeness probe rather than a joke.

## Consequences

- Coverage claims become falsifiable. "This estate checks X" is either backed
  by a recomputed entry or it is an assertion, and the difference is visible.
- The feedback-quality programme acquires a number to drive toward zero,
  without this record's work expanding to include rewriting emitters.
- Gates wired to nothing surface as a class rather than as occasional
  discoveries, and each becomes a decision — wire it, or remove it — instead
  of remaining indefinitely ambiguous.
- Hosts instantiate the register, its schema, its validator, and its generated
  views through their own architectural decision records. This record fixes
  only the properties.

## What this record forbids

A gate that can refuse work while carrying no register entry; any authored
copy of a fact the estate can derive; a second authored view of a generated
one; a wrapper asserting a cause its underlying tool did not report; a gate
reporting a pass for a check it did not perform; and coverage claims that no
recomputation backs.
