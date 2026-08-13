/**
 * Agent-tools adapter for the app-owned current-source registration proof.
 *
 * The app boundary owns MCP composition and SDK imports. This repository
 * validator invokes that boundary and validates its JSON before use.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';
import { pnpmSpawnEnvironment } from '../spawn/pnpm-env.js';
import { resolvePnpm } from '../spawn/pnpm-path.js';
import type { RegistrationRoot, RegistrationSourceEvidence } from './current-source-model.js';
import { GUIDANCE_SOURCE_ENTRIES } from './prompt-era-lineage.js';
import { requireSameStringMembers } from './require-same-string-members.js';

const execFileAsync = promisify(execFile);
const proofScript =
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/current-source-registration-proof.ts';

const servedStateSchema = z.enum(['live', 'dormant']);
const registrationSurfaceSchema = z.discriminatedUnion('locus', [
  z
    .object({
      locus: z.literal('resource-metadata'),
      field: z.enum(['name', 'uri', 'title', 'description', 'mimeType', 'annotations']),
      value: z.string(),
    })
    .strict(),
  z
    .object({
      locus: z.literal('resource-contents'),
      field: z.enum(['uri', 'mimeType', 'text', '_meta.lastModified']),
      value: z.string(),
    })
    .strict(),
]);

const registrationEvidenceSchema = z
  .object({
    rootId: z.string().min(1),
    state: servedStateSchema,
    primitive: z.enum(['initialize', 'tool', 'resource', 'prompt']),
    selector: z.string().min(1),
    surfaces: z.array(registrationSurfaceSchema),
    channels: z.array(z.string().min(1)),
  })
  .strict();

const registrationRootSchema = z
  .object({
    id: z.string().min(1),
    rootRef: z.string().min(1),
    transport: z.string().min(1),
    registrationRef: z.string().min(1),
    proof: z.string().min(1),
    observation: z
      .object({
        initialize: z.object({ instructions: z.enum(['present', 'absent']) }).strict(),
        tools: z.object({ live: z.array(z.string()), dormant: z.array(z.string()) }).strict(),
        resources: z.object({ live: z.array(z.string()), dormant: z.array(z.string()) }).strict(),
        prompts: z
          .object({
            capability: z.enum(['present', 'absent']),
            list: z.enum(['available', 'method-not-found']),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

const httpRegistrationWalkSchema = z
  .object({
    root: registrationRootSchema,
    guidanceRegistrationsByUri: z.record(z.string(), registrationEvidenceSchema),
  })
  .strict();

export interface HttpRegistrationWalk {
  readonly root: RegistrationRoot;
  readonly guidanceRegistrationsBySource: Readonly<Record<string, RegistrationSourceEvidence>>;
}

function indexGuidanceRegistrationsBySource(
  registrationsByUri: Readonly<Record<string, RegistrationSourceEvidence>>,
): Readonly<Record<string, RegistrationSourceEvidence>> {
  requireSameStringMembers(
    'App proof and current-source guidance URIs',
    GUIDANCE_SOURCE_ENTRIES.map(([, uri]) => uri),
    typeSafeKeys(registrationsByUri),
  );
  return Object.fromEntries(
    GUIDANCE_SOURCE_ENTRIES.map(([source, uri]) => {
      const registration = registrationsByUri[uri];
      if (registration === undefined) {
        throw new Error(`App proof has no guidance registration for URI: ${uri}`);
      }
      return [source, registration];
    }),
  );
}

/** Runs and validates the app-owned in-memory MCP protocol proof. */
export async function walkHttpRegistrationRoot(repoRoot: string): Promise<HttpRegistrationWalk> {
  const pnpm = resolvePnpm(process.env);
  if (!pnpm.ok) {
    throw pnpm.error;
  }
  const { stdout } = await execFileAsync(
    pnpm.value.file,
    [...pnpm.value.leadingArgs, 'exec', 'tsx', proofScript],
    {
      cwd: repoRoot,
      env: pnpmSpawnEnvironment(process.env),
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  const parsed = httpRegistrationWalkSchema.parse(JSON.parse(stdout));
  return {
    root: parsed.root,
    guidanceRegistrationsBySource: indexGuidanceRegistrationsBySource(
      parsed.guidanceRegistrationsByUri,
    ),
  };
}
