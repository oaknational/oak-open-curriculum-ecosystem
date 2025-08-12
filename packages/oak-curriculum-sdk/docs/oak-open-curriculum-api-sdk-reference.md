# Oak Curriculum SDK API Reference

## Overview

The Oak Curriculum SDK provides type-safe access to Oak National Academy's Curriculum API. Built with TypeScript and `openapi-fetch`, it offers complete type safety through auto-generated types from the OpenAPI schema.

## Installation

```bash
pnpm add @oaknational/oak-curriculum-sdk
```

## Quick Start

```typescript
import { createOakClient } from '@oaknational/oak-curriculum-sdk';

// Create a client instance with your API key
const client = createOakClient('your-api-key-here');

// Make type-safe API calls
const result = await client.GET('/key-stages');
if (result.data) {
  console.log('Key stages:', result.data);
}
```

## Client Creation

The SDK provides two client interfaces:

### Method-Based Client (Recommended)

```typescript
import { createOakClient } from '@oaknational/oak-curriculum-sdk';

const client = createOakClient('your-api-key');
// Use: client.GET(), client.POST(), etc.
```

### Path-Based Client

```typescript
import { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';

const client = createOakPathBasedClient('your-api-key');
// Use: client['/lessons/{lesson}/summary'].get()
```

## Available Endpoints

### Key Stages

```typescript
// List all key stages
const keyStages = await client.GET('/key-stages');

// Get lessons for a key stage and subject
const lessons = await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
  params: {
    path: {
      keyStage: 'ks2',
      subject: 'maths',
    },
  },
});

// Get units for a key stage and subject
const units = await client.GET('/key-stages/{keyStage}/subject/{subject}/units', {
  params: {
    path: {
      keyStage: 'ks3',
      subject: 'english',
    },
  },
});
```

### Subjects

```typescript
// List all subjects
const subjects = await client.GET('/subjects');

// Get a specific subject
const subject = await client.GET('/subjects/{subject}', {
  params: {
    path: {
      subject: 'maths',
    },
  },
});

// Get key stages for a subject
const keyStages = await client.GET('/subjects/{subject}/key-stages', {
  params: {
    path: {
      subject: 'science',
    },
  },
});
```

### Lessons

```typescript
// Get lesson summary
const lessonSummary = await client.GET('/lessons/{lesson}/summary', {
  params: {
    path: {
      lesson: 'lesson-slug-here',
    },
  },
});

// Get lesson transcript
const transcript = await client.GET('/lessons/{lesson}/transcript', {
  params: {
    path: {
      lesson: 'lesson-slug-here',
    },
  },
});

// Get lesson quiz
const quiz = await client.GET('/lessons/{lesson}/quiz', {
  params: {
    path: {
      lesson: 'lesson-slug-here',
    },
  },
});

// Get lesson assets
const assets = await client.GET('/lessons/{lesson}/assets', {
  params: {
    path: {
      lesson: 'lesson-slug-here',
    },
  },
});
```

### Search

```typescript
// Search lessons
const searchResults = await client.GET('/search/lessons', {
  params: {
    query: {
      q: 'fractions',
      keyStage: 'ks2',
      subject: 'maths',
      limit: 20,
      offset: 0,
    },
  },
});

// Search transcripts
const transcriptResults = await client.GET('/search/transcripts', {
  params: {
    query: {
      q: 'photosynthesis',
      keyStage: 'ks3',
      subject: 'science',
    },
  },
});
```

### Units and Sequences

```typescript
// Get unit summary
const unitSummary = await client.GET('/units/{unit}/summary', {
  params: {
    path: {
      unit: 'unit-slug-here',
    },
  },
});

// Get sequence units
const sequenceUnits = await client.GET('/sequences/{sequence}/units', {
  params: {
    path: {
      sequence: 'sequence-slug-here',
    },
  },
});
```

### Assets

```typescript
// Get assets for a subject and key stage
const subjectAssets = await client.GET('/key-stages/{keyStage}/subject/{subject}/assets', {
  params: {
    path: {
      keyStage: 'ks2',
      subject: 'history',
    },
    query: {
      type: 'presentation',
      unitSlug: 'optional-unit-slug',
    },
  },
});

// Get specific asset type for a lesson
const lessonAsset = await client.GET('/lessons/{lesson}/assets/{type}', {
  params: {
    path: {
      lesson: 'lesson-slug',
      type: 'worksheet',
    },
  },
});
```

### Other Endpoints

```typescript
// Get rate limit information
const rateLimit = await client.GET('/rate-limit');

// Get changelog
const changelog = await client.GET('/changelog');

// Get latest changelog entry
const latestChange = await client.GET('/changelog/latest');

// Get threads
const threads = await client.GET('/threads');
```

## Error Handling

All API calls return a result object with either `data` or `error`:

```typescript
const result = await client.GET('/lessons/{lesson}/summary', {
  params: {
    path: {
      lesson: 'lesson-slug',
    },
  },
});

if (result.error) {
  // Handle error
  console.error('API Error:', result.error);
} else if (result.data) {
  // Use data
  console.log('Lesson summary:', result.data);
}
```

## Type Safety

The SDK provides complete type safety through auto-generated types:

```typescript
import type { components } from '@oaknational/oak-curriculum-sdk';

// Type aliases for convenience
type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
type Subject = components['schemas']['AllSubjectsResponseSchema'][number];
type LessonSummary = components['schemas']['LessonSummaryResponseSchema'];
type SearchResult = components['schemas']['LessonSearchResponseSchema'][number];
```

## Pagination

Many endpoints support pagination through `limit` and `offset` parameters:

```typescript
const paginatedResults = await client.GET('/search/lessons', {
  params: {
    query: {
      q: 'algebra',
      limit: 50, // Max 100
      offset: 100, // Skip first 100 results
    },
  },
});
```

## Authentication

The SDK requires an API key for all requests. The key is passed when creating the client:

```typescript
const client = createOakClient(process.env.OAK_API_KEY!);
```

The SDK is environment-agnostic and never reads environment variables directly. You must explicitly pass the API key.

## Advanced Usage

### Custom Base URL

```typescript
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { apiUrl, apiSchemaUrl } from '@oaknational/oak-curriculum-sdk';

// Default API URL
console.log('Using API:', apiUrl);
// https://open-api.thenational.academy/api/v0
console.log('Using API schema:', apiSchemaUrl);
// https://open-api.thenational.academy/openapi.json
```

### Using with async/await

```typescript
async function getLessonData(lessonSlug: string) {
  const client = createOakClient(apiKey);

  // Fetch multiple resources in parallel
  const [summaryResult, transcriptResult, quizResult] = await Promise.all([
    client.GET('/lessons/{lesson}/summary', {
      params: { path: { lesson: lessonSlug } },
    }),
    client.GET('/lessons/{lesson}/transcript', {
      params: { path: { lesson: lessonSlug } },
    }),
    client.GET('/lessons/{lesson}/quiz', {
      params: { path: { lesson: lessonSlug } },
    }),
  ]);

  return {
    summary: summaryResult.data,
    transcript: transcriptResult.data,
    quiz: quizResult.data,
  };
}
```

### TypeScript Strict Mode

The SDK is built with TypeScript strict mode enabled. All parameters are fully typed:

```typescript
// TypeScript will catch these errors at compile time:

// ❌ Missing required parameter
await client.GET('/lessons/{lesson}/summary');
// Error: Argument of type '{}' is not assignable...

// ❌ Invalid parameter value
await client.GET('/key-stages/{keyStage}/subject/{subject}/lessons', {
  params: {
    path: {
      keyStage: 'invalid-stage', // Must be valid key stage
      subject: 'maths',
    },
  },
});

// ✅ Correct usage with all required parameters
await client.GET('/lessons/{lesson}/summary', {
  params: {
    path: {
      lesson: 'valid-lesson-slug',
    },
  },
});
```

## Type Guards and Allowed Values

The SDK exposes runtime type guards and allowed-values lists to validate inputs before making requests and to power UIs (e.g., select menus). These are exported from the package root.

```typescript
import {
  isKeyStage,
  isSubject,
  isValidPathParameter,
  KEY_STAGES,
  SUBJECTS,
} from '@oaknational/oak-curriculum-sdk';

// Validate before calling the API
if (!isKeyStage('ks2')) throw new Error('Invalid key stage');
if (!isSubject('maths')) throw new Error('Invalid subject');

// Generic validation by parameter type
if (!isValidPathParameter('subject', 'english')) throw new Error('Invalid subject');

// Populate UI controls
console.log(KEY_STAGES); // ['ks1','ks2','ks3','ks4']
console.log(SUBJECTS); // ['art','computing',...]
```

Other helpers available:

- isValidPath, isAllowedMethod
- isLesson, isAssetType, isSequenceType, isThreadSlug, isUnit
- LESSONS, ASSET_TYPES, SEQUENCE_TYPES, THREAD_SLUGS, UNITS, PATHS

## Environment & Compatibility

- Node.js: >= 22 (see `engines` in `package.json`).
- Module format: ESM.
- Import policy: import everything from the package root. Subpath imports are not supported.

## Testing

When writing tests, you can use the SDK with mock API keys:

```typescript
import { describe, it, expect } from 'vitest';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';

describe('My Application', () => {
  it('should handle API responses', async () => {
    const client = createOakClient('test-api-key');

    // Mock the fetch call or use MSW for API mocking
    const result = await client.GET('/key-stages');

    expect(result.data).toBeDefined();
  });
});
```

## Support

For issues or questions about the SDK, please visit the [GitHub repository](https://github.com/oaknational/oak-mcp-ecosystem).
