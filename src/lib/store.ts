import { useState } from 'react';
import { SAMPLE_PROFILES } from '../data/profiles';
import type { ChatMessage, MatchRecord, UserProfile } from './types';

export const STORE_KEY = 'attune-store-v1';

export interface AttuneStore {
  profile: UserProfile | null;
  likes: string[];
  passes: string[];
  matches: MatchRecord[];
  messages: Record<string, ChatMessage[]>;
  /** Profile ids the user hid from the Discover deck (additive, defaults to []). */
  hiddenIds: string[];
  /** Reported profile ids mapped to an ISO timestamp (additive, defaults to {}). */
  reportedIds: Record<string, string>;
}

export interface AttuneActions {
  saveProfile(profile: UserProfile): void;
  like(id: string): boolean;
  pass(id: string): void;
  unpass(id: string): void;
  hideProfile(id: string): void;
  reportProfile(id: string): void;
  sendMessage(threadId: string, text: string, from?: 'me' | 'them'): void;
  resetDemo(): void;
}

const INITIAL_STORE: AttuneStore = {
  profile: null,
  likes: [],
  passes: [],
  matches: [],
  messages: {},
  hiddenIds: [],
  reportedIds: {},
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
}

function stringRecord(value: unknown): Record<string, string> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }
  const record: Record<string, string> = {};
  for (const [key, val] of Object.entries(value)) {
    if (typeof val === 'string') {
      record[key] = val;
    }
  }
  return record;
}

function isValidStore(value: unknown): value is AttuneStore {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  // hiddenIds / reportedIds were added later — old stored state stays valid.
  return (
    (v.profile === null || typeof v.profile === 'object') &&
    Array.isArray(v.likes) &&
    Array.isArray(v.passes) &&
    Array.isArray(v.matches) &&
    typeof v.messages === 'object' &&
    v.messages !== null
  );
}

export function loadStore(): AttuneStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === null) {
      return { ...INITIAL_STORE };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidStore(parsed)) {
      return { ...INITIAL_STORE };
    }
    return {
      profile: parsed.profile,
      likes: stringArray(parsed.likes),
      passes: stringArray(parsed.passes),
      matches: parsed.matches,
      messages: parsed.messages,
      hiddenIds: stringArray(parsed.hiddenIds),
      reportedIds: stringRecord(parsed.reportedIds),
    };
  } catch {
    return { ...INITIAL_STORE };
  }
}

export function saveStore(state: AttuneStore): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable or full — prototype continues in memory only.
  }
}

function makeMessageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useAttuneStore(): [AttuneStore, AttuneActions] {
  const [state, setState] = useState<AttuneStore>(loadStore);

  const update = (next: AttuneStore): void => {
    saveStore(next);
    setState(next);
  };

  const actions: AttuneActions = {
    saveProfile: (profile: UserProfile): void => {
      update({ ...state, profile });
    },

    like: (id: string): boolean => {
      if (state.likes.includes(id)) {
        return state.matches.some((m) => m.profileId === id);
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
      update({ ...state, likes: nextLikes, passes: nextPasses, matches: nextMatches });
      return isNewMatch;
    },

    pass: (id: string): void => {
      if (state.passes.includes(id)) {
        return;
      }
      update({ ...state, passes: [...state.passes, id] });
    },

    unpass: (id: string): void => {
      update({ ...state, passes: state.passes.filter((p) => p !== id) });
    },

    hideProfile: (id: string): void => {
      if (state.hiddenIds.includes(id)) {
        return;
      }
      update({ ...state, hiddenIds: [...state.hiddenIds, id] });
    },

    reportProfile: (id: string): void => {
      update({
        ...state,
        reportedIds: { ...state.reportedIds, [id]: new Date().toISOString() },
      });
    },

    sendMessage: (threadId: string, text: string, from: 'me' | 'them' = 'me'): void => {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        return;
      }
      const message: ChatMessage = {
        id: makeMessageId(),
        from,
        text: trimmed,
        at: new Date().toISOString(),
      };
      const existing = state.messages[threadId] ?? [];
      update({
        ...state,
        messages: { ...state.messages, [threadId]: [...existing, message] },
      });
    },

    resetDemo: (): void => {
      update({
        profile: null,
        likes: [],
        passes: [],
        matches: [],
        messages: {},
        hiddenIds: [],
        reportedIds: {},
      });
    },
  };

  return [state, actions];
}
