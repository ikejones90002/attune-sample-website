export interface AccessibilityNeeds {
  deafHoH: boolean;
  blindLowVision: boolean;
  mobility: boolean;
  cognitive: boolean;
  other: boolean;
  otherDetails: string;
}

export interface CommunicationPrefs {
  asl: boolean;
  bsl: boolean;
  otherSignLanguage: string;
  lipReading: boolean;
  captions: boolean;
  screenReader: boolean;
  voiceControl: boolean;
  largeText: boolean;
}

export interface MatchingPrefs {
  ageMin: number;
  ageMax: number;
  maxDistanceMi: number;
  openTo: string[];
}

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  accessibilityNeeds: AccessibilityNeeds;
  communicationPreferences: CommunicationPrefs;
  matchingPrefs: MatchingPrefs;
  onboardingComplete: boolean;
}

export interface SampleProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceMi: number;
  bio: string;
  interests: string[];
  communication: string[];
  access: string[];
  gradient: [string, string];
  photo: string;
  likesMeBack: boolean;
}

export interface MatchRecord {
  profileId: string;
  matchedAt: string;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: string;
}
