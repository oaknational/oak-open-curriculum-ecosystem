[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / OAK\_META\_MAPPING

# Variable: OAK\_META\_MAPPING

> `const` **OAK\_META\_MAPPING**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/es-mappings/oak-meta.ts:14

Elasticsearch mapping for the oak_meta index.

Contains ingestion metadata and version tracking.

## Type Declaration

### mappings

> `readonly` **mappings**: `object`

#### mappings.dynamic

> `readonly` **dynamic**: `"strict"` = `'strict'`

#### mappings.properties

> `readonly` **properties**: `object`

#### mappings.properties.doc\_counts

> `readonly` **doc\_counts**: `object`

#### mappings.properties.doc\_counts.enabled

> `readonly` **enabled**: `false` = `false`

#### mappings.properties.doc\_counts.type

> `readonly` **type**: `"object"` = `'object'`

#### mappings.properties.duration\_ms

> `readonly` **duration\_ms**: `object`

#### mappings.properties.duration\_ms.type

> `readonly` **type**: `"integer"` = `'integer'`

#### mappings.properties.ingested\_at

> `readonly` **ingested\_at**: `object`

#### mappings.properties.ingested\_at.type

> `readonly` **type**: `"date"` = `'date'`

#### mappings.properties.key\_stages

> `readonly` **key\_stages**: `object`

#### mappings.properties.key\_stages.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.subjects

> `readonly` **subjects**: `object`

#### mappings.properties.subjects.type

> `readonly` **type**: `"keyword"` = `'keyword'`

#### mappings.properties.version

> `readonly` **version**: `object`

#### mappings.properties.version.type

> `readonly` **type**: `"keyword"` = `'keyword'`
