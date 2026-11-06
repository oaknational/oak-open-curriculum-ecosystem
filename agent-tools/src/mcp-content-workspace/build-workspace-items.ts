/**
 * Assembles one reviewable {@link WorkspaceItem} per corpus item by joining the
 * immutable phase-(a) registry, the current-source projection, and the anchor
 * manifest.
 *
 * @remarks
 * The registry supplies what an item *is* (intent, domain, impact tier); the
 * projection supplies where it lives *now* and whether it is served; the
 * anchors supply the words as they read *today*. Preferring the anchored
 * current text over the baseline snippet is the point — a reviewer asked to
 * approve wording must see the wording that ships.
 *
 * @packageDocumentation
 */

import { locateAnchoredText } from '../mcp-content-current-source/item-anchor-evidence.js';
import { EXCERPT_CHARACTER_LIMIT } from './content-workspace-config.js';
import {
  isAddedItem,
  type AnchorTargets,
  type BaselineRegistryItem,
  type ExcerptProvenance,
  type ProjectionItem,
  type WorkspaceInputs,
  type WorkspaceItem,
} from './content-workspace-model.js';
import { deriveServedStatus, registrationSelectors } from './derive-served-status.js';

/** An excerpt cut to the rendering budget at a line boundary. */
interface Excerpt {
  readonly text: string;
  readonly truncated: boolean;
}

function truncateExcerpt(text: string): Excerpt {
  const trimmed = text.trim();
  if (trimmed.length <= EXCERPT_CHARACTER_LIMIT) {
    return { text: trimmed, truncated: false };
  }
  const window = trimmed.slice(0, EXCERPT_CHARACTER_LIMIT);
  const lastBreak = window.lastIndexOf('\n');
  return { text: (lastBreak > 0 ? window.slice(0, lastBreak) : window).trimEnd(), truncated: true };
}

/**
 * The item's words as they read in current source.
 *
 * @returns `null` unless EVERY target file is present and EVERY anchor resolves.
 * A partly resolved item must not pass as current wording — grouped content
 * would silently lose a member — so the caller falls back to the baseline
 * snippet and the item is named on the unrendered page instead.
 */
function currentText(
  anchors: AnchorTargets | undefined,
  sourceText: ReadonlyMap<string, string>,
): string | null {
  if (anchors === undefined) {
    return null;
  }
  const located: string[] = [];
  for (const target of anchors.targets) {
    const content = sourceText.get(target.file);
    if (content === undefined) {
      return null;
    }
    for (const anchor of target.anchors) {
      const text = locateAnchoredText(anchor, content);
      if (text === null) {
        return null;
      }
      located.push(text);
    }
  }
  // An item with several anchors onto identical wording (the same sentence
  // reused across files) would otherwise be quoted once per occurrence.
  const distinct = [...new Set(located)];
  return distinct.length === 0 ? null : distinct.join('\n\n');
}

/** Pick the best available text for an item, and say where it came from. */
function resolveExcerpt(
  anchors: AnchorTargets | undefined,
  baseline: BaselineRegistryItem | undefined,
  sourceText: ReadonlyMap<string, string>,
  additionText: string | undefined,
): { readonly excerpt: Excerpt; readonly provenance: ExcerptProvenance } {
  const current = currentText(anchors, sourceText) ?? additionText ?? null;
  if (current !== null) {
    return { excerpt: truncateExcerpt(current), provenance: 'current-source' };
  }
  const snippet = baseline?.snippet ?? '';
  if (snippet.trim() !== '') {
    return { excerpt: truncateExcerpt(snippet), provenance: 'baseline-snippet' };
  }
  return { excerpt: { text: '', truncated: false }, provenance: 'none' };
}

/** A short reviewer-facing title for an item. */
function itemTitle(current: ProjectionItem, baseline: BaselineRegistryItem | undefined): string {
  const declared = current.reviewContext?.title;
  if (declared !== undefined && declared !== '') {
    return declared;
  }
  const identifier = baseline?.identifier ?? '';
  return identifier === '' ? current.id : identifier;
}

function baselineFileOf(current: ProjectionItem): string | null {
  return 'baselineFile' in current.lineage ? current.lineage.baselineFile : null;
}

/** The classification an item carries, from the registry or its addition record. */
function classification(
  current: ProjectionItem,
  baseline: BaselineRegistryItem | undefined,
): Pick<WorkspaceItem, 'reviewDomain' | 'impactTier' | 'surfaceType' | 'behaviouralIntent'> {
  if (baseline !== undefined) {
    return {
      reviewDomain: baseline.review_domain,
      impactTier: baseline.impact_tier,
      surfaceType: baseline.surface_type,
      behaviouralIntent: baseline.behavioural_intent,
    };
  }
  if (isAddedItem(current)) {
    return {
      reviewDomain: current.reviewContext.reviewDomain,
      impactTier: current.reviewContext.impactTier,
      surfaceType: 'post-baseline-addition',
      behaviouralIntent: current.reviewContext.behaviouralIntent,
    };
  }
  // A baseline-lineage item with no registry row cannot be classified. The
  // build entry refuses that state before anything renders (see
  // `unclassifiableItems`); this arm keeps the function total and names the
  // defect rather than inventing a domain for it.
  return {
    reviewDomain: 'other',
    impactTier: 'high-impact',
    surfaceType: 'unclassified',
    behaviouralIntent: '',
  };
}

/**
 * Ids of items that carry a baseline lineage but have no registry row — the
 * one join failure no schema can see, because it spans two inputs. The build
 * refuses to render while any exist.
 */
export function unclassifiableItems(inputs: WorkspaceInputs): readonly string[] {
  const baselineIds = new Set(inputs.registry.items.map((item) => item.id));
  return inputs.current.items
    .filter((item) => !isAddedItem(item) && !baselineIds.has(item.id))
    .map((item) => item.id);
}

function buildWorkspaceItem(
  current: ProjectionItem,
  baseline: BaselineRegistryItem | undefined,
  inputs: WorkspaceInputs,
): WorkspaceItem {
  const { excerpt, provenance } = resolveExcerpt(
    inputs.anchorsById.get(current.id),
    baseline,
    inputs.sourceText,
    inputs.additionTextById.get(current.id),
  );
  return {
    id: current.id,
    title: itemTitle(current, baseline),
    ...classification(current, baseline),
    authority: current.authority,
    workspaceScope: current.workspaceScope,
    status: deriveServedStatus(current),
    registrationSelectors: registrationSelectors(current.registrations),
    sourceFiles: current.source.files,
    baselineFile: baselineFileOf(current),
    revision: current.source.state === 'retired' ? 'retired' : current.source.evidence.revision,
    excerpt: excerpt.text,
    excerptProvenance: provenance,
    excerptTruncated: excerpt.truncated,
    flags: baseline?.flags ?? [],
  };
}

/** Assemble the full reviewable corpus, in stable id order. */
export function buildWorkspaceItems(inputs: WorkspaceInputs): readonly WorkspaceItem[] {
  const baselineById = new Map(inputs.registry.items.map((item) => [item.id, item]));
  return inputs.current.items.map((current) =>
    buildWorkspaceItem(current, baselineById.get(current.id), inputs),
  );
}
