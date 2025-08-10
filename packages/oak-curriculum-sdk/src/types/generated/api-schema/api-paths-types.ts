export interface paths {
  '/sequences/{sequence}/units': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['getSequences-getSequenceUnits'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/lessons/{lesson}/transcript': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns the transcript from the video from a lesson */
    get: operations['getLessonTranscript-getLessonTranscript'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/search/transcripts': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Search for a term and find lessons that contain similar text in their video transcripts */
    get: operations['searchTranscripts-searchTranscripts'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/sequences/{sequence}/assets': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns signed download URLs and types for the assets currently available on Oak for a given sequence */
    get: operations['getAssets-getSequenceAssets'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key-stages/{keyStage}/subject/{subject}/assets': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns signed download URLs and types for the assets currently available on Oak for a given key stage and subject, optionally filtered by type and unit, grouped by lesson */
    get: operations['getAssets-getSubjectAssets'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/lessons/{lesson}/assets': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns signed download URLS and types for the assets currently available on Oak for a given lesson */
    get: operations['getAssets-getLessonAssets'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/lessons/{lesson}/assets/{type}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint will stream the downloadable asset for the given lesson and type */
    get: operations['getAssets-getLessonAsset'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/subjects': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns an array of all subjects and associated sequences, key stages and years that are currently available on Oak */
    get: operations['getSubjects-getAllSubjects'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/subjects/{subject}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns a single subject and associated sequences, key stages and years. */
    get: operations['getSubjects-getSubject'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/subjects/{subject}/sequences': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description List of the sequences, including phase, key stage 4 options, years and key stages the sequence applies to for a subject. */
    get: operations['getSubjects-getSubjectSequence'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/subjects/{subject}/key-stages': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description List of the key stages a subject is taught in. */
    get: operations['getSubjects-getSubjectKeyStages'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/subjects/{subject}/years': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description List of the years a subject is taught in. */
    get: operations['getSubjects-getSubjectYears'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key-stages': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns all the key stages (titles and slugs) that are currently available on Oak */
    get: operations['getKeyStages-getKeyStages'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key-stages/{keyStage}/subject/{subject}/lessons': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns all the lessons (titles and slugs) that are currently available on Oak for a given subject and key stage, grouped by unit */
    get: operations['getKeyStageSubjectLessons-getKeyStageSubjectLessons'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key-stages/{keyStage}/subject/{subject}/units': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns all the units (titles and slugs) that are currently available on Oak for a given subject and key stage */
    get: operations['getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/lessons/{lesson}/quiz': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors. */
    get: operations['getQuestions-getQuestionsForLessons'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/sequences/{sequence}/questions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns the quiz questions and answers (and indicates which answers are correct and which are distractors) for a given sequence */
    get: operations['getQuestions-getQuestionsForSequence'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key-stages/{keyStage}/subject/{subject}/questions': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns all the quiz questions and answers (and indicates which answers are correct and which are distractors), grouped by lesson, for a given key stage and subject */
    get: operations['getQuestions-getQuestionsForKeyStageAndSubject'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/lessons/{lesson}/summary': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns a summary for a given lesson */
    get: operations['getLessons-getLesson'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/search/lessons': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns lessons that are similar to the search criteria, including a similarity score, and details of the unit that it is in */
    get: operations['getLessons-searchByTextSimilarity'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/units/{unit}/summary': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit */
    get: operations['getUnits-getUnit'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/threads': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Get all threads that can be used as sequence filters. */
    get: operations['getThreads-getAllThreads'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/threads/{threadSlug}/units': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Get all units for a specific thread filter. */
    get: operations['getThreads-getThreadUnits'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/changelog': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description History of significant changes to the API with associated dates and versions */
    get: operations['changelog-changelog'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/changelog/latest': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Get the latest version and latest change note for the API */
    get: operations['changelog-latest'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/rate-limit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Check your current rate limit status (note that your rate limit is also included in the headers of every response).
     *
     *     This specific endpoint does not cost any requests. */
    get: operations['getRateLimit-getRateLimit'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** @example [
     *       {
     *         "year": 1,
     *         "units": [
     *           {
     *             "unitTitle": "Speaking and Listening",
     *             "unitOrder": 1,
     *             "unitSlug": "speaking-and-listening",
     *             "categories": [
     *               {
     *                 "categoryTitle": "Reading, writing & oracy"
     *               }
     *             ],
     *             "threads": [
     *               {
     *                 "threadTitle": "Developing spoken language",
     *                 "threadSlug": "developing-spoken-language",
     *                 "order": 8
     *               }
     *             ]
     *           }
     *         ]
     *       }
     *     ] */
    SequenceUnitsResponseSchema: (
      | {
          year: number | 'all-years';
          title?: string;
          units: (
            | {
                unitTitle: string;
                unitOrder: number;
                unitOptions: {
                  unitTitle: string;
                  unitSlug: string;
                }[];
                categories?: {
                  categoryTitle: string;
                  categorySlug?: string;
                }[];
                threads?: {
                  threadTitle: string;
                  threadSlug: string;
                  order: number;
                }[];
              }
            | {
                unitTitle: string;
                unitOrder: number;
                unitSlug: string;
                categories?: {
                  categoryTitle: string;
                  categorySlug?: string;
                }[];
                threads?: {
                  threadTitle: string;
                  threadSlug: string;
                  order: number;
                }[];
              }
          )[];
        }
      | {
          year: number;
          title?: string;
          examSubjects: (
            | {
                examSubjectTitle: string;
                examSubjectSlug?: string;
                tiers: {
                  tierTitle: string;
                  tierSlug: string;
                  units: (
                    | {
                        unitTitle: string;
                        unitOrder: number;
                        unitOptions: {
                          unitTitle: string;
                          unitSlug: string;
                        }[];
                        categories?: {
                          categoryTitle: string;
                          categorySlug?: string;
                        }[];
                        threads?: {
                          threadTitle: string;
                          threadSlug: string;
                          order: number;
                        }[];
                      }
                    | {
                        unitTitle: string;
                        unitOrder: number;
                        unitSlug: string;
                        categories?: {
                          categoryTitle: string;
                          categorySlug?: string;
                        }[];
                        threads?: {
                          threadTitle: string;
                          threadSlug: string;
                          order: number;
                        }[];
                      }
                  )[];
                }[];
              }
            | {
                examSubjectTitle: string;
                examSubjectSlug?: string;
                units: (
                  | {
                      unitTitle: string;
                      unitOrder: number;
                      unitOptions: {
                        unitTitle: string;
                        unitSlug: string;
                      }[];
                      categories?: {
                        categoryTitle: string;
                        categorySlug?: string;
                      }[];
                      threads?: {
                        threadTitle: string;
                        threadSlug: string;
                        order: number;
                      }[];
                    }
                  | {
                      unitTitle: string;
                      unitOrder: number;
                      unitSlug: string;
                      categories?: {
                        categoryTitle: string;
                        categorySlug?: string;
                      }[];
                      threads?: {
                        threadTitle: string;
                        threadSlug: string;
                        order: number;
                      }[];
                    }
                )[];
              }
          )[];
        }
      | {
          year: number;
          title?: string;
          tiers: {
            tierTitle: string;
            tierSlug: string;
            units: (
              | {
                  unitTitle: string;
                  unitOrder: number;
                  unitOptions: {
                    unitTitle: string;
                    unitSlug: string;
                  }[];
                  categories?: {
                    categoryTitle: string;
                    categorySlug?: string;
                  }[];
                  threads?: {
                    threadTitle: string;
                    threadSlug: string;
                    order: number;
                  }[];
                }
              | {
                  unitTitle: string;
                  unitOrder: number;
                  unitSlug: string;
                  categories?: {
                    categoryTitle: string;
                    categorySlug?: string;
                  }[];
                  threads?: {
                    threadTitle: string;
                    threadSlug: string;
                    order: number;
                  }[];
                }
            )[];
          }[];
        }
    )[];
    /** @example {
     *       "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
     *       "vtt": "WEBVTT\n\n1\n00:00:06.300 --> 00:00:08.070\n<v ->Hello, I'm Mrs. Lashley.</v>\n\n2\n00:00:08.070 --> 00:00:09.240\nI'm looking forward to guiding you\n\n3\n00:00:09.240 --> 00:00:10.980\nthrough your learning today..."
     *     } */
    TranscriptResponseSchema: {
      transcript: string;
      vtt: string;
    };
    /** @example [
     *       {
     *         "lessonTitle": "The Roman invasion of Britain ",
     *         "lessonSlug": "the-roman-invasion-of-britain",
     *         "transcriptSnippet": "The Romans were ready,"
     *       },
     *       {
     *         "lessonTitle": "The changes to life brought about by Roman settlement",
     *         "lessonSlug": "the-changes-to-life-brought-about-by-roman-settlement",
     *         "transcriptSnippet": "when the Romans came."
     *       },
     *       {
     *         "lessonTitle": "Boudica's rebellion against Roman rule",
     *         "lessonSlug": "boudicas-rebellion-against-roman-rule",
     *         "transcriptSnippet": "kings who resisted the Romans were,"
     *       },
     *       {
     *         "lessonTitle": "How far religion changed under Roman rule",
     *         "lessonSlug": "how-far-religion-changed-under-roman-rule",
     *         "transcriptSnippet": "for the Romans."
     *       }
     *     ] */
    SearchTranscriptResponseSchema: {
      lessonTitle: string;
      lessonSlug: string;
      transcriptSnippet?: string;
    }[];
    /** @example [
     *       {
     *         "lessonSlug": "using-numerals",
     *         "lessonTitle": "Using numerals",
     *         "assets": [
     *           {
     *             "label": "Worksheet",
     *             "type": "worksheet",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
     *           },
     *           {
     *             "label": "Worksheet Answers",
     *             "type": "worksheetAnswers",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
     *           },
     *           {
     *             "label": "Video",
     *             "type": "video",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
     *           }
     *         ]
     *       }
     *     ] */
    SequenceAssetsResponseSchema: {
      lessonSlug: string;
      lessonTitle: string;
      attribution?: string[];
      assets: {
        /** @enum {string} */
        type:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
        label: string;
        url: string;
      }[];
    }[];
    /** @example [
     *       {
     *         "lessonSlug": "using-numerals",
     *         "lessonTitle": "Using numerals",
     *         "assets": [
     *           {
     *             "label": "Worksheet",
     *             "type": "worksheet",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
     *           },
     *           {
     *             "label": "Worksheet Answers",
     *             "type": "worksheetAnswers",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
     *           },
     *           {
     *             "label": "Video",
     *             "type": "video",
     *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
     *           }
     *         ]
     *       }
     *     ] */
    SubjectAssetsResponseSchema: {
      lessonSlug: string;
      lessonTitle: string;
      attribution?: string[];
      assets: {
        /** @enum {string} */
        type:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
        label: string;
        url: string;
      }[];
    }[];
    /** @example {
     *       "attribution": [
     *         "Copyright XYZ Authors",
     *         "Creative Commons Attribution Example 4.0"
     *       ],
     *       "assets": [
     *         {
     *           "label": "Worksheet",
     *           "type": "worksheet",
     *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
     *         },
     *         {
     *           "label": "Worksheet Answers",
     *           "type": "worksheetAnswers",
     *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
     *         },
     *         {
     *           "label": "Video",
     *           "type": "video",
     *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
     *         }
     *       ]
     *     } */
    LessonAssetsResponseSchema: {
      attribution?: string[];
      assets?: {
        /** @enum {string} */
        type:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
        label: string;
        url: string;
      }[];
    };
    /** @example {
     *       "200": "application/octet-stream"
     *     } */
    LessonAssetResponseSchema: unknown;
    /** @example [
     *       {
     *         "subjectTitle": "Art and design",
     *         "subjectSlug": "art",
     *         "sequenceSlugs": [
     *           {
     *             "sequenceSlug": "art-primary",
     *             "years": [
     *               1,
     *               2,
     *               3,
     *               4,
     *               5,
     *               6
     *             ],
     *             "keyStages": [
     *               {
     *                 "keyStageTitle": "Key Stage 1",
     *                 "keyStageSlug": "ks1"
     *               },
     *               {
     *                 "keyStageTitle": "Key Stage 2",
     *                 "keyStageSlug": "ks2"
     *               }
     *             ],
     *             "phaseSlug": "primary",
     *             "phaseTitle": "Primary",
     *             "ks4Options": null
     *           },
     *           {
     *             "sequenceSlug": "art-secondary",
     *             "years": [
     *               7,
     *               8,
     *               9,
     *               10,
     *               11
     *             ],
     *             "keyStages": [
     *               {
     *                 "keyStageTitle": "Key Stage 3",
     *                 "keyStageSlug": "ks3"
     *               },
     *               {
     *                 "keyStageTitle": "Key Stage 4",
     *                 "keyStageSlug": "ks4"
     *               }
     *             ],
     *             "phaseSlug": "secondary",
     *             "phaseTitle": "Secondary",
     *             "ks4Options": null
     *           }
     *         ],
     *         "years": [
     *           1,
     *           2,
     *           3,
     *           4,
     *           5,
     *           6,
     *           7,
     *           8,
     *           9,
     *           10,
     *           11
     *         ],
     *         "keyStages": [
     *           {
     *             "keyStageTitle": "Key Stage 1",
     *             "keyStageSlug": "ks1"
     *           },
     *           {
     *             "keyStageTitle": "Key Stage 2",
     *             "keyStageSlug": "ks2"
     *           },
     *           {
     *             "keyStageTitle": "Key Stage 3",
     *             "keyStageSlug": "ks3"
     *           },
     *           {
     *             "keyStageTitle": "Key Stage 4",
     *             "keyStageSlug": "ks4"
     *           }
     *         ]
     *       }
     *     ] */
    AllSubjectsResponseSchema: {
      subjectTitle: string;
      subjectSlug: string;
      sequenceSlugs: {
        sequenceSlug: string;
        years: number[];
        keyStages: {
          keyStageTitle: string;
          keyStageSlug: string;
        }[];
        phaseSlug: string;
        phaseTitle: string;
        ks4Options: {
          title: string;
          slug: string;
        } | null;
      }[];
      years: number[];
      keyStages: {
        keyStageTitle: string;
        keyStageSlug: string;
      }[];
    }[];
    /** @example {
     *       "subjectTitle": "Art and design",
     *       "subjectSlug": "art",
     *       "sequenceSlugs": [
     *         {
     *           "sequenceSlug": "art-primary",
     *           "years": [
     *             1,
     *             2,
     *             3,
     *             4,
     *             5,
     *             6
     *           ],
     *           "keyStages": [
     *             {
     *               "keyStageTitle": "Key Stage 1",
     *               "keyStageSlug": "ks1"
     *             },
     *             {
     *               "keyStageTitle": "Key Stage 2",
     *               "keyStageSlug": "ks2"
     *             }
     *           ],
     *           "phaseSlug": "primary",
     *           "phaseTitle": "Primary",
     *           "ks4Options": null
     *         },
     *         {
     *           "sequenceSlug": "art-secondary",
     *           "years": [
     *             1,
     *             2,
     *             3,
     *             4,
     *             5,
     *             6
     *           ],
     *           "keyStages": [
     *             {
     *               "keyStageTitle": "Key Stage 1",
     *               "keyStageSlug": "ks1"
     *             },
     *             {
     *               "keyStageTitle": "Key Stage 2",
     *               "keyStageSlug": "ks2"
     *             }
     *           ],
     *           "phaseSlug": "secondary",
     *           "phaseTitle": "Secondary",
     *           "ks4Options": null
     *         }
     *       ],
     *       "years": [
     *         1,
     *         2,
     *         3,
     *         4,
     *         5,
     *         6,
     *         7,
     *         8,
     *         9,
     *         10,
     *         11
     *       ],
     *       "keyStages": [
     *         {
     *           "keyStageTitle": "Key Stage 1",
     *           "keyStageSlug": "ks1"
     *         },
     *         {
     *           "keyStageTitle": "Key Stage 2",
     *           "keyStageSlug": "ks2"
     *         },
     *         {
     *           "keyStageTitle": "Key Stage 3",
     *           "keyStageSlug": "ks3"
     *         },
     *         {
     *           "keyStageTitle": "Key Stage 4",
     *           "keyStageSlug": "ks4"
     *         }
     *       ]
     *     } */
    SubjectResponseSchema: {
      subjectTitle: string;
      subjectSlug: string;
      sequenceSlugs: {
        sequenceSlug: string;
        years: number[];
        keyStages: {
          keyStageTitle: string;
          keyStageSlug: string;
        }[];
        phaseSlug: string;
        phaseTitle: string;
        ks4Options: {
          title: string;
          slug: string;
        } | null;
      }[];
      years: number[];
      keyStages: {
        keyStageTitle: string;
        keyStageSlug: string;
      }[];
    };
    /** @example [
     *       {
     *         "sequenceSlug": "art-primary",
     *         "years": [
     *           1,
     *           2,
     *           3,
     *           4,
     *           5,
     *           6
     *         ],
     *         "keyStages": [
     *           {
     *             "keyStageTitle": "Key Stage 1",
     *             "keyStageSlug": "ks1"
     *           },
     *           {
     *             "keyStageTitle": "Key Stage 2",
     *             "keyStageSlug": "ks2"
     *           }
     *         ],
     *         "phaseSlug": "primary",
     *         "phaseTitle": "Primary",
     *         "ks4Options": null
     *       },
     *       {
     *         "sequenceSlug": "art-secondary",
     *         "years": [
     *           1,
     *           2,
     *           3,
     *           4,
     *           5,
     *           6
     *         ],
     *         "keyStages": [
     *           {
     *             "keyStageTitle": "Key Stage 1",
     *             "keyStageSlug": "ks1"
     *           },
     *           {
     *             "keyStageTitle": "Key Stage 2",
     *             "keyStageSlug": "ks2"
     *           }
     *         ],
     *         "phaseSlug": "secondary",
     *         "phaseTitle": "Secondary",
     *         "ks4Options": null
     *       }
     *     ] */
    SubjectSequenceResponseSchema: {
      sequenceSlug: string;
      years: number[];
      keyStages: {
        keyStageTitle: string;
        keyStageSlug: string;
      }[];
      phaseSlug: string;
      phaseTitle: string;
      ks4Options: {
        title: string;
        slug: string;
      } | null;
    }[];
    /** @example [
     *       {
     *         "keyStageTitle": "Key Stage 1",
     *         "keyStageSlug": "ks1"
     *       },
     *       {
     *         "keyStageTitle": "Key Stage 2",
     *         "keyStageSlug": "ks2"
     *       },
     *       {
     *         "keyStageTitle": "Key Stage 3",
     *         "keyStageSlug": "ks3"
     *       },
     *       {
     *         "keyStageTitle": "Key Stage 4",
     *         "keyStageSlug": "ks4"
     *       }
     *     ] */
    SubjectKeyStagesResponseSchema: {
      keyStageTitle: string;
      keyStageSlug: string;
    }[];
    /** @example [
     *       {
     *         "slug": "ks1",
     *         "title": "Key Stage 1"
     *       }
     *     ] */
    KeyStageResponseSchema: {
      slug: string;
      title: string;
    }[];
    /** @example [
     *       {
     *         "unitSlug": "simple-compound-and-adverbial-complex-sentences",
     *         "unitTitle": "Simple, compound and adverbial complex sentences",
     *         "lessons": [
     *           {
     *             "lessonSlug": "four-types-of-simple-sentence",
     *             "lessonTitle": "Four types of simple sentence"
     *           },
     *           {
     *             "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
     *             "lessonTitle": "Three ways for co-ordination in compound sentences"
     *           }
     *         ]
     *       }
     *     ] */
    KeyStageSubjectLessonsResponseSchema: {
      unitSlug: string;
      unitTitle: string;
      lessons: {
        lessonSlug: string;
        lessonTitle: string;
      }[];
    }[];
    /** @example [
     *       {
     *         "units": [
     *           {
     *             "unitSlug": "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
     *             "unitTitle": "2, 4 and 8 times tables: using times tables to solve problems"
     *           },
     *           {
     *             "unitSlug": "bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10",
     *             "unitTitle": "Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10"
     *           }
     *         ],
     *         "yearSlug": "year-3",
     *         "yearTitle": "Year 3"
     *       }
     *     ] */
    AllKeyStageAndSubjectUnitsResponseSchema: {
      yearSlug: string;
      yearTitle: string;
      units: {
        unitSlug: string;
        unitTitle: string;
      }[];
    }[];
    /** @example {
     *       "starterQuiz": [
     *         {
     *           "question": "Tick the sentence with the correct punctuation.",
     *           "questionType": "multiple-choice",
     *           "answers": [
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "the baby cried"
     *             },
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "The baby cried"
     *             },
     *             {
     *               "distractor": false,
     *               "type": "text",
     *               "content": "The baby cried."
     *             },
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "the baby cried."
     *             }
     *           ]
     *         }
     *       ],
     *       "exitQuiz": [
     *         {
     *           "question": "Which word is a verb?",
     *           "questionType": "multiple-choice",
     *           "answers": [
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "shops"
     *             },
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "Jun"
     *             },
     *             {
     *               "distractor": true,
     *               "type": "text",
     *               "content": "I"
     *             },
     *             {
     *               "distractor": false,
     *               "type": "text",
     *               "content": "shout"
     *             }
     *           ]
     *         }
     *       ]
     *     } */
    QuestionForLessonsResponseSchema: {
      starterQuiz: ({
        question: string;
        questionType: 'multiple-choice' | 'short-answer' | 'match' | 'order';
        questionImage?: {
          url: string;
          width: number;
          height: number;
          alt?: string;
          text?: string;
          attribution?: string;
        };
      } & (
        | {
            /** @enum {string} */
            questionType: 'multiple-choice';
            answers: ({
              distractor: boolean;
            } & (
              | {
                  /** @enum {string} */
                  type: 'text';
                  content: string;
                }
              | {
                  /** @enum {string} */
                  type: 'image';
                  content: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    text?: string;
                    attribution?: string;
                  };
                }
            ))[];
          }
        | {
            /** @enum {string} */
            questionType: 'short-answer';
            answers: {
              /** @enum {string} */
              type: 'text';
              content: string;
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'match';
            answers: {
              matchOption: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
              correctChoice: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'order';
            answers: ({
              order: number;
            } & {
              /** @enum {string} */
              type: 'text';
              content: string;
            })[];
          }
      ))[];
      exitQuiz: ({
        question: string;
        questionType: 'multiple-choice' | 'short-answer' | 'match' | 'order';
        questionImage?: {
          url: string;
          width: number;
          height: number;
          alt?: string;
          text?: string;
          attribution?: string;
        };
      } & (
        | {
            /** @enum {string} */
            questionType: 'multiple-choice';
            answers: ({
              distractor: boolean;
            } & (
              | {
                  /** @enum {string} */
                  type: 'text';
                  content: string;
                }
              | {
                  /** @enum {string} */
                  type: 'image';
                  content: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    text?: string;
                    attribution?: string;
                  };
                }
            ))[];
          }
        | {
            /** @enum {string} */
            questionType: 'short-answer';
            answers: {
              /** @enum {string} */
              type: 'text';
              content: string;
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'match';
            answers: {
              matchOption: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
              correctChoice: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'order';
            answers: ({
              order: number;
            } & {
              /** @enum {string} */
              type: 'text';
              content: string;
            })[];
          }
      ))[];
    };
    /** @example [
     *       {
     *         "lessonTitle": "3D shapes can be composed from 2D nets",
     *         "lessonSlug": "3d-shapes-can-be-composed-from-2d-nets",
     *         "starterQuiz": [
     *           {
     *             "question": "Select all of the names of shapes that are polygons.",
     *             "questionType": "multiple-choice",
     *             "answers": [
     *               {
     *                 "type": "text",
     *                 "content": "Cube ",
     *                 "distractor": true
     *               },
     *               {
     *                 "type": "text",
     *                 "content": " Square",
     *                 "distractor": false
     *               },
     *               {
     *                 "type": "text",
     *                 "content": "Triangle",
     *                 "distractor": false
     *               },
     *               {
     *                 "type": "text",
     *                 "content": "Semi-circle",
     *                 "distractor": true
     *               }
     *             ]
     *           }
     *         ],
     *         "exitQuiz": [
     *           {
     *             "question": "What is a net?",
     *             "questionType": "multiple-choice",
     *             "answers": [
     *               {
     *                 "type": "text",
     *                 "content": "A 3D shape made of 2D shapes folded together. ",
     *                 "distractor": false
     *               },
     *               {
     *                 "type": "text",
     *                 "content": "A 2D shape made of 3D shapes folded togehther.",
     *                 "distractor": true
     *               },
     *               {
     *                 "type": "text",
     *                 "content": "A type of cube.",
     *                 "distractor": true
     *               }
     *             ]
     *           }
     *         ]
     *       }
     *     ] */
    QuestionsForSequenceResponseSchema: unknown;
    /** @example [
     *       {
     *         "lessonSlug": "predicting-the-size-of-a-product",
     *         "lessonTitle": "Predicting the size of a product",
     *         "starterQuiz": [
     *           {
     *             "question": "Match the number to its written representation.",
     *             "questionType": "match",
     *             "answers": [
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "seven tenths"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0.7"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "nine tenths"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0.9"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "seven ones"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "7"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "seven hundredths"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0.07"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "nine hundredths"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0.09"
     *                 }
     *               }
     *             ]
     *           }
     *         ],
     *         "exitQuiz": [
     *           {
     *             "question": "Use the fact that 9 × 8 = 72, to match the expressions to their product.",
     *             "questionType": "match",
     *             "answers": [
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "9 × 80"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "720"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "9 × 800 "
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "7,200"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "9 × 0.8"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "7.2"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "9 × 0"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0"
     *                 }
     *               },
     *               {
     *                 "matchOption": {
     *                   "type": "text",
     *                   "content": "9 × 0.08"
     *                 },
     *                 "correctChoice": {
     *                   "type": "text",
     *                   "content": "0.72"
     *                 }
     *               }
     *             ]
     *           }
     *         ]
     *       }
     *     ] */
    QuestionsForKeyStageAndSubjectResponseSchema: {
      lessonSlug: string;
      lessonTitle: string;
      starterQuiz: ({
        question: string;
        questionType: 'multiple-choice' | 'short-answer' | 'match' | 'order';
        questionImage?: {
          url: string;
          width: number;
          height: number;
          alt?: string;
          text?: string;
          attribution?: string;
        };
      } & (
        | {
            /** @enum {string} */
            questionType: 'multiple-choice';
            answers: ({
              distractor: boolean;
            } & (
              | {
                  /** @enum {string} */
                  type: 'text';
                  content: string;
                }
              | {
                  /** @enum {string} */
                  type: 'image';
                  content: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    text?: string;
                    attribution?: string;
                  };
                }
            ))[];
          }
        | {
            /** @enum {string} */
            questionType: 'short-answer';
            answers: {
              /** @enum {string} */
              type: 'text';
              content: string;
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'match';
            answers: {
              matchOption: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
              correctChoice: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'order';
            answers: ({
              order: number;
            } & {
              /** @enum {string} */
              type: 'text';
              content: string;
            })[];
          }
      ))[];
      exitQuiz: ({
        question: string;
        questionType: 'multiple-choice' | 'short-answer' | 'match' | 'order';
        questionImage?: {
          url: string;
          width: number;
          height: number;
          alt?: string;
          text?: string;
          attribution?: string;
        };
      } & (
        | {
            /** @enum {string} */
            questionType: 'multiple-choice';
            answers: ({
              distractor: boolean;
            } & (
              | {
                  /** @enum {string} */
                  type: 'text';
                  content: string;
                }
              | {
                  /** @enum {string} */
                  type: 'image';
                  content: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    text?: string;
                    attribution?: string;
                  };
                }
            ))[];
          }
        | {
            /** @enum {string} */
            questionType: 'short-answer';
            answers: {
              /** @enum {string} */
              type: 'text';
              content: string;
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'match';
            answers: {
              matchOption: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
              correctChoice: {
                /** @enum {string} */
                type: 'text';
                content: string;
              };
            }[];
          }
        | {
            /** @enum {string} */
            questionType: 'order';
            answers: ({
              order: number;
            } & {
              /** @enum {string} */
              type: 'text';
              content: string;
            })[];
          }
      ))[];
    }[];
    /** @example {
     *       "lessonTitle": "Joining using 'and'",
     *       "unitSlug": "simple-sentences",
     *       "unitTitle": "Simple sentences",
     *       "subjectSlug": "english",
     *       "subjectTitle": "English",
     *       "keyStageSlug": "ks1",
     *       "keyStageTitle": "Key Stage 1",
     *       "lessonKeywords": [
     *         {
     *           "keyword": "joining word",
     *           "description": "a word that joins words or ideas"
     *         },
     *         {
     *           "keyword": "build on",
     *           "description": "add to"
     *         },
     *         {
     *           "keyword": "related",
     *           "description": "linked to"
     *         }
     *       ],
     *       "keyLearningPoints": [
     *         {
     *           "keyLearningPoint": "And is a type of joining word."
     *         },
     *         {
     *           "keyLearningPoint": "A joining word can join two simple sentences."
     *         },
     *         {
     *           "keyLearningPoint": "Each simple sentence is about one idea and makes complete sense."
     *         },
     *         {
     *           "keyLearningPoint": "The second idea builds on to the first idea if ‘and’ is used to join them."
     *         },
     *         {
     *           "keyLearningPoint": "Grammatically accurate sentences start with capital letters and most often end with full stops."
     *         }
     *       ],
     *       "misconceptionsAndCommonMistakes": [
     *         {
     *           "misconception": "Pupils may struggle to link related ideas together.",
     *           "response": "Give some non-examples to show what it sounds like when two ideas are unrelated e.g. Dad baked bread and she missed her sister."
     *         }
     *       ],
     *       "pupilLessonOutcome": "I can join two simple sentences with 'and'.",
     *       "teacherTips": [
     *         {
     *           "teacherTip": "In Learning Cycle 1, make sure pupils are given plenty of opportunities to say sentences orally and hear that they make complete sense."
     *         }
     *       ],
     *       "contentGuidance": null,
     *       "supervisionLevel": null,
     *       "downloadsAvailable": true
     *     } */
    LessonSummaryResponseSchema: {
      lessonTitle: string;
      unitSlug: string;
      unitTitle: string;
      subjectSlug: string;
      subjectTitle: string;
      keyStageSlug: string;
      keyStageTitle: string;
      lessonKeywords: {
        keyword: string;
        description: string;
      }[];
      keyLearningPoints: {
        keyLearningPoint: string;
      }[];
      misconceptionsAndCommonMistakes: {
        misconception: string;
        response: string;
      }[];
      pupilLessonOutcome?: string;
      teacherTips: {
        teacherTip: string;
      }[];
      contentGuidance:
        | {
            contentGuidanceArea: string;
            supervisionlevel_id: number;
            contentGuidanceLabel: string;
            contentGuidanceDescription: string;
          }[]
        | null;
      supervisionLevel: string | null;
      downloadsAvailable: boolean;
    };
    /** @example [
     *       {
     *         "lessonSlug": "descriptive-writing-about-a-small-detail",
     *         "lessonTitle": "Writing a gothic description",
     *         "similarity": 0.2413793,
     *         "units": [
     *           {
     *             "unitSlug": "a-monster-within-reading-gothic-fiction",
     *             "unitTitle": "A monster within: reading and writing Gothic fiction",
     *             "examBoardTitle": null,
     *             "keyStageSlug": "ks3",
     *             "subjectSlug": "english"
     *           }
     *         ]
     *       },
     *       {
     *         "lessonSlug": "performing-your-chosen-gothic-poem",
     *         "lessonTitle": "Performing your chosen Gothic poem",
     *         "similarity": 0.20588236,
     *         "units": [
     *           {
     *             "unitSlug": "gothic-poetry",
     *             "unitTitle": "Gothic poetry",
     *             "examBoardTitle": null,
     *             "keyStageSlug": "ks3",
     *             "subjectSlug": "english"
     *           }
     *         ]
     *       },
     *       {
     *         "lessonSlug": "the-twisted-tree-the-novel-as-a-gothic-text",
     *         "lessonTitle": "'The Twisted Tree': the novel as a Gothic text",
     *         "similarity": 0.19444445,
     *         "units": [
     *           {
     *             "unitSlug": "the-twisted-tree-fiction-reading",
     *             "unitTitle": "'The Twisted Tree': fiction reading",
     *             "examBoardTitle": null,
     *             "keyStageSlug": "ks3",
     *             "subjectSlug": "english"
     *           }
     *         ]
     *       }
     *     ] */
    LessonSearchResponseSchema: {
      lessonSlug: string;
      lessonTitle: string;
      similarity: number;
      units: {
        unitSlug: string;
        unitTitle: string;
        examBoardTitle: string | null;
        keyStageSlug: string;
        subjectSlug: string;
      }[];
    }[];
    /** @example {
     *       "unitSlug": "simple-compound-and-adverbial-complex-sentences",
     *       "unitTitle": "Simple, compound and adverbial complex sentences",
     *       "yearSlug": "year-3",
     *       "year": 3,
     *       "phaseSlug": "primary",
     *       "subjectSlug": "english",
     *       "keyStageSlug": "ks2",
     *       "priorKnowledgeRequirements": [
     *         "A simple sentence is about one idea and makes complete sense.",
     *         "Any simple sentence contains one verb and at least one noun.",
     *         "Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence."
     *       ],
     *       "nationalCurriculumContent": [
     *         "Ask relevant questions to extend their understanding and knowledge",
     *         "Articulate and justify answers, arguments and opinions",
     *         "Speak audibly and fluently with an increasing command of Standard English"
     *       ],
     *       "threads": [
     *         {
     *           "slug": "developing-grammatical-knowledge",
     *           "title": "Developing grammatical knowledge",
     *           "order": 10
     *         }
     *       ],
     *       "unitLessons": [
     *         {
     *           "lessonSlug": "four-types-of-simple-sentence",
     *           "lessonTitle": "Four types of simple sentence",
     *           "lessonOrder": 1,
     *           "state": "published"
     *         },
     *         {
     *           "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
     *           "lessonTitle": "Three ways for co-ordination in compound sentences",
     *           "lessonOrder": 2,
     *           "state": "new"
     *         }
     *       ]
     *     } */
    UnitSummaryResponseSchema: {
      unitSlug: string;
      unitTitle: string;
      yearSlug: string;
      year: number | string;
      phaseSlug: string;
      subjectSlug: string;
      keyStageSlug: string;
      notes?: string;
      description?: string;
      priorKnowledgeRequirements: string[];
      nationalCurriculumContent: string[];
      whyThisWhyNow?: string;
      threads?: {
        slug: string;
        title: string;
        order: number;
      }[];
      categories?: {
        categoryTitle: string;
        categorySlug?: string;
      }[];
      unitLessons: {
        lessonSlug: string;
        lessonTitle: string;
        lessonOrder?: number;
        /** @enum {string} */
        state: 'published' | 'new';
      }[];
    };
    /** @example [
     *       {
     *         "title": "A Midsummer Night’s Dream",
     *         "slug": "a-midsummer-nights-dream-72"
     *       }
     *     ] */
    AllThreadsResponseSchema: {
      title: string;
      slug: string;
    }[];
    /**
     * Authorization not provided error (401)
     * @description The error information
     * @example {
     *       "code": "UNAUTHORIZED",
     *       "message": "Authorization not provided",
     *       "issues": []
     *     }
     */
    'error.UNAUTHORIZED': {
      /**
       * @description The error message
       * @example Authorization not provided
       */
      message: string;
      /**
       * @description The error code
       * @example UNAUTHORIZED
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
        message: string;
      }[];
    };
    /**
     * Insufficient access error (403)
     * @description The error information
     * @example {
     *       "code": "FORBIDDEN",
     *       "message": "Insufficient access",
     *       "issues": []
     *     }
     */
    'error.FORBIDDEN': {
      /**
       * @description The error message
       * @example Insufficient access
       */
      message: string;
      /**
       * @description The error code
       * @example FORBIDDEN
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
        message: string;
      }[];
    };
    /**
     * Internal server error error (500)
     * @description The error information
     * @example {
     *       "code": "INTERNAL_SERVER_ERROR",
     *       "message": "Internal server error",
     *       "issues": []
     *     }
     */
    'error.INTERNAL_SERVER_ERROR': {
      /**
       * @description The error message
       * @example Internal server error
       */
      message: string;
      /**
       * @description The error code
       * @example INTERNAL_SERVER_ERROR
       */
      code: string;
      /**
       * @description An array of issues that were responsible for the error
       * @example []
       */
      issues?: {
        message: string;
      }[];
    };
    /** @example [
     *       {
     *         "unitTitle": "A Midsummer Night's Dream, Shakespeare (Introduction and Act 1)",
     *         "unitSlug": "a-midsummer-nights-dream-shakespeare-introduction-and-act-1-2912",
     *         "unitOrder": 1
     *       },
     *       {
     *         "unitTitle": "A Midsummer Night's Dream, Shakespeare (Act 2)",
     *         "unitSlug": "a-midsummer-nights-dream-shakespeare-act-2-3c74",
     *         "unitOrder": 2
     *       }
     *     ] */
    ThreadUnitsResponseSchema: {
      unitTitle: string;
      unitSlug: string;
      unitOrder: number;
    }[];
    /** @example {
     *       "limit": 1000,
     *       "remaining": 953,
     *       "reset": 1740164400000
     *     } */
    RateLimitResponseSchema: {
      limit: number;
      remaining: number;
      reset: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  'getSequences-getSequenceUnits': {
    parameters: {
      query?: {
        year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';
      };
      header?: never;
      path: {
        sequence: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SequenceUnitsResponseSchema'];
        };
      };
    };
  };
  'getLessonTranscript-getLessonTranscript': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The slug of the lesson */
        lesson: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TranscriptResponseSchema'];
        };
      };
    };
  };
  'searchTranscripts-searchTranscripts': {
    parameters: {
      query: {
        /** @description A snippet of text to search for in the lesson video transcripts */
        q: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SearchTranscriptResponseSchema'];
        };
      };
    };
  };
  'getAssets-getSequenceAssets': {
    parameters: {
      query?: {
        year?: number;
        /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
        type?:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
      };
      header?: never;
      path: {
        sequence: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SequenceAssetsResponseSchema'];
        };
      };
    };
  };
  'getAssets-getSubjectAssets': {
    parameters: {
      query?: {
        /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
        type?:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
        /** @description Optional unit slug to additionally filter by */
        unit?: string;
      };
      header?: never;
      path: {
        /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
        keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
        /** @description Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
        subject:
          | 'art'
          | 'citizenship'
          | 'computing'
          | 'cooking-nutrition'
          | 'design-technology'
          | 'english'
          | 'french'
          | 'geography'
          | 'german'
          | 'history'
          | 'maths'
          | 'music'
          | 'physical-education'
          | 'religious-education'
          | 'rshe-pshe'
          | 'science'
          | 'spanish';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubjectAssetsResponseSchema'];
        };
      };
    };
  };
  'getAssets-getLessonAssets': {
    parameters: {
      query?: {
        /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
        type?:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
      };
      header?: never;
      path: {
        /** @description The lesson slug */
        lesson: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['LessonAssetsResponseSchema'];
        };
      };
    };
  };
  'getAssets-getLessonAsset': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The lesson slug */
        lesson: string;
        /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
        type:
          | 'slideDeck'
          | 'exitQuiz'
          | 'exitQuizAnswers'
          | 'starterQuiz'
          | 'starterQuizAnswers'
          | 'supplementaryResource'
          | 'video'
          | 'worksheet'
          | 'worksheetAnswers';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['LessonAssetResponseSchema'];
        };
      };
    };
  };
  'getSubjects-getAllSubjects': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AllSubjectsResponseSchema'];
        };
      };
    };
  };
  'getSubjects-getSubject': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        subject: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubjectResponseSchema'];
        };
      };
    };
  };
  'getSubjects-getSubjectSequence': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        subject: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubjectSequenceResponseSchema'];
        };
      };
    };
  };
  'getSubjects-getSubjectKeyStages': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        subject: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['SubjectKeyStagesResponseSchema'];
        };
      };
    };
  };
  'getSubjects-getSubjectYears': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        subject: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': number[];
        };
      };
    };
  };
  'getKeyStages-getKeyStages': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyStageResponseSchema'];
        };
      };
    };
  };
  'getKeyStageSubjectLessons-getKeyStageSubjectLessons': {
    parameters: {
      query?: {
        /** @description Optional unit slug to additionally filter by */
        unit?: string;
        offset?: number;
        /** @description Limit the number of results returned, max 100 */
        limit?: number;
      };
      header?: never;
      path: {
        /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
        keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
        /** @description Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase */
        subject:
          | 'art'
          | 'citizenship'
          | 'computing'
          | 'cooking-nutrition'
          | 'design-technology'
          | 'english'
          | 'french'
          | 'geography'
          | 'german'
          | 'history'
          | 'maths'
          | 'music'
          | 'physical-education'
          | 'religious-education'
          | 'rshe-pshe'
          | 'science'
          | 'spanish';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyStageSubjectLessonsResponseSchema'];
        };
      };
    };
  };
  'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description Key stage slug to filter by, e.g. 'ks2' */
        keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
        /** @description Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
        subject:
          | 'art'
          | 'citizenship'
          | 'computing'
          | 'cooking-nutrition'
          | 'design-technology'
          | 'english'
          | 'french'
          | 'geography'
          | 'german'
          | 'history'
          | 'maths'
          | 'music'
          | 'physical-education'
          | 'religious-education'
          | 'rshe-pshe'
          | 'science'
          | 'spanish';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AllKeyStageAndSubjectUnitsResponseSchema'];
        };
      };
    };
  };
  'getQuestions-getQuestionsForLessons': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        lesson: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['QuestionForLessonsResponseSchema'];
        };
      };
    };
  };
  'getQuestions-getQuestionsForSequence': {
    parameters: {
      query?: {
        year?: number;
        offset?: number;
        /** @description Limit the number of results returned, max 100 */
        limit?: number;
      };
      header?: never;
      path: {
        sequence: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['QuestionsForSequenceResponseSchema'];
        };
      };
    };
  };
  'getQuestions-getQuestionsForKeyStageAndSubject': {
    parameters: {
      query?: {
        offset?: number;
        /** @description Limit the number of results returned, max 100 */
        limit?: number;
      };
      header?: never;
      path: {
        /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
        keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
        /** @description Subject slug to search by, e.g. 'science' - note that casing is important here */
        subject:
          | 'art'
          | 'citizenship'
          | 'computing'
          | 'cooking-nutrition'
          | 'design-technology'
          | 'english'
          | 'french'
          | 'geography'
          | 'german'
          | 'history'
          | 'maths'
          | 'music'
          | 'physical-education'
          | 'religious-education'
          | 'rshe-pshe'
          | 'science'
          | 'spanish';
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['QuestionsForKeyStageAndSubjectResponseSchema'];
        };
      };
    };
  };
  'getLessons-getLesson': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The slug of the lesson */
        lesson: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['LessonSummaryResponseSchema'];
        };
      };
    };
  };
  'getLessons-searchByTextSimilarity': {
    parameters: {
      query: {
        q: string;
        /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
        keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
        /** @description Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase */
        subject?:
          | 'art'
          | 'citizenship'
          | 'computing'
          | 'cooking-nutrition'
          | 'design-technology'
          | 'english'
          | 'french'
          | 'geography'
          | 'german'
          | 'history'
          | 'maths'
          | 'music'
          | 'physical-education'
          | 'religious-education'
          | 'rshe-pshe'
          | 'science'
          | 'spanish';
        /** @description Optional unit slug to additionally filter by */
        unit?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['LessonSearchResponseSchema'];
        };
      };
    };
  };
  'getUnits-getUnit': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The unit slug */
        unit: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UnitSummaryResponseSchema'];
        };
      };
    };
  };
  'getThreads-getAllThreads': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['AllThreadsResponseSchema'];
        };
      };
      /** @description Authorization not provided */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['error.UNAUTHORIZED'];
        };
      };
      /** @description Insufficient access */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['error.FORBIDDEN'];
        };
      };
      /** @description Internal server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['error.INTERNAL_SERVER_ERROR'];
        };
      };
    };
  };
  'getThreads-getThreadUnits': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        threadSlug: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ThreadUnitsResponseSchema'];
        };
      };
    };
  };
  'changelog-changelog': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            version: string;
            date: string;
            changes: string[];
          }[];
        };
      };
    };
  };
  'changelog-latest': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            version: string;
            date: string;
            changes: string[];
          };
        };
      };
    };
  };
  'getRateLimit-getRateLimit': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RateLimitResponseSchema'];
        };
      };
    };
  };
}
