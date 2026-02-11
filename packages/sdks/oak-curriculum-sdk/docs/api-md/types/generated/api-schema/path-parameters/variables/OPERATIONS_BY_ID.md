[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/path-parameters](../README.md) / OPERATIONS\_BY\_ID

# Variable: OPERATIONS\_BY\_ID

> `const` **OPERATIONS\_BY\_ID**: `object`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/api-schema/path-parameters.ts:1717

Map of operations by their operationId
Generated at build time for runtime use

## Type Declaration

### changelog-changelog

> `readonly` **changelog-changelog**: `object`

#### changelog-changelog.description

> `readonly` **description**: `"History of significant changes to the API with associated dates and versions"` = `"History of significant changes to the API with associated dates and versions"`

#### changelog-changelog.method

> `readonly` **method**: `"get"` = `"get"`

#### changelog-changelog.operationId

> `readonly` **operationId**: `"changelog-changelog"` = `"changelog-changelog"`

#### changelog-changelog.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### changelog-changelog.path

> `readonly` **path**: `"/changelog"` = `"/changelog"`

#### changelog-changelog.responses

> `readonly` **responses**: `object`

#### changelog-changelog.responses.200

> `readonly` **200**: `object`

#### changelog-changelog.responses.200.content

> `readonly` **content**: `object`

#### changelog-changelog.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### changelog-changelog.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.example

> `readonly` **example**: readonly \[\{ `changes`: readonly \[`"PPTX used for slideDeck assets"`, `"All video assets now fully downloadable in mp4 format"`, `"New /threads/* endpoints"`\]; `date`: `"2025-03-06"`; `version`: `"0.5.0"`; \}, \{ `changes`: readonly \[`"Added /sequences/* and /subjects/* endpoints, and add support for unit optionality"`\]; `date`: `"2025-02-07"`; `version`: `"0.4.0"`; \}\]

#### changelog-changelog.responses.200.content.application/json.schema.items

> `readonly` **items**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.additionalProperties

> `readonly` **additionalProperties**: `false` = `false`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties

> `readonly` **properties**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.changes

> `readonly` **changes**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.changes.items

> `readonly` **items**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.changes.items.type

> `readonly` **type**: ... = `"string"`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.changes.type

> `readonly` **type**: `"array"` = `"array"`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.date

> `readonly` **date**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.date.type

> `readonly` **type**: `"string"` = `"string"`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.version

> `readonly` **version**: `object`

#### changelog-changelog.responses.200.content.application/json.schema.items.properties.version.type

> `readonly` **type**: `"string"` = `"string"`

#### changelog-changelog.responses.200.content.application/json.schema.items.required

> `readonly` **required**: readonly \[`"version"`, `"date"`, `"changes"`\]

#### changelog-changelog.responses.200.content.application/json.schema.items.type

> `readonly` **type**: `"object"` = `"object"`

#### changelog-changelog.responses.200.content.application/json.schema.type

> `readonly` **type**: `"array"` = `"array"`

#### changelog-changelog.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

### changelog-latest

> `readonly` **changelog-latest**: `object`

#### changelog-latest.description

> `readonly` **description**: `"Get the latest version and latest change note for the API"` = `"Get the latest version and latest change note for the API"`

#### changelog-latest.method

> `readonly` **method**: `"get"` = `"get"`

#### changelog-latest.operationId

> `readonly` **operationId**: `"changelog-latest"` = `"changelog-latest"`

#### changelog-latest.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### changelog-latest.path

> `readonly` **path**: `"/changelog/latest"` = `"/changelog/latest"`

#### changelog-latest.responses

> `readonly` **responses**: `object`

#### changelog-latest.responses.200

> `readonly` **200**: `object`

#### changelog-latest.responses.200.content

> `readonly` **content**: `object`

#### changelog-latest.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### changelog-latest.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### changelog-latest.responses.200.content.application/json.schema.additionalProperties

> `readonly` **additionalProperties**: `false` = `false`

#### changelog-latest.responses.200.content.application/json.schema.example

> `readonly` **example**: `object`

#### changelog-latest.responses.200.content.application/json.schema.example.changes

> `readonly` **changes**: readonly \[`"PPTX used for slideDeck assets"`, `"All video assets now fully downloadable in mp4 format"`, `"New /threads/* endpoints"`\]

#### changelog-latest.responses.200.content.application/json.schema.example.date

> `readonly` **date**: `"2025-03-06"` = `"2025-03-06"`

#### changelog-latest.responses.200.content.application/json.schema.example.version

> `readonly` **version**: `"0.5.0"` = `"0.5.0"`

#### changelog-latest.responses.200.content.application/json.schema.properties

> `readonly` **properties**: `object`

#### changelog-latest.responses.200.content.application/json.schema.properties.changes

> `readonly` **changes**: `object`

#### changelog-latest.responses.200.content.application/json.schema.properties.changes.items

> `readonly` **items**: `object`

#### changelog-latest.responses.200.content.application/json.schema.properties.changes.items.type

> `readonly` **type**: `"string"` = `"string"`

#### changelog-latest.responses.200.content.application/json.schema.properties.changes.type

> `readonly` **type**: `"array"` = `"array"`

#### changelog-latest.responses.200.content.application/json.schema.properties.date

> `readonly` **date**: `object`

#### changelog-latest.responses.200.content.application/json.schema.properties.date.type

> `readonly` **type**: `"string"` = `"string"`

#### changelog-latest.responses.200.content.application/json.schema.properties.version

> `readonly` **version**: `object`

#### changelog-latest.responses.200.content.application/json.schema.properties.version.type

> `readonly` **type**: `"string"` = `"string"`

#### changelog-latest.responses.200.content.application/json.schema.required

> `readonly` **required**: readonly \[`"version"`, `"date"`, `"changes"`\]

#### changelog-latest.responses.200.content.application/json.schema.type

> `readonly` **type**: `"object"` = `"object"`

#### changelog-latest.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits

> `readonly` **getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.description

> `readonly` **description**: `"This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint."` = `"This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint."`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.method

> `readonly` **method**: `"get"` = `"get"`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.operationId

> `readonly` **operationId**: `"getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits"` = `"getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits"`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Key stage slug to filter by, e.g. 'ks2'"`; `in`: `"path"`; `name`: `"keyStage"`; `required`: `true`; `schema`: \{ `description`: `"Key stage slug to filter by, e.g. 'ks2'"`; `enum`: readonly \[`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`\]; `example`: `"ks1"`; `type`: `"string"`; \}; \}, \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"`; `enum`: readonly \[`"art"`, `"citizenship"`, `"computing"`, `"cooking-nutrition"`, `"design-technology"`, `"english"`, `"french"`, `"geography"`, `"german"`, `"history"`, `"maths"`, `"music"`, `"physical-education"`, `"religious-education"`, `"rshe-pshe"`, `"science"`, `"spanish"`\]; `example`: `"art"`; `type`: `"string"`; \}; \}\]

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.path

> `readonly` **path**: `"/key-stages/{keyStage}/subject/{subject}/units"` = `"/key-stages/{keyStage}/subject/{subject}/units"`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses

> `readonly` **responses**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200

> `readonly` **200**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200.content

> `readonly` **content**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/AllKeyStageAndSubjectUnitsResponseSchema"` = `"#/components/schemas/AllKeyStageAndSubjectUnitsResponseSchema"`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.summary

> `readonly` **summary**: `"Units"` = `"Units"`

### getAssets-getLessonAsset

> `readonly` **getAssets-getLessonAsset**: `object`

#### getAssets-getLessonAsset.description

> `readonly` **description**: "This endpoint will stream the downloadable asset for the given lesson and type. \nThere is no response returned for this endpoint as it returns a content attachment." = `"This endpoint will stream the downloadable asset for the given lesson and type. \nThere is no response returned for this endpoint as it returns a content attachment."`

#### getAssets-getLessonAsset.method

> `readonly` **method**: `"get"` = `"get"`

#### getAssets-getLessonAsset.operationId

> `readonly` **operationId**: `"getAssets-getLessonAsset"` = `"getAssets-getLessonAsset"`

#### getAssets-getLessonAsset.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The lesson slug"`; `in`: `"path"`; `name`: `"lesson"`; `required`: `true`; `schema`: \{ `description`: `"The lesson slug"`; `example`: `"child-workers-in-the-victorian-era"`; `type`: `"string"`; \}; \}, \{ `description`: `"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint"`; `in`: `"path"`; `name`: `"type"`; `required`: `true`; `schema`: \{ `description`: `"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint"`; `enum`: readonly \[`"slideDeck"`, `"exitQuiz"`, `"exitQuizAnswers"`, `"starterQuiz"`, `"starterQuizAnswers"`, `"supplementaryResource"`, `"video"`, `"worksheet"`, `"worksheetAnswers"`\]; `example`: `"slideDeck"`; `type`: `"string"`; \}; \}\]

#### getAssets-getLessonAsset.path

> `readonly` **path**: `"/lessons/{lesson}/assets/{type}"` = `"/lessons/{lesson}/assets/{type}"`

#### getAssets-getLessonAsset.responses

> `readonly` **responses**: `object`

#### getAssets-getLessonAsset.responses.200

> `readonly` **200**: `object`

#### getAssets-getLessonAsset.responses.200.content

> `readonly` **content**: `object`

#### getAssets-getLessonAsset.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getAssets-getLessonAsset.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getAssets-getLessonAsset.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/LessonAssetResponseSchema"` = `"#/components/schemas/LessonAssetResponseSchema"`

#### getAssets-getLessonAsset.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getAssets-getLessonAsset.summary

> `readonly` **summary**: `"Lesson asset by type"` = `"Lesson asset by type"`

### getAssets-getLessonAssets

> `readonly` **getAssets-getLessonAssets**: `object`

#### getAssets-getLessonAssets.description

> `readonly` **description**: "This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.\n        This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.\n          " = `"This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.\n        This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.\n          "`

#### getAssets-getLessonAssets.method

> `readonly` **method**: `"get"` = `"get"`

#### getAssets-getLessonAssets.operationId

> `readonly` **operationId**: `"getAssets-getLessonAssets"` = `"getAssets-getLessonAssets"`

#### getAssets-getLessonAssets.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The lesson slug identifier"`; `in`: `"path"`; `name`: `"lesson"`; `required`: `true`; `schema`: \{ `description`: `"The lesson slug identifier"`; `example`: `"child-workers-in-the-victorian-era"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"type"`; `schema`: \{ `description`: `"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint"`; `enum`: readonly \[`"slideDeck"`, `"exitQuiz"`, `"exitQuizAnswers"`, `"starterQuiz"`, `"starterQuizAnswers"`, `"supplementaryResource"`, `"video"`, `"worksheet"`, `"worksheetAnswers"`\]; `example`: `"slideDeck"`; `type`: `"string"`; \}; \}\]

#### getAssets-getLessonAssets.path

> `readonly` **path**: `"/lessons/{lesson}/assets"` = `"/lessons/{lesson}/assets"`

#### getAssets-getLessonAssets.responses

> `readonly` **responses**: `object`

#### getAssets-getLessonAssets.responses.200

> `readonly` **200**: `object`

#### getAssets-getLessonAssets.responses.200.content

> `readonly` **content**: `object`

#### getAssets-getLessonAssets.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getAssets-getLessonAssets.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getAssets-getLessonAssets.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/LessonAssetsResponseSchema"` = `"#/components/schemas/LessonAssetsResponseSchema"`

#### getAssets-getLessonAssets.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getAssets-getLessonAssets.summary

> `readonly` **summary**: `"Downloadable lesson assets"` = `"Downloadable lesson assets"`

### getAssets-getSequenceAssets

> `readonly` **getAssets-getSequenceAssets**: `object`

#### getAssets-getSequenceAssets.description

> `readonly` **description**: "This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.\nThis endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement." = `"This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.\nThis endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement."`

#### getAssets-getSequenceAssets.method

> `readonly` **method**: `"get"` = `"get"`

#### getAssets-getSequenceAssets.operationId

> `readonly` **operationId**: `"getAssets-getSequenceAssets"` = `"getAssets-getSequenceAssets"`

#### getAssets-getSequenceAssets.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `in`: `"path"`; `name`: `"sequence"`; `required`: `true`; `schema`: \{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `example`: `"english-primary"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"year"`; `schema`: \{ `description`: `"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."`; `example`: `3`; `type`: `"number"`; \}; \}, \{ `in`: `"query"`; `name`: `"type"`; `schema`: \{ `description`: "Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers"; `enum`: readonly \[`"slideDeck"`, `"exitQuiz"`, `"exitQuizAnswers"`, `"starterQuiz"`, `"starterQuizAnswers"`, `"supplementaryResource"`, `"video"`, `"worksheet"`, `"worksheetAnswers"`\]; `example`: `"slideDeck"`; `type`: `"string"`; \}; \}\]

#### getAssets-getSequenceAssets.path

> `readonly` **path**: `"/sequences/{sequence}/assets"` = `"/sequences/{sequence}/assets"`

#### getAssets-getSequenceAssets.responses

> `readonly` **responses**: `object`

#### getAssets-getSequenceAssets.responses.200

> `readonly` **200**: `object`

#### getAssets-getSequenceAssets.responses.200.content

> `readonly` **content**: `object`

#### getAssets-getSequenceAssets.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getAssets-getSequenceAssets.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getAssets-getSequenceAssets.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SequenceAssetsResponseSchema"` = `"#/components/schemas/SequenceAssetsResponseSchema"`

#### getAssets-getSequenceAssets.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getAssets-getSequenceAssets.summary

> `readonly` **summary**: `"Assets within a sequence"` = `"Assets within a sequence"`

### getAssets-getSubjectAssets

> `readonly` **getAssets-getSubjectAssets**: `object`

#### getAssets-getSubjectAssets.description

> `readonly` **description**: `"This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit."` = `"This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit."`

#### getAssets-getSubjectAssets.method

> `readonly` **method**: `"get"` = `"get"`

#### getAssets-getSubjectAssets.operationId

> `readonly` **operationId**: `"getAssets-getSubjectAssets"` = `"getAssets-getSubjectAssets"`

#### getAssets-getSubjectAssets.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `in`: `"path"`; `name`: `"keyStage"`; `required`: `true`; `schema`: \{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`\]; `example`: `"ks1"`; `type`: `"string"`; \}; \}, \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"`; `enum`: readonly \[`"art"`, `"citizenship"`, `"computing"`, `"cooking-nutrition"`, `"design-technology"`, `"english"`, `"french"`, `"geography"`, `"german"`, `"history"`, `"maths"`, `"music"`, `"physical-education"`, `"religious-education"`, `"rshe-pshe"`, `"science"`, `"spanish"`\]; `example`: `"english"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"type"`; `schema`: \{ `description`: `"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint"`; `enum`: readonly \[`"slideDeck"`, `"exitQuiz"`, `"exitQuizAnswers"`, `"starterQuiz"`, `"starterQuizAnswers"`, `"supplementaryResource"`, `"video"`, `"worksheet"`, `"worksheetAnswers"`\]; `example`: `"slideDeck"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"unit"`; `schema`: \{ `description`: `"Optional unit slug to additionally filter by"`; `example`: `"word-class"`; `type`: `"string"`; \}; \}\]

#### getAssets-getSubjectAssets.path

> `readonly` **path**: `"/key-stages/{keyStage}/subject/{subject}/assets"` = `"/key-stages/{keyStage}/subject/{subject}/assets"`

#### getAssets-getSubjectAssets.responses

> `readonly` **responses**: `object`

#### getAssets-getSubjectAssets.responses.200

> `readonly` **200**: `object`

#### getAssets-getSubjectAssets.responses.200.content

> `readonly` **content**: `object`

#### getAssets-getSubjectAssets.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getAssets-getSubjectAssets.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getAssets-getSubjectAssets.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SubjectAssetsResponseSchema"` = `"#/components/schemas/SubjectAssetsResponseSchema"`

#### getAssets-getSubjectAssets.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getAssets-getSubjectAssets.summary

> `readonly` **summary**: `"Assets"` = `"Assets"`

### getKeyStages-getKeyStages

> `readonly` **getKeyStages-getKeyStages**: `object`

#### getKeyStages-getKeyStages.description

> `readonly` **description**: `"This endpoint returns all the key stages (titles and slugs) that are currently available on Oak"` = `"This endpoint returns all the key stages (titles and slugs) that are currently available on Oak"`

#### getKeyStages-getKeyStages.method

> `readonly` **method**: `"get"` = `"get"`

#### getKeyStages-getKeyStages.operationId

> `readonly` **operationId**: `"getKeyStages-getKeyStages"` = `"getKeyStages-getKeyStages"`

#### getKeyStages-getKeyStages.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### getKeyStages-getKeyStages.path

> `readonly` **path**: `"/key-stages"` = `"/key-stages"`

#### getKeyStages-getKeyStages.responses

> `readonly` **responses**: `object`

#### getKeyStages-getKeyStages.responses.200

> `readonly` **200**: `object`

#### getKeyStages-getKeyStages.responses.200.content

> `readonly` **content**: `object`

#### getKeyStages-getKeyStages.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getKeyStages-getKeyStages.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getKeyStages-getKeyStages.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/KeyStageResponseSchema"` = `"#/components/schemas/KeyStageResponseSchema"`

#### getKeyStages-getKeyStages.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getKeyStages-getKeyStages.summary

> `readonly` **summary**: `"Key stages"` = `"Key stages"`

### getKeyStageSubjectLessons-getKeyStageSubjectLessons

> `readonly` **getKeyStageSubjectLessons-getKeyStageSubjectLessons**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.description

> `readonly` **description**: `"This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit."` = `"This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit."`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.method

> `readonly` **method**: `"get"` = `"get"`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.operationId

> `readonly` **operationId**: `"getKeyStageSubjectLessons-getKeyStageSubjectLessons"` = `"getKeyStageSubjectLessons-getKeyStageSubjectLessons"`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `in`: `"path"`; `name`: `"keyStage"`; `required`: `true`; `schema`: \{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`\]; `example`: `"ks1"`; `type`: `"string"`; \}; \}, \{ `description`: `"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"art"`, `"citizenship"`, `"computing"`, `"cooking-nutrition"`, `"design-technology"`, `"english"`, `"french"`, `"geography"`, `"german"`, `"history"`, `"maths"`, `"music"`, `"physical-education"`, `"religious-education"`, `"rshe-pshe"`, `"science"`, `"spanish"`\]; `example`: `"english"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"unit"`; `schema`: \{ `description`: `"Optional unit slug to additionally filter by"`; `example`: `"word-class"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"offset"`; `schema`: \{ `default`: `0`; `description`: `"Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted."`; `example`: `50`; `type`: `"number"`; \}; \}, \{ `in`: `"query"`; `name`: `"limit"`; `schema`: \{ `default`: `10`; `description`: `"Offset applied to lessons within each unit (not to the unit list)."`; `example`: `10`; `maximum`: `100`; `type`: `"number"`; \}; \}\]

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.path

> `readonly` **path**: `"/key-stages/{keyStage}/subject/{subject}/lessons"` = `"/key-stages/{keyStage}/subject/{subject}/lessons"`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses

> `readonly` **responses**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200

> `readonly` **200**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200.content

> `readonly` **content**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/KeyStageSubjectLessonsResponseSchema"` = `"#/components/schemas/KeyStageSubjectLessonsResponseSchema"`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getKeyStageSubjectLessons-getKeyStageSubjectLessons.summary

> `readonly` **summary**: `"Lessons"` = `"Lessons"`

### getLessons-getLesson

> `readonly` **getLessons-getLesson**: `object`

#### getLessons-getLesson.description

> `readonly` **description**: `"This endpoint returns a summary for a given lesson"` = `"This endpoint returns a summary for a given lesson"`

#### getLessons-getLesson.method

> `readonly` **method**: `"get"` = `"get"`

#### getLessons-getLesson.operationId

> `readonly` **operationId**: `"getLessons-getLesson"` = `"getLessons-getLesson"`

#### getLessons-getLesson.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The slug of the lesson"`; `in`: `"path"`; `name`: `"lesson"`; `required`: `true`; `schema`: \{ `description`: `"The slug of the lesson"`; `example`: `"joining-using-and"`; `type`: `"string"`; \}; \}\]

#### getLessons-getLesson.path

> `readonly` **path**: `"/lessons/{lesson}/summary"` = `"/lessons/{lesson}/summary"`

#### getLessons-getLesson.responses

> `readonly` **responses**: `object`

#### getLessons-getLesson.responses.200

> `readonly` **200**: `object`

#### getLessons-getLesson.responses.200.content

> `readonly` **content**: `object`

#### getLessons-getLesson.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getLessons-getLesson.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getLessons-getLesson.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/LessonSummaryResponseSchema"` = `"#/components/schemas/LessonSummaryResponseSchema"`

#### getLessons-getLesson.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getLessons-getLesson.summary

> `readonly` **summary**: `"Lesson summary"` = `"Lesson summary"`

### getLessons-searchByTextSimilarity

> `readonly` **getLessons-searchByTextSimilarity**: `object`

#### getLessons-searchByTextSimilarity.description

> `readonly` **description**: `"Search for a term and find the 20 most similar lessons with titles that contain similar text."` = `"Search for a term and find the 20 most similar lessons with titles that contain similar text."`

#### getLessons-searchByTextSimilarity.method

> `readonly` **method**: `"get"` = `"get"`

#### getLessons-searchByTextSimilarity.operationId

> `readonly` **operationId**: `"getLessons-searchByTextSimilarity"` = `"getLessons-searchByTextSimilarity"`

#### getLessons-searchByTextSimilarity.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Search query text snippet"`; `in`: `"query"`; `name`: `"q"`; `required`: `true`; `schema`: \{ `description`: `"Search query text snippet"`; `example`: `"gothic"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"keyStage"`; `schema`: \{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`\]; `example`: `"ks2"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"subject"`; `schema`: \{ `description`: `"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"art"`, `"citizenship"`, `"computing"`, `"cooking-nutrition"`, `"design-technology"`, `"english"`, `"french"`, `"geography"`, `"german"`, `"history"`, `"maths"`, `"music"`, `"physical-education"`, `"religious-education"`, `"rshe-pshe"`, `"science"`, `"spanish"`\]; `example`: `"english"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"unit"`; `schema`: \{ `description`: `"Optional unit slug to additionally filter by"`; `example`: `"Gothic poetry"`; `type`: `"string"`; \}; \}\]

#### getLessons-searchByTextSimilarity.path

> `readonly` **path**: `"/search/lessons"` = `"/search/lessons"`

#### getLessons-searchByTextSimilarity.responses

> `readonly` **responses**: `object`

#### getLessons-searchByTextSimilarity.responses.200

> `readonly` **200**: `object`

#### getLessons-searchByTextSimilarity.responses.200.content

> `readonly` **content**: `object`

#### getLessons-searchByTextSimilarity.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getLessons-searchByTextSimilarity.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getLessons-searchByTextSimilarity.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/LessonSearchResponseSchema"` = `"#/components/schemas/LessonSearchResponseSchema"`

#### getLessons-searchByTextSimilarity.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getLessons-searchByTextSimilarity.summary

> `readonly` **summary**: `"Lesson search using lesson title"` = `"Lesson search using lesson title"`

### getLessonTranscript-getLessonTranscript

> `readonly` **getLessonTranscript-getLessonTranscript**: `object`

#### getLessonTranscript-getLessonTranscript.description

> `readonly` **description**: `"This endpoint returns the video transcript and video captions file for a given lesson."` = `"This endpoint returns the video transcript and video captions file for a given lesson."`

#### getLessonTranscript-getLessonTranscript.method

> `readonly` **method**: `"get"` = `"get"`

#### getLessonTranscript-getLessonTranscript.operationId

> `readonly` **operationId**: `"getLessonTranscript-getLessonTranscript"` = `"getLessonTranscript-getLessonTranscript"`

#### getLessonTranscript-getLessonTranscript.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The slug of the lesson"`; `in`: `"path"`; `name`: `"lesson"`; `required`: `true`; `schema`: \{ `description`: `"The slug of the lesson"`; `example`: `"checking-understanding-of-basic-transformations"`; `type`: `"string"`; \}; \}\]

#### getLessonTranscript-getLessonTranscript.path

> `readonly` **path**: `"/lessons/{lesson}/transcript"` = `"/lessons/{lesson}/transcript"`

#### getLessonTranscript-getLessonTranscript.responses

> `readonly` **responses**: `object`

#### getLessonTranscript-getLessonTranscript.responses.200

> `readonly` **200**: `object`

#### getLessonTranscript-getLessonTranscript.responses.200.content

> `readonly` **content**: `object`

#### getLessonTranscript-getLessonTranscript.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getLessonTranscript-getLessonTranscript.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getLessonTranscript-getLessonTranscript.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/TranscriptResponseSchema"` = `"#/components/schemas/TranscriptResponseSchema"`

#### getLessonTranscript-getLessonTranscript.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getLessonTranscript-getLessonTranscript.responses.404

> `readonly` **404**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content

> `readonly` **content**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json

> `readonly` **application/json**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example

> `readonly` **example**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.code

> `readonly` **code**: `"NOT_FOUND"` = `"NOT_FOUND"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.data

> `readonly` **data**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.data.code

> `readonly` **code**: `"NOT_FOUND"` = `"NOT_FOUND"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.data.httpStatus

> `readonly` **httpStatus**: `404` = `404`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.data.path

> `readonly` **path**: `"getLessonTranscript.getLessonTranscript"` = `"getLessonTranscript.getLessonTranscript"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.data.zodError

> `readonly` **zodError**: `null` = `null`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.example.message

> `readonly` **message**: `"Transcript not available for this query"` = `"Transcript not available for this query"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema

> `readonly` **schema**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.description

> `readonly` **description**: `"Standard Oak API error envelope emitted for legitimate 404 responses."` = `"Standard Oak API error envelope emitted for legitimate 404 responses."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties

> `readonly` **properties**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.code

> `readonly` **code**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.code.description

> `readonly` **description**: `"API error code describing the failure classification."` = `"API error code describing the failure classification."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.code.example

> `readonly` **example**: `"NOT_FOUND"` = `"NOT_FOUND"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.code.type

> `readonly` **type**: `"string"` = `"string"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data

> `readonly` **data**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.description

> `readonly` **description**: `"Additional metadata describing the failure as emitted by the Oak API gateway."` = `"Additional metadata describing the failure as emitted by the Oak API gateway."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties

> `readonly` **properties**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.code

> `readonly` **code**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.code.description

> `readonly` **description**: ... = `"Reiterated error code for downstream tools."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.code.example

> `readonly` **example**: ... = `"NOT_FOUND"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.code.type

> `readonly` **type**: ... = `"string"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.httpStatus

> `readonly` **httpStatus**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.httpStatus.description

> `readonly` **description**: ... = `"HTTP status code returned by the upstream API."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.httpStatus.example

> `readonly` **example**: ... = `404`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.httpStatus.type

> `readonly` **type**: ... = `"integer"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.path

> `readonly` **path**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.path.description

> `readonly` **description**: ... = `"Identifier of the upstream operation emitting the error."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.path.example

> `readonly` **example**: ... = `"getLessonTranscript.getLessonTranscript"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.path.type

> `readonly` **type**: ... = `"string"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.zodError

> `readonly` **zodError**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.zodError.description

> `readonly` **description**: ... = `"Optional validation payload describing schema mismatches. Always null for 404 responses."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.zodError.example

> `readonly` **example**: ... = `null`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.properties.zodError.type

> `readonly` **type**: ... = `"null"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.required

> `readonly` **required**: readonly \[`"code"`, `"httpStatus"`, `"path"`\]

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.data.type

> `readonly` **type**: `"object"` = `"object"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.message

> `readonly` **message**: `object`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.message.description

> `readonly` **description**: `"Human-readable message describing why the resource is unavailable."` = `"Human-readable message describing why the resource is unavailable."`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.message.example

> `readonly` **example**: `"Transcript not available for this query"` = `"Transcript not available for this query"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.properties.message.type

> `readonly` **type**: `"string"` = `"string"`

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.required

> `readonly` **required**: readonly \[`"message"`, `"code"`, `"data"`\]

#### getLessonTranscript-getLessonTranscript.responses.404.content.application/json.schema.type

> `readonly` **type**: `"object"` = `"object"`

#### getLessonTranscript-getLessonTranscript.responses.404.description

> `readonly` **description**: "Temporary: Documented locally until the upstream schema captures this legitimate 404 response.\n\nLessons without accompanying video content legitimately return HTTP 404 so callers can distinguish \"no transcript available\" from invalid lesson slugs.\n\nTracking: .agent/plans/upstream-api-metadata-wishlist.md item #4" = `"Temporary: Documented locally until the upstream schema captures this legitimate 404 response.\n\nLessons without accompanying video content legitimately return HTTP 404 so callers can distinguish \"no transcript available\" from invalid lesson slugs.\n\nTracking: .agent/plans/upstream-api-metadata-wishlist.md item #4"`

#### getLessonTranscript-getLessonTranscript.summary

> `readonly` **summary**: `"Lesson transcript"` = `"Lesson transcript"`

### getQuestions-getQuestionsForKeyStageAndSubject

> `readonly` **getQuestions-getQuestionsForKeyStageAndSubject**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.description

> `readonly` **description**: `"This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage."` = `"This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage."`

#### getQuestions-getQuestionsForKeyStageAndSubject.method

> `readonly` **method**: `"get"` = `"get"`

#### getQuestions-getQuestionsForKeyStageAndSubject.operationId

> `readonly` **operationId**: `"getQuestions-getQuestionsForKeyStageAndSubject"` = `"getQuestions-getQuestionsForKeyStageAndSubject"`

#### getQuestions-getQuestionsForKeyStageAndSubject.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `in`: `"path"`; `name`: `"keyStage"`; `required`: `true`; `schema`: \{ `description`: `"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"`; `enum`: readonly \[`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`\]; `example`: `"ks1"`; `type`: `"string"`; \}; \}, \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"Subject slug to search by, e.g. 'science' - note that casing is important here"`; `enum`: readonly \[`"art"`, `"citizenship"`, `"computing"`, `"cooking-nutrition"`, `"design-technology"`, `"english"`, `"french"`, `"geography"`, `"german"`, `"history"`, `"maths"`, `"music"`, `"physical-education"`, `"religious-education"`, `"rshe-pshe"`, `"science"`, `"spanish"`\]; `example`: `"art"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"offset"`; `schema`: \{ `default`: `0`; `description`: `"If limiting results returned, this allows you to return the next set of results, starting at the given offset point"`; `example`: `50`; `type`: `"number"`; \}; \}, \{ `in`: `"query"`; `name`: `"limit"`; `schema`: \{ `default`: `10`; `description`: `"Limit the number of lessons, e.g. return a maximum of 100 lessons"`; `example`: `10`; `maximum`: `100`; `type`: `"number"`; \}; \}\]

#### getQuestions-getQuestionsForKeyStageAndSubject.path

> `readonly` **path**: `"/key-stages/{keyStage}/subject/{subject}/questions"` = `"/key-stages/{keyStage}/subject/{subject}/questions"`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses

> `readonly` **responses**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200

> `readonly` **200**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200.content

> `readonly` **content**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/QuestionsForKeyStageAndSubjectResponseSchema"` = `"#/components/schemas/QuestionsForKeyStageAndSubjectResponseSchema"`

#### getQuestions-getQuestionsForKeyStageAndSubject.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getQuestions-getQuestionsForKeyStageAndSubject.summary

> `readonly` **summary**: `"Quiz questions by subject and key stage"` = `"Quiz questions by subject and key stage"`

### getQuestions-getQuestionsForLessons

> `readonly` **getQuestions-getQuestionsForLessons**: `object`

#### getQuestions-getQuestionsForLessons.description

> `readonly` **description**: `"The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors."` = `"The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors."`

#### getQuestions-getQuestionsForLessons.method

> `readonly` **method**: `"get"` = `"get"`

#### getQuestions-getQuestionsForLessons.operationId

> `readonly` **operationId**: `"getQuestions-getQuestionsForLessons"` = `"getQuestions-getQuestionsForLessons"`

#### getQuestions-getQuestionsForLessons.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The lesson slug identifier"`; `in`: `"path"`; `name`: `"lesson"`; `required`: `true`; `schema`: \{ `description`: `"The lesson slug identifier"`; `example`: `"imagining-you-are-the-characters-the-three-billy-goats-gruff"`; `type`: `"string"`; \}; \}\]

#### getQuestions-getQuestionsForLessons.path

> `readonly` **path**: `"/lessons/{lesson}/quiz"` = `"/lessons/{lesson}/quiz"`

#### getQuestions-getQuestionsForLessons.responses

> `readonly` **responses**: `object`

#### getQuestions-getQuestionsForLessons.responses.200

> `readonly` **200**: `object`

#### getQuestions-getQuestionsForLessons.responses.200.content

> `readonly` **content**: `object`

#### getQuestions-getQuestionsForLessons.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getQuestions-getQuestionsForLessons.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getQuestions-getQuestionsForLessons.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/QuestionForLessonsResponseSchema"` = `"#/components/schemas/QuestionForLessonsResponseSchema"`

#### getQuestions-getQuestionsForLessons.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getQuestions-getQuestionsForLessons.summary

> `readonly` **summary**: `"Quiz questions by lesson"` = `"Quiz questions by lesson"`

### getQuestions-getQuestionsForSequence

> `readonly` **getQuestions-getQuestionsForSequence**: `object`

#### getQuestions-getQuestionsForSequence.description

> `readonly` **description**: `"This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson."` = `"This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson."`

#### getQuestions-getQuestionsForSequence.method

> `readonly` **method**: `"get"` = `"get"`

#### getQuestions-getQuestionsForSequence.operationId

> `readonly` **operationId**: `"getQuestions-getQuestionsForSequence"` = `"getQuestions-getQuestionsForSequence"`

#### getQuestions-getQuestionsForSequence.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `in`: `"path"`; `name`: `"sequence"`; `required`: `true`; `schema`: \{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `example`: `"english-primary"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"year"`; `schema`: \{ `description`: `"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."`; `example`: `3`; `type`: `"number"`; \}; \}, \{ `in`: `"query"`; `name`: `"offset"`; `schema`: \{ `default`: `0`; `description`: `"If limiting results returned, this allows you to return the next set of results, starting at the given offset point"`; `example`: `50`; `type`: `"number"`; \}; \}, \{ `in`: `"query"`; `name`: `"limit"`; `schema`: \{ `default`: `10`; `description`: `"Limit the number of lessons, e.g. return a maximum of 100 lessons"`; `example`: `10`; `maximum`: `100`; `type`: `"number"`; \}; \}\]

#### getQuestions-getQuestionsForSequence.path

> `readonly` **path**: `"/sequences/{sequence}/questions"` = `"/sequences/{sequence}/questions"`

#### getQuestions-getQuestionsForSequence.responses

> `readonly` **responses**: `object`

#### getQuestions-getQuestionsForSequence.responses.200

> `readonly` **200**: `object`

#### getQuestions-getQuestionsForSequence.responses.200.content

> `readonly` **content**: `object`

#### getQuestions-getQuestionsForSequence.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getQuestions-getQuestionsForSequence.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getQuestions-getQuestionsForSequence.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/QuestionsForSequenceResponseSchema"` = `"#/components/schemas/QuestionsForSequenceResponseSchema"`

#### getQuestions-getQuestionsForSequence.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getQuestions-getQuestionsForSequence.summary

> `readonly` **summary**: `"Questions within a sequence"` = `"Questions within a sequence"`

### getRateLimit-getRateLimit

> `readonly` **getRateLimit-getRateLimit**: `object`

#### getRateLimit-getRateLimit.description

> `readonly` **description**: "Check your current rate limit status (note that your rate limit is also included in the headers of every response).\n\nThis specific endpoint does not cost any requests." = `"Check your current rate limit status (note that your rate limit is also included in the headers of every response).\n\nThis specific endpoint does not cost any requests."`

#### getRateLimit-getRateLimit.method

> `readonly` **method**: `"get"` = `"get"`

#### getRateLimit-getRateLimit.operationId

> `readonly` **operationId**: `"getRateLimit-getRateLimit"` = `"getRateLimit-getRateLimit"`

#### getRateLimit-getRateLimit.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### getRateLimit-getRateLimit.path

> `readonly` **path**: `"/rate-limit"` = `"/rate-limit"`

#### getRateLimit-getRateLimit.responses

> `readonly` **responses**: `object`

#### getRateLimit-getRateLimit.responses.200

> `readonly` **200**: `object`

#### getRateLimit-getRateLimit.responses.200.content

> `readonly` **content**: `object`

#### getRateLimit-getRateLimit.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getRateLimit-getRateLimit.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getRateLimit-getRateLimit.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/RateLimitResponseSchema"` = `"#/components/schemas/RateLimitResponseSchema"`

#### getRateLimit-getRateLimit.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

### getSequences-getSequenceUnits

> `readonly` **getSequences-getSequenceUnits**: `object`

#### getSequences-getSequenceUnits.description

> `readonly` **description**: `"This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year."` = `"This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year."`

#### getSequences-getSequenceUnits.method

> `readonly` **method**: `"get"` = `"get"`

#### getSequences-getSequenceUnits.operationId

> `readonly` **operationId**: `"getSequences-getSequenceUnits"` = `"getSequences-getSequenceUnits"`

#### getSequences-getSequenceUnits.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `in`: `"path"`; `name`: `"sequence"`; `required`: `true`; `schema`: \{ `description`: `"The sequence slug identifier, including the key stage 4 option where relevant."`; `example`: `"english-primary"`; `type`: `"string"`; \}; \}, \{ `in`: `"query"`; `name`: `"year"`; `schema`: \{ `description`: `"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."`; `enum`: readonly \[`"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`, `"10"`, `"11"`, `"all-years"`\]; `example`: `"1"`; `type`: `"string"`; \}; \}\]

#### getSequences-getSequenceUnits.path

> `readonly` **path**: `"/sequences/{sequence}/units"` = `"/sequences/{sequence}/units"`

#### getSequences-getSequenceUnits.responses

> `readonly` **responses**: `object`

#### getSequences-getSequenceUnits.responses.200

> `readonly` **200**: `object`

#### getSequences-getSequenceUnits.responses.200.content

> `readonly` **content**: `object`

#### getSequences-getSequenceUnits.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSequences-getSequenceUnits.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSequences-getSequenceUnits.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SequenceUnitsResponseSchema"` = `"#/components/schemas/SequenceUnitsResponseSchema"`

#### getSequences-getSequenceUnits.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSequences-getSequenceUnits.summary

> `readonly` **summary**: `"Units within a sequence"` = `"Units within a sequence"`

### getSubjects-getAllSubjects

> `readonly` **getSubjects-getAllSubjects**: `object`

#### getSubjects-getAllSubjects.description

> `readonly` **description**: `"This endpoint returns an array of all available subjects and their associated sequences, key stages and years."` = `"This endpoint returns an array of all available subjects and their associated sequences, key stages and years."`

#### getSubjects-getAllSubjects.method

> `readonly` **method**: `"get"` = `"get"`

#### getSubjects-getAllSubjects.operationId

> `readonly` **operationId**: `"getSubjects-getAllSubjects"` = `"getSubjects-getAllSubjects"`

#### getSubjects-getAllSubjects.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### getSubjects-getAllSubjects.path

> `readonly` **path**: `"/subjects"` = `"/subjects"`

#### getSubjects-getAllSubjects.responses

> `readonly` **responses**: `object`

#### getSubjects-getAllSubjects.responses.200

> `readonly` **200**: `object`

#### getSubjects-getAllSubjects.responses.200.content

> `readonly` **content**: `object`

#### getSubjects-getAllSubjects.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSubjects-getAllSubjects.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSubjects-getAllSubjects.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/AllSubjectsResponseSchema"` = `"#/components/schemas/AllSubjectsResponseSchema"`

#### getSubjects-getAllSubjects.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSubjects-getAllSubjects.summary

> `readonly` **summary**: `"Subjects"` = `"Subjects"`

### getSubjects-getSubject

> `readonly` **getSubjects-getSubject**: `object`

#### getSubjects-getSubject.description

> `readonly` **description**: `"This endpoint returns the sequences, key stages and years that are currently available for a given subject."` = `"This endpoint returns the sequences, key stages and years that are currently available for a given subject."`

#### getSubjects-getSubject.method

> `readonly` **method**: `"get"` = `"get"`

#### getSubjects-getSubject.operationId

> `readonly` **operationId**: `"getSubjects-getSubject"` = `"getSubjects-getSubject"`

#### getSubjects-getSubject.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The slug identifier for the subject"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"The slug identifier for the subject"`; `example`: `"art"`; `type`: `"string"`; \}; \}\]

#### getSubjects-getSubject.path

> `readonly` **path**: `"/subjects/{subject}"` = `"/subjects/{subject}"`

#### getSubjects-getSubject.responses

> `readonly` **responses**: `object`

#### getSubjects-getSubject.responses.200

> `readonly` **200**: `object`

#### getSubjects-getSubject.responses.200.content

> `readonly` **content**: `object`

#### getSubjects-getSubject.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSubjects-getSubject.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSubjects-getSubject.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SubjectResponseSchema"` = `"#/components/schemas/SubjectResponseSchema"`

#### getSubjects-getSubject.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSubjects-getSubject.summary

> `readonly` **summary**: `"Subject"` = `"Subject"`

### getSubjects-getSubjectKeyStages

> `readonly` **getSubjects-getSubjectKeyStages**: `object`

#### getSubjects-getSubjectKeyStages.description

> `readonly` **description**: `"This endpoint returns a list of key stages that are currently available for a given subject."` = `"This endpoint returns a list of key stages that are currently available for a given subject."`

#### getSubjects-getSubjectKeyStages.method

> `readonly` **method**: `"get"` = `"get"`

#### getSubjects-getSubjectKeyStages.operationId

> `readonly` **operationId**: `"getSubjects-getSubjectKeyStages"` = `"getSubjects-getSubjectKeyStages"`

#### getSubjects-getSubjectKeyStages.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The subject slug identifier"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"The subject slug identifier"`; `example`: `"art"`; `type`: `"string"`; \}; \}\]

#### getSubjects-getSubjectKeyStages.path

> `readonly` **path**: `"/subjects/{subject}/key-stages"` = `"/subjects/{subject}/key-stages"`

#### getSubjects-getSubjectKeyStages.responses

> `readonly` **responses**: `object`

#### getSubjects-getSubjectKeyStages.responses.200

> `readonly` **200**: `object`

#### getSubjects-getSubjectKeyStages.responses.200.content

> `readonly` **content**: `object`

#### getSubjects-getSubjectKeyStages.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSubjects-getSubjectKeyStages.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSubjects-getSubjectKeyStages.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SubjectKeyStagesResponseSchema"` = `"#/components/schemas/SubjectKeyStagesResponseSchema"`

#### getSubjects-getSubjectKeyStages.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSubjects-getSubjectKeyStages.summary

> `readonly` **summary**: `"Key stages within a subject"` = `"Key stages within a subject"`

### getSubjects-getSubjectSequence

> `readonly` **getSubjects-getSubjectSequence**: `object`

#### getSubjects-getSubjectSequence.description

> `readonly` **description**: `"This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences."` = `"This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences."`

#### getSubjects-getSubjectSequence.method

> `readonly` **method**: `"get"` = `"get"`

#### getSubjects-getSubjectSequence.operationId

> `readonly` **operationId**: `"getSubjects-getSubjectSequence"` = `"getSubjects-getSubjectSequence"`

#### getSubjects-getSubjectSequence.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The slug identifier for the subject"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"The slug identifier for the subject"`; `example`: `"art"`; `type`: `"string"`; \}; \}\]

#### getSubjects-getSubjectSequence.path

> `readonly` **path**: `"/subjects/{subject}/sequences"` = `"/subjects/{subject}/sequences"`

#### getSubjects-getSubjectSequence.responses

> `readonly` **responses**: `object`

#### getSubjects-getSubjectSequence.responses.200

> `readonly` **200**: `object`

#### getSubjects-getSubjectSequence.responses.200.content

> `readonly` **content**: `object`

#### getSubjects-getSubjectSequence.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSubjects-getSubjectSequence.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSubjects-getSubjectSequence.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SubjectSequenceResponseSchema"` = `"#/components/schemas/SubjectSequenceResponseSchema"`

#### getSubjects-getSubjectSequence.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSubjects-getSubjectSequence.summary

> `readonly` **summary**: `"Sequencing information for a given subject"` = `"Sequencing information for a given subject"`

### getSubjects-getSubjectYears

> `readonly` **getSubjects-getSubjectYears**: `object`

#### getSubjects-getSubjectYears.description

> `readonly` **description**: `"This endpoint returns an array of years that are currently available for a given subject."` = `"This endpoint returns an array of years that are currently available for a given subject."`

#### getSubjects-getSubjectYears.method

> `readonly` **method**: `"get"` = `"get"`

#### getSubjects-getSubjectYears.operationId

> `readonly` **operationId**: `"getSubjects-getSubjectYears"` = `"getSubjects-getSubjectYears"`

#### getSubjects-getSubjectYears.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"Subject slug to filter by"`; `in`: `"path"`; `name`: `"subject"`; `required`: `true`; `schema`: \{ `description`: `"Subject slug to filter by"`; `example`: `"cooking-nutrition"`; `type`: `"string"`; \}; \}\]

#### getSubjects-getSubjectYears.path

> `readonly` **path**: `"/subjects/{subject}/years"` = `"/subjects/{subject}/years"`

#### getSubjects-getSubjectYears.responses

> `readonly` **responses**: `object`

#### getSubjects-getSubjectYears.responses.200

> `readonly` **200**: `object`

#### getSubjects-getSubjectYears.responses.200.content

> `readonly` **content**: `object`

#### getSubjects-getSubjectYears.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getSubjects-getSubjectYears.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getSubjects-getSubjectYears.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SubjectYearsResponseSchema"` = `"#/components/schemas/SubjectYearsResponseSchema"`

#### getSubjects-getSubjectYears.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getSubjects-getSubjectYears.summary

> `readonly` **summary**: `"Year groups for a given subject"` = `"Year groups for a given subject"`

### getThreads-getAllThreads

> `readonly` **getThreads-getAllThreads**: `object`

#### getThreads-getAllThreads.description

> `readonly` **description**: `"This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced."` = `"This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced."`

#### getThreads-getAllThreads.method

> `readonly` **method**: `"get"` = `"get"`

#### getThreads-getAllThreads.operationId

> `readonly` **operationId**: `"getThreads-getAllThreads"` = `"getThreads-getAllThreads"`

#### getThreads-getAllThreads.parameters

> `readonly` **parameters**: readonly \[\] = `[]`

#### getThreads-getAllThreads.path

> `readonly` **path**: `"/threads"` = `"/threads"`

#### getThreads-getAllThreads.responses

> `readonly` **responses**: `object`

#### getThreads-getAllThreads.responses.200

> `readonly` **200**: `object`

#### getThreads-getAllThreads.responses.200.content

> `readonly` **content**: `object`

#### getThreads-getAllThreads.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getThreads-getAllThreads.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getThreads-getAllThreads.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/AllThreadsResponseSchema"` = `"#/components/schemas/AllThreadsResponseSchema"`

#### getThreads-getAllThreads.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getThreads-getAllThreads.summary

> `readonly` **summary**: `"Threads"` = `"Threads"`

### getThreads-getThreadUnits

> `readonly` **getThreads-getThreadUnits**: `object`

#### getThreads-getThreadUnits.description

> `readonly` **description**: `"This endpoint returns all of the units that belong to a given thread."` = `"This endpoint returns all of the units that belong to a given thread."`

#### getThreads-getThreadUnits.method

> `readonly` **method**: `"get"` = `"get"`

#### getThreads-getThreadUnits.operationId

> `readonly` **operationId**: `"getThreads-getThreadUnits"` = `"getThreads-getThreadUnits"`

#### getThreads-getThreadUnits.parameters

> `readonly` **parameters**: readonly \[\{ `in`: `"path"`; `name`: `"threadSlug"`; `required`: `true`; `schema`: \{ `example`: `"number-multiplication-and-division"`; `type`: `"string"`; \}; \}\]

#### getThreads-getThreadUnits.path

> `readonly` **path**: `"/threads/{threadSlug}/units"` = `"/threads/{threadSlug}/units"`

#### getThreads-getThreadUnits.responses

> `readonly` **responses**: `object`

#### getThreads-getThreadUnits.responses.200

> `readonly` **200**: `object`

#### getThreads-getThreadUnits.responses.200.content

> `readonly` **content**: `object`

#### getThreads-getThreadUnits.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getThreads-getThreadUnits.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getThreads-getThreadUnits.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/ThreadUnitsResponseSchema"` = `"#/components/schemas/ThreadUnitsResponseSchema"`

#### getThreads-getThreadUnits.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getThreads-getThreadUnits.summary

> `readonly` **summary**: `"Units belonging to a given thread"` = `"Units belonging to a given thread"`

### getUnits-getUnit

> `readonly` **getUnits-getUnit**: `object`

#### getUnits-getUnit.description

> `readonly` **description**: `"This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit"` = `"This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit"`

#### getUnits-getUnit.method

> `readonly` **method**: `"get"` = `"get"`

#### getUnits-getUnit.operationId

> `readonly` **operationId**: `"getUnits-getUnit"` = `"getUnits-getUnit"`

#### getUnits-getUnit.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"The unit slug"`; `in`: `"path"`; `name`: `"unit"`; `required`: `true`; `schema`: \{ `description`: `"The unit slug"`; `example`: `"simple-compound-and-adverbial-complex-sentences"`; `type`: `"string"`; \}; \}\]

#### getUnits-getUnit.path

> `readonly` **path**: `"/units/{unit}/summary"` = `"/units/{unit}/summary"`

#### getUnits-getUnit.responses

> `readonly` **responses**: `object`

#### getUnits-getUnit.responses.200

> `readonly` **200**: `object`

#### getUnits-getUnit.responses.200.content

> `readonly` **content**: `object`

#### getUnits-getUnit.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### getUnits-getUnit.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### getUnits-getUnit.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/UnitSummaryResponseSchema"` = `"#/components/schemas/UnitSummaryResponseSchema"`

#### getUnits-getUnit.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### getUnits-getUnit.summary

> `readonly` **summary**: `"Unit summary"` = `"Unit summary"`

### searchTranscripts-searchTranscripts

> `readonly` **searchTranscripts-searchTranscripts**: `object`

#### searchTranscripts-searchTranscripts.description

> `readonly` **description**: `"Search for a term and find the 5 most similar lessons whose video transcripts contain similar text."` = `"Search for a term and find the 5 most similar lessons whose video transcripts contain similar text."`

#### searchTranscripts-searchTranscripts.method

> `readonly` **method**: `"get"` = `"get"`

#### searchTranscripts-searchTranscripts.operationId

> `readonly` **operationId**: `"searchTranscripts-searchTranscripts"` = `"searchTranscripts-searchTranscripts"`

#### searchTranscripts-searchTranscripts.parameters

> `readonly` **parameters**: readonly \[\{ `description`: `"A snippet of text to search for in the lesson video transcripts"`; `in`: `"query"`; `name`: `"q"`; `required`: `true`; `schema`: \{ `description`: `"A snippet of text to search for in the lesson video transcripts"`; `example`: `"Who were the romans?"`; `type`: `"string"`; \}; \}\]

#### searchTranscripts-searchTranscripts.path

> `readonly` **path**: `"/search/transcripts"` = `"/search/transcripts"`

#### searchTranscripts-searchTranscripts.responses

> `readonly` **responses**: `object`

#### searchTranscripts-searchTranscripts.responses.200

> `readonly` **200**: `object`

#### searchTranscripts-searchTranscripts.responses.200.content

> `readonly` **content**: `object`

#### searchTranscripts-searchTranscripts.responses.200.content.application/json

> `readonly` **application/json**: `object`

#### searchTranscripts-searchTranscripts.responses.200.content.application/json.schema

> `readonly` **schema**: `object`

#### searchTranscripts-searchTranscripts.responses.200.content.application/json.schema.$ref

> `readonly` **$ref**: `"#/components/schemas/SearchTranscriptResponseSchema"` = `"#/components/schemas/SearchTranscriptResponseSchema"`

#### searchTranscripts-searchTranscripts.responses.200.description

> `readonly` **description**: `"Successful response"` = `"Successful response"`

#### searchTranscripts-searchTranscripts.summary

> `readonly` **summary**: `"Lesson search using lesson video transcripts"` = `"Lesson search using lesson video transcripts"`
