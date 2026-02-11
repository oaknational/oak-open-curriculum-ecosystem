[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/api-schema/api-paths-types](../README.md) / operations

# Interface: operations

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:2964](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L2964)

## Properties

### changelog-changelog

> **changelog-changelog**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3531](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3531)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### changelog-latest

> **changelog-latest**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3553](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3553)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.changes

> **changes**: `string`[]

##### responses.200.content.application/json.date

> **date**: `string`

##### responses.200.content.application/json.version

> **version**: `string`

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits

> **getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3332](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3332)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2'

##### parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getAssets-getLessonAsset

> **getAssets-getLessonAsset**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3162](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3162)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.lesson

> **lesson**: `string`

The lesson slug

##### parameters.path.type

> **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `unknown`

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getAssets-getLessonAssets

> **getAssets-getLessonAssets**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3139](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3139)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.lesson

> **lesson**: `string`

The lesson slug identifier

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.assets?

> `optional` **assets**: `object`[]

List of assets

##### responses.200.content.application/json.attribution?

> `optional` **attribution**: `string`[]

Licence information for any third-party content contained in the lessons' downloadable resources

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getAssets-getSequenceAssets

> **getAssets-getSequenceAssets**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3089](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3089)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

##### parameters.query.year?

> `optional` **year**: `number`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getAssets-getSubjectAssets

> **getAssets-getSubjectAssets**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3113](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3113)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.type?

> `optional` **type**: `"slideDeck"` \| `"exitQuiz"` \| `"exitQuizAnswers"` \| `"starterQuiz"` \| `"starterQuizAnswers"` \| `"supplementaryResource"` \| `"video"` \| `"worksheet"` \| `"worksheetAnswers"`

##### parameters.query.unit?

> `optional` **unit**: `string`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getKeyStages-getKeyStages

> **getKeyStages-getKeyStages**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3287](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3287)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getKeyStageSubjectLessons-getKeyStageSubjectLessons

> **getKeyStageSubjectLessons-getKeyStageSubjectLessons**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3305](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3305)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.limit?

> `optional` **limit**: `number`

##### parameters.query.offset?

> `optional` **offset**: `number`

##### parameters.query.unit?

> `optional` **unit**: `string`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getLessons-getLesson

> **getLessons-getLesson**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3427](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3427)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.lesson

> **lesson**: `string`

The slug of the lesson

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.contentGuidance

> **contentGuidance**: `object`[] \| `null`

Full guidance about the types of lesson content for the teacher to consider (where appropriate)

##### responses.200.content.application/json.downloadsAvailable

> **downloadsAvailable**: `boolean`

Whether the lesson currently has any downloadable assets availableNote: this field reflects the current availability of downloadable assets, which reflects the availability of early-release content available for the hackathon. All lessons will eventually have downloadable assets available.

##### responses.200.content.application/json.keyLearningPoints

> **keyLearningPoints**: `object`[]

The lesson's key learning points

##### responses.200.content.application/json.keyStageSlug

> **keyStageSlug**: `string`

The key stage slug identifier

##### responses.200.content.application/json.keyStageTitle

> **keyStageTitle**: `string`

The key stage title

##### responses.200.content.application/json.lessonKeywords

> **lessonKeywords**: `object`[]

The lesson's keywords and their descriptions

##### responses.200.content.application/json.lessonTitle

> **lessonTitle**: `string`

The lesson title

##### responses.200.content.application/json.misconceptionsAndCommonMistakes

> **misconceptionsAndCommonMistakes**: `object`[]

The lesson’s anticipated common misconceptions and suggested teacher responses

##### responses.200.content.application/json.pupilLessonOutcome?

> `optional` **pupilLessonOutcome**: `string`

Suggested teacher response to a common misconception

##### responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### responses.200.content.application/json.subjectTitle

> **subjectTitle**: `string`

The subject slug identifier

##### responses.200.content.application/json.supervisionLevel

> **supervisionLevel**: `string` \| `null`

The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information.

##### responses.200.content.application/json.teacherTips

> **teacherTips**: `object`[]

Helpful teaching tips for the lesson

##### responses.200.content.application/json.unitSlug

> **unitSlug**: `string`

The unit slug identifier

##### responses.200.content.application/json.unitTitle

> **unitTitle**: `string`

The unit title

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getLessons-searchByTextSimilarity

> **getLessons-searchByTextSimilarity**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3448](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3448)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query

> **query**: `object`

##### parameters.query.keyStage?

> `optional` **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

##### parameters.query.q

> **q**: `string`

Search query text snippet

##### parameters.query.subject?

> `optional` **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

##### parameters.query.unit?

> `optional` **unit**: `string`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getLessonTranscript-getLessonTranscript

> **getLessonTranscript-getLessonTranscript**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:2988](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L2988)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.lesson

> **lesson**: `string`

The slug of the lesson

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.transcript

> **transcript**: `string`

The transcript for the lesson video

##### responses.200.content.application/json.vtt

> **vtt**: `string`

The contents of the .vtt file for the lesson video, which maps captions to video timestamps.

##### responses.200.headers?

> `optional` **headers**: `undefined`

##### responses.404

> **404**: `object`

Temporary: Documented locally until the upstream schema captures this legitimate 404 response.

    Lessons without accompanying video content legitimately return HTTP 404 so callers can distinguish "no transcript available" from invalid lesson slugs.

    Tracking: .agent/plans/upstream-api-metadata-wishlist.md item #4

##### responses.404.content

> **content**: `object`

##### responses.404.content.application/json

> **application/json**: `object`

###### Example

```ts
{
                     *       "message": "Transcript not available for this query",
                     *       "code": "NOT_FOUND",
                     *       "data": {
                     *         "code": "NOT_FOUND",
                     *         "httpStatus": 404,
                     *         "path": "getLessonTranscript.getLessonTranscript",
                     *         "zodError": null
                     *       }
                     *     }
```

##### responses.404.content.application/json.code

> **code**: `string`

API error code describing the failure classification.

###### Example

```ts
NOT_FOUND
```

##### responses.404.content.application/json.data

> **data**: `object`

Additional metadata describing the failure as emitted by the Oak API gateway.

##### responses.404.content.application/json.data.code

> **code**: `string`

Reiterated error code for downstream tools.

###### Example

```ts
NOT_FOUND
```

##### responses.404.content.application/json.data.httpStatus

> **httpStatus**: `number`

HTTP status code returned by the upstream API.

###### Example

```ts
404
```

##### responses.404.content.application/json.data.path

> **path**: `string`

Identifier of the upstream operation emitting the error.

###### Example

```ts
getLessonTranscript.getLessonTranscript
```

##### responses.404.content.application/json.data.zodError?

> `optional` **zodError**: `null`

Optional validation payload describing schema mismatches. Always null for 404 responses.

###### Example

```ts
null
```

##### responses.404.content.application/json.message

> **message**: `string`

Human-readable message describing why the resource is unavailable.

###### Example

```ts
Transcript not available for this query
```

##### responses.404.headers?

> `optional` **headers**: `undefined`

***

### getQuestions-getQuestionsForKeyStageAndSubject

> **getQuestions-getQuestionsForKeyStageAndSubject**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3401](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3401)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.keyStage

> **keyStage**: `"ks1"` \| `"ks2"` \| `"ks3"` \| `"ks4"`

Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase

##### parameters.path.subject

> **subject**: `"art"` \| `"citizenship"` \| `"computing"` \| `"cooking-nutrition"` \| `"design-technology"` \| `"english"` \| `"french"` \| `"geography"` \| `"german"` \| `"history"` \| `"maths"` \| `"music"` \| `"physical-education"` \| `"religious-education"` \| `"rshe-pshe"` \| `"science"` \| `"spanish"`

Subject slug to search by, e.g. 'science' - note that casing is important here

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.limit?

> `optional` **limit**: `number`

##### parameters.query.offset?

> `optional` **offset**: `number`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getQuestions-getQuestionsForLessons

> **getQuestions-getQuestionsForLessons**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3355](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3355)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.lesson

> **lesson**: `string`

The lesson slug identifier

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.exitQuiz

> **exitQuiz**: (\{ `answers`: (\{ `content`: ...; `distractor`: ...; `type`: ...; \} \| \{ `content`: ...; `distractor`: ...; `type`: ...; \})[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"match"`; \} \| \{ `answers`: `object` & `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"order"`; \})[]

The exit quiz questions - which test on the knowledge learned in the lesson

##### responses.200.content.application/json.starterQuiz

> **starterQuiz**: (\{ `answers`: (\{ `content`: ...; `distractor`: ...; `type`: ...; \} \| \{ `content`: ...; `distractor`: ...; `type`: ...; \})[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"match"`; \} \| \{ `answers`: `object` & `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: ... \| ...; `attribution?`: ... \| ...; `height`: `number`; `text?`: ... \| ...; `url`: `string`; `width`: `number`; \}; `questionType`: `"order"`; \})[]

The starter quiz questions - which test prior knowledge

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getQuestions-getQuestionsForSequence

> **getQuestions-getQuestionsForSequence**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3376](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3376)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.limit?

> `optional` **limit**: `number`

##### parameters.query.offset?

> `optional` **offset**: `number`

##### parameters.query.year?

> `optional` **year**: `number`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getRateLimit-getRateLimit

> **getRateLimit-getRateLimit**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3575](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3575)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.limit

> **limit**: `number`

The maximum number of requests you can make in the current window.

###### Example

```ts
1000
```

##### responses.200.content.application/json.remaining

> **remaining**: `number`

The number of requests remaining in the current window.

###### Example

```ts
953
```

##### responses.200.content.application/json.reset

> **reset**: `number`

The time at which the current window resets, in milliseconds since the Unix epoch.

###### Example

```ts
1740164400000
```

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSequences-getSequenceUnits

> **getSequences-getSequenceUnits**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:2965](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L2965)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.sequence

> **sequence**: `string`

The sequence slug identifier, including the key stage 4 option where relevant.

##### parameters.query?

> `optional` **query**: `object`

##### parameters.query.year?

> `optional` **year**: `"1"` \| `"2"` \| `"3"` \| `"4"` \| `"5"` \| `"6"` \| `"7"` \| `"8"` \| `"9"` \| `"10"` \| `"11"` \| `"all-years"`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: (\{ `canonicalUrl?`: `string`; `title?`: `string`; `units`: (\{ `categories?`: ... \| ...; `threads?`: ... \| ...; `unitOptions`: ...[]; `unitOrder`: `number`; `unitTitle`: `string`; \} \| \{ `categories?`: ... \| ...; `threads?`: ... \| ...; `unitOrder`: `number`; `unitSlug`: `string`; `unitTitle`: `string`; \})[]; `year`: `number` \| `"all-years"`; \} \| \{ `canonicalUrl?`: `string`; `examSubjects`: (\{ `examSubjectSlug?`: ... \| ...; `examSubjectTitle`: `string`; `tiers`: ...[]; \} \| \{ `examSubjectSlug?`: ... \| ...; `examSubjectTitle`: `string`; `units`: ...[]; \})[]; `title?`: `string`; `year`: `number`; \} \| \{ `canonicalUrl?`: `string`; `tiers`: `object`[]; `title?`: `string`; `year`: `number`; \})[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSubjects-getAllSubjects

> **getSubjects-getAllSubjects**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3185](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3185)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSubjects-getSubject

> **getSubjects-getSubject**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3203](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3203)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.subject

> **subject**: `string`

The slug identifier for the subject

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.keyStages

> **keyStages**: `object`[]

The key stage slug identifiers for which this subject has content available for.

##### responses.200.content.application/json.sequenceSlugs

> **sequenceSlugs**: `object`[]

Information about the years, key stages and key stage 4 variance for each sequence

##### responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### responses.200.content.application/json.subjectTitle

> **subjectTitle**: `string`

The subject title

##### responses.200.content.application/json.years

> **years**: `number`[]

The years for which this subject has content available for

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSubjects-getSubjectKeyStages

> **getSubjects-getSubjectKeyStages**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3245](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3245)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.subject

> **subject**: `string`

The subject slug identifier

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSubjects-getSubjectSequence

> **getSubjects-getSubjectSequence**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3224](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3224)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.subject

> **subject**: `string`

The slug identifier for the subject

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getSubjects-getSubjectYears

> **getSubjects-getSubjectYears**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3266](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3266)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.subject

> **subject**: `string`

Subject slug to filter by

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `number`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getThreads-getAllThreads

> **getThreads-getAllThreads**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3493](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3493)

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

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getThreads-getThreadUnits

> **getThreads-getThreadUnits**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3511](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3511)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.threadSlug

> **threadSlug**: `string`

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### getUnits-getUnit

> **getUnits-getUnit**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3472](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3472)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path

> **path**: `object`

##### parameters.path.unit

> **unit**: `string`

The unit slug

##### parameters.query?

> `optional` **query**: `undefined`

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`

##### responses.200.content.application/json.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### responses.200.content.application/json.categories?

> `optional` **categories**: `object`[]

The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.

##### responses.200.content.application/json.description?

> `optional` **description**: `string`

A short description of the unit. Not yet available for all subjects.

##### responses.200.content.application/json.keyStageSlug

> **keyStageSlug**: `string`

The slug identifier for the the key stage to which the unit belongs

###### Example

```ts
ks2
```

##### responses.200.content.application/json.nationalCurriculumContent

> **nationalCurriculumContent**: `string`[]

National curriculum attainment statements covered in this unit

###### Example

```ts
[
      "Ask relevant questions to extend their understanding and knowledge",
      "Articulate and justify answers, arguments and opinions",
      "Speak audibly and fluently with an increasing command of Standard English"
    ]
```

##### responses.200.content.application/json.notes?

> `optional` **notes**: `string`

Unit summary notes

##### responses.200.content.application/json.phaseSlug

> **phaseSlug**: `string`

The slug identifier for the phase to which the unit belongs

###### Example

```ts
primary
```

##### responses.200.content.application/json.priorKnowledgeRequirements

> **priorKnowledgeRequirements**: `string`[]

The prior knowledge required for the unit

###### Example

```ts
[
      "A simple sentence is about one idea and makes complete sense.",
      "Any simple sentence contains one verb and at least one noun.",
      "Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence."
    ]
```

##### responses.200.content.application/json.subjectSlug

> **subjectSlug**: `string`

The subject identifier

###### Example

```ts
english
```

##### responses.200.content.application/json.threads?

> `optional` **threads**: `object`[]

The threads that are associated with the unit

###### Example

```ts
[
      {
        "slug": "developing-grammatical-knowledge",
        "title": "Developing grammatical knowledge",
        "order": 10
      }
    ]
```

##### responses.200.content.application/json.unitLessons

> **unitLessons**: `object`[]

##### responses.200.content.application/json.unitSlug

> **unitSlug**: `string`

The unit slug identifier

###### Example

```ts
simple-compound-and-adverbial-complex-sentences
```

##### responses.200.content.application/json.unitTitle

> **unitTitle**: `string`

The unit title

###### Example

```ts
Simple, compound and adverbial complex sentences
```

##### responses.200.content.application/json.whyThisWhyNow?

> `optional` **whyThisWhyNow**: `string`

An explanation of where the unit sits within the sequence and why it has been placed there.

##### responses.200.content.application/json.year

> **year**: `string` \| `number`

The year to which the unit belongs

###### Example

```ts
3
```

##### responses.200.content.application/json.yearSlug

> **yearSlug**: `string`

The slug identifier for the year to which the unit belongs

###### Example

```ts
year-3
```

##### responses.200.headers?

> `optional` **headers**: `undefined`

***

### searchTranscripts-searchTranscripts

> **searchTranscripts-searchTranscripts**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts:3068](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-paths-types.ts#L3068)

#### parameters

> **parameters**: `object`

##### parameters.cookie?

> `optional` **cookie**: `undefined`

##### parameters.header?

> `optional` **header**: `undefined`

##### parameters.path?

> `optional` **path**: `undefined`

##### parameters.query

> **query**: `object`

##### parameters.query.q

> **q**: `string`

A snippet of text to search for in the lesson video transcripts

#### requestBody?

> `optional` **requestBody**: `undefined`

#### responses

> **responses**: `object`

##### responses.200

> **200**: `object`

Successful response

##### responses.200.content

> **content**: `object`

##### responses.200.content.application/json

> **application/json**: `object`[]

##### responses.200.headers?

> `optional` **headers**: `undefined`
