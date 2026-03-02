[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / components

# Interface: components

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:522

## Properties

### headers

> **headers**: `never`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2930

---

### parameters

> **parameters**: `never`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2928

---

### pathItems

> **pathItems**: `never`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2931

---

### requestBodies

> **requestBodies**: `never`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2929

---

### responses

> **responses**: `never`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:2927

---

### schemas

> **schemas**: `object`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/api-paths-types.d.ts:523

#### AllKeyStageAndSubjectUnitsResponseSchema

> **AllKeyStageAndSubjectUnitsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    units: [
      {
        unitSlug: '2-4-and-8-times-tables-using-times-tables-to-solve-problems',
        unitTitle: '2, 4 and 8 times tables: using times tables to solve problems',
      },
      {
        unitSlug: 'bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10',
        unitTitle: 'Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10',
      },
    ],
    yearSlug: 'year-3',
    yearTitle: 'Year 3',
  },
];
```

#### AllSubjectsResponseSchema

> **AllSubjectsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    subjectTitle: 'Art and design',
    subjectSlug: 'art',
    sequenceSlugs: [
      {
        sequenceSlug: 'art-primary',
        years: [1, 2, 3, 4, 5, 6],
        keyStages: [
          {
            keyStageTitle: 'Key Stage 1',
            keyStageSlug: 'ks1',
          },
          {
            keyStageTitle: 'Key Stage 2',
            keyStageSlug: 'ks2',
          },
        ],
        phaseSlug: 'primary',
        phaseTitle: 'Primary',
        ks4Options: null,
      },
      {
        sequenceSlug: 'art-secondary',
        years: [7, 8, 9, 10, 11],
        keyStages: [
          {
            keyStageTitle: 'Key Stage 3',
            keyStageSlug: 'ks3',
          },
          {
            keyStageTitle: 'Key Stage 4',
            keyStageSlug: 'ks4',
          },
        ],
        phaseSlug: 'secondary',
        phaseTitle: 'Secondary',
        ks4Options: null,
      },
    ],
    years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    keyStages: [
      {
        keyStageTitle: 'Key Stage 1',
        keyStageSlug: 'ks1',
      },
      {
        keyStageTitle: 'Key Stage 2',
        keyStageSlug: 'ks2',
      },
      {
        keyStageTitle: 'Key Stage 3',
        keyStageSlug: 'ks3',
      },
      {
        keyStageTitle: 'Key Stage 4',
        keyStageSlug: 'ks4',
      },
    ],
  },
];
```

#### AllThreadsResponseSchema

> **AllThreadsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    title: 'Number: Multiplication and division',
    slug: 'number-multiplication-and-division',
  },
];
```

#### KeyStageResponseSchema

> **KeyStageResponseSchema**: `object`[]

##### Example

```ts
[
  {
    slug: 'ks1',
    title: 'Key Stage 1',
  },
];
```

#### KeyStageSubjectLessonsResponseSchema

> **KeyStageSubjectLessonsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    unitSlug: 'simple-compound-and-adverbial-complex-sentences',
    unitTitle: 'Simple, compound and adverbial complex sentences',
    lessons: [
      {
        lessonSlug: 'four-types-of-simple-sentence',
        lessonTitle: 'Four types of simple sentence',
      },
      {
        lessonSlug: 'three-ways-for-co-ordination-in-compound-sentences',
        lessonTitle: 'Three ways for co-ordination in compound sentences',
      },
    ],
  },
];
```

#### LessonAssetResponseSchema

> **LessonAssetResponseSchema**: `unknown`

##### Example

```ts
{
}
```

#### LessonAssetsResponseSchema

> **LessonAssetsResponseSchema**: `object`

##### Example

```ts
{
      "attribution": [
        "Copyright XYZ Authors",
        "Creative Commons Attribution Example 4.0"
      ],
      "assets": [
        {
          "label": "Worksheet",
          "type": "worksheet",
          "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
        },
        {
          "label": "Worksheet Answers",
          "type": "worksheetAnswers",
          "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
        },
        {
          "label": "Video",
          "type": "video",
          "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
        }
      ]
    }
```

##### LessonAssetsResponseSchema.assets?

> `optional` **assets**: `object`[]

List of assets

##### LessonAssetsResponseSchema.attribution?

> `optional` **attribution**: `string`[]

Licence information for any third-party content contained in the lessons' downloadable resources

##### LessonAssetsResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

#### LessonSearchResponseSchema

> **LessonSearchResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonSlug: 'performing-your-chosen-gothic-poem',
    lessonTitle: 'Performing your chosen Gothic poem',
    similarity: 0.20588236,
    units: [
      {
        unitSlug: 'gothic-poetry',
        unitTitle: 'Gothic poetry',
        examBoardTitle: null,
        keyStageSlug: 'ks3',
        subjectSlug: 'english',
      },
    ],
  },
  {
    lessonSlug: 'the-twisted-tree-the-novel-as-a-gothic-text',
    lessonTitle: "'The Twisted Tree': the novel as a Gothic text",
    similarity: 0.19444445,
    units: [
      {
        unitSlug: 'the-twisted-tree-fiction-reading',
        unitTitle: "'The Twisted Tree': fiction reading",
        examBoardTitle: null,
        keyStageSlug: 'ks3',
        subjectSlug: 'english',
      },
    ],
  },
];
```

#### LessonSummaryResponseSchema

> **LessonSummaryResponseSchema**: `object`

##### Example

```ts
{
      "lessonTitle": "Joining using 'and'",
      "unitSlug": "simple-sentences",
      "unitTitle": "Simple sentences",
      "subjectSlug": "english",
      "subjectTitle": "English",
      "keyStageSlug": "ks1",
      "keyStageTitle": "Key Stage 1",
      "lessonKeywords": [
        {
          "keyword": "joining word",
          "description": "a word that joins words or ideas"
        },
        {
          "keyword": "build on",
          "description": "add to"
        },
        {
          "keyword": "related",
          "description": "linked to"
        }
      ],
      "keyLearningPoints": [
        {
          "keyLearningPoint": "And is a type of joining word."
        },
        {
          "keyLearningPoint": "A joining word can join two simple sentences."
        },
        {
          "keyLearningPoint": "Each simple sentence is about one idea and makes complete sense."
        },
        {
          "keyLearningPoint": "The second idea builds on to the first idea if ‘and’ is used to join them."
        },
        {
          "keyLearningPoint": "Grammatically accurate sentences start with capital letters and most often end with full stops."
        }
      ],
      "misconceptionsAndCommonMistakes": [
        {
          "misconception": "Pupils may struggle to link related ideas together.",
          "response": "Give some non-examples to show what it sounds like when two ideas are unrelated e.g. Dad baked bread and she missed her sister."
        }
      ],
      "pupilLessonOutcome": "I can join two simple sentences with 'and'.",
      "teacherTips": [
        {
          "teacherTip": "In Learning Cycle 1, make sure pupils are given plenty of opportunities to say sentences orally and hear that they make complete sense."
        }
      ],
      "contentGuidance": null,
      "supervisionLevel": null,
      "downloadsAvailable": true
    }
```

##### LessonSummaryResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### LessonSummaryResponseSchema.contentGuidance

> **contentGuidance**: `object`[] \| `null`

Full guidance about the types of lesson content for the teacher to consider (where appropriate)

##### LessonSummaryResponseSchema.downloadsAvailable

> **downloadsAvailable**: `boolean`

Whether the lesson currently has any downloadable assets availableNote: this field reflects the current availability of downloadable assets, which reflects the availability of early-release content available for the hackathon. All lessons will eventually have downloadable assets available.

##### LessonSummaryResponseSchema.keyLearningPoints

> **keyLearningPoints**: `object`[]

The lesson's key learning points

##### LessonSummaryResponseSchema.keyStageSlug

> **keyStageSlug**: `string`

The key stage slug identifier

##### LessonSummaryResponseSchema.keyStageTitle

> **keyStageTitle**: `string`

The key stage title

##### LessonSummaryResponseSchema.lessonKeywords

> **lessonKeywords**: `object`[]

The lesson's keywords and their descriptions

##### LessonSummaryResponseSchema.lessonTitle

> **lessonTitle**: `string`

The lesson title

##### LessonSummaryResponseSchema.misconceptionsAndCommonMistakes

> **misconceptionsAndCommonMistakes**: `object`[]

The lesson’s anticipated common misconceptions and suggested teacher responses

##### LessonSummaryResponseSchema.pupilLessonOutcome?

> `optional` **pupilLessonOutcome**: `string`

Suggested teacher response to a common misconception

##### LessonSummaryResponseSchema.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### LessonSummaryResponseSchema.subjectTitle

> **subjectTitle**: `string`

The subject slug identifier

##### LessonSummaryResponseSchema.supervisionLevel

> **supervisionLevel**: `string` \| `null`

The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information.

##### LessonSummaryResponseSchema.teacherTips

> **teacherTips**: `object`[]

Helpful teaching tips for the lesson

##### LessonSummaryResponseSchema.unitSlug

> **unitSlug**: `string`

The unit slug identifier

##### LessonSummaryResponseSchema.unitTitle

> **unitTitle**: `string`

The unit title

#### QuestionForLessonsResponseSchema

> **QuestionForLessonsResponseSchema**: `object`

##### Example

```ts
{
      "starterQuiz": [
        {
          "question": "Tick the sentence with the correct punctuation.",
          "questionType": "multiple-choice",
          "answers": [
            {
              "distractor": true,
              "type": "text",
              "content": "the baby cried"
            },
            {
              "distractor": true,
              "type": "text",
              "content": "The baby cried"
            },
            {
              "distractor": false,
              "type": "text",
              "content": "The baby cried."
            },
            {
              "distractor": true,
              "type": "text",
              "content": "the baby cried."
            }
          ]
        }
      ],
      "exitQuiz": [
        {
          "question": "Which word is a verb?",
          "questionType": "multiple-choice",
          "answers": [
            {
              "distractor": true,
              "type": "text",
              "content": "shops"
            },
            {
              "distractor": true,
              "type": "text",
              "content": "Jun"
            },
            {
              "distractor": true,
              "type": "text",
              "content": "I"
            },
            {
              "distractor": false,
              "type": "text",
              "content": "shout"
            }
          ]
        }
      ]
    }
```

##### QuestionForLessonsResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### QuestionForLessonsResponseSchema.exitQuiz

> **exitQuiz**: (\{ `answers`: (\{ `content`: `string`; `distractor`: `boolean`; `type`: `"text"`; \} \| \{ `content`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `distractor`: `boolean`; `type`: `"image"`; \})[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"match"`; \} \| \{ `answers`: `object` & `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"order"`; \})[]

The exit quiz questions - which test on the knowledge learned in the lesson

##### QuestionForLessonsResponseSchema.starterQuiz

> **starterQuiz**: (\{ `answers`: (\{ `content`: `string`; `distractor`: `boolean`; `type`: `"text"`; \} \| \{ `content`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `distractor`: `boolean`; `type`: `"image"`; \})[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"multiple-choice"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"short-answer"`; \} \| \{ `answers`: `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"match"`; \} \| \{ `answers`: `object` & `object`[]; `question`: `string`; `questionImage?`: \{ `alt?`: `string`; `attribution?`: `string`; `height`: `number`; `text?`: `string`; `url`: `string`; `width`: `number`; \}; `questionType`: `"order"`; \})[]

The starter quiz questions - which test prior knowledge

#### QuestionsForKeyStageAndSubjectResponseSchema

> **QuestionsForKeyStageAndSubjectResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonSlug: 'predicting-the-size-of-a-product',
    lessonTitle: 'Predicting the size of a product',
    starterQuiz: [
      {
        question: 'Match the number to its written representation.',
        questionType: 'match',
        answers: [
          {
            matchOption: {
              type: 'text',
              content: 'seven tenths',
            },
            correctChoice: {
              type: 'text',
              content: '0.7',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: 'nine tenths',
            },
            correctChoice: {
              type: 'text',
              content: '0.9',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: 'seven ones',
            },
            correctChoice: {
              type: 'text',
              content: '7',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: 'seven hundredths',
            },
            correctChoice: {
              type: 'text',
              content: '0.07',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: 'nine hundredths',
            },
            correctChoice: {
              type: 'text',
              content: '0.09',
            },
          },
        ],
      },
    ],
    exitQuiz: [
      {
        question: 'Use the fact that 9 × 8 = 72, to match the expressions to their product.',
        questionType: 'match',
        answers: [
          {
            matchOption: {
              type: 'text',
              content: '9 × 80',
            },
            correctChoice: {
              type: 'text',
              content: '720',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: '9 × 800 ',
            },
            correctChoice: {
              type: 'text',
              content: '7,200',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: '9 × 0.8',
            },
            correctChoice: {
              type: 'text',
              content: '7.2',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: '9 × 0',
            },
            correctChoice: {
              type: 'text',
              content: '0',
            },
          },
          {
            matchOption: {
              type: 'text',
              content: '9 × 0.08',
            },
            correctChoice: {
              type: 'text',
              content: '0.72',
            },
          },
        ],
      },
    ],
  },
];
```

#### QuestionsForSequenceResponseSchema

> **QuestionsForSequenceResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonTitle: '3D shapes can be composed from 2D nets',
    lessonSlug: '3d-shapes-can-be-composed-from-2d-nets',
    starterQuiz: [
      {
        question: 'Select all of the names of shapes that are polygons.',
        questionType: 'multiple-choice',
        answers: [
          {
            type: 'text',
            content: 'Cube ',
            distractor: true,
          },
          {
            type: 'text',
            content: ' Square',
            distractor: false,
          },
          {
            type: 'text',
            content: 'Triangle',
            distractor: false,
          },
          {
            type: 'text',
            content: 'Semi-circle',
            distractor: true,
          },
        ],
      },
    ],
    exitQuiz: [
      {
        question: 'What is a net?',
        questionType: 'multiple-choice',
        answers: [
          {
            type: 'text',
            content: 'A 3D shape made of 2D shapes folded together. ',
            distractor: false,
          },
          {
            type: 'text',
            content: 'A 2D shape made of 3D shapes folded togehther.',
            distractor: true,
          },
          {
            type: 'text',
            content: 'A type of cube.',
            distractor: true,
          },
        ],
      },
    ],
  },
];
```

#### RateLimitResponseSchema

> **RateLimitResponseSchema**: `object`

##### Example

```ts
{
      "limit": 1000,
      "remaining": 953,
      "reset": 1740164400000
    }
```

##### RateLimitResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### RateLimitResponseSchema.limit

> **limit**: `number`

The maximum number of requests you can make in the current window.

###### Example

```ts
1000;
```

##### RateLimitResponseSchema.remaining

> **remaining**: `number`

The number of requests remaining in the current window.

###### Example

```ts
953;
```

##### RateLimitResponseSchema.reset

> **reset**: `number`

The time at which the current window resets, in milliseconds since the Unix epoch.

###### Example

```ts
1740164400000;
```

#### SearchTranscriptResponseSchema

> **SearchTranscriptResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonTitle: 'The Roman invasion of Britain ',
    lessonSlug: 'the-roman-invasion-of-britain',
    transcriptSnippet: 'The Romans were ready,',
  },
  {
    lessonTitle: 'The changes to life brought about by Roman settlement',
    lessonSlug: 'the-changes-to-life-brought-about-by-roman-settlement',
    transcriptSnippet: 'when the Romans came.',
  },
  {
    lessonTitle: "Boudica's rebellion against Roman rule",
    lessonSlug: 'boudicas-rebellion-against-roman-rule',
    transcriptSnippet: 'kings who resisted the Romans were,',
  },
  {
    lessonTitle: 'How far religion changed under Roman rule',
    lessonSlug: 'how-far-religion-changed-under-roman-rule',
    transcriptSnippet: 'for the Romans.',
  },
];
```

#### SequenceAssetsResponseSchema

> **SequenceAssetsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonSlug: 'using-numerals',
    lessonTitle: 'Using numerals',
    assets: [
      {
        label: 'Worksheet',
        type: 'worksheet',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet',
      },
      {
        label: 'Worksheet Answers',
        type: 'worksheetAnswers',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers',
      },
      {
        label: 'Video',
        type: 'video',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video',
      },
    ],
  },
];
```

#### SequenceUnitsResponseSchema

> **SequenceUnitsResponseSchema**: (\{ `canonicalUrl?`: `string`; `title?`: `string`; `units`: (\{ `categories?`: `object`[]; `threads?`: `object`[]; `unitOptions`: `object`[]; `unitOrder`: `number`; `unitTitle`: `string`; \} \| \{ `categories?`: `object`[]; `threads?`: `object`[]; `unitOrder`: `number`; `unitSlug`: `string`; `unitTitle`: `string`; \})[]; `year`: `number` \| `"all-years"`; \} \| \{ `canonicalUrl?`: `string`; `examSubjects`: (\{ `examSubjectSlug?`: `string`; `examSubjectTitle`: `string`; `tiers`: `object`[]; \} \| \{ `examSubjectSlug?`: `string`; `examSubjectTitle`: `string`; `units`: (\{ `categories?`: ... \| ...; `threads?`: ... \| ...; `unitOptions`: ...[]; `unitOrder`: `number`; `unitTitle`: `string`; \} \| \{ `categories?`: ... \| ...; `threads?`: ... \| ...; `unitOrder`: `number`; `unitSlug`: `string`; `unitTitle`: `string`; \})[]; \})[]; `title?`: `string`; `year`: `number`; \} \| \{ `canonicalUrl?`: `string`; `tiers`: `object`[]; `title?`: `string`; `year`: `number`; \})[]

##### Example

```ts
[
  {
    year: 1,
    units: [
      {
        unitTitle: 'Speaking and Listening',
        unitOrder: 1,
        unitSlug: 'speaking-and-listening',
        categories: [
          {
            categoryTitle: 'Reading, writing & oracy',
          },
        ],
        threads: [
          {
            threadTitle: 'Developing spoken language',
            threadSlug: 'developing-spoken-language',
            order: 8,
          },
        ],
      },
    ],
  },
];
```

#### SubjectAssetsResponseSchema

> **SubjectAssetsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    lessonSlug: 'using-numerals',
    lessonTitle: 'Using numerals',
    assets: [
      {
        label: 'Worksheet',
        type: 'worksheet',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet',
      },
      {
        label: 'Worksheet Answers',
        type: 'worksheetAnswers',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers',
      },
      {
        label: 'Video',
        type: 'video',
        url: 'https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video',
      },
    ],
  },
];
```

#### SubjectKeyStagesResponseSchema

> **SubjectKeyStagesResponseSchema**: `object`[]

The key stage slug identifiers for which this subject has content available for

##### Example

```ts
[
  {
    keyStageTitle: 'Key Stage 1',
    keyStageSlug: 'ks1',
  },
  {
    keyStageTitle: 'Key Stage 2',
    keyStageSlug: 'ks2',
  },
  {
    keyStageTitle: 'Key Stage 3',
    keyStageSlug: 'ks3',
  },
  {
    keyStageTitle: 'Key Stage 4',
    keyStageSlug: 'ks4',
  },
];
```

#### SubjectResponseSchema

> **SubjectResponseSchema**: `object`

##### Example

```ts
{
      "subjectTitle": "Art and design",
      "subjectSlug": "art",
      "sequenceSlugs": [
        {
          "sequenceSlug": "art-primary",
          "years": [
            1,
            2,
            3,
            4,
            5,
            6
          ],
          "keyStages": [
            {
              "keyStageTitle": "Key Stage 1",
              "keyStageSlug": "ks1"
            },
            {
              "keyStageTitle": "Key Stage 2",
              "keyStageSlug": "ks2"
            }
          ],
          "phaseSlug": "primary",
          "phaseTitle": "Primary",
          "ks4Options": null
        },
        {
          "sequenceSlug": "art-secondary",
          "years": [
            1,
            2,
            3,
            4,
            5,
            6
          ],
          "keyStages": [
            {
              "keyStageTitle": "Key Stage 1",
              "keyStageSlug": "ks1"
            },
            {
              "keyStageTitle": "Key Stage 2",
              "keyStageSlug": "ks2"
            }
          ],
          "phaseSlug": "secondary",
          "phaseTitle": "Secondary",
          "ks4Options": null
        }
      ],
      "years": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "keyStages": [
        {
          "keyStageTitle": "Key Stage 1",
          "keyStageSlug": "ks1"
        },
        {
          "keyStageTitle": "Key Stage 2",
          "keyStageSlug": "ks2"
        },
        {
          "keyStageTitle": "Key Stage 3",
          "keyStageSlug": "ks3"
        },
        {
          "keyStageTitle": "Key Stage 4",
          "keyStageSlug": "ks4"
        }
      ]
    }
```

##### SubjectResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### SubjectResponseSchema.keyStages

> **keyStages**: `object`[]

The key stage slug identifiers for which this subject has content available for.

##### SubjectResponseSchema.sequenceSlugs

> **sequenceSlugs**: `object`[]

Information about the years, key stages and key stage 4 variance for each sequence

##### SubjectResponseSchema.subjectSlug

> **subjectSlug**: `string`

The subject slug identifier

##### SubjectResponseSchema.subjectTitle

> **subjectTitle**: `string`

The subject title

##### SubjectResponseSchema.years

> **years**: `number`[]

The years for which this subject has content available for

#### SubjectSequenceResponseSchema

> **SubjectSequenceResponseSchema**: `object`[]

##### Example

```ts
[
  {
    sequenceSlug: 'art-primary',
    years: [1, 2, 3, 4, 5, 6],
    keyStages: [
      {
        keyStageTitle: 'Key Stage 1',
        keyStageSlug: 'ks1',
      },
      {
        keyStageTitle: 'Key Stage 2',
        keyStageSlug: 'ks2',
      },
    ],
    phaseSlug: 'primary',
    phaseTitle: 'Primary',
    ks4Options: null,
  },
  {
    sequenceSlug: 'art-secondary',
    years: [1, 2, 3, 4, 5, 6],
    keyStages: [
      {
        keyStageTitle: 'Key Stage 1',
        keyStageSlug: 'ks1',
      },
      {
        keyStageTitle: 'Key Stage 2',
        keyStageSlug: 'ks2',
      },
    ],
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    ks4Options: null,
  },
];
```

#### SubjectYearsResponseSchema

> **SubjectYearsResponseSchema**: `number`[]

The years for which this sequence has content available for

##### Example

```ts
[1, 2, 3, 4, 5, 6, 7, 8, 9];
```

#### ThreadUnitsResponseSchema

> **ThreadUnitsResponseSchema**: `object`[]

##### Example

```ts
[
  {
    unitTitle: 'Unitising and coin recognition - counting in 2s, 5s and 10s',
    unitSlug: 'unitising-and-coin-recognitions-counting-in-2s-5s-and-10s',
    unitOrder: 1,
  },
  {
    unitTitle: 'Solving problems in a range of contexts',
    unitSlug: 'unitising-and-coin-recognition-solving-problems-involving-money',
    unitOrder: 2,
  },
];
```

#### TranscriptResponseSchema

> **TranscriptResponseSchema**: `object`

##### Example

```ts
{
      "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
      "vtt": "WEBVTT\\n\\n1\\n00:00:06.300 --\> 00:00:08.070\\n\<v -\>Hello, I'm Mrs. Lashley.\</v\>\\n\\n2\\n00:00:08.070 --\> 00:00:09.240\\nI'm looking forward to guiding you\\n\\n3\\n00:00:09.240 --\> 00:00:10.980\\nthrough your learning today..."
    }
```

##### TranscriptResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### TranscriptResponseSchema.transcript

> **transcript**: `string`

The transcript for the lesson video

##### TranscriptResponseSchema.vtt

> **vtt**: `string`

The contents of the .vtt file for the lesson video, which maps captions to video timestamps.

#### UnitSummaryResponseSchema

> **UnitSummaryResponseSchema**: `object`

##### Example

```ts
{
      "unitSlug": "simple-compound-and-adverbial-complex-sentences",
      "unitTitle": "Simple, compound and adverbial complex sentences",
      "yearSlug": "year-3",
      "year": 3,
      "phaseSlug": "primary",
      "subjectSlug": "english",
      "keyStageSlug": "ks2",
      "priorKnowledgeRequirements": [
        "A simple sentence is about one idea and makes complete sense.",
        "Any simple sentence contains one verb and at least one noun.",
        "Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence."
      ],
      "nationalCurriculumContent": [
        "Ask relevant questions to extend their understanding and knowledge",
        "Articulate and justify answers, arguments and opinions",
        "Speak audibly and fluently with an increasing command of Standard English"
      ],
      "threads": [
        {
          "slug": "developing-grammatical-knowledge",
          "title": "Developing grammatical knowledge",
          "order": 10
        }
      ],
      "unitLessons": [
        {
          "lessonSlug": "four-types-of-simple-sentence",
          "lessonTitle": "Four types of simple sentence",
          "lessonOrder": 1,
          "state": "published"
        },
        {
          "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
          "lessonTitle": "Three ways for co-ordination in compound sentences",
          "lessonOrder": 2,
          "state": "new"
        }
      ]
    }
```

##### UnitSummaryResponseSchema.canonicalUrl?

> `optional` **canonicalUrl**: `string`

The canonical URL for this resource, generated by the SDK

###### Example

```ts
https://www.thenational.academy/teachers/lessons/example-lesson
```

##### UnitSummaryResponseSchema.categories?

> `optional` **categories**: `object`[]

The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.

##### UnitSummaryResponseSchema.description?

> `optional` **description**: `string`

A short description of the unit. Not yet available for all subjects.

##### UnitSummaryResponseSchema.keyStageSlug

> **keyStageSlug**: `string`

The slug identifier for the the key stage to which the unit belongs

###### Example

```ts
ks2;
```

##### UnitSummaryResponseSchema.nationalCurriculumContent

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

##### UnitSummaryResponseSchema.notes?

> `optional` **notes**: `string`

Unit summary notes

##### UnitSummaryResponseSchema.phaseSlug

> **phaseSlug**: `string`

The slug identifier for the phase to which the unit belongs

###### Example

```ts
primary;
```

##### UnitSummaryResponseSchema.priorKnowledgeRequirements

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

##### UnitSummaryResponseSchema.subjectSlug

> **subjectSlug**: `string`

The subject identifier

###### Example

```ts
english;
```

##### UnitSummaryResponseSchema.threads?

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

##### UnitSummaryResponseSchema.unitLessons

> **unitLessons**: `object`[]

##### UnitSummaryResponseSchema.unitSlug

> **unitSlug**: `string`

The unit slug identifier

###### Example

```ts
simple - compound - and - adverbial - complex - sentences;
```

##### UnitSummaryResponseSchema.unitTitle

> **unitTitle**: `string`

The unit title

###### Example

```ts
Simple, compound and adverbial complex sentences
```

##### UnitSummaryResponseSchema.whyThisWhyNow?

> `optional` **whyThisWhyNow**: `string`

An explanation of where the unit sits within the sequence and why it has been placed there.

##### UnitSummaryResponseSchema.year

> **year**: `string` \| `number`

The year to which the unit belongs

###### Example

```ts
3;
```

##### UnitSummaryResponseSchema.yearSlug

> **yearSlug**: `string`

The slug identifier for the year to which the unit belongs

###### Example

```ts
year - 3;
```
