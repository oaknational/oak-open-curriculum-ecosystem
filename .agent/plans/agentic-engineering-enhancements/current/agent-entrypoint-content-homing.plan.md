---
name: "AGENT Entrypoint Content Homing"
overview: >
  Move non-entrypoint detail out of .agent/directives/AGENT.md into
  durable homes without losing content or making concepts harder to find.
todos:
  - id: phase-0-ledger
    content: "Phase 0: Build a source-to-target content ledger for AGENT.md."
    status: completed
  - id: phase-1-targets
    content: "Phase 1: Confirm durable homes and discovery paths."
    status: completed
  - id: phase-2-home-content
    content: "Phase 2: Move or merge detail into target homes."
    status: completed
  - id: phase-3-slim-entrypoint
    content: "Phase 3: Slim AGENT.md into an index/entrypoint."
    status: completed
  - id: phase-4-validate
    content: "Phase 4: Validate discovery parity, fitness, and links."
    status: completed
isProject: false
---

# AGENT Entrypoint Content Homing

**Last Updated**: 2026-04-24  
**Status**: COMPLETED
**Scope**: `.agent/directives/AGENT.md` and only the durable homes needed
to preserve its displaced concepts.

---

## Completion Notes

Completed on 2026-04-24. The source-to-target ledger is stored at
[`2026-04-24-agent-entrypoint-content-homing-phase0-run-001.evidence.md`](../evidence/2026-04-24-agent-entrypoint-content-homing-phase0-run-001.evidence.md).

AGENT now acts as an entrypoint/index and is fitness-healthy. Owner direction
expanded the execution to clear the remaining hard fitness excessions in
`principles.md` and `testing-strategy.md`; those follow-on edits are recorded
in the thread continuity surfaces rather than treated as original AGENT scope.

Follow-up review restored valid transferred knowledge and corrected incorrect
details before closeout: broken target-home links, stale commit-skill anchors,
platform entrypoint layering, command catalogue drift, red-spec gate wording,
E2E/smoke IO doctrine, and the stricter no-read/no-write `process.env` rule.
`pnpm check` was run; it failed only in streamable-http `smoke:dev:stub`,
`test:a11y`, and `test:ui` because `VERCEL_GIT_COMMIT_SHA` is missing for
Sentry release resolution.

## Context

`.agent/directives/AGENT.md` is fitness-hard at `312 / limit 275`.
Its declared split strategy says: "Extract detail to referenced docs;
this file is an index/entry point." The current content confirms that
intent: AGENT is the front door for agents, not the permanent home for
reviewer catalogues, command catalogues, artefact authoring detail,
commit mechanics, or repo topology.

The owner constraint is stronger than normal compression:

- no content can be lost;
- concepts must be no harder to find than before;
- preferably concepts should be easier to find.

This plan therefore treats AGENT remediation as **content homing**, not
trimming.

## Goal

Restore AGENT to an entrypoint/index role while preserving every
concept in a durable home and improving discovery paths.

Success means:

- every current AGENT section has a recorded disposition: keep,
  move, merge, or retire-as-duplicate;
- every moved concept has a durable target and a backlink or clear
  index path from AGENT/start-right/navigation;
- AGENT is below its hard fitness limit, ideally near target;
- no live reference to AGENT-only content becomes orphaned;
- a cold-start agent can still discover the same concepts at least as
  easily as before.

## Source Doctrine

- [PDR-014 knowledge artefact roles](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
- [Orientation layering contract](../../../directives/orientation.md)
- [ADR-125 agent artefact portability](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [ADR-127 documentation as foundational infrastructure](../../../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)
- [Knowledge-role documentation restructure plan](knowledge-role-documentation-restructure.plan.md)

## Non-Goals

- Do not rewrite AGENT tone or doctrine beyond what is needed for role
  clarity.
- Do not delete unique content.
- Do not create new homes when an existing durable home already fits.
- Do not move platform-adapter policy without checking ADR-125 and the
  artefact inventory.
- Do not opportunistically fix unrelated hard fitness pressure in
  `principles.md` or `testing-strategy.md`.

---

## Phase 0: Source-to-Target Ledger

**Intent**: Prove that no content will be lost before moving anything.

Create a temporary execution ledger, either in the plan closeout notes
or an evidence file under `.agent/plans/agentic-engineering-enhancements/evidence/`.
For each AGENT section and paragraph cluster, record:

| Source | Concept | Disposition | Target | Discovery path |
|---|---|---|---|---|
| AGENT line/section | What the content teaches | keep / move / merge / retire duplicate | Durable home | How a cold-start agent finds it |

Candidate dispositions:

- **Keep**: session-open invariant or front-door link.
- **Move**: unique detail belongs in a durable role surface.
- **Merge**: concept already exists elsewhere but AGENT has sharper wording.
- **Retire duplicate**: content is fully covered elsewhere and AGENT should
  link to that home.

**Acceptance criteria**:

1. Every heading in AGENT has a disposition.
2. Every non-heading paragraph is covered by a ledger row or explicit
   heading-level row.
3. No row uses "delete" without naming the duplicate durable home.
4. The owner can review the ledger before content is removed from AGENT.

**Validation**:

```bash
nl -ba .agent/directives/AGENT.md
pnpm practice:fitness:informational
```

## Phase 1: Durable Home Confirmation

**Intent**: Confirm targets before moving text.

Likely target homes:

| Content cluster | Likely durable home |
|---|---|
| Reviewer timing, roster, invocation detail | `.agent/memory/executive/invoke-code-reviewers.md` |
| Agent tool command catalogue | `agent-tools/README.md` |
| Artefact authoring and adapter architecture | `.agent/memory/executive/artefact-inventory.md`, `docs/engineering/extending.md`, ADR-125 |
| Development command list | `docs/engineering/build-system.md` |
| Commit mechanics | `.agent/skills/commit/SKILL.md` |
| Repo package topology | root README or `docs/architecture/README.md` |
| Memory and pattern detail | `.agent/directives/orientation.md`, memory READMEs, patterns README |
| Essential links | AGENT keeps short trigger-based index |

**Acceptance criteria**:

1. Every target is a durable role surface under PDR-014.
2. If a target is soft or hard in fitness, the move has a split or
   compression path.
3. No moved concept lands only in a plan or transient note.
4. Navigation surfaces that should point at the new home are named.

## Phase 2: Home Content

**Intent**: Move or merge detail into target homes while preserving
meaning.

Work in small batches:

1. Reviewer/sub-agent content.
2. Agent tools and artefact architecture content.
3. Development commands and commit discipline content.
4. Memory/patterns and essential-link content.
5. Repo topology content.

For each batch:

- paste or merge the AGENT concept into the target home first;
- preserve sharper AGENT wording where it adds value;
- add links from target home back to AGENT only when AGENT remains the
  entrypoint;
- update the ledger row to "homed".

**Acceptance criteria**:

1. No AGENT detail is removed before its durable home exists.
2. Target homes read naturally and do not become dumping grounds.
3. Moved content is no harder to discover from AGENT, start-right, or
   the relevant index.
4. Markdownlint passes for touched files after each batch.

## Phase 3: Slim AGENT into the Entrypoint

**Intent**: Make AGENT a compact front door.

AGENT should retain:

- read-this-first instruction;
- grounding stance and collaboration pointer;
- Practice and orientation pointers;
- first question;
- cardinal schema rule;
- principles/rules tier;
- sub-agent/reviewer pointer, not catalogue;
- memory and pattern pointer, not catalogue detail;
- essential links as trigger-based index;
- pnpm-only and quality-gate posture;
- commit skill pointer;
- short repo-shape pointer if still necessary;
- GO/regrounding reminder.

AGENT should not retain:

- long reviewer roster;
- exact agent-tools command catalogue;
- full development command list;
- detailed commit-hook mechanics;
- artefact authoring detail already covered by inventory/extending docs;
- stale-prone counts such as exact number of patterns.

**Acceptance criteria**:

1. AGENT remains self-sufficient as an entrypoint.
2. AGENT is below the hard fitness limit.
3. AGENT's split strategy still describes its actual role.
4. Every removed detail has a ledger target and a working link path.

## Phase 4: Discovery Parity and Validation

**Intent**: Prove the owner constraints.

Run discovery checks:

```bash
rg -n "sub-agent|reviewer|agent-tools|commit|Development Commands|patterns|artefact|pnpm check|sdk-codegen|GO" \
  .agent docs agent-tools README.md CONTRIBUTING.md
pnpm exec markdownlint .agent/directives/AGENT.md
pnpm markdownlint:root
pnpm practice:vocabulary
pnpm practice:fitness:informational
```

Preferred final gate:

```bash
pnpm check
```

If a docs-only closure uses a narrower gate set, record the constraint,
evidence, and residual risk in the closeout notes.

**Acceptance criteria**:

1. Every ledger row is marked homed, kept, or retired-as-duplicate.
2. Every target path exists and links resolve.
3. AGENT is no longer hard in fitness.
4. No new hard fitness pressure is introduced.
5. Concept discovery is at least equal to before; record examples for
   the most important moved concepts.
6. `/jc-consolidate-docs` runs after closure so any new role insight
   graduates properly.

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Content is lost during slimming | Source-to-target ledger before any removal |
| Concepts become harder to find | Discovery path column plus post-move `rg` checks |
| Target docs become bloated | Home by role; split target if fitness pressure rises |
| AGENT becomes too terse to orient agents | Keep stance, authority, and trigger links in AGENT |
| Platform instructions conflict | Check ADR-125, artefact inventory, and adapter docs before edits |
| Plan duplicates broader doc-role restructure | Keep this plan scoped to AGENT; route broader family changes to the knowledge-role plan |

## Foundation Alignment

- **Substance before fitness**: move full concepts first, then manage
  line pressure.
- **Documentation as infrastructure**: broken discovery is a defect,
  even if markdown renders.
- **First Question**: prefer links to existing homes over new surfaces.
- **Strict and complete**: every source concept needs a target
  disposition.
- **Owner direction beats plan**: if the owner marks a concept as
  essential in AGENT, keep it and route other content instead.

## Completion Criteria

This plan is complete when:

1. AGENT is restored to an index/entrypoint role.
2. All displaced content has durable homes.
3. The ledger proves no content was lost.
4. Discovery parity is checked and documented.
5. Fitness, markdown, vocabulary, and agreed final gates pass.
6. The learning loop is closed through `/jc-consolidate-docs`.
