export interface paths {
    "/sequences/{sequence}/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Units within a sequence
         * @description This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.
         */
        get: operations["getSequences-getSequenceUnits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/lessons/{lesson}/transcript": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lesson transcript
         * @description This endpoint returns the video transcript and video captions file for a given lesson.
         */
        get: operations["getLessonTranscript-getLessonTranscript"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/transcripts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lesson search using lesson video transcripts
         * @description Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.
         */
        get: operations["searchTranscripts-searchTranscripts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sequences/{sequence}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Assets within a sequence
         * @description This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.
         *     This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.
         */
        get: operations["getAssets-getSequenceAssets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key-stages/{keyStage}/subject/{subject}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Assets
         * @description This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.
         */
        get: operations["getAssets-getSubjectAssets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/lessons/{lesson}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Downloadable lesson assets
         * @description This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.
         *             This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.
         *
         */
        get: operations["getAssets-getLessonAssets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/lessons/{lesson}/assets/{type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lesson asset by type
         * @description This endpoint will stream the downloadable asset for the given lesson and type.
         *     There is no response returned for this endpoint as it returns a content attachment.
         */
        get: operations["getAssets-getLessonAsset"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subjects
         * @description This endpoint returns an array of all available subjects and their associated sequences, key stages and years.
         */
        get: operations["getSubjects-getAllSubjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects/{subject}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subject
         * @description This endpoint returns the sequences, key stages and years that are currently available for a given subject.
         */
        get: operations["getSubjects-getSubject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects/{subject}/sequences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Sequencing information for a given subject
         * @description This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.
         */
        get: operations["getSubjects-getSubjectSequence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects/{subject}/key-stages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Key stages within a subject
         * @description This endpoint returns a list of key stages that are currently available for a given subject.
         */
        get: operations["getSubjects-getSubjectKeyStages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects/{subject}/years": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Year groups for a given subject
         * @description This endpoint returns an array of years that are currently available for a given subject.
         */
        get: operations["getSubjects-getSubjectYears"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key-stages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Key stages
         * @description This endpoint returns all the key stages (titles and slugs) that are currently available on Oak
         */
        get: operations["getKeyStages-getKeyStages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key-stages/{keyStage}/subject/{subject}/lessons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lessons
         * @description This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.
         */
        get: operations["getKeyStageSubjectLessons-getKeyStageSubjectLessons"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key-stages/{keyStage}/subject/{subject}/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Units
         * @description This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.
         */
        get: operations["getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/lessons/{lesson}/quiz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Quiz questions by lesson
         * @description The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.
         */
        get: operations["getQuestions-getQuestionsForLessons"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sequences/{sequence}/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Questions within a sequence
         * @description This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.
         */
        get: operations["getQuestions-getQuestionsForSequence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/key-stages/{keyStage}/subject/{subject}/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Quiz questions by subject and key stage
         * @description This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.
         */
        get: operations["getQuestions-getQuestionsForKeyStageAndSubject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/lessons/{lesson}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lesson summary
         * @description This endpoint returns a summary for a given lesson
         */
        get: operations["getLessons-getLesson"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/lessons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lesson search using lesson title
         * @description Search for a term and find the 20 most similar lessons with titles that contain similar text.
         */
        get: operations["getLessons-searchByTextSimilarity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/units/{unit}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Unit summary
         * @description This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit
         */
        get: operations["getUnits-getUnit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/threads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Threads
         * @description This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.
         */
        get: operations["getThreads-getAllThreads"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/threads/{threadSlug}/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Units belonging to a given thread
         * @description This endpoint returns all of the units that belong to a given thread.
         */
        get: operations["getThreads-getThreadUnits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/changelog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description History of significant changes to the API with associated dates and versions */
        get: operations["changelog-changelog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/changelog/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get the latest version and latest change note for the API */
        get: operations["changelog-latest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rate-limit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Check your current rate limit status (note that your rate limit is also included in the headers of every response).
         *
         *     This specific endpoint does not cost any requests. */
        get: operations["getRateLimit-getRateLimit"];
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
        SequenceUnitsResponseSchema: ({
            /** @description The year group */
            year: number | "all-years";
            /** @description An optional alternative title for the year sequence */
            title?: string;
            /** @description A list of units that make up a full sequence, grouped by year. */
            units: ({
                /** @description The title of the unit */
                unitTitle: string;
                /** @description The position of the unit within the sequence. */
                unitOrder: number;
                /** @description The unique slug identifier for the unit */
                unitOptions: {
                    unitTitle: string;
                    unitSlug: string;
                }[];
                /** @description The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                categories?: {
                    /** @description The title of the category */
                    categoryTitle: string;
                    /** @description The unique identifier for the category */
                    categorySlug?: string;
                }[];
                /** @description A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                threads?: {
                    /** @description The title of the category */
                    threadTitle: string;
                    /** @description The unique identifier for the thread */
                    threadSlug: string;
                    /** @description Deprecated */
                    order: number;
                }[];
            } | {
                unitTitle: string;
                unitOrder: number;
                /** @description The unique slug identifier for the unit */
                unitSlug: string;
                categories?: {
                    /** @description The title of the category */
                    categoryTitle: string;
                    /** @description The unique identifier for the category */
                    categorySlug?: string;
                }[];
                threads?: {
                    /** @description The title of the category */
                    threadTitle: string;
                    /** @description The unique identifier for the thread */
                    threadSlug: string;
                    /** @description Deprecated */
                    order: number;
                }[];
            })[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        } | {
            year: number;
            title?: string;
            /** @description Only used in secondary science. Contains a full year's unit sequences based on which subject is being studied at KS4. */
            examSubjects: ({
                examSubjectTitle: string;
                examSubjectSlug?: string;
                tiers: {
                    /** @description The title of the tier */
                    tierTitle: string;
                    /** @description The tier identifier */
                    tierSlug: string;
                    units: ({
                        /** @description The title of the unit */
                        unitTitle: string;
                        /** @description The position of the unit within the sequence. */
                        unitOrder: number;
                        /** @description The unique slug identifier for the unit */
                        unitOptions: {
                            unitTitle: string;
                            unitSlug: string;
                        }[];
                        /** @description The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                        categories?: {
                            /** @description The title of the category */
                            categoryTitle: string;
                            /** @description The unique identifier for the category */
                            categorySlug?: string;
                        }[];
                        /** @description A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                        threads?: {
                            /** @description The title of the category */
                            threadTitle: string;
                            /** @description The unique identifier for the thread */
                            threadSlug: string;
                            /** @description Deprecated */
                            order: number;
                        }[];
                    } | {
                        unitTitle: string;
                        unitOrder: number;
                        /** @description The unique slug identifier for the unit */
                        unitSlug: string;
                        categories?: {
                            /** @description The title of the category */
                            categoryTitle: string;
                            /** @description The unique identifier for the category */
                            categorySlug?: string;
                        }[];
                        threads?: {
                            /** @description The title of the category */
                            threadTitle: string;
                            /** @description The unique identifier for the thread */
                            threadSlug: string;
                            /** @description Deprecated */
                            order: number;
                        }[];
                    })[];
                }[];
            } | {
                examSubjectTitle: string;
                examSubjectSlug?: string;
                units: ({
                    /** @description The title of the unit */
                    unitTitle: string;
                    /** @description The position of the unit within the sequence. */
                    unitOrder: number;
                    /** @description The unique slug identifier for the unit */
                    unitOptions: {
                        unitTitle: string;
                        unitSlug: string;
                    }[];
                    /** @description The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    categories?: {
                        /** @description The title of the category */
                        categoryTitle: string;
                        /** @description The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    /** @description A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    threads?: {
                        /** @description The title of the category */
                        threadTitle: string;
                        /** @description The unique identifier for the thread */
                        threadSlug: string;
                        /** @description Deprecated */
                        order: number;
                    }[];
                } | {
                    unitTitle: string;
                    unitOrder: number;
                    /** @description The unique slug identifier for the unit */
                    unitSlug: string;
                    categories?: {
                        /** @description The title of the category */
                        categoryTitle: string;
                        /** @description The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    threads?: {
                        /** @description The title of the category */
                        threadTitle: string;
                        /** @description The unique identifier for the thread */
                        threadSlug: string;
                        /** @description Deprecated */
                        order: number;
                    }[];
                })[];
            })[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        } | {
            year: number;
            title?: string;
            tiers: {
                /** @description The title of the tier */
                tierTitle: string;
                /** @description The tier identifier */
                tierSlug: string;
                units: ({
                    /** @description The title of the unit */
                    unitTitle: string;
                    /** @description The position of the unit within the sequence. */
                    unitOrder: number;
                    /** @description The unique slug identifier for the unit */
                    unitOptions: {
                        unitTitle: string;
                        unitSlug: string;
                    }[];
                    /** @description The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    categories?: {
                        /** @description The title of the category */
                        categoryTitle: string;
                        /** @description The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    /** @description A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    threads?: {
                        /** @description The title of the category */
                        threadTitle: string;
                        /** @description The unique identifier for the thread */
                        threadSlug: string;
                        /** @description Deprecated */
                        order: number;
                    }[];
                } | {
                    unitTitle: string;
                    unitOrder: number;
                    /** @description The unique slug identifier for the unit */
                    unitSlug: string;
                    categories?: {
                        /** @description The title of the category */
                        categoryTitle: string;
                        /** @description The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    threads?: {
                        /** @description The title of the category */
                        threadTitle: string;
                        /** @description The unique identifier for the thread */
                        threadSlug: string;
                        /** @description Deprecated */
                        order: number;
                    }[];
                })[];
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        })[];
        /** @example {
         *       "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
         *       "vtt": "WEBVTT\n\n1\n00:00:06.300 --> 00:00:08.070\n<v ->Hello, I'm Mrs. Lashley.</v>\n\n2\n00:00:08.070 --> 00:00:09.240\nI'm looking forward to guiding you\n\n3\n00:00:09.240 --> 00:00:10.980\nthrough your learning today..."
         *     } */
        TranscriptResponseSchema: {
            /** @description The transcript for the lesson video */
            transcript: string;
            /** @description The contents of the .vtt file for the lesson video, which maps captions to video timestamps. */
            vtt: string;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /**
             * @description The lesson title
             * @example The Roman invasion of Britain
             */
            lessonTitle: string;
            /**
             * @description The lesson slug identifier
             * @example the-roman-invasion-of-britain
             */
            lessonSlug: string;
            /**
             * @description The snippet of the transcript that matched the search term
             * @example The Romans were ready,
             */
            transcriptSnippet?: string;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The unique slug identifier for the lesson */
            lessonSlug: string;
            /** @description The title for the lesson */
            lessonTitle: string;
            /** @description Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** @description List of assets */
            assets: {
                /**
                 * @example slideDeck
                 * @enum {string}
                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** @description The label for the asset */
                label: string;
                /** @description The download endpoint for the asset. */
                url: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The unique slug identifier for the lesson */
            lessonSlug: string;
            /** @description The title for the lesson */
            lessonTitle: string;
            /** @description Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** @description List of assets */
            assets: {
                /**
                 * @example slideDeck
                 * @enum {string}
                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** @description The label for the asset */
                label: string;
                /** @description The download endpoint for the asset. */
                url: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** @description List of assets */
            assets?: {
                /**
                 * @example slideDeck
                 * @enum {string}
                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** @description The label for the asset */
                label: string;
                /** @description The download endpoint for the asset. */
                url: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        };
        /** @example {} */
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
            /** @description The subject title */
            subjectTitle: string;
            /** @description The subject slug identifier */
            subjectSlug: string;
            /** @description Information about the years, key stages and key stage 4 variance for each sequence */
            sequenceSlugs: {
                /** @description The unique identifier for each sequence */
                sequenceSlug: string;
                /** @description The years for which this subject has content available for */
                years: number[];
                /** @description The key stage slug identifiers for which this subject has content available for. */
                keyStages: {
                    /** @description The key stage title for the given key stage */
                    keyStageTitle: string;
                    /** @description The unique identifier for a given key stage */
                    keyStageSlug: string;
                }[];
                /** @description The unique identifier for the phase to which this sequence belongs */
                phaseSlug: string;
                /** @description The title for the phase to which this sequence belongs */
                phaseTitle: string;
                /** @description The key stage 4 study pathway that this sequence represents. May be null. */
                ks4Options: {
                    title: string;
                    slug: string;
                } | null;
            }[];
            /** @description The years for which this subject has content available for */
            years: number[];
            /** @description The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** @description The key stage title for the given key stage */
                keyStageTitle: string;
                /** @description The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The subject title */
            subjectTitle: string;
            /** @description The subject slug identifier */
            subjectSlug: string;
            /** @description Information about the years, key stages and key stage 4 variance for each sequence */
            sequenceSlugs: {
                /** @description The unique identifier for each sequence */
                sequenceSlug: string;
                /** @description The years for which this subject has content available for */
                years: number[];
                /** @description The key stage slug identifiers for which this subject has content available for. */
                keyStages: {
                    /** @description The key stage title for the given key stage */
                    keyStageTitle: string;
                    /** @description The unique identifier for a given key stage */
                    keyStageSlug: string;
                }[];
                /** @description The unique identifier for the phase to which this sequence belongs */
                phaseSlug: string;
                /** @description The title for the phase to which this sequence belongs */
                phaseTitle: string;
                /** @description The key stage 4 study pathway that this sequence represents. May be null. */
                ks4Options: {
                    title: string;
                    slug: string;
                } | null;
            }[];
            /** @description The years for which this subject has content available for */
            years: number[];
            /** @description The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** @description The key stage title for the given key stage */
                keyStageTitle: string;
                /** @description The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The unique identifier for each sequence */
            sequenceSlug: string;
            /** @description The years for which this subject has content available for */
            years: number[];
            /** @description The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** @description The key stage title for the given key stage */
                keyStageTitle: string;
                /** @description The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /** @description The unique identifier for the phase to which this sequence belongs */
            phaseSlug: string;
            /** @description The title for the phase to which this sequence belongs */
            phaseTitle: string;
            /** @description The key stage 4 study pathway that this sequence represents. May be null. */
            ks4Options: {
                title: string;
                slug: string;
            } | null;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        }[];
        /**
         * @description The key stage slug identifiers for which this subject has content available for
         * @example [
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
         *     ]
         */
        SubjectKeyStagesResponseSchema: {
            /** @description The key stage title for the given key stage */
            keyStageTitle: string;
            /** @description The unique identifier for a given key stage */
            keyStageSlug: string;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        }[];
        /**
         * @description The years for which this sequence has content available for
         * @example [
         *       1,
         *       2,
         *       3,
         *       4,
         *       5,
         *       6,
         *       7,
         *       8,
         *       9
         *     ]
         */
        SubjectYearsResponseSchema: number[];
        /** @example [
         *       {
         *         "slug": "ks1",
         *         "title": "Key Stage 1"
         *       }
         *     ] */
        KeyStageResponseSchema: {
            /**
             * @description The key stage slug identifier
             * @example ks1
             */
            slug: string;
            /**
             * @description The key stage title
             * @example Key Stage 1
             */
            title: string;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /**
             * @description The unit slug identifier
             * @example simple-compound-and-adverbial-complex-sentences
             */
            unitSlug: string;
            /**
             * @description The unit title
             * @example Simple, compound and adverbial complex sentences
             */
            unitTitle: string;
            /**
             * @description List of lessons for the specified unit
             * @example [
             *       {
             *         "lessonSlug": "four-types-of-simple-sentence",
             *         "lessonTitle": "Four types of simple sentence"
             *       },
             *       {
             *         "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
             *         "lessonTitle": "Three ways for co-ordination in compound sentences"
             *       }
             *     ]
             */
            lessons: {
                /**
                 * @description The lesson slug identifier
                 * @example four-types-of-simple-sentence
                 */
                lessonSlug: string;
                /**
                 * @description The lesson title
                 * @example Four types of simple sentence
                 */
                lessonTitle: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /**
             * @description The year identifier
             * @example year-3
             */
            yearSlug: string;
            /**
             * @description The year title
             * @example Year 3
             */
            yearTitle: string;
            /** @description List of units for the specified year */
            units: {
                unitSlug: string;
                unitTitle: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /** @description The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
        QuestionsForSequenceResponseSchema: {
            /** @description The lesson slug identifier */
            lessonSlug: string;
            /** @description The title of the lesson */
            lessonTitle: string;
            /** @description The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /** @description The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        }[];
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
            /** @description The lesson slug identifier */
            lessonSlug: string;
            /** @description The title of the lesson */
            lessonTitle: string;
            /** @description The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /** @description The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** @description The question text */
                question: string;
                /** @description The type of quiz question which could be one of the following:
                 *     - multiple-choice
                 *     - order
                 *     - match
                 *     - explanatory-text
                 *     - short-answer */
                questionType: "multiple-choice" | "short-answer" | "match" | "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** @description Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
            } & ({
                /** @enum {string} */
                questionType: "multiple-choice";
                answers: ({
                    /** @description Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } & ({
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                } | {
                    /** @enum {string} */
                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** @description Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                }))[];
            } | {
                /** @enum {string} */
                questionType: "short-answer";
                answers: {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                }[];
            } | {
                /** @enum {string} */
                questionType: "match";
                answers: {
                    /** @description Matching options (LHS) */
                    matchOption: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                    /** @description Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * @description The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                         * @enum {string}
                         */
                        type: "text";
                        /** @description Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** @enum {string} */
                questionType: "order";
                answers: ({
                    /** @description Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * @description The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.
                     * @enum {string}
                     */
                    type: "text";
                    /** @description Quiz question answer */
                    content: string;
                })[];
            }))[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /** @description The lesson title */
            lessonTitle: string;
            /** @description The unit slug identifier */
            unitSlug: string;
            /** @description The unit title */
            unitTitle: string;
            /** @description The subject slug identifier */
            subjectSlug: string;
            /** @description The subject slug identifier */
            subjectTitle: string;
            /** @description The key stage slug identifier */
            keyStageSlug: string;
            /** @description The key stage title */
            keyStageTitle: string;
            /** @description The lesson's keywords and their descriptions */
            lessonKeywords: {
                /** @description The keyword */
                keyword: string;
                /** @description A definition of the keyword */
                description: string;
            }[];
            /** @description The lesson's key learning points */
            keyLearningPoints: {
                /** @description A key learning point */
                keyLearningPoint: string;
            }[];
            /** @description The lesson’s anticipated common misconceptions and suggested teacher responses */
            misconceptionsAndCommonMistakes: {
                /** @description A common misconception */
                misconception: string;
                response: string;
            }[];
            /** @description Suggested teacher response to a common misconception */
            pupilLessonOutcome?: string;
            /** @description Helpful teaching tips for the lesson */
            teacherTips: {
                teacherTip: string;
            }[];
            /** @description Full guidance about the types of lesson content for the teacher to consider (where appropriate) */
            contentGuidance: {
                /** @description Category of content guidance */
                contentGuidanceArea: string;
                /** @description The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information. */
                supervisionlevel_id: number;
                /** @description Content guidance label */
                contentGuidanceLabel: string;
                /** @description A detailed description of the type of content that we suggest needs guidance. */
                contentGuidanceDescription: string;
            }[] | null;
            /** @description The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information. */
            supervisionLevel: string | null;
            /** @description Whether the lesson currently has any downloadable assets availableNote: this field reflects the current availability of downloadable assets, which reflects the availability of early-release content available for the hackathon. All lessons will eventually have downloadable assets available. */
            downloadsAvailable: boolean;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        };
        /** @example [
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
            /** @description The lesson slug identifier */
            lessonSlug: string;
            /** @description The lesson title */
            lessonTitle: string;
            /** @description The snippet of the transcript that matched the search term */
            similarity: number;
            /** @description The units that the lesson is part of. See sample response below */
            units: {
                unitSlug: string;
                unitTitle: string;
                examBoardTitle: string | null;
                keyStageSlug: string;
                subjectSlug: string;
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
            /**
             * @description The unit slug identifier
             * @example simple-compound-and-adverbial-complex-sentences
             */
            unitSlug: string;
            /**
             * @description The unit title
             * @example Simple, compound and adverbial complex sentences
             */
            unitTitle: string;
            /**
             * @description The slug identifier for the year to which the unit belongs
             * @example year-3
             */
            yearSlug: string;
            /**
             * @description The year to which the unit belongs
             * @example 3
             */
            year: number | string;
            /**
             * @description The slug identifier for the phase to which the unit belongs
             * @example primary
             */
            phaseSlug: string;
            /**
             * @description The subject identifier
             * @example english
             */
            subjectSlug: string;
            /**
             * @description The slug identifier for the the key stage to which the unit belongs
             * @example ks2
             */
            keyStageSlug: string;
            /** @description Unit summary notes */
            notes?: string;
            /** @description A short description of the unit. Not yet available for all subjects. */
            description?: string;
            /**
             * @description The prior knowledge required for the unit
             * @example [
             *       "A simple sentence is about one idea and makes complete sense.",
             *       "Any simple sentence contains one verb and at least one noun.",
             *       "Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence."
             *     ]
             */
            priorKnowledgeRequirements: string[];
            /**
             * @description National curriculum attainment statements covered in this unit
             * @example [
             *       "Ask relevant questions to extend their understanding and knowledge",
             *       "Articulate and justify answers, arguments and opinions",
             *       "Speak audibly and fluently with an increasing command of Standard English"
             *     ]
             */
            nationalCurriculumContent: string[];
            /** @description An explanation of where the unit sits within the sequence and why it has been placed there. */
            whyThisWhyNow?: string;
            /**
             * @description The threads that are associated with the unit
             * @example [
             *       {
             *         "slug": "developing-grammatical-knowledge",
             *         "title": "Developing grammatical knowledge",
             *         "order": 10
             *       }
             *     ]
             */
            threads?: {
                slug: string;
                title: string;
                order: number;
            }[];
            /** @description The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
            categories?: {
                categoryTitle: string;
                categorySlug?: string;
            }[];
            unitLessons: {
                /**
                 * @description The lesson slug identifier
                 * @example four-types-of-simple-sentence
                 */
                lessonSlug: string;
                /**
                 * @description The title for the lesson
                 * @example Four types of simple sentence
                 */
                lessonTitle: string;
                /**
                 * @description Indicates the ordering of the lesson
                 * @example 1
                 */
                lessonOrder?: number;
                /**
                 * @description If the state is 'published' then it is also available on the /lessons/* endpoints. If the state is 'new' then it's not available yet.
                 * @example published
                 * @enum {string}
                 */
                state: "published" | "new";
            }[];
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        };
        /** @example [
         *       {
         *         "title": "Number: Multiplication and division",
         *         "slug": "number-multiplication-and-division"
         *       }
         *     ] */
        AllThreadsResponseSchema: {
            /** @description The thread title */
            title: string;
            /** @description The thread slug identifier */
            slug: string;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        }[];
        /** @example [
         *       {
         *         "unitTitle": "Unitising and coin recognition - counting in 2s, 5s and 10s",
         *         "unitSlug": "unitising-and-coin-recognitions-counting-in-2s-5s-and-10s",
         *         "unitOrder": 1
         *       },
         *       {
         *         "unitTitle": "Solving problems in a range of contexts",
         *         "unitSlug": "unitising-and-coin-recognition-solving-problems-involving-money",
         *         "unitOrder": 2
         *       }
         *     ] */
        ThreadUnitsResponseSchema: {
            /** @description The unit title */
            unitTitle: string;
            /** @description The unit slug identifier */
            unitSlug: string;
            /** @description The position of the unit within the thread */
            unitOrder: number;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
        }[];
        /** @example {
         *       "limit": 1000,
         *       "remaining": 953,
         *       "reset": 1740164400000
         *     } */
        RateLimitResponseSchema: {
            /**
             * @description The maximum number of requests you can make in the current window.
             * @example 1000
             */
            limit: number;
            /**
             * @description The number of requests remaining in the current window.
             * @example 953
             */
            remaining: number;
            /**
             * @description The time at which the current window resets, in milliseconds since the Unix epoch.
             * @example 1740164400000
             */
            reset: number;
            /**
             * @description The canonical URL for this resource, generated by the SDK
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            canonicalUrl?: string;
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
    "getSequences-getSequenceUnits": {
        parameters: {
            query?: {
                year?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "all-years";
            };
            header?: never;
            path: {
                /** @description The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SequenceUnitsResponseSchema"];
                };
            };
        };
    };
    "getLessonTranscript-getLessonTranscript": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["TranscriptResponseSchema"];
                };
            };
        };
    };
    "searchTranscripts-searchTranscripts": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SearchTranscriptResponseSchema"];
                };
            };
        };
    };
    "getAssets-getSequenceAssets": {
        parameters: {
            query?: {
                year?: number;
                /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            header?: never;
            path: {
                /** @description The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SequenceAssetsResponseSchema"];
                };
            };
        };
    };
    "getAssets-getSubjectAssets": {
        parameters: {
            query?: {
                /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                unit?: string;
            };
            header?: never;
            path: {
                /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** @description Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectAssetsResponseSchema"];
                };
            };
        };
    };
    "getAssets-getLessonAssets": {
        parameters: {
            query?: {
                /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            header?: never;
            path: {
                /** @description The lesson slug identifier */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonAssetsResponseSchema"];
                };
            };
        };
    };
    "getAssets-getLessonAsset": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The lesson slug */
                lesson: string;
                /** @description Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonAssetResponseSchema"];
                };
            };
        };
    };
    "getSubjects-getAllSubjects": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllSubjectsResponseSchema"];
                };
            };
        };
    };
    "getSubjects-getSubject": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug identifier for the subject */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectResponseSchema"];
                };
            };
        };
    };
    "getSubjects-getSubjectSequence": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The slug identifier for the subject */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectSequenceResponseSchema"];
                };
            };
        };
    };
    "getSubjects-getSubjectKeyStages": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The subject slug identifier */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectKeyStagesResponseSchema"];
                };
            };
        };
    };
    "getSubjects-getSubjectYears": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Subject slug to filter by */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectYearsResponseSchema"];
                };
            };
        };
    };
    "getKeyStages-getKeyStages": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["KeyStageResponseSchema"];
                };
            };
        };
    };
    "getKeyStageSubjectLessons-getKeyStageSubjectLessons": {
        parameters: {
            query?: {
                unit?: string;
                /** @description If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** @description Limit the number of lessons, e.g. return a maximum of 100 lessons */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** @description Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["KeyStageSubjectLessonsResponseSchema"];
                };
            };
        };
    };
    "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Key stage slug to filter by, e.g. 'ks2' */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** @description Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllKeyStageAndSubjectUnitsResponseSchema"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForLessons": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The lesson slug identifier */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionForLessonsResponseSchema"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForSequence": {
        parameters: {
            query?: {
                year?: number;
                /** @description If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** @description Limit the number of lessons, e.g. return a maximum of 100 lessons */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionsForSequenceResponseSchema"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForKeyStageAndSubject": {
        parameters: {
            query?: {
                /** @description If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** @description Limit the number of lessons, e.g. return a maximum of 100 lessons */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** @description Subject slug to search by, e.g. 'science' - note that casing is important here */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionsForKeyStageAndSubjectResponseSchema"];
                };
            };
        };
    };
    "getLessons-getLesson": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonSummaryResponseSchema"];
                };
            };
        };
    };
    "getLessons-searchByTextSimilarity": {
        parameters: {
            query: {
                /** @description Search query text snippet */
                q: string;
                keyStage?: "ks1" | "ks2" | "ks3" | "ks4";
                subject?: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonSearchResponseSchema"];
                };
            };
        };
    };
    "getUnits-getUnit": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["UnitSummaryResponseSchema"];
                };
            };
        };
    };
    "getThreads-getAllThreads": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllThreadsResponseSchema"];
                };
            };
        };
    };
    "getThreads-getThreadUnits": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["ThreadUnitsResponseSchema"];
                };
            };
        };
    };
    "changelog-changelog": {
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
                headers?: never;
                content: {
                    "application/json": {
                        version: string;
                        date: string;
                        changes: string[];
                    }[];
                };
            };
        };
    };
    "changelog-latest": {
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
                headers?: never;
                content: {
                    "application/json": {
                        version: string;
                        date: string;
                        changes: string[];
                    };
                };
            };
        };
    };
    "getRateLimit-getRateLimit": {
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
                headers?: never;
                content: {
                    "application/json": components["schemas"]["RateLimitResponseSchema"];
                };
            };
        };
    };
}
