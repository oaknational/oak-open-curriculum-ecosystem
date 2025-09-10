# Oak Curriculum SDK — API (Markdown)

Generated: 2025-09-10T14:08:19.755Z

## Contents

- [Functions](./functions.md)
- [Classes](./classes.md)
- [Interfaces](./interfaces.md)
- [Type Aliases](./types.md)
- [Variables](./variables.md)
- [References](./references.md)

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
