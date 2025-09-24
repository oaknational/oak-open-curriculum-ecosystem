'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { OakBox, OakFlex, OakImage, OakTypography } from '@oaknational/oak-components';
import ThemeSelect from './ThemeSelect';

const NAV_ITEMS: ReadonlyArray<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/api/docs', label: 'Open API Docs' },
  { href: '/admin', label: 'Admin' },
  { href: '/healthz', label: 'Health (API)' },
];

export default function HeaderStyles(): JSX.Element {
  return (
    <OakFlex
      as="header"
      $alignItems="center"
      $gap="space-between-md"
      $pa="inner-padding-l"
      $bb="border-solid-s"
      $borderColor="border-neutral"
    >
      <Link href="/" aria-label="Home">
        <OakImage
          src="/oak-national-academy-logo-512.png"
          alt="Oak National Academy"
          width={32}
          height={32}
        />
      </Link>

      <OakFlex
        as="nav"
        aria-label="Primary"
        $gap="space-between-lg"
        $alignItems="center"
        $flexWrap="wrap"
        $font="body-3"
      >
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <OakTypography as="span" $font="body-3">
              {item.label}
            </OakTypography>
          </Link>
        ))}
      </OakFlex>

      <OakBox $ml="auto">
        <ThemeSelect />
      </OakBox>
    </OakFlex>
  );
}
