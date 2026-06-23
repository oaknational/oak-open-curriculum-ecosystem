/**
 * GENERATED FILE - DO NOT EDIT
 * This file is generated from the API schema during type generation.
 * 
 * This file contains the tuples, types and type guards for the path parameters, for use in dynamically constructing API requests.
 * 
 * It also contains the valid parameter combinations for different paths.
 */

// Link to the processed schema for use with the OpenAPI-Fetch client.
import type { paths as Paths } from "./api-paths-types";
// Link to the schema runtime object file.
/**
 * The Schema["paths"] keys are the same as the Paths type keys, but the types are different.
 * The Schema["paths"] type is for the raw schema, and the Paths type is the OpenAPI-TS type for the processed schema.
 */
import type { SchemaBase as Schema } from "./api-schema-base";
import { schemaBase as schema } from "./api-schema-base.js";


export type ValidPath = keyof Paths;
/**
 * Convenience map for all the paths
 */
export const PATHS = {
  '/changelog': '/changelog',
  '/changelog/latest': '/changelog/latest',
  '/key-stages': '/key-stages',
  '/key-stages/{keyStage}/subject/{subject}/assets': '/key-stages/{keyStage}/subject/{subject}/assets',
  '/key-stages/{keyStage}/subject/{subject}/lessons': '/key-stages/{keyStage}/subject/{subject}/lessons',
  '/key-stages/{keyStage}/subject/{subject}/questions': '/key-stages/{keyStage}/subject/{subject}/questions',
  '/key-stages/{keyStage}/subject/{subject}/units': '/key-stages/{keyStage}/subject/{subject}/units',
  '/keywords': '/keywords',
  '/lessons/{lesson}/assets': '/lessons/{lesson}/assets',
  '/lessons/{lesson}/assets/{type}': '/lessons/{lesson}/assets/{type}',
  '/lessons/{lesson}/quiz': '/lessons/{lesson}/quiz',
  '/lessons/{lesson}/summary': '/lessons/{lesson}/summary',
  '/lessons/{lesson}/transcript': '/lessons/{lesson}/transcript',
  '/rate-limit': '/rate-limit',
  '/search/lessons': '/search/lessons',
  '/search/transcripts': '/search/transcripts',
  '/sequences/{sequence}': '/sequences/{sequence}',
  '/sequences/{sequence}/assets': '/sequences/{sequence}/assets',
  '/sequences/{sequence}/questions': '/sequences/{sequence}/questions',
  '/sequences/{sequence}/units': '/sequences/{sequence}/units',
  '/subjects': '/subjects',
  '/subjects/{subject}': '/subjects/{subject}',
  '/subjects/{subject}/key-stages': '/subjects/{subject}/key-stages',
  '/subjects/{subject}/years': '/subjects/{subject}/years',
  '/threads': '/threads',
  '/threads/{threadSlug}/units': '/threads/{threadSlug}/units',
  '/units/{unit}/summary': '/units/{unit}/summary'
} as const;

/**
 * Types derived from the runtime schema object.
*/
export type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;

// 1. All standard HTTP methods (the OpenAPI 3.1 vocabulary)
export const POSSIBLE_HTTP_METHODS = [
  "delete", "get", "head", "options", "patch", "post", "put", "trace"
] as const;
export type PossibleHttpMethod = (typeof POSSIBLE_HTTP_METHODS)[number];
export function isPossibleHttpMethod(value: string): value is PossibleHttpMethod {
  const methods: readonly string[] = POSSIBLE_HTTP_METHODS;
  return methods.includes(value);
}

// 2. API methods — derived from the runtime schema, exact type from the schema type system
type MethodKeysOf<T> = T extends unknown ? Extract<keyof T, PossibleHttpMethod> : never;
export type ApiHttpMethod = MethodKeysOf<RawPaths[keyof RawPaths]>;
const possibleMethodSet: ReadonlySet<string> = new Set(POSSIBLE_HTTP_METHODS);
export const API_HTTP_METHODS: readonly ApiHttpMethod[] = [...new Set(
  Object.values(schema.paths).flatMap((p) =>
    Object.keys(p).filter((k): k is ApiHttpMethod => possibleMethodSet.has(k))
  ),
)].sort((a, b) => a.localeCompare(b));
export function isApiHttpMethod(maybeMethod: string): maybeMethod is ApiHttpMethod {
  const methods: readonly string[] = API_HTTP_METHODS;
  return methods.includes(maybeMethod);
}

// Helper types derived from schema for path/method/response typing
export type AllowedMethodsForPath<P extends ValidPath> = Extract<keyof Paths[P], PossibleHttpMethod>;

/**
 * Extract the JSON body from a 200 response for a given path and method.
 *
 * Uses direct `Paths` indexed access rather than the `PathOperation`
 * conditional chain. TypeScript resolves direct indexing eagerly for
 * concrete path/method literals, making the resulting type spreadable
 * in augmentation functions. The `PathOperation`-based chain
 * (`ResponseForPathAndMethod`) defers evaluation even for single
 * literals, which causes TS2698 spread errors.
 *
 * For methods that do not exist on a path (e.g. `put?: never`),
 * `Paths[P][M]` is `never`, and the conditional correctly yields
 * `never`.
 */
export type JsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Paths[P][M] extends { responses: { 200: { content: { 'application/json': infer J } } } }
    ? J
    : never;

/** Paths that expose a GET method. */
export type ValidGetPath = {
  [P in ValidPath]: 'get' extends AllowedMethodsForPath<P> ? P : never
}[ValidPath];

/**
 * Union of all GET 200 JSON response body types.
 *
 * Generated at sdk-codegen time as an explicit union — one direct
 * `Paths` index per path. Each member resolves eagerly to the
 * concrete response type from the processed OpenAPI schema, with no
 * conditional or mapped type indirection.
 *
 * Replaces hand-authored `Readonly<Record<string, unknown>>` aliases
 * that widen the type system.
 */
export type GetResponseBody =
  | Paths['/changelog']['get']['responses'][200]['content']['application/json']
  | Paths['/changelog/latest']['get']['responses'][200]['content']['application/json']
  | Paths['/key-stages']['get']['responses'][200]['content']['application/json']
  | Paths['/key-stages/{keyStage}/subject/{subject}/assets']['get']['responses'][200]['content']['application/json']
  | Paths['/key-stages/{keyStage}/subject/{subject}/lessons']['get']['responses'][200]['content']['application/json']
  | Paths['/key-stages/{keyStage}/subject/{subject}/questions']['get']['responses'][200]['content']['application/json']
  | Paths['/key-stages/{keyStage}/subject/{subject}/units']['get']['responses'][200]['content']['application/json']
  | Paths['/keywords']['get']['responses'][200]['content']['application/json']
  | Paths['/lessons/{lesson}/assets']['get']['responses'][200]['content']['application/json']
  | Paths['/lessons/{lesson}/assets/{type}']['get']['responses'][200]['content']['application/json']
  | Paths['/lessons/{lesson}/quiz']['get']['responses'][200]['content']['application/json']
  | Paths['/lessons/{lesson}/summary']['get']['responses'][200]['content']['application/json']
  | Paths['/lessons/{lesson}/transcript']['get']['responses'][200]['content']['application/json']
  | Paths['/rate-limit']['get']['responses'][200]['content']['application/json']
  | Paths['/search/lessons']['get']['responses'][200]['content']['application/json']
  | Paths['/search/transcripts']['get']['responses'][200]['content']['application/json']
  | Paths['/sequences/{sequence}']['get']['responses'][200]['content']['application/json']
  | Paths['/sequences/{sequence}/assets']['get']['responses'][200]['content']['application/json']
  | Paths['/sequences/{sequence}/questions']['get']['responses'][200]['content']['application/json']
  | Paths['/sequences/{sequence}/units']['get']['responses'][200]['content']['application/json']
  | Paths['/subjects']['get']['responses'][200]['content']['application/json']
  | Paths['/subjects/{subject}']['get']['responses'][200]['content']['application/json']
  | Paths['/subjects/{subject}/key-stages']['get']['responses'][200]['content']['application/json']
  | Paths['/subjects/{subject}/years']['get']['responses'][200]['content']['application/json']
  | Paths['/threads']['get']['responses'][200]['content']['application/json']
  | Paths['/threads/{threadSlug}/units']['get']['responses'][200]['content']['application/json']
  | Paths['/units/{unit}/summary']['get']['responses'][200]['content']['application/json'];

/** GET 200 response bodies that are objects (safe to spread). */
export type GetObjectResponseBody = Exclude<GetResponseBody, readonly unknown[]>;

/** GET 200 response bodies that are arrays. */
export type GetArrayResponseBody = Extract<GetResponseBody, readonly unknown[]>;

/** Element type of array-valued GET 200 response bodies. */
export type GetArrayResponseElement =
  GetArrayResponseBody extends readonly (infer E)[] ? E : never;

/**
 * KeyStages extracted from the API schema
 */
export const KEY_STAGES = [
  "ks1",
  "ks2",
  "ks3",
  "ks4"
] as const;
export type KeyStages = typeof KEY_STAGES;
export type KeyStage = KeyStages[number];
export function isKeyStage(value: string): value is KeyStage {
  const keyStages: readonly string[] = KEY_STAGES;
  return keyStages.includes(value);
}

/**
 * Subjects extracted from the API schema
 */
export const SUBJECTS = [
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
] as const;
export type Subjects = typeof SUBJECTS;
export type Subject = Subjects[number];
export function isSubject(value: string): value is Subject {
  const subjects: readonly string[] = SUBJECTS;
  return subjects.includes(value);
}

/**
 * AssetTypes extracted from the API schema
 */
export const ASSET_TYPES = [
  "slideDeck",
  "exitQuiz",
  "exitQuizAnswers",
  "starterQuiz",
  "starterQuizAnswers",
  "supplementaryResource",
  "video",
  "worksheet",
  "worksheetAnswers"
] as const;
export type AssetTypes = typeof ASSET_TYPES;
export type AssetType = AssetTypes[number];
export function isAssetType(value: string): value is AssetType {
  const assetTypes: readonly string[] = ASSET_TYPES;
  return assetTypes.includes(value);
}

/**
 * All possible path parameters extracted from the API schema
 */
export interface PathParameters {
  keyStage: KeyStages;
  subject: Subjects;
  type: AssetTypes;
}

export const PATH_PARAMETERS: PathParameters = {
  keyStage: KEY_STAGES,
  subject: SUBJECTS,
  type: ASSET_TYPES,
} as const;

/**
 * Type for path parameter values
 */
export type PathParameterValues = {
  [K in keyof typeof PATH_PARAMETERS as (typeof PATH_PARAMETERS)[K] extends readonly unknown[]
    ? K
    : never]: (typeof PATH_PARAMETERS)[K] extends readonly unknown[]
    ? (typeof PATH_PARAMETERS)[K][number]
    : never;
};

/**
 * Type guard for parameter types
 */
export function isValidParameterType(parameterType: unknown): parameterType is keyof PathParameterValues {
  if (typeof parameterType !== 'string') {
    return false;
  }
  const keys = ['keyStage', 'subject', 'type'] as const;
  const keyList: readonly string[] = keys;
  return keyList.includes(parameterType);
}

/**
 * Function to validate if a value is a valid parameter for a given parameter type
 */
export function isValidPathParameter(parameterType: unknown, value: unknown): boolean {
  if (typeof parameterType !== 'string' || typeof value !== 'string') {
    return false;
  }
  if (parameterType === 'keyStage') { const allowed: readonly string[] = KEY_STAGES; return allowed.includes(value); }
  if (parameterType === 'subject') { const allowed: readonly string[] = SUBJECTS; return allowed.includes(value); }
  if (parameterType === 'type') { const allowed: readonly string[] = ASSET_TYPES; return allowed.includes(value); }
  // Open set (no enum emitted): accept any string for other parameter types
  return true;
};

/**
 * Path grouping keys
 */
export type PathGroupingKeys = "NO_PARAMS" | "keyStage_subject" | "lesson" | "lesson_type" | "sequence" | "subject" | "threadSlug" | "unit";


/**
 * Type for a valid parameter combination, linking to the paths types file.
 */
// Parametrise ValidParameterCombination with both the path and the path key
export interface ValidParameterCombination<
  P extends ValidPath,
  K extends PathGroupingKeys
> {
  params?: string;
  path: P;
  paramsKey: K; // This ensures paramsKey matches the K type parameter, enabling type narrowing based on the path key
}

// Make ValidPathAndParameters parameterized by the path key K
export type ValidPathAndParameters<K extends PathGroupingKeys> = {
  // Only include paths that are valid for this specific K
  [P in ValidPath as P extends keyof Paths ? P : never]?: ValidParameterCombination<P, K>;
};

// Now ValidPathGroupings maps each key to only its relevant paths
export type ValidPathGroupings = {
  [K in PathGroupingKeys]: ValidPathAndParameters<K>;
};



/**
 * Valid combinations of parameters for different paths
 */
export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings = {
  "keyStage_subject": {
    "/key-stages/{keyStage}/subject/{subject}/assets": {
        "params": "keyStage, subject",
        "path": "/key-stages/{keyStage}/subject/{subject}/assets",
        "paramsKey": "keyStage_subject"
    },
    "/key-stages/{keyStage}/subject/{subject}/lessons": {
        "params": "keyStage, subject",
        "path": "/key-stages/{keyStage}/subject/{subject}/lessons",
        "paramsKey": "keyStage_subject"
    },
    "/key-stages/{keyStage}/subject/{subject}/questions": {
        "params": "keyStage, subject",
        "path": "/key-stages/{keyStage}/subject/{subject}/questions",
        "paramsKey": "keyStage_subject"
    },
    "/key-stages/{keyStage}/subject/{subject}/units": {
        "params": "keyStage, subject",
        "path": "/key-stages/{keyStage}/subject/{subject}/units",
        "paramsKey": "keyStage_subject"
    }
  },
  "lesson": {
    "/lessons/{lesson}/assets": {
        "params": "lesson",
        "path": "/lessons/{lesson}/assets",
        "paramsKey": "lesson"
    },
    "/lessons/{lesson}/quiz": {
        "params": "lesson",
        "path": "/lessons/{lesson}/quiz",
        "paramsKey": "lesson"
    },
    "/lessons/{lesson}/summary": {
        "params": "lesson",
        "path": "/lessons/{lesson}/summary",
        "paramsKey": "lesson"
    },
    "/lessons/{lesson}/transcript": {
        "params": "lesson",
        "path": "/lessons/{lesson}/transcript",
        "paramsKey": "lesson"
    }
  },
  "lesson_type": {
    "/lessons/{lesson}/assets/{type}": {
        "params": "lesson, type",
        "path": "/lessons/{lesson}/assets/{type}",
        "paramsKey": "lesson_type"
    }
  },
  "NO_PARAMS": {
    "/changelog": {
        "path": "/changelog",
        "paramsKey": "NO_PARAMS"
    },
    "/changelog/latest": {
        "path": "/changelog/latest",
        "paramsKey": "NO_PARAMS"
    },
    "/key-stages": {
        "path": "/key-stages",
        "paramsKey": "NO_PARAMS"
    },
    "/keywords": {
        "path": "/keywords",
        "paramsKey": "NO_PARAMS"
    },
    "/rate-limit": {
        "path": "/rate-limit",
        "paramsKey": "NO_PARAMS"
    },
    "/search/lessons": {
        "path": "/search/lessons",
        "paramsKey": "NO_PARAMS"
    },
    "/search/transcripts": {
        "path": "/search/transcripts",
        "paramsKey": "NO_PARAMS"
    },
    "/subjects": {
        "path": "/subjects",
        "paramsKey": "NO_PARAMS"
    },
    "/threads": {
        "path": "/threads",
        "paramsKey": "NO_PARAMS"
    }
  },
  "sequence": {
    "/sequences/{sequence}": {
        "params": "sequence",
        "path": "/sequences/{sequence}",
        "paramsKey": "sequence"
    },
    "/sequences/{sequence}/assets": {
        "params": "sequence",
        "path": "/sequences/{sequence}/assets",
        "paramsKey": "sequence"
    },
    "/sequences/{sequence}/questions": {
        "params": "sequence",
        "path": "/sequences/{sequence}/questions",
        "paramsKey": "sequence"
    },
    "/sequences/{sequence}/units": {
        "params": "sequence",
        "path": "/sequences/{sequence}/units",
        "paramsKey": "sequence"
    }
  },
  "subject": {
    "/subjects/{subject}": {
        "params": "subject",
        "path": "/subjects/{subject}",
        "paramsKey": "subject"
    },
    "/subjects/{subject}/key-stages": {
        "params": "subject",
        "path": "/subjects/{subject}/key-stages",
        "paramsKey": "subject"
    },
    "/subjects/{subject}/years": {
        "params": "subject",
        "path": "/subjects/{subject}/years",
        "paramsKey": "subject"
    }
  },
  "threadSlug": {
    "/threads/{threadSlug}/units": {
        "params": "threadSlug",
        "path": "/threads/{threadSlug}/units",
        "paramsKey": "threadSlug"
    }
  },
  "unit": {
    "/units/{unit}/summary": {
        "params": "unit",
        "path": "/units/{unit}/summary",
        "paramsKey": "unit"
    }
  }
};

/**
 * All path operations extracted from the OpenAPI schema
 * Generated at build time for runtime use
 */
export const PATH_OPERATIONS = [
  {
    "path": "/sequences/{sequence}",
    "method": "get",
    "operationId": "getSequences-getSubjectSequence",
    "summary": "Sequencing information for a given sequence slug",
    "description": "Use when you have a sequence slug and need the sequence-level summary. A sequence is a subject's curriculum across a phase (e.g. maths-primary, science-secondary-aqa); it spans one or more National Curriculum schemes and contains one programme per year group. Get sequence slugs from GET /subjects or GET /subjects/{subject} (the sequenceSlugs field). Returns slug, phase, key stages, years, and any KS4 programme factors (exam board, tier, child subject, pathway) needed to interpret the programmes within it.\n\nNot for: the programmes within this sequence (GET /sequences/{sequence}/programmes); the unit sequence for one programme (GET /sequences/{sequence}/programmes/{programme}/units); all units across the sequence (GET /sequences/{sequence}/units); subject-level catalogue data (GET /subjects or GET /subjects/{subject}).\n\nExample: sequence=maths-primary or science-secondary-aqa.",
    "parameters": [
      {
        "in": "path",
        "name": "sequence",
        "description": "The sequence slug identifier",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The sequence slug identifier",
          "example": "art-secondary"
        }
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
  },
  {
    "path": "/sequences/{sequence}/units",
    "method": "get",
    "operationId": "getSequences-getSequenceUnits",
    "summary": "Units in a curriculum sequence",
    "description": "Use when you want every unit across a whole sequence — all programmes combined, in unit sequence order. Returns units grouped by programme (year group) in unit sequence order. If the sequence slug includes an exam board (e.g. science-secondary-aqa), units are scoped to that exam board. Secondary sequences also expose tiers, pathways, and exam subjects where applicable. Pass year as an optional filter to return only that year's units (across all KS4 factor combinations).\n\nNot for: units in a single programme (GET /sequences/{sequence}/programmes/{programme}/units); a flat list of units for a key stage + subject without programme structure or unit sequence order (GET /key-stages/{keyStage}/subject/{subject}/units); the programmes within this sequence (GET /sequences/{sequence}/programmes); a single unit (GET /units/{unit}/summary); units in a thread (GET /threads/{threadSlug}/units).\n\nExample: sequence=science-secondary-aqa or maths-primary.",
    "parameters": [
      {
        "in": "path",
        "name": "sequence",
        "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
          "example": "english-primary"
        }
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
        }
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
  },
  {
    "path": "/lessons/{lesson}/transcript",
    "method": "get",
    "operationId": "getLessonTranscript-getLessonTranscript",
    "summary": "Lesson video transcript",
    "description": "Use when you have a lesson slug and need the video transcript — for accessibility, captioning, or text analysis. Returns the transcript as an array of sentences plus a raw WebVTT captions file (vtt) suitable for a <track> element.\n\nNot for: searching across transcripts (GET /search/transcripts); the video file itself (GET /lessons/{lesson}/assets/{type} with type=video); lesson metadata (GET /lessons/{lesson}/summary).",
    "parameters": [
      {
        "in": "path",
        "name": "lesson",
        "description": "The slug of the lesson",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The slug of the lesson",
          "example": "checking-understanding-of-basic-transformations"
        }
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
  },
  {
    "path": "/search/transcripts",
    "method": "get",
    "operationId": "searchTranscripts-searchTranscripts",
    "summary": "Lesson search by video transcript",
    "description": "Use when you want to search the spoken content of lesson videos. Returns up to 5 lessons whose transcripts contain similar text, each with a transcript snippet showing the match. No filters; searches every published transcript.\n\nNot for: terms in the lesson title (GET /search/lessons); metadata for a known lesson (GET /lessons/{lesson}/summary); a transcript by slug (GET /lessons/{lesson}/transcript).\n\nExample queries: the mitochondria are the powerhouse, to be or not to be, carry the one.",
    "parameters": [
      {
        "in": "query",
        "name": "q",
        "description": "A snippet of text to search for in the lesson video transcripts",
        "required": true,
        "schema": {
          "type": "string",
          "description": "A snippet of text to search for in the lesson video transcripts",
          "example": "Who were the romans?"
        }
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
  },
  {
    "path": "/sequences/{sequence}/assets",
    "method": "get",
    "operationId": "getAssets-getSequenceAssets",
    "summary": "Downloadable assets in a sequence",
    "description": "Use when you need every downloadable asset across a whole sequence — all programmes combined. Returns assets grouped by lesson in unit sequence order, with signed download URLs, asset type, lesson title and slug, and attribution. Pass year as an optional filter. Narrow further with type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: assets in a single programme (GET /sequences/{sequence}/programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets).",
    "parameters": [
      {
        "in": "path",
        "name": "sequence",
        "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
          "example": "english-primary"
        }
      },
      {
        "in": "query",
        "name": "year",
        "schema": {
          "type": "number",
          "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.",
          "example": 3
        }
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
          "description": "Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers",
          "example": "slideDeck"
        }
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
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/assets",
    "method": "get",
    "operationId": "getAssets-getSubjectAssets",
    "summary": "Downloadable assets by key stage and subject",
    "description": "Use when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: assets across a sequence (GET /sequences/{sequence}/assets); assets in one programme (GET /sequences/{sequence}/programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).",
    "parameters": [
      {
        "in": "path",
        "name": "keyStage",
        "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
        "required": true,
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
        }
      },
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)",
        "required": true,
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
        }
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
          "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
          "example": "slideDeck"
        }
      },
      {
        "in": "query",
        "name": "unit",
        "schema": {
          "type": "string",
          "description": "Optional unit slug to additionally filter by",
          "example": "word-class"
        }
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
  },
  {
    "path": "/lessons/{lesson}/assets",
    "method": "get",
    "operationId": "getAssets-getLessonAssets",
    "summary": "Downloadable assets for a lesson",
    "description": "Use when you have a lesson slug and need the list of what's downloadable. Returns every available asset type with a signed download URL per asset and attribution. The 9 type values are: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Pass type to return only one. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: streaming the file itself (GET /lessons/{lesson}/assets/{type}); bulk asset retrieval across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/assets), a sequence (GET /sequences/{sequence}/assets), or one programme (GET /sequences/{sequence}/programmes/{programme}/assets); lesson metadata (GET /lessons/{lesson}/summary).",
    "parameters": [
      {
        "in": "path",
        "name": "lesson",
        "description": "The lesson slug identifier",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The lesson slug identifier",
          "example": "child-workers-in-the-victorian-era"
        }
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
          "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
          "example": "slideDeck"
        }
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
  },
  {
    "path": "/lessons/{lesson}/assets/{type}",
    "method": "get",
    "operationId": "getAssets-getLessonAsset",
    "summary": "Stream a lesson asset file",
    "description": "Use when you want to download one specific asset for a lesson — slide deck, worksheet, etc. Returns the file directly. Call GET /lessons/{lesson}/assets first to see which type values are available. Valid type values: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video. Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.\n\nNot for: listing which asset types a lesson has (GET /lessons/{lesson}/assets); fetching the transcript (GET /lessons/{lesson}/transcript).",
    "parameters": [
      {
        "in": "path",
        "name": "lesson",
        "description": "The lesson slug",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The lesson slug",
          "example": "child-workers-in-the-victorian-era"
        }
      },
      {
        "in": "path",
        "name": "type",
        "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
        "required": true,
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
          "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
          "example": "slideDeck"
        }
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
  },
  {
    "path": "/subjects",
    "method": "get",
    "operationId": "getSubjects-getAllSubjects",
    "summary": "All subjects",
    "description": "Use when you need every subject in one call — the entry point for a subject picker or for crawling the whole curriculum. Returns subjects alphabetically, each with subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for that subject; each sequence contains one programme per year group — call GET /sequences/{sequence}/programmes to enumerate them.\n\nNot for: a single subject (GET /subjects/{subject}); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); lessons or units inside a subject (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).",
    "parameters": [],
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
  },
  {
    "path": "/subjects/{subject}",
    "method": "get",
    "operationId": "getSubjects-getSubject",
    "summary": "Single subject with sequences, key stages, and years",
    "description": "Use when you have a subject slug. Returns subjectTitle, subjectSlug, sequenceSlugs, keyStages, and years. sequenceSlugs lists the sequences available for this subject; each sequence contains one programme per year group — call GET /sequences/{sequence}/programmes to enumerate them.\n\nNot for: every subject in one call (GET /subjects); the key stages or year groups for a subject (GET /subjects/{subject}/key-stages or GET /subjects/{subject}/years); subject-scoped lessons or units (GET /key-stages/{keyStage}/subject/{subject}/lessons or GET /key-stages/{keyStage}/subject/{subject}/units); the detail of one sequence (GET /sequences/{sequence}).\n\nExample: subject=maths.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "The slug identifier for the subject",
        "required": true,
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
        }
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
  },
  {
    "path": "/subjects/{subject}/key-stages",
    "method": "get",
    "operationId": "getSubjects-getSubjectKeyStages",
    "summary": "Key stages for a subject",
    "description": "Use when you only need the key stages where this subject is available. Returns key-stage titles and slugs.\n\nNot for: every key stage (GET /key-stages); the subject record (GET /subjects/{subject}).\n\nExample: 'subject=history'.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "The subject slug identifier",
        "required": true,
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
        }
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
  },
  {
    "path": "/subjects/{subject}/years",
    "method": "get",
    "operationId": "getSubjects-getSubjectYears",
    "summary": "Year groups for a subject",
    "description": "Use when you only need the year groups where this subject is available. Returns an array of year numbers, derived from the subject's key stages.\n\nNot for: the subject record (GET /subjects/{subject}); key stages rather than year groups (GET /subjects/{subject}/key-stages).\n\nExample: 'subject=english'.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to filter by",
        "required": true,
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
        }
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
  },
  {
    "path": "/key-stages",
    "method": "get",
    "operationId": "getKeyStages-getKeyStages",
    "summary": "All key stages",
    "description": "Use when you need the master list of key stages. Returns every key stage with its title and slug.\n\nNot for: key stages restricted to a subject (GET /subjects/{subject}/key-stages).",
    "parameters": [],
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
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/lessons",
    "method": "get",
    "operationId": "getKeyStageSubjectLessons-getKeyStageSubjectLessons",
    "summary": "List lessons in a key stage and subject",
    "description": "Use when you want every published lesson in a key stage + subject, grouped by unit, without programme structure or unit sequence order. Returns an array of units, each with slug, title, and the lessons inside. Pass unit to restrict to one. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages.\n\nNot for: finding a lesson from a search term (GET /search/lessons); a single lesson's metadata (GET /lessons/{lesson}/summary); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units).\n\nExample: keyStage=ks3, subject=maths, unit=perimeter-and-area.",
    "parameters": [
      {
        "in": "path",
        "name": "keyStage",
        "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
        "required": true,
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
        }
      },
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase",
        "required": true,
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
        }
      },
      {
        "in": "query",
        "name": "unit",
        "schema": {
          "type": "string",
          "description": "Optional unit slug to additionally filter by",
          "example": "word-class"
        }
      },
      {
        "in": "query",
        "name": "offset",
        "schema": {
          "default": 0,
          "description": "Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.",
          "type": "number",
          "example": 50
        }
      },
      {
        "in": "query",
        "name": "limit",
        "schema": {
          "default": 10,
          "description": "Offset applied to lessons within each unit (not to the unit list).",
          "type": "number",
          "maximum": 100,
          "example": 10
        }
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
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/units",
    "method": "get",
    "operationId": "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits",
    "summary": "Units in a key stage and subject",
    "description": "Use when you want a flat list of every unit with published lessons in a key stage + subject, without programme structure or unit sequence order. Returns units grouped by year slug; units without published lessons are omitted. Pass examBoard to restrict KS4 to one board (one of: aqa, edexcel (Edexcel A), eduqas, ocr, wjec, edexcelb (Edexcel B)); otherwise each unit lists the boards it appears in.\n\nNot for: all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); a single unit (GET /units/{unit}/summary); lessons rather than units (GET /key-stages/{keyStage}/subject/{subject}/lessons); units in a thread (GET /threads/{threadSlug}/units).",
    "parameters": [
      {
        "in": "path",
        "name": "keyStage",
        "description": "Key stage slug to filter by, e.g. 'ks2'",
        "required": true,
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
        }
      },
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)",
        "required": true,
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
        }
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
        }
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
  },
  {
    "path": "/keywords",
    "method": "get",
    "operationId": "getKeywords-getKeywords",
    "summary": "Keywords by subject and key stage",
    "description": "Use when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase.",
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
          ]
        }
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
          ]
        }
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
        }
      },
      {
        "in": "query",
        "name": "unit",
        "schema": {
          "type": "string"
        }
      },
      {
        "in": "query",
        "name": "lesson",
        "schema": {
          "type": "string"
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Successful response",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "keyword": {
                    "type": "string",
                    "example": "non-finite clause",
                    "description": "The keyword text"
                  },
                  "description": {
                    "type": "string",
                    "example": "a type of subordinate clause that can start with a verb in the progressive tense",
                    "description": "A description of the keyword"
                  },
                  "keyStageSlug": {
                    "type": "string",
                    "example": "ks2",
                    "description": "The key stage slug associated with this keyword"
                  },
                  "subjectSlug": {
                    "type": "string",
                    "example": "science",
                    "description": "The subject slug associated with this keyword"
                  },
                  "lessonSlugs": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "example": [
                      "a-new-sentence-structure-the-non-finite-complex-sentence",
                      "using-the-comma-rules-in-non-finite-complex-sentences",
                      "a-new-subordinate-clause-the-non-finite-ing-clause"
                    ],
                    "description": "The different lesson slugs where this keyword is used"
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
              "ref": "KeyStageSubjectKeywordsResponseSchema",
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
            }
          }
        }
      }
    }
  },
  {
    "path": "/lessons/{lesson}/quiz",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForLessons",
    "summary": "Quiz questions for a lesson",
    "description": "Use when you have a lesson slug and need its starter and exit quiz questions with correct answers marked. Returns two arrays, starterQuiz and exitQuiz; each question includes the prompt, the answers (with correct ones flagged), and which answers are distractors.\n\nNot for: quiz questions across a sequence (GET /sequences/{sequence}/questions); quiz questions in one programme (GET /sequences/{sequence}/programmes/{programme}/questions); across a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/questions); lesson metadata or assets (GET /lessons/{lesson}/summary or GET /lessons/{lesson}/assets).",
    "parameters": [
      {
        "in": "path",
        "name": "lesson",
        "description": "The lesson slug identifier",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The lesson slug identifier",
          "example": "imagining-you-are-the-characters-the-three-billy-goats-gruff"
        }
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
        }
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
  },
  {
    "path": "/sequences/{sequence}/questions",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForSequence",
    "summary": "Quiz questions across a sequence",
    "description": "Use when you want every quiz question across a whole sequence — all programmes combined. Returns questions grouped by lesson in unit sequence order. Pass year as an optional filter to return only that year's questions. Supports offset and limit; Link: rel=\"next\" header signals more pages.\n\nNot for: questions in a single programme (GET /sequences/{sequence}/programmes/{programme}/questions); a single lesson's quiz (GET /lessons/{lesson}/quiz); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).",
    "parameters": [
      {
        "in": "path",
        "name": "sequence",
        "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The sequence slug identifier, including the key stage 4 option where relevant.",
          "example": "english-primary"
        }
      },
      {
        "in": "query",
        "name": "year",
        "schema": {
          "type": "number",
          "description": "The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.",
          "example": 3
        }
      },
      {
        "in": "query",
        "name": "offset",
        "schema": {
          "default": 0,
          "type": "number",
          "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
          "example": 50
        }
      },
      {
        "in": "query",
        "name": "limit",
        "schema": {
          "default": 10,
          "type": "number",
          "maximum": 100,
          "description": "Limit the number of lessons, e.g. return a maximum of 100 lessons",
          "example": 10
        }
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
        }
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
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/questions",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForKeyStageAndSubject",
    "summary": "Quiz questions by key stage and subject",
    "description": "Use when you want every quiz question for a key stage + subject, without programme structure or unit sequence order. Returns lessons each with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages.\n\nNot for: a single lesson's quiz (GET /lessons/{lesson}/quiz); questions across a sequence (GET /sequences/{sequence}/questions); questions in one programme (GET /sequences/{sequence}/programmes/{programme}/questions).",
    "parameters": [
      {
        "in": "path",
        "name": "keyStage",
        "description": "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase",
        "required": true,
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
        }
      },
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to search by, e.g. 'science' - note that casing is important here",
        "required": true,
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
        }
      },
      {
        "in": "query",
        "name": "offset",
        "schema": {
          "default": 0,
          "type": "number",
          "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
          "example": 50
        }
      },
      {
        "in": "query",
        "name": "limit",
        "schema": {
          "default": 10,
          "type": "number",
          "maximum": 100,
          "description": "Limit the number of lessons, e.g. return a maximum of 100 lessons",
          "example": 10
        }
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
        }
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
  },
  {
    "path": "/lessons/{lesson}/summary",
    "method": "get",
    "operationId": "getLessons-getLesson",
    "summary": "Lesson summary by slug",
    "description": "Use when you have a lesson slug and need its full metadata: title, key stage, subject, unit, keywords, key learning points, misconceptions, pupil lesson outcome, teacher tips, content guidance, supervision level, and downloadsAvailable. Returns the lesson summary record.\n\nNot for: finding a lesson from a search term (GET /search/lessons); searching what's said in lesson videos (GET /search/transcripts); listing every lesson in a unit or subject (GET /key-stages/{keyStage}/subject/{subject}/lessons); the transcript or assets (GET /lessons/{lesson}/transcript or GET /lessons/{lesson}/assets).\n\nExample slug: imagining-you-are-the-characters-the-three-billy-goats-gruff.",
    "parameters": [
      {
        "in": "path",
        "name": "lesson",
        "description": "The slug of the lesson",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The slug of the lesson",
          "example": "joining-using-and"
        }
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
  },
  {
    "path": "/search/lessons",
    "method": "get",
    "operationId": "getLessons-searchByTextSimilarity",
    "summary": "Lesson search by title",
    "description": "Use when you want to find lessons whose titles match a search term. Returns up to 20 lessons ranked by title similarity — each with slug, title, URL, similarity score, and the unit(s) the lesson appears in. Optional keyStage, subject, and unit narrow the search.\n\nNot for: searching what's said in lesson videos (GET /search/transcripts); metadata for a known lesson (GET /lessons/{lesson}/summary); listing every lesson in a key stage + subject without ranking (GET /key-stages/{keyStage}/subject/{subject}/lessons).\n\nExample queries: KS3 science photosynthesis, fractions year 5, Macbeth soliloquy.",
    "parameters": [
      {
        "in": "query",
        "name": "q",
        "description": "Search query text snippet",
        "required": true,
        "schema": {
          "type": "string",
          "description": "Search query text snippet",
          "example": "gothic"
        }
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
        }
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
        }
      },
      {
        "in": "query",
        "name": "unit",
        "schema": {
          "type": "string",
          "description": "Optional unit slug to additionally filter by",
          "example": "Gothic poetry"
        }
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
  },
  {
    "path": "/units/{unit}/summary",
    "method": "get",
    "operationId": "getUnits-getUnit",
    "summary": "Unit summary by slug",
    "description": "Use when you have a unit slug and need the unit summary: title, description, key stage, subject, year, threads, prior-knowledge requirements, national-curriculum statements, and the lessons inside. Unit variant slugs (ending in -1, -2, etc.) resolve to that specific variant.\n\nNot for: listing every unit in a key stage + subject (GET /key-stages/{keyStage}/subject/{subject}/units); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); units in a thread (GET /threads/{threadSlug}/units); lessons inside the unit (GET /key-stages/{keyStage}/subject/{subject}/lessons with unit={unit}).",
    "parameters": [
      {
        "in": "path",
        "name": "unit",
        "description": "The unit slug",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The unit slug",
          "example": "programming-subroutines"
        }
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
        }
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
        }
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
        }
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
        }
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
  },
  {
    "path": "/threads",
    "method": "get",
    "operationId": "getThreads-getAllThreads",
    "summary": "All threads",
    "description": "Use when you want the catalogue of every thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — making vertical connections across year groups. Returns all threads with published units, sorted alphabetically — each with title, slug, and unitCount.\n\nNot for: the units inside a thread (GET /threads/{threadSlug}/units).",
    "parameters": [],
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
  },
  {
    "path": "/threads/{threadSlug}/units",
    "method": "get",
    "operationId": "getThreads-getThreadUnits",
    "summary": "Units in a thread",
    "description": "Use when you want every unit in a thread. A thread is an attribute on a unit that groups units across the curriculum to build a common body of knowledge — for example, number and place value or scientific method. Units in a thread span multiple programmes and key stages; thread order is independent of unit sequence order within any individual programme. Returns units in thread order with unitTitle, unitSlug, and unitOrder.\n\nNot for: the catalogue of threads (GET /threads); all units across a sequence (GET /sequences/{sequence}/units); units in one programme (GET /sequences/{sequence}/programmes/{programme}/units); a single unit (GET /units/{unit}/summary).\n\nExample: 'threadSlug=number-and-place-value'.",
    "parameters": [
      {
        "in": "path",
        "name": "threadSlug",
        "required": true,
        "schema": {
          "type": "string",
          "example": "number-multiplication-and-division"
        }
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
  },
  {
    "path": "/changelog",
    "method": "get",
    "operationId": "changelog-changelog",
    "summary": "API changelog",
    "description": "Use when you need the full history of API changes — for surfacing release notes or checking which version introduced a field. Returns every changelog entry with version and date.\n\nNot for: the current version (GET /changelog/latest).",
    "parameters": [],
    "responses": {
      "200": {
        "description": "Successful response",
        "content": {
          "application/json": {
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "version": {
                    "type": "string"
                  },
                  "date": {
                    "type": "string"
                  },
                  "changes": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "version",
                  "date",
                  "changes"
                ],
                "additionalProperties": false
              },
              "example": [
                {
                  "version": "0.7.0",
                  "date": "2026-05-21",
                  "changes": [
                    "/subjects/{subject} now exposes `ks4ProgrammeFactors.childSubject` for subjects split into child subjects at KS4 (currently science → biology, chemistry, combined-science, physics)",
                    "Removed the per-sequence `ks4Options` field from `sequenceSlugs[]` in /subjects, /subjects/{subject}, and /subjects/{subject}/sequences responses; the variant is still encoded in the sequenceSlug suffix"
                  ]
                },
                {
                  "version": "0.6.0",
                  "date": "2026-02-19",
                  "changes": [
                    "Change to how blocked content is handled, using BAD_REQUEST & .data.cause instead of 451"
                  ]
                }
              ]
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
  },
  {
    "path": "/changelog/latest",
    "method": "get",
    "operationId": "changelog-latest",
    "summary": "Latest API version",
    "description": "Use when you only need the current API version — e.g. a version banner or deployment check. Returns the most recent changelog entry.\n\nNot for: full version history (GET /changelog).",
    "parameters": [],
    "responses": {
      "200": {
        "description": "Successful response",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "version": {
                  "type": "string"
                },
                "date": {
                  "type": "string"
                },
                "changes": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": [
                "version",
                "date",
                "changes"
              ],
              "additionalProperties": false,
              "example": {
                "version": "0.7.0",
                "date": "2026-05-21",
                "changes": [
                  "/subjects/{subject} now exposes `ks4ProgrammeFactors.childSubject` for subjects split into child subjects at KS4 (currently science → biology, chemistry, combined-science, physics)",
                  "Removed the per-sequence `ks4Options` field from `sequenceSlugs[]` in /subjects, /subjects/{subject}, and /subjects/{subject}/sequences responses; the variant is still encoded in the sequenceSlug suffix"
                ]
              }
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
  },
  {
    "path": "/rate-limit",
    "method": "get",
    "operationId": "getRateLimit-getRateLimit",
    "summary": "Current rate-limit status",
    "description": "Use when you need rate-limit status as a JSON body — e.g. for a quota indicator. Returns limit, remaining, and reset. The same data sits on the 'X-RateLimit-*' headers of every response, so this endpoint is rarely needed directly. Does not count against your quota.",
    "parameters": [],
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
] as const;

export type PathOperation = (typeof PATH_OPERATIONS)[number];


/**
 * Map of operations by their operationId
 * Generated at build time for runtime use
 */
export const OPERATIONS_BY_ID = {
  "getSequences-getSubjectSequence": PATH_OPERATIONS[0],
  "getSequences-getSequenceUnits": PATH_OPERATIONS[1],
  "getLessonTranscript-getLessonTranscript": PATH_OPERATIONS[2],
  "searchTranscripts-searchTranscripts": PATH_OPERATIONS[3],
  "getAssets-getSequenceAssets": PATH_OPERATIONS[4],
  "getAssets-getSubjectAssets": PATH_OPERATIONS[5],
  "getAssets-getLessonAssets": PATH_OPERATIONS[6],
  "getAssets-getLessonAsset": PATH_OPERATIONS[7],
  "getSubjects-getAllSubjects": PATH_OPERATIONS[8],
  "getSubjects-getSubject": PATH_OPERATIONS[9],
  "getSubjects-getSubjectKeyStages": PATH_OPERATIONS[10],
  "getSubjects-getSubjectYears": PATH_OPERATIONS[11],
  "getKeyStages-getKeyStages": PATH_OPERATIONS[12],
  "getKeyStageSubjectLessons-getKeyStageSubjectLessons": PATH_OPERATIONS[13],
  "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": PATH_OPERATIONS[14],
  "getKeywords-getKeywords": PATH_OPERATIONS[15],
  "getQuestions-getQuestionsForLessons": PATH_OPERATIONS[16],
  "getQuestions-getQuestionsForSequence": PATH_OPERATIONS[17],
  "getQuestions-getQuestionsForKeyStageAndSubject": PATH_OPERATIONS[18],
  "getLessons-getLesson": PATH_OPERATIONS[19],
  "getLessons-searchByTextSimilarity": PATH_OPERATIONS[20],
  "getUnits-getUnit": PATH_OPERATIONS[21],
  "getThreads-getAllThreads": PATH_OPERATIONS[22],
  "getThreads-getThreadUnits": PATH_OPERATIONS[23],
  "changelog-changelog": PATH_OPERATIONS[24],
  "changelog-latest": PATH_OPERATIONS[25],
  "getRateLimit-getRateLimit": PATH_OPERATIONS[26]
} as const;

export type OperationIdToOperationMap = typeof OPERATIONS_BY_ID;
export type OperationId = keyof OperationIdToOperationMap;
export function isOperationId(value: string): value is OperationId { return value in OPERATIONS_BY_ID; }
export function getOperationIdByPathAndMethod(path: string, method: string): OperationId | undefined {
  const operation = PATH_OPERATIONS.find((op) => op.path === path && op.method === method);
  return operation?.operationId;
}

/**
 * All response codes
 */
export const RESPONSE_CODES = {
  "100": {numeric: 100, string: "100", description: "Continue"},
  "101": {numeric: 101, string: "101", description: "Switching Protocols"},
  "102": {numeric: 102, string: "102", description: "Processing"},
  "103": {numeric: 103, string: "103", description: "Early Hints"},
  "200": {numeric: 200, string: "200", description: "OK"},
  "201": {numeric: 201, string: "201", description: "Created"},
  "202": {numeric: 202, string: "202", description: "Accepted"},
  "203": {numeric: 203, string: "203", description: "Non-Authoritative Information"},
  "204": {numeric: 204, string: "204", description: "No Content"},
  "205": {numeric: 205, string: "205", description: "Reset Content"},
  "206": {numeric: 206, string: "206", description: "Partial Content"},
  "207": {numeric: 207, string: "207", description: "Multi-Status"},
  "208": {numeric: 208, string: "208", description: "Already Reported"},
  "226": {numeric: 226, string: "226", description: "IM Used"},
  "300": {numeric: 300, string: "300", description: "Multiple Choices"},
  "301": {numeric: 301, string: "301", description: "Moved Permanently"},
  "302": {numeric: 302, string: "302", description: "Found"},
  "303": {numeric: 303, string: "303", description: "See Other"},
  "304": {numeric: 304, string: "304", description: "Not Modified"},
  "305": {numeric: 305, string: "305", description: "Use Proxy"},
  "306": {numeric: 306, string: "306", description: "Switch Proxy"},
  "307": {numeric: 307, string: "307", description: "Temporary Redirect"},
  "308": {numeric: 308, string: "308", description: "Permanent Redirect"},
  "400": {numeric: 400, string: "400", description: "Bad Request"},
  "401": {numeric: 401, string: "401", description: "Unauthorized"},
  "402": {numeric: 402, string: "402", description: "Payment Required"},
  "403": {numeric: 403, string: "403", description: "Forbidden"},
  "404": {numeric: 404, string: "404", description: "Not Found"},
  "405": {numeric: 405, string: "405", description: "Method Not Allowed"},
  "406": {numeric: 406, string: "406", description: "Not Acceptable"},
  "407": {numeric: 407, string: "407", description: "Proxy Authentication Required"},
  "408": {numeric: 408, string: "408", description: "Request Timeout"},
  "409": {numeric: 409, string: "409", description: "Conflict"},
  "410": {numeric: 410, string: "410", description: "Gone"},
  "411": {numeric: 411, string: "411", description: "Length Required"},
  "412": {numeric: 412, string: "412", description: "Precondition Failed"},
  "413": {numeric: 413, string: "413", description: "Content Too Large"},
  "414": {numeric: 414, string: "414", description: "URI Too Long"},
  "415": {numeric: 415, string: "415", description: "Unsupported Media Type"},
  "416": {numeric: 416, string: "416", description: "Range Not Satisfiable"},
  "417": {numeric: 417, string: "417", description: "Expectation Failed"},
  "418": {numeric: 418, string: "418", description: "I'm a teapot"},
  "421": {numeric: 421, string: "421", description: "Misdirected Request"},
  "422": {numeric: 422, string: "422", description: "Unprocessable Content"},
  "423": {numeric: 423, string: "423", description: "Locked"},
  "424": {numeric: 424, string: "424", description: "Failed Dependency"},
  "425": {numeric: 425, string: "425", description: "Too Early"},
  "426": {numeric: 426, string: "426", description: "Upgrade Required"},
  "428": {numeric: 428, string: "428", description: "Precondition Required"},
  "429": {numeric: 429, string: "429", description: "Too Many Requests"},
  "431": {numeric: 431, string: "431", description: "Request Header Fields Too Large"},
  "451": {numeric: 451, string: "451", description: "Unavailable For Legal Reasons"},
  "500": {numeric: 500, string: "500", description: "Internal Server Error"},
  "501": {numeric: 501, string: "501", description: "Not Implemented"},
  "502": {numeric: 502, string: "502", description: "Bad Gateway"},
  "503": {numeric: 503, string: "503", description: "Service Unavailable"},
  "504": {numeric: 504, string: "504", description: "Gateway Timeout"},
  "505": {numeric: 505, string: "505", description: "HTTP Version Not Supported"},
  "506": {numeric: 506, string: "506", description: "Variant Also Negotiates"},
  "507": {numeric: 507, string: "507", description: "Insufficient Storage"},
  "508": {numeric: 508, string: "508", description: "Loop Detected"},
  "510": {numeric: 510, string: "510", description: "Not Extended"},
  "511": {numeric: 511, string: "511", description: "Network Authentication Required"},
} as const;
export type PossibleResponseCode = typeof RESPONSE_CODES;

export const VALID_RESPONSE_CODES = [
  "200",
  "400",
  "401",
  "404"
] as const;
export type ValidResponseCode = typeof VALID_RESPONSE_CODES[number];
export type ValidNumericResponseCode = PossibleResponseCode[ValidResponseCode]['numeric'];
export function isValidResponseCode(value: string): value is ValidResponseCode {
  const stringCodes: readonly string[] = VALID_RESPONSE_CODES;
  return stringCodes.includes(value);
}
export function areValidResponseCodes(codes: string[]): codes is ValidResponseCode[] {
  return codes.every((code) => isValidResponseCode(code));
}

export type UnknownResponseCode = Exclude<keyof PossibleResponseCode, ValidResponseCode>;
export function isUnknownResponseCode(value: string): value is UnknownResponseCode {
  const stringCodes: readonly string[] = Object.keys(RESPONSE_CODES);
  return stringCodes.includes(value) && !isValidResponseCode(value);
}

export const ERROR_RESPONSE_CODES = Object.keys(RESPONSE_CODES).filter((code) => (code.startsWith('4') || code.startsWith('5')));
export type ErrorResponseCode = typeof ERROR_RESPONSE_CODES[number];
export function isErrorResponseCode(value: string): value is ErrorResponseCode {
  const stringCodes: readonly string[] = ERROR_RESPONSE_CODES;
  return stringCodes.includes(value);
}

export function getResponseCodesForPathAndMethod(path: string, method: string): ValidResponseCode[] {
  if (!isValidPath(path)) {
    throw new TypeError('Invalid path: ' + String(path));
  }
  if (!isApiHttpMethod(method)) {
    throw new TypeError('Invalid method: ' + String(method));
  }
  const operation = PATH_OPERATIONS.find((op) => op.path === path && op.method === method);
  if (!operation) {
    throw new TypeError('Operation not found: ' + String(path) + ' ' + String(method));
  }
  const responses = operation.responses;
  const codes = Object.keys(responses);
  if (!areValidResponseCodes(codes)) {
    throw new TypeError('Invalid response codes: ' + String(codes));
  }
  return codes;
}
