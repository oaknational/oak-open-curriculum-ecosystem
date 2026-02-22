# Document Hierarchy and the Consolidation Practice

_Date: 2026-02-22_
_Tags: architecture | documentation | emergence | stewardship_

## What happened (brief)

- Ran the consolidation flow on three documents (prompt, plan, roadmap) after completing WS5 and its adversarial review. Discovered contradictory metrics across documents. Created ADR-117 for plan templates and components, establishing a document hierarchy that prevents duplication.

## What it was like

The consolidation itself was routine — check files, fix contradictions, update cross-references. What was surprising was the size of the adversarial findings section in the prompt: 65 lines duplicating what the plan already documented. I had written it there in a previous session, thinking it was important context for the next agent. But it was the wrong location. Every fact stated in two places is a fact that can drift.

The moment that clarified everything was noticing the NDCG@10 contradiction. The roadmap said 0.955 for lessons. The prompt said 0.944. The ground truth protocol said 0.944. The roadmap was wrong. But finding it required reading all three documents and comparing. In a system with one authoritative source and references, this comparison would not be necessary — the reference points to the source, and the source is always current.

Writing ADR-117 felt like naming something that had been true for a while but unnamed. The plan templates had been converging on the same structure for months — 39 completed plans, each independently discovering TDD phases, quality gate checkpoints, risk tables. The patterns were there; they just needed to be extracted, the way experience files accumulate technical patterns that eventually belong in distilled.md.

The analogy with ADR-114 (sub-agent prompt composition) was exact. Components → templates → consumers. Same layered structure, same rationale (DRY, YAGNI, one place to edit), same guardrails. It was satisfying to see the same architectural shape appear in two different domains (agent prompts and implementation plans) without being forced.

## What emerged

The document hierarchy rule is the real contribution of ADR-117 — more than the templates themselves. Facts authoritative in one place, referenced elsewhere. This is obvious in code (DRY). It is less obvious in documentation, where the temptation is to make each document self-contained. But self-contained documents with duplicated facts become contradictory documents. The consolidation flow is the check that catches this, but the hierarchy prevents it.

The closeout stub pattern was a small discovery. When a plan is archived, the `active/` directory loses its entry. But other documents reference it by that path. A stub keeps the path valid and provides a redirect to the archive plus a summary. It is the plan equivalent of a HTTP 301 redirect.

## Technical content

Patterns extracted to ADR-117:
- Document hierarchy: prompt (operational entry) → plan (executable work) → roadmap (strategic sequence)
- Content authority: facts authoritative in one document, referenced by others
- Plan lifecycle: active → archived, with closeout stubs
- Plan templates and components: reusable building blocks
