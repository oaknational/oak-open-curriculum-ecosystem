# Oak Curriculum SDK — API (Markdown)

Generated: 2025-09-26T14:39:20.944Z

## Contents

## Quickstart

```ts
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
const client = createOakClient('YOUR_API_KEY');
const res = await client.GET('/lessons/{lesson}/transcript', {
  params: { path: { lesson: 'lesson-slug' } },
});
if (res.error) throw res.error;
console.log(res.data);
```
