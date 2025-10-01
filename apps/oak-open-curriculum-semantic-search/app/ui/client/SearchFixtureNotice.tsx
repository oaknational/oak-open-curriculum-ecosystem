'use client';

import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import type { FixtureMode } from '../../lib/fixture-mode';
import { SearchFixtureModeToggle } from './SearchFixtureModeToggle';
import { FixtureToggleCluster, FixtureNotice } from './FixtureToggle.styles';

interface SearchFixtureNoticeProps {
  readonly initialFixtureMode: FixtureMode;
  readonly visible: boolean;
}

export function SearchFixtureNotice({
  initialFixtureMode,
  visible,
}: SearchFixtureNoticeProps): JSX.Element | null {
  const { notice, handleModeChange } = useFixtureNotice(initialFixtureMode);

  if (!visible && !notice) {
    return null;
  }

  return (
    <FixtureToggleCluster>
      <SearchFixtureModeToggle
        initialMode={initialFixtureMode}
        visible={visible}
        onModeChange={handleModeChange}
      />
      {notice ? (
        <FixtureNotice as="p" $font="body-3" aria-live="polite">
          {notice}
        </FixtureNotice>
      ) : null}
    </FixtureToggleCluster>
  );
}

function useFixtureNotice(initialFixtureMode: FixtureMode) {
  const [noticeMode, setNoticeMode] = useState<FixtureMode>(initialFixtureMode);

  useEffect(() => {
    setNoticeMode(initialFixtureMode);
  }, [initialFixtureMode]);

  const handleModeChange = useCallback((mode: FixtureMode) => {
    setNoticeMode(mode === 'fixtures' ? 'fixtures' : mode);
  }, []);

  const notice = useMemo(() => resolveFixtureNotice(noticeMode), [noticeMode]);

  return { notice, handleModeChange } as const;
}

function resolveFixtureNotice(mode: FixtureMode): string | null {
  switch (mode) {
    case 'fixtures':
      return 'Showing deterministic fixture results. Switch to live data to inspect production behaviour.';
    case 'fixtures-empty':
      return 'Showing deterministic fixtures without results so you can review empty-state messaging.';
    case 'fixtures-error':
      return 'Simulating a search outage. Switch to live data or try again later.';
    case 'live':
    default:
      return null;
  }
}
