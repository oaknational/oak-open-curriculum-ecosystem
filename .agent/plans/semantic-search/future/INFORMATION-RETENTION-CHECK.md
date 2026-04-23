# Information Retention Check

Date: 2026-02-25

Method:

- Confirm every original `post-sdk` markdown file has a migrated `future/` counterpart
- Confirm heading structure parity (`^#` lines) for each source-target pair
- Preserve byte-identical transfer evidence from [TRANSFER-MANIFEST.md](TRANSFER-MANIFEST.md)
- This check was executed before removing `post-sdk/` on 2026-02-25

| Source | Target | Source Lines | Target Lines | Headings Match |
|---|---|---:|---:|---|
| `.agent/plans/semantic-search/post-sdk/README.md` | `.agent/plans/semantic-search/future/01-strategic-lifecycle-backlog/README.md` | 73 | 73 | `yes` |
| `.agent/plans/semantic-search/post-sdk/move-search-domain-knowledge-to-codegen-time.md` | `.agent/plans/semantic-search/future/02-schema-authority-and-codegen/move-search-domain-knowledge-to-codegen-time.md` | 226 | 226 | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-schema-driven-code-generation.md` | `.agent/plans/semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md` | 251 | 251 | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/README.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/README.md` | 49 | 49 | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/vocabulary-mining.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/vocabulary-mining.md` | 246 | 246 | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/natural-language-paraphrases.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/natural-language-paraphrases.md` | 274 | 274 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/mfl-synonym-architecture.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/mfl-synonym-architecture.md` | 173 | 173 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/README.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/README.md` | 98 | 98 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/document-relationships.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/document-relationships.md` | 195 | 195 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/modern-es-features.md` | 531 | 531 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/definition-retrieval.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/definition-retrieval.md` | 285 | 285 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/mfl-multilingual-embeddings.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/mfl-multilingual-embeddings.md` | 166 | 166 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/ai-enhancement.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/ai-enhancement.md` | 245 | 245 | `yes` |
| `.agent/plans/semantic-search/post-sdk/sdk-api/README.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/README.md` | 46 | 46 | `yes` |
| `.agent/plans/semantic-search/post-sdk/sdk-api/filter-testing.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/filter-testing.md` | 175 | 175 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/search-decision-model.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/search-decision-model.md` | 359 | 359 | `yes` |
| `.agent/plans/semantic-search/post-sdk/mcp-integration/README.md` | `.agent/plans/semantic-search/future/06-mcp-consumer-integration/README.md` | 55 | 55 | `yes` |
| `.agent/plans/semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md` | `.agent/plans/semantic-search/future/06-mcp-consumer-integration/mcp-result-pattern-unification.md` | 171 | 171 | `yes` |
| `.agent/plans/semantic-search/post-sdk/operations/README.md` | `.agent/plans/semantic-search/future/07-runtime-governance-and-operations/README.md` | 54 | 54 | `yes` |
| `.agent/plans/semantic-search/post-sdk/operations/governance.md` | `.agent/plans/semantic-search/future/07-runtime-governance-and-operations/governance.md` | 285 | 285 | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/README.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/README.md` | 38 | 38 | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/advanced-features.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/advanced-features.md` | 182 | 182 | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/widget-renderer-reactivation.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md` | 110 | 110 | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md` | `.agent/plans/semantic-search/future/09-evaluation-and-evidence/ground-truth-expansion-plan.md` | 123 | 123 | `yes` |

Result: PASS — no missing files and heading structure retained.
