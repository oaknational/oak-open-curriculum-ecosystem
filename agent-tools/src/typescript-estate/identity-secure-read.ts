import { err, isErr, type Result } from '@oaknational/result';

import {
  observeAndValidateIdentityPath,
  validateIdentityContainment,
  type IdentityPathApi,
} from './identity-path-observation.js';
import type {
  ContainedIdentityRead,
  IdentityFileSystemPort,
  IdentityNodeObservation,
  IdentityReadPort,
  IdentitySecureFilePort,
} from './identity-secure-read-model.js';
export { validateIdentityPathObservation } from './identity-path-observation.js';
export type { IdentityPathApi } from './identity-path-observation.js';
export type {
  ContainedIdentityRead,
  IdentityFileKind,
  IdentityFileSystemPort,
  IdentityNodeObservation,
  IdentityPathComponentObservation,
  IdentityPathObservation,
  IdentityReadPort,
  IdentitySecureFilePort,
} from './identity-secure-read-model.js';

/** Bind low-level filesystem operations to the two named path-validation phases. */
export function createIdentitySecureFilePort<Handle>(
  fileSystem: IdentityFileSystemPort<Handle>,
  pathApi?: IdentityPathApi,
): IdentitySecureFilePort<Handle> {
  return {
    canonicalRealpath: (pathValue) => invoke(() => fileSystem.realpath(pathValue)),
    validateBeforeOpen: (input) =>
      observeAndValidateIdentityPath(fileSystem, input, undefined, pathApi),
    openNoFollow: (pathValue) => invoke(() => fileSystem.openReadNoFollow(pathValue)),
    readRegularDescriptor: (input, handle, expected) =>
      readRegularDescriptor(fileSystem, input, handle, expected),
    validateBeforeAccept: (input, expected) => {
      const revalidated = observeAndValidateIdentityPath(fileSystem, input, expected, pathApi);
      return isErr(revalidated) ? revalidated : { ok: true, value: undefined };
    },
    close: (handle) => invoke(() => fileSystem.close(handle)),
  };
}

/**
 * Build the checked identity reader over phase-specific secure operations.
 * Every accepted byte sequence passed both path checks around one descriptor read.
 */
export function createSecureIdentityReadPort<Handle>(
  operations: IdentitySecureFilePort<Handle>,
  pathApi?: IdentityPathApi,
): IdentityReadPort {
  return {
    canonicalRealpath: (pathValue) => invoke(() => operations.canonicalRealpath(pathValue)),
    readRegularFileNoFollow: (input) => secureRead(operations, input, pathApi),
  };
}

function secureRead<Handle>(
  operations: IdentitySecureFilePort<Handle>,
  input: ContainedIdentityRead,
  pathApi?: IdentityPathApi,
): Result<Uint8Array, Error> {
  const coherent = validateIdentityContainment(input, pathApi);
  if (isErr(coherent)) {
    return coherent;
  }
  const before = invoke(() => operations.validateBeforeOpen(input));
  if (isErr(before)) {
    return before;
  }
  const opened = invoke(() => operations.openNoFollow(input.path));
  return isErr(opened)
    ? err(
        new Error(`cannot open identity member '${input.path}' without following links`, {
          cause: opened.error,
        }),
      )
    : readValidateAndClose(operations, input, opened.value, before.value);
}

function readValidateAndClose<Handle>(
  operations: IdentitySecureFilePort<Handle>,
  input: ContainedIdentityRead,
  handle: Handle,
  expected: IdentityNodeObservation,
): Result<Uint8Array, Error> {
  const bytes = invoke(() => operations.readRegularDescriptor(input, handle, expected));
  const outcome = isErr(bytes)
    ? bytes
    : afterReadValidation(operations, input, bytes.value, expected);
  const closed = invoke(() => operations.close(handle));
  if (isErr(closed)) {
    const causes = isErr(outcome) ? [outcome.error, closed.error] : [closed.error];
    return err(new AggregateError(causes, `cannot safely close identity member '${input.path}'`));
  }
  return outcome;
}

function afterReadValidation<Handle>(
  operations: IdentitySecureFilePort<Handle>,
  input: ContainedIdentityRead,
  bytes: Uint8Array,
  expected: IdentityNodeObservation,
): Result<Uint8Array, Error> {
  const after = invoke(() => operations.validateBeforeAccept(input, expected));
  return isErr(after) ? after : { ok: true, value: bytes };
}

function readRegularDescriptor<Handle>(
  fileSystem: IdentityFileSystemPort<Handle>,
  input: ContainedIdentityRead,
  handle: Handle,
  expected: IdentityNodeObservation,
): Result<Uint8Array, Error> {
  const descriptor = invoke(() => fileSystem.fstat(handle));
  if (isErr(descriptor)) {
    return err(
      new Error(`cannot inspect identity descriptor '${input.path}'`, { cause: descriptor.error }),
    );
  }
  if (descriptor.value.kind !== 'file') {
    return err(new Error(`identity member '${input.path}' is not a regular descriptor`));
  }
  if (descriptor.value.device !== expected.device || descriptor.value.inode !== expected.inode) {
    return err(
      new Error(
        `identity descriptor '${input.path}' is not the validated node; refusing swapped ancestry`,
      ),
    );
  }
  const bytes = invoke(() => fileSystem.read(handle));
  return isErr(bytes)
    ? err(new Error(`cannot read identity descriptor '${input.path}'`, { cause: bytes.error }))
    : bytes;
}

function invoke<T>(operation: () => Result<T, Error>): Result<T, Error> {
  try {
    return operation();
  } catch (cause: unknown) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}
