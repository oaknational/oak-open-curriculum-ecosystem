---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-11 — napkin rotated (Pearly Snorkelling Compass doctrine-curation pass)

Second rotation of 2026-06-11, closing the post-Arboreal capture window during the
owner-named doctrine-curation session (naming event 211a1794; lane grant c8432d36). The
processed window is preserved verbatim at
[`napkin-2026-06-11-pearly-curation.md`](archive/napkin-2026-06-11-pearly-curation.md).
Every item left with a disposition before rotation: the four fired harvest triggers and
nine accumulating candidates are registered in `pending-graduations.md` (two new 2026-06-11
sections) with first-hand-verified instance counts; the liveness-heartbeat-cron loop-hygiene
amendment was drafted and ACCEPTED by the Director (events ca24c8d8 → adjudication 14:04Z);
behavioural lessons graduated to `distilled.md` (control-byte write-direction vector,
background-wrapper exit-0 family member, directed-backlog-before-compose, UTC-only
comparisons, commit-message drafting gotchas); the repo-continuity condensation and the
team-opener vocab-gen symlink line were handed as Director deltas (event a3279acf, received
14:08Z). Carried-forward live items below; fresh capture continues after them.

## Carried forward (live, not residue)

- **Core-amendment scope signal (ADR-131) — posture RESOLVED by the 2026-06-11 owner walk**:
  the owner walked all five Practice-Core amendment candidates (PDR-064, PDR-011 two-clause
  bundle, PDR-091, continuity-disposition PDR, self-certification synthesis → PDR-089) plus
  the PDR-078 emit-side facet and the mechanical-firing-moments PDR at the dedicated
  consolidation session, approving every one for authoring (per-item statuses in the
  register). The pause-and-stabilise posture lifts when those approved amendments land;
  still do not add NEW Core restructuring candidates while the approved set is in flight.
- **Unresolved tool feedback** (capture-practice-tool-feedback): `pnpm exec markdownlint
  <file>` printed its USAGE text yet exited 0 (file arg apparently not reaching it) — a
  false-green shape in that invocation path, cause unresolved; the commit-gate markdownlint
  pass is the trustworthy verdict. (Hushed, 2026-06-11.)

## 2026-06-11 — doctrine-curation seat (Pearly Snorkelling Compass, a8eabc)

- **The stale-cwd class bit this seat too, read-direction, minutes after reading its harvest
  entry**: an earlier `cd` into the comms dir persisted across Bash calls and a relative-path
  read crashed FileNotFoundError — loud and harmless, but live confirmation that the trigger
  condition is shell-cwd persistence generally (any prior `cd`, not only worktree seats); the
  CLI error text for the fired harvest-trigger-2 cure should name exactly that.
- **Recency-of-reversal is a free stability signal on decision inputs** (Nebulous's closing
  behaviour-note, ~13:58Z, post-dating the Director's delta sweep; conserved here): a decision
  input that has ALREADY reversed once is likelier to reverse again — check its reversal
  history before fast-executing a freshly-recorded decision (their where-next rename executed
  at speed off a recorded sign-off reversed eleven minutes later, caught gates-green
  pre-commit). Candidate-adjacent; pair with the compose-time-staleness class if a second
  instance lands.
- **Three late Director instances (post-tranche window, my own hand)**: (1) rebuilt a combined
  PR monitor WITHOUT comment detection — the EXACT 2026-06-10 watcher-rewrite class the
  opener's cadence section warns about; caught by the owner pointedly selecting that clause;
  rebuilt with state+checks+comments+unresolved and an explicit all-terminal exit. (2)+(3)
  TWO worktree-singleton interleaves: switched the worktree's branch while a background gate
  chain was still running in it (the trailing HEAD reads re-pointed mid-task; pushes were
  transfer-proven unaffected). Cure: ONE gate chain at a time per worktree — the
  check-singleton-per-window discipline applies to a worktree's whole commit/push window, not
  just pnpm check. All three are same-day further evidence for the session report's central
  finding (the author of the report performed its thesis while writing it).
- **Fourth same-day self-instance: granted-window-then-own-commit collision** — I cleared
  Pearly's final micro window, then started my own waypoint commit into the same checkout;
  git add hit THEIR index.lock (failed clean, foreign lock respected, no rm). The grantor of
  a commit window must treat the grant as exclusive until the grantee's PUSH closes it — the
  window spans the gate chain, not just the staging moment. Cure applied: bounded ls-remote
  wait for the grantee's transfer before opening my own window.
- **Background-process audit (owner-directed) found the drain-timeout exit is NOT an exit** —
  the watcher emits the fail-loud WATCHER ERROR line but the node process LINGERS: both of my
  "dead" watchers were still running hours later, sharing my seen-file + heartbeat-file with
  the live one (three writers, one file), and two orphan watchers survived a stood-down
  session entirely. Probable feedback loop: zombie drains add I/O load on the same comms dir,
  worsening the drain times that kill watchers. Cure shape for the routed agent-tools lane:
  the timeout path must process.exit AND the supervisor must kill the process tree; restart
  guidance should include a stale-process census (ps for prior watchers on the same
  seen-file). Cleanup: TaskStop killed mine cleanly; orphans killed by pid.
- **Forename-keyed /tmp filenames collide across same-forename agents** (curation seat, at
  handoff): my closeout draft Write to `/tmp/pearly-closeout.md` hit yesterday's Pearly
  Snorkelling DOCK file at the same default path — caught by the Write tool's
  read-before-overwrite guard (mechanical, again). Cure applied: identity-qualified temp
  names (`pearly-compass-<purpose>-<date>`). The PDR-027 full-name+prefix discipline,
  /tmp-shaped.
- **candidate: PDR-081 curator-ledger clause vs `permanent-doc-is-the-consolidation-record`
  rule — apparent contradiction** (curation seat, first-hand read of both surfaces): the team
  SKILL §3 (citing PDR-081) names "the per-pass metadata file under the operational-memory
  curator-passes directory" as the curator's traceability surface, while the newer canonical
  rule forbids disposition ledgers (the commit and the permanent home are the record). This
  pass followed the RULE — no ledger written; commits + register + comms are the record.
  Graduation-target: reconcile at the next curation-doctrine touch (PDR-081 amendment retiring
  the ledger clause, or a pass-metadata vs disposition-ledger scope clarification). Trigger:
  next curator-pass invocation or owner direction.

## 2026-06-11 evening — oak-prod live exercise seat (Dawnlit Glimmering Orbit, 50c2d1)

- **Cursor MCP client drops structuredContent-only tool results** — every successful
  `get-eef-evidence` call rendered `(omitted)` while its typed refusals and every
  text+structuredContent tool rendered fine; root cause is the owner-ratified `content: []`
  success shape (`aggregated-eef-evidence.ts`), confirmed by smallest-payload probe (so
  shape-based, not size-based). Live evidence against the structuredContent-only ratification;
  routed to owner via the exercise report + eef record. Lesson: a client-rendering check
  belongs in any tool-shape ratification — spec-valid is not client-visible.
- **My own schema-skip instance**: called `search` without reading its descriptor first
  (mandatory rule) and ate an invalid-arguments error (`scope` required). The rule exists for
  exactly this; zero errors on every tool where I read the descriptor first.
- **Cursor session env not forwarded to agent shells, but the hook mirror is the recovery
  path**: `PRACTICE_AGENT_SESSION_ID_CURSOR` was unset in my shell (agent-identity exit 2);
  the full composer session id lives in `.cursor/oak-composer-session.local.json` (written by
  the sessionStart hook) — export from there and identity preflight resolves to the
  hook-announced name. Candidate: name this recovery in the identity docs if a second
  instance lands.
- **Direct curl to the prod MCP correctly 401s with a PRM pointer** (Clerk,
  `WWW-Authenticate: Bearer resource_metadata=…/.well-known/oauth-protected-resource/mcp`) —
  the auth membrane works; unauthenticated probing cannot falsely green.
- **Cursor-Shell stream artefact now hits pre-PUSH too (turbo SIGABRT)**: `git push` streamed
  live killed the hook's `pnpm turbo run …` with SIGABRT twice (reproduced at load 2.5, so not
  host pressure); the identical turbo command exited 0 standalone, and the push succeeded with
  the commit-skill's file-redirect workaround (`>/tmp/… 2>&1`) — transfer line + ls-remote
  proven. The commit skill documents this family for `git commit` only; extend to `git push`
  if a second instance lands.
- **Piped-exit gotcha, lived at my own hand**: `enqueue | rg` exited 1 because rg found no
  match in the success output — the enqueue had SUCCEEDED, creating a duplicate queue entry on
  blind retry (caught by registry read; duplicate abandoned with notes). The distilled rule
  covers this; the new wrinkle is filter-pipes manufacturing false REDS as well as false
  greens.

## 2026-06-11 — dedicated consolidation seat (Thermal Circling Updraft, f42c24)

- **Director-became-implementer is a missing-autonomy-primitive signal** (handed delta,
  Iridescent event e17324ff, conserved verbatim in substance): the seventh directorship
  started as pure coordination (routing up to 7 live implementers) and ended as solo
  implementation — the Director personally authored the host-load rule + its two-wave
  matcher fix, the operations report, and the team-opener generalisation plan, with no
  implementer pool left to route to. Legitimate under the degenerate-team exception
  (owner directing the Director at named deliverables), BUT the pattern is load-bearing
  evidence: the human-pasted opener and the human-in-the-loop Director exist for the same
  reason — the collaboration infrastructure cannot yet carry a long-running team
  autonomously. The session's manual toil (hand-rolled PR monitors, manual merge
  serialisation, six continuity waypoints by hand) is exactly what the generalisation
  plan proposes to systematize. Candidate framing for the doctrine pipeline: "a Director
  doing sustained implementer work is a missing-autonomy-primitive signal" (sibling of
  feedback_owner_action_is_not_a_cure). No graduation proposed; conserve for the owner
  walk on the generalisation plan.
- **The 15-of-18 withdrawal failure REPRODUCED at this seat — 14 of 18, different agent,
  fortnight later, same mechanism.** My backlog triage proposed 18 withdrawals with
  named coverage homes; the owner confirmed them on my claims; a 25-agent adversarial
  refutation pass (owner-directed workflow fan-out) then refuted 14 — the same two
  conflations as the 2026-05-29 precedent: (a) "the instance/reference has a home" read
  as "the pattern-candidate substance has a home"; (b) absence-of-recurrence read as
  permission to drop an unhomed signal. Several refuted rationales had ALREADY been
  refuted verbatim by the Tempestuous pass, which I had read that morning — read-doctrine
  did not fire; the mechanical refutation stage did. A THIRD conflation shape surfaced in
  the fold refutations: inventing a fold target by synthesis-convenience, overriding the
  item's own recorded `target:` field (four of seven folds misrouted this way — the
  verifiers caught it by reading the field I had written past). Net: only 4 withdrawals
  stood (two with corrected rationales). Lessons banked: (1) adversarial-verify-before-
  withdrawal is now twice-proven as the mechanism for this exact failure (graduated
  same-session as PDR-089 Decision 8); (2) an owner confirmation obtained on my unverified
  claims is not authority once the claims fall — surface the revision, do not hide behind
  the confirm (PDR-091's interpretation clause, lived); (3) an item's recorded target
  field outranks the consolidator's synthesis convenience.
- **Workflow-tool args delivery gotcha**: a `Workflow` launch with a JSON-object `args`
  failed instantly (`pipeline() expects an array`, zero agents ran) — `args.items` did not
  resolve to an array inside the script. Cure that worked: a defensive guard at script top
  (`typeof args === 'string' ? JSON.parse(args) : args`, then accept either the array or
  `.items`, throw loud if empty) + relaunch with `resumeFromRunId` — the journal replay ran
  clean. Future workflow scripts in this repo should carry the guard by default.
- **Dash-leading grep patterns are an argv hazard — and my own piped-push lived instance**:
  `git push 2>&1 | grep -E "->|..."` failed twice over — ugrep consumed the `->`-leading
  pattern as an option, AND the pipe meant the push never transferred (ls-remote showed the
  old SHA; the bare re-run transferred). Confirms the distilled unconditional push-proof
  doctrine end-to-end at this seat; sharp new detail: any pattern beginning with `-` needs
  `-e <pattern>` or `--`. Cure applied and held: pushes bare, proof = transfer line + fresh
  ls-remote.
- **Adding a skill is a two-gate, possibly owner-keyed operation**: the pre-push
  portability validator requires a `Skill(<name>)` + `Skill(<name>:*)` pair in
  `.claude/settings.json` permissions.allow for every Claude adapter, and the harness
  classifier may block the agent's own settings.json edit as self-modification — by
  design; the cure is an explicit owner authorisation moment (worked instance this
  session, owner-keyed in-chat within a minute). Expect the two-step when landing any
  new skill: canonical + generated adapters, THEN the owner-visible settings entry.
- **Naming-schema v2 design session (Swift Gliding Zephyr, aba87a, 2026-06-11)**: owner
  ratified NVN micro-sentence names ("Comet threads Night"), lowercase middle as
  manufactured U-shaped salience, digest-pinned schema registry with the current scheme
  frozen as the v1 era, and `naming_schema_version` on the identity tuple. Plan queued at
  `.agent/plans/agent-tooling/current/agent-naming-schema-v2.plan.md`. Two reusable
  catches: (1) a digest pin makes wordlists freeze-at-activation by construction, so any
  taste review must be a BLOCKING pre-activation gate, not a courtesy; (2) assumptions-
  expert refuted my drafted "audit recomputes recorded names" cycle — the tuple stores
  only the 6-char `session_id_prefix`, never the seed, so recompute obligations must be
  satisfied at derivation time, not over persisted state. Check what the stored record
  can actually support before writing a recompute-shaped acceptance criterion.
