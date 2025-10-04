'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { OakBox, OakFlex, OakImage, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import ThemeSelect from '../Theme/ThemeSelect';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { useNavItems } from './useNavItems';

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
  transition: color 0.2s ease-in-out, text-decoration-color 0.2s ease-in-out;
`;

const NavLink = styledComponents(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  text-decoration: none;
  color: inherit;
  padding-inline: ${({ theme }) => getAppTheme(theme).app.space.padding.pill};
  padding-block: calc(${({ theme }) => getAppTheme(theme).app.space.padding.pill} / 2);
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    outline-offset: 4px;
    background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
  }

  &:focus-visible ${NavText} {
    color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
    text-decoration: none;
  }

  &:hover ${NavText} {
    color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimary};
    text-decoration: underline;
    text-decoration-color: currentColor;
    text-decoration-thickness: 0.125rem;
    text-underline-offset: 0.25rem;
  }
`;

export default function Header(): JSX.Element {
  const nav = useNavItems();

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
      <Link href={nav.home.href} aria-label={nav.home.ariaLabel}>
        <OakImage
          src={nav.home.icon.src}
          alt={nav.home.icon.alt}
          width={nav.home.icon.width}
          height={nav.home.icon.height}
        />
      </Link>

      <PrimaryNav as="nav" aria-label="Primary" $font="body-3" $color="text-primary">
        {nav.primary.map((item) => (
          <NavLink key={item.id} href={item.href} aria-label={item.ariaLabel}>
            <NavText as="span" $font="body-3" $color="text-primary">
              {item.label}
            </NavText>
          </NavLink>
        ))}
      </PrimaryNav>

      <OakBox
        $ml="auto"
        aria-label={nav.utilities.find((utility) => utility.type === 'theme-select')?.ariaLabel}
      >
        <ThemeSelect />
      </OakBox>
    </HeaderRoot>
  );
}
