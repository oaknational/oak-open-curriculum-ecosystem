import { describe, it, expect } from 'vitest';
import { ElasticsearchEnvSchema } from '../../src/schemas/elasticsearch';

describe('ElasticsearchEnvSchema', () => {
  it('should accept valid Elasticsearch credentials', () => {
    const result = ElasticsearchEnvSchema.safeParse({
      ELASTICSEARCH_URL: 'https://my-cluster.es.cloud:9243',
      ELASTICSEARCH_API_KEY: 'base64-encoded-key',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing ELASTICSEARCH_URL', () => {
    const result = ElasticsearchEnvSchema.safeParse({
      ELASTICSEARCH_API_KEY: 'base64-encoded-key',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing ELASTICSEARCH_API_KEY', () => {
    const result = ElasticsearchEnvSchema.safeParse({
      ELASTICSEARCH_URL: 'https://my-cluster.es.cloud:9243',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty ELASTICSEARCH_URL', () => {
    const result = ElasticsearchEnvSchema.safeParse({
      ELASTICSEARCH_URL: '',
      ELASTICSEARCH_API_KEY: 'base64-encoded-key',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty ELASTICSEARCH_API_KEY', () => {
    const result = ElasticsearchEnvSchema.safeParse({
      ELASTICSEARCH_URL: 'https://my-cluster.es.cloud:9243',
      ELASTICSEARCH_API_KEY: '',
    });
    expect(result.success).toBe(false);
  });

  it('should work with .partial() for optional ES configuration', () => {
    const OptionalEs = ElasticsearchEnvSchema.partial();
    const result = OptionalEs.safeParse({});
    expect(result.success).toBe(true);
  });
});
