# Semantic Search API Context

**Purpose**: Living context document for the Oak Open Curriculum Semantic Search API project. This document enables easy continuation of work in fresh chat sessions by providing comprehensive project context, current state, and next steps.

**Last Updated**: 2024-12-19  
**Project Status**: Implementation Phase - Cloud Data Population  
**Primary Plan**: `.agent/plans/semantic-search-api-plan.md`

---

## Project Overview

### What We're Building

A **hybrid lexical + semantic search** service for Oak Open Curriculum content using Elasticsearch Serverless. The service provides:

- **Structured search**: `POST /api/search` with filters for key stage, subject, text queries
- **Natural language search**: `POST /api/search/nl` with LLM query parsing
- **SDK parity routes**: Direct pass-through to Oak API for comparison
- **Admin indexing routes**: Cloud-based data population with chunked processing
- **OpenAPI + MCP integration**: Auto-generated API docs and MCP tools

### Architecture

- **Backend**: Next.js API routes on Vercel
- **Search Engine**: Elasticsearch Serverless with three indices:
  - `oak_lessons`: Full transcripts + semantic embeddings
  - `oak_units`: Unit metadata and lesson counts
  - `oak_unit_rollup`: Unit-level snippets for highlights
- **Data Source**: Oak Curriculum API via official SDK
- **Search Method**: BM25 + semantic search fused with RRF (Reciprocal Rank Fusion)

---

## Current State

### ✅ Completed

- **Core search implementation**: Hybrid search with BM25 + semantic fusion
- **API endpoints**: All search and admin routes implemented
- **Elasticsearch setup**: Index creation and mapping scripts
- **SDK integration**: Full Oak API integration via official SDK
- **OpenAPI generation**: Auto-generated API documentation
- **MCP integration**: Tools and resources exposed via MCP
- **Quality gates**: All linting, type-checking, and tests passing
- **Local development**: Full local development environment working

### 🚧 In Progress

- **Cloud data population**: Implementing chunked indexing for Vercel deployment
- **Progress tracking**: Status monitoring for long-running indexing operations

### 📋 Next Steps (Immediate)

1. **Implement chunked indexing endpoints**:
   - `POST /api/index-oak-chunked` - Process data in chunks
   - `POST /api/index-oak-bulk` - Orchestrate full population
   - `GET /api/index-oak-status` - Monitor progress
2. **Deploy to Vercel** with proper environment configuration
3. **Run initial data population** in cloud environment
4. **Verify search functionality** with populated data

---

## Technical Context

### Key Files & Directories

```text
apps/oak-open-curriculum-semantic-search/
├── app/api/
│   ├── search/route.ts              # Structured search endpoint
│   ├── search/nl/route.ts           # Natural language search
│   ├── index-oak/route.ts           # Legacy single-shot indexing
│   ├── rebuild-rollup/route.ts      # Rollup index rebuild
│   └── sdk/                         # SDK parity routes
├── src/lib/
│   ├── hybrid-search/               # Core search logic
│   ├── index-oak.ts                 # Indexing orchestration
│   ├── elastic-http.ts              # ES client wrapper
│   └── env.ts                       # Environment configuration
└── docs/                            # Architecture documentation
```

### Environment Variables

```env
# Required
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here

# Optional
AI_PROVIDER=openai                    # or 'none' to disable NL search
OPENAI_API_KEY=your_openai_api_key_here
```

### Data Flow

1. **Indexing**: Oak API → SDK → Chunked Processing → Elasticsearch
2. **Search**: Query → Hybrid Search (BM25 + Semantic) → RRF Fusion → Results
3. **Highlights**: Transcript snippets and unit rollup text

---

## Implementation Details

### Search Architecture

- **Hybrid Search**: Combines BM25 (lexical) and semantic search
- **RRF Fusion**: Reciprocal Rank Fusion merges results from both methods
- **Highlights**: Contextual snippets from transcripts and rollup text
- **Filtering**: Key stage, subject, minimum lesson count filters

### Indexing Strategy

- **Chunked Processing**: Handles Vercel's 300s execution limit
- **Progress Tracking**: Real-time status monitoring
- **Resilient**: Failed chunks can be retried without corruption
- **Idempotent**: Safe to re-run indexing operations

### Vercel Considerations

- **Execution Limits**: 300s max duration per function (Pro plan)
- **Memory Limits**: 1GB RAM per function
- **Cold Starts**: May affect initial indexing performance
- **Environment**: All sensitive vars in Vercel environment settings

---

## Current Challenges & Solutions

### Challenge: Data Population Scale

**Problem**: ~10,000+ lessons with full transcripts exceed Vercel execution limits  
**Solution**: Chunked indexing with recursive orchestration

### Challenge: Bandwidth Costs

**Problem**: Fetching all Oak content locally would thrash internet connection  
**Solution**: Run indexing in cloud environment (Vercel) where data transfer is optimized

### Challenge: Progress Monitoring

**Problem**: Long-running indexing operations need visibility  
**Solution**: Status endpoint with completion metrics and error reporting

### Challenge: Resilient Indexing

**Problem**: Network failures or timeouts during indexing  
**Solution**: Idempotent operations with retry mechanism for failed chunks

---

## Development Workflow

### Local Development

```bash
# Setup
pnpm install
cp apps/oak-open-curriculum-semantic-search/.env.example \
   apps/oak-open-curriculum-semantic-search/.env.local
# Fill in environment variables

# Development
pnpm -C apps/oak-open-curriculum-semantic-search dev

# Elasticsearch setup
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
pnpm -C apps/oak-open-curriculum-semantic-search run elastic:setup
```

### Testing

```bash
# Quality gates
pnpm qg

# Search testing
curl -X POST http://localhost:3000/api/search \
  -H 'content-type: application/json' \
  -d '{"scope":"units","text":"mountains","subject":"geography","keyStage":"ks4","minLessons":3}'
```

### Deployment

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Run initial data population
curl -X POST https://your-app.vercel.app/api/index-oak-bulk \
  -H "x-api-key: $SEARCH_API_KEY"
```

---

## API Reference

### Search Endpoints

- `POST /api/search` - Structured search with filters
- `POST /api/search/nl` - Natural language search (requires LLM)
- `POST /api/sdk/search-lessons` - SDK parity for lessons
- `POST /api/sdk/search-transcripts` - SDK parity for transcripts

### Admin Endpoints (x-api-key required)

- `GET /api/index-oak` - Legacy single-shot indexing
- `POST /api/index-oak-chunked` - Chunked indexing (new)
- `POST /api/index-oak-bulk` - Orchestrated bulk population (new)
- `GET /api/index-oak-status` - Progress monitoring (new)
- `GET /api/rebuild-rollup` - Rebuild rollup index

### Documentation

- `GET /api/openapi.json` - OpenAPI specification
- `GET /api/docs` - Interactive API documentation

---

## MCP Integration

### Available Tools

- `search` - Structured search across Oak content
- `fetch` - Get detailed information about specific resources

### Configuration

```json
{
  "oak-remote-oai": {
    "type": "http",
    "url": "https://curriculum-mcp-alpha.oaknational.dev/openai_connector",
    "headers": {
      "Authorization": "Bearer super-duper-secret-dev-token?!"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

1. **501 from `/api/search/nl`** → LLM disabled, check `AI_PROVIDER` and `OPENAI_API_KEY`
2. **Empty search results** → Run indexing first, check `GET /api/index-oak-status`
3. **Indexing failures** → Check Oak API key, ES credentials, and network connectivity
4. **Vercel timeouts** → Use chunked indexing endpoints instead of single-shot

### Debug Commands

```bash
# Check Elasticsearch health
curl -H "Authorization: ApiKey $ELASTICSEARCH_API_KEY" \
  "$ELASTICSEARCH_URL/_cluster/health"

# Check indexing status
curl -H "x-api-key: $SEARCH_API_KEY" \
  https://your-app.vercel.app/api/index-oak-status

# Test Oak API access
curl -H "Authorization: Bearer $OAK_API_KEY" \
  "https://www.thenational.academy/api/key-stages"
```

---

## Related Documents

- **Main Plan**: `.agent/plans/semantic-search-api-plan.md`
- **UI Plan**: `.agent/plans/semantic-search-ui-plan.md` (if exists)
- **Documentation Plan**: `.agent/plans/semantic-search-documentation-plan.md` (if exists)
- **Architecture Docs**: `apps/oak-open-curriculum-semantic-search/docs/ARCHITECTURE.md`
- **Setup Guide**: `apps/oak-open-curriculum-semantic-search/docs/SETUP.md`

---

## Quick Start for New Chat

If you're starting fresh in a new chat session:

1. **Read this context document** to understand the project state
2. **Check the main plan** (`.agent/plans/semantic-search-api-plan.md`) for current phase
3. **Review current todos** to see what's in progress
4. **Examine recent commits** to understand latest changes
5. **Run quality gates** (`pnpm qg`) to verify current state
6. **Check deployment status** if working on cloud features

The project is currently in the **cloud data population phase** - the next major milestone is implementing the chunked indexing endpoints for Vercel deployment.
