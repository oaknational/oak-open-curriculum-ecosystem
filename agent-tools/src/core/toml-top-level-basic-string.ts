import { parse } from 'smol-toml';

/**
 * Reads decoded top-level TOML basic-string values from one parsed document.
 */
export interface TopLevelTomlBasicStringReader {
  (key: string): string | null;
  inspect(key: string): TopLevelTomlBasicStringState;
}

/**
 * Preserves whether a top-level key is absent, a string, or another TOML type.
 */
type TopLevelTomlBasicStringState =
  | { readonly kind: 'missing' }
  | { readonly kind: 'string'; readonly value: string }
  | { readonly kind: 'non-string' };

/**
 * Parse a TOML document once and create a top-level basic-string reader.
 *
 * Parsing errors intentionally propagate so each consumer can apply the error
 * boundary appropriate to its context. Runtime configuration resolution may
 * fail fast, while validators can convert the error into a file-scoped issue.
 *
 * @param content - The complete TOML document.
 * @returns A reader for decoded top-level string values.
 */
export function createTopLevelTomlBasicStringReader(
  content: string,
): TopLevelTomlBasicStringReader {
  const document = parse(content);
  const inspect = (key: string): TopLevelTomlBasicStringState => {
    if (!Object.hasOwn(document, key)) {
      return { kind: 'missing' };
    }
    const value = document[key];
    return typeof value === 'string' ? { kind: 'string', value } : { kind: 'non-string' };
  };
  return Object.assign(
    (key: string): string | null => {
      const state = inspect(key);
      return state.kind === 'string' ? state.value : null;
    },
    { inspect },
  );
}

/**
 * Read an optional top-level TOML string without conflating omission with an
 * explicitly configured value of another TOML type.
 *
 * @param readValue - Reader for one parsed TOML document.
 * @param key - Top-level key to inspect.
 * @param source - Reader-facing source label used in type errors.
 * @returns The decoded string, or `null` when the key is genuinely absent.
 */
export function readOptionalTopLevelTomlBasicString(
  readValue: TopLevelTomlBasicStringReader,
  key: string,
  source: string,
): string | null {
  const state = readValue.inspect(key);
  if (state.kind === 'string') {
    return state.value;
  }
  if (state.kind === 'missing') {
    return null;
  }

  throw new Error(`${source} TOML key '${key}' must be a string when present.`);
}

/**
 * Read a required top-level TOML string without conflating omission with an
 * explicitly configured value of another TOML type.
 *
 * @param readValue - Reader for one parsed TOML document.
 * @param key - Required top-level key to inspect.
 * @param source - Reader-facing source label used in validation errors.
 * @returns The decoded required string.
 */
export function readRequiredTopLevelTomlBasicString(
  readValue: TopLevelTomlBasicStringReader,
  key: string,
  source: string,
): string {
  const value = readOptionalTopLevelTomlBasicString(readValue, key, source);
  if (value !== null) {
    return value;
  }

  throw new Error(`${source} is missing required TOML key '${key}'.`);
}
