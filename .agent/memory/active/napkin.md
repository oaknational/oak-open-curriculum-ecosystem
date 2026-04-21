# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

## 2026-04-21 distillation — napkin rotated from Session 2 of the staged doctrine-consolidation plan

### Rotation record

- **Archive**: outgoing napkin (1611 lines, 2026-04-19 through 2026-04-21
  arc) moved to
  [`archive/napkin-2026-04-21.md`](archive/napkin-2026-04-21.md).
- **Distilled merge**: five new high-signal entries added to
  `distilled.md` — durable-doctrine-states-the-why,
  workflow-scope-≡-continuity-unit-scope, dry-run-before-recipe,
  platform-neutral-probe-inputs, self-applying-acceptance. Source
  line updated.
- **Register deferral**: many single-instance watchlist observations
  from the outgoing napkin are captured structurally in the
  pending-graduations register rather than duplicated into
  distilled. The register schema is being formalised in Session 2
  Task 2.2 (this session).
- **Already-graduated (Session 1, 2026-04-21)**:
  - Pattern `inherited-framing-without-first-principles-check` —
    authored at
    [`patterns/inherited-framing-without-first-principles-check.md`](patterns/inherited-framing-without-first-principles-check.md)
    (six instances cited).
  - Pattern `passive-guidance-loses-to-artefact-gravity` — authored at
    [`patterns/passive-guidance-loses-to-artefact-gravity.md`](patterns/passive-guidance-loses-to-artefact-gravity.md)
    (three instances cited).
  - First Family-A tripwire rule at
    [`../../rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md)
    with Claude + Cursor adapter parity.
  - `practice.md` Artefact Map refreshed for the three-mode memory
    taxonomy.
  - Six Standing decisions recorded in `repo-continuity.md § Standing
    decisions`.
- **Promotion-ready at next consolidation** (three-instance
  threshold reached; captured in the register for Session 3
  graduation decision):
  - `in-place-supersession-markers-at-section-anchors` (3 instances).
  - `fork-cost-surfaces-in-doc-discipline-layer` (3 instances).
  - `E2E-flakiness-under-parallel-pnpm-check-load` (3 instances —
    name a test-stability lane).
  - `reviewer-catches-plan-blind-spot` (≥2 instances).

### Session 2 close (2026-04-21) — landed 3/3; session-scoped observations

**Landed**: Tasks 2.1–2.3 all landed. 2.1 — napkin rotated to
`archive/napkin-2026-04-21.md`, distilled merged (5 new entries),
fresh napkin (60 lines). 2.2 — register schema formalised in
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
(four status bands: graduated / due / pending / infrastructure; ~30 items). 2.3 — `session-handoff` gained step 7 (register
refresh + thread-record identity update) with `consolidate-docs`
step 7 preamble naming the register as an input.

**Surprise — owner re-scoped identity question to infrastructure.**
When asked whether to assign `agent_name` ad-hoc, owner responded
by specifying the durable mechanism (a ~1000-name registry, well-
distributed by geography/culture/time period, multi-source research,
no LLM-generation). The response expanded Session 4 scope without
disrupting Session 2. Captured as `graduation-target: infrastructure`
in the register; Session 4 consumes it. No pattern extraction yet
(single instance of *"owner answers an identity question by
specifying the durable mechanism"*); watch for second instance in
a future session.

**Self-applying observation — the session-handoff amendment I
drafted in Task 2.3 fires on this session's own close.** Step 7b
requires updating `last_session` on the thread-record identity row
at session close; Samwise's row is already updated from session
open (same date as Session 1 because today is 2026-04-21). The
amendment is thus self-applying by construction on its install
session. Consistent with `self-applying-acceptance-for-tripwire-
installs` pattern candidate; third instance would promote it.

**What to watch for in Session 3**: when the Session 3 doctrine
bundle drafts the Perturbation-Mechanism Bundle PDR (Task 3.3),
the `platform-parity-as-probe-prerequisite` and
`workflow-scope-alignment-to-continuity-unit-scope` register items
should be absorbed — check whether they land as PDR substance or
remain separate; the register's `status: due` entries for both are
waiting on Session 3's drafting slot.

### Session 2 extended scope (2026-04-21) — onboarding-reviewer surfaced reliability gaps in Session 2's own installs

**Surprise**: owner dispatched `onboarding-reviewer` at Session 2
close to audit whether the installed systems (register + session-
handoff step 7 + consolidate-docs step 7 preamble) would apply
reliably for a fresh agent with no special instructions. The
audit found P0 and P1 gaps: the additive-identity rule is not on
the cold-start path (`start-right-quick` step 4 does not name
`threads/`); step 7b assumes thread recall under context pressure;
`.agent/rules/` tier is invisible on Codex/Gemini because
`AGENT.md § **RULES**` only cites `principles.md`. Session 1's
already-landed plan-body-first-principles-check rule is already
affected by the last issue.

**Why this matters**: the reviewer's findings apply the
`passive-guidance-loses-to-artefact-gravity` pattern to Session 2's
own installs, one level up from plan-body inheritance to cold-
start discoverability. Session 2 is the second consecutive session
(after Session 1) where an extracted pattern fired against the
session's own work — *self-applying-acceptance-for-tripwire-installs*
pattern candidate now has three informal instances (Session 4
Task 4.2.a rule-install self-application; Task 4.2.b script-gate
self-application; Session 2's own installs surfacing gaps). Still
cautious on formal promotion — Session 4 is where the first two
land as acceptance criteria; the third is a capture-layer
observation that the reviewer did not target.

**Landed this extension (owner direction "do a and b and c now")**:

- `.agent/directives/AGENT.md § **RULES**` now cites the
  `.agent/rules/` tier (urgent fix; affects Session 1's rule on
  Codex/Gemini).
- Register gained 5 new Due items targeting Session 4 Tasks 4.2.a
  (start-right-quick amendment + legacy path handling),
  4.2.b (structural thread enumeration), 4.2.c (sixth probe
  check), plus `passive-guidance-pattern-citation-in-distilled-
  and-start-right` as a pending item for next consolidation.
- Staged plan Session 4 Tasks 4.2.a/b/c amended with scope
  additions, new acceptance criteria numbered, and inline notes
  crediting the reviewer audit.

**Pattern candidate — `reviewer-audit-at-install-close-catches-
cold-start-gaps`**: dispatching an onboarding / discoverability
reviewer at session close of an install session surfaces the
exact cold-start failure modes the install was supposed to
prevent, because the install session has perfect contextual
knowledge that a fresh agent does not. Single instance (this
session). Promotion-ready on second instance of an install
session where a cold-start audit identifies gaps the install
itself did not anticipate. Related to `self-applying-acceptance`
(this is the review-layer counterpart: the install session is
too close to its own installs to see them as a fresh agent
would). Captured in the napkin; not added to the register yet
(single instance, watchlist only).

---
