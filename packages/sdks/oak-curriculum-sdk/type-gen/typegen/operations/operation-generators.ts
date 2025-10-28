import type { ExtractedOperation } from './operation-extraction.js';

/**
 * Generate TypeScript code for PATH_OPERATIONS constant
 */
export function generatePathOperationsConstant(operations: ExtractedOperation[]): string {
  const operationsJson = JSON.stringify(operations, null, 2);

  return `
/**
 * All path operations extracted from the OpenAPI schema
 * Generated at build time for runtime use
 */
export const PATH_OPERATIONS = ${operationsJson} as const;

export type PathOperation = (typeof PATH_OPERATIONS)[number];
`;
}

/**
 * Generate TypeScript code for OPERATIONS_BY_ID map
 */
export function generateOperationsByIdConstant(operations: ExtractedOperation[]): string {
  const operationsWithId = operations.filter((operation) => operation.operationId);

  if (operationsWithId.length === 0) {
    return `
/**
 * Map of operations by their operationId
 * Generated at build time for runtime use
 */
export const OPERATIONS_BY_ID = {} as const;

export type OperationId = never;
`;
  }

  const entries = operationsWithId
    .map((operation) => {
      const originalIndex = operations.indexOf(operation);
      return `  "${operation.operationId ?? ''}": PATH_OPERATIONS[${String(originalIndex)}]`;
    })
    .join(',\n');

  const validResponseCodes = Array.from(
    new Set(
      operationsWithId.flatMap((op) => {
        const responses = op.responses;
        if (!responses) {
          return [];
        }
        const codes = Object.keys(responses);
        return codes;
      }),
    ),
  );

  const validResponseCodesJson = JSON.stringify(validResponseCodes, null, 2);

  return `
/**
 * Map of operations by their operationId
 * Generated at build time for runtime use
 */
export const OPERATIONS_BY_ID = {
${entries}
} as const;

export type OperationIdToOperationMap = typeof OPERATIONS_BY_ID;
export type OperationId = keyof OperationIdToOperationMap;
export function isOperationId(value: string): value is OperationId { return value in OPERATIONS_BY_ID; }
export function getOperationIdByPathAndMethod(path: string, method: string): OperationId | undefined {
  const operation = PATH_OPERATIONS.find((op) => op.path === path && op.method === method);
  return operation?.operationId;
}

export type ResponsesForPath<P extends ValidPath> = PathOperation['path'] extends P ? PathOperation['responses'] : never;
export type ResponseForPathAndMethod<P extends ValidPath, M extends AllowedMethodsForPath<P>> = // if path extends p and method extends m, then return the responses
  PathOperation['path'] extends P ? PathOperation['method'] extends M ? PathOperation['responses'] : never : never;

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

export const VALID_RESPONSE_CODES = ${validResponseCodesJson} as const;
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
  if (!isAllowedMethod(method)) {
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
`;
}

/**
 * Generate TypeScript code for ALLOWED_METHODS constant
 * Note: This doesn't generate isAllowedMethod as it's already generated
 * by the runtime schema checks
 */
export function generateAllowedMethodsConstant(methods: string[]): string {
  const methodsJson = JSON.stringify(methods, null, 2);

  return `
/**
 * All HTTP methods used in the API (from PATH_OPERATIONS)
 * Generated at build time for runtime use
 */
export const ALLOWED_METHODS = ${methodsJson} as const;
`;
}

/**
 * Generate all operation-related constants
 */
export function generateOperationConstants(operations: ExtractedOperation[]): string {
  const sections = [
    generatePathOperationsConstant(operations),
    generateOperationsByIdConstant(operations),
  ];

  return sections.join('\n');
}
