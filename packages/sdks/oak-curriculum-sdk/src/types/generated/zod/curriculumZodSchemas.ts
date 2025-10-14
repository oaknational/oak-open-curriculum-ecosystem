import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z, type ZodSchema } from "zod";

function sanitizeSchemaKeys<T extends Record<string, ZodSchema>>(schemas: T, options?: { readonly rename?: (original: string) => string }): T {
  const rename = options?.rename ?? ((value: string) => value.replace(/[^A-Za-z0-9_]/g, "_"));
  const entries = Object.entries(schemas).map(([key, value]) => {
    const sanitized = rename(key);
    return [sanitized, value] as const;
  });
  return Object.fromEntries(entries) as T;
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
        canonicalUrl: z.string().optional(),
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
        canonicalUrl: z.string().optional(),
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
        canonicalUrl: z.string().optional(),
      })
      .passthrough(),
  ])
);
const TranscriptResponseSchema = z
  .object({
    transcript: z.string(),
    vtt: z.string(),
    canonicalUrl: z.string().optional(),
  })
  .passthrough();
const SearchTranscriptResponseSchema = z.array(
  z
    .object({
      lessonTitle: z.string(),
      lessonSlug: z.string(),
      transcriptSnippet: z.string().optional(),
      canonicalUrl: z.string().optional(),
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
      canonicalUrl: z.string().optional(),
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
      canonicalUrl: z.string().optional(),
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
    canonicalUrl: z.string(),
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
      canonicalUrl: z.string().optional(),
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
    canonicalUrl: z.string().optional(),
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
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
);
const SubjectKeyStagesResponseSchema = z.array(
  z
    .object({
      keyStageTitle: z.string(),
      keyStageSlug: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
);
const SubjectYearsResponseSchema = z.array(z.number());
const KeyStageResponseSchema = z.array(
  z
    .object({
      slug: z.string(),
      title: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
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
      canonicalUrl: z.string().optional(),
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
      canonicalUrl: z.string().optional(),
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
    canonicalUrl: z.string().optional(),
  })
  .passthrough();
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
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
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
      canonicalUrl: z.string().optional(),
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
    canonicalUrl: z.string().optional(),
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
      canonicalUrl: z.string().optional(),
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
    canonicalUrl: z.string().optional(),
  })
  .passthrough();
const AllThreadsResponseSchema = z.array(
  z
    .object({
      title: z.string(),
      slug: z.string(),
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
);
const ThreadUnitsResponseSchema = z.array(
  z
    .object({
      unitTitle: z.string(),
      unitSlug: z.string(),
      unitOrder: z.number(),
      canonicalUrl: z.string().optional(),
    })
    .passthrough()
);
const RateLimitResponseSchema = z
  .object({
    limit: z.number(),
    remaining: z.number(),
    reset: z.number(),
    canonicalUrl: z.string().optional(),
  })
  .passthrough();

export type CurriculumSchemaCollection = Record<string, ZodSchema>;

const renameInlineSchema = (original: string) => {
  if (original === "changelog_changelog_200") {
    return "ChangelogResponseSchema";
  }
  if (original === "changelog_latest_200") {
    return "ChangelogLatestResponseSchema";
  }
  return original.replace(/[^A-Za-z0-9_]/g, "_");
};

const rawCurriculumSchemas = {
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

function buildCurriculumSchemas(endpoints: ReturnType<typeof makeApi>): CurriculumSchemaCollection {
  const baseSchemas = sanitizeSchemaKeys(rawCurriculumSchemas, { rename: renameInlineSchema });
  const changelogEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog");
  const latestEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog/latest");
  if (!changelogEndpoint && !latestEndpoint) {
    return baseSchemas;
  }
  const additionalSchemas: CurriculumSchemaCollection = {};
  if (changelogEndpoint) {
    additionalSchemas["changelog_changelog_200"] = changelogEndpoint.response;
  }
  if (latestEndpoint) {
    additionalSchemas["changelog_latest_200"] = latestEndpoint.response;
  }
  return {
    ...baseSchemas,
    ...additionalSchemas,
  };
}

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
const curriculumSchemaValues: readonly z.ZodTypeAny[] = Object.values(curriculumSchemaCollection);

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

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
