# Designing “Start Here” & Help Surfaces for MCP Servers

This document outlines a canonical, production-quality approach for exposing “getting started,” usage guidance, and tool help information from a Model Context Protocol (MCP) server. It consolidates best‑practice patterns from the MCP specification, client behavior, and emerging community conventions.

---

## 1. Purpose of This Document

MCP defines primitives—**tools**, **resources**, and **prompts**—but does not dictate a single “start here” mechanism. Modern clients (ChatGPT, Claude Desktop, Cursor, IDE integrations) rely on multiple complementary layers of metadata and documentation to understand and surface your capabilities.

This guide describes how to design those layers coherently so the model, the user, and the client UI can all understand _what the mcp server can do_ and _how and when to use it_.

---

## 2. Overview of Recommended Approach

A well-designed MCP server exposes help information through four coordinated channels:

1. **Tool Metadata** – concise, model-targeted usage instructions.
2. **Documentation Resources** – structured, readable, file-like docs such as a “Getting Started” README.
3. **Help Tool** – a single programmatic interface that returns structured help, optionally scoped to a tool.
4. **Prompts** – reusable workflow templates that describe how tools should be orchestrated.

This layered approach is considered canonical in the MCP ecosystem because it matches the expectations of both clients and model orchestration.

---

## 3. Tool Metadata: The Core Source of Truth

Every MCP tool must include a clear, declarative description:

### Why It Matters

- The model heavily depends on descriptions to decide _when_ it should call a tool.
- Clients display this to users in their tool-inspection UIs.
- The description must be optimized for an LLM—not for humans reading documentation.

### Guidelines

- Use a **concise, specific, model-friendly description**.
- Avoid generic descriptions like “searches repos.” Instead:  
  _“Searches the company Git repositories for matches to a text query. Use when the user asks about existing code, patterns, or implementations.”_
- Encode constraints in the JSON schema:
  - enumerations
  - type restrictions
  - required/optional fields

### Example

```jsonc
{
  "name": "search_repos",
  "description": "Searches internal Git repositories for code or documentation. Use when users ask about implementations, patterns, or references.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Text to search for across repositories.",
      },
      "language": {
        "type": "string",
        "description": "Optional language filter such as 'ts', 'py', 'java'.",
        "nullable": true,
      },
    },
    "required": ["query"],
  },
}
```

---

## 4. Documentation Resources: File-Like “Start Here” Content

Resources are the _canonical home_ for long-form documentation.

### Why Use Resources for Documentation

- `resources/list` and `resources/read` allow clients and models to pull full documentation into context.
- Resources behave like files: markdown, JSON, OpenAPI, images, configuration, workflows, etc.
- Clients may surface them in UI panes for browsing.

### Best Practice

Create a resource such as:

- `mcp://your-server/docs/getting-started`
- `mcp://your-server/docs/tools`
- `mcp://your-server/docs/workflows`

### Example Metadata

```jsonc
{
  "uri": "mcp://my-server/docs/getting-started",
  "name": "getting-started",
  "description": "Introduction to this MCP server, its tools, and recommended usage patterns.",
  "mimeType": "text/markdown",
}
```

### Example Content

```markdown
# Getting Started with My MCP Server

This server provides tools for:

- Repository search
- PR/MR automation
- Incident lookup
  ...
```

Resources make documentation **discoverable**, **machine-usable**, and **UI-friendly**.

---

## 5. The “Help Tool”: Programmatic & Model-Friendly Guidance

While resources are perfect for human-readable docs, models need structured guidance.  
A common pattern is to provide a **single help tool**:

### Responsibilities of the Help Tool

- Return an overview of the server’s capabilities.
- Provide per-tool guidance when queried with a tool name.
- Provide examples, gotchas, decision rules (“use X when Y”).
- Optionally link to resources.

### Example Tool Definition

```jsonc
{
  "name": "get_help",
  "description": "Returns usage instructions and examples for this server’s tools. Call with no arguments for an overview, or specify a tool name.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "tool_name": {
        "type": "string",
        "description": "Optional tool name. If omitted, returns a global overview.",
      },
    },
  },
}
```

### Example Output Structure

```jsonc
{
  "overview": "This server provides repository search and pull-request automation.",
  "tools": [
    {
      "name": "search_repos",
      "when_to_use": [
        "User asks about existing implementations",
        "User wants code examples or references",
      ],
      "gotchas": ["Only searches the default branch", "Excludes archived repositories"],
      "examples": ["Find all usages of FooService in TypeScript."],
    },
  ],
}
```

This tool is the **simplest way for the model to onboard itself** during a conversation.

---

## 6. Prompts: Workflow-Level Guidance

Prompts define reusable instructions for orchestrating your tools. Examples:

- `getting_started`
- `code_review_workflow`
- `generate_api_docs_using_resources`

### Why use prompts?

- They encapsulate complex workflows.
- Clients can display them as selectable actions.
- The model can use them to bootstrap context-aware behavior.

### Example Prompt Definition

```jsonc
{
  "name": "getting_started",
  "description": "Explains what this server can do and how to use its tools effectively.",
  "arguments": [
    {
      "name": "user_goal",
      "description": "Optional goal to tailor the guidance.",
      "required": false,
    },
  ],
}
```

Prompts complement the help tool by offering narrative, workflow-based onboarding.

---

## 7. Bringing It All Together: Recommended Architecture

A fully equipped MCP server exposes help information like this:

### Layer 1 — Tool Metadata

Short, model-focused descriptions driving tool invocation.

### Layer 2 — Resources

A markdown “Getting Started” resource plus other doc resources.

### Layer 3 — Help Tool

Structured, programmatic help that the model can call at any time.

### Layer 4 — Prompts

Workflow-level templates for clients and the assistant.

### Why this works

- Models can onboard themselves without hallucinating tool usage.
- Users can browse docs naturally.
- Clients can surface workflows and help UIs automatically.
- All approaches stay within MCP primitives (tools/resources/prompts).

---

## 8. Example Layout

```text
mcp-server/
  tools/
    search_repos.ts
    create_merge_request.ts
    get_help.ts
  resources/
    docs/
      getting-started.md
      tools.md
      workflows.md
  prompts/
    getting_started.json
    code_review.json
```

---

## 9. Summary

The canonical solution for surfacing “How to use this server” in MCP is not a single primitive but **a combination of tools, resources, and prompts**, each serving a distinct purpose:

- **Tool metadata** → how the model knows _when_ and _why_ to invoke tools.
- **Documentation resources** → where humans and models read long-form docs.
- **Help tool** → how the model accesses structured guidance during chat.
- **Prompts** → workflow templates that teach the assistant how to operate with your server.

This layered design is robust, discoverable, and aligned with client expectations.

---

## 10. Appendix: Suggested Resource Structure

```text
docs/
  getting-started.md
  tools/
    search_repos.md
    create_merge_request.md
    ...
  workflows/
    onboarding.md
    incident-management.md
    ...
```

---

End of document.
