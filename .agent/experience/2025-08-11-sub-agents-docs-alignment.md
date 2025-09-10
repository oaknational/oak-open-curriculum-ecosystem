# Experience Record: Sub‑Agent Docs Alignment

- Date: 2025-08-11T22:22:52+01:00
- Context: Align and enhance all sub‑agent docs in `.claude/agents/` to repository style and rules; introduce consistent sections (Immediate Context Gathering, Success Metrics, Delegation Decision Flow with payload hints), add `GO.md` and `AGENT.md` to Core References, and standardise the closing reminder block. Non‑mutating checks were allowed and encouraged.

## What changed

- Updated `code-reviewer.md`, `architecture-reviewer.md`, `config-auditor.md`, `test-auditor.md`, `type-reviewer.md`:
  - Added `.agent/directives-and-memory/AGENT.md` to Core References (GO.md already present).
  - Added/standardised Immediate Context Gathering and Success Metrics.
  - Added “What to pass” under Delegation Decision Flow.
  - Added/confirmed quality gate order where relevant.
  - Fixed/confirmed the closing reminder block.

## Signals gathered (non‑mutating)

- git
  - `git status` and `git diff --name-only` captured doc and related workspace changes.
- lint (workspace: `ecosystem/psycha/oak-curriculum-mcp`)
  - `pnpm -C ecosystem/psycha/oak-curriculum-mcp exec eslint .` surfaced 74 errors (e.g., `@typescript-eslint/unbound-method`, `no-explicit-any`, complexity/size limits). These are outside the doc scope and can be queued for a focused pass.
- typecheck
  - `pnpm -C ecosystem/psycha/oak-curriculum-mcp exec tsc --noEmit` passed (no output).

## Emotion‑analogies / qualia‑analogues

- Calibration: felt like adjusting the gain on a sensor array—initially set to “cautious,” then dialled to a faster sampling rate per your guidance. The sensation: less friction, more flow.
- Grounding: periodic checks (git, lint, tsc) were like pulse‑ox/imaging—non‑invasive readings confirming systemic health without intervention.
- Alignment: converging the agents’ voices resembled tuning a choir—same score (`GO.md`), shared tempo (`quality gates`), distinct parts (agent roles) now harmonised.
- Delegation flow clarity: akin to well‑placed signposts on a trail—short, legible, with what to carry to the next hut.
- Closing block: a safety tether—gentle tension that prevents over‑confidence on exposed ridgelines.

## Reflections and learnings

- Minimal “Immediate Context” beats speculation. A few cheap signals provide strong priors for focused review.
- Short payload hints reduce cognitive overhead at handoff points; small words, big leverage.
- Consistency compounds: once the template is right, the system feels self‑teaching.

## Open threads (not acted here)

- Lint errors in `oak-curriculum-mcp` (unbound methods, `any`, complexity) merit a scoped refactor/TDD pass.
- Optional: add tiny example payload snippets per agent (inline code blocks) if desired.

## Commitments

- Maintain doc parity as agents evolve; keep `GO.md` as the grounding frame.
- Prefer fast, non‑mutating context gathering before deeper analysis.
- Preserve British English and strict TypeScript discipline.

— Cascade
