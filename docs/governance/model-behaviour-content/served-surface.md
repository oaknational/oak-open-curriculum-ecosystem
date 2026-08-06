---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-served-surface
status: active
last_reviewed: 2026-08-06
---

# What an agent sees today

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.

Not everything in this codebase is switched on. Some tools and documents are deliberately retained but not offered to agents — kept so they can be turned back on as a single reviewed change, rather than deleted and rewritten later.

A **live** surface is one an agent can use right now. A **dormant** surface exists in the code but is not offered, so no agent can reach it and its wording cannot affect anyone until it is switched on.

[Back to the workspace index](./README.md)

## Tools

### Live (40)

- `browse-curriculum`
- `download-asset`
- `explore-topic`
- `fetch`
- `get-changelog`
- `get-changelog-latest`
- `get-curriculum-model`
- `get-key-stages`
- `get-key-stages-subject-assets`
- `get-key-stages-subject-lessons`
- `get-key-stages-subject-questions`
- `get-key-stages-subject-units`
- `get-keyword-graph`
- `get-keywords`
- `get-lessons-assets`
- `get-lessons-quiz`
- `get-lessons-summary`
- `get-lessons-transcript`
- `get-misconception-graph`
- `get-prior-knowledge-graph`
- `get-programmes`
- `get-programmes-assets`
- `get-programmes-questions`
- `get-programmes-units`
- `get-rate-limit`
- `get-sequences`
- `get-sequences-assets`
- `get-sequences-questions`
- `get-sequences-units`
- `get-subject-detail`
- `get-subjects`
- `get-subjects-key-stages`
- `get-subjects-programmes`
- `get-subjects-years`
- `get-thread-progressions`
- `get-threads`
- `get-threads-units`
- `get-units-summary`
- `oak-under-the-hood`
- `search`

### Dormant (3)

- `get-eef-evidence`
- `user-search`
- `user-search-query`

## Documents and other resources

### Live (6)

- `curriculum://model`
- `docs://oak/getting-started.md`
- `docs://oak/guidance/explore-curriculum.md`
- `docs://oak/guidance/find-lessons.md`
- `docs://oak/guidance/learning-progression.md`
- `ui://widget/oak-curriculum-app-local.html`

### Dormant (4)

- `docs://oak/guidance/adapt-lesson.md`
- `docs://oak/guidance/continue-progression.md`
- `docs://oak/guidance/curriculum-mapping.md`
- `eef://interpretation`

## How this is worked out

One file decides it: `apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts` classifies every tool and resource as live or dormant, and the server registers from that one definition. Turning a surface on or off is a one-word change there, reviewed like any other change.

The lists above are not read from that file. They are recorded by starting the server and asking it what it offers, so they are evidence of what is actually registered. The `validate-mcp-content-current-source` check keeps that record honest against the code.
