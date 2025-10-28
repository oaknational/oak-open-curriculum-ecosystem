import type { HealthStatus, HealthDetails, StatusCardConfig, HealthPayload } from './types';

const ELASTICSEARCH_HEALTHY_COPY = 'Elasticsearch responding to health checks.';
const ELASTICSEARCH_OUTAGE_COPY =
  'Elasticsearch is unreachable. Investigate infrastructure or switch to fixtures.';
const ELASTICSEARCH_ERROR_COPY =
  'Elasticsearch reported an error. Review cluster logs for more detail.';
const ELASTICSEARCH_PENDING_COPY = 'Waiting for Elasticsearch health data.';

const SDK_HEALTHY_COPY = 'SDK parity checks are passing.';
const SDK_ERROR_COPY = 'SDK health checks are failing. Investigate upstream services.';
const SDK_PENDING_COPY = 'Waiting for SDK health data.';

const LLM_ENABLED_COPY = 'LLM-backed query parsing is available.';
const LLM_DISABLED_COPY =
  'LLM-backed parsing is disabled; natural search uses structured fallbacks only.';

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
  if (status === 'ok') {
    return {
      title: 'Elasticsearch',
      summary: 'Operational',
      tone: 'positive',
      description: ELASTICSEARCH_HEALTHY_COPY,
    };
  }

  if (status === 'down') {
    return {
      title: 'Elasticsearch',
      summary: 'Outage',
      tone: 'negative',
      description: error ?? ELASTICSEARCH_OUTAGE_COPY,
    };
  }

  if (status === 'error') {
    return {
      title: 'Elasticsearch',
      summary: 'Degraded',
      tone: 'negative',
      description: error ?? ELASTICSEARCH_ERROR_COPY,
    };
  }

  return {
    title: 'Elasticsearch',
    summary: 'Pending',
    tone: 'neutral',
    description: ELASTICSEARCH_PENDING_COPY,
  };
}

function createSdkCard(status: HealthStatus['sdk'], error?: unknown): StatusCardConfig {
  if (status === 'ok') {
    return {
      title: 'Curriculum SDK',
      summary: 'Operational',
      tone: 'positive',
      description: SDK_HEALTHY_COPY,
    };
  }

  if (status === 'error') {
    return {
      title: 'Curriculum SDK',
      summary: 'Failure',
      tone: 'negative',
      description: describe(error) ?? SDK_ERROR_COPY,
    };
  }

  return {
    title: 'Curriculum SDK',
    summary: 'Pending',
    tone: 'neutral',
    description: SDK_PENDING_COPY,
  };
}

function createLlmCard(status: HealthStatus['llm']): StatusCardConfig {
  if (status === 'enabled') {
    return {
      title: 'Natural-language parsing',
      summary: 'Enabled',
      tone: 'positive',
      description: LLM_ENABLED_COPY,
    };
  }

  return {
    title: 'Natural-language parsing',
    summary: 'Disabled',
    tone: 'neutral',
    description: LLM_DISABLED_COPY,
  };
}
