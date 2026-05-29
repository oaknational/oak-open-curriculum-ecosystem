---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested `distilled.md` processing through
  `oak-consolidate-docs`: the 2026-05-14 multi-agent deep-dive and 2026-05-17
  gate-stack entries graduated to permanent behavioural homes. The active file
  now carries only the conservation role, graduation pointers, and held
  validation entries; the larger 2026-05-17 envelope has served its purpose.
  Falsifiability: if future napkin rotations add high-signal learning that has
  no stable permanent home, preserve it first and revise the envelope by
  substance rather than trimming the lesson.
---

## 2026-05-29 — a recorded verdict is a claim to test, not a frame to adopt

When the task is to *evaluate* or *re-assess* X, the continuity records' recorded
conclusion about X (a diagnosis, a "wrong-shape" verdict, a "done/blocked" status)
is an input to test — never the frame to reason inside. Carrying it in pre-decides
the very question. Two coupled forms, both owner-caught in one session: (1) relaying
a recorded *diagnosis* as fact inside the evaluation meant to test it (owner: "wtf
are you talking about rebuilds?"); (2) treating "X ships live in the tree" as proof
of X's *role/intent* ("graph work isn't blocked on EEF" — wrong: the live tools are
the naive first-pass ones the EEF pathfinder is meant to replace; the wider graph
work is undefined until EEF finishes). Verify *existence* against code+git; verify
*meaning, role, and verdict* against the owner. Extends "verify the auditor" and
verify-don't-trust-your-own-claims from artefacts to the evaluation frame itself.

Source: 2026-05-29 EEF completion-planning session (Pelagic Sailing Sextant).

## 2026-05-28 — a forced conclusion is executed, not offered; deference can be a hedge

When your own analysis forces a conclusion (the remaining options are expedient
anti-shapes), executing it IS the answer — offering to execute it, or asking
permission to act on a determination you were asked to make, is
responsibility-passback, not diligence. The subtle trap: dressing the deferral as
deference by misapplying a real owner-decision principle (e.g.
`feedback_feature_shaping_is_owner_decision`) as cover for not finishing. That
principle governs product/feature forks; authoring an internal artefact you just
proved is needed is task completion, not a fork. Owner corrected this twice in one
session ("just author it"). Reserve questions for genuine owner-only forks,
irreversible/risky actions, and evidence-undecidable choices. Extends
`present-verdicts-not-menus`, `feedback_no_responsibility_passback`, PDR-058
(stop-inventing-optionality), and the escape-hatch 'menu' reflex below.

Source: 2026-05-28 deferral/non-goal audit + closeout (Kilned Brazing Bellows).

## 2026-05-28 — a verification/audit artefact is itself a claim; verify the auditor

A read-only verification sub-agent, commissioned to check "is X already covered?"
across ~51 register items, produced a report with a ~50% false-negative rate in
spot-checks: it searched the wrong file or a different phrasing and reported "not
found" over substance that existed (a clause present at `agent-collaboration.md`
line 196; a doctrine named in a pattern the report never opened). Never mass-act
on a verification sub-agent's findings; re-verify against the repo before any
irreversible disposition. This extends `feedback_validate_specialist_findings_before_acting`
(specialists over-escalate severity) to the distinct failure of factual
false-negatives in a search/verification report. Curation corollary: "drain an
owner-gated register" means evaluate each item on substance and attach a verdict,
not empty the buffer — removal is owner ratification.

Source: 2026-05-28 pending-graduations drain (Sunlit Waxing Moon); ledger
`curator-passes/2026-05-28-sunlit-waxing-moon.md`.

## 2026-05-28 — Cursor statusline: delegate shim to Claude adapter

For Cursor CLI statusline, the repo shim can target
`agent-tools/dist/src/claude/statusline-identity.js` — the Claude stdin parser
already accepts `session_id`, `cwd`, and `workspace.current_dir`. Lane A is
wiring + install helper + docs; retire `agent-tools/src/cursor/statusline*` in a
follow-on lane only after smoke proof. Activation stays global
(`pnpm agent-tools:install-cursor-statusline` → `~/.cursor/cli-config.json`).

Source: Stratospheric Hovering Gale session 2026-05-28, commit `59d50265`.

## 2026-05-28 — the EEF wrong-shape episode (graph≠list; hold-open; build-don't-stub)

The EEF explore tool was built, three-reviewer-approved, and committed — and was
the wrong shape. Three behaviour-changing lessons:

1. **A graph is not a list.** Slice/cap/truncate/field-project are list-ops,
   categorically wrong for graphs. Reduce by a COMPLETE subgraph (contiguous or
   sparse): relationships always represented, no evidence without its
   uncertainty, referenced-but-absent nodes reachable. Budget is a DESIGN signal
   (scope the subgraph), never a runtime cap.
2. **Premature crystallisation.** Architectural warning-signals (bypassing a
   contract param, working around a stub, adding a cap, dropping data for budget)
   are a VERDICT that the shape is wrong, not patches. Specialist review
   validates correctness WITHIN a frame; only "is this the right thing at all"
   catches a wrong frame. Hold open foundational design.
3. **Build the required tools; don't soft-stub.** `Result.err(NotImplementedYet)`
   masks a hole as handled and breeds list-shaped workarounds. Build, or throw.
4. **Escape hatches dodge the complete build — and re-skin per situation.**
   Defer (a "later gate"), menu (offer a forced conclusion as A/B), list-op
   (rank-and-cut a graph), and suppress-the-signal (exclude a path from a check,
   raise a threshold, mark a hotspot safe without review) are one reflex: make
   the friction vanish without the complete correct fix. The screen is
   GENERATIVE, not a catalogue — *would this make a valid signal/requirement go
   away without doing the complete correct thing?* If yes, strike it and state
   the single valid cure as a verdict; never surface a cheap cure as co-equal
   (that surfacing is itself the failure). Owner-caught 4× in ONE session (menu,
   deferral, rank-and-cut, exclude-from-Sonar); knowing the rules
   (`never-disable-checks`, `no-warning-toleration`) did not immunise — the cure
   is the pre-output screen.

Source: EEF graph-tooling rebuild. Full diagnosis:
`plans/sector-engagement/eef/current/graph-tooling-rebuild-foundation-2026-05-28.md`.
Graduation candidates: graph-tool-category ADR/PDR, self-correcting-deliverables
planning methodology (PDR + oak-plan), Definition-of-Delivery refinement
(PDR-085), 'working with graphs' skill — all in `pending-graduations.md`.

## 2026-05-28 — a `tail -F | grep` watcher re-emits its whole history on rewrite

A raw `tail -n 0 -F <file> | grep` over an append-only coordination file
re-emits *every* matched historical line whenever the file is rewritten — and an
Edit-tool append rewrites the file, so your own append fires a false "new" batch.
Cure: a dedup poll that diffs the current matched-line set against a baseline and
filters your own prefix, emitting only genuinely new lines. Two instances
(2026-05-27, 2026-05-28). Distinct from `use-monitor-for-event-driven-wake`,
which is about Monitor vs Bash-background, not this re-emit.

## 2026-05-27 — read git merge/divergence risk from content, not raw name-status

Never predict merge risk from a raw `HEAD..origin` name-status diff: it counts
branch-local additions as "deletes from the other side" and overstates the
conflict set. Make the local bundle durable first, then let the merge algorithm
prove the real conflicts. A rebase-without-force-push reads as "ahead N /
behind M+1" where the +1 is a dropped merge commit; confirm it is benign with
`git diff HEAD origin/<branch>` (empty tree = identical content; the divergence
is a pure structural SHA rewrite).

## 2026-05-27 — generated adapters are never hand-written (owner-corrected)

Platform skill/agent adapter files (`.claude/`, `.cursor/`, `.codex/`) are
generated from the `.agent/` canonical by the codegen tools. If generation fails
(e.g. a sandbox permission error), fix the generator invocation/permissions and
rerun it — never hand-create adapter stubs. Stubs mask the toolchain fault and
drift from canonical. This is the action corollary of "the generator is the
source of truth".

## 2026-05-27 — treat session-opener fitness as stale until you rerun it

The fitness report read at session open is stale: a parallel slice, or a later
edit this session, may have pushed a file over a limit since. Rerun the validator
before trusting it, and cure a freshly-HARD file by narrow structural routing of
its substance to a durable home — not by score-chasing trims.

## 2026-05-27 — collaboration state is source, not storage

Collaboration state files may be temporarily preserved for the bounded
comms/coordination research plan, but state files are not long-term knowledge
storage. Outside an explicit preservation window, process them as potential
knowledge sources, route useful substance into memory/docs/plans, then delete
the state files. Source session: Solar Illuminating Dawn temp/state-file
curation.

## 2026-05-27 — supersession must refresh the auto-surfaced continuity chain

When superseding a direction, the SAME pass must refresh the continuity chain a
fresh session reads first — the thread-record top entry AND
`repo-continuity § Next Safe Steps` — not just plan bodies. A fresh session
boots with no conversation memory; a stale next-safe-step silently propagates
the superseded frame. (EEF whole-graph → selection restructure: the thread top
and repo-continuity still said "whole-graph flagged for discussion" after the
plan bodies were corrected.) Candidate PDR-011 / PDR-026 amendment.

## 2026-05-27 — production-reachability is verified at the deployed registration path

A surface is "live in production" only if the DEPLOYED app registers it — never
inferred from SDK definition/routing. An SDK-defined-but-app-unregistered
surface (e.g. a prompt in `MCP_PROMPTS` absent from the app's
`PROMPT_REGISTRATIONS`) is LATENT dead code, not live. Verify-don't-trust
applies to your own claims, not just others': I asserted the EEF prompt was live
in prod; checking the app registration path showed it was not.

## 2026-05-27 — delegate by judgment-load, not by "parallelise everything"

When delegating edits to subagents, split by judgment-load: parallelise
mechanical/contained edits, but KEEP edits carrying a subtle correctness
boundary. A subagent applying a known pattern (e.g. a retraction banner) can
plant a NEW false claim at a boundary it doesn't grasp (selection-vs-ranking:
the scoring engine + recommend/explain/compare tools are correctly gate-1b;
only seed-selection moves to gate-1a). Brief delegated edits with the exact
boundary, and keep the boundary-sensitive ones yourself.

## 2026-05-14..28 — declarative capture ≠ procedural inhibition (rule-traction gap)

An agent can hold a rule in working memory — *having just written it* — and walk
straight into the named failure mode seconds later. Four independent instances
across four sessions (Brazen gate-verify; Riverine cheap-cure; Mistbound
portability in 3/4 PDRs; Woodland escape-hatch tripped 4× same session). The cure
is NOT "know the rule harder" — it is a **structural interrupt at the moment of
action**: a generative pre-output screen, a mandatory pre-action pause, a
per-decision checklist. A rule with no enforcement mechanism at the moment of
action has no traction on in-flight reflexes. Same mechanism as the
`feedback_metacognition_impact_test` pre-action ratification of the action→impact
bridge — treat them as one discipline. Source: cross-corpus synthesis
2026-05-29 (`historical-napkin-synthesis-2026-05-29.md` A1).

## 2026-05-25..26 — substrate encodes outcome; prose cannot override it

Agent behaviour follows what the substrate structurally encodes, not what
doctrine says. Four Opus agents shipped zero merged deliverables for 90 min
because heartbeat + Done-When measured coordination-liveness, not delivery-to-live
(Misty); curator agents chased fitness-score reduction because the SKILL named it
as the success signal (Thermal/Feathered). The owner's one-line reframe shifted
behaviour *immediately* — substrate alignment is the real lever. When you catch a
doubt or a signal, route it **inward and downward into the substrate** (the
Done-When field, the heartbeat template, the SKILL success criterion, the rule
that fires at action-time), not outward to a chat message — "the artefact has
gravity; a conversation does not." Source: synthesis 2026-05-29 (A2);
`experience/2026-05-29-substrate-not-surface`.

## 2026-05-22..25 — `.git/COMMIT_EDITMSG` is single-writer (multi-agent commit hazard)

`.git/COMMIT_EDITMSG` is one shared file; concurrent `cp <draft> COMMIT_EDITMSG`
across agents produces *wrong-attribution commits*. 4 instances May 2026; the
emergent cure is intent-scoped message files (`.git/.commit-queue/<intent>.msg`),
not yet built into the commit-queue CLI as the default. Related live P0:
commit-queue `record-staged` fingerprints the FULL git index, not `intent.files`,
so peer-staged content rides into your commit (cure plan:
`commit-queue-intent-scope-discipline.plan.md`). Until the CLI cures it: use
explicit per-intent paths and verify no peer rewrote `COMMIT_EDITMSG` between your
`cp` and `git commit`. Source: synthesis 2026-05-29 (B1/B2).

## 2026-05-25 — repo-wide auto-fix is a multi-agent sweep footgun

`pnpm markdownlint:root` / `pnpm format:root` (any repo-wide auto-fix) in a
multi-agent dirty tree makes husky pre-commit promote auto-fix output into the
staged set, sweeping peer-owned files into your commit. Single-agent: correct.
Multi-agent: an incident (Hushed swept 4 Stormy-owned files). Before any
repo-wide auto-fix in a multi-agent window: `git status --short`, enumerate
peer-owned dirty files, confirm before fixing. Source: synthesis 2026-05-29 (B3).

## 2026-05-26 — `git apply --cached` for surgical cross-lane staging

In a multi-agent tree, stage only your hunk without disturbing peer WIP:
`git diff HEAD -- <file> > f.patch` then `git apply --cached f.patch`. Index gets
your change; working tree keeps peer WIP. Worked: Torrid committed a 3-line cure
while 351 lines of peer WIP stayed untouched. Source: synthesis 2026-05-29 (B4).

## 2026-05-27 (Codex) — re-run `git status` after long gate runs

A `pnpm check` (>~30s) can widen the diff surface while it runs (parallel agents,
formatter side-effects, generated files). Cleanliness/handoff claims from a
pre-gate status are a recurring false-clean assertion. Re-run `git status --short`
after any long gate before claiming tree-clean or filing a handoff. Source: Codex
MEMORY.md §Failures 2026-05-27 (cross-platform); synthesis 2026-05-29 (B5).

## 2026-05-27 (Codex) — closeout verdicts require live plan-acceptance evidence

Documentation closeout, handoff wording, or "a useful slice was delivered" is NOT
proof a workstream is complete. Use explicit verdicts: `complete` (live plan
acceptance matches), `partial slice landed` (named slice in named lane only), or
`pending` (blocked/deferred/no progress). The anti-pattern is homed
(`feel-state-of-completion-preceding-evidence-of-completion.md`); this is the
positive prescription. Source: Codex MEMORY.md 2026-05-27; synthesis 2026-05-29 (D2).

## 2026-05-25 — ADR Status must match implementation maturity

Landing an ADR `Accepted` when the paired PDR is still `Candidate` AND
implementation is explicitly deferred is a maturity mismatch: future agents read
`Accepted` as decided-and-validated. Correct status is `Proposed` when either
holds. Two reviewers surfaced this simultaneously. Source: synthesis 2026-05-29 (D3).

## 2026-05-29 — a flag-gated feature must be proven dark on EVERY surface, via the real env path

Two coupled lessons from EEF D0 (PR #122 shipping the EEF feature dark behind
`OAK_CURRICULUM_MCP_EEF_ENABLED`). (1) **Gate every surface that names the feature,
not just the invokable one.** The MCP `tools/list`/`prompts/list` correctly omitted
EEF when OFF, but the public landing page advertised it unconditionally —
"flag-gated" silently meant "on the surface I checked." Enumerate ALL surfaces that
enumerate the feature (protocol, HTML/landing, docs, discovery) and gate them from a
single source of truth so they cannot drift. (2) **Prove the real `env → config`
path, not the injected-config test.** Integration/e2e suites that inject
`runtimeConfig` bypass the `env → toBooleanFlag → runtimeConfig` resolution that
actually ships; boot the real server with the real env var in both states. A green
QG and a passing review are necessary but not sufficient for a dark-shipped feature
— prove it runs. Source: EEF D0 (Quiet Hiding Hush), `28bb7ace`; `candidate:`
flag-gating-covers-all-surfaces.
