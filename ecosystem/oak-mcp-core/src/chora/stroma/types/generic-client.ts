/**
 * Generic data source client interface
 * This allows the genotype to define contracts without knowing about specific implementations
 */

/**
 * Generic client interface for data sources
 * Phenotypes will implement this with their specific clients (Notion, Slack, etc.)
 */
export type GenericDataClient = Record<string, unknown>;

/**
 * Generic operations interface
 * Phenotypes define their specific operations
 */
export type GenericOperations = Record<string, unknown>;
