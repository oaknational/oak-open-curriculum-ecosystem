/**
 * Pure functions for parsing and validating MCP resource URIs
 */

// Valid resource types
const VALID_RESOURCE_TYPES = ['pages', 'databases', 'users'] as const;
type ResourceType = (typeof VALID_RESOURCE_TYPES)[number];

// Type guard for resource types
const validResourceTypesArray: readonly string[] = VALID_RESOURCE_TYPES;

function isValidResourceType(value: unknown): value is ResourceType {
  return typeof value === 'string' && validResourceTypesArray.includes(value);
}

// Result types
export interface ResourceIdentifier {
  type: ResourceType;
  id: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Parses a Notion resource URI into its components
 * Format: notion://[type]/[id]
 * Example: notion://pages/abc-123-def
 */
export function parseResourceUri(uri: string): ResourceIdentifier | null {
  if (!uri) {
    return null;
  }

  // Check protocol
  if (!uri.startsWith('notion://')) {
    return null;
  }

  // Remove protocol
  const pathPart = uri.slice(9); // 'notion://'.length = 9

  // Split into parts
  const parts = pathPart.split('/');

  // Validate structure
  if (parts.length !== 2) {
    return null;
  }

  const [type, id] = parts;

  // Validate type
  if (!isValidResourceType(type)) {
    return null;
  }

  // Validate ID is not empty
  if (!id || id.trim() === '') {
    return null;
  }

  return {
    type,
    id: id.trim(),
  };
}

/**
 * Validates a resource URI and returns detailed error information
 */
export function validateResourceUri(uri: string): ValidationResult {
  const errors: string[] = [];

  if (!uri) {
    errors.push('URI is required');
    return { valid: false, errors };
  }

  if (!uri.startsWith('notion://')) {
    errors.push('URI must use notion:// protocol');
    return { valid: false, errors };
  }

  // Special case for discovery URI
  if (uri === 'notion://discovery') {
    return { valid: true };
  }

  const pathPart = uri.slice(9);
  const parts = pathPart.split('/');

  if (parts.length !== 2) {
    errors.push('Invalid URI format');
    return { valid: false, errors };
  }

  const [type, id] = parts;

  if (!isValidResourceType(type)) {
    errors.push(`Invalid resource type: ${type}. Must be pages, databases, or users`);
  }

  if (!id || id.trim() === '') {
    errors.push('Resource ID is required');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Builds a resource URI from components
 */
export function buildResourceUri(type: ResourceType, id: string): string {
  return `notion://${type}/${id}`;
}
