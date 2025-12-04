'use client';

import type { JSX, Dispatch, SetStateAction } from 'react';
import { OakButtonAsRadioGroup, OakSecondaryButtonAsRadio } from '@oaknational/oak-components';

function SearchTabHeader({
  active,
  setActive,
}: {
  active: 'structured' | 'nl';
  setActive: Dispatch<SetStateAction<'structured' | 'nl'>>;
}): JSX.Element {
  return (
    <OakButtonAsRadioGroup
      name="search-mode"
      ariaLabel="Search mode"
      value={active}
      onChange={(value) => {
        if (value === 'structured' || value === 'nl') {
          setActive(value);
        }
      }}
      $gap="spacing-12"
    >
      <OakSecondaryButtonAsRadio value="structured">Structured</OakSecondaryButtonAsRadio>
      <OakSecondaryButtonAsRadio value="nl">Natural language</OakSecondaryButtonAsRadio>
    </OakButtonAsRadioGroup>
  );
}

export default SearchTabHeader;
