import type { AttuneStore } from '../store';
import type { UserProfile } from '../types';

/**
 * AttuneApi — the typed API boundary between the pages and the data layer.
 *
 * Today the only implementation is the browser-local adapter
 * (localAttuneApi), which keeps state in memory and persists it to
 * localStorage via the store module. Roadmap step 10 wires a real backend
 * (Supabase, chosen by the user) by implementing this same interface in a
 * second adapter (see supabaseAttuneApi.ts), one endpoint at a time:
 * auth → own profile → likes/passes/matches → messages → community →
 * safety/verification. Pages must only ever talk to this interface, never
 * to a concrete adapter or to localStorage directly.
 *
 * Every method returns a Promise so a network-backed adapter can do real
 * I/O later without changing page code; the local adapter resolves
 * immediately and preserves the prototype's current behavior exactly.
 */

export interface LikeResult {
  matched: boolean;
}

export interface AttuneApi {
  /** Snapshot of the latest state (replaces direct loadStore() reads). */
  getState(): Promise<AttuneStore>;
  saveProfile(profile: UserProfile): Promise<void>;
  like(id: string): Promise<LikeResult>;
  pass(id: string): Promise<void>;
  unpass(id: string): Promise<void>;
  hideProfile(id: string): Promise<void>;
  unhideProfile(id: string): Promise<void>;
  reportProfile(id: string): Promise<void>;
  unmatchProfile(id: string): Promise<void>;
  blockProfile(id: string): Promise<void>;
  unblockProfile(id: string): Promise<void>;
  toggleEventRsvp(id: string): Promise<void>;
  toggleSavedResource(id: string): Promise<void>;
  setIdVerified(verified: boolean): Promise<void>;
  sendMessage(threadId: string, text: string, from?: 'me' | 'them'): Promise<void>;
  resetDemo(): Promise<void>;
}
