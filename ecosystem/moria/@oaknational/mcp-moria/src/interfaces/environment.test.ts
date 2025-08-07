/**
 * @fileoverview Tests for EnvironmentProvider interface
 * @module moria/interfaces/environment.test
 */

import { describe, it, expect } from 'vitest';
import type { EnvironmentProvider } from './environment';

describe('EnvironmentProvider interface', () => {
  it('should define get method for retrieving environment variables', () => {
    const mockEnv: EnvironmentProvider = {
      get: (key: string) => {
        return key === 'TEST_VAR' ? 'test_value' : undefined;
      },
      getAll: () => {
        return { TEST_VAR: 'test_value' };
      },
    };

    expect(mockEnv.get).toBeDefined();
    expect(typeof mockEnv.get).toBe('function');
    expect(mockEnv.get('TEST_VAR')).toBe('test_value');
    expect(mockEnv.get('MISSING')).toBeUndefined();
  });

  it('should define getAll method for retrieving all environment variables', () => {
    const mockEnv: EnvironmentProvider = {
      get: (key: string) => undefined,
      getAll: () => {
        return {
          NODE_ENV: 'test',
          API_KEY: 'secret',
        };
      },
    };

    expect(mockEnv.getAll).toBeDefined();
    expect(typeof mockEnv.getAll).toBe('function');
    const allVars = mockEnv.getAll();
    expect(allVars).toEqual({
      NODE_ENV: 'test',
      API_KEY: 'secret',
    });
  });

  it('should support optional has method', () => {
    const mockEnvWithHas: EnvironmentProvider = {
      get: (key: string) => undefined,
      getAll: () => ({}),
      has: (key: string) => {
        return key === 'EXISTING_VAR';
      },
    };

    expect(mockEnvWithHas.has).toBeDefined();
    expect(typeof mockEnvWithHas.has).toBe('function');
    expect(mockEnvWithHas.has!('EXISTING_VAR')).toBe(true);
    expect(mockEnvWithHas.has!('MISSING_VAR')).toBe(false);
  });

  it('should support optional isDevelopment method', () => {
    const mockEnvWithIsDev: EnvironmentProvider = {
      get: (key: string) => (key === 'NODE_ENV' ? 'development' : undefined),
      getAll: () => ({ NODE_ENV: 'development' }),
      isDevelopment: () => true,
    };

    expect(mockEnvWithIsDev.isDevelopment).toBeDefined();
    expect(typeof mockEnvWithIsDev.isDevelopment).toBe('function');
    expect(mockEnvWithIsDev.isDevelopment!()).toBe(true);
  });

  it('should support optional isProduction method', () => {
    const mockEnvWithIsProd: EnvironmentProvider = {
      get: (key: string) => (key === 'NODE_ENV' ? 'production' : undefined),
      getAll: () => ({ NODE_ENV: 'production' }),
      isProduction: () => true,
    };

    expect(mockEnvWithIsProd.isProduction).toBeDefined();
    expect(typeof mockEnvWithIsProd.isProduction).toBe('function');
    expect(mockEnvWithIsProd.isProduction!()).toBe(true);
  });

  it('should support optional isTest method', () => {
    const mockEnvWithIsTest: EnvironmentProvider = {
      get: (key: string) => (key === 'NODE_ENV' ? 'test' : undefined),
      getAll: () => ({ NODE_ENV: 'test' }),
      isTest: () => true,
    };

    expect(mockEnvWithIsTest.isTest).toBeDefined();
    expect(typeof mockEnvWithIsTest.isTest).toBe('function');
    expect(mockEnvWithIsTest.isTest!()).toBe(true);
  });
});
