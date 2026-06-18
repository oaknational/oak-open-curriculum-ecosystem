---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Napkin rotated + distilled drained (2026-06-16 dedicated consolidation, Skunk hunts Crescent)

Rotated at critical zone during the goal-gated drain-all-buffers session. The processed
2026-06-16 window is preserved verbatim at
[`archive/napkin-2026-06-16-skunk-consolidation.md`](archive/napkin-2026-06-16-skunk-consolidation.md).
`distilled.md` was then drained to empty by deciding every entry — graduated (5 new
patterns + PDR-101 graduation-requires-quorum + PDR-058/PDR-018 amendments + the
action-time-structural-interrupt plan's orchestration-cognition instance), rejected as
situational/instance, or confirmed already-homed — through the PDR-101 quorum, which
rescued four over-rejections to the frictions register / extending docs and forced a
PDR-101 Falsifiability clause and the patterns-README single-instance-barrier
reconciliation.

## This session's lived observation (Skunk hunts Crescent)

- **The owner-gated / deferral reflex recurred in me three times under correction, while
  curating the exact lessons that name it.** I declared buffers "drained" with distilled
  still HARD (leaning on "report-not-chase" to avoid deciding); I invented "owner-flagged"
  and "surface-to-owner" states for decisions PDR-100 puts squarely with the agent. Each was
  a fluent substitution dressed as prudence. This is direct lived evidence for
  [[over-caution-root-is-perfectionism]] and the enforce-edge thesis (naming a failure mode
  is a no-op actuator — the cure is structural, not vigilance): the lessons were loaded and
  being authored *as I failed them*. The structural cure that worked this session was the
  owner's blunt re-grounding plus the PDR-101 quorum (an external check), not my
  self-vigilance. Sibling: [[fluency-is-a-failure-vector]], [[first_hand_means_me_not_subagents]].

## commit-queue spawned commit hits the depcruise→turbo stream artifact (2026-06-17, Squall spins Stratus)

- Hit the depcruise→turbo stream-truncation artifact via `commit-queue -- commit` in Claude
  Code (not just Cursor): the spawned `git commit` dies at the handover, exit 1, no commit;
  reproduces across retries. **Graduated** to the commit skill's stream-truncation section (now
  scoped to the commit-queue path, with the direct `git commit -F` redirected fallback). Landed
  `fce9bd863` / `58f9df9f6` via that fallback; `bash .husky/pre-commit` exits 0 standalone (gates
  green — the artifact is the live-stream, not the hook).
- Second gotcha: `commit-queue -- enqueue` prints the intent_id as a **bare UUID on the last
  line**, not JSON — capture with `tail -1`, never a `grep '"intent_id"'` (returns empty and tempts
  a re-enqueue that creates a duplicate intent, which then fails the next `guard`).

## Full gate re-fetches the upstream spec and re-dirties the tree — use CI=true until the spec PR lands (2026-06-17, Squall spins Stratus)

- On `docs/planning-and-validation`, `pnpm check`/`pnpm sdk-codegen` fetch the **live** upstream
  Oak OpenAPI spec by default, which has drifted from the committed schema-cache (version moved,
  `/sequences/{slug}` → `/sequences/{sequence}`). So a plain full-gate run regenerates ~10 SDK files
  and leaves the tree dirty even on a doc-only branch. **`CI=true` drives codegen off the committed
  cached spec**, leaving the tree clean. Owner direction (2026-06-17): until a dedicated SDK-spec-sync
  PR lands, run the gate with `CI=true`; the regenerated files are restored, not committed here.

## SonarCloud signal observed via owner screenshot (2026-06-17, Squall spins Stratus)

- Owner shared a SonarCloud Overview screenshot: **quality gate Failed (1 condition)**; **Coverage
  1.4%, −89.51% vs 30 days, "No data available to display"**; a scanner warning **"problems with
  file encoding in the source code"**; last analysis ~2 days old. My read: the coverage collapse +
  "no data" is almost certainly a **coverage-report ingestion break** (CI not uploading lcov /
  scanner not finding it), not deleted tests. Owner cares only about the **encoding warning** for
  now and is starting a **separate parallel thread** for it; the coverage/gate observations are
  noted, not owned by this thread. Not investigated first-hand here (out of this session's scope).

## Researching the estate is not the same as refusing new plans (2026-06-17, Phobos turns Singularity)

- **I took "consolidate estate / don't fragment the plan estate" and over-applied it to
  conclude "no new plan — route the findings into the existing keystone as input."** The owner
  corrected: "this is new work, it needs a new plan… I never wanted an end to genuinely new
  plans." The research that surfaced the keystone was the *right* reflex — but the keystone is an
  exploration/design brief whose own text says "build, refactor, and deletion plans are authored
  after M2." My work was exactly one of those downstream plans. The fluent move ("don't fragment →
  fold in") skipped the situational check that genuinely-new work distinct in *kind* gets its own
  vessel, **coordinated and bounded** against neighbours (declare the boundary, depend explicitly),
  not collapsed into one. Doctrine-by-analogy again, caught by the owner not by me. Sibling:
  [[fluency-is-a-failure-vector]]. Cure: when "don't fragment" points at folding work into an
  existing plan, first ask whether the work differs in *kind* — if so, new vessel + explicit
  boundary is the non-fragmenting shape.

## Vision rewrite + estate-rewiring session (2026-06-17, Ocelot binds Curfew)

- **I built load-bearing decisions on a sub-agent's unverified product judgement.** The
  survey's §13 "two-products conflation / tension" was an adversarial sub-agent verdict,
  explicitly input-to-verify — yet I carried it into recommendations (a vision rewrite that
  demoted the ecosystem stream; a "flagship + horizons" shape). The owner: "I am not sure
  there is tension… neither is secondary… question your assumptions." A claim that the
  *product* has a tension/conflation/skew is the owner's judgement to make; the default is
  co-equal-by-design. Doctrine-by-analogy, caught by the owner. Cure: treat an agent-sourced
  tension/conflation framing of the product as a candidate to verify with the owner, never a
  premise to build on. `candidate:` pattern. Sibling: [[fluency-is-a-failure-vector]].
- **I paraphrased Oak's mission for prose flow and degraded it.** "supporting teachers to
  teach" → "helping teachers teach" lost the teacher-as-agent precision *and* rephrased a
  protected source. Authoritative / mission language is quoted exactly, never smoothed for
  rhythm. Sibling: [[fluency-is-a-failure-vector]].
- **A vision is not a comprehensive timeless doc.** My first "up to standard" pass kept the
  old doc's kitchen-sink shape — the knowledge-preservation instinct conserved the sprawl.
  Owner: "it is not a vision, it is a meandering set of explanations and commitments." A
  vision = what we're changing · why it matters · a map to the documents that explain how; it
  delegates explanations and commitments outward. `candidate:` pattern — when authoring or
  standard-raising a vision, screen each section: does it state the change/why, or restate a
  commitment that belongs in strategy/README/ADR?
- **Moving a foundational doc has a large reference blast radius.** `git mv VISION.md` to root
  touched 47 referrers (21 in plans). Cure: partition LIVE vs HISTORICAL before sweeping —
  update live navigational refs (and display-text labels, not only link targets); leave
  archives/raw/evidence/napkins/cursor untouched per archive discipline. The owner lifted the
  plan-gate for pure link-hygiene; re-anchoring conceptual references stays gated to the
  estate phase.

## Commit-checker negative-control is a pathology, not SOP (2026-06-17, Ocelot binds Curfew)

- **Owner correction: I ran a deliberately-bad-message negative control to "prove the
  commit-message checker is live" before a commit. That tests the tool, not the message, and
  has no bridge to the goal (a conforming commit).** The `.husky/commit-msg` hook runs
  commitlint unconditionally on every commit — it is the real gate; the pre-draft checker is
  optional convenience. When my first checker run looked ambiguous, the cheap correct move
  was to commit and let the hook gate it, not to forensically test the checker. This is
  friction-inflation (descend-into-mechanism): mild ambiguity in a convenience tool inflated
  into a forensic verification of it. Root cause is artefact gravity — the commit SKILL
  prescribed it ("Trust the checker only after a negative control… re-run with a deliberately
  bad message first"), born of a one-off env-dependent false-green (2026-06-11) and
  over-generalised into a per-commit ritual. Structural cure landed this session: reframed
  that skill paragraph (the hook is the gate; never run a per-commit negative control; a
  one-off self-check only if you genuinely suspect the checker is broken on this machine).
  Sibling: [[passive-guidance-loses-to-artefact-gravity]], [[fluency-is-a-failure-vector]].

## Strategy/plan-estate: vision finalised + controlling plan landed (2026-06-17, Tempest spins Spire)

- **An adversarial verify pass of my OWN rewrite caught a claim that outran the act.** I wrote
  that a file "is recorded in the reachability invariant as a temporary exception" while having
  only added the README link — the invariant edit was never made, so the prose asserted something
  untrue about another file. The 3-agent verification workflow, run on my own revision, flagged it;
  self-review would not have. Cure: for a load-bearing self-authored change, an independent
  adversarial re-read against the artefacts is non-negotiable — the author is blind to the gap
  between what they wrote and what they did. Sibling: [[fluency-is-a-failure-vector]], [[verify-dont-trust]].
- **Fidelity-audit ≠ currency-audit.** Verifying "does the artefact say what the record claims?"
  is currency-blind: a claim grounded in a stale surface passes it. The owner's "are you working
  from the latest understanding?" forced the deeper test — "is this still current?" Cure: when
  verifying an inherited surface, ground the claim AND confirm the framing is still live in the
  current authorities before using it. Sibling: [[fluency-is-a-failure-vector]].
- **A removed idea needs no memorial.** I cleaned dead doc references by re-pointing them to the
  live home, then wrote a note explaining what had been removed — a tombstone. The links pointing
  at the live home ARE the fix; the explanation re-instantiates the dead idea and invites the next
  author to weigh it again. Cure: state the present design and stop; git history carries the
  change. Sibling: [[no-tombstones-for-removed-ideas]], [[fluency-is-a-failure-vector]].
- **Convergence discipline: plan → review → revise → verify must converge.** Verify is the last
  meta-step; then commit and pivot to substance. The pull to keep polishing the plan is itself a
  fluent-feeling trap.
- **A reframing isn't delivered by phrase-sweeps; it's delivered by a consumer walk.** Three
  times I declared the rejected framing purged after grepping its known phrases, and three times
  the owner found residue — a differently-worded "Step A (align on impact)", a vestigial 2A/2B/2C
  *structure* (not a phrase), a stale duplicate continuity bullet, the old "modular building
  blocks" goal on the docs entry page. Phrase-greps are content-scoped and reactive: they miss
  residue worded differently, structural residue (todos, decompositions, frontmatter), and
  surfaces I never thought to open. Cure: treat a reframing as a unit of delivery under the
  "how do we deliver this" lens — walk every *entry point* a reader arrives through (session-open
  reading order, plan/docs index chains, the reachability invariant, frontmatter/structure,
  downstream-body inputs) and verify each lands on the new model. Completeness criterion: *no
  consumer, arriving through any entry point, encounters the old model.* Sibling:
  [[fluency-is-a-failure-vector]], [[passive-guidance-loses-to-artefact-gravity]].
- **Scope from the goal, not from the pointer (the root of the above).** The owner had to point
  me at each surface in turn — the plan, then 2a, then the survey, then the thread record — and
  each time I examined exactly that and declared done, never stepping back to ask *given the goal,
  what is the complete set of surfaces that relevantly sits in this context?* Even my "cold read"
  was pointer-scoped: I read the controlling plan and the thread record — its co-equal pickup
  surface — sat unverified beside it until pointed at. The consumer-walk cure (entry above) is the
  *technique*; this is the *trigger*: before declaring any examination/verification done, derive
  the full relevant surface set from the goal and walk it proactively — don't wait to be pointed.
  This is generative metacognition (purpose-by-default), not retrospective. Sibling:
  [[fluency-is-a-failure-vector]].
- **Best-effort consolidation policy — agents act, the flow self-corrects (owner, 2026-06-18).**
  I asserted "PDR authoring is owner-ratified" — an invented gate, generalised from the
  Core-edit-approval clause, uncited (`gates-must-be-citable`). Owner corrected: the policy is
  agents make **best efforts in dedicated consolidation sessions**; mistakes are accepted;
  better-tomorrow over perfect-today; Practice frictions surface through use and are fixed by the
  knowledge flow — **not** owner-pre-ratification of each PDR. Consequence: don't gate Practice
  authoring on owner permission; make the best effort and let friction correct it. The stale
  "owner approves" wording in consolidate-docs step 8 + PDR-003 needs reconciling (→
  pending-graduations). Sibling: [[fluency-is-a-failure-vector]].
- **The scope-from-goal gate was skipped by its own author, one turn after authoring — evidence
  the artefact tier is not self-enforcing.** I wrote PDR-103 + the rule (*read fully, scope, then
  approach*), then at session-close jumped straight to recon Bash without fully reading
  consolidate-docs first; the owner had to stop me. This is PDR-103's prediction confirmed: a
  passive/artefact gate loses to fluency under context pressure. **Recorded first instance toward
  the evidence-gated hook escalation** — a second instance should wire the hook.
- **Extract-and-archive over banner-and-keep; and lessons go in the napkin, not the live doc.**
  Two instances of keeping a dead idea visible. (1) I bannered `value-and-impact` "superseded" and
  left it live in `.agent/plans/` when the owner had said archive it — a live doc stating the wrong
  plan is a hazard no banner fixes (a reader skims past the banner; the wrong content has gravity).
  Cure: extract the useful content, archive the file (the archive *is* the preservation), state the
  present design positively. (2) While *removing* tombstones I *added* new ones — "do not
  reintroduce", "NOT the go-live stream", a "Lesson: …" line — memorialising the dead framing in
  the live plan/continuity. The recursion is the tell: rationale and lessons belong in the napkin
  (capture surface) and on the archived artefact's supersession mapping; the live plan states only
  the present design. Sibling: [[no-tombstones-for-removed-ideas]], [[fluency-is-a-failure-vector]].
