import { err, isErr, ok, type Result } from '@oaknational/result';
import {
  isAlias,
  isMap,
  isScalar,
  isSeq,
  parseAllDocuments,
  type Document,
  type Pair,
  type ParsedNode,
  type YAMLMap,
  type YAMLSeq,
} from 'yaml';

import type { WorkspaceAttributionConfig } from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import { decodeUtf8 } from './git-snapshot-process.js';
import { validateWorkspacePatterns } from './workspace-pattern.js';

const EXPLICIT_DIRECTIVE = /^[\t ]*%(?:YAML|TAG)(?:[\t ]|$)/mu;

export function parseWorkspaceYaml(
  bytes: Uint8Array,
  config: WorkspaceAttributionConfig,
): Result<readonly string[], EstateReviewError> {
  const decoded = decodeUtf8(bytes, `workspace manifest '${config.manifestPath}'`);
  if (isErr(decoded)) {
    return decoded;
  }
  const documents = parseDocuments(decoded.value, config);
  if (isErr(documents)) {
    return documents;
  }
  if (documents.value.length !== 1) {
    return invalidWorkspaceYaml('must contain exactly one YAML document');
  }
  const document = documents.value[0];
  if (document === undefined) {
    return invalidWorkspaceYaml('must contain exactly one YAML document');
  }
  const validated = validateDocument(document, decoded.value);
  if (isErr(validated)) {
    return validated;
  }
  const root = document.contents;
  return root === null ? invalidWorkspaceYaml('has no document root') : extractPatterns(root);
}

function parseDocuments(
  source: string,
  config: WorkspaceAttributionConfig,
): Result<readonly Document.Parsed[], EstateReviewError> {
  const options = config.yamlParser.options;
  try {
    return ok(
      parseAllDocuments(source, {
        version: options.version,
        schema: options.schema,
        strict: options.strict,
        uniqueKeys: options.uniqueKeys,
        stringKeys: options.stringKeys,
        merge: options.merge,
        resolveKnownTags: options.resolveKnownTags,
        customTags: [],
        intAsBigInt: options.intAsBigInt,
        prettyErrors: options.prettyErrors,
        logLevel: options.logLevel,
      }),
    );
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', 'workspace manifest YAML parsing failed', {
        cause,
      }),
    );
  }
}

function validateDocument(
  document: Document.Parsed,
  source: string,
): Result<undefined, EstateReviewError> {
  const parserIssue = document.errors[0] ?? document.warnings[0];
  if (parserIssue !== undefined) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', 'workspace manifest YAML is invalid', {
        cause: parserIssue,
      }),
    );
  }
  const contentStart = document.contents?.range[0] ?? source.length;
  if (EXPLICIT_DIRECTIVE.test(source.slice(0, contentStart))) {
    return invalidWorkspaceYaml('contains a forbidden YAML directive');
  }
  const root = document.contents;
  if (root === null) {
    return invalidWorkspaceYaml('has no document root');
  }
  return validateNode(root);
}

function validateNode(node: ParsedNode): Result<undefined, EstateReviewError> {
  if (isAlias(node)) {
    return invalidWorkspaceYaml('contains a forbidden alias');
  }
  if (node.tag !== undefined) {
    return invalidWorkspaceYaml('contains a forbidden explicit tag');
  }
  if (node.anchor !== undefined) {
    return invalidWorkspaceYaml('contains a forbidden anchor');
  }
  if (isMap(node)) {
    return validateMap(node);
  }
  return isSeq(node) ? validateSequence(node) : ok(undefined);
}

function validateMap(node: YAMLMap.Parsed): Result<undefined, EstateReviewError> {
  for (const pair of node.items) {
    const pairResult = validatePair(pair);
    if (isErr(pairResult)) {
      return pairResult;
    }
  }
  return ok(undefined);
}

function validatePair(
  pair: Pair<ParsedNode, ParsedNode | null>,
): Result<undefined, EstateReviewError> {
  if (isScalar(pair.key) && pair.key.value === '<<') {
    return invalidWorkspaceYaml('contains a forbidden merge key');
  }
  const keyResult = validateNode(pair.key);
  if (isErr(keyResult) || pair.value === null) {
    return keyResult;
  }
  return validateNode(pair.value);
}

function validateSequence(node: YAMLSeq.Parsed): Result<undefined, EstateReviewError> {
  for (const item of node.items) {
    const itemResult = validateNode(item);
    if (isErr(itemResult)) {
      return itemResult;
    }
  }
  return ok(undefined);
}

function extractPatterns(root: ParsedNode): Result<readonly string[], EstateReviewError> {
  if (!isMap(root)) {
    return invalidWorkspaceYaml('root must be a mapping');
  }
  const packagePairs = root.items.filter(({ key }) => isScalar(key) && key.value === 'packages');
  if (packagePairs.length !== 1) {
    return invalidWorkspaceYaml('root must contain exactly one decoded packages key');
  }
  const packages = packagePairs[0]?.value;
  if (!isSeq(packages)) {
    return invalidWorkspaceYaml('packages must be a sequence');
  }
  const patterns: string[] = [];
  for (const item of packages.items) {
    if (!isScalar(item) || typeof item.value !== 'string') {
      return invalidWorkspaceYaml('every packages item must resolve directly to a string');
    }
    patterns.push(item.value);
  }
  return validateWorkspacePatterns(patterns);
}

function invalidWorkspaceYaml(message: string): Result<never, EstateReviewError> {
  return err(new EstateReviewError('SNAPSHOT_INVALID', `workspace manifest ${message}`));
}
