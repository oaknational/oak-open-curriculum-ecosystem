/**
 * Environment configuration utilities
 * These were previously in oak-mcp-core but are now local to oak-notion-mcp
 */

/**
 * Get a string value from environment variables
 */
export function getString(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

/**
 * Get a boolean value from environment variables
 */
export function getBoolean(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get a number value from environment variables
 */
export function getNumber(key: string, defaultValue?: number, min?: number, max?: number): number {
  const value = process.env[key];
  let num: number;

  if (value === undefined) {
    if (defaultValue !== undefined) {
      num = defaultValue;
    } else {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
  } else {
    num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${key} must be a number, got: ${value}`);
    }
  }

  if (min !== undefined && num < min) {
    throw new Error(
      `Environment variable ${key} must be >= ${min.toString()}, got: ${num.toString()}`,
    );
  }
  if (max !== undefined && num > max) {
    throw new Error(
      `Environment variable ${key} must be <= ${max.toString()}, got: ${num.toString()}`,
    );
  }

  return num;
}

/**
 * Get an enum value from environment variables
 */
export function getEnum<T extends readonly string[]>(
  key: string,
  allowedValues: T,
  defaultValue?: T[number],
): T[number] {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }

  if (!allowedValues.includes(value)) {
    throw new Error(
      `Environment variable ${key} must be one of: ${allowedValues.join(', ')}, got: ${value}`,
    );
  }

  return value;
}
