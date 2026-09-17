import { Buffer } from 'node:buffer';
import { createHash, type Hash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import type { GraphNode } from './graph-model.js';
import type { GraphNodeInput } from './graph-node-input.js';
import {
  compareGraphText,
  validateGraphRepoPath,
  withoutTrailingSlashes,
} from './graph-validation.js';
import type { GraphNodeKind } from './graph-vocabulary.js';
import { lengthFrame } from './length-framing.js';
import type { RepoPath, Sha256 } from './scalar-model.js';

export type { GraphNodeInput } from './graph-node-input.js';

const NODE_DOMAIN = Buffer.from('typescript-estate-graph-node-v1\0', 'utf8');
const NUL = Buffer.from([0]);

interface DerivedNodeIdentity {
  readonly kind: GraphNodeKind;
  readonly components: readonly string[];
  readonly path: RepoPath | null;
}

/** Construct one graph node from the frozen kind-specific identity vocabulary. */
export function createGraphNode(input: GraphNodeInput): Result<GraphNode, EstateReviewError> {
  const derived = deriveNodeIdentity(input);
  if (isErr(derived)) {
    return derived;
  }
  const valid = validateComponents(derived.value.components);
  if (isErr(valid)) {
    return valid;
  }
  const digest = hashNode(derived.value.kind, derived.value.components);
  return isErr(digest)
    ? digest
    : ok({
        id: `node:${derived.value.kind}:${digest.value}`,
        kind: derived.value.kind,
        identityComponents: derived.value.components,
        label: derived.value.components.join(' :: '),
        path: derived.value.path,
      });
}

/** Deduplicate value-equal nodes and reject unequal values sharing an id. */
export function deduplicateGraphNodes(
  nodes: readonly GraphNode[],
): Result<readonly GraphNode[], EstateReviewError> {
  const byId = new Map<string, GraphNode>();
  for (const node of nodes) {
    const existing = byId.get(node.id);
    if (existing === undefined) {
      byId.set(node.id, node);
    } else if (!sameNode(existing, node)) {
      return err(
        new EstateReviewError(
          'VALIDATION_FAILED',
          `graph node id collision '${node.id}' has unequal identity values`,
        ),
      );
    }
  }
  return ok([...byId.values()].sort((left, right) => compareGraphText(left.id, right.id)));
}

function deriveNodeIdentity(input: GraphNodeInput): Result<DerivedNodeIdentity, EstateReviewError> {
  if (input.kind === 'file') {
    return repoPathNode('file', [input.path], input.path, [input.path]);
  }
  if (input.kind === 'workspace') {
    return repoPathNode(
      'workspace',
      [input.root, input.manifestPath, input.packageName ?? '<unnamed>'],
      null,
      [input.root, input.manifestPath],
    );
  }
  if (input.kind === 'package') {
    return ok({
      kind: 'package',
      components: [input.ownership, input.packageName, input.subpath ?? '.'],
      path: null,
    });
  }
  return deriveOperationalNodeIdentity(input);
}

function deriveOperationalNodeIdentity(
  input: Exclude<GraphNodeInput, { readonly kind: 'file' | 'workspace' | 'package' }>,
): Result<DerivedNodeIdentity, EstateReviewError> {
  if (input.kind === 'command') {
    return repoPathNode(
      'command',
      [input.manifestPath, input.scriptName, input.literalCommand],
      null,
      [input.manifestPath],
    );
  }
  if (input.kind === 'artefact') {
    return deriveArtefactIdentity(input.identity);
  }
  if (input.kind === 'registration') {
    return deriveRegistrationIdentity(input);
  }
  return ok({
    kind: 'external-contract',
    components: [input.contractKind, input.identifier],
    path: null,
  });
}

function deriveArtefactIdentity(
  identity: Extract<GraphNodeInput, { readonly kind: 'artefact' }>['identity'],
): Result<DerivedNodeIdentity, EstateReviewError> {
  if (identity.kind === 'repo-path') {
    return repoPathNode('artefact', ['repo-path', identity.path], identity.path, [identity.path]);
  }
  if (identity.kind === 'external-input') {
    return ok({
      kind: 'artefact',
      components: ['external-input', identity.identifier],
      path: null,
    });
  }
  const prefix = withoutTrailingSlashes(identity.prefix);
  if (prefix.length === 0 || !isSha256(identity.memberSetSha256)) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        'repo-prefix identity requires a non-empty prefix and SHA-256 member digest',
      ),
    );
  }
  return repoPathNode('artefact', ['repo-prefix', `${prefix}/`, identity.memberSetSha256], null, [
    prefix,
  ]);
}

function deriveRegistrationIdentity(
  input: Extract<GraphNodeInput, { readonly kind: 'registration' }>,
): Result<DerivedNodeIdentity, EstateReviewError> {
  if (!Number.isSafeInteger(input.startLine) || input.startLine < 1) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        'registration line must be a positive safe integer',
      ),
    );
  }
  return repoPathNode(
    'registration',
    [
      input.sourcePath,
      String(input.startLine),
      input.terminalCallName,
      input.target ?? '<dynamic>',
    ],
    null,
    [input.sourcePath],
  );
}

function repoPathNode(
  kind: GraphNodeKind,
  components: readonly string[],
  path: RepoPath | null,
  repoPaths: readonly RepoPath[],
): Result<DerivedNodeIdentity, EstateReviewError> {
  for (const repoPath of repoPaths) {
    const valid = validateGraphRepoPath(repoPath);
    if (isErr(valid)) {
      return valid;
    }
  }
  return ok({ kind, components, path });
}

function validateComponents(components: readonly string[]): Result<undefined, EstateReviewError> {
  const invalid = components.find(
    (component) => component.length === 0 || component.includes('\0'),
  );
  if (invalid === undefined) {
    return ok(undefined);
  }
  const reason =
    invalid.length === 0
      ? 'graph identity components must be non-empty'
      : 'graph identity components must not contain NUL';
  return err(new EstateReviewError('VALIDATION_FAILED', reason));
}

function hashNode(
  kind: GraphNodeKind,
  components: readonly string[],
): Result<Sha256, EstateReviewError> {
  const hash = createHash('sha256').update(NODE_DOMAIN).update(kind, 'utf8').update(NUL);
  for (const component of components) {
    const appended = appendFramed(hash, component);
    if (isErr(appended)) {
      return appended;
    }
  }
  return ok(hash.digest('hex'));
}

function appendFramed(hash: Hash, value: string): Result<undefined, EstateReviewError> {
  const framed = lengthFrame(Buffer.from(value, 'utf8'));
  if (isErr(framed)) {
    return err(
      new EstateReviewError('VALIDATION_FAILED', 'cannot frame graph identity component', {
        cause: framed.error,
      }),
    );
  }
  hash.update(framed.value.length);
  hash.update(framed.value.bytes);
  return ok(undefined);
}

function sameNode(left: GraphNode, right: GraphNode): boolean {
  return (
    left.kind === right.kind &&
    left.label === right.label &&
    left.path === right.path &&
    left.identityComponents.length === right.identityComponents.length &&
    left.identityComponents.every(
      (component, index) => component === right.identityComponents[index],
    )
  );
}

function isSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/u.test(value);
}
