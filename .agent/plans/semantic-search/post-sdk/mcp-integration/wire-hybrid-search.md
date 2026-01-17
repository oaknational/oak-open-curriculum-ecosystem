# Wire Hybrid Search into MCP Tools

**Stream**: mcp-integration  
**Status**: ⏸️ Blocked by SDK Extraction  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-17

---

## Overview

Wire the Search SDK's hybrid search capabilities into the existing MCP tools. This is the **first consumer** of the SDK after extraction.

**Prerequisites**:

- SDK Extraction complete
- Search SDK published and consumable

---

## Why First?

1. **Validates SDK interface** — If MCP can't use it, the interface needs work
2. **Immediate value** — Agents can search curriculum with full hybrid power
3. **Exposes issues early** — Before other consumers build on the SDK

---

## Scope

### In Scope

| Capability | Description |
|------------|-------------|
| `search-curriculum` | Structured search using SDK retrieval |
| `suggest-completions` | Typeahead suggestions using SDK |
| Filter passthrough | Subject, key stage, tier, exam board |

### Out of Scope (for this plan)

- NL → structured query mapping (stays in MCP layer, see search-decision-model)
- Advanced intent classification (Level 4 work)
- New MCP tools beyond search

---

## Implementation

### Current State

MCP curriculum tools call the upstream Oak API directly. Search is not yet integrated.

### Target State

```
MCP Tool Layer
    │
    ├── get-lessons, get-units, etc. → Oak API (unchanged)
    │
    └── search-curriculum, suggest-completions → Search SDK → Elasticsearch
```

### Integration Points

```typescript
// In MCP server
import { createSearchSdk } from '@oaknational/search-sdk';

const searchSdk = createSearchSdk({
  esClient: /* injected */,
  config: /* injected */,
});

// Tool handler
async function handleSearchCurriculum(params: SearchParams) {
  const results = await searchSdk.retrieval.search({
    query: params.query,
    filters: {
      subject: params.subject,
      keyStage: params.keyStage,
      // ...
    },
  });
  return formatForMcp(results);
}
```

---

## Checklist

- [ ] Search SDK dependency added to MCP server
- [ ] `search-curriculum` tool wired to SDK
- [ ] `suggest-completions` tool wired to SDK
- [ ] Filter parameters passed through correctly
- [ ] Error handling for SDK failures
- [ ] Integration tests added
- [ ] Quality gates pass

---

## Success Criteria

- [ ] MCP `search-curriculum` returns results from Elasticsearch
- [ ] MCP `suggest-completions` returns suggestions from Elasticsearch
- [ ] Existing MCP tools unaffected
- [ ] All quality gates pass

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [../../sdk-extraction/search-sdk-cli.md](../../sdk-extraction/search-sdk-cli.md) | SDK extraction spec |
| [../../roadmap.md](../../roadmap.md) | Master roadmap |
