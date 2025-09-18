# Greek Ecosystem (Chōrai) Deprecation

This document records the historical “Greek ecosystem” naming system and why it was removed.

## What it was

- Path and package naming using Greek-inspired taxonomy (e.g., `psycha`, `moria`, `histoi`, `organa`, `eidola`).
- Intended to denote architectural phenotypes and layers.

## Why it was removed

- Impeded onboarding and discoverability for contributors unfamiliar with the taxonomy.
- Increased cognitive overhead without clear functional benefits.
- Inconsistent mapping to runtime concerns and package ownership.

## What replaced it

- Plain, intent-revealing naming with clear separation:
  - Lib abstractions and utilities: logger, storage, transport, env packages
  - Providers (runtime-specific): `@oaknational/mcp-providers-node` (Cloudflare pending)
  - Apps/servers (phenotypes) under `apps/` (future taxonomy rename)
  - Libraries under `packages/libs/*`, SDKs under `packages/sdks/*`

## Migration notes

- All active code, imports, comments, and docs must avoid Greek ecosystem tokens.
- A single reference remains (this file) for historical context and rationale.
- See `.agent/plans/standardising-architecture-part2.md` for acceptance criteria and migration status.
