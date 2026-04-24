---
boundary: B4-Engineering-Operations
doc_role: index
authority: engineering-navigation
status: active
last_reviewed: 2026-02-25
---

# Engineering Documentation

This directory contains engineering workflow and implementation documentation for developers working on the Oak Open Curriculum ecosystem (SDK, MCP servers, and semantic search app).

## Contents

- [Root README Quick Start](../../README.md#quick-start) - Architecture, setup, and key commands for new developers
- [Tooling](./tooling.md) - Development tools, versions, and setup instructions
- [Build System](./build-system.md) - Turborepo tasks, caching, and quality gate commands
- [Troubleshooting](../operations/troubleshooting.md) - Operational issues and resolutions
- [CI Policy](./ci-policy.md) - What runs in CI (sdk-codegen policy, build behavior)
- [Testing Patterns](./testing-patterns.md) - Reusable test recipes (E2E DI pattern, subprocess tests)
- [Testing TDD Recipes](./testing-tdd-recipes.md) - Worked Red/Green/Refactor examples and common TDD violations
- [Release and Publishing](./release-and-publishing.md) - npm publishing, versioning, and release automation
- [Milestone Release Runbook](./milestone-release-runbook.md) - Gate model, snagging protocol, and go/no-go controls for milestone releases
- [Pre-Merge Divergence Analysis](./pre-merge-analysis.md) - Systematic process for merging significantly diverged branches safely
- [Environment Variables](../operations/environment-variables.md) - Runtime configuration and environment variable management
- [Production Debugging Runbook](../operations/production-debugging-runbook.md) - Production diagnostics and incident workflows

## Purpose

These documents help developers:

- Get up to speed quickly with the codebase
- Understand the development environment and tools
- Resolve common issues independently
- Follow consistent development practices

## Getting Started

New developers should start with the [root README Quick Start](../../README.md#quick-start), which covers prerequisites, install/verify, and key commands. Continue with [CONTRIBUTING.md](../../CONTRIBUTING.md) for the development process.

For quick solutions to common problems, check the [Troubleshooting](../operations/troubleshooting.md) guide.
