/**
 * Global DTCG token reference pattern — matches `{group.token-name}` within strings.
 *
 * @remarks
 * The inner pattern `[a-z0-9-]+(?:\.[a-z0-9-]+)*` is shared with
 * `REFERENCE_PATTERN` in `contrast-validation.ts` (anchored variant). Both
 * must be updated together if the DTCG reference syntax changes.
 */
const TOKEN_REFERENCE_PATTERN = /\{([a-z0-9-]+(?:\.[a-z0-9-]+)*)\}/giu;

type TokenTier = 'palette' | 'semantic' | 'component';

type DtcgTokenValue = boolean | number | string;

interface DtcgTokenLeaf {
  readonly $type?: string;
  readonly $value: DtcgTokenValue;
  readonly $description?: string;
}

export interface DtcgTokenTree {
  readonly $description?: string;
  readonly [key: string]: DtcgTokenLeaf | DtcgTokenTree | string | undefined;
}

export interface FlattenedDesignToken {
  readonly path: readonly string[];
  readonly cssVariable: string;
  readonly cssValue: string;
}

function isTokenObject(value: unknown): value is DtcgTokenTree | DtcgTokenLeaf {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDtcgTokenLeaf(value: unknown): value is DtcgTokenLeaf {
  return isTokenObject(value) && '$value' in value;
}

function isDtcgTokenTree(value: unknown): value is DtcgTokenTree {
  return isTokenObject(value) && !('$value' in value);
}

function getTokenTier(path: readonly string[]): TokenTier {
  const [rootSegment] = path;

  if (rootSegment === 'semantic') {
    return 'semantic';
  }

  if (rootSegment === 'component') {
    return 'component';
  }

  return 'palette';
}

function normalizePathSegment(segment: string): string {
  return segment
    .trim()
    .replace(/[^a-z0-9-]+/giu, '-')
    .toLowerCase();
}

function toCssVariable(path: readonly string[]): string {
  return `--oak-${path.map(normalizePathSegment).join('-')}`;
}

function extractTokenReferences(value: DtcgTokenValue): readonly string[][] {
  if (typeof value !== 'string') {
    return [];
  }

  return [...value.matchAll(TOKEN_REFERENCE_PATTERN)].map((match) => match[1].split('.'));
}

function resolveCssValue(value: DtcgTokenValue): string {
  if (typeof value !== 'string') {
    return String(value);
  }

  return value.replace(
    TOKEN_REFERENCE_PATTERN,
    (_match, tokenPath: string) => `var(${toCssVariable(tokenPath.split('.'))})`,
  );
}

function validateTokenReferenceDirection(
  tokenTier: TokenTier,
  references: readonly string[][],
): void {
  if (tokenTier === 'palette' && references.length > 0) {
    throw new Error('Palette tokens must use raw values.');
  }

  if (
    tokenTier === 'semantic' &&
    references.some((referencePath) => getTokenTier(referencePath) !== 'palette')
  ) {
    throw new Error('Semantic tokens must reference palette tokens.');
  }

  if (
    tokenTier === 'component' &&
    references.some((referencePath) => getTokenTier(referencePath) !== 'semantic')
  ) {
    throw new Error('Component tokens must reference semantic tokens.');
  }
}

function walkTokenTree(
  tokenNode: DtcgTokenTree | DtcgTokenLeaf,
  path: readonly string[],
  onLeaf: (token: DtcgTokenLeaf, path: readonly string[]) => void,
): void {
  if (isDtcgTokenLeaf(tokenNode)) {
    onLeaf(tokenNode, path);
    return;
  }

  for (const segment in tokenNode) {
    if (!Object.hasOwn(tokenNode, segment)) {
      continue;
    }

    const childNode = tokenNode[segment];

    if (segment.startsWith('$')) {
      continue;
    }

    if (isDtcgTokenLeaf(childNode) || isDtcgTokenTree(childNode)) {
      walkTokenTree(childNode, [...path, segment], onLeaf);
      continue;
    }

    throw new Error(`Invalid token node at '${[...path, segment].join('.')}'.`);
  }
}

export function validateTierReferences(tokenTree: DtcgTokenTree): void {
  walkTokenTree(tokenTree, [], (token, path) => {
    const tokenTier = getTokenTier(path);
    const references = extractTokenReferences(token.$value);

    validateTokenReferenceDirection(tokenTier, references);
  });
}

export function flattenDesignTokens(tokenTree: DtcgTokenTree): readonly FlattenedDesignToken[] {
  validateTierReferences(tokenTree);

  const flattenedTokens: FlattenedDesignToken[] = [];

  walkTokenTree(tokenTree, [], (token, path) => {
    flattenedTokens.push({
      path,
      cssVariable: toCssVariable(path),
      cssValue: resolveCssValue(token.$value),
    });
  });

  return flattenedTokens;
}

export function emitCssVariables(tokens: readonly FlattenedDesignToken[]): readonly string[] {
  return tokens.map((token) => `  ${token.cssVariable}: ${token.cssValue};`);
}

export function createCssBlock(selector: string, tokens: readonly FlattenedDesignToken[]): string {
  const cssVariables = emitCssVariables(tokens);

  return [`${selector} {`, ...cssVariables, '}'].join('\n');
}

// ---------------------------------------------------------------------------
// Contrast validation re-exports
// ---------------------------------------------------------------------------

export {
  hexToSrgb,
  srgbToRelativeLuminance,
  contrastRatio,
  checkWcagAA,
  checkNonTextContrast,
} from './contrast.js';

export { resolveTokenTreeToHex } from './contrast-resolve.js';

export { validateContrastPairings } from './contrast-validation.js';

export type {
  SrgbColour,
  ContrastPair,
  ContrastTriad,
  ContrastManifest,
  ContrastReportEntry,
  ContrastReport,
  ContrastValidationError,
} from './contrast-types.js';
