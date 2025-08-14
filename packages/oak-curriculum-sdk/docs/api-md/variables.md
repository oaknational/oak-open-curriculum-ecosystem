# Variables

### apiSchemaUrl

### apiUrl

### toolGeneration

Programmatic tool generation exports: pre-generated metadata and helpers.

Includes:

- `PATH_OPERATIONS` and `OPERATIONS_BY_ID` (operation metadata)
- `PARAM_TYPE_MAP` (curated parameter schemas)
- `parsePathTemplate` (path template utility)
- Allowed value constants (`KEY_STAGES`, `SUBJECTS`, `allowedMethods`)

Example:

````ts
```ts
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';

for (const op of toolGeneration.PATH_OPERATIONS) {
  const { toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);
  console.log(op.operationId, toMcpToolName());
}
````

```

```
