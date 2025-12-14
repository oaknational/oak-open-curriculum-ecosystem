# Elastic-Native Service Update Plan

**Date**: 2025-12-07  
**Purpose**: Document all required updates to remove external API dependencies  
**Status**: IN PROGRESS

## Required Changes

### External Services to Replace

| External Service  | Elastic-Native Replacement                                 | Status            | Type     |
| ----------------- | ---------------------------------------------------------- | ----------------- | -------- |
| Cohere ReRank     | `.rerank-v1-elasticsearch`                                 | TECH PREVIEW      | Native   |
| OpenAI GPT-4      | `.gp-llm-v2-chat_completion`                               | PRECONFIGURED     | Native   |
| OpenAI Embeddings | `.multilingual-e5-small-elasticsearch`                     | PRECONFIGURED     | Native   |
| HuggingFace NER   | `elastic__distilbert-base-cased-finetuned-conll03-english` | Deploy in cluster | Deployed |

### Environment Variables to Remove

❌ Remove:

- `COHERE_API_KEY`
- `OPENAI_API_KEY`

✅ Keep:

- `ELASTICSEARCH_URL`
- `ELASTICSEARCH_API_KEY`
- `OAK_API_KEY`
- `SEARCH_API_KEY`

### Cost Impact

| Item                      | Old Cost         | New Cost      | Savings   |
| ------------------------- | ---------------- | ------------- | --------- |
| Dense embeddings (OpenAI) | ~$40/month       | $0 (included) | $40       |
| ReRank (Cohere)           | ~$200/month      | $0 (included) | $200      |
| LLM chat (GPT-4)          | ~$1000/month     | $0 (included) | $1000     |
| NER (HuggingFace)         | ~$20/month       | $0 (included) | $20       |
| **TOTAL**                 | **~$1260/month** | **$0**        | **$1260** |

## Files Requiring Updates

### Active Planning Documents

1. `.agent/prompts/semantic-search/semantic-search.prompt.md` - IN PROGRESS
2. `.agent/plans/semantic-search/README.md` - PENDING
3. `.agent/plans/semantic-search/maths-ks4-implementation-plan.md` - PENDING
4. `.agent/plans/semantic-search/start-implementation-guide.md` - PENDING
5. `.agent/plans/semantic-search/search-ui-plan.md` - PENDING
6. `.agent/plans/semantic-search/es-serverless-feature-matrix.md` - PENDING

### Archive Documents

- Will NOT update archived documents (historical reference only)

## Replacement Patterns

### Phase 1B: Reranking

- **Old**: "Cohere ReRank" / "Cohere rerank-english-v3.0"
- **New**: "Elastic Native ReRank" / `.rerank-v1-elasticsearch`
- **Note**: TECH PREVIEW status, included in ES Serverless

### Phase 2A: NER

- **Old**: "HuggingFace NER via Inference API"
- **New**: "Deploy NER model within Elasticsearch cluster (e.g., distilbert)"
- **Note**: Models deployed in cluster, not external API calls

### Phase 3: RAG/LLM

- **Old**: "OpenAI GPT-4" / "gpt-4"
- **New**: "Elastic Native LLM" / `.gp-llm-v2-chat_completion`
- **Note**: PRECONFIGURED, included in ES Serverless

## Implementation Notes

### Elasticsearch NER Documentation

- Source: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-ner-example
- Model example: `elastic__distilbert-base-cased-finetuned-conll03-english`
- Models are imported and deployed within the ES cluster
- No external API calls required
- Uses ingest pipeline with inference processor

### Verification Endpoints

All these endpoints are PRECONFIGURED in ES Serverless:

```bash
GET /_ml/trained_models/

# Expected to see:
# - .multilingual-e5-small-elasticsearch
# - .elser-2-elasticsearch
# - .rerank-v1-elasticsearch
# - .gp-llm-v2-chat_completion
```

## Success Criteria

- [ ] All planning documents updated
- [ ] Zero external API references remain
- [ ] All cost estimates show $0 external API costs
- [ ] Environment variable documentation updated
- [ ] Phase descriptions reference only Elastic services
- [ ] ADR plans reference correct endpoints

## Related Documents

- Elasticsearch NER: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-ner-example
- Elasticsearch Inference: https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-inference
- ES Serverless Endpoints: Verified 2025-12-07

---

**Next Actions**: Apply updates to all active planning documents
