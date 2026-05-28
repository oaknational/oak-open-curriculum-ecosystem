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

Source: EEF graph-tooling rebuild. Full diagnosis:
`plans/sector-engagement/eef/current/graph-tooling-rebuild-foundation-2026-05-28.md`.
Graduation candidates: graph-tool-category ADR/PDR, self-correcting-deliverables
planning methodology (PDR + oak-plan), Definition-of-Delivery refinement
(PDR-085), 'working with graphs' skill — all in `pending-graduations.md`.

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
