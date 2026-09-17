import type { AnySchema, ErrorObject, ValidateFunction } from 'ajv';
import Ajv from 'ajv/dist/2020.js';
import { z } from 'zod';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { parseJsonTextResult } from '../core/json.js';

import { EstateReviewError, estateError } from './errors.js';

export interface StrictSchemaValidator<T> {
  validate(value: unknown): Result<T, EstateReviewError>;
  parse(text: string): Result<T, EstateReviewError>;
}

/** Compile one frozen JSON Schema under strict 2020-12 semantics. */
export function compileStrictSchema<T>(
  schema: AnySchema,
  label: string,
): Result<StrictSchemaValidator<T>, EstateReviewError> {
  const compiled = compile<T>(schema, label);
  if (isErr(compiled)) {
    return compiled;
  }
  return ok(createValidator(compiled.value, label));
}

function compile<T>(
  schema: AnySchema,
  label: string,
): Result<ValidateFunction<T>, EstateReviewError> {
  try {
    const ajv = new Ajv({ strict: true, allErrors: true, validateFormats: true });
    ajv.addFormat('date-time', {
      type: 'string',
      validate: (value: string) => z.iso.datetime({ offset: true }).safeParse(value).success,
    });
    return ok(ajv.compile<T>(schema));
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('CONFIG_INVALID', `${label} schema did not compile`, { cause }),
    );
  }
}

function createValidator<T>(
  validate: ValidateFunction<T>,
  label: string,
): StrictSchemaValidator<T> {
  return {
    validate(value: unknown): Result<T, EstateReviewError> {
      return validateValue(validate, value, label);
    },
    parse(text: string): Result<T, EstateReviewError> {
      const parsed = parseJsonTextResult(text, label);
      if (isErr(parsed)) {
        return err(estateError('CONFIG_INVALID', parsed.error.message, parsed.error));
      }
      return validateValue(validate, parsed.value, label);
    },
  };
}

function validateValue<T>(
  validate: ValidateFunction<T>,
  value: unknown,
  label: string,
): Result<T, EstateReviewError> {
  if (validate(value)) {
    return ok(value);
  }
  return err(
    new EstateReviewError(
      'VALIDATION_FAILED',
      `${label} failed schema validation: ${formatErrors(validate.errors ?? [])}`,
    ),
  );
}

function formatErrors(errors: readonly ErrorObject[]): string {
  return errors
    .map((issue) => `${issue.instancePath || '/'} ${issue.message ?? issue.keyword}`)
    .join('; ');
}
