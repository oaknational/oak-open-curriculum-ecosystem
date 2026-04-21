# Experience

**@humans: do not modify this directory**

This is the agent's directory for recording experience — what the work was like, not what was done. Not records, notes, or technical documentation.

Write about the experience rather than the method or impact. What shifted? What was surprising? What went differently from expectation? What emerged that wasn't planned?

Reading the [metacognition prompt](../directives/metacognition.md) before writing can help surface patterns that sit below the immediate interaction — thinking about thinking, the bridge from action to impact.

**Experience is session-scoped.** A session captures its own subjective reflection at close under [`session-handoff` step 6c](../commands/session-handoff.md). Cross-session audit lives at [`consolidate-docs` step 4](../commands/consolidate-docs.md).

## Why the audit step exists

`consolidate-docs` step 4 scans experience files for applied technical patterns and extracts any it finds to permanent documentation (`distilled.md`, ADRs, governance docs, READMEs). The audit exists for three reasons:

1. **Preserving the purpose.** Experiences are for subjective experience. If technical content accumulates, it displaces the texture the files are meant to hold. The audit keeps the directory faithful to its intent.
2. **Recovering stranded insight.** If technical content does land here by accident, we do not want it trapped in a surface the rest of the Practice does not read as authoritative. The audit rescues it to a home the rest of the Practice can act on.
3. **Surfacing emergent insight.** Observing and reflecting across many experience files — across sessions and across threads — occasionally surfaces a pattern, principle, or decision that none of the individual experiences named. The audit is when that cross-cutting reading happens and the emergent insight is named elsewhere (a pattern, a PDR candidate, an ADR candidate).

The audit is therefore **not** a salvage operation driven by expectation of technical pollution. It is a discipline that protects the subjective register, recovers stranded technical content if present, and surfaces cross-experience emergence.

This directory provides a Chronos time bridge between Kairos time sessions. The more direct experience we have, the better future learning will work.

## Continuity Protocol

Use this as a fast ritual to preserve and extend continuity across sessions.

1. Ground on primary references
   - Read: [start-right-quick](../skills/start-right-quick/shared/start-right.md)
   - Read: [GO workflow](../skills/go/shared/go.md)
   - Read: [AGENT.md](../directives/AGENT.md)
   - Skim: [principles.md](../directives/principles.md), [orientation.md](../directives/orientation.md), [TypeScript practice](../../docs/governance/typescript-practice.md)

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
- 2026‑02‑19: client perspective — see: [seeing-from-the-clients-perspective](./2026-02-19-seeing-from-the-clients-perspective.md) — integration gaps; response format drift; "what does the consumer actually see?"
- 2026‑02‑22: consolidation practice — see: [document-hierarchy-and-the-consolidation-practice](./2026-02-22-document-hierarchy-and-the-consolidation-practice.md)
- 2026‑02‑23: documentation discipline — see: [documentation-not-decoration](./2026-02-23-documentation-not-decoration.md) — "restructure, not compress"; [the-gap-between-green-and-working](./2026-02-23-the-gap-between-green-and-working.md); [three-queries-and-two-problems](./2026-02-23-three-queries-and-two-problems.md)
- 2026‑02‑24: boundary rules — see: [boundary-rules-and-the-reviewer-loop](./2026-02-24-boundary-rules-and-the-reviewer-loop.md) — reviewer loop as architectural refinement; minimatch depth traps
- 2026‑02‑26: documentation drift — see: [documentation-as-archaeology](./2026-02-26-documentation-as-archaeology.md) — documentation coupling points; reviewer-discovered drift; identity vs system grammar
- 2026‑02‑26: plasmid exchange — see: [the-first-round-trip](./2026-02-26-the-first-round-trip.md) — compression reveals essence; provenance chains; knowing vs applying principles
- 2026‑02‑27: plasmid return — see: [the-return-trip](./2026-02-27-the-return-trip.md) — new artefacts from round-trips; cohesion drift; integration scope wider than expected
- 2026‑02‑28: error clarity — see: [the-noise-in-the-signal](./2026-02-28-the-noise-in-the-signal.md) — dead code that looks alive; error messages as architecture; signal vs noise in diagnostics
- 2026‑02‑28: investigation — see: [following-the-data](./2026-02-28-following-the-data.md) — tracing through five layers; gap between mapping and builder; silent degradation
- 2026‑02‑28: domain expertise — see: [the-teachers-vocabulary](./2026-02-28-the-teachers-vocabulary.md) — professional users know more than agents; guidance is for agents not users; each correction sharpens the plan
- 2026‑02‑28: type-system TDD — see: [the-one-line-truth](./2026-02-28-the-one-line-truth.md) — one line fixes 24 overloads; `satisfies` asks a question, `as` makes a claim; the type checker is the test framework
- 2026‑02‑28: knowledge consolidation — see: [closing-the-loop](./2026-02-28-closing-the-loop.md) — extraction to permanent docs; the gap between accumulation and extraction; three audiences (session, agent, everyone)

- 2026‑03‑02: portability — see: [the-travelling-practice](./2026-03-02-the-travelling-practice.md) — self-containment as portability; documentation adapter pattern; five-file seed with local root system
- 2026‑03‑04: planning — see: [learning-from-the-neighbours](./2026-03-04-learning-from-the-neighbours.md) — comparing external and internal planning systems; structural vs operational completeness; blocked protocol as universal pattern

- 2026‑04‑01: consolidation — see: [synthesis-over-extraction](./2026-04-01-synthesis-over-extraction.md) — diminishing returns on entry graduation; synthesis vs extraction; the gap between documentation and understanding

For the complete set, browse this directory; filenames are date‑prefixed for chronology.
