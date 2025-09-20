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
import type { SchemaBase as Schema } from "./api-schema-base.js";
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
  '/lessons/{lesson}/assets': '/lessons/{lesson}/assets',
  '/lessons/{lesson}/assets/{type}': '/lessons/{lesson}/assets/{type}',
  '/lessons/{lesson}/quiz': '/lessons/{lesson}/quiz',
  '/lessons/{lesson}/summary': '/lessons/{lesson}/summary',
  '/lessons/{lesson}/transcript': '/lessons/{lesson}/transcript',
  '/rate-limit': '/rate-limit',
  '/search/lessons': '/search/lessons',
  '/search/transcripts': '/search/transcripts',
  '/sequences/{sequence}/assets': '/sequences/{sequence}/assets',
  '/sequences/{sequence}/questions': '/sequences/{sequence}/questions',
  '/sequences/{sequence}/units': '/sequences/{sequence}/units',
  '/subjects': '/subjects',
  '/subjects/{subject}': '/subjects/{subject}',
  '/subjects/{subject}/key-stages': '/subjects/{subject}/key-stages',
  '/subjects/{subject}/sequences': '/subjects/{subject}/sequences',
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

export type AllowedMethods = keyof (RawPaths[keyof RawPaths]);
const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {
  if (!isValidPath(path)) { throw new TypeError(`Invalid path: ${path}`); }
  const methods = Object.keys(schema.paths[path]);
  for (const method of methods) {
    if (method === 'get' || method === 'post' || method === 'put' || method === 'delete' || method === 'patch' || method === 'head' || method === 'options') {
      allowedMethodsSet.add(method as AllowedMethods);
    }
  }
}
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
export function isAllowedMethod(maybeMethod: string): maybeMethod is AllowedMethods {
  const methods: readonly string[] = allowedMethods;
  return methods.includes(maybeMethod);
}

// Helper types derived from schema for path/method/response typing
export type HttpMethodKeys = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';
export type AllowedMethodsForPath<P extends ValidPath> = Extract<keyof Paths[P], HttpMethodKeys>;

export type HasResponses<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Paths[P][M] extends { responses: any } ? true : false;

export type ResponsesFor<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  HasResponses<P, M> extends true ? (Paths[P][M] & { responses: any })['responses'] : never;

// Normalize 200 key to always be numeric 200
export type Normalize200<R> =
  200 extends keyof R ? R & { 200: R[200] } :
  '200' extends keyof R ? Omit<R, '200'> & { 200: R['200'] } :
  never;

export type NormalizedResponsesFor<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Normalize200<ResponsesFor<P, M>>;

export type JsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  NormalizedResponsesFor<P, M> extends infer NR
    ? NR extends never
      ? never
      : 200 extends keyof NR
        ? ('content' extends keyof NR[200]
            ? (NR[200]['content'] extends infer C
                ? ('application/json' extends keyof C ? C['application/json'] : never)
                : never)
            : never)
        : never
    : never;

export type PathReturnTypes = {
  [P in ValidPath]: {
    [M in AllowedMethodsForPath<P>]: JsonBody200<P, M>
  }
};

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
 * Lessons extracted from the API schema
 */
export const LESSONS = [] as const;
export type Lessons = typeof LESSONS;
export type Lesson = Lessons[number];
export function isLesson(value: string): value is Lesson {
  const lessons: readonly string[] = LESSONS;
  return lessons.includes(value);
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
 * Sequences extracted from the API schema
 */
export const SEQUENCES = [] as const;
export type Sequences = typeof SEQUENCES;
export type Sequence = Sequences[number];
export function isSequence(value: string): value is Sequence {
  const sequences: readonly string[] = SEQUENCES;
  return sequences.includes(value);
}

/**
 * ThreadSlugs extracted from the API schema
 */
export const THREAD_SLUGS = [] as const;
export type ThreadSlugs = typeof THREAD_SLUGS;
export type ThreadSlug = ThreadSlugs[number];
export function isThreadSlug(value: string): value is ThreadSlug {
  const threadSlugs: readonly string[] = THREAD_SLUGS;
  return threadSlugs.includes(value);
}

/**
 * Units extracted from the API schema
 */
export const UNITS = [] as const;
export type Units = typeof UNITS;
export type Unit = Units[number];
export function isUnit(value: string): value is Unit {
  const units: readonly string[] = UNITS;
  return units.includes(value);
}

/**
 * All possible path parameters extracted from the API schema
 */
export interface PathParameters {
  keyStage: KeyStages;
  subject: Subjects;
  lesson: Lessons;
  type: AssetTypes;
  sequence: Sequences;
  threadSlug: ThreadSlugs;
  unit: Units;
}

export const PATH_PARAMETERS: PathParameters = {
  keyStage: KEY_STAGES,
  subject: SUBJECTS,
  lesson: LESSONS,
  type: ASSET_TYPES,
  sequence: SEQUENCES,
  threadSlug: THREAD_SLUGS,
  unit: UNITS,
} as const;

/**
 * Type for path parameter values
 */
export type PathParameterValues = {
  [K in keyof typeof PATH_PARAMETERS]: (typeof PATH_PARAMETERS)[K][number];
};

/**
 * Type guard for parameter types
 */
export function isValidParameterType(
  parameterType: string
): parameterType is keyof PathParameterValues {
  return parameterType in PATH_PARAMETERS;
}

/**
 * Function to validate if a value is a valid parameter for a given parameter type
 */
export function isValidPathParameter<K extends keyof PathParameterValues>(
  parameterType: K,
  value: string
): value is PathParameterValues[K] {
  const allowedValues: readonly string[] = PATH_PARAMETERS[parameterType]
  return allowedValues.length === 0 ? typeof value === "string" : allowedValues.includes(value)
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
}, "lesson": {
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
}, "lesson_type": {
  "/lessons/{lesson}/assets/{type}": {
    "params": "lesson, type",
    "path": "/lessons/{lesson}/assets/{type}",
    "paramsKey": "lesson_type"
  }
}, "NO_PARAMS": {
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
}, "sequence": {
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
}, "subject": {
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
  "/subjects/{subject}/sequences": {
    "params": "subject",
    "path": "/subjects/{subject}/sequences",
    "paramsKey": "subject"
  },
  "/subjects/{subject}/years": {
    "params": "subject",
    "path": "/subjects/{subject}/years",
    "paramsKey": "subject"
  }
}, "threadSlug": {
  "/threads/{threadSlug}/units": {
    "params": "threadSlug",
    "path": "/threads/{threadSlug}/units",
    "paramsKey": "threadSlug"
  }
}, "unit": {
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
    "path": "/sequences/{sequence}/units",
    "method": "get",
    "operationId": "getSequences-getSequenceUnits",
    "summary": "Units within a sequence",
    "description": "This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.",
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
    ]
  },
  {
    "path": "/lessons/{lesson}/transcript",
    "method": "get",
    "operationId": "getLessonTranscript-getLessonTranscript",
    "summary": "Lesson transcript",
    "description": "This endpoint returns the video transcript and video captions file for a given lesson.",
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
    ]
  },
  {
    "path": "/search/transcripts",
    "method": "get",
    "operationId": "searchTranscripts-searchTranscripts",
    "summary": "Lesson search using lesson video transcripts",
    "description": "Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.",
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
    ]
  },
  {
    "path": "/sequences/{sequence}/assets",
    "method": "get",
    "operationId": "getAssets-getSequenceAssets",
    "summary": "Assets within a sequence",
    "description": "This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.\nThis endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.",
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
        "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
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
          "example": "slideDeck",
          "description": "Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers"
        }
      }
    ]
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/assets",
    "method": "get",
    "operationId": "getAssets-getSubjectAssets",
    "summary": "Assets",
    "description": "This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.",
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
        "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
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
    ]
  },
  {
    "path": "/lessons/{lesson}/assets",
    "method": "get",
    "operationId": "getAssets-getLessonAssets",
    "summary": "Downloadable lesson assets",
    "description": "This endpoint returns the types of available assets for a given lesson, and the download endpoints for each. \n        This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.\n          ",
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
        "description": "Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint",
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
          "example": "slideDeck"
        }
      }
    ]
  },
  {
    "path": "/lessons/{lesson}/assets/{type}",
    "method": "get",
    "operationId": "getAssets-getLessonAsset",
    "summary": "Lesson asset by type",
    "description": "This endpoint will stream the downloadable asset for the given lesson and type. \nThere is no response returned for this endpoint as it returns a content attachment.",
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
          "example": "slideDeck"
        }
      }
    ]
  },
  {
    "path": "/subjects",
    "method": "get",
    "operationId": "getSubjects-getAllSubjects",
    "summary": "Subjects",
    "description": "This endpoint returns an array of all available subjects and their associated sequences, key stages and years.",
    "parameters": []
  },
  {
    "path": "/subjects/{subject}",
    "method": "get",
    "operationId": "getSubjects-getSubject",
    "summary": "Subject",
    "description": "This endpoint returns the sequences, key stages and years that are currently available for a given subject.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "The slug identifier for the subject",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The slug identifier for the subject",
          "example": "art"
        }
      }
    ]
  },
  {
    "path": "/subjects/{subject}/sequences",
    "method": "get",
    "operationId": "getSubjects-getSubjectSequence",
    "summary": "Sequencing information for a given subject",
    "description": "This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "The slug identifier for the subject",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The slug identifier for the subject",
          "example": "art"
        }
      }
    ]
  },
  {
    "path": "/subjects/{subject}/key-stages",
    "method": "get",
    "operationId": "getSubjects-getSubjectKeyStages",
    "summary": "Key stages within a subject",
    "description": "This endpoint returns a list of key stages that are currently available for a given subject.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "The subject slug identifier",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The subject slug identifier",
          "example": "art"
        }
      }
    ]
  },
  {
    "path": "/subjects/{subject}/years",
    "method": "get",
    "operationId": "getSubjects-getSubjectYears",
    "summary": "Year groups for a given subject",
    "description": "This endpoint returns an array of years that are currently available for a given subject.",
    "parameters": [
      {
        "in": "path",
        "name": "subject",
        "description": "Subject slug to filter by",
        "required": true,
        "schema": {
          "type": "string",
          "example": "cooking-nutrition",
          "description": "Subject slug to filter by"
        }
      }
    ]
  },
  {
    "path": "/key-stages",
    "method": "get",
    "operationId": "getKeyStages-getKeyStages",
    "summary": "Key stages",
    "description": "This endpoint returns all the key stages (titles and slugs) that are currently available on Oak",
    "parameters": []
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/lessons",
    "method": "get",
    "operationId": "getKeyStageSubjectLessons-getKeyStageSubjectLessons",
    "summary": "Lessons",
    "description": "This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.",
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
        "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
        "schema": {
          "type": "number",
          "example": 50,
          "default": 0
        }
      },
      {
        "in": "query",
        "name": "limit",
        "description": "Limit the number of lessons, e.g. return a maximum of 100 lessons",
        "schema": {
          "type": "number",
          "maximum": 100,
          "example": 10,
          "default": 10
        }
      }
    ]
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/units",
    "method": "get",
    "operationId": "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits",
    "summary": "Units",
    "description": "This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.",
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
      }
    ]
  },
  {
    "path": "/lessons/{lesson}/quiz",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForLessons",
    "summary": "Quiz questions by lesson",
    "description": "The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.",
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
      }
    ]
  },
  {
    "path": "/sequences/{sequence}/questions",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForSequence",
    "summary": "Questions within a sequence",
    "description": "This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.",
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
        "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
        "schema": {
          "type": "number",
          "example": 50,
          "default": 0
        }
      },
      {
        "in": "query",
        "name": "limit",
        "description": "Limit the number of lessons, e.g. return a maximum of 100 lessons",
        "schema": {
          "type": "number",
          "maximum": 100,
          "example": 10,
          "default": 10
        }
      }
    ]
  },
  {
    "path": "/key-stages/{keyStage}/subject/{subject}/questions",
    "method": "get",
    "operationId": "getQuestions-getQuestionsForKeyStageAndSubject",
    "summary": "Quiz questions by subject and key stage",
    "description": "This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.",
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
        "description": "If limiting results returned, this allows you to return the next set of results, starting at the given offset point",
        "schema": {
          "type": "number",
          "example": 50,
          "default": 0
        }
      },
      {
        "in": "query",
        "name": "limit",
        "description": "Limit the number of lessons, e.g. return a maximum of 100 lessons",
        "schema": {
          "type": "number",
          "maximum": 100,
          "example": 10,
          "default": 10
        }
      }
    ]
  },
  {
    "path": "/lessons/{lesson}/summary",
    "method": "get",
    "operationId": "getLessons-getLesson",
    "summary": "Lesson summary",
    "description": "This endpoint returns a summary for a given lesson",
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
    ]
  },
  {
    "path": "/search/lessons",
    "method": "get",
    "operationId": "getLessons-searchByTextSimilarity",
    "summary": "Lesson search using lesson title",
    "description": "Search for a term and find the 20 most similar lessons with titles that contain similar text.",
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
    ]
  },
  {
    "path": "/units/{unit}/summary",
    "method": "get",
    "operationId": "getUnits-getUnit",
    "summary": "Unit summary",
    "description": "This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit",
    "parameters": [
      {
        "in": "path",
        "name": "unit",
        "description": "The unit slug",
        "required": true,
        "schema": {
          "type": "string",
          "description": "The unit slug",
          "example": "simple-compound-and-adverbial-complex-sentences"
        }
      }
    ]
  },
  {
    "path": "/threads",
    "method": "get",
    "operationId": "getThreads-getAllThreads",
    "summary": "Threads",
    "description": "This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.",
    "parameters": []
  },
  {
    "path": "/threads/{threadSlug}/units",
    "method": "get",
    "operationId": "getThreads-getThreadUnits",
    "summary": "Units belonging to a given thread",
    "description": "This endpoint returns all of the units that belong to a given thread.",
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
    ]
  },
  {
    "path": "/changelog",
    "method": "get",
    "operationId": "changelog-changelog",
    "description": "History of significant changes to the API with associated dates and versions",
    "parameters": []
  },
  {
    "path": "/changelog/latest",
    "method": "get",
    "operationId": "changelog-latest",
    "description": "Get the latest version and latest change note for the API",
    "parameters": []
  },
  {
    "path": "/rate-limit",
    "method": "get",
    "operationId": "getRateLimit-getRateLimit",
    "description": "Check your current rate limit status (note that your rate limit is also included in the headers of every response).\n\nThis specific endpoint does not cost any requests.",
    "parameters": []
  }
] as const;

export type PathOperation = (typeof PATH_OPERATIONS)[number];


/**
 * Map of operations by their operationId
 * Generated at build time for runtime use
 */
export const OPERATIONS_BY_ID = {
  "getSequences-getSequenceUnits": PATH_OPERATIONS[0],
  "getLessonTranscript-getLessonTranscript": PATH_OPERATIONS[1],
  "searchTranscripts-searchTranscripts": PATH_OPERATIONS[2],
  "getAssets-getSequenceAssets": PATH_OPERATIONS[3],
  "getAssets-getSubjectAssets": PATH_OPERATIONS[4],
  "getAssets-getLessonAssets": PATH_OPERATIONS[5],
  "getAssets-getLessonAsset": PATH_OPERATIONS[6],
  "getSubjects-getAllSubjects": PATH_OPERATIONS[7],
  "getSubjects-getSubject": PATH_OPERATIONS[8],
  "getSubjects-getSubjectSequence": PATH_OPERATIONS[9],
  "getSubjects-getSubjectKeyStages": PATH_OPERATIONS[10],
  "getSubjects-getSubjectYears": PATH_OPERATIONS[11],
  "getKeyStages-getKeyStages": PATH_OPERATIONS[12],
  "getKeyStageSubjectLessons-getKeyStageSubjectLessons": PATH_OPERATIONS[13],
  "getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits": PATH_OPERATIONS[14],
  "getQuestions-getQuestionsForLessons": PATH_OPERATIONS[15],
  "getQuestions-getQuestionsForSequence": PATH_OPERATIONS[16],
  "getQuestions-getQuestionsForKeyStageAndSubject": PATH_OPERATIONS[17],
  "getLessons-getLesson": PATH_OPERATIONS[18],
  "getLessons-searchByTextSimilarity": PATH_OPERATIONS[19],
  "getUnits-getUnit": PATH_OPERATIONS[20],
  "getThreads-getAllThreads": PATH_OPERATIONS[21],
  "getThreads-getThreadUnits": PATH_OPERATIONS[22],
  "changelog-changelog": PATH_OPERATIONS[23],
  "changelog-latest": PATH_OPERATIONS[24],
  "getRateLimit-getRateLimit": PATH_OPERATIONS[25]
} as const;

export type OperationIdToOperationMap = typeof OPERATIONS_BY_ID;
export type OperationId = keyof OperationIdToOperationMap;
export function isOperationId(value: string): value is OperationId { return value in OPERATIONS_BY_ID; }
