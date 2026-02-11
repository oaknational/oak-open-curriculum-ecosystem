[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / OAK\_UNIT\_ROLLUP\_MAPPING

# Variable: OAK\_UNIT\_ROLLUP\_MAPPING

> `const` **OAK\_UNIT\_ROLLUP\_MAPPING**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/es-mappings/oak-unit-rollup.ts:14

Elasticsearch mapping for the oak_unit_rollup index.

Contains aggregated unit content for semantic search across lessons.

## Type Declaration

### mappings

> `readonly` **mappings**: `object`

#### mappings.dynamic

> `readonly` **dynamic**: `"strict"` = `'strict'`

#### mappings.properties

> `readonly` **properties**: `object`

#### mappings.properties.categories

> `readonly` **categories**: `object`

#### mappings.properties.categories.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.categories.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.description

> `readonly` **description**: `object`

#### mappings.properties.description.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.description.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.doc\_type

> `readonly` **doc\_type**: `object`

#### mappings.properties.doc\_type.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.doc\_type.type

> `readonly` **type**: `"keyword"` = `'keyword'`

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

#### mappings.properties.lesson\_count

> `readonly` **lesson\_count**: `object`

#### mappings.properties.lesson\_count.type

> `readonly` **type**: `"integer"` = `'integer'`

#### mappings.properties.lesson\_ids

> `readonly` **lesson\_ids**: `object`

#### mappings.properties.lesson\_ids.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.lesson\_ids.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.national\_curriculum\_content

> `readonly` **national\_curriculum\_content**: `object`

#### mappings.properties.national\_curriculum\_content.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.national\_curriculum\_content.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.phase\_slug

> `readonly` **phase\_slug**: `object`

#### mappings.properties.phase\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.phase\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.prior\_knowledge\_requirements

> `readonly` **prior\_knowledge\_requirements**: `object`

#### mappings.properties.prior\_knowledge\_requirements.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.prior\_knowledge\_requirements.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_ids

> `readonly` **sequence\_ids**: `object`

#### mappings.properties.sequence\_ids.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_ids.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_parent

> `readonly` **subject\_parent**: `object`

#### mappings.properties.subject\_parent.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.subject\_parent.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_programmes\_url

> `readonly` **subject\_programmes\_url**: `object`

#### mappings.properties.subject\_programmes\_url.ignore\_above

> `readonly` **ignore\_above**: `1024` = `1024`

#### mappings.properties.subject\_programmes\_url.type

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

#### mappings.properties.thread\_orders

> `readonly` **thread\_orders**: `object`

#### mappings.properties.thread\_orders.type

> `readonly` **type**: `"integer"` = `'integer'`

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

> `readonly` **contexts**: readonly \[\{ `name`: `"subject"`; `type`: `"category"`; \}, \{ `name`: `"key_stage"`; `type`: `"category"`; \}, \{ `name`: `"sequence"`; `type`: `"category"`; \}\]

#### mappings.properties.title\_suggest.type

> `readonly` **type**: `"completion"` = `'completion'`

#### mappings.properties.unit\_content

> `readonly` **unit\_content**: `object`

#### mappings.properties.unit\_content.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.unit\_content.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.unit\_content.term\_vector

> `readonly` **term\_vector**: `"with_positions_offsets"` = `'with_positions_offsets'`

#### mappings.properties.unit\_content.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.unit\_content\_semantic

> `readonly` **unit\_content\_semantic**: `object`

#### mappings.properties.unit\_content\_semantic.type

> `readonly` **type**: `"semantic_text"` = `'semantic_text'`

#### mappings.properties.unit\_id

> `readonly` **unit\_id**: `object`

#### mappings.properties.unit\_id.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_id.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_slug

> `readonly` **unit\_slug**: `object`

#### mappings.properties.unit\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_structure

> `readonly` **unit\_structure**: `object`

#### mappings.properties.unit\_structure.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.unit\_structure.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.unit\_structure.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.unit\_structure\_semantic

> `readonly` **unit\_structure\_semantic**: `object`

#### mappings.properties.unit\_structure\_semantic.type

> `readonly` **type**: `"semantic_text"` = `'semantic_text'`

#### mappings.properties.unit\_title

> `readonly` **unit\_title**: `object`

#### mappings.properties.unit\_title.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.unit\_title.fields

> `readonly` **fields**: `object`

#### mappings.properties.unit\_title.fields.keyword

> `readonly` **keyword**: `object`

#### mappings.properties.unit\_title.fields.keyword.ignore\_above

> `readonly` **ignore\_above**: `256` = `256`

#### mappings.properties.unit\_title.fields.keyword.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_title.fields.keyword.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_title.fields.sa

> `readonly` **sa**: `object`

#### mappings.properties.unit\_title.fields.sa.type

> `readonly` **type**: `"search_as_you_type"` = `'search_as_you_type'`

#### mappings.properties.unit\_title.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.unit\_title.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.unit\_topics

> `readonly` **unit\_topics**: `object`

#### mappings.properties.unit\_topics.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.unit\_topics.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.unit\_topics.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.unit\_url

> `readonly` **unit\_url**: `object`

#### mappings.properties.unit\_url.ignore\_above

> `readonly` **ignore\_above**: `1024` = `1024`

#### mappings.properties.unit\_url.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.why\_this\_why\_now

> `readonly` **why\_this\_why\_now**: `object`

#### mappings.properties.why\_this\_why\_now.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.why\_this\_why\_now.type

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
