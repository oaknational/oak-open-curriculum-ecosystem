export interface paths {
    "/sequences/{sequence}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Sequencing information for a given sequence slug
         * Use when you have a sequence slug and need the sequence-level summary. A sequence is a subject's curriculum across a phase (e.g. maths-primary, science-secondary-aqa); it spans one or more National Curriculum schemes and contains one programme per year group. Get sequence slugs from GET /subjects or GET /subjects/\{subject\} (the sequenceSlugs field). Returns slug, phase, key stages, years, and any KS4 programme factors (exam board, tier, child subject, pathway) needed to interpret the programmes within it.
         *
         *     Not for: the programmes within this sequence (GET /subjects/\{subject\}/programmes); the unit sequence for one programme (GET /programmes/\{programme\}/units); all units across the sequence (GET /sequences/\{sequence\}/units); subject-level catalogue data (GET /subjects or GET /subjects/\{subject\}).
         *
         *     Example: sequence=maths-primary or science-secondary-aqa.
         */
        get: operations["getSequences-getSubjectSequence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sequences/{sequence}/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Units in a curriculum sequence
         * Use when you want every unit across a whole sequence — all programmes combined, in unit sequence order. Returns units grouped by programme (year group) in unit sequence order. If the sequence slug includes an exam board (e.g. science-secondary-aqa), units are scoped to that exam board. Secondary sequences also expose tiers, pathways, and exam subjects where applicable. Pass year as an optional filter to return only that year's units (across all KS4 factor combinations).
         *
         *     Not for: units in a single programme (GET /programmes/\{programme\}/units); a flat list of units for a key stage + subject without programme structure or unit sequence order (GET /key-stages/\{keyStage\}/subject/\{subject\}/units); the programmes within this sequence (GET /subjects/\{subject\}/programmes); a single unit (GET /units/\{unit\}/summary); units in a thread (GET /threads/\{threadSlug\}/units).
         *
         *     Example: sequence=science-secondary-aqa or maths-primary.
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
         * Lesson video transcript
         * Use when you have a lesson slug and need the video transcript — for accessibility, captioning, or text analysis. Returns the transcript as an array of sentences plus a raw WebVTT captions file (vtt) suitable for a \<track\> element.
         *
         *     Not for: searching across transcripts (GET /search/transcripts); the video file itself (GET /lessons/\{lesson\}/assets/\{type\} with type=video); lesson metadata (GET /lessons/\{lesson\}/summary).
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
         * Lesson search by video transcript
         * Use when you want to search the spoken content of lesson videos. Returns up to 5 lessons whose transcripts contain similar text, each with a transcript snippet showing the match. No filters; searches every published transcript.
         *
         *     Not for: terms in the lesson title (GET /search/lessons); metadata for a known lesson (GET /lessons/\{lesson\}/summary); a transcript by slug (GET /lessons/\{lesson\}/transcript).
         *
         *     Example queries: the mitochondria are the powerhouse, to be or not to be, carry the one.
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
         * Downloadable assets in a sequence
         * Use when you need every downloadable asset across a whole sequence — all programmes combined. Returns assets grouped by lesson in unit sequence order, with signed download URLs, asset type, lesson title and slug, and attribution. Pass year as an optional filter. Narrow further with type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
         *
         *     Not for: assets in a single programme (GET /programmes/\{programme\}/assets); a single lesson's downloads (GET /lessons/\{lesson\}/assets); streaming one file (GET /lessons/\{lesson\}/assets/\{type\}); assets for a key stage + subject without programme structure (GET /key-stages/\{keyStage\}/subject/\{subject\}/assets).
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
         * Downloadable assets by key stage and subject
         * Use when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
         *
         *     Not for: assets across a sequence (GET /sequences/\{sequence\}/assets); assets in one programme (GET /programmes/\{programme\}/assets); a single lesson's downloads (GET /lessons/\{lesson\}/assets); streaming one file (GET /lessons/\{lesson\}/assets/\{type\}).
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
         * Downloadable assets for a lesson
         * Use when you have a lesson slug and need the list of what's downloadable. Returns every available asset type with a signed download URL per asset and attribution. The 9 type values are: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Pass type to return only one. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
         *
         *     Not for: streaming the file itself (GET /lessons/\{lesson\}/assets/\{type\}); bulk asset retrieval across a key stage + subject (GET /key-stages/\{keyStage\}/subject/\{subject\}/assets), a sequence (GET /sequences/\{sequence\}/assets), or one programme (GET /programmes/\{programme\}/assets); lesson metadata (GET /lessons/\{lesson\}/summary).
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
    "/programmes/{programme}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Downloadable assets in a programme
         * Use when you need every downloadable asset for a single programme (year group) within a subject. Returns assets grouped by lesson with signed download URLs, asset type, lesson title and slug, and attribution. Supports offset/limit pagination; Link: rel="next" header signals more pages. Optionally narrow by asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
         *
         *     Not for: assets across a whole sequence (GET /sequences/\{sequence\}/assets); assets for a key stage + subject without programme structure (GET /key-stages/\{keyStage\}/subject/\{subject\}/assets); a single lesson's downloads (GET /lessons/\{lesson\}/assets); streaming one file (GET /lessons/\{lesson\}/assets/\{type\}).
         */
        get: operations["getAssets-getProgrammeAssets"];
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
         * Stream a lesson asset file
         * Use when you want to download one specific asset for a lesson — slide deck, worksheet, etc. Returns the file directly. Call GET /lessons/\{lesson\}/assets first to see which type values are available. Valid type values: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
         *
         *     Not for: listing which asset types a lesson has (GET /lessons/\{lesson\}/assets); fetching the transcript (GET /lessons/\{lesson\}/transcript).
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
         * All subjects
         * Use when you need every subject in one call — the entry point for a subject picker or for crawling the whole curriculum. Returns subjects alphabetically, each with subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for that subject; each sequence contains one programme per year group — call GET /subjects/\{subject\}/programmes to enumerate them.
         *
         *     Not for: a single subject (GET /subjects/\{subject\}); the key stages or year groups for a subject (GET /subjects/\{subject\}/key-stages or GET /subjects/\{subject\}/years); lessons or units inside a subject (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons or GET /key-stages/\{keyStage\}/subject/\{subject\}/units); the detail of one sequence (GET /sequences/\{sequence\}).
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
         * Single subject with sequences, key stages, and years
         * Use when you have a subject slug. Returns subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for this subject; each sequence contains one programme per year group — call GET /subjects/\{subject\}/programmes to enumerate them.
         *
         *     Not for: every subject in one call (GET /subjects); the key stages or year groups for a subject (GET /subjects/\{subject\}/key-stages or GET /subjects/\{subject\}/years); subject-scoped lessons or units (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons or GET /key-stages/\{keyStage\}/subject/\{subject\}/units); the detail of one sequence (GET /sequences/\{sequence\}).
         *
         *     Example: subject=maths.
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
    "/subjects/{subject}/key-stages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Key stages for a subject
         * Use when you only need the key stages where this subject is available. Returns key-stage titles and slugs.
         *
         *     Not for: every key stage (GET /key-stages); the subject record (GET /subjects/\{subject\}).
         *
         *     Example: 'subject=history'.
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
         * Year groups for a subject
         * Use when you only need the year groups where this subject is available. Returns an array of year numbers, derived from the subject's key stages.
         *
         *     Not for: the subject record (GET /subjects/\{subject\}); key stages rather than year groups (GET /subjects/\{subject\}/key-stages).
         *
         *     Example: 'subject=english'.
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
         * All key stages
         * Use when you need the master list of key stages. Returns every key stage with its title and slug.
         *
         *     Not for: key stages restricted to a subject (GET /subjects/\{subject\}/key-stages).
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
         * List lessons in a key stage and subject
         * Use when you want every published lesson in a key stage + subject, grouped by unit, without programme structure or unit sequence order. Returns an array of units, each with slug, title, and the lessons inside. Pass unit to restrict to one. Supports offset/limit pagination; Link: rel="next" header signals more pages.
         *
         *     Not for: finding a lesson from a search term (GET /search/lessons); a single lesson's metadata (GET /lessons/\{lesson\}/summary); all units across a sequence (GET /sequences/\{sequence\}/units); units in one programme (GET /programmes/\{programme\}/units).
         *
         *     Example: keyStage=ks3, subject=maths, unit=perimeter-and-area.
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
         * Units in a key stage and subject
         * Use when you want a flat list of every unit with published lessons in a key stage + subject, without programme structure or unit sequence order. Returns units grouped by year slug; units without published lessons are omitted. Pass examBoard to restrict KS4 to one board (one of: aqa, edexcel (Edexcel A), eduqas, ocr, wjec, edexcelb (Edexcel B)); otherwise each unit lists the boards it appears in.
         *
         *     Not for: all units across a sequence (GET /sequences/\{sequence\}/units); units in one programme (GET /programmes/\{programme\}/units); a single unit (GET /units/\{unit\}/summary); lessons rather than units (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons); units in a thread (GET /threads/\{threadSlug\}/units).
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
    "/subjects/{subject}/programmes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all programmes for a subject slug
         * Use when you need to discover the programmes within a subject — to get a programme's slug for use with GET /programmes/\{programme\} or its sub-endpoints. Returns programmes grouped by key stage, each with year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject).
         *
         *     Not for: the metadata of one programme (GET /programmes/\{programme\}); the units, questions, or assets of one programme (GET /programmes/\{programme\}/units, GET /programmes/\{programme\}/questions, or GET /programmes/\{programme\}/assets); the sequence-level summary (GET /sequences/\{sequence\}).
         */
        get: operations["getAllProgrammesForSubject-getAllProgrammesForSubject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programmes/{programme}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a programme by slug
         * Use when you need to get the metadata of one programme. Get programme slugs from GET /subjects/\{subject\}/programmes. Returns the programme's year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject).
         *
         *     Not for: the units, questions, or assets of one programme (GET /programmes/\{programme\}/units, GET /programmes/\{programme\}/questions, or GET /programmes/\{programme\}/assets); the sequence-level summary (GET /sequences/\{sequence\}); all programmes for a subject (GET /subjects/\{subject\}/programmes).
         */
        get: operations["getAllProgrammesForSubject-getProgramme"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programmes/{programme}/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Units in a programme
         * Use when you need the unit sequence for one programme — units as an ordered arrangement designed to build knowledge progressively. Get programme slugs from GET /subjects/\{subject\}/programmes. Returns units in unit sequence order with title, slug, and any associated factors.
         *
         *       Not for: every unit across the whole sequence (GET /sequences/\{sequence\}/units); a flat list of units for a key stage + subject without programme structure (GET /key-stages/\{keyStage\}/subject/\{subject\}/units); a single unit (GET /units/\{unit\}/summary); units in a thread (GET /threads/\{threadSlug\}/units).
         */
        get: operations["getAllProgrammesForSubject-getProgrammeUnits"];
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
         * Keywords by subject and key stage
         * Use when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase.
         *
         *     Request rules:
         *
         *     - At least one of subject, keyStage, phase, unit or lesson must be provided - note that they are all the slug form of the values (e.g. "ks2" for key stage 2, "science" for the science subject, and "forces-and-magnets" for the forces and magnets unit), and that casing is important (always lowercase).
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
         * Quiz questions for a lesson
         * Use when you have a lesson slug and need its starter and exit quiz questions with correct answers marked. Returns two arrays, starterQuiz and exitQuiz; each question includes the prompt, the answers (with correct ones flagged), and which answers are distractors.
         *
         *     Not for: quiz questions across a sequence (GET /sequences/\{sequence\}/questions); quiz questions in one programme (GET /programmes/\{programme\}/questions); across a key stage + subject (GET /key-stages/\{keyStage\}/subject/\{subject\}/questions); lesson metadata or assets (GET /lessons/\{lesson\}/summary or GET /lessons/\{lesson\}/assets).
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
         * Quiz questions across a sequence
         * Use when you want every quiz question across a whole sequence — all programmes combined. Returns questions grouped by lesson in unit sequence order. Pass year as an optional filter to return only that year's questions. Supports offset and limit; Link: rel="next" header signals more pages.
         *
         *     Not for: questions in a single programme (GET /programmes/\{programme\}/questions); a single lesson's quiz (GET /lessons/\{lesson\}/quiz); questions for a key stage + subject without programme structure (GET /key-stages/\{keyStage\}/subject/\{subject\}/questions).
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
         * Quiz questions by key stage and subject
         * Use when you want every quiz question for a key stage + subject, without programme structure or unit sequence order. Returns lessons each with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel="next" header signals more pages.
         *
         *     Not for: a single lesson's quiz (GET /lessons/\{lesson\}/quiz); questions across a sequence (GET /sequences/\{sequence\}/questions); questions in one programme (GET /programmes/\{programme\}/questions).
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
    "/programmes/{programme}/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Quiz questions in a programme
         * Use when you want every quiz question in a single programme (year group) within a subject. Get programme slugs from GET /subjects/\{subject\}/programmes. Returns questions grouped by lesson with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel="next" header signals more pages.
         *
         *     Not for: questions in a single lesson (GET /lessons/\{lesson\}/quiz); questions across a whole sequence (GET /sequences/\{sequence\}/questions); questions for a key stage + subject without programme structure (GET /key-stages/\{keyStage\}/subject/\{subject\}/questions).
         */
        get: operations["getQuestions-getQuestionsForProgramme"];
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
         * Lesson summary by slug
         * Use when you have a lesson slug and need its full metadata: title, key stage, subject, unit, keywords, key learning points, misconceptions, pupil lesson outcome, teacher tips, content guidance, supervision level, and downloadsAvailable. Returns the lesson summary record.
         *
         *     Not for: finding a lesson from a search term (GET /search/lessons); searching what's said in lesson videos (GET /search/transcripts); listing every lesson in a unit or subject (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons); the transcript or assets (GET /lessons/\{lesson\}/transcript or GET /lessons/\{lesson\}/assets).
         *
         *     Example slug: imagining-you-are-the-characters-the-three-billy-goats-gruff.
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
         * Lesson search by title
         * Use when you want to find lessons whose titles match a search term. Returns up to 20 lessons ranked by title similarity — each with slug, title, URL, similarity score, and the unit(s) the lesson appears in. Optional keyStage, subject, and unit narrow the search.
         *
         *     Not for: searching what's said in lesson videos (GET /search/transcripts); metadata for a known lesson (GET /lessons/\{lesson\}/summary); listing every lesson in a key stage + subject without ranking (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons).
         *
         *     Example queries: KS3 science photosynthesis, fractions year 5, Macbeth soliloquy.
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
         * Unit summary by slug
         * Use when you have a unit slug and need the unit summary: title, description, key stage, subject, year, threads, prior-knowledge requirements, national-curriculum statements, and the lessons inside. Unit variant slugs (ending in -1, -2, etc.) resolve to that specific variant.
         *
         *     Not for: listing every unit in a key stage + subject (GET /key-stages/\{keyStage\}/subject/\{subject\}/units); all units across a sequence (GET /sequences/\{sequence\}/units); units in one programme (GET /programmes/\{programme\}/units); units in a thread (GET /threads/\{threadSlug\}/units); lessons inside the unit (GET /key-stages/\{keyStage\}/subject/\{subject\}/lessons with unit=\{unit\}).
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
         * All threads
         * Use when you want the catalogue of every thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — making vertical connections across year groups. Returns all threads with published units, sorted alphabetically — each with title, slug, and unitCount.
         *
         *     Not for: the units inside a thread (GET /threads/\{threadSlug\}/units).
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
         * Units in a thread
         * Use when you want every unit in a thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — for example, number and place value or scientific method. Units in a thread span multiple programmes and key stages; thread order is independent of unit sequence order within any individual programme. Returns units in thread order with unitTitle, unitSlug, and unitOrder.
         *
         *     Not for: the catalogue of threads (GET /threads); all units across a sequence (GET /sequences/\{sequence\}/units); units in one programme (GET /programmes/\{programme\}/units); a single unit (GET /units/\{unit\}/summary).
         *
         *     Example: 'threadSlug=number-and-place-value'.
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
    "/rate-limit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Current rate-limit status
         * Use when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the 'X-RateLimit-*' headers of every response, so this endpoint is rarely needed directly. Does not count against your quota.
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
         * @example \{
         *       "sequenceSlug": "computing-secondary-core",
         *       "years": [
         *         7,
         *         8,
         *         9,
         *         10,
         *         11
         *       ],
         *       "keyStages": [
         *         \{
         *           "keyStageTitle": "Key Stage 3",
         *           "keyStageSlug": "ks3"
         *         \},
         *         \{
         *           "keyStageTitle": "Key Stage 4",
         *           "keyStageSlug": "ks4"
         *         \}
         *       ],
         *       "phaseSlug": "secondary",
         *       "phaseTitle": "Secondary",
         *       "ks4ProgrammeFactors": \{
         *         "examBoard": [
         *           \{
         *             "title": "AQA",
         *             "slug": "aqa"
         *           \},
         *           \{
         *             "title": "Edexcel",
         *             "slug": "edexcel"
         *           \},
         *           \{
         *             "title": "OCR",
         *             "slug": "ocr"
         *           \}
         *         ],
         *         "pathway": [
         *           \{
         *             "title": "Core",
         *             "slug": "core"
         *           \}
         *         ],
         *         "tier": [
         *           \{
         *             "title": "Foundation",
         *             "slug": "foundation"
         *           \},
         *           \{
         *             "title": "Higher",
         *             "slug": "higher"
         *           \}
         *         ]
         *       \}
         *     \}
         */
        SubjectSequenceResponseSchema: {
            /**
             * The unique identifier for each sequence
             * @example computing-secondary-core
             */
            sequenceSlug: string;
            /**
             * The years for which this subject has content available for
             * @example [
             *       7,
             *       8,
             *       9,
             *       10,
             *       11
             *     ]
             */
            years: number[];
            /**
             * The key stage slug identifiers for which this subject has content available for.
             * @example [
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
            keyStages: {
                /** The key stage title for the given key stage */
                keyStageTitle: string;
                /** The unique identifier for a given key stage */
                keyStageSlug: string;
            }[];
            /**
             * The unique identifier for the phase to which this sequence belongs
             * @example secondary
             */
            phaseSlug: string;
            /**
             * The title for the phase to which this sequence belongs
             * @example Secondary
             */
            phaseTitle: string;
            /**
             * The programme factors that apply to this subject at key stage 4, with the valid values for each factor.
             * @example \{
             *       "examBoard": [
             *         \{
             *           "title": "AQA",
             *           "slug": "aqa"
             *         \},
             *         \{
             *           "title": "Edexcel",
             *           "slug": "edexcel"
             *         \},
             *         \{
             *           "title": "OCR",
             *           "slug": "ocr"
             *         \}
             *       ],
             *       "pathway": [
             *         \{
             *           "title": "Core",
             *           "slug": "core"
             *         \}
             *       ],
             *       "tier": [
             *         \{
             *           "title": "Foundation",
             *           "slug": "foundation"
             *         \},
             *         \{
             *           "title": "Higher",
             *           "slug": "higher"
             *         \}
             *       ]
             *     \}
             */
            ks4ProgrammeFactors: {
                /** The valid exam board values offered by Oak for this subject at key stage 4. */
                examBoard?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The valid pathway values offered by Oak for this subject at key stage 4. */
                pathway?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The valid tier values offered by Oak for this subject at key stage 4. */
                tier?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The child subjects offered by Oak for this subject at key stage 4 (e.g. biology, chemistry, physics and combined-science under science). Only present for Science, which is split into child subjects at KS4. */
                childSubject?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
            };
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
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
                /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                examBoards?: {
                    /** The title of the exam board */
                    title: string;
                    /** The slug of the exam board */
                    slug: string;
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
                /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                examBoards?: {
                    /** The title of the exam board */
                    title: string;
                    /** The slug of the exam board */
                    slug: string;
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
                        /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                        examBoards?: {
                            /** The title of the exam board */
                            title: string;
                            /** The slug of the exam board */
                            slug: string;
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
                        /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                        examBoards?: {
                            /** The title of the exam board */
                            title: string;
                            /** The slug of the exam board */
                            slug: string;
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
                    /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                    examBoards?: {
                        /** The title of the exam board */
                        title: string;
                        /** The slug of the exam board */
                        slug: string;
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
                    /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                    examBoards?: {
                        /** The title of the exam board */
                        title: string;
                        /** The slug of the exam board */
                        slug: string;
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
                    /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                    examBoards?: {
                        /** The title of the exam board */
                        title: string;
                        /** The slug of the exam board */
                        slug: string;
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
                    /** The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`). */
                    examBoards?: {
                        /** The title of the exam board */
                        title: string;
                        /** The slug of the exam board */
                        slug: string;
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
         * @example \{
         *       "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
         *       "vtt": "WEBVTT\\n\\n1\\n00:00:06.300 --\> 00:00:08.070\\n\<v -\>Hello, I'm Mrs. Lashley.\</v\>\\n\\n2\\n00:00:08.070 --\> 00:00:09.240\\nI'm looking forward to guiding you\\n\\n3\\n00:00:09.240 --\> 00:00:10.980\\nthrough your learning today..."
         *     \}
         */
        TranscriptResponseSchema: {
            /**
             * The transcript for the lesson video
             * @example Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...
             */
            transcript: string;
            /**
             * The contents of the .vtt file for the lesson video, which maps captions to video timestamps.
             * @example WEBVTT
             *
             *     1
             *     00:00:06.300 --\> 00:00:08.070
             *     \<v -\>Hello, I'm Mrs. Lashley.\</v\>
             *
             *     2
             *     00:00:08.070 --\> 00:00:09.240
             *     I'm looking forward to guiding you
             *
             *     3
             *     00:00:09.240 --\> 00:00:10.980
             *     through your learning today...
             */
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
                 * Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint
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
                 * Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint
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
                 * Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint
                 * @example slideDeck

                 */
                type: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** The label for the asset */
                label: string;
                /** The download endpoint for the asset. */
                url: string;
            }[];
        };
        /**
         * @example [
         *       \{
         *         "lessonSlug": "variables-and-data-types",
         *         "lessonTitle": "Variables and data types",
         *         "assets": [
         *           \{
         *             "label": "Worksheet",
         *             "type": "worksheet",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/variables-and-data-types/assets/worksheet"
         *           \},
         *           \{
         *             "label": "Slide Deck",
         *             "type": "slideDeck",
         *             "url": "https://open-api.thenational.academy/api/v0/lessons/variables-and-data-types/assets/slideDeck"
         *           \}
         *         ]
         *       \}
         *     ]
         */
        ProgrammeAssetsResponseSchema: {
            /** The unique slug identifier for the lesson */
            lessonSlug: string;
            /** The title for the lesson */
            lessonTitle: string;
            /** Licence information for any third-party content contained in the lessons' downloadable resources */
            attribution?: string[];
            /** List of assets */
            assets: {
                /**
                 * Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint
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
        /** @example \{\} */
        LessonAssetResponseSchema: unknown;
        /**
         * @example [
         *       "art",
         *       "computing",
         *       "english"
         *     ]
         */
        AllSubjectsResponseSchema: ("art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish")[];
        /**
         * @example \{
         *       "subjectTitle": "Science",
         *       "subjectSlug": "science",
         *       "sequenceSlugs": [
         *         \{
         *           "sequenceSlug": "science-primary",
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
         *           "phaseTitle": "Primary"
         *         \},
         *         \{
         *           "sequenceSlug": "science-secondary-aqa",
         *           "years": [
         *             7,
         *             8,
         *             9,
         *             10,
         *             11
         *           ],
         *           "keyStages": [
         *             \{
         *               "keyStageTitle": "Key Stage 3",
         *               "keyStageSlug": "ks3"
         *             \},
         *             \{
         *               "keyStageTitle": "Key Stage 4",
         *               "keyStageSlug": "ks4"
         *             \}
         *           ],
         *           "phaseSlug": "secondary",
         *           "phaseTitle": "Secondary"
         *         \},
         *         \{
         *           "sequenceSlug": "science-secondary-edexcel",
         *           "years": [
         *             7,
         *             8,
         *             9,
         *             10,
         *             11
         *           ],
         *           "keyStages": [
         *             \{
         *               "keyStageTitle": "Key Stage 3",
         *               "keyStageSlug": "ks3"
         *             \},
         *             \{
         *               "keyStageTitle": "Key Stage 4",
         *               "keyStageSlug": "ks4"
         *             \}
         *           ],
         *           "phaseSlug": "secondary",
         *           "phaseTitle": "Secondary"
         *         \},
         *         \{
         *           "sequenceSlug": "science-secondary-ocr",
         *           "years": [
         *             7,
         *             8,
         *             9,
         *             10,
         *             11
         *           ],
         *           "keyStages": [
         *             \{
         *               "keyStageTitle": "Key Stage 3",
         *               "keyStageSlug": "ks3"
         *             \},
         *             \{
         *               "keyStageTitle": "Key Stage 4",
         *               "keyStageSlug": "ks4"
         *             \}
         *           ],
         *           "phaseSlug": "secondary",
         *           "phaseTitle": "Secondary"
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
         *       ],
         *       "ks4ProgrammeFactors": \{
         *         "examBoard": [
         *           \{
         *             "title": "AQA",
         *             "slug": "aqa"
         *           \},
         *           \{
         *             "title": "Edexcel",
         *             "slug": "edexcel"
         *           \},
         *           \{
         *             "title": "OCR",
         *             "slug": "ocr"
         *           \}
         *         ],
         *         "tier": [
         *           \{
         *             "title": "Foundation",
         *             "slug": "foundation"
         *           \},
         *           \{
         *             "title": "Higher",
         *             "slug": "higher"
         *           \}
         *         ],
         *         "childSubject": [
         *           \{
         *             "title": "Biology",
         *             "slug": "biology"
         *           \},
         *           \{
         *             "title": "Chemistry",
         *             "slug": "chemistry"
         *           \},
         *           \{
         *             "title": "Combined science",
         *             "slug": "combined-science"
         *           \},
         *           \{
         *             "title": "Physics",
         *             "slug": "physics"
         *           \}
         *         ]
         *       \}
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
            /** The programme factors that apply to this subject at key stage 4, with the valid values for each factor. */
            ks4ProgrammeFactors: {
                /** The valid exam board values offered by Oak for this subject at key stage 4. */
                examBoard?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The valid pathway values offered by Oak for this subject at key stage 4. */
                pathway?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The valid tier values offered by Oak for this subject at key stage 4. */
                tier?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
                /** The child subjects offered by Oak for this subject at key stage 4 (e.g. biology, chemistry, physics and combined-science under science). Only present for Science, which is split into child subjects at KS4. */
                childSubject?: {
                    /** The display title for a valid programme factor value */
                    title: string;
                    /** The slug identifier for a valid programme factor value */
                    slug: string;
                }[];
            };
            /**
             * Format: uri
             * The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.
             * @example https://www.thenational.academy/teachers/lessons/example-lesson
             */
            oakUrl?: string;
        };
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
            /**
             * List of units for the specified year
             * @example [
             *       \{
             *         "unitSlug": "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
             *         "unitTitle": "2, 4 and 8 times tables: using times tables to solve problems"
             *       \},
             *       \{
             *         "unitSlug": "bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10",
             *         "unitTitle": "Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10"
             *       \}
             *     ]
             */
            units: {
                /**
                 * The unit slug identifier
                 * @example 2-4-and-8-times-tables-using-times-tables-to-solve-problems
                 */
                unitSlug: string;
                /**
                 * The unit title
                 * @example 2, 4 and 8 times tables: using times tables to solve problems
                 */
                unitTitle: string;
                /** The exam boards the unit appears in. Only populated for KS4 subjects when the request does not supply an `examBoard` filter. */
                examBoards?: {
                    /** The title of the exam board */
                    title: string;
                    /** The slug of the exam board */
                    slug: string;
                }[];
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
         *       "english-secondary-year-7",
         *       "english-secondary-year-8",
         *       "english-secondary-year-9",
         *       "english-secondary-year-10-aqa",
         *       "english-secondary-year-10-edexcel",
         *       "english-secondary-year-10-eduqas",
         *       "english-secondary-year-11-aqa",
         *       "english-secondary-year-11-edexcel",
         *       "english-secondary-year-11-eduqas"
         *     ]
         */
        SubjectProgrammesResponseSchema: string[];
        /**
         * @example \{
         *       "examboardSlug": "aqa",
         *       "examboardTitle": "AQA",
         *       "keystageSlug": "ks4",
         *       "keystageTitle": "Key Stage 4",
         *       "pathwaySlug": null,
         *       "pathwayTitle": null,
         *       "phaseSlug": "secondary",
         *       "phaseTitle": "Secondary",
         *       "subjectSlug": "computing",
         *       "subjectTitle": "Computing",
         *       "tierSlug": null,
         *       "tierTitle": null,
         *       "yearSlug": "year-10",
         *       "yearTitle": "Year 10"
         *     \}
         */
        ProgrammeResponseSchema: {
            examboardSlug: string | null;
            examboardTitle: string | null;
            keystageSlug: string;
            keystageTitle: string;
            pathwaySlug: string | null;
            pathwayTitle: string | null;
            phaseSlug: string;
            phaseTitle: string;
            subjectSlug: string;
            subjectTitle: string;
            tierSlug: string | null;
            tierTitle: string | null;
            yearSlug: string;
            yearTitle: string;
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
         *         "unitSlug": "variables-and-data-types",
         *         "unitTitle": "Variables and data types",
         *         "unitOrder": 1
         *       \},
         *       \{
         *         "unitSlug": "algorithms",
         *         "unitTitle": "Algorithms",
         *         "unitOrder": 2
         *       \}
         *     ]
         */
        ProgrammeUnitsResponseSchema: {
            /**
             * The unit slug identifier
             * @example variables-and-data-types
             */
            unitSlug: string;
            /**
             * The unit title
             * @example Variables and data types
             */
            unitTitle: string;
            /**
             * The unit order within the programme
             * @example 1
             */
            unitOrder: number;
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
         *         "keyword": "animate",
         *         "description": "to make something move or change its appearance",
         *         "keyStageSlug": "ks2",
         *         "subjectSlug": "computing",
         *         "lessonSlugs": [
         *           "animating-text"
         *         ]
         *       \},
         *       \{
         *         "keyword": "animation",
         *         "description": "a way of making pictures or objects look as if they are moving by showing them quickly one after another",
         *         "keyStageSlug": "ks2",
         *         "subjectSlug": "computing",
         *         "lessonSlugs": [
         *           "introduction-to-animation",
         *           "programming-using-command-blocks"
         *         ]
         *       \}
         *     ]
         */
        KeywordsResponseSchema: {
            /**
             * The keyword text
             * @example animate
             */
            keyword: string;
            /**
             * A description of the keyword
             * @example to make something move or change its appearance
             */
            description: string;
            /**
             * The key stage slug associated with the keyword
             * @example ks2
             */
            keyStageSlug: string;
            /**
             * The subject slug associated with the keyword
             * @example computing
             */
            subjectSlug: string;
            /**
             * The different lesson slugs where this keyword is used
             * @example [
             *       "animating-text"
             *     ]
             */
            lessonSlugs: string[];
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
            /**
             * The starter quiz questions - which test prior knowledge
             * @example [
             *       \{
             *         "question": "Tick the sentence with the correct punctuation.",
             *         "questionType": "multiple-choice",
             *         "answers": [
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "the baby cried"
             *           \},
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "The baby cried"
             *           \},
             *           \{
             *             "distractor": false,
             *             "type": "text",
             *             "content": "The baby cried."
             *           \},
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "the baby cried."
             *           \}
             *         ]
             *       \}
             *     ]
             */
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
            /**
             * The exit quiz questions - which test on the knowledge learned in the lesson
             * @example [
             *       \{
             *         "question": "Which word is a verb?",
             *         "questionType": "multiple-choice",
             *         "answers": [
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "shops"
             *           \},
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "Jun"
             *           \},
             *           \{
             *             "distractor": true,
             *             "type": "text",
             *             "content": "I"
             *           \},
             *           \{
             *             "distractor": false,
             *             "type": "text",
             *             "content": "shout"
             *           \}
             *         ]
             *       \}
             *     ]
             */
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
         *                 "content": "Cube",
         *                 "distractor": true
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "Square",
         *                 "distractor": false
         *               \},
         *               \{
         *                 "type": "text",
         *                 "content": "Triangle",
         *                 "distractor": false
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
         *                 "content": "A 2D shape that folds into a 3D shape.",
         *                 "distractor": false
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
        QuestionsForProgrammeResponseSchema: {
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
         *       "canonicalUrl": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes",
         *       "oakUrl": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes",
         *       "units": [
         *         \{
         *           "unitSlug": "developing-vector-graphics",
         *           "unitTitle": "Developing vector graphics"
         *         \}
         *       ],
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
            /**
             * The lesson title
             * @example Using vector tools to draw and modify shapes
             */
            lessonTitle: string;
            /**
             * Format: uri
             * The canonical Oak National URL for the lesson
             * @example https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes
             */
            canonicalUrl: string;
            /**
             * Format: uri
             * The Oak National URL for the lesson
             * @example https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes
             */
            oakUrl: string;
            /**
             * All the units (including programme variants) this lesson is part of. Each entry is a unique combination of unit slug and programme factors.
             * @example [
             *       \{
             *         "unitSlug": "developing-vector-graphics",
             *         "unitTitle": "Developing vector graphics"
             *       \}
             *     ]
             */
            units: {
                /**
                 * The unit slug identifier
                 * @example developing-vector-graphics
                 */
                unitSlug: string;
                /**
                 * The unit title
                 * @example Developing vector graphics
                 */
                unitTitle: string;
                /** The programme-factor values that identify which variant of the unit this lesson sits in. Omitted when the unit has no programme factors. */
                programmeFactors?: {
                    /** The exam board that identifies this unit variant */
                    examBoard?: {
                        /** The slug identifier for the programme factor */
                        slug: string;
                        /** The title of the programme factor */
                        title: string;
                    };
                    /** The pathway that identifies this unit variant */
                    pathway?: {
                        /** The slug identifier for the programme factor */
                        slug: string;
                        /** The title of the programme factor */
                        title: string;
                    };
                    /** The tier that identifies this unit variant */
                    tier?: {
                        /** The slug identifier for the programme factor */
                        slug: string;
                        /** The title of the programme factor */
                        title: string;
                    };
                    /** The science child subject that identifies this unit variant */
                    childSubject?: {
                        /**
                         * The slug identifier for the science child subject

                         */
                        slug: "biology" | "chemistry" | "combined-science" | "physics";
                        /** The title of the science child subject */
                        title: string;
                    };
                };
            }[];
            /**
             * The subject slug identifier
             * @example computing
             */
            subjectSlug: string;
            /**
             * The subject slug identifier
             * @example Computing
             */
            subjectTitle: string;
            /**
             * The key stage slug identifier
             * @example ks3
             */
            keyStageSlug: string;
            /**
             * The key stage title
             * @example Key Stage 3
             */
            keyStageTitle: string;
            /**
             * The lesson's keywords and their descriptions
             * @example [
             *       \{
             *         "keyword": "vector graphic",
             *         "description": "an image made up of lines and shapes"
             *       \},
             *       \{
             *         "keyword": "z-order",
             *         "description": "the order of overlapping objects"
             *       \},
             *       \{
             *         "keyword": "layer",
             *         "description": "the level on which an object (e.g. text, shapes and photos) can be placed relative to other objects"
             *       \}
             *     ]
             */
            lessonKeywords: {
                /**
                 * The keyword
                 * @example vector graphic
                 */
                keyword: string;
                /**
                 * A definition of the keyword
                 * @example an image made up of lines and shapes
                 */
                description: string;
            }[];
            /**
             * The lesson's key learning points
             * @example [
             *       \{
             *         "keyLearningPoint": "Vector graphics are made from shapes described by coordinates, not pixels."
             *       \},
             *       \{
             *         "keyLearningPoint": "Vector illustrations are built using simple shapes."
             *       \},
             *       \{
             *         "keyLearningPoint": "Vector graphics use z-order to show which shapes are in front and are visible."
             *       \}
             *     ]
             */
            keyLearningPoints: {
                /**
                 * A key learning point
                 * @example Vector graphics are made from shapes described by coordinates, not pixels.
                 */
                keyLearningPoint: string;
            }[];
            /**
             * The lesson’s anticipated common misconceptions and suggested teacher responses
             * @example [
             *       \{
             *         "misconception": "Vector graphics are made from pixels and can lose quality when resized.",
             *         "response": "Vector graphics are made from lines and shapes. They do not lose quality when resized."
             *       \}
             *     ]
             */
            misconceptionsAndCommonMistakes: {
                /**
                 * A common misconception
                 * @example Vector graphics are made from pixels and can lose quality when resized.
                 */
                misconception: string;
                /**
                 * Suggested teacher response to a common misconception
                 * @example Vector graphics are made from lines and shapes. They do not lose quality when resized.
                 */
                response: string;
            }[];
            /**
             * Suggested teacher response to a common misconception
             * @example I can use software to draw and modify vector shapes.
             */
            pupilLessonOutcome?: string;
            /**
             * Helpful teaching tips for the lesson
             * @example [
             *       \{
             *         "teacherTip": "You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials"
             *       \}
             *     ]
             */
            teacherTips: {
                /** @example You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials */
                teacherTip: string;
            }[];
            /**
             * Full guidance about the types of lesson content for the teacher to consider (where appropriate)
             * @example null
             */
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
            /**
             * The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information.
             * @example null
             */
            supervisionLevel: string | null;
            /**
             * Whether the lesson currently has any downloadable assets available.
             * @example true
             */
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
         *       "unitSlug": "programming-subroutines",
         *       "unitTitle": "Programming subroutines",
         *       "yearSlug": "year-10",
         *       "year": 10,
         *       "phaseSlug": "secondary",
         *       "subjectSlug": "computing",
         *       "keyStageSlug": "ks4",
         *       "priorKnowledgeRequirements": [
         *         "Variables can be used to store values in a program.",
         *         "Selection can be used to choose between paths in a program.",
         *         "Iteration can be used to repeat a set of instructions."
         *       ],
         *       "nationalCurriculumContent": [
         *         "Use two or more programming languages, at least one of which is textual, to solve a variety of computational problems.",
         *         "Make appropriate use of data structures.",
         *         "Design and develop modular programs."
         *       ],
         *       "programmeFactors": \{
         *         "examBoard": \{
         *           "slug": "aqa",
         *           "title": "AQA"
         *         \},
         *         "pathway": \{
         *           "slug": "gcse",
         *           "title": "GCSE"
         *         \}
         *       \},
         *       "unitLessons": [
         *         \{
         *           "lessonSlug": "structured-programs",
         *           "lessonTitle": "Structured programs",
         *           "lessonOrder": 1,
         *           "state": "published"
         *         \},
         *         \{
         *           "lessonSlug": "subroutines-with-parameters",
         *           "lessonTitle": "Subroutines with parameters",
         *           "lessonOrder": 2,
         *           "state": "new"
         *         \}
         *       ]
         *     \}
         */
        UnitSummaryResponseSchema: {
            /**
             * The unit slug identifier
             * @example programming-subroutines
             */
            unitSlug: string;
            /**
             * The unit title
             * @example Programming subroutines
             */
            unitTitle: string;
            /**
             * The slug identifier for the year to which the unit belongs
             * @example year-10
             */
            yearSlug: string;
            /**
             * The year to which the unit belongs
             * @example 10
             */
            year: number | string;
            /**
             * The slug identifier for the phase to which the unit belongs
             * @example secondary
             */
            phaseSlug: string;
            /**
             * The subject identifier
             * @example computing
             */
            subjectSlug: string;
            /**
             * The slug identifier for the the key stage to which the unit belongs
             * @example ks4
             */
            keyStageSlug: string;
            /** Unit summary notes */
            notes?: string;
            /** A short description of the unit. Not yet available for all subjects. */
            description?: string;
            /**
             * The prior knowledge required for the unit
             * @example [
             *       "Variables can be used to store values in a program.",
             *       "Selection can be used to choose between paths in a program.",
             *       "Iteration can be used to repeat a set of instructions."
             *     ]
             */
            priorKnowledgeRequirements: string[];
            /**
             * National curriculum attainment statements covered in this unit
             * @example [
             *       "Use two or more programming languages, at least one of which is textual, to solve a variety of computational problems.",
             *       "Make appropriate use of data structures.",
             *       "Design and develop modular programs."
             *     ]
             */
            nationalCurriculumContent: string[];
            /** An explanation of where the unit sits within the sequence and why it has been placed there. */
            whyThisWhyNow?: string;
            /** The threads that are associated with the unit */
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
            /**
             * The programme-factor values that identify which variant of this unit is returned. Omitted when the unit has no programme factors.
             * @example \{
             *       "examBoard": \{
             *         "slug": "aqa",
             *         "title": "AQA"
             *       \},
             *       "pathway": \{
             *         "slug": "gcse",
             *         "title": "GCSE"
             *       \}
             *     \}
             */
            programmeFactors?: {
                /** The exam board that identifies this unit variant */
                examBoard?: {
                    /** The slug identifier for the programme factor */
                    slug: string;
                    /** The title of the programme factor */
                    title: string;
                };
                /** The pathway that identifies this unit variant */
                pathway?: {
                    /** The slug identifier for the programme factor */
                    slug: string;
                    /** The title of the programme factor */
                    title: string;
                };
                /** The tier that identifies this unit variant */
                tier?: {
                    /** The slug identifier for the programme factor */
                    slug: string;
                    /** The title of the programme factor */
                    title: string;
                };
                /** The science child subject that identifies this unit variant */
                childSubject?: {
                    /**
                     * The slug identifier for the science child subject

                     */
                    slug: "biology" | "chemistry" | "combined-science" | "physics";
                    /** The title of the science child subject */
                    title: string;
                };
            };
            /** If the unit is unit variant, then this is the unit's "parent" unit slug */
            unitOptionsGroup?: string;
            /**
             * @example [
             *       \{
             *         "lessonSlug": "structured-programs",
             *         "lessonTitle": "Structured programs",
             *         "lessonOrder": 1,
             *         "state": "published"
             *       \},
             *       \{
             *         "lessonSlug": "subroutines-with-parameters",
             *         "lessonTitle": "Subroutines with parameters",
             *         "lessonOrder": 2,
             *         "state": "new"
             *       \}
             *     ]
             */
            unitLessons: {
                /**
                 * The lesson slug identifier
                 * @example structured-programs
                 */
                lessonSlug: string;
                /**
                 * The title for the lesson
                 * @example Structured programs
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
         *         "slug": "number-multiplication-and-division",
         *         "unitCount": 78
         *       \},
         *       \{
         *         "title": "Number: Place value",
         *         "slug": "number-place-value",
         *         "unitCount": 56
         *       \}
         *     ]
         */
        AllThreadsResponseSchema: {
            /** The thread title */
            title: string;
            /** The thread slug identifier */
            slug: string;
            /** The number of published units in the thread */
            unitCount: number;
            /** Threads are data concepts without Oak URLs on the website. Always null for thread resources. */
            oakUrl?: null;
        }[];
        /**
         * @example [
         *       \{
         *         "unitTitle": "Unitising and coin recognition - counting in 2s, 5s and 10s",
         *         "unitSlug": "unitising-and-coin-recognitions-counting-in-2s-5s-and-10s"
         *       \},
         *       \{
         *         "unitTitle": "Solving problems in a range of contexts",
         *         "unitSlug": "unitising-and-coin-recognition-solving-problems-involving-money"
         *       \}
         *     ]
         */
        ThreadUnitsResponseSchema: {
            /** The unit title */
            unitTitle: string;
            /** The unit slug identifier */
            unitSlug: string;
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
    "getSequences-getSubjectSequence": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The sequence slug identifier */
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
    "getSequences-getSequenceUnits": {
        parameters: {
            query?: {
                /** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. */
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
                /** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. */
                year?: number;
                /**
                 * Optional asset type specifier
                 *
                 *     Available values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers
                 */
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
                /** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint */
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
                /** Optional unit slug to additionally filter by */
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
                /**
                 * Optional asset type specifier
                 *
                 *     Available values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers
                 */
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
    "getAssets-getProgrammeAssets": {
        parameters: {
            query?: {
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of lessons, e.g. return a maximum of 300 lessons */
                limit?: number;
                /** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint */
                type?: "slideDeck" | "exitQuiz" | "exitQuizAnswers" | "starterQuiz" | "starterQuizAnswers" | "supplementaryResource" | "video" | "worksheet" | "worksheetAnswers";
            };
            header?: never;
            path: {
                /** The programme slug identifier */
                programme: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["ProgrammeAssetsResponseSchema"];
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
                /** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint */
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
    "getSubjects-getSubjectKeyStages": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The subject slug identifier */
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
                /** Optional unit slug to additionally filter by */
                unit?: string;
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of lessons, e.g. return a maximum of 300 lessons */
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
            query?: {
                /** Optional exam board slug to filter units by, e.g. 'aqa'. Only meaningful at KS4 where subjects are broken down by exam board. */
                examBoard?: "aqa" | "edexcel" | "eduqas" | "ocr" | "wjec" | "edexcelb";
            };
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
    "getAllProgrammesForSubject-getAllProgrammesForSubject": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The subject slug identifier */
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
                    "application/json": components["schemas"]["SubjectProgrammesResponseSchema"];
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
    "getAllProgrammesForSubject-getProgramme": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The programme slug identifier */
                programme: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["ProgrammeResponseSchema"];
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
    "getAllProgrammesForSubject-getProgrammeUnits": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** The programme slug identifier */
                programme: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["ProgrammeUnitsResponseSchema"];
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
                /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) */
                subject?: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
                /** Key stage slug to filter by, e.g. 'ks2' */
                keyStage?: "ks1" | "ks2" | "ks3" | "ks4";
                /** Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage. */
                phase?: "primary" | "secondary";
                /** Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase) */
                unit?: string;
                /** Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase) */
                lesson?: string;
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of keywords, e.g. return a maximum of 300 keywords */
                limit?: number;
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
                    "application/json": components["schemas"]["KeywordsResponseSchema"];
                };
            };
        };
    };
    "getQuestions-getQuestionsForLessons": {
        parameters: {
            query?: {
                /** Optional filter for question results. Use `images` to return only questions with a question image or image answer. */
                filter?: "images";
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
                /** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. */
                year?: number;
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of lessons, e.g. return a maximum of 300 lessons */
                limit?: number;
                /** Optional filter for question results. Use `images` to return only questions with a question image or image answer. */
                filter?: "images";
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
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of lessons, e.g. return a maximum of 300 lessons */
                limit?: number;
                /** Optional filter for question results. Use `images` to return only questions with a question image or image answer. */
                filter?: "images";
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
    "getQuestions-getQuestionsForProgramme": {
        parameters: {
            query?: {
                /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point */
                offset?: number;
                /** Limit the number of lessons, e.g. return a maximum of 300 lessons */
                limit?: number;
                /** Optional filter for question results. Use `images` to return only questions with a question image or image answer. */
                filter?: "images";
            };
            header?: never;
            path: {
                /** The programme slug identifier */
                programme: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** Successful response */
            200: {
                headers?: never;
                content: {
                    "application/json": components["schemas"]["QuestionsForProgrammeResponseSchema"];
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
                /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase */
                keyStage?: "ks1" | "ks2" | "ks3" | "ks4";
                /** Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase */
                subject?: "art" | "citizenship" | "computing" | "cooking-nutrition" | "design-technology" | "english" | "french" | "geography" | "german" | "history" | "maths" | "music" | "physical-education" | "religious-education" | "rshe-pshe" | "science" | "spanish";
                /** Optional unit slug to additionally filter by */
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
            query?: {
                /** Optional exam board slug to narrow the unit to a specific programme variant, e.g. 'aqa'. */
                examBoard?: "aqa" | "edexcel" | "eduqas" | "ocr" | "wjec" | "edexcelb";
                /** Optional pathway slug to narrow the unit to a specific programme variant, e.g. 'gcse'. */
                pathway?: "core" | "gcse";
                /** Optional tier slug to narrow the unit to a specific programme variant, e.g. 'foundation'. */
                tier?: "core" | "foundation" | "higher";
                /** Optional science child subject slug to narrow the unit to a specific programme variant. Only available for science units, e.g. 'biology'. */
                childSubject?: "biology" | "chemistry" | "combined-science" | "physics";
            };
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
                /** The thread identifier for a given unit */
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
