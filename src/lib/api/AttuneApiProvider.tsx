import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { loadStore, saveStore } from '../store';
import type { AttuneStore } from '../store';
import type { AttuneApi } from './AttuneApi';
import { createLocalAttuneApi } from './localAttuneApi';

const AttuneApiContext = createContext<[AttuneStore, AttuneApi] | null>(null);

/**
 * Provides the shared [state, api] pair to the whole app. State lives here
 * (one copy, instead of one hook instance per component) and the API is
 * bound to a ref so mutations always apply to the latest state; every
 * write also persists via saveStore, exactly as the old hook did.
 *
 * Roadmap step 10 swaps `createLocalAttuneApi` for the Supabase adapter
 * here — nothing else changes.
 */
export function AttuneApiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AttuneStore>(loadStore);
  const stateRef = useRef(state);

  const api = useMemo<AttuneApi>(
    () =>
      createLocalAttuneApi(
        () => stateRef.current,
        (next: AttuneStore) => {
          stateRef.current = next;
          saveStore(next);
          setState(next);
        },
      ),
    [],
  );

  const value: [AttuneStore, AttuneApi] = [state, api];

  return <AttuneApiContext.Provider value={value}>{children}</AttuneApiContext.Provider>;
}

export function useAttune(): [AttuneStore, AttuneApi] {
  const context = useContext(AttuneApiContext);
  if (context === null) {
    throw new Error('useAttune must be used inside <AttuneApiProvider>');
  }
  return context;
}
