# @oaknational/search-contracts

Canonical semantic-search field inventory and stage contract matrices.

This library is the shared contract surface for:

- field inventory derived from generated search schemas and mappings;
- ingest stage contract matrix;
- retrieval stage contract matrix.

## Usage

```ts
import { SEARCH_FIELD_INVENTORY, STAGE_CONTRACT_MATRIX } from '@oaknational/search-contracts';
```

Consumers should treat this package as a contract surface only:

- `SEARCH_FIELD_INVENTORY` is generated from `@oaknational/sdk-codegen/search` mappings + schemas.
- `STAGE_CONTRACT_MATRIX` applies those fields across ingest and retrieval stages for contract tests and readback audit tooling.

## Public API

Runtime exports:

- `SEARCH_FIELD_INVENTORY`
- `STAGE_CONTRACT_MATRIX`
- `SEARCH_INDEX_FAMILIES`
- `FIELD_GROUPS`
- `FIELD_SEMANTICS`
- `INGEST_STAGES`
- `RETRIEVAL_STAGES`
- `createFieldInventory()`

Type exports:

- `FieldInventoryEntry`
- `StageContractEntry`

## Contract Enforcement

- Inventory/schema parity is enforced by `packages/libs/search-contracts/src/field-inventory.integration.test.ts`.
- Stage-coverage parity is enforced by `apps/oak-search-cli/src/lib/indexing/stage-contract-matrix.integration.test.ts`.
