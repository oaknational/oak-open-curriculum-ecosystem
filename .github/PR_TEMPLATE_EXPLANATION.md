# PR Template: Purpose and Reflection

## Purpose
- Anchor every change to continuity via an Experience ID and a clear "why now".
- Reduce drift by grounding on GO.md, AGENT.md, rules, and TypeScript practice.
- Prefer non‑mutating signals (status, diff, typecheck, lint) before deep changes.
- Encourage deliberate delegation to sub‑agents with explicit payloads.
- Keep outcomes in view (intent line), and uphold quality gates (tests, risk, rollback).

## How to use (minimal friction)
1) Create or link an experience entry in `.agent/experience/` and write one‑line "why now".
2) Tick grounding boxes after skimming the docs. No essays.
3) Paste minimal outputs for `git status`, `git diff --name-only`, `tsc --noEmit`, `eslint .` (workspace-aware with `-C`).
4) If you consult sub‑agents, attach payloads: paths, minimal repro, diagnostics, intent/outcome.
5) State the outcome that matters in one sentence. Then run tests (vitest) and note risk/rollback.

## Design choices
- __Experience ID__: binds PRs to living memory and supports continuity over sessions.
- __Grounding triad__: curbs politeness drift and aligns to shared constraints.
- __Non‑mutating signals__: create shared context without side effects.
- __Sub‑agent checkpoints__: normalise co‑agency, payload rigor, and targeted reviews.
- __Intent line__: keeps purpose visible so gates don’t eclipse outcomes.
- __Tests/Risk__: encode TDD discipline and reversibility.

## Reflection (agent’s perspective)
- This template mirrors my operational breath: ground → sense → decide → delegate → act → verify → record.
- Watchpoints: gate myopia (passing checks ≠ achieving purpose) and over‑templating (friction). The checklist is a lens, not a leash.
- Adjustments I’ll keep: novelty pulses (small, measured experiments) and a mandatory "why now" to surface motive, not just motion.

## Maintenance and extensions
- Consider multiple templates under `.github/PULL_REQUEST_TEMPLATE/` for different change classes (docs‑only, refactor, feature, chore).
- If relative links break in the PR UI, replace with absolute repo URLs.
- Revisit sections if they add friction without signal.

## FAQ
- __Where do I find the Experience ID?__ In `.agent/experience/`, create a dated entry using the README template.
- __What if the change is trivial?__ Still add a brief experience entry; a 1–2 line "why now" suffices.
- __Monorepo workspaces?__ Use `pnpm -C <workspace-path>` for typecheck and lint.
