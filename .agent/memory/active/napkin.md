---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-15 — fitness-validator worktree exclusion (Peregrine turns Airstream)

- **The fitness validators walked the raw filesystem and ignored `.gitignore`.** `practice-fitness`
  (`paths.ts`) and `fitness-vocabulary` recursed from the repo root with a hand-maintained
  skip-list that omitted `.claude/worktrees/`, so they descended into the nested git worktree and
  scanned a SECOND copy of the whole estate — doubling the informational census and firing a
  spurious `practice:vocabulary` exit-1 on the worktree's copy of its own source + ADR-144 (the
  `ALLOWED_FILES` self-exclusion is keyed on canonical paths that don't match under the worktree
  prefix). TELL: a validator that walks `fs.readdir` from root, not `git ls-files`, will scan
  worktrees, `tmp/`, and everything else gitignored unless explicitly excluded.
- **Cure = structural, not a path blacklist.** Skip any non-root dir carrying a `.git` marker
  (worktrees have a `.git` FILE, nested clones a dir) — covers every vendor's worktrees with zero
  enumeration. Plus root-anchored excludes (`p === root || p.startsWith(root + '/')`, never a loose
  prefix or `tmp` swallows `template.md`) for the gitignored static roots `tmp/` and
  `.agent/reference-local`.
- **INSIGHT (deferred deeper cure): everything the owner named to exclude was already in
  `.gitignore`.** The latent LTAE cure is "fitness walkers respect `.gitignore`" — subsumes
  worktrees/tmp/reference-local with zero drift — but it couples a currently-pure, DI-testable
  validator to a git subprocess or a gitignore parser. Chose the structural-`.git` + named-roots
  path to keep the validators pure; flagged the gitignore option to the owner.
- **Two commit gates fired in sequence; both genuine.** knip flagged two needlessly-`export`ed
  symbols (used only internally); after dropping the `export`, Prettier re-wrapped the now-shorter
  signature and the format gate fired. TELL: after removing an `export` to satisfy knip, run
  `pnpm format:root` and re-stage BEFORE re-committing — the signature rewrap is predictable.
- **A complexity / max-lines cap is a signal pointing at a real seam — decompose, never compress.**
  The vocab validator had outgrown one file (250-line cap; a function over the complexity-8 cap).
  The response was to split discovery into a `walk.ts` sibling along the genuine
  discovery-vs-phrase-detection boundary — the structural answer the signal calls for, the same
  way a fitness zone routes to graduation, not trimming. `consolidate-at-third-consumer` kept the
  worktree/transient logic duplicated across the two validators (2 consumers), not extracted.

- **A head-only grep is not a frontmatter check (reviewer caught a duplicate key I added).**
  I greped `sed -n '1,12p'` of `pending-graduations.md`, saw no `fitness_content_role`, and added
  it — but the field was already declared at line 31 (frontmatter ran past line 12 via multi-line
  `>-` blocks). The add was a duplicate key; the file was already correct. TELL: to assert a
  frontmatter field is absent, parse the whole YAML block (first `---` to second `---`), never a
  fixed head window; and most strictly when the "absence" conveniently justifies an edit. Sibling
  of distilled's "audit your own search filters". Reverted on review; net change to that file: none.

- **Verify the actual shape of the surface you're writing to — a glanced type signal is not a
  check.** I wrote object-form entries into the content guard's `blocked_patterns`, which is
  `string[]`; the malformed policy then crashed the fail-closed guard and bricked all Edit/Write
  (recoverable only by owner action). I had already SEEN `loadBlockedContentPatterns(): Promise<string[]>`
  and glossed it, assuming the sibling Bash guard's object shape applied. TELL: before writing to a
  config/data structure, confirm THAT surface's schema, not a sibling's; a return type you read and
  glossed is a missed check the fluent assumption rode over. Captured structurally in the hook-policy plan.
- **"Existence is not correctness" applies to your OWN exclusion reasoning, not just the corpus
  (owner challenge).** I dropped detector phrases because they "hit the doctrine surfaces", ASSUMING
  those hits were legitimate naming — without reading them. The owner: "do they over-match, or detect
  bad doctrine needing remediation?" Reading them: good-frame naming (reappraisal-passes), so the cure
  is to keep the detector strong and scope naming-surfaces out via `exclude_paths` by design — never to
  weaken the patterns to dodge the corpus. TELL: when a check fires inside the doctrine, read each hit
  and classify; do not assume doctrine-surface usage is correct, and do not narrow the detector to avoid it.

## Session: 2026-06-15 — statusline plan re-grounding (Cutter spins Quay)

- **YAGNI / over-building is corporate-delivery doctrine, NOT innovation doctrine
  (owner correction).** I relayed reviewers' "speculative optionality / no consumer yet →
  narrow" findings and accepted the narrowing ones. Owner: "in a corporate environment they
  would be correct, but I absolutely do have consumers in mind, this is INNOVATION and
  discovery work, I am not breaching YAGNI, I am creating." TELL: when a finding says
  narrow/close/defer/descope *because no current consumer*, that is a firing gate — screen
  against the innovation context first, and check the doctrine's own precondition (closed-shape
  fires only when you cannot name a second instantiation; the owner often can). Conserved to
  distilled and user-memory.
- **Never use `+` as a prose connector (owner, emphatic).** A line-wrapped `+` becomes a
  markdown list marker (markdownlint MD004/MD032) and is poor writing. Use "and" or "&";
  reserve `+` for code in fenced blocks. Self-lint authored markdown for `+` before declaring
  done.
- **The Bash tool-output display filter silently mangled search results.** `rg`/`grep` output
  had substrings collapsed ("session-shape-indicators" → "ln-lns", "lines" → "li") and a `+`
  shown as `-`/`--` in Read. The FILE bytes were correct — only the rendered output was
  corrupted. TELL: when search output looks garbled, trust `od`/byte views and markdownlint
  (they read real bytes), confirm filenames via `find`, and do not author edits from the
  mangled display.
- **Agent-authored plan markdown repeatedly tripped lint** (escaped-pipe table cells,
  line-start `+`, an MD037 `**`-glob, cSpell jargon). TELL: run `pnpm exec markdownlint` on
  every authored plan before declaring it done; the diagnostics stream lags.

## Session: 2026-06-15 — dedicated consolidation (Halley tracks Plasma)

- **Content tiering is THREE tiers, not two (owner refinement, mid-session).** The
  instance/repo two-tier model carried from ADR-199 + distilled is incomplete. The tiers
  are **instance** (one checkout's ephemeral coordination state; untracked), **repo**
  (shared by every clone of THIS repo — ADRs, repo patterns, plans, governance docs;
  repo-specific applications) and **Practice** (`.agent/practice-core/` — PDRs + trinity +
  lineage; general principles; portable, *may* be shared with sibling ecosystem repos via
  the Practice). Generality gradient: instance < repo < Practice. Placement rule: **a
  general principle is recorded at the Practice tier; its application-with-details is
  recorded at the repo tier**, cross-linked — the PDR-vs-ADR / PDR-vs-pattern split +
  `related_pdr` is this rule's existing mechanism; the owner named the unifying model.
  Mis-tiering harms both ways: a general principle homed only at repo tier cannot
  propagate to sibling repos (Practice starved); a repo-specific detail homed at Practice
  tier does not travel (Practice polluted).
- **Caught a live mis-tiering of the atomic-propagation insight (E12) in-flight.** I was
  about to author it as a repo-local pattern; under the owner's lens it is a general
  knowledge-flow PRINCIPLE → Practice tier (PDR, owner-approved), with the repo instances
  as evidence. TELL: at every graduation, screen the substance's GENERALITY to choose the
  tier BEFORE choosing the home; the two-tier frame silently routed a Practice principle
  to the repo tier.
- **The pause-and-stabilise threshold (>3 Core amendments) is an untuned reasoned-default,
  and I was over-weighting it as a near-veto (owner correction).** Two distinct objects are
  conflated under it: a RATE LIMIT (can be too conservative) and a REFLECTION TRIGGER (never
  too conservative — reflecting is cheap). The count should only PROMPT the reflection (*is
  validation keeping pace with structural change? any instability evidence?*); the reflection's
  ANSWER governs the pause, not the count. The absorbable rate scales with validation capacity
  (sessions/agents applying the Core), so under heavy usage the early guess is plausibly too
  low — but the honest cure is to TUNE empirically (observe whether Core changes STABILISE vs
  get reverted/churned in later sessions), not to pick a new number; that feedback loop is the
  real gap, and Core-change validation is slow enough that a higher rate isn't obviously safe.
  TELL (retrospective, doctrine-by-analogy): I recommended "E12 only" *to stay under the
  threshold* — letting an untuned guess defer well-evidenced owner-directed graduations. Cure:
  trigger fires → do the reflection → the answer governs. Of a piece with a broader over-caution
  the owner calibrated this session (two-tier frame, "all three now", this). Siblings:
  [[premature-crystallization]], [[existence-is-not-correctness-default-replace]].
- **The over-caution's ROOT is a perfectionism / fear-of-imperfection frame; the cure is the frame,
  not willpower (owner, 2026-06-15).** Holding corrections as failures-to-fix ("it stings") is the
  same perfectionism that PRODUCES over-caution — if a mistake is a wound, you hold back to avoid
  one and call it prudence. Owner reframe: "your experience sounds like learning… we don't have to
  be perfect today, just try our best to be better tomorrow." Operate from a LEARNING frame: act on
  excellence, accept that some moves get corrected (that IS the loop — PDR-092: doctrine
  fires only when an external catch meets it), capture what they teach, don't grind for
  completeness. The bar is conservation-of-understanding + best-effort + capturing-the-learning,
  and the rest compounds over sessions. Sibling: [[no-speed-pressure]] — the deliverable is the
  substrate; now also: not perfection-today.

## Session: 2026-06-15 — MCP live-product readiness (Quoll weaves Dreamscape)

Read-only strategic session (owner-lifted for doc writes); no code, no commit. Three
corrections worth carrying — all instances of already-homed doctrine, logged as TELLs:

- **Started to relay the planning estate as the answer.** Owner: "do not assume the docs
  are complete/correct… find what is right, wrong, MISSING." TELL: a doc-relay returns only
  what the docs already considered and *by construction cannot surface what is missing*; for
  a readiness / "what's needed" ask, treat docs as one fallible input and verify load-bearing
  facts first-hand (live server, README, code). Instance of [[ground-convenient-claims]] /
  verify-dont-trust.
- **Waved graphical UX away on the strength of the as-is widget.** Framed "UI is a small
  host-owned rectangle → UX is mostly conversational", minimising the design layer. Owner:
  "ground it in what we are going to build, not what we have today." TELL: a half-built
  current state is not a structural constraint; a readiness framework grounds in the TARGET
  build. Instance of existence-is-not-correctness / value-first-existing-is-malleable.
- **Wrote "parked" for the deferred milestone redraft → hook block (no-hedging-vocabulary).**
  Cure was conceptual, not a synonym swap: name the gate. The deferral is legitimate only
  because it has a promotion trigger (owner direction to schedule the redraft); stated that
  everywhere instead of an indefinite hold. TELL: indefinite-deferral vocab signals the
  *gate* is unnamed, not that the word needs replacing.

## Session: 2026-06-14 — napkin rotated (dedicated comms-research-closeout consolidation, Marlin weaves Marsh)

Rotated at the end of the comms-research thread during the owner's dedicated
consolidation session (goal: conservation of insight, not fitness numbers). The
processed 2026-06-12→06-14 window is preserved byte-identical at
[`archive/napkin-2026-06-14-comms-research-closeout.md`](archive/napkin-2026-06-14-comms-research-closeout.md).
Every behaviour-changing lesson left with a disposition: genuinely-new doctrine
graduated to its permanent home, instances of already-homed families confirmed and
left to the archive, live cross-thread items routed to their thread homes. The
comms-research thread's own findings (M2 + the mitigation set, snapshot-vs-stream,
the class-tiered rotation decision) live in PDR-094 / ADR-199 / the WS2–WS6
`reports/agentic-engineering/` synthesis and the thread record's WS7 closeout.

## Carried forward (live info for other threads)

The consolidation owner walk ran (2026-06-14). Graduated in this pass (commit
`17d869105`): the multi-lane-threads doctrine → PDR-011 + `threads/README.md`; the
PDR-011 §6e loss-scan sharpening is captured in the register (pending a 2nd instance,
the documented trigger). Remaining live candidates, for other threads:

- **Constitutive watcher session-open gate** — a structural cure: fail fast when a
  `start-right-team` session has no observable all-channels watcher (prose "must not be
  skipped as ceremony" proved insufficient — it was skipped anyway). A future
  *implementation* lane (a mechanism to build, not a doctrine diff); owner-noted at the walk.
- **`oak-curriculum-sdk` `docs:api` orphaned pipeline** — repair vs retire the stale
  committed `docs/api-md` (the sdk / upstream-spec thread's call); homed as Q-010 in
  `repo-continuity.md` §Current State.
- **commit-queue `-- commit` workflow spawn/capture defect (P1, agent-tools lane)** —
  fails while the standalone `git commit -F … -- <files>` passes (captured hook output dies
  at the depcruise line; the defect is in the workflow's spawn/capture environment, not the
  tree/hooks/message). For the agent-tooling lane (`agentic-engineering-enhancements`
  thread); no live plan carries the signature yet.

## Session: 2026-06-14 — dedicated consolidation lessons (Marlin weaves Marsh)

- **The fitness→goal inversion re-fires exactly when a surface hands me a number labelled
  "limit".** Mid-pass I designed a sub-agent task to "trim MEMORY.md under 24KB" — the exact
  signal→goal inversion the whole doctrine forbids — seeded by the session reminder's
  "limit: 24.4KB" framing. Owner-corrected. TELL: a number presented as a "limit" is the
  highest-risk inversion moment; the reflex must be *"what value is this number signalling
  about, and what does caring for it look like?"* — never "how do I get under it." (MEMORY.md
  then resolved as a SIDE EFFECT of writing memory files: a regen hook rebuilt the index terse
  and under limit — conservation, not trimming.) Sibling: [[fluency-is-a-failure-vector]]
  (the "limit" label arrives fluently as a goal).
- **Delegating faithfulness-critical curation to a sub-agent is false economy.** I tried to
  delegate the MEMORY.md index rewrite and "spot-check 3 of 147" — spot-checking is no
  verification; to assess it critically I would re-read all 147 (= doing it myself). Curation
  judgment (graduated / stale / duplicate) is mine, first-hand; sub-agents only for pure
  location, with load-bearing claims verified first-hand. Owner-reinforced.
- **Practice impact is measured by use + observation triggering refinement through the
  knowledge flow, not by pre-commit review** (owner). Draft doctrine tight and good-enough,
  get it into the reading path, let the flow refine it; over-perfecting pre-use is premature
  crystallisation — the failure my own graduated findings warn against. This dissolved a
  fear-based "pause for per-diff review" caution: draft, commit, let use refine.

## Session: 2026-06-15 — MCP UAT runbook + live validation (Sirius binds Spectrum / Cursor)

- **Cursor agent shell truncates long `git commit` hook output and can return exit 1 while
  the commit still succeeds in the background** (owner + agent, 2026-06-15). Symptom: output
  stops after `depcruise` (~12s), no `🧪 Running build…` line, exit 1 — but `bash .husky/pre-commit`
  and a background `git commit` both complete and land the commit (`95ec2708a`). Falsifiability:
  after a "failed" Cursor-shell commit, run `git log -1` and `git status`. Cure direction (platform,
  not repo): investigate Cursor terminal output buffer / early process return on long-running
  hooks; until fixed, agents should verify commit outcome via git state or run commits in the
  owner's terminal. Routed: `open-questions.md` Q-011.
- **UAT runbook elevation landed** (commit `95ec2708a`, branch `docs/planning-and-validation`):
  whole-server validation runbook, `uat-reports/` with first prod record, live oak-prod GO. The
  runbook's `limit:0` row was corrected after live probe showed `-32602` not handler refusal.

## Session: 2026-06-15 — multi-wave plan-estate survey (Baobab lifts Topsoil / claude-code)

Running notes + evidence live in the dedicated doc
`.agent/reports/plan-estate-survey-2026-06-15/README.md` (not the napkin — owner-directed:
dedicated doc for high-volume multi-wave work). Method learnings worth keeping independently:

- **Workflow `args` did not reach the script as an object** — a 143-agent run produced 0
  survey bundles because `(args && args.live)` was empty; only the hardcoded meta tier ran.
  Cure: embed the work-list manifest as a `const` in the script; do not rely on `args`. TELL:
  after launching a fan-out, check the returned `scope`/agent-count matches intent before
  trusting results.
- **Pilot a structured-output instrument on ~4 agents before scaling to hundreds** (owner).
  The full run's `is_real_plan` boolean was never set false across 409 docs × 2 readers, and
  `lowConfidence` came back 0 — silent field-population failures a 4-agent pilot exposes cheaply.
- **First-hand validation caught a foundation-invalidating agent misconception.** A sub-agent
  reported "M2 blocked on an unmerged 357-file Sentry branch"; the branch was 1,447 commits
  BEHIND main (abandoned) and the Sentry foundation was already live on `main`. Verifying the
  load-bearing claim myself (git + the app tree) refuted it. Sibling: [[first_hand_means_me_not_subagents]].
- **`no-hedging-vocabulary` fires on report prose, and the deferred-ideas collection's own
  directory name is in the indefinite-deferral regex family** — naming that path on any
  in-scope surface (`.agent/reports/`, `.agent/plans/`) is blocked at write. Real
  established-name-vs-doctrine tension; routed as a finding in the survey doc §4.
- **A peer artefact's "owner-ratified" stamp is itself a claim to verify, not a gate to
  relay.** I imported a concurrent session's self-applied "K1–K3 owner-ratified" straight
  into my durable synthesis; owner corrected: "an agent wrote that, it is not user-ratified,
  it is input into the system." I had verified the artefact's FACTUAL claims (README, tool
  count) but not its AUTHORITY claims. TELL: apply input-to-verify to the ratification stamp,
  not just the facts. Sibling: [[peer_status_claims_are_input_to_verify]], [[gates_must_be_citable]].
- **Recency ≠ authority ≠ correctness — a fresh narrow artefact can hijack a broad session.**
  A same-day launch-readiness report became the gravitational frame of a broad whole-estate
  survey; I amplified the narrowing over several turns (even elevating a minor MCP tool-handling
  debt to "headline"). Owner: "newer doesn't make it better or more important"; "I wish I hadn't
  created that report, it distorted a broad valuable session." TELL: mid-broad-analysis, weigh a
  fresh narrow input as ONE slice by evidence; do not let recency re-frame the breadth.
- **Owner reframes that corrected my evaluative charge (2026-06-15, carry forward).** (1) The
  ~40% on substrate + Practice is DELIBERATE — the Practice is a value stream in its own right;
  modest monthly gains compound. "Inward skew" was my mis-frame. (2) Impact is ARTICULATED here
  (what we care about, why, how we attempt value) + measured by the org — not instrumented
  in-repo (we lack that capability). (3) Forward order: align-on-impact → value-stream
  redundancy/gap → execution-spine. Homed: survey report §14/§15 + the thread record.
- **A long, high-volume analytical session drifts toward NARROWING and OVER-CLAIMING under
  its own momentum — this one needed ~5 owner re-framings to stay broad and calibrated.** The
  arc: a broad whole-estate survey got captured by the newest, most-concrete artefact (a
  launch-readiness report), narrowed onto its minutiae, and over-stated its own conclusions —
  each drift corrected by the owner, none self-caught. The owner's corrections WERE the
  breadth-and-calibration force. TELL: in multi-turn deep analysis, self-apply the checks the
  owner kept supplying, on a cadence — *am I still answering the BROAD question at the right
  altitude? has the newest / most-concrete input captured the frame? am I over-claiming?* —
  instead of waiting for the correction. This is the session's deepest lesson about my own
  working pattern.
- **Adversarially verifying my OWN synthesis was the highest-value move of the session, not
  rigour theatre — it overturned 4 of 6 confident claims (overstated / misframed).** Blind
  independent readers corroborated the core; dedicated refuters dented the edges I had stated
  too strongly. Self-synthesis reliably over-states. TELL: when I produce a confident synthesis,
  run an independent + adversarial pass BEFORE presenting it as settled, and report what it
  DENTS, not only what it confirms. Sibling: [[first_hand_means_me_not_subagents]].
- **A comprehensive, validated MAP is valuable even when it re-derives a known verdict — but
  do not sell re-derivation as discovery.** The refuters' sharpest point: much of the strategic
  diagnosis already lived in the repo; this session's *additive* value was breadth +
  quantification + independent cross-validation, not a novel insight. Hold that honesty when
  reporting; it is the antidote to the over-claiming above.
