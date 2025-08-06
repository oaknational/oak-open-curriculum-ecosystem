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
 * Validate basic URI requirements
 */
function validateBasicUri(uri: string): string | null {
  if (!uri) return 'URI is required';
  if (!uri.startsWith('notion://')) return 'URI must use notion:// protocol';
  return null;
}

/**
 * Validate URI path structure
 */
function validateUriPath(pathPart: string): { type: string; id: string; error?: string } {
  const parts = pathPart.split('/');

  if (parts.length !== 2) {
    return { type: '', id: '', error: 'Invalid URI format' };
  }

  return { type: parts[0] ?? '', id: parts[1] ?? '' };
}

/**
 * Validate resource components
 */
function validateResourceComponents(type: string, id: string): string[] {
  const errors: string[] = [];

  if (!isValidResourceType(type)) {
    errors.push(`Invalid resource type: ${type}. Must be pages, databases, or users`);
  }

  if (!id || id.trim() === '') {
    errors.push('Resource ID is required');
  }

  return errors;
}

/**
 * Validates a resource URI and returns detailed error information
 */
export function validateResourceUri(uri: string): ValidationResult {
  // Basic validation
  const basicError = validateBasicUri(uri);
  if (basicError) {
    return { valid: false, errors: [basicError] };
  }

  // Special case for discovery URI
  if (uri === 'notion://discovery') {
    return { valid: true };
  }

  // Path validation
  const pathPart = uri.slice(9);
  const { type, id, error: pathError } = validateUriPath(pathPart);
  if (pathError) {
    return { valid: false, errors: [pathError] };
  }

  // Component validation
  const componentErrors = validateResourceComponents(type, id);
  if (componentErrors.length > 0) {
    return { valid: false, errors: componentErrors };
  }

  return { valid: true };
}

/**
 * Builds a resource URI from components
 */
export function buildResourceUri(type: ResourceType, id: string): string {
  return `notion://${type}/${id}`;
}
