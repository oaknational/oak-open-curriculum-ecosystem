import type { ReactElement } from 'react';

import type {
  AccordionBlock,
  Block,
  CalloutBlock,
  ColumnsBlock,
  CompareBlock,
  CoursemapBlock,
  DownloadBlock,
  FlipBlock,
  HeadingBlock,
  HotspotBlock,
  ImageBlock,
  QuizBlock,
  SortableBlock,
  StatsBlock,
  SummaryBlock,
  TabsBlock,
  TextBlock,
  VideoBlock,
  VideoImportBlock,
} from '@/lib/blocks/types';

import { AccordionBlockView } from './AccordionBlockView';
import { CalloutBlockView } from './CalloutBlockView';
import { ColumnsBlockView } from './ColumnsBlockView';
import { CompareBlockView } from './CompareBlockView';
import { CoursemapBlockView } from './CoursemapBlockView';
import { DownloadBlockView } from './DownloadBlockView';
import { FlipBlockView } from './FlipBlockView';
import { HeadingBlockView } from './HeadingBlockView';
import { HotspotBlockView } from './HotspotBlockView';
import { ImageBlockView } from './ImageBlockView';
import { QuizBlockView } from './QuizBlockView';
import { SortableBlockView } from './SortableBlockView';
import { StatsBlockView } from './StatsBlockView';
import { SummaryBlockView } from './SummaryBlockView';
import { TabsBlockView } from './TabsBlockView';
import { TextBlockView } from './TextBlockView';
import { VideoBlockView } from './VideoBlockView';
import { VideoImportBlockView } from './VideoImportBlockView';

/*
 * The 18-variant dispatch is split into three exhaustive sub-renderers over
 * sub-unions, routed by type-predicate narrowing. A single flat switch would be
 * the natural form but exceeds the cyclomatic-complexity budget (18 cases); a
 * component-map lookup hits TypeScript's correlated-union limit (needs an `as`
 * cast, forbidden). This split keeps each sub-switch compile-time exhaustive
 * (no `default`, no throw), so a new block variant is a compile error, not a
 * runtime surprise. The grouping is by complexity budget, not domain meaning.
 */

type ContentBlock =
  TextBlock | HeadingBlock | CalloutBlock | SummaryBlock | StatsBlock | ColumnsBlock;
type EmbedBlock =
  CompareBlock | ImageBlock | VideoBlock | VideoImportBlock | DownloadBlock | CoursemapBlock;
type InteractiveBlock =
  QuizBlock | TabsBlock | AccordionBlock | FlipBlock | SortableBlock | HotspotBlock;

function isInteractive(block: Block): block is InteractiveBlock {
  return (
    block.t === 'quiz' ||
    block.t === 'tabs' ||
    block.t === 'accordion' ||
    block.t === 'flip' ||
    block.t === 'sortable' ||
    block.t === 'hotspot'
  );
}

function isEmbed(block: Block): block is EmbedBlock {
  return (
    block.t === 'compare' ||
    block.t === 'image' ||
    block.t === 'video' ||
    block.t === 'videoimport' ||
    block.t === 'download' ||
    block.t === 'coursemap'
  );
}

function renderContent(block: ContentBlock): ReactElement {
  let element: ReactElement;
  switch (block.t) {
    case 'text':
      element = <TextBlockView block={block} />;
      break;
    case 'heading':
      element = <HeadingBlockView block={block} />;
      break;
    case 'callout':
      element = <CalloutBlockView block={block} />;
      break;
    case 'summary':
      element = <SummaryBlockView block={block} />;
      break;
    case 'stats':
      element = <StatsBlockView block={block} />;
      break;
    case 'columns':
      element = <ColumnsBlockView block={block} />;
      break;
  }
  return element;
}

function renderEmbed(block: EmbedBlock): ReactElement {
  let element: ReactElement;
  switch (block.t) {
    case 'compare':
      element = <CompareBlockView block={block} />;
      break;
    case 'image':
      element = <ImageBlockView block={block} />;
      break;
    case 'video':
      element = <VideoBlockView block={block} />;
      break;
    case 'videoimport':
      element = <VideoImportBlockView block={block} />;
      break;
    case 'download':
      element = <DownloadBlockView block={block} />;
      break;
    case 'coursemap':
      element = <CoursemapBlockView />;
      break;
  }
  return element;
}

function renderInteractive(block: InteractiveBlock): ReactElement {
  let element: ReactElement;
  switch (block.t) {
    case 'quiz':
      element = <QuizBlockView block={block} />;
      break;
    case 'tabs':
      element = <TabsBlockView block={block} />;
      break;
    case 'accordion':
      element = <AccordionBlockView block={block} />;
      break;
    case 'flip':
      element = <FlipBlockView block={block} />;
      break;
    case 'sortable':
      element = <SortableBlockView block={block} />;
      break;
    case 'hotspot':
      element = <HotspotBlockView block={block} />;
      break;
  }
  return element;
}

/**
 * The single spine every content page renders through: dispatches a {@link Block}
 * to its presentational component on the `t` discriminant. Compile-time
 * exhaustive over the closed union (see the note above); malformed data cannot
 * reach here — the data plane validates against the union at its parse boundary.
 */
export function BlockRenderer({ block }: { readonly block: Block }): ReactElement {
  if (isInteractive(block)) {
    return renderInteractive(block);
  }
  if (isEmbed(block)) {
    return renderEmbed(block);
  }
  return renderContent(block);
}
