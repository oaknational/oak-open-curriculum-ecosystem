/**
 * Environment configuration utilities
 * These were previously in oak-mcp-core but are now local to oak-notion-mcp
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface BaseEnvironment {
  LOG_LEVEL: LogLevel;
  NODE_ENV: 'development' | 'production' | 'test';
  ENABLE_DEBUG_LOGGING: boolean;
}

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
 * Get a log level from environment variables
 */
export function getLogLevel(key: string, defaultValue: LogLevel = 'INFO'): LogLevel {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }

  const upperValue = value.toUpperCase();
  if (!['DEBUG', 'INFO', 'WARN', 'ERROR'].includes(upperValue)) {
    throw new Error(
      `Environment variable ${key} must be one of: DEBUG, INFO, WARN, ERROR, got: ${value}`,
    );
  }

  return upperValue as LogLevel;
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

/**
 * Load .env file if needed (in development)
 */
export async function loadDotenvIfNeeded(): Promise<void> {
  if (process.env.NODE_ENV !== 'production' && !process.env.NOTION_API_KEY) {
    try {
      const { config } = await import('dotenv');
      config();
    } catch {
      // dotenv not available, ignore
    }
  }
}
