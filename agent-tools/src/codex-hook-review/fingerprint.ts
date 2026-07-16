import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@oaknational/result';

import { type RuntimeFingerprint } from './activation.js';
import { CODEX_REVIEW_BENCHMARK_VERSION } from './benchmark.js';
import { BENCHMARK_CORPUS } from './corpus.js';
import {
  probeVersion,
  readBoundedAsset,
  resolveFingerprintExecutables,
  sha256File,
  supportsSafeClaudeAsyncOutput,
  type FingerprintExecutables,
  type FingerprintIoError,
} from './fingerprint-io.js';
import { GITLEAKS_ARGS } from './gitleaks.js';
import {
  fingerprintInvocationSha256,
  type FingerprintInvocation,
} from './invocation-fingerprint.js';
import { fixedReviewPrompt, type ReviewRuntimeLayout } from './review-assets.js';
import { sha256AdapterBundle, type RuntimeIntegrityError } from './runtime-integrity.js';
import {
  MODEL_CONFIGURATIONS,
  TOURNAMENT_CELLS,
  type TournamentCellId,
} from './tournament-types.js';

export { resolveFingerprintExecutables };
export type { FingerprintExecutables };

export interface ComputeRuntimeFingerprintInput {
  readonly projectRoot: string;
  readonly selectedCellId: TournamentCellId;
  readonly layout: ReviewRuntimeLayout;
  readonly invocation: FingerprintInvocation;
  readonly executables: FingerprintExecutables;
}

interface FingerprintEvidence {
  readonly adapterBuildSha256: string;
  readonly nodeBinarySha256: string;
  readonly nodeVersion: string;
  readonly claudeBinarySha256: string;
  readonly claudeVersion: string;
  readonly codexBinarySha256: string;
  readonly codexVersion: string;
  readonly gitleaksBinarySha256: string;
  readonly gitleaksVersion: string;
  readonly instructions: string;
  readonly outputSchema: string;
  readonly skill: string;
}

interface ExecutableEvidence {
  readonly binarySha256: string;
  readonly version: string;
}

interface ReviewAssetEvidence {
  readonly instructions: string;
  readonly outputSchema: string;
  readonly skill: string;
}

export type RuntimeFingerprintError =
  | { readonly kind: 'unknown-tournament-cell' }
  | { readonly kind: 'unknown-model-configuration' }
  | { readonly kind: 'unsafe-claude-version' }
  | { readonly kind: 'fingerprint-io-failed'; readonly error: FingerprintIoError }
  | { readonly kind: 'runtime-integrity-failed'; readonly error: RuntimeIntegrityError };

/** Hash every activation-relevant binary, asset, invocation, model, and corpus input. */
export async function computeRuntimeFingerprint(
  input: ComputeRuntimeFingerprintInput,
): Promise<Result<RuntimeFingerprint, RuntimeFingerprintError>> {
  const cell = TOURNAMENT_CELLS.find((candidate) => candidate.id === input.selectedCellId);
  if (cell === undefined) {
    return err({ kind: 'unknown-tournament-cell' });
  }
  const model = MODEL_CONFIGURATIONS.find(
    (candidate) => candidate.id === cell.modelConfigurationId,
  );
  if (model === undefined) {
    return err({ kind: 'unknown-model-configuration' });
  }
  const evidence = await collectFingerprintEvidence(input);
  if (!evidence.ok) {
    return evidence;
  }
  if (!supportsSafeClaudeAsyncOutput(evidence.value.claudeVersion)) {
    return err({ kind: 'unsafe-claude-version' });
  }

  return ok({
    adapterBuildSha256: evidence.value.adapterBuildSha256,
    nodeBinarySha256: evidence.value.nodeBinarySha256,
    nodeVersion: evidence.value.nodeVersion,
    claudeBinarySha256: evidence.value.claudeBinarySha256,
    claudeVersion: evidence.value.claudeVersion,
    codexBinarySha256: evidence.value.codexBinarySha256,
    codexVersion: evidence.value.codexVersion,
    modelConfigurationSha256: sha256Json(model),
    authMode: 'chatgpt-login-dedicated-codex-home',
    invocationSha256: fingerprintInvocationSha256(input.invocation),
    instructionAssetSha256: sha256(`${evidence.value.instructions}\n${evidence.value.skill}`),
    outputSchemaSha256: sha256(evidence.value.outputSchema),
    effectivePromptSha256: sha256(fixedReviewPrompt(cell.mechanism)),
    gitleaksBinarySha256: evidence.value.gitleaksBinarySha256,
    gitleaksVersion: evidence.value.gitleaksVersion,
    gitleaksConfigSha256: sha256Json({ source: 'gitleaks-default', args: GITLEAKS_ARGS }),
    corpusSha256: sha256Json(BENCHMARK_CORPUS),
    benchmarkVersion: CODEX_REVIEW_BENCHMARK_VERSION,
  });
}

async function collectFingerprintEvidence(
  input: ComputeRuntimeFingerprintInput,
): Promise<Result<FingerprintEvidence, RuntimeFingerprintError>> {
  const [adapter, node, claude, codex, gitleaks, assets] = await Promise.all([
    sha256AdapterBundle(input.projectRoot),
    collectExecutableEvidence(input.executables.node),
    collectExecutableEvidence(input.executables.claude),
    collectExecutableEvidence(input.executables.codex),
    collectExecutableEvidence(input.executables.gitleaks, ['version']),
    collectReviewAssetEvidence(input.layout),
  ]);
  if (!adapter.ok) {
    return err({ kind: 'runtime-integrity-failed', error: adapter.error });
  }
  if (!node.ok) {
    return fingerprintIoFailure(node.error);
  }
  if (!claude.ok) {
    return fingerprintIoFailure(claude.error);
  }
  if (!codex.ok) {
    return fingerprintIoFailure(codex.error);
  }
  if (!gitleaks.ok) {
    return fingerprintIoFailure(gitleaks.error);
  }
  if (!assets.ok) {
    return fingerprintIoFailure(assets.error);
  }
  return ok({
    adapterBuildSha256: adapter.value,
    nodeBinarySha256: node.value.binarySha256,
    nodeVersion: node.value.version,
    claudeBinarySha256: claude.value.binarySha256,
    claudeVersion: claude.value.version,
    codexBinarySha256: codex.value.binarySha256,
    codexVersion: codex.value.version,
    gitleaksBinarySha256: gitleaks.value.binarySha256,
    gitleaksVersion: gitleaks.value.version,
    instructions: assets.value.instructions,
    outputSchema: assets.value.outputSchema,
    skill: assets.value.skill,
  });
}

async function collectExecutableEvidence(
  executable: string,
  versionArgs?: readonly string[],
): Promise<Result<ExecutableEvidence, FingerprintIoError>> {
  const [binarySha256, version] = await Promise.all([
    sha256File(executable),
    probeVersion(executable, versionArgs),
  ]);
  if (!binarySha256.ok) {
    return binarySha256;
  }
  return version.ok ? ok({ binarySha256: binarySha256.value, version: version.value }) : version;
}

async function collectReviewAssetEvidence(
  layout: ReviewRuntimeLayout,
): Promise<Result<ReviewAssetEvidence, FingerprintIoError>> {
  const [instructions, outputSchema, skill] = await Promise.all([
    readBoundedAsset(layout.instructionsPath),
    readBoundedAsset(layout.outputSchemaPath),
    layout.skillPath === undefined ? Promise.resolve(ok('')) : readBoundedAsset(layout.skillPath),
  ]);
  if (!instructions.ok) {
    return instructions;
  }
  if (!outputSchema.ok) {
    return outputSchema;
  }
  return skill.ok
    ? ok({ instructions: instructions.value, outputSchema: outputSchema.value, skill: skill.value })
    : skill;
}

function fingerprintIoFailure(error: FingerprintIoError): Result<never, RuntimeFingerprintError> {
  return err({ kind: 'fingerprint-io-failed', error });
}

function sha256Json(value: unknown): string {
  return sha256(JSON.stringify(value));
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
