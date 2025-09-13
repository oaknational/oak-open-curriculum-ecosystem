'use client';

import type { JSX, Dispatch, SetStateAction } from 'react';

function SearchTabHeader({
  active,
  setActive,
}: {
  active: 'structured' | 'nl';
  setActive: Dispatch<SetStateAction<'structured' | 'nl'>>;
}): JSX.Element {
  return (
    <div
      role="tablist"
      aria-label="Search mode"
      style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
    >
      <button
        role="tab"
        aria-selected={active === 'structured'}
        aria-controls="structured-panel"
        id="structured-tab"
        type="button"
        onClick={() => {
          setActive('structured');
        }}
      >
        Structured
      </button>
      <button
        role="tab"
        aria-selected={active === 'nl'}
        aria-controls="nl-panel"
        id="nl-tab"
        type="button"
        onClick={() => {
          setActive('nl');
        }}
      >
        Natural language
      </button>
    </div>
  );
}

export default SearchTabHeader;
