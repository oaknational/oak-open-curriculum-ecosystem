# Backlog Analysis

**Date**: 2025-11-11  
**Purpose**: Identify items in `backlog.md` that are not yet covered by proper plans

## Summary

Most items in the backlog are either:

1. ✅ Completed
2. 📋 Covered by existing plans
3. 🔮 Future ideas (too early/speculative)
4. 🆕 **Need new plans** (handful of items)

---

## Items Needing Plans

### 1. Remove Generated Files from Version Control

**Backlog line 23**: "Remove generated files from version control `git filter-repo --path dist --path docs/api --path '_typedoc_*' --invert-paths` -- alters history"

**Status**: No plan exists  
**Category**: Repository maintenance / DevOps  
**Priority**: Low (nice to have, but risky and not urgent)  
**Recommendation**: Add to icebox or create a simple maintenance plan if this becomes important

---

### 2. Update Dependency Versions

**Backlog line 24**: "Update dependency versions across the board"

**Status**: No plan exists  
**Category**: Maintenance  
**Priority**: Medium (should be done periodically)  
**Recommendation**: Create a simple maintenance plan or add to a quarterly maintenance schedule

---

### 3. Add Mutation Testing

**Backlog line 25**: "Add mutation testing to the test suite"

**Status**: No plan exists  
**Category**: Testing infrastructure  
**Related**: `dev-tooling-and-dev-ai-support/stryker-integration-plan.md` exists but may be outdated  
**Priority**: Low-Medium (improves test quality but not critical)  
**Recommendation**: Review/update existing Stryker plan or create new mutation testing plan

---

### 4. Update Zod to Zod 4

**Backlog line 28**: "Update Zod to Zod 4 everywhere, requires support from OpenAPI type generation pipeline"

**Status**: No plan exists  
**Category**: **Pipeline enhancement** (dependency update affecting type-gen)  
**Priority**: Medium (blocked by upstream Zod 4 support in OpenAPI tooling)  
**Recommendation**: Create plan in `pipeline-enhancements/` when Zod 4 is stable and supported

---

### 5. Standardise and Improve Claude Sub-Agents

**Backlog line 29**: "Standardise and improve the Claude sub-agents"

**Status**: No plan exists  
**Category**: Agent guidance / Dev tooling  
**Priority**: Low (future improvement)  
**Recommendation**: Add to icebox or dev-tooling-and-dev-ai-support when this becomes a focus

---

### 6. Extract Common Code from STDIO and HTTP Servers

**Backlog line 30**: "Extract all common code from the stdio and http servers into a shared library"

**Status**: No plan exists  
**Category**: Code organization / Refactoring  
**Priority**: Medium (reduces duplication, improves maintainability)  
**Recommendation**: Create refactoring plan or add to sdk-and-mcp-enhancements

---

### 7. Rename Type-Gen Code

**Backlog line 32**: "Rename the type-gen code from scripts to something more meaningful"

**Status**: No plan exists  
**Category**: **Pipeline enhancement** (structure/naming)  
**Priority**: Low (cosmetic, but improves clarity)  
**Recommendation**: Add to pipeline-enhancements or handle during next pipeline refactor

---

### 8. Enhance Remote Smoke Harness CLI

**Backlog line 33**: "Enhance the remote smoke harness CLI using `commander` so `--remote-base-url` style flags are supported"

**Status**: No plan exists  
**Category**: Dev tooling / Testing infrastructure  
**Priority**: Low-Medium (improves DX)  
**Recommendation**: Add to dev-tooling-and-dev-ai-support

---

### 9. MCP Versioning

**Backlog line 60**: "Accurate versioning of MCP servers surfaced from the repo root `package.json` and reflected in server metadata and docs; align release pipeline"

**Status**: No plan exists  
**Category**: DevOps / Release engineering  
**Priority**: Medium (important for production)  
**Recommendation**: Create plan in dev-tooling-and-dev-ai-support or add to OAuth/production hardening work

---

### 10. Agent Lifecycle Plugin

**Backlog line 61**: "An agent lifecycle plugin that checks uncommitted changes, triggers quality gates, tidies, and commits automatically"

**Status**: No plan exists  
**Category**: Dev tooling / Automation  
**Priority**: Low (nice to have, but complex)  
**Recommendation**: Add to icebox as future automation idea

---

## Items Already Covered by Plans

### Logger Improvements (Line 27)

**Covered by**: `observability/logger-sentry-otel-integration-plan.md`  
**Status**: ✅ Has comprehensive plan

### Production Hardening (Line 31)

**Partially covered**:

- Auth: `mcp-oauth-implementation-plan.md` (finishing up)
- Logging: `observability/logger-sentry-otel-integration-plan.md`
- Error handling: `observability/shared-error-library-plan.md`
- Caching: Part of semantic search and MCP enhancement plans

### SDK Type-Gen Separation (Line 34)

**Covered by**: `pipeline-enhancements/sdk-workspace-separation-plan.md`  
**Status**: ✅ Has plan

### Extract Non-UI Search Logic (Line 35)

**Covered by**: Semantic search plans  
**Status**: ✅ Addressed in semantic search implementation

### Add MCP Server to Semantic Search (Line 36)

**Covered by**: Semantic search Phase 3 / MCP integration  
**Status**: ✅ Part of semantic search roadmap

### MCP Enhancements (Lines 38-61)

**Most items covered by**:

- `sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md` (tool descriptions, tags, composition patterns, resources/prompts, caching)
- `sdk-and-mcp-enhancements/curriculum-tools-guidance-playbooks-plan.md` (playbooks, commands, provenance)
- `observability/shared-error-library-plan.md` (error handling)
- `observability/logger-sentry-otel-integration-plan.md` (OpenTelemetry)

**Exception**: Versioning (line 60) and agent lifecycle plugin (line 61) not covered

---

## Future Ideas (Not Ready for Plans)

### Fan-Out-Fan-In MCP Server (Line 73)

**Category**: Future MCP server idea  
**Status**: Too speculative, no immediate need  
**Recommendation**: Keep in backlog as future idea

### Simple Review Agents (Line 74)

**Category**: Future agent automation idea  
**Status**: Too speculative  
**Recommendation**: Keep in backlog as future idea

### AI Lesson Content Grading Service (Line 50)

**Category**: External service idea  
**Status**: Out of scope for this repo  
**Recommendation**: Keep in backlog or move to external ideas

---

## Recommendations

### Immediate Action

1. ✅ Move `curriculum-tools-guidance-playbooks-plan.md` to `sdk-and-mcp-enhancements/` (DONE)
2. ✅ Move `curriculum-ontology-resource-plan.md` to `sdk-and-mcp-enhancements/` (DONE)
3. Update `high-level-plan.md` and `PLAN_SUMMARY.md` to reflect new locations

### Create New Plans (Optional)

Only if these become active priorities:

1. **Dependency Update Plan** (line 24) - Quarterly maintenance
2. **Mutation Testing Plan** (line 25) - Review/update Stryker plan
3. **Zod 4 Migration Plan** (line 28) - When Zod 4 is stable → `pipeline-enhancements/`
4. **Server Code Extraction Plan** (line 30) - Reduce duplication
5. **MCP Versioning Plan** (line 60) - Production hardening → `dev-tooling-and-dev-ai-support/`

### Keep in Backlog

- Remove generated files (risky, low priority)
- Rename type-gen code (cosmetic)
- Enhance smoke CLI (nice to have)
- Agent lifecycle plugin (complex, future)
- Claude sub-agents improvement (future)
- MCP server ideas (speculative)

---

## Alignment Check

**Pipeline vs SDK/MCP Content**:

- ✅ `pipeline-enhancements/` contains generation/pipeline structure plans
- ✅ `sdk-and-mcp-enhancements/` contains tool/resource content plans
- ✅ Zod 4 migration (if needed) should go in `pipeline-enhancements/`
- ✅ Type-gen renaming (if needed) should go in `pipeline-enhancements/`

**Plan Coverage**: ~90% of actionable backlog items are either completed or covered by existing plans. The remaining ~10% are mostly maintenance tasks or future ideas that don't need immediate planning.
