---
pdr_kind: governance
---

# PDR-044: Memetic Immune System — Innate and Adaptive Doctrine Defence

**Status**: Accepted (amended 2026-05-21)
**Date**: 2026-05-04
**Related**:
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — this PDR
operationalises PDR-038's mechanical-enforcement requirement as a
two-layer immune model);
[PDR-039](PDR-039-external-findings-reveal-local-detection-gaps.md)
(external findings as signals of local detection gaps — the same
sense organ, applied inwards as well as outwards);
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md)
(rush-impulse three structural cues — the immune system catches the
rush-impulse failure mode at the surface where it expresses itself).

## Context

A practice that relies on contributors and agents recalling its
doctrine at the moment of action fails predictably under flow-state
pressure. The recall-dependent failure mode is named in PDR-043 (the
rush impulse) and PDR-038 (stated principles without enforcement
surfaces). The cure named in PDR-038 is structural enforcement; this
PDR names the *shape* of that enforcement.

The biological metaphor is load-bearing. An immune system is not a
fence; it is a *layered detection-and-response system* that catches
known pathogens fast and learns to recognise new ones over time. A
practice protecting itself against pathogenic memes — vocabulary or
patterns that re-introduce previously-rejected failure modes —
benefits from the same shape. A single deterministic scanner is too
brittle; a single cognitive review is too slow; the layered shape is
both faster and more adaptive than either alone.

Three observed pathogenic memes that recur across sessions in the
originating system motivated this PDR:

- **Carve-out vocabulary** — language that means "I know the rule
  applies, but this situation is special" in any of its dressings
  ("carve out", "exception", "for these arcs", "honest framing for
  external X", "permitted variant", "land it then iterate").
- **Quarantined-concept revival** — a previously-rejected pattern
  resurfacing under a new name with the same substance.
- **Multi-commit-TDD-skip-register** — a plan shape that introduces
  intentionally-failing tests to be greened in a later commit, named
  as discipline rather than as the named anti-pattern it is.

Each pathogen has a recognisable surface signature (vocabulary, plan
structure, file diff shape) that can be detected mechanically *before*
the pathogen lands. Each pathogen also has a deeper substance that
sometimes evades surface signatures and requires cognitive recognition
to catch. Both detection modes are needed; neither alone is sufficient.

## Decision

**A practice at maturity defends itself against pathogenic memes
through a two-layer immune system: an innate layer of deterministic,
fast, broad detection at write-time and commit-time, and an adaptive
layer of cognitive recognition at consolidation-time and post-incident
review-time. The two layers are complementary; doctrine is the
fingerprint registry both layers consult; citation discipline is the
autoimmunity safeguard.**

### Innate immunity — deterministic, fast, broad

Innate immunity runs on every relevant action without contributor or
agent attention. Its responsibilities:

- **Scan** the surface produced by every Edit / Write / Bash /
  staged-diff action.
- **Detect** matches against a fingerprint registry of pathogenic
  patterns.
- **Surface** detections with citations to the doctrinal anchor
  (the rule, principle, ADR, or PDR that names the pathogen).
- **Block** the irreducible class — patterns that have no legitimate
  shape (destructive history operations, hook-skipping flags,
  reintroduction of structurally-banned patterns).
- **Soft-report** the substantive class — patterns that may have
  legitimate context but whose presence requires cognitive
  disposition before landing.
- **Route owner-authorised references through approval**, not refusal.
  Some fingerprints protect owner-only or context-sensitive language.
  When the surface is legitimate only with owner approval, the
  detection stops automatic continuation and requests that approval
  path. It does not make the reference impossible.

Innate immunity is intentionally *broad and fast*. It produces some
false positives by design; it never silently misses a known
pathogen.

### Adaptive immunity — cognitive, contextual, learning

Adaptive immunity runs at consolidation cadence and post-incident
review. Its responsibilities:

- **Recognise** instances of pathogens that evade surface signatures.
  A new wording of an old failure shape; a structural pattern (plan
  decomposition, commit sequence) that reproduces a known failure;
  a doctrine drift that has not yet been named.
- **Register** new fingerprints when a previously-unknown pathogen is
  identified. Each new fingerprint must carry a doctrinal anchor — a
  citation to the rule, principle, or PDR that names why this pattern
  is pathogenic.
- **Refine** existing fingerprints when false-positive rates show
  miscalibration.
- **Vaccinate** — when an agent self-reports "I almost did X but
  caught myself", capture the near-miss as a sample with antibodies
  attached: the pathogen substance, the recognition cue, and the
  cognitive cure that prevented the landing.

Adaptive immunity is intentionally *narrow and slow*. It produces
high-quality fingerprint additions; it cannot run on every action
because the cost would dominate.

### Citation discipline — the autoimmunity safeguard

A pathogen-fingerprint claim must carry a doctrinal citation. A
pattern enters the registry only with a named anchor in the
practice's existing rules, principles, ADRs, or PDRs.

Without this discipline, the immune system risks autoimmunity —
classifying legitimate work as pathogenic because the classifier has
drifted. With the discipline, every classification is auditable: the
question "why is this pathogenic?" has a one-step answer.

A second autoimmunity safeguard: **acknowledged-context allowlists are
themselves a signal**. When a contributor explicitly disposes of a
detection as "this is the legitimate shape for X reason", the
disposition is logged. A high rate of allowlist usage on a given
fingerprint is evidence the fingerprint is mis-calibrated, not
evidence the fingerprint should be relaxed silently.

### Lifecycle — fingerprint registration and retirement

A fingerprint enters the registry through one of three paths:

1. **From a doctrinal anchor** — a rule, principle, ADR, or PDR
   names a pattern as pathogenic. The fingerprint is the
   operationalisation of the anchor at the appropriate detection
   surface.
2. **From a post-incident review** — a session where a pathogen
   landed despite existing doctrine. The review identifies the
   detection gap; the new fingerprint closes the gap.
3. **From a near-miss vaccination** — a contributor or agent
   self-reports avoiding a pathogen. The recognition cue becomes
   the fingerprint.

A fingerprint exits the registry when:

- The doctrinal anchor is retired (the pattern is no longer
  considered pathogenic).
- The fingerprint is consistently mis-calibrated (high false-positive
  rate; refining is preferred to retiring; retiring is the last resort).

Fingerprints are not retired silently; a retirement is itself a
doctrinal act recorded in the napkin or distilled.

### 2026-05-21 amendment — refusal vs approval

The innate layer distinguishes **irreducible blocks** from
**approval-trigger detections**. Irreducible blocks have no legitimate
agent-authored shape without prior owner authorisation: destructive
history operations, silent hook bypass, and other operations that
would damage trust if allowed to proceed automatically.

Approval-trigger detections are different. They flag vocabulary or
patterns that are usually pathogenic but can be legitimately discussed
when the owner has authorised the context, such as naming a blocked
pattern inside a research or governance artefact. In those cases the
detector preserves the route to owner approval. A detector may pause
or reject the immediate write so the approval can be recorded, but the
design target is **approval before continuation**, not absolute
impossibility.

This prevents autoimmunity in the innate layer: the scanner still
catches the pattern, while legitimate doctrine work remains possible
through an explicit approval path.

## Rationale

**Why two layers, not one.** A single deterministic scanner cannot
catch substance; a single cognitive layer cannot catch volume. The
layered shape lets each layer do what it is good at. Innate immunity
catches volume, fast; adaptive immunity catches substance, slow.

**Why citation discipline.** The risk of an immune system without
provenance is that classifications drift away from their doctrinal
basis and start expressing the classifier's preferences rather than
the practice's principles. Citation discipline ties every
classification back to the practice's own decision-records, making
drift visible.

**Why allowlist usage is itself a signal.** An immune system that
silently relaxes when contributors push back becomes the failure mode
the rush impulse names: cognitive pressure overrides doctrinal
resolution. By logging allowlist usage as a calibration signal,
pushback becomes evidence rather than escape.

**Alternatives rejected:**

- **Innate-only.** Catches surface signatures; misses substance;
  produces a corpus of fingerprints that drifts from the substance it
  was meant to catch.
- **Adaptive-only.** Cannot scale to every action; recall-dependent
  under flow-state pressure (the failure mode this PDR exists to
  defeat).
- **Centralised immune-system service.** A single service that all
  agents and tools consult creates a coupling that violates platform
  independence; the layered shape is implemented per-surface
  (write-time, commit-time, consolidation-time) using the surface's
  natural mechanism (rule, scanner, agent).

## Consequences

### Required

- Pathogen fingerprints are registered with doctrinal citations.
- Innate-immunity surfaces are paired with the fingerprints they
  scan; the registry is not an isolated artefact.
- Adaptive-immunity work runs at consolidation cadence as a named
  step.
- Allowlist usage is logged centrally and consulted at each
  consolidation pass.

### Forbidden

- Fingerprints without doctrinal anchors.
- Silent relaxation of fingerprints under repeated allowlist usage.
- Hard-blocking the substantive class without surfacing the
  cognitive disposition path. (Hard-blocking the irreducible class
  remains correct.)
- Adaptive-immunity additions that bypass citation discipline.

### Accepted cost

- Initial fingerprint authoring effort is non-trivial; subsequent
  detections amortise the cost rapidly.
- False positives in the soft-report class require cognitive
  disposition; the cost is the mechanism by which disposition itself
  reinforces the doctrine.

## Implementation Notes

The discipline is recursive: this PDR is itself doctrine, and PDR-038
requires doctrine to land with enforcement. The enforcement surface
for this PDR is the innate-immunity layer landed in the same arc as
its authoring (vocabulary trip-list, SHA-in-permanent-doc detection,
test-disabled-rule activation, and the broader scanner roadmap). The
adaptive-immunity layer is named as a future capability with
promotion triggers (evidence of repeated near-misses; evidence of
fingerprint drift requiring per-instance recognition).

Platform independence is preserved by implementing innate immunity at
the host's portable scanner surface (a vendor-agnostic scanner CLI
with thin platform adapters), not at any platform's native rule
surface. Adaptive immunity is implemented as a process-executor
agent operating against the practice's portable knowledge surfaces,
not as a platform-specific reviewer.

## Compliance Triggers

- A pathogenic meme is observed in a session and no fingerprint
  catches it. Route via PDR-039: register the fingerprint with its
  doctrinal anchor in the same arc.
- A fingerprint accumulates allowlist usages above a threshold
  established at consolidation time. Refine the fingerprint or
  surface for re-derivation.
- A near-miss is reported and not captured as a vaccination sample.
  Capture is owed; route via the napkin → pending-graduations →
  fingerprint pipeline.

## Worked Instances

The first innate-immunity layer landed in the originating system
under this PDR addresses three named pathogens at the
write-time and commit-time surfaces: hedging vocabulary, SHA-in-
permanent-doc, and test-disabled-rule activation. Each is paired
with a doctrinal anchor in the host's principles directive,
distilled memory, or rules index. Host-local instance files are
bridged via the practice-index Rules and Patterns sections.

## Amendment Log

None yet.
