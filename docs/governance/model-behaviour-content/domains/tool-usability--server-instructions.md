---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# server-instructions — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **server-instructions** items of that view, so it can be reviewed in one sitting.

**5 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (5)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C006 — SERVER\_INSTRUCTIONS

**What it says now:**

```text
export const SERVER_INSTRUCTIONS = generateServerInstructions();
```

**What it is for:** The MCP initialize-response instructions delivered once at connection time; always-visible (unlike truncatable tool descriptions) high-priority guidance on which tools to call first and how support tools relate.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`).
- **Kind of surface:** server-instructions · **Impact tier:** high-impact

### C053 — generateServerInstructions() scaffold

**What it says now:**

```text
return `Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call these agent support tools at conversation start:

${toolLines.join('\n')}

These tools are read-only and idempotent. They complement each other:

${relationshipLines.join('\n')}

Call these tools first to reduce errors when using search, fetch, and browsing tools.
```

**What it is for:** The MCP initialize-response instructions: call agent-support tools at conversation start (numbered list), note they are read-only/idempotent and complementary, and call them first to reduce errors.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-instructions · **Impact tier:** high-impact

### C054 — generateServerInstructions() 'fully sequenced' paragraph

**What it says now:**

```text
Oak's curriculum is fully sequenced: year-ordered progressions, prior-knowledge, misconception, and keyword graphs are served by the anchored graph tools (get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, get-keyword-graph), so lesson and curriculum plans can build on what a class has already covered.
```

**What it is for:** Asserts Oak's curriculum is fully sequenced and names the anchored graph tools (get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, get-keyword-graph) so plans build on prior coverage.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-instructions · **Impact tier:** high-impact

### C055 — generateServerInstructions() 'under-the-hood' paragraph

**What it says now:**

```text
For questions that are not about curriculum content — about the mechanisms by which the content is delivered, about this MCP app or its associated services, or about the repository itself — use the oak-under-the-hood tool to orient yourself to the Oak Open Curriculum Ecosystem.
```

**What it is for:** Routes non-curriculum-content questions (delivery mechanisms, this MCP app/services, the repository) to the oak-under-the-hood tool.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-instructions · **Impact tier:** high-impact

### C324 — SERVER\_INSTRUCTIONS (top-level server instructions, wired here, content in SDK)

**What it says now:**

```text
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

{ instructions: SERVER_INSTRUCTIONS },
```

**What it is for:** The single most behaviour-shaping surface: the instructions block that steers how a client agent selects and sequences all Oak tools. Wired into the server here, but the string itself is imported and not visible in this slice.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** server-instructions · **Impact tier:** high-impact
