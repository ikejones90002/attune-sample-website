import type { AttuneApi } from './AttuneApi';

/**
 * Supabase adapter — STUB ONLY (roadmap step 10, not yet wired).
 *
 * The user chose Supabase as the future backend. Wiring it means: creating
 * the Supabase project, adding the @supabase/supabase-js dependency, and
 * implementing these methods one endpoint at a time (auth → own profile →
 * likes/passes/matches → messages → community → safety/verification),
 * swapping the provider over once an endpoint is real. Until then every
 * method throws so an accidental import fails loudly instead of silently
 * falling back to local data. Nothing imports this file yet.
 */

const NOT_WIRED_MESSAGE = 'Supabase adapter not wired yet — see roadmap step 10';

function notWired(): never {
  throw new Error(NOT_WIRED_MESSAGE);
}

export function createSupabaseAttuneApi(): AttuneApi {
  return {
    getState: notWired,
    saveProfile: notWired,
    like: notWired,
    pass: notWired,
    unpass: notWired,
    hideProfile: notWired,
    unhideProfile: notWired,
    reportProfile: notWired,
    unmatchProfile: notWired,
    blockProfile: notWired,
    unblockProfile: notWired,
    toggleEventRsvp: notWired,
    toggleSavedResource: notWired,
    setIdVerified: notWired,
    sendMessage: notWired,
    resetDemo: notWired,
  };
}
