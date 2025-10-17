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

// Normalize 200 key to always be numeric 200
export type Normalize200<R> =
  200 extends keyof R ? R & { 200: R[200] } :
  '200' extends keyof R ? Omit<R, '200'> & { 200: R['200'] } :
  never;

export type NormalizedResponsesFor<P extends ValidPath, M extends AllowedMethodsForPath<P>> =
  Normalize200<ResponseForPathAndMethod<P, M>>;

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
export const PATH_OPERATIONS = [] as const;

export type PathOperation = (typeof PATH_OPERATIONS)[number];


/**
 * Map of operations by their operationId
 * Generated at build time for runtime use
 */
export const OPERATIONS_BY_ID = {} as const;

export type OperationId = never;
