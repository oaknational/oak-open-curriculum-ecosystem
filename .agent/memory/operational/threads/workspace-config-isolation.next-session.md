# Next-Session Record — `workspace-config-isolation`

Thread identity: **`workspace-config-isolation`** — the config-boundary cure
lane: shared vitest/tsup/e2e config bases as a declared-dependency package
(`@oaknational/workspace-config`), the enforcement instruments, and the
de-hatching arc. Born from the `mutation-testing-core-canary` lane (the
Stryker sandbox's duplicate-config workaround exposed the violation class).
Controlling plan:
[`workspace-config-isolation.plan.md`](../../../plans/delivery/workspace-config-isolation.plan.md)
(ratified 2026-08-11 with the same-day re-scope amendment in its frontmatter stamp; known-issues ledger inside). The canary plan is
archived (completed 2026-08-11) and todo 3 is complete — see the
Current Continuation below.

## #865 MERGED 2026-08-12T17:42Z — CLOSED OUT (Wren calls Downdraft 6b29b5, at resume ~17:49Z)

**#865 (MCP-570) is MERGED** — merge commit `7685ac1ee`, Perseus's ceremony
(all three threads dispositioned on cure evidence at `5aadd6400`; fresh Copilot
round `4919324399` cleared — zero inline, one suppressed read-ordering finding
ACCEPT-WITH-GROUNDS). At resume this seat closed claim `34eaba6f` (archived),
removed worktree `mcp-570-skill-jurisdiction`, deleted the merged local branch
(remote auto-deleted at merge). The queue now advances to **Bucket 1**
(`lesson-search-freshness-and-error-envelope`, ratified — this seat). The block
below is the frozen cure record.

## ROUND-4 CURES LANDED 2026-08-12 ~17:2xZ — #865 head `5aadd6400`, ceremony is Perseus's (Wren calls Downdraft 6b29b5)

- **Copilot round-4 (review `4918932138`, on `d3d38ce6a`) landed 2 generated
  findings on the cure-A code — both CONFIRMED real via red-proofs and CURED,
  pushed at `5aadd6400`** (`d3d38ce6a..5aadd6400`): (1) recogniser too permissive
  — `parseAdapterStubPointer`/`isRoundTrippableCanonicalRef` now require the
  generated `SKILL-CANONICAL.md` filename (`targetsGeneratedCanonical`,
  single-sourced from discovery's `CANONICAL_FILENAME`), so a foreign
  `vendor/README.md` stub is no longer `--clear`-deletable; (2) preflight
  incomplete — the pre-clear preflight now also classifies each canonical's
  emission target and refuses on foreign/failure (the exact `emitAdapter`
  classifier, one step early), closing a cross-prefix/squatter projection-loss.
  Two FRESH opus reviewers cleared (security: no third vector, no false-refusal,
  sweep subsumed by clear's preconditions; code: APPROVE, recogniser safe across
  all four consumers). Full suite 4646; real `--clear` idempotent; all 117 stubs
  still recognised. Disposition `issuecomment-5270137746`; Copilot re-requested at
  `5aadd6400`.
- **CEREMONY IS PERSEUS'S** (Perseus guards Stillness, b1e836, PR-shepherd seat —
  Director-transferred 17:22Z): dismiss/disposition round `4918932138`
  (dismiss-cure-Copilot; the round is on the stale `d3d38ce6a`), read the fresh
  Copilot round in full, recount unfiltered, bot-merge at CI-settled. Handover
  broadcast sent. Wren continues on the Bucket plans. Claim 34eaba6f retained;
  worktree kept until merged.

## CURE A LANDED 2026-08-12 ~16:35Z — #865 pushed, superseded by the round-4 block above (Wren calls Downdraft 6b29b5)

- **Cure A is IMPLEMENTED, gated, and PUSHED.** Head
  `jimcresswell/mcp-570-skill-validation-jurisdiction` is now `d3d38ce6a`
  (`1a98b0807..d3d38ce6a`, fast-forward). The stage-before-clear defect (round-3
  defect 1) is cured: a pre-clear preflight (new
  `agent-tools/src/skills-adapter-generate/emission-refusals.ts`) computes the
  emit refusals BEFORE the destructive `--clear`, reusing emission's own
  primitives (`isRoundTrippableCanonicalRef` + `collectCarriedFiles.refused`) so
  it cannot diverge; only the canonical side is read (the sole deterministic
  post-clear refusal vector). Any refusal aborts before a single removal.
- **Gates all green:** red-proof 3/3
  (`clear-refuses-before-projection-loss.integration.test.ts`, real committed
  symlink); full agent-tools suite 4643; type-check + lint 0 errors;
  `skills:generate` AND the `--clear` path idempotent on the real corpus (exit 0,
  zero churn, 54 canonicals, Vendor + lock preserved). TWO opus reviewers cleared
  (security-expert APPROVE-WITH-NOTES — doc note applied; code-expert APPROVE with
  a first-hand probe of the real clear).
- **DIRECTOR MERGE PICKUP (Plover, at resume):** dismiss Warden round
  `4917213920` (defect 1 was the only live item, now cured), recount unfiltered,
  bot-merge at CI-settled. Copilot review was RE-REQUESTED at `d3d38ce6a` by this
  seat (binds async ~5min). Disposition comment posted `issuecomment-5269620349`;
  cured-signal broadcast `7d4b53e7`. B-accept + the five TOCTOU threads already
  resolved (`issuecomment-5268166013`). Claim 34eaba6f RETAINED; worktree
  `mcp-570-skill-jurisdiction` KEPT on disk until merged.

## COMPACTION FREEZE 2026-08-12 ~14:2xZ — #865 HELD on a PENDING OWNER DECISION (round-3 bar)

- **OWNER RULED (2026-08-12 at wrap): ACCEPT THE RESIDUAL. The B-accept half is
  ALREADY DONE by the Director** (owner also ruled to Plover directly ~14:35Z;
  ruling comment `issuecomment-5268166013`, the FIVE TOCTOU threads resolved
  per-defect on both grounds). **The #865 pickup is now EXACTLY ONE item:
  implement cure A (stage-before-clear + the clear-first canonical-symlink
  red-proof), push.** At that push the Director dismisses the Warden ROUND
  (its defect 1 / stage-before-clear being the only live item), re-requests,
  recounts unfiltered, bot-merges. Merge stays HELD until cure A lands.
- **PICKUP: implement cure A, push, hand the Director the close.** #865 (head
  `1a98b0807`, all gates green through pre-push) is MERGE-HELD by the Director
  (Plover, b10c37) until cure A lands. Rounds 1-2 plus the update-branch leg all
  LANDED. Cure A shape below; ruling relayed to the Director.
- **Round 3 (Warden CHANGES_REQUESTED review 4917213920, six defects / six open
  threads, plus the Copilot generated trio the Director had not relayed round 2)
  collapses to TWO cures:**
  - **Cure A — stage-before-clear (REAL, feasible, PENDING execution):** a
    committed symlinked `references/` dir passes discovery but carriage refuses
    at emit, so `--clear` can lose a projection (no attacker needed). Cure:
    preflight every canonical's full emission before clearing, or stage-then-
    install; add the clear-first canonical-symlink red-proof.
  - **Cure B — descriptor-anchoring at five sites (defects 2-6): INFEASIBLE and
    CONTESTED, routed to the owner.** Verified first-hand: Node v24 has NO
    openat/fstatat/unlinkat family and FileHandle has NO descriptor-relative
    methods, so the prescribed openat-relative mechanism cannot be built in pure
    Node without a native dep (rejected for the install-time closure). The opus
    security-expert already assessed this exact TOCTOU class on this code as
    out-of-realistic-threat-model (dev-tool CLI on repo-authored static content;
    no concurrent racer), openat-not-in-Node, "don't block." The Warden conflicts
    with the opus security assessment.
- **THE OWNER DECISION — three bars (my recommendation is ACCEPT):**
  1. ACCEPT the residual (rec): cure A; record the five TOCTOU residuals as
     out-of-threat-model plus Node-API-bounded (opus-concurred); dismiss the
     Warden round per-defect citing BOTH grounds per finding.
  2. MIDDLE (Director's, feasible): cure A plus O_NOFOLLOW/realpath re-verify
     immediately before each destructive use — narrows-not-closes the windows,
     no native deps, adds five sites of complexity for an out-of-model threat.
  3. FULL: a vendored/native openat binding in the generator's closure — the
     only true close; heavy; the dependency we rejected.
- **AT THE OWNER'S WORD:** push cure A plus the chosen B disposition; the Director
  (holding the merge and the six threads) re-requests Copilot, reads
  generated+suppressed, resolves all six threads and dismisses the Warden round
  with the per-defect evidence, recounts unfiltered, bot-merges at settled.
  Director standing note: per-defect dismissal cites BOTH grounds (Node
  infeasibility AND threat-model/opus concurrence). Claim 34eaba6f held; worktree
  `.claude/worktrees/mcp-570-skill-jurisdiction` kept.
- **LANDED this session (all pushed):** round-1 cures `a73ff86b8` (discover-
  before-clear folded behind the discovery gate; collect-then-remove; census
  fail-closed; fd-anchored O_NOFOLLOW read for the CodeQL race; Sonar
  nested-template; plan amendment) plus `323805abf` (reinstate skills-lock.json,
  verified blob in HEAD — the code-expert's gate-invisible catch); update-branch
  merge `4979d1b6b` (post-864 main; idempotence re-verified: 54 canonicals, zero
  churn, the nine Vendor skills plus lock preserved); round-2 cures `1a98b0807`
  (ADR-125 lock-ownership record corrected; clear.ts removal-phase partial-state;
  adapter-stub round-trip guard). Two opus reviewers cleared round 1. Owner
  directive applied: "we don't care how the external management works, leave it
  alone" — every durable record states only the jurisdiction boundary, no
  external internals.
- **FOLLOW-UP PLAN — investigation work classified MISSING (close) vs NOT ALLOWED
  (decline), owner-requested at the freeze (2026-08-12 ~14:2xZ):**
  - MISSING (real gaps, warranted, do):
    - Cure A stage-before-clear (blocks the #865 close) — a real data-loss gap
      (`--clear` loses a projection when a canonical has a committed symlinked
      `references/`). Cure at the round-3 close.
    - MCP-573 (backlog, own small PR): portability `--fix` writes rule-wrappers
      through a symlinked `.claude`/`.agents` root — a write outside the repo,
      the same destructive class as the cured security-Critical; cure with the
      shared `surfaceRootGuardFailure`.
    - De-hatch arc (task #21): 50 `'off'` lines disabling two boundary rules —
      enforcement is currently OFF; closing it is a real gap.
  - NOT ALLOWED (over-reach or low-value, decline / accept-and-record):
    - Cure B descriptor-anchoring (5 TOCTOU sites): infeasible in pure Node
      (no openat) AND out-of-threat-model (opus-concurred). Accept the residual
      with dual-grounds record; NOT a code change.
    - The middle bar (O_NOFOLLOW/realpath re-verify): narrows-not-closes, adds
      complexity for a non-threat — hardening theatre; decline unless owner
      wants it.
    - MCP-543 (task #19): low-value exemption-tightening; the exemption is real
      - documented + ADR-sanctioned; accept-and-record (or the deeper re-home),
      not a per-file `pathNot` narrowing.
  - THE LESSON (missing vs not allowed, two faces): (1) in code = fail-closed —
    ENOENT is *missing* (genuine absence, proceed), any other error is *not
    allowed* (couldn't observe — surface, never swallow); the census cure
    encodes it. (2) In warrant = a review finding is a real gap to close
    (*missing*) or over-reach to decline (*not allowed*); that classification is
    the brake on the review-convergence ratchet, and where contested/infeasible
    the call routes to the owner with first-hand evidence.

## CURED 2026-08-12 ~12:4xZ — #865 review round closed; cured head pushed, awaiting Director dismissal + merge

- **PICKUP: watch #865 to merged (head `1a98b0807`), then board re-check.**
  A second review round (Copilot, bound to the merge head `4979d1b6b`) landed
  three findings — all CURED on `1a98b0807` (no disposition): ADR-125:595
  lock-ownership record corrected to the implemented boundary (external
  internals no longer described, per owner direction 2026-08-12: "we don't care
  how the external management of skills works, leave the external mechanisms
  alone"); clear.ts removal-phase returns partial teardown on failure; adapter
  emission refuses a non-round-trippable canonical (backtick/newline). Gates
  green, disposition posted (issuecomment-5267636545), Director confirmed.
  The mantagen CHANGES_REQUESTED (6 defects + 3 test-gaps, on the OLD head
  `2ff1eb025`) is fully cured and STALE against the current head. Update-branch
  leg done (Director-routed): merged post-864 origin/main (merge commit
  `4979d1b6b`, no conflicts), idempotence recheck GREEN on the merged tree
  (skills:generate 54 canonicals, zero churn; #864 oak-comms-channels plus the
  9 Vendor skills and skills-lock.json all survived), pushed. Director
  re-requests Copilot at
  `4979d1b6b`, recounts unfiltered, bot-merges at CI-settled. Disposition posted
  (issuecomment-5267145133); cured signal broadcast to the Director (event
  dfb0dc9d). Merge is Director-side: dismiss the stale mantagen round with the
  disposition as evidence (review-path-dismiss-cure doctrine), then bot
  REST-merge at CI-settled (fresh CodeQL + Sonar re-run on the new head).
- **The cures** (two commits: `323805abf` reinstate skills-lock.json;
  `a73ff86b8` the code+tests+plan): (1) discover-before-clear — the `--clear`
  folds into `generateAdapters` behind the `isDiscoveryComplete` gate
  (`clearFirst`/`clearIfRequested`); (2) collect-then-remove — `clear.ts`
  classifies both roots before any `rm`; (3) census fail-closed — a `CensusFs`
  seam, non-ENOENT→issue, `selectPracticeSkillDirs` returns `{selected,
  failures}`; (4) fd-anchored no-follow read — new `read-regular-file.ts`
  (`O_NOFOLLOW`+fstat+read-from-fd), shared by clear+census, cures CodeQL
  `js/file-system-race`; (5) Sonar S4624 nested-template gone; (6) ratified
  plan amended to marker-based membership + external-lock ownership.
- **skills-lock.json REINSTATED byte-identical** (owner ruling 2026-08-12: the
  external skills CLI's own lock is external territory — restore, keep OUR
  machinery deletion). The code-expert caught it had to be COMMITTED not just
  on-disk (gate-invisible — nothing reads it, so `pnpm check` is green either
  way; the merge would have deleted it). Fixed; verified `git cat-file -t
  HEAD:skills-lock.json` → blob.
- **Two opus reviewers cleared** (security-expert + code-expert). Accepted
  residuals, recorded not blocking: leaf-only `O_NOFOLLOW` leaves a
  `<name>`-dir swap race bounded to a read (no destructive escape — `rm` on the
  lexical path unlinks the symlink; no Node `openat` to close it); the
  guard→`rm` ancestor race is the standard Node path-op limit.
- **Worktree `mcp-570-skill-jurisdiction` KEPT** on disk until merged (branch
  `jimcresswell/mcp-570-skill-validation-jurisdiction`). Session exited it
  (keep) to push from primary (worktree-isolation guard blocks push/comms/watch
  from a linked worktree). Claim 34eaba6f still held.
- **QUEUE AFTER #865 MERGES** (unchanged): board re-check with the Director →
  de-hatch arc (task #21) → MCP-543 (task #19). MCP-567 stays reversed.

## Current Continuation (COMPACTION FREEZE 2026-08-12 ~09:4xZ — pickup is the #865 MERGE + the board re-check)

- **THE SINGLE PICKUP ITEM: watch #865 to merged, then board re-check.**
  MCP-567 was REVERSED at owner word (there was no problem with the nine
  skills — the symlink layout is the external `pnpx skills` machinery's own
  standard install shape). The real defect it exposed: **our skills
  validation was adjudicating an external system** — the reconciliation
  sweep (`skills:check`/`skills:generate`) and the permission census
  claimed jurisdiction over every entry at both projection roots, so a real
  `pnpx skills add` is reported stale by check and DELETED by the next
  generate. That violated testing-strategy.md:59 ("NEVER test external
  functionality, that is not under our control"), which already forbade it.
- **MCP-570 SHIPPED — PR #865** (`jimcresswell/mcp-570-skill-validation-jurisdiction`
  → main, head SHA:2ff1eb025), bot-authored, jimbot label, Copilot
  requested. Executes the ratified plan
  `.agent/plans/delivery/skill-classes-and-validation-jurisdiction.plan.md`
  (owner four-card ruling 2026-08-12): the owner's three-class taxonomy
  (Practice / Vendor / User-facing); class membership recognised by a
  CONTENT marker (`adapter-stub.ts`, structural — a quoted marker in a
  foreign doc is not membership); all lock machinery deleted
  (`skills-lock.json`, `lock.ts`, lockedIds plumbing); the surface-root
  guard single-sourced (`surface-roots.ts`) and applied by every consumer;
  ADR-125 rewritten; validation-strategy §Validation jurisdiction added;
  PDR-051 superseding note. FOUR opus review passes discharged
  (code-expert write-through regression; test-expert recogniser forgery;
  config-expert gate integrity; security-expert ×2 — a Critical where
  `--clear` deleted OUTSIDE the repo through a symlinked root, CLEARED on
  re-verification with first-hand reproduction). `pnpm check` green;
  agent-tools suite 4593 green; every guard has a real-filesystem
  regression test. **MERGE IS DIRECTOR-SIDE** at CI-green + settled (bot
  REST-merge, never squash); Plover's freeze-7 map carries the commitment
  ("#865 merges at Wren's settled signal; second lander of 864/865
  regenerates skills projections before recount"). Worktree
  `.claude/worktrees/mcp-570-skill-jurisdiction` (branch
  `jimcresswell/mcp-570-skill-validation-jurisdiction`) KEPT on disk until
  merged; MCP-570 → Done at merge. Claim 34eaba6f RETAINED
  stopped-seat-held (this seat resumes it).
- **MCP-567 disposition**: REVERSED — reversal comment on the Linear
  ticket; superseded by MCP-570. Its worktree `mcp-567-vendor-symlinks`
  and its six discardable red tests should be pruned (my forced-removal was
  denied by the loss-of-work permission gate — the owner runs
  `git worktree remove --force .claude/worktrees/mcp-567-vendor-symlinks`,
  or the seat re-attempts post-compaction now that the tests are moot).
- **MCP-573 filed** (Backlog): pre-existing, out-of-scope — `--fix` writes
  portability rule-wrappers through a symlinked `.claude`/`.agents` root
  (a WRITE outside repo); the shared `surfaceRootGuardFailure` is the cure
  when scheduled.
- **QUEUE AFTER #865 MERGES** (re-derived at owner challenge with a NEW
  provenance rung — trace every problem claim to an owner observation or a
  first-hand defect in territory WE own): (1) board re-check with the
  Director — meta-estate never outranks live product, and the board was not
  checked this window; (2) de-hatch arc (task #21: 50 measured `'off'`
  lines disabling two boundary rules — plan-ratified, its authority is the
  plan doc not an owner-verbatim commission as prior records claimed);
  (3) MCP-543 (task #19: the anonymous depcruise `pathNot` exempts one file
  from the WHOLE no-libs-to-sdks rule; H2-coverage-assert folds in as its
  rider). H1-slim and H4 LEFT the queue (no live defect; hardening node
  archived with zero executed slices, re-entry conditions in its ledger).
- **Durable memory banked/sharpened this session**:
  `warrant-ladder-at-queue-boundaries` gained **instance five, the
  provenance rung** — the ladder is circular unless the PROBLEM CLAIM is
  traced; a "problem" that exists only relative to our own machinery's
  assumptions may be the machinery that is misconfigured (it was). Jargon
  defending a queue item ("provenance record") is the advocacy self-signal.

## Prior continuation (superseded 2026-08-12; kept for the arc record)

## Superseded (COMPACTION FREEZE 2026-08-11 ~19:1xZ — owner card answers set the queue: S1b in-session → vendoring-symlinks PR → MCP-543 → de-hatch; census after the smalls)

- **OWNER CARD ANSWERS (2026-08-11 ~19:1xZ, all four recommendations
  taken)**: (1) S1b continues IN THIS SESSION post-compaction; (2) the
  nine lock-pinned vendored `.claude/skills` symlinks get a PROMPT
  small vendoring PR in the near queue (write real files to both
  surfaces, delete the links, narrow the sweep's lock handling —
  honouring principles' remove-immediately doctrine over the
  register-swept alternative; ticket mints at cut); (3) the #850
  SonarCloud measure/issue-divergence phantom is RECORD-ONLY (re-open
  only on recurrence — evidence bundle: gate 15>14,
  per-file measure pinned turbo-glob.ts, five empty index reads plus
  the owner's UI confirmation, green recompute after construct
  removal); (4) the exemption-removal programme's first session comes
  AFTER the lane smalls land.
- **#851 INTERLUDE (Director-routed, complete at this seat)**: the
  skill-carriage cure arc ran here 2026-08-11 ~16:5x–19:1xZ — three
  commits on `jimcresswell/skill-standard-s1a-carriage` (head
  `e28ab7367`): every Warden blocker + suppressed batch cured with the
  Warden's probes as executable red cases; the internal opus round's
  critical (emission over incomplete discovery) cured as wholesale
  refusal; the security round's three finds (canonical carried-ROOT
  symlink followed; `--prefix` value traversal; ancestor-symlink
  defeating the root guard) cured with red tests. All threads
  resolved, dispositions + security addendum on the PR, both post-push
  Copilot entries declared as 20k-line size-skips. MERGE IS
  DIRECTOR-SIDE (Plover, unfiltered recount at CI-green +
  mantagen-clean; comms thread d1393c91→6f183263). Worktree
  `agent-a1ddadee828a9ec41` stays until merged; MCP-547 → Done at
  merge. Two seat decisions named in the recount record: wholesale
  emission refusal on incomplete discovery; skills-lock.json as the
  single protected authority for vendored entries whatever their
  on-disk kind.

- **#850 MERGED `3afe99113`** (2026-08-11 16:19Z, owner-armed
  auto-merge, merge-commit method, his approval 16:18Z). The resumed
  drive's record: a ROUND-4 CHANGES_REQUESTED from the owner's PR
  Review Warden seat (Marlin binds Wave, posted under `mantagen` at
  his direction) found the bare `$TURBO_ROOT$/` root input
  misclassified dead — cured `bca591fb5` after in-repo probe
  confirmation (1,006 → 93,515 dry-run inputs; the trailing-slash
  sibling probe-confirmed and cured in the same predicate; opus
  code-expert APPROVE with differential check); the stale review was
  DISMISSED at the owner's word. Then a SONAR PHANTOM: the gate
  scored one new MAJOR smell that NO issue index carried (owner
  checked the UI; five API query shapes empty — a measure/issue
  divergence on SonarCloud's side); removing the trim regex
  (`a273bf1d4`, linear index walk, behaviour identical) flipped the
  gate green — falsifier-confirmed. The owner merged main into the
  branch twice mid-drive (`367cd6f6e`, `980de90b7`); reconciled at
  `a034ec140`. MCP-542 auto-moved Done. Worktree
  `mcp-542-turbo-globs` pruned; local+remote branches deleted. The
  Director recount/grant request was WITHDRAWN (owner armed the merge
  himself); nothing owed there.
- **CENSUS EXTRACTED to its own node** (owner words verbatim: "let's
  move the exemption hunting to a separate plan"; "the repo review
  for carveouts, exemptions, 'special cases' and planning to remove
  them in a separate plan"): new
  `exemption-removal.plan.md` carries the census mechanism, sweeps,
  and the broadened special-case ledger; the isolation plan and the
  hardening node carry dated extraction amendments (todos 4–5 moved,
  criterion moved, execution order re-trued).
- **NEXT, in order**: (1) **S1b** — validator truth cures, one small
  PR, ticket at cut (backslash joins `GLOB_CANDIDATE` + refusal
  red-proof; bin success line scopes to `$TURBO_ROOT$` inputs;
  interior-`//` probe-then-encode) — the post-merge harvest rows,
  spec in the isolation plan's §Slice S1b; (2) the **vendoring-symlinks
  PR** (nine lock-pinned vendored `.claude/skills` symlinks become real
  files — the owner-card queue places it directly after S1b, per the
  heading); (3) **MCP-543** re-scoped
  (the S2 ledger below stands); (4) todo 2's three-PR de-hatch arc;
  (5) todo 6 close+archive. Hardening node H1→H2→H4 independent
  after S1b. Exemption-removal programme schedules its own sessions.
- **Linear-ticket monitors (owner-commissioned act 2)**: arm at the
  next active PR window over the live lane tickets (S1b ticket +
  MCP-543) — simplest honest poll (comments + status since baseline);
  ticket-borne findings join every settle tally. MCP-542 closed with
  zero ticket comments (verified at settle).
- **OWNER-ORDERED RE-ADJUDICATION OF ALL REMAINING STEPS (2026-08-11,
  at the compaction boundary — "please question all remaining steps",
  following the S2 warrant collapse below).** Every step re-derived
  from first principles; the failure shape hunted was
  symmetry-with-the-landed-cure posing as a warrant. VERDICTS — ALL
  RESOLVED AT THE SEAT via the decision matrix (owner word
  2026-08-11: "why are you waiting on me, run the decision matrix";
  lenses run in order, first decisive governs; NOTHING remains
  owner-pending):
  - SOUND, unchanged: merge #850; Linear-ticket monitors (owner
    commission); todo 2 de-hatch (owner's verbatim word); census
    todos 4–5 (the exemption-alarm ruling made structural — with one
    sharpening: the sweep CURES first and registers second, so the
    register never becomes a warrant-shelf at scale); H4 + H2's
    coverage-assert (guards for failure classes actually experienced);
    S2-as-re-scoped + its two review survivors (field-integrity
    phantom, assertNever gap).
  - H3 tsconfig-extends: DROPPED (lens 2 precondition fails — the
    boundary rule binds IMPORTS and an extends reference is not one;
    lens 3 decisive — simpler with quality intact). Warrant was symmetry only: the
    Stryker sandbox, the sole empirical forcing consumer, ran the
    canary at 100% with root-anchored extends untouched; no live
    consumer copies subtrees; reviewer sized it over-band; and the
    LIVE principles.md §Tooling (as re-trued at the #836 landing) now
    states "tsconfig.json extends chains are the one root-anchored
    convention that remains (an extends reference is not a module
    import)" — doctrine already contradicts the step. Returns to
    Out-of-scope with that ground; re-enters only with a named
    consumer.
  - H1: SLIMMED (lens 3 decisive both ways — the standardisation
    makes the estate simpler; the scanner guarded a
    construction-eliminated channel). KEEP the idiom standardisation
    (~40 sites → native import.meta.dirname — standalone
    simplification; the validator's recognition problem collapses
    with it), the small refusal rewrite, and the fs-unreadable bin
    test. DROP the config-VALUE leg (an instrument built to find
    nothing: two live strings, both lint-ignored targets, the one
    historical escape already structurally cured — the class gets a
    recorded pointer, not a scanner).
  - S2b path re-points: DEMOTED to a rider on the next PR touching
    those files; never a standalone PR.
- **S2 (MCP-543) CONTEST RESOLVED — only the withdrawn package-move
  shape is dead; the re-scoped keep-lib shape below is executable**
  (2026-08-11, at the compaction boundary, verbatim: "that package is
  not an sdk, it's a lib supporting an sdk, why would we move it?").
  The challenge caught a real warrant flaw: the move's doctrinal hook
  (principles §Layer Role Topology, "SDKs own field inventories")
  adjudicates apps-vs-sdks, not libs-vs-sdks; ADR-138's RATIFIED
  decision places the package in libs with the sdk-codegen edge as
  the documented generated-contract exception, already implemented
  FIRST-CLASS in ESLint (`searchContractsSdkException`, tested); the
  exemption alarm's legitimate target was depcruise's crude per-file
  `pathNot` FORM, not the edge. CORRECTED SHAPE — RESOLVED at the
  seat by the decision matrix (owner direction 2026-08-11; the plan's
  dated re-scope lands at resume): keep
  the package a lib; re-scope MCP-543 to a small PR replacing the
  anonymous `pathNot` with a NAMED lawful-edge rule (search-contracts
  → sdk-codegen generated contract exports) citing ADR-138/041 in the
  rule comment — policy changed at its owning level, no per-file
  warrant shape survives. The deeper alternative (emit generated
  contracts into a lower-layer package so the edge points down by
  construction) is recorded as a pointer, not proposed now.
  Independent survivors of the dead move, each its own small row:
  the field-integrity eleven-files truth + dead include line 30
  (ledger item 1 below), and the `assertNever` exhaustiveness gap in
  `createSdkBoundaryRules` (ledger item 2's backstop half). The
  ledger below is preserved as the review record; items tied to the
  relocation (role addition, boundary-machinery deletion, ADR
  amendments, lockfile/mdc/README moves) are MOOT unless the owner
  rules for the move after all.
- **THEN S2** (MCP-543) cuts its branch under the corrected contract.
  The plan Amendment's S2 section needs its dated correction commit
  BEFORE the branch cuts. The COMPLETE correction ledger (pre-execution
  review, opus, CHANGES-REQUESTED — all absorbed; durable here because
  session task state does not survive seat death):
  1. Baseline is ELEVEN field-integrity files, not twelve — the
     include list already carries a phantom (`task-0.0-gap-ledger`
     deleted in `fc02f28a2`); delete dead include line 30 in the same
     commit; proof = `vitest list -c vitest.field-integrity.config.ts
     --filesOnly` diffed before/after (recompute, never the array).
  2. The `'contracts'` role lands WITH an `assertNever` exhaustiveness
     backstop in `createSdkBoundaryRules` (the trailing implicit-
     runtime return silently absorbs unknown roles); the role fences
     the sdk consumers (`oak-search-sdk`, `curriculum-sdk`,
     `graph-corpus-sdk` + relative zones), NOT a copy of `'search'`;
     never reuse `searchSdkImportPatterns` (wrong message); carry
     `no-restricted-globals` (process/__dirname/__filename) into the
     role or record the drop in ADR-041.
  3. Five added surfaces: `pnpm-lock.yaml` importer key;
     `.cursor/rules/invoke-elasticsearch-expert.mdc` glob (silent
     agent-routing rot — portability validator checks existence only);
     ADR-138 lines 51–52 References; ADR-041 line 22 enumeration +
     line 78 BOTH cells + line 35; `output-schema-plan-audit.workflow.js:229`.
  4. `docs/architecture/README.md:64` is a policy sentence to REWRITE
     (exception clause deleted); root README row MOVES Libraries→SDKs
     table (different row convention).
  5. ADR-108 amendment reconciles the "why not five" rejected option
     honestly (it governs a workspace's OWN interfaces; this is the
     ADR-138 contract surface) + trues §Boundary Invariants' two-role
     drift + `createSdkBoundaryRules` TSDoc; flatten
     `LIB_SDK_BOUNDARY_MESSAGE`'s dead exception clause; drop the
     always-empty `paths:` key.
  6. Red-proof: pre-mv, delete ONLY the `pathNot` line, run depcruise,
     observe exactly one `no-libs-to-sdks` error on
     field-inventory.ts, put back — the real edge (a bare-specifier
     libs fixture FALSE-GREENS: unresolvable → npm-no-pkg, the rule
     matches `to.path`).
  7. RIDER CUT: canary path re-points are their own two-file PR after
     the archival reaches main (live surfaces only: stryker.config.mjs
     and survivor-dispositions.md; frozen snapshots stay).
  8. `lib-boundary.unit.test.ts`: also delete `getRestrictedImportPaths`
     and the `getMatchingPatternGroups` import; `sdk-boundary.unit.test.ts`
     gains the `'contracts'` describe block; line 284 re-points to a
     surviving lib.
  9. Keep `createLibConfig` tsup shape (name the deliberate exception
     in the PR body + widen its remarks); `oak-search-sdk` declares
     search-contracts under `dependencies` though only tests import it
     — name known-and-out-of-scope in the PR body.
  10. Fleet at implementation: architecture-expert + config-expert
      deep; docs-adr-expert + test-expert focused. One PR (~27 files);
      PDR-132 crossing recorded (indivisible under the
      validate-boundaries recompute + every-landed-state-correct).

## Prior continuation (superseded by the pause block above; kept for the arc record)

- **#848 MERGED** (`bb40ecdf5`, 2026-08-11, merge-bot under Director
  grant `113D7A7F`) — todo 3 complete; canary fully complete for
  type-helpers; MCP-540 Done; both lane worktrees pruned, branches
  swept. (#836 merged `d4e256294` 2026-08-10; both arcs live on main.)
- **Owner rulings 2026-08-11** (all in durable memory): error findings
  get fixed, never warranted; an exemption in an enforcement surface
  is an alarm bell — fix or change policy, with a clock; "residue"
  registers get critical assessment then sequencing or rejection;
  mutation roll-out is owner-committed — "everywhere, but later, and
  in stages" (carried at the isolation plan's Out of scope).
- **The decision-complete completion arc is RATIFIED** (owner
  approval in-session 2026-08-11; both review passes folded — 23
  findings): the isolation plan carries its 2026-08-11 Amendment
  (register triage ledger, todo-2 reshape, census enrichment, slices
  S1/S2, criteria rewrites, new stamp); the successor node
  `workspace-config-enforcement-hardening` (H1–H4) is born-ratified;
  the canary plan is ARCHIVED completed. Full sequence: S1 → S2 →
  todo 2 ∥ todo 4 → todo 5 → H1→H2→H3→H4 → todo 6.
- **In flight**: S1 = MCP-542 executed at `653d170ec` (worktree
  `.claude/worktrees/mcp-542-turbo-globs`, branch
  `jimcresswell/mcp-542-turbo-zero-match-globs`): derivation under
  the pinned matcher settled the yaml dispute (ALIVE — `**` matches
  zero segments per turbo's own dry run) and deleted exactly the
  three js/cjs/mjs entries; ≥1-tracked-match validator leg with
  red-proofs + hand-mutation check + live red-green landed; the
  root-tsconfig item was already discharged at todo 1; the
  canary-archival path re-points moved to S2 (live surfaces only:
  stryker.config.mjs + survivor-dispositions.md; frozen snapshots
  stay) because the archival sits coordination-side until the next
  fold. PR pending review/merge. Next: S2 =
  search-contracts whole-package move (Director PROCEED + owner
  ratification; full surface enumerated in the plan Amendment incl.
  boundary.ts machinery deletion, `'contracts'` role, ADR-041/138
  amendments same PR, eleven-live-file field-integrity proof — corrected
  2026-08-11 from the prior twelve-count, one dead include).
- **Standing**: all fleet PRs bot-authored (mint-token every write
  channel incl. `gh pr create`); every PR carries the `jimbot` label;
  Copilot review binds async ~5min, re-request per head move; my own
  REST replies mint empty jimbot COMMENTED reviews — exclude from any
  recount.

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

## The depcruise swap cycle — EXECUTED (steps below completed via #836/#848; conserved as the worked record; the live sequence is the plan Amendment's Execution order)

1. **Verify first-hand before designing**: (a) depcruise's cruise scope
   currently INCLUDES workspace-root config files (if not, extending the
   scan set is part of the swap); (b) the committed red-proof tests reshape
   cleanly to rule-config form.
2. Author the rule set per the three rulings: one $1-group containment rule
   for config files; one zero-tolerance `require`/CJS rule estate-wide; one
   dynamic-import error rule with the named exemption set; phantom-dep
   detection via dependencyTypes.
3. Delete the regex containment leg; **re-derive which packet cures
   survive** — B2's two Sonar issues sit in `containment.ts`/
   `text-position.ts`, code that may disappear with the swap.
4. What stays bespoke regardless (Director-adjudicated): the
   path-arithmetic refusal channel (no static analyzer sees runtime path
   building), config-VALUE relative strings (`setupFiles` — not imports),
   and the turbo-inputs JSONC leg. The turbo leg gains Codex's new
   follow-up: positive globs must match ≥1 tracked file with
   turbo-compatible semantics (today only the leading literal directory is
   checked).
5. Land the surviving record cures from the packet: ADR-168 bullet
   placement (move after line 501), the two false in-code statements
   (`workspace-config/eslint.config.ts:10` census claim → pending;
   `turbo.json:116` and `:397` stale inputs), the recommended same-landing
   set (stryker config stale comments, PR-body count re-true to 55/30,
   README portability claim, durable ADR citation targets).
6. The packet's seven named follow-ups land as recorded plan todos with
   red-proofs (tsconfig-extends leg, path-arithmetic idioms, config-value
   strings, comment-stripping robustness, file-class allowlist + honest
   success line, exit-2-on-unreadable, bootstrap-closure ordering check) —
   plus Codex's turbo-glob item. Never silent gaps.
7. Then: recount at settled green → Director merge grant → todo 3
   immediately (Stryker silent-fallback cure, plan has the shape) → todo 2
   (reshaped by ruling 2) → todos 4–5 (census).

## Landed and verified (2026-08-09, this seat, first-hand)

- Todo 1 substance on PR #836: package, 55-file/30-workspace migration,
  validator green at 103 files/34 workspaces on the merged head, doc
  truings; adversarially confirmed strong by an 18-agent round (packet
  §Verified strong).
- Cold-install cure `cd822f20f` (bootstrap closure position 0 + per-dep
  staleness witnesses) — red-proofed byte-identical, adopted by both opus
  legs, pushed. Plan ledger carries the three-consumer-classes lesson.
- Plan ledger + napkin freeze-harvest landed as `40cea91c2` on
  `coordination/2026-08-09-b5f347`.

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
