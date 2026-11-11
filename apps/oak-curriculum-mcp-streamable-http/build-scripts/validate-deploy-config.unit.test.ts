import { describe, expect, it } from 'vitest';
import { err, ok } from '@oaknational/result';
import { evaluateDeployConfigValidation } from './validate-deploy-config.js';

describe('evaluateDeployConfigValidation', () => {
  it('skips with exit 0 outside Vercel builds and never loads config', () => {
    let configLoaded = false;
    const verdict = evaluateDeployConfigValidation({
      isVercelBuild: false,
      loadConfig: () => {
        configLoaded = true;
        return err({ message: 'config must not be loaded outside Vercel builds' });
      },
    });

    expect(configLoaded).toBe(false);
    expect(verdict.exitCode).toBe(0);
    expect(verdict.message).toContain('skipped');
    expect(verdict.message).toContain('VERCEL');
  });

  it('passes a Vercel build whose deploy configuration resolves', () => {
    const verdict = evaluateDeployConfigValidation({
      isVercelBuild: true,
      loadConfig: () => ok({ runtimeConfig: {} }),
    });

    expect(verdict.exitCode).toBe(0);
    expect(verdict.message).toContain('valid');
  });

  it('fails a Vercel build whose deploy configuration is refused, carrying the boundary message', () => {
    const verdict = evaluateDeployConfigValidation({
      isVercelBuild: true,
      loadConfig: () =>
        err({
          message:
            'invalid PostHog product-analytics configuration: pseudonym keyring failed strict validation',
        }),
    });

    expect(verdict.exitCode).toBe(1);
    expect(verdict.message).toContain('pseudonym keyring failed strict validation');
    expect(verdict.message).toContain('deploy configuration is invalid');
  });
});
