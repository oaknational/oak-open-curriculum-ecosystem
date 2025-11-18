/**
 * Unit tests for resource attributes building
 */

import { describe, it, expect } from 'vitest';
import { buildResourceAttributes, getDeploymentEnvironment } from './resource-attributes';

describe('resource-attributes', () => {
  describe('getDeploymentEnvironment', () => {
    it('uses ENVIRONMENT_OVERRIDE when present', () => {
      const env = {
        ENVIRONMENT_OVERRIDE: 'staging',
        VERCEL_ENV: 'production',
      };

      expect(getDeploymentEnvironment(env)).toBe('staging');
    });

    it('falls back to VERCEL_ENV when ENVIRONMENT_OVERRIDE not present', () => {
      const env = {
        VERCEL_ENV: 'production',
      };

      expect(getDeploymentEnvironment(env)).toBe('production');
    });

    it('falls back to "development" when neither env var present', () => {
      const env = {};

      expect(getDeploymentEnvironment(env)).toBe('development');
    });

    it('prioritizes ENVIRONMENT_OVERRIDE over VERCEL_ENV', () => {
      const env = {
        ENVIRONMENT_OVERRIDE: 'test',
        VERCEL_ENV: 'preview',
      };

      expect(getDeploymentEnvironment(env)).toBe('test');
    });
  });

  describe('buildResourceAttributes', () => {
    it('includes service name and version', () => {
      const env = {};
      const serviceName = 'test-service';
      const serviceVersion = '1.2.3';

      const attributes = buildResourceAttributes(env, serviceName, serviceVersion);

      expect(attributes['service.name']).toBe(serviceName);
      expect(attributes['service.version']).toBe(serviceVersion);
    });

    it('includes deployment environment', () => {
      const env = {
        ENVIRONMENT_OVERRIDE: 'production',
      };

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['deployment.environment']).toBe('production');
    });

    it('maps VERCEL_REGION to host.name and cloud.region', () => {
      const env = {
        VERCEL: '1',
        VERCEL_REGION: 'iad1',
      };

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['host.name']).toBe('iad1');
      expect(attributes['cloud.region']).toBe('iad1');
    });

    it('maps VERCEL_DEPLOYMENT_ID to host.id', () => {
      const env = {
        VERCEL: '1',
        VERCEL_DEPLOYMENT_ID: 'dpl_abc123',
      };

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['host.id']).toBe('dpl_abc123');
    });

    it('sets cloud.provider to "vercel" when VERCEL=1', () => {
      const env = {
        VERCEL: '1',
      };

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['cloud.provider']).toBe('vercel');
    });

    it('does not include Vercel attributes when not on Vercel', () => {
      const env = {};

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['cloud.provider']).toBeUndefined();
      expect(attributes['cloud.region']).toBeUndefined();
      expect(attributes['host.name']).toBeUndefined();
      expect(attributes['host.id']).toBeUndefined();
    });

    it('includes all Vercel attributes when on Vercel with full env', () => {
      const env = {
        VERCEL: '1',
        VERCEL_ENV: 'production',
        VERCEL_REGION: 'sfo1',
        VERCEL_DEPLOYMENT_ID: 'dpl_xyz789',
      };

      const attributes = buildResourceAttributes(env, 'my-service', '2.0.0');

      expect(attributes).toEqual({
        'service.name': 'my-service',
        'service.version': '2.0.0',
        'deployment.environment': 'production',
        'cloud.provider': 'vercel',
        'cloud.region': 'sfo1',
        'host.name': 'sfo1',
        'host.id': 'dpl_xyz789',
      });
    });

    it('includes partial Vercel attributes when only some are set', () => {
      const env = {
        VERCEL: '1',
        VERCEL_REGION: 'iad1',
        // No VERCEL_DEPLOYMENT_ID
      };

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['cloud.provider']).toBe('vercel');
      expect(attributes['cloud.region']).toBe('iad1');
      expect(attributes['host.name']).toBe('iad1');
      expect(attributes['host.id']).toBeUndefined();
    });

    it('uses development as default environment', () => {
      const env = {};

      const attributes = buildResourceAttributes(env, 'service', '1.0.0');

      expect(attributes['deployment.environment']).toBe('development');
    });
  });
});
