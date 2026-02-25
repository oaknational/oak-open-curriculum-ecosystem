---
boundary: B4-Engineering-Operations
doc_role: index
authority: engineering-navigation
status: active
last_reviewed: 2026-02-25
---

# Engineering Documentation

This directory contains engineering workflow and implementation documentation for developers working on the Oak MCP ecosystem (SDK, MCP servers, and semantic search app).

## Contents

- [Onboarding](../foundation/onboarding.md) - Foundation onboarding path for new developers and AI assistants
- [Tooling](./tooling.md) - Development tools, versions, and setup instructions
- [Build System](./build-system.md) - Turborepo tasks, caching, and quality gate commands
- [Troubleshooting](../operations/troubleshooting.md) - Operational issues and resolutions
- [CI Policy](./ci-policy.md) - What runs in CI (sdk-codegen policy, build behavior)
- [Testing Patterns](./testing-patterns.md) - Reusable test recipes (E2E DI pattern, subprocess tests)
- [Release and Publishing](./release-and-publishing.md) - npm publishing, versioning, and release automation
- [Environment Variables](../operations/environment-variables.md) - Runtime configuration and environment variable management
- [Production Debugging Runbook](../operations/production-debugging-runbook.md) - Production diagnostics and incident workflows

## Purpose

These documents help developers:

- Get up to speed quickly with the codebase
- Understand the development environment and tools
- Resolve common issues independently
- Follow consistent development practices

## Getting Started

New developers should start with the [Onboarding guide](../foundation/onboarding.md), which links the root README, shared parsing helpers, AGENT.md directives, and workspace walkthroughs.

For quick solutions to common problems, check the [Troubleshooting](../operations/troubleshooting.md) guide.
