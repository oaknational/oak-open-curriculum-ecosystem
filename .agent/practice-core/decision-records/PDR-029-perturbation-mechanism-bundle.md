---
pdr_kind: governance
---

# PDR-029: Perturbation-Mechanism Bundle

**Status**: Accepted
**Date**: 2026-04-21 (authored); 2026-04-21 consolidating rewrite
(see Amendment Log)
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
(grounding and framing — foundation-directive grounding required
at session open is NOT an A.1 tripwire layer, only ordinary
grounding; tripwires fire at shape-entry, thread-join, and
session-close in addition to grounding);
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

- **2026-04-21 Session 5 — consolidating rewrite (Pippin /
  cursor-opus; owner-ratified, TIER-2 "evaluate-and-simplify
  first" stage of the `memory-feedback` thread).** Three
  structural changes land in a single pass:

  1. The two 2026-04-21 Session-4 amendments ("*active means
     markdown-ritual, not code execution*" and "*Class-A.1
     Layer-2 retraction: foundation-directive grounding is the
     implicit Layer 2*") are **absorbed into the Decision
     section** — the body now states the decisions as-settled
     rather than as overrides of an earlier draft. Journey
     context (five-reviewer intent-review miss; platform-
     coupling critique; pattern candidates surfaced) is preserved
     in git history (`git log -p`) and in the 2026-04-21 napkin
     entries; the PDR body no longer carries it.
  2. **Class A.1 Layer-2 reclassification: foundation-directive
     grounding is background grounding, NOT an installed
     tripwire layer.** The Session-4 retraction amendment
     retrospectively named foundation grounding as A.1 Layer 2.
     Session 5 simplification rejects that framing: foundation-
     directive grounding is *ordinary session-open grounding*
     required by PDR-013; counting it as a tripwire layer
     retroactively satisfies a coverage target the A.1 install
     does not genuinely meet. Class A.1 now installs ONE
     tripwire layer (the plan-body-first-principles-check rule).
     The "two-complementary-layers" design target at §Tripwire
     concept is a default aspiration, not a universal
     requirement; A.1 is an acknowledged exception. Class A.2
     (three layers) is unchanged.
  3. **§Host-local context removed.** The PDR is portable
     doctrine (per PDR-003 Standing decision 2); host-specific
     install-state narratives do not belong in the portable
     body. Removed in this rewrite. Previous content has
     migrated to this repo's
     `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
     and plan-body surfaces where it was load-bearing.

  No semantic weakening of Family A Class A.2 or Family B; no
  change to platform parity; no change to Family A Class A.1
  rule content or firing cadence. The rewrite is a
  simplification against accumulated accumulation, not a
  doctrine shift.

  Related Session-5 register deltas recorded in
  [`.agent/memory/operational/repo-continuity.md`](../../memory/operational/repo-continuity.md):
  `plan-body-framing-outlives-reviewers` and `new-doctrine-
  lands-without-sweeping-indexes` demoted from `due` to
  `pending` under a tightened cascade-vs-independent promotion
  bar; six single-instance / distilled-absorbed pending entries
  deleted. The Family A tripwire set named here is also the
  set whose named near-term firing triggers are recorded at
  `repo-continuity.md § Session 5 close summary` per
  owner-directed delete-bias review.

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
families. Family A installs tripwires against the artefact-
gravity failure mode across two classes; Class A.1 installs one
layer (acknowledged exception to the two-complementary-layers
default), Class A.2 installs three layers. Family B installs
meta-tripwires against taxonomy drift (at least two layers).
All Family A tripwires operate under load-bearing platform-
parity constraints. All tripwire layers are satisfied by
markdown-ritual steps that name authoritative sources to read;
code is one possible implementation, not the default.**

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

### "Active" means markdown-ritual, not code execution (load-bearing)

**Any layer described in this PDR as "gate", "scanner",
"probe", or "active" is satisfied by a ritual-moment markdown
step that names the authoritative source to read and instructs
the agent to do so before proceeding.** The enforcement force
comes from the ritual's *"do not proceed until X"* obligation,
carrying the same authority as an `exit(1)` without platform
coupling. Code is **one possible implementation**, reserved for
work an agent cannot reasonably perform by reading markdown
(e.g. heavy cross-repo aggregation, complex parsing beyond
human readability). The default — and the requirement for
platform parity — is the markdown-ritual form.

**Structural enumeration** (e.g. the Class A.2 Layer 2 "MUST
NOT rely on self-reporting" clause) is satisfied by the ritual
step explicitly naming the authoritative file and instructing
the agent to read it. The authoritative file IS the structural
source; the instruction prevents self-reporting. Any agent on
any platform can perform the enumeration. A script that reads
the file is one implementation; it is not the principle.

**Why markdown-ritual is stronger than code under platform
parity**: markdown is the lowest common denominator every agent
infrastructure can read. A markdown ritual step is
platform-parity by construction; a code layer satisfies parity
only if the code runs on every target platform's runtime —
which is a stricter bar than the typical Node.js / Claude Code
assumption admits.

### Tripwire layer catalogue (from the Heath-brothers table)

The concrete layers available for tripwire installation. Every
row below refers to a **pattern of firing**, not an
implementation technology — per §"Active" means markdown-
ritual, the default form is a named ritual step in a markdown
workflow.

| Layer | Firing cadence | Example (markdown-ritual default; code optional) |
| --- | --- | --- |
| **Always-applied rule** | Session open (platform-loader) or read-at-grounding | `.agent/rules/<name>.md` + `.claude/rules/<name>.md` + `.cursor/rules/<name>.mdc` |
| **Read-trigger surface** | Explicitly named in the session-open grounding order | A short file that start-right-quick / start-right-thorough reads before work begins |
| **Skill / command invocation gate** | When the workflow is run | A named acceptance step inside a command (e.g. `/session-handoff` step 7c) naming the authoritative file to read |
| **Pre-commit hook / CI gate** | On commit or push | A repo-root script invoked by Husky or CI job (one of the few places code is genuinely required) |
| **Health probe / scanner** | On-demand or scheduled | A named ritual step that enumerates from authoritative files (e.g. `/jc-consolidate-docs` step 7c walkthrough). A CLI sub-command is one valid instantiation. |
| **Structural artefact constraint** | At artefact-authoring time | A schema or lint rule that fails fast if the structure is wrong |

A single tripwire is better than none; **two complementary
layers is the design target as a default aspiration**.
Complementarity means the layers cover disjoint failure modes
— e.g. rule + scanner, where the rule protects the authoring
path and the scanner catches any artefact that evaded the rule.
Class A.1 is an acknowledged exception: it installs one layer
because honest coverage for A.1 does not produce a genuinely
complementary second layer within the Practice's artefact
inventory (see Class A.1 below).

### Family A — Artefact-gravity tripwires

**Family A** covers the `passive-guidance-loses-to-artefact-
gravity` failure mode in its two observed classes:

#### Class A.1 — Plan-body inherited-framing (one required layer)

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

**Acknowledged exception to the two-complementary-layers
default.** Class A.1 installs a single tripwire layer. The
earlier draft of this PDR named foundation-directive grounding
(`principles.md`, ADR index, PDR index, `.agent/rules/` tier,
read at session open per PDR-013) as an implicit Layer 2;
Session 5 simplification rejects that framing because
foundation grounding is *ordinary session-open grounding
required by PDR-013 regardless of this PDR*, not a distinct
A.1 coverage layer. Retroactively counting background grounding
as tripwire coverage inflates the honest risk profile. The
delete-bias disposition: accept that A.1 has one layer; do not
scaffold a contrived second layer to satisfy the default
design target.

**Complementary coverage from other PDRs** (not A.1 layers, but
neighbouring enforcement that reduces A.1's single-layer risk):
PDR-013 (grounding discipline at session open); PDR-015
(reviewer dispatch discipline); PDR-027 (thread continuity
carrying the plan context); the owner-beats-plan invariant in
`principles.md`. A future doctrine addition that surfaces a
genuinely complementary A.1 layer (e.g. an orthogonal firing
cadence that fires at a different moment than shape-entry)
would amend this PDR.

#### Class A.2 — Agent-registration / identity discipline (three required layers)

Fires around thread join and session close. Protects the
additive-identity rule (PDR-027) from being degraded into
passive guidance.

**Required layers (default installs; host may override)**:

1. **Session-open identity-registration rule** — a canonical
   rule (`.agent/rules/register-identity-on-thread-join.md` or
   host equivalent) that fires before any edits and requires
   the agent to update `last_session` on a matching identity
   row or add a new row, per PDR-027.
2. **Session-close identity-update gate** — a hard gate inside
   `/session-handoff` (or host equivalent) that blocks session
   close if any thread the session touched has an un-updated
   `last_session`. Per §"Active" means markdown-ritual, the
   gate is a ritual-moment step in the handoff workflow that
   names the authoritative structural source (the active-threads
   table in the host's continuity file, plus each thread's
   next-session record) and walks the agent through enumeration
   and verification. The ritual MUST NOT rely on self-reporting
   by the agent; naming the authoritative file prevents
   self-reporting because any agent can read it. A code scanner
   is one valid implementation.
3. **Platform-neutral stale-identity health probe** — a ritual
   step (default) or scanner (optional) that reads thread
   identity tables and reports identities whose `last_session`
   is older than a threshold (or whose thread has been archived
   but the identity remains), so stale state surfaces as a
   diagnostic rather than drifting silently. Per §"Active",
   the default is a named ritual step in a consolidation
   workflow walking the agent through the check; CLI form is
   optional.

Layers 1 and 2 must both install — rule plus gate is the
two-complementary-layers minimum for Class A.2. Layer 3
(probe) is additional coverage for state that slips past both;
its install is required for compliance with this PDR.

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

Per §"Active" means markdown-ritual, markdown-ritual layers
are platform-parity by construction — they use the same
authoritative files that every agent reads at grounding. Code
layers must earn platform parity at the runtime level.

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

### The three original perturbation mechanisms (reconciled)

The three passive-register entries that motivated this PDR are
reconciled against the installed tripwire set:

- **First-principles metacognition prompt** — landed as Class
  A.1 Layer 1 (always-applied rule: plan-body-first-principles-
  check). Content matches the three-clause check above.
- **Standing-decision register surface** — **NOT installed.**
  The intent (owner-ratified decisions re-enter scope at every
  session) is served by ordinary foundation-directive grounding
  read at session open per PDR-013: `principles.md`, the ADR
  index, the PDR index, and the `.agent/rules/` tier. Adding a
  dedicated "standing decisions" surface admits unclassified-
  decision debt (a misc bucket) rather than enforcing proper
  classification into durable homes. Items that had initially
  been placed in a short-lived Session-4 register surface
  (subsequently retracted the same session) decompose into ADR
  / PDR / rule / principle / plan-local homes.
- **Non-goal re-ratification ritual** — covered by the plan-
  body rule's shape clause (non-goals are a plan-body claim
  subject to the first-principles check) and the
  owner-beats-plan invariant in `principles.md` / repo-wide
  invariants. Not a separate layer.

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
MUST install the Family A Class A.1 rule, the three Family A
Class A.2 layers, and at least two Family B layers in a
single closure. Partial installs are non-compliant; any install
that slips the platform-parity requirement violates the PDR,
not just a plan acceptance criterion.

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

### Why two complementary layers per class — and why A.1 is an exception

A single tripwire has a single failure mode: the platform-
loader doesn't load it, the agent forgets to run the skill,
the scanner isn't invoked. Two complementary layers close the
single-failure-mode gap.

One layer is better than none; two is the design target
because it produces a meaningfully different risk profile.
Three or more layers produce rapidly diminishing returns
against increasing maintenance cost — the cost of keeping
three layers in sync typically exceeds the marginal coverage
gain.

**Class A.1 is an acknowledged exception** because honest
coverage for A.1 does not produce a genuinely complementary
second layer within the Practice's current artefact inventory.
Foundation-directive grounding (read at session open per
PDR-013) is ordinary grounding, not a distinct tripwire
cadence. A "standing-decisions" misc bucket was briefly
installed in Session 4 as a Layer 2 candidate and retracted
the same session on owner metacognition; the retraction is
load-bearing for this PDR's honesty: scaffolding a surface to
satisfy a design target is worse than admitting the exception.
If a future observation surfaces a genuinely complementary
A.1 cadence, this PDR is amendable; until then, A.1 carries a
single layer and the complementary coverage is provided by
neighbouring PDRs (PDR-013, PDR-015, PDR-027, owner-beats-plan).

### Why markdown-ritual over code

Code layers bind a tripwire to a platform runtime — at minimum
Node.js, usually `pnpm`, often a specific harness. Any platform
without that runtime either has no protection or requires a
platform-specific port. This is the same failure mode as
passive guidance on non-loader platforms: selective coverage
producing false confidence on the covered platforms and
silently perpetuating the failure mode on the uncovered ones.

Markdown-ritual steps read the same authoritative files every
agent reads at grounding. Enforcement force comes from the
ritual's *"do not proceed until X"* obligation, which every
agent platform respects. The markdown form is therefore the
platform-parity-native default; code is a narrower
instantiation reserved for work an agent cannot reasonably
perform by reading markdown (heavy cross-repo aggregation;
parsing complex non-human-readable formats; CI/pre-commit
hooks whose firing cadence is itself code-bound).

The empirical trigger for this reframing: Session 4 of the
staged doctrine-consolidation plan initially drafted TypeScript
scripts + CLIs + unit tests for the Class A.2 Layer 2 gate and
Layer 3 probe. Five reviewers approved the script shape
without questioning it; a sixth reviewer read the close and
did not flag it. Owner metacognition intervention surfaced the
platform-coupling bias. The rewrite that followed (to
documentation walkthroughs) is now the canonical form; the
script form is an optional alternative whose burden of
justification rests on the implementer.

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
- **Single-layer tripwires per class *as a general rule*.**
  Rejected as a general rule (two layers is the default design
  target), but accepted as an acknowledged exception for
  Class A.1 where honest coverage does not produce a
  complementary second layer.
- **Platform-specific tripwires with no parity requirement.**
  Rejected — creates false confidence on the covered platforms
  and perpetuates the failure mode on the uncovered ones.
- **Code-based tripwires as the default form.** Rejected —
  platform-couples the tripwire to a runtime and degrades
  parity. Markdown-ritual is the platform-parity-native default.
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
- **Scaffolding a "standing-decisions" misc bucket to satisfy
  the A.1 two-complementary-layers default.** Rejected —
  installed briefly in Session 4 and retracted the same
  session on owner metacognition. The retraction is
  load-bearing: admitting the exception is honester than
  inventing a surface to satisfy coverage symmetry.

## Consequences

### Required

- **Family A Class A.1** installs **one required layer** — the
  plan-body-first-principles-check always-applied rule — with
  full platform parity. The two-complementary-layers default
  does not apply to A.1 (acknowledged exception; see Rationale
  and the §Class A.1 note).
- **Family A Class A.2** installs three required layers — two
  complementary (session-open identity-registration rule +
  session-close identity-update gate) plus one additional
  coverage (stale-identity health probe) — with full platform
  parity; the gate's ritual step names the authoritative
  structural source and does not rely on agent self-reporting.
- **Family B** installs at least two meta-tripwire layers
  (per-consolidation meta-check + accumulation-triggered seam
  review, by default; orphan-item signal is optional).
- **All tripwire layers** default to markdown-ritual form;
  code form is reserved for layers an agent cannot reasonably
  perform by reading markdown.
- **Every Family A rule** carries canonical + Claude adapter +
  Cursor adapter + explicit agent-entry-point citation.
- **Every Family A probe / scanner / gate** uses
  platform-neutral inputs or provides explicit cross-platform
  parity.
- **The scheduled install session** for this PDR lands all
  Family A and Family B layers in a single closure; partial
  installs are non-compliant.

### Forbidden

- **Passive-only countermeasures** — any response to an
  observed artefact-gravity failure mode that adds a register
  entry, non-goal, or README paragraph without installing a
  firing mechanism.
- **Single-layer tripwires presented as complete
  countermeasures outside of Class A.1** — a single layer is
  a starting point for most classes, not a compliant install.
  Class A.1 is the named exception.
- **Code-based tripwires presented as the required form** —
  code is one possible implementation; markdown-ritual is the
  default.
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
- **Scaffolding unclassified-decision misc buckets** (e.g. a
  "standing-decisions" surface) to satisfy a coverage target.

### Accepted costs

- **Install complexity.** A full bundle install touches
  canonical files, three platform-adapter paths per rule,
  session-open and session-close workflow surfaces, and ritual
  steps in multiple commands. The cost is acknowledged and is
  the correct cost — passive countermeasures are cheaper but
  ineffective.
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
- **Class A.1 single-layer risk.** Carrying an acknowledged
  exception is a cost; neighbouring PDRs (PDR-013, PDR-015,
  PDR-027) partially offset but do not eliminate it. If
  evidence accumulates that A.1's single-layer risk is
  materialising, this PDR is amendable to add a complementary
  layer. The cost is preferable to scaffolding a contrived
  second layer.

## Notes

### Graduation intent

This PDR's Family A and Family B layers are candidates for
eventual graduation into `practice.md` (workflow / Knowledge
Flow sections) once the tripwires have been installed and
exercised across multiple cross-repo hydrations. Graduation
marks the PDR `Superseded by <Core section>` and retains it as
provenance. The platform-parity constraint is a strong
candidate for absorption into the canonical-first cross-
platform architecture doctrine. The markdown-ritual-as-default
doctrine is a separable candidate for absorption into
PDR-009's canonical-first body or a dedicated Practice-Core
section on tripwire form.

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
