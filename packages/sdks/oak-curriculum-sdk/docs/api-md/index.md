# Oak Curriculum SDK — API (Markdown)

Generated: 2026-02-13T12:50:22.658Z

## Contents

## Quickstart

```ts
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
const client = createOakClient('REDACTED');
const res = await client.GET('/lessons/{lesson}/transcript', { params: { path: { lesson: 'lesson-slug' } } });
if (res.error) throw res.error;
console.log(res.data);
```