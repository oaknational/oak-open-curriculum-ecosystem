---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# other — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Items whose review domain is mixed or uncategorised.

**2 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (2)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C320 — stub suggest cache metadata (version '1', ttlSeconds 300)

**What it says now:**

```text
Promise.resolve(ok({ suggestions: [], cache: { version: '1', ttlSeconds: 300 } })),
```

**What it is for:** Attaches cache metadata (version '1', ttlSeconds 300) to the empty suggestion response, signalling to consumers a cache version and 5-minute TTL even in stub mode.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-stub.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** other · **Impact tier:** high-impact

### C709 — stub-mode ships-to-production (OWNER CALL)

**What it says now:**

```text
export function createStubToolExecutionAdapter(): (
  name: ToolName,
  args: unknown,
) => Promise<ToolExecutionResult> {
  const executeStubTool = createCallToolStubExecutor();

  return async (name: ToolName, args: unknown): Promise<ToolExecutionResult> => {
    const descriptor = getToolFromToolName(name);
    const validation = descriptor.toolMcpFlatInputSchema.safeParse(args ?? {});
    if (!validation.success) {
      return err(
        new McpParameterError(descriptor.describeToolArgs(), name, undefined, undefined, {
          code: 'PARAMETER_ERROR',
        }),
      );
    }

    const result = await executeStubTool(name);
    if (result.isError) {
      return err(
        new McpToolError(deriveErrorMessage(result), name, {
          code: 'STUB_EXECUTION_ERROR',
        }),
      );
    }
    const rawData = decodeStubPayload(result, name);
    const outputValidation = descriptor.validateOutput(rawData);
    if (!outputValidation.ok) {
      return err(
        new McpToolError('Execution failed: ' + outputValidation.message, name, {
          code: 'OUTPUT_VALIDATION_ERROR',
        }),
      );
    }
    return ok({ status: outputValidation.status, data: outputValidation.data });
  };
}
```

**What it is for:** This adapter, wired in when runtimeConfig.useStubTools is true, returns canned stub payloads to MCP consumers instead of real Oak API data. Whether that reaches production is the flagged owner decision.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** other · **Impact tier:** high-impact
