---
name: "Fitness System: Closure & Role-Routing"
overview: "Settle the recurring 'continuity record at prose-width hard' question into durable doctrine: the fitness system is one philosophy with two halves — closure (measure every content-bearing surface, declared in frontmatter, or the unmeasured one becomes the gaming drain) and role-routing (a budget overage routes to the structural cure the surface's role implies — graduate for memory, decompose-for-value for plans, bound-for-anti-gaming for frontmatter — never trim or shard for score). Then apply it: extend the continuity disposition doctrine, add a separate frontmatter budget, author record-type templates, and curate the four prose-width-hard records to rest by homing substance (never reflowing for the number)."
todos:
  - id: ws0-name-the-principle
    content: "WS0 (doctrine, highest value): Name the Closure & Role-Routing principle as durable Practice doctrine (PDR-shaped — how the fitness system is designed), and amend ADR-144 for the host mechanics it adds (frontmatter budget metric; role-routing of overages). docs-adr-expert review."
    status: pending
  - id: ws1-disposition-and-roles
    content: "WS1 (doctrine): Extend continuity-practice.md §Disposition (a limit-hit on a surface is a role-appropriate curation/restructure trigger; graduate/decompose — never trim, reflow, or shard for score; tighten the 'however large' clause; name cross-file redundancy as a sprawl channel) and §Surface Roles (positive-routing 'not-for' destinations, never negation-tombstones; per-file one-line purpose + type-role kept once, keyed by merge_class). docs-adr-expert review."
    status: pending
    depends_on: [ws0-name-the-principle]
  - id: ws2-frontmatter-schema
    content: "WS2 (schema): Define the frontmatter fields — `purpose` (one line) + this-file routing deltas, and a SEPARATE `fitness_frontmatter_char_limit` (its own smaller budget, distinct from the body char budget). Document them and apply to the continuity record-types. The separate budget self-enforces 'don't duplicate the type-role into every file's frontmatter'."
    status: pending
    depends_on: [ws1-disposition-and-roles]
  - id: ws3-record-templates
    content: "WS3 (templates): Author record-type templates — operational continuity index, thread next-session record, retired-record banner-stub — encoding the frontmatter fields, the purpose/routing block, and the structural conventions, so every NEW record starts on-role and self-grounding."
    status: pending
    depends_on: [ws2-frontmatter-schema]
  - id: ws4-curate-four-records
    content: "WS4 (apply): Curate the four prose-width-hard records to rest per the new doctrine — graduate finished content to permanent homes, relocate mis-placed detail to the right surface, add the purpose+budget frontmatter. Reconcile repo-continuity's uncommitted no-throw change. Retire agent-collaboration-research to a compact stub (insight already homed in PDR-094/ADR-199/reports) and move its live ~1,707-event curator work-list to a live home. Substance is homed, never reflowed for the number."
    status: pending
    depends_on: [ws1-disposition-and-roles, ws2-frontmatter-schema]
  - id: ws5-validator-frontmatter-budget
    content: "WS5 (delegated → agent-tooling/, enforcement): Implement the separate frontmatter char-budget metric in agent-tools/practice-fitness (classify the frontmatter block, measure it, zone it, surface it in the report) — TDD, test-expert + config-expert review. Lands AFTER the doctrine; doctrine delivers value without it."
    status: pending
    depends_on: [ws2-frontmatter-schema]
  - id: ws6-plan-todo-routing
    content: "WS6 (doctrine): Name the plan-todo routing — a plan's item-count overage routes to agile value-decomposition (independently-shippable vertical slices), NEVER a split that merely lowers the count (estate-fragmentation guard). Enable plans to declare an item-count budget (reuse item-count.ts). One mechanism (frontmatter-declared budget), surfaced uniformly."
    status: pending
    depends_on: [ws0-name-the-principle]
---

# Fitness System: Closure & Role-Routing

**Status**: ACTIVE (opened 2026-06-20, Finch binds Halo, thread
`agentic-engineering-enhancements`).

This plan is the backbone for a jointly-designed (owner + agent) resolution of a
recurring signal: four long-lived continuity records sitting at prose-width
`hard`. The investigation found the records were never the problem — they were the
symptom that surfaced a gap in how the fitness system describes itself.

## The unifying principle

The fitness system is not N independent metrics. It is **one philosophy with two
halves**:

1. **Closure.** Measure every content-bearing surface — or the unmeasured one
   becomes the drain content is pushed into to game the measured ones. The triad's
   own history is this principle discovered one leak at a time: cap words → agents
   write long words; cap lines → long lines; cap line-length → the body is bounded
   but the *frontmatter* is not. Closure is operationalised by each surface
   **declaring its budgets in frontmatter**, including frontmatter's own budget —
   the one recursion that makes the system self-describing. Adding an unmeasured
   content-bearing surface is a defect by construction.
2. **Role-routing.** A budget overage routes to the structural cure the surface's
   *role* implies, never to trimming or sharding for score:
   - **memory / continuity** → graduate finished or mis-placed substance to its
     permanent home (knowledge conserved by *moving*, never by deletion);
   - **plans** → decompose into independently-valuable increments (agile vertical
     slices); a genuinely atomic large plan keeps its count, which itself flags
     big-bang risk to weigh;
   - **frontmatter** → stop dumping; reference the doctrine home instead.

The anti-gaming guard transfers across all surfaces: **never split, shard, reflow,
or trim to change a number.** For memory that means graduate-don't-trim; for plans
it means value-decomposition, never count-driven sharding (which fragments the
estate — a worse failure than the fat plan).

The grounding facts (verified first-hand against the validator generator,
`agent-tools/src/practice-fitness/markdown.ts`): the prose-width metric already
excludes frontmatter, code, table rows, and link-reference lines, and strips inline
link targets and URLs before measuring — so the flagged lines are *genuine* long
prose, and "make the metric table-aware" was already done. Fitness also never
blocks a build (`run.ts` returns 0; modes govern report framing only) — so this is
a signal-honesty and knowledge-flow question, not a gate-pressure one. How the
system works today is not a constraint; the goal is documents that stay useful and
effective because they are not allowed to sprawl, with good agent experience and
effective knowledge transfer.

## Sequencing — by the agile principle this plan itself adopts

Value-first, eating our own dogfood (WS6): the **doctrine ships first** (WS0–WS1)
because it settles the recurring protocol and delivers value with no code. The
**schema and templates** (WS2–WS3) make new records correct. **Curation** (WS4)
applies it to the four records. The **validator enforcement** (WS5) and
**plan-todo routing** (WS6) follow — each independently shippable, none blocking
the doctrine.

## Acceptance

- The Closure & Role-Routing principle exists as durable doctrine, reviewer-cleared.
- `continuity-practice.md` §Disposition and §Surface Roles carry the curation-trigger
  doctrine, the tightened live-disposition, positive-routing not-for, and the
  cross-file-redundancy channel.
- The frontmatter `purpose`/routing fields and the separate frontmatter char budget
  are defined, documented, and present on the continuity record-types.
- Record-type templates exist for the three continuity record shapes.
- The four records are curated to rest by **homed substance** (verified in its
  permanent home), not by reflow; repo-continuity's no-throw change is committed.
- The frontmatter-budget validator metric is implemented (TDD) in agent-tooling.
- Plan-todo overage routing is named, with the no-shard-for-score guard.

## Guards (explicit)

- No reflow-for-score, no split/shard-for-score, no estate-fragmentation.
- Knowledge preservation is absolute: the cure is graduation/decomposition, never
  deletion or compression of substance.
- Not-for lists are positive routing (destinations), never negation-tombstones.
- The frontmatter budget is *separate and smaller* than the body budget, so proper
  metadata never competes with body content.

## Estate boundary

Doctrine, principle, templates, and curation live here
(`agentic-engineering-enhancements/`). The validator code change (WS5) is the
`agent-tools/` workspace and is delegated to `agent-tooling/` per this collection's
scope boundary; it is coordinated, not owned, here.

## Reviewers

`docs-adr-expert` (doctrine, PDR/ADR amendments), `test-expert` + `config-expert`
(validator metric), `assumptions-expert` (plan proportionality and blocking
legitimacy).
