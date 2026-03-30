import { describe, expect, it } from 'vitest';

import { measureAuthSetupStep } from '../auth-instrumentation.js';
import { createRecordingLogger } from '../test-helpers/fakes.js';

function contextMatchesStep(context: unknown, step: string): boolean {
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    return false;
  }
  if (!('step' in context)) {
    return false;
  }
  return context.step === step;
}

describe('measureAuthSetupStep', () => {
  it('logs finish entry when operation succeeds', () => {
    const { logger, entries } = createRecordingLogger();

    const outcome = measureAuthSetupStep(logger, 'clerkMiddleware.create', () => 'ok');

    expect(outcome).toBe('ok');
    const startEntry = entries.find(
      (entry) =>
        entry.message === 'auth.bootstrap.step.start' &&
        contextMatchesStep(entry.context, 'clerkMiddleware.create'),
    );
    expect(startEntry).toBeDefined();
    const finishEntry = entries.find(
      (entry) =>
        entry.message === 'auth.bootstrap.step.finish' &&
        contextMatchesStep(entry.context, 'clerkMiddleware.create'),
    );
    expect(finishEntry).toBeDefined();
    const errorEntry = entries.find((entry) => entry.message === 'auth.bootstrap.step.error');
    expect(errorEntry).toBeUndefined();
  });

  it('logs error entry when operation throws', () => {
    const { logger, entries } = createRecordingLogger();

    expect(() =>
      measureAuthSetupStep(logger, 'registerPublicOAuthMetadata', () => {
        throw new Error('boom');
      }),
    ).toThrow(new Error('boom'));

    const errorEntry = entries.find(
      (entry) =>
        entry.message === 'auth.bootstrap.step.error' &&
        contextMatchesStep(entry.context, 'registerPublicOAuthMetadata'),
    );
    expect(errorEntry).toBeDefined();
  });
});
