---
id: skill-classes-and-validation-jurisdiction
node_type: delivery
name: "Skill classes and validation jurisdiction: name the three classes, scope our validation to our own"
overview: "Name the estate's three skill classes (Practice, Vendor, User-facing) as first-class doctrine, scope the skills reconciliation sweep and the portability census to the Practice namespace only, and delete the vendor-lock compensation machinery — so our validation never adjudicates an external system again."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-12
ratified_where: "In-session four-card owner answer at the lane seat (Wren calls Downdraft 6b29b5), 2026-08-12 ~07:1xZ: 'Ratify — execute now' on the plan card, following the owner's taxonomy statement verbatim ('I have failed to name groups of things') and the inquiry that unwound MCP-567. Card text and answers in the session transcript; the commissioning words are the owner's 'once you have quantified the issue and written a plan to fix it, which includes clarifying ADRs and documentation so this NEVER happens again'."
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
owner_gates: []
last_updated: 2026-08-12
---

# Skill classes and validation jurisdiction

## Amendment — 2026-08-12 (PR #865 review round + owner ruling)

Two record defects, surfaced by the PR #865 review round (PR Review Warden) and
an owner ruling, are corrected in the body below (this note records the change;
the clauses themselves are re-trued inline so no misleading text survives):

- **Membership is by CONTENT marker, not prefix.** The owner ruled the `oak-`
  prefix configurable during implementation, so class membership is proven by
  the class marker each stub carries (`adapter-stub.ts`, structural
  recognition), never by a name pattern. The classification, Mechanism, and
  census are amended to the marker-based design; the prefix survives only as
  the generator's naming parameter.
- **`skills-lock.json` is external territory — retained, not deleted.** It
  belongs to the external skills tooling; we have no jurisdiction over it and do
  not read, validate, or reason about how it works. Only OUR compensation
  machinery is deleted; the file is kept untouched (owner ruling 2026-08-12: "if
  skills-lock.json is part of the external tooling for the external skills, why
  would we touch it?"; and 2026-08-12: "we don't care how the external
  management of skills works, only that it works — leave the external mechanisms
  alone"). Acceptance criterion 3 is corrected accordingly.

## Problem (measured 2026-08-12, all first-hand)

The estate holds three classes of skills but its machinery was built as if
there were one. Because the classes were never named, our validation claims
jurisdiction over content that belongs to an external system, violating
doctrine that already existed: testing-strategy.md line 59 — "NEVER test
external functionality, that is not under our control." Nothing here is new
policy; this plan applies existing policy to a surface that escaped it.

The measured facts:

- Each projection root (`.claude/skills/`, `.agents/skills/`) holds 62
  entries: 53 Practice projections (`oak-` prefix) and 9 Vendor skills
  (clerk×7, mcp-inspector, skill-creator). The Vendor entries are in the
  external skills CLI's own standard install layout — canonical copy at
  `.agents/skills/<id>`, symlink at `.claude/skills/<id>`, symlinks by
  default, project-scope installs committed with the repo.
- The reconciliation sweep (`pnpm skills:check` / `skills:generate`, in
  `pnpm check`) adjudicates EVERY entry at both roots and holds "any
  symlink is never a valid projection" — defining the external tool's
  standard install shape as a defect. The nine survive only via a
  homegrown lock exemption (`skills-lock.json` + `lockedIds` plumbing).
- Verified failure scenario: `pnpx skills add <owner/repo>` in this repo
  today → the next `skills:check` goes red (entry is neither `oak-`
  projection nor lock-pinned → "stale") and the next `skills:generate`
  DELETES the fresh install from both roots. Our validation actively
  destroys the sanctioned external machinery's output.
- The portability validator holds two further jurisdiction errors:
  `validate-portability.ts:159–165` validates `skills-lock.json`
  cross-references (adjudicating a Vendor-class artifact), and its
  permission census excludes the nine only by accident (symlink-blind
  directory listing), not by declared scope.
- Our compensation machinery total: 41 `lockedIds`/`skills-lock` references
  across 10 source files including a dedicated `lock.ts`; the portability
  validator's `skills-lock.json` cross-reference leg; ADR-125 §Externally
  installed skills asserting our jurisdiction over the class; one code comment
  citing a register that does not exist (`projection-roots.ts:21`).
  `skills-lock.json` ITSELF is not ours — it belongs to the external skills
  tooling and is out of our jurisdiction: left untouched, never read,
  validated, or reasoned about.
- Cost of the manufactured problem so far: the MCP-567 arc — a ticket
  minted and auto-closed without its work existing, an owner decision
  card built on a false frame, a worktree with 110 lines of red tests
  pinning machinery that should never be built, multiple review rounds,
  and ~30 minutes of owner time to unwind.

## The classification (owner's taxonomy, 2026-08-12, names verbatim)

| Class | What | Home | Lifecycle owner | Our validation jurisdiction |
| --- | --- | --- | --- | --- |
| **Practice skills** | Our skills about working with this repo and the Practice | `.agent/skills/` canonicals; projections at both projection roots recognised by the class marker in their stub | Our generator + validators | Full: projection reconciliation, frontmatter, permission census, portability |
| **Vendor skills** | External skills, installed with `pnpx skills` | Entries at the projection roots carrying no class marker, in the external CLI's layout | The external skills machinery | None. Our validators ignore these entries entirely: never adjudicated, never deleted, never permission-censused |
| **User-facing skills** | Skills we create, in this repo or another Oak repo, surfaced to external users via MCP, plugins, or `pnpx skills`. Two sub-classes today: curriculum skills (teachers), engineering skills (ed-tech engineers using our curriculum SDK) | `plugins/oak-open-curriculum/{skills,workflows}/` today (five SKILL.md files, curriculum sub-class); engineering sub-class not yet authored | Us, as product | Product-grade per validation-strategy assurance tiers (curriculum content is teacher-facing: Critical/Standard tier), not repo-projection machinery |

Class membership is mechanically determinable by CONTENT: the class marker in
each stub records its derivation from `.agent/skills/` (`adapter-stub.ts`,
recognised structurally). The `oak-` prefix is the generator's naming
parameter, not the class boundary — it is configurable, so it can never be the
membership test. Recognising by marker is what makes the jurisdiction rule
enforceable rather than aspirational.

## Mechanism (one PR)

1. **Scope the sweep to the Practice class.** The reconciliation in
   `projection-roots.ts` adjudicates only entries whose stub carries the class
   marker (structural recognition — `adapter-stub.ts`), at both roots. Entries
   without the marker are invisible to it — not exempted, not tolerated: out of
   jurisdiction.
2. **Delete OUR compensation machinery.** `lock.ts`, the `lockedIds`
   plumbing through `generator.ts`/`checker.ts`/`clear.ts`/the bin, and the
   `skills-lock.json` cross-reference leg in the portability validator. The
   false register comment dies with the code that carries it. `skills-lock.json`
   ITSELF is retained untouched — external territory (owner ruling 2026-08-12);
   our code simply stops reading, validating, or reconciling it.
3. **Scope the permission census intentionally.** The census demands
   `Skill(<name>)` entries for Practice projections selected by the class
   marker, replacing the accidental symlink-blindness that excluded Vendor
   entries by dirent kind. Unreadable state (any non-ENOENT failure) surfaces
   as a census issue, never a silent "no Practice skills".
4. **Red-proofs, committed with the change:**
   - A fixture Vendor-shaped install (non-`oak-` real directory AND
     non-`oak-` symlink) at each root is ignored by `skills:check` and
     preserved by `skills:generate`. This test is the mechanical
     never-again guard: it fails the moment any future change re-claims
     Vendor territory.
   - The Practice namespace is still fully reconciled (existing stale
     detection unchanged for `oak-` entries).
   - The census still reds on an unpermitted Practice skill and stays
     silent on Vendor entries.
5. **Doctrine, same PR:**
   - ADR-125 amendment: replace §Externally installed skills with the
     three-class taxonomy above and the jurisdiction rule (our validation
     governs Practice skills; Vendor skills belong to the external
     machinery; User-facing skills are product deliverables under the
     assurance tiers).
   - validation-strategy.md: a short §Validation jurisdiction clause —
     every validator names whose system it validates, and external-system
     content is never in scope — citing testing-strategy.md's existing
     "NEVER test external functionality" line as its ground.
6. **Records:** comment on MCP-567 stating the reversal outcome (no
   vendoring; superseded by this plan) so the Done ticket does not read
   as executed work; mint this plan's Linear ticket at pickup
   (ticket-first); remove worktree `mcp-567-vendor-symlinks` and its 110
   uncommitted red-test lines (mistake artifacts, discarded at owner word
   2026-08-12).

## Acceptance criteria (each with proof)

1. A Vendor-shaped install survives `pnpm skills:check` and
   `pnpm skills:generate` untouched — proof: the fixture red-proof pair
   above, plus a live probe against the real tree.
2. Zero `skills-lock`/`lockedIds` references in `agent-tools/src` —
   proof: grep count 0 (41 today).
3. OUR lock machinery is gone — `lock.ts` deleted, zero `lockedIds`/`skills-lock`
   references in `agent-tools/src` — while the external `skills-lock.json` is
   RETAINED byte-identical to `origin/main` (owner ruling 2026-08-12) — proof:
   `lock.ts` absent, grep count 0, `skills-lock.json` present and unchanged,
   `pnpm check` green.
4. ADR-125 names the three classes with their homes and jurisdiction;
   validation-strategy carries the jurisdiction clause — proof: diffs in
   the PR.
5. Practice-skill validation is unchanged: 53 projections reconciled,
   permission census green, `pnpm check` green end to end.

## Out of scope

- Authoring User-facing skills (curriculum or engineering sub-class) —
  its own arc at owner scheduling; this plan only names the class and its
  assurance tier so the next author starts classified.
- Any governance FOR Vendor skills (updates, drift, provenance) — that is
  the external machinery's job; building our own oversight of it would
  recreate this plan's problem.
- The five existing plugin SKILL.md files' content — classified here,
  not modified here.

## Why this cannot recur (the enforcement shape)

The recurrence channel was an unnamed class boundary: machinery written
for "skills" as one pile. After this plan: the taxonomy is doctrine
(ADR-125), the jurisdiction rule is strategy (validation-strategy), and
the boundary is mechanically guarded (the Vendor-fixture red-proof in the
suite fails any future re-claim). A green `pnpm check` thereafter is
evidence our validation exercised only our own territory.
