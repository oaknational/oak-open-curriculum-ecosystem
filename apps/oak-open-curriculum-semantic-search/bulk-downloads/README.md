# Bulk Download Data

This folder contains Oak curriculum bulk download JSON files used for search index population.

**Source**: <https://open-api.thenational.academy/bulk-download>

## Files

| File Pattern               | Example                | Content         |
| -------------------------- | ---------------------- | --------------- |
| `{subject}-primary.json`   | `maths-primary.json`   | KS1-KS2 content |
| `{subject}-secondary.json` | `maths-secondary.json` | KS3-KS4 content |

## Expected Files (32 total)

After a successful download, you should have files for all 17 subjects:

- art-primary.json, art-secondary.json
- citizenship-secondary.json
- computing-primary.json, computing-secondary.json
- cooking-nutrition-primary.json, cooking-nutrition-secondary.json
- design-technology-primary.json, design-technology-secondary.json
- english-primary.json, english-secondary.json
- french-primary.json, french-secondary.json
- geography-primary.json, geography-secondary.json
- german-secondary.json
- history-primary.json, history-secondary.json
- maths-primary.json, maths-secondary.json
- music-primary.json, music-secondary.json
- physical-education-primary.json, physical-education-secondary.json
- religious-education-primary.json, religious-education-secondary.json
- rshe-pshe-primary.json, rshe-pshe-secondary.json
- science-primary.json, science-secondary.json
- spanish-primary.json, spanish-secondary.json

## Refresh Cadence

Re-download every few weeks to get fresh curriculum data.

```bash
# From apps/oak-open-curriculum-semantic-search
# (Reads OAK_API_KEY from .env.local)
pnpm bulk:download
```

## Gitignore

The JSON files are gitignored to avoid committing large data files. Only the `.gitkeep` and `README.md` are tracked.

## Related

- [ADR-093: Bulk-First Ingestion Strategy](../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)
- [Download Script](../scripts/download-bulk.ts)
