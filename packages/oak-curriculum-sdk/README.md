# Oak Curriculum SDK

TypeScript SDK for accessing Oak National Academy's Curriculum API.

## Overview

This SDK provides a type-safe, runtime-agnostic client for the Oak Curriculum API. It is designed to be reusable across different environments and applications.

## Architecture

The SDK follows conventional naming patterns (no Greek nomenclature) to ensure broad usability:

- `client/` - Main client class and configuration
- `types/` - TypeScript type definitions
- `endpoints/` - API endpoint definitions
- `transport/` - HTTP transport layer with retry logic

## Installation

```bash
npm install @oaknational/oak-curriculum-sdk
```

## Usage

```typescript
import { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';

const client = new OakCurriculumClient({
  apiKey: process.env.OAK_API_KEY,
  baseUrl: 'https://api.oak.academy',
  timeout: 5000,
  retries: 3,
});

// Search for lessons
const lessons = await client.searchLessons({
  subject: 'maths',
  keyStage: 'ks3',
  query: 'algebra',
});

// Get lesson details
const lesson = await client.getLesson('lesson-id');

// List units in a programme
const units = await client.listUnits('programme-id');
```

## Features

- Type-safe API methods
- Automatic retry with exponential backoff
- Response caching
- Error handling with detailed messages
- Runtime-agnostic design

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm type-check
```

## License

MIT
