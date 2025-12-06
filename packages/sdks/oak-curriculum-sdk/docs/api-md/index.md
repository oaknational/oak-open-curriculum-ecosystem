# Oak Curriculum SDK — API (Markdown)

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
Generated:
=======
Generated: 2025-12-05T13:20:50.661Z
>>>>>>> 89674174 (feat(semantic-search): add Redis-based SDK response caching with 404 fallback)
=======
Generated: 2025-12-06T12:13:24.181Z
>>>>>>> 4655543e (fix(type-safety): eliminate type shortcuts and improve error messages)
=======
Generated: 2025-12-06T16:02:49.845Z
>>>>>>> 6eb485fc (fix: resolve type errors and eliminate Record<string, unknown> usage)

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
