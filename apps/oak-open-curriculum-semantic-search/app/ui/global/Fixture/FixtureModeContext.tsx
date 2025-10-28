'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type JSX,
  type PropsWithChildren,
} from 'react';

import type { FixtureMode } from '../../../lib/fixture-mode';

export interface FixtureModeValue {
  readonly mode: FixtureMode;
  readonly setMode: (mode: FixtureMode) => void;
}

const FixtureModeContext = createContext<FixtureModeValue | null>(null);

export interface FixtureModeProviderProps {
  readonly initialMode: FixtureMode;
}

export function FixtureModeProvider({
  initialMode,
  children,
}: PropsWithChildren<FixtureModeProviderProps>): JSX.Element {
  const [mode, setMode] = useState<FixtureMode>(initialMode);
  const value = useMemo<FixtureModeValue>(() => ({ mode, setMode }), [mode]);

  return <FixtureModeContext.Provider value={value}>{children}</FixtureModeContext.Provider>;
}

export function useFixtureMode(): FixtureModeValue {
  const context = useContext(FixtureModeContext);
  if (!context) {
    throw new Error('useFixtureMode must be used within FixtureModeProvider');
  }
  return context;
}
