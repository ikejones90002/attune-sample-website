// Sample compatibility scoring for the Discover deck.
//
// This is a transparent demo estimate, not a real compatibility prediction:
// it weighs the viewer's own matching preferences against the fictional
// sample profile's data. Scores are 0–100 with 2–4 short human-readable
// reasons. Nothing is invented — reasons only describe data that exists.
import type { SampleProfile, UserProfile } from './types';

export interface CompatibilityResult {
  score: number;
  reasons: string[];
}

const FALLBACK_PREFS = { ageMin: 18, ageMax: 99, maxDistanceMi: 100 };

/** Human labels for the communication modes a user picked in onboarding. */
function userCommunicationLabels(profile: UserProfile | null): string[] {
  if (profile === null) return [];
  const c = profile.communicationPreferences;
  const labels: string[] = [];
  if (c.asl) labels.push('ASL');
  if (c.bsl) labels.push('BSL');
  const other = c.otherSignLanguage.trim();
  if (other !== '') labels.push(other);
  if (c.lipReading) labels.push('lip reading');
  if (c.captions) labels.push('captions');
  if (c.screenReader) labels.push('screen reader');
  if (c.voiceControl) labels.push('voice control');
  if (c.largeText) labels.push('large text');
  return labels;
}

/** Sample-profile communication entries that overlap with a user label. */
function sharedCommunication(userLabels: string[], sample: SampleProfile): string[] {
  const shared: string[] = [];
  for (const entry of sample.communication) {
    const lower = entry.toLowerCase();
    const matches = userLabels.some((label) => lower.includes(label.toLowerCase()));
    if (matches && !shared.includes(entry)) {
      shared.push(entry);
    }
  }
  return shared;
}

/** Case-insensitive shared interests between the user and the sample profile. */
function sharedInterests(userInterests: string[], sample: SampleProfile): string[] {
  const normalized = new Map<string, string>();
  for (const interest of userInterests) {
    normalized.set(interest.toLowerCase(), interest);
  }
  const shared: string[] = [];
  for (const interest of sample.interests) {
    const original = normalized.get(interest.toLowerCase());
    if (original !== undefined && !shared.includes(original)) {
      shared.push(original);
    }
  }
  return shared;
}

export function computeCompatibility(
  profile: UserProfile | null,
  sample: SampleProfile,
): CompatibilityResult {
  const reasons: string[] = [];
  let score = 40; // Baseline: everyone in the deck passed the preference filter.

  // 1. Communication overlap — the heart of Attune.
  const userLabels = userCommunicationLabels(profile);
  const sharedComms = sharedCommunication(userLabels, sample);
  if (sharedComms.length > 0) {
    score += 20;
    reasons.push(`Shared communication: ${sharedComms.slice(0, 3).join(', ')}`);
  }

  // 2. Distance within the viewer's range.
  const prefs = profile?.matchingPrefs ?? FALLBACK_PREFS;
  if (sample.distanceMi <= prefs.maxDistanceMi) {
    score += 15;
    reasons.push(`${sample.distanceMi} mi away — inside your ${prefs.maxDistanceMi} mi range`);
  }

  // 3. Age within the viewer's range.
  if (sample.age >= prefs.ageMin && sample.age <= prefs.ageMax) {
    score += 15;
    reasons.push(`Age ${sample.age} fits your ${prefs.ageMin}–${prefs.ageMax} range`);
  }

  // 4. Shared interests (10 points each, capped).
  const shared = sharedInterests(profile?.interests ?? [], sample);
  if (shared.length > 0) {
    score += Math.min(shared.length * 10, 20);
    reasons.push(`You both like: ${shared.slice(0, 3).join(', ')}`);
  }

  // Keep the breakdown honest and complete: 2–4 reasons, no invented data.
  if (profile === null) {
    reasons.push('Complete your profile to personalize this estimate');
  }
  if (reasons.length < 2) {
    reasons.push('Sample estimate — real compatibility takes real conversation');
  }

  return {
    score: Math.min(Math.round(score), 100),
    reasons: reasons.slice(0, 4),
  };
}
