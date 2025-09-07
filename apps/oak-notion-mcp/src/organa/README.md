# Modules - Business Logic Components

This directory contains the modular business logic used by the Notion integration and MCP server.

## What Lives Here

- `notion/` - Notion-specific transformation and formatting
- `mcp/` - MCP-related tool definitions and handlers

## Principles

1. Single responsibility per module
2. Clear boundaries with typed contracts
3. Dependency injection for external services
4. No cross-module imports that violate boundaries
