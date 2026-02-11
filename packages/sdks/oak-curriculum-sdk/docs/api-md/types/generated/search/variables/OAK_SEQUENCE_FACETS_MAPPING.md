[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / OAK\_SEQUENCE\_FACETS\_MAPPING

# Variable: OAK\_SEQUENCE\_FACETS\_MAPPING

> `const` **OAK\_SEQUENCE\_FACETS\_MAPPING**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/es-mappings/oak-sequence-facets.ts:15

Elasticsearch mapping for the oak_sequence_facets index.

Contains sequence facet data for navigation and filtering.
Generated from SEQUENCE_FACETS_INDEX_FIELDS at type-gen time.

## Type Declaration

### mappings

> `readonly` **mappings**: `object`

#### mappings.dynamic

> `readonly` **dynamic**: `"strict"` = `'strict'`

#### mappings.properties

> `readonly` **properties**: `object`

#### mappings.properties.has\_ks4\_options

> `readonly` **has\_ks4\_options**: `object`

#### mappings.properties.has\_ks4\_options.type

> `readonly` **type**: `"boolean"` = `'boolean'`

#### mappings.properties.key\_stage\_title

> `readonly` **key\_stage\_title**: `object`

#### mappings.properties.key\_stage\_title.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.key\_stage\_title.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.key\_stages

> `readonly` **key\_stages**: `object`

#### mappings.properties.key\_stages.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.key\_stages.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.lesson\_count

> `readonly` **lesson\_count**: `object`

#### mappings.properties.lesson\_count.type

> `readonly` **type**: `"integer"` = `'integer'`

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

#### mappings.properties.sequence\_canonical\_url

> `readonly` **sequence\_canonical\_url**: `object`

#### mappings.properties.sequence\_canonical\_url.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_canonical\_url.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.sequence\_slug

> `readonly` **sequence\_slug**: `object`

#### mappings.properties.sequence\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.sequence\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subject\_slug

> `readonly` **subject\_slug**: `object`

#### mappings.properties.subject\_slug.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.subject\_slug.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_count

> `readonly` **unit\_count**: `object`

#### mappings.properties.unit\_count.type

> `readonly` **type**: `"integer"` = `'integer'`

#### mappings.properties.unit\_slugs

> `readonly` **unit\_slugs**: `object`

#### mappings.properties.unit\_slugs.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_slugs.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.unit\_titles

> `readonly` **unit\_titles**: `object`

#### mappings.properties.unit\_titles.normalizer

> `readonly` **normalizer**: `"oak_lower"` = `'oak_lower'`

#### mappings.properties.unit\_titles.type

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

#### settings.analysis.normalizer

> `readonly` **normalizer**: `object`

#### settings.analysis.normalizer.oak\_lower

> `readonly` **oak\_lower**: `object`

#### settings.analysis.normalizer.oak\_lower.filter

> `readonly` **filter**: readonly \[`"lowercase"`, `"asciifolding"`\]

#### settings.analysis.normalizer.oak\_lower.type

> `readonly` **type**: `"custom"` = `'custom'`
