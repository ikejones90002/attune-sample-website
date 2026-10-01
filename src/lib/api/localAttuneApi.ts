import { SAMPLE_PROFILES } from '../../data/profiles';
import type { AttuneStore } from '../store';
import type { ChatMessage, UserProfile } from '../types';
import type { AttuneApi, LikeResult } from './AttuneApi';

function makeMessageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Browser-local AttuneApi adapter — the only implementation today.
 *
 * `read` always returns the latest state and `write` persists every
 * resulting state (the provider binds these to a state ref + saveStore +
 * setState), so mutations never apply to a stale snapshot. The mutation
 * logic is copied faithfully from the old store actions, and every method
 * resolves immediately — no artificial latency.
 */
export function createLocalAttuneApi(
  read: () => AttuneStore,
  write: (next: AttuneStore) => void,
): AttuneApi {
  return {
    getState: (): Promise<AttuneStore> => Promise.resolve(read()),

    saveProfile: (profile: UserProfile): Promise<void> => {
      write({ ...read(), profile });
      return Promise.resolve();
    },

    like: (id: string): Promise<LikeResult> => {
      const state = read();
      if (state.likes.includes(id)) {
        return Promise.resolve({
          matched: state.matches.some((m) => m.profileId === id),
        });
      }
      const nextLikes = [...state.likes, id];
      const nextPasses = state.passes.filter((p) => p !== id);
      const profile = SAMPLE_PROFILES.find((p) => p.id === id);
      const isNewMatch =
        profile !== undefined &&
        profile.likesMeBack &&
        !state.matches.some((m) => m.profileId === id);
      const nextMatches = isNewMatch
        ? [...state.matches, { profileId: id, matchedAt: new Date().toISOString() }]
        : state.matches;
      write({ ...state, likes: nextLikes, passes: nextPasses, matches: nextMatches });
      return Promise.resolve({ matched: isNewMatch });
    },

    pass: (id: string): Promise<void> => {
      const state = read();
      if (state.passes.includes(id)) {
        return Promise.resolve();
      }
      write({ ...state, passes: [...state.passes, id] });
      return Promise.resolve();
    },

    unpass: (id: string): Promise<void> => {
      const state = read();
      write({ ...state, passes: state.passes.filter((p) => p !== id) });
      return Promise.resolve();
    },

    hideProfile: (id: string): Promise<void> => {
      const state = read();
      if (state.hiddenIds.includes(id)) {
        return Promise.resolve();
      }
      write({ ...state, hiddenIds: [...state.hiddenIds, id] });
      return Promise.resolve();
    },

    unhideProfile: (id: string): Promise<void> => {
      const state = read();
      write({ ...state, hiddenIds: state.hiddenIds.filter((h) => h !== id) });
      return Promise.resolve();
    },

    reportProfile: (id: string): Promise<void> => {
      const state = read();
      write({
        ...state,
        reportedIds: { ...state.reportedIds, [id]: new Date().toISOString() },
      });
      return Promise.resolve();
    },

    unmatchProfile: (id: string): Promise<void> => {
      const state = read();
      write({ ...state, matches: state.matches.filter((m) => m.profileId !== id) });
      return Promise.resolve();
    },

    blockProfile: (id: string): Promise<void> => {
      const state = read();
      write({
        ...state,
        blockedIds: state.blockedIds.includes(id)
          ? state.blockedIds
          : [...state.blockedIds, id],
        matches: state.matches.filter((m) => m.profileId !== id),
      });
      return Promise.resolve();
    },

    unblockProfile: (id: string): Promise<void> => {
      const state = read();
      write({ ...state, blockedIds: state.blockedIds.filter((b) => b !== id) });
      return Promise.resolve();
    },

    toggleEventRsvp: (id: string): Promise<void> => {
      const state = read();
      write({
        ...state,
        eventRsvps: state.eventRsvps.includes(id)
          ? state.eventRsvps.filter((e) => e !== id)
          : [...state.eventRsvps, id],
      });
      return Promise.resolve();
    },

    toggleSavedResource: (id: string): Promise<void> => {
      const state = read();
      write({
        ...state,
        savedResourceIds: state.savedResourceIds.includes(id)
          ? state.savedResourceIds.filter((r) => r !== id)
          : [...state.savedResourceIds, id],
      });
      return Promise.resolve();
    },

    setIdVerified: (verified: boolean): Promise<void> => {
      write({ ...read(), idVerified: verified });
      return Promise.resolve();
    },

    sendMessage: (threadId: string, text: string, from: 'me' | 'them' = 'me'): Promise<void> => {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        return Promise.resolve();
      }
      const state = read();
      const message: ChatMessage = {
        id: makeMessageId(),
        from,
        text: trimmed,
        at: new Date().toISOString(),
      };
      const existing = state.messages[threadId] ?? [];
      write({
        ...state,
        messages: { ...state.messages, [threadId]: [...existing, message] },
      });
      return Promise.resolve();
    },

    resetDemo: (): Promise<void> => {
      write({
        profile: null,
        likes: [],
        passes: [],
        matches: [],
        messages: {},
        hiddenIds: [],
        reportedIds: {},
        blockedIds: [],
        eventRsvps: [],
        savedResourceIds: [],
        idVerified: false,
      });
      return Promise.resolve();
    },
  };
}
