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
import type { Schema } from "./api-schema";
import { schema } from "./api-schema";


type ValidPath = keyof Paths;
/**
 * Convenience map for all the paths
 */
export const PATHS = {
"/changelog": "/changelog",
"/changelog/latest": "/changelog/latest",
"/key-stages": "/key-stages",
"/key-stages/{keyStage}/subject/{subject}/assets": "/key-stages/{keyStage}/subject/{subject}/assets",
"/key-stages/{keyStage}/subject/{subject}/lessons": "/key-stages/{keyStage}/subject/{subject}/lessons",
"/key-stages/{keyStage}/subject/{subject}/questions": "/key-stages/{keyStage}/subject/{subject}/questions",
"/key-stages/{keyStage}/subject/{subject}/units": "/key-stages/{keyStage}/subject/{subject}/units",
"/lessons/{lesson}/assets": "/lessons/{lesson}/assets",
"/lessons/{lesson}/assets/{type}": "/lessons/{lesson}/assets/{type}",
"/lessons/{lesson}/quiz": "/lessons/{lesson}/quiz",
"/lessons/{lesson}/summary": "/lessons/{lesson}/summary",
"/lessons/{lesson}/transcript": "/lessons/{lesson}/transcript",
"/rate-limit": "/rate-limit",
"/search/lessons": "/search/lessons",
"/search/transcripts": "/search/transcripts",
"/sequences/{sequence}/assets": "/sequences/{sequence}/assets",
"/sequences/{sequence}/questions": "/sequences/{sequence}/questions",
"/sequences/{sequence}/units": "/sequences/{sequence}/units",
"/subjects": "/subjects",
"/subjects/{subject}": "/subjects/{subject}",
"/subjects/{subject}/key-stages": "/subjects/{subject}/key-stages",
"/subjects/{subject}/sequences": "/subjects/{subject}/sequences",
"/subjects/{subject}/years": "/subjects/{subject}/years",
"/threads": "/threads",
"/threads/{threadSlug}/units": "/threads/{threadSlug}/units",
"/units/{unit}/summary": "/units/{unit}/summary"
} as const;

/**
 * Types derived from the runtime schema object.
*/
type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;

// A union type of the allowed methods for all paths
type AllowedMethods = keyof (RawPaths[keyof RawPaths]);

const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {
  if (!isValidPath(path)) {
    throw new TypeError(`Invalid path: ${path}`);
  }
  const methods = Object.keys(schema.paths[path]);
  for (const method of methods) {
    allowedMethodsSet.add(method as AllowedMethods);
  }
}

// The full set of allowed methods for all paths.
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
export function isAllowedMethod(
  maybeMethod: string
): maybeMethod is AllowedMethods {
  const methods: readonly string[] = allowedMethods;
  return methods.includes(maybeMethod);
}

/**
 * For each path, and each method within that path,
 * map to the return type of a 200 response.
 * 
 * This works because the raw schema type and the OpenAPI-TS type use the path as the key.
 */
export type PathReturnTypes = {
  [P in ValidPath]: {
    "get": Paths[P]["get"]["responses"][200]["content"]["application/json"];
  }
};


/**
 * Key stages extracted from the API schema
 */
export const KEY_STAGES = [
  "ks1",
  "ks2",
  "ks3",
  "ks4"
] as const;
type KeyStages = typeof KEY_STAGES;
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
type Subjects = typeof SUBJECTS;
export type Subject = Subjects[number];
export function isSubject(value: string): value is Subject {
  const subjects: readonly string[] = SUBJECTS;
  return subjects.includes(value);
}

/**
 * Lessons extracted from the API schema
 */
export const LESSONS = [] as const;
type Lessons = typeof LESSONS;
export type Lesson = Lessons[number];
export function isLesson(value: string): value is Lesson {
  const lessons: readonly string[] = LESSONS;
  return lessons.includes(value);
}

/**
 * Asset types extracted from the API schema
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
type AssetTypes = typeof ASSET_TYPES;
export type AssetType = AssetTypes[number];
export function isAssetType(value: string): value is AssetType {
  const assetTypes: readonly string[] = ASSET_TYPES;
  return assetTypes.includes(value);
} 

/**
 * Sequence types extracted from the API schema
 */
export const SEQUENCE_TYPES = [] as const;
type SequenceTypes = typeof SEQUENCE_TYPES;
export type SequenceType = SequenceTypes[number];
export function isSequenceType(value: string): value is SequenceType {
  const sequenceTypes: readonly string[] = SEQUENCE_TYPES;
  return sequenceTypes.includes(value);
}

/**
 * Thread slugs extracted from the API schema
 */
export const THREAD_SLUGS = [] as const;
type ThreadSlugs = typeof THREAD_SLUGS;
export type ThreadSlug = ThreadSlugs[number];
export function isThreadSlug(value: string): value is ThreadSlug {
  const threadSlugs: readonly string[] = THREAD_SLUGS;
  return threadSlugs.includes(value);
}

/**
 * Units extracted from the API schema
 */
export const UNITS = [] as const;
type Units = typeof UNITS;
export type Unit = Units[number];
export function isUnit(value: string): value is Unit {
  const units: readonly string[] = UNITS;
  return units.includes(value);
}

/**
 * All possible path parameters extracted from the API schema
 */
interface PathParameters {
  keyStage: KeyStages;
  subject: Subjects;
  lesson: Lessons;
  type: AssetTypes;
  sequence: SequenceTypes;
  threadSlug: ThreadSlugs;
  unit: Units;
}

export const PATH_PARAMETERS: PathParameters = {
  keyStage: KEY_STAGES,
  subject: SUBJECTS,
  lesson: LESSONS,
  type: ASSET_TYPES,
  sequence: SEQUENCE_TYPES,
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
type PathGroupingKeys = "NO_PARAMS" | "keyStage_AND_subject" | "lesson" | "lesson_AND_type" | "sequence" | "subject" | "threadSlug" | "unit"  ;


/**
 * Type for a valid parameter combination, linking to the paths types file.
 */
// Parametrise ValidParameterCombination with both the path and the path key
interface ValidParameterCombination<
  P extends ValidPath,
  K extends PathGroupingKeys
> {
  params?: string;
  path: P;
  paramsKey: K; // This ensures paramsKey matches the K type parameter, enabling type narrowing based on the path key
}

// Make ValidPathAndParameters parameterized by the path key K
type ValidPathAndParameters<K extends PathGroupingKeys> = {
  // Only include paths that are valid for this specific K
  [P in ValidPath as P extends keyof Paths ? P : never]?: ValidParameterCombination<P, K>;
};

// Now ValidPathGroupings maps each key to only its relevant paths
type ValidPathGroupings = {
  [K in PathGroupingKeys]: ValidPathAndParameters<K>;
};



/**
 * Valid combinations of parameters for different paths
 */
export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings = {
"keyStage_AND_subject": {
  "/key-stages/{keyStage}/subject/{subject}/assets": {
    "params": "keyStage, subject",
    "path": "/key-stages/{keyStage}/subject/{subject}/assets",
    "paramsKey": "keyStage_AND_subject"
  },
  "/key-stages/{keyStage}/subject/{subject}/lessons": {
    "params": "keyStage, subject",
    "path": "/key-stages/{keyStage}/subject/{subject}/lessons",
    "paramsKey": "keyStage_AND_subject"
  },
  "/key-stages/{keyStage}/subject/{subject}/questions": {
    "params": "keyStage, subject",
    "path": "/key-stages/{keyStage}/subject/{subject}/questions",
    "paramsKey": "keyStage_AND_subject"
  },
  "/key-stages/{keyStage}/subject/{subject}/units": {
    "params": "keyStage, subject",
    "path": "/key-stages/{keyStage}/subject/{subject}/units",
    "paramsKey": "keyStage_AND_subject"
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
}, "lesson_AND_type": {
  "/lessons/{lesson}/assets/{type}": {
    "params": "lesson, type",
    "path": "/lessons/{lesson}/assets/{type}",
    "paramsKey": "lesson_AND_type"
  }
}, "NO_PARAMS": {
  "/changelog": {
    "params": "",
    "path": "/changelog",
    "paramsKey": "NO_PARAMS"
  },
  "/changelog/latest": {
    "params": "",
    "path": "/changelog/latest",
    "paramsKey": "NO_PARAMS"
  },
  "/key-stages": {
    "params": "",
    "path": "/key-stages",
    "paramsKey": "NO_PARAMS"
  },
  "/rate-limit": {
    "params": "",
    "path": "/rate-limit",
    "paramsKey": "NO_PARAMS"
  },
  "/search/lessons": {
    "params": "",
    "path": "/search/lessons",
    "paramsKey": "NO_PARAMS"
  },
  "/search/transcripts": {
    "params": "",
    "path": "/search/transcripts",
    "paramsKey": "NO_PARAMS"
  },
  "/subjects": {
    "params": "",
    "path": "/subjects",
    "paramsKey": "NO_PARAMS"
  },
  "/threads": {
    "params": "",
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
