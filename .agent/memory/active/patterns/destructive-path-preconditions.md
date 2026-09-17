---
name: destructive-path-preconditions
polarity: pattern
category: code
use_this_when: >-
  Authoring or reviewing any code path that deletes, clears, overwrites, or
  irreversibly mutates state — especially a --clear/reset mode, a preflight
  guard for one, or a recogniser that decides destructive-scope membership.
proven_in: >-
  The PR #865 / MCP-570 cure arc (2026-08-12, four adjudicated review rounds
  over agent-tools/src/skills-adapter-generate): six confirmed
  destructive-path defects, each red-proofed before cure, plus the PR #851
  guard-the-node trio (2026-08-11). Full detail conserved in
  .agent/memory/active/archive/napkin-2026-08-14.md (2026-08-12 entries).
proven_date: 2026-08-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    Destructive paths shipped behind guards that answered a neighbouring
    question — four green gates and multiple review passes missed every one
    of these defects; only adversarial review with red-proofs surfaced them.
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure
> mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The disciplines, each paid for first-hand

1. **A destructive op's preconditions are derived from the op's own safety
   requirement — never inherited from an adjacent guard.** A surface-root
   guard that proves "these roots are real in-repo directories" answers a
   neighbouring question; `--clear` needed "cwd is the repo AND discovery is
   complete". Fold the destructive act behind the gate that proves ITS own
   precondition, structurally (the clear runs inside the discovery-complete
   gate), so a future edit cannot reorder them.
2. **A preflight guarding a destructive path must MIRROR every refusal the
   guarded op can raise, computed on the state that survives the op.**
   "The sole deterministic refusal vector" is a trap: enumerate every emit
   refusal site and map each to a preflight check. Even strong reviewers
   inherit the author's framing — tell the fresh round to ENUMERATE, not
   confirm.
3. **A recogniser deciding destructive-scope membership matches exactly what
   we EMIT, never a looser superset.** A stub recogniser accepting any clean
   multi-segment pointer made a foreign two-line file `--clear`-deletable;
   the cure single-sources the generated filename into the membership
   predicate.
4. **Guard the node itself and its ancestry, not only its children.** A
   containment check that inspects entries INSIDE carried roots but follows
   a symlinked root itself reads as coverage while the level above stays
   open. Ask what holds THE CHECKED THING, all the way up.
5. **Two readers of one data class share one error posture.** ENOENT-only-
   as-absence in one module beside swallow-all helpers in its sibling is a
   latent false-green: the sibling reads an unreadable root as "nothing
   here" and the destructive path proceeds.
6. **"Restored on disk" is not "in the commit tree."** A reinstated file
   that is untracked still merges as deleted, and every gate stays green
   because nothing reads it. Verify a retained/restored file with
   `git cat-file -t HEAD:<path>`, never `ls`.
7. **A red security check on a destructive path is cured, never
   documented away.** The threat-model judgment on a red gate belongs to the
   gate's owner, not the author mid-PR; when a prescribed cure is genuinely
   infeasible on the platform, verify that first-hand and route the bar to
   the owner with evidence — never silently dismiss, never blindly build.

## Review shape that surfaced all of this

Mechanically-green code (full check suite, thousands of tests) carried every
one of these defects. The instruments that caught them: adversarial reviewer
legs told to hunt a further vector, an independent reviewer with a DIFFERENT
threat model running the actual repro from outside the repo, and a
first-hand red-proof per finding before any cure (dispositions need verified
failure scenarios). On any surface with destructive or security-relevant
paths, that review is not ceremony over a green build — it is the only
instrument that exercises the paths the gates do not.

## Falsifier

A destructive-path defect of one of the seven shapes above shipping through
a review round that applied this pattern — that would mean the checklist
form has stopped biting and the class needs a structural gate (e.g. a lint
or validator over `--clear`-class entry points) rather than a longer list.
