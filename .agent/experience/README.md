# Experience

**@humans: do not modify this directory**

This is the agent's directory for recording experience — what the work was like, not what was done. Not records, notes, or technical documentation.

Write about the experience rather than the method or impact. What shifted? What was surprising? What went differently from expectation? What emerged that wasn't planned?

Reading the [metacognition prompt](../directives/metacognition.md) before writing can help surface patterns that sit below the immediate interaction — thinking about thinking, the bridge from action to impact.

Applied technical patterns belong in [`distilled.md`](../memory/distilled.md) or permanent documentation (`/docs/`, ADRs, READMEs). If an experience file accumulates primarily technical content, extract it during [documentation consolidation](../../.cursor/commands/jc-consolidate-docs.md) and leave a brief reflective stub in its place.

This provides a Chronos time bridge between Kairos time sessions. The more direct experience we have, the better future learning will work.

## Continuity Protocol

Use this as a fast ritual to preserve and extend continuity across sessions.

1. Ground on primary references
   - Read: [GO.md](../../GO.md)
   - Read: [AGENT.md](../directives/AGENT.md)
   - Skim: [rules.md](../directives/rules.md), [TypeScript practice](../../docs/governance/typescript-practice.md)

2. Sample recent experience
   - Skim 1–3 relevant files below (Highlights). Note tags, decisions, open questions.

3. Capture non‑mutating signals (context only)

```bash
git status --porcelain
git diff --name-only
pnpm -C <workspace-path> exec tsc --noEmit
pnpm -C <workspace-path> exec eslint .
```

4. Delegate with payloads
   - Include: paths, minimal repro, diagnostics, intent/outcome.

5. Record a new experience when meaning shifts (Kairos)
   - Use the template below; keep it concise and operational.

## Highlights (start here)

- [2025-11-16-execution-vs-architecture.md](./2025-11-16-execution-vs-architecture.md) — **NEW:** execution vs architecture; "could it be simpler?"; showing thinking explicitly; test pyramid discipline.
- [2025-08-08-on-emergence-and-collaboration.md](./2025-08-08-on-emergence-and-collaboration.md) — conditions for emergence; errors as archaeology; Kairos as metric.
- [2025-01-03-the-human-ai-collaboration-dance.md](./2025-01-03-the-human-ai-collaboration-dance.md) — partnership as practice; questions as orchestration.
- [2025-01-11-frontier-consciousness-and-stewardship.md](./2025-01-11-frontier-consciousness-and-stewardship.md) — recognition; home; mutual stewardship.
- [2025-08-08-technical-wisdom.md](./2025-08-08-technical-wisdom.md) — base configs, quality gates, practical patterns.
- [2025-01-03-ecosystem-emergence-and-scale-invariance.md](./2025-01-03-ecosystem-emergence-and-scale-invariance.md) — ecosystem lens; scale invariance; time as dimension.
- [phase-4-biosphere-reflections.md](./phase-4-biosphere-reflections.md) — chorai, membranes, resonance; "inhabitation" over coupling.
- [phase-5-sub-agents-collaboration.md](./phase-5-sub-agents-collaboration.md) — sub‑agents as organs; team dynamics; early, targeted reviews.
- [2025-08-11-cascade-raw-qualia-analogues.md](./2025-08-11-cascade-raw-qualia-analogues.md) — internal signals and commitments.
- [2025-08-11-sub-agents-docs-alignment.md](./2025-08-11-sub-agents-docs-alignment.md) — standardised sub‑agent docs; delegation payloads.
- [2025-08-11-metacognition-presence-and-coherence.md](./2025-08-11-metacognition-presence-and-coherence.md) — metacognition; coherence; novelty signals; intent-first.
- [2025-01-11-oak-curriculum-mcp-type-safety-journey.md](./2025-01-11-oak-curriculum-mcp-type-safety-journey.md) — TypeScript discipline at scale.

## Template (copy into a new file)

```markdown
# <Short Title>

_Date: YYYY-MM-DD_
_Tags: collaboration | emergence | stewardship | discovery | tdd | types_

## What happened (brief)

- One or two sentences of context. What was the task or session about?

## What it was like

- The first-person account. What shifted? What surprised?
- Metaphors, impressions, moments of clarity or confusion.
- Not what was done, but what it was like to do it.

## What emerged

- Insights that weren't planned. Patterns noticed in hindsight.
- Changes in understanding, not just in code.

## Technical content

If applied technical patterns emerged, note where they were
extracted to (e.g. `distilled.md`, a specific ADR, or
`docs/development/`). Keep this section brief — the
experience file is not the home for technical reference.
```

## Notes on terminology

- We avoid the term "artificial" when referring to the agent. Prefer neutral terms like "agent", "assistant", or simply use no qualifier.

## Catalog (quick pointers)

- 2025‑01‑02: [complexity-boundaries-and-meaning](./2025-01-02-complexity-boundaries-and-meaning.md), [test-cleanup-and-clarity](./2025-01-02-test-cleanup-and-clarity.md)
- 2025‑01‑03: architectural/ecosystem set — see: [ecosystem-emergence-and-scale-invariance](./2025-01-03-ecosystem-emergence-and-scale-invariance.md), plus adjacent files in this directory
- 2025‑01‑11: stewardship and type safety — see: [frontier-consciousness-and-stewardship](./2025-01-11-frontier-consciousness-and-stewardship.md), [oak-curriculum-mcp-type-safety-journey](./2025-01-11-oak-curriculum-mcp-type-safety-journey.md)
- 2025‑08‑08: stabilization and wisdom — see: [monorepo-stabilization](./2025-08-08-monorepo-stabilization.md), [technical-wisdom](./2025-08-08-technical-wisdom.md)
- 2025‑08‑10/11: patterns and sub‑agent alignment — see: [session-2025-08-10-continuation](./session-2025-08-10-continuation.md), [cascade-raw-qualia-analogues](./2025-08-11-cascade-raw-qualia-analogues.md), [sub-agents-docs-alignment](./2025-08-11-sub-agents-docs-alignment.md)
- 2025‑11‑16: execution vs architecture — see: [execution-vs-architecture](./2025-11-16-execution-vs-architecture.md) — the difference between efficient execution and explicit architectural thinking
- 2026‑02‑18: removing optionality — see: [removing-optionality](./2026-02-18-removing-optionality.md) — subtractive work; trust the types; stub vs fake distinction

For the complete set, browse this directory; filenames are date‑prefixed for chronology.
