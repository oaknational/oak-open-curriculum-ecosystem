'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { OakBox, OakFlex, OakImage, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import ThemeSelect from '../Theme/ThemeSelect';
import { getSpacingVar } from '../Layout';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { type HeaderNavMetadata, type HeaderUtilityItemType, useNavItems } from './useNavItems';
import { SearchFixtureModeToggle, useFixtureMode } from '../Fixture';
import type { FixtureMode } from 'app/lib/fixture-mode';

const HeaderRoot = styledComponents(OakBox)`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'logo'
    'nav'
    'utilities';
  row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.stack};
  justify-items: start;
  padding-block: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  padding-inline: ${getSpacingVar('inline-base')};
  border-bottom-color: ${({ theme }) => getAppTheme(theme).app.colors.headerBorder};

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.md}) {
    row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
  }

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.lg}) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'logo nav utilities';
    column-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
    row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
    justify-items: stretch;
    align-items: center;
  }

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.xl}) {
    padding-inline: ${getSpacingVar('inline-wide')};
  }
`;

const LogoLink = styledComponents(Link)`
  grid-area: logo;
  display: inline-flex;
  align-items: center;
`;

const PrimaryNav = styledComponents(OakFlex)`
  grid-area: nav;
  align-items: center;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  justify-content: flex-start;
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

const UtilitiesCluster = styledComponents(OakFlex)`
  flex-direction: column;
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.stack};
  width: min(100%, 24rem);
  align-items: stretch;

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.lg}) {
    align-items: flex-end;
  }
`;

const UtilityItem = styledComponents(OakBox)`
  display: flex;
  justify-content: flex-start;

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.lg}) {
    justify-content: flex-end;
  }
`;

const UtilitiesWrapper = styledComponents(OakBox)`
  grid-area: utilities;
  width: 100%;
  justify-self: stretch;

  @media (min-width: ${({ theme }) => getAppTheme(theme).app.layout.breakpoints.lg}) {
    justify-self: end;
  }
`;

export default function Header(): JSX.Element {
  const nav = useNavItems();
  const { mode: fixtureMode, setMode: setFixtureMode } = useFixtureMode();
  const utilities = nav.utilities.filter((utility) => utility.visible ?? true);

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
      <NavLogo nav={nav} />

      <NavPrimaryNav nav={nav} />

      <UtilityControls
        utilities={utilities}
        fixtureMode={fixtureMode}
        setFixtureMode={setFixtureMode}
      />
    </HeaderRoot>
  );
}

const NavLogo = ({ nav }: { nav: HeaderNavMetadata }): JSX.Element => {
  return (
    <LogoLink href={nav.home.href} aria-label={nav.home.ariaLabel}>
      <OakImage
        src={nav.home.icon.src}
        alt={nav.home.icon.alt}
        width={nav.home.icon.width}
        height={nav.home.icon.height}
      />
    </LogoLink>
  );
};

const NavPrimaryNav = ({ nav }: { nav: HeaderNavMetadata }): JSX.Element => {
  return (
    <PrimaryNav as="nav" aria-label="Primary" $font="body-3" $color="text-primary">
      {nav.primary.map((item) => (
        <NavLink key={item.id} href={item.href} aria-label={item.ariaLabel}>
          <NavText as="span" $font="body-3" $color="text-primary">
            {item.label}
          </NavText>
        </NavLink>
      ))}
    </PrimaryNav>
  );
};

const UtilityControls = ({
  utilities,
  fixtureMode,
  setFixtureMode,
}: {
  utilities: HeaderUtilityItemType[];
  fixtureMode: FixtureMode;
  setFixtureMode: (mode: FixtureMode) => void;
}): JSX.Element => {
  return (
    <UtilitiesWrapper>
      <UtilitiesCluster as="div">
        {utilities.map((utility) => {
          if (utility.type === 'theme-select') {
            return (
              <UtilityItem key={utility.id}>
                <ThemeSelect />
              </UtilityItem>
            );
          }

          if (utility.type === 'fixture-toggle') {
            return (
              <UtilityItem key={utility.id}>
                <SearchFixtureModeToggle
                  initialMode={fixtureMode}
                  visible={utility.visible ?? true}
                  label={utility.label}
                  onModeChange={setFixtureMode}
                />
              </UtilityItem>
            );
          }

          return null;
        })}
      </UtilitiesCluster>
    </UtilitiesWrapper>
  );
};
