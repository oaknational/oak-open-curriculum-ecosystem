/**
 * The registry's own verdict on a document, before anything is published.
 *
 * @remarks
 * The official registry exposes a public, unauthenticated, non-mutating
 * validation endpoint. That makes the question *"would the registry accept
 * this?"* answerable without credentials, without a namespace decision, and
 * without publishing — so the generator asks it every time rather than
 * discovering a rejection at the one moment that is expensive: a published
 * version is immutable, and correcting a bad entry costs a new version.
 *
 * The response is validated to its exact shape at arrival (ADR-032). An
 * unrecognised body is a failure, never an implicit pass: a validation
 * service whose contract has changed must not read as approval.
 */

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

/** The public validation endpoint, on the current `v0.1` API prefix. */
export const REGISTRY_VALIDATE_URL = 'https://registry.modelcontextprotocol.io/v0.1/validate';

/**
 * One issue the registry reports against a document.
 *
 * @remarks
 * Every field is the registry's to omit — a measured rejection carries
 * `type`, `path`, `message`, `severity` and `reference`, while an acceptance
 * carries an empty list — so the schema requires none of them and reports
 * whatever arrived.
 */
const registryValidationIssueSchema = z.object({
  type: z.string().optional(),
  path: z.string().optional(),
  message: z.string().optional(),
  severity: z.string().optional(),
  reference: z.string().optional(),
});

/**
 * The verdict body.
 *
 * @remarks
 * `valid` is required: it is the entire answer, and a body without it is not
 * a verdict. Measured 2026-09-09 — an accepted document returns
 * `{"valid":true,"issues":[]}`; a plain-HTTP remote returns `valid:false`
 * with one `severity: "error"` issue at `remotes[0].url`.
 */
const registryValidationVerdictSchema = z.object({
  valid: z.boolean(),
  issues: z.array(registryValidationIssueSchema).default([]),
});

/** The registry's validation verdict. */
export type RegistryValidationVerdict = z.infer<typeof registryValidationVerdictSchema>;

/**
 * One field-level complaint inside a problem-details body.
 *
 * @remarks
 * `location` is the registry's dotted path into the submitted document
 * (`body.description`), which is the most useful half of the answer.
 */
const registryProblemErrorSchema = z.object({
  message: z.string().optional(),
  location: z.string().optional(),
});

/**
 * The registry's error body for a request it would not evaluate.
 *
 * @remarks
 * A rejected *request* and a rejected *document* are different answers on
 * different shapes, and only the second carries `valid`. Measured against
 * build `1.8.1` on 2026-09-10: a description over the 100-character cap and
 * an omitted `$schema` both return HTTP 422 with
 * `{"title","status","detail","errors":[{"message","location"}]}` and **no
 * `valid` field**; a malformed body returns the same shape as HTTP 400.
 * Reading that as an unrecognised verdict buries the registry's own
 * diagnosis under a schema complaint, so it is read on its own terms.
 *
 * Every field is optional because the shape is the registry's to change, and
 * a status code with no readable body is still a usable answer.
 */
const registryProblemSchema = z.object({
  title: z.string().optional(),
  detail: z.string().optional(),
  errors: z.array(registryProblemErrorSchema).default([]),
});

/**
 * Describes a non-success validation response in the registry's own words.
 *
 * @param status - The HTTP status the registry answered with.
 * @param body - The response body, parsed if it was JSON, `undefined` if not.
 * @returns A message naming the status and every complaint the body carried.
 *
 * @example
 * ```typescript
 * if (!response.ok) {
 *   fail(describeValidationRejection(response.status, await readJsonBody(response)));
 * }
 * ```
 */
export function describeValidationRejection(status: number, body: unknown): string {
  const prefix = `the registry refused the document (HTTP ${String(status)})`;

  const parsed = registryProblemSchema.safeParse(body);
  if (!parsed.success) {
    return `${prefix} and its response carried no readable explanation`;
  }

  const described = parsed.data.errors.map(
    (error) => `${error.location ?? '(document)'}: ${error.message ?? '(no message)'}`,
  );
  if (described.length > 0) {
    return `${prefix}: ${described.join('; ')}`;
  }

  const summary = parsed.data.detail ?? parsed.data.title;
  return summary === undefined ? prefix : `${prefix}: ${summary}`;
}

/**
 * Validates an arbitrary validation response into a verdict.
 *
 * @param body - The parsed response body, `unknown` as it arrives.
 * @returns The verdict, or a message saying why the body was unusable.
 *
 * @example
 * ```typescript
 * const verdict = readValidationVerdict(await response.json());
 * ```
 */
export function readValidationVerdict(body: unknown): Result<RegistryValidationVerdict, string> {
  const parsed = registryValidationVerdictSchema.safeParse(body);
  if (!parsed.success) {
    return err(
      `the registry's validation response did not match its expected shape: ${parsed.error.message}`,
    );
  }
  return ok(parsed.data);
}

/**
 * Turns a verdict into a pass or a message naming every issue.
 *
 * @param verdict - The registry's verdict.
 * @returns `undefined` on acceptance, or the failure message to report.
 */
export function describeValidationFailure(verdict: RegistryValidationVerdict): string | undefined {
  if (verdict.valid) {
    return undefined;
  }

  const described = verdict.issues.map(
    (issue) =>
      `${issue.severity ?? 'issue'} at ${issue.path ?? '(document)'}: ` +
      `${issue.message ?? '(no message)'}`,
  );
  return described.length === 0
    ? 'the registry rejected the document without naming an issue'
    : `the registry rejected the document: ${described.join('; ')}`;
}

/**
 * The protected-resource metadata the generator measures a document against.
 *
 * @remarks
 * Only `resource` is read — the endpoint the deployment says it is. The rest
 * of the RFC 9728 document is the auth surfaces' concern, not this one's.
 */
const servedResourceMetadataSchema = z.object({ resource: z.string() });

/**
 * Reads the deployment's own answer to "what endpoint am I?".
 *
 * @param body - The parsed protected-resource metadata document.
 * @returns The `resource` value, or a message saying why it was unusable.
 */
export function readServedResource(body: unknown): Result<string, string> {
  const parsed = servedResourceMetadataSchema.safeParse(body);
  if (!parsed.success) {
    return err(`protected-resource metadata carried no string 'resource': ${parsed.error.message}`);
  }
  return ok(parsed.data.resource);
}
