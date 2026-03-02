# Missing Transcript Handling (Option D)

**Status**: ✅ **COMPLETE**
**Created**: 2025-12-31
**Updated**: 2026-01-01
**Completed**: 2026-01-01
**ADR**: [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

---

## ✅ COMPLETE

All items complete. Implementation omits content fields for lessons without transcripts to avoid polluting the BM25 and ELSER indices.

**ES documentation research complete** — see [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) for findings confirming omitting fields is safe.

---

## Implementation Summary

| # | Task | Status |
|---|------|--------|
| 1 | TDD: Update unit tests FIRST | ✅ |
| 2 | Make transcript fields optional in schema | ✅ |
| 3 | Add `has_transcript` field | ✅ |
| 4 | Update transformer | ✅ |
| 5 | Resolve DRY issue | ✅ |
| 6 | Add upstream API wishlist item | ✅ |
| 7 | Run quality gates | ✅ |

---

## Related Documents

- [ADR-094: `has_transcript` Field](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md)
- [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)
