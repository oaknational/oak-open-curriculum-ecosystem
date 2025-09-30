import type { HealthStatus, HealthDetails, StatusCardConfig, HealthPayload } from './types';

export function buildStatusCards(status: HealthStatus, details: HealthDetails): StatusCardConfig[] {
  const esCard = createEsCard(status.es, details.esError);
  const sdkCard = createSdkCard(status.sdk, details.sdkError);
  const llmCard = createLlmCard(status.llm);

  if (details.fatal) {
    return [createSystemCard(details.fatal), esCard, sdkCard, llmCard];
  }

  return [esCard, sdkCard, llmCard];
}

export function resolveToneColor(tone: StatusCardConfig['tone']): string {
  if (tone === 'positive') {
    return 'text-positive';
  }
  if (tone === 'negative') {
    return 'text-error';
  }
  return 'text-subdued';
}

export function describe(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function isHealthPayload(value: unknown): value is HealthPayload {
  if (!hasStatusAndDetails(value)) {
    return false;
  }
  const { status, details } = value;
  const checks = [
    typeof status === 'object' && status !== null,
    typeof details === 'object' && details !== null,
  ];
  return checks.every(Boolean);
}

function hasStatusAndDetails(value: unknown): value is { status: unknown; details: unknown } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'status' in value && 'details' in value;
}

function createSystemCard(message: string): StatusCardConfig {
  return {
    title: 'System health',
    summary: 'Unhealthy',
    tone: 'negative',
    description: message,
  };
}

function createEsCard(status: HealthStatus['es'], error?: string): StatusCardConfig {
  const tone = status === 'ok' ? 'positive' : status === 'unknown' ? 'neutral' : 'negative';
  return {
    title: 'Elasticsearch',
    summary: summariseEs(status),
    tone,
    description: error,
  };
}

function createSdkCard(status: HealthStatus['sdk'], error?: unknown): StatusCardConfig {
  const tone = status === 'ok' ? 'positive' : status === 'unknown' ? 'neutral' : 'negative';
  return {
    title: 'Curriculum SDK',
    summary: summariseSdk(status),
    tone,
    description: describe(error),
  };
}

function createLlmCard(status: HealthStatus['llm']): StatusCardConfig {
  return {
    title: 'Natural-language parsing',
    summary: status === 'enabled' ? 'Enabled' : 'Disabled',
    tone: status === 'enabled' ? 'positive' : 'neutral',
    description:
      status === 'enabled'
        ? 'LLM-backed query parsing is available.'
        : 'LLM-backed parsing is disabled; natural search uses structured fallbacks only.',
  };
}

function summariseEs(status: HealthStatus['es']): string {
  switch (status) {
    case 'ok':
      return 'Operational';
    case 'down':
      return 'Unreachable';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}

function summariseSdk(status: HealthStatus['sdk']): string {
  switch (status) {
    case 'ok':
      return 'Operational';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}
