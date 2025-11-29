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
  "get /sequences/:sequence/units": "getSequences-getSequenceUnits",
  "get /lessons/:lesson/transcript": "getLessonTranscript-getLessonTranscript",
  "get /search/transcripts": "searchTranscripts-searchTranscripts",
  "get /sequences/:sequence/assets": "getAssets-getSequenceAssets",
  "get /key-stages/:keyStage/subject/:subject/assets": "getAssets-getSubjectAssets",
  "get /lessons/:lesson/assets": "getAssets-getLessonAssets",
  "get /lessons/:lesson/assets/:type": "getAssets-getLessonAsset",
  "get /subjects": "getSubjects-getAllSubjects",
  "get /subjects/:subject": "getSubjects-getSubject",
  "get /subjects/:subject/sequences": "getSubjects-getSubjectSequence",
  "get /subjects/:subject/key-stages": "getSubjects-getSubjectKeyStages",
  "get /subjects/:subject/years": "getSubjects-getSubjectYears",
  "get /key-stages": "getKeyStages-getKeyStages",
  "get /key-stages/:keyStage/subject/:subject/lessons": "getKeyStageSubjectLessons-getKeyStageSubjectLessons",
  "get /key-stages/:keyStage/subject/:subject/units": "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits",
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
  "getSequences-getSequenceUnits": "200",
  "getLessonTranscript-getLessonTranscript": "200",
  "searchTranscripts-searchTranscripts": "200",
  "getAssets-getSequenceAssets": "200",
  "getAssets-getSubjectAssets": "200",
  "getAssets-getLessonAssets": "200",
  "getAssets-getLessonAsset": "200",
  "getSubjects-getAllSubjects": "200",
  "getSubjects-getSubject": "200",
  "getSubjects-getSubjectSequence": "200",
  "getSubjects-getSubjectKeyStages": "200",
  "getSubjects-getSubjectYears": "200",
  "getKeyStages-getKeyStages": "200",
  "getKeyStageSubjectLessons-getKeyStageSubjectLessons": "200",
  "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": "200",
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

function getOperationIdForEndpoint(method: string, path: string): string | undefined {
  const key = `${method.toLowerCase()} ${path}` as keyof typeof OPERATION_ID_BY_METHOD_AND_PATH;
  return OPERATION_ID_BY_METHOD_AND_PATH[key];
}

function getPrimaryStatusForOperation(operationId: string): string | undefined {
  return PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID[operationId as keyof typeof PRIMARY_RESPONSE_STATUS_BY_OPERATION_ID];
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


const SequenceUnitsResponseSchema = z.array(
  z.union([
    z
      .object({
        year: z.union([z.number(), z.literal("all-years")]),
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
                    .loose()
                ),
                categories: z
                  .array(
                    z
                      .object({
                        categoryTitle: z.string(),
                        categorySlug: z.string().optional(),
                      })
                      .loose()
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
                      .loose()
                  )
                  .optional(),
              })
              .loose(),
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
                      .loose()
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
                      .loose()
                  )
                  .optional(),
              })
              .loose(),
          ])
        ),
        canonicalUrl: z.string().optional(),
      })
      .loose(),
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
                                  .loose()
                              ),
                              categories: z
                                .array(
                                  z
                                    .object({
                                      categoryTitle: z.string(),
                                      categorySlug: z.string().optional(),
                                    })
                                    .loose()
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
                                    .loose()
                                )
                                .optional(),
                            })
                            .loose(),
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
                                    .loose()
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
                                    .loose()
                                )
                                .optional(),
                            })
                            .loose(),
                        ])
                      ),
                    })
                    .loose()
                ),
              })
              .loose(),
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
                            .loose()
                        ),
                        categories: z
                          .array(
                            z
                              .object({
                                categoryTitle: z.string(),
                                categorySlug: z.string().optional(),
                              })
                              .loose()
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
                              .loose()
                          )
                          .optional(),
                      })
                      .loose(),
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
                              .loose()
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
                              .loose()
                          )
                          .optional(),
                      })
                      .loose(),
                  ])
                ),
              })
              .loose(),
          ])
        ),
        canonicalUrl: z.string().optional(),
      })
      .loose(),
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
                          .loose()
                      ),
                      categories: z
                        .array(
                          z
                            .object({
                              categoryTitle: z.string(),
                              categorySlug: z.string().optional(),
                            })
                            .loose()
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
                            .loose()
                        )
                        .optional(),
                    })
                    .loose(),
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
                            .loose()
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
                            .loose()
                        )
                        .optional(),
                    })
                    .loose(),
                ])
              ),
            })
            .loose()
        ),
        canonicalUrl: z.string().optional(),
      })
      .loose(),
  ])
);
const TranscriptResponseSchema = z
  .object({
    transcript: z.string(),
    vtt: z.string(),
    canonicalUrl: z.string().optional(),
  })
  .loose();
const SearchTranscriptResponseSchema = z.array(
  z
    .object({
      lessonTitle: z.string(),
      lessonSlug: z.string(),
      transcriptSnippet: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
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
          .loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
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
          .loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const LessonAssetsResponseSchema = z
  .object({
    attribution: z.array(z.string()),
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
        .loose()
    ),
    canonicalUrl: z.string(),
  })
  .partial()
  .loose();
const LessonAssetResponseSchema = z.unknown();
const AllSubjectsResponseSchema = z.array(
  z
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
                .loose()
            ),
            phaseSlug: z.string(),
            phaseTitle: z.string(),
            ks4Options: z
              .object({ title: z.string(), slug: z.string() })
              .loose()
              .nullable(),
          })
          .loose()
      ),
      years: z.array(z.number()),
      keyStages: z.array(
        z
          .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
          .loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
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
              .loose()
          ),
          phaseSlug: z.string(),
          phaseTitle: z.string(),
          ks4Options: z
            .object({ title: z.string(), slug: z.string() })
            .loose()
            .nullable(),
        })
        .loose()
    ),
    years: z.array(z.number()),
    keyStages: z.array(
      z
        .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
        .loose()
    ),
    canonicalUrl: z.string().optional(),
  })
  .loose();
const SubjectSequenceResponseSchema = z.array(
  z
    .object({
      sequenceSlug: z.string(),
      years: z.array(z.number()),
      keyStages: z.array(
        z
          .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
          .loose()
      ),
      phaseSlug: z.string(),
      phaseTitle: z.string(),
      ks4Options: z
        .object({ title: z.string(), slug: z.string() })
        .loose()
        .nullable(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const SubjectKeyStagesResponseSchema = z.array(
  z
    .object({
      keyStageTitle: z.string(),
      keyStageSlug: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const SubjectYearsResponseSchema = z.array(z.number());
const KeyStageResponseSchema = z.array(
  z
    .object({
      slug: z.string(),
      title: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const KeyStageSubjectLessonsResponseSchema = z.array(
  z
    .object({
      unitSlug: z.string(),
      unitTitle: z.string(),
      lessons: z.array(
        z
          .object({ lessonSlug: z.string(), lessonTitle: z.string() })
          .loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const AllKeyStageAndSubjectUnitsResponseSchema = z.array(
  z
    .object({
      yearSlug: z.string(),
      yearTitle: z.string(),
      units: z.array(
        z.object({ unitSlug: z.string(), unitTitle: z.string() }).loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const QuestionForLessonsResponseSchema = z
  .object({
    starterQuiz: z.array(
      z
        .object({
          question: z.string(),
          questionType: z.union([
            z.literal("multiple-choice"),
            z.literal("short-answer"),
            z.literal("match"),
            z.literal("order"),
          ]),
          questionImage: z
            .object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
              alt: z.string().optional(),
              text: z.string().optional(),
              attribution: z.string().optional(),
            })
            .loose()
            .optional(),
        })
        .loose()
        .and(
          z.union([
            z
              .object({
                questionType: z.literal("multiple-choice"),
                answers: z.array(
                  z
                    .object({ distractor: z.boolean() })
                    .loose()
                    .and(
                      z.union([
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        z
                          .object({
                            type: z.literal("image"),
                            content: z
                              .object({
                                url: z.string(),
                                width: z.number(),
                                height: z.number(),
                                alt: z.string().optional(),
                                text: z.string().optional(),
                                attribution: z.string().optional(),
                              })
                              .loose(),
                          })
                          .loose(),
                      ])
                    )
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("short-answer"),
                answers: z.array(
                  z
                    .object({ type: z.literal("text"), content: z.string() })
                    .loose()
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("match"),
                answers: z.array(
                  z
                    .object({
                      matchOption: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose(),
                      correctChoice: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose(),
                    })
                    .loose()
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("order"),
                answers: z.array(
                  z
                    .object({ order: z.number() })
                    .loose()
                    .and(
                      z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose()
                    )
                ),
              })
              .loose(),
          ])
        )
    ),
    exitQuiz: z.array(
      z
        .object({
          question: z.string(),
          questionType: z.union([
            z.literal("multiple-choice"),
            z.literal("short-answer"),
            z.literal("match"),
            z.literal("order"),
          ]),
          questionImage: z
            .object({
              url: z.string(),
              width: z.number(),
              height: z.number(),
              alt: z.string().optional(),
              text: z.string().optional(),
              attribution: z.string().optional(),
            })
            .loose()
            .optional(),
        })
        .loose()
        .and(
          z.union([
            z
              .object({
                questionType: z.literal("multiple-choice"),
                answers: z.array(
                  z
                    .object({ distractor: z.boolean() })
                    .loose()
                    .and(
                      z.union([
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        z
                          .object({
                            type: z.literal("image"),
                            content: z
                              .object({
                                url: z.string(),
                                width: z.number(),
                                height: z.number(),
                                alt: z.string().optional(),
                                text: z.string().optional(),
                                attribution: z.string().optional(),
                              })
                              .loose(),
                          })
                          .loose(),
                      ])
                    )
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("short-answer"),
                answers: z.array(
                  z
                    .object({ type: z.literal("text"), content: z.string() })
                    .loose()
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("match"),
                answers: z.array(
                  z
                    .object({
                      matchOption: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose(),
                      correctChoice: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose(),
                    })
                    .loose()
                ),
              })
              .loose(),
            z
              .object({
                questionType: z.literal("order"),
                answers: z.array(
                  z
                    .object({ order: z.number() })
                    .loose()
                    .and(
                      z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .loose()
                    )
                ),
              })
              .loose(),
          ])
        )
    ),
    canonicalUrl: z.string().optional(),
  })
  .loose();
const QuestionsForSequenceResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      starterQuiz: z.array(
        z
          .object({
            question: z.string(),
            questionType: z.union([
              z.literal("multiple-choice"),
              z.literal("short-answer"),
              z.literal("match"),
              z.literal("order"),
            ]),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .loose()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .loose(),
                          z
                            .object({
                              type: z.literal("image"),
                              content: z
                                .object({
                                  url: z.string(),
                                  width: z.number(),
                                  height: z.number(),
                                  alt: z.string().optional(),
                                  text: z.string().optional(),
                                  attribution: z.string().optional(),
                                })
                                .loose(),
                            })
                            .loose(),
                        ])
                      )
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("match"),
                  answers: z.array(
                    z
                      .object({
                        matchOption: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                      })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .loose()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose()
                      )
                  ),
                })
                .loose(),
            ])
          )
      ),
      exitQuiz: z.array(
        z
          .object({
            question: z.string(),
            questionType: z.union([
              z.literal("multiple-choice"),
              z.literal("short-answer"),
              z.literal("match"),
              z.literal("order"),
            ]),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .loose()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .loose(),
                          z
                            .object({
                              type: z.literal("image"),
                              content: z
                                .object({
                                  url: z.string(),
                                  width: z.number(),
                                  height: z.number(),
                                  alt: z.string().optional(),
                                  text: z.string().optional(),
                                  attribution: z.string().optional(),
                                })
                                .loose(),
                            })
                            .loose(),
                        ])
                      )
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("match"),
                  answers: z.array(
                    z
                      .object({
                        matchOption: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                      })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .loose()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose()
                      )
                  ),
                })
                .loose(),
            ])
          )
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const QuestionsForKeyStageAndSubjectResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
      starterQuiz: z.array(
        z
          .object({
            question: z.string(),
            questionType: z.union([
              z.literal("multiple-choice"),
              z.literal("short-answer"),
              z.literal("match"),
              z.literal("order"),
            ]),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .loose()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .loose(),
                          z
                            .object({
                              type: z.literal("image"),
                              content: z
                                .object({
                                  url: z.string(),
                                  width: z.number(),
                                  height: z.number(),
                                  alt: z.string().optional(),
                                  text: z.string().optional(),
                                  attribution: z.string().optional(),
                                })
                                .loose(),
                            })
                            .loose(),
                        ])
                      )
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("match"),
                  answers: z.array(
                    z
                      .object({
                        matchOption: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                      })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .loose()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose()
                      )
                  ),
                })
                .loose(),
            ])
          )
      ),
      exitQuiz: z.array(
        z
          .object({
            question: z.string(),
            questionType: z.union([
              z.literal("multiple-choice"),
              z.literal("short-answer"),
              z.literal("match"),
              z.literal("order"),
            ]),
            questionImage: z
              .object({
                url: z.string(),
                width: z.number(),
                height: z.number(),
                alt: z.string().optional(),
                text: z.string().optional(),
                attribution: z.string().optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .loose()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .loose(),
                          z
                            .object({
                              type: z.literal("image"),
                              content: z
                                .object({
                                  url: z.string(),
                                  width: z.number(),
                                  height: z.number(),
                                  alt: z.string().optional(),
                                  text: z.string().optional(),
                                  attribution: z.string().optional(),
                                })
                                .loose(),
                            })
                            .loose(),
                        ])
                      )
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("match"),
                  answers: z.array(
                    z
                      .object({
                        matchOption: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose(),
                      })
                      .loose()
                  ),
                })
                .loose(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .loose()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .loose()
                      )
                  ),
                })
                .loose(),
            ])
          )
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const LessonSummaryResponseSchema = z
  .object({
    lessonTitle: z.string(),
    unitSlug: z.string(),
    unitTitle: z.string(),
    subjectSlug: z.string(),
    subjectTitle: z.string(),
    keyStageSlug: z.string(),
    keyStageTitle: z.string(),
    lessonKeywords: z.array(
      z.object({ keyword: z.string(), description: z.string() }).loose()
    ),
    keyLearningPoints: z.array(
      z.object({ keyLearningPoint: z.string() }).loose()
    ),
    misconceptionsAndCommonMistakes: z.array(
      z
        .object({ misconception: z.string(), response: z.string() })
        .loose()
    ),
    pupilLessonOutcome: z.string().optional(),
    teacherTips: z.array(z.object({ teacherTip: z.string() }).loose()),
    contentGuidance: z.union([
      z.array(
        z
          .object({
            contentGuidanceArea: z.string(),
            supervisionlevel_id: z.number(),
            contentGuidanceLabel: z.string(),
            contentGuidanceDescription: z.string(),
          })
          .loose()
      ),
      z.null(),
    ]),
    supervisionLevel: z.union([z.string(), z.null()]),
    downloadsAvailable: z.boolean(),
    canonicalUrl: z.string().optional(),
  })
  .loose();
const LessonSearchResponseSchema = z.array(
  z
    .object({
      lessonSlug: z.string(),
      lessonTitle: z.string(),
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
          .loose()
      ),
      canonicalUrl: z.string().optional(),
    })
    .loose()
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
          .loose()
      )
      .optional(),
    categories: z
      .array(
        z
          .object({
            categoryTitle: z.string(),
            categorySlug: z.string().optional(),
          })
          .loose()
      )
      .optional(),
    unitLessons: z.array(
      z
        .object({
          lessonSlug: z.string(),
          lessonTitle: z.string(),
          lessonOrder: z.number().optional(),
          state: z.enum(["published", "new"]),
        })
        .loose()
    ),
    canonicalUrl: z.string().optional(),
  })
  .loose();
const AllThreadsResponseSchema = z.array(
  z
    .object({
      title: z.string(),
      slug: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const ThreadUnitsResponseSchema = z.array(
  z
    .object({
      unitTitle: z.string(),
      unitSlug: z.string(),
      unitOrder: z.number(),
      canonicalUrl: z.string().optional(),
    })
    .loose()
);
const RateLimitResponseSchema = z
  .object({
    limit: z.number(),
    remaining: z.number(),
    reset: z.number(),
    canonicalUrl: z.string().optional(),
  })
  .loose();

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
  SequenceUnitsResponseSchema,
  TranscriptResponseSchema,
  SearchTranscriptResponseSchema,
  SequenceAssetsResponseSchema,
  SubjectAssetsResponseSchema,
  LessonAssetsResponseSchema,
  LessonAssetResponseSchema,
  AllSubjectsResponseSchema,
  SubjectResponseSchema,
  SubjectSequenceResponseSchema,
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
    description: `History of significant changes to the API with associated dates and versions`,
    requestFormat: "json",
    response: z.array(
      z
        .object({
          version: z.string(),
          date: z.string(),
          changes: z.array(z.string()),
        })
        .loose()
    ),
  },
  {
    method: "get",
    path: "/changelog/latest",
    description: `Get the latest version and latest change note for the API`,
    requestFormat: "json",
    response: z
      .object({
        version: z.string(),
        date: z.string(),
        changes: z.array(z.string()),
      })
      .loose(),
  },
  {
    method: "get",
    path: "/key-stages",
    description: `This endpoint returns all the key stages (titles and slugs) that are currently available on Oak`,
    requestFormat: "json",
    response: KeyStageResponseSchema,
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/assets",
    description: `This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.`,
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
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/lessons",
    description: `This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.`,
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
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/questions",
    description: `This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.`,
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
    ],
    response: QuestionsForKeyStageAndSubjectResponseSchema,
  },
  {
    method: "get",
    path: "/key-stages/:keyStage/subject/:subject/units",
    description: `This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.`,
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
    ],
    response: AllKeyStageAndSubjectUnitsResponseSchema,
  },
  {
    method: "get",
    path: "/lessons/:lesson/assets",
    description: `This endpoint returns the types of available assets for a given lesson, and the download endpoints for each. 
        This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.
          `,
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
  },
  {
    method: "get",
    path: "/lessons/:lesson/assets/:type",
    description: `This endpoint will stream the downloadable asset for the given lesson and type. 
There is no response returned for this endpoint as it returns a content attachment.`,
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
  },
  {
    method: "get",
    path: "/lessons/:lesson/quiz",
    description: `The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: QuestionForLessonsResponseSchema,
  },
  {
    method: "get",
    path: "/lessons/:lesson/summary",
    description: `This endpoint returns a summary for a given lesson`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: LessonSummaryResponseSchema,
  },
  {
    method: "get",
    path: "/lessons/:lesson/transcript",
    description: `This endpoint returns the video transcript and video captions file for a given lesson.`,
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
        status: 404,
        description: `Temporary: Documented locally until the upstream schema captures this legitimate 404 response.

Lessons without accompanying video content legitimately return HTTP 404 so callers can distinguish &quot;no transcript available&quot; from invalid lesson slugs.

Tracking: .agent/plans/upstream-api-metadata-wishlist.md item #4`,
        schema: z
          .object({
            message: z.string(),
            code: z.string(),
            data: z
              .object({
                code: z.string(),
                httpStatus: z.number().int(),
                path: z.string(),
                zodError: z
                  .union([z.object({}).partial().loose(), z.null()])
                  .optional(),
              })
              .loose(),
          })
          .loose(),
      },
    ],
  },
  {
    method: "get",
    path: "/rate-limit",
    description: `Check your current rate limit status (note that your rate limit is also included in the headers of every response).

This specific endpoint does not cost any requests.`,
    requestFormat: "json",
    response: RateLimitResponseSchema,
  },
  {
    method: "get",
    path: "/search/lessons",
    description: `Search for a term and find the 20 most similar lessons with titles that contain similar text.`,
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
  },
  {
    method: "get",
    path: "/search/transcripts",
    description: `Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.`,
    requestFormat: "json",
    parameters: [
      {
        name: "q",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: SearchTranscriptResponseSchema,
  },
  {
    method: "get",
    path: "/sequences/:sequence/assets",
    description: `This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.
This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.`,
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
  },
  {
    method: "get",
    path: "/sequences/:sequence/questions",
    description: `This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.`,
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
    ],
    response: QuestionsForSequenceResponseSchema,
  },
  {
    method: "get",
    path: "/sequences/:sequence/units",
    description: `This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.`,
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
  },
  {
    method: "get",
    path: "/subjects",
    description: `This endpoint returns an array of all available subjects and their associated sequences, key stages and years.`,
    requestFormat: "json",
    response: AllSubjectsResponseSchema,
  },
  {
    method: "get",
    path: "/subjects/:subject",
    description: `This endpoint returns the sequences, key stages and years that are currently available for a given subject.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: SubjectResponseSchema,
  },
  {
    method: "get",
    path: "/subjects/:subject/key-stages",
    description: `This endpoint returns a list of key stages that are currently available for a given subject.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: SubjectKeyStagesResponseSchema,
  },
  {
    method: "get",
    path: "/subjects/:subject/sequences",
    description: `This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: SubjectSequenceResponseSchema,
  },
  {
    method: "get",
    path: "/subjects/:subject/years",
    description: `This endpoint returns an array of years that are currently available for a given subject.`,
    requestFormat: "json",
    parameters: [
      {
        name: "subject",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(z.number()),
  },
  {
    method: "get",
    path: "/threads",
    description: `This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.`,
    requestFormat: "json",
    response: AllThreadsResponseSchema,
  },
  {
    method: "get",
    path: "/threads/:threadSlug/units",
    description: `This endpoint returns all of the units that belong to a given thread.`,
    requestFormat: "json",
    parameters: [
      {
        name: "threadSlug",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: ThreadUnitsResponseSchema,
  },
  {
    method: "get",
    path: "/units/:unit/summary",
    description: `This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit`,
    requestFormat: "json",
    parameters: [
      {
        name: "unit",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: UnitSummaryResponseSchema,
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
