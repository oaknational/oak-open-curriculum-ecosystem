# Oak Curriculum SDK — API (Markdown)

<<<<<<< HEAD
Generated: 2025-12-07T20:49:33.840Z
=======
Generated: 2025-12-04T15:39:20.682Z
>>>>>>> 0130fdc4 (docs(prompts): add comprehensive ES Serverless deployment prompt)

## Contents

## Quickstart

```ts
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
const client = createOakClient('REDACTED');
const res = await client.GET('/lessons/{lesson}/transcript', {
  params: { path: { lesson: 'lesson-slug' } },
});
if (res.error) throw res.error;
console.log(res.data);
```
