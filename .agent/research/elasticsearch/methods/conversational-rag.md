# Conversational Search and RAG Patterns

This note describes a practical method for conversational search and retrieval-augmented generation (RAG) using Elasticsearch as the retrieval layer.

## 1. Core Pipeline

1. Capture the user query plus recent conversational context.
2. Retrieve top results with hybrid search (BM25 + semantic).
3. Optionally rerank the candidate set.
4. Build a prompt that includes:
   - The question.
   - Short, relevant snippets.
   - Citations or source identifiers.
5. Call the LLM.
6. Return the answer plus sources and next-step suggestions.

## 2. Chunking Strategy

Use a chunking strategy that fits your latency and cost budget:

- Manual chunking by section or paragraph.
- `semantic_text` for automatic chunking at ingest time.

The retrieval layer should return small, focused snippets rather than full documents.

## 3. Grounding and Citations

Always carry source identifiers and URLs through the retrieval step. The conversational layer should:

- Cite the source documents.
- Avoid asserting details not present in the retrieved context.

## 4. Conversational Context

Keep a lightweight session state:

- Previous entities and filters.
- Recent user intent (eg "year 5 maths").

Use this state to bias retrieval, not to replace it.

## 5. Evaluation

Track:

- Answer grounding rate (answers supported by sources).
- Retrieval accuracy (did the right sources appear?).
- Latency and cost per request.

## References

- RAG playground: https://www.elastic.co/docs/solutions/search/rag/playground
- Inference API: https://www.elastic.co/docs/solutions/search/using-openai-compatible-models
- Semantic search overview: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html
