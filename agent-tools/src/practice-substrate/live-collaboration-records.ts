/**
 * The collaboration records the substrate audit validates: the claim
 * registries and the conversation and escalation threads, read through
 * injected reads so the leg is proven in memory.
 *
 * @packageDocumentation
 */

import { unwrapOrThrow } from '@oaknational/result';

import {
  checkCollaborationSurfaceContract,
  isContractSchemaId,
} from '../collaboration-state/surface-contract.js';
import { type CollaborationSchemaId } from '../collaboration-state/collaboration-json-validation.js';
import {
  classifySurfacePresence,
  presenceFindings,
  type InstanceTierProbe,
} from './instance-tier.js';
import { parseJsonText, validateWithAjv, type SchemaLookup } from './live-json-support.js';
import { readTextIfPresent, type SubstrateReads } from './live-reads.js';
import {
  ACTIVE_CLAIMS_PATH,
  CLOSED_CLAIMS_PATH,
  CONVERSATIONS_ROOT,
  ESCALATIONS_ROOT,
  surfaceContractFinding,
} from './live-types.js';
import { type SubstrateFinding } from './types.js';

/** What the collaboration records leg reads through, all injected. */
export interface CollaborationRecordsInput {
  /** The repository's files, read through one injected seam. */
  readonly reads: SubstrateReads;
  /** The collaboration schemas, looked up by id. */
  readonly schemas: SchemaLookup;
  /** The report's instance-tier probe, consulted only for an absent registry. */
  readonly probe: InstanceTierProbe;
}

/** One JSON surface the leg validates: its surface id, repo path and schema. */
interface JsonSurface {
  readonly surface: string;
  readonly path: string;
  // One schemaId, one vocabulary — isContractSchemaId decides which
  // surfaces carry a runtime contract; the shared check owns the dispatch.
  readonly schemaId: CollaborationSchemaId;
}

/**
 * The claim registries the leg reads, and so the paths whose absence it
 * classifies: the report's probe asks the ignore rules about exactly these.
 */
export const CLAIM_REGISTRIES = [
  {
    surface: 'collaboration-active-claims',
    path: ACTIVE_CLAIMS_PATH,
    schemaId: 'active-claims.schema.json',
  },
  {
    surface: 'collaboration-closed-claims',
    path: CLOSED_CLAIMS_PATH,
    schemaId: 'closed-claims.schema.json',
  },
] as const satisfies readonly JsonSurface[];

/**
 * Both claim registries, each classified by the instance tier before it is
 * validated, then both thread directories. An absent registry, and a probe
 * that cannot classify one, is a finding and never a throw, so it hides none
 * of the others; a read that fails for another reason still rejects.
 */
export async function evaluateCollaborationRecords(
  input: CollaborationRecordsInput,
): Promise<readonly SubstrateFinding[]> {
  const registries = await Promise.all(
    CLAIM_REGISTRIES.map((registry) => evaluateClaimRegistry(input, registry)),
  );
  return [
    ...registries.flat(),
    ...(await evaluateThreadDirectory(input, CONVERSATIONS_ROOT)),
    ...(await evaluateThreadDirectory(input, ESCALATIONS_ROOT)),
  ];
}

/**
 * One claim registry. The read is the existence test: a registry the read
 * found is validated (parse, runtime contract, then schema) whatever the ignore
 * rules say, and only an absent one is classified. A read that fails for
 * another reason throws its own error, as before, for the report's reader
 * wrapper.
 */
async function evaluateClaimRegistry(
  input: CollaborationRecordsInput,
  registry: JsonSurface,
): Promise<readonly SubstrateFinding[]> {
  const text = unwrapOrThrow(await readTextIfPresent(input.reads, registry.path));
  if (text === undefined) {
    const presence = classifySurfacePresence({
      path: registry.path,
      found: false,
      probe: input.probe,
    });
    return presenceFindings(registry.surface, registry.path, presence);
  }
  return evaluateJsonText(input.schemas, registry, text);
}

async function evaluateThreadDirectory(
  input: CollaborationRecordsInput,
  root: string,
): Promise<readonly SubstrateFinding[]> {
  const surface =
    root === CONVERSATIONS_ROOT ? 'collaboration-conversations' : 'collaboration-escalations';
  const schemaId =
    root === CONVERSATIONS_ROOT ? 'conversation.schema.json' : 'escalation.schema.json';
  const files = await input.reads.listJsonFiles(root);
  const liveFiles = files.filter((file) => !file.endsWith('.example.json'));
  const findings = await Promise.all(
    liveFiles.map(async (path) =>
      evaluateJsonText(
        input.schemas,
        { surface, path, schemaId },
        await input.reads.readText(path),
      ),
    ),
  );

  return findings.flat();
}

function evaluateJsonText(
  schemas: SchemaLookup,
  target: JsonSurface,
  text: string,
): readonly SubstrateFinding[] {
  const parsed = parseJsonText(target.surface, target.path, text);
  if (parsed.value === undefined) {
    return parsed.findings;
  }
  if (isContractSchemaId(target.schemaId)) {
    const checked = checkCollaborationSurfaceContract({
      schemaId: target.schemaId,
      path: target.path,
      text,
    });
    if (!checked.ok) {
      return [surfaceContractFinding(target.surface, target.path, checked.error)];
    }
  }

  return validateWithAjv(schemas, target.schemaId, target.surface, target.path, parsed.value);
}
