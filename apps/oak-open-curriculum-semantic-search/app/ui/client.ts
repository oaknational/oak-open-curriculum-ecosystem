'use client';

export {
  Header,
  ThemeSelect,
  SearchFixtureModeToggle,
  SearchFixtureNotice,
  FixtureModeProvider,
  useFixtureMode,
} from './global/client';
export type { FixtureModeValue } from './global/client';

export {
  SearchPageClient,
  useSearchController,
  useStructuredFollowUp,
  NaturalSearch,
  StructuredSearch,
} from './search/client';
export type {
  SearchController,
  SearchMeta,
  MultiScopeBucketView,
  StructuredFollowUpHandlers,
  StructuredSearchAction,
} from './search/client';

export { LandingPage } from './landing/LandingPage';
export { ZeroHitDashboard } from './ops/admin/ZeroHitDashboard';
export { WebVitals } from './web-vitals';
