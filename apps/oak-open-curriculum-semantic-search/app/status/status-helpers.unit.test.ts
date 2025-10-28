import { describe, expect, it } from 'vitest';
import { buildStatusCards, resolveToneColor } from './status-helpers';
import type { HealthStatus, HealthDetails } from './types';

describe('status-helpers', () => {
  const baseStatus: HealthStatus = { es: 'ok', sdk: 'ok', llm: 'enabled' };
  const baseDetails: HealthDetails = {};

  it('returns human-friendly copy for healthy services', () => {
    const cards = buildStatusCards(baseStatus, baseDetails);
    expect(cards).toHaveLength(3);

    const esCard = cards[0];
    expect(esCard.summary).toBe('Operational');
    expect(esCard.description).toBe('Elasticsearch responding to health checks.');
    expect(resolveToneColor(esCard.tone)).toBe('text-positive');

    const sdkCard = cards[1];
    expect(sdkCard.summary).toBe('Operational');
    expect(sdkCard.description).toBe('SDK parity checks are passing.');

    const llmCard = cards[2];
    expect(llmCard.summary).toBe('Enabled');
    expect(llmCard.description).toBe('LLM-backed query parsing is available.');
  });

  it('surfaces outage detail for Elasticsearch', () => {
    const status: HealthStatus = { ...baseStatus, es: 'down' };
    const details: HealthDetails = { esError: 'Connection refused' };

    const cards = buildStatusCards(status, details);
    const esCard = cards[0];

    expect(esCard.summary).toBe('Outage');
    expect(esCard.description).toBe('Connection refused');
    expect(resolveToneColor(esCard.tone)).toBe('text-error');
  });

  it('uses fallback copy when SDK error details missing', () => {
    const status: HealthStatus = { ...baseStatus, sdk: 'error' };

    const cards = buildStatusCards(status, baseDetails);
    const sdkCard = cards[1];

    expect(sdkCard.summary).toBe('Failure');
    expect(sdkCard.description).toBe(
      'SDK health checks are failing. Investigate upstream services.',
    );
  });

  it('prepends a system health card when fatal detail present', () => {
    const status: HealthStatus = { ...baseStatus, es: 'error' };
    const details: HealthDetails = { fatal: 'Backend outage', esError: 'Timeout' };

    const cards = buildStatusCards(status, details);

    expect(cards[0]).toMatchObject({ summary: 'Unhealthy', description: 'Backend outage' });
    expect(cards[1].title).toBe('Elasticsearch');
  });

  it('returns neutral copy when data pending', () => {
    const status: HealthStatus = { es: 'unknown', sdk: 'unknown', llm: 'disabled' };
    const cards = buildStatusCards(status, baseDetails);

    const esCard = cards[0];
    expect(esCard.summary).toBe('Pending');
    expect(esCard.description).toBe('Waiting for Elasticsearch health data.');

    const sdkCard = cards[1];
    expect(sdkCard.summary).toBe('Pending');
    expect(sdkCard.description).toBe('Waiting for SDK health data.');

    const llmCard = cards[2];
    expect(llmCard.summary).toBe('Disabled');
    expect(llmCard.description).toBe(
      'LLM-backed parsing is disabled; natural search uses structured fallbacks only.',
    );
  });
});
