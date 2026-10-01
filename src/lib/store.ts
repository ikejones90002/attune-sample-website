import type { ChatMessage, MatchRecord, UserProfile } from './types';

/**
 * Persistence layer for the prototype's browser-local state.
 *
 * This module owns only the stored shape, its defaults, and defensive
 * load/save against localStorage. All reads and mutations go through the
 * AttuneApi boundary (src/lib/api) — pages never touch this module.
 */

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
  /** Profile ids the user blocked from Matches and Discover (additive, defaults to []). */
  blockedIds: string[];
  /** Community event ids the user RSVP'd to as interested (additive, defaults to []). */
  eventRsvps: string[];
  /** Community resource ids the user saved (additive, defaults to []). */
  savedResourceIds: string[];
  /** Whether the simulated (demo-only) ID-verification flow was completed (additive, defaults to false). */
  idVerified: boolean;
}

export const INITIAL_STORE: AttuneStore = {
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
  // hiddenIds / reportedIds / idVerified were added later — old stored state stays valid.
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
      blockedIds: stringArray(parsed.blockedIds),
      eventRsvps: stringArray(parsed.eventRsvps),
      savedResourceIds: stringArray(parsed.savedResourceIds),
      idVerified: parsed.idVerified === true,
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
