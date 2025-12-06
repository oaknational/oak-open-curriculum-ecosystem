0. Are we following the rules, no fallbacks, no compatibility layers, clean breaks, fail fast with helpful error messages? @.agent/directives-and-memory/rules.md
1. Do we have any dead code?
2. Are we versioning with Git rather than names? @.agent/directives-and-memory/rules.md
3. Do all test prove behaviour rather than implementation? @.agent/directives-and-memory/testing-strategy.md
4. Do all tests prove something useful about product code, not just about test code?
5. Are there any other potential sources of mismatch, or other issues, that could potential prevent an upload from occurring?
6. Do we have comprehensive and detailed TSDoc that includes examples?
7. Explore what did get uploaded and ingested, are there any surprised? https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud/app/discover#/?_tab=(tabId:d622aec6-d5fc-42e6-a794-d94d4c8ab50b)&_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&_a=(columns:!(),dataSource:(dataViewId:default_all_data_id,type:dataView),filters:!(),interval:auto,query:(language:kuery,query:''),sort:!()) if you need me to log in just pause so that I can

here are some expectations of what might be in ES

```text
Expected Elasticsearch Serverless UI State (Kibana)
===================================================

INDEXES (Index Management > Indices):
- oak_lessons        - 0 docs (ingestion failed with strict_dynamic_mapping_exception)
- oak_units          - 0 docs (reset during troubleshooting)
- oak_unit_rollup    - 0 docs (reset during troubleshooting)
- oak_sequences      - 0 docs (not yet populated)
- oak_sequence_facets - 0 docs (not yet populated)
- oak_meta           - 0 docs (metadata index)

Previous test data (History KS2 - 153 docs) was cleared during index reset.

INDEX MAPPINGS (per index, in Mapping tab):
- All indexes have `dynamic: "strict"`
- Analyzers: oak_text_index, oak_text_search
- Normalizers: oak_lower
- completion fields with contexts (subject, key_stage, sequence, phase - varies by index)
- semantic_text fields for ELSER sparse embedding

SYNONYM SETS (Search > Synonyms):
- oak-syns: 68 synonym rules generated from SDK (subjects, key stages, etc.)

INFERENCE ENDPOINTS (Machine Learning > Trained Models):
- .elser-2-elastic (preconfigured, used by semantic_text fields)
- .multilingual-e5-small-elasticsearch (preconfigured, dense embeddings)
- .rerank-v1-elasticsearch (preconfigured, tech preview)

NOTES:
- No documents currently indexed due to the completion context mismatch bug
- The bug has been fixed in code but quality gates not yet passing
- Ready for fresh ingestion once lint issues resolved
```

This is about discovery and reporting, do not change anything, do write up your results in a new file in .agent/analysis/
