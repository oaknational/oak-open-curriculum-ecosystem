'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ColorMode = 'light' | 'dark';

interface ModeContextValue {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggle: () => void;
}

const ModeCtx = createContext<ModeContextValue | undefined>(undefined);

export function ColorModeProvider({
  initialMode,
  children,
}: {
  initialMode: ColorMode;
  children: React.ReactNode;
}): React.JSX.Element {
  const [mode, setMode] = useState<ColorMode>(initialMode);

  const toggle = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ModeContextValue>(() => ({ mode, setMode, toggle }), [mode, toggle]);
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useColorMode(): ModeContextValue {
  const v = useContext(ModeCtx);
  if (!v) {
    throw new Error('useColorMode used outside ColorModeProvider');
  }
  return v;
}
