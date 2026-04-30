# External Material Triage

**Last updated**: 2026-04-29

This note records the current disposition of sector-facing material that was
formerly grouped as generic `external/` planning.

| Material | Current home | Disposition | Notes |
|---|---|---|---|
| Castr requirements pack | [castr/](castr/) | Retain | Still relevant because Oak needs a path away from the dead `openapi-to-zod` / `openapi-zod-client` dependency chain. Treat as a future codegen replacement candidate, not a current integration commitment. |
| OOC API wishlist | [ooc-api-wishlist/](ooc-api-wishlist/) | Reference / triage | Preserve as downstream consumer evidence. Validate against the current `oak-openapi` implementation before promoting any item as current work. |
| OOC issue reports | [ooc-issues/](ooc-issues/) | Reference / triage | Preserve issue snapshots, but re-check against the current API implementation before action. |
| OEAI review | [oeai/](oeai/) | Retain partner thread | Useful reference architecture review; not an adoption decision. |
| External evidence and skills sources | [external-knowledge-sources/](external-knowledge-sources/) | Split into source-ingestion lane | Covers EEF Toolkit, education skills, and future third-party knowledge graphs as application data sources. |
| Oak KG adoption by others | [knowledge-graph-adoption/](knowledge-graph-adoption/) | New adoption lane | Covers support for external organisations using Oak's own KG assets. |
