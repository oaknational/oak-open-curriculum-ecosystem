# Post-SDK to Future Boundary Transfer Manifest

Status: Transfer complete; originals removed after verification
Date: 2026-02-25

Purpose:

- Preserve all original `post-sdk` documents for comparison
- Verify each transferred document in `future/` is byte-identical
- Record source-to-target mapping for auditability

Original source files were located at:

- `.agent/plans/semantic-search/post-sdk/`

Removal note:

- Original `post-sdk/` directory removed on 2026-02-25 after transfer verification.

| Source | Target | Source SHA-256 | Target SHA-256 | Match |
|---|---|---|---|---|
| `.agent/plans/semantic-search/post-sdk/README.md` | `.agent/plans/semantic-search/future/01-strategic-lifecycle-backlog/README.md` | `bca0c7fb5a67800124e4eb4dd7944625eb93843f9a8c47ac55372b6476718150` | `bca0c7fb5a67800124e4eb4dd7944625eb93843f9a8c47ac55372b6476718150` | `yes` |
| `.agent/plans/semantic-search/post-sdk/move-search-domain-knowledge-to-codegen-time.md` | `.agent/plans/semantic-search/future/02-schema-authority-and-codegen/move-search-domain-knowledge-to-codegen-time.md` | `3b0b3b9c996aae20bc5311e5eaa853e05d962b4b13c74608c1420dcab3425d8d` | `3b0b3b9c996aae20bc5311e5eaa853e05d962b4b13c74608c1420dcab3425d8d` | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-schema-driven-code-generation.md` | `.agent/plans/semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md` | `edf032cb3208a4206b2713f31b56521f9ee7c1da2d4e8e61a42e4e3ea0402ebf` | `edf032cb3208a4206b2713f31b56521f9ee7c1da2d4e8e61a42e4e3ea0402ebf` | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/README.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/README.md` | `ef020c761e4b1bc564b19fd7aed0d9479dece1056de6ccfbff1e3ba90589de6b` | `ef020c761e4b1bc564b19fd7aed0d9479dece1056de6ccfbff1e3ba90589de6b` | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/vocabulary-mining.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/vocabulary-mining.md` | `2d17c0b3acdc2a83af8334588e43acba42c65e93c0e320c0449e61b897a55042` | `2d17c0b3acdc2a83af8334588e43acba42c65e93c0e320c0449e61b897a55042` | `yes` |
| `.agent/plans/semantic-search/post-sdk/bulk-data-analysis/natural-language-paraphrases.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/natural-language-paraphrases.md` | `c26b1d7d3236dddedf119e220646f4325c4217790907a00fc741de4396b814b4` | `c26b1d7d3236dddedf119e220646f4325c4217790907a00fc741de4396b814b4` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/mfl-synonym-architecture.md` | `.agent/plans/semantic-search/future/03-vocabulary-and-semantic-assets/mfl-synonym-architecture.md` | `1f3bac4c1080c5b41103661e81f37f8c05bbbc6e8da2baf6a4d7803245b0070a` | `1f3bac4c1080c5b41103661e81f37f8c05bbbc6e8da2baf6a4d7803245b0070a` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/README.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/README.md` | `1e21c99ead3b1231f9ca087557e48d8461912bd2e287e2c376df89cfae7444e5` | `1e21c99ead3b1231f9ca087557e48d8461912bd2e287e2c376df89cfae7444e5` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/document-relationships.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/document-relationships.md` | `c000621e1a33d07cbdad737020e683e7bc321f19ffb2429e6b0c04115563a54a` | `c000621e1a33d07cbdad737020e683e7bc321f19ffb2429e6b0c04115563a54a` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/modern-es-features.md` | `dc23db501a9ac32b93f4a2ca58d58becba0a9aed16769cf0f7c7720a8bba1991` | `dc23db501a9ac32b93f4a2ca58d58becba0a9aed16769cf0f7c7720a8bba1991` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/definition-retrieval.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/definition-retrieval.md` | `09e7a9de82f026f1d5cfc4c66dd1ca76bdf0af1b92cc533b082158ac9d276d46` | `09e7a9de82f026f1d5cfc4c66dd1ca76bdf0af1b92cc533b082158ac9d276d46` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/mfl-multilingual-embeddings.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/mfl-multilingual-embeddings.md` | `8aa9e068b6d5e664aa6b045e3a54081c2cf2a2fa84d0bc8e7ab7515d4f75951b` | `8aa9e068b6d5e664aa6b045e3a54081c2cf2a2fa84d0bc8e7ab7515d4f75951b` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/ai-enhancement.md` | `.agent/plans/semantic-search/future/04-retrieval-quality-engine/ai-enhancement.md` | `50e7593296de6283eb5c96cdf73e8ba52ea3a4d9562a958b8217e72f1b1dbbad` | `50e7593296de6283eb5c96cdf73e8ba52ea3a4d9562a958b8217e72f1b1dbbad` | `yes` |
| `.agent/plans/semantic-search/post-sdk/sdk-api/README.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/README.md` | `4394bc40a4fbe81c36c77c57a5a5f6a7192c1a7e3b78c77627e08e575df54e16` | `4394bc40a4fbe81c36c77c57a5a5f6a7192c1a7e3b78c77627e08e575df54e16` | `yes` |
| `.agent/plans/semantic-search/post-sdk/sdk-api/filter-testing.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/filter-testing.md` | `bd0ca249134af3ad4ef71050f2a210f0ddc9177f0150fde4f13b5e8d42073ba2` | `bd0ca249134af3ad4ef71050f2a210f0ddc9177f0150fde4f13b5e8d42073ba2` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/search-decision-model.md` | `.agent/plans/semantic-search/future/05-query-policy-and-sdk-contracts/search-decision-model.md` | `3a697cc6a66681e7c914217f2e0990a73223c623592717939254b17d4a2c6547` | `3a697cc6a66681e7c914217f2e0990a73223c623592717939254b17d4a2c6547` | `yes` |
| `.agent/plans/semantic-search/post-sdk/mcp-integration/README.md` | `.agent/plans/semantic-search/future/06-mcp-consumer-integration/README.md` | `74b128bf54dc568fe037a460698906f965dc1e16e54f684b8b84858959a71f17` | `74b128bf54dc568fe037a460698906f965dc1e16e54f684b8b84858959a71f17` | `yes` |
| `.agent/plans/semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md` | `.agent/plans/semantic-search/future/06-mcp-consumer-integration/mcp-result-pattern-unification.md` | `03ecf4e6ac61da6ab9f9bab0aebfd57a342888e18b1e4aed7e98ddf06f0aa660` | `03ecf4e6ac61da6ab9f9bab0aebfd57a342888e18b1e4aed7e98ddf06f0aa660` | `yes` |
| `.agent/plans/semantic-search/post-sdk/operations/README.md` | `.agent/plans/semantic-search/future/07-runtime-governance-and-operations/README.md` | `06bf19f488fcdaa5b0f7dd9c9e8f7db7880f6569111327edfa50b42b10d41b68` | `06bf19f488fcdaa5b0f7dd9c9e8f7db7880f6569111327edfa50b42b10d41b68` | `yes` |
| `.agent/plans/semantic-search/post-sdk/operations/governance.md` | `.agent/plans/semantic-search/future/07-runtime-governance-and-operations/governance.md` | `979d876beb9e1ceaed6fa45c2e75bf6074e151acdb6674c806088a0682ffd31e` | `979d876beb9e1ceaed6fa45c2e75bf6074e151acdb6674c806088a0682ffd31e` | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/README.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/README.md` | `2f39c28874a9473b93ec20764e1a6c24ec300df9a2642c756c8b1ee65b5dc4ff` | `2f39c28874a9473b93ec20764e1a6c24ec300df9a2642c756c8b1ee65b5dc4ff` | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/advanced-features.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/advanced-features.md` | `056536a68f6f4e6bed369fac7ff78dc0443a3b1345790995fa38ceaccf81ab02` | `056536a68f6f4e6bed369fac7ff78dc0443a3b1345790995fa38ceaccf81ab02` | `yes` |
| `.agent/plans/semantic-search/post-sdk/extensions/widget-renderer-reactivation.md` | `.agent/plans/semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md` | `a8913125b74118cbd59f96a1dabae6efe32b26d4174ba5ffbd6e8cd14dacef31` | `a8913125b74118cbd59f96a1dabae6efe32b26d4174ba5ffbd6e8cd14dacef31` | `yes` |
| `.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md` | `.agent/plans/semantic-search/future/09-evaluation-and-evidence/ground-truth-expansion-plan.md` | `219a98c4ef0f05c19771254fcb6617a5b599e7cc6e040ee250df248a22e3b335` | `219a98c4ef0f05c19771254fcb6617a5b599e7cc6e040ee250df248a22e3b335` | `yes` |
