[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / OAK\_LESSONS\_MAPPING

# Variable: OAK\_LESSONS\_MAPPING

> `const` **OAK\_LESSONS\_MAPPING**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/oak-lessons.ts:14](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/oak-lessons.ts#L14)

Elasticsearch mapping for the oak_lessons index.

Contains lesson documents with semantic embeddings for hybrid search.

## Type Declaration

### mappings

> `readonly` **mappings**: `object`

#### mappings.dynamic

> `readonly` **dynamic**: `"strict"` = `'strict'`

#### mappings.properties

> `readonly` **properties**: `object`

#### mappings.properties.content\_guidance

> `readonly` **content\_guidance**: `object`

#### mappings.properties.content\_guidance.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.content\_guidance.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.content\_guidance.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.doc\_type

> `readonly` **doc\_type**: `object`

#### mappings.properties.doc\_type.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.doc\_type.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.downloads\_available

> `readonly` **downloads\_available**: `object`

#### mappings.properties.downloads\_available.type

> `readonly` **type**: `"boolean"` = `'boolean'`

#### mappings.properties.exam\_board\_titles

> `readonly` **exam\_board\_titles**: `object`

#### mappings.properties.exam\_board\_titles.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.exam\_board\_titles.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.exam\_boards

> `readonly` **exam\_boards**: `object`

#### mappings.properties.exam\_boards.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.exam\_boards.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.exam\_subject\_titles

> `readonly` **exam\_subject\_titles**: `object`

#### mappings.properties.exam\_subject\_titles.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.exam\_subject\_titles.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.exam\_subjects

> `readonly` **exam\_subjects**: `object`

#### mappings.properties.exam\_subjects.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.exam\_subjects.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.has\_transcript

> `readonly` **has\_transcript**: `object`

#### mappings.properties.has\_transcript.type

> `readonly` **type**: `"boolean"` = `'boolean'`

#### mappings.properties.key\_learning\_points

> `readonly` **key\_learning\_points**: `object`

#### mappings.properties.key\_learning\_points.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.key\_learning\_points.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.key\_learning\_points.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.key\_stage

> `readonly` **key\_stage**: `object`

#### mappings.properties.key\_stage.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.key\_stage.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.key\_stage\_title

> `readonly` **key\_stage\_title**: `object`

#### mappings.properties.key\_stage\_title.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.key\_stage\_title.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.ks4\_option\_titles

> `readonly` **ks4\_option\_titles**: `object`

#### mappings.properties.ks4\_option\_titles.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.ks4\_option\_titles.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.ks4\_options

> `readonly` **ks4\_options**: `object`

#### mappings.properties.ks4\_options.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.ks4\_options.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.lesson\_content

> `readonly` **lesson\_content**: `object`

#### mappings.properties.lesson\_content.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.lesson\_content.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.lesson\_content.term\_vector

> `readonly` **term\_vector**: `"with_positions_offsets"` = `'with_positions_offsets'`

#### mappings.properties.lesson\_content.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.lesson\_content\_semantic

> `readonly` **lesson\_content\_semantic**: `object`

#### mappings.properties.lesson\_content\_semantic.type

> `readonly` **type**: `"semantic_text"` = `'semantic_text'`

#### mappings.properties.lesson\_id

> `readonly` **lesson\_id**: `object`

#### mappings.properties.lesson\_id.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.lesson\_id.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.lesson\_keywords

> `readonly` **lesson\_keywords**: `object`

#### mappings.properties.lesson\_keywords.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.lesson\_keywords.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.lesson\_keywords.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.lesson\_slug

> `readonly` **lesson\_slug**: `object`

#### mappings.properties.lesson\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.lesson\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.lesson\_structure

> `readonly` **lesson\_structure**: `object`

#### mappings.properties.lesson\_structure.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.lesson\_structure.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.lesson\_structure.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.lesson\_structure\_semantic

> `readonly` **lesson\_structure\_semantic**: `object`

#### mappings.properties.lesson\_structure\_semantic.type

> `readonly` **type**: `"semantic_text"` = `'semantic_text'`

#### mappings.properties.lesson\_title

> `readonly` **lesson\_title**: `object`

#### mappings.properties.lesson\_title.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.lesson\_title.fields

> `readonly` **fields**: `object`

#### mappings.properties.lesson\_title.fields.keyword

> `readonly` **keyword**: `object`

#### mappings.properties.lesson\_title.fields.keyword.ignore\_above

> `readonly` **ignore\_above**: `256` = `256`

#### mappings.properties.lesson\_title.fields.keyword.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.lesson\_title.fields.keyword.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.lesson\_title.fields.sa

> `readonly` **sa**: `object`

#### mappings.properties.lesson\_title.fields.sa.type

> `readonly` **type**: `"search_as_you_type"` = `'search_as_you_type'`

#### mappings.properties.lesson\_title.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.lesson\_title.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.lesson\_url

> `readonly` **lesson\_url**: `object`

#### mappings.properties.lesson\_url.ignore\_above

> `readonly` **ignore\_above**: `1024` = `1024`

#### mappings.properties.lesson\_url.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.misconceptions\_and\_common\_mistakes

> `readonly` **misconceptions\_and\_common\_mistakes**: `object`

#### mappings.properties.misconceptions\_and\_common\_mistakes.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.misconceptions\_and\_common\_mistakes.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.misconceptions\_and\_common\_mistakes.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.phase\_slug

> `readonly` **phase\_slug**: `object`

#### mappings.properties.phase\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.phase\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.pupil\_lesson\_outcome

> `readonly` **pupil\_lesson\_outcome**: `object`

#### mappings.properties.pupil\_lesson\_outcome.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.pupil\_lesson\_outcome.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_parent

> `readonly` **subject\_parent**: `object`

#### mappings.properties.subject\_parent.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.subject\_parent.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_slug

> `readonly` **subject\_slug**: `object`

#### mappings.properties.subject\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.subject\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_title

> `readonly` **subject\_title**: `object`

#### mappings.properties.subject\_title.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.subject\_title.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.supervision\_level

> `readonly` **supervision\_level**: `object`

#### mappings.properties.supervision\_level.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.supervision\_level.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.teacher\_tips

> `readonly` **teacher\_tips**: `object`

#### mappings.properties.teacher\_tips.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.teacher\_tips.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.teacher\_tips.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.thread\_slugs

> `readonly` **thread\_slugs**: `object`

#### mappings.properties.thread\_slugs.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.thread\_slugs.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.thread\_titles

> `readonly` **thread\_titles**: `object`

#### mappings.properties.thread\_titles.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.thread\_titles.fields

> `readonly` **fields**: `object`

#### mappings.properties.thread\_titles.fields.keyword

> `readonly` **keyword**: `object`

#### mappings.properties.thread\_titles.fields.keyword.ignore\_above

> `readonly` **ignore\_above**: `256` = `256`

#### mappings.properties.thread\_titles.fields.keyword.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.thread\_titles.fields.keyword.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.thread\_titles.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.thread\_titles.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.tier\_titles

> `readonly` **tier\_titles**: `object`

#### mappings.properties.tier\_titles.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.tier\_titles.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.tiers

> `readonly` **tiers**: `object`

#### mappings.properties.tiers.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.tiers.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.title\_suggest

> `readonly` **title\_suggest**: `object`

#### mappings.properties.title\_suggest.contexts

> `readonly` **contexts**: readonly \[\{ `name`: `"subject"`; `type`: `"category"`; \}, \{ `name`: `"key_stage"`; `type`: `"category"`; \}\]

#### mappings.properties.title\_suggest.type

> `readonly` **type**: `"completion"` = `'completion'`

#### mappings.properties.unit\_count

> `readonly` **unit\_count**: `object`

#### mappings.properties.unit\_count.type

> `readonly` **type**: `"integer"` = `'integer'`

#### mappings.properties.unit\_ids

> `readonly` **unit\_ids**: `object`

#### mappings.properties.unit\_ids.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_ids.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_titles

> `readonly` **unit\_titles**: `object`

#### mappings.properties.unit\_titles.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.unit\_titles.fields

> `readonly` **fields**: `object`

#### mappings.properties.unit\_titles.fields.keyword

> `readonly` **keyword**: `object`

#### mappings.properties.unit\_titles.fields.keyword.ignore\_above

> `readonly` **ignore\_above**: `256` = `256`

#### mappings.properties.unit\_titles.fields.keyword.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_titles.fields.keyword.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_titles.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.unit\_titles.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.unit\_urls

> `readonly` **unit\_urls**: `object`

#### mappings.properties.unit\_urls.ignore\_above

> `readonly` **ignore\_above**: `1024` = `1024`

#### mappings.properties.unit\_urls.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.years

> `readonly` **years**: `object`

#### mappings.properties.years.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.years.type

> `readonly` **type**: `"keyword"` = `'keyword'`

### settings

> `readonly` **settings**: `object`

#### settings.analysis

> `readonly` **analysis**: `object`

#### settings.analysis.analyzer

> `readonly` **analyzer**: `object`

#### settings.analysis.analyzer.oak\_text\_index

> `readonly` **oak\_text\_index**: `object`

#### settings.analysis.analyzer.oak\_text\_index.filter

> `readonly` **filter**: readonly \[`"lowercase"`\]

#### settings.analysis.analyzer.oak\_text\_index.tokenizer

> `readonly` **tokenizer**: `"standard"` = `'standard'`

#### settings.analysis.analyzer.oak\_text\_index.type

> `readonly` **type**: `"custom"` = `'custom'`

#### settings.analysis.analyzer.oak\_text\_search

> `readonly` **oak\_text\_search**: `object`

#### settings.analysis.analyzer.oak\_text\_search.filter

> `readonly` **filter**: readonly \[`"lowercase"`, `"oak_syns_filter"`\]

#### settings.analysis.analyzer.oak\_text\_search.tokenizer

> `readonly` **tokenizer**: `"standard"` = `'standard'`

#### settings.analysis.analyzer.oak\_text\_search.type

> `readonly` **type**: `"custom"` = `'custom'`

#### settings.analysis.filter

> `readonly` **filter**: `object`

#### settings.analysis.filter.oak\_syns\_filter

> `readonly` **oak\_syns\_filter**: `object`

#### settings.analysis.filter.oak\_syns\_filter.synonyms\_set

> `readonly` **synonyms\_set**: `"oak-syns"` = `'oak-syns'`

#### settings.analysis.filter.oak\_syns\_filter.type

> `readonly` **type**: `"synonym_graph"` = `'synonym_graph'`

#### settings.analysis.filter.oak\_syns\_filter.updateable

> `readonly` **updateable**: `true` = `true`

#### settings.analysis.normalizer

> `readonly` **normalizer**: `object`

#### settings.analysis.normalizer.oak\_lower

> `readonly` **oak\_lower**: `object`

#### settings.analysis.normalizer.oak\_lower.filter

> `readonly` **filter**: readonly \[`"lowercase"`, `"asciifolding"`\]

#### settings.analysis.normalizer.oak\_lower.type

> `readonly` **type**: `"custom"` = `'custom'`
