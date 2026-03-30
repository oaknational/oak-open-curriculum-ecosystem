---
title: "MCP vs CLI Is a Category Error"
thesis: "MCP and CLI are not competing choices: CLI is one client surface, MCP is a protocol layer, and the real architectural decision is direct API vs protocol-mediated workflows for a specific audience and impact."
status: stub
tags: [mcp, developer-tooling, product-strategy, architecture]
---

# MCP vs CLI Is a Category Error

## Core Argument

Framing "MCP vs CLI" as a head-to-head choice is usually the wrong question.

- A CLI is a delivery surface.
- MCP is an interoperability protocol.
- The deeper comparison is usually "direct API calls vs protocol-mediated access patterns".

In local developer workflows, a well-designed CLI and MCP server often sit on the same underlying API capabilities. In remote host environments (for example, web-hosted AI assistants), the CLI surface is unavailable, while MCP remains viable.

## Why the Comparison Breaks Down

The same capability can appear through multiple surfaces:

- Direct API client/library usage
- CLI command wrappers
- MCP tools/resources/prompts in an assistant host

These are not mutually exclusive strategies. They are composition choices around the same core domain capabilities.

## What the Real Decision Is

The meaningful architecture decision is:

1. **Can a direct API solve the use case safely and simply?**
2. **Do we need protocol-level capabilities that API-only integrations do not provide well in-host?**
3. **Which audience are we serving in this interaction context?**

For many backend or internal service integrations, direct API is still the safest and clearest choice.
For assistant-native workflows, MCP adds value via standardised tool execution plus context primitives.

## MCP's Distinct Value

MCP is most valuable when you need structured, assistant-native interactions, including:

- tools for model-driven actions
- resources for host-injected context
- prompts for user-triggered workflow templates
- app extensions for richer interactive experiences where supported

In Oak terms: the Open Curriculum API remains the source data plane, while the MCP server adds orchestration across multi-step retrieval paths, search integrations, and context scaffolding such as curriculum model resources.

## Audience and Impact Framing

The right surface depends on intended audience and impact:

- internal developers may prefer SDK/CLI paths for speed and control
- external developers may need stable API and/or MCP contracts
- assistant-native users (for example, teachers using ChatGPT or Claude Desktop) require in-host protocol surfaces rather than local CLI tools

## Product Tension to Acknowledge

The genuine tension is not "MCP or CLI"; it is overusing MCP where a simple API path is sufficient.

- APIs are mature, well-understood, and generally simpler to secure and operate.
- MCP introduces additional protocol/runtime complexity, so it should be used where that complexity produces user or product value.

## Open Questions

- Where is the tipping point at which assistant-native orchestration justifies protocol overhead?
- How should teams publish capability once and expose it consistently across API, CLI, and MCP without contract drift?
- What safeguards should be mandatory when exposing curriculum capabilities to assistant-native end-user contexts?
