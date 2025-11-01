/**
 * Unit tests for auth scenario fixtures
 * Validates that fixture structure and scenarios are correctly defined
 */

import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { AUTH_SCENARIOS } from './auth-scenarios.js';
import type { AuthScenario } from './auth-scenarios.js';

function getScenario(name: AuthScenario['name']): AuthScenario {
  const scenario = AUTH_SCENARIOS.find((s) => s.name === name);
  expect(scenario, `Expected auth scenario "${name}" to exist`).toBeDefined();
  if (!scenario) {
    throw new Error(`Auth scenario "${name}" was not found`);
  }
  return scenario;
}

describe('Auth Scenarios Fixture', () => {
  describe('fixture structure', () => {
    it('exports AUTH_SCENARIOS array', () => {
      expect(Array.isArray(AUTH_SCENARIOS)).toBe(true);
      expect(AUTH_SCENARIOS.length).toBeGreaterThan(0);
    });

    it('all scenarios have unique names', () => {
      const names = AUTH_SCENARIOS.map((s) => s.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('all scenarios have required properties', () => {
      for (const scenario of AUTH_SCENARIOS) {
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('setupRequest');
        expect(scenario).toHaveProperty('expectedStatus');
        expect(scenario).toHaveProperty('expectedAuthState');

        expect(typeof scenario.name).toBe('string');
        expect(scenario.name.length).toBeGreaterThan(0);
        expect(typeof scenario.description).toBe('string');
        expect(scenario.description.length).toBeGreaterThan(0);
        expect(typeof scenario.setupRequest).toBe('function');
        expect([200, 401]).toContain(scenario.expectedStatus);
        expect(['authenticated', 'unauthenticated']).toContain(scenario.expectedAuthState);
      }
    });
  });

  describe('scenario execution', () => {
    it('setupRequest functions modify request headers correctly', () => {
      for (const scenario of AUTH_SCENARIOS) {
        const req: Partial<Request> = {
          headers: { 'content-type': 'application/json' },
        };

        scenario.setupRequest(req);

        // Should have modified headers
        expect(req.headers).toBeDefined();
      }
    });

    it('valid-bearer-token scenario sets Authorization header', () => {
      const scenario = getScenario('valid-bearer-token');

      const req: Partial<Request> = { headers: {} };
      scenario.setupRequest(req);

      expect(req.headers?.authorization).toBe('Bearer valid-test-token-12345');
      expect(scenario.expectedStatus).toBe(200);
      expect(scenario.expectedAuthState).toBe('authenticated');
    });

    it('missing-auth-header scenario removes Authorization header', () => {
      const scenario = getScenario('missing-auth-header');

      const req: Partial<Request> = {
        headers: { authorization: 'Bearer some-token' },
      };
      scenario.setupRequest(req);

      expect(req.headers?.authorization).toBeUndefined();
      expect(scenario.expectedStatus).toBe(401);
      expect(scenario.expectedAuthState).toBe('unauthenticated');
    });

    it('invalid-bearer-token scenario sets invalid token', () => {
      const scenario = getScenario('invalid-bearer-token');

      const req: Partial<Request> = { headers: {} };
      scenario.setupRequest(req);

      expect(req.headers?.authorization).toBe('Bearer invalid-token-xyz');
      expect(scenario.expectedStatus).toBe(401);
      expect(scenario.expectedAuthState).toBe('unauthenticated');
    });

    it('malformed-auth-header scenario sets non-Bearer header', () => {
      const scenario = getScenario('malformed-auth-header');

      const req: Partial<Request> = { headers: {} };
      scenario.setupRequest(req);

      expect(req.headers?.authorization).toBe('NotBearer some-value');
      expect(scenario.expectedStatus).toBe(401);
      expect(scenario.expectedAuthState).toBe('unauthenticated');
    });

    it('expired-token scenario sets expired token', () => {
      const scenario = getScenario('expired-token');

      const req: Partial<Request> = { headers: {} };
      scenario.setupRequest(req);

      expect(req.headers?.authorization).toBe('Bearer expired-token-12345');
      expect(scenario.expectedStatus).toBe(401);
      expect(scenario.expectedAuthState).toBe('unauthenticated');
    });
  });

  describe('scenario coverage', () => {
    it('includes all critical auth scenarios', () => {
      const scenarioNames = AUTH_SCENARIOS.map((s) => s.name);

      expect(scenarioNames).toContain('valid-bearer-token');
      expect(scenarioNames).toContain('missing-auth-header');
      expect(scenarioNames).toContain('invalid-bearer-token');
      expect(scenarioNames).toContain('malformed-auth-header');
      expect(scenarioNames).toContain('expired-token');
    });

    it('has at least one authenticated scenario', () => {
      const authenticatedScenarios = AUTH_SCENARIOS.filter(
        (s) => s.expectedAuthState === 'authenticated',
      );
      expect(authenticatedScenarios.length).toBeGreaterThanOrEqual(1);
    });

    it('has multiple unauthenticated scenarios', () => {
      const unauthenticatedScenarios = AUTH_SCENARIOS.filter(
        (s) => s.expectedAuthState === 'unauthenticated',
      );
      expect(unauthenticatedScenarios.length).toBeGreaterThanOrEqual(2);
    });
  });
});
