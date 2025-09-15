'use client';

import type { JSX, Dispatch, SetStateAction } from 'react';
import sc from 'styled-components';

const Tablist = sc.div`
  display: flex;
  gap: ${(p) => p.theme.app.space.sm};
  margin-bottom: ${(p) => p.theme.app.space.lg};
`;

const TabButton = sc.button<{ $active: boolean }>`
  padding: ${(p) => `${p.theme.app.space.xs} ${p.theme.app.space.sm}`};
  border: 1px solid ${(p) => p.theme.app.colors.headerBorder};
  border-radius: ${(p) => p.theme.app.radii.sm};
  background: ${(p) => (p.$active ? 'rgba(0,0,0,0.06)' : 'transparent')};
`;

function SearchTabHeader({
  active,
  setActive,
}: {
  active: 'structured' | 'nl';
  setActive: Dispatch<SetStateAction<'structured' | 'nl'>>;
}): JSX.Element {
  return (
    <Tablist role="tablist" aria-label="Search mode">
      <TabButton
        role="tab"
        aria-selected={active === 'structured'}
        aria-controls="structured-panel"
        id="structured-tab"
        type="button"
        $active={active === 'structured'}
        onClick={() => {
          setActive('structured');
        }}
      >
        Structured
      </TabButton>
      <TabButton
        role="tab"
        aria-selected={active === 'nl'}
        aria-controls="nl-panel"
        id="nl-tab"
        type="button"
        $active={active === 'nl'}
        onClick={() => {
          setActive('nl');
        }}
      >
        Natural language
      </TabButton>
    </Tablist>
  );
}

export default SearchTabHeader;
