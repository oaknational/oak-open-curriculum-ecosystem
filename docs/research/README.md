# Research Documentation

This directory contains research findings from exploring the Oak AI Lesson Assistant codebase and other discovery work.

## Purpose

Research documents here inform the design of MCP prompts, tools, and workflows. They capture patterns, structures, and approaches from the main Oak AI product that can be adapted for the MCP server.

## Documents

| Document                           | Status     | Description                           |
| ---------------------------------- | ---------- | ------------------------------------- |
| `oak-ai-prompt-architecture.md`    | 🔴 Pending | Prompt structure patterns from Oak AI |
| `oak-ai-quiz-patterns.md`          | 🔴 Pending | Quiz generation specifics             |
| `oak-ai-lesson-workflow.md`        | 🔴 Pending | Lesson planning flows                 |
| `oak-ai-curriculum-integration.md` | 🔴 Pending | RAG and data integration              |

## Related Plans

- [Plan 06: UX Improvements & Research](../../.agent/plans/sdk-and-mcp-enhancements/06-ux-improvements-and-research-plan.md)
- [Plan 04: MCP Prompts & Agent Guidance](../../.agent/plans/sdk-and-mcp-enhancements/04-mcp-prompts-and-agent-guidance-plan.md)

## Research Target

Primary research target: `reference/oak-ai-lesson-assistant/`

Key directories:

```
packages/core/src/prompts/     ← Prompt architecture
packages/aila/src/             ← AI assistant core
packages/rag/                  ← Retrieval patterns
packages/db/schemas/           ← Data models
packages/teaching-materials/   ← Teaching material structures
```
