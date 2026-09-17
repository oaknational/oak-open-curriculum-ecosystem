---
title: "Multi-agent review methodology — the #834 assurance round as a worked instance"
author: "Plover lifts Troposphere (b10c37), Director seat"
date: 2026-08-09
status: capture
serves: agent-experience
provenance: >-
  Owner-commissioned write-up (2026-08-09): "we need to learn everything we can
  about the effective use of multi-agent systems." Worked instance is the
  full-work assurance round on PR #834 (identity-switchboard PR-1 / fidelity-review
  tooling). Captures method, results, economics, and the central architectural
  lesson. PDR-014 capture stage — graduation of any clause here to a rule/PDR is
  a separate owner-gated step, flagged in §8.
---

# Multi-agent review methodology — the #834 assurance round

## 1. Why this document exists

The owner commissioned a full-size, multi-model, many-perspective analysis of the
complete PR #834 arc (the identity-switchboard first-pixels work and its
`@oaknational/fidelity-review` tooling), then asked for everything we could learn
about running multi-agent systems well. This report is that capture. It records
the apparatus concretely enough to reproduce, the results honestly enough to
audit, and — the part that matters most — the one lesson that changes how the
estate should *use* expensive multi-agent review going forward.

The headline is counter-intuitive and is the owner's, stated at the review's
close and adopted here as the report's spine: **the greatest value of a wide
multi-agent net is architectural diagnosis, not test coverage.** Everything below
builds to that.

## 2. What was run

Two apparatuses fired at one frozen head (`db980a967`), on one trigger (the lane
owner's push-landed signal), so every leg read the same tree — no moving-target
reviews. The single-head discipline was a deliberate correction of an earlier
same-day failure where a "green" claim rested on a stale snapshot.

### 2a. The fleet (single Workflow, 45 agents, four phases)

```text
Phase 1 — Inventory (haiku ×2, mechanical, no judgment)
  · union file census of the arc (#834 + merged #835), every count-claim checked
  · full review-round inventory incl. suppressed Copilot blocks
  → outputs fed as grounding into the survey legs

Phase 2 — Survey (15 legs across 5 scales + 1 frame-challenger)
  micro:   package correctness (sonnet-high), test quality, security
  app:     hub behavioural equivalence (sonnet-high), switchboard product, a11y+tokens
  arc:     plan-vs-delivery records, review-round audit, #835/#834 seam conservation
  system:  estate fit / cost-of-change (sonnet-high)
  meta:    process dynamics (freeze/resume honesty, loop convergence)
  + opus free-play leg (no assigned lens, seeds as associations)
  + opus frame-challenger (judges the design's frame, not its details)

Phase 3 — Verify (adversarial, both directions)
  · one refuter per contested negative/gap, capped at 18 (overflow reported raw)
  · light check on the top graduation positives before any reaches the rules process

Phase 4 — Complete (opus completeness critic + bounded second wave)
  · critic judges coverage against the commission's own words
  · empowered to launch up to 4 self-contained legs if a modality was missed
```

Tier assignment was deliberate, not uniform: **haiku** for mechanical enumeration,
**sonnet** (medium/high effort by leg) for scoped code review, **opus** for the
frame-challenger, the free-play leg, and the completeness critic — the judgment
seats. Every leg answered through a schema-forced structured-output call, so
returns were validated data, not prose to parse.

### 2b. The Codex trio (three independent reviews, maximum reasoning effort)

Run alongside the fleet, three separate Codex sessions, read-only sandbox,
`model_reasoning_effort: xhigh`, each with a distinct charge:

- **SOL-1 — whole-diff independent review**: the complete change with its own
  judgment, explicitly tasked to find what an assigned-lens structure would miss.
- **SOL-2 — package deep-dive**: export-map/ESM semantics, image-diff arithmetic,
  the orchestrator's teardown paths, schema strictness, third-consumer API shape.
- **SOL-3 — adversarial security**: attack the servers and capture pipeline —
  traversal (incl. attempts to break the win32 cure), SSRF, symlinks, races,
  memory exhaustion, HTML injection, secret leakage.

**Account-tier note (reproducibility fact):** the intended `sol` / `gpt-5.2-codex`
models are rejected on a ChatGPT-account Codex connection ("not supported"). All
three ran on the account default at `xhigh` — the same configuration that produced
the strong #836 review. Genuine Sol is an account-tier question on the Codex side,
not a harness setting.

### 2c. Cost (stated plainly, because the economics are the point of §7)

Fleet: 45 agents, ~5.2M output tokens, ~29 min wall-clock. Codex: 3 sessions at
xhigh, ~2–4 min each of foreground then background. This is a **merge-gate
assurance apparatus for one estate-critical artefact**, not an inner-loop tool.
Proportionality (below) is the whole question.

## 3. Results in aggregate

**Verdict delivered: CURES-NEEDED**, with two mechanical blocks independent of any
judgment (`mergeStateStatus: BLOCKED`; a post-commit Copilot round carrying four
undispositioned *suppressed* findings). The completed cures of the lane's five
prior rounds were verified **sound** (win32 traversal held under attack, HTML- and
argument-injection defended, image-diff arithmetic and the geometry-scale factor
correct, the in-process teardown bracket sound). The *new* surface — the reason the
round mattered — is catalogued in the cure ledger (§6, and in the design plan).

### 3a. Convergence was the trust signal

The findings that mattered were not any single verdict; they were the ones multiple
independent surfaces reached with no contact between them:

| Theme | Surfaces that reached it independently | Confidence |
|---|---|---|
| Evidence integrity (failed/blank capture overwrites canonical evidence; report-only trusts it) | Codex ×3, fleet switchboard leg, fleet second-wave, **the PR's own suppressed R27 comments** | quintuple |
| Cleanup ownership on throw (leaks; unbounded font-wait hangs teardown) | Codex ×3, fleet round-audit | quadruple |
| Dev-server lifecycle semantics unsound (HTTP-probe "released" defeatable; wrong-service capture) | Codex ×3, fleet | quadruple |
| Provenance / geometry mislabelling (report claims a geometry the pixels weren't shot at) | Codex ×2, fleet switchboard leg | triple |
| Boundary strictness (`z.object` strips unknown keys → should be `strictObject`) | Codex SOL-2, R27 suppressed, fleet second-wave | triple |
| fs-target containment escapes (symlink / FIFO through the untracked vendor root) | Codex SOL-3, fleet second-wave (TOCTOU) | double |

Three independent maximum-effort reviews agreeing on the same spine is stronger
evidence than a single opus verdict, and it is the property to design *for*: cheap
diversity of independent attempts, then look for where they land together.

### 3b. The verify pass earned its keep in both directions

Of 21 contested survey findings, the adversarial refuters **confirmed 13 and
refuted 5** (three uncertain/over-cap reported raw). The five refutations were not
noise-trimming — they included three false claims from a single haiku link-sweep
leg ("tooling not ported", "dependency missing", "gitignore missing"), each wrong
on a first-hand diff read. Without the verify pass those three would have polluted
the cure queue. Separately, the top five graduation *positives* were light-checked
before any entered the rules process — verification is not only for bad news.

### 3c. Self-correction was structural, not hoped-for

The completeness critic caught that the fleet's first survey pass had **not read
the review history** the commission named, and launched a bounded second wave. That
wave produced the round's sharpest *process* finding: the exact duplication defect
that later forced the Sonar split had been named by Copilot in a *suppressed*
comment twenty minutes before the gate fired, and no one engaged with it. A fleet
that cannot criticise its own coverage would have shipped that blind spot silently.

## 4. What worked (method lessons)

1. **Multi-model convergence as the trust metric.** Independent, blind, maximum-
   effort attempts that agree are the signal; a lone confident verdict is not. Build
   the apparatus to produce independent attempts and then measure agreement.
2. **Verify both directions, always.** Refute contested negatives *and* check
   positives. The false-finding rate was ~24% of contested items; unverified, those
   become wasted cure cycles or — worse — a graduated pattern built on a mirage.
3. **A completeness critic with real power.** Not a rubber stamp: it read the
   commission's own words back against the coverage and was allowed to spend a
   bounded second wave. This is the difference between "we ran a lot of agents" and
   "we covered the object."
4. **A no-lens seat.** The free-play and frame-challenger legs found what assigned
   lenses structurally cannot: the un-consolidated capture-settle recipe linked to an
   *existing third capture consumer* (the rule-6 screenshot baselines) — a cross-
   surface connection no runtime-scoped leg would reach.
5. **Trigger at a settled head.** One head, one trigger, no moving target. Directly
   cured an earlier same-day failure where a review read stale state.
6. **The standing suppressed-comment rule held.** The R27 round's real findings were
   all in the collapsed block; harvesting them is doctrine here, and it paid off.
7. **Schema-forced structured output.** Every leg returned validated data. No prose
   parsing, no retry-cap surprises, clean aggregation and adjudication.

## 5. What did not work / the honest costs

- **Cheapest tier misapplied.** The haiku link-sweep leg was reliable for mechanical
  enumeration but unreliable for cross-referential first-hand verification — its
  three false findings are the tier-economics lesson: match tier to the *epistemic*
  demand of the leg, not just its apparent mechanicalness.
- **Cost is real and bounded the use case.** ~5.2M tokens plus three xhigh sessions
  for one PR is proportionate *only* because the owner commissioned it for an
  estate-critical instrument at a merge gate. It is categorically not an inner-loop
  reviewer, and §7 argues it should not become one.
- **Latency.** ~30–50 minutes per surface. Fine for a gate, wrong for a tight loop.
- **Tooling limitation surfaced honestly.** The Sol model was unavailable on this
  account tier; the substitution is recorded rather than hidden.

## 6. The central lesson: the net is an architectural diagnostic, not a test substitute

This is the owner's correction, and it is the most important thing in this report.

My initial adjudication framed the gap as a *testing-coverage* gap: the prior
rounds missed the evidence-integrity and lifecycle defects because "the integration
suite uses no real filesystem, sockets, or processes," and so each cure should
"land with the red-proof its class was missing." That framing is subtly but
importantly wrong, and I own the correction.

The right reading: **every finding the net surfaced shares one signature — it is a
behaviour the current architecture cannot prove at the unit level.** The net did not
reveal a shortage of wide-net tests; it revealed, through the *pattern* of what only
a real-fs/real-process probe could catch, exactly where the design had pushed
provability out to the real-world boundary. That difficulty is the measurement of
architectural debt.

The owner's formulation (2026-08-09), adopted:

> Tests that use the filesystem and network have their place — full-system smoke
> tests — but almost everything can be more effectively proven with lower-level
> testing, and if that is hard, that difficulty is typically exposing a weakness in
> the architectural design rather than a lack of wide-net testing.

This composes exactly with existing estate doctrine — *decompose at the tension*,
ADR-078 (dependency injection for testability), "conditional tests are an
architectural-failure symptom," "complex mocks indicate product code needs
refactoring." The #834 findings are decompose-at-the-tension signals wearing the
costume of test-coverage gaps.

Read that way, each finding's cure is an **architecture change that pulls the
invariant down to a unit-provable seam** — after which a cheap deterministic test
guards it forever and the expensive net is never needed to guard it again. Worked,
per theme (full ledger in the design plan):

- **Evidence integrity.** The root is that capture writes and the report path do not
  flow through the `EvidenceIo` seam that already exists for `diffPair`. Cure: a
  first-class capture *manifest* (base/width/scale/pairs/hashes/complete-marker),
  the seam extended over the whole write+read path, staging with atomic promotion,
  and a **pure** `reconcileCohort(manifest, requestedFlags) -> Result<Report, Mixed>`.
  The invariant "report-only refuses a mixed or incomplete cohort" becomes a
  mock-free unit test over in-memory manifests. Only a smoke-tier round touches disk,
  and it proves *wiring*, not the invariant.
- **Capture comparability.** Consolidate the five-line settle into one package
  function; the comparability invariant becomes "every arm calls the one function,"
  enforced by an ESLint boundary rule (structural gate, not a test), with the settle
  sequence itself a single unit over an injected page fake.
- **Lifecycle / cleanup.** A resource-bracket abstraction (acquire → guaranteed
  release) plus a run-wide abort/deadline. Ownership becomes a pure higher-order unit
  test whose fake throws on the use path; the dev-server "released = child exited" a
  pure state machine over an injected handle. The *one* real-process test that
  survives is the sanctioned spawn-topology contract — reserved precisely for where
  no seam below can carry the proof (a real child's signal fidelity), never as the
  primary proof.
- **fs-target containment.** `resolveContainedTarget(root, urlPath, statFn) ->
  Result<RegularFile, Escape>`, pure over an injected stat result — symlink-escape,
  FIFO, and vanish-between-checks all become unit assertions; one real symlink at
  smoke tier proves the wiring.
- **Boundary strictness.** `strictObject` + a Result-typed `resolveBase`: these were
  *always* unit-shaped and simply untested. No net was ever needed here.

The role this leaves for the expensive multi-agent net in a healthy system is
narrow and valuable: an **occasional architectural diagnostic** and a **merge-gate
assurance for the highest-harm, highest-uncertainty artefacts** — never a routine
reviewer, and above all never a license to skip the decomposition work that makes
wide-net review unnecessary. The anti-pattern the correction guards against is
seductive: paying probabilistic, expensive tokens *forever* to re-detect what a
one-time design change plus a free deterministic test would catch on every run. A
team that leans on the net as a substitute for architecture is buying assurance on
the most expensive possible payment plan.

## 7. Proportionality — when to spend a fleet

The lenses resolve shape; proportionality sizes. The sizing rule this instance
suggests:

- **Spend a full net** at a merge gate for an artefact whose *product is trust*
  (an instrument whose output the owner's judgment will rely on), where the harm of
  a silent defect is asymmetric, and where uncertainty is genuine. #834 qualified on
  all three.
- **Do not** spend it as a routine reviewer, in an inner loop, or — the deeper cut
  from §6 — as a standing substitute for making the invariant cheaply provable. If a
  fleet keeps finding the same class, that recurrence is the signal to change the
  architecture, not to schedule the fleet.
- **Match tier to epistemic demand**, not surface mechanicalness: enumeration →
  haiku; scoped code judgment → sonnet; frame / no-lens / meta-criticism → opus;
  deep independent whole-diff and adversarial security → a second model family at max
  effort. Diversity of *model family* is part of the independence that makes
  convergence meaningful.

## 8. Fleet design — making the architectural outcome visible by construction

The §6 lesson arrived the wrong way: it was **supplied by the owner's correction,
not produced by the apparatus.** A well-designed fleet should surface "these
findings are architecture-provability signals, and here is the seam that makes
each unit-provable" as a first-class output — not leave it to a lucky correction
from outside. Treating that as a design defect in the fleet (metacognition on the
apparatus, not just the artefact) yields concrete moves.

**What actually failed.** The fleet had a *map* stage (survey), a *verify* stage
(refute/confirm), and a *critic* stage (what's missing) — but **no theory stage
over the findings-as-a-set**. Each leg was scoped to a slice and produced a
finding with a *local* recommendation; the recommendation field quietly invited
"add a test." The cross-finding synthesis — "all of these share the signature
*not unit-provable today*, and that shared signature is itself the finding" — was
nobody's job. The completeness critic asks *what is missing* (coverage); it never
asks *what do the present findings mean* (diagnosis). The frame-challenger judged
the artefact's frame ("is the package the right shape?"), never the findings'
frame ("are these N bugs, or one architectural absence wearing N costumes?").

**The moves, by pipeline position:**

1. **Per-finding: force the provability reading into the schema (highest
   leverage).** Add a required field to every finding: *at what level is this
   invariant provable today, and what seam or decomposition would move the proof
   one level lower?* — e.g. `{ current_proof_level: unit | integration | e2e |
   only-real-io | unprovable; blocking_seam: <what is missing, or "none — just
   untested">; cure_shape: architecture | test | config }`. This makes every leg,
   at authoring time, distinguish "needs a test" from "needs a design change so a
   test is possible." The architectural signal stops being a buried prose nuance
   and becomes structured data the aggregator can read.
2. **Grounding: hand the code legs the estate's own doctrine.** The legs were not
   given `decompose-at-the-tension`, ADR-078 (DI for testability), or
   "conditional-tests-are-an-architecture-symptom." Inject the relevant doctrine
   into each code-review brief and "hard-to-test ⇒ architecture smell" becomes the
   leg's native reflex instead of the owner's correction. Nearly free.
3. **A dedicated diagnostic (theory) stage over the confirmed set.** One opus leg
   after verify whose sole job: cluster the confirmed findings by architectural
   signature; for each cluster name the design property that, if present, would
   make the whole cluster unit-provable and prevent the class; rank clusters by how
   many findings they subsume. This is the map→reduce→**meta** shape the workflow
   tooling itself names — the stage this fleet omitted. It produces the §6 reading
   *directly*.
4. **A frame-challenger pointed at the findings, not only the artefact.** Its
   question: "are these separate defects, or one absence in many costumes?" The
   reframe *is* the architectural output, and reframing is exactly what a
   challenger seat is for.
5. **Compute convergence, don't hand-assemble it.** If each finding carries a
   normalized invariant *signature*, the aggregator auto-clusters across surfaces
   and reports "this signature appeared on 5 independent surfaces" as data. When
   the signatures are architectural, computed convergence *is* the diagnostic —
   and it removes the hand-built convergence table (§3a) that today depends on the
   adjudicator noticing.
6. **An adjudication checklist that bakes in the correction.** Even with all the
   above, the human/Director synthesis step framed it as coverage first. A standing
   question — *for each confirmed finding, is the disposition "add a test" or "name
   the seam that makes a test possible"? if the former, why can't it be the
   latter?* — catches the framing before an owner has to.

**The honesty guard (concept-exploration caution).** Forcing an architectural
reading risks manufacturing false depth: not every bug is a smell. `BV-1`
(`strictObject`) was "always unit-shaped, simply untested" — a genuine
coverage gap, not an architecture defect. So the schema field must accept "just
untested, no seam missing" as an honest answer. The value is not in forcing a
"yes" — it is in making the *distinction* explicit, so the real smells (evidence
integrity, lifecycle, containment) separate cleanly from the mere gaps. "6 of 8
blocking findings share one signature; 2 are just untested" is a far sharper
result than a flat list, and the separation is itself diagnostic.

**The meta-convergence (why this is the right shape).** Every move above reduces
to one thing: **make the fleet run the estate's own decision lenses on its own
findings** — lens 3 (*could it be simpler?*) and lens 4 (*would it be simpler if
the system changed?*) applied to each defect. The lenses already exist as the
shared decision substrate; the fleet simply was not pointed at itself with them.
The same generator explains the adjudicator's miss: the default to the *local*
cure (patch the regex, add the test) over the *level* cure (change the instrument,
change the architecture) is the local-optimisation-under-implicit-pressure the
principles doc names — and it appeared twice in one day (the depcruise "right
tool" ruling and this one both supplied the level-cure the Director defaulted past).
The fleet-design fix and the self-design fix are identical: make "could this be
solved one level down, or by changing the shape rather than adding to it" a
**required, structured question**, never an emergent one.

## 9. Patterns to graduate (owner-gated) and open questions

Graduation candidates (route through the rules process; not adopted by this report):

- **The fleet phase-shape** — inventory → survey-by-scale → verify-both-directions →
  completeness-critic-with-bounded-second-wave — as a reusable review-workflow
  template.
- **Multi-model convergence as the trust metric**, and **verify-in-both-directions**
  as non-optional stages.
- **The "wide-net finding is an architecture-provability signal" reading** (§6) as a
  candidate clause for `validation-strategy.md` or a rule — the sharpest single
  lesson, and the one most worth making durable. Recommended, not self-adopted.
- **A Codex review leg in the standing review shape** for significant PRs — the owner
  rated the approach high-value on the #836 and #834 evidence; mechanics that worked
  are in active memory (read-only sandbox, self-contained brief with dimensions left
  open, one head).

Open questions: the account-tier Sol availability; where the cost line sits (which
artefact classes warrant a fleet vs a single expert leg); whether the
architectural-diagnostic reading should retire "add a wide-net test" as a valid
disposition entirely in favour of "name the seam that makes it unit-provable."

---

*Capture, not doctrine. The #834 cure ledger — the complete list of what needs
fixing and how, expressed through the §6 lens — lives in the design plan
(`identity-switchboard-first-pixels.plan.md`, PR-1b hardening todo). The adjudicated
findings packet is PR #834 comment 5232387226; the per-surface raw records are in
the session's review collation.*
