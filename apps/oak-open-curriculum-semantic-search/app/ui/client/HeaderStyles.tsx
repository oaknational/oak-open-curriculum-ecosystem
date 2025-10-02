'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { OakBox, OakFlex, OakImage, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import ThemeSelect from './ThemeSelect';
import { getAppTheme } from '../themes/app-theme-helpers';

const HeaderRoot = styledComponents(OakFlex)`
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  padding-block: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  padding-inline: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
  border-bottom-color: ${({ theme }) => getAppTheme(theme).app.colors.headerBorder};
`;

const PrimaryNav = styledComponents(OakFlex)`
  align-items: center;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
`;

const NavText = styledComponents(OakTypography)`
  font-family: ${({ theme }) => getAppTheme(theme).app.fonts.primary};
`;

const NAV_ITEMS: ReadonlyArray<{ href: Route; label: string }> = [
  { href: '/', label: 'Search' },
  { href: '/structured_search', label: 'Structured search' },
  { href: '/natural_language_search', label: 'Natural language search' },
  { href: '/admin', label: 'Admin' },
  { href: '/status', label: 'Status' },
  { href: '/api/docs', label: 'Docs' },
];

const NavLink = styledComponents(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    outline-offset: 4px;
  }
`;

export default function HeaderStyles(): JSX.Element {
  return (
    <HeaderRoot
      as="header"
      role="banner"
      $alignItems="center"
      $flexWrap="wrap"
      $bb="border-solid-s"
      $borderColor="border-brand"
      $background="bg-primary"
      $color="text-primary"
    >
      <Link href="/" aria-label="Home">
        <OakImage
          src="/oak-national-academy-logo-512.png"
          alt="Oak National Academy"
          width={32}
          height={32}
        />
      </Link>

      <PrimaryNav as="nav" aria-label="Primary" $font="body-3" $color="text-primary">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href}>
            <NavText as="span" $font="body-3" $color="text-primary">
              {item.label}
            </NavText>
          </NavLink>
        ))}
      </PrimaryNav>

      <OakBox $ml="auto">
        <ThemeSelect />
      </OakBox>
    </HeaderRoot>
  );
}
