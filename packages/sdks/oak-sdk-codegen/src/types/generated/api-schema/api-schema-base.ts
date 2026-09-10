/**
 * The base API schema.
 *
 * This is the original OpenAPI schema without any tool enrichments.
 */

export const schemaBase = {
  "openapi": "3.1.0",
  "info": {
    "title": "Oak OpenAPI",
    "version": "0.7.0-3b4b01e6a7677713b21d997f2c20d42b86ff9b46"
  },
  "servers": [
    {
      "url": "https://open-api.thenational.academy/api/v0"
    }
  ],
  "tags": [
    {
      "name": "internal"
    },
    {
      "name": "lists"
    },
    {
      "name": "assets"
    },
    {
      "name": "lessons"
    },
    {
      "name": "questions"
    },
    {
      "name": "units"
    },
    {
      "name": "search"
    },
    {
      "name": "sequences"
    },
    {
      "name": "programmes"
    }
  ],
  "externalDocs": {
    "url": "https://open-api.thenational.academy/api/v0/swagger.json"
  },
  "paths": {
    "/sequences/{sequence}": {
      "get": {
        "operationId": "getSequences-getSubjectSequence",
        "summary": "Sequencing information for a given sequence slug",
        "description": "Use when you have a sequence slug and need the sequence-level summary. A sequence is a subject's curriculum across a phase (e.g. maths-primary, science-secondary-aqa); it spans one or more National Curriculum schemes and contains one programme per year group. Get sequence slugs from GET /subjects or GET /subjects/{subject} (the sequenceSlugs field). Returns slug, phase, key stages, years, and any KS4 programme factors (exam board, tier, child subject, pathway) needed to interpret the programmes within it.\n\nNot for: the programmes within this sequence (GET /subjects/{subject}/programmes); the unit sequence for one programme (GET /programmes/{programme}/units); all units across the sequence (GET /sequences/{sequence}/units); subject-level catalogue data (GET /subjects or GET /subjects/{subject}).\n\nExample: sequence=maths-primary or science-secondary-aqa.",
        "tags": [
          "lists",
          "sequences"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "sequence",
            "schema": {
              "type": "string",
              "description": "The sequence slug identifier",
              "example": "english-secondary-aqa"
            },
            "required": true,
            "description": "The sequence slug identifier"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectSequenceResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/sequences/{sequence}/units": {
      "get": {
        "operationId": "getSequences-getSequenceUnits",
        "summary": "Units in a curriculum sequence",
        "description": "Use when you want every unit across a whole sequence — all programmes combined, in unit sequence order. Returns units grouped by programme (year group) in unit sequence order. If the sequence slug includes an exam board (e.g. science-secondary-aqa), units are scoped to that exam board. Secondary sequences also expose tiers, pathways, and exam subjects where applicable. Pass year as an optional filter to return only that year's units (across all KS4 factor combinations).\n\nNot for: units in a single programme (GET /programmes/{programme}/units); a flat list of units for a key stage + subject without programme structure or unit sequence order (GET /key-stages/{keyStage}/subject/{subject}/units); the programmes within this sequence (GET /subjects/{subject}/programmes); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units).\n\nExample: sequence=science-secondary-aqa or maths-primary.",
        "tags": [
          "units",
          "sequences"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "sequence",
            "schema": {
              "type": "string",
              "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
              "example": "english-primary"
            },
            "required": true,
            "description": "The sequence slug identifier, including the key stage 4 option where relevant."
          },
          {
            "in": "query",
            "name": "year",
            "schema": {
              "type": "string",
              "enum": [
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
                "all-years"
              ],
              "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.",
              "example": "1"
            },
            "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SequenceUnitsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/transcript": {
      "get": {
        "operationId": "getLessonTranscript-getLessonTranscript",
        "summary": "Lesson video transcript",
        "description": "Use when you have a lesson slug and need the video transcript — for accessibility, captioning, or text analysis. Returns the transcript as an array of sentences plus a raw WebVTT captions file (vtt) suitable for a <track> element.\n\nNot for: searching across transcripts (GET /search/transcripts); the video file itself (GET /lessons/{lesson}/assets/{type} with type=video); lesson metadata (GET /lessons/{lesson}/summary).",
        "tags": [
          "lessons"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "lesson",
            "schema": {
              "type": "string",
              "description": "The slug of the lesson",
              "example": "checking-understanding-of-basic-transformations"
            },
            "required": true,
            "description": "The slug of the lesson"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TranscriptResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/search/transcripts": {
      "get": {
        "operationId": "searchTranscripts-searchTranscripts",
        "summary": "Lesson search by video transcript",
        "description": "Use when you want to search the spoken content of lesson videos. Returns up to 5 lessons whose transcripts contain similar text, each with a transcript snippet showing the match. No filters; searches every published transcript.\n\nNot for: terms in the lesson title (GET /search/lessons); metadata for a known lesson (GET /lessons/{lesson}/summary); a transcript by slug (GET /lessons/{lesson}/transcript).\n\nExample queries: the mitochondria are the powerhouse, to be or not to be, carry the one.",
        "tags": [
          "search"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "q",
            "schema": {
              "type": "string",
              "description": "A snippet of text to search for in the lesson video transcripts",
              "example": "Who were the romans?"
            },
            "required": true,
            "description": "A snippet of text to search for in the lesson video transcripts"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SearchTranscriptResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/sequences/{sequence}/assets": {
      "get": {
        "operationId": "getAssets-getSequenceAssets",
        "summary": "Downloadable assets in a sequence",
        "description": "Use when you need every downloadable asset across a whole sequence — all programmes combined. Returns assets grouped by lesson in unit sequence order, with signed download URLs, asset type, lesson title and slug, and attribution. Pass year as an optional filter. Narrow further with type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: assets in a single programme (GET /programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets).",
        "tags": [
          "assets",
          "sequences"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "sequence",
            "schema": {
              "type": "string",
              "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
              "example": "maths-primary"
            },
            "required": true,
            "description": "The sequence slug identifier, including the key stage 4 option where relevant."
          },
          {
            "in": "query",
            "name": "year",
            "schema": {
              "type": "number",
              "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.",
              "example": 3
            },
            "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."
          },
          {
            "in": "query",
            "name": "type",
            "schema": {
              "type": "string",
              "enum": [
                "slideDeck",
                "exitQuiz",
                "exitQuizAnswers",
                "starterQuiz",
                "starterQuizAnswers",
                "supplementaryResource",
                "video",
                "worksheet",
                "worksheetAnswers"
              ],
              "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
              "example": "slideDeck"
            },
            "description": "Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SequenceAssetsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/key-stages/{keyStage}/subject/{subject}/assets": {
      "get": {
        "operationId": "getAssets-getSubjectAssets",
        "summary": "Downloadable assets by key stage and subject",
        "description": "Use when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: assets across a sequence (GET /sequences/{sequence}/assets); assets in one programme (GET /programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).",
        "tags": [
          "assets"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
              "example": "ks1"
            },
            "required": true,
            "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)",
              "example": "english"
            },
            "required": true,
            "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"
          },
          {
            "in": "query",
            "name": "type",
            "schema": {
              "type": "string",
              "enum": [
                "slideDeck",
                "exitQuiz",
                "exitQuizAnswers",
                "starterQuiz",
                "starterQuizAnswers",
                "supplementaryResource",
                "video",
                "worksheet",
                "worksheetAnswers"
              ],
              "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
              "example": "slideDeck"
            },
            "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint"
          },
          {
            "in": "query",
            "name": "unit",
            "schema": {
              "type": "string",
              "description": "Optional unit slug to additionally filter by",
              "example": "word-class"
            },
            "description": "Optional unit slug to additionally filter by"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectAssetsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/assets": {
      "get": {
        "operationId": "getAssets-getLessonAssets",
        "summary": "Downloadable assets for a lesson",
        "description": "Use when you have a lesson slug and need the list of what's downloadable. Returns every available asset type with a signed download URL per asset and attribution. The 9 type values are: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Pass type to return only one. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: streaming the file itself (GET /lessons/{lesson}/assets/{type}); bulk asset retrieval across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/assets), a sequence (GET /sequences/{sequence}/assets), or one programme (GET /programmes/{programme}/assets); lesson metadata (GET /lessons/{lesson}/summary).",
        "tags": [
          "assets",
          "lessons"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "lesson",
            "schema": {
              "type": "string",
              "description": "The lesson slug identifier",
              "example": "creating-a-new-word"
            },
            "required": true,
            "description": "The lesson slug identifier"
          },
          {
            "in": "query",
            "name": "type",
            "schema": {
              "type": "string",
              "enum": [
                "slideDeck",
                "exitQuiz",
                "exitQuizAnswers",
                "starterQuiz",
                "starterQuizAnswers",
                "supplementaryResource",
                "video",
                "worksheet",
                "worksheetAnswers"
              ],
              "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
              "example": "slideDeck"
            },
            "description": "Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LessonAssetsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/programmes/{programme}/assets": {
      "get": {
        "operationId": "getAssets-getProgrammeAssets",
        "summary": "Downloadable assets in a programme",
        "description": "Use when you need every downloadable asset for a single programme (year group) within a subject. Returns assets grouped by lesson with signed download URLs, asset type, lesson title and slug, and attribution. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages. Optionally narrow by asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: assets across a whole sequence (GET /sequences/{sequence}/assets); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).",
        "tags": [
          "assets",
          "programmes"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "programme",
            "schema": {
              "type": "string",
              "description": "The programme slug identifier",
              "example": "computing-secondary-year-7"
            },
            "required": true,
            "description": "The programme slug identifier"
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
              "example": 0
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "type": "number",
              "maximum": 300,
              "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons",
              "example": 20
            },
            "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
          },
          {
            "in": "query",
            "name": "type",
            "schema": {
              "type": "string",
              "enum": [
                "slideDeck",
                "exitQuiz",
                "exitQuizAnswers",
                "starterQuiz",
                "starterQuizAnswers",
                "supplementaryResource",
                "video",
                "worksheet",
                "worksheetAnswers"
              ],
              "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
              "example": "slideDeck"
            },
            "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProgrammeAssetsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/assets/{type}": {
      "get": {
        "operationId": "getAssets-getLessonAsset",
        "summary": "Stream a lesson asset file",
        "description": "Use when you want to download one specific asset for a lesson — slide deck, worksheet, etc. Returns the file directly. Call GET /lessons/{lesson}/assets first to see which type values are available. Valid type values: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: listing which asset types a lesson has (GET /lessons/{lesson}/assets); fetching the transcript (GET /lessons/{lesson}/transcript).",
        "tags": [
          "assets",
          "lessons"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "lesson",
            "schema": {
              "type": "string",
              "description": "The lesson slug",
              "example": "creating-a-new-word"
            },
            "required": true,
            "description": "The lesson slug"
          },
          {
            "in": "path",
            "name": "type",
            "schema": {
              "type": "string",
              "enum": [
                "slideDeck",
                "exitQuiz",
                "exitQuizAnswers",
                "starterQuiz",
                "starterQuizAnswers",
                "supplementaryResource",
                "video",
                "worksheet",
                "worksheetAnswers"
              ],
              "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
              "example": "slideDeck"
            },
            "required": true,
            "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LessonAssetResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/subjects": {
      "get": {
        "operationId": "getSubjects-getAllSubjects",
        "summary": "All subjects",
        "description": "Use when you need every subject in one call — the entry point for a subject picker or for crawling the whole curriculum. Returns subjects alphabetically, each with subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for that subject; each sequence contains one programme per year group — call GET /subjects/{subject}/programmes to enumerate them.\n\nNot for: a single subject (GET /subjects/{subject}); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); lessons or units inside a subject (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AllSubjectsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/subjects/{subject}": {
      "get": {
        "operationId": "getSubjects-getSubject",
        "summary": "Single subject with sequences, key stages, and years",
        "description": "Use when you have a subject slug. Returns subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for this subject; each sequence contains one programme per year group — call GET /subjects/{subject}/programmes to enumerate them.\n\nNot for: every subject in one call (GET /subjects); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); subject-scoped lessons or units (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).\n\nExample: subject=maths.",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "The slug identifier for the subject",
              "example": "art"
            },
            "required": true,
            "description": "The slug identifier for the subject"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/subjects/{subject}/key-stages": {
      "get": {
        "operationId": "getSubjects-getSubjectKeyStages",
        "summary": "Key stages for a subject",
        "description": "Use when you only need the key stages where this subject is available. Returns key-stage titles and slugs.\n\nNot for: every key stage (GET /key-stages); the subject record (GET /subjects/{subject}).\n\nExample: 'subject=history'.",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "The subject slug identifier",
              "example": "art"
            },
            "required": true,
            "description": "The subject slug identifier"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectKeyStagesResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/subjects/{subject}/years": {
      "get": {
        "operationId": "getSubjects-getSubjectYears",
        "summary": "Year groups for a subject",
        "description": "Use when you only need the year groups where this subject is available. Returns an array of year numbers, derived from the subject's key stages.\n\nNot for: the subject record (GET /subjects/{subject}); key stages rather than year groups (GET /subjects/{subject}/key-stages).\n\nExample: 'subject=english'.",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "example": "cooking-nutrition",
              "description": "Subject slug to filter by"
            },
            "required": true,
            "description": "Subject slug to filter by"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectYearsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/key-stages": {
      "get": {
        "operationId": "getKeyStages-getKeyStages",
        "summary": "All key stages",
        "description": "Use when you need the master list of key stages. Returns every key stage with its title and slug.\n\nNot for: key stages restricted to a subject (GET /subjects/{subject}/key-stages).",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KeyStageResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/key-stages/{keyStage}/subject/{subject}/lessons": {
      "get": {
        "operationId": "getKeyStageSubjectLessons-getKeyStageSubjectLessons",
        "summary": "List lessons in a key stage and subject",
        "description": "Use when you want every published lesson in a key stage + subject, grouped by unit, without programme structure or unit sequence order. Returns an array of units, each with slug, title, and the lessons inside. Pass unit to restrict to one. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages.\n\nNot for: finding a lesson from a search term (GET /search/lessons); a single lesson's metadata (GET /lessons/{lesson}/summary); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units).\n\nExample: keyStage=ks3, subject=maths, unit=perimeter-and-area.",
        "tags": [
          "lists",
          "lessons"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
              "example": "ks1"
            },
            "required": true,
            "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase",
              "example": "english"
            },
            "required": true,
            "description": "Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "query",
            "name": "unit",
            "schema": {
              "type": "string",
              "description": "Optional unit slug to additionally filter by",
              "example": "word-class"
            },
            "description": "Optional unit slug to additionally filter by"
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "example": 11,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "example": 10,
              "type": "number",
              "maximum": 300,
              "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
            },
            "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KeyStageSubjectLessonsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/key-stages/{keyStage}/subject/{subject}/units": {
      "get": {
        "operationId": "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits",
        "summary": "Units in a key stage and subject",
        "description": "Use when you want a flat list of every unit with published lessons in a key stage + subject, without programme structure or unit sequence order. Returns units grouped by year slug; units without published lessons are omitted. Pass examBoard to restrict KS4 to one board (one of: aqa, edexcel (Edexcel A), eduqas, ocr, wjec, edexcelb (Edexcel B)); otherwise each unit lists the boards it appears in.\n\nNot for: all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); a single unit (GET /units/{unit}/summary); lessons rather than units (GET /key-stages/{keyStage}/subject/{subject}/lessons); units in a thread (GET /threads/{threadSlug}/units).",
        "tags": [
          "lists",
          "units"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "description": "Key stage slug to filter by, e.g. 'ks2'",
              "example": "ks1"
            },
            "required": true,
            "description": "Key stage slug to filter by, e.g. 'ks2'"
          },
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)",
              "example": "art"
            },
            "required": true,
            "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"
          },
          {
            "in": "query",
            "name": "examBoard",
            "schema": {
              "type": "string",
              "enum": [
                "aqa",
                "edexcel",
                "eduqas",
                "ocr",
                "wjec",
                "edexcelb"
              ]
            },
            "description": "Optional exam board slug to filter units by, e.g. 'aqa'. Only meaningful at KS4 where subjects are broken down by exam board."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AllKeyStageAndSubjectUnitsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/subjects/{subject}/programmes": {
      "get": {
        "operationId": "getAllProgrammesForSubject-getAllProgrammesForSubject",
        "summary": "Get all programmes for a subject slug",
        "description": "Use when you need to discover the programmes within a subject — to get a programme's slug for use with GET /programmes/{programme} or its sub-endpoints. Returns programmes grouped by key stage, each with year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject).\n\nNot for: the metadata of one programme (GET /programmes/{programme}); the units, questions, or assets of one programme (GET /programmes/{programme}/units, GET /programmes/{programme}/questions, or GET /programmes/{programme}/assets); the sequence-level summary (GET /sequences/{sequence}).",
        "tags": [
          "programmes"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "The subject slug identifier",
              "example": "english"
            },
            "required": true,
            "description": "The subject slug identifier"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubjectProgrammesResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/programmes/{programme}": {
      "get": {
        "operationId": "getAllProgrammesForSubject-getProgramme",
        "summary": "Get a programme by slug",
        "description": "Use when you need to get the metadata of one programme. Get programme slugs from GET /subjects/{subject}/programmes. Returns the programme's year group, slug (e.g. y7, y10-biology-foundation), and applicable programme factors (exam board, tier, child subject).\n\nNot for: the units, questions, or assets of one programme (GET /programmes/{programme}/units, GET /programmes/{programme}/questions, or GET /programmes/{programme}/assets); the sequence-level summary (GET /sequences/{sequence}); all programmes for a subject (GET /subjects/{subject}/programmes).",
        "tags": [
          "programmes"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "programme",
            "schema": {
              "type": "string",
              "description": "The programme slug identifier",
              "example": "english-secondary-year-10-edexcel"
            },
            "required": true,
            "description": "The programme slug identifier"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProgrammeResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/programmes/{programme}/units": {
      "get": {
        "operationId": "getAllProgrammesForSubject-getProgrammeUnits",
        "summary": "Units in a programme",
        "description": "Use when you need the unit sequence for one programme — units as an ordered arrangement designed to build knowledge progressively. Get programme slugs from GET /subjects/{subject}/programmes. Returns units in unit sequence order with title, slug, and any associated factors.\n\n  Not for: every unit across the whole sequence (GET /sequences/{sequence}/units); a flat list of units for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/units); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units).",
        "tags": [
          "programmes",
          "units"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "programme",
            "schema": {
              "type": "string",
              "description": "The programme slug identifier",
              "example": "english-secondary-year-10-edexcel"
            },
            "required": true,
            "description": "The programme slug identifier"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProgrammeUnitsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/keywords": {
      "get": {
        "operationId": "getKeywords-getKeywords",
        "summary": "Keywords by subject and key stage",
        "description": "Use when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase.\n\nRequest rules:\n\n- At least one of subject, keyStage, phase, unit or lesson must be provided - note that they are all the slug form of the values (e.g. \"ks2\" for key stage 2, \"science\" for the science subject, and \"forces-and-magnets\" for the forces and magnets unit), and that casing is important (always lowercase).",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "example": "english"
            },
            "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)"
          },
          {
            "in": "query",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "example": "ks1"
            },
            "description": "Key stage slug to filter by, e.g. 'ks2'"
          },
          {
            "in": "query",
            "name": "phase",
            "schema": {
              "type": "string",
              "enum": [
                "primary",
                "secondary"
              ]
            },
            "description": "Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage."
          },
          {
            "in": "query",
            "name": "unit",
            "schema": {
              "type": "string"
            },
            "description": "Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase)"
          },
          {
            "in": "query",
            "name": "lesson",
            "schema": {
              "type": "string"
            },
            "description": "Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase)"
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
              "example": 0
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "description": "Limit the number of keywords, e.g. return a maximum of 300 keywords",
              "type": "number",
              "maximum": 300,
              "example": 20
            },
            "description": "Limit the number of keywords, e.g. return a maximum of 300 keywords"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/KeywordsResponseSchema"
                }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/quiz": {
      "get": {
        "operationId": "getQuestions-getQuestionsForLessons",
        "summary": "Quiz questions for a lesson",
        "description": "Use when you have a lesson slug and need its starter and exit quiz questions with correct answers marked. Returns two arrays, starterQuiz and exitQuiz; each question includes the prompt, the answers (with correct ones flagged), and which answers are distractors.\n\nNot for: quiz questions across a sequence (GET /sequences/{sequence}/questions); quiz questions in one programme (GET /programmes/{programme}/questions); across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/questions); lesson metadata or assets (GET /lessons/{lesson}/summary or GET /lessons/{lesson}/assets).",
        "tags": [
          "lessons",
          "questions"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "lesson",
            "schema": {
              "type": "string",
              "description": "The lesson slug identifier",
              "example": "imagining-you-are-the-characters-the-three-billy-goats-gruff"
            },
            "required": true,
            "description": "The lesson slug identifier"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string",
              "enum": [
                "images"
              ],
              "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
            },
            "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionForLessonsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/sequences/{sequence}/questions": {
      "get": {
        "operationId": "getQuestions-getQuestionsForSequence",
        "summary": "Quiz questions across a sequence",
        "description": "Use when you want every quiz question across a whole sequence — all programmes combined. Returns questions grouped by lesson in unit sequence order. Pass year as an optional filter to return only that year's questions. Supports offset and limit; Link: rel=\"next\" header signals more pages.\n\nNot for: questions in a single programme (GET /programmes/{programme}/questions); a single lesson's quiz (GET /lessons/{lesson}/quiz); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).",
        "tags": [
          "questions",
          "sequences"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "sequence",
            "schema": {
              "type": "string",
              "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
              "example": "maths-secondary"
            },
            "required": true,
            "description": "The sequence slug identifier, including the key stage 4 option where relevant."
          },
          {
            "in": "query",
            "name": "year",
            "schema": {
              "type": "number",
              "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.",
              "example": 3
            },
            "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "example": 101,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "example": 100,
              "type": "number",
              "maximum": 300,
              "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
            },
            "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string",
              "enum": [
                "images"
              ],
              "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
            },
            "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionsForSequenceResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/key-stages/{keyStage}/subject/{subject}/questions": {
      "get": {
        "operationId": "getQuestions-getQuestionsForKeyStageAndSubject",
        "summary": "Quiz questions by key stage and subject",
        "description": "Use when you want every quiz question for a key stage + subject, without programme structure or unit sequence order. Returns lessons each with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages.\n\nNot for: a single lesson's quiz (GET /lessons/{lesson}/quiz); questions across a sequence (GET /sequences/{sequence}/questions); questions in one programme (GET /programmes/{programme}/questions).",
        "tags": [
          "questions"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
              "example": "ks1"
            },
            "required": true,
            "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "path",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "Subject slug to search by, e.g. 'science' - note that casing is important here",
              "example": "art"
            },
            "required": true,
            "description": "Subject slug to search by, e.g. 'science' - note that casing is important here"
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "example": 11,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "example": 10,
              "type": "number",
              "maximum": 300,
              "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
            },
            "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string",
              "enum": [
                "images"
              ],
              "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
            },
            "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionsForKeyStageAndSubjectResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/programmes/{programme}/questions": {
      "get": {
        "operationId": "getQuestions-getQuestionsForProgramme",
        "summary": "Quiz questions in a programme",
        "description": "Use when you want every quiz question in a single programme (year group) within a subject. Get programme slugs from GET /subjects/{subject}/programmes. Returns questions grouped by lesson with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages.\n\nNot for: questions in a single lesson (GET /lessons/{lesson}/quiz); questions across a whole sequence (GET /sequences/{sequence}/questions); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).",
        "tags": [
          "questions",
          "programmes"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "programme",
            "schema": {
              "type": "string",
              "description": "The programme slug identifier",
              "example": "computing-secondary-year-7"
            },
            "required": true,
            "description": "The programme slug identifier"
          },
          {
            "in": "query",
            "name": "offset",
            "schema": {
              "default": 0,
              "type": "number",
              "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
              "example": 0
            },
            "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "default": 20,
              "type": "number",
              "maximum": 300,
              "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons",
              "example": 20
            },
            "description": "Limit the number of lessons, e.g. return a maximum of 300 lessons"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string",
              "enum": [
                "images"
              ],
              "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
            },
            "description": "Optional filter for question results. Use `images` to return only questions with a question image or image answer."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionsForProgrammeResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/lessons/{lesson}/summary": {
      "get": {
        "operationId": "getLessons-getLesson",
        "summary": "Lesson summary by slug",
        "description": "Use when you have a lesson slug and need its full metadata: title, key stage, subject, unit, keywords, key learning points, misconceptions, pupil lesson outcome, teacher tips, content guidance, supervision level, and downloadsAvailable. Returns the lesson summary record.\n\nNot for: finding a lesson from a search term (GET /search/lessons); searching what's said in lesson videos (GET /search/transcripts); listing every lesson in a unit or subject (GET /key-stages/{keyStage}/subject/{subject}/lessons); the transcript or assets (GET /lessons/{lesson}/transcript or GET /lessons/{lesson}/assets).\n\nExample slug: imagining-you-are-the-characters-the-three-billy-goats-gruff.",
        "tags": [
          "lessons"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "lesson",
            "schema": {
              "type": "string",
              "description": "The slug of the lesson",
              "example": "using-vector-tools-to-draw-and-modify-shapes"
            },
            "required": true,
            "description": "The slug of the lesson"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LessonSummaryResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/search/lessons": {
      "get": {
        "operationId": "getLessons-searchByTextSimilarity",
        "summary": "Lesson search by title",
        "description": "Use when you want to find lessons whose titles match a search term. Returns up to 20 lessons ranked by title similarity — each with slug, title, URL, similarity score, and the unit(s) the lesson appears in. Optional keyStage, subject, and unit narrow the search.\n\nNot for: searching what's said in lesson videos (GET /search/transcripts); metadata for a known lesson (GET /lessons/{lesson}/summary); listing every lesson in a key stage + subject without ranking (GET /key-stages/{keyStage}/subject/{subject}/lessons).\n\nExample queries: KS3 science photosynthesis, fractions year 5, Macbeth soliloquy.",
        "tags": [
          "lessons",
          "search"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "query",
            "name": "q",
            "schema": {
              "type": "string",
              "description": "Search query text snippet",
              "example": "gothic"
            },
            "required": true,
            "description": "Search query text snippet"
          },
          {
            "in": "query",
            "name": "keyStage",
            "schema": {
              "type": "string",
              "enum": [
                "ks1",
                "ks2",
                "ks3",
                "ks4"
              ],
              "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
              "example": "ks2"
            },
            "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "query",
            "name": "subject",
            "schema": {
              "type": "string",
              "enum": [
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
                "spanish"
              ],
              "description": "Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase",
              "example": "english"
            },
            "description": "Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"
          },
          {
            "in": "query",
            "name": "unit",
            "schema": {
              "type": "string",
              "description": "Optional unit slug to additionally filter by",
              "example": "Gothic poetry"
            },
            "description": "Optional unit slug to additionally filter by"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LessonSearchResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/units/{unit}/summary": {
      "get": {
        "operationId": "getUnits-getUnit",
        "summary": "Unit summary by slug",
        "description": "Use when you have a unit slug and need the unit summary: title, description, key stage, subject, year, threads, prior-knowledge requirements, national-curriculum statements, and the lessons inside. Unit variant slugs (ending in -1, -2, etc.) resolve to that specific variant.\n\nNot for: listing every unit in a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/units); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); units in a thread (GET /threads/{threadSlug}/units); lessons inside the unit (GET /key-stages/{keyStage}/subject/{subject}/lessons with unit={unit}).",
        "tags": [
          "units"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "unit",
            "schema": {
              "type": "string",
              "description": "The unit slug",
              "example": "programming-subroutines"
            },
            "required": true,
            "description": "The unit slug"
          },
          {
            "in": "query",
            "name": "examBoard",
            "schema": {
              "type": "string",
              "enum": [
                "aqa",
                "edexcel",
                "eduqas",
                "ocr",
                "wjec",
                "edexcelb"
              ],
              "example": "aqa"
            },
            "description": "Optional exam board slug to narrow the unit to a specific programme variant, e.g. 'aqa'."
          },
          {
            "in": "query",
            "name": "pathway",
            "schema": {
              "type": "string",
              "enum": [
                "core",
                "gcse"
              ]
            },
            "description": "Optional pathway slug to narrow the unit to a specific programme variant, e.g. 'gcse'."
          },
          {
            "in": "query",
            "name": "tier",
            "schema": {
              "type": "string",
              "enum": [
                "core",
                "foundation",
                "higher"
              ]
            },
            "description": "Optional tier slug to narrow the unit to a specific programme variant, e.g. 'foundation'."
          },
          {
            "in": "query",
            "name": "childSubject",
            "schema": {
              "type": "string",
              "enum": [
                "biology",
                "chemistry",
                "combined-science",
                "physics"
              ]
            },
            "description": "Optional science child subject slug to narrow the unit to a specific programme variant. Only available for science units, e.g. 'biology'."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UnitSummaryResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/threads": {
      "get": {
        "operationId": "getThreads-getAllThreads",
        "summary": "All threads",
        "description": "Use when you want the catalogue of every thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — making vertical connections across year groups. Returns all threads with published units, sorted alphabetically — each with title, slug, and unitCount.\n\nNot for: the units inside a thread (GET /threads/{threadSlug}/units).",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AllThreadsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/threads/{threadSlug}/units": {
      "get": {
        "operationId": "getThreads-getThreadUnits",
        "summary": "Units in a thread",
        "description": "Use when you want every unit in a thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — for example, number and place value or scientific method. Units in a thread span multiple programmes and key stages; thread order is independent of unit sequence order within any individual programme. Returns units in thread order with unitTitle, unitSlug, and unitOrder.\n\nNot for: the catalogue of threads (GET /threads); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /programmes/{programme}/units); a single unit (GET /units/{unit}/summary).\n\nExample: 'threadSlug=number-and-place-value'.",
        "tags": [
          "lists"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "parameters": [
          {
            "in": "path",
            "name": "threadSlug",
            "schema": {
              "type": "string",
              "description": "The thread identifier for a given unit",
              "example": "number-multiplication-and-division"
            },
            "required": true,
            "description": "The thread identifier for a given unit"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ThreadUnitsResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    },
    "/rate-limit": {
      "get": {
        "operationId": "getRateLimit-getRateLimit",
        "summary": "Current rate-limit status",
        "description": "Use when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the 'X-RateLimit-*' headers of every response, so this endpoint is rarely needed directly. Does not count against your quota.",
        "tags": [
          "internal"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RateLimitResponseSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.BAD_REQUEST"
                }
              }
            }
          },
          "401": {
            "description": "API token not provided or invalid",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.UNAUTHORIZED"
                }
              }
            }
          },
          "404": {
            "description": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/error.NOT_FOUND"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "SubjectSequenceResponseSchema": {
        "type": "object",
        "properties": {
          "sequenceSlug": {
            "type": "string",
            "description": "The unique identifier for each sequence",
            "example": "computing-secondary-core"
          },
          "years": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "description": "The years for which this subject has content available for",
            "example": [
              7,
              8,
              9,
              10,
              11
            ]
          },
          "keyStages": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "keyStageTitle": {
                  "type": "string",
                  "description": "The key stage title for the given key stage"
                },
                "keyStageSlug": {
                  "type": "string",
                  "description": "The unique identifier for a given key stage"
                }
              },
              "required": [
                "keyStageTitle",
                "keyStageSlug"
              ],
              "additionalProperties": false
            },
            "description": "The key stage slug identifiers for which this subject has content available for.",
            "example": [
              {
                "keyStageTitle": "Key Stage 3",
                "keyStageSlug": "ks3"
              },
              {
                "keyStageTitle": "Key Stage 4",
                "keyStageSlug": "ks4"
              }
            ]
          },
          "phaseSlug": {
            "type": "string",
            "description": "The unique identifier for the phase to which this sequence belongs",
            "example": "secondary"
          },
          "phaseTitle": {
            "type": "string",
            "description": "The title for the phase to which this sequence belongs",
            "example": "Secondary"
          },
          "ks4ProgrammeFactors": {
            "type": "object",
            "properties": {
              "examBoard": {
                "description": "The valid exam board values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "pathway": {
                "description": "The valid pathway values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "tier": {
                "description": "The valid tier values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "childSubject": {
                "description": "The child subjects offered by Oak for this subject at key stage 4 (e.g. biology, chemistry, physics and combined-science under science). Only present for Science, which is split into child subjects at KS4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "additionalProperties": false,
            "description": "The programme factors that apply to this subject at key stage 4, with the valid values for each factor.",
            "example": {
              "examBoard": [
                {
                  "title": "AQA",
                  "slug": "aqa"
                },
                {
                  "title": "Edexcel",
                  "slug": "edexcel"
                },
                {
                  "title": "OCR",
                  "slug": "ocr"
                }
              ],
              "pathway": [
                {
                  "title": "Core",
                  "slug": "core"
                }
              ],
              "tier": [
                {
                  "title": "Foundation",
                  "slug": "foundation"
                },
                {
                  "title": "Higher",
                  "slug": "higher"
                }
              ]
            }
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "sequenceSlug",
          "years",
          "keyStages",
          "phaseSlug",
          "phaseTitle",
          "ks4ProgrammeFactors"
        ],
        "additionalProperties": false,
        "example": {
          "sequenceSlug": "computing-secondary-core",
          "years": [
            7,
            8,
            9,
            10,
            11
          ],
          "keyStages": [
            {
              "keyStageTitle": "Key Stage 3",
              "keyStageSlug": "ks3"
            },
            {
              "keyStageTitle": "Key Stage 4",
              "keyStageSlug": "ks4"
            }
          ],
          "phaseSlug": "secondary",
          "phaseTitle": "Secondary",
          "ks4ProgrammeFactors": {
            "examBoard": [
              {
                "title": "AQA",
                "slug": "aqa"
              },
              {
                "title": "Edexcel",
                "slug": "edexcel"
              },
              {
                "title": "OCR",
                "slug": "ocr"
              }
            ],
            "pathway": [
              {
                "title": "Core",
                "slug": "core"
              }
            ],
            "tier": [
              {
                "title": "Foundation",
                "slug": "foundation"
              },
              {
                "title": "Higher",
                "slug": "higher"
              }
            ]
          }
        }
      },
      "error.BAD_REQUEST": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "The error message",
            "example": "Bad request - e.g. \"Content is blocked for copyright reasons\""
          },
          "code": {
            "type": "string",
            "description": "The error code",
            "example": "BAD_REQUEST"
          },
          "issues": {
            "description": "An array of issues that were responsible for the error",
            "example": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                }
              },
              "required": [
                "message"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "message",
          "code"
        ],
        "additionalProperties": false,
        "title": "Bad request - e.g. \"Content is blocked for copyright reasons\" error (400)",
        "description": "The error information",
        "example": {
          "code": "BAD_REQUEST",
          "message": "Bad request - e.g. \"Content is blocked for copyright reasons\"",
          "issues": []
        }
      },
      "error.UNAUTHORIZED": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "The error message",
            "example": "API token not provided or invalid"
          },
          "code": {
            "type": "string",
            "description": "The error code",
            "example": "UNAUTHORIZED"
          },
          "issues": {
            "description": "An array of issues that were responsible for the error",
            "example": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                }
              },
              "required": [
                "message"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "message",
          "code"
        ],
        "additionalProperties": false,
        "title": "API token not provided or invalid error (401)",
        "description": "The error information",
        "example": {
          "code": "UNAUTHORIZED",
          "message": "API token not provided or invalid",
          "issues": []
        }
      },
      "error.NOT_FOUND": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "The error message",
            "example": "Detail of the request causing the 404, e.g. \"Lesson not found\""
          },
          "code": {
            "type": "string",
            "description": "The error code",
            "example": "NOT_FOUND"
          },
          "issues": {
            "description": "An array of issues that were responsible for the error",
            "example": [],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string"
                }
              },
              "required": [
                "message"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "message",
          "code"
        ],
        "additionalProperties": false,
        "title": "Detail of the request causing the 404, e.g. \"Lesson not found\" error (404)",
        "description": "The error information",
        "example": {
          "code": "NOT_FOUND",
          "message": "Detail of the request causing the 404, e.g. \"Lesson not found\"",
          "issues": []
        }
      },
      "SequenceUnitsResponseSchema": {
        "type": "array",
        "items": {
          "anyOf": [
            {
              "type": "object",
              "properties": {
                "year": {
                  "anyOf": [
                    {
                      "type": "number"
                    },
                    {
                      "type": "string",
                      "const": "all-years"
                    }
                  ],
                  "description": "The year group"
                },
                "title": {
                  "type": "string",
                  "description": "An optional alternative title for the year sequence"
                },
                "units": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "unitTitle": {
                            "type": "string",
                            "description": "The title of the unit"
                          },
                          "unitOrder": {
                            "type": "number",
                            "description": "The position of the unit within the sequence."
                          },
                          "unitOptions": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "unitTitle": {
                                  "type": "string"
                                },
                                "unitSlug": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "unitTitle",
                                "unitSlug"
                              ],
                              "additionalProperties": false
                            },
                            "description": "The unique slug identifier for the unit"
                          },
                          "categories": {
                            "description": "The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "categoryTitle": {
                                  "type": "string",
                                  "description": "The title of the category"
                                },
                                "categorySlug": {
                                  "description": "The unique identifier for the category",
                                  "type": "string"
                                }
                              },
                              "required": [
                                "categoryTitle"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "threads": {
                            "description": "A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "threadTitle": {
                                  "type": "string",
                                  "description": "The title of the category"
                                },
                                "threadSlug": {
                                  "type": "string",
                                  "description": "The unique identifier for the thread"
                                },
                                "order": {
                                  "type": "number",
                                  "description": "Deprecated"
                                }
                              },
                              "required": [
                                "threadTitle",
                                "threadSlug",
                                "order"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "examBoards": {
                            "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "title": {
                                  "type": "string",
                                  "description": "The title of the exam board"
                                },
                                "slug": {
                                  "type": "string",
                                  "description": "The slug of the exam board"
                                }
                              },
                              "required": [
                                "title",
                                "slug"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "unitTitle",
                          "unitOrder",
                          "unitOptions"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "unitTitle": {
                            "type": "string"
                          },
                          "unitOrder": {
                            "type": "number"
                          },
                          "unitSlug": {
                            "type": "string",
                            "description": "The unique slug identifier for the unit"
                          },
                          "categories": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "categoryTitle": {
                                  "type": "string",
                                  "description": "The title of the category"
                                },
                                "categorySlug": {
                                  "description": "The unique identifier for the category",
                                  "type": "string"
                                }
                              },
                              "required": [
                                "categoryTitle"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "threads": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "threadTitle": {
                                  "type": "string",
                                  "description": "The title of the category"
                                },
                                "threadSlug": {
                                  "type": "string",
                                  "description": "The unique identifier for the thread"
                                },
                                "order": {
                                  "type": "number",
                                  "description": "Deprecated"
                                }
                              },
                              "required": [
                                "threadTitle",
                                "threadSlug",
                                "order"
                              ],
                              "additionalProperties": false
                            }
                          },
                          "examBoards": {
                            "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "title": {
                                  "type": "string",
                                  "description": "The title of the exam board"
                                },
                                "slug": {
                                  "type": "string",
                                  "description": "The slug of the exam board"
                                }
                              },
                              "required": [
                                "title",
                                "slug"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "unitTitle",
                          "unitOrder",
                          "unitSlug"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "description": "A list of units that make up a full sequence, grouped by year."
                },
                "oakUrl": {
                  "type": "string",
                  "format": "uri",
                  "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
                  "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
                }
              },
              "required": [
                "year",
                "units"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "year": {
                  "type": "number"
                },
                "title": {
                  "type": "string"
                },
                "examSubjects": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "examSubjectTitle": {
                            "type": "string"
                          },
                          "examSubjectSlug": {
                            "type": "string"
                          },
                          "tiers": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "tierTitle": {
                                  "type": "string",
                                  "description": "The title of the tier"
                                },
                                "tierSlug": {
                                  "type": "string",
                                  "description": "The tier identifier"
                                },
                                "units": {
                                  "type": "array",
                                  "items": {
                                    "anyOf": [
                                      {
                                        "type": "object",
                                        "properties": {
                                          "unitTitle": {
                                            "type": "string",
                                            "description": "The title of the unit"
                                          },
                                          "unitOrder": {
                                            "type": "number",
                                            "description": "The position of the unit within the sequence."
                                          },
                                          "unitOptions": {
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "unitTitle": {
                                                  "type": "string"
                                                },
                                                "unitSlug": {
                                                  "type": "string"
                                                }
                                              },
                                              "required": [
                                                "unitTitle",
                                                "unitSlug"
                                              ],
                                              "additionalProperties": false
                                            },
                                            "description": "The unique slug identifier for the unit"
                                          },
                                          "categories": {
                                            "description": "The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "categoryTitle": {
                                                  "type": "string",
                                                  "description": "The title of the category"
                                                },
                                                "categorySlug": {
                                                  "description": "The unique identifier for the category",
                                                  "type": "string"
                                                }
                                              },
                                              "required": [
                                                "categoryTitle"
                                              ],
                                              "additionalProperties": false
                                            }
                                          },
                                          "threads": {
                                            "description": "A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "threadTitle": {
                                                  "type": "string",
                                                  "description": "The title of the category"
                                                },
                                                "threadSlug": {
                                                  "type": "string",
                                                  "description": "The unique identifier for the thread"
                                                },
                                                "order": {
                                                  "type": "number",
                                                  "description": "Deprecated"
                                                }
                                              },
                                              "required": [
                                                "threadTitle",
                                                "threadSlug",
                                                "order"
                                              ],
                                              "additionalProperties": false
                                            }
                                          },
                                          "examBoards": {
                                            "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "title": {
                                                  "type": "string",
                                                  "description": "The title of the exam board"
                                                },
                                                "slug": {
                                                  "type": "string",
                                                  "description": "The slug of the exam board"
                                                }
                                              },
                                              "required": [
                                                "title",
                                                "slug"
                                              ],
                                              "additionalProperties": false
                                            }
                                          }
                                        },
                                        "required": [
                                          "unitTitle",
                                          "unitOrder",
                                          "unitOptions"
                                        ],
                                        "additionalProperties": false
                                      },
                                      {
                                        "type": "object",
                                        "properties": {
                                          "unitTitle": {
                                            "type": "string"
                                          },
                                          "unitOrder": {
                                            "type": "number"
                                          },
                                          "unitSlug": {
                                            "type": "string",
                                            "description": "The unique slug identifier for the unit"
                                          },
                                          "categories": {
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "categoryTitle": {
                                                  "type": "string",
                                                  "description": "The title of the category"
                                                },
                                                "categorySlug": {
                                                  "description": "The unique identifier for the category",
                                                  "type": "string"
                                                }
                                              },
                                              "required": [
                                                "categoryTitle"
                                              ],
                                              "additionalProperties": false
                                            }
                                          },
                                          "threads": {
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "threadTitle": {
                                                  "type": "string",
                                                  "description": "The title of the category"
                                                },
                                                "threadSlug": {
                                                  "type": "string",
                                                  "description": "The unique identifier for the thread"
                                                },
                                                "order": {
                                                  "type": "number",
                                                  "description": "Deprecated"
                                                }
                                              },
                                              "required": [
                                                "threadTitle",
                                                "threadSlug",
                                                "order"
                                              ],
                                              "additionalProperties": false
                                            }
                                          },
                                          "examBoards": {
                                            "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                            "type": "array",
                                            "items": {
                                              "type": "object",
                                              "properties": {
                                                "title": {
                                                  "type": "string",
                                                  "description": "The title of the exam board"
                                                },
                                                "slug": {
                                                  "type": "string",
                                                  "description": "The slug of the exam board"
                                                }
                                              },
                                              "required": [
                                                "title",
                                                "slug"
                                              ],
                                              "additionalProperties": false
                                            }
                                          }
                                        },
                                        "required": [
                                          "unitTitle",
                                          "unitOrder",
                                          "unitSlug"
                                        ],
                                        "additionalProperties": false
                                      }
                                    ]
                                  }
                                }
                              },
                              "required": [
                                "tierTitle",
                                "tierSlug",
                                "units"
                              ],
                              "additionalProperties": false
                            }
                          }
                        },
                        "required": [
                          "examSubjectTitle",
                          "tiers"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "examSubjectTitle": {
                            "type": "string"
                          },
                          "examSubjectSlug": {
                            "type": "string"
                          },
                          "units": {
                            "type": "array",
                            "items": {
                              "anyOf": [
                                {
                                  "type": "object",
                                  "properties": {
                                    "unitTitle": {
                                      "type": "string",
                                      "description": "The title of the unit"
                                    },
                                    "unitOrder": {
                                      "type": "number",
                                      "description": "The position of the unit within the sequence."
                                    },
                                    "unitOptions": {
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "unitTitle": {
                                            "type": "string"
                                          },
                                          "unitSlug": {
                                            "type": "string"
                                          }
                                        },
                                        "required": [
                                          "unitTitle",
                                          "unitSlug"
                                        ],
                                        "additionalProperties": false
                                      },
                                      "description": "The unique slug identifier for the unit"
                                    },
                                    "categories": {
                                      "description": "The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "categoryTitle": {
                                            "type": "string",
                                            "description": "The title of the category"
                                          },
                                          "categorySlug": {
                                            "description": "The unique identifier for the category",
                                            "type": "string"
                                          }
                                        },
                                        "required": [
                                          "categoryTitle"
                                        ],
                                        "additionalProperties": false
                                      }
                                    },
                                    "threads": {
                                      "description": "A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "threadTitle": {
                                            "type": "string",
                                            "description": "The title of the category"
                                          },
                                          "threadSlug": {
                                            "type": "string",
                                            "description": "The unique identifier for the thread"
                                          },
                                          "order": {
                                            "type": "number",
                                            "description": "Deprecated"
                                          }
                                        },
                                        "required": [
                                          "threadTitle",
                                          "threadSlug",
                                          "order"
                                        ],
                                        "additionalProperties": false
                                      }
                                    },
                                    "examBoards": {
                                      "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "title": {
                                            "type": "string",
                                            "description": "The title of the exam board"
                                          },
                                          "slug": {
                                            "type": "string",
                                            "description": "The slug of the exam board"
                                          }
                                        },
                                        "required": [
                                          "title",
                                          "slug"
                                        ],
                                        "additionalProperties": false
                                      }
                                    }
                                  },
                                  "required": [
                                    "unitTitle",
                                    "unitOrder",
                                    "unitOptions"
                                  ],
                                  "additionalProperties": false
                                },
                                {
                                  "type": "object",
                                  "properties": {
                                    "unitTitle": {
                                      "type": "string"
                                    },
                                    "unitOrder": {
                                      "type": "number"
                                    },
                                    "unitSlug": {
                                      "type": "string",
                                      "description": "The unique slug identifier for the unit"
                                    },
                                    "categories": {
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "categoryTitle": {
                                            "type": "string",
                                            "description": "The title of the category"
                                          },
                                          "categorySlug": {
                                            "description": "The unique identifier for the category",
                                            "type": "string"
                                          }
                                        },
                                        "required": [
                                          "categoryTitle"
                                        ],
                                        "additionalProperties": false
                                      }
                                    },
                                    "threads": {
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "threadTitle": {
                                            "type": "string",
                                            "description": "The title of the category"
                                          },
                                          "threadSlug": {
                                            "type": "string",
                                            "description": "The unique identifier for the thread"
                                          },
                                          "order": {
                                            "type": "number",
                                            "description": "Deprecated"
                                          }
                                        },
                                        "required": [
                                          "threadTitle",
                                          "threadSlug",
                                          "order"
                                        ],
                                        "additionalProperties": false
                                      }
                                    },
                                    "examBoards": {
                                      "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                      "type": "array",
                                      "items": {
                                        "type": "object",
                                        "properties": {
                                          "title": {
                                            "type": "string",
                                            "description": "The title of the exam board"
                                          },
                                          "slug": {
                                            "type": "string",
                                            "description": "The slug of the exam board"
                                          }
                                        },
                                        "required": [
                                          "title",
                                          "slug"
                                        ],
                                        "additionalProperties": false
                                      }
                                    }
                                  },
                                  "required": [
                                    "unitTitle",
                                    "unitOrder",
                                    "unitSlug"
                                  ],
                                  "additionalProperties": false
                                }
                              ]
                            }
                          }
                        },
                        "required": [
                          "examSubjectTitle",
                          "units"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "description": "Only used in secondary science. Contains a full year's unit sequences based on which subject is being studied at KS4."
                },
                "oakUrl": {
                  "type": "string",
                  "format": "uri",
                  "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
                  "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
                }
              },
              "required": [
                "year",
                "examSubjects"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "year": {
                  "type": "number"
                },
                "title": {
                  "type": "string"
                },
                "tiers": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "tierTitle": {
                        "type": "string",
                        "description": "The title of the tier"
                      },
                      "tierSlug": {
                        "type": "string",
                        "description": "The tier identifier"
                      },
                      "units": {
                        "type": "array",
                        "items": {
                          "anyOf": [
                            {
                              "type": "object",
                              "properties": {
                                "unitTitle": {
                                  "type": "string",
                                  "description": "The title of the unit"
                                },
                                "unitOrder": {
                                  "type": "number",
                                  "description": "The position of the unit within the sequence."
                                },
                                "unitOptions": {
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "unitTitle": {
                                        "type": "string"
                                      },
                                      "unitSlug": {
                                        "type": "string"
                                      }
                                    },
                                    "required": [
                                      "unitTitle",
                                      "unitSlug"
                                    ],
                                    "additionalProperties": false
                                  },
                                  "description": "The unique slug identifier for the unit"
                                },
                                "categories": {
                                  "description": "The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "categoryTitle": {
                                        "type": "string",
                                        "description": "The title of the category"
                                      },
                                      "categorySlug": {
                                        "description": "The unique identifier for the category",
                                        "type": "string"
                                      }
                                    },
                                    "required": [
                                      "categoryTitle"
                                    ],
                                    "additionalProperties": false
                                  }
                                },
                                "threads": {
                                  "description": "A list of threads (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted.",
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "threadTitle": {
                                        "type": "string",
                                        "description": "The title of the category"
                                      },
                                      "threadSlug": {
                                        "type": "string",
                                        "description": "The unique identifier for the thread"
                                      },
                                      "order": {
                                        "type": "number",
                                        "description": "Deprecated"
                                      }
                                    },
                                    "required": [
                                      "threadTitle",
                                      "threadSlug",
                                      "order"
                                    ],
                                    "additionalProperties": false
                                  }
                                },
                                "examBoards": {
                                  "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "title": {
                                        "type": "string",
                                        "description": "The title of the exam board"
                                      },
                                      "slug": {
                                        "type": "string",
                                        "description": "The slug of the exam board"
                                      }
                                    },
                                    "required": [
                                      "title",
                                      "slug"
                                    ],
                                    "additionalProperties": false
                                  }
                                }
                              },
                              "required": [
                                "unitTitle",
                                "unitOrder",
                                "unitOptions"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "unitTitle": {
                                  "type": "string"
                                },
                                "unitOrder": {
                                  "type": "number"
                                },
                                "unitSlug": {
                                  "type": "string",
                                  "description": "The unique slug identifier for the unit"
                                },
                                "categories": {
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "categoryTitle": {
                                        "type": "string",
                                        "description": "The title of the category"
                                      },
                                      "categorySlug": {
                                        "description": "The unique identifier for the category",
                                        "type": "string"
                                      }
                                    },
                                    "required": [
                                      "categoryTitle"
                                    ],
                                    "additionalProperties": false
                                  }
                                },
                                "threads": {
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "threadTitle": {
                                        "type": "string",
                                        "description": "The title of the category"
                                      },
                                      "threadSlug": {
                                        "type": "string",
                                        "description": "The unique identifier for the thread"
                                      },
                                      "order": {
                                        "type": "number",
                                        "description": "Deprecated"
                                      }
                                    },
                                    "required": [
                                      "threadTitle",
                                      "threadSlug",
                                      "order"
                                    ],
                                    "additionalProperties": false
                                  }
                                },
                                "examBoards": {
                                  "description": "The exam boards the unit appears in. Only populated when the sequence is requested without an exam board (e.g. `science-secondary` rather than `science-secondary-aqa`).",
                                  "type": "array",
                                  "items": {
                                    "type": "object",
                                    "properties": {
                                      "title": {
                                        "type": "string",
                                        "description": "The title of the exam board"
                                      },
                                      "slug": {
                                        "type": "string",
                                        "description": "The slug of the exam board"
                                      }
                                    },
                                    "required": [
                                      "title",
                                      "slug"
                                    ],
                                    "additionalProperties": false
                                  }
                                }
                              },
                              "required": [
                                "unitTitle",
                                "unitOrder",
                                "unitSlug"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "tierTitle",
                      "tierSlug",
                      "units"
                    ],
                    "additionalProperties": false
                  }
                },
                "oakUrl": {
                  "type": "string",
                  "format": "uri",
                  "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
                  "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
                }
              },
              "required": [
                "year",
                "tiers"
              ],
              "additionalProperties": false
            }
          ]
        },
        "example": [
          {
            "year": 1,
            "units": [
              {
                "unitTitle": "Speaking and Listening",
                "unitOrder": 1,
                "unitSlug": "speaking-and-listening",
                "categories": [
                  {
                    "categoryTitle": "Reading, writing & oracy"
                  }
                ],
                "threads": [
                  {
                    "threadTitle": "Developing spoken language",
                    "threadSlug": "developing-spoken-language",
                    "order": 8
                  }
                ]
              }
            ]
          }
        ]
      },
      "TranscriptResponseSchema": {
        "type": "object",
        "properties": {
          "transcript": {
            "type": "string",
            "description": "The transcript for the lesson video",
            "example": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today..."
          },
          "vtt": {
            "type": "string",
            "description": "The contents of the .vtt file for the lesson video, which maps captions to video timestamps.",
            "example": "WEBVTT\n\n1\n00:00:06.300 --> 00:00:08.070\n<v ->Hello, I'm Mrs. Lashley.</v>\n\n2\n00:00:08.070 --> 00:00:09.240\nI'm looking forward to guiding you\n\n3\n00:00:09.240 --> 00:00:10.980\nthrough your learning today..."
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "transcript",
          "vtt"
        ],
        "additionalProperties": false,
        "example": {
          "transcript": "Hello, I'm Mrs. Lashley. I'm looking forward to guiding you through your learning today...",
          "vtt": "WEBVTT\n\n1\n00:00:06.300 --> 00:00:08.070\n<v ->Hello, I'm Mrs. Lashley.</v>\n\n2\n00:00:08.070 --> 00:00:09.240\nI'm looking forward to guiding you\n\n3\n00:00:09.240 --> 00:00:10.980\nthrough your learning today..."
        }
      },
      "SearchTranscriptResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonTitle": {
              "type": "string",
              "description": "The lesson title",
              "example": "The Roman invasion of Britain "
            },
            "lessonSlug": {
              "type": "string",
              "description": "The lesson slug identifier",
              "example": "the-roman-invasion-of-britain"
            },
            "transcriptSnippet": {
              "example": "The Romans were ready,",
              "type": "string",
              "description": "The snippet of the transcript that matched the search term"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonTitle",
            "lessonSlug"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonTitle": "The Roman invasion of Britain ",
            "lessonSlug": "the-roman-invasion-of-britain",
            "transcriptSnippet": "The Romans were ready,"
          },
          {
            "lessonTitle": "The changes to life brought about by Roman settlement",
            "lessonSlug": "the-changes-to-life-brought-about-by-roman-settlement",
            "transcriptSnippet": "when the Romans came."
          },
          {
            "lessonTitle": "Boudica's rebellion against Roman rule",
            "lessonSlug": "boudicas-rebellion-against-roman-rule",
            "transcriptSnippet": "kings who resisted the Romans were,"
          },
          {
            "lessonTitle": "How far religion changed under Roman rule",
            "lessonSlug": "how-far-religion-changed-under-roman-rule",
            "transcriptSnippet": "for the Romans."
          }
        ]
      },
      "SequenceAssetsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The unique slug identifier for the lesson"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title for the lesson"
            },
            "attribution": {
              "description": "Licence information for any third-party content contained in the lessons' downloadable resources",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "assets": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "slideDeck",
                      "exitQuiz",
                      "exitQuizAnswers",
                      "starterQuiz",
                      "starterQuizAnswers",
                      "supplementaryResource",
                      "video",
                      "worksheet",
                      "worksheetAnswers"
                    ],
                    "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
                    "example": "slideDeck"
                  },
                  "label": {
                    "type": "string",
                    "description": "The label for the asset"
                  },
                  "url": {
                    "type": "string",
                    "description": "The download endpoint for the asset."
                  }
                },
                "required": [
                  "type",
                  "label",
                  "url"
                ],
                "additionalProperties": false
              },
              "description": "List of assets"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "assets"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonSlug": "using-numerals",
            "lessonTitle": "Using numerals",
            "assets": [
              {
                "label": "Worksheet",
                "type": "worksheet",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
              },
              {
                "label": "Worksheet Answers",
                "type": "worksheetAnswers",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
              },
              {
                "label": "Video",
                "type": "video",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
              }
            ]
          }
        ]
      },
      "SubjectAssetsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The unique slug identifier for the lesson"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title for the lesson"
            },
            "attribution": {
              "description": "Licence information for any third-party content contained in the lessons' downloadable resources",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "assets": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "slideDeck",
                      "exitQuiz",
                      "exitQuizAnswers",
                      "starterQuiz",
                      "starterQuizAnswers",
                      "supplementaryResource",
                      "video",
                      "worksheet",
                      "worksheetAnswers"
                    ],
                    "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
                    "example": "slideDeck"
                  },
                  "label": {
                    "type": "string",
                    "description": "The label for the asset"
                  },
                  "url": {
                    "type": "string",
                    "description": "The download endpoint for the asset."
                  }
                },
                "required": [
                  "type",
                  "label",
                  "url"
                ],
                "additionalProperties": false
              },
              "description": "List of assets"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "assets"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonSlug": "using-numerals",
            "lessonTitle": "Using numerals",
            "assets": [
              {
                "label": "Worksheet",
                "type": "worksheet",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
              },
              {
                "label": "Worksheet Answers",
                "type": "worksheetAnswers",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
              },
              {
                "label": "Video",
                "type": "video",
                "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
              }
            ]
          }
        ]
      },
      "LessonAssetsResponseSchema": {
        "type": "object",
        "properties": {
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak National URL for the lesson"
          },
          "attribution": {
            "description": "Licence information for any third-party content contained in the lessons' downloadable resources",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "assets": {
            "description": "List of assets",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "slideDeck",
                    "exitQuiz",
                    "exitQuizAnswers",
                    "starterQuiz",
                    "starterQuizAnswers",
                    "supplementaryResource",
                    "video",
                    "worksheet",
                    "worksheetAnswers"
                  ],
                  "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
                  "example": "slideDeck"
                },
                "label": {
                  "type": "string",
                  "description": "The label for the asset"
                },
                "url": {
                  "type": "string",
                  "description": "The download endpoint for the asset."
                }
              },
              "required": [
                "type",
                "label",
                "url"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "oakUrl"
        ],
        "additionalProperties": false,
        "example": {
          "oakUrl": "https://www.thenational.academy/teachers/lessons/using-numerals",
          "attribution": [
            "Copyright XYZ Authors",
            "Creative Commons Attribution Example 4.0"
          ],
          "assets": [
            {
              "label": "Worksheet",
              "type": "worksheet",
              "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet"
            },
            {
              "label": "Worksheet Answers",
              "type": "worksheetAnswers",
              "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheetAnswers"
            },
            {
              "label": "Video",
              "type": "video",
              "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/video"
            }
          ]
        }
      },
      "ProgrammeAssetsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The unique slug identifier for the lesson"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title for the lesson"
            },
            "attribution": {
              "description": "Licence information for any third-party content contained in the lessons' downloadable resources",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "assets": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "slideDeck",
                      "exitQuiz",
                      "exitQuizAnswers",
                      "starterQuiz",
                      "starterQuizAnswers",
                      "supplementaryResource",
                      "video",
                      "worksheet",
                      "worksheetAnswers"
                    ],
                    "description": "Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint",
                    "example": "slideDeck"
                  },
                  "label": {
                    "type": "string",
                    "description": "The label for the asset"
                  },
                  "url": {
                    "type": "string",
                    "description": "The download endpoint for the asset."
                  }
                },
                "required": [
                  "type",
                  "label",
                  "url"
                ],
                "additionalProperties": false
              },
              "description": "List of assets"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "assets"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonSlug": "variables-and-data-types",
            "lessonTitle": "Variables and data types",
            "assets": [
              {
                "label": "Worksheet",
                "type": "worksheet",
                "url": "https://open-api.thenational.academy/api/v0/lessons/variables-and-data-types/assets/worksheet"
              },
              {
                "label": "Slide Deck",
                "type": "slideDeck",
                "url": "https://open-api.thenational.academy/api/v0/lessons/variables-and-data-types/assets/slideDeck"
              }
            ]
          }
        ]
      },
      "LessonAssetResponseSchema": {
        "example": {}
      },
      "AllSubjectsResponseSchema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
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
            "spanish"
          ]
        },
        "example": [
          "art",
          "computing",
          "english"
        ]
      },
      "SubjectResponseSchema": {
        "type": "object",
        "properties": {
          "subjectTitle": {
            "type": "string",
            "description": "The subject title"
          },
          "subjectSlug": {
            "type": "string",
            "description": "The subject slug identifier"
          },
          "sequenceSlugs": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "sequenceSlug": {
                  "type": "string",
                  "description": "The unique identifier for each sequence"
                },
                "years": {
                  "type": "array",
                  "items": {
                    "type": "number"
                  },
                  "description": "The years for which this subject has content available for"
                },
                "keyStages": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "keyStageTitle": {
                        "type": "string",
                        "description": "The key stage title for the given key stage"
                      },
                      "keyStageSlug": {
                        "type": "string",
                        "description": "The unique identifier for a given key stage"
                      }
                    },
                    "required": [
                      "keyStageTitle",
                      "keyStageSlug"
                    ],
                    "additionalProperties": false
                  },
                  "description": "The key stage slug identifiers for which this subject has content available for."
                },
                "phaseSlug": {
                  "type": "string",
                  "description": "The unique identifier for the phase to which this sequence belongs"
                },
                "phaseTitle": {
                  "type": "string",
                  "description": "The title for the phase to which this sequence belongs"
                }
              },
              "required": [
                "sequenceSlug",
                "years",
                "keyStages",
                "phaseSlug",
                "phaseTitle"
              ],
              "additionalProperties": false
            },
            "description": "Information about the years, key stages and key stage 4 variance for each sequence"
          },
          "years": {
            "type": "array",
            "items": {
              "type": "number"
            },
            "description": "The years for which this subject has content available for"
          },
          "keyStages": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "keyStageTitle": {
                  "type": "string",
                  "description": "The key stage title for the given key stage"
                },
                "keyStageSlug": {
                  "type": "string",
                  "description": "The unique identifier for a given key stage"
                }
              },
              "required": [
                "keyStageTitle",
                "keyStageSlug"
              ],
              "additionalProperties": false
            },
            "description": "The key stage slug identifiers for which this subject has content available for."
          },
          "ks4ProgrammeFactors": {
            "type": "object",
            "properties": {
              "examBoard": {
                "description": "The valid exam board values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "pathway": {
                "description": "The valid pathway values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "tier": {
                "description": "The valid tier values offered by Oak for this subject at key stage 4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              },
              "childSubject": {
                "description": "The child subjects offered by Oak for this subject at key stage 4 (e.g. biology, chemistry, physics and combined-science under science). Only present for Science, which is split into child subjects at KS4.",
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "description": "The display title for a valid programme factor value"
                    },
                    "slug": {
                      "type": "string",
                      "description": "The slug identifier for a valid programme factor value"
                    }
                  },
                  "required": [
                    "title",
                    "slug"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "additionalProperties": false,
            "description": "The programme factors that apply to this subject at key stage 4, with the valid values for each factor."
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "subjectTitle",
          "subjectSlug",
          "sequenceSlugs",
          "years",
          "keyStages",
          "ks4ProgrammeFactors"
        ],
        "additionalProperties": false,
        "example": {
          "subjectTitle": "Science",
          "subjectSlug": "science",
          "sequenceSlugs": [
            {
              "sequenceSlug": "science-primary",
              "years": [
                1,
                2,
                3,
                4,
                5,
                6
              ],
              "keyStages": [
                {
                  "keyStageTitle": "Key Stage 1",
                  "keyStageSlug": "ks1"
                },
                {
                  "keyStageTitle": "Key Stage 2",
                  "keyStageSlug": "ks2"
                }
              ],
              "phaseSlug": "primary",
              "phaseTitle": "Primary"
            },
            {
              "sequenceSlug": "science-secondary-aqa",
              "years": [
                7,
                8,
                9,
                10,
                11
              ],
              "keyStages": [
                {
                  "keyStageTitle": "Key Stage 3",
                  "keyStageSlug": "ks3"
                },
                {
                  "keyStageTitle": "Key Stage 4",
                  "keyStageSlug": "ks4"
                }
              ],
              "phaseSlug": "secondary",
              "phaseTitle": "Secondary"
            },
            {
              "sequenceSlug": "science-secondary-edexcel",
              "years": [
                7,
                8,
                9,
                10,
                11
              ],
              "keyStages": [
                {
                  "keyStageTitle": "Key Stage 3",
                  "keyStageSlug": "ks3"
                },
                {
                  "keyStageTitle": "Key Stage 4",
                  "keyStageSlug": "ks4"
                }
              ],
              "phaseSlug": "secondary",
              "phaseTitle": "Secondary"
            },
            {
              "sequenceSlug": "science-secondary-ocr",
              "years": [
                7,
                8,
                9,
                10,
                11
              ],
              "keyStages": [
                {
                  "keyStageTitle": "Key Stage 3",
                  "keyStageSlug": "ks3"
                },
                {
                  "keyStageTitle": "Key Stage 4",
                  "keyStageSlug": "ks4"
                }
              ],
              "phaseSlug": "secondary",
              "phaseTitle": "Secondary"
            }
          ],
          "years": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
          ],
          "keyStages": [
            {
              "keyStageTitle": "Key Stage 1",
              "keyStageSlug": "ks1"
            },
            {
              "keyStageTitle": "Key Stage 2",
              "keyStageSlug": "ks2"
            },
            {
              "keyStageTitle": "Key Stage 3",
              "keyStageSlug": "ks3"
            },
            {
              "keyStageTitle": "Key Stage 4",
              "keyStageSlug": "ks4"
            }
          ],
          "ks4ProgrammeFactors": {
            "examBoard": [
              {
                "title": "AQA",
                "slug": "aqa"
              },
              {
                "title": "Edexcel",
                "slug": "edexcel"
              },
              {
                "title": "OCR",
                "slug": "ocr"
              }
            ],
            "tier": [
              {
                "title": "Foundation",
                "slug": "foundation"
              },
              {
                "title": "Higher",
                "slug": "higher"
              }
            ],
            "childSubject": [
              {
                "title": "Biology",
                "slug": "biology"
              },
              {
                "title": "Chemistry",
                "slug": "chemistry"
              },
              {
                "title": "Combined science",
                "slug": "combined-science"
              },
              {
                "title": "Physics",
                "slug": "physics"
              }
            ]
          }
        }
      },
      "SubjectKeyStagesResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "keyStageTitle": {
              "type": "string",
              "description": "The key stage title for the given key stage"
            },
            "keyStageSlug": {
              "type": "string",
              "description": "The unique identifier for a given key stage"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "keyStageTitle",
            "keyStageSlug"
          ],
          "additionalProperties": false
        },
        "description": "The key stage slug identifiers for which this subject has content available for",
        "example": [
          {
            "keyStageTitle": "Key Stage 1",
            "keyStageSlug": "ks1"
          },
          {
            "keyStageTitle": "Key Stage 2",
            "keyStageSlug": "ks2"
          },
          {
            "keyStageTitle": "Key Stage 3",
            "keyStageSlug": "ks3"
          },
          {
            "keyStageTitle": "Key Stage 4",
            "keyStageSlug": "ks4"
          }
        ]
      },
      "SubjectYearsResponseSchema": {
        "type": "array",
        "items": {
          "type": "number"
        },
        "description": "The years for which this sequence has content available for",
        "example": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ]
      },
      "KeyStageResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "slug": {
              "type": "string",
              "description": "The key stage slug identifier",
              "example": "ks1"
            },
            "title": {
              "type": "string",
              "description": "The key stage title",
              "example": "Key Stage 1"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "slug",
            "title"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "slug": "ks1",
            "title": "Key Stage 1"
          }
        ]
      },
      "KeyStageSubjectLessonsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "unitSlug": {
              "type": "string",
              "description": "The unit slug identifier",
              "example": "simple-compound-and-adverbial-complex-sentences"
            },
            "unitTitle": {
              "type": "string",
              "description": "The unit title",
              "example": "Simple, compound and adverbial complex sentences"
            },
            "lessons": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "lessonSlug": {
                    "type": "string",
                    "description": "The lesson slug identifier",
                    "example": "four-types-of-simple-sentence"
                  },
                  "lessonTitle": {
                    "type": "string",
                    "description": "The lesson title",
                    "example": "Four types of simple sentence"
                  }
                },
                "required": [
                  "lessonSlug",
                  "lessonTitle"
                ],
                "additionalProperties": false
              },
              "description": "List of lessons for the specified unit",
              "example": [
                {
                  "lessonSlug": "four-types-of-simple-sentence",
                  "lessonTitle": "Four types of simple sentence"
                },
                {
                  "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
                  "lessonTitle": "Three ways for co-ordination in compound sentences"
                }
              ]
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "unitSlug",
            "unitTitle",
            "lessons"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "unitSlug": "simple-compound-and-adverbial-complex-sentences",
            "unitTitle": "Simple, compound and adverbial complex sentences",
            "lessons": [
              {
                "lessonSlug": "four-types-of-simple-sentence",
                "lessonTitle": "Four types of simple sentence"
              },
              {
                "lessonSlug": "three-ways-for-co-ordination-in-compound-sentences",
                "lessonTitle": "Three ways for co-ordination in compound sentences"
              }
            ]
          }
        ]
      },
      "AllKeyStageAndSubjectUnitsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "yearSlug": {
              "type": "string",
              "description": "The year identifier",
              "example": "year-3"
            },
            "yearTitle": {
              "type": "string",
              "description": "The year title",
              "example": "Year 3"
            },
            "units": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "unitSlug": {
                    "type": "string",
                    "description": "The unit slug identifier",
                    "example": "2-4-and-8-times-tables-using-times-tables-to-solve-problems"
                  },
                  "unitTitle": {
                    "type": "string",
                    "description": "The unit title",
                    "example": "2, 4 and 8 times tables: using times tables to solve problems"
                  },
                  "examBoards": {
                    "description": "The exam boards the unit appears in. Only populated for KS4 subjects when the request does not supply an `examBoard` filter.",
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "description": "The title of the exam board"
                        },
                        "slug": {
                          "type": "string",
                          "description": "The slug of the exam board"
                        }
                      },
                      "required": [
                        "title",
                        "slug"
                      ],
                      "additionalProperties": false
                    }
                  }
                },
                "required": [
                  "unitSlug",
                  "unitTitle"
                ],
                "additionalProperties": false
              },
              "description": "List of units for the specified year",
              "example": [
                {
                  "unitSlug": "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
                  "unitTitle": "2, 4 and 8 times tables: using times tables to solve problems"
                },
                {
                  "unitSlug": "bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10",
                  "unitTitle": "Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10"
                }
              ]
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "yearSlug",
            "yearTitle",
            "units"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "units": [
              {
                "unitSlug": "2-4-and-8-times-tables-using-times-tables-to-solve-problems",
                "unitTitle": "2, 4 and 8 times tables: using times tables to solve problems"
              },
              {
                "unitSlug": "bridging-100-counting-on-and-back-in-10s-adding-subtracting-multiples-of-10",
                "unitTitle": "Bridging 100: counting on and back in 10s, adding/subtracting multiples of 10"
              }
            ],
            "yearSlug": "year-3",
            "yearTitle": "Year 3"
          }
        ]
      },
      "SubjectProgrammesResponseSchema": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "example": [
          "english-secondary-year-7",
          "english-secondary-year-8",
          "english-secondary-year-9",
          "english-secondary-year-10-aqa",
          "english-secondary-year-10-edexcel",
          "english-secondary-year-10-eduqas",
          "english-secondary-year-11-aqa",
          "english-secondary-year-11-edexcel",
          "english-secondary-year-11-eduqas"
        ]
      },
      "ProgrammeResponseSchema": {
        "type": "object",
        "properties": {
          "examboardSlug": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "examboardTitle": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "keystageSlug": {
            "type": "string"
          },
          "keystageTitle": {
            "type": "string"
          },
          "pathwaySlug": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "pathwayTitle": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "phaseSlug": {
            "type": "string"
          },
          "phaseTitle": {
            "type": "string"
          },
          "subjectSlug": {
            "type": "string"
          },
          "subjectTitle": {
            "type": "string"
          },
          "tierSlug": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "tierTitle": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "yearSlug": {
            "type": "string"
          },
          "yearTitle": {
            "type": "string"
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "examboardSlug",
          "examboardTitle",
          "keystageSlug",
          "keystageTitle",
          "pathwaySlug",
          "pathwayTitle",
          "phaseSlug",
          "phaseTitle",
          "subjectSlug",
          "subjectTitle",
          "tierSlug",
          "tierTitle",
          "yearSlug",
          "yearTitle"
        ],
        "additionalProperties": false,
        "example": {
          "examboardSlug": "aqa",
          "examboardTitle": "AQA",
          "keystageSlug": "ks4",
          "keystageTitle": "Key Stage 4",
          "pathwaySlug": null,
          "pathwayTitle": null,
          "phaseSlug": "secondary",
          "phaseTitle": "Secondary",
          "subjectSlug": "computing",
          "subjectTitle": "Computing",
          "tierSlug": null,
          "tierTitle": null,
          "yearSlug": "year-10",
          "yearTitle": "Year 10"
        }
      },
      "ProgrammeUnitsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "unitSlug": {
              "type": "string",
              "description": "The unit slug identifier",
              "example": "variables-and-data-types"
            },
            "unitTitle": {
              "type": "string",
              "description": "The unit title",
              "example": "Variables and data types"
            },
            "unitOrder": {
              "type": "number",
              "description": "The unit order within the programme",
              "example": 1
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "unitSlug",
            "unitTitle",
            "unitOrder"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "unitSlug": "variables-and-data-types",
            "unitTitle": "Variables and data types",
            "unitOrder": 1
          },
          {
            "unitSlug": "algorithms",
            "unitTitle": "Algorithms",
            "unitOrder": 2
          }
        ]
      },
      "KeywordsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "keyword": {
              "type": "string",
              "description": "The keyword text",
              "example": "animate"
            },
            "description": {
              "type": "string",
              "description": "A description of the keyword",
              "example": "to make something move or change its appearance"
            },
            "keyStageSlug": {
              "type": "string",
              "description": "The key stage slug associated with the keyword",
              "example": "ks2"
            },
            "subjectSlug": {
              "type": "string",
              "description": "The subject slug associated with the keyword",
              "example": "computing"
            },
            "lessonSlugs": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "The different lesson slugs where this keyword is used",
              "example": [
                "animating-text"
              ]
            }
          },
          "required": [
            "keyword",
            "description",
            "keyStageSlug",
            "subjectSlug",
            "lessonSlugs"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "keyword": "animate",
            "description": "to make something move or change its appearance",
            "keyStageSlug": "ks2",
            "subjectSlug": "computing",
            "lessonSlugs": [
              "animating-text"
            ]
          },
          {
            "keyword": "animation",
            "description": "a way of making pictures or objects look as if they are moving by showing them quickly one after another",
            "keyStageSlug": "ks2",
            "subjectSlug": "computing",
            "lessonSlugs": [
              "introduction-to-animation",
              "programming-using-command-blocks"
            ]
          }
        ]
      },
      "QuestionForLessonsResponseSchema": {
        "type": "object",
        "properties": {
          "starterQuiz": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "multiple-choice"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "oneOf": [
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              },
                              "distractor": {
                                "type": "boolean",
                                "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                              }
                            },
                            "required": [
                              "type",
                              "content",
                              "distractor"
                            ],
                            "additionalProperties": false
                          },
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "image"
                              },
                              "content": {
                                "type": "object",
                                "properties": {
                                  "url": {
                                    "type": "string"
                                  },
                                  "width": {
                                    "type": "number"
                                  },
                                  "height": {
                                    "type": "number"
                                  },
                                  "alt": {
                                    "type": "string"
                                  },
                                  "text": {
                                    "type": "string",
                                    "description": "Supplementary text for the image, if any"
                                  },
                                  "attribution": {
                                    "type": "string"
                                  }
                                },
                                "required": [
                                  "url",
                                  "width",
                                  "height"
                                ],
                                "additionalProperties": false
                              },
                              "distractor": {
                                "type": "boolean",
                                "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                              }
                            },
                            "required": [
                              "type",
                              "content",
                              "distractor"
                            ],
                            "additionalProperties": false
                          }
                        ],
                        "type": "object"
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "short-answer"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "type": {
                            "type": "string",
                            "const": "text",
                            "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                          },
                          "content": {
                            "type": "string",
                            "description": "Quiz question answer"
                          }
                        },
                        "required": [
                          "type",
                          "content"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "match"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "matchOption": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false,
                            "description": "Matching options (LHS)"
                          },
                          "correctChoice": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false,
                            "description": "Matching options (RHS), indicating the correct choice"
                          }
                        },
                        "required": [
                          "matchOption",
                          "correctChoice"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "order"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "allOf": [
                          {
                            "type": "object",
                            "properties": {
                              "order": {
                                "type": "number",
                                "description": "Indicates the correct ordering of the response"
                              }
                            },
                            "required": [
                              "order"
                            ],
                            "additionalProperties": false
                          },
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false
                          }
                        ]
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                }
              ],
              "type": "object"
            },
            "description": "The starter quiz questions - which test prior knowledge",
            "example": [
              {
                "question": "Tick the sentence with the correct punctuation.",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "the baby cried"
                  },
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "The baby cried"
                  },
                  {
                    "distractor": false,
                    "type": "text",
                    "content": "The baby cried."
                  },
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "the baby cried."
                  }
                ]
              }
            ]
          },
          "exitQuiz": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "multiple-choice"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "oneOf": [
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              },
                              "distractor": {
                                "type": "boolean",
                                "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                              }
                            },
                            "required": [
                              "type",
                              "content",
                              "distractor"
                            ],
                            "additionalProperties": false
                          },
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "image"
                              },
                              "content": {
                                "type": "object",
                                "properties": {
                                  "url": {
                                    "type": "string"
                                  },
                                  "width": {
                                    "type": "number"
                                  },
                                  "height": {
                                    "type": "number"
                                  },
                                  "alt": {
                                    "type": "string"
                                  },
                                  "text": {
                                    "type": "string",
                                    "description": "Supplementary text for the image, if any"
                                  },
                                  "attribution": {
                                    "type": "string"
                                  }
                                },
                                "required": [
                                  "url",
                                  "width",
                                  "height"
                                ],
                                "additionalProperties": false
                              },
                              "distractor": {
                                "type": "boolean",
                                "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                              }
                            },
                            "required": [
                              "type",
                              "content",
                              "distractor"
                            ],
                            "additionalProperties": false
                          }
                        ],
                        "type": "object"
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "short-answer"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "type": {
                            "type": "string",
                            "const": "text",
                            "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                          },
                          "content": {
                            "type": "string",
                            "description": "Quiz question answer"
                          }
                        },
                        "required": [
                          "type",
                          "content"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "match"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "matchOption": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false,
                            "description": "Matching options (LHS)"
                          },
                          "correctChoice": {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false,
                            "description": "Matching options (RHS), indicating the correct choice"
                          }
                        },
                        "required": [
                          "matchOption",
                          "correctChoice"
                        ],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                },
                {
                  "type": "object",
                  "properties": {
                    "question": {
                      "type": "string",
                      "description": "The question text"
                    },
                    "questionType": {
                      "type": "string",
                      "const": "order"
                    },
                    "questionImage": {
                      "type": "object",
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "alt": {
                          "type": "string"
                        },
                        "text": {
                          "type": "string",
                          "description": "Supplementary text for the image, if any"
                        },
                        "attribution": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ],
                      "additionalProperties": false
                    },
                    "answers": {
                      "type": "array",
                      "items": {
                        "allOf": [
                          {
                            "type": "object",
                            "properties": {
                              "order": {
                                "type": "number",
                                "description": "Indicates the correct ordering of the response"
                              }
                            },
                            "required": [
                              "order"
                            ],
                            "additionalProperties": false
                          },
                          {
                            "type": "object",
                            "properties": {
                              "type": {
                                "type": "string",
                                "const": "text",
                                "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                              },
                              "content": {
                                "type": "string",
                                "description": "Quiz question answer"
                              }
                            },
                            "required": [
                              "type",
                              "content"
                            ],
                            "additionalProperties": false
                          }
                        ]
                      }
                    }
                  },
                  "required": [
                    "question",
                    "questionType",
                    "answers"
                  ],
                  "additionalProperties": false,
                  "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                }
              ],
              "type": "object"
            },
            "description": "The exit quiz questions - which test on the knowledge learned in the lesson",
            "example": [
              {
                "question": "Which word is a verb?",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "shops"
                  },
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "Jun"
                  },
                  {
                    "distractor": true,
                    "type": "text",
                    "content": "I"
                  },
                  {
                    "distractor": false,
                    "type": "text",
                    "content": "shout"
                  }
                ]
              }
            ]
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "starterQuiz",
          "exitQuiz"
        ],
        "additionalProperties": false,
        "example": {
          "starterQuiz": [
            {
              "question": "Tick the sentence with the correct punctuation.",
              "questionType": "multiple-choice",
              "answers": [
                {
                  "distractor": true,
                  "type": "text",
                  "content": "the baby cried"
                },
                {
                  "distractor": true,
                  "type": "text",
                  "content": "The baby cried"
                },
                {
                  "distractor": false,
                  "type": "text",
                  "content": "The baby cried."
                },
                {
                  "distractor": true,
                  "type": "text",
                  "content": "the baby cried."
                }
              ]
            }
          ],
          "exitQuiz": [
            {
              "question": "Which word is a verb?",
              "questionType": "multiple-choice",
              "answers": [
                {
                  "distractor": true,
                  "type": "text",
                  "content": "shops"
                },
                {
                  "distractor": true,
                  "type": "text",
                  "content": "Jun"
                },
                {
                  "distractor": true,
                  "type": "text",
                  "content": "I"
                },
                {
                  "distractor": false,
                  "type": "text",
                  "content": "shout"
                }
              ]
            }
          ]
        }
      },
      "QuestionsForSequenceResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The lesson slug identifier"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title of the lesson"
            },
            "starterQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The starter quiz questions - which test prior knowledge"
            },
            "exitQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The exit quiz questions - which test on the knowledge learned in the lesson"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "starterQuiz",
            "exitQuiz"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonTitle": "3D shapes can be composed from 2D nets",
            "lessonSlug": "3d-shapes-can-be-composed-from-2d-nets",
            "starterQuiz": [
              {
                "question": "Select all of the names of shapes that are polygons.",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "type": "text",
                    "content": "Cube ",
                    "distractor": true
                  },
                  {
                    "type": "text",
                    "content": " Square",
                    "distractor": false
                  },
                  {
                    "type": "text",
                    "content": "Triangle",
                    "distractor": false
                  },
                  {
                    "type": "text",
                    "content": "Semi-circle",
                    "distractor": true
                  }
                ]
              }
            ],
            "exitQuiz": [
              {
                "question": "What is a net?",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "type": "text",
                    "content": "A 3D shape made of 2D shapes folded together. ",
                    "distractor": false
                  },
                  {
                    "type": "text",
                    "content": "A 2D shape made of 3D shapes folded togehther.",
                    "distractor": true
                  },
                  {
                    "type": "text",
                    "content": "A type of cube.",
                    "distractor": true
                  }
                ]
              }
            ]
          }
        ]
      },
      "QuestionsForKeyStageAndSubjectResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The lesson slug identifier"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title of the lesson"
            },
            "starterQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The starter quiz questions - which test prior knowledge"
            },
            "exitQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The exit quiz questions - which test on the knowledge learned in the lesson"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "starterQuiz",
            "exitQuiz"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonSlug": "predicting-the-size-of-a-product",
            "lessonTitle": "Predicting the size of a product",
            "starterQuiz": [
              {
                "question": "Match the number to its written representation.",
                "questionType": "match",
                "answers": [
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "seven tenths"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0.7"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "nine tenths"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0.9"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "seven ones"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "7"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "seven hundredths"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0.07"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "nine hundredths"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0.09"
                    }
                  }
                ]
              }
            ],
            "exitQuiz": [
              {
                "question": "Use the fact that 9 × 8 = 72, to match the expressions to their product.",
                "questionType": "match",
                "answers": [
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "9 × 80"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "720"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "9 × 800 "
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "7,200"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "9 × 0.8"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "7.2"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "9 × 0"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0"
                    }
                  },
                  {
                    "matchOption": {
                      "type": "text",
                      "content": "9 × 0.08"
                    },
                    "correctChoice": {
                      "type": "text",
                      "content": "0.72"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "QuestionsForProgrammeResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The lesson slug identifier"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The title of the lesson"
            },
            "starterQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The starter quiz questions - which test prior knowledge"
            },
            "exitQuiz": {
              "type": "array",
              "items": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "multiple-choice"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "oneOf": [
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "image"
                                },
                                "content": {
                                  "type": "object",
                                  "properties": {
                                    "url": {
                                      "type": "string"
                                    },
                                    "width": {
                                      "type": "number"
                                    },
                                    "height": {
                                      "type": "number"
                                    },
                                    "alt": {
                                      "type": "string"
                                    },
                                    "text": {
                                      "type": "string",
                                      "description": "Supplementary text for the image, if any"
                                    },
                                    "attribution": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "url",
                                    "width",
                                    "height"
                                  ],
                                  "additionalProperties": false
                                },
                                "distractor": {
                                  "type": "boolean",
                                  "description": "Whether the multiple choice question response is the correct answer (false) or is a distractor (true)"
                                }
                              },
                              "required": [
                                "type",
                                "content",
                                "distractor"
                              ],
                              "additionalProperties": false
                            }
                          ],
                          "type": "object"
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Multiple choice answer allows for one or more than one answer to be correct as defined by the distractor field being set to false"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "short-answer"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "const": "text",
                              "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                            },
                            "content": {
                              "type": "string",
                              "description": "Quiz question answer"
                            }
                          },
                          "required": [
                            "type",
                            "content"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "Short answers allow students to enter a free text answer, and the answers array contains a list of acceptable answers"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "match"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "matchOption": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (LHS)"
                            },
                            "correctChoice": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false,
                              "description": "Matching options (RHS), indicating the correct choice"
                            }
                          },
                          "required": [
                            "matchOption",
                            "correctChoice"
                          ],
                          "additionalProperties": false
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list from the `match_option` field in the answers array, and must correctly match them to the `correct_choice` value"
                  },
                  {
                    "type": "object",
                    "properties": {
                      "question": {
                        "type": "string",
                        "description": "The question text"
                      },
                      "questionType": {
                        "type": "string",
                        "const": "order"
                      },
                      "questionImage": {
                        "type": "object",
                        "properties": {
                          "url": {
                            "type": "string"
                          },
                          "width": {
                            "type": "number"
                          },
                          "height": {
                            "type": "number"
                          },
                          "alt": {
                            "type": "string"
                          },
                          "text": {
                            "type": "string",
                            "description": "Supplementary text for the image, if any"
                          },
                          "attribution": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "url",
                          "width",
                          "height"
                        ],
                        "additionalProperties": false
                      },
                      "answers": {
                        "type": "array",
                        "items": {
                          "allOf": [
                            {
                              "type": "object",
                              "properties": {
                                "order": {
                                  "type": "number",
                                  "description": "Indicates the correct ordering of the response"
                                }
                              },
                              "required": [
                                "order"
                              ],
                              "additionalProperties": false
                            },
                            {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string",
                                  "const": "text",
                                  "description": "The format of the quiz answer \nNote: currently, we are only returning text-based quiz answers. In the future, we will also have image-based questions available."
                                },
                                "content": {
                                  "type": "string",
                                  "description": "Quiz question answer"
                                }
                              },
                              "required": [
                                "type",
                                "content"
                              ],
                              "additionalProperties": false
                            }
                          ]
                        }
                      }
                    },
                    "required": [
                      "question",
                      "questionType",
                      "answers"
                    ],
                    "additionalProperties": false,
                    "description": "The student is offered a list of items to order, and must correctly order them according to the `order` field. When presenting the answer options to the student, you should randomise the order of the items"
                  }
                ],
                "type": "object"
              },
              "description": "The exit quiz questions - which test on the knowledge learned in the lesson"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
              "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "starterQuiz",
            "exitQuiz"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonTitle": "3D shapes can be composed from 2D nets",
            "lessonSlug": "3d-shapes-can-be-composed-from-2d-nets",
            "starterQuiz": [
              {
                "question": "Select all of the names of shapes that are polygons.",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "type": "text",
                    "content": "Cube",
                    "distractor": true
                  },
                  {
                    "type": "text",
                    "content": "Square",
                    "distractor": false
                  },
                  {
                    "type": "text",
                    "content": "Triangle",
                    "distractor": false
                  }
                ]
              }
            ],
            "exitQuiz": [
              {
                "question": "What is a net?",
                "questionType": "multiple-choice",
                "answers": [
                  {
                    "type": "text",
                    "content": "A 2D shape that folds into a 3D shape.",
                    "distractor": false
                  },
                  {
                    "type": "text",
                    "content": "A type of cube.",
                    "distractor": true
                  }
                ]
              }
            ]
          }
        ]
      },
      "LessonSummaryResponseSchema": {
        "type": "object",
        "properties": {
          "lessonTitle": {
            "type": "string",
            "description": "The lesson title",
            "example": "Using vector tools to draw and modify shapes"
          },
          "canonicalUrl": {
            "type": "string",
            "format": "uri",
            "description": "The canonical Oak National URL for the lesson",
            "example": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes"
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak National URL for the lesson",
            "example": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes"
          },
          "units": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "unitSlug": {
                  "type": "string",
                  "description": "The unit slug identifier",
                  "example": "developing-vector-graphics"
                },
                "unitTitle": {
                  "type": "string",
                  "description": "The unit title",
                  "example": "Developing vector graphics"
                },
                "programmeFactors": {
                  "type": "object",
                  "properties": {
                    "examBoard": {
                      "description": "The exam board that identifies this unit variant",
                      "type": "object",
                      "properties": {
                        "slug": {
                          "type": "string",
                          "description": "The slug identifier for the programme factor"
                        },
                        "title": {
                          "type": "string",
                          "description": "The title of the programme factor"
                        }
                      },
                      "required": [
                        "slug",
                        "title"
                      ],
                      "additionalProperties": false
                    },
                    "pathway": {
                      "description": "The pathway that identifies this unit variant",
                      "type": "object",
                      "properties": {
                        "slug": {
                          "type": "string",
                          "description": "The slug identifier for the programme factor"
                        },
                        "title": {
                          "type": "string",
                          "description": "The title of the programme factor"
                        }
                      },
                      "required": [
                        "slug",
                        "title"
                      ],
                      "additionalProperties": false
                    },
                    "tier": {
                      "description": "The tier that identifies this unit variant",
                      "type": "object",
                      "properties": {
                        "slug": {
                          "type": "string",
                          "description": "The slug identifier for the programme factor"
                        },
                        "title": {
                          "type": "string",
                          "description": "The title of the programme factor"
                        }
                      },
                      "required": [
                        "slug",
                        "title"
                      ],
                      "additionalProperties": false
                    },
                    "childSubject": {
                      "description": "The science child subject that identifies this unit variant",
                      "type": "object",
                      "properties": {
                        "slug": {
                          "type": "string",
                          "enum": [
                            "biology",
                            "chemistry",
                            "combined-science",
                            "physics"
                          ],
                          "description": "The slug identifier for the science child subject"
                        },
                        "title": {
                          "type": "string",
                          "description": "The title of the science child subject"
                        }
                      },
                      "required": [
                        "slug",
                        "title"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "additionalProperties": false,
                  "description": "The programme-factor values that identify which variant of the unit this lesson sits in. Omitted when the unit has no programme factors."
                }
              },
              "required": [
                "unitSlug",
                "unitTitle"
              ],
              "additionalProperties": false
            },
            "description": "All the units (including programme variants) this lesson is part of. Each entry is a unique combination of unit slug and programme factors.",
            "example": [
              {
                "unitSlug": "developing-vector-graphics",
                "unitTitle": "Developing vector graphics"
              }
            ]
          },
          "subjectSlug": {
            "type": "string",
            "description": "The subject slug identifier",
            "example": "computing"
          },
          "subjectTitle": {
            "type": "string",
            "description": "The subject slug identifier",
            "example": "Computing"
          },
          "keyStageSlug": {
            "type": "string",
            "description": "The key stage slug identifier",
            "example": "ks3"
          },
          "keyStageTitle": {
            "type": "string",
            "description": "The key stage title",
            "example": "Key Stage 3"
          },
          "lessonKeywords": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "keyword": {
                  "type": "string",
                  "description": "The keyword",
                  "example": "vector graphic"
                },
                "description": {
                  "type": "string",
                  "description": "A definition of the keyword",
                  "example": "an image made up of lines and shapes"
                }
              },
              "required": [
                "keyword",
                "description"
              ],
              "additionalProperties": false
            },
            "description": "The lesson's keywords and their descriptions",
            "example": [
              {
                "keyword": "vector graphic",
                "description": "an image made up of lines and shapes"
              },
              {
                "keyword": "z-order",
                "description": "the order of overlapping objects"
              },
              {
                "keyword": "layer",
                "description": "the level on which an object (e.g. text, shapes and photos) can be placed relative to other objects"
              }
            ]
          },
          "keyLearningPoints": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "keyLearningPoint": {
                  "type": "string",
                  "description": "A key learning point",
                  "example": "Vector graphics are made from shapes described by coordinates, not pixels."
                }
              },
              "required": [
                "keyLearningPoint"
              ],
              "additionalProperties": false
            },
            "description": "The lesson's key learning points",
            "example": [
              {
                "keyLearningPoint": "Vector graphics are made from shapes described by coordinates, not pixels."
              },
              {
                "keyLearningPoint": "Vector illustrations are built using simple shapes."
              },
              {
                "keyLearningPoint": "Vector graphics use z-order to show which shapes are in front and are visible."
              }
            ]
          },
          "misconceptionsAndCommonMistakes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "misconception": {
                  "type": "string",
                  "description": "A common misconception",
                  "example": "Vector graphics are made from pixels and can lose quality when resized."
                },
                "response": {
                  "type": "string",
                  "description": "Suggested teacher response to a common misconception",
                  "example": "Vector graphics are made from lines and shapes. They do not lose quality when resized."
                }
              },
              "required": [
                "misconception",
                "response"
              ],
              "additionalProperties": false
            },
            "description": "The lesson’s anticipated common misconceptions and suggested teacher responses",
            "example": [
              {
                "misconception": "Vector graphics are made from pixels and can lose quality when resized.",
                "response": "Vector graphics are made from lines and shapes. They do not lose quality when resized."
              }
            ]
          },
          "pupilLessonOutcome": {
            "description": "Suggested teacher response to a common misconception",
            "example": "I can use software to draw and modify vector shapes.",
            "type": "string"
          },
          "teacherTips": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "teacherTip": {
                  "type": "string",
                  "example": "You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials"
                }
              },
              "required": [
                "teacherTip"
              ],
              "additionalProperties": false,
              "description": "A teaching tip"
            },
            "description": "Helpful teaching tips for the lesson",
            "example": [
              {
                "teacherTip": "You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials"
              }
            ]
          },
          "contentGuidance": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "contentGuidanceArea": {
                      "type": "string",
                      "description": "Category of content guidance"
                    },
                    "supervisionlevel_id": {
                      "type": "number",
                      "description": "The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information."
                    },
                    "contentGuidanceLabel": {
                      "type": "string",
                      "description": "Content guidance label"
                    },
                    "contentGuidanceDescription": {
                      "type": "string",
                      "description": "A detailed description of the type of content that we suggest needs guidance."
                    }
                  },
                  "required": [
                    "contentGuidanceArea",
                    "supervisionlevel_id",
                    "contentGuidanceLabel",
                    "contentGuidanceDescription"
                  ],
                  "additionalProperties": false
                }
              },
              {
                "type": "null"
              }
            ],
            "description": "Full guidance about the types of lesson content for the teacher to consider (where appropriate)",
            "example": null
          },
          "supervisionLevel": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "description": "The ID of the supervision level for the identified type of content. See ‘What are the types of content guidance?’ for more information.",
            "example": null
          },
          "downloadsAvailable": {
            "type": "boolean",
            "description": "Whether the lesson currently has any downloadable assets available.",
            "example": true
          }
        },
        "required": [
          "lessonTitle",
          "canonicalUrl",
          "oakUrl",
          "units",
          "subjectSlug",
          "subjectTitle",
          "keyStageSlug",
          "keyStageTitle",
          "lessonKeywords",
          "keyLearningPoints",
          "misconceptionsAndCommonMistakes",
          "teacherTips",
          "contentGuidance",
          "supervisionLevel",
          "downloadsAvailable"
        ],
        "additionalProperties": false,
        "example": {
          "lessonTitle": "Using vector tools to draw and modify shapes",
          "canonicalUrl": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes",
          "oakUrl": "https://www.thenational.academy/teachers/lessons/using-vector-tools-to-draw-and-modify-shapes",
          "units": [
            {
              "unitSlug": "developing-vector-graphics",
              "unitTitle": "Developing vector graphics"
            }
          ],
          "subjectSlug": "computing",
          "subjectTitle": "Computing",
          "keyStageSlug": "ks3",
          "keyStageTitle": "Key Stage 3",
          "lessonKeywords": [
            {
              "keyword": "vector graphic",
              "description": "an image made up of lines and shapes"
            },
            {
              "keyword": "z-order",
              "description": "the order of overlapping objects"
            },
            {
              "keyword": "layer",
              "description": "the level on which an object (e.g. text, shapes and photos) can be placed relative to other objects"
            }
          ],
          "keyLearningPoints": [
            {
              "keyLearningPoint": "Vector graphics are made from shapes described by coordinates, not pixels."
            },
            {
              "keyLearningPoint": "Vector illustrations are built using simple shapes."
            },
            {
              "keyLearningPoint": "Vector graphics use z-order to show which shapes are in front and are visible."
            }
          ],
          "misconceptionsAndCommonMistakes": [
            {
              "misconception": "Vector graphics are made from pixels and can lose quality when resized.",
              "response": "Vector graphics are made from lines and shapes. They do not lose quality when resized."
            }
          ],
          "pupilLessonOutcome": "I can use software to draw and modify vector shapes.",
          "teacherTips": [
            {
              "teacherTip": "You need to be familiar with the basic tools and features of vector editing software. The Inkscape tutorials may be useful — oak.link/inkscape-tutorials"
            }
          ],
          "contentGuidance": null,
          "supervisionLevel": null,
          "downloadsAvailable": true
        }
      },
      "LessonSearchResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "lessonSlug": {
              "type": "string",
              "description": "The lesson slug identifier"
            },
            "lessonTitle": {
              "type": "string",
              "description": "The lesson title"
            },
            "oakUrl": {
              "type": "string",
              "format": "uri",
              "description": "The Oak National URL for the lesson"
            },
            "similarity": {
              "type": "number",
              "description": "The snippet of the transcript that matched the search term"
            },
            "units": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "unitSlug": {
                    "type": "string"
                  },
                  "unitTitle": {
                    "type": "string"
                  },
                  "examBoardTitle": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "keyStageSlug": {
                    "type": "string"
                  },
                  "subjectSlug": {
                    "type": "string"
                  }
                },
                "required": [
                  "unitSlug",
                  "unitTitle",
                  "examBoardTitle",
                  "keyStageSlug",
                  "subjectSlug"
                ],
                "additionalProperties": false
              },
              "description": "The units that the lesson is part of. See sample response below"
            }
          },
          "required": [
            "lessonSlug",
            "lessonTitle",
            "oakUrl",
            "similarity",
            "units"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "lessonSlug": "performing-your-chosen-gothic-poem",
            "lessonTitle": "Performing your chosen Gothic poem",
            "oakUrl": "https://www.thenational.academy/teachers/lessons/performing-your-chosen-gothic-poem",
            "similarity": 0.20588236,
            "units": [
              {
                "unitSlug": "gothic-poetry",
                "unitTitle": "Gothic poetry",
                "examBoardTitle": null,
                "keyStageSlug": "ks3",
                "subjectSlug": "english"
              }
            ]
          },
          {
            "lessonSlug": "the-twisted-tree-the-novel-as-a-gothic-text",
            "lessonTitle": "'The Twisted Tree': the novel as a Gothic text",
            "oakUrl": "https://www.thenational.academy/teachers/lessons/the-twisted-tree-the-novel-as-a-gothic-text",
            "similarity": 0.19444445,
            "units": [
              {
                "unitSlug": "the-twisted-tree-fiction-reading",
                "unitTitle": "'The Twisted Tree': fiction reading",
                "examBoardTitle": null,
                "keyStageSlug": "ks3",
                "subjectSlug": "english"
              }
            ]
          }
        ]
      },
      "UnitSummaryResponseSchema": {
        "type": "object",
        "properties": {
          "unitSlug": {
            "type": "string",
            "description": "The unit slug identifier",
            "example": "programming-subroutines"
          },
          "unitTitle": {
            "type": "string",
            "description": "The unit title",
            "example": "Programming subroutines"
          },
          "yearSlug": {
            "type": "string",
            "description": "The slug identifier for the year to which the unit belongs",
            "example": "year-10"
          },
          "year": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "string",
                "description": "All years"
              }
            ],
            "description": "The year to which the unit belongs",
            "example": 10
          },
          "phaseSlug": {
            "type": "string",
            "description": "The slug identifier for the phase to which the unit belongs",
            "example": "secondary"
          },
          "subjectSlug": {
            "type": "string",
            "description": "The subject identifier",
            "example": "computing"
          },
          "keyStageSlug": {
            "type": "string",
            "description": "The slug identifier for the the key stage to which the unit belongs",
            "example": "ks4"
          },
          "notes": {
            "type": "string",
            "description": "Unit summary notes"
          },
          "description": {
            "type": "string",
            "description": "A short description of the unit. Not yet available for all subjects."
          },
          "priorKnowledgeRequirements": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "The prior knowledge required for the unit",
            "example": [
              "Variables can be used to store values in a program.",
              "Selection can be used to choose between paths in a program.",
              "Iteration can be used to repeat a set of instructions."
            ]
          },
          "nationalCurriculumContent": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "National curriculum attainment statements covered in this unit",
            "example": [
              "Use two or more programming languages, at least one of which is textual, to solve a variety of computational problems.",
              "Make appropriate use of data structures.",
              "Design and develop modular programs."
            ]
          },
          "whyThisWhyNow": {
            "type": "string",
            "description": "An explanation of where the unit sits within the sequence and why it has been placed there."
          },
          "threads": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "slug": {
                  "type": "string"
                },
                "title": {
                  "type": "string"
                },
                "order": {
                  "type": "number"
                }
              },
              "required": [
                "slug",
                "title",
                "order"
              ],
              "additionalProperties": false
            },
            "description": "The threads that are associated with the unit"
          },
          "categories": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "categoryTitle": {
                  "type": "string"
                },
                "categorySlug": {
                  "type": "string"
                }
              },
              "required": [
                "categoryTitle"
              ],
              "additionalProperties": false
            },
            "description": "The categories (if any) that are assigned to the unit. If the unit does not have any categories, this property is omitted."
          },
          "programmeFactors": {
            "example": {
              "examBoard": {
                "slug": "aqa",
                "title": "AQA"
              },
              "pathway": {
                "slug": "gcse",
                "title": "GCSE"
              }
            },
            "type": "object",
            "properties": {
              "examBoard": {
                "description": "The exam board that identifies this unit variant",
                "type": "object",
                "properties": {
                  "slug": {
                    "type": "string",
                    "description": "The slug identifier for the programme factor"
                  },
                  "title": {
                    "type": "string",
                    "description": "The title of the programme factor"
                  }
                },
                "required": [
                  "slug",
                  "title"
                ],
                "additionalProperties": false
              },
              "pathway": {
                "description": "The pathway that identifies this unit variant",
                "type": "object",
                "properties": {
                  "slug": {
                    "type": "string",
                    "description": "The slug identifier for the programme factor"
                  },
                  "title": {
                    "type": "string",
                    "description": "The title of the programme factor"
                  }
                },
                "required": [
                  "slug",
                  "title"
                ],
                "additionalProperties": false
              },
              "tier": {
                "description": "The tier that identifies this unit variant",
                "type": "object",
                "properties": {
                  "slug": {
                    "type": "string",
                    "description": "The slug identifier for the programme factor"
                  },
                  "title": {
                    "type": "string",
                    "description": "The title of the programme factor"
                  }
                },
                "required": [
                  "slug",
                  "title"
                ],
                "additionalProperties": false
              },
              "childSubject": {
                "description": "The science child subject that identifies this unit variant",
                "type": "object",
                "properties": {
                  "slug": {
                    "type": "string",
                    "enum": [
                      "biology",
                      "chemistry",
                      "combined-science",
                      "physics"
                    ],
                    "description": "The slug identifier for the science child subject"
                  },
                  "title": {
                    "type": "string",
                    "description": "The title of the science child subject"
                  }
                },
                "required": [
                  "slug",
                  "title"
                ],
                "additionalProperties": false
              }
            },
            "additionalProperties": false,
            "description": "The programme-factor values that identify which variant of this unit is returned. Omitted when the unit has no programme factors."
          },
          "unitOptionsGroup": {
            "description": "If the unit is unit variant, then this is the unit's \"parent\" unit slug",
            "type": "string"
          },
          "unitLessons": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "lessonSlug": {
                  "type": "string",
                  "description": "The lesson slug identifier",
                  "example": "structured-programs"
                },
                "lessonTitle": {
                  "type": "string",
                  "description": "The title for the lesson",
                  "example": "Structured programs"
                },
                "lessonOrder": {
                  "example": 1,
                  "type": "number",
                  "description": "Indicates the ordering of the lesson"
                },
                "state": {
                  "type": "string",
                  "enum": [
                    "published",
                    "new"
                  ],
                  "description": "If the state is 'published' then it is also available on the /lessons/* endpoints. If the state is 'new' then it's not available yet.",
                  "example": "published"
                }
              },
              "required": [
                "lessonSlug",
                "lessonTitle",
                "state"
              ],
              "additionalProperties": false,
              "description": "All the lessons contained in the unit"
            },
            "example": [
              {
                "lessonSlug": "structured-programs",
                "lessonTitle": "Structured programs",
                "lessonOrder": 1,
                "state": "published"
              },
              {
                "lessonSlug": "subroutines-with-parameters",
                "lessonTitle": "Subroutines with parameters",
                "lessonOrder": 2,
                "state": "new"
              }
            ]
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "unitSlug",
          "unitTitle",
          "yearSlug",
          "year",
          "phaseSlug",
          "subjectSlug",
          "keyStageSlug",
          "priorKnowledgeRequirements",
          "nationalCurriculumContent",
          "unitLessons"
        ],
        "additionalProperties": false,
        "example": {
          "unitSlug": "programming-subroutines",
          "unitTitle": "Programming subroutines",
          "yearSlug": "year-10",
          "year": 10,
          "phaseSlug": "secondary",
          "subjectSlug": "computing",
          "keyStageSlug": "ks4",
          "priorKnowledgeRequirements": [
            "Variables can be used to store values in a program.",
            "Selection can be used to choose between paths in a program.",
            "Iteration can be used to repeat a set of instructions."
          ],
          "nationalCurriculumContent": [
            "Use two or more programming languages, at least one of which is textual, to solve a variety of computational problems.",
            "Make appropriate use of data structures.",
            "Design and develop modular programs."
          ],
          "programmeFactors": {
            "examBoard": {
              "slug": "aqa",
              "title": "AQA"
            },
            "pathway": {
              "slug": "gcse",
              "title": "GCSE"
            }
          },
          "unitLessons": [
            {
              "lessonSlug": "structured-programs",
              "lessonTitle": "Structured programs",
              "lessonOrder": 1,
              "state": "published"
            },
            {
              "lessonSlug": "subroutines-with-parameters",
              "lessonTitle": "Subroutines with parameters",
              "lessonOrder": 2,
              "state": "new"
            }
          ]
        }
      },
      "AllThreadsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "The thread title"
            },
            "slug": {
              "type": "string",
              "description": "The thread slug identifier"
            },
            "unitCount": {
              "type": "number",
              "description": "The number of published units in the thread"
            },
            "oakUrl": {
              "type": "null",
              "description": "Threads are data concepts without Oak URLs on the website. Always null for thread resources."
            }
          },
          "required": [
            "title",
            "slug",
            "unitCount"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "title": "Number: Multiplication and division",
            "slug": "number-multiplication-and-division",
            "unitCount": 78
          },
          {
            "title": "Number: Place value",
            "slug": "number-place-value",
            "unitCount": 56
          }
        ]
      },
      "ThreadUnitsResponseSchema": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "unitTitle": {
              "type": "string",
              "description": "The unit title"
            },
            "unitSlug": {
              "type": "string",
              "description": "The unit slug identifier"
            },
            "oakUrl": {
              "type": "null",
              "description": "Threads are data concepts without Oak URLs on the website. Always null for thread resources."
            }
          },
          "required": [
            "unitTitle",
            "unitSlug"
          ],
          "additionalProperties": false
        },
        "example": [
          {
            "unitTitle": "Unitising and coin recognition - counting in 2s, 5s and 10s",
            "unitSlug": "unitising-and-coin-recognitions-counting-in-2s-5s-and-10s"
          },
          {
            "unitTitle": "Solving problems in a range of contexts",
            "unitSlug": "unitising-and-coin-recognition-solving-problems-involving-money"
          }
        ]
      },
      "RateLimitResponseSchema": {
        "type": "object",
        "properties": {
          "limit": {
            "type": "number",
            "description": "The maximum number of requests you can make in the current window.",
            "example": 1000
          },
          "remaining": {
            "type": "number",
            "description": "The number of requests remaining in the current window.",
            "example": 953
          },
          "reset": {
            "type": "number",
            "description": "The time at which the current window resets, in milliseconds since the Unix epoch.",
            "example": 1740164400000
          },
          "oakUrl": {
            "type": "string",
            "format": "uri",
            "description": "The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.",
            "example": "https://www.thenational.academy/teachers/lessons/example-lesson"
          }
        },
        "required": [
          "limit",
          "remaining",
          "reset"
        ],
        "additionalProperties": false,
        "example": {
          "limit": 1000,
          "remaining": 953,
          "reset": 1740164400000
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer"
      }
    }
  }
} as const;

export type SchemaBase = typeof schemaBase;
