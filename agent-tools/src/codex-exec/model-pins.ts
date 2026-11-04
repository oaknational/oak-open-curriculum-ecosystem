import { err, ok, type Result } from '@oaknational/result';

import {
  createTopLevelTomlBasicStringReader,
  type TopLevelTomlBasicStringReader,
} from '../core/toml-top-level-basic-string.js';

/**
 * The reasoning efforts the CLI accepted when tested (codex-cli 0.156.1), as
 * a closed set. An effort outside it fails closed rather than reaching the
 * argv, so a new vendor effort in the owner's configuration stops dialogues
 * until it is added here.
 */
const REASONING_EFFORTS = [
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
  'ultra',
  'persistent',
] as const;

type ReasoningEffort = (typeof REASONING_EFFORTS)[number];

/**
 * The owner's configured model and effort, carried into every dialogue call.
 * An absent key means the CLI default for that key.
 */
export interface ModelPins {
  readonly model?: string;
  readonly effort?: ReasoningEffort;
}

type PinKey = 'model' | 'model_reasoning_effort';

/**
 * Why the owner's configuration could not supply the model pins. It names
 * at most the failing key, never the configuration's text, which can hold
 * secrets.
 */
export type ModelPinsError =
  | { readonly kind: 'unparseable-config' }
  | { readonly kind: 'invalid-model-pin'; readonly key: PinKey };

const MODEL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

/**
 * Read `model` and `model_reasoning_effort` from the owner's Codex
 * configuration text, and nothing else from it.
 *
 * @param configText - The configuration file's text, or undefined when it does not exist.
 */
export function parseModelPins(configText: string | undefined): Result<ModelPins, ModelPinsError> {
  if (configText === undefined) {
    return ok({});
  }
  const reader = readConfig(configText);
  if (!reader.ok) {
    return reader;
  }
  const model = readPin(reader.value, 'model', (value) =>
    MODEL_PATTERN.test(value) ? value : undefined,
  );
  if (!model.ok) {
    return model;
  }
  const effort = readPin(reader.value, 'model_reasoning_effort', (value) =>
    REASONING_EFFORTS.find((candidate) => candidate === value),
  );
  if (!effort.ok) {
    return effort;
  }
  return ok({
    ...(model.value === undefined ? {} : { model: model.value }),
    ...(effort.value === undefined ? {} : { effort: effort.value }),
  });
}

/**
 * Parse the configuration once. The parser's error is discarded on purpose:
 * it quotes the file, and the file can hold secrets.
 */
function readConfig(configText: string): Result<TopLevelTomlBasicStringReader, ModelPinsError> {
  try {
    return ok(createTopLevelTomlBasicStringReader(configText));
  } catch {
    return err({ kind: 'unparseable-config' });
  }
}

/**
 * Read one optional top-level string key through a validator. A missing key
 * is no pin; a present key that is not a valid string fails closed.
 */
function readPin<T>(
  reader: TopLevelTomlBasicStringReader,
  key: PinKey,
  validate: (value: string) => T | undefined,
): Result<T | undefined, ModelPinsError> {
  const state = reader.inspect(key);
  if (state.kind === 'missing') {
    return ok(undefined);
  }
  const valid = state.kind === 'string' ? validate(state.value) : undefined;
  return valid === undefined ? err({ kind: 'invalid-model-pin', key }) : ok(valid);
}
