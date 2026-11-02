import { typeSafeKeys } from '@oaknational/type-helpers';
import type {
  ContentRevision,
  CurrentItemEvidence,
  CurrentSourceAnchorManifest,
  RegistrationAnchorSurface,
} from './current-source-model.js';
import { buildTokenAnchor } from './item-anchor-evidence.js';
import { requireSameStringMembers } from './require-same-string-members.js';

const alphabetical = (left: string, right: string) => left.localeCompare(right);

export interface BaselineAnchorRow {
  readonly id: string;
  readonly file: string;
  readonly lines: string;
}

type AnchorTargetOverrides = Readonly<Record<string, readonly string[]>>;
type RegistrationSurfaceTargetOverrides = Readonly<
  Record<string, readonly RegistrationAnchorSurface[]>
>;

export interface AnchorManifestInput {
  readonly baselineCommit: string;
  readonly baselineSha256: string;
  readonly rows: readonly BaselineAnchorRow[];
  readonly targetsByAuditId: ReadonlyMap<string, readonly string[]>;
  readonly baselineContentByFile: ReadonlyMap<string, string>;
  readonly currentContentByFile: ReadonlyMap<string, string>;
  readonly overrides: Readonly<Record<string, AnchorTargetOverrides>>;
  readonly registrationSurfaceOverrides: Readonly<
    Record<string, RegistrationSurfaceTargetOverrides>
  >;
  readonly revisionOverrides: Readonly<Record<string, ContentRevision>>;
}

function sourceFragments(content: string, lineSpec: string): readonly string[] {
  const lines = content.split('\n');
  const ranges = [...lineSpec.matchAll(/\b(\d+)(?:-(\d+))?/g)].map((match) => ({
    start: Number(match[1]),
    end: Number(match[2] ?? match[1]),
  }));
  if (ranges.length === 0) {
    throw new Error(`Audit line specification has no ranges: ${lineSpec}`);
  }
  return ranges.map(({ start, end }) => lines.slice(start - 1, end).join('\n'));
}

function evidenceRevision(
  row: BaselineAnchorRow,
  targets: readonly string[],
  revisionOverrides: Readonly<Record<string, ContentRevision>>,
): ContentRevision {
  const override = revisionOverrides[row.id];
  if (override !== undefined) {
    return override;
  }
  return targets.length === 1 && targets[0] === row.file ? 'unchanged' : 'relocated';
}

function validateEvidenceOverrides(
  row: BaselineAnchorRow,
  targets: readonly string[],
  override: AnchorTargetOverrides | undefined,
  registrationSurfaces: RegistrationSurfaceTargetOverrides | undefined,
): void {
  if (override !== undefined) {
    requireSameStringMembers(
      `Current anchor override targets for ${row.id}`,
      targets,
      typeSafeKeys(override),
    );
  } else if (targets.length !== 1 || targets[0] !== row.file) {
    throw new Error(`Relocated current audit item ${row.id} has no reviewed anchor override`);
  }
  if (registrationSurfaces === undefined) {
    return;
  }
  if (override === undefined) {
    throw new Error(`Registration surfaces for ${row.id} have no reviewed anchor override`);
  }
  requireSameStringMembers(
    `Registration-surface targets for ${row.id}`,
    typeSafeKeys(override),
    typeSafeKeys(registrationSurfaces),
  );
}

function buildEvidenceTarget(
  row: BaselineAnchorRow,
  file: string,
  currentContent: string,
  anchorContents: readonly string[],
  anchorSurfaces: readonly RegistrationAnchorSurface[] | undefined,
): CurrentItemEvidence['targets'][number] {
  if (anchorSurfaces !== undefined && anchorSurfaces.length !== anchorContents.length) {
    throw new Error(
      `Registration-surface count differs from anchor count for ${row.id} in ${file}`,
    );
  }
  return {
    file,
    anchors: anchorContents.map((content, anchorIndex) => {
      try {
        const anchor = buildTokenAnchor(content, currentContent);
        const registrationSurface = anchorSurfaces?.[anchorIndex];
        return registrationSurface === undefined ? anchor : { ...anchor, registrationSurface };
      } catch (error: unknown) {
        throw new Error(
          `Cannot build current item anchor for ${row.id} in ${file}: ` +
            `${error instanceof Error ? error.message : String(error)}\n` +
            `anchor: ${JSON.stringify(content)}`,
          { cause: error },
        );
      }
    }),
  };
}

function buildEvidence(
  input: AnchorManifestInput,
  row: BaselineAnchorRow,
  targets: readonly string[],
): CurrentItemEvidence {
  const override = input.overrides[row.id];
  const registrationSurfaces = input.registrationSurfaceOverrides[row.id];
  validateEvidenceOverrides(row, targets, override, registrationSurfaces);
  const baselineContent = input.baselineContentByFile.get(row.file);
  if (baselineContent === undefined) {
    throw new Error(`Immutable baseline source is absent for ${row.id}: ${row.file}`);
  }
  return {
    revision: evidenceRevision(row, targets, input.revisionOverrides),
    targets: targets.map((file) => {
      const currentContent = input.currentContentByFile.get(file);
      if (currentContent === undefined) {
        throw new Error(`Current anchor target is absent for ${row.id}: ${file}`);
      }
      const anchorContents = override?.[file] ?? sourceFragments(baselineContent, row.lines);
      return buildEvidenceTarget(
        row,
        file,
        currentContent,
        anchorContents,
        registrationSurfaces?.[file],
      );
    }),
  };
}

function requireKnownOverrideIds<T>(
  label: string,
  overrides: Readonly<Record<string, T>>,
  knownIds: ReadonlySet<string>,
): void {
  const unknownOverrides = typeSafeKeys(overrides).filter((id) => !knownIds.has(id));
  if (unknownOverrides.length > 0) {
    throw new Error(
      `${label} contain unknown audit ids: ${unknownOverrides.toSorted(alphabetical).join(', ')}`,
    );
  }
}

function validateManifestOverrides(input: AnchorManifestInput): void {
  const knownIds = new Set(input.rows.map((row) => row.id));
  requireKnownOverrideIds('Current item anchor overrides', input.overrides, knownIds);
  requireKnownOverrideIds(
    'Registration-surface overrides',
    input.registrationSurfaceOverrides,
    knownIds,
  );
  const revisionWithoutOverrides = typeSafeKeys(input.revisionOverrides).filter(
    (id) => input.overrides[id] === undefined,
  );
  if (revisionWithoutOverrides.length > 0) {
    throw new Error(
      `Revision-overridden current audit ids have no reviewed anchor override: ${revisionWithoutOverrides.toSorted(alphabetical).join(', ')}`,
    );
  }
  const samePathOverridesWithoutRevision = input.rows
    .filter((row) => {
      const targets = input.targetsByAuditId.get(row.id);
      return (
        input.overrides[row.id] !== undefined &&
        input.revisionOverrides[row.id] === undefined &&
        targets?.length === 1 &&
        targets[0] === row.file
      );
    })
    .map((row) => row.id);
  if (samePathOverridesWithoutRevision.length > 0) {
    throw new Error(
      `In-place current anchor overrides require an explicit revision: ${samePathOverridesWithoutRevision.toSorted(alphabetical).join(', ')}`,
    );
  }
}

function buildManifestItems(input: AnchorManifestInput): CurrentSourceAnchorManifest['items'] {
  return input.rows.flatMap((row) => {
    const targets = input.targetsByAuditId.get(row.id);
    if (targets === undefined) {
      throw new Error(`Current targets are unaccounted for audit item ${row.id}`);
    }
    return targets.length === 0
      ? []
      : [{ auditId: row.id, evidence: buildEvidence(input, row, targets) }];
  });
}

/** Builds reviewed, item-level current-source evidence for every non-retired row. */
export function buildCurrentSourceAnchorManifest(
  input: AnchorManifestInput,
): CurrentSourceAnchorManifest {
  validateManifestOverrides(input);
  return {
    schemaVersion: 2,
    baselineCommit: input.baselineCommit,
    baselineSha256: input.baselineSha256,
    items: buildManifestItems(input),
  };
}
