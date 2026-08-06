---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# resource-name-or-description — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **resource-name-or-description** items of that view, so it can be reviewed in one sitting.

**9 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 5 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (4)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C214 — DOCUMENTATION\_RESOURCES[getting-started].title

**What it says now:**

```text
title: 'Getting Started with Oak Curriculum',
```

**What it is for:** Human/agent-readable title shown in resources/list, signalling this resource is the entry-point 'getting started' guide for the Oak curriculum server.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C215 — DOCUMENTATION\_RESOURCES[getting-started].description

**What it says now:**

```text
description: 'Introduction to the Oak Curriculum MCP server, authentication, and first steps.',
```

**What it is for:** Listing description telling the agent/user this resource introduces the server, authentication, and first steps — shaping whether the resource is opened first.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C690 — registerAppResource name 'Oak Curriculum App'

**What it says now:**

```text
export const WIDGET_RESOURCE_NAME = 'Oak Curriculum App';

registerAppResource(
    server,
    WIDGET_RESOURCE_NAME,
    WIDGET_URI,
```

**What it is for:** Names the interactive React widget resource shown to hosts/agents when the MCP App resource is listed.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C691 — widget resource description

**What it says now:**

```text
{
      description: 'Interactive Oak curriculum MCP App for search and curriculum exploration.',
    },
```

**What it is for:** Describes the widget resource's purpose (search + curriculum exploration) to help hosts/agents decide when to render it.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

## Retired (5)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C337 — Oak: Under the Hood orientation resource name/title + URI docs://oak/under-the-hood.md

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
uri 'docs://oak/under-the-hood.md'; name/title 'Oak: Under the Hood orientation'
```

**What it is for:** Names/addresses the orientation resource in resources/list so assistants/integrators can discover the 'how Oak builds its curriculum' pointer; the exported URI literal is the single source of truth for the ADR-205 allowlist.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C338 — Oak: Under the Hood orientation resource description

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
'How Oak builds and delivers its curriculum — the project/effort/ecosystem, its purpose and machinery, and how to engage. For assistants and integrators; a separate concern from curriculum content…'
```

**What it is for:** Tells the reader this resource is about how Oak builds/delivers its curriculum (project/effort/ecosystem, purpose, machinery, how to engage) and is a SEPARATE concern from curriculum content served by the curriculum tools — an owner-separation firewall.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C380 — resource\_link name 'oak-under-the-hood'

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
name: 'oak-under-the-hood',
```

**What it is for:** Names the linked canonical resource so clients can label/reference it consistently with the tool and skill.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C381 — resource\_link title

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
title: 'Oak: Under the Hood — orientation method',
```

**What it is for:** Human/agent-readable title of the linked canonical, describing it as the orientation method.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C382 — resource\_link description

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
Canonical orientation method and source list; fetch and follow it to orient the user.
```

**What it is for:** Tells the agent the linked resource is the canonical orientation method and source list, and to fetch and follow it to orient the user.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact
