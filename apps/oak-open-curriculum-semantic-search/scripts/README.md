# Scripts

Standalone CLI scripts that have not yet migrated to
`operations/` or `evaluation/`. Each script reads its
configuration via `loadAppEnv()` + `env()` from
`src/lib/env.ts` — no direct `process.env` access.

## Active Scripts

### `download-bulk.ts`

Download Oak curriculum bulk data files from the Open API.

```bash
pnpm bulk:download
```

Referenced by: `docs/INGESTION-GUIDE.md`, `docs/SETUP.md`,
and other ingestion documentation.

### `diagnose-elser-failures.ts`

Run ELSER ingestion failure diagnostics. Writes a JSON
report to `diagnostics/`.

```bash
pnpm diagnose:elser [--limit N] [--subject SUBJECT]
```

### `analyze-elser-failures.ts`

Analyze a diagnostic report produced by `diagnose-elser`.

```bash
pnpm analyze:elser <report-file>
```

## Deleted Scripts

| Script                        | Reason                                                 |
| ----------------------------- | ------------------------------------------------------ |
| `migrate-transcript-cache.ts` | One-off Redis migration, executed and removed Feb 2026 |
| `ingest-all-combinations.ts`  | Replaced by `pnpm es:ingest-live --all`                |
| `check-progress.ts`           | Replaced by `pnpm es:status`                           |
| `verify-ingestion.ts`         | Moved to `operations/ingestion/`                       |

## Migration History

Many scripts were reorganised into domain-specific
directories in Dec 2025. See `operations/README.md` and
`evaluation/README.md` for the current structure.
