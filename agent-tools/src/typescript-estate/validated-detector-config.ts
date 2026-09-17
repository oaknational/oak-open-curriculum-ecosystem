import { createHash } from 'node:crypto';

import type { AnySchema } from 'ajv';
import { err, isErr, ok, type Result } from '@oaknational/result';
import { parseJsonTextResult } from '../core/json.js';

import type { FileClassificationConfig } from './config-classification-model.js';
import type { DetectorConfig } from './config-model.js';
import { EstateReviewError } from './errors.js';
import { compileStrictSchema } from './schema-validation.js';

const CONFIG_SHA256 = '54ace41d941d9fe190b1fd467a3c3ed8aac223953a2e28841b573830e83c7c2d';
const SCHEMA_SHA256 = 'cc052b863ff972b7cfaf03dc53098b6081dcaf9f67faf1984b7c8019d28c8016';

/** Accepted SHA-256 identities for the frozen detector document and its schema. */
export interface DetectorContractHashes {
  readonly configSha256: string;
  readonly schemaSha256: string;
}

/** Exact UTF-8 text loaded from the frozen detector document and its schema. */
export interface FrozenDetectorTexts {
  readonly configText: string;
  readonly schemaText: string;
}

/** A detector document constructible only through the reviewed schema and exact frozen bytes. */
export class ValidatedDetectorConfig {
  readonly #config: DetectorConfig;

  private constructor(config: DetectorConfig) {
    this.#config = structuredClone(config);
  }

  /** Validate exact identities, compile the strict whole schema, and parse the detector document. */
  static fromFrozenTexts(
    texts: FrozenDetectorTexts,
  ): Result<ValidatedDetectorConfig, EstateReviewError> {
    const identity = verifyDetectorContractHashes({
      configSha256: sha256(texts.configText),
      schemaSha256: sha256(texts.schemaText),
    });
    if (isErr(identity)) {
      return identity;
    }
    const schema = parseJsonTextResult(texts.schemaText, 'detector config schema');
    if (isErr(schema) || !isJsonSchema(schema.value)) {
      return err(
        new EstateReviewError('CONFIG_INVALID', 'detector config schema is not a JSON Schema', {
          cause: isErr(schema) ? schema.error : undefined,
        }),
      );
    }
    const compiled = compileStrictSchema<DetectorConfig>(schema.value, 'detector config');
    if (isErr(compiled)) {
      return compiled;
    }
    const config = compiled.value.parse(texts.configText);
    return isErr(config) ? config : ok(new ValidatedDetectorConfig(config.value));
  }

  /** Return a defensive classification-only projection of the validated detector document. */
  classification(): FileClassificationConfig {
    return structuredClone({
      workspaceAttribution: this.#config.moduleResolution.workspaceAttribution,
      generatedOutputRules: this.#config.generatedOutputRules,
      provenanceClassification: this.#config.provenanceClassification,
      roleRules: this.#config.roleRules,
    });
  }
}

/** Bind the schema authority and detector document to the accepted revision 2.6 bytes. */
export function verifyDetectorContractHashes(
  identity: DetectorContractHashes,
): Result<undefined, EstateReviewError> {
  return identity.configSha256 === CONFIG_SHA256 && identity.schemaSha256 === SCHEMA_SHA256
    ? ok(undefined)
    : err(
        new EstateReviewError(
          'IDENTITY_INVALID',
          'revision 2.6 detector contract bytes do not match the independently reviewed identities',
        ),
      );
}

function isJsonSchema(value: unknown): value is AnySchema {
  return typeof value === 'boolean' || (typeof value === 'object' && value !== null);
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
