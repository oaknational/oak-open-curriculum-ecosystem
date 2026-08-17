## Onboarding / lived-practice review: `docs/governance/development-practice.md`

**Scope**: `.claude/worktrees/identity-switchboard-pr2/docs/governance/development-practice.md` (426 lines, 22,040 chars) and its inbound/outbound estate. All path claims verified against the worktree checkout, not the main one — note the worktree copy carries a 60-line `### Mutation testing — method and tooling` section that does not exist on the coordination branch (`git log` shows it landed at `3c7124be7`, 2026-08-13).

**Status**: GAPS FOUND. Two P1s, both of which will make an agent or newcomer do the wrong thing today.

---

### How the document is actually reached

It is a genuine hub, not a leaf. Eleven distinct live routes reach it, covering every audience:

| Audience | Route |
|---|---|
| Human contributor | `README.md:272`/`:474` → `CONTRIBUTING.md:97` and `:459` |
| Human, docs-first | `README.md:142` → `docs/README.md:82` (§Code Standards and Testing) |
| Human, governance-first | `README.md:132` → `docs/governance/README.md` — **item 1 of the declared "5-minute reading path"** |
| AI agent | `.agent/directives/AGENT.md:227` — the `[development]` target of "Core practice" in §Essential Links |
| AI agent, deep-linked | `.agent/directives/principles.md` at lines 159, 162, 163 — three section anchors |
| Reviewer subagents | `.agent/sub-agents/templates/architecture-expert.md:42` and `docs-adr-expert.md:46`, both in mandatory reading tables |
| Lateral | `docs/architecture/README.md:92`, `docs/foundation/agentic-engineering-system.md:141`, `docs/engineering/build-system.md:535`, `docs/governance/sonar-disposition-policy.md:670` |

The three anchors from `principles.md` are the sharpest evidence of what is load-bearing: `#architecture-level`, `#documentation-practice`, and `#gate-taxonomy--nine-complementary-layers`. Those three sections are addressed as targets by the doctrine layer; everything else in the file is reached only by whole-file read. All three anchors resolve correctly against the current headings.

---

### P1 — The warn-first ESLint clause was superseded five weeks ago and still stands

Lines 260-266 say a brand-new custom ESLint rule "may start at `warn` only while its violation surface is being designed and triaged." `git blame` dates this to 2026-05-26.

`.agent/practice-core/decision-records/PDR-126-gates-land-strict-in-one-landing.md` (Accepted **2026-07-08**) exists specifically to kill this. Its §Context names the exact target:

> The estate accumulated warn-tier enforcement surfaces: a lint rule landed at `warn` over a frozen violation-allowlist … and **a "new rules start at warn" authoring convention**.

Its Decision point 3 is unambiguous: "If the estate cannot be brought conformant in one landing, the gate does not land yet."

`.agent/rules/never-disable-checks.md` §Reviewer cadence then wires it to enforcement, and anticipates precisely the escape route this clause offers:

> The same hard reject covers the LANDING-time shape: a NEW gate arriving at `warn` … violates PDR-126 (gates land strict, in one landing) — **a new rule is not a "weakening" diff, so this clause names it explicitly.**

So an agent that reaches `development-practice.md` through AGENT.md's "Core practice" link and reads §Refactoring Principles will land a new rule at `warn`, and `config-expert` is instructed to hard-reject it on sight. The document was edited twice after PDR-126 landed (2026-07-30 `c89ce0fae`, 2026-08-13 `3c7124be7`) and the clause survived both. Nothing in the rule corpus links back here, so there is no mechanism by which it would have been caught.

The clause is also nearly self-cancelling on its own terms: it ends "normal quality gates still require zero warnings", which means a warn-tier rule that fires breaks the gates anyway.

### P1 — The Quality Gates section is not the estate's gate set, and never names `pnpm check`

The section (lines 18-32) lists seven commands plus `test:e2e`, and prescribes them "after all major changes, and before each commit". Every command resolves as a root script. The problem is what is absent.

`pnpm check` — the canonical aggregate — runs a 22-step sequence including `secrets:scan`, `repo-validators:check`, `knip:gate`, `depcruise`, `subagents:check`, `portability:check`, `skills:check`, `encoding:check`, `lint:shell`, and the widget/UI/a11y test tiers. Three other live surfaces all name it as canonical:

- `docs/architecture/architectural-decisions/121-quality-gate-surfaces.md` — "`pnpm check` is the canonical aggregate gate and the most comprehensive"
- `CONTRIBUTING.md:334` — "`pnpm check` # Canonical full verification gate"
- `.agent/skills/gates/SKILL-CANONICAL.md` — "This sequence corresponds to the current `pnpm check` script — the canonical aggregate local proof gate"

`development-practice.md` names neither `pnpm check` nor ADR-121, anywhere.

Worse, it prescribes as *gates* three commands the gates skill explicitly disqualifies as evidence. The doc lists `pnpm lint:fix`, `pnpm format:root`, and `pnpm markdownlint:root` as gates to run before each commit; `.agent/skills/gates/SKILL-CANONICAL.md` closes with:

> Use mutating repair commands such as `pnpm lint:fix`, `pnpm markdownlint:root`, or `pnpm format:root` only to fix a failing proof, then re-run the proof sequence from the beginning. **Do not treat mutating repair commands as final evidence that the tree is clean.**

There are now four gate lists in the live estate (this doc, `start-right.md:473`, `gates/SKILL-CANONICAL.md`, and ADR-121's coverage matrix), and this is the only one that is both incomplete and mutating-command-based. It is also the one linked from `principles.md` as the taxonomy's home.

The forward reference at lines 33-35 ("follow directive-defined one-gate-at-a-time runs from the grounding directives/prompts first") carries no link, and the phrase "one-gate-at-a-time" appears nowhere else in the live corpus outside archived plans — the reader is sent to an unnamed destination.

### P2 — Three command tokens in the gate taxonomy do not resolve

Verified against root `package.json` scripts, all workspace `package.json` files, and `turbo.json` tasks (`sdk-codegen build clean dev dev:widget dev:widget-in-host lint lint:fix test mutate test:widget test:e2e test:ui test:a11y test:widget:ui test:widget:a11y type-check`):

- Layer 1 names `format` and `markdownlint`. The real names are `format:root`/`format-check:root` and `markdownlint:root`/`markdownlint-check:root`. Neither bare form exists as a script or a turbo task.
- Layer 5 names `smoke`. No `smoke` script exists in any workspace and no `smoke` turbo task exists. The nearest live thing is `agent-tools:smoke:collaboration-tui`.

This matters more than a typo because the taxonomy is the deep-link target from `principles.md:499`, which routes readers here for "the per-layer scope and tooling".

### P2 — The stash guidance is materially weaker than the rule that replaced it

Line 300 reads "Prefer `git worktree` over `git stash` for baseline comparisons — stash risks lost work". `.agent/rules/never-use-git-to-remove-work.md` (landed 2026-05-03) opens by making that a hard prohibition keyed on tree state, and its worked instance is this exact scenario:

> Worked instance (2026-07-26): a seat stashed an hour of uncommitted cures to observe a baseline warning count … the rule never fired because the seat had filed it under "destructive operations" and framed the stash as measurement.

An agent reading the governance doc gets a preference; the rule treats the same act as risk-class NO. The doc is the weaker ancestor and was never re-trued.

### P2 — `CONTRIBUTING.md` mis-describes what is in here

`CONTRIBUTING.md:459` advertises the doc as covering "functions, testing, error handling, ESM conventions". A case-insensitive search for `esm|module system` in the document returns nothing, and testing is a single line in §Related Documentation deferring to `testing-strategy.md`. A contributor who follows that signpost for ESM guidance finds nothing and has no onward pointer (the actual home is `.agent/rules/source-is-typescript-esm-only.md`, unlinked from here).

### P2 — The freshness stamp is stale and unenforceable

The body carries `**Last Updated**: 2026-07-04` (line 11), but the file was modified on 2026-07-30 and 2026-08-13. Sibling governance docs use `last_reviewed` **frontmatter** (`safety-and-security.md`, `DATA-SOURCES.md`, `sonar-disposition-policy.md`, `README.md`); this doc's frontmatter carries only the five fitness fields, so no validator reads the stamp and nothing would have caught the drift.

### P2 — §Analysability has no route to the operative policy

The section discusses CodeQL/Sonar/lint disposition at length. `docs/governance/sonar-disposition-policy.md` (34KB, the actual class-level disposition policy) links *to* this document at its line 670. This document does not link back. A reader who accepts the "fix-first is the default disposition" doctrine has no route to the policy that operationalises it.

### P2 — The new mutation section's method is portable, but landed in the repo-bound home

This one is worth flagging because the section states the test and then fails it. Lines 84-91 declare the division of labour: "this section is the repo-bound elaboration — **tooling wiring and worked instances live here, the portable method there**", where "there" is `.agent/directives/validation-strategy.md`.

Steps 1-5 of the hand-picked discipline (lines 92-112) contain nothing Oak-specific — pick one mutant per claimed failure mode, apply it as a forward file edit from a driver script holding the original text, run the narrowest judging suite, read the direction honestly including the inverted case, record in the commit body. That is portable method by the section's own definition. Meanwhile `validation-strategy.md` — the declared formal home — carries exactly one sentence on mutation testing (line 21: "Mutation testing (Stryker) is the meta-quality layer that makes test coverage meaningful"). The declared home was never furnished; the method landed in the repo-bound doc instead.

The Stryker half (lines 120-141) is by contrast correctly placed and fully accurate — I verified every claim: root `mutate` = `turbo run --continue mutate`; `@oaknational/type-helpers` is the only workspace with a `stryker.config.mjs` and a `mutate` script; `stryker.config.base.ts` exists at root with the vitest runner and `coverageAnalysis: 'perTest'`; and the exemplar's header does record which fields deliberately differ and why.

### P2 — The new section's evidence chain has a broken hop

Line 139 cites owner doctrine as "recorded in the canary plan and the exemplar config". The canary plan is named neither by path nor by link, and it has been archived to `.claude/worktrees/identity-switchboard-pr2/.agent/plans/delivery/archive/mutation-testing-core-canary.plan.md`. The exemplar config the same sentence points at still cites the pre-archive path:

```text
packages/core/type-helpers/stryker.config.mjs:4
 * (`.agent/plans/delivery/mutation-testing-core-canary.plan.md`).
```

That path no longer resolves, and the same stale path appears in four further files under `packages/core/type-helpers/mutation-evidence/`. Because both citations are prose/JSDoc rather than markdown links, neither `validate-markdown-links` nor `validate-reference-direction` will catch them. Worth noting that a *linked* citation from this doc into `.agent/plans/` would be a durability violation under PDR-105 — `agent-tools/src/validators/reference-direction/validate-reference-direction-helpers.ts` classifies `docs/governance/` as `repo-doctrine` and `.agent/plans/` as `ephemeral`. The prose form evades the gate while retaining exactly the defect the gate exists to prevent.

### P3 items

- Lines 14 and 49 state the same prohibition twice ("NEVER disable checks of any kind, ever." / "NEVER disable any quality gates or Git hooks."), and it is stated a third time as a full rule at `.agent/rules/never-disable-checks.md`, which this doc does not link to.
- The mutation subsection sits under `## Quality Gates` while its own closing sentence says the mutation score "is evidence, never a gate — no threshold gates anything". Placement implies gate status the text then denies.
- `docs/governance/README.md` carries `last_reviewed: 2026-04-19` and its Contents list omits three files that exist in the directory: `problem-hiding-patterns.md`, `typescript-gotchas.md`, `logging-guidance.md`. `problem-hiding-patterns.md` is reachable from only two places in the whole live corpus — this document and `principles.md` — so the body link at line 168 is load-bearing for that file's discoverability.

---

### Would a newcomer following only this document work correctly?

No, in three specific ways. They would run seven commands and believe the tree is proven, missing the secret scan, the whole static-analysis layer, every repo and docs validator, and all browser-test tiers. They would treat `lint:fix` output as evidence. And if they wrote a custom ESLint rule, they would land it at `warn` and have it rejected.

They would work correctly on the parts that are unique to this document and have no competing home: §Error Handling (the Result-type discipline, cause chains, `void promise`, distinct HTTP semantics), §Design Principles Code Level, §Coordination Topology, §Code That Generates Code Is Product Code, and the bulk of §Documentation Practice's markdownlint field notes. These are the sections doing real work that nothing else covers.

### What the evidence of use says about the structure

I am reporting this without a splitting recommendation in either direction, per the framing.

The edit history is the most informative signal. Of 25 commits touching the file, the recent run is almost entirely memory-graduation traffic: `docs(practice): disposition memory-drain batch c-2/c-5/c-16/c-17/c-20`, `docs(practice): graduate napkin entries to patterns, frictions register, dev-practice`, `docs(practice): dedicated-pass graduations`. The file is functioning as a **graduation sink** — the destination where distilled active memory lands when it needs a permanent home. Line count by commit: 277 (2026-05-27) → 284 → 289 → 292 → 307 → 318 → 326 → 333 → 344 → 350 → 366 (2026-07-30) → 426 (2026-08-13). Monotonic; it crossed its own 280-line limit on 2026-06-09.

Two structural asymmetries follow from that history and are visible in the artefact:

**Inbound is section-addressed; outbound is not.** Three sections are deep-linked by anchor from the doctrine layer. The whole file has only five inline markdown links and one reference definition. There are **zero links from this document into `.agent/rules/`**, despite at least four of its clauses being separately operationalised there (`never-disable-checks`, `never-use-git-to-remove-work`, `replace-dont-bridge`, `markdown-code-blocks-must-have-language`). The prose layer and the enforcement layer are not wired together in this direction, which is the mechanism by which both P1s went stale: PDR-126 and `never-use-git-to-remove-work` had no path back to the clauses they superseded.

**The "5-minute reading path" claim no longer holds.** `docs/governance/README.md` presents this as item 1 of a four-item, five-minute orientation. At 22,040 characters it is roughly 3,500 words — fifteen to twenty minutes on its own, before the other three items. That claim is falsified by the current artefact regardless of what is done about it.

### Suggested sequence for whoever acts on this

1. Delete or re-true the warn-first clause against PDR-126, and the stash clause against `never-use-git-to-remove-work.md`. These are the two that cause wrong action today.
2. Fix `format`/`markdownlint`/`smoke` in the taxonomy, and decide what §Quality Gates should say now that `pnpm check` and ADR-121 exist — the current list is the only one of four that disagrees with the others.
3. Correct the `CONTRIBUTING.md:459` description, add the `sonar-disposition-policy.md` backlink, and move the `Last Updated` stamp into `last_reviewed` frontmatter so a validator can see it.
4. For the new mutation content: name and link the canary plan (currently archived), and fix the stale plan path in `packages/core/type-helpers/stryker.config.mjs` and the four `mutation-evidence/` files. Separately, the portable-versus-repo-bound placement of steps 1-5 is worth an owner call, since `validation-strategy.md` is a declared home that has stayed a stub.

Delegations worth flagging: `config-expert` for the gate-list and command-token reconciliation against ADR-121 and `pnpm check`; `test-expert` for whether the hand-picked mutation method belongs in `validation-strategy.md`.