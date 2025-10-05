'use client';

import { useMemo, type JSX } from 'react';
import type { FixtureMode } from '../../../lib/fixture-mode';
import { useFixtureMode } from './FixtureModeContext';
import { FixturePill, FixturePillText } from './FixtureToggle.styles';

type FixtureNoticeCopy = Partial<Record<FixtureMode, string | null>>;

const DEFAULT_FIXTURE_PILL_COPY: Record<FixtureMode, string | null> = {
  fixtures: 'Using fixture scenario: success',
  'fixtures-empty': 'Using fixture scenario: empty dataset',
  'fixtures-error': 'Using fixture scenario: simulated outage',
  live: null,
};

interface SearchFixtureNoticeProps {
  readonly initialFixtureMode: FixtureMode;
  readonly visible: boolean;
  readonly messages?: FixtureNoticeCopy;
}

export function SearchFixtureNotice({
  initialFixtureMode,
  visible,
  messages,
}: SearchFixtureNoticeProps): JSX.Element | null {
  const context = useFixtureMode();

  const mode = context?.mode ?? initialFixtureMode;

  const notice = useMemo(() => {
    if (messages && Object.prototype.hasOwnProperty.call(messages, mode)) {
      return messages[mode] ?? null;
    }
    return DEFAULT_FIXTURE_PILL_COPY[mode];
  }, [messages, mode]);

  if (!notice || !visible) {
    return null;
  }

  return (
    <FixturePill role="status" aria-live="polite">
      <FixturePillText as="span" $font="body-4">
        {notice}
      </FixturePillText>
    </FixturePill>
  );
}
