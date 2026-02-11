# Search Fixture Reference Notes

## Source Snapshots

- `search-fixture-source-ks2-maths.json` – KS2 maths (primary) lessons, units, and sequences.
- `search-fixture-source-ks4-maths.json` – KS4 maths (secondary) coverage including Year 10 units.
- `search-fixture-source-ks3-history.json` – KS3 history with medieval/world inquiry units.
- `search-fixture-source-ks3-art.json` – KS3 art spanning abstract painting, portraiture, and overview units.

All datasets originate from the Oak Curriculum SDK (OpenAPI aligned at `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`). Suggestions are manually curated to mirror Search API payloads defined by the indices, facets, and roll-ups under `apps/oak-search-cli/src/lib`.

## Key Elements per Snapshot

### KS2 Maths

- **Highlight:** Unit `2-4-and-8-times-tables-using-times-tables-to-solve-problems` supplies 10 lesson titles for multi-column card testing.
- **Suggestions:** Lesson, unit, and programme entries referencing the primary maths sequence with contextual metadata (`unitSlug`, phase, key stages).

### KS4 Maths

- **Highlight:** Year 10 unit list covers algebra, geometry, statistics, and trigonometry ensuring multi-bucket variety.
- **Suggestions:** Lesson (perimeter focus), unit (algebraic manipulation), and programme (secondary maths) to exercise KS4 search summaries.

### KS3 History

- **Highlight:** Year 7 units emphasise medieval and global perspectives; lesson sample anchored on Cordoba.
- **Suggestions:** Cross-scope entries linking to medieval Mali, AQA secondary programme, and associated context metadata.

### KS3 Art

- **Highlight:** Year 8/9 units offer portraiture, identity, textiles, and collaborative art themes for visual richness.
- **Suggestions:** Lesson (mark-making), unit (portraiture), and programme (secondary art) showcasing creative subject metadata.

## Modelling Considerations

- Preserve lesson/unit identifiers as canonical slugs for card URLs and highlight text.
- Map `years`, `phaseSlug`, and `keyStages` onto fixture builders to drive facet and summary copy.
- Suggestions should maintain consistent casing, prefixing with scope labels (Lesson ·, Unit ·, Programme ·) for hero guidance tests.
- Retain `fetchedAt`, `keyStage`, and `subject` metadata to document provenance and future regeneration inputs.

These notes inform test fixture builders, ensuring outputs remain faithful to upstream schema constraints while delivering relevant variety.
