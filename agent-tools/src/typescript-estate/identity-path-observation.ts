import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import type {
  ContainedIdentityRead,
  IdentityFileKind,
  IdentityFileSystemPort,
  IdentityNodeObservation,
  IdentityPathObservation,
} from './identity-secure-read-model.js';

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
): Result<IdentityNodeObservation, Error> {
  const observed = observeIdentityPath(fileSystem, input);
  if (isErr(observed)) {
    return observed;
  }
  const valid = validateIdentityPathObservation(input, observed.value);
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

/** True when any path segment is `.` or `..` — inputs here must be already-resolved. */
function hasDotSegments(value: string): boolean {
  return value.split(/[\\/]/u).some((segment) => segment === '.' || segment === '..');
}

/** Validate lexical roots before any injected filesystem operation is consulted. */
export function validateIdentityContainment(
  input: ContainedIdentityRead,
): Result<undefined, Error> {
  const inputs = [input.chainRoot, input.ownerRoot, input.path];
  if (!inputs.every((value) => path.isAbsolute(value))) {
    return err(new Error('identity roots and member path must be absolute'));
  }
  // Refuse dot segments outright rather than resolving them: a `..` through a
  // symlinked component would be collapsed lexically by the normalised
  // comparisons below, letting the observed component chain skip the very
  // component the no-symlink sweep exists to inspect (2026-08-12 security
  // review). Callers hold fully resolved paths; there is no legitimate
  // dot-segment input.
  if (inputs.some((value) => hasDotSegments(value))) {
    return err(new Error('identity roots and member path must not contain "." or ".." segments'));
  }
  if (!isWithin(input.chainRoot, input.ownerRoot)) {
    return err(
      new Error(`identity owner root '${input.ownerRoot}' escapes chain root '${input.chainRoot}'`),
    );
  }
  return input.path === input.ownerRoot || !isWithin(input.ownerRoot, input.path)
    ? err(new Error(`identity member '${input.path}' escapes owning root '${input.ownerRoot}'`))
    : ok(undefined);
}

/** Decide path safety from immutable observations with no filesystem access. */
export function validateIdentityPathObservation(
  input: ContainedIdentityRead,
  observation: IdentityPathObservation,
): Result<undefined, Error> {
  const coherent = validateIdentityContainment(input);
  if (isErr(coherent)) {
    return coherent;
  }
  const expectedPaths = identityComponentPaths(input);
  if (observation.components.length !== expectedPaths.length) {
    return err(new Error(`identity path observation for '${input.path}' is incomplete`));
  }
  const components = validateObservedComponents(input.path, expectedPaths, observation.components);
  if (isErr(components)) {
    return components;
  }
  return path.normalize(observation.canonicalPath) === path.normalize(input.path) &&
    isWithin(input.ownerRoot, observation.canonicalPath)
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
): Result<undefined, Error> {
  for (const [index, expectedPath] of expectedPaths.entries()) {
    const component = components[index];
    // Normalised comparison for the same reason as isWithin: separator form
    // is not identity — Windows accepts both, and the expected chain is
    // host-joined while the observed one echoes the caller's form.
    if (
      component === undefined ||
      path.normalize(component.path) !== path.normalize(expectedPath)
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
): Result<IdentityPathObservation, Error> {
  const coherent = validateIdentityContainment(input);
  if (isErr(coherent)) {
    return coherent;
  }
  const components = [];
  for (const componentPath of identityComponentPaths(input)) {
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

function identityComponentPaths(input: ContainedIdentityRead): readonly string[] {
  const segments = path.relative(input.chainRoot, input.path).split(path.sep);
  return segments.map((_segment, index) =>
    path.join(input.chainRoot, ...segments.slice(0, index + 1)),
  );
}

function isWithin(base: string, candidate: string): boolean {
  // Normalise before the lexical comparison: Windows accepts forward-slash
  // absolute paths, and comparing them raw against a `path.sep` boundary
  // falsely classifies a contained path as escaping (an over-refusal, but a
  // wrong verdict either way).
  const normalisedBase = path.normalize(base);
  const normalisedCandidate = path.normalize(candidate);
  return (
    normalisedCandidate === normalisedBase ||
    normalisedCandidate.startsWith(`${normalisedBase}${path.sep}`)
  );
}

function invoke<T>(operation: () => Result<T, Error>): Result<T, Error> {
  try {
    return operation();
  } catch (cause: unknown) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}
