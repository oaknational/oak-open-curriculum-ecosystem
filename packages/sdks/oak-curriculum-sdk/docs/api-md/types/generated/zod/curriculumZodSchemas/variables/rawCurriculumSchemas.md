[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/zod/curriculumZodSchemas](../README.md) / rawCurriculumSchemas

# Variable: rawCurriculumSchemas

> `const` **rawCurriculumSchemas**: `object`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/zod/curriculumZodSchemas.ts:1543](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/zod/curriculumZodSchemas.ts#L1543)

## Type Declaration

### AllKeyStageAndSubjectUnitsResponseSchema

> **AllKeyStageAndSubjectUnitsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `units`: `ZodArray`\<`ZodObject`\<\{ `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>\>; `yearSlug`: `ZodString`; `yearTitle`: `ZodString`; \}, `$strict`\>\>

### AllSubjectsResponseSchema

> **AllSubjectsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `sequenceSlugs`: `ZodArray`\<`ZodObject`\<\{ `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: ...; `title`: ...; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\>; `subjectSlug`: `ZodString`; `subjectTitle`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\>

### AllThreadsResponseSchema

> **AllThreadsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodNull`\>; `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>\>

### KeyStageResponseSchema

> **KeyStageResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>\>

### KeyStageSubjectLessonsResponseSchema

> **KeyStageSubjectLessonsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessons`: `ZodArray`\<`ZodObject`\<\{ `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>\>

### LessonAssetResponseSchema

> **LessonAssetResponseSchema**: `ZodUnknown`

### LessonAssetsResponseSchema

> **LessonAssetsResponseSchema**: `ZodObject`\<\{ `assets`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `type`: `ZodEnum`\<\{ `exitQuiz`: `"exitQuiz"`; `exitQuizAnswers`: `"exitQuizAnswers"`; `slideDeck`: `"slideDeck"`; `starterQuiz`: `"starterQuiz"`; `starterQuizAnswers`: `"starterQuizAnswers"`; `supplementaryResource`: `"supplementaryResource"`; `video`: `"video"`; `worksheet`: `"worksheet"`; `worksheetAnswers`: `"worksheetAnswers"`; \}\>; `url`: `ZodString`; \}, `$strict`\>\>\>; `attribution`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `canonicalUrl`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>

### LessonSearchResponseSchema

> **LessonSearchResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `similarity`: `ZodNumber`; `units`: `ZodArray`\<`ZodObject`\<\{ `examBoardTitle`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `keyStageSlug`: `ZodString`; `subjectSlug`: `ZodString`; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>\>; \}, `$strict`\>\>

### LessonSummaryResponseSchema

> **LessonSummaryResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `contentGuidance`: `ZodUnion`\<readonly \[`ZodArray`\<`ZodObject`\<\{ `contentGuidanceArea`: `ZodString`; `contentGuidanceDescription`: `ZodString`; `contentGuidanceLabel`: `ZodString`; `supervisionlevel_id`: `ZodNumber`; \}, `$strict`\>\>, `ZodNull`\]\>; `downloadsAvailable`: `ZodBoolean`; `keyLearningPoints`: `ZodArray`\<`ZodObject`\<\{ `keyLearningPoint`: `ZodString`; \}, `$strict`\>\>; `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; `lessonKeywords`: `ZodArray`\<`ZodObject`\<\{ `description`: `ZodString`; `keyword`: `ZodString`; \}, `$strict`\>\>; `lessonTitle`: `ZodString`; `misconceptionsAndCommonMistakes`: `ZodArray`\<`ZodObject`\<\{ `misconception`: `ZodString`; `response`: `ZodString`; \}, `$strict`\>\>; `pupilLessonOutcome`: `ZodOptional`\<`ZodString`\>; `subjectSlug`: `ZodString`; `subjectTitle`: `ZodString`; `supervisionLevel`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `teacherTips`: `ZodArray`\<`ZodObject`\<\{ `teacherTip`: `ZodString`; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>

### QuestionForLessonsResponseSchema

> **QuestionForLessonsResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `exitQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<readonly \[..., ...\]\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<\{ `content`: ...; `type`: ...; \}, `$strict`\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<\{ `correctChoice`: ...; `matchOption`: ...; \}, `$strict`\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<`ZodObject`\<..., ...\>, `ZodObject`\<..., ...\>\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; `starterQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<readonly \[..., ...\]\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<\{ `content`: ...; `type`: ...; \}, `$strict`\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<\{ `correctChoice`: ...; `matchOption`: ...; \}, `$strict`\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<`ZodObject`\<..., ...\>, `ZodObject`\<..., ...\>\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<\{ `alt`: ...; `attribution`: ...; `height`: ...; `text`: ...; `url`: ...; `width`: ...; \}, `$strict`\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; \}, `$strict`\>

### QuestionsForKeyStageAndSubjectResponseSchema

> **QuestionsForKeyStageAndSubjectResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `exitQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `starterQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; \}, `$strict`\>\>

### QuestionsForSequenceResponseSchema

> **QuestionsForSequenceResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `exitQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `starterQuiz`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `answers`: `ZodArray`\<`ZodUnion`\<...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodObject`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>, `ZodObject`\<\{ `answers`: `ZodArray`\<`ZodIntersection`\<..., ...\>\>; `question`: `ZodString`; `questionImage`: `ZodOptional`\<`ZodObject`\<..., ...\>\>; `questionType`: `ZodString`; \}, `$strict`\>\]\>\>; \}, `$strict`\>\>

### RateLimitResponseSchema

> **RateLimitResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `limit`: `ZodNumber`; `remaining`: `ZodNumber`; `reset`: `ZodNumber`; \}, `$strict`\>

### SearchTranscriptResponseSchema

> **SearchTranscriptResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `transcriptSnippet`: `ZodOptional`\<`ZodString`\>; \}, `$strict`\>\>

### SequenceAssetsResponseSchema

> **SequenceAssetsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `assets`: `ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `type`: `ZodEnum`\<\{ `exitQuiz`: `"exitQuiz"`; `exitQuizAnswers`: `"exitQuizAnswers"`; `slideDeck`: `"slideDeck"`; `starterQuiz`: `"starterQuiz"`; `starterQuizAnswers`: `"starterQuizAnswers"`; `supplementaryResource`: `"supplementaryResource"`; `video`: `"video"`; `worksheet`: `"worksheet"`; `worksheetAnswers`: `"worksheetAnswers"`; \}\>; `url`: `ZodString`; \}, `$strict`\>\>; `attribution`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; \}, `$strict`\>\>

### SequenceUnitsResponseSchema

> **SequenceUnitsResponseSchema**: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; `units`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `categories`: ...; `threads`: ...; `unitOptions`: ...; `unitOrder`: ...; `unitTitle`: ...; \}, `$strict`\>, `ZodObject`\<\{ `categories`: ...; `threads`: ...; `unitOrder`: ...; `unitSlug`: ...; `unitTitle`: ...; \}, `$strict`\>\]\>\>; `year`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>; \}, `$strict`\>, `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `examSubjects`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `examSubjectSlug`: ...; `examSubjectTitle`: ...; `tiers`: ...; \}, `$strict`\>, `ZodObject`\<\{ `examSubjectSlug`: ...; `examSubjectTitle`: ...; `units`: ...; \}, `$strict`\>\]\>\>; `title`: `ZodOptional`\<`ZodString`\>; `year`: `ZodNumber`; \}, `$strict`\>, `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `tiers`: `ZodArray`\<`ZodObject`\<\{ `tierSlug`: `ZodString`; `tierTitle`: `ZodString`; `units`: `ZodArray`\<`ZodUnion`\<...\>\>; \}, `$strict`\>\>; `title`: `ZodOptional`\<`ZodString`\>; `year`: `ZodNumber`; \}, `$strict`\>\]\>\>

### SubjectAssetsResponseSchema

> **SubjectAssetsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `assets`: `ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `type`: `ZodEnum`\<\{ `exitQuiz`: `"exitQuiz"`; `exitQuizAnswers`: `"exitQuizAnswers"`; `slideDeck`: `"slideDeck"`; `starterQuiz`: `"starterQuiz"`; `starterQuizAnswers`: `"starterQuizAnswers"`; `supplementaryResource`: `"supplementaryResource"`; `video`: `"video"`; `worksheet`: `"worksheet"`; `worksheetAnswers`: `"worksheetAnswers"`; \}\>; `url`: `ZodString`; \}, `$strict`\>\>; `attribution`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; \}, `$strict`\>\>

### SubjectKeyStagesResponseSchema

> **SubjectKeyStagesResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>

### SubjectResponseSchema

> **SubjectResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `sequenceSlugs`: `ZodArray`\<`ZodObject`\<\{ `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\>; `subjectSlug`: `ZodString`; `subjectTitle`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>

### SubjectSequenceResponseSchema

> **SubjectSequenceResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\>

### SubjectYearsResponseSchema

> **SubjectYearsResponseSchema**: `ZodArray`\<`ZodNumber`\>

### ThreadUnitsResponseSchema

> **ThreadUnitsResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodNull`\>; `unitOrder`: `ZodNumber`; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\>\>

### TranscriptResponseSchema

> **TranscriptResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `transcript`: `ZodString`; `vtt`: `ZodString`; \}, `$strict`\>

### UnitSummaryResponseSchema

> **UnitSummaryResponseSchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `categories`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `categorySlug`: `ZodOptional`\<`ZodString`\>; `categoryTitle`: `ZodString`; \}, `$strict`\>\>\>; `description`: `ZodOptional`\<`ZodString`\>; `keyStageSlug`: `ZodString`; `nationalCurriculumContent`: `ZodArray`\<`ZodString`\>; `notes`: `ZodOptional`\<`ZodString`\>; `phaseSlug`: `ZodString`; `priorKnowledgeRequirements`: `ZodArray`\<`ZodString`\>; `subjectSlug`: `ZodString`; `threads`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `order`: `ZodNumber`; `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>\>\>; `unitLessons`: `ZodArray`\<`ZodObject`\<\{ `lessonOrder`: `ZodOptional`\<`ZodNumber`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `state`: `ZodEnum`\<\{ `new`: `"new"`; `published`: `"published"`; \}\>; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; `whyThisWhyNow`: `ZodOptional`\<`ZodString`\>; `year`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>; `yearSlug`: `ZodString`; \}, `$strict`\>
