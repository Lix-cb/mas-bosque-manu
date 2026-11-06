import { useContext } from 'react';

import { DemoContext, type DemoContextValue } from '../context/demo-context';

/** Returns the demo state and its actions. Must be called inside `<DemoProvider>`. */
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>.');
  return ctx;
}
