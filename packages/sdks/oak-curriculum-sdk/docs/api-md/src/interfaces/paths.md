[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / paths

# Interface: paths

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:1

## Properties

### /changelog

> **/changelog**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:465

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

History of significant changes to the API with associated dates and versions

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /changelog/latest

> **/changelog/latest**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:482

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Get the latest version and latest change note for the API

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.changes

> **changes**: `string`[]

##### get.responses.200.content.application/json.date

> **date**: `string`

##### get.responses.200.content.application/json.version

> **version**: `string`

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /key-stages

> **/key-stages**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:245

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Key stages
This endpoint returns all the key stages (titles and slugs) that are currently available on Oak

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /key-stages/\{keyStage\}/subject/\{subject\}/assets

> **/key-stages/\{keyStage\}/subject/\{subject\}/assets**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:83

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Assets
This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### get.parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

##### get.parameters.query.unit?

> `optional` **unit**: `string`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /key-stages/\{keyStage\}/subject/\{subject\}/lessons

> **/key-stages/\{keyStage\}/subject/\{subject\}/lessons**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:265

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lessons
This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### get.parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.limit?

> `optional` **limit**: `number`

##### get.parameters.query.offset?

> `optional` **offset**: `number`

##### get.parameters.query.unit?

> `optional` **unit**: `string`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /key-stages/\{keyStage\}/subject/\{subject\}/questions

> **/key-stages/\{keyStage\}/subject/\{subject\}/questions**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:345

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Quiz questions by subject and key stage
This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### get.parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.limit?

> `optional` **limit**: `number`

##### get.parameters.query.offset?

> `optional` **offset**: `number`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /key-stages/\{keyStage\}/subject/\{subject\}/units

> **/key-stages/\{keyStage\}/subject/\{subject\}/units**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:285

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Units
This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2'

##### get.parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /lessons/\{lesson\}/assets

> **/lessons/\{lesson\}/assets**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:103

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Downloadable lesson assets
This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.
This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.lesson

> **lesson**: `string`

The lesson slug identifier

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.assets?

> `optional` **assets**: `object`[]

List of assets

##### get.responses.200.content.application/json.attribution?

> `optional` **attribution**: `string`[]

Licence information for any third-party content contained in the lessons' downloadable resources

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /lessons/\{lesson\}/assets/\{type\}

> **/lessons/\{lesson\}/assets/\{type\}**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:124

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lesson asset by type
This endpoint will stream the downloadable asset for the given lesson and type.
There is no response returned for this endpoint as it returns a content attachment.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.lesson

> **lesson**: `string`

The lesson slug

##### get.parameters.path.type

> **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `unknown`

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /lessons/\{lesson\}/quiz

> **/lessons/\{lesson\}/quiz**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:305

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Quiz questions by lesson
The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.lesson

> **lesson**: `string`

The lesson slug identifier

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.exitQuiz

> **exitQuiz**: (\{ `answers`: (... \| ...)[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"match"`; \} \| \{ `answers`: ... & ...[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"order"`; \})[]

The exit quiz questions - which test on the knowledge learned in the lesson

##### get.responses.200.content.application/json.starterQuiz

> **starterQuiz**: (\{ `answers`: (... \| ...)[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"match"`; \} \| \{ `answers`: ... & ...[]; `question`: `string`; `questionImage?`: \{ `alt?`: ...; `attribution?`: ...; `height`: ...; `text?`: ...; `url`: ...; `width`: ...; \}; `questionType`: `"order"`; \})[]

The starter quiz questions - which test prior knowledge

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /lessons/\{lesson\}/summary

> **/lessons/\{lesson\}/summary**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:365

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lesson summary
This endpoint returns a summary for a given lesson

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.lesson

> **lesson**: `string`

The slug of the lesson

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.contentGuidance

> **contentGuidance**: `object`[] \| `null`

Full guidance about the types of lesson content for the teacher to consider (where appropriate)

##### get.responses.200.content.application/json.downloadsAvailable

> **downloadsAvailable**: `boolean`

Whether the lesson currently has any downloadable assets availableNote: this field reflects the current availability of downloadable assets, which reflects the availability of early-release content available for the hackathon. All lessons will eventually have downloadable assets available.

##### get.responses.200.content.application/json.keyLearningPoints

> **keyLearningPoints**: `object`[]

The lesson's key learning points

##### get.responses.200.content.application/json.keyStageSlug

> **keyStageSlug**: `string`

The key stage slug identifier

##### get.responses.200.content.application/json.keyStageTitle

> **keyStageTitle**: `string`

The key stage title

##### get.responses.200.content.application/json.lessonKeywords

> **lessonKeywords**: `object`[]

The lesson's keywords and their descriptions

##### get.responses.200.content.application/json.lessonTitle

> **lessonTitle**: `string`

The lesson title

##### get.responses.200.content.application/json.misconceptionsAndCommonMistakes

> **misconceptionsAndCommonMistakes**: `object`[]

The lesson’s anticipated common misconceptions and suggested teacher responses

##### get.responses.200.content.application/json.pupilLessonOutcome?

> `optional` **pupilLessonOutcome**: `string`

Suggested teacher response to a common misconception

##### get.responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### get.responses.200.content.application/json.subjectTitle

> **subjectTitle**: `string`

The subject slug identifier

##### get.responses.200.content.application/json.supervisionLevel

> **supervisionLevel**: `string` \| `null`

The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information.

##### get.responses.200.content.application/json.teacherTips

> **teacherTips**: `object`[]

Helpful teaching tips for the lesson

##### get.responses.200.content.application/json.unitSlug

> **unitSlug**: `string`

The unit slug identifier

##### get.responses.200.content.application/json.unitTitle

> **unitTitle**: `string`

The unit title

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /lessons/\{lesson\}/transcript

> **/lessons/\{lesson\}/transcript**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:22

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lesson transcript
This endpoint returns the video transcript and video captions file for a given lesson.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.lesson

> **lesson**: `string`

The slug of the lesson

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.transcript

> **transcript**: `string`

The transcript for the lesson video

##### get.responses.200.content.application/json.vtt

> **vtt**: `string`

The contents of the .vtt file for the lesson video, which maps captions to video timestamps.

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

##### get.responses.404

> **404**: `object`

Temporary: Documented locally until the upstream schema captures this legitimate 404 response.

    Lessons without accompanying video content legitimately return HTTP 404 so callers can distinguish "no transcript available" from invalid lesson slugs.

    Tracking: .agent/plans/upstream-api-metadata-wishlist.md item #4

##### get.responses.404.content

> **content**: `object`

##### get.responses.404.content.application/json

> **application/json**: `object`

###### Example

```ts
{
      "message": "Transcript not available for this query",
      "code": "NOT_FOUND",
      "data": {
        "code": "NOT_FOUND",
        "httpStatus": 404,
        "path": "getLessonTranscript.getLessonTranscript",
        "zodError": null
      }
    }
```

##### get.responses.404.content.application/json.code

> **code**: `string`

API error code describing the failure classification.

###### Example

```ts
NOT_FOUND;
```

##### get.responses.404.content.application/json.data

> **data**: `object`

Additional metadata describing the failure as emitted by the Oak API gateway.

##### get.responses.404.content.application/json.data.code

> **code**: `string`

Reiterated error code for downstream tools.

###### Example

```ts
NOT_FOUND;
```

##### get.responses.404.content.application/json.data.httpStatus

> **httpStatus**: `number`

HTTP status code returned by the upstream API.

###### Example

```ts
404;
```

##### get.responses.404.content.application/json.data.path

> **path**: `string`

Identifier of the upstream operation emitting the error.

###### Example

```ts
getLessonTranscript.getLessonTranscript;
```

##### get.responses.404.content.application/json.data.zodError?

> `optional` **zodError**: `null`

Optional validation payload describing schema mismatches. Always null for 404 responses.

###### Example

```ts
null;
```

##### get.responses.404.content.application/json.message

> **message**: `string`

Human-readable message describing why the resource is unavailable.

###### Example

```ts
Transcript not available for this query
```

##### get.responses.404.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /rate-limit

> **/rate-limit**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:499

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Check your current rate limit status (note that your rate limit is also included in the headers of every response).

    This specific endpoint does not cost any requests.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.limit

> **limit**: `number`

The maximum number of requests you can make in the current window.

###### Example

```ts
1000;
```

##### get.responses.200.content.application/json.remaining

> **remaining**: `number`

The number of requests remaining in the current window.

###### Example

```ts
953;
```

##### get.responses.200.content.application/json.reset

> **reset**: `number`

The time at which the current window resets, in milliseconds since the Unix epoch.

###### Example

```ts
1740164400000;
```

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /search/lessons

> **/search/lessons**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:385

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lesson search using lesson title
Search for a term and find the 20 most similar lessons with titles that contain similar text.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query

> **query**: `object`

##### get.parameters.query.keyStage?

> `optional` **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

##### get.parameters.query.q

> **q**: `string`

Search query text snippet

##### get.parameters.query.subject?

> `optional` **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

##### get.parameters.query.unit?

> `optional` **unit**: `string`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /search/transcripts

> **/search/transcripts**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:42

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Lesson search using lesson video transcripts
Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query

> **query**: `object`

##### get.parameters.query.q

> **q**: `string`

A snippet of text to search for in the lesson video transcripts

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /sequences/\{sequence\}/assets

> **/sequences/\{sequence\}/assets**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:62

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Assets within a sequence
This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.
This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

##### get.parameters.query.year?

> `optional` **year**: `number`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /sequences/\{sequence\}/questions

> **/sequences/\{sequence\}/questions**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:325

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Questions within a sequence
This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.limit?

> `optional` **limit**: `number`

##### get.parameters.query.offset?

> `optional` **offset**: `number`

##### get.parameters.query.year?

> `optional` **year**: `number`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /sequences/\{sequence\}/units

> **/sequences/\{sequence\}/units**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Units within a sequence
This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### get.parameters.query?

> `optional` **query**: `object`

##### get.parameters.query.year?

> `optional` **year**: `"1"` \| `"2"` \| `"3"` \| `"4"` \| `"5"` \| `"6"` \| `"7"` \| `"8"` \| `"9"` \| `"10"` \| `"11"` \| `"all-years"`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: (\{ `canonicalUrl?`: `string`; `title?`: `string`; `units`: (\{ `categories?`: ...; `threads?`: ...; `unitOptions`: ...; `unitOrder`: ...; `unitTitle`: ...; \} \| \{ `categories?`: ...; `threads?`: ...; `unitOrder`: ...; `unitSlug`: ...; `unitTitle`: ...; \})[]; `year`: `number` \| `"all-years"`; \} \| \{ `canonicalUrl?`: `string`; `examSubjects`: (\{ `examSubjectSlug?`: ...; `examSubjectTitle`: ...; `tiers`: ...; \} \| \{ `examSubjectSlug?`: ...; `examSubjectTitle`: ...; `units`: ...; \})[]; `title?`: `string`; `year`: `number`; \} \| \{ `canonicalUrl?`: `string`; `tiers`: `object`[]; `title?`: `string`; `year`: `number`; \})[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /subjects

> **/subjects**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:145

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Subjects
This endpoint returns an array of all available subjects and their associated sequences, key stages and years.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /subjects/\{subject\}

> **/subjects/\{subject\}**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:165

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Subject
This endpoint returns the sequences, key stages and years that are currently available for a given subject.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.subject

> **subject**: `string`

The slug identifier for the subject

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.keyStages

> **keyStages**: `object`[]

The key stage slug identifiers for which this subject has content available for.

##### get.responses.200.content.application/json.sequenceSlugs

> **sequenceSlugs**: `object`[]

Information about the years, key stages and key stage 4 variance for each sequence

##### get.responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### get.responses.200.content.application/json.subjectTitle

> **subjectTitle**: `string`

The subject title

##### get.responses.200.content.application/json.years

> **years**: `number`[]

The years for which this subject has content available for

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /subjects/\{subject\}/key-stages

> **/subjects/\{subject\}/key-stages**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:205

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Key stages within a subject
This endpoint returns a list of key stages that are currently available for a given subject.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.subject

> **subject**: `string`

The subject slug identifier

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /subjects/\{subject\}/sequences

> **/subjects/\{subject\}/sequences**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:185

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Sequencing information for a given subject
This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.subject

> **subject**: `string`

The slug identifier for the subject

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /subjects/\{subject\}/years

> **/subjects/\{subject\}/years**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:225

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Year groups for a given subject
This endpoint returns an array of years that are currently available for a given subject.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.subject

> **subject**: `string`

Subject slug to filter by

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `number`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /threads

> **/threads**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:425

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Threads
This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path?

> `optional` **path**: `undefined`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /threads/\{threadSlug\}/units

> **/threads/\{threadSlug\}/units**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:445

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Units belonging to a given thread
This endpoint returns all of the units that belong to a given thread.

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.threadSlug

> **threadSlug**: `string`

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`[]

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`

---

### /units/\{unit\}/summary

> **/units/\{unit\}/summary**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:405

#### delete?

> `optional` **delete**: `undefined`

#### get

> **get**: `object`

Unit summary
This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit

##### get.parameters

> **parameters**: `object`

##### get.parameters.cookie?

> `optional` **cookie**: `undefined`

##### get.parameters.header?

> `optional` **header**: `undefined`

##### get.parameters.path

> **path**: `object`

##### get.parameters.path.unit

> **unit**: `string`

The unit slug

##### get.parameters.query?

> `optional` **query**: `undefined`

##### get.requestBody?

> `optional` **requestBody**: `undefined`

##### get.responses

> **responses**: `object`

##### get.responses.200

> **200**: `object`

Successful response

##### get.responses.200.content

> **content**: `object`

##### get.responses.200.content.application/json

> **application/json**: `object`

##### get.responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### get.responses.200.content.application/json.categories?

> `optional` **categories**: `object`[]

The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.

##### get.responses.200.content.application/json.description?

> `optional` **description**: `string`

A short description of the unit. Not yet available for all subjects.

##### get.responses.200.content.application/json.keyStageSlug

> **keyStageSlug**: `string`

The slug identifier for the the key stage to which the unit belongs

###### Example

```ts
ks2;
```

##### get.responses.200.content.application/json.nationalCurriculumContent

> **nationalCurriculumContent**: `string`[]

National curriculum attainment statements covered in this unit

###### Example

```ts
[
  'Ask relevant questions to extend their understanding and knowledge',
  'Articulate and justify answers, arguments and opinions',
  'Speak audibly and fluently with an increasing command of Standard English',
];
```

##### get.responses.200.content.application/json.notes?

> `optional` **notes**: `string`

Unit summary notes

##### get.responses.200.content.application/json.phaseSlug

> **phaseSlug**: `string`

The slug identifier for the phase to which the unit belongs

###### Example

```ts
primary;
```

##### get.responses.200.content.application/json.priorKnowledgeRequirements

> **priorKnowledgeRequirements**: `string`[]

The prior knowledge required for the unit

###### Example

```ts
[
  'A simple sentence is about one idea and makes complete sense.',
  'Any simple sentence contains one verb and at least one noun.',
  'Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence.',
];
```

##### get.responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject identifier

###### Example

```ts
english;
```

##### get.responses.200.content.application/json.threads?

> `optional` **threads**: `object`[]

The threads that are associated with the unit

###### Example

```ts
[
  {
    slug: 'developing-grammatical-knowledge',
    title: 'Developing grammatical knowledge',
    order: 10,
  },
];
```

##### get.responses.200.content.application/json.unitLessons

> **unitLessons**: `object`[]

##### get.responses.200.content.application/json.unitSlug

> **unitSlug**: `string`

The unit slug identifier

###### Example

```ts
simple - compound - and - adverbial - complex - sentences;
```

##### get.responses.200.content.application/json.unitTitle

> **unitTitle**: `string`

The unit title

###### Example

```ts
Simple, compound and adverbial complex sentences
```

##### get.responses.200.content.application/json.whyThisWhyNow?

> `optional` **whyThisWhyNow**: `string`

An explanation of where the unit sits within the sequence and why it has been placed there.

##### get.responses.200.content.application/json.year

> **year**: `string` \| `number`

The year to which the unit belongs

###### Example

```ts
3;
```

##### get.responses.200.content.application/json.yearSlug

> **yearSlug**: `string`

The slug identifier for the year to which the unit belongs

###### Example

```ts
year - 3;
```

##### get.responses.200.headers?

> `optional` **headers**: `undefined`

#### head?

> `optional` **head**: `undefined`

#### options?

> `optional` **options**: `undefined`

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query?

> `optional` **query**: `undefined`

#### patch?

> `optional` **patch**: `undefined`

#### post?

> `optional` **post**: `undefined`

#### put?

> `optional` **put**: `undefined`

#### trace?

> `optional` **trace**: `undefined`
