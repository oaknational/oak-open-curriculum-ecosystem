[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / OAK\_SEQUENCES\_MAPPING

# Variable: OAK\_SEQUENCES\_MAPPING

> `const` **OAK\_SEQUENCES\_MAPPING**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/es-mappings/oak-sequences.ts:14

Elasticsearch mapping for the oak_sequences index.

Contains programme sequence documents for navigation and search.

## Type Declaration

### mappings

> `readonly` **mappings**: `object`

#### mappings.dynamic

> `readonly` **dynamic**: `"strict"` = `'strict'`

#### mappings.properties

> `readonly` **properties**: `object`

#### mappings.properties.category\_titles

> `readonly` **category\_titles**: `object`

#### mappings.properties.category\_titles.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.category\_titles.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.category\_titles.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.doc\_type

> `readonly` **doc\_type**: `object`

#### mappings.properties.doc\_type.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.doc\_type.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.key\_stages

> `readonly` **key\_stages**: `object`

#### mappings.properties.key\_stages.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.key\_stages.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.phase\_slug

> `readonly` **phase\_slug**: `object`

#### mappings.properties.phase\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.phase\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.phase\_title

> `readonly` **phase\_title**: `object`

#### mappings.properties.phase\_title.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.phase\_title.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_id

> `readonly` **sequence\_id**: `object`

#### mappings.properties.sequence\_id.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_id.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_semantic

> `readonly` **sequence\_semantic**: `object`

#### mappings.properties.sequence\_semantic.type

> `readonly` **type**: `"semantic_text"` = `'semantic_text'`

#### mappings.properties.sequence\_slug

> `readonly` **sequence\_slug**: `object`

#### mappings.properties.sequence\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_title

> `readonly` **sequence\_title**: `object`

#### mappings.properties.sequence\_title.analyzer

> `readonly` **analyzer**: `"oak_text_index"` = `'oak_text_index'`

#### mappings.properties.sequence\_title.fields

> `readonly` **fields**: `object`

#### mappings.properties.sequence\_title.fields.keyword

> `readonly` **keyword**: `object`

#### mappings.properties.sequence\_title.fields.keyword.ignore\_above

> `readonly` **ignore\_above**: `256` = `256`

#### mappings.properties.sequence\_title.fields.keyword.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_title.fields.keyword.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_title.fields.sa

> `readonly` **sa**: `object`

#### mappings.properties.sequence\_title.fields.sa.type

> `readonly` **type**: `"search_as_you_type"` = `'search_as_you_type'`

#### mappings.properties.sequence\_title.search\_analyzer

> `readonly` **search\_analyzer**: `"oak_text_search"` = `'oak_text_search'`

#### mappings.properties.sequence\_title.type

> `readonly` **type**: `"text"` = `'text'`

#### mappings.properties.sequence\_url

> `readonly` **sequence\_url**: `object`

#### mappings.properties.sequence\_url.ignore\_above

> `readonly` **ignore\_above**: `1024` = `1024`

#### mappings.properties.sequence\_url.type

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

#### mappings.properties.title\_suggest

> `readonly` **title\_suggest**: `object`

#### mappings.properties.title\_suggest.contexts

> `readonly` **contexts**: readonly \[\{ `name`: `"subject"`; `type`: `"category"`; \}, \{ `name`: `"phase"`; `type`: `"category"`; \}\]

#### mappings.properties.title\_suggest.type

> `readonly` **type**: `"completion"` = `'completion'`

#### mappings.properties.unit\_slugs

> `readonly` **unit\_slugs**: `object`

#### mappings.properties.unit\_slugs.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_slugs.type

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
