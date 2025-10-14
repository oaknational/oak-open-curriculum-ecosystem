import { vi } from 'vitest';
import type { createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';

type OakSdkModule = {
  readonly [key: PropertyKey]: unknown;
  readonly createOakPathBasedClient: typeof createOakPathBasedClient;
};
type CreateOakPathBasedClient = OakSdkModule['createOakPathBasedClient'];

interface MockReferences {
  actual: OakSdkModule | null;
  overrides: {
    createOakPathBasedClient: CreateOakPathBasedClient | null;
  };
}

const references = vi.hoisted<MockReferences>(() => ({
  actual: null,
  overrides: {
    createOakPathBasedClient: null,
  },
}));

vi.mock('@oaknational/oak-curriculum-sdk', async (importActual) => {
  const candidate = await importActual();
  if (!isOakSdkModule(candidate)) {
    throw new Error('Oak SDK module mock failed to resolve the actual module.');
  }
  const actual = candidate;
  references.actual = actual;
  return {
    ...actual,
    createOakPathBasedClient: (...args) => {
      const override = references.overrides.createOakPathBasedClient;
      const implementation: CreateOakPathBasedClient = override ?? actual.createOakPathBasedClient;
      return implementation(...args);
    },
  } satisfies OakSdkModule;
});

export function setOakCurriculumSdkMock(
  builder: (actual: OakSdkModule) => Partial<OakSdkModule>,
): void {
  const actual = references.actual;
  if (!actual) {
    throw new Error('Oak SDK module has not been initialised for mocking.');
  }
  const partial = builder(actual);
  if (partial.createOakPathBasedClient) {
    references.overrides.createOakPathBasedClient = partial.createOakPathBasedClient;
  }
}

export function resetOakCurriculumSdkMock(): void {
  references.overrides.createOakPathBasedClient = null;
}

export type { OakSdkModule };

function isOakSdkModule(value: unknown): value is OakSdkModule {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const descriptor = Object.getOwnPropertyDescriptor(value, 'createOakPathBasedClient');
  if (!descriptor) {
    return false;
  }
  if ('value' in descriptor && typeof descriptor.value === 'function') {
    return true;
  }
  const getter = descriptor.get;
  if (typeof getter !== 'function') {
    return false;
  }
  const resolved: unknown = getter.call(value);
  return typeof resolved === 'function';
}
