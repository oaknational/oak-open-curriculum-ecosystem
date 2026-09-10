---
id: agent-skills-detailed-scan
node_type: delivery
name: "Detailed scan of addyosmani/agent-skills — WS0 evidence, adoption shortlist, instrument costing"
overview: "Six-leg tiered scan of the addyosmani/agent-skills corpus: per-skill quality rubric, licence/provenance/supply-chain review of its executable artefacts, estate dedup matrix, WS0-evidence falsification, and a costed feasibility answer on rebuilding its tier-2 routing eval against our own corpus. Commissioned at owner card 2026-08-02 (full 6-leg scan)."
status: archived
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-03
---

# Detailed scan of `addyosmani/agent-skills`

## Disposition (archived 2026-09-03)

Archived at the owner's card word of 2026-09-03 with two of its four decision points
settled and the other two lapsed: (1) the pack is never installed as a Claude Code plugin,
in any environment ("No install, anywhere"); (2) nothing from it is vendored as files —
mechanisms are harvested and re-authored under this estate's own review ("Harvest
mechanisms, never vendor"); (3) and (4), the WS0 kind-axis evidence and the routing/collision
measurement, needed the scan's legs, which never ran after the 2026-08-02 commissioning
word and are dropped ("Drop the scan: archive the plan"). Anyone who later wants the
measurement re-commissions it fresh. Nothing below was executed.

**Predecessor:** the broad-and-shallow survey at
[agent-skills-addyosmani-survey-2026-08-02.md](../../research/wider-ecosystem/agent-skills-addyosmani-survey-2026-08-02.md),
which read 2 of 24 skill bodies in full and executed nothing.

## Objective

Decide three things, in this order, and produce the evidence each needs:

1. **Whether this corpus changes the WS0 structure deliberation.** The survey found two independent, validation-forced arrivals at a `kind` axis, and a documented failure mode for hoisting shared material out of a distributable bundle. Both are evidential and neither is yet grounded in the actual code — they rest on what the repository's own documentation claims. Confirm or falsify them against the artefacts.
2. **Which skills, if any, enter our estate through the external-skill class** — as vendored files, as harvested mechanisms folded into first-party skills, or not at all.
3. **Whether the tier-2 routing eval is worth rebuilding against our own corpus**, independently of any adoption decision. This is the highest-expected-value item in the repository and it is not a skill.

A scan that answers only (2) has missed the point. The survey's read is that the pack's value to us is mostly (1) and (3).

## Scan dimensions

### D1 — Per-skill quality rubric (applied to all 24)

Score each skill on axes we can defend, not on impression. Rubric, each scored with a quoted line as evidence:

- **Process-shaped or prose-shaped.** Does the body specify actions, or describe a stance? (Their own first writing principle; easy to fail silently.)
- **Falsifiable triggers.** Does "When to Use" give conditions an agent can evaluate, and does it name exclusions? `doubt-driven-development` gives five tests and a NOT-list; measure the rest against that bar.
- **Verification carries evidence.** Is every exit checkbox satisfiable by an artefact (test output, diff, trace), or does it bottom out in self-report?
- **Anti-rationalisation table quality.** Are the rebuttals arguments, or restatements of the rule?
- **Staleness exposure.** Count claims that are version-, vendor-, or ecosystem-dependent and carry no date or citation. This is the corpus's known weak axis: nothing inside a skill is dated or pinned.
- **Local wrongness.** Does the guidance contradict a standing rule of our estate? (Known already for `git-workflow-and-versioning` on commit format and branch lifetime, and `browser-testing-with-devtools` on unmetered browser use.)

Output: one row per skill, plus a shortlist of skills scoring high on the first four and low on the last two.

### D2 — Licence, provenance and supply-chain check

Three separable questions, of which only the first is settled:

- **Licence.** MIT, no CLA, contributions licensed inbound under the same. Settled by the survey; needs no further work beyond recording the attribution obligation for any vendored file.
- **Quoted third-party material.** The pack openly derives from *Software Engineering at Google* and Google's engineering-practices guide. MIT covers the maintainers' prose; it does not settle the status of substantial quoted material. Scan the shortlist for verbatim or near-verbatim passages from those sources.
- **Executable artefacts — the real gap.** `hooks/` ships seven shell scripts, including a session-start hook that injects the meta-skill into every Claude Code session, plus `sdd-cache-pre.sh`, `sdd-cache-post.sh` and `simplify-ignore.sh` (12 KB). `scripts/` ships five Node scripts including a 22 KB eval runner that invokes headless `claude` with `--permission-mode acceptEdits` and a pre-approved tool list. The Claude Code plugin install path runs these. **The survey performed no review of any of them.** Any vendoring decision, and certainly any install of the pack as a plugin, must be gated on this.

### D3 — Dedup-versus-our-estate matrix

The survey produced a by-name overlap table from memory of our corpus. Replace it with a grounded one:

- For each of the 24, name the first-party surface that covers the same ground, read that surface, and classify the relationship as **superseded by ours** / **complementary** / **genuinely uncovered** / **conflicting**.
- Read our surface before judging. A by-name match is not a coverage claim; the survey's table is a starting hypothesis, not a finding.
- Pay attention to the reverse direction: skills of theirs whose *absence* from our corpus is deliberate rather than accidental. `debugging-and-error-recovery` and `performance-optimization` have no first-party equivalent the survey could name, which is either a gap or a decision nobody wrote down.

### D4 — Adoption shortlist criteria

A skill qualifies for the external-skill class only if all four hold:

1. It covers ground no first-party surface covers, **or** it carries a specific mechanism ours lacks (the survey's read on `doubt-driven-development`).
2. Its guidance does not contradict a standing rule of our estate.
3. Nothing in it is ecosystem-bound in a way that makes it wrong here (their #404 workstream is de-npm-ifying the corpus; check whether the shortlisted files have landed that change).
4. It survives a pin: the pinnable unit is a commit or tag of the *whole repository*, since skills carry no individual version. A pin bump is therefore an all-or-nothing re-read of everything vendored, and the shortlist should be small enough that re-reading it on each bump is cheap.

Criterion 4 is the one most likely to change the answer. It argues for **harvesting mechanisms into first-party skills** over vendoring files, for anything we would otherwise have to re-review on every bump.

### D5 — WS0 evidence confirmation

Two specific claims from the survey to confirm against code rather than documentation:

- **The kind-axis claim.** Verify in `scripts/lib/skill-lint.js` that `using-agent-skills` and `idea-refine` are literally name-exempted from section checks, and in `scripts/run-evals.js` that `kind: execution | dialogue` selects the graded artefact. If both hold, the claim that a kind axis was forced twice by validation is grounded. If either is a documentation overstatement, say so — it weakens the strongest evidence the survey found.
- **The bundle-boundary claim.** Read issue #361 and confirm the per-skill-install failure is real rather than theoretical, and read `docs/skill-anatomy.md`'s shared-references rationale against what the repository actually does.

### D6 — The tier-2 instrument, assessed on its own terms

Read `scripts/run-evals.js` and `scripts/lib/skill-lint.js` in full and answer: what would it cost to run an equivalent rank-1-and-collision measurement over our own skills corpus, and what would it tell us? Report the answer as a number of days and a sample of what it would output, not as an opinion about whether routing matters.

## Fan-out shape

Six legs, tiered by the stance each requires rather than uniformly.

| Leg | Reads | Stance and tier | Effort |
|---|---|---|---|
| **A. Quality sweep, part 1** | 12 SKILL.md bodies in full, D1 rubric | classification within a fixed rubric — Sonnet | ~12 files, mechanical |
| **B. Quality sweep, part 2** | the other 12 SKILL.md bodies, D1 rubric | as A — Sonnet | ~12 files, mechanical |
| **C. Security and supply chain** | all of `hooks/` (7 scripts), all of `scripts/` (5 files), the four plugin manifests | adversarial, security-expert lens — Opus | small surface, high care |
| **D. Estate dedup** | the 24 descriptions plus every first-party surface named in the survey's overlap table | judgement against our own corpus, needs estate context — Opus | the largest reading load; our side, not theirs |
| **E. WS0 evidence** | `skill-lint.js`, `run-evals.js`, `evals/README.md`, `docs/skill-anatomy.md`, issues #361 and #351 | frame-challenging: try to falsify the survey's two claims — Opus | small, precise |
| **F. Instrument feasibility** | `run-evals.js` in full, our own skills corpus for shape | design judgement — Opus | scoped to a costed answer |

Legs A–C and E read only their repository and can run concurrently from a shallow clone taken at dispatch. Leg D reads our estate and is the long pole. Leg F depends on E's read of the same file — sequence F after E, or merge them.

Do not fan out further than this. The corpus is 24 files and 671 KB; more legs would be reviewers reading each other's leftovers.

**Frame-challenger.** One leg (E) is explicitly tasked with falsifying the survey's headline evidence rather than extending it. The survey was written by one agent from two full file reads; its strongest claims are the ones most worth attacking.

## Decision points for the owner

Four, each with the scan's job stated so the decision is not returned as a menu.

1. **Do we install the pack as a Claude Code plugin at all, in any environment?** This runs their hooks on our machines. Recommendation: no install until leg C reports. The scan's job is to make this a settled yes or no, not to leave it open.
2. **Vendored files or harvested mechanisms?** Criterion D4.4 (whole-repo pinning, no per-skill versions) pushes toward harvesting. The scan's job is to say what we would lose by harvesting rather than vendoring, per shortlisted skill.
3. **Does the WS0 kind axis stand on this evidence?** Leg E either grounds the two-independent-arrivals finding or reduces it to a documentation claim. WS0 should not absorb it before then.
4. **Do we build a routing/collision measurement for our own corpus?** Independent of every other decision here. Leg F returns a cost and a sample output; the owner prices it.

## Explicit non-goals

- **Not a verdict on whether their skills are better than ours.** The dedup matrix classifies relationships; it does not rank corpora.
- **Not a rewrite of WS0.** This scan supplies evidence to a live deliberation. It does not propose a structure.
- **Not an adoption of their anatomy.** Their six-section pattern, their `SKILL.md` naming, and their flat layout are observations about a repository with 24 skills, one distribution model and no stratum. Nothing here recommends copying them.
- **Not a fork, mirror, contribution, or issue filed upstream.** Read-only throughout. If leg C finds something security-relevant, that becomes its own decision, not a reflex disclosure.
- **Not a survey of the wider skills ecosystem.** Superpowers and `mattpocock/skills` are named in their `docs/comparison.md` and stay out of scope; if the owner wants the comparison, that is a separate piece of work.
- **Not an evaluation of their eval results.** We do not need to know whether their rank-1 rate is really 86%. We need to know what the instrument measures and what it would cost us.
