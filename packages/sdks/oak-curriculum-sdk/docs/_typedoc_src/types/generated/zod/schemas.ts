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
};
