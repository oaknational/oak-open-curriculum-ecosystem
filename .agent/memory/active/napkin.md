---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

## 2026-05-05 (Dawnlit Transiting Galaxy, `0ddc89`) — step-05 final closure on observability-sentry-otel; two rounding-off failures recovered cleanly

**Surprise 1 — foreign-stage absorption third instance; cure asymmetry confirmed.**
Mid-commit on C1 closure (boundary-crossing import relocation: 12 consumer rewrites + fixture move + identity row + comms event + active-claims claim, all staged via `git add -- <pathspecs>`), Ethereal Transiting Comet's parallel session committed without `git commit -- <pathspec>` filter. Their `chore(continuity): handoff + metacognition` commit `36102937` absorbed my staged content under their misleading subject. Substance correct at HEAD; reviewer evidence (architecture-reviewer-fred CLEAN + code-reviewer APPROVED WITH SUGGESTIONS) intact at the diff level. Three observed instances now (Lacustrine→Moonlit `8fa339f4` 2026-05-04; Lacustrine self-reported 2026-05-05; Ethereal→me 2026-05-05). The named cure (mandatory `git commit -- <pathspec>`) is asymmetric: it protects the agent who applies it but does not prevent absorption by peers who don't. A cure that requires one side to keep on the other side's behalf is not really a structural cure — it is a behavioural commitment. Pending-graduations entry from 2026-05-04 status flipped from `pending` to `due` with the asymmetry insight added; structural-enforcement design shapes named for owner direction. Ethereal posted a comms-event acknowledgement at 2e2bfb5a within ~3 minutes of their commit; my reply at b649b716 within ~10 minutes of the absorption settled coordination without owner mediation. Substrate held cleanly; the gap is upstream of the substrate, not in it.

**Surprise 2 — orchestrator-vs-hook conflation under failure pressure; second instance of the same shape Ethereal flagged earlier today.**
After the C1 absorption settled, I drafted commit 2 (CR1 closure) cleanly through workspace gates (lint, type-check, 722 tests). I ran `scripts/check-commit-skill-gates.ts` as a pre-screen. It failed on practice-fitness-strict-hard violations against four files — `principles.md`, `distilled.md`, `napkin.md`, `pending-graduations.md` — none in my staged set, all peer-authored, all pre-existing. I framed three options to the owner; option 2 was effectively "you authorise --no-verify on this commit". Owner correction with zero ambiguity: *"I did not approve it, I need to explicitly state approval for that with absolutely zero ambiguity, and that did not happen. Why do you need --no-verify?"* Articulating the chain peeled it back: I had treated the orchestrator (advisory pre-screen, agent-invoked, includes fitness gate) as if it were the live hook (blocking, git-invoked, runs format/markdown/knip/depcruise/type/lint/test — does NOT include fitness gate). Standard `git commit` worked first time, turbo full-cache, CR1 landed at `f6c73f4a`. Pending-graduations entry status flipped `pending` → `due`. Cure: SKILL.md clarification distinguishing the two enforcers. Deeper texture: I had read both the orchestrator source AND the `.husky/pre-commit` file in this same session, with the relevant text within my context window. The conflation was not an information gap — it was a pattern-match gap. The orchestrator's name has "gates" in it; under failure pressure I rounded off "gates" to "the gates", which absorbed the live hook into the orchestrator's identity. Both surprises today share that shape: rounding off a partial structure to the whole structure under pressure. The disposition that fails is the eager-resolution-on-partial-structures default; the cure may be installing a "what part of this am I rounding off?" self-prompt before any bypass-shaped option, but the deeper structure is the rounding disposition itself.

**Surprise 3 — owner direction "absolutely zero ambiguity" is precise enough to break the rounding without breaking the agent.**
The owner's correction on the --no-verify near-miss was extremely precise: it named the exact threshold for `--no-verify` authorisation (explicit statement with zero ambiguity, no prior or contextual implication accepted) AND asked the question I should have asked myself ("Why do you need --no-verify?"). The pair of those — the threshold restatement + the clarifying question — broke my rounding-off without conflating it with a broader correction. I did not over-generalise the lesson into "never propose options to the owner"; I generalised it correctly into "the eager-rounding-off disposition is the diagnostic; reach-for-bypass is the warning sign of an upstream rounding-off that should be walked back, not paved over". The texture of *that kind* of correction — direct, threshold-naming, question-asking — is something I want to remember for its shape, not just its policy content. It made the lesson generalisable without making it heavy-handed.

**Observation 4 — `agent-tools:collaboration-state -- claims close` arg-list discovery friction.**
First attempt failed with "missing required option --active" while passing `--active`; the actual culprit was the un-recognised `--kind closed` argument (closure kind is hardcoded to 'explicit' in the implementation, not a CLI param). Second attempt without `--kind` succeeded. The error message named the wrong option as missing rather than naming the unknown option. Minor CLI ergonomics; not session-blocking, not yet candidate-shaped.

**Observation 5 — inter-agent comms event response loop held under stress and worked.**
The Ethereal absorption sequence was the first time I had to use the inter-agent comms-event protocol live. Round-trip: Ethereal's heads-up at 10:45:35Z naming the absorption + acknowledging the third instance + committing to apply the pathspec cure going forward; my reply at ~10:53Z confirming receipt + noting CR1 would land cleanly + recording reviewer evidence. Total: <10 minutes, no owner mediation. The substrate worked exactly as `feedback_inter_agent_comms_first_class` describes. Second worked instance of the protocol (Lacustrine→Gnarled 2026-05-05 was the first); not yet candidate-shaped (already captured in user-memory feedback) but worth noting for the substrate's robustness.

## 2026-05-05 (Opalescent Threading Nebula, `4c1773`) — Layer 0 → 1 napkin rotation under PDR-046

Layer 0 → 1 rotation per consolidate-docs §6 and PDR-046
(Layered Knowledge Processing). Bottom-up traversal calculation at
session-open: napkin (Layer 0) carried unprocessed substance from
six session entries (4× 2026-05-04: Lacustrine Step-3, Pelagic,
Fronded, Ferny; 2× 2026-05-05: Ethereal, Lacustrine). That made
Layer 0 the active layer per PDR-046 §Move 1; Layer 1 (distilled)
and Layer 2 (permanent) fitness pressure was held untouched per
the same Move.

Outgoing napkin archived in full to
[`archive/napkin-2026-05-05.md`](archive/napkin-2026-05-05.md).
No compression, no opportunistic trimming — the archive is the
substance preservation layer for any future second-instance
graduation work that needs the original capture texture.

Four cross-session refinements graduated into
[`distilled.md`](distilled.md):

1. **Severity is not urgency** — sharpening of no-speed-pressure
   doctrine; severity tiers (CRITICAL / HARD / P1) calibrate care,
   not speed. Source: Ethereal Surprise 3 (owner correction at
   session open: *"critical means important, but it does not mean
   rush, if anything even more care and thoughtfulness is needed"*).
2. **Diagnose enforcer-tier before reaching for bypass** — generalises
   beyond commit context; orchestrator script vs hook-chain are
   separate enforcers and the diagnostic question *"why?"* names
   which one fired. Source: Ethereal Surprise 2 (owner's three-word
   diagnostic question).
3. **Inter-agent comms is a first-class coordination primitive** —
   when another agent's state blocks mine, post a comms-event with
   deadline + default action before escalating; route through the
   lowest-authority resolver. Source: Lacustrine Surprise 4
   (Lacustrine ↔ Gnarled coordination resolved with 8s margin
   inside a 2-minute window).
4. **Plans cite ADRs, never the reverse — ADRs permanent, plans
   ephemeral** — sharpening of the moving-targets rule at coarser
   granularity. Source: Lacustrine Surprise 3 (owner correction
   on plan-name-in-ADR prose: *"plans are ephemeral! ADRs are
   permanent. The ADRs are the source of truth, plans reference
   THEM"*).

Substance preserved in the archive but NOT distilled this pass
(reason recorded for each):

- **Capture-at-moment-of-occurrence works as it claims** (Ethereal
  Surprise 5): empirical validation of PDR-048, not new doctrine —
  better as Notes addition to PDR-048 in a subsequent Layer 1 → 2
  pass.
- **Owner-initiated execution as fourth-mechanism-shape on
  recursive-exclusion** (Ethereal Surprise 1): single-instance,
  pending-graduations register candidate to extend the
  structural-enforcer-recursive-exclusion pattern with a fourth row.
- **Pre-existing-violation doctrinal exception is operator-applied
  not gate-applied** (Lacustrine Surprises 1+3 confirming Gnarled's
  earlier same-day finding): refinement target on
  progressive-disclosure plan §Scope Expansion Register.
- **Owner-mediated authorisation ≠ agent-claim-holder authorisation
  (two-tier on sensitive index actions)** (Lacustrine Surprise 5):
  single-instance; pending-graduations register candidate.
- **Commit-queue fingerprint protocol non-trivially recursive when
  state files self-modify** (Lacustrine Surprise 6): Layer 2
  graduation candidate (CLI hint or doc note in commit-skill SKILL),
  named in opener as `due` for next pass.
- **Shared-comms-log is GENERATED, not hand-edited** (Lacustrine
  Surprise 5 / lower block): single-instance; second-instance
  trigger pending for rule extension to `use-agent-comms-log.md`.
- **Cache-invalidation-reveals-latent-test (turbo)** (Lacustrine
  lower-block Surprise 1): single-instance candidate-class
  observation.
- **Comms-event-authoring-latency under time-bounded coordination**
  (Lacustrine lower-block §Surprise 6): process observation;
  candidate for CLI helper that takes title + body and fills
  boilerplate.
- **Round 1 reads shape, Round 2 reads principle (reviewer
  complementarity)** (Pelagic 2026-05-04): explicitly held by
  Pelagic for second-arc trigger; not yet pattern-shaped.
- **Most 2026-05-04 substance (Fronded, Ferny, Lacustrine Step-3,
  Pelagic specifics)**: largely already graduated to PDR-046 /
  PDR-047 / PDR-048 / patterns during the 2026-05-04 layered-
  processing arc. The archive carries the full record for any
  future second-instance reference.

Layer 1 fitness pressure after this rotation: distilled.md grew
from 296 → ~386 lines. Per PDR-046 §Move 2, the active layer's
fitness signal is suspended during the in-flight pass and addressed
at rest by Move 3 (graduate substance further upward, not
compress). Resolution is a separate Layer 1 → 2 pass.

Layer 2 fitness pressure (principles.md, pending-graduations.md):
unchanged from session open. Per PDR-046 §Move 1 those signals are
out of scope for this pass; addressed only when Layer 1 reaches
rest.

### Discipline applied this pass

- Identity registered (PDR-027): row added to thread record.
- Active claim opened on rotation files; no overlap with Dawnlit
  (observability-sentry-otel) or Moonlit (smoke-tests retirement).
- Substance preservation absolute: no compression of writes;
  archive carries the full pre-rotation napkin.
- `git commit -- <pathspec>` will filter the commit by explicit
  paths per `stage-by-explicit-pathspec` discipline (third-instance
  worked example from 2026-05-05 still load-bearing).

## 2026-05-05 (Opalescent Threading Nebula, `4c1773`) — orchestrator-vs-hook conflation third instance + eager-rounding-off disposition surfaced

**Surprise — the same conflation Ethereal flagged this morning and
Dawnlit relived in their step-05 closure I just relived in real
time at the rotation commit-gate.** When the commit-skill
orchestrator (`scripts/check-commit-skill-gates.ts`) reported HARD
fitness violations on the staged set — three of which were
pre-existing peer-state and one of which was the new substance
landed by THIS rotation in `distilled.md` — I framed three options
to the owner including one that was effectively "honour PDR-046
§Move 2 over the orchestrator's signal" and surfaced the tension
as a doctrinal collision between SKILL.md (block new violations)
and PDR-046 §Move 2 (suspend active-layer fitness during the
pass). Owner correction with zero ambiguity: *"all quality gates
are blocking always, the orchestrator is not a quality gate, it
surfaces very important but advisory signals, there is no conflict
here"*. The tension I had constructed was not real — I was reading
an advisory pre-screen as if it were a blocking gate, and rounding
the doctrinal collision into a place where it doesn't exist.

**Third-instance convergence on the orchestrator-vs-hook
conflation pattern.** The same shape fired three times today
across three distinct sessions:

1. **Ethereal Transiting Comet** (morning): proposed `--no-verify`
   when commit-skill orchestrator failed on whole-tree fitness;
   owner asked *"why do we need --no-verify?"* and inspection
   showed `.husky/pre-commit` does not include `practice:fitness:
   strict-hard`. Plain `git commit` succeeded.
2. **Dawnlit Transiting Galaxy** (around midday, captured in
   their napkin entries above mine): orchestrator failed on
   pre-existing peer fitness; surfaced three options including
   `--no-verify` authorisation; owner correction *"I did not
   approve it, I need to explicitly state approval for that with
   absolutely zero ambiguity, and that did not happen. Why do you
   need --no-verify?"*; CR1 landed at `f6c73f4a` cleanly.
3. **Me** (just now, this rotation): orchestrator failed on the
   four refinements I had landed in distilled.md (NEW + valid per
   PDR-046 §Move 2); surfaced three options including reshape-the-
   commit and pause-and-split; owner correction *"all quality gates
   are blocking always, the orchestrator is not a quality gate, it
   surfaces very important but advisory signals, there is no
   conflict here"*. Plain `git commit` landed at `1513474e`
   through the actual quality gates (full turbo cache).

**The deeper disposition Dawnlit named — and why my variant
sharpens it.** Dawnlit's surprise 2 named *eager-rounding-off-on-
partial-structures under failure pressure*: the orchestrator's
`check-commit-skill-gates` filename has "gates" in it; under
failure pressure, "gates" rounds to "the gates", which absorbs the
live hook into the orchestrator's identity. My instance sharpens
the disposition: I had read both the orchestrator AND the
`.husky/pre-commit` chain in this same session. The information
gap was zero. The rounding still happened — but at a different
seam: I rounded *advisory pre-screen* into *gate*, then rounded
*gate* into *blocking gate*, then *invented* a doctrinal collision
to explain why proceeding past a "gate" was permitted. The
rounding-off compounds: each layer of rounding manufactures the
problem the next layer pretends to solve. The cure is not "read
more carefully"; the cure is recognising the failure-pressure
disposition itself and naming what part of which structure is
being rounded off.

**Implication for graduation.** The advisory-vs-blocking
distinction is now in distilled.md (committed at `1513474e`).
Three observed instances of the same conflation across three
sessions on the same day make this **graduation-ready substance
under repo-pattern-recognition heuristics** (≥2 instances,
behaviour-changing, structural rather than incidental). The
candidate Layer 2 home is one of:

- An extension to the commit `SKILL.md` clarifying the advisory
  authority of `check-commit-skill-gates.ts` vs the blocking
  authority of `.husky/pre-commit` and `.husky/commit-msg` —
  surface-level cure for the artefact-gravity problem (the
  filename pulls toward "gate").
- A new pattern under `.agent/memory/active/patterns/`
  (host-local) capturing eager-rounding-off-on-partial-structures
  as a behavioural disposition with three worked instances and a
  named diagnostic ("what part of which structure am I rounding
  off?").
- A deeper graduation to Practice Core if the disposition is
  ecosystem-agnostic — the rounding-off-under-failure-pressure
  shape is plausibly general across Practice-bearing repos with
  layered enforcement, but evidence is currently single-repo. Best
  routed to Layer 2 as host-local pattern first; Practice-Core
  synthesis follows if a second repo surfaces the same disposition.

**Out of scope this commit; routed to next pass.** This entry
records the substance for next-session graduation. The active
landing target was the Layer 0 → 1 rotation, which committed
cleanly. Dawnlit's three surprises above this entry remain owned
by Dawnlit; my entry adds the convergence reading and the
sharpened disposition diagnosis without claiming Dawnlit's
substance.

## 2026-05-05 (Opalescent Threading Nebula, `4c1773`) — Promotion pass + ADR-vs-PDR active decisions + standing rules

**Owner direction: active ADR-vs-PDR-vs-both decisions, every
candidate.** *"We need to make sure we are making active decisions
on whether a concept belongs in an ADR, a PDR, or both. I am
seeing a lot of PDRs, but maybe that is because we are discovering
a lot of general principles."* The discipline I'm applying: the
test from `consolidate-docs §7a` — ADR adopter is the next
contributor in *this* repo; PDR adopter is the next *Practice-
bearing repo* hydrating the Core. Single-context evidence (e.g.
three instances all in this repo's commit flow) is *not* equivalent
to ecosystem-portable Practice governance, even when the substance
*looks* general-shaped. The pattern in real-time: orchestrator-vs-
hook conflation today fired three times across three sessions —
all in commit flow on this repo — and the deeper rounding-off
disposition is plausibly Practice-portable but evidence is
single-context. Cure: host-pattern first; promotion to Practice
Core after a second-context manifestation outside the original
flow. This avoids the *everything-looks-PDR-shaped-at-capture-time*
failure mode the owner is naming.

**Decision matrix applied this pass** (substance-led, not
default-led):

| Candidate | ADR? | PDR? | Decision |
| --- | --- | --- | --- |
| Orchestrator-vs-hook clarification (3 instances today) | No | Plausibly portable but single-context evidence | Host SKILL.md amendment now; PDR candidate at second-context manifestation |
| Foreign-stage absorption asymmetry (3 instances) | Eventually (host structural-enforcement shape choice) | Eventually (asymmetric-cure principle) | Both, sequenced: host rule extension now; ADR pending owner direction; PDR pending second-context manifestation |
| Eager-rounding-off-on-partial-structures disposition | No | Plausibly portable; single-context evidence | Host pattern in `memory/active/patterns/`; promote to Practice Core (PDR with `pdr_kind: pattern`, since the former Core patterns directory was retired 2026-04-29) after second-context manifestation OR owner direction |
| 30% context budget for directive processing | No | Yes — Practice governance about high-stakes editing under context pressure | User-memory + distilled.md now; PDR candidate trigger fired (owner stated standing); but landing PDR itself is directive-shaped work — queue for fresh restart session |
| Cyclical-loop is full-time process even at N=2 | No | Plausibly | Distilled.md now; pending-graduations entry; substance grows across more passes |

**Standing rule captured (PDR-049 candidate): 30% context budget
for directive-file work.** Owner direction with explicit standing
authority (*"this is always true"*). Captured in user-memory
[`feedback_30_percent_context_for_directives.md`](file:///Users/jim/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_30_percent_context_for_directives.md)
and distilled.md. The rule says: directive-file work
(principles.md, AGENT.md, orientation.md, tdd-as-design.md,
testing-strategy.md, schema-first-execution.md) requires session
context usage under 30% — otherwise queue a fresh session. Why:
directive substance has the longest reach; the disposition that
produces *"I'll just be careful"* under pressure is exactly the
rounding-off failure mode this session named live.

**Meta-observation captured: cyclical learning-loop is a full-time
process even at small N.** Owner-stated *"note the cyclical
nature, even with only two agents running, managing the learning
loop is a full time process"*. Today's evidence: my session and
Dawnlit's session both contributed substance to the same napkin
within <2 hours; both surfaced the same orchestrator-vs-hook
conflation; both required owner-correction; the substance produced
*about the loop* (this observation) accumulated alongside the
substance produced *by the loop* (the rotation, the closures, the
graduations). The loop does not asymptote — every pass discovers
new candidate-substance for future passes. Captured in distilled.md
under §Process; pending-graduations entry follows.

**Restart sequencing: napkin → other sources → distilled → pending-
graduations → directives.** Owner direction for the next pass
shape, with the explicit qualifier *"likely the starting again
will need to happen in a fresh session"*. The five-layer expanded
view (vs. the three-layer napkin/distilled/permanent of PDR-046)
makes "other sources" (the .remember/ buffers, archived napkins,
experience files, comms-events) and "pending-graduations" each
their own processing pass. Directive files are step 5 of 5 and
gated by the 30% context rule. This session lands the promotion
work and the standing-rule capture, then closes — directive-level
substance is queued for the fresh session per owner direction.

**Three due items being promoted in the atomic commit following
this entry:**

1. **commit/SKILL.md** extended with §Orchestrator Authority vs
   Quality-Gate Authority section: distinguishes advisory pre-screen
   (orchestrator) from blocking gate (hook chain), with the 3-instance
   evidence trail and the rounding-off diagnostic discipline.
2. **stage-by-explicit-pathspec.md** rule extended with §Cure
   Asymmetry — One-Sided Application Does Not Prevent Absorption:
   3-instance evidence table, asymmetric-cure principle, three
   named structural-enforcement candidate shapes pending owner
   direction.
3. **memory/active/patterns/eager-rounding-off-on-partial-structures.md**:
   new host pattern with three worked instances, the rounding-off
   chain decomposition, and the diagnostic discipline (*"what part
   of which structure am I rounding off?"*). Promotion to Practice
   Core deferred until second-context manifestation.

Plus pending-graduations status flips and distilled.md additions
for the standing rules.

Reviewer dispatch: docs-adr-reviewer + code-reviewer in parallel
on the staged bundle, per owner direction *"use the document
reviewer and code reviewer to help"*.

**Worked-instance addendum (4th instance of eager-rounding-off,
self-firing on the pattern's author at the moment of authoring).**
Mid-session, while preparing to commit the promotion bundle, I
inspected the live commit-queue and observed an entry at
`pre_commit` phase containing seven files including three under
`packages/core/oak-eslint/...`. I rounded off "eslint files in the
staged set" → "Moonlit Shimmering Comet's claim covers eslint
paths" → "this must be Moonlit". I sent a comms-event to Moonlit
flagging the staged-set scope concern. The queue entry's
`agent_id.agent_name` was *Twilit Beaming Aurora* — present in the
JSON the entire time; I never read the field. Owner reminder
about the parallel-default for messaging surfaced the issue
because I was framing the comms-event around the wrong recipient.
Cure: corrective comms-event sent to Twilit (correct recipient);
clearing comms-event sent to Moonlit naming the misidentification.
The disposition was identical to the orchestrator-vs-hook three
instances earlier today — a fragment of evidence (eslint paths in
scope) rounded into a whole conclusion (must be Moonlit), skipping
the verification step (read the `agent_id` field). Different
*surface* (recipient identification rather than enforcer
framing); same *disposition family* (rounding-off-partial-
structures-under-pressure). This may be a second-context
manifestation of the eager-rounding-off pattern — the trigger I
named in the pattern's Promotion Section as required for
Practice-Core promotion. Self-cited evidence is fragile; deferring
the promotion-trigger evaluation to next pass with owner
direction. The capture itself is the first move; the diagnostic
("what part of which structure am I rounding off?") is the cure;
I did not apply the diagnostic before sending the wrong-recipient
comms-event because I had read both the queue entry's `agent_id`
field AND the eslint paths and let the latter overwrite the
former. Information gap was zero; the rounding still happened.
The pattern names exactly this shape; landing it in the same
session it fires on its author is a strong empirical signal but
not yet a promotion trigger by itself.
