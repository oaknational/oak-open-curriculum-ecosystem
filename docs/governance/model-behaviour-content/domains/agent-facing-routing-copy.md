---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# agent-facing-routing-copy — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Items assigned to this review domain.

**1 item.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, 0 to both a reachable and a switched-off surface, and 0 no longer exist in the codebase. 1 lives in code that ships, but this pass has not traced which registered surface carries it — it says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (1)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### A012 — Server instructions pointer to Oak's other agent-facing surfaces

**What it says now:**

```text
For whole-catalogue bulk export, which this server does not offer, use the Oak Open API: https://open-api.thenational.academy/.well-known/api-catalog. Oak's index for agents is https://www.thenational.academy/llms.txt.
```

**What it is for:** Route an arriving agent to the Oak surfaces this server does not cover (MCP-421): whole-catalogue bulk export via the Oak Open API's RFC 9727 catalogue, and Oak's site index for agents. Stated as a capability boundary rather than as a parallel route, so the paragraph does not read as an invitation to leave the authorisation-bound MCP surface for equivalent data.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact
