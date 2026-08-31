import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  comparablePath,
  fullyQualifiedForFlavour,
  hasDotSegments,
  isWithin,
  type IdentityPathApi,
} from './identity-path-flavour.js';
import type {
  ContainedIdentityRead,
  IdentityFileKind,
  IdentityFileSystemPort,
  IdentityNodeObservation,
  IdentityPathObservation,
} from './identity-secure-read-model.js';

export type { IdentityPathApi };

/**
 * Collect and validate one immutable no-symlink path observation, returning
 * the validated LEAF node identity. When `expected` is supplied (the
 * post-read phase), a leaf whose identity has changed since the pre-open
 * phase is refused even if the path shape still validates.
 */
export function observeAndValidateIdentityPath<Handle>(
  fileSystem: IdentityFileSystemPort<Handle>,
  input: ContainedIdentityRead,
  expected?: IdentityNodeObservation,
  pathApi: IdentityPathApi = path,
): Result<IdentityNodeObservation, Error> {
  const observed = observeIdentityPath(fileSystem, input, pathApi);
  if (isErr(observed)) {
    return observed;
  }
  const valid = validateIdentityPathObservation(input, observed.value, pathApi);
  if (isErr(valid)) {
    return valid;
  }
  return leafIdentityFrom(input, observed.value, expected);
}

function leafIdentityFrom(
  input: ContainedIdentityRead,
  observation: IdentityPathObservation,
  expected?: IdentityNodeObservation,
): Result<IdentityNodeObservation, Error> {
  const leaf = observation.components.at(-1);
  if (leaf?.kind !== 'file' || leaf.device === undefined || leaf.inode === undefined) {
    return err(new Error(`identity member '${input.path}' carries no node identity`));
  }
  const identity: IdentityNodeObservation = {
    kind: leaf.kind,
    device: leaf.device,
    inode: leaf.inode,
  };
  return expected !== undefined &&
    (identity.device !== expected.device || identity.inode !== expected.inode)
    ? err(new Error(`identity member '${input.path}' changed identity between validation phases`))
    : ok(identity);
}

/**
 * Validate lexical roots before any injected filesystem operation is
 * consulted.
 *
 * @remarks
 * Three rules, all lexical:
 *
 * 1. **Absolute** — chain root, owner root, and member path must be fully
 *    qualified: POSIX-absolute on the posix flavour; on win32,
 *    drive-qualified (`C:\…`) — rooted drive-relative paths (`\x`, resolved
 *    against the process's current drive) and UNC shares are refused (see
 *    {@link fullyQualifiedWin32}).
 * 2. **No dot segments** — a `..` through a symlinked component would be
 *    collapsed lexically by the normalised comparisons downstream, letting
 *    the observed component chain skip the very component the no-symlink
 *    sweep exists to inspect (2026-08-12 security review). Dot segments are
 *    refused outright, never resolved.
 * 3. **Member inside owner** — the owner root must sit within the chain
 *    root, and the member path strictly within the owner root.
 *
 * Precondition: callers hold fully RESOLVED paths — there is no legitimate
 * relative, dot-segment, or drive-relative input.
 */
export function validateIdentityContainment(
  input: ContainedIdentityRead,
  pathApi: IdentityPathApi = path,
): Result<undefined, Error> {
  const inputs = [input.chainRoot, input.ownerRoot, input.path];
  if (!inputs.every((value) => fullyQualifiedForFlavour(value, pathApi))) {
    return err(new Error('identity roots and member path must be fully qualified absolute paths'));
  }
  if (inputs.some((value) => hasDotSegments(value))) {
    return err(new Error('identity roots and member path must not contain "." or ".." segments'));
  }
  if (!isWithin(input.chainRoot, input.ownerRoot, pathApi)) {
    return err(
      new Error(`identity owner root '${input.ownerRoot}' escapes chain root '${input.chainRoot}'`),
    );
  }
  // "Strictly within" judges the comparable form: on win32 a case-only or
  // separator-only variant of the owner root itself is still the owner root,
  // not a member inside it.
  return comparablePath(input.path, pathApi) === comparablePath(input.ownerRoot, pathApi) ||
    !isWithin(input.ownerRoot, input.path, pathApi)
    ? err(new Error(`identity member '${input.path}' escapes owning root '${input.ownerRoot}'`))
    : ok(undefined);
}

/** Decide path safety from immutable observations with no filesystem access. */
export function validateIdentityPathObservation(
  input: ContainedIdentityRead,
  observation: IdentityPathObservation,
  pathApi: IdentityPathApi = path,
): Result<undefined, Error> {
  const coherent = validateIdentityContainment(input, pathApi);
  if (isErr(coherent)) {
    return coherent;
  }
  const expectedPaths = identityComponentPaths(input, pathApi);
  if (observation.components.length !== expectedPaths.length) {
    return err(new Error(`identity path observation for '${input.path}' is incomplete`));
  }
  const components = validateObservedComponents(
    input.path,
    expectedPaths,
    observation.components,
    pathApi,
  );
  if (isErr(components)) {
    return components;
  }
  return comparablePath(observation.canonicalPath, pathApi) ===
    comparablePath(input.path, pathApi) &&
    isWithin(input.ownerRoot, observation.canonicalPath, pathApi)
    ? ok(undefined)
    : err(
        new Error(
          `identity member '${input.path}' resolves to '${observation.canonicalPath}', outside its exact lexical owner`,
        ),
      );
}

function validateObservedComponents(
  memberPath: string,
  expectedPaths: readonly string[],
  components: IdentityPathObservation['components'],
  pathApi: IdentityPathApi,
): Result<undefined, Error> {
  for (const [index, expectedPath] of expectedPaths.entries()) {
    const component = components[index];
    // Comparable-form comparison for the same reason as isWithin: separator
    // form (and, on win32, letter case) is not identity — the expected chain
    // is host-joined while the observed one echoes the caller's form.
    if (
      component === undefined ||
      comparablePath(component.path, pathApi) !== comparablePath(expectedPath, pathApi)
    ) {
      return err(new Error(`identity path observation for '${memberPath}' is reordered`));
    }
    const expectedKind: IdentityFileKind =
      index === expectedPaths.length - 1 ? 'file' : 'directory';
    const kind = validateComponentKind(expectedPath, component.kind, expectedKind);
    if (isErr(kind)) {
      return kind;
    }
  }
  return ok(undefined);
}

function validateComponentKind(
  componentPath: string,
  observedKind: IdentityFileKind | undefined,
  expectedKind: IdentityFileKind,
): Result<undefined, Error> {
  if (observedKind === 'symlink') {
    return err(new Error(`identity path component '${componentPath}' is a symlink`));
  }
  return observedKind === expectedKind
    ? ok(undefined)
    : err(new Error(`identity path component '${componentPath}' is not a ${expectedKind}`));
}

function observeIdentityPath<Handle>(
  fileSystem: IdentityFileSystemPort<Handle>,
  input: ContainedIdentityRead,
  pathApi: IdentityPathApi,
): Result<IdentityPathObservation, Error> {
  const coherent = validateIdentityContainment(input, pathApi);
  if (isErr(coherent)) {
    return coherent;
  }
  const components = [];
  for (const componentPath of identityComponentPaths(input, pathApi)) {
    const inspected = invoke(() => fileSystem.lstat(componentPath));
    if (isErr(inspected)) {
      return err(
        new Error(`cannot inspect identity path component '${componentPath}'`, {
          cause: inspected.error,
        }),
      );
    }
    components.push({
      path: componentPath,
      kind: inspected.value?.kind,
      device: inspected.value?.device,
      inode: inspected.value?.inode,
    });
  }
  const canonical = invoke(() => fileSystem.realpath(input.path));
  return isErr(canonical)
    ? err(new Error(`cannot resolve identity member '${input.path}'`, { cause: canonical.error }))
    : ok({ components, canonicalPath: canonical.value });
}

function identityComponentPaths(
  input: ContainedIdentityRead,
  pathApi: IdentityPathApi,
): readonly string[] {
  const segments = pathApi.relative(input.chainRoot, input.path).split(pathApi.sep);
  return segments.map((_segment, index) =>
    pathApi.join(input.chainRoot, ...segments.slice(0, index + 1)),
  );
}

function invoke<T>(operation: () => Result<T, Error>): Result<T, Error> {
  try {
    return operation();
  } catch (cause: unknown) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}
