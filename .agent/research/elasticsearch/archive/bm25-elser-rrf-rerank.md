# Configuring `.rerank-v1` for Hybrid Search in Elasticsearch Serverless

## Initial Hybrid Retrieval with BM25 + ELSER (RRF Retriever)

To perform a hybrid search that combines lexical BM25 with semantic ELSER, Elasticsearch provides the **Reciprocal Rank Fusion (RRF)** retriever. RRF merges results from multiple retrievers (e.g. a BM25 query and an ELSER-based query) into one ranked list [oai_citation:0‡elastic.co](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch#:~:text=As%20we%20can%20see%20above%2C,combine%20vector%20and%20lexical%20matches). It works by retrieving top results from each sub-retriever and assigning a score based on their rank in each result set, rather than raw relevancy scores. This avoids manual score calibration and yields a combined candidate list of documents.

**How to build an RRF hybrid query:**

- Use the search API’s `"retriever": { "rrf": { ... }}` clause to define a compound retriever that includes two child retrievers – one for BM25 (lexical) and one for ELSER (semantic).
- The BM25 retriever is typically a `standard` retriever with a query such as `match` or `multi_match` on your text field. For example, a `standard` retriever might search the `"content"` field for the user query text.
- The ELSER retriever can be specified as a `standard` retriever as well, using a **sparse vector query**. Elasticsearch’s sparse vector query will use the ELSER model to expand the query into semantic tokens and match against a sparse vector field (populated by ELSER embeddings at index time) [oai_citation:1‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,). For example:

  ```json
  "standard": {
    "query": {
      "sparse_vector": {
        "field": "content_embedding",
        "inference_id": "my-elser-model",
        "query": "your search terms"
      }
    }
  }
  ```

  In this snippet, `"field"` is the name of the sparse vector field in the index (populated with ELSER embeddings for the document text), and `"inference_id"` is the ID of the deployed ELSER model used to embed the query on the fly. The `"query"` text is the user’s search input [oai_citation:2‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,). (On Serverless, you can use Elastic’s built-in ELSER model by referencing its ID, for example, the default ELSER model ID is usually `.elser_model_1`.)

- These two retrievers are listed under the `rrf` retriever’s `"retrievers"` array. For example, one entry for the semantic (ELSER) retriever as above, and another for the lexical retriever:

  ```json
  "standard": {
    "query": {
      "multi_match": {
        "query": "your search terms",
        "fields": [ "content", "title" ]
      }
    }
  }
  ```

  This second snippet shows a standard BM25 query searching the `"content"` and `"title"` fields [oai_citation:3‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,). You can adjust the fields as needed for your use case.

- The RRF retriever also supports parameters like `"rank_constant"` and `"rank_window_size"`. **`rank_window_size`** controls how many results from each sub-retriever are considered for fusion (defaults to the final `size`). **`rank_constant`** (an integer, e.g. 60) adjusts how much weight to give lower-ranked results (higher values give _more_ influence to documents that were lower in each list) [oai_citation:4‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=%7D%20%5D%2C%20,) [oai_citation:5‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,). You can usually start with `rank_constant: 1` for an even blend, or a moderate number like 60 as in Elastic’s examples, and tune if needed.
- When the search is executed, Elasticsearch will retrieve results from both the BM25 query and the ELSER semantic query, then apply the RRF formula to produce a unified ranking [oai_citation:6‡elastic.co](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch#:~:text=As%20we%20can%20see%20above%2C,combine%20vector%20and%20lexical%20matches). This gives a set of top-_k_ candidates that includes both keyword matches and semantically relevant documents (for example, capturing synonyms or concept matches via ELSER). _Note:_ RRF requires an enterprise license in self-managed clusters [oai_citation:7‡elastic.co](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch#:~:text=The%20last%20thing%20to%20note,feature%20set%20for%20one%20month), but in **Elasticsearch Serverless** this capability is available out-of-the-box as part of the service.

## Attaching the `.rerank-v1` Model as a Reranker

Once you have the hybrid retrieval in place (BM25 + ELSER via RRF), you can attach the built-in **Elastic Rerank model** (`.rerank-v1`) to re-score and reorder those top results. Elasticsearch’s **semantic reranker** is implemented through the `text_similarity_reranker` retriever in the query DSL [oai_citation:8‡elastic.co](https://www.elastic.co/search-labs/blog/elasticsearch-retrievers-ga-8-16-0#:~:text=%2A%20%60knn%60%20,type%20%2016%20endpoint). This allows you to perform the initial retrieval and the reranking in a single search request pipeline.

**Key steps to add the reranker:**

- **Use the `text_similarity_reranker` retriever:** Wrap your RRF retriever inside a `text_similarity_reranker`. The structure is:

  ```json
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        ... your first-stage retriever here ...
      },
      "field": "content",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "your search terms",
      "rank_window_size": 50,
      "min_score": 0.0
    }
  }
  ```

  In this structure, the `"retriever"` field inside `text_similarity_reranker` should contain your initial retriever. This can be a complex retriever like the RRF example above, or a simple one. For our case, you would place the `"rrf": { ... }` definition here so that the reranker operates on the results of the hybrid search.

- **Specify the document field to rerank:** The `"field"` parameter tells Elasticsearch which field of each document to feed into the rerank model [oai_citation:9‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%7D%2C%20%22field%22%3A%20%22text%22%2C%20%22inference_id%22%3A%20%22my,0.5). Typically, this is the main content field (e.g. `"content"` or `"body"`). The model will take the text from this field (for each of the top documents) and the query text to evaluate semantic relevance. **Important:** This field’s content should be representative of the document for best results. Ensure that this field is stored or in `_source` so that the reranker can access its text.

- **Select the inference model:** The built-in Elastic Rerank model is referenced via an inference endpoint. On Serverless and recent Elastic versions, a preconfigured endpoint `".rerank-v1-elasticsearch"` is available, which uses the Elastic Rerank cross-encoder [oai_citation:10‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=To%20use%20,similarity%20models%20supported%20by%20Elasticsearch). You can specify `"inference_id": ".rerank-v1-elasticsearch"` as above. If you omit `inference_id`, it will default to this built-in model [oai_citation:11‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=To%20use%20,similarity%20models%20supported%20by%20Elasticsearch). (If you had created a custom named endpoint for reranking, you would put its ID here instead.)

- **Provide the query text for inference:** Use the `"inference_text"` field to supply the query string to the model [oai_citation:12‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%7D%2C%20%22field%22%3A%20%22text%22%2C%20%22inference_id%22%3A%20%22my,0.5). In most cases this will be identical to the user’s search query. It needs to be provided explicitly; the reranker will not automatically reuse the query from the sub-retriever, so make sure the text matches your initial search intent. (You could theoretically provide a different text if you wanted to rerank by some other criterion, but usually it’s the same query.)

- **Set `rank_window_size` for reranking:** This controls how many of the top retrieved documents from the first stage will be passed to the rerank model [oai_citation:13‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%22inference_id%22%3A%20%22my,0.5). For example, if your RRF retriever returns 50 candidates, you might set `"rank_window_size": 50` to have the model evaluate all 50. Only those documents within this window are rescored and re-ordered; anything beyond that is ignored. Typically, you set this equal to or higher than the final number of results you want to return. A common approach is to gather a larger pool (say 50–100 docs) and then rerank them to produce the top 10 final results.

- **Optional: Use a score threshold:** You can include `"min_score"` in the reranker settings [oai_citation:14‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%22inference_id%22%3A%20%22my,0.5). This will filter out any documents whose reranker score falls below the threshold you specify. For instance, setting `"min_score": 0.5` (as in Elastic’s docs) would drop documents that the model deemed not sufficiently relevant (since the Elastic Rerank model outputs scores in a normalized range ≥0 after internal adjustments [oai_citation:15‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=Important)). This can be useful to ensure only confidently relevant hits are returned, especially in scenarios like question-answering or if you feed results into an LLM.

**Putting it together – JSON example:** Below is a combined example that performs a hybrid search and then reranks the results. We assume an index `documents` where each document has a text field `content` and a sparse vector field `content_embedding` (generated by ELSER). The query is searching for `"modern art sculpture"` as an example.

```json
POST documents/_search
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          "retrievers": [
            {
              "standard": {
                "query": {
                  "multi_match": {
                    "query": "modern art sculpture",
                    "fields": [ "content", "title" ]
                  }
                }
              }
            },
            {
              "standard": {
                "query": {
                  "sparse_vector": {
                    "field": "content_embedding",
                    "inference_id": ".elser_model_1",
                    "query": "modern art sculpture"
                  }
                }
              }
            }
          ],
          "rank_constant": 60,
          "rank_window_size": 50
        }
      },
      "field": "content",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "modern art sculpture",
      "rank_window_size": 50,
      "min_score": 0.0
    }
  },
  "size": 10
}
```

A few notes on this JSON:

- Under `"retrievers"` for RRF, we defined two child retrievers: one lexical (`multi_match` on content and title) and one semantic (using ELSER via the `sparse_vector` query) as discussed above.
- We used `".elser_model_1"` as the ELSER model ID (this is the default ID for Elastic’s built-in ELSER v2 model in many setups – ensure it matches the model you have deployed; on Serverless it should be available by default).
- We set both RRF and the reranker to consider the top 50 docs. RRF’s `"rank_window_size": 50` means it will pull up to 50 results from each sub-retriever before fusion [oai_citation:16‡elastic.co](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch#:~:text=The%20RRF%20ranking%20formula%20can,retriever%20section%2C%20as%20shown%20below). The reranker’s `"rank_window_size": 50` means it will rerank the top 50 after fusion. We then ask for 10 results (`"size": 10` at the end) which will be the 10 highest-scoring after reranking.
- The `inference_id` for the reranker is set to the built-in model. On first use, Elasticsearch Serverless will allocate the model if not already loaded (this may add a bit of initial latency, as the model is downloaded/deployed automatically [oai_citation:17‡medium.com](https://medium.com/tech-learnings/optimizing-search-results-with-elasticsearch-semantic-reranking-cc280240de86#:~:text=The%20script%20below%20sets%20up,has%20not%20been%20deployed%20already)). Subsequent queries will use the warmed-up model.
- We included `"min_score": 0.0` just as a placeholder – effectively not filtering anything. You could raise this if you want to drop low-confidence hits (for example, set `min_score` to some positive value if you notice the model giving a lot of near-zero scores to irrelevant docs).

## Does Reranking Supplement or Replace RRF Ranking?

The reranking stage acts as a **second-phase ranker** that reorders the candidate list produced by RRF. In practice, this means the cross-encoder’s scores _determine the final ordering_. The RRF’s role is to _provide a diversified candidate set_. Once those candidates are scored by the `.rerank-v1` model, the original RRF ranks are no longer used for sorting (they’re essentially overridden by the reranker’s semantic relevance scores).

In that sense, reranking _replaces_ the RRF-based ranking for the final output. However, it **supplements** the overall retrieval process by adding a layer of semantic understanding on top of RRF. RRF ensures that both keyword-relevant and semantically-relevant documents make it into the top-k pool, and then the reranker refines this pool. Elastic’s documentation describes semantic reranking as _“a refinement layer on top of hybrid retrieval with RRF”_ [oai_citation:18‡elastic.co](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking#:~:text=,General%20applications) – the reranker picks the truly best answers from the mix that RRF provided.

**Best practices:**

- **Use RRF for recall, reranker for precision:** Let RRF gather a broad set of relevant documents (improving recall by including different relevance signals), then trust the reranker to sort them for precision. The cross-encoder model is much better at fine-grained relevance comparisons, but it’s too slow to run on every document in your index. RRF (with BM25 and ELSER) serves as a fast first-pass filter.
- **Tuning RRF for the reranker:** You can adjust RRF parameters (like weights or `rank_constant`) to influence which documents get into the candidate set. For example, if you find the reranker is missing out on some highly keyword-relevant docs, you might increase the weight of the BM25 retriever in RRF. Conversely, if semantic matches aren’t surfacing, boost the ELSER retriever. Ultimately, the final ranking is by the model, but it can only rerank what it receives as input.
- **Final scoring:** Note that the reranker’s scores are on a different scale than the raw BM25 or vector scores. Elasticsearch normalizes the rerank scores (to avoid negatives) and uses them to sort [oai_citation:19‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=Important). There is no blending of the RRF score with the rerank score – the model’s output is authoritative for ordering the `rank_window_size` docs. Any documents beyond the rank window simply retain their RRF ordering if, for example, you set a larger `size` than `rank_window_size` (though in typical usage, `rank_window_size` ≥ `size`).
- **Filtering by score:** If you set a `min_score` in the reranker, those below threshold are dropped entirely. This can effectively _supplement_ RRF by removing items that RRF thought were relevant but the model found to be off-topic. The final result set will then contain fewer than `size` hits if many were filtered out.

In summary, **RRF + rerank** is a two-stage pipeline: RRF merges results to ensure good recall, and the cross-encoder then re-ranks those results for optimal precision. The final ranking is solely determined by the reranker, but the reranker’s effectiveness depends on the candidate quality provided by the RRF stage.

## Example: JSON Query vs TypeScript SDK Usage

It’s helpful to see how the above configuration looks in a raw JSON query and then how to implement it using the Elastic JavaScript/TypeScript client.

**JSON query format:** The earlier section already provided a full JSON example. In summary, your search request JSON will have the `retriever` section as shown, and you can send that via any client or `curl`. For instance:

```json
POST /my-index/_search
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          "retrievers": [
            ... BM25 and ELSER retriever definitions ...
          ]
        }
      },
      "field": "<DOC_TEXT_FIELD>",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "<QUERY_TEXT>",
      "rank_window_size": 100
    }
  },
  "size": 10
}
```

Replace `<DOC_TEXT_FIELD>` with your document’s text field name, and `<QUERY_TEXT>` with the user query string. This JSON will retrieve results using RRF and then rerank them with the Elastic Rerank model before returning the top 10.

**TypeScript SDK (v9.2.0) example:** Using the official Elastic client in Node.js/TypeScript, you can construct the equivalent search call. Below is a simplified example:

```ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'https://<your-deployment-url>' });

async function searchDocuments(query: string) {
  const response = await client.search({
    index: 'my-index',
    body: {
      retriever: {
        text_similarity_reranker: {
          retriever: {
            rrf: {
              retrievers: [
                {
                  // Lexical retriever (BM25)
                  standard: {
                    query: {
                      match: { content: query },
                    },
                  },
                },
                {
                  // Semantic retriever (ELSER)
                  standard: {
                    query: {
                      sparse_vector: {
                        field: 'content_embedding',
                        inference_id: '.elser_model_1',
                        query: query,
                      },
                    },
                  },
                },
              ],
              rank_constant: 60,
              rank_window_size: 50,
            },
          },
          field: 'content',
          inference_id: '.rerank-v1-elasticsearch',
          inference_text: query,
          rank_window_size: 50,
          min_score: 0.1,
        },
      },
      size: 10,
    },
  });

  const hits = response.hits.hits;
  console.log(hits.map((h) => h._source.title));
}
```

A few notes on this code:

- We use the same structure as the JSON, but in JS object form. The keys like `text_similarity_reranker` and `sparse_vector` can be used directly in the request body object. (If your client version’s type definitions don’t include the latest retriever options, you may need to cast to `any` for the body, but the request will still work against a supported Elasticsearch cluster.)
- The `inference_id` for ELSER and reranker are set to the built-in model IDs. Ensure these IDs match what’s available in your deployment. In Elastic Cloud or Serverless, `".elser_model_1"` and `".rerank-v1-elasticsearch"` are the default IDs for the ELSER v2 model and the Elastic Rerank model, respectively [oai_citation:20‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,) [oai_citation:21‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=To%20use%20,similarity%20models%20supported%20by%20Elasticsearch).
- We log the titles of the returned hits as a demonstration. The search response will contain the documents re-ordered by the rerank model.

This TypeScript snippet uses version 9.2.0 of the client, which corresponds to Elasticsearch 8.x. Retrievers and rerankers became GA in 8.16 [oai_citation:22‡elastic.co](https://www.elastic.co/search-labs/blog/elasticsearch-retrievers-ga-8-16-0#:~:text=talked%20about%20them%20in%20previous,discuss%20the%20newly%20available%20capabilities) [oai_citation:23‡elastic.co](https://www.elastic.co/search-labs/blog/elasticsearch-retrievers-ga-8-16-0#:~:text=%2A%20%60knn%60%20,type%20%2016%20endpoint), so ensure your Elasticsearch Serverless deployment is up-to-date (Serverless always runs a recent version). If you encounter any unknown key errors in older client versions, consider upgrading the client or using the `any` type for the request body as a workaround.

## Important Notes and Caveats for Using `.rerank-v1`

- **Model capabilities:** The Elastic Rerank model is a **cross-encoder** that currently supports English only and is specialized for relevance reranking. It was built on a DeBERTa v3 architecture and distilled for efficiency [oai_citation:24‡elastic.co](https://www.elastic.co/search-labs/blog/elastic-rerank-model-introduction#:~:text=Performant%20and%20efficient%3A%20The%20Elastic,on%20question%20answering%20data%20sets). Cross-encoders examine the query and document together, which yields very accurate relevance judgments but is computationally expensive [oai_citation:25‡elastic.co](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking#:~:text=document%20texts%2C%20it%20can%20better,take%20word%20order%20into%20account). Expect the reranker to significantly improve result quality for natural language queries or long-tail queries where BM25 might fail, by understanding context and semantics beyond keyword overlap.

- **Latency and performance:** Because the reranker model must encode the query _and_ each document’s text together, it adds extra latency to searches. **Each document in the rank window triggers a model inference**. By default, the model’s maximum input length is 512 tokens (see below), and it uses a few hundred million parameters – so scoring, say, 50 documents will be slower than a typical BM25 query. Elastic’s documentation notes that cross-encoders are more resource-intensive and have higher latency [oai_citation:26‡elastic.co](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking#:~:text=document%20texts%2C%20it%20can%20better,take%20word%20order%20into%20account). In practice, you should measure how large you can set `rank_window_size` while keeping acceptable response times. A smaller window (e.g. 50) might take tens or hundreds of milliseconds of extra time; a very large window (hundreds of docs) could take substantially longer or exhaust the model’s throughput. On Serverless, the system may scale out model allocations to handle load (the default adaptive allocation allows up to 10 parallel allocations of the model) [oai_citation:27‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=,10), but you still pay in terms of overall compute usage. It’s wise to start with a modest candidate set and increase only if needed for relevance.

- **Inference limits (token length):** The `.rerank-v1` model has a **maximum context window of 512 tokens** for the combined input of query + document [oai_citation:28‡elastic.co](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-rerank#:~:text=,512%20tokens). This means if a document’s content is very large, the model cannot consider beyond a certain length. Elasticsearch will handle this by truncating the text (and possibly the query, if the query is also long) to fit the model’s input size. It uses a “balanced truncation” strategy: if both query and doc are long, it will truncate both so that important terms from each are retained [oai_citation:29‡elastic.co](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-rerank#:~:text=text%20exceeds%20512%20tokens%2C%20the,access%20to%20the%20full%20content) (roughly, it might keep ~255 tokens of each, for example). As a user, you should be aware that extremely long documents might not be fully read by the model. **Tip:** If you have long texts, consider indexing them with the `semantic_text` field type which automatically chunks text into segments (by default ~250 words ≈ 400 tokens per chunk) [oai_citation:30‡elastic.co](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-rerank#:~:text=,512%20tokens). The reranker will then evaluate each chunk separately and can effectively handle long documents by scoring their pieces.

- **Document field requirements:** The reranker needs access to the raw text of the document field you specify (in our examples, `content`). Make sure this field is stored in `_source` (or as stored field) and is not overly analyzed or altered in a way that loses the original text content. Typically, a standard `text` field in Elasticsearch is fine – the model will use the original text. If you used a custom analyzer that strips or replaces certain characters, be mindful that the model sees exactly what’s in the field. Also, only one field can be specified in the `field` parameter of the reranker. If your relevant content is split across multiple fields (say `title` and `body`), you may need to concatenate them into one field for the model, or choose the most important field. Another approach is to run two separate reranker queries (one per field) or use a combined field. But out of the box, `text_similarity_reranker` expects a single field name.

- **ELSER integration:** Using ELSER for semantic retrieval comes with its own limitations. Notably, the ELSER model also has a limit of about **512 tokens for inference** when generating sparse vectors [oai_citation:31‡elastic.co](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch#:~:text=The%20main%20limitation%20to%20be,type%2C%20which%20handles%20automatic%20chunking). If your documents are longer than that, the ELSER embeddings (and the query expansion) won’t capture beyond the first 512 tokens of text. The same advice of splitting into chunks (or using `semantic_text` field type) applies. Ensure you have the ELSER model deployed (Serverless should have the latest ELSER available; typically the model ID is `.elser_model_1` as used above). If you haven’t pre-indexed vectors, you can perform query-time embedding using the `sparse_vector` query with an `inference_id` as shown – this will temporarily run the ELSER model on the query. This is convenient but adds some overhead; for better performance on frequent queries, pre-compute embeddings at index time via an ingest pipeline.

- **Resource and scaling considerations on Serverless:** In Elasticsearch Serverless, you do not directly manage ML nodes or model deployments – the platform handles it. The built-in models like ELSER and Rerank will be loaded as needed. However, they still consume memory and CPU cycles from your resource capacity. For example, Elastic’s guidance for self-managed clusters is that the rerank model plus ELSER would require at least an 8 GB ML node to run comfortably [oai_citation:32‡elastic.co](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-rerank#:~:text=Deploying%20the%20Elastic%20Rerank%20model,defaults%20to%201GB). On Serverless, the infrastructure will allocate appropriate resources, but if your usage is heavy (e.g. many concurrent rerank queries or very high `rank_window_size`), you might approach the limits of your chosen capacity unit. Monitor your search latency and throughput. The adaptive scaling (multiple allocations) [oai_citation:33‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%22model_id%22%3A%20%22.rerank,10%20%7D%20%7D) [oai_citation:34‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=,10) can help maintain performance by running several model copies in parallel – this is generally automatic on Serverless when needed.

- **Cold start latency:** The first time you use `.rerank-v1` or `.elser_model_1` in your Serverless deployment, the model might not be immediately available. Elasticsearch will lazily load the model (download and initialize it) upon the initial request [oai_citation:35‡medium.com](https://medium.com/tech-learnings/optimizing-search-results-with-elasticsearch-semantic-reranking-cc280240de86#:~:text=The%20script%20below%20sets%20up,has%20not%20been%20deployed%20already). This can add a one-time delay (potentially a few seconds). After that, the model stays in memory, and subsequent searches will be faster. If your application has tight latency requirements, you may want to “warm up” the search by running a test query after deploying, to ensure the model is loaded before real user traffic hits it.

- **Quality tuning:** The out-of-the-box `.rerank-v1` model is designed to improve relevance on a wide range of text search tasks. In Elastic’s internal testing it boosted NDCG@10 by significant margins over baseline BM25 [oai_citation:36‡elastic.co](https://www.elastic.co/search-labs/blog/elastic-rerank-model-introduction#:~:text=Performant%20and%20efficient%3A%20The%20Elastic,on%20question%20answering%20data%20sets). That said, no model is perfect. Keep an eye on the results. You might find cases where the reranker over-emphasizes some aspect (for instance, it might prefer longer documents since they have more overlapping content with the query). If needed, you can experiment with alternative models (Elastic supports plugging in third-party cross-encoders via the inference API [oai_citation:37‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=To%20use%20,similarity%20models%20supported%20by%20Elasticsearch)). But for most cases, `.rerank-v1` is a good starting point that requires no training and no schema changes.

- **Usage limits:** As of now (late 2025), `.rerank-v1` is available in Technical Preview or early GA. This implies you should keep your Elastic stack up-to-date to benefit from improvements and bug fixes. Also note that it only supports the `rerank` task for text similarity – you wouldn’t use this model for other NLP tasks. There may be some limitations on how many models you can deploy in parallel on Serverless (usually the platform manages it, but for example if you tried to use multiple large models concurrently, you could hit capacity limits).

In conclusion, **Elasticsearch Serverless with hybrid search and the Elastic Rerank model** allows you to achieve a powerful two-stage retrieval pipeline: fast lexical and semantic retrieval for breadth, followed by deep semantic re-ranking for accuracy. By following the configuration above [oai_citation:38‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever#:~:text=,) [oai_citation:39‡elastic.co](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever#:~:text=%7D%2C%20%22field%22%3A%20%22text%22%2C%20%22inference_id%22%3A%20%22my,0.5) and minding the caveats (token limits, latency, field setup), you can significantly improve search relevance with minimal changes to your indexing and without needing to train custom models. This setup leverages Elastic’s built-in capabilities — making advanced AI reranking as simple as a few lines in your query DSL.
