/**
 * @fileoverview Parsing utilities for common data formats
 * @module moria/utils/parsing
 *
 * Provides pure parsing functions for various data formats.
 * No external dependencies, suitable for any environment.
 */

/**
 * Result type for parse operations
 */
export type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; error: string };

/**
 * Parser function type
 */
export type Parser<T> = (input: string) => ParseResult<T>;

// JSON Parsing

/**
 * Parse JSON string safely
 */
export const parseJSON = (input: string): ParseResult<unknown> => {
  if (!input) {
    return { success: false, error: 'Empty input' };
  }

  try {
    const value = JSON.parse(input);
    return { success: true, value };
  } catch (error) {
    return {
      success: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Primitive Parsing

/**
 * Parse string to number
 */
export const parseNumber = (input: string): ParseResult<number> => {
  if (!input || input.trim() === '') {
    return { success: false, error: 'Empty input' };
  }

  // Reject special values
  if (input === 'NaN' || input === 'Infinity' || input === '-Infinity') {
    return {
      success: false,
      error: 'Invalid number: special values not allowed',
    };
  }

  const num = Number(input);

  if (isNaN(num)) {
    return { success: false, error: 'Invalid number format' };
  }

  if (!isFinite(num)) {
    return { success: false, error: 'Number must be finite' };
  }

  return { success: true, value: num };
};

/**
 * Parse string to boolean
 */
export const parseBoolean = (input: string): ParseResult<boolean> => {
  const normalized = input.toLowerCase().trim();

  const trueValues = ['true', '1', 'yes', 'on'];
  const falseValues = ['false', '0', 'no', 'off'];

  if (trueValues.includes(normalized)) {
    return { success: true, value: true };
  }

  if (falseValues.includes(normalized)) {
    return { success: true, value: false };
  }

  return { success: false, error: `Invalid boolean: "${input}"` };
};

/**
 * Parse string to Date
 */
export const parseDate = (input: string): ParseResult<Date> => {
  if (!input || input.trim() === '') {
    return { success: false, error: 'Empty input' };
  }

  const date = new Date(input);

  if (isNaN(date.getTime())) {
    return { success: false, error: 'Invalid date format' };
  }

  return { success: true, value: date };
};

// Collection Parsing

/**
 * Parse delimited string to array
 */
export const parseArray = (
  input: string,
  separator: string = ','
): ParseResult<string[]> => {
  if (input === '') {
    return { success: true, value: [''] };
  }

  const values = input.split(separator).map((v) => v.trim());
  return { success: true, value: values };
};

/**
 * Parse key-value pairs to object
 */
export const parseObject = (
  input: string,
  pairSeparator: string = ',',
  keyValueSeparator: string = '='
): ParseResult<Record<string, string>> => {
  if (!input) {
    return { success: true, value: {} };
  }

  const obj: Record<string, string> = {};
  const pairs = input.split(pairSeparator);

  for (const pair of pairs) {
    const [key, ...valueParts] = pair.split(keyValueSeparator);
    if (key) {
      obj[key.trim()] = valueParts.join(keyValueSeparator).trim();
    }
  }

  return { success: true, value: obj };
};

// Format Validators

/**
 * Parsed URL components
 */
export interface ParsedURL {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

/**
 * Parse and validate URL
 */
export const parseURL = (input: string): ParseResult<ParsedURL> => {
  if (!input) {
    return { success: false, error: 'Empty input' };
  }

  // Basic URL validation regex
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  if (!urlPattern.test(input)) {
    return { success: false, error: 'Invalid URL format' };
  }

  // Parse URL components manually
  const match = input.match(
    /^(https?|ftp):\/\/([^/:]+)(:\d+)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i
  );

  if (!match) {
    return { success: false, error: 'Invalid URL format' };
  }

  const [
    ,
    protocol,
    hostname,
    port = '',
    pathname = '',
    search = '',
    hash = '',
  ] = match;

  return {
    success: true,
    value: {
      href: input,
      protocol: protocol + ':',
      hostname,
      port: port.slice(1), // Remove leading ':'
      pathname: pathname || '/',
      search,
      hash,
    },
  };
};

/**
 * Parse and validate email address
 */
export const parseEmail = (input: string): ParseResult<string> => {
  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(input)) {
    return { success: false, error: 'Invalid email format' };
  }

  return { success: true, value: input.toLowerCase() };
};

/**
 * Parse and validate UUID
 */
export const parseUUID = (input: string): ParseResult<string> => {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(input)) {
    return { success: false, error: 'Invalid UUID format' };
  }

  return { success: true, value: input.toLowerCase() };
};

/**
 * Semantic version components
 */
export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  metadata?: string;
}

/**
 * Parse semantic version string
 */
export const parseSemVer = (input: string): ParseResult<SemVer> => {
  const semverPattern = /^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?(?:\+(.+))?$/;
  const match = input.match(semverPattern);

  if (!match) {
    return { success: false, error: 'Invalid semantic version format' };
  }

  const [, major, minor, patch, prerelease, metadata] = match;

  return {
    success: true,
    value: {
      major: parseInt(major, 10),
      minor: parseInt(minor, 10),
      patch: parseInt(patch, 10),
      prerelease,
      metadata,
    },
  };
};

// Structured Data Parsing

/**
 * Parse CSV string to array of objects
 */
export const parseCSV = (
  input: string
): ParseResult<Record<string, string>[]> => {
  if (!input) {
    return { success: true, value: [] };
  }

  const lines = input.split('\n').filter((line) => line.trim());
  if (lines.length === 0) {
    return { success: true, value: [] };
  }

  // Simple CSV parser (doesn't handle all edge cases)
  const parseRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const row: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }

    data.push(row);
  }

  return { success: true, value: data };
};

/**
 * Parse key-value text (like .env files)
 */
export const parseKeyValue = (
  input: string,
  separator: string = '='
): ParseResult<Record<string, string>> => {
  const lines = input.split('\n');
  const result: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(separator);
    if (separatorIndex > 0) {
      const key = trimmed.substring(0, separatorIndex).trim();
      const value = trimmed.substring(separatorIndex + separator.length).trim();
      result[key] = value;
    }
  }

  return { success: true, value: result };
};

/**
 * Parse template string with variable substitution
 */
export const parseTemplate = (
  template: string,
  variables: Record<string, string>,
  startDelim: string = '{{',
  endDelim: string = '}}'
): ParseResult<string> => {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const pattern = `${startDelim}${key}${endDelim}`;
    result = result.split(pattern).join(value);
  }

  // Remove any remaining unmatched variables
  const remainingPattern = new RegExp(
    `${escapeRegExp(startDelim)}[^${escapeRegExp(endDelim)}]+${escapeRegExp(endDelim)}`,
    'g'
  );
  result = result.replace(remainingPattern, '');

  return { success: true, value: result };
};

/**
 * Escape special regex characters
 */
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Type Coercion

/**
 * Coerce any value to string
 */
export const coerceToString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.join(',');
  }

  return String(value);
};

/**
 * Coerce any value to number
 */
export const coerceToNumber = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  if (typeof value === 'string') {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  return 0;
};

/**
 * Coerce any value to boolean
 */
export const coerceToBoolean = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return ['true', '1', 'yes', 'on'].includes(lower);
  }

  return Boolean(value);
};

/**
 * Coerce any value to array
 */
export const coerceToArray = <T = unknown>(value: unknown): T[] => {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map((v) => v.trim()) as T[];
  }

  return [value as T];
};

// Enum Parsing

/**
 * Parse enum value
 */
export const parseEnum = <T extends readonly string[]>(
  input: string,
  values: T
): ParseResult<T[number]> => {
  if (values.includes(input)) {
    return { success: true, value: input as T[number] };
  }

  return {
    success: false,
    error: `Value must be one of: ${values.join(', ')}`,
  };
};

// Composite Parsers

/**
 * Create optional parser
 */
export const optionalParser = <T>(parser: Parser<T>): Parser<T | undefined> => {
  return (input: string): ParseResult<T | undefined> => {
    if (!input) {
      return { success: true, value: undefined };
    }
    return parser(input);
  };
};

/**
 * Create array parser
 */
export const arrayOf = <T>(
  parser: Parser<T>,
  separator: string = ','
): Parser<T[]> => {
  return (input: string): ParseResult<T[]> => {
    const parts = input.split(separator).map((p) => p.trim());
    const results: T[] = [];

    for (const part of parts) {
      const result = parser(part);
      if (!result.success) {
        return {
          success: false,
          error: `Failed to parse array element: ${result.error}`,
        };
      }
      results.push(result.value);
    }

    return { success: true, value: results };
  };
};

/**
 * Create parser with default value
 */
export const withDefault = <T>(
  parser: Parser<T>,
  defaultValue: T
): Parser<T> => {
  return (input: string): ParseResult<T> => {
    if (!input) {
      return { success: true, value: defaultValue };
    }
    return parser(input);
  };
};
