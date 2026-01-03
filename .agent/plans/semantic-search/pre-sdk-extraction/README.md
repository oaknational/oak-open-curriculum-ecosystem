# Pre-SDK Extraction Work

**Purpose**: Work that MUST complete before the Search SDK can be extracted from the Next.js app.

**Dependency Chain**:

```
M3: Search Quality Optimization (active/)
        ↓
Bulk Data Analysis (this folder)
        ↓
Tier 2: Document Relationships (this folder)
        ↓
Tier 3: Modern ES Features (this folder)
        ↓
SDK Extraction (../sdk-extraction/)
```

---

## Plans in This Folder

| Plan | Prerequisites | Description |
|------|---------------|-------------|
| [bulk-data-analysis.md](bulk-data-analysis.md) | M3 complete | Consolidated vocabulary mining, transcript mining, entity extraction |
| [tier-2-document-relationships.md](tier-2-document-relationships.md) | Bulk analysis complete | Cross-referencing, threads, prerequisites |
| [tier-3-modern-es-features.md](tier-3-modern-es-features.md) | Tier 2 complete | RRF tuning, field boosting, kNN evaluation |

---

## Why This Order?

1. **M3 (Search Quality)** identifies what quality gaps exist through comprehensive ground truths
2. **Bulk Data Analysis** mines the curriculum data to find vocabulary and patterns that address those gaps
3. **Tier 2** exploits document relationships (threads, sequences, prerequisites) for better relevance
4. **Tier 3** tunes ES-native features (RRF weights, field boosts) based on measured impact
5. **SDK Extraction** can only happen once search functionality is stable and proven

---

## Related Documents

- [../active/](../active/) — Current executable work (M3)
- [../sdk-extraction/](../sdk-extraction/) — The extraction itself
- [../roadmap.md](../roadmap.md) — Authoritative milestone sequence
- [../search-acceptance-criteria.md](../search-acceptance-criteria.md) — Tier definitions

