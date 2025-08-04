# Tissue and Organ Implementation Example

This document provides a concrete example of how to implement tissues and organs in our cellular architecture.

## Example: Building a Search System

Let's build a complete search system that demonstrates all levels of the architecture.

### Level 1: Organelles (Pure Functions)

```typescript
// src/search/scoring/relevance.ts - Organelle
export function calculateRelevance(query: string, content: string): number {
  const queryTerms = query.toLowerCase().split(' ');
  const contentLower = content.toLowerCase();

  const matches = queryTerms.filter((term) => contentLower.includes(term));
  return matches.length / queryTerms.length;
}

// src/search/scoring/boost.ts - Another organelle
export function applyBoost(baseScore: number, boostFactors: BoostFactors): number {
  return baseScore * (1 + boostFactors.recency + boostFactors.popularity);
}
```

### Level 2: Cells (Modules)

```typescript
// src/search/scoring/types.ts - Cell types
export interface ScoringService {
  score(query: string, document: Document): number;
}

export interface BoostFactors {
  recency: number;
  popularity: number;
}

// src/search/scoring/factory.ts - Cell factory
import { calculateRelevance } from './relevance.js';
import { applyBoost } from './boost.js';

export function createScoringService(config: ScoringConfig): ScoringService {
  return {
    score(query: string, document: Document): number {
      const relevance = calculateRelevance(query, document.content);
      const boosted = applyBoost(relevance, {
        recency: calculateRecencyBoost(document.updatedAt),
        popularity: document.viewCount / 1000,
      });
      return boosted;
    },
  };
}

// src/search/scoring/index.ts - Cell membrane
export { createScoringService } from './factory.js';
export type { ScoringService, BoostFactors } from './types.js';
```

### Level 3: Tissues (Related Modules)

```typescript
// src/search/types.ts - Tissue-level types
export interface SearchTissue {
  createIndexer(config: IndexerConfig): Indexer;
  createScorer(config: ScorerConfig): Scorer;
  createRanker(config: RankerConfig): Ranker;
}

// src/search/factory.ts - Tissue factory
import { createIndexingService } from './indexing/index.js';
import { createScoringService } from './scoring/index.js';
import { createRankingService } from './ranking/index.js';

export function createSearchTissue(deps: TissueDependencies): SearchTissue {
  return {
    createIndexer: (config) => createIndexingService({ ...deps.indexing, ...config }),
    createScorer: (config) => createScoringService({ ...deps.scoring, ...config }),
    createRanker: (config) => createRankingService({ ...deps.ranking, ...config }),
  };
}

// src/search/index.ts - Tissue membrane
export { createSearchTissue } from './factory.js';
export type { SearchTissue, SearchResult, SearchQuery } from './types.js';

// Also export individual cells for direct use
export * from './indexing/index.js';
export * from './scoring/index.js';
export * from './ranking/index.js';
```

### Level 4: Organs (Complete Systems)

```typescript
// src/notion-search-system/types.ts - Organ types
export interface NotionSearchSystem {
  // High-level operations
  search(query: string, options?: SearchOptions): Promise<SearchResults>;
  indexContent(pageId: string): Promise<void>;

  // System management
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  clearIndex(): Promise<void>;

  // Health monitoring
  getStats(): SearchStats;
  healthCheck(): Promise<HealthStatus>;
}

// src/notion-search-system/factory.ts - Organ factory
import { createSearchTissue } from '../search/index.js';
import { createNotionTissue } from '../notion/index.js';
import { createCacheTissue } from '../cache/index.js';

export function createNotionSearchSystem(deps: SystemDependencies): NotionSearchSystem {
  // Create tissues
  const search = createSearchTissue(deps.search);
  const notion = createNotionTissue(deps.notion);
  const cache = createCacheTissue(deps.cache);

  // Create tissue components
  const indexer = search.createIndexer(deps.indexerConfig);
  const scorer = search.createScorer(deps.scorerConfig);
  const ranker = search.createRanker(deps.rankerConfig);

  const notionClient = notion.createClient(deps.clientConfig);
  const transformer = notion.createTransformer(deps.transformerConfig);

  // Wire everything together
  return {
    async search(query: string, options?: SearchOptions): Promise<SearchResults> {
      // Check cache
      const cacheKey = `search:${query}:${JSON.stringify(options)}`;
      const cached = await cache.get(cacheKey);
      if (cached) return cached;

      // Search process
      const indexed = await indexer.search(query);
      const scored = indexed.map((doc) => ({
        document: doc,
        score: scorer.score(query, doc),
      }));
      const ranked = ranker.rank(scored, options?.limit || 10);

      // Transform results
      const results = {
        items: ranked.map((item) => transformer.transformSearchResult(item)),
        total: indexed.length,
        query,
      };

      // Cache results
      await cache.set(cacheKey, results, { ttl: 300 });

      return results;
    },

    async indexContent(pageId: string): Promise<void> {
      const page = await notionClient.getPage(pageId);
      const transformed = transformer.transformPage(page);
      await indexer.index(transformed);
    },

    // ... other methods
  };
}

// src/notion-search-system/index.ts - Organ membrane
export { createNotionSearchSystem } from './factory.js';
export type { NotionSearchSystem, SearchResults, SearchOptions, SearchStats } from './types.js';
```

### Level 5: Organism (Complete Application)

```typescript
// src/server.ts - Organism
import { createMCPServer } from './mcp-server/index.js';
import { createNotionSearchSystem } from './notion-search-system/index.js';
import { createLoggingSystem } from './logging-system/index.js';

export async function createApplication(config: AppConfig): Promise<Application> {
  // Create organs
  const logging = createLoggingSystem(config.logging);
  const notionSearch = createNotionSearchSystem(config.notionSearch);
  const mcpServer = createMCPServer({
    ...config.mcp,
    tools: {
      search: async (args) => {
        const results = await notionSearch.search(args.query, args.options);
        return results;
      },
      // ... other tools
    },
  });

  // Initialize all organs
  await logging.initialize();
  await notionSearch.initialize();
  await mcpServer.initialize();

  return {
    start: () => mcpServer.start(),
    stop: async () => {
      await mcpServer.shutdown();
      await notionSearch.shutdown();
      await logging.shutdown();
    },
  };
}
```

## Testing at Each Level

### Testing Organelles

```typescript
// src/search/scoring/relevance.unit.test.ts
describe('calculateRelevance', () => {
  it('returns 1.0 for exact match', () => {
    const score = calculateRelevance('hello world', 'hello world');
    expect(score).toBe(1.0);
  });

  it('returns 0.5 for partial match', () => {
    const score = calculateRelevance('hello world', 'hello there');
    expect(score).toBe(0.5);
  });
});
```

### Testing Cells

```typescript
// src/search/scoring/scoring.integration.test.ts
describe('ScoringService', () => {
  it('combines relevance and boost factors', () => {
    const scorer = createScoringService({ boostWeight: 0.5 });
    const score = scorer.score('test', {
      content: 'this is a test',
      updatedAt: new Date(),
      viewCount: 100,
    });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(2);
  });
});
```

### Testing Tissues

```typescript
// src/search/search-tissue.integration.test.ts
describe('SearchTissue', () => {
  it('coordinates indexing and scoring', async () => {
    const tissue = createSearchTissue(mockDeps);
    const indexer = tissue.createIndexer({});
    const scorer = tissue.createScorer({});

    await indexer.index(testDocument);
    const results = await indexer.search('test');
    const scored = results.map((doc) => scorer.score('test', doc));

    expect(scored).toHaveLength(1);
    expect(scored[0]).toBeGreaterThan(0);
  });
});
```

### Testing Organs

```typescript
// src/notion-search-system/system.integration.test.ts
describe('NotionSearchSystem', () => {
  it('provides complete search functionality', async () => {
    const system = createNotionSearchSystem(mockSystemDeps);
    await system.initialize();

    await system.indexContent('page-123');
    const results = await system.search('test query');

    expect(results.items).toHaveLength(1);
    expect(results.total).toBe(1);
    expect(mockCache.get).toHaveBeenCalled();
  });
});
```

## Key Patterns Demonstrated

1. **Clear Boundaries**: Each level has its own index.ts that defines the public API
2. **Dependency Injection**: Dependencies flow down, never sideways
3. **Progressive Integration**: Each level integrates the level below
4. **Testability**: Each level can be tested independently
5. **Flexibility**: Different patterns can be used at different levels

## Benefits

1. **Scalability**: New features can be added at any level
2. **Maintainability**: Clear boundaries make changes local
3. **Testability**: Each level has appropriate testing strategies
4. **Reusability**: Components can be reused at their appropriate level
5. **Evolution**: The system can grow organically

This example shows how the cellular architecture scales from simple functions to a complete application, with clear interfaces at each level.
