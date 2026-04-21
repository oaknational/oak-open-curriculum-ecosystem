---
pdr_kind: governance
---

# PDR-029: Perturbation-Mechanism Bundle

**Status**: Accepted
**Date**: 2026-04-21
**Related**:
[PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md)
(care-and-consult on Core edits — the tripwires this PDR names
are Core installs);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(canonical-first cross-platform architecture — tripwire rules
MUST follow the canonical/adapter split this PDR makes
load-bearing);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(surprise pipeline — tripwires fire at the capture edge of the
pipeline);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounding and framing — perturbation mechanisms fire against
inherited framing at session open and shape-entry);
[PDR-022](PDR-022-governance-enforcement-scanners.md)
(governance enforcement scanners — tripwires compose with
scanners; probes named in this PDR are scanners by another
name);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads and identity — the Class A.2 tripwires protect
thread-identity discipline);
[PDR-030](PDR-030-plane-tag-vocabulary.md)
(plane-tag vocabulary — fixes the canonical form of the
`cross_plane: true` span tag consumed by the Family B Layer 2
accumulation signal).

## Amendment Log

- **2026-04-21 (Accepted) — *Class-A.1 Layer-2 retraction: no "standing-
  decision register surface" — foundation-directive grounding is the Layer
  2.*** The initial Class-A.1 Required-layer prescription named a
  **standing-decision register surface** as the second complementary
  layer. Session 4 Task 4.1 implemented this faithfully by authoring
  `.agent/memory/operational/standing-decisions.md` and collapsing
  `repo-continuity.md § Standing decisions` into a pointer. A third owner-
  metacognition intervention later in Session 4 surfaced that "standing
  decision" is not a category distinct from ADR / PDR / rule / principle /
  plan-local meta-decision — it is a default property of any ratified
  artefact. The "register surface" was therefore a **misc bucket**: it
  admitted unclassified-decision debt rather than enforcing proper
  classification into durable homes.
  - **Codified retraction**: the Class A.1 Required-layers list is
    reduced to Layer 1 (plan-body-first-principles-check rule). The
    intent of Layer 2 — *"owner-ratified decisions re-enter scope at
    every session regardless of plan contents"* — is already served by
    the **foundation-directive grounding** read at session open:
    `.agent/directives/principles.md`, the ADR index, the PDR index,
    and the `.agent/rules/` tier. Per this PDR's first 2026-04-21
    amendment, those reads are ritual-moment markdown-reading active
    layers; no dedicated surface needs to be authored to make them so.
    The two-complementary-layers design target is met by the
    combination of shape-entry (Layer 1, rule) + session-open
    foundation grounding (which this amendment retrospectively names
    as the implicit Layer 2 for A.1).
  - **Implication for Class-A.1 installs**: the `standing-decisions.md`
    file is deleted; its items decompose into ADR / PDR / rule /
    principle / plan-local homes. Items already in proper homes:
    three-plane taxonomy (PDR-028, PDR-030), staged-execution +
    fitness-tolerance + experience-deferral + session-break-points
    (plan body), owner-beats-plan (principles.md + repo-wide
    invariants). Items needing new durable artefacts captured as
    Due register entries for Session 5 / next consolidation:
    `--no-verify` fresh-authorisation rule; build-vs-buy PDR;
    friction-ratchet PDR; runtime-tracks-git-tracked PDR; docs-as-DoD
    PDR; misleading-docs-are-blocking PDR.
  - **Pattern candidate surfaced — `plan-body-framing-outlives-
    reviewers`** (third instance this session, elevated to Due in the
    pending-graduations register). First instance: scripts-for-
    tripwires. Second instance: docs-as-second-class-review-target.
    Third instance: standing-decision-category-as-distinct-from-
    ADR/PDR/rule/principle.
  - **Pattern candidate — `metacognition-cascade-reveals-deeper-
    misframes-per-pass`**: within a single session, successive owner
    metacognition interventions each surface a deeper structural
    misframe than the previous pass. Each cascade dismantles more
    scaffolding that prior reviewers approved. First instance (this
    session, three passes).
  - **Pattern candidate — `owner-repeats-principle-verbally-when-
    written-doctrine-is-insufficient`**: owner said *"always choose
    long-term architectural excellence over short-term expediency"*
    twice in this session despite the principle being written in
    `principles.md § Architectural Excellence Over Expediency`. The
    repetition is signal that inline prose doctrine is insufficiently
    active for the current work — the principle needs a stronger
    firing cadence. First instance. Promotion-ready on second
    cross-session instance.
  - **Reviewer-coverage note**: prior to this amendment, five
    reviewers (Barney, code-reviewer, test-reviewer, type-reviewer,
    config-reviewer) approved the standing-decisions install inside
    the PDR-029-as-drafted frame; a sixth reviewer (`docs-adr-
    reviewer`) reviewed at close and did not flag the "register
    surface" framing as problematic either. None questioned whether
    the "standing decision" category exists. Reviewer intent-review
    optimises inside inherited frames; it does not substitute for
    owner first-principles metacognition *against* the frame. This
    calibration is new. The pattern candidate `plan-body-framing-
    outlives-reviewers` codifies the observation.

- **2026-04-21 (Accepted) — *Active means markdown-ritual, not code
  execution.*** The initial drafting of the Class A.2 Required-layer
  language ("backed by a scanner", "a scanner that reads thread
  identity tables") and the Tripwire-layer catalogue's "Health probe /
  scanner" row implicitly assumed that "active" tripwire layers are
  implemented as code. During Session 4 of the staged doctrine-
  consolidation plan, owner intervention via `jc-metacognition`
  surfaced that this framing is a latent platform-coupling bias: the
  rest of the Practice infrastructure is documentation-first,
  platform-agnostic markdown precisely so any agent on any platform
  (Claude, Cursor, Codex, Gemini, human) can participate. A code
  layer is a Claude-favouring artefact — it presupposes an agent with
  shell, `pnpm`, or a particular runtime. Five reviewers (Barney,
  code-reviewer, test-reviewer, type-reviewer, config-reviewer)
  approved a TypeScript-based script shape for the Class A.2 Layer 2
  gate and Layer 3 probe without once questioning the frame; the
  framing survived intent-review because each reviewer optimised
  *within* it.
  - **Codified amendment**: "active" tripwire layers are satisfied
    by **a ritual-moment markdown step that names the authoritative
    source to read**. The enforcement force comes from the ritual's
    *"do not proceed until X"* obligation, carrying the same
    authority as an `exit(1)` without platform coupling. Code is
    **one possible implementation**, reserved for work an agent
    cannot reasonably perform by reading markdown (e.g. heavy
    cross-repo aggregation, complex parsing beyond human
    readability). The default for Class A.2 — and for any Family A
    layer described as "scanner", "probe", or "gate" in this PDR —
    is the markdown-ritual form.
  - **Structural enumeration** (the Class A.2 Layer 2 "MUST NOT
    rely on self-reporting" clause) is satisfied by **the ritual
    step explicitly naming the authoritative file and instructing
    the agent to read it**. The authoritative file IS the
    structural source; the instruction prevents self-reporting.
    Any agent on any platform can perform the enumeration. A
    script that reads the file is one implementation of this
    principle; it is not the principle.
  - **Platform parity** (the PDR's load-bearing constraint) is
    stronger under markdown-first: markdown is the lowest common
    denominator every agent infrastructure can read. A markdown
    ritual step is platform-parity by construction; a code layer
    satisfies parity only if the code runs on every target
    platform's runtime, which is a stricter bar.
  - **Affected PDR passages**: the Class A.2 Layers 2 and 3
    prescriptions continue to name "gate", "scanner", and "probe",
    but these terms now refer to the **pattern of firing** (at
    session close; on demand; at scheduled audit), not to an
    implementation technology. The Tripwire-layer catalogue's
    "Health probe / scanner" row is read as *"Named ritual step
    that enumerates from authoritative files"* — a CLI sub-command
    is one valid instantiation; a markdown checklist walked at the
    ritual is another and is the default.
  - **Affected installs**: Session 4 of the staged doctrine-
    consolidation plan delivers the Class A.2 Layer 2 gate as a
    documentation step in `/session-handoff` (step 7c walking the
    agent through thread enumeration and identity-update
    verification) and the Layer 3 stale-identity probe as a
    documentation step in `/jc-consolidate-docs` (step 7c walking
    the agent through six staleness checks). No script, no CLI
    subcommand, no workspace dependency — the force is in the
    ritual surface.
  - **Pattern candidates surfaced**:
    `active-means-ritual-moment-not-code-execution` (the core
    amendment) and `plan-body-framing-outlives-five-reviewers`
    (inherited framings propagate through reviewer intent-review
    because each reviewer optimises within the frame rather than
    questioning it — the plan-body-first-principles-check rule's
    shape clause catches shape mismatches but not the frame
    behind the shape). Captured to
    [napkin](../../memory/active/napkin.md) Session 4 mid-session
    entry; promotion-ready on second instance per PDR-007.

## Context

Two patterns have been extracted from repeated failure modes in
agentic engineering sessions:

- **Inherited framing without first-principles check**
  (`inherited-framing-without-first-principles-check` pattern)
  — an agent executes a plan's prescribed shape (test shape,
  non-goal, vendor literal, file naming) faithfully because it
  is written down; the artefact's gravity overrides the
  first-principles check that would have surfaced the mismatch.
  Six instances observed in the source sessions that generated
  the pattern.
- **Passive guidance loses to artefact gravity**
  (`passive-guidance-loses-to-artefact-gravity` pattern) — a
  guardrail authored as a documented register entry, prose
  bullet, or README paragraph fails to fire at the decision
  point because the agent in the moment is carrying artefact
  gravity and the document is not in scope. Three instances
  observed, each where a register entry existed but the agent
  did not read it at the moment it would have helped.

Both patterns point at the same design need: **countermeasures
must be environmentally enforced, not documented-and-hoped**. A
register entry, a non-goal bullet, a re-ratification ritual
described in prose — each is a watchlist item, not a guardrail,
unless something in the environment *fires* on a named condition
without agent recall.

Three initial perturbation-mechanism candidates had emerged
before this PDR:

- **First-principles metacognition prompt** — a session-open
  prompt asking the inherited-framing question by name.
- **Standing-decision register surface** — a short file listing
  durable owner-ratified decisions, read explicitly at session
  open.
- **Non-goal re-ratification ritual** — a session-open step
  re-reading any plan non-goals against recent owner direction.

All three landed as documented entries in active-memory surfaces.
None of them fired on the further inherited-framing instances
observed after their capture. The documentation existed; the
firing mechanism did not.

Separately, the thread-as-continuity-unit work (PDR-027)
identified a second failure mode in the same family: the
additive-identity rule is *passive guidance* (a convention
described in a README). Without a firing mechanism, the rule
depends on agent recall at session open, which is exactly the
failure mode the `passive-guidance-loses-to-artefact-gravity`
pattern describes. A second class of tripwire is therefore
needed: one that protects agent-registration and identity
discipline at thread join and session close.

Finally, a *meta-level* failure mode threatens any durable
memory taxonomy: the seams that define the modes (active /
operational / executive, or whatever taxonomy the host repo
adopts) may themselves drift from being the right seams. Without
a re-evaluation mechanism, a taxonomy that was correct at its
installation decays into a mis-match with the work it is
supposed to organise. A third category of tripwire — meta-
tripwires for the memory taxonomy itself — is required for the
system to remain self-applying.

## Decision

**A Practice-bearing repo that has accepted the perturbation-
mechanism doctrine MUST install active tripwires in two
families. Family A installs at least two complementary layers
per class against the artefact-gravity failure mode. Family B
installs meta-tripwires against taxonomy drift. All Family A
tripwires operate under load-bearing platform-parity
constraints.**

### The tripwire concept (Heath-brothers framing)

A tripwire is a **pre-committed rule that converts a continuous
decision into a discrete trigger event** (named by Chip and Dan
Heath in *Decisive* ch. 9 and *Switch* ch. 8). The load-bearing
part is the trigger event, not the rule content. Well-written
guidance that nobody triggers is passive; poorly-written
guidance that always triggers is still a functional tripwire.

Design priority for any tripwire install, in order:

1. **Firing cadence** — what concrete event fires the check?
2. **Failure mode coverage** — if this one tripwire fails, is
   there a complementary layer that still fires?
3. **Rule content** — what does the check actually assert?

Most design energy on tripwires goes into item 3 by default.
This PDR inverts the order: firing cadence first, coverage
second, content last.

### Tripwire layer catalogue (from the Heath-brothers table)

The concrete layers available for tripwire installation:

| Layer | Firing cadence | Example |
| --- | --- | --- |
| **Always-applied rule** | Session open (platform-loader) or read-at-grounding | `.agent/rules/<name>.md` + `.claude/rules/<name>.md` + `.cursor/rules/<name>.mdc` |
| **Read-trigger surface** | Explicitly named in the session-open grounding order | A short file that start-right-quick / start-right-thorough reads before work begins |
| **Skill / command invocation gate** | When the workflow is run | A hard acceptance criterion inside a named command (e.g. `/session-handoff`) |
| **Pre-commit hook / CI gate** | On commit or push | A repo-root script invoked by Husky or CI job |
| **Health probe / scanner** | On-demand or scheduled | A named CLI sub-command (e.g. `pnpm <tool> health`) that reads authoritative files and asserts invariants |
| **Structural artefact constraint** | At artefact-authoring time | A schema or lint rule that fails fast if the structure is wrong |

A single tripwire is better than none; **two complementary
layers is the design target**. Complementarity means the layers
cover disjoint failure modes — e.g. rule + scanner, where the
rule protects the authoring path and the scanner catches any
artefact that evaded the rule.

### Family A — Artefact-gravity tripwires

**Family A** covers the `passive-guidance-loses-to-artefact-
gravity` failure mode in its two observed classes:

#### Class A.1 — Plan-body inherited-framing

Fires when an agent is about to execute a prescribed shape —
authoring tests, implementation, or doctrine from a plan body,
spec, or inherited artefact.

**Required layers (default installs; host may override)**:

1. **Always-applied rule** — a canonical rule at
   `.agent/rules/plan-body-first-principles-check.md` (or host
   equivalent) carrying the three-clause check:
   1. **Shape clause.** Is the shape right for the
      host-authored behaviour being proven, or is it a vendor /
      configuration / framework assertion in disguise?
   2. **Landing-path clause.** Does the file naming carry a
      tooling contract that constrains how or when this
      artefact can land?
   3. **Vendor-literal clause.** Does any literal token from
      the plan body match the current upstream surface, or is
      it a doc-level word the plan borrowed?
2. **Foundation-directive grounding** (retrospectively named;
   retracted from an earlier "standing-decision register surface"
   prescription per the second 2026-04-21 Amendment Log entry)
   — the existing session-open reading of the host's foundation
   directives (`principles.md`, the ADR index, the PDR index, the
   `.agent/rules/` tier) functions as the second complementary
   layer for A.1. Per this PDR's first 2026-04-21 amendment, those
   reads are ritual-moment markdown-reading active layers. No
   dedicated "register surface" is needed or desirable — a
   standalone surface for "standing decisions" is a misc bucket
   that admits unclassified-decision debt rather than enforcing
   classification into the proper artefact homes (ADR / PDR /
   rule / principle / plan-local meta-decision). The host repo's
   `start-right-quick` / `start-right-thorough` (or equivalents)
   already name these foundation reads at Ground First step 1
   AND explicitly annotate them as the A.1 Layer-2 firing site,
   so the coupling is bidirectional — if the grounding order
   restructures, the annotation points back at this PDR for
   impact assessment.

#### Class A.2 — Agent-registration / identity discipline

Fires around thread join and session close. Protects the
additive-identity rule (PDR-027) from being degraded into
passive guidance.

**Required layers (default installs; host may override)**:

1. **Session-open identity-registration rule** — a canonical
   rule (`.agent/rules/register-identity-on-thread-join.md` or
   host equivalent) that fires before any edits and requires
   the agent to update `last_session` on a matching identity
   row or add a new row, per PDR-027.
2. **Session-close identity-update gate** — a **hard** gate
   inside `/session-handoff` (or host equivalent) that blocks
   session close if any thread the session touched has an
   un-updated `last_session`. The gate is backed by a scanner
   that **enumerates threads structurally from authoritative
   files** (continuity contract, thread records) and cross-
   checks against session activity. The scanner MUST NOT
   rely on self-reporting by the agent — self-reporting under
   context pressure is the passive-guidance failure mode the
   gate is installed to prevent.
3. **Platform-neutral stale-identity health probe** — a
   scanner that reads thread identity tables and reports
   identities whose `last_session` is older than a threshold
   (or whose thread has been archived but the identity
   remains), so stale state surfaces as a diagnostic rather
   than drifting silently.

Layers 1 and 2 must both install — rule plus gate is the
two-complementary-layers minimum. Layer 3 (probe) is additional
coverage for state that slips past both; its install is
required for compliance with this PDR.

### Platform parity (load-bearing)

**Any Family A rule** MUST land with:

- A **canonical** file at the host's canonical rule path.
- A **Claude adapter** (platform-loader path).
- A **Cursor adapter** with `alwaysApply: true` frontmatter.
- An **explicit citation** from the host's primary agent entry
  point (e.g. `AGENT.md § **RULES**` or equivalent) so
  non-loader platforms (Codex, Gemini, and any platform whose
  host does not auto-load a rule tier) see the rule at session
  open.

**Any Family A probe or scanner** MUST use **platform-neutral
inputs** — files, git state, frontmatter, or other surfaces
that are the same regardless of which agent platform is
running the probe. If a probe genuinely requires live session
state (e.g. current harness session id), it MUST provide
**cross-platform parity** (minimum: the set of platforms the
host targets). A probe whose inputs exist only on one
platform but whose conclusions assert cross-platform facts is
forbidden.

The platform-parity constraint is load-bearing, not cosmetic.
Without it, the firing-cadence guarantee degrades on the
unloaded platforms — which is where the `passive-guidance-
loses-to-artefact-gravity` pattern has already been observed
to produce the failure mode the tripwire is supposed to
prevent.

### Family B — Memory-taxonomy meta-tripwires

**Family B** covers the taxonomy-drift failure mode: the
memory taxonomy's seams may become the wrong seams over time.
Without a re-evaluation mechanism, the taxonomy fossilises and
host repos adopt it as given rather than re-ratifying it from
first principles.

**Required layers (default installs; host may override)**:

1. **Per-consolidation meta-check** — at every consolidation
   pass (see PDR-014 / host equivalent), the workflow asks:
   *"Did any content in this pass resist classification into
   one of the taxonomy's modes? Did any content fit multiple
   modes ambiguously?"* Resistance and ambiguity are signals
   that a seam may be in the wrong place.
2. **Accumulation-triggered seam review** — when ≥N patterns
   in a rolling window carry a `cross_plane: true` (or
   equivalent cross-mode) tag, the consolidation workflow
   surfaces the accumulation for owner review. High cross-
   plane pattern density signals that the planes are leaky
   and the taxonomy needs rework.
3. **Orphan-item signal** — pending-graduations register items
   whose `graduation-target` cannot name a clean home in the
   existing taxonomy are orphan signals. ≥N orphans in a
   rolling window escalates to a taxonomy-review session.

Family B tripwires fire less frequently than Family A by
design: taxonomy reviews are expensive and should only happen
when signals genuinely warrant. The three layers above produce
cumulative evidence rather than one-shot triggers.

### The three original perturbation mechanisms (promoted)

The three passive-register entries that motivated this PDR are
promoted from watchlist items to **doctrine-level mechanisms**,
provided they land with a Family A firing cadence. Each must
choose at least one layer from the tripwire catalogue:

- **First-principles metacognition prompt** — landed as Class
  A.1 Layer 1 (always-applied rule: plan-body-first-
  principles-check). Content matches the three-clause check
  above.
- **Standing-decision register surface** — **RETRACTED per the
  second 2026-04-21 Amendment Log entry.** The intent
  (owner-ratified decisions re-enter scope at every session) is
  served by the foundation-directive grounding read at session
  open; no dedicated register surface is authored. Items that
  had been placed in the retracted register decompose into ADR /
  PDR / rule / principle / plan-local homes.
- **Non-goal re-ratification ritual** — covered by the plan-body
  rule's shape clause (non-goals are a plan-body claim subject
  to the first-principles check) and the owner-beats-plan
  invariant in `principles.md` / repo-wide invariants. Not a
  separate layer.

### Self-application requirement

This PDR's own landing is a **two-phase event**: owner
ratification (the authoring bundle's review sitting) and
install (the scheduled perturbation-mechanism install session).
The PDR is compliant with its own doctrine only after the
second phase. Between ratification and install, the PDR is
passive guidance about passive guidance — a known exposure
window that the host's plan explicitly scopes and the install
session closes.

To prevent the exposure window from widening: the PDR names
Family A tripwires as mandatory installs with named firing
cadences and mandatory platform parity; the install session
MUST install the Family A Class A.1 rule (Layer 2 is satisfied
by existing foundation-directive grounding per the second
2026-04-21 amendment — no additional authoring needed), the
three Family A Class A.2 layers (as documentation walkthroughs
per the first 2026-04-21 amendment), and at least two Family B
layers in a single closure. Partial installs are non-compliant;
any install that slips the platform-parity requirement violates
the PDR, not just a plan acceptance criterion.

A future Core edit that proposes relaxing any of the required
layers must cite observed evidence that the omission is safe.
The burden is on the relaxer, not the installer.

## Rationale

### Why firing cadence beats rule content

The empirical observation across the source failure instances:
the rule content was correct in every case, and the firing
cadence was absent in every case. A perfectly written rule
that fires never is strictly worse than a messy rule that
fires always — the messy rule still surfaces the decision at
the right moment, at which point the agent can think. Firing
cadence is therefore the load-bearing property.

This inverts the typical design intuition ("write the rule
carefully; the firing will follow"). The correct design
intuition is "install the firing mechanism first; then iterate
on the rule content against observed firings".

### Why two complementary layers per class

A single tripwire has a single failure mode: the platform-
loader doesn't load it, the agent forgets to run the skill,
the scanner isn't invoked. Two complementary layers close the
single-failure-mode gap: if the rule is not loaded on a
platform, the scanner still runs; if the scanner is forgotten,
the rule still fires at session open.

One layer is better than none; two is the design target
because it produces a meaningfully different risk profile.
Three or more layers produce rapidly diminishing returns
against increasing maintenance cost — the cost of keeping
three layers in sync typically exceeds the marginal coverage
gain.

### Why platform parity is load-bearing

The `passive-guidance-loses-to-artefact-gravity` pattern has
already been observed producing the failure mode on non-loader
platforms (Codex, Gemini, and any platform whose adapter was
not yet installed). A tripwire that only fires on one
platform is a tripwire with a hole; agents running on the
uncovered platforms carry artefact gravity *and* lack the
firing cadence, which is exactly the combination the
tripwire was installed to prevent.

Platform parity is not a nice-to-have. It is the difference
between a tripwire that fires consistently and one that fires
selectively. Selective tripwires are worse than no tripwires
because they produce false confidence: the repo looks
protected, but sessions running on uncovered platforms bypass
the protection.

### Why Family B exists

Family A protects against failure modes *within* a memory
taxonomy; Family B protects against the taxonomy itself
becoming the wrong shape. The meta-level is not symmetric: a
Family A failure produces a bad decision in a single session
(observable, recoverable); a Family B failure produces a
*persistent mis-organisation* of the repo's memory that silently
degrades every Family A tripwire's signal-to-noise ratio
(unobservable until the taxonomy is torn apart and
reassembled).

Without Family B, a host repo can adopt a taxonomy today
(correct), let it drift over a year (imperceptible), and
attempt to extract patterns from accumulated memory (frustrated
because the seams are wrong). Family B surfaces the drift
before the accumulation problem becomes expensive.

### Why this must be portable

The artefact-gravity and taxonomy-drift failure modes are
properties of agentic engineering sessions, not properties of
any particular repo's tooling. A host-local doctrine would
solve the problem in one repo and leave other Practice-bearing
repos exposed. Portability is the mechanism by which the
extraction work done in one repo pays dividends across the
Practice.

### Alternatives rejected

- **Documented guidance only (the status quo this PDR
  replaces).** Rejected — the two patterns named in Context
  were both extracted from observations that documented
  guidance failed to fire.
- **Single-layer tripwires per class.** Rejected — single
  failure modes produce single failure points.
- **Platform-specific tripwires with no parity requirement.**
  Rejected — creates false confidence on the covered platforms
  and perpetuates the failure mode on the uncovered ones.
- **Automated perturbation (e.g. random re-ratification).**
  Rejected — the design priority is firing *at the right
  moment* (shape-entry, thread-join, session-close), not
  firing often. Random perturbation firing produces noise
  rather than signal.
- **Family B as a separate PDR.** Rejected — Family A and
  Family B share the tripwire design vocabulary and the
  platform-parity constraint. Splitting would duplicate the
  design language without clarifying the decision.
- **Three original mechanisms as a separate bundle.**
  Rejected — they are instances of Family A when landed with
  firing cadences; the bundle would duplicate Family A's
  structure.

## Consequences

### Required

- **Family A Class A.1** installs a minimum of two
  complementary tripwire layers (always-applied rule +
  read-trigger surface by default) with full platform parity.
- **Family A Class A.2** installs three required layers — two
  complementary (session-open identity-registration rule +
  session-close identity-update gate) plus one additional
  coverage (stale-identity health probe) — with full platform
  parity; the gate's scanner enumerates threads structurally
  from authoritative files and does not rely on agent
  self-reporting.
- **Family B** installs at least two meta-tripwire layers
  (per-consolidation meta-check + accumulation-triggered seam
  review, by default; orphan-item signal is optional).
- **Every Family A rule** carries canonical + Claude adapter +
  Cursor adapter + explicit agent-entry-point citation.
- **Every Family A probe** uses platform-neutral inputs or
  provides explicit cross-platform parity.
- **The scheduled install session** for this PDR lands all
  Family A and Family B layers in a single closure; partial
  installs are non-compliant.

### Forbidden

- **Passive-only countermeasures** — any response to an
  observed artefact-gravity failure mode that adds a register
  entry, non-goal, or README paragraph without installing a
  firing mechanism.
- **Single-layer tripwires presented as complete
  countermeasures** — a single layer is a starting point, not
  a compliant install.
- **Selective platform coverage** — a rule loaded on one
  platform with no canonical path or explicit citation on
  others.
- **Self-reporting scanners for safety-critical gates** — any
  gate protecting identity discipline, thread correspondence,
  or other state where agent recall under context pressure
  is the failure mode the gate is preventing.
- **Family B omission on hosts that have adopted a multi-mode
  memory taxonomy** — the meta-layer is mandatory for any
  host whose memory organisation this PDR applies to.

### Accepted costs

- **Install complexity.** A full bundle install touches
  canonical files, three platform-adapter paths per rule,
  session-open and session-close workflow surfaces, probe
  source, and probe unit tests. The cost is acknowledged
  and is the correct cost — passive countermeasures are
  cheaper but ineffective.
- **Platform-adapter drift risk.** Canonical/adapter parity
  must be maintained across platforms; a scanner
  (`portability:check` or equivalent) is required to prevent
  drift. The scanner itself is a scanner-class tripwire
  covering the tripwire-install integrity — a pattern that
  composes with the Family B accumulation signal.
- **Family B false-positive rate.** Cross-plane patterns and
  taxonomy-drift signals will sometimes produce false
  positives — cases where the seams are still right. The
  owner-review step on Family B escalations absorbs this
  cost; the signal is informational rather than gating.

## Notes

### Graduation intent

This PDR's Family A and Family B layers are candidates for
eventual graduation into `practice.md` (workflow / Knowledge
Flow sections) once the tripwires have been installed and
exercised across multiple cross-repo hydrations. Graduation
marks the PDR `Superseded by <Core section>` and retains it as
provenance. The platform-parity constraint is a strong
candidate for absorption into the canonical-first cross-
platform architecture doctrine.

### Composition with PDR-027 and PDR-028

- **PDR-027** defines the thread-identity discipline that
  Class A.2 protects. A Class A.2 failure is an identity
  failure against PDR-027's rules.
- **PDR-028** defines the executive-memory feedback loop; the
  Family B accumulation signal uses the plane-tag channel
  PDR-028 names.
- Together the three PDRs form a coherent set: PDR-027 names
  the continuity unit and identity schema; PDR-028 names the
  feedback channel for stable catalogues; PDR-029 names the
  mechanisms that keep both enforced environmentally rather
  than by agent recall.

### The bundle is self-applying

This PDR is itself a Core edit subject to the care-and-consult
discipline (PDR-003). It was authored by the primary
conversation agent (not a sub-agent), reviewed by the owner
before landing, and cites the patterns it extends. A future
Core edit that proposes relaxing any of the required layers
must cite observed evidence that the omission is safe — the
burden is on the relaxer, not the installer.

### Host-local context (this repo only, not part of the decision)

At the time of authoring:

- The Family A Class A.1 always-applied rule landed in a prior
  session at `.agent/rules/plan-body-first-principles-check.md`
  with Claude and Cursor adapters and
  `AGENT.md § **RULES**` tier citation.
- The Family A Class A.1 read-trigger surface
  (`.agent/memory/operational/standing-decisions.md`) is
  scheduled for Session 4 Task 4.1 of the staged doctrine-
  consolidation plan.
- The Family A Class A.2 layers are scheduled for Session 4
  Tasks 4.2.a (rule), 4.2.b (gate + scanner), and 4.2.c
  (health probe).
- The Family B layers are scheduled for the same Session 4
  (cross-plane scan extension in `consolidate-docs`,
  accumulation signal, orphan-item scan).
- The agent-names registry that Class A.2 consumes is
  captured as an infrastructure item in the pending-
  graduations register at
  `.agent/memory/operational/repo-continuity.md`.
- The `portability:check` scanner that keeps canonical /
  Claude / Cursor adapters in parity already exists and is
  required to pass on the Session 4 install.
