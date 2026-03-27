import type { FixtureSentryCapture, FixtureSentryStore } from './types.js';

export function createFixtureSentryStore(): FixtureSentryStore {
  const captures: FixtureSentryCapture[] = [];

  return {
    captures,
    push(capture): void {
      captures.push(capture);
    },
  };
}
