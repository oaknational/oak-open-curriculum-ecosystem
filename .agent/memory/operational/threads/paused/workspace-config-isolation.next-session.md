---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `workspace-config-isolation`

Thread identity: **`workspace-config-isolation`** — the config-boundary cure
lane: shared vitest/tsup/e2e config bases as a declared-dependency package
(`@oaknational/workspace-config`), the enforcement instruments, and the
de-hatching arc. Born from the `mutation-testing-core-canary` lane (the
Stryker sandbox's duplicate-config workaround exposed the violation class).
Controlling plan:
[`workspace-config-isolation.plan.md`](../../../../plans/delivery/workspace-config-isolation.plan.md)
(ratified 2026-08-11 with the same-day re-scope amendment in its frontmatter stamp; known-issues ledger inside). The canary plan is
archived (completed 2026-08-11) and todo 3 is complete — see the
Current Continuation below.

## Where the current state is

PAUSED 2026-09-06: no fork lane. The plan is the sequencing authority, never this record: its
2026-08-11 Amendment carries the execution order and the re-scoped S2 (MCP-543 as a named-edge
dependency-cruiser rule; the package stays a lib at the owner's word), and the pickup it names is
todo 2's de-hatch arc, the census todos 4 and 5, todo 6, S1b (the validator truth cures), the
vendoring-symlinks PR and the hardening node H1 → H2 → H4; the disabled-checks census lives in
`exemption-removal.plan.md`. Landed: #836 `SHA:d4e256294` (todo 1 and the dependency-cruiser
swap), #848 `SHA:bb40ecdf5` (todo 3; the canary complete), #850 `SHA:3afe99113` (S1, MCP-542)
and #865 `SHA:7685ac1ee` (MCP-570, skill validation jurisdiction; the last seat's queue then
advanced to bucket 1, `lesson-search-freshness-and-error-envelope`). MCP-573 (portability `--fix` writing
rule wrappers through a symlinked root; cure with the shared `surfaceRootGuardFailure`) is an Oak
Linear backlog ticket with no lane here.

The journal from 2026-08-09 to 2026-08-12 (the #836 landing and its packet, the depcruise swap
cycle, the 2026-08-11 freeze with the owner's card answers and the S2 contest, the #865 review
rounds and cures) was curated on 2026-09-20 by graduate, then archive. The whole pre-curation
record is preserved at
`.agent/memory/operational/archive/workspace-config-isolation-thread-2026-09-20.md`,
byte-identical to the record committed at `SHA:52c376002` (blob `cb81e2897`). It was read by the
split method (two analysts, the join by grep; the file runs newest first). Its lessons were found
homed before the move: the three owner rulings in `validation-strategy.md` §Right tool; the
dependency-cruiser capture-group containment in the plan and `never-disable-checks`; an empty
`COMMENTED` review excluded from a recount in `pr-lifecycle`; "never test external
functionality" in `testing-strategy.md`; an exemption in an enforcement surface as an alarm bell
in `exemption-removal.plan.md`; the three-consumer-classes lesson in the plan's ledger. The
rulings, the capability facts and the flagged bounds are kept below verbatim.

## Lessons with no other home (the record's words, 2026-08-11/12)

- The failure shape hunted in the S2 contest was symmetry-with-the-landed-cure posing as a
  warrant; the ladder is circular unless the problem claim is traced, and a "problem" that
  exists only relative to our own machinery's assumptions may be the machinery that is
  misconfigured (it was). Jargon defending a queue item ("provenance record") is the advocacy
  self-signal.
- A sweep cures first and registers second, so the register never becomes a warrant-shelf at
  scale; error findings get fixed, never warranted.
- A cure had to be committed, not only on disk: a file nothing reads is gate-invisible (`pnpm
  check` is green either way) and the merge would have deleted it.
- In code, fail closed: ENOENT is missing (genuine absence, proceed); any other error is not
  allowed (could not observe — surface, never swallow). In warrant, a review finding is a real
  gap to close (missing) or over-reach to decline (not allowed); where contested or infeasible
  the call routes to the owner with first-hand evidence.
- A bare-specifier libs fixture false-greens: unresolvable resolves to `npm-no-pkg`, and the rule
  matches `to.path`; the proof is `vitest list -c vitest.field-integrity.config.ts --filesOnly`
  diffed before and after, recomputed, never the array.

## Three owner rulings landed 2026-08-09 (all after ratification; all binding)

1. **Depcruise is the endpoint**: "I was hoping you would arrive at
   dependency cruiser for enforcing rules about dependencies."
2. **The swap happens inside #836**: "if we use regex it is because we are
   using the wrong tool… dep cruise is clearly the right tool for the job."
   The containment leg's regex scanner is REPLACED by dependency-cruiser
   rules before #836 lands (re-slice under PDR-132, no-stopgaps in view).
   Doctrine landed by the Director in validation-strategy.md §Gate integrity
   (dated "right tool" clause). The plan's todo 2 eslint framing reshapes the
   same way — the owner named that framing his own; no archaeology owed.
3. **ESM ruling**: "there should be ZERO require statements in this strictly
   ESM only repo. And dynamic imports are STRONGLY discouraged." →
   `require`/CJS dependency types forbidden estate-wide at error severity
   (presence IS the finding, no containment analysis); dynamic `import()`
   forbidden at error severity with a narrow, named, per-site recorded
   exemption set (warrant per site); no warn-tier rules. This retires packet
   blocker H1's analysis shape entirely.

## Depcruise capability facts (Director-pinned against the vendor rules reference, 2026-08-09 — conserved here because comms events are ephemeral)

- A `from.path` capture group is referenceable as `$1` in
  `to.path`/`to.pathNot` — workspace containment is ONE rule (from
  `^(packages/[^/]+/[^/]+)/…` config files, `to.pathNot ^$1/`), no
  per-workspace generation.
- `to.dependencyTypes ["unknown","undetermined","npm-no-pkg","npm-unknown"]`
  is built-in phantom-dependency detection — packet blocker H3's substance.
- `from.path` scopes rules to the config-file class directly.
- Dynamic `import()` and `require()` are first-class analyzed dependency
  types.

## Flagged inferences and bounds (do not inherit as facts)

- "Jim pressed update-branch on #836" is an INFERENCE from the merge
  commit's author/shape (`c265c1253`, Jim Cresswell, 14:14Z); the mechanism
  (UI button vs local) was not observed.
- The primary repo was SHALLOW (3 boundary entries) until this seat ran
  `git fetch --unshallow` on 2026-08-09; the origin of the shallow state is
  UNKNOWN — do not assume it cannot recur.
- The `claude[bot]` entry on #836 is a spend-limit skip notice (org overage
  cap), not a review. Copilot review attach still silently drops; retry at
  settle, never a blocker.
- The Codex addendum was absorbed into this record (addendum 2); no further
  addendum was expected at freeze, but check the PR comments at pickup.

## Participating agent identities (PDR-027)

| platform | model | agent_name | role | last_session |
|---|---|---|---|---|
| claude-code | claude-fable-5 | Wren calls Downdraft | implementer | 2026-08-12 |
