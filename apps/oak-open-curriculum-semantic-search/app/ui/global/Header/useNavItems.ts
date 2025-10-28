import type { Route } from 'next';
import { resolveFixtureToggleVisibility } from '../../../lib/fixture-toggle';

/**
 * Describes the Oak mark asset rendered within the header home link.
 */
interface HeaderNavIcon {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/**
 * Metadata for the clickable Oak mark that returns users to the landing page.
 */
interface HeaderHomeLink {
  readonly href: Route;
  readonly ariaLabel: string;
  readonly icon: HeaderNavIcon;
}

interface IHeaderNavItem {
  readonly id: string;
  readonly href: Route;
  readonly label: string;
  readonly ariaLabel: string;
}

/**
 * Primary navigation entry rendered within the header nav element.
 */
const PRIMARY_NAV_ITEMS = [
  {
    id: 'home',
    href: '/',
    label: 'Home',
    ariaLabel: 'Home',
  },
  {
    id: 'structured-search',
    href: '/structured_search',
    label: 'Structured search',
    ariaLabel: 'Structured search',
  },
  {
    id: 'natural-language-search',
    href: '/natural_language_search',
    label: 'Natural language search',
    ariaLabel: 'Natural language search',
  },
  {
    id: 'admin',
    href: '/admin',
    label: 'Admin',
    ariaLabel: 'Admin',
  },
  {
    id: 'status',
    href: '/status',
    label: 'Status',
    ariaLabel: 'Status',
  },
  {
    id: 'docs',
    href: '/api/docs',
    label: 'Docs',
    ariaLabel: 'Docs',
  },
] as const satisfies IHeaderNavItem[];
export type HeaderNavItemsType = (typeof PRIMARY_NAV_ITEMS)[number];
export function isHeaderNavItem(v: IHeaderNavItem): v is HeaderNavItemsType {
  const genericNavItems: IHeaderNavItem[] = PRIMARY_NAV_ITEMS;
  // Note: will only work for same object in memory, not for different objects with same values
  return genericNavItems.includes(v);
}

interface IHeaderUtilityItem {
  readonly id: string;
  readonly type: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly visible?: boolean;
}
const HEADER_UTILITY_ITEMS = [
  {
    id: 'theme-select',
    type: 'theme-select',
    label: 'Theme mode',
    ariaLabel: 'Change theme mode',
    visible: true,
  },
  {
    id: 'fixture-mode',
    type: 'fixture-toggle',
    label: 'Fixture mode',
    ariaLabel: 'Select fixture mode',
    visible: resolveFixtureToggleVisibility(),
  },
] as const satisfies IHeaderUtilityItem[];
export type HeaderUtilityItemType = (typeof HEADER_UTILITY_ITEMS)[number];
export function isHeaderUtilityItem(v: IHeaderUtilityItem): v is HeaderUtilityItemType {
  const genericUtilityItems: IHeaderUtilityItem[] = HEADER_UTILITY_ITEMS;
  // Note: will only work for same object in memory, not for different objects with same values
  return genericUtilityItems.includes(v);
}

/**
 * Aggregated metadata describing the header navigation structure.
 */
export interface HeaderNavMetadata {
  readonly home: HeaderHomeLink;
  readonly primary: ReadonlyArray<HeaderNavItemsType>;
  readonly utilities: ReadonlyArray<HeaderUtilityItemType>;
}

/**
 * Canonical navigation data used by the header component and its tests.
 */
const NAV_METADATA: HeaderNavMetadata = {
  home: {
    href: '/',
    ariaLabel: 'Home',
    icon: {
      src: '/oak-national-academy-logo-512.png',
      alt: 'Oak National Academy',
      width: 32,
      height: 32,
    },
  },
  primary: [
    {
      id: 'home',
      href: '/',
      label: 'Home',
      ariaLabel: 'Home',
    },
    {
      id: 'structured-search',
      href: '/structured_search',
      label: 'Structured search',
      ariaLabel: 'Structured search',
    },
    {
      id: 'natural-language-search',
      href: '/natural_language_search',
      label: 'Natural language search',
      ariaLabel: 'Natural language search',
    },
    {
      id: 'admin',
      href: '/admin',
      label: 'Admin',
      ariaLabel: 'Admin',
    },
    {
      id: 'status',
      href: '/status',
      label: 'Status',
      ariaLabel: 'Status',
    },
    {
      id: 'docs',
      href: '/api/docs',
      label: 'Docs',
      ariaLabel: 'Docs',
    },
  ],
  utilities: [
    {
      id: 'theme-select',
      type: 'theme-select',
      label: 'Theme mode',
      ariaLabel: 'Change theme mode',
      visible: true,
    },
    {
      id: 'fixture-mode',
      type: 'fixture-toggle',
      label: 'Fixture mode',
      ariaLabel: 'Select fixture mode',
      visible: resolveFixtureToggleVisibility(),
    },
  ],
} as const;

/**
 * Shared export for non-React consumers (tests, documentation generators) that need the static metadata.
 */
export const HEADER_NAV_METADATA = NAV_METADATA;

/**
 * Returns the header navigation metadata so components avoid duplicating strings or routes.
 */
export function useNavItems(): HeaderNavMetadata {
  return NAV_METADATA;
}
