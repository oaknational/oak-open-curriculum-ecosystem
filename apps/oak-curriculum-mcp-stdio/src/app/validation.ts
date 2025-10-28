import type { ToolDescriptorForName, ToolName, ToolResult } from '@oaknational/oak-curriculum-sdk';

type DescriptorValidationFailure<TName extends ToolName> = Extract<
  ReturnType<ToolDescriptorForName<TName>['validateOutput']>,
  { readonly ok: false }
>;

/**
 * Result envelope returned by successful tool executions.
 *
 * @remarks This is a thin alias around the schema-derived ToolResult union to avoid
 * reintroducing permissive runtime types.
 */
export interface ToolExecutionSuccessEnvelope<TName extends ToolName = ToolName> {
  readonly status: ToolResult<TName>['status'];
  readonly data: 0 extends 1 & ToolResult<TName>['data'] ? unknown : ToolResult<TName>['data'];
}

/**
 * Outcome of validating a tool response payload.
 */
export interface OutputValidationSuccess<TName extends ToolName = ToolName> {
  readonly ok: true;
  readonly result: ToolResult<TName>;
}

export type OutputValidationFailure<TName extends ToolName = ToolName> =
  | { readonly ok: false; readonly message: string }
  | (DescriptorValidationFailure<TName> & { readonly ok: false });

export type OutputValidationResult<TName extends ToolName = ToolName> =
  | OutputValidationSuccess<TName>
  | OutputValidationFailure<TName>;

function normaliseStatus(status: number | string): string {
  return String(status);
}

export function pickPayloadForValidation<TName extends ToolName>(
  envelope: ToolExecutionSuccessEnvelope<TName>,
): ToolExecutionSuccessEnvelope<TName>['data'] {
  return envelope.data;
}

export function validateOutput<TName extends ToolName>(
  descriptor: ToolDescriptorForName<TName>,
  envelope: ToolExecutionSuccessEnvelope<TName>,
): OutputValidationResult<TName> {
  const documentedStatuses = descriptor.documentedStatuses.map(normaliseStatus);
  const actualStatus = normaliseStatus(envelope.status);

  if (!documentedStatuses.includes(actualStatus)) {
    return {
      ok: false,
      message: `Undocumented response status ${actualStatus}. Documented statuses: ${documentedStatuses.join(', ')}`,
    };
  }

  const validation = descriptor.validateOutput(envelope.data);

  if (!validation.ok) {
    return validation;
  }

  const validatedStatus = normaliseStatus(validation.status);
  if (validatedStatus !== actualStatus) {
    return {
      ok: false,
      message: `Output validation status mismatch: received ${actualStatus}, validated as ${validatedStatus}`,
    };
  }

  return { ok: true, result: envelope };
}
