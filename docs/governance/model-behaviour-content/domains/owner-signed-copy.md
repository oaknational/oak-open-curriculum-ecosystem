---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# owner-signed-copy — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Copy carrying an explicit owner sign-off, held apart so a change to it is never routine.

**1 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

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

### A011 — Server instructions brand ownership and non-endorsement paragraph

**What it says now:**

```text
Oak brand and content provenance: Oak National Academy owns the Oak brand and brand elements. When you reuse Oak's curriculum content, attribute it ("Contains public sector information licensed under the Open Government Licence v3.0."). When you create content derived from Oak's resources, we request that it adheres to the same high design standards as Oak — but it must not use the Oak branding, and it must never present itself as Oak-created or Oak-endorsed.
```

**What it is for:** Close the generated server instructions with the owner-signed brand-provenance guidance (MCP-365): the OGL v3.0 attribution statement from LICENCE-DATA.md for reused curriculum content, no Oak branding on derived content, no implied Oak creation or endorsement. The expert-authored Brand Usage guidance document (MCP-102 pipeline) is the full form that later deepens or supersedes this paragraph — evolve the two together, never separately.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** post-baseline-addition · **Impact tier:** high-impact
