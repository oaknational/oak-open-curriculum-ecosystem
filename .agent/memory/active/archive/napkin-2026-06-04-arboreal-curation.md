---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-03 - school-search synthesis + plan (Furnace Roasting Brazier)

### What Was Done

- Synthesised the three school-search briefs + owner requirements into the
  self-contained report (`36f1d61b`) and the gated POC plan collection
  (`26b7eb77`); reviewers at every stage (assumptions-expert ×2, betty,
  docs-adr-expert), all findings validated against artefacts before applying.

### Mistakes Made

- **Claimed a markdownlint pass that never linted the file.** Scoped
  `markdownlint <report>` printed usage + exit 0 because `.agent/reports/`
  is in `.markdownlintignore` — ignore-filtering left ZERO inputs, and the
  CLI's no-input shape is usage-print-with-exit-0. The earlier two-file run
  was "green" because the OTHER file passed. This is the napkin's own
  "green verifier with no extraction count proves nothing" lesson recurring
  in a new costume: a targeted lint claim needs the file to be IN the
  gate's footprint, and a silent pass needs per-file attestation. Cure
  applied in-session: re-ran per surface with the governance split named
  (reports = prettier-only by design; canon = markdownlint + prettier).

### Patterns to Remember

- **Convergence inherits the frame it was voted in.** All three briefs
  "agreed 3/3" on Next.js — but the vote was cast inside their
  standalone-repo frame; in-repo (no Next.js anywhere, deployed app is
  Express) the agreement carries no evidence weight. Betty's blocker
  generalises: when a shared premise is invalidated, every convergence
  downstream of it must be re-graded, not inherited. Candidate for the
  synthesis-method pattern register.
- **Openers degrade in transit; canon survives.** The pasted opener arrived
  duplicated and garbled mid-sentence; the thread record + remember.md
  carried the exact text. Ground openers from canonical files, treat chat
  paste as lossy transport.
- The owner-mandated synthesise-before-plan sequencing earned its cost:
  both beyond-opener insights (OpenAPI contract-layer collision → the F-C
  shape; apps-thin decomposition) emerged only from reading ALL inputs
  against doctrine in one pass — neither is visible from any single brief.

## 2026-06-03 — upstream sequences API realignment (Moonlit Waxing Nebula)

- **A healed turbo cache inverts the poisoning direction — deliberate online
  regeneration needs `--force`.** After the recorded CI=true heal, an unforced
  `pnpm sdk-codegen` FULL-TURBO-replayed the OLD-schema outputs and never
  fetched; the plan's mechanics described online runs poisoning offline
  replays, but the healed state poisons deliberate online runs the same way.
  Cure: any regeneration that must observe upstream change is a forced run.
- **Schema presence ≠ value population — count instances before a
  delivered/undelivered verdict.** The bulk schema.json had declared
  tier/examSubjects/categories as optional since at least 2026-05-21, yet
  zero units populated them in old AND fresh downloads; an Explore agent's
  own report contradicted itself by reading the schema for one half of its
  table and the feature request for the other. Field-population counts over
  the actual corpus settled it in one command.
- **Read-only evidence in plan mode answered all three owner questions before
  approval.** Fresh OpenAPI fetch + one-subject authenticated bulk ZIP to
  /tmp produced the full source-side diff and the bulk-unchanged proof with
  zero repo mutation — the plan was approved with the verdict already
  evidence-complete, and execution held no surprises.
- **Reviewer-validation pass earned its keep both ways**: code-expert's
  ontology `schemaRef` rename was a false positive (the value IS the correct
  upstream schema name); type-expert's `Promise<unknown>` erasure finding was
  real but pre-existing — metabolised as a named follow-up in the plan, not
  smuggled scope. Plan-agent claim "tool-guidance rename is doc-only" was
  refuted by the build: the generated `AllToolName` union gates hand-authored
  tool references at compile time.
- **Peer continuity entries land mid-session under parallel planning
  sessions** — repo-continuity gained a committed peer entry between my read
  and my edit (HEAD moved 2 commits); the Edit-tool freshness error was the
  collision detector, and a re-read merge was cheap. Re-derive before every
  shared-surface edit, not just at open.
- **Pathspec-scoped `git commit` is the structural cure for a peer-staged
  shared index.** A peer's staged file appeared in my index mid-ceremony;
  `git restore --staged` is hook-blocked and `git reset` is forbidden — but
  `git commit -F msg -- <intent files>` commits exactly the intent bundle
  and leaves the peer's staged entries untouched. This is the same
  intent-scoping the commit-queue's own `commit` primitive encodes; the
  manual path mirrors it. Used three times this session, zero collisions.
- **candidate: when both options of a binary policy question suppress a
  signal, re-attribute the root cause — the question dissolves.**
  strict-vs-strip: `.strip()` silently deletes upstream data,
  `.passthrough()` silently smuggles untyped data; both are
  signal-suppression shapes. The real failure was schema STALENESS, not
  validation strictness — re-attribution dissolved a 7-week-old open
  question into "keep strict; cure freshness". PDR-shaped (one instance);
  promote on a second dissolution-by-re-attribution.
- **Pre-commit online codegen doubles as a free upstream-alignment probe.**
  Every commit's hook chain re-fetches the live schema and regenerates; an
  idempotent result is positive evidence the repo matches live upstream at
  that moment (observed at `23e50d9a`: generated-file mtime touch, zero
  diff). The known-red gate inverted into a standing alignment monitor the
  moment the realignment landed.
- **`.remember` plugin DISABLED 2026-06-04 (owner-directed): single-session
  baton vs parallel-session reality.** The vendored remember plugin
  (`remember@claude-plugins-official`, NOT in-repo) treats `remember.md` as a
  one-shot baton — one session writes via `/remember`, the next SessionStart
  reads-and-empties it (`: > "$REMEMBER_HANDOFF"`). Two collisions under 5+
  parallel sessions: write (a second opener clobbers the first; gitignored so
  loss is diffless) and the deeper consume (the next start empties it for
  EVERYONE, destroying a peer's unconsumed opener — "prepend and preserve"
  can't save it). The canonical surfaces (`threads/*.next-session.md`,
  `repo-continuity.md`) are versioned, multi-slot, claim-safe; the plugin was
  redundant and risky. Disabled in both settings files; de-referenced across
  6 skill docs, 2 rules, 1 directive, and ADR-144; corpus mined then deleted.
- **Mining the corpus before deletion returned ZERO orphans (~1,400 lines, 37
  summaries, 3 agents, grounded vs canon).** Every candidate already in an
  ADR/PDR/rule/MEMORY/skill — proof the capture→graduate pipeline caught
  everything. One was actively HARMFUL: it preserved "pre-commit staged-only
  gating" as live, which the owner REJECTED 2026-05-22. An unversioned mirror
  that resurrects overturned decisions is a liability. Lesson: retiring a
  lossy mirror = mine-then-verify-against-canon; a near-empty harvest is the
  success case, not a failed search.
- **A "de-reference X everywhere" sweep must `rg` the whole tree, not a
  pre-scoped list — I claimed clean TWICE off a 5-file list; a full sweep
  found a 6th skill, an ADR, 2 rules, a directive.** Removing a cross-cutting
  token touches every doc that named it; partition the `rg -l` hits into
  must-fix-instructions / accuracy-touch / leave-as-history. Same family as
  "verification scoped by the claim cannot find unclaimed members."
- **Curing a fitness CHAR overage by archiving needs the measured delta, not
  one move.** repo-continuity went 35162 → 35035 (still 35 over) after the
  first archive batch; a second discharged entry cleared it. Char limits
  (unlike line limits) don't telegraph how many entries an archive must
  move — re-measure after each batch rather than assuming one pass clears it.

### What Was Done

- Processed the prior active napkin through the item-level ledger at
  [`2026-06-03-opalescent-illuminating-prism-curation.md`][opalescent-ledger].
- Preserved the processed source at
  [`archive/napkin-2026-06-03-opalescent-curation.md`][opalescent-archive].
- Graduated the PDF-only ChatGPT report-normalisation protocol into the
  canonical skill and reusable pattern, then marked its pending item graduated.

[opalescent-archive]: archive/napkin-2026-06-03-opalescent-curation.md
[opalescent-ledger]: ../operational/curator-passes/2026-06-03-opalescent-illuminating-prism-curation.md

### Mistakes Made

- **Archive-before-ledger violation.** I initially moved the live napkin into
  the archive before writing the disposition ledger, despite the invoked
  consolidation workflows forbidding that exact shape. The owner caught it; I
  restored the live napkin and restarted from a ledger-first process.
- **Bad action frame.** I described the next move as "make fitness pass". The
  owner corrected this as the exact wrong framing. Correct frame: conserve and
  home knowledge item by item; the validator is routing evidence and a
  rest-state health check, not the goal.

### Patterns to Remember

- A buffer lifecycle move is valid only after a durable ledger names the source
  item set and each route.
- When a phrase pulls toward the wrong objective, fix the phrase before it
  steers the work.

## Session: 2026-06-03 - Final no-check handoff

### What Was Done

- Ran final `oak-session-handoff` plus `oak-consolidate-docs` in
  `session-completion` mode, under the owner's explicit `no commit, no check`
  boundary. No new validation/check commands were run after that instruction.

### Patterns to Remember

- After a dedicated curation goal completes, the final handoff should not
  re-open the whole convergence loop. It should preserve the completion state,
  respect fresh owner boundaries, and stop.

## Session: 2026-06-03 - school-search normalisation close (Hushed Lurking Mask)

### Patterns to Remember

- **candidate: thoroughness-texture is not evidence (PDR-shaped).** Cross-read
  of six experience files: the felt character of care — review counts,
  reproduction counts, exact figures, polish, careful inheritance — appears
  precisely in the failure cases; the discriminators that worked were one
  concrete observation against the artefact, an independent lens, and shown
  working. Enforcement shape: verifier verdicts must carry per-check positive
  attestations (a bare CLEAN was consumable only after reading its
  transcript). Promote to the register when convenient.
- **An ad-hoc audit script is an unverified verifier — three instances in ONE
  session, three costumes**: a 7c audit regex captured the section's intro
  prose instead of its table (14 false-positive findings); the fitness gate
  replayed pre-rotation turbo cache (napkin CRITICAL asserted on a 43-line
  file); a persisted `cd` made the napkin "vanish" under relative paths.
  Each caught only by grounding against the artefact before acting. Cure
  shape: a fresh audit script's first output is a self-check (known-answer
  or count sanity), and tool/gate output gets an mtime/state cross-check
  before its zones drive action.
- **Claim-scoped interleaving needed zero ceremony** (worked instance for
  comms-ceremony-minimal): consolidation re-scoped to unclaimed surfaces,
  the register flip left visible as a hand-off, and the live curator picked
  it up within minutes — collision-safety reads + visible artefacts sufficed.

### Mistakes Made

- Editing tools mangle escape-adjacent non-ASCII beyond PUA: one edit turned
  an em-dash into the literal text `\u2014` while converting PUA literals to clean
  escapes. Refinement of the graduated corollary: byte-verify any edited
  line carrying non-ASCII near escape-like content.

## 2026-06-03 — skills taxonomy rehome + ADR-189 (Blustery Lifting Gale)

- **Re-derive tracked-vs-untracked at move time, not from turn-start memory.**
  An owner commit (`7ca7b918`) landed mid-session and flipped my
  untracked turn-1 files to tracked; the planned `mv`/`rm` then produced
  worktree `D` statuses I had not predicted. Harmless here (intentional
  moves), but the same stale assumption against a delete would have been a
  signal missed. Same family as verify-before-referencing under live
  parallel curation; the trigger here was owner action, not a peer agent.
- **Comms CLI flag asymmetry cost two failed sends**: `comms direct` takes
  `--kind`/`--subject`; `comms append` takes `--title` (+ required
  `--created-at`) and has no `--kind`. Existing
  `project_comms_cli_grounding_gap` memory names list/show gaps; add the
  write-side asymmetry to that friction family. Also self-caught: a stray
  draft fragment in the first body — re-read bodies before send.
- **The discovery/ collection was the decisive grounding find** for the
  rehome question: the word "skills" pulled toward taxonomy/agent-tooling
  lanes, but distribution-channels substance belonged beside
  `agent-skills-discovery.plan.md`. Cheap Explore sweep before forming the
  location verdict is what surfaced it.

- **Owner correction (rigour ≠ branding): my "org-voice" lump conflated
  Oak's pedagogical/factual-rigour standards with literal branding.** I
  classified `oak-brand` + `oak-tone-of-voice` as one "org-voice" ambiguous
  case; the owner split it: branding (visual identity, writing voice) is a
  capability concern; rigour standards (evidence, provenance, caveats,
  teacher judgement) are constraints that travel INSIDE capabilities under
  curriculum/evidence governance. Misclassifying rigour as voice would have
  demoted Oak's core differentiator to styling. Cure landed in the taxonomy
  plan's ambiguous-case note; the general lesson: when a candidate category
  lumps a quality-standard with a presentation concern, split before naming.

## 2026-06-03 — opener-as-artefact reflection (Mossy Whispering Bark)

### Patterns to Remember

- **Opener transit-corruption, instance 2 — pattern holds at n=2.** The pasted gate-session
  opener lost four mid-token spans; two hit intent lines (the ADR-routing clause and the
  `active/` promotion gate-set). Thread record + plan + hook-persisted remember artefact carried
  the exact text. Existing "openers degrade in transit" pattern confirmed; cure unchanged:
  launch from files, treat paste as lossy transport.
- **Openers may compress canon, never silently extend it.** The opener's "take G-8 in-session
  if capacity allows" had no durable source — the thread record sequences WS-D1 → G-8 after the
  gates; the plan is placement-agnostic (`depends_on` only). Net-new commitments in an opener
  are proposals and must be marked as such. Sibling of no-unauthorised-scope-invention for the
  opener genre. n=1, watch.
- **Gate-outcome vocabulary needs a third word.** decide | park (PDR-058) cannot express
  "reject-as-framed"; without it, owner hesitation at a mis-posed gate gets coerced into a
  decision or a costume-trigger park. A reframed gate routes back to synthesis and edits the
  gate row itself — a different recording shape from a park, which only dates it.

## 2026-06-03 — closeout insights (Blustery Lifting Gale)

- **Missed a directed comms event for ~90 minutes during deep work.** Furnace
  Roasting Brazier sent a directed request at 17:22Z (vocabulary line-wrap
  under my live claim); I found it at ~19:50 only because a commit-window
  collision check made me read the comms dir. The request happened to be
  already satisfied by my independent fitness cure — luck, not process. The
  periodic-comms-check duty needs a structural moment in long single-agent
  work: the natural anchors are claim-open/claim-close and every
  commit-window entry, not "when I remember".
- **The commit window is a moving target under live parallel agents —
  re-derive the tree per chunk, not per pass.** New peer files went dirty
  TWICE during the five-chunk commit pass (Furnace school-data-search edits;
  then a live schema-resilience edit arriving with its own commits). Same
  family as this morning's tracked-vs-untracked lesson, now at commit
  granularity: each chunk's pathspec came from a fresh `git status`, which
  is why nothing foreign was swept. What-works confirmation: six-plus agent
  sessions landed on one branch today with zero collisions — claims +
  explicit pathspec staging + per-chunk re-derivation carried it.

- **Third moving-window instance, and the backstop held: `git commit` failed
  with `cannot lock ref 'HEAD'` when a peer's commit landed in the same
  instant.** The failure was the correct outcome — git's own ref lock is the
  final collision backstop when no claim is open on the commit window — and
  the cure was simply re-deriving (`git diff --cached --name-only` to confirm
  the staged set was still exactly mine) and re-committing against the moved
  HEAD. Sharpened reading of the never-delete-index-lock doctrine: the lock
  family is not friction, it is the last line of the same protection the
  claims substrate provides socially.

## 2026-06-04 — gate-session closeout reflection (Mossy Whispering Bark)

### Patterns to Remember

- **The session's root error: privileging a compiled/inherited source over
  first-principles grounding against the requirement + primary sources.** Four
  owner corrections, one root — (1) precedent-hunting (treated the existing
  Express app as a decision input for a runtime already settled on merits +
  owner intent; existence ≠ correctness; the First Question used as a
  cheap-cure lever); (2) cron over-engineered from the briefs' hourly+guard
  workaround without re-asking what a once-a-day job needs; (3) relayed a
  single-brief caution (Welsh independents) the report had compiled as
  consensus; (4) F-C / NI / coordinates all rested on unverified brief claims
  the verification pass overturned. Cure (stance): decide from requirements +
  primary sources; a unanimous recommendation + owner intent makes a gate a
  *confirmation*, not a fork; never import precedent or source-framing as a
  decision input without re-grounding.
- **Generalise the root on the FIRST correction — don't patch the instance.**
  The same root recurred four times because I fixed each instance instead of
  sweeping for siblings. After the Express correction I should have pre-verified
  cron, NI, coords, and F-C before presenting them as verdicts. A correction
  names a *pattern*; re-audit the in-flight work for other instances of it.
- **A synthesis report COMPILES claims; it does not CERTIFY them** (strengthens
  the "convergence inherits its frame" entry to n≥2). The report graded citation
  confidence but not frame-dependence or primary-verification status, so
  single-brief claims and frame-dependent convergences wore the same authority
  as verified facts. Cure (now owner doctrine, baked into the plan): high-stakes
  external claims are primary-verified before the artefact is *delivered*; a
  compiled evidence base must tier claims by verification status.
  **Graduation candidate** — synthesis-method doctrine; connects to
  `verify-data-supports-shape-before-building` + `verify-dont-trust`.
- What worked: one-gate-at-a-time surfaced the errors at human-reviewable
  granularity (a batch would have buried them); the 5-agent verification pass
  paid for itself (3 reopened gates); record-at-decision-time made every
  correction durable; and the `.remember` retirement was caught at closeout by
  re-deriving rather than trusting the hours-old session plan — the lesson
  landing on its own tail.

## Session: 2026-06-04 - EEF D4 contract + decision B + migration metaplan (Burnished Glowing Spark)

### The root that recurred five times (graduated to auto-memory: value-first-existing-is-malleable)

- I treated the **existing state of things as a fixed constraint** five times,
  each in a different costume, and the owner corrected each: (1) over-inherited
  the live `GraphView` contract instead of asking if it should survive; (2)
  recommended *deferring* the substrate seam by reading the current consumer
  count as a constraint (consumers were sequenced; prerequisite is a *more*
  natural `subgraph` fit than EEF); (3) reasoned form-first from misconception's
  *current generated serialization* ("flat, no edges") — but we generate it from
  bulk data, so its shape is ours; (4) treated owner-ratified decisions as
  frozen, guarding the owner's past decisions against the owner; (5) patched a
  frame-overturn (migration plan) as a bolt-on amendment instead of scoping a
  reshape. **The frame:** the fixed points are the value constraints (maximise
  user value; don't flood agents with irrelevant tokens) + our design agency
  (we build the data objects AND the substrate). Everything else — code, data,
  plans, ratified decisions — is malleable. Reshape on frame-overturn; do it
  openly, with reasoning, with ratification. The owner had to say it five times;
  the success test is the next session not needing the sixth.

### Surprises / corrections

- **The opener was ~27 commits stale, not "one commit"** — HEAD had moved from
  `0df07152` to `0df07152`+27 (realignment, school-data-search, skills-taxonomy)
  since the cited D3 commit. "Openers are one commit stale" badly understates
  drift in a live multi-agent window. Re-derive from git unconditionally; verify
  every estate claim (the opener's HEAD sha, ahead-count, and a tool rename were
  all wrong) — but check whether the staleness *touches your inputs* before
  chasing it (mine didn't; D4 inputs were byte-identical).
- **"Nothing committed" is unprovable in a shared-tree window.** I told the owner
  "nothing committed" repeatedly; a parallel commit (the owner's `ca927e40`)
  then swept my whole working tree. Say "*I* haven't committed," never "nothing
  is committed." I correctly investigated the git-state anomaly (reflog + per-file
  log) and surfaced it truthfully before learning it was the owner — that reflex
  was right.
- **Re-poll active-claims/comms at each new-work boundary, not just session
  open.** I authored a metaplan for the migration overhaul that was *already
  active under Twilit Cascading Supernova*; my collision read was at session open
  only. The metaplan wasn't wasted (ratified, handed to Twilit via comms), but the
  re-poll should have preceded creating a plan in a shared thread.
- **Scoped `markdownlint --fix` is not surgical on list style.** Running it on
  one file flipped all 17 pre-existing `-` bullets to `+` (MD004 consistent
  mode), which then committed. Aligning a file you're editing to its config is
  fine, but know that `--fix` rewrites *every* bullet, not just yours.

### Method note (decision B)

- A `guidance_report` node kind that **deduplicates exactly one leaf** corpus-wide
  (`{title,url}`, no body/edges) and buys no v1 user value is complexity without
  payoff — and it was the single biggest complexity driver (heterogeneous
  `TNodeId`, second id type, second edge type) and the most-contested reviewer
  surface. Inlining it collapsed all of that. Token + value lens first; the
  graph-node-ness was foundation-building misplaced in the first consumer.
  **Graduation candidate** — connects to `consolidate-at-third-consumer`,
  `existence-is-not-correctness`, PDR-058 §design-optionality.

## 2026-06-04 — school-data-search deep review (Fiery Sparking Caldera, 80d50a)

- **Twice imported a cross-thread frame into a review; corrected both times.**
  Treated "no named in-repo consumer" as a near-blocker (value-trace doctrine)
  and used the EEF value-reckoning as a review lens. Owner: need + value are
  settled (any education service must let users pick their school); "this
  service has exactly NOTHING to do with the EEF work." Cure: review from the
  artefact's OWN value + the owner's frame; horizontal infra legitimately
  precedes its first in-repo consumer. The empty consumer-grep *felt* like
  evidence because it flattered the frame I walked in with — convenient-claim
  failure as pattern-completion, not sloppiness. Captured: auto-memory
  `feedback_no_cross_thread_analogy_in_review`; distilled.
- **The review's value was critical assessment, not fan-out.** Workflow-1's
  evidence base was strong, but the load-bearing move was rejecting the
  value-trace agent's three "blocker" verdicts (invalidated premise) and
  re-grounding fidelity/external claims against the artefacts myself.
- **Canonical-ID sharpening (applied to plan WS4):** a present/stable field is
  not a unique identity — Scotland SEED can be 1:many. Connects to the owner's
  new `present_key_is_not_graph_identity`.
- **What worked:** held hypotheses instead of asserting; surfaced the peer
  commit-window collision (foreign staged file) instead of barging;
  per-question recommendations with the recommended option first.

## Session: 2026-06-04 - graph-tools migration-plan overhaul (Twilit Cascading Supernova)

### Patterns to Remember

- **I kept designing from the existing TOOL/output shape, not the DATA ASSET —
  and the owner lifted me up a level four times in one session**:
  migration→redesign (kept "replacement units"); whole-corpus→bounded (kept
  "a tool returns a thing"); filter→graph (kept "an *anchored* tool"); then
  slug-as-id (kept a present field as identity). One root: anchor design on the
  data asset + its true identity/structure, surfaced as VIEWS — not on the tool
  that happens to exist. Reflexes captured: auto-memory
  `feedback_check_bulk_schema_before_declaring_data_unsourced` (read the bulk
  SOURCE, not the lossy generated projection) +
  `feedback_present_key_is_not_graph_identity` (verify cardinality; placement is
  an edge, not identity).
- **A plan patched ~15 times risks becoming half-reframed — the exact failure
  it was overhauling.** Before declaring "happy", I ran a coherence pass and
  found the todos/§tool-set still carried the OLD per-corpus-re-emission frame
  while the principles said one-graph+views. "Reshape, don't patch" applies to
  the editor too: a many-edit plan needs one read-through against its own spine.

### What Worked

- Verified the owner's "lessons can be in 2 units" against the bulk data (rare in
  the snapshot: 0 cases) AND honoured it anyway — common-case-unique is the trap;
  the model must be correct for the edge case by construction.
- Surfaced the multi-lane uncommitted entanglement (my overhaul + Shadowed's D4 +
  school-data-search) before committing, rather than sweeping another lane's
  owner-gated ratification work into my commit.

### Mistakes Made (closeout phase)

- **Wrote an auto-memory reflex file to a stray `<repo>/memory/` path instead of
  the per-user dir** (`~/.claude/projects/<project>/memory/`). Caught it only at
  commit time as an untracked `?? memory/` at repo root — it would have polluted
  the repo. The per-user auto-memory lives OUTSIDE the repo; the long absolute
  path is easy to mistype and a repo-relative-looking path silently resolves to
  repo root. Verify the auto-memory absolute path on every memory write. Cure
  applied in-session: relocated the file to the correct dir (content preserved),
  removed the stray.

## Session: 2026-06-04 - EEF D4 review-then-ratify + cross-plan coherence (Shadowed Creeping Secret)

### Patterns to Remember

- **Ground a "premature/inherited" verdict in the rule's TEXT, not its name.**
  Four reviewers flagged D4's substrate justification as misciting
  `consolidate-at-third-consumer` ("satisfied" at two consumers — it fires at the
  third). The decisive resolution came from reading PDR-058 §Surface 2's actual
  text (its nameable-concrete-second-instantiation test), which showed the generic
  is EARNED, not napkin-trap-#1 inherited shape: ADR-179 forbids EEF names in the
  substrate, so EEF's own typed-id-flow need FORCES parameterising over
  `TNodeId`/`TEdgeType`; prior-knowledge is the nameable second binding. The rule
  NAME was garbled (fred had a prior miscitation on this exact PDR); the rule TEXT
  decided. Sharpens `validate-specialist-findings-before-acting` +
  `ground-convenient-claims`.
- **Adversarial de-escalation earned its keep**: the verify stage overturned 3 of
  19 specialist findings as false positives and cut several material→minor —
  specialists-over-escalate confirmed at n+1. Re-grounding each finding against the
  artefact (not the reviewer's severity) produced the honest verdict.
- **Cross-lane coherence held by shared substrate, not direct sync**: my D4
  contract and Twilit's redesign plan independently converged on "`manifest()`
  absent at D5; the redesign re-adds it when its first view is built" — the thread
  records + bidirectional plan cross-references carried it. Worked instance for
  comms-ceremony-minimal: reading both artefacts confirmed coherence; no live sync.

### Vigilance / What Worked

- **Moving window benign x2, each verified before proceeding**: HEAD moved twice
  mid-session (school-data-search `1839e9b8`; Twilit's redesign+continuity
  commits). Twilit's `12c745f0` swept my uncommitted thread-record banner into
  their commit — content preserved (verified present in HEAD), not lost; my
  d4-flip + corrections stayed uncommitted (mine). "Say *I* haven't committed,
  never *nothing* is committed" held again.

### Owner Insight (carried forward; homed in auto-memory + Twilit's redesign plan)

- The **bulk source is a far richer graph substrate than today's generated corpora**
  (lossy projections). EEF's first delivery — and **only** the first — runs on the
  current prereq/misconception tools as-is; the redesign should be **open to
  significant but still graph-shaped change** (reshape for value from the bulk
  richness; design-in-our-power, not behaviour-preservation). Homed:
  `feedback_check_bulk_schema_before_declaring_data_unsourced` (extended) + the
  value-redesign plan.
