import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);

/**
 * Read a JSON file and return the parsed value.
 * @param {string} filePath - Path to the JSON file.
 * @returns {unknown} Parsed JSON value.
 */
function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Check if a value is a plain object.
 * @param {unknown} value - Value to check.
 * @returns {boolean} True when value is a non-null object and not an array.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Resolve a path relative to the script directory if it is not absolute.
 * @param {string} target - File path provided by the caller.
 * @returns {string} Absolute file path.
 */
function resolvePath(target) {
  if (path.isAbsolute(target)) {
    return target;
  }
  return path.resolve(scriptDir, target);
}

/**
 * Extract a CLI argument value by flag name.
 * @param {string} flag - Flag name, e.g. "--bundle".
 * @returns {string | null} Argument value or null if not present.
 */
function readArgValue(flag) {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const candidate = args[i];
    if (candidate === flag && i + 1 < args.length) {
      return args[i + 1];
    }
  }
  return null;
}

/**
 * Track a named verification check.
 * @param {Array<{name: string, ok: boolean, details?: object}>} checks - Check list.
 * @param {string} name - Check name.
 * @param {boolean} ok - Whether the check passed.
 * @param {object | undefined} details - Optional details for the check.
 */
function recordCheck(checks, name, ok, details) {
  if (details) {
    checks.push({ name, ok, details });
    return;
  }
  checks.push({ name, ok });
}

/**
 * Recursively sort object keys for stable stringification.
 * @param {unknown} value - Input value.
 * @returns {unknown} Value with sorted object keys.
 */
function sortKeys(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeys(item));
  }
  if (!isObject(value)) {
    return value;
  }
  const keys = Object.keys(value).sort();
  const result = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    result[key] = sortKeys(value[key]);
  }
  return result;
}

/**
 * Produce a stable JSON string with sorted object keys.
 * @param {unknown} value - Value to serialise.
 * @returns {string} Stable JSON string.
 */
function stableStringify(value) {
  return JSON.stringify(sortKeys(value));
}

/**
 * Count how many schema objects explicitly include a canonicalUrl property.
 * @param {unknown} schema - OpenAPI schema object.
 * @returns {number} Count of object schemas that define canonicalUrl.
 */
function countCanonicalUrlProperties(schema) {
  if (!isObject(schema)) {
    return 0;
  }
  const components = schema.components;
  if (!isObject(components)) {
    return 0;
  }
  const schemas = components.schemas;
  if (!isObject(schemas)) {
    return 0;
  }
  let count = 0;
  for (const key in schemas) {
    const entry = schemas[key];
    count += countCanonicalUrlInSchema(entry);
  }
  return count;
}

/**
 * Determine whether a schema node represents an object that should be strict.
 * @param {unknown} schema - Schema node to inspect.
 * @returns {boolean} True when the schema looks like an object schema.
 */
function isObjectSchema(schema) {
  if (!isObject(schema)) {
    return false;
  }
  if (schema.type === 'object') {
    return true;
  }
  if ('properties' in schema && isObject(schema.properties)) {
    return true;
  }
  return false;
}

/**
 * Check whether a schema node is strict (rejects unknown keys).
 * @param {unknown} schema - Schema node to inspect.
 * @returns {boolean} True when strictness is explicitly enforced.
 */
function isStrictObjectSchema(schema) {
  if (!isObjectSchema(schema)) {
    return true;
  }
  const additional = schema.additionalProperties;
  if (additional === false) {
    return true;
  }
  const unevaluated = schema.unevaluatedProperties;
  return unevaluated === false;
}

/**
 * Count object schemas that are not explicitly strict.
 * @param {unknown} registry - Schema registry array.
 * @returns {{ total: number, nonStrict: number }} Counts.
 */
function countNonStrictSchemas(registry) {
  if (!Array.isArray(registry)) {
    return { total: 0, nonStrict: 0 };
  }
  let total = 0;
  let nonStrict = 0;
  for (let i = 0; i < registry.length; i += 1) {
    const entry = registry[i];
    if (!isObject(entry)) {
      continue;
    }
    if (!('jsonSchema' in entry)) {
      continue;
    }
    const jsonSchema = entry.jsonSchema;
    if (isObjectSchema(jsonSchema)) {
      total += 1;
      if (!isStrictObjectSchema(jsonSchema)) {
        nonStrict += 1;
      }
    }
  }
  return { total, nonStrict };
}

/**
 * Extract operation identifiers from an OpenAPI schema.
 * @param {unknown} schema - OpenAPI schema object.
 * @returns {Array<{ path: string, method: string, operationId: string | null }>} operations.
 */
function collectOperations(schema) {
  if (!isObject(schema)) {
    return [];
  }
  const paths = schema.paths;
  if (!isObject(paths)) {
    return [];
  }
  const methods = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'];
  const operations = [];
  for (const pathKey of Object.keys(paths)) {
    const pathItem = paths[pathKey];
    if (!isObject(pathItem)) {
      continue;
    }
    for (let i = 0; i < methods.length; i += 1) {
      const method = methods[i];
      const candidate = pathItem[method];
      if (!isObject(candidate)) {
        continue;
      }
      const operationId = typeof candidate.operationId === 'string' ? candidate.operationId : null;
      operations.push({ path: pathKey, method, operationId });
    }
  }
  return operations;
}

/**
 * Check if an array is sorted by a key selector.
 * @param {Array<unknown>} list - Array to check.
 * @param {(item: unknown) => string} selector - Key selector.
 * @returns {boolean} True when sorted ascending.
 */
function isSortedBy(list, selector) {
  if (!Array.isArray(list)) {
    return true;
  }
  let previous = '';
  for (let i = 0; i < list.length; i += 1) {
    const key = selector(list[i]);
    if (i > 0 && key < previous) {
      return false;
    }
    previous = key;
  }
  return true;
}

/**
 * Recursively inspect a schema object for canonicalUrl properties.
 * @param {unknown} schema - Schema node to inspect.
 * @returns {number} Count of canonicalUrl-bearing objects in this node.
 */
function countCanonicalUrlInSchema(schema) {
  if (!isObject(schema)) {
    return 0;
  }

  let count = 0;

  if (schema.type === 'object' && isObject(schema.properties)) {
    if ('canonicalUrl' in schema.properties) {
      count += 1;
    }
    for (const key in schema.properties) {
      count += countCanonicalUrlInSchema(schema.properties[key]);
    }
  }

  if (schema.type === 'array') {
    const items = schema.items;
    if (items !== undefined) {
      count += countCanonicalUrlInSchema(items);
    }
  }

  const combinators = ['anyOf', 'oneOf', 'allOf'];
  for (let i = 0; i < combinators.length; i += 1) {
    const key = combinators[i];
    const value = schema[key];
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j += 1) {
        count += countCanonicalUrlInSchema(value[j]);
      }
    }
  }

  return count;
}

/**
 * Check whether the transcript endpoint documents a 404 response.
 * @param {unknown} schema - OpenAPI schema object.
 * @returns {boolean} True when the 404 response exists.
 */
function hasTranscript404(schema) {
  if (!isObject(schema)) {
    return false;
  }
  const paths = schema.paths;
  if (!isObject(paths)) {
    return false;
  }
  const pathItem = paths['/lessons/{lesson}/transcript'];
  if (!isObject(pathItem)) {
    return false;
  }
  const getOperation = pathItem.get;
  if (!isObject(getOperation)) {
    return false;
  }
  const responses = getOperation.responses;
  if (!isObject(responses)) {
    return false;
  }
  return '404' in responses;
}

/**
 * Validate minimal OpenAPI 3.x structure.
 * @param {unknown} schema - Parsed schema.
 * @returns {boolean} True when schema looks like OpenAPI 3.x.
 */
function isOpenApi3(schema) {
  if (!isObject(schema)) {
    return false;
  }
  const openapi = schema.openapi;
  return typeof openapi === 'string' && openapi.startsWith('3.');
}

/**
 * Perform minimal bundle checks when a bundle manifest is provided.
 * @param {unknown} bundle - Parsed bundle manifest.
 * @param {string} bundlePath - Path to the bundle manifest.
 * @param {Array<{name: string, ok: boolean, details?: object}>} checks - Check list.
 */
function checkBundle(bundle, bundlePath, checks) {
  if (!isObject(bundle)) {
    recordCheck(checks, 'bundle.isObject', false, { path: bundlePath });
    return;
  }

  const versionOk = bundle.schemaVersion === 'castr-bundle/1';
  recordCheck(checks, 'bundle.schemaVersion', versionOk, { value: bundle.schemaVersion });

  const bundleDir = path.dirname(bundlePath);
  const fileRefs = ['ir', 'schemas', 'endpoints'];
  for (let i = 0; i < fileRefs.length; i += 1) {
    const key = fileRefs[i];
    const value = bundle[key];
    const isString = typeof value === 'string' && value.length > 0;
    recordCheck(checks, `bundle.${key}.isString`, isString);
    if (isString) {
      const resolved = path.resolve(bundleDir, value);
      recordCheck(checks, `bundle.${key}.exists`, fs.existsSync(resolved), { path: resolved });
    }
  }

  const emit = bundle.emit;
  const emitOk = isObject(emit);
  recordCheck(checks, 'bundle.emit.isObject', emitOk);
  if (!emitOk) {
    return;
  }

  const emitKeys = ['zod', 'typescript', 'openapi'];
  for (let i = 0; i < emitKeys.length; i += 1) {
    const key = emitKeys[i];
    const value = emit[key];
    const isString = typeof value === 'string' && value.length > 0;
    recordCheck(checks, `bundle.emit.${key}.isString`, isString);
    if (!isString) {
      continue;
    }
    const resolved = path.resolve(bundleDir, value);
    recordCheck(checks, `bundle.emit.${key}.exists`, fs.existsSync(resolved), { path: resolved });
  }

  const openApiPath = emit.openapi;
  if (typeof openApiPath === 'string' && openApiPath.length > 0) {
    const resolvedOpenApi = path.resolve(bundleDir, openApiPath);
    if (fs.existsSync(resolvedOpenApi)) {
      const openApi = readJson(resolvedOpenApi);
      recordCheck(checks, 'bundle.emit.openapi.isOpenApi3', isOpenApi3(openApi));
    }
  }

  const tsPath = emit.typescript;
  if (typeof tsPath === 'string' && tsPath.length > 0) {
    const resolvedTs = path.resolve(bundleDir, tsPath);
    if (fs.existsSync(resolvedTs)) {
      const tsSource = fs.readFileSync(resolvedTs, 'utf8');
      const hasPaths = /export\\s+(interface|type)\\s+paths\\b/.test(tsSource);
      const hasComponents = /export\\s+(interface|type)\\s+components\\b/.test(tsSource);
      recordCheck(checks, 'typescript.output.pathsType', hasPaths);
      recordCheck(checks, 'typescript.output.componentsType', hasComponents);
    }
  }
}

/**
 * Main entry point for verification.
 */
function main() {
  const checks = [];

  const fixturesDirArg = readArgValue('--dir');
  const fixturesDir = fixturesDirArg ? resolvePath(fixturesDirArg) : scriptDir;

  const originalPath = path.resolve(fixturesDir, 'api-schema-original.json');
  const sdkPath = path.resolve(fixturesDir, 'api-schema-sdk.json');

  recordCheck(checks, 'original.exists', fs.existsSync(originalPath), { path: originalPath });
  recordCheck(checks, 'sdk.exists', fs.existsSync(sdkPath), { path: sdkPath });

  if (!fs.existsSync(originalPath) || !fs.existsSync(sdkPath)) {
    const ok = false;
    console.log(JSON.stringify({ ok, checks }, null, 2));
    process.exit(1);
    return;
  }

  const original = readJson(originalPath);
  const sdk = readJson(sdkPath);

  recordCheck(checks, 'original.openapi3', isOpenApi3(original));
  recordCheck(checks, 'sdk.openapi3', isOpenApi3(sdk));

  const originalCanonicalCount = countCanonicalUrlProperties(original);
  const sdkCanonicalCount = countCanonicalUrlProperties(sdk);

  recordCheck(checks, 'canonicalUrl.original.count', originalCanonicalCount === 0, {
    count: originalCanonicalCount
  });
  recordCheck(checks, 'canonicalUrl.sdk.count', sdkCanonicalCount > 0, {
    count: sdkCanonicalCount
  });

  const sdkHas404 = hasTranscript404(sdk);
  const originalHas404 = hasTranscript404(original);

  recordCheck(checks, 'transcript404.sdk', sdkHas404);
  recordCheck(checks, 'transcript404.original', !originalHas404, {
    originalHas404
  });

  const bundleArg = readArgValue('--bundle');
  if (bundleArg) {
    const bundlePath = resolvePath(bundleArg);
    recordCheck(checks, 'bundle.exists', fs.existsSync(bundlePath), { path: bundlePath });
    if (fs.existsSync(bundlePath)) {
      const bundle = readJson(bundlePath);
      checkBundle(bundle, bundlePath, checks);

      if (isObject(bundle)) {
        const bundleDir = path.dirname(bundlePath);
        const irPath = typeof bundle.ir === 'string' ? path.resolve(bundleDir, bundle.ir) : null;
        if (irPath && fs.existsSync(irPath)) {
          const ir = readJson(irPath);
          const policyOk =
            isObject(ir) &&
            isObject(ir.policy) &&
            ir.policy.strictObjects === true &&
            ir.policy.failFast === true &&
            ir.policy.losslessOpenApi === true;
          recordCheck(checks, 'ir.policy.strictFailFastLossless', policyOk);
        }

        const schemasPath =
          typeof bundle.schemas === 'string' ? path.resolve(bundleDir, bundle.schemas) : null;
        if (schemasPath && fs.existsSync(schemasPath)) {
          const registry = readJson(schemasPath);
          const strictCounts = countNonStrictSchemas(registry);
          const strictOk = strictCounts.nonStrict === 0;
          recordCheck(checks, 'schemas.strictObjects', strictOk, strictCounts);
          const sortedOk = isSortedBy(registry, (entry) =>
            isObject(entry) && typeof entry.name === 'string' ? entry.name : '',
          );
          recordCheck(checks, 'schemas.sortedByName', sortedOk);
        }

        const endpointsPath =
          typeof bundle.endpoints === 'string' ? path.resolve(bundleDir, bundle.endpoints) : null;
        if (endpointsPath && fs.existsSync(endpointsPath)) {
          const endpoints = readJson(endpointsPath);
          const sortedOk = isSortedBy(endpoints, (entry) => {
            if (!isObject(entry)) {
              return '';
            }
            const method = typeof entry.method === 'string' ? entry.method : '';
            const pathValue = typeof entry.path === 'string' ? entry.path : '';
            return `${method} ${pathValue}`;
          });
          recordCheck(checks, 'endpoints.sortedByMethodPath', sortedOk);
        }

        const openApiPath =
          isObject(bundle.emit) && typeof bundle.emit.openapi === 'string'
            ? path.resolve(bundleDir, bundle.emit.openapi)
            : null;
        if (openApiPath && fs.existsSync(openApiPath)) {
          const openApi = readJson(openApiPath);
          const openApiOk = isOpenApi3(openApi);
          recordCheck(checks, 'openapi.output.isOpenApi3', openApiOk);
          if (openApiOk) {
            const reference = sdk;
            const stableEqual =
              stableStringify(reference) === stableStringify(openApi);
            recordCheck(checks, 'openapi.output.lossless', stableEqual);

            const referenceOps = collectOperations(reference);
            const outputOps = collectOperations(openApi);
            const operationCountOk = referenceOps.length === outputOps.length;
            recordCheck(checks, 'openapi.output.operationCount', operationCountOk, {
              expected: referenceOps.length,
              actual: outputOps.length
            });

            const referenceIds = referenceOps
              .map((op) => op.operationId)
              .filter((value) => typeof value === 'string')
              .sort();
            const outputIds = outputOps
              .map((op) => op.operationId)
              .filter((value) => typeof value === 'string')
              .sort();
            const idsOk = referenceIds.length === outputIds.length &&
              referenceIds.every((id, index) => id === outputIds[index]);
            recordCheck(checks, 'openapi.output.operationIds', idsOk, {
              expected: referenceIds.length,
              actual: outputIds.length
            });
          }
        }
      }
    }
  }

  let ok = true;
  for (let i = 0; i < checks.length; i += 1) {
    if (!checks[i].ok) {
      ok = false;
      break;
    }
  }

  console.log(JSON.stringify({ ok, checks }, null, 2));
  process.exit(ok ? 0 : 1);
}

main();
