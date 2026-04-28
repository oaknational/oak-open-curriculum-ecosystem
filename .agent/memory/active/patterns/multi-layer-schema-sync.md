---
name: Multi-Layer Schema Synchronisation
use_this_when: a code generator produces multiple schema representations (JSON schema, Zod, transforms) from a single source and a change to input handling must be reflected across all layers
category: architecture
proven_in: packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts
proven_date: 2026-02-28
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: Updating one schema layer without updating the others, causing type mismatches or runtime failures
  stable: true
---

# Multi-Layer Schema Synchronisation

## Problem

A code generator produces multiple representations of the same schema for different purposes: a JSON schema for protocol-level input validation, a Zod schema for runtime parsing, a transform function for shape conversion, and a runtime JSON-schema-to-Zod converter for dynamic validation. A change to how a parameter is accepted (e.g. adding a union type for backward compatibility) must be reflected across all layers simultaneously.

When layers are updated independently, the types diverge. The JSON schema might accept `string | number` while the Zod schema only accepts `string`. The runtime converter might not understand the `anyOf` construct the JSON schema emits. The transform function might pass the wrong type to the downstream SDK. Each layer compiles and tests in isolation, but the system fails when they interact.

## Solution

Treat all schema layers as a single atomic unit. When modifying how a parameter is accepted or transformed:

1. **Flat Zod schema** -- the runtime parser that validates MCP input
2. **Flat JSON schema** -- the protocol-level schema exposed to MCP clients
3. **Flat-to-nested transform** -- the function that converts flat MCP args to nested SDK args
4. **Runtime JSON-schema-to-Zod converter** -- the function that reconstructs Zod schemas from JSON schemas at runtime

All four must agree on:

- What types are accepted as input
- How those types are transformed
- What types are produced as output

Define shared constants (e.g. canonical enum values) once and reference them from all layers. Test each layer independently, then test the full round-trip: JSON schema -> Zod parse -> transform -> SDK invoke type compatibility.

## When this applies

- Code generators that emit multiple schema representations
- Schema-driven systems with protocol, validation, and transform layers
- Any change to parameter acceptance rules (adding union types, changing enums, adding transforms)

## When this does not apply

- Single-schema systems with no layered representations
- Hand-written schemas that are maintained independently by design

## Anti-pattern it replaces

Updating one schema layer (e.g. the Zod schema) to accept new input types while leaving the JSON schema, transform, and runtime converter unchanged. The type checker may not catch the divergence because each layer is independently well-typed.
