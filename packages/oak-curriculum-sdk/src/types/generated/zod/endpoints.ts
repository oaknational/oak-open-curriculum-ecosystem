import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

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
                    .passthrough()
                ),
                categories: z
                  .array(
                    z
                      .object({
                        categoryTitle: z.string(),
                        categorySlug: z.string().optional(),
                      })
                      .passthrough()
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
                      .passthrough()
                  )
                  .optional(),
              })
              .passthrough(),
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
                      .passthrough()
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
                      .passthrough()
                  )
                  .optional(),
              })
              .passthrough(),
          ])
        ),
      })
      .passthrough(),
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
                                  .passthrough()
                              ),
                              categories: z
                                .array(
                                  z
                                    .object({
                                      categoryTitle: z.string(),
                                      categorySlug: z.string().optional(),
                                    })
                                    .passthrough()
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
                                    .passthrough()
                                )
                                .optional(),
                            })
                            .passthrough(),
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
                                    .passthrough()
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
                                    .passthrough()
                                )
                                .optional(),
                            })
                            .passthrough(),
                        ])
                      ),
                    })
                    .passthrough()
                ),
              })
              .passthrough(),
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
                            .passthrough()
                        ),
                        categories: z
                          .array(
                            z
                              .object({
                                categoryTitle: z.string(),
                                categorySlug: z.string().optional(),
                              })
                              .passthrough()
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
                              .passthrough()
                          )
                          .optional(),
                      })
                      .passthrough(),
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
                              .passthrough()
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
                              .passthrough()
                          )
                          .optional(),
                      })
                      .passthrough(),
                  ])
                ),
              })
              .passthrough(),
          ])
        ),
      })
      .passthrough(),
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
                          .passthrough()
                      ),
                      categories: z
                        .array(
                          z
                            .object({
                              categoryTitle: z.string(),
                              categorySlug: z.string().optional(),
                            })
                            .passthrough()
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
                            .passthrough()
                        )
                        .optional(),
                    })
                    .passthrough(),
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
                            .passthrough()
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
                            .passthrough()
                        )
                        .optional(),
                    })
                    .passthrough(),
                ])
              ),
            })
            .passthrough()
        ),
      })
      .passthrough(),
  ])
);
const TranscriptResponseSchema = z
  .object({ transcript: z.string(), vtt: z.string() })
  .passthrough();
const SearchTranscriptResponseSchema = z.array(
  z
    .object({
      lessonTitle: z.string(),
      lessonSlug: z.string(),
      transcriptSnippet: z.string().optional(),
    })
    .passthrough()
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
          .passthrough()
      ),
    })
    .passthrough()
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
          .passthrough()
      ),
    })
    .passthrough()
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
        .passthrough()
    ),
  })
  .partial()
  .passthrough();
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
                .passthrough()
            ),
            phaseSlug: z.string(),
            phaseTitle: z.string(),
            ks4Options: z
              .object({ title: z.string(), slug: z.string() })
              .passthrough()
              .nullable(),
          })
          .passthrough()
      ),
      years: z.array(z.number()),
      keyStages: z.array(
        z
          .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
          .passthrough()
      ),
    })
    .passthrough()
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
              .passthrough()
          ),
          phaseSlug: z.string(),
          phaseTitle: z.string(),
          ks4Options: z
            .object({ title: z.string(), slug: z.string() })
            .passthrough()
            .nullable(),
        })
        .passthrough()
    ),
    years: z.array(z.number()),
    keyStages: z.array(
      z
        .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
        .passthrough()
    ),
  })
  .passthrough();
const SubjectSequenceResponseSchema = z.array(
  z
    .object({
      sequenceSlug: z.string(),
      years: z.array(z.number()),
      keyStages: z.array(
        z
          .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
          .passthrough()
      ),
      phaseSlug: z.string(),
      phaseTitle: z.string(),
      ks4Options: z
        .object({ title: z.string(), slug: z.string() })
        .passthrough()
        .nullable(),
    })
    .passthrough()
);
const SubjectKeyStagesResponseSchema = z.array(
  z
    .object({ keyStageTitle: z.string(), keyStageSlug: z.string() })
    .passthrough()
);
const KeyStageResponseSchema = z.array(
  z.object({ slug: z.string(), title: z.string() }).passthrough()
);
const KeyStageSubjectLessonsResponseSchema = z.array(
  z
    .object({
      unitSlug: z.string(),
      unitTitle: z.string(),
      lessons: z.array(
        z
          .object({ lessonSlug: z.string(), lessonTitle: z.string() })
          .passthrough()
      ),
    })
    .passthrough()
);
const AllKeyStageAndSubjectUnitsResponseSchema = z.array(
  z
    .object({
      yearSlug: z.string(),
      yearTitle: z.string(),
      units: z.array(
        z.object({ unitSlug: z.string(), unitTitle: z.string() }).passthrough()
      ),
    })
    .passthrough()
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
            .passthrough()
            .optional(),
        })
        .passthrough()
        .and(
          z.union([
            z
              .object({
                questionType: z.literal("multiple-choice"),
                answers: z.array(
                  z
                    .object({ distractor: z.boolean() })
                    .passthrough()
                    .and(
                      z.union([
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough(),
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
                              .passthrough(),
                          })
                          .passthrough(),
                      ])
                    )
                ),
              })
              .passthrough(),
            z
              .object({
                questionType: z.literal("short-answer"),
                answers: z.array(
                  z
                    .object({ type: z.literal("text"), content: z.string() })
                    .passthrough()
                ),
              })
              .passthrough(),
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
                        .passthrough(),
                      correctChoice: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .passthrough(),
                    })
                    .passthrough()
                ),
              })
              .passthrough(),
            z
              .object({
                questionType: z.literal("order"),
                answers: z.array(
                  z
                    .object({ order: z.number() })
                    .passthrough()
                    .and(
                      z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .passthrough()
                    )
                ),
              })
              .passthrough(),
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
            .passthrough()
            .optional(),
        })
        .passthrough()
        .and(
          z.union([
            z
              .object({
                questionType: z.literal("multiple-choice"),
                answers: z.array(
                  z
                    .object({ distractor: z.boolean() })
                    .passthrough()
                    .and(
                      z.union([
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough(),
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
                              .passthrough(),
                          })
                          .passthrough(),
                      ])
                    )
                ),
              })
              .passthrough(),
            z
              .object({
                questionType: z.literal("short-answer"),
                answers: z.array(
                  z
                    .object({ type: z.literal("text"), content: z.string() })
                    .passthrough()
                ),
              })
              .passthrough(),
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
                        .passthrough(),
                      correctChoice: z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .passthrough(),
                    })
                    .passthrough()
                ),
              })
              .passthrough(),
            z
              .object({
                questionType: z.literal("order"),
                answers: z.array(
                  z
                    .object({ order: z.number() })
                    .passthrough()
                    .and(
                      z
                        .object({
                          type: z.literal("text"),
                          content: z.string(),
                        })
                        .passthrough()
                    )
                ),
              })
              .passthrough(),
          ])
        )
    ),
  })
  .passthrough();
const QuestionsForSequenceResponseSchema = z.unknown();
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
              .passthrough()
              .optional(),
          })
          .passthrough()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .passthrough()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .passthrough(),
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
                                .passthrough(),
                            })
                            .passthrough(),
                        ])
                      )
                  ),
                })
                .passthrough(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .passthrough()
                  ),
                })
                .passthrough(),
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
                          .passthrough(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough(),
                      })
                      .passthrough()
                  ),
                })
                .passthrough(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .passthrough()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough()
                      )
                  ),
                })
                .passthrough(),
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
              .passthrough()
              .optional(),
          })
          .passthrough()
          .and(
            z.union([
              z
                .object({
                  questionType: z.literal("multiple-choice"),
                  answers: z.array(
                    z
                      .object({ distractor: z.boolean() })
                      .passthrough()
                      .and(
                        z.union([
                          z
                            .object({
                              type: z.literal("text"),
                              content: z.string(),
                            })
                            .passthrough(),
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
                                .passthrough(),
                            })
                            .passthrough(),
                        ])
                      )
                  ),
                })
                .passthrough(),
              z
                .object({
                  questionType: z.literal("short-answer"),
                  answers: z.array(
                    z
                      .object({ type: z.literal("text"), content: z.string() })
                      .passthrough()
                  ),
                })
                .passthrough(),
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
                          .passthrough(),
                        correctChoice: z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough(),
                      })
                      .passthrough()
                  ),
                })
                .passthrough(),
              z
                .object({
                  questionType: z.literal("order"),
                  answers: z.array(
                    z
                      .object({ order: z.number() })
                      .passthrough()
                      .and(
                        z
                          .object({
                            type: z.literal("text"),
                            content: z.string(),
                          })
                          .passthrough()
                      )
                  ),
                })
                .passthrough(),
            ])
          )
      ),
    })
    .passthrough()
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
      z.object({ keyword: z.string(), description: z.string() }).passthrough()
    ),
    keyLearningPoints: z.array(
      z.object({ keyLearningPoint: z.string() }).passthrough()
    ),
    misconceptionsAndCommonMistakes: z.array(
      z
        .object({ misconception: z.string(), response: z.string() })
        .passthrough()
    ),
    pupilLessonOutcome: z.string().optional(),
    teacherTips: z.array(z.object({ teacherTip: z.string() }).passthrough()),
    contentGuidance: z.union([
      z.array(
        z
          .object({
            contentGuidanceArea: z.string(),
            supervisionlevel_id: z.number(),
            contentGuidanceLabel: z.string(),
            contentGuidanceDescription: z.string(),
          })
          .passthrough()
      ),
      z.null(),
    ]),
    supervisionLevel: z.union([z.string(), z.null()]),
    downloadsAvailable: z.boolean(),
  })
  .passthrough();
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
          .passthrough()
      ),
    })
    .passthrough()
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
          .passthrough()
      )
      .optional(),
    categories: z
      .array(
        z
          .object({
            categoryTitle: z.string(),
            categorySlug: z.string().optional(),
          })
          .passthrough()
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
        .passthrough()
    ),
  })
  .passthrough();
const AllThreadsResponseSchema = z.array(
  z.object({ title: z.string(), slug: z.string() }).passthrough()
);
const error_UNAUTHORIZED = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).passthrough()).optional(),
  })
  .passthrough();
const error_FORBIDDEN = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).passthrough()).optional(),
  })
  .passthrough();
const error_INTERNAL_SERVER_ERROR = z
  .object({
    message: z.string(),
    code: z.string(),
    issues: z.array(z.object({ message: z.string() }).passthrough()).optional(),
  })
  .passthrough();
const ThreadUnitsResponseSchema = z.array(
  z
    .object({
      unitTitle: z.string(),
      unitSlug: z.string(),
      unitOrder: z.number(),
    })
    .passthrough()
);
const RateLimitResponseSchema = z
  .object({ limit: z.number(), remaining: z.number(), reset: z.number() })
  .passthrough();

export const schemas = {
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
  error_UNAUTHORIZED,
  error_FORBIDDEN,
  error_INTERNAL_SERVER_ERROR,
  ThreadUnitsResponseSchema,
  RateLimitResponseSchema,
};

export const endpoints = makeApi([
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
        .passthrough()
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
      .passthrough(),
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
    description: `This endpoint returns signed download URLs and types for the assets currently available on Oak for a given key stage and subject, optionally filtered by type and unit, grouped by lesson`,
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
    description: `This endpoint returns all the lessons (titles and slugs) that are currently available on Oak for a given subject and key stage, grouped by unit`,
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
    description: `This endpoint returns all the quiz questions and answers (and indicates which answers are correct and which are distractors), grouped by lesson, for a given key stage and subject`,
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
    description: `This endpoint returns all the units (titles and slugs) that are currently available on Oak for a given subject and key stage`,
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
    description: `This endpoint returns signed download URLS and types for the assets currently available on Oak for a given lesson`,
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
    description: `This endpoint will stream the downloadable asset for the given lesson and type`,
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
    description: `This endpoint returns the transcript from the video from a lesson`,
    requestFormat: "json",
    parameters: [
      {
        name: "lesson",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TranscriptResponseSchema,
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
    description: `This endpoint returns lessons that are similar to the search criteria, including a similarity score, and details of the unit that it is in`,
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
    description: `Search for a term and find lessons that contain similar text in their video transcripts`,
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
    description: `This endpoint returns signed download URLs and types for the assets currently available on Oak for a given sequence`,
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
    description: `This endpoint returns the quiz questions and answers (and indicates which answers are correct and which are distractors) for a given sequence`,
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
    response: z.unknown(),
  },
  {
    method: "get",
    path: "/sequences/:sequence/units",
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
    description: `This endpoint returns an array of all subjects and associated sequences, key stages and years that are currently available on Oak`,
    requestFormat: "json",
    response: AllSubjectsResponseSchema,
  },
  {
    method: "get",
    path: "/subjects/:subject",
    description: `This endpoint returns a single subject and associated sequences, key stages and years.`,
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
    description: `List of the key stages a subject is taught in.`,
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
    description: `List of the sequences, including phase, key stage 4 options, years and key stages the sequence applies to for a subject.`,
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
    description: `List of the years a subject is taught in.`,
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
    description: `Get all threads that can be used as sequence filters.`,
    requestFormat: "json",
    response: AllThreadsResponseSchema,
    errors: [
      {
        status: 401,
        description: `Authorization not provided`,
        schema: error_UNAUTHORIZED,
      },
      {
        status: 403,
        description: `Insufficient access`,
        schema: error_FORBIDDEN,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: error_INTERNAL_SERVER_ERROR,
      },
    ],
  },
  {
    method: "get",
    path: "/threads/:threadSlug/units",
    description: `Get all units for a specific thread filter.`,
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

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
