import { z } from "zod";

/** Endpoint interface for OpenAPI-derived endpoints */
interface Endpoint {
  readonly method: string;
  readonly path: string;
  readonly description?: string;
  readonly requestFormat?: string;
  readonly response: z.ZodType;
  readonly errors?: readonly { readonly status: string | number; readonly description?: string; readonly schema: z.ZodType }[];
  readonly parameters?: readonly { readonly name: string; readonly type: string; readonly schema: z.ZodType }[];
}

const OPERATION_ID_BY_METHOD_AND_PATH = {
  "get /sequences/:sequence": "getSequences-getSubjectSequence",
  "get /sequences/:sequence/units": "getSequences-getSequenceUnits",
  "get /lessons/:lesson/transcript": "getLessonTranscript-getLessonTranscript",
  "get /search/transcripts": "searchTranscripts-searchTranscripts",
  "get /sequences/:sequence/assets": "getAssets-getSequenceAssets",
  "get /key-stages/:keyStage/subject/:subject/assets": "getAssets-getSubjectAssets",
  "get /lessons/:lesson/assets": "getAssets-getLessonAssets",
  "get /lessons/:lesson/assets/:type": "getAssets-getLessonAsset",
  "get /subjects": "getSubjects-getAllSubjects",
  "get /subjects/:subject": "getSubjects-getSubject",
  "get /subjects/:subject/key-stages": "getSubjects-getSubjectKeyStages",
  "get /subjects/:subject/years": "getSubjects-getSubjectYears",
  "get /key-stages": "getKeyStages-getKeyStages",
  "get /key-stages/:keyStage/subject/:subject/lessons": "getKeyStageSubjectLessons-getKeyStageSubjectLessons",
  "get /key-stages/:keyStage/subject/:subject/units": "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits",
  "get /keywords": "getKeywords-getKeywords",
  "get /lessons/:lesson/quiz": "getQuestions-getQuestionsForLessons",
  "get /sequences/:sequence/questions": "getQuestions-getQuestionsForSequence",
  "get /key-stages/:keyStage/subject/:subject/questions": "getQuestions-getQuestionsForKeyStageAndSubject",
  "get /lessons/:lesson/summary": "getLessons-getLesson",
  "get /search/lessons": "getLessons-searchByTextSimilarity",
  "get /units/:unit/summary": "getUnits-getUnit",
  "get /threads": "getThreads-getAllThreads",
  "get /threads/:threadSlug/units": "getThreads-getThreadUnits",
  "get /changelog": "changelog-changelog",
  "get /changelog/latest": "changelog-latest",
  "get /rate-limit": "getRateLimit-getRateLimit",
} as const;
const PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID = {
  "getSequences-getSubjectSequence": "200",
  "getSequences-getSequenceUnits": "200",
  "getLessonTranscript-getLessonTranscript": "200",
  "searchTranscripts-searchTranscripts": "200",
  "getAssets-getSequenceAssets": "200",
  "getAssets-getSubjectAssets": "200",
  "getAssets-getLessonAssets": "200",
  "getAssets-getLessonAsset": "200",
  "getSubjects-getAllSubjects": "200",
  "getSubjects-getSubject": "200",
  "getSubjects-getSubjectKeyStages": "200",
  "getSubjects-getSubjectYears": "200",
  "getKeyStages-getKeyStages": "200",
  "getKeyStageSubjectLessons-getKeyStageSubjectLessons": "200",
  "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": "200",
  "getKeywords-getKeywords": "200",
  "getQuestions-getQuestionsForLessons": "200",
  "getQuestions-getQuestionsForSequence": "200",
  "getQuestions-getQuestionsForKeyStageAndSubject": "200",
  "getLessons-getLesson": "200",
  "getLessons-searchByTextSimilarity": "200",
  "getUnits-getUnit": "200",
  "getThreads-getAllThreads": "200",
  "getThreads-getThreadUnits": "200",
  "changelog-changelog": "200",
  "changelog-latest": "200",
  "getRateLimit-getRateLimit": "200",
} as const;

function isOperationKey(key: string): key is keyof typeof OPERATION_ID_BY_METHOD_AND_PATH {
  return key in OPERATION_ID_BY_METHOD_AND_PATH;
}

function isPrimaryStatusKey(key: string): key is keyof typeof PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID {
  return key in PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID;
}

function getOperationIdForEndpoint(method: string, path: string): string | undefined {
  const key = `${method.toLowerCase()} ${path}`;
  if (!isOperationKey(key)) {
    return undefined;
  }
  return OPERATION_ID_BY_METHOD_AND_PATH[key];
}

function getPrimaryStatusForOperation(operationId: string): string | undefined {
  if (!isPrimaryStatusKey(operationId)) {
    return undefined;
  }
  return PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID[operationId];
}

function sanitizeSchemaKeys(
  schemas: CurriculumSchemaCollection,
  options?: { readonly rename?: (original: string) => string },
): CurriculumSchemaCollection {
  const rename = options?.rename ?? ((value: string) => value.replace(/[^A-Za-z0-9_]/g, "_"));
  const result: Record<string, z.ZodType> = {};
  for (const [key, value] of Object.entries(schemas)) {
    const sanitized = rename(key);
    result[sanitized] = value;
  }
  return result;
}


const SubjectSequenceResponseSchema = z
  .object({
    sequenceSlug: z.string(),
    years: z.array(z.number()),
    keyStages: z.array(
      z.object({ keyStageTitle: z.string(), keyStageSlug: z.string() }).strict()
    ),
    phaseSlug: z.string(),
    phaseTitle: z.string(),
    ks4ProgrammeFactors: z
      .object({
        examBoard: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        pathway: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        tier: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        childSubject: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
      })
      .partial()
      .strict(),
    oakUrl: z.url().optional(),
  })
  .strict();
const error_BAD_REQUEST = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).strict()).optional(),
  })
  .strict();
const error_UNAUTHORIZED = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).strict()).optional(),
  })
  .strict();
const error_NOT_FOUND = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).strict()).optional(),
  })
  .strict();
const SequenceUnitsResponseSchema = z.array(
  z.union([
    z
      .object({
        year: z.union([z.number(), z.string()]),
        title: z.string().optional(),
        units: z.array(
          z.union([
            z
              .object({
                unitTitle: z.string(),
                unitOrder: z.number(),
                unitOptions: z.array(
                  z
                    .object({ unitTitle: z.string(), unitSlug: z.string() })
                    .strict()
                ),
                categories: z
                  .array(
                    z
                      .object({
                        categoryTitle: z.string(),
                        categorySlug: z.string().optional(),
                      })
                      .strict()
                  )
                  .optional(),
                threads: z
                  .array(
                    z
                      .object({
                        threadTitle: z.string(),
                        threadSlug: z.string(),
                        order: z.number(),
                      })
                      .strict()
                  )
                  .optional(),
                examBoards: z
                  .array(
                    z.object({ title: z.string(), slug: z.string() }).strict()
                  )
                  .optional(),
              })
              .strict(),
            z
              .object({
                unitTitle: z.string(),
                unitOrder: z.number(),
                unitSlug: z.string(),
                categories: z
                  .array(
                    z
                      .object({
                        categoryTitle: z.string(),
                        categorySlug: z.string().optional(),
                      })
                      .strict()
                  )
                  .optional(),
                threads: z
                  .array(
                    z
                      .object({
                        threadTitle: z.string(),
                        threadSlug: z.string(),
                        order: z.number(),
                      })
                      .strict()
                  )
                  .optional(),
                examBoards: z
                  .array(
                    z.object({ title: z.string(), slug: z.string() }).strict()
                  )
                  .optional(),
              })
              .strict(),
          ])
        ),
        oakUrl: z.url().optional(),
      })
      .strict(),
    z
      .object({
        year: z.number(),
        title: z.string().optional(),
        examSubjects: z.array(
          z.union([
            z
              .object({
                examSubjectTitle: z.string(),
                examSubjectSlug: z.string().optional(),
                tiers: z.array(
                  z
                    .object({
                      tierTitle: z.string(),
                      tierSlug: z.string(),
                      units: z.array(
                        z.union([
                          z
                            .object({
                              unitTitle: z.string(),
                              unitOrder: z.number(),
                              unitOptions: z.array(
                                z
                                  .object({
                                    unitTitle: z.string(),
                                    unitSlug: z.string(),
                                  })
                                  .strict()
                              ),
                              categories: z
                                .array(
                                  z
                                    .object({
                                      categoryTitle: z.string(),
                                      categorySlug: z.string().optional(),
                                    })
                                    .strict()
                                )
                                .optional(),
                              threads: z
                                .array(
                                  z
                                    .object({
                                      threadTitle: z.string(),
                                      threadSlug: z.string(),
                                      order: z.number(),
                                    })
                                    .strict()
                                )
                                .optional(),
                              examBoards: z
                                .array(
                                  z
                                    .object({
                                      title: z.string(),
                                      slug: z.string(),
                                    })
                                    .strict()
                                )
                                .optional(),
                            })
                            .strict(),
                          z
                            .object({
                              unitTitle: z.string(),
                              unitOrder: z.number(),
                              unitSlug: z.string(),
                              categories: z
                                .array(
                                  z
                                    .object({
                                      categoryTitle: z.string(),
                                      categorySlug: z.string().optional(),
                                    })
                                    .strict()
                                )
                                .optional(),
                              threads: z
                                .array(
                                  z
                                    .object({
                                      threadTitle: z.string(),
                                      threadSlug: z.string(),
                                      order: z.number(),
                                    })
                                    .strict()
                                )
                                .optional(),
                              examBoards: z
                                .array(
                                  z
                                    .object({
                                      title: z.string(),
                                      slug: z.string(),
                                    })
                                    .strict()
                                )
                                .optional(),
                            })
                            .strict(),
                        ])
                      ),
                    })
                    .strict()
                ),
              })
              .strict(),
            z
              .object({
                examSubjectTitle: z.string(),
                examSubjectSlug: z.string().optional(),
                units: z.array(
                  z.union([
                    z
                      .object({
                        unitTitle: z.string(),
                        unitOrder: z.number(),
                        unitOptions: z.array(
                          z
                            .object({
                              unitTitle: z.string(),
                              unitSlug: z.string(),
                            })
                            .strict()
                        ),
                        categories: z
                          .array(
                            z
                              .object({
                                categoryTitle: z.string(),
                                categorySlug: z.string().optional(),
                              })
                              .strict()
                          )
                          .optional(),
                        threads: z
                          .array(
                            z
                              .object({
                                threadTitle: z.string(),
                                threadSlug: z.string(),
                                order: z.number(),
                              })
                              .strict()
                          )
                          .optional(),
                        examBoards: z
                          .array(
                            z
                              .object({ title: z.string(), slug: z.string() })
                              .strict()
                          )
                          .optional(),
                      })
                      .strict(),
                    z
                      .object({
                        unitTitle: z.string(),
                        unitOrder: z.number(),
                        unitSlug: z.string(),
                        categories: z
                          .array(
                            z
                              .object({
                                categoryTitle: z.string(),
                                categorySlug: z.string().optional(),
                              })
                              .strict()
                          )
                          .optional(),
                        threads: z
                          .array(
                            z
                              .object({
                                threadTitle: z.string(),
                                threadSlug: z.string(),
                                order: z.number(),
                              })
                              .strict()
                          )
                          .optional(),
                        examBoards: z
                          .array(
                            z
                              .object({ title: z.string(), slug: z.string() })
                              .strict()
                          )
                          .optional(),
                      })
                      .strict(),
                  ])
                ),
              })
              .strict(),
          ])
        ),
        oakUrl: z.url().optional(),
      })
      .strict(),
    z
      .object({
        year: z.number(),
        title: z.string().optional(),
        tiers: z.array(
          z
            .object({
              tierTitle: z.string(),
              tierSlug: z.string(),
              units: z.array(
                z.union([
                  z
                    .object({
                      unitTitle: z.string(),
                      unitOrder: z.number(),
                      unitOptions: z.array(
                        z
                          .object({
                            unitTitle: z.string(),
                            unitSlug: z.string(),
                          })
                          .strict()
                      ),
                      categories: z
                        .array(
                          z
                            .object({
                              categoryTitle: z.string(),
                              categorySlug: z.string().optional(),
                            })
                            .strict()
                        )
                        .optional(),
                      threads: z
                        .array(
                          z
                            .object({
                              threadTitle: z.string(),
                              threadSlug: z.string(),
                              order: z.number(),
                            })
                            .strict()
                        )
                        .optional(),
                      examBoards: z
                        .array(
                          z
                            .object({ title: z.string(), slug: z.string() })
                            .strict()
                        )
                        .optional(),
                    })
                    .strict(),
                  z
                    .object({
                      unitTitle: z.string(),
                      unitOrder: z.number(),
                      unitSlug: z.string(),
                      categories: z
                        .array(
                          z
                            .object({
                              categoryTitle: z.string(),
                              categorySlug: z.string().optional(),
                            })
                            .strict()
                        )
                        .optional(),
                      threads: z
                        .array(
                          z
                            .object({
                              threadTitle: z.string(),
                              threadSlug: z.string(),
                              order: z.number(),
                            })
                            .strict()
                        )
                        .optional(),
                      examBoards: z
                        .array(
                          z
                            .object({ title: z.string(), slug: z.string() })
                            .strict()
                        )
                        .optional(),
                    })
                    .strict(),
                ])
              ),
            })
            .strict()
        ),
        oakUrl: z.url().optional(),
      })
      .strict(),
  ])
);
const TranscriptResponseSchema = z
  .object({
    transcript: z.string(),
    vtt: z.string(),
    oakUrl: z.url().optional(),
  })
  .strict();
const SearchTranscriptResponseSchema = z.array(
  z
    .object({
      lessonTitle: z.string(),
      lessonSlug: z.string(),
      transcriptSnippet: z.string().optional(),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const SequenceAssetsResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      attribution: z.array(z.string()).optional(),
      assets: z.array(
        z
          .object({
            type: z.enum([
              "slideDeck",
              "exitQuiz",
              "exitQuizAnswers",
              "starterQuiz",
              "starterQuizAnswers",
              "supplementaryResource",
              "video",
              "worksheet",
              "worksheetAnswers",
            ]),
            label: z.string(),
            url: z.string(),
          })
          .strict()
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const SubjectAssetsResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      attribution: z.array(z.string()).optional(),
      assets: z.array(
        z
          .object({
            type: z.enum([
              "slideDeck",
              "exitQuiz",
              "exitQuizAnswers",
              "starterQuiz",
              "starterQuizAnswers",
              "supplementaryResource",
              "video",
              "worksheet",
              "worksheetAnswers",
            ]),
            label: z.string(),
            url: z.string(),
          })
          .strict()
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const LessonAssetsResponseSchema = z
  .object({
    oakUrl: z.url(),
    attribution: z.array(z.string()).optional(),
    assets: z
      .array(
        z
          .object({
            type: z.enum([
              "slideDeck",
              "exitQuiz",
              "exitQuizAnswers",
              "starterQuiz",
              "starterQuizAnswers",
              "supplementaryResource",
              "video",
              "worksheet",
              "worksheetAnswers",
            ]),
            label: z.string(),
            url: z.string(),
          })
          .strict()
      )
      .optional(),
  })
  .strict();
const LessonAssetResponseSchema = z.unknown();
const AllSubjectsResponseSchema = z.array(
  z.enum([
    "art",
    "citizenship",
    "computing",
    "cooking-nutrition",
    "design-technology",
    "english",
    "french",
    "geography",
    "german",
    "history",
    "maths",
    "music",
    "physical-education",
    "religious-education",
    "rshe-pshe",
    "science",
    "spanish",
  ])
);
const SubjectResponseSchema = z
  .object({
    subjectTitle: z.string(),
    subjectSlug: z.string(),
    sequenceSlugs: z.array(
      z
        .object({
          sequenceSlug: z.string(),
          years: z.array(z.number()),
          keyStages: z.array(
            z
              .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
              .strict()
          ),
          phaseSlug: z.string(),
          phaseTitle: z.string(),
        })
        .strict()
    ),
    years: z.array(z.number()),
    keyStages: z.array(
      z.object({ keyStageTitle: z.string(), keyStageSlug: z.string() }).strict()
    ),
    ks4ProgrammeFactors: z
      .object({
        examBoard: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        pathway: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        tier: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
        childSubject: z.array(
          z.object({ title: z.string(), slug: z.string() }).strict()
        ),
      })
      .partial()
      .strict(),
    oakUrl: z.url().optional(),
  })
  .strict();
const SubjectKeyStagesResponseSchema = z.array(
  z
    .object({
      keyStageTitle: z.string(),
      keyStageSlug: z.string(),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const SubjectYearsResponseSchema = z.array(z.number());
const KeyStageResponseSchema = z.array(
  z
    .object({
      slug: z.string(),
      title: z.string(),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const KeyStageSubjectLessonsResponseSchema = z.array(
  z
    .object({
      unitSlug: z.string(),
      unitTitle: z.string(),
      lessons: z.array(
        z.object({ lessonSlug: z.string(), lessonTitle: z.string() }).strict()
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const AllKeyStageAndSubjectUnitsResponseSchema = z.array(
  z
    .object({
      yearSlug: z.string(),
      yearTitle: z.string(),
      units: z.array(
        z
          .object({
            unitSlug: z.string(),
            unitTitle: z.string(),
            examBoards: z
              .array(z.object({ title: z.string(), slug: z.string() }).strict())
              .optional(),
          })
          .strict()
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const QuestionForLessonsResponseSchema = z
  .object({
    starterQuiz: z.array(
      z.union([
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z.union([
                z
                  .object({
                    type: z.string(),
                    content: z.string(),
                    distractor: z.boolean(),
                  })
                  .strict(),
                z
                  .object({
                    type: z.string(),
                    content: z
                      .object({
                        url: z.string(),
                        width: z.number(),
                        height: z.number(),
                        alt: z.string().optional(),
                        text: z.string().optional(),
                        attribution: z.string().optional(),
                      })
                      .strict(),
                    distractor: z.boolean(),
                  })
                  .strict(),
              ])
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z.object({ type: z.string(), content: z.string() }).strict()
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z
                .object({
                  matchOption: z
                    .object({ type: z.string(), content: z.string() })
                    .strict(),
                  correctChoice: z
                    .object({ type: z.string(), content: z.string() })
                    .strict(),
                })
                .strict()
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z
                .object({ order: z.number() })
                
                .and(
                  z.object({ type: z.string(), content: z.string() })
                )
            ),
          })
          .strict(),
      ])
    ),
    exitQuiz: z.array(
      z.union([
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z.union([
                z
                  .object({
                    type: z.string(),
                    content: z.string(),
                    distractor: z.boolean(),
                  })
                  .strict(),
                z
                  .object({
                    type: z.string(),
                    content: z
                      .object({
                        url: z.string(),
                        width: z.number(),
                        height: z.number(),
                        alt: z.string().optional(),
                        text: z.string().optional(),
                        attribution: z.string().optional(),
                      })
                      .strict(),
                    distractor: z.boolean(),
                  })
                  .strict(),
              ])
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z.object({ type: z.string(), content: z.string() }).strict()
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z
                .object({
                  matchOption: z
                    .object({ type: z.string(), content: z.string() })
                    .strict(),
                  correctChoice: z
                    .object({ type: z.string(), content: z.string() })
                    .strict(),
                })
                .strict()
            ),
          })
          .strict(),
        z
          .object({
            question: z.string(),
            questionType: z.string(),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .strict()
              .optional(),
            answers: z.array(
              z
                .object({ order: z.number() })
                
                .and(
                  z.object({ type: z.string(), content: z.string() })
                )
            ),
          })
          .strict(),
      ])
    ),
    oakUrl: z.url().optional(),
  })
  .strict();
const QuestionsForSequenceResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      starterQuiz: z.array(
        z.union([
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.union([
                  z
                    .object({
                      type: z.string(),
                      content: z.string(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.string(),
                      content: z
                        .object({
                          url: z.string(),
                          width: z.number(),
                          height: z.number(),
                          alt: z.string().optional(),
                          text: z.string().optional(),
                          attribution: z.string().optional(),
                        })
                        .strict(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                ])
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.object({ type: z.string(), content: z.string() }).strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({
                    matchOption: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                    correctChoice: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                  })
                  .strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({ order: z.number() })
                  
                  .and(
                    z.object({ type: z.string(), content: z.string() })
                  )
              ),
            })
            .strict(),
        ])
      ),
      exitQuiz: z.array(
        z.union([
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.union([
                  z
                    .object({
                      type: z.string(),
                      content: z.string(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.string(),
                      content: z
                        .object({
                          url: z.string(),
                          width: z.number(),
                          height: z.number(),
                          alt: z.string().optional(),
                          text: z.string().optional(),
                          attribution: z.string().optional(),
                        })
                        .strict(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                ])
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.object({ type: z.string(), content: z.string() }).strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({
                    matchOption: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                    correctChoice: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                  })
                  .strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({ order: z.number() })
                  
                  .and(
                    z.object({ type: z.string(), content: z.string() })
                  )
              ),
            })
            .strict(),
        ])
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const QuestionsForKeyStageAndSubjectResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      starterQuiz: z.array(
        z.union([
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.union([
                  z
                    .object({
                      type: z.string(),
                      content: z.string(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.string(),
                      content: z
                        .object({
                          url: z.string(),
                          width: z.number(),
                          height: z.number(),
                          alt: z.string().optional(),
                          text: z.string().optional(),
                          attribution: z.string().optional(),
                        })
                        .strict(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                ])
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.object({ type: z.string(), content: z.string() }).strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({
                    matchOption: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                    correctChoice: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                  })
                  .strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({ order: z.number() })
                  
                  .and(
                    z.object({ type: z.string(), content: z.string() })
                  )
              ),
            })
            .strict(),
        ])
      ),
      exitQuiz: z.array(
        z.union([
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.union([
                  z
                    .object({
                      type: z.string(),
                      content: z.string(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                  z
                    .object({
                      type: z.string(),
                      content: z
                        .object({
                          url: z.string(),
                          width: z.number(),
                          height: z.number(),
                          alt: z.string().optional(),
                          text: z.string().optional(),
                          attribution: z.string().optional(),
                        })
                        .strict(),
                      distractor: z.boolean(),
                    })
                    .strict(),
                ])
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z.object({ type: z.string(), content: z.string() }).strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({
                    matchOption: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                    correctChoice: z
                      .object({ type: z.string(), content: z.string() })
                      .strict(),
                  })
                  .strict()
              ),
            })
            .strict(),
          z
            .object({
              question: z.string(),
              questionType: z.string(),
              questionImage: z
                .object({
                  url: z.string(),
                  width: z.number(),
                  height: z.number(),
                  alt: z.string().optional(),
                  text: z.string().optional(),
                  attribution: z.string().optional(),
                })
                .strict()
                .optional(),
              answers: z.array(
                z
                  .object({ order: z.number() })
                  
                  .and(
                    z.object({ type: z.string(), content: z.string() })
                  )
              ),
            })
            .strict(),
        ])
      ),
      oakUrl: z.url().optional(),
    })
    .strict()
);
const LessonSummaryResponseSchema = z
  .object({
    lessonTitle: z.string(),
    canonicalUrl: z.url(),
    oakUrl: z.url(),
    units: z.array(
      z
        .object({
          unitSlug: z.string(),
          unitTitle: z.string(),
          programmeFactors: z
            .object({
              examBoard: z
                .object({ slug: z.string(), title: z.string() })
                .strict(),
              pathway: z
                .object({ slug: z.string(), title: z.string() })
                .strict(),
              tier: z.object({ slug: z.string(), title: z.string() }).strict(),
              childSubject: z
                .object({
                  slug: z.enum([
                    "biology",
                    "chemistry",
                    "combined-science",
                    "physics",
                  ]),
                  title: z.string(),
                })
                .strict(),
            })
            .partial()
            .strict()
            .optional(),
        })
        .strict()
    ),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    lessonKeywords: z.array(
      z.object({ keyword: z.string(), description: z.string() }).strict()
    ),
    keyLearningPoints: z.array(
      z.object({ keyLearningPoint: z.string() }).strict()
    ),
    misconceptionsAndCommonMistakes: z.array(
      z.object({ misconception: z.string(), response: z.string() }).strict()
    ),
    pupilLessonOutcome: z.string().optional(),
    teacherTips: z.array(z.object({ teacherTip: z.string() }).strict()),
    contentGuidance: z.union([
      z.array(
        z
          .object({
            contentGuidanceArea: z.string(),
            supervisionlevel_id: z.number(),
            contentGuidanceLabel: z.string(),
            contentGuidanceDescription: z.string(),
          })
          .strict()
      ),
      z.null(),
    ]),
    supervisionLevel: z.union([z.string(), z.null()]),
    downloadsAvailable: z.boolean(),
  })
  .strict();
const LessonSearchResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      oakUrl: z.url(),
      similarity: z.number(),
      units: z.array(
        z
          .object({
            unitSlug: z.string(),
            unitTitle: z.string(),
            examBoardTitle: z.union([z.string(), z.null()]),
            keyStageSlug: z.string(),
            subjectSlug: z.string(),
          })
          .strict()
      ),
    })
    .strict()
);
const UnitSummaryResponseSchema = z
  .object({
    unitSlug: z.string(),
    unitTitle: z.string(),
    yearSlug: z.string(),
    year: z.union([z.number(), z.string()]),
    phaseSlug: z.string(),
    subjectSlug: z.string(),
    keyStageSlug: z.string(),
    notes: z.string().optional(),
    description: z.string().optional(),
    priorKnowledgeRequirements: z.array(z.string()),
    nationalCurriculumContent: z.array(z.string()),
    whyThisWhyNow: z.string().optional(),
    threads: z
      .array(
        z
          .object({ slug: z.string(), title: z.string(), order: z.number() })
          .strict()
      )
      .optional(),
    categories: z
      .array(
        z
          .object({
            categoryTitle: z.string(),
            categorySlug: z.string().optional(),
          })
          .strict()
      )
      .optional(),
    programmeFactors: z
      .object({
        examBoard: z.object({ slug: z.string(), title: z.string() }).strict(),
        pathway: z.object({ slug: z.string(), title: z.string() }).strict(),
        tier: z.object({ slug: z.string(), title: z.string() }).strict(),
        childSubject: z
          .object({
            slug: z.enum([
              "biology",
              "chemistry",
              "combined-science",
              "physics",
            ]),
            title: z.string(),
          })
          .strict(),
      })
      .partial()
      .strict()
      .optional(),
    unitLessons: z.array(
      z
        .object({
          lessonSlug: z.string(),
          lessonTitle: z.string(),
          lessonOrder: z.number().optional(),
          state: z.enum(["published", "new"]),
        })
        .strict()
    ),
    oakUrl: z.url().optional(),
  })
  .strict();
const AllThreadsResponseSchema = z.array(
  z
    .object({
      title: z.string(),
      slug: z.string(),
      unitCount: z.number(),
      oakUrl: z.null().optional(),
    })
    .strict()
);
const ThreadUnitsResponseSchema = z.array(
  z
    .object({
      unitTitle: z.string(),
      unitSlug: z.string(),
      oakUrl: z.null().optional(),
    })
    .strict()
);
const RateLimitResponseSchema = z
  .object({
    limit: z.number(),
    remaining: z.number(),
    reset: z.number(),
    oakUrl: z.url().optional(),
  })
  .strict();

export type CurriculumSchemaCollection = Record<string, z.ZodType>;

const renameInlineSchema = (original: string) => {
  if (original === "changelog_changelog_200") {
    return "ChangelogResponseSchema";
  }
  if (original === "changelog_latest_200") {
    return "ChangelogLatestResponseSchema";
  }
  return original.replace(/[^A-Za-z0-9_]/g, "_");
};

export const rawCurriculumSchemas = {
  SubjectSequenceResponseSchema,
  error_BAD_REQUEST,
  error_UNAUTHORIZED,
  error_NOT_FOUND,
  SequenceUnitsResponseSchema,
  TranscriptResponseSchema,
  SearchTranscriptResponseSchema,
  SequenceAssetsResponseSchema,
  SubjectAssetsResponseSchema,
  LessonAssetsResponseSchema,
  LessonAssetResponseSchema,
  AllSubjectsResponseSchema,
  SubjectResponseSchema,
  SubjectKeyStagesResponseSchema,
  SubjectYearsResponseSchema,
  KeyStageResponseSchema,
  KeyStageSubjectLessonsResponseSchema,
  AllKeyStageAndSubjectUnitsResponseSchema,
  QuestionForLessonsResponseSchema,
  QuestionsForSequenceResponseSchema,
  QuestionsForKeyStageAndSubjectResponseSchema,
  LessonSummaryResponseSchema,
  LessonSearchResponseSchema,
  UnitSummaryResponseSchema,
  AllThreadsResponseSchema,
  ThreadUnitsResponseSchema,
  RateLimitResponseSchema,
} as const satisfies CurriculumSchemaCollection;

function buildCurriculumSchemas(endpoints: readonly Endpoint[]): CurriculumSchemaCollection {
  const baseSchemas = sanitizeSchemaKeys(rawCurriculumSchemas, { rename: renameInlineSchema });
  const statusSchemas: CurriculumSchemaCollection = {};
  for (const endpoint of endpoints) {
    const operationId = getOperationIdForEndpoint(endpoint.method, endpoint.path);
    if (!operationId) {
      continue;
    }
    const primaryStatus = getPrimaryStatusForOperation(operationId);
    if (primaryStatus) {
      const primaryKey = renameInlineSchema(`${operationId}_${primaryStatus}`);
      statusSchemas[primaryKey] = endpoint.response;
    }
    const errors = endpoint.errors ?? [];
    for (const error of errors) {
      const statusValue = error.status === "default" ? "default" : String(error.status);
      const errorKey = renameInlineSchema(`${operationId}_${statusValue}`);
      statusSchemas[errorKey] = error.schema;
    }
  }
  const changelogEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog");
  const latestEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog/latest");
  const additionalSchemas: CurriculumSchemaCollection = {};
  if (changelogEndpoint) {
    additionalSchemas.changelog_changelog_200 = changelogEndpoint.response;
  }
  if (latestEndpoint) {
    additionalSchemas.changelog_latest_200 = latestEndpoint.response;
  }
  return {
    ...baseSchemas,
    ...statusSchemas,
    ...additionalSchemas,
  };
}

export const endpoints: readonly Endpoint[] = ([
  {
    method: "get",
    path: "/changelog",
    description: `Use when you need the full history of API changes — for surfacing release notes or checking which version introduced a field. Returns every changelog entry with version and date.

Not for: the current version (GET /changelog/latest).`,
    requestFormat: "json",
    response: z.array(
      z
        .object({
          version: z.string(),
          date: z.string(),
          changes: z.array(z.string()),
        })
        .strict()
    ),
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/changelog/latest",
    description: `Use when you only need the current API version — e.g. a version banner or deployment check. Returns the most recent changelog entry.

Not for: full version history (GET /changelog).`,
    requestFormat: "json",
    response: z
      .object({
        version: z.string(),
        date: z.string(),
        changes: z.array(z.string()),
      })
      .strict(),
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/key-stages",
    description: `Use when you need the master list of key stages. Returns every key stage with its title and slug.

Not for: key stages restricted to a subject (GET /subjects/{subject}/key-stages).`,
    requestFormat: "json",
    response: KeyStageResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/assets",
    description: `Use when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.

Not for: assets across a sequence (GET /sequences/{sequence}/assets); assets in one programme (GET /sequences/{sequence}/programmes/{programme}/assets); a single lesson&#x27;s downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).`,
    requestFormat: "json",
    parameters: [
      {
        name: "keyStage",
        type: "Path",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]),
      },
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "slideDeck",
            "exitQuiz",
            "exitQuizAnswers",
            "starterQuiz",
            "starterQuizAnswers",
            "supplementaryResource",
            "video",
            "worksheet",
            "worksheetAnswers",
          ])
          .optional(),
      },
      {
        name: "unit",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: SubjectAssetsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/lessons",
    description: `Use when you want every published lesson in a key stage + subject, grouped by unit, without programme structure or unit sequence order. Returns an array of units, each with slug, title, and the lessons inside. Pass unit to restrict to one. Supports offset/limit pagination; Link: rel&#x3D;&quot;next&quot; header signals more pages.

Not for: finding a lesson from a search term (GET /search/lessons); a single lesson&#x27;s metadata (GET /lessons/{lesson}/summary); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units).

Example: keyStage&#x3D;ks3, subject&#x3D;maths, unit&#x3D;perimeter-and-area.`,
    requestFormat: "json",
    parameters: [
      {
        name: "keyStage",
        type: "Path",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]),
      },
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
      {
        name: "unit",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(100).optional().default(10),
      },
    ],
    response: KeyStageSubjectLessonsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/questions",
    description: `Use when you want every quiz question for a key stage + subject, without programme structure or unit sequence order. Returns lessons each with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel&#x3D;&quot;next&quot; header signals more pages.

Not for: a single lesson&#x27;s quiz (GET /lessons/{lesson}/quiz); questions across a sequence (GET /sequences/{sequence}/questions); questions in one programme (GET /sequences/{sequence}/programmes/{programme}/questions).`,
    requestFormat: "json",
    parameters: [
      {
        name: "keyStage",
        type: "Path",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]),
      },
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(100).optional().default(10),
      },
      {
        name: "filter",
        type: "Query",
        schema: z.literal("images").optional(),
      },
    ],
    response: QuestionsForKeyStageAndSubjectResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/units",
    description: `Use when you want a flat list of every unit with published lessons in a key stage + subject, without programme structure or unit sequence order. Returns units grouped by year slug; units without published lessons are omitted. Pass examBoard to restrict KS4 to one board (one of: aqa, edexcel (Edexcel A), eduqas, ocr, wjec, edexcelb (Edexcel B)); otherwise each unit lists the boards it appears in.

Not for: all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); a single unit (GET /units/{unit}/summary); lessons rather than units (GET /key-stages/{keyStage}/subject/{subject}/lessons); units in a thread (GET /threads/{threadSlug}/units).`,
    requestFormat: "json",
    parameters: [
      {
        name: "keyStage",
        type: "Path",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]),
      },
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
      {
        name: "examBoard",
        type: "Query",
        schema: z
          .enum(["aqa", "edexcel", "eduqas", "ocr", "wjec", "edexcelb"])
          .optional(),
      },
    ],
    response: AllKeyStageAndSubjectUnitsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/keywords",
    description: `Use when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Query",
        schema: z
          .enum([
            "art",
            "citizenship",
            "computing",
            "cooking-nutrition",
            "design-technology",
            "english",
            "french",
            "geography",
            "german",
            "history",
            "maths",
            "music",
            "physical-education",
            "religious-education",
            "rshe-pshe",
            "science",
            "spanish",
          ])
          .optional(),
      },
      {
        name: "keyStage",
        type: "Query",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]).optional(),
      },
      {
        name: "phase",
        type: "Query",
        schema: z.enum(["primary", "secondary"]).optional(),
      },
      {
        name: "unit",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "lesson",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.array(
      z
        .object({
          keyword: z.string(),
          description: z.string(),
          keyStageSlug: z.string(),
          subjectSlug: z.string(),
          lessonSlugs: z.array(z.string()),
        })
        .strict()
    ),
  },
  {
    method: "get",
    path: "/lessons/:lesson/assets",
    description: `Use when you have a lesson slug and need the list of what&#x27;s downloadable. Returns every available asset type with a signed download URL per asset and attribution. The 9 type values are: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Pass type to return only one. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.

Not for: streaming the file itself (GET /lessons/{lesson}/assets/{type}); bulk asset retrieval across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/assets), a sequence (GET /sequences/{sequence}/assets), or one programme (GET /sequences/{sequence}/programmes/{programme}/assets); lesson metadata (GET /lessons/{lesson}/summary).`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "slideDeck",
            "exitQuiz",
            "exitQuizAnswers",
            "starterQuiz",
            "starterQuizAnswers",
            "supplementaryResource",
            "video",
            "worksheet",
            "worksheetAnswers",
          ])
          .optional(),
      },
    ],
    response: LessonAssetsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/lessons/:lesson/assets/:type",
    description: `Use when you want to download one specific asset for a lesson — slide deck, worksheet, etc. Returns the file directly. Call GET /lessons/{lesson}/assets first to see which type values are available. Valid type values: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.

Not for: listing which asset types a lesson has (GET /lessons/{lesson}/assets); fetching the transcript (GET /lessons/{lesson}/transcript).`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "type",
        type: "Path",
        schema: z.enum([
          "slideDeck",
          "exitQuiz",
          "exitQuizAnswers",
          "starterQuiz",
          "starterQuizAnswers",
          "supplementaryResource",
          "video",
          "worksheet",
          "worksheetAnswers",
        ]),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/lessons/:lesson/quiz",
    description: `Use when you have a lesson slug and need its starter and exit quiz questions with correct answers marked. Returns two arrays, starterQuiz and exitQuiz; each question includes the prompt, the answers (with correct ones flagged), and which answers are distractors.

Not for: quiz questions across a sequence (GET /sequences/{sequence}/questions); quiz questions in one programme (GET /sequences/{sequence}/programmes/{programme}/questions); across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/questions); lesson metadata or assets (GET /lessons/{lesson}/summary or GET /lessons/{lesson}/assets).`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "filter",
        type: "Query",
        schema: z.literal("images").optional(),
      },
    ],
    response: QuestionForLessonsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/lessons/:lesson/summary",
    description: `Use when you have a lesson slug and need its full metadata: title, key stage, subject, unit, keywords, key learning points, misconceptions, pupil lesson outcome, teacher tips, content guidance, supervision level, and downloadsAvailable. Returns the lesson summary record.

Not for: finding a lesson from a search term (GET /search/lessons); searching what&#x27;s said in lesson videos (GET /search/transcripts); listing every lesson in a unit or subject (GET /key-stages/{keyStage}/subject/{subject}/lessons); the transcript or assets (GET /lessons/{lesson}/transcript or GET /lessons/{lesson}/assets).

Example slug: imagining-you-are-the-characters-the-three-billy-goats-gruff.`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: LessonSummaryResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/lessons/:lesson/transcript",
    description: `Use when you have a lesson slug and need the video transcript — for accessibility, captioning, or text analysis. Returns the transcript as an array of sentences plus a raw WebVTT captions file (vtt) suitable for a &lt;track&gt; element.

Not for: searching across transcripts (GET /search/transcripts); the video file itself (GET /lessons/{lesson}/assets/{type} with type&#x3D;video); lesson metadata (GET /lessons/{lesson}/summary).`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TranscriptResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/rate-limit",
    description: `Use when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the &#x27;X-RateLimit-*&#x27; headers of every response, so this endpoint is rarely needed directly. Does not count against your quota.`,
    requestFormat: "json",
    response: RateLimitResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/search/lessons",
    description: `Use when you want to find lessons whose titles match a search term. Returns up to 20 lessons ranked by title similarity — each with slug, title, URL, similarity score, and the unit(s) the lesson appears in. Optional keyStage, subject, and unit narrow the search.

Not for: searching what&#x27;s said in lesson videos (GET /search/transcripts); metadata for a known lesson (GET /lessons/{lesson}/summary); listing every lesson in a key stage + subject without ranking (GET /key-stages/{keyStage}/subject/{subject}/lessons).

Example queries: KS3 science photosynthesis, fractions year 5, Macbeth soliloquy.`,
    requestFormat: "json",
    parameters: [
      {
        name: "q",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "keyStage",
        type: "Query",
        schema: z.enum(["ks1", "ks2", "ks3", "ks4"]).optional(),
      },
      {
        name: "subject",
        type: "Query",
        schema: z
          .enum([
            "art",
            "citizenship",
            "computing",
            "cooking-nutrition",
            "design-technology",
            "english",
            "french",
            "geography",
            "german",
            "history",
            "maths",
            "music",
            "physical-education",
            "religious-education",
            "rshe-pshe",
            "science",
            "spanish",
          ])
          .optional(),
      },
      {
        name: "unit",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: LessonSearchResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/search/transcripts",
    description: `Use when you want to search the spoken content of lesson videos. Returns up to 5 lessons whose transcripts contain similar text, each with a transcript snippet showing the match. No filters; searches every published transcript.

Not for: terms in the lesson title (GET /search/lessons); metadata for a known lesson (GET /lessons/{lesson}/summary); a transcript by slug (GET /lessons/{lesson}/transcript).

Example queries: the mitochondria are the powerhouse, to be or not to be, carry the one.`,
    requestFormat: "json",
    parameters: [
      {
        name: "q",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: SearchTranscriptResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/sequences/:sequence",
    description: `Use when you have a sequence slug and need the sequence-level summary. A sequence is a subject&#x27;s curriculum across a phase (e.g. maths-primary, science-secondary-aqa); it spans one or more National Curriculum schemes and contains one programme per year group. Get sequence slugs from GET /subjects or GET /subjects/{subject} (the sequenceSlugs field). Returns slug, phase, key stages, years, and any KS4 programme factors (exam board, tier, child subject, pathway) needed to interpret the programmes within it.

Not for: the programmes within this sequence (GET /sequences/{sequence}/programmes); the unit sequence for one programme (GET /sequences/{sequence}/programmes/{programme}/units); all units across the sequence (GET /sequences/{sequence}/units); subject-level catalogue data (GET /subjects or GET /subjects/{subject}).

Example: sequence&#x3D;maths-primary or science-secondary-aqa.`,
    requestFormat: "json",
    parameters: [
      {
        name: "sequence",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: SubjectSequenceResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/sequences/:sequence/assets",
    description: `Use when you need every downloadable asset across a whole sequence — all programmes combined. Returns assets grouped by lesson in unit sequence order, with signed download URLs, asset type, lesson title and slug, and attribution. Pass year as an optional filter. Narrow further with type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.

Not for: assets in a single programme (GET /sequences/{sequence}/programmes/{programme}/assets); a single lesson&#x27;s downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets).`,
    requestFormat: "json",
    parameters: [
      {
        name: "sequence",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "year",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z
          .enum([
            "slideDeck",
            "exitQuiz",
            "exitQuizAnswers",
            "starterQuiz",
            "starterQuizAnswers",
            "supplementaryResource",
            "video",
            "worksheet",
            "worksheetAnswers",
          ])
          .optional(),
      },
    ],
    response: SequenceAssetsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/sequences/:sequence/questions",
    description: `Use when you want every quiz question across a whole sequence — all programmes combined. Returns questions grouped by lesson in unit sequence order. Pass year as an optional filter to return only that year&#x27;s questions. Supports offset and limit; Link: rel&#x3D;&quot;next&quot; header signals more pages.

Not for: questions in a single programme (GET /sequences/{sequence}/programmes/{programme}/questions); a single lesson&#x27;s quiz (GET /lessons/{lesson}/quiz); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).`,
    requestFormat: "json",
    parameters: [
      {
        name: "sequence",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "year",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.number().lte(100).optional().default(10),
      },
      {
        name: "filter",
        type: "Query",
        schema: z.literal("images").optional(),
      },
    ],
    response: QuestionsForSequenceResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/sequences/:sequence/units",
    description: `Use when you want every unit across a whole sequence — all programmes combined, in unit sequence order. Returns units grouped by programme (year group) in unit sequence order. If the sequence slug includes an exam board (e.g. science-secondary-aqa), units are scoped to that exam board. Secondary sequences also expose tiers, pathways, and exam subjects where applicable. Pass year as an optional filter to return only that year&#x27;s units (across all KS4 factor combinations).

Not for: units in a single programme (GET /sequences/{sequence}/programmes/{programme}/units); a flat list of units for a key stage + subject without programme structure or unit sequence order (GET /key-stages/{keyStage}/subject/{subject}/units); the programmes within this sequence (GET /sequences/{sequence}/programmes); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units).

Example: sequence&#x3D;science-secondary-aqa or maths-primary.`,
    requestFormat: "json",
    parameters: [
      {
        name: "sequence",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "year",
        type: "Query",
        schema: z
          .enum([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "all-years",
          ])
          .optional(),
      },
    ],
    response: SequenceUnitsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/subjects",
    description: `Use when you need every subject in one call — the entry point for a subject picker or for crawling the whole curriculum. Returns subjects alphabetically, each with subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for that subject; each sequence contains one programme per year group — call GET /sequences/{sequence}/programmes to enumerate them.

Not for: a single subject (GET /subjects/{subject}); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); lessons or units inside a subject (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).`,
    requestFormat: "json",
    response: z.array(
      z.enum([
        "art",
        "citizenship",
        "computing",
        "cooking-nutrition",
        "design-technology",
        "english",
        "french",
        "geography",
        "german",
        "history",
        "maths",
        "music",
        "physical-education",
        "religious-education",
        "rshe-pshe",
        "science",
        "spanish",
      ])
    ),
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/subjects/:subject",
    description: `Use when you have a subject slug. Returns subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for this subject; each sequence contains one programme per year group — call GET /sequences/{sequence}/programmes to enumerate them.

Not for: every subject in one call (GET /subjects); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); subject-scoped lessons or units (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).

Example: subject&#x3D;maths.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
    ],
    response: SubjectResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/subjects/:subject/key-stages",
    description: `Use when you only need the key stages where this subject is available. Returns key-stage titles and slugs.

Not for: every key stage (GET /key-stages); the subject record (GET /subjects/{subject}).

Example: &#x27;subject&#x3D;history&#x27;.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
    ],
    response: SubjectKeyStagesResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/subjects/:subject/years",
    description: `Use when you only need the year groups where this subject is available. Returns an array of year numbers, derived from the subject&#x27;s key stages.

Not for: the subject record (GET /subjects/{subject}); key stages rather than year groups (GET /subjects/{subject}/key-stages).

Example: &#x27;subject&#x3D;english&#x27;.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.enum([
          "art",
          "citizenship",
          "computing",
          "cooking-nutrition",
          "design-technology",
          "english",
          "french",
          "geography",
          "german",
          "history",
          "maths",
          "music",
          "physical-education",
          "religious-education",
          "rshe-pshe",
          "science",
          "spanish",
        ]),
      },
    ],
    response: z.array(z.number()),
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/threads",
    description: `Use when you want the catalogue of every thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — making vertical connections across year groups. Returns all threads with published units, sorted alphabetically — each with title, slug, and unitCount.

Not for: the units inside a thread (GET /threads/{threadSlug}/units).`,
    requestFormat: "json",
    response: AllThreadsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/threads/:threadSlug/units",
    description: `Use when you want every unit in a thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — for example, number and place value or scientific method. Units in a thread span multiple programmes and key stages; thread order is independent of unit sequence order within any individual programme. Returns units in thread order with unitTitle, unitSlug, and unitOrder.

Not for: the catalogue of threads (GET /threads); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); a single unit (GET /units/{unit}/summary).

Example: &#x27;threadSlug&#x3D;number-and-place-value&#x27;.`,
    requestFormat: "json",
    parameters: [
      {
        name: "threadSlug",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ThreadUnitsResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
  {
    method: "get",
    path: "/units/:unit/summary",
    description: `Use when you have a unit slug and need the unit summary: title, description, key stage, subject, year, threads, prior-knowledge requirements, national-curriculum statements, and the lessons inside. Unit variant slugs (ending in -1, -2, etc.) resolve to that specific variant.

Not for: listing every unit in a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/units); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); units in a thread (GET /threads/{threadSlug}/units); lessons inside the unit (GET /key-stages/{keyStage}/subject/{subject}/lessons with unit&#x3D;{unit}).`,
    requestFormat: "json",
    parameters: [
      {
        name: "unit",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "examBoard",
        type: "Query",
        schema: z
          .enum(["aqa", "edexcel", "eduqas", "ocr", "wjec", "edexcelb"])
          .optional(),
      },
      {
        name: "pathway",
        type: "Query",
        schema: z.enum(["core", "gcse"]).optional(),
      },
      {
        name: "tier",
        type: "Query",
        schema: z.enum(["core", "foundation", "higher"]).optional(),
      },
      {
        name: "childSubject",
        type: "Query",
        schema: z
          .enum(["biology", "chemistry", "combined-science", "physics"])
          .optional(),
      },
    ],
    response: UnitSummaryResponseSchema,
    errors: [
      {
        status: 400,
        description: `Bad request - e.g. &quot;Content is blocked for copyright reasons&quot;`,
        schema: error_BAD_REQUEST,
      },
      {
        status: 401,
        description: `API token not provided or invalid`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 404,
        description: `Detail of the request causing the 404, e.g. &quot;Lesson not found&quot;`,
        schema: error_NOT_FOUND,
      },
    ],
  },
]);

const curriculumSchemaCollection = buildCurriculumSchemas(endpoints);
const curriculumSchemaNames = Object.keys(curriculumSchemaCollection);
const curriculumSchemaValues: readonly z.ZodType[] = Object.values(curriculumSchemaCollection);

export const curriculumSchemas = curriculumSchemaCollection;

/**
 * Registry map keyed by generated curriculum schema names.
 * @public
 */
export type CurriculumSchemaRegistry = typeof curriculumSchemas;

/**
 * Valid curriculum schema names derived from the OpenAPI specification.
 * @public
 */
export type CurriculumSchemaName = keyof CurriculumSchemaRegistry;

/**
 * Concrete Zod schema definition for a curriculum schema name.
 * @public
 */
export type CurriculumSchemaDefinition<Name extends CurriculumSchemaName = CurriculumSchemaName> = CurriculumSchemaRegistry[Name];

export function isCurriculumSchemaName(value: unknown): value is CurriculumSchemaName {
  return typeof value === 'string' && curriculumSchemaNames.includes(value);
}

export function isCurriculumSchema(value: unknown): value is CurriculumSchemaDefinition {
  if (!(value instanceof z.ZodType)) {
    return false;
  }
  return curriculumSchemaValues.includes(value);
}
