## 2026-04-19 — Napkin rotation after deep consolidation pass

Rotated at 533 lines after a structural-change-heavy window covering
four commits on the observability strategy restructure (2e0be715 Phase
4, f1f2c259 status markers, 7f5b18e7 5-wave reshape, 2e8a140d physical
reorder) plus parallel ChatGPT research normalisation work. Archived
to [`archive/napkin-2026-04-19.md`](archive/napkin-2026-04-19.md).

High-signal entries absorbed this rotation:

- **Patterns extracted** (three new files in
  [`.agent/memory/patterns/`](patterns/)):
  - `stage-what-you-commit.md` — 2 cross-session instances (2026-03-24
    + 2026-04-19). Git index is durable state between edits; inspect
    `git diff --cached` before committing.
  - `foundations-before-consumers.md` — owner-approved. Multi-emitter
    plans must land foundations (schemas, ESLint rules, extracted
    cores) in earlier waves than their consumers, or every consumer
    retrofits. Related: `warning-severity-is-off-severity`.
  - `collapse-authoritative-frames-when-settled.md` — owner-approved.
    Document-structure-layer instance of the no-smuggled-drops
    principle: multiple authoritative frames for the same concept are
    a drift trap; "transitional dual-frame with sunset note" is
    unstable.
- **Distilled additions**:
  - Forward-pointing planning references need "planned, not yet code"
    markers (watchlist; single instance pending cross-session
    validation).
- **Step 7 graduations applied**:
  - `@ts-expect-error` distilled entry **refined** (owner chose
    refine-and-keep) to emphasise the test-design-specific scope
    distinct from PDR-020's RED-phase framing.
  - `All gates blocking, no "pre-existing" exceptions` distilled
    entry **graduated to PDR-025 Quality-Gate Dismissal Discipline**
    (owner-approved). Distilled entry pruned; PDR-025 pointer added
    to the distilled pointer block.
- **Step 8 Core amendment applied**:
  - `practice-lineage.md` Active Learned Principle
    `Compressed neutral labels smuggle scope and uncertainty`
    **extended** (owner-approved) to cover the document-structure
    layer as a third sibling alongside review and planning layers.
    Paired with the new `collapse-authoritative-frames-when-settled`
    pattern as the concrete application.

**Plans and prompts touched this rotation**:

- `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`
  — Status line + Phase 3 todo note corrected to reflect completion;
  Phase 4 todo note extended with the three post-Phase-4 hardening
  commits (status markers; 5-wave reshape; physical reorder).
- `.agent/practice-core/decision-records/README.md` — PDR-025 entry.
- `.agent/practice-core/CHANGELOG.md` — 2026-04-19 entry recording
  PDR-025, principle extension, pattern authorship, fitness limit
  raises.
- `.agent/practice-context/outgoing/README.md` — future-PDR
  reservations shifted +1 (PDR-025 claimed by Quality-Gate Dismissal;
  fitness-functions / transfer-operations / merge-methodology /
  practice-maturity reservations now 026–029).

**Fitness state at rotation closure (post step 9)**:

- **Core trinity limits raised modestly** per owner direction
  ("raise somewhat, not totally; defer full refinement and
  reflection of the Core to another session"):
  - `practice-bootstrap.md`: target 590 → 680, limit 750 → 830,
    chars 31000 → 40500.
  - `practice-lineage.md`: target 590 → 680, limit 725 → 830,
    chars 36000 → 48500.
  - `practice.md`: chars 23000 → 29000 (lines unchanged at 375/500);
    prose-line-width violation at line 201 fixed by wrapping.
- **Post-raise strict-hard state**: 3 hard items (AGENT.md,
  principles.md, testing-strategy.md) — matching the known-deferred
  directives; no new hard violations introduced. Trinity files now
  soft-zone, not hard.
- **Deferred to future session**: full refinement and reflection of
  the Core trinity (compression, graduation, split decisions);
  remediation of the three deferred directives.
- `distilled.md` final at ~253 lines (soft zone, target 200, limit
  275) after prune + refine + watchlist-add.
- `napkin.md` starts fresh at this rotation record.

**Previous rotation**: 2026-04-18 at 557 lines →
[`archive/napkin-2026-04-18.md`](archive/napkin-2026-04-18.md).

---

## 2026-04-19 — Agentic corpus discoverability review

### Patterns to Remember

- `AGENT.md` already points to ADRs generally (starter block, ADR index, and a
  few specific ADR anchors), but that is not the same as surfacing the
  practice-specific ADR cluster explicitly. If the intent is "agentic doctrine
  should be impossible to miss", add a dedicated practice-ADR cluster rather
  than assuming the general ADR entry path is enough.
- `.agent/reference/README.md` currently omits
  `agentic-engineering/workbench-agent-operating-topology.md`, and there is no
  `agentic-engineering/README.md`. A source corpus can exist without becoming
  discoverable; directory-local indexes matter.
- `docs/README.md`, `docs/foundation/README.md`, `docs/governance/README.md`,
  `docs/engineering/README.md`, `docs/architecture/README.md`, and
  `docs/explorations/README.md` already form a useful human-facing discovery
  mesh. A future agentic hub should index these as source/discovery surfaces
  rather than trying to replace them.
