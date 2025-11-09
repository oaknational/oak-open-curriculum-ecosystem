/**
 * Resource attributes for OpenTelemetry log records
 *
 * This module builds resource attributes from environment variables,
 * including Vercel-specific metadata when running on Vercel infrastructure.
 *
 * @see https://opentelemetry.io/docs/specs/semconv/resource/
 */

/**
 * Resource attributes for service identification
 *
 * These attributes identify the service and its deployment environment.
 * Follows OpenTelemetry semantic conventions for resource attributes.
 *
 * @see https://opentelemetry.io/docs/specs/semconv/resource/
 */
export interface ResourceAttributes {
  /** Service name */
  'service.name': string;
  /** Service version */
  'service.version': string;
  /** Deployment environment (production, staging, development, etc.) */
  'deployment.environment': string;
  /** Host name (e.g., Vercel region) */
  'host.name'?: string;
  /** Host ID (e.g., Vercel deployment ID) */
  'host.id'?: string;
  /** Cloud provider (e.g., "vercel") */
  'cloud.provider'?: string;
  /** Cloud region (e.g., "iad1", "sfo1") */
  'cloud.region'?: string;
}

/**
 * Environment variables that can be used for resource attributes
 */
interface Environment {
  /** Override for deployment environment (highest priority) */
  ENVIRONMENT_OVERRIDE?: string;
  /** Vercel environment (production, preview, development) */
  VERCEL_ENV?: string;
  /** Vercel region (e.g., "iad1", "sfo1") */
  VERCEL_REGION?: string;
  /** Vercel deployment ID */
  VERCEL_DEPLOYMENT_ID?: string;
  /** Flag indicating running on Vercel (value: "1") */
  VERCEL?: string;
  /** Allow indexing for arbitrary env access */
  [key: string]: string | undefined;
}

/**
 * Get deployment environment from environment variables
 *
 * Priority order:
 * 1. ENVIRONMENT_OVERRIDE (highest priority, explicit override)
 * 2. VERCEL_ENV (Vercel-provided environment)
 * 3. "development" (default fallback)
 *
 * @param env - Environment variables object
 * @returns Deployment environment string
 */
export function getDeploymentEnvironment(env: Environment): string {
  return env.ENVIRONMENT_OVERRIDE ?? env.VERCEL_ENV ?? 'development';
}

/**
 * Check if running on Vercel infrastructure
 *
 * @param env - Environment variables object
 * @returns True if VERCEL environment variable is set to "1"
 */
function isVercel(env: Environment): boolean {
  return env.VERCEL === '1';
}

/**
 * Build resource attributes from environment variables
 *
 * Creates an OpenTelemetry-compliant resource attributes object with:
 * - Service identification (name, version)
 * - Deployment environment
 * - Cloud/host metadata (when on Vercel)
 *
 * Vercel mappings:
 * - VERCEL_REGION → host.name and cloud.region
 * - VERCEL_DEPLOYMENT_ID → host.id
 * - VERCEL=1 → cloud.provider="vercel"
 *
 * @param env - Environment variables object (typically process.env)
 * @param serviceName - Name of the service
 * @param serviceVersion - Version of the service
 * @returns Resource attributes object
 */
export function buildResourceAttributes(
  env: Environment,
  serviceName: string,
  serviceVersion: string,
): ResourceAttributes {
  const attributes: ResourceAttributes = {
    'service.name': serviceName,
    'service.version': serviceVersion,
    'deployment.environment': getDeploymentEnvironment(env),
  };

  // Add Vercel-specific attributes if running on Vercel
  if (isVercel(env)) {
    attributes['cloud.provider'] = 'vercel';

    if (env.VERCEL_REGION !== undefined) {
      attributes['cloud.region'] = env.VERCEL_REGION;
      attributes['host.name'] = env.VERCEL_REGION;
    }

    if (env.VERCEL_DEPLOYMENT_ID !== undefined) {
      attributes['host.id'] = env.VERCEL_DEPLOYMENT_ID;
    }
  }

  return attributes;
}
