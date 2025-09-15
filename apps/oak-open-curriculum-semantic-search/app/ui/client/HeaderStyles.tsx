'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import sc from 'styled-components';
import ThemeSelect from './ThemeSelect';

const HeaderBar = sc.header`
  border-bottom: 1px solid ${(p) => p.theme.app.colors.headerBorder};
  padding: ${(p) => `${p.theme.app.space.md} ${p.theme.app.space.lg}`};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.app.space.md};
`;

const PrimaryNav = sc.nav`
  a, span {
    margin-left: ${(p) => p.theme.app.space.lg};
  }
`;

const Logo = sc(Image)`
  display: block;
`;

const RightZone = sc.div`
  margin-left: auto;
`;

export default function HeaderStyles(): JSX.Element {
  return (
    <HeaderBar>
      <Link href="/" aria-label="Home">
        <Logo
          src="/oak-national-academy-logo-512.png"
          alt="Oak National Academy"
          width={32}
          height={32}
        />
      </Link>
      <PrimaryNav aria-label="Primary">
        <Link href="/">Home</Link>
        <Link href="/api/docs">Open API Docs</Link>
        <span>|</span>
        <Link href="/admin">Admin</Link>
        <Link href="/healthz">Health (API)</Link>
      </PrimaryNav>
      <RightZone>
        <ThemeSelect />
      </RightZone>
    </HeaderBar>
  );
}
