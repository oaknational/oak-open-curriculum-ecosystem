/**
 * Type definitions for tool metadata
 * These types define the structure of tool metadata used for
 * enriching programmatically generated MCP tools.
 */

/**
 * Tool category for grouping and organization
 */
export interface ToolCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display name for the category */
  name: string;
  /** Description of what tools in this category do */
  description: string;
  /** Priority for display ordering (lower = higher priority) */
  priority: number;
}

/**
 * Example usage of a tool
 */
export interface ToolExample {
  /** Title of the example */
  title: string;
  /** Example input parameters */
  input: Record<string, unknown>;
  /** Description of what this example demonstrates */
  description: string;
  /** Expected output (optional) */
  expectedOutput?: unknown;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Maximum requests per minute */
  requestsPerMinute: number;
  /** Burst limit for short-term spikes */
  burstLimit?: number;
  /** Cooldown period in seconds after hitting limit */
  cooldownSeconds?: number;
}

/**
 * Complexity level of a tool
 */
export type ToolComplexity =
  | 'simple' // Single API call, straightforward
  | 'medium' // Some processing or validation required
  | 'complex' // Multiple steps or complex logic
  | 'composite'; // Combines multiple API calls

/**
 * Complete metadata for a tool
 */
export interface ToolMetadata {
  /** OpenAPI operation ID */
  operationId: string;
  /** Tool category */
  category: ToolCategory;
  /** Human-friendly display name */
  displayName: string;
  /** Short description (one line) */
  description: string;
  /** Detailed description with context */
  longDescription?: string;
  /** Example usages */
  examples?: ToolExample[];
  /** Tags for discovery and filtering */
  tags?: string[];
  /** Complexity level */
  complexity?: ToolComplexity;
  /** Rate limiting configuration */
  rateLimit?: RateLimitConfig;
  /** For composite tools, list of constituent operations */
  compositeOf?: string[];
  /** Whether this tool requires authentication */
  requiresAuth?: boolean;
  /** Minimum SDK version required */
  minSdkVersion?: string;
  /** Whether this tool is experimental */
  experimental?: boolean;
  /** Deprecation notice if applicable */
  deprecated?: {
    since: string;
    alternativeTool?: string;
    removalDate?: string;
  };
}

/**
 * Tool generation configuration
 */
export interface ToolGenerationConfig {
  /** Whether to include examples in generated schema */
  includeExamples: boolean;
  /** Whether to include rate limit info */
  includeRateLimits: boolean;
  /** Whether to generate composite tools */
  generateComposites: boolean;
  /** Whether to add custom validators */
  addValidators: boolean;
  /** Output format for generated tools */
  outputFormat: 'typescript' | 'json' | 'yaml';
}

/**
 * Decorative metadata for tools (ADR-029/030/031 compliant)
 * This type contains ONLY decorative fields that enhance SDK-provided data.
 * It does NOT include operationId (which is the key), paths, parameters, or validation.
 */
export interface ToolDecoration {
  /** Human-friendly display name */
  displayName: string;
  /** Short description (one line) */
  description: string;
  /** Detailed description with context */
  longDescription?: string;
  /** Category ID reference (not full object) */
  category?: string;
  /** Example usages */
  examples?: ToolExample[];
  /** Tags for discovery and filtering */
  tags?: string[];
  /** Complexity level */
  complexity?: ToolComplexity;
  /** Rate limiting configuration */
  rateLimit?: RateLimitConfig;
  /** For composite tools, list of constituent operations */
  compositeOf?: string[];
  /** Whether this tool requires authentication */
  requiresAuth?: boolean;
  /** Minimum SDK version required */
  minSdkVersion?: string;
  /** Whether this tool is experimental */
  experimental?: boolean;
  /** Deprecation notice if applicable */
  deprecated?: {
    since: string;
    alternativeTool?: string;
    removalDate?: string;
  };
}

/**
 * Generated tool structure
 */
export interface GeneratedTool {
  /** MCP tool name */
  name: string;
  /** Tool description */
  description: string;
  /** JSON Schema for input validation */
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
  /** Metadata from registry */
  metadata?: ToolMetadata;
  /** Source API path */
  sourcePath?: string;
  /** Generated timestamp */
  generatedAt?: string;
}
