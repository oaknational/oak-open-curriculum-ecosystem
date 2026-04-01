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
         * This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.
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
         * This endpoint returns the video transcript and video captions file for a given lesson.
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
         * Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.
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
         * This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.
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
         * This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.
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
         * This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.
         *             This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.
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
         * This endpoint will stream the downloadable asset for the given lesson and type.
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
         * This endpoint returns an array of all available subjects and their associated sequences, key stages and years.
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
         * This endpoint returns the sequences, key stages and years that are currently available for a given subject.
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
         * This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.
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
         * This endpoint returns a list of key stages that are currently available for a given subject.
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
         * This endpoint returns an array of years that are currently available for a given subject.
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
         * This endpoint returns all the key stages (titles and slugs) that are currently available on Oak
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
         * This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.
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
         * This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.
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
    "/keywords": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Keywords
         * This endpoint returns a list of keywords for a given key stage and subject, based on the keywords associated with the lessons that are available for that key stage and subject. The keywords are returned in order of frequency, with the most common keywords appearing first.
         */
        get: operations["getKeywords-getKeywords"];
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
         * The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.
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
         * This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.
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
         * This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.
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
         * This endpoint returns a summary for a given lesson
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
         * Search for a term and find the 20 most similar lessons with titles that contain similar text.
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
         * This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit
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
         * This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.
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
         * This endpoint returns all of the units that belong to a given thread.
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
        /** History of significant changes to the API with associated dates and versions */
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
        /** Get the latest version and latest change note for the API */
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
        /**
         * Check your current rate limit status (note that your rate limit is also included in the headers of every response).
         *
         *     This specific endpoint does not cost any requests.
         */
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
        /**
         * @example [
         *       \{
         *         "year": 1,
         *         "units": [
         *           \{
         *             "unitTitle": "Speaking and Listening",
         *             "unitOrder": 1,
         *             "unitSlug": "speaking-and-listening",
         *             "categories": [
         *               \{
         *                 "categoryTitle": "Reading, writing & oracy"
         *               \}
         *             ],
         *             "threads": [
         *               \{
         *                 "threadTitle": "Developing spoken language",
         *                 "threadSlug": "developing-spoken-language",
         *                 "order": 8
         *               \}
         *             ]
         *           \}
         *         ]
         *       \}
         *     ]
         */
        SequenceUnitsResponseSchema: ({
            /** The year group */
            year: number | "all-years";
            /** An optional alternative title for the year sequence */
            title?: string;
            /** A list of units that make up a full sequence, grouped by year. */
            units: ({
                /** The title of the unit */
                unitTitle: string;
                /** The position of the unit within the sequence. */
                unitOrder: number;
                /** The unique slug identifier for the unit */
                unitOptions: {
                    unitTitle: string;
                    unitSlug: string;
                }[];
                /** The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                categories?: {
                    /** The title of the category */
                    categoryTitle: string;
                    /** The unique identifier for the category */
                    categorySlug?: string;
                }[];
                /** A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                threads?: {
                    /** The title of the category */
                    threadTitle: string;
                    /** The unique identifier for the thread */
                    threadSlug: string;
                    /** Deprecated */
                    order: number;
                }[];
            } | {
                unitTitle: string;
                unitOrder: number;
                /** The unique slug identifier for the unit */
                unitSlug: string;
                categories?: {
                    /** The title of the category */
                    categoryTitle: string;
                    /** The unique identifier for the category */
                    categorySlug?: string;
                }[];
                threads?: {
                    /** The title of the category */
                    threadTitle: string;
                    /** The unique identifier for the thread */
                    threadSlug: string;
                    /** Deprecated */
                    order: number;
                }[];
            })[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        } | {
            year: number;
            title?: string;
            /** Only used in secondary science. Contains a full year's unit sequences based on which subject is being studied at KS4. */
            examSubjects: ({
                examSubjectTitle: string;
                examSubjectSlug?: string;
                tiers: {
                    /** The title of the tier */
                    tierTitle: string;
                    /** The tier identifier */
                    tierSlug: string;
                    units: ({
                        /** The title of the unit */
                        unitTitle: string;
                        /** The position of the unit within the sequence. */
                        unitOrder: number;
                        /** The unique slug identifier for the unit */
                        unitOptions: {
                            unitTitle: string;
                            unitSlug: string;
                        }[];
                        /** The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                        categories?: {
                            /** The title of the category */
                            categoryTitle: string;
                            /** The unique identifier for the category */
                            categorySlug?: string;
                        }[];
                        /** A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                        threads?: {
                            /** The title of the category */
                            threadTitle: string;
                            /** The unique identifier for the thread */
                            threadSlug: string;
                            /** Deprecated */
                            order: number;
                        }[];
                    } | {
                        unitTitle: string;
                        unitOrder: number;
                        /** The unique slug identifier for the unit */
                        unitSlug: string;
                        categories?: {
                            /** The title of the category */
                            categoryTitle: string;
                            /** The unique identifier for the category */
                            categorySlug?: string;
                        }[];
                        threads?: {
                            /** The title of the category */
                            threadTitle: string;
                            /** The unique identifier for the thread */
                            threadSlug: string;
                            /** Deprecated */
                            order: number;
                        }[];
                    })[];
                }[];
            } | {
                examSubjectTitle: string;
                examSubjectSlug?: string;
                units: ({
                    /** The title of the unit */
                    unitTitle: string;
                    /** The position of the unit within the sequence. */
                    unitOrder: number;
                    /** The unique slug identifier for the unit */
                    unitOptions: {
                        unitTitle: string;
                        unitSlug: string;
                    }[];
                    /** The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    categories?: {
                        /** The title of the category */
                        categoryTitle: string;
                        /** The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    /** A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    threads?: {
                        /** The title of the category */
                        threadTitle: string;
                        /** The unique identifier for the thread */
                        threadSlug: string;
                        /** Deprecated */
                        order: number;
                    }[];
                } | {
                    unitTitle: string;
                    unitOrder: number;
                    /** The unique slug identifier for the unit */
                    unitSlug: string;
                    categories?: {
                        /** The title of the category */
                        categoryTitle: string;
                        /** The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    threads?: {
                        /** The title of the category */
                        threadTitle: string;
                        /** The unique identifier for the thread */
                        threadSlug: string;
                        /** Deprecated */
                        order: number;
                    }[];
                })[];
            })[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        } | {
            year: number;
            title?: string;
            tiers: {
                /** The title of the tier */
                tierTitle: string;
                /** The tier identifier */
                tierSlug: string;
                units: ({
                    /** The title of the unit */
                    unitTitle: string;
                    /** The position of the unit within the sequence. */
                    unitOrder: number;
                    /** The unique slug identifier for the unit */
                    unitOptions: {
                        unitTitle: string;
                        unitSlug: string;
                    }[];
                    /** The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    categories?: {
                        /** The title of the category */
                        categoryTitle: string;
                        /** The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    /** A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
                    threads?: {
                        /** The title of the category */
                        threadTitle: string;
                        /** The unique identifier for the thread */
                        threadSlug: string;
                        /** Deprecated */
                        order: number;
                    }[];
                } | {
                    unitTitle: string;
                    unitOrder: number;
                    /** The unique slug identifier for the unit */
                    unitSlug: string;
                    categories?: {
                        /** The title of the category */
                        categoryTitle: string;
                        /** The unique identifier for the category */
                        categorySlug?: string;
                    }[];
                    threads?: {
                        /** The title of the category */
                        threadTitle: string;
                        /** The unique identifier for the thread */
                        threadSlug: string;
                        /** Deprecated */
                        order: number;
                    }[];
                })[];
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        })[];
        /**
         * Bad request - e.g. "Content is blocked for copyright reasons" error (400)
         * The error information
         * @example \{
         *       "code": "BAD_REQUEST",
         *       "message": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
         *       "issues": []
         *     \}
         */
        "error.BAD_REQUEST": {
            /**
             * The error message
             * @example Bad request - e.g. "Content is blocked for copyright reasons"
             */
            message: string;
            /**
             * The error code
             * @example BAD_REQUEST
             */
            code: string;
            /**
             * An array of issues that were responsible for the error
             * @example []
             */
            issues?: {
                message: string;
            }[];
        };
        /**
         * API token not provided or invalid error (401)
         * The error information
         * @example \{
         *       "code": "UNAUTHORIZED",
         *       "message": "API token not provided or invalid",
         *       "issues": []
         *     \}
         */
        "error.UNAUTHORIZED": {
            /**
             * The error message
             * @example API token not provided or invalid
             */
            message: string;
            /**
             * The error code
             * @example UNAUTHORIZED
             */
            code: string;
            /**
             * An array of issues that were responsible for the error
             * @example []
             */
            issues?: {
                message: string;
            }[];
        };
        /**
         * Detail of the request causing the 404, e.g. "Lesson not found" error (404)
         * The error information
         * @example \{
         *       "code": "NOT_FOUND",
         *       "message": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
         *       "issues": []
         *     \}
         */
        "error.NOT_FOUND": {
            /**
             * The error message
             * @example Detail of the request causing the 404, e.g. "Lesson not found"
             */
            message: string;
            /**
             * The error code
             * @example NOT_FOUND
             */
            code: string;
            /**
             * An array of issues that were responsible for the error
             * @example []
             */
            issues?: {
                message: string;
            }[];
        };
        /**
         * @example \{
         *       "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
         *       "vtt": "WEBVTT\\n\\n1\\n00:00:06.300 --\> 00:00:08.070\\n\<v -\>Hello, I'm Mrs. Lashley.\</v\>\\n\\n2\\n00:00:08.070 --\> 00:00:09.240\\nI'm looking forward to guiding you\\n\\n3\\n00:00:09.240 --\> 00:00:10.980\\nthrough your learning today..."
         *     \}
         */
        TranscriptResponseSchema: {
            /** The transcript for the lesson video */
            transcript: string;
            /** The contents of the .vtt file for the lesson video, which maps captions to video timestamps. */
            vtt: string;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
        /**
         * @example [
         *       \{
         *         "lessonTitle": "The Roman invasion of Britain ",
         *         "lessonSlug": "the-roman-invasion-of-britain",
         *         "transcriptSnippet": "The Romans were ready,"
         *       \},
         *       \{
         *         "lessonTitle": "The changes to life brought about by Roman settlement",
         *         "lessonSlug": "the-changes-to-life-brought-about-by-roman-settlement",
         *         "transcriptSnippet": "when the Romans came."
         *       \},
         *       \{
         *         "lessonTitle": "Boudica's rebellion against Roman rule",
         *         "lessonSlug": "boudicas-rebellion-against-roman-rule",
         *         "transcriptSnippet": "kings who resisted the Romans were,"
         *       \},
         *       \{
         *         "lessonTitle": "How far religion changed under Roman rule",
         *         "lessonSlug": "how-far-religion-changed-under-roman-rule",
         *         "transcriptSnippet": "for the Romans."
         *       \}
         *     ]
         */
        SearchTranscriptResponseSchema: {
            /**
             * The lesson title
             * @example The Roman invasion of Britain
             */
            lessonTitle: string;
            /**
             * The lesson slug identifier
             * @example the-roman-invasion-of-britain
             */
            lessonSlug: string;
            /**
             * The snippet of the transcript that matched the search term
             * @example The Romans were ready,
             */
            transcriptSnippet?: string;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example [
         *       \{
         *         "lessonSlug": "using-numerals",
         *         "lessonTitle": "Using numerals",
         *         "assets": [
         *           \{
         *             "label": "Worksheet",
         *             "type": "worksheet",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
         *           \},
         *           \{
         *             "label": "Worksheet Answers",
         *             "type": "worksheetAnswers",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
         *           \},
         *           \{
         *             "label": "Video",
         *             "type": "video",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        SequenceAssetsResponseSchema: {
            /** The unique slug identifier for the lesson */
            lessonSlug: string;
            /** The title for the lesson */
            lessonTitle: string;
            /** Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** List of assets */
            assets: {
                /**
                 * Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint
                 * @example slideDeck

                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** The label for the asset */
                label: string;
                /** The download endpoint for the asset. */
                url: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example [
         *       \{
         *         "lessonSlug": "using-numerals",
         *         "lessonTitle": "Using numerals",
         *         "assets": [
         *           \{
         *             "label": "Worksheet",
         *             "type": "worksheet",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
         *           \},
         *           \{
         *             "label": "Worksheet Answers",
         *             "type": "worksheetAnswers",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
         *           \},
         *           \{
         *             "label": "Video",
         *             "type": "video",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        SubjectAssetsResponseSchema: {
            /** The unique slug identifier for the lesson */
            lessonSlug: string;
            /** The title for the lesson */
            lessonTitle: string;
            /** Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** List of assets */
            assets: {
                /**
                 * Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint
                 * @example slideDeck

                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** The label for the asset */
                label: string;
                /** The download endpoint for the asset. */
                url: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example \{
         *       "oakUrl": "https://www.thenational.academy/teachers/lessons/using-numerals",
         *       "attribution": [
         *         "Copyright XYZ Authors",
         *         "Creative Commons Attribution Example 4.0"
         *       ],
         *       "assets": [
         *         \{
         *           "label": "Worksheet",
         *           "type": "worksheet",
         *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
         *         \},
         *         \{
         *           "label": "Worksheet Answers",
         *           "type": "worksheetAnswers",
         *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
         *         \},
         *         \{
         *           "label": "Video",
         *           "type": "video",
         *           "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
         *         \}
         *       ]
         *     \}
         */
        LessonAssetsResponseSchema: {
            /**
             * Format: uri
             * The Oak National URL for the lesson
             */
            oakUrl: string;
            /** Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** List of assets */
            assets?: {
                /**
                 * Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint
                 * @example slideDeck

                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** The label for the asset */
                label: string;
                /** The download endpoint for the asset. */
                url: string;
            }[];
        };
        /** @example \{\} */
        LessonAssetResponseSchema: unknown;
        /**
         * @example [
         *       \{
         *         "subjectTitle": "Art and design",
         *         "subjectSlug": "art",
         *         "sequenceSlugs": [
         *           \{
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
         *               \{
         *                 "keyStageTitle": "Key Stage 1",
         *                 "keyStageSlug": "ks1"
         *               \},
         *               \{
         *                 "keyStageTitle": "Key Stage 2",
         *                 "keyStageSlug": "ks2"
         *               \}
         *             ],
         *             "phaseSlug": "primary",
         *             "phaseTitle": "Primary",
         *             "ks4Options": null
         *           \},
         *           \{
         *             "sequenceSlug": "art-secondary",
         *             "years": [
         *               7,
         *               8,
         *               9,
         *               10,
         *               11
         *             ],
         *             "keyStages": [
         *               \{
         *                 "keyStageTitle": "Key Stage 3",
         *                 "keyStageSlug": "ks3"
         *               \},
         *               \{
         *                 "keyStageTitle": "Key Stage 4",
         *                 "keyStageSlug": "ks4"
         *               \}
         *             ],
         *             "phaseSlug": "secondary",
         *             "phaseTitle": "Secondary",
         *             "ks4Options": null
         *           \}
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
         *           \{
         *             "keyStageTitle": "Key Stage 1",
         *             "keyStageSlug": "ks1"
         *           \},
         *           \{
         *             "keyStageTitle": "Key Stage 2",
         *             "keyStageSlug": "ks2"
         *           \},
         *           \{
         *             "keyStageTitle": "Key Stage 3",
         *             "keyStageSlug": "ks3"
         *           \},
         *           \{
         *             "keyStageTitle": "Key Stage 4",
         *             "keyStageSlug": "ks4"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        AllSubjectsResponseSchema: {
            /** The subject title */
            subjectTitle: string;
            /** The subject slug identifier */
            subjectSlug: string;
            /** Information about the years, key stages and key stage 4 variance for each sequence */
            sequenceSlugs: {
                /** The unique identifier for each sequence */
                sequenceSlug: string;
                /** The years for which this subject has content available for */
                years: number[];
                /** The key stage slug identifiers for which this subject has content available for. */
                keyStages: {
                    /** The key stage title for the given key stage */
                    keyStageTitle: string;
                    /** The unique identifier for a given key stage */
                    keyStageSlug: string;
                }[];
                /** The unique identifier for the phase to which this sequence belongs */
                phaseSlug: string;
                /** The title for the phase to which this sequence belongs */
                phaseTitle: string;
                ks4Options: {
                    title: string;
                    slug: string;
                } | null;
            }[];
            /** The years for which this subject has content available for */
            years: number[];
            /** The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** The key stage title for the given key stage */
                keyStageTitle: string;
                /** The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example \{
         *       "subjectTitle": "Art and design",
         *       "subjectSlug": "art",
         *       "sequenceSlugs": [
         *         \{
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
         *             \{
         *               "keyStageTitle": "Key Stage 1",
         *               "keyStageSlug": "ks1"
         *             \},
         *             \{
         *               "keyStageTitle": "Key Stage 2",
         *               "keyStageSlug": "ks2"
         *             \}
         *           ],
         *           "phaseSlug": "primary",
         *           "phaseTitle": "Primary",
         *           "ks4Options": null
         *         \},
         *         \{
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
         *             \{
         *               "keyStageTitle": "Key Stage 1",
         *               "keyStageSlug": "ks1"
         *             \},
         *             \{
         *               "keyStageTitle": "Key Stage 2",
         *               "keyStageSlug": "ks2"
         *             \}
         *           ],
         *           "phaseSlug": "secondary",
         *           "phaseTitle": "Secondary",
         *           "ks4Options": null
         *         \}
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
         *         \{
         *           "keyStageTitle": "Key Stage 1",
         *           "keyStageSlug": "ks1"
         *         \},
         *         \{
         *           "keyStageTitle": "Key Stage 2",
         *           "keyStageSlug": "ks2"
         *         \},
         *         \{
         *           "keyStageTitle": "Key Stage 3",
         *           "keyStageSlug": "ks3"
         *         \},
         *         \{
         *           "keyStageTitle": "Key Stage 4",
         *           "keyStageSlug": "ks4"
         *         \}
         *       ]
         *     \}
         */
        SubjectResponseSchema: {
            /** The subject title */
            subjectTitle: string;
            /** The subject slug identifier */
            subjectSlug: string;
            /** Information about the years, key stages and key stage 4 variance for each sequence */
            sequenceSlugs: {
                /** The unique identifier for each sequence */
                sequenceSlug: string;
                /** The years for which this subject has content available for */
                years: number[];
                /** The key stage slug identifiers for which this subject has content available for. */
                keyStages: {
                    /** The key stage title for the given key stage */
                    keyStageTitle: string;
                    /** The unique identifier for a given key stage */
                    keyStageSlug: string;
                }[];
                /** The unique identifier for the phase to which this sequence belongs */
                phaseSlug: string;
                /** The title for the phase to which this sequence belongs */
                phaseTitle: string;
                ks4Options: {
                    title: string;
                    slug: string;
                } | null;
            }[];
            /** The years for which this subject has content available for */
            years: number[];
            /** The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** The key stage title for the given key stage */
                keyStageTitle: string;
                /** The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
        /**
         * @example [
         *       \{
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
         *           \{
         *             "keyStageTitle": "Key Stage 1",
         *             "keyStageSlug": "ks1"
         *           \},
         *           \{
         *             "keyStageTitle": "Key Stage 2",
         *             "keyStageSlug": "ks2"
         *           \}
         *         ],
         *         "phaseSlug": "primary",
         *         "phaseTitle": "Primary",
         *         "ks4Options": null
         *       \},
         *       \{
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
         *           \{
         *             "keyStageTitle": "Key Stage 1",
         *             "keyStageSlug": "ks1"
         *           \},
         *           \{
         *             "keyStageTitle": "Key Stage 2",
         *             "keyStageSlug": "ks2"
         *           \}
         *         ],
         *         "phaseSlug": "secondary",
         *         "phaseTitle": "Secondary",
         *         "ks4Options": null
         *       \}
         *     ]
         */
        SubjectSequenceResponseSchema: {
            /** The unique identifier for each sequence */
            sequenceSlug: string;
            /** The years for which this subject has content available for */
            years: number[];
            /** The key stage slug identifiers for which this subject has content available for. */
            keyStages: {
                /** The key stage title for the given key stage */
                keyStageTitle: string;
                /** The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /** The unique identifier for the phase to which this sequence belongs */
            phaseSlug: string;
            /** The title for the phase to which this sequence belongs */
            phaseTitle: string;
            ks4Options: {
                title: string;
                slug: string;
            } | null;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * The key stage slug identifiers for which this subject has content available for
         * @example [
         *       \{
         *         "keyStageTitle": "Key Stage 1",
         *         "keyStageSlug": "ks1"
         *       \},
         *       \{
         *         "keyStageTitle": "Key Stage 2",
         *         "keyStageSlug": "ks2"
         *       \},
         *       \{
         *         "keyStageTitle": "Key Stage 3",
         *         "keyStageSlug": "ks3"
         *       \},
         *       \{
         *         "keyStageTitle": "Key Stage 4",
         *         "keyStageSlug": "ks4"
         *       \}
         *     ]
         */
        SubjectKeyStagesResponseSchema: {
            /** The key stage title for the given key stage */
            keyStageTitle: string;
            /** The unique identifier for a given key stage */
            keyStageSlug: string;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * The years for which this sequence has content available for
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
        /**
         * @example [
         *       \{
         *         "slug": "ks1",
         *         "title": "Key Stage 1"
         *       \}
         *     ]
         */
        KeyStageResponseSchema: {
            /**
             * The key stage slug identifier
             * @example ks1
             */
            slug: string;
            /**
             * The key stage title
             * @example Key Stage 1
             */
            title: string;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example [
         *       \{
         *         "unitSlug": "simple-compound-and-adverbial-complex-sentences",
         *         "unitTitle": "Simple, compound and adverbial complex sentences",
         *         "lessons": [
         *           \{
         *             "lessonSlug": "four-types-of-simple-sentence",
         *             "lessonTitle": "Four types of simple sentence"
         *           \},
         *           \{
         *             "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
         *             "lessonTitle": "Three ways for co-ordination in compound sentences"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        KeyStageSubjectLessonsResponseSchema: {
            /**
             * The unit slug identifier
             * @example simple-compound-and-adverbial-complex-sentences
             */
            unitSlug: string;
            /**
             * The unit title
             * @example Simple, compound and adverbial complex sentences
             */
            unitTitle: string;
            /**
             * List of lessons for the specified unit
             * @example [
             *       \{
             *         "lessonSlug": "four-types-of-simple-sentence",
             *         "lessonTitle": "Four types of simple sentence"
             *       \},
             *       \{
             *         "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
             *         "lessonTitle": "Three ways for co-ordination in compound sentences"
             *       \}
             *     ]
             */
            lessons: {
                /**
                 * The lesson slug identifier
                 * @example four-types-of-simple-sentence
                 */
                lessonSlug: string;
                /**
                 * The lesson title
                 * @example Four types of simple sentence
                 */
                lessonTitle: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example [
         *       \{
         *         "units": [
         *           \{
         *             "unitSlug": "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
         *             "unitTitle": "2, 4 and 8 times tables: using times tables to solve problems"
         *           \},
         *           \{
         *             "unitSlug": "bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10",
         *             "unitTitle": "Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10"
         *           \}
         *         ],
         *         "yearSlug": "year-3",
         *         "yearTitle": "Year 3"
         *       \}
         *     ]
         */
        AllKeyStageAndSubjectUnitsResponseSchema: {
            /**
             * The year identifier
             * @example year-3
             */
            yearSlug: string;
            /**
             * The year title
             * @example Year 3
             */
            yearTitle: string;
            /** List of units for the specified year */
            units: {
                /** The unit slug identifier */
                unitSlug: string;
                /** The unit title */
                unitTitle: string;
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example \{
         *       "starterQuiz": [
         *         \{
         *           "question": "Tick the sentence with the correct punctuation.",
         *           "questionType": "multiple-choice",
         *           "answers": [
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "the baby cried"
         *             \},
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "The baby cried"
         *             \},
         *             \{
         *               "distractor": false,
         *               "type": "text",
         *               "content": "The baby cried."
         *             \},
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "the baby cried."
         *             \}
         *           ]
         *         \}
         *       ],
         *       "exitQuiz": [
         *         \{
         *           "question": "Which word is a verb?",
         *           "questionType": "multiple-choice",
         *           "answers": [
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "shops"
         *             \},
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "Jun"
         *             \},
         *             \{
         *               "distractor": true,
         *               "type": "text",
         *               "content": "I"
         *             \},
         *             \{
         *               "distractor": false,
         *               "type": "text",
         *               "content": "shout"
         *             \}
         *           ]
         *         \}
         *       ]
         *     \}
         */
        QuestionForLessonsResponseSchema: {
            /** The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /** The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
        /**
         * @example [
         *       \{
         *         "lessonTitle": "3D shapes can be composed from 2D nets",
         *         "lessonSlug": "3d-shapes-can-be-composed-from-2d-nets",
         *         "starterQuiz": [
         *           \{
         *             "question": "Select all of the names of shapes that are polygons.",
         *             "questionType": "multiple-choice",
         *             "answers": [
         *               \{
         *                 "type": "text",
         *                 "content": "Cube ",
         *                 "distractor": true
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": " Square",
         *                 "distractor": false
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "Triangle",
         *                 "distractor": false
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "Semi-circle",
         *                 "distractor": true
         *               \}
         *             ]
         *           \}
         *         ],
         *         "exitQuiz": [
         *           \{
         *             "question": "What is a net?",
         *             "questionType": "multiple-choice",
         *             "answers": [
         *               \{
         *                 "type": "text",
         *                 "content": "A 3D shape made of 2D shapes folded together. ",
         *                 "distractor": false
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "A 2D shape made of 3D shapes folded togehther.",
         *                 "distractor": true
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "A type of cube.",
         *                 "distractor": true
         *               \}
         *             ]
         *           \}
         *         ]
         *       \}
         *     ]
         */
        QuestionsForSequenceResponseSchema: {
            /** The lesson slug identifier */
            lessonSlug: string;
            /** The title of the lesson */
            lessonTitle: string;
            /** The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /** The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example [
         *       \{
         *         "lessonSlug": "predicting-the-size-of-a-product",
         *         "lessonTitle": "Predicting the size of a product",
         *         "starterQuiz": [
         *           \{
         *             "question": "Match the number to its written representation.",
         *             "questionType": "match",
         *             "answers": [
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "seven tenths"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0.7"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "nine tenths"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0.9"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "seven ones"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "7"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "seven hundredths"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0.07"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "nine hundredths"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0.09"
         *                 \}
         *               \}
         *             ]
         *           \}
         *         ],
         *         "exitQuiz": [
         *           \{
         *             "question": "Use the fact that 9 × 8 = 72, to match the expressions to their product.",
         *             "questionType": "match",
         *             "answers": [
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "9 × 80"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "720"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "9 × 800 "
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "7,200"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "9 × 0.8"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "7.2"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "9 × 0"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0"
         *                 \}
         *               \},
         *               \{
         *                 "matchOption": \{
         *                   "type": "text",
         *                   "content": "9 × 0.08"
         *                 \},
         *                 "correctChoice": \{
         *                   "type": "text",
         *                   "content": "0.72"
         *                 \}
         *               \}
         *             ]
         *           \}
         *         ]
         *       \}
         *     ]
         */
        QuestionsForKeyStageAndSubjectResponseSchema: {
            /** The lesson slug identifier */
            lessonSlug: string;
            /** The title of the lesson */
            lessonTitle: string;
            /** The starter quiz questions - which test prior knowledge */
            starterQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /** The exit quiz questions - which test on the knowledge learned in the lesson */
            exitQuiz: ({
                /** The question text */
                question: string;

                questionType: "multiple-choice";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                } | {

                    type: "image";
                    content: {
                        url: string;
                        width: number;
                        height: number;
                        alt?: string;
                        /** Supplementary text for the image, if any */
                        text?: string;
                        attribution?: string;
                    };
                    /** Whether the multiple choice question response is the correct answer (false) or is a distractor (true) */
                    distractor: boolean;
                })[];
            } | {
                /** The question text */
                question: string;

                questionType: "short-answer";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "match";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: {
                    /** Matching options (LHS) */
                    matchOption: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                    /** Matching options (RHS), indicating the correct choice */
                    correctChoice: {
                        /**
                         * The format of the quiz answer
                         *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                         */
                        type: "text";
                        /** Quiz question answer */
                        content: string;
                    };
                }[];
            } | {
                /** The question text */
                question: string;

                questionType: "order";
                questionImage?: {
                    url: string;
                    width: number;
                    height: number;
                    alt?: string;
                    /** Supplementary text for the image, if any */
                    text?: string;
                    attribution?: string;
                };
                answers: ({
                    /** Indicates the correct ordering of the response */
                    order: number;
                } & {
                    /**
                     * The format of the quiz answer
                     *     Note: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available.

                     */
                    type: "text";
                    /** Quiz question answer */
                    content: string;
                })[];
            })[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        }[];
        /**
         * @example \{
         *       "lessonTitle": "Using vector tools to draw and modify shapes",
         *       "canonicalUrl": "https://www.thenational.academy/teachers/programmes/computing-secondary-ks3/units/developing-vector-graphics/lessons/using-vector-tools-to-draw-and-modify-shapes",
         *       "oakUrl": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes",
         *       "unitSlug": "developing-vector-graphics",
         *       "unitTitle": "Developing vector graphics",
         *       "subjectSlug": "computing",
         *       "subjectTitle": "Computing",
         *       "keyStageSlug": "ks3",
         *       "keyStageTitle": "Key Stage 3",
         *       "lessonKeywords": [
         *         \{
         *           "keyword": "vector graphic",
         *           "description": "an image made up of lines and shapes"
         *         \},
         *         \{
         *           "keyword": "z-order",
         *           "description": "the order of overlapping objects"
         *         \},
         *         \{
         *           "keyword": "layer",
         *           "description": "the level on which an object (e.g. text, shapes and photos) can be placed relative to other objects"
         *         \}
         *       ],
         *       "keyLearningPoints": [
         *         \{
         *           "keyLearningPoint": "Vector graphics are made from shapes described by coordinates, not pixels."
         *         \},
         *         \{
         *           "keyLearningPoint": "Vector illustrations are built using simple shapes."
         *         \},
         *         \{
         *           "keyLearningPoint": "Vector graphics use z-order to show which shapes are in front and are visible."
         *         \}
         *       ],
         *       "misconceptionsAndCommonMistakes": [
         *         \{
         *           "misconception": "Vector graphics are made from pixels and can lose quality when resized.",
         *           "response": "Vector graphics are made from lines and shapes. They do not lose quality when resized."
         *         \}
         *       ],
         *       "pupilLessonOutcome": "I can use software to draw and modify vector shapes.",
         *       "teacherTips": [
         *         \{
         *           "teacherTip": "You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials"
         *         \}
         *       ],
         *       "contentGuidance": null,
         *       "supervisionLevel": null,
         *       "downloadsAvailable": true
         *     \}
         */
        LessonSummaryResponseSchema: {
            /** The lesson title */
            lessonTitle: string;
            /**
             * Format: uri
             * The canonical Oak National URL for the lesson
             */
            canonicalUrl: string;
            /**
             * Format: uri
             * The Oak National URL for the lesson
             */
            oakUrl: string;
            /** The unit slug identifier */
            unitSlug: string;
            /** The unit title */
            unitTitle: string;
            /** The subject slug identifier */
            subjectSlug: string;
            /** The subject slug identifier */
            subjectTitle: string;
            /** The key stage slug identifier */
            keyStageSlug: string;
            /** The key stage title */
            keyStageTitle: string;
            /** The lesson's keywords and their descriptions */
            lessonKeywords: {
                /** The keyword */
                keyword: string;
                /** A definition of the keyword */
                description: string;
            }[];
            /** The lesson's key learning points */
            keyLearningPoints: {
                /** A key learning point */
                keyLearningPoint: string;
            }[];
            /** The lesson’s anticipated common misconceptions and suggested teacher responses */
            misconceptionsAndCommonMistakes: {
                /** A common misconception */
                misconception: string;
                /** Suggested teacher response to a common misconception */
                response: string;
            }[];
            /** Suggested teacher response to a common misconception */
            pupilLessonOutcome?: string;
            /** Helpful teaching tips for the lesson */
            teacherTips: {
                teacherTip: string;
            }[];
            /** Full guidance about the types of lesson content for the teacher to consider (where appropriate) */
            contentGuidance: {
                /** Category of content guidance */
                contentGuidanceArea: string;
                /** The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information. */
                supervisionlevel_id: number;
                /** Content guidance label */
                contentGuidanceLabel: string;
                /** A detailed description of the type of content that we suggest needs guidance. */
                contentGuidanceDescription: string;
            }[] | null;
            /** The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information. */
            supervisionLevel: string | null;
            /** Whether the lesson currently has any downloadable assets availableNote: this field reflects the current availability of downloadable assets, which reflects the availability of early-release content available for the hackathon. All lessons will eventually have downloadable assets available. */
            downloadsAvailable: boolean;
        };
        /**
         * @example [
         *       \{
         *         "lessonSlug": "performing-your-chosen-gothic-poem",
         *         "lessonTitle": "Performing your chosen Gothic poem",
         *         "oakUrl": "https://www.thenational.academy/teachers/lessons/performing-your-chosen-gothic-poem",
         *         "similarity": 0.20588236,
         *         "units": [
         *           \{
         *             "unitSlug": "gothic-poetry",
         *             "unitTitle": "Gothic poetry",
         *             "examBoardTitle": null,
         *             "keyStageSlug": "ks3",
         *             "subjectSlug": "english"
         *           \}
         *         ]
         *       \},
         *       \{
         *         "lessonSlug": "the-twisted-tree-the-novel-as-a-gothic-text",
         *         "lessonTitle": "'The Twisted Tree': the novel as a Gothic text",
         *         "oakUrl": "https://www.thenational.academy/teachers/lessons/the-twisted-tree-the-novel-as-a-gothic-text",
         *         "similarity": 0.19444445,
         *         "units": [
         *           \{
         *             "unitSlug": "the-twisted-tree-fiction-reading",
         *             "unitTitle": "'The Twisted Tree': fiction reading",
         *             "examBoardTitle": null,
         *             "keyStageSlug": "ks3",
         *             "subjectSlug": "english"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        LessonSearchResponseSchema: {
            /** The lesson slug identifier */
            lessonSlug: string;
            /** The lesson title */
            lessonTitle: string;
            /**
             * Format: uri
             * The Oak National URL for the lesson
             */
            oakUrl: string;
            /** The snippet of the transcript that matched the search term */
            similarity: number;
            /** The units that the lesson is part of. See sample response below */
            units: {
                unitSlug: string;
                unitTitle: string;
                examBoardTitle: string | null;
                keyStageSlug: string;
                subjectSlug: string;
            }[];
        }[];
        /**
         * @example \{
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
         *         \{
         *           "slug": "developing-grammatical-knowledge",
         *           "title": "Developing grammatical knowledge",
         *           "order": 10
         *         \}
         *       ],
         *       "unitLessons": [
         *         \{
         *           "lessonSlug": "four-types-of-simple-sentence",
         *           "lessonTitle": "Four types of simple sentence",
         *           "lessonOrder": 1,
         *           "state": "published"
         *         \},
         *         \{
         *           "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
         *           "lessonTitle": "Three ways for co-ordination in compound sentences",
         *           "lessonOrder": 2,
         *           "state": "new"
         *         \}
         *       ]
         *     \}
         */
        UnitSummaryResponseSchema: {
            /**
             * The unit slug identifier
             * @example simple-compound-and-adverbial-complex-sentences
             */
            unitSlug: string;
            /**
             * The unit title
             * @example Simple, compound and adverbial complex sentences
             */
            unitTitle: string;
            /**
             * The slug identifier for the year to which the unit belongs
             * @example year-3
             */
            yearSlug: string;
            /**
             * The year to which the unit belongs
             * @example 3
             */
            year: number | string;
            /**
             * The slug identifier for the phase to which the unit belongs
             * @example primary
             */
            phaseSlug: string;
            /**
             * The subject identifier
             * @example english
             */
            subjectSlug: string;
            /**
             * The slug identifier for the the key stage to which the unit belongs
             * @example ks2
             */
            keyStageSlug: string;
            /** Unit summary notes */
            notes?: string;
            /** A short description of the unit. Not yet available for all subjects. */
            description?: string;
            /**
             * The prior knowledge required for the unit
             * @example [
             *       "A simple sentence is about one idea and makes complete sense.",
             *       "Any simple sentence contains one verb and at least one noun.",
             *       "Two simple sentences can be joined with a co-ordinating conjunction to form a compound sentence."
             *     ]
             */
            priorKnowledgeRequirements: string[];
            /**
             * National curriculum attainment statements covered in this unit
             * @example [
             *       "Ask relevant questions to extend their understanding and knowledge",
             *       "Articulate and justify answers, arguments and opinions",
             *       "Speak audibly and fluently with an increasing command of Standard English"
             *     ]
             */
            nationalCurriculumContent: string[];
            /** An explanation of where the unit sits within the sequence and why it has been placed there. */
            whyThisWhyNow?: string;
            /**
             * The threads that are associated with the unit
             * @example [
             *       \{
             *         "slug": "developing-grammatical-knowledge",
             *         "title": "Developing grammatical knowledge",
             *         "order": 10
             *       \}
             *     ]
             */
            threads?: {
                slug: string;
                title: string;
                order: number;
            }[];
            /** The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted. */
            categories?: {
                categoryTitle: string;
                categorySlug?: string;
            }[];
            unitLessons: {
                /**
                 * The lesson slug identifier
                 * @example four-types-of-simple-sentence
                 */
                lessonSlug: string;
                /**
                 * The title for the lesson
                 * @example Four types of simple sentence
                 */
                lessonTitle: string;
                /**
                 * Indicates the ordering of the lesson
                 * @example 1
                 */
                lessonOrder?: number;
                /**
                 * If the state is 'published' then it is also available on the /lessons/* endpoints. If the state is 'new' then it's not available yet.
                 * @example published

                 */
                state: "published" | "new";
            }[];
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
        /**
         * @example [
         *       \{
         *         "title": "Number: Multiplication and division",
         *         "slug": "number-multiplication-and-division"
         *       \}
         *     ]
         */
        AllThreadsResponseSchema: {
            /** The thread title */
            title: string;
            /** The thread slug identifier */
            slug: string;
            /** Threads are data concepts without Oak URLs on the website. Always null for thread resources. */
            oakUrl?: null;
        }[];
        /**
         * @example [
         *       \{
         *         "unitTitle": "Unitising and coin recognition - counting in 2s, 5s and 10s",
         *         "unitSlug": "unitising-and-coin-recognitions-counting-in-2s-5s-and-10s",
         *         "unitOrder": 1
         *       \},
         *       \{
         *         "unitTitle": "Solving problems in a range of contexts",
         *         "unitSlug": "unitising-and-coin-recognition-solving-problems-involving-money",
         *         "unitOrder": 2
         *       \}
         *     ]
         */
        ThreadUnitsResponseSchema: {
            /** The unit title */
            unitTitle: string;
            /** The unit slug identifier */
            unitSlug: string;
            /** The position of the unit within the thread */
            unitOrder: number;
            /** Threads are data concepts without Oak URLs on the website. Always null for thread resources. */
            oakUrl?: null;
        }[];
        /**
         * @example \{
         *       "limit": 1000,
         *       "remaining": 953,
         *       "reset": 1740164400000
         *     \}
         */
        RateLimitResponseSchema: {
            /**
             * The maximum number of requests you can make in the current window.
             * @example 1000
             */
            limit: number;
            /**
             * The number of requests remaining in the current window.
             * @example 953
             */
            remaining: number;
            /**
             * The time at which the current window resets, in milliseconds since the Unix epoch.
             * @example 1740164400000
             */
            reset: number;
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
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
                /** The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SequenceUnitsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getLessonTranscript-getLessonTranscript": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The slug of the lesson */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["TranscriptResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "searchTranscripts-searchTranscripts": {
        parameters: {
            query: {
                /** A snippet of text to search for in the lesson video transcripts */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SearchTranscriptResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getAssets-getSequenceAssets": {
        parameters: {
            query?: {
                year?: number;
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            header?: never;
            path: {
                /** The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SequenceAssetsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getAssets-getSubjectAssets": {
        parameters: {
            query?: {
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                unit?: string;
            };
            header?: never;
            path: {
                /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectAssetsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getAssets-getLessonAssets": {
        parameters: {
            query?: {
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            header?: never;
            path: {
                /** The lesson slug identifier */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonAssetsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getAssets-getLessonAsset": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The lesson slug */
                lesson: string;
                /** Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonAssetResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllSubjectsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getSubjects-getSubject": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The slug identifier for the subject */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getSubjects-getSubjectSequence": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The slug identifier for the subject */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectSequenceResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getSubjects-getSubjectKeyStages": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The subject slug identifier */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectKeyStagesResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getSubjects-getSubjectYears": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Subject slug to filter by */
                subject: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["SubjectYearsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["KeyStageResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getKeyStageSubjectLessons-getKeyStageSubjectLessons": {
        parameters: {
            query?: {
                unit?: string;
                offset?: number;
                limit?: number;
            };
            header?: never;
            path: {
                /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["KeyStageSubjectLessonsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** Key stage slug to filter by, e.g. 'ks2' */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllKeyStageAndSubjectUnitsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getKeywords-getKeywords": {
        parameters: {
            query?: {
                subject?: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
                keyStage?: "ks1" | "ks2" | "ks3" | "ks4";
                phase?: "primary" | "secondary";
                unit?: string;
                lesson?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": {
                        /**
                         * The keyword text
                         * @example non-finite clause
                         */
                        keyword: string;
                        /**
                         * A description of the keyword
                         * @example a type of subordinate clause that can start with a verb in the progressive tense
                         */
                        description: string;
                        /**
                         * The key stage slug associated with this keyword
                         * @example ks2
                         */
                        keyStageSlug: string;
                        /**
                         * The subject slug associated with this keyword
                         * @example science
                         */
                        subjectSlug: string;
                        /**
                         * The different lesson slugs where this keyword is used
                         * @example [
                         *       "a-new-sentence-structure-the-non-finite-complex-sentence",
                         *       "using-the-comma-rules-in-non-finite-complex-sentences",
                         *       "a-new-subordinate-clause-the-non-finite-ing-clause"
                         *     ]
                         */
                        lessonSlugs: string[];
                    }[];
                };
            };
        };
    };
    "getQuestions-getQuestionsForLessons": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The lesson slug identifier */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionForLessonsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForSequence": {
        parameters: {
            query?: {
                year?: number;
                offset?: number;
                limit?: number;
            };
            header?: never;
            path: {
                /** The sequence slug identifier, including the key stage 4 option where relevant. */
                sequence: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionsForSequenceResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForKeyStageAndSubject": {
        parameters: {
            query?: {
                offset?: number;
                limit?: number;
            };
            header?: never;
            path: {
                /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage: "ks1" | "ks2" | "ks3" | "ks4";
                /** Subject slug to search by, e.g. 'science' - note that casing is important here */
                subject: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionsForKeyStageAndSubjectResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getLessons-getLesson": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The slug of the lesson */
                lesson: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonSummaryResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getLessons-searchByTextSimilarity": {
        parameters: {
            query: {
                /** Search query text snippet */
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["LessonSearchResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
    "getUnits-getUnit": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The unit slug */
                unit: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["UnitSummaryResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["AllThreadsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["ThreadUnitsResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
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
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
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
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
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
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["RateLimitResponseSchema"];
                };
            };
            /** Bad request - e.g. "Content is blocked for copyright reasons" */
            400: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.BAD_REQUEST"];
                };
            };
            /** API token not provided or invalid */
            401: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.UNAUTHORIZED"];
                };
            };
            /** Detail of the request causing the 404, e.g. "Lesson not found" */
            404: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["error.NOT_FOUND"];
                };
            };
        };
    };
}
