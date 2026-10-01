import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttune } from '../lib/api/AttuneApiProvider';
import type {
  AccessibilityNeeds,
  CommunicationPrefs,
  MatchingPrefs,
  UserProfile,
} from '../lib/types';
import './Onboarding.css';
import logoImage from '/logo.png';

const STEPS = [
  'welcome',
  'accessibility',
  'communication',
  'profile',
  'matching',
  'safety',
  'complete',
] as const;

type OnboardingStep = (typeof STEPS)[number];

const INITIAL_PROFILE: UserProfile = {
  name: '',
  age: 18,
  location: '',
  bio: '',
  interests: [],
  accessibilityNeeds: {
    deafHoH: false,
    blindLowVision: false,
    mobility: false,
    cognitive: false,
    other: false,
    otherDetails: '',
  },
  communicationPreferences: {
    asl: false,
    bsl: false,
    otherSignLanguage: '',
    lipReading: false,
    captions: false,
    screenReader: false,
    voiceControl: false,
    largeText: false,
  },
  matchingPrefs: {
    ageMin: 18,
    ageMax: 99,
    maxDistanceMi: 100,
    openTo: [],
  },
  onboardingComplete: false,
};

type AccessibilityToggle = Exclude<keyof AccessibilityNeeds, 'otherDetails'>;
type CommunicationToggle = Exclude<keyof CommunicationPrefs, 'otherSignLanguage'>;

const ACCESSIBILITY_OPTIONS: { key: AccessibilityToggle; label: string; hint: string }[] = [
  {
    key: 'deafHoH',
    label: 'Deaf or Hard of Hearing',
    hint: 'I use captions, sign language, or other communication methods',
  },
  {
    key: 'blindLowVision',
    label: 'Blind or Low Vision',
    hint: 'I use screen readers, high contrast, or large text',
  },
  {
    key: 'mobility',
    label: 'Mobility or Motor Differences',
    hint: 'I use assistive devices or alternative input methods',
  },
  {
    key: 'cognitive',
    label: 'Cognitive or Neurodivergent',
    hint: 'I benefit from clear layouts and reduced complexity',
  },
  {
    key: 'other',
    label: 'Other',
    hint: 'I have other accessibility needs not listed above',
  },
];

const COMMUNICATION_OPTIONS: { key: CommunicationToggle; label: string; hint: string }[] = [
  { key: 'asl', label: 'American Sign Language (ASL)', hint: 'I sign in ASL' },
  { key: 'bsl', label: 'British Sign Language (BSL)', hint: 'I sign in BSL' },
  { key: 'lipReading', label: 'Lip Reading', hint: 'I follow conversation visually' },
  { key: 'captions', label: 'Captions / Subtitles', hint: 'I prefer captioned video' },
  {
    key: 'screenReader',
    label: 'Screen Reader (VoiceOver, TalkBack, JAWS)',
    hint: 'I navigate with a screen reader',
  },
  {
    key: 'voiceControl',
    label: 'Voice Control / Voice Commands',
    hint: 'I control my device by voice',
  },
  { key: 'largeText', label: 'Large Text / High Contrast', hint: 'I prefer enlarged, high-contrast text' },
];

const OPEN_TO_OPTIONS: { label: string; hint: string }[] = [
  { label: 'Women', hint: 'Show me women' },
  { label: 'Men', hint: 'Show me men' },
  { label: 'Nonbinary people', hint: 'Show me nonbinary people' },
  { label: 'Everyone', hint: 'Show me everyone, regardless of gender' },
];

function parseInterests(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function Onboarding() {
  const navigate = useNavigate();
  const [, { saveProfile }] = useAttune();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [interestsInput, setInterestsInput] = useState('');
  const [ageTouched, setAgeTouched] = useState(false);
  const [matchingTouched, setMatchingTouched] = useState(false);
  const savedStepRef = useRef<OnboardingStep | ''>('');

  function updateProfile<K extends keyof UserProfile>(field: K, value: UserProfile[K]): void {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function updateAccessibility<K extends keyof AccessibilityNeeds>(
    key: K,
    value: AccessibilityNeeds[K],
  ): void {
    setProfile((prev) => ({
      ...prev,
      accessibilityNeeds: { ...prev.accessibilityNeeds, [key]: value },
    }));
  }

  function updateCommunication<K extends keyof CommunicationPrefs>(
    key: K,
    value: CommunicationPrefs[K],
  ): void {
    setProfile((prev) => ({
      ...prev,
      communicationPreferences: { ...prev.communicationPreferences, [key]: value },
    }));
  }

  function updateMatchingPrefs<K extends keyof MatchingPrefs>(
    key: K,
    value: MatchingPrefs[K],
  ): void {
    setProfile((prev) => ({
      ...prev,
      matchingPrefs: { ...prev.matchingPrefs, [key]: value },
    }));
  }

  function toggleOpenTo(label: string): void {
    setProfile((prev) => ({
      ...prev,
      matchingPrefs: {
        ...prev.matchingPrefs,
        openTo: prev.matchingPrefs.openTo.includes(label)
          ? prev.matchingPrefs.openTo.filter((item) => item !== label)
          : [...prev.matchingPrefs.openTo, label],
      },
    }));
  }

  const goToStep = (step: OnboardingStep): void => {
    setCurrentStep(step);
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepNumber = (step: OnboardingStep): number => STEPS.indexOf(step) + 1;

  const totalSteps = STEPS.length;

  // Persist the completed profile when the user reaches the final step.
  useEffect(() => {
    if (currentStep === 'complete' && savedStepRef.current !== 'complete') {
      savedStepRef.current = 'complete';
      void saveProfile({ ...profile, onboardingComplete: true });
    } else if (currentStep !== 'complete') {
      savedStepRef.current = '';
    }
  }, [currentStep, profile, saveProfile]);

  const ageIsValid =
    Number.isInteger(profile.age) && profile.age >= 18 && profile.age <= 99;
  const profileStepValid =
    profile.name.trim().length > 0 && ageIsValid && profile.location.trim().length > 0;
  const ageErrorId = 'age-error';
  const ageDescribedBy = ageTouched && !ageIsValid ? `age-note ${ageErrorId}` : 'age-note';

  const matchingPrefs = profile.matchingPrefs;
  const matchingStepValid =
    Number.isFinite(matchingPrefs.ageMin) &&
    matchingPrefs.ageMin >= 18 &&
    Number.isFinite(matchingPrefs.ageMax) &&
    matchingPrefs.ageMax >= matchingPrefs.ageMin &&
    Number.isFinite(matchingPrefs.maxDistanceMi) &&
    matchingPrefs.maxDistanceMi > 0;

  const accessibilityBadges: { flag: boolean; label: string }[] = [
    { flag: profile.accessibilityNeeds.deafHoH, label: 'Deaf/HoH' },
    { flag: profile.accessibilityNeeds.blindLowVision, label: 'Blind/Low Vision' },
    { flag: profile.accessibilityNeeds.mobility, label: 'Mobility' },
    { flag: profile.accessibilityNeeds.cognitive, label: 'Cognitive/Neurodivergent' },
    { flag: profile.accessibilityNeeds.other, label: 'Other' },
  ];

  const communicationBadges: { flag: boolean; label: string }[] = [
    { flag: profile.communicationPreferences.asl, label: 'ASL' },
    { flag: profile.communicationPreferences.bsl, label: 'BSL' },
    {
      flag: profile.communicationPreferences.otherSignLanguage.trim().length > 0,
      label: profile.communicationPreferences.otherSignLanguage,
    },
    { flag: profile.communicationPreferences.lipReading, label: 'Lip Reading' },
    { flag: profile.communicationPreferences.captions, label: 'Captions' },
    { flag: profile.communicationPreferences.screenReader, label: 'Screen Reader' },
    { flag: profile.communicationPreferences.voiceControl, label: 'Voice Control' },
    { flag: profile.communicationPreferences.largeText, label: 'Large Text' },
  ];

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div
            className="progress-bar-container"
            role="progressbar"
            aria-valuenow={getStepNumber(currentStep)}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          >
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(getStepNumber(currentStep) / totalSteps) * 100}%` }}
              />
            </div>
            <p className="progress-text" aria-live="polite">
              Step {getStepNumber(currentStep)} of {totalSteps}
            </p>
          </div>
        )}

        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="onboarding-step welcome-step">
            <div className="step-content">
              <img src={logoImage} alt="Attune logo" className="welcome-logo" />
              <h1>Welcome to Attune</h1>
              <p className="welcome-subtitle">
                We&apos;re excited to help you connect authentically. This quick setup will help
                us personalize your experience based on how you communicate.
              </p>

              <div className="welcome-features">
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">
                    🔒
                  </span>
                  <div>
                    <h3>Your Privacy Matters</h3>
                    <p>Your accessibility needs are private and secure</p>
                  </div>
                </div>
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">
                    ⚙️
                  </span>
                  <div>
                    <h3>Fully Customizable</h3>
                    <p>Change your preferences anytime in settings</p>
                  </div>
                </div>
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">
                    🤝
                  </span>
                  <div>
                    <h3>Better Matches</h3>
                    <p>Connect with people who share your communication style</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary btn-large" onClick={() => goToStep('accessibility')}>
                Get Started
              </button>

              <p className="welcome-note">Takes about 2-3 minutes</p>
            </div>
          </div>
        )}

        {/* Accessibility Needs Step */}
        {currentStep === 'accessibility' && (
          <div className="onboarding-step accessibility-step">
            <div className="step-content">
              <h2>How do you experience the world?</h2>
              <p className="step-description">
                Select all that apply. This helps us provide the best experience and connect you
                with people who understand your needs.
              </p>

              <fieldset className="checkbox-group">
                <legend className="sr-only">Select your accessibility needs</legend>

                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <label className="checkbox-card" key={option.key}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={profile.accessibilityNeeds[option.key]}
                      onChange={(e) => updateAccessibility(option.key, e.target.checked)}
                    />
                    <span className="checkbox-card-indicator" aria-hidden="true" />
                    <span className="checkbox-card-content">
                      <strong>{option.label}</strong>
                      <p>{option.hint}</p>
                    </span>
                  </label>
                ))}

                {profile.accessibilityNeeds.other && (
                  <div className="other-details-field">
                    <label htmlFor="other-details">Please describe (optional):</label>
                    <textarea
                      id="other-details"
                      value={profile.accessibilityNeeds.otherDetails}
                      onChange={(e) => updateAccessibility('otherDetails', e.target.value)}
                      placeholder="Tell us more about your accessibility needs..."
                      rows={4}
                    />
                  </div>
                )}
              </fieldset>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => goToStep('welcome')}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => goToStep('communication')}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Communication Preferences Step */}
        {currentStep === 'communication' && (
          <div className="onboarding-step communication-step">
            <div className="step-content">
              <h2>How do you prefer to communicate?</h2>
              <p className="step-description">
                Select your preferred methods. This helps us match you with people who share
                your communication style.
              </p>

              <fieldset className="checkbox-group">
                <legend className="sr-only">Select your communication preferences</legend>

                <div className="preference-section">
                  <h3 className="section-heading">Sign Language</h3>

                  {COMMUNICATION_OPTIONS.filter(
                    (option) => option.key === 'asl' || option.key === 'bsl',
                  ).map((option) => (
                    <label className="checkbox-card compact" key={option.key}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={profile.communicationPreferences[option.key]}
                        onChange={(e) => updateCommunication(option.key, e.target.checked)}
                      />
                      <span className="checkbox-card-indicator" aria-hidden="true" />
                      <span className="checkbox-card-content">
                        <strong>{option.label}</strong>
                        <p>{option.hint}</p>
                      </span>
                    </label>
                  ))}

                  <div className="text-field-inline">
                    <label htmlFor="other-sign-language">Other sign language:</label>
                    <input
                      type="text"
                      id="other-sign-language"
                      value={profile.communicationPreferences.otherSignLanguage}
                      onChange={(e) => updateCommunication('otherSignLanguage', e.target.value)}
                      placeholder="e.g., LSF, Auslan, JSL..."
                    />
                  </div>
                </div>

                <div className="preference-section">
                  <h3 className="section-heading">Visual Communication</h3>

                  {COMMUNICATION_OPTIONS.filter(
                    (option) => option.key === 'lipReading' || option.key === 'captions',
                  ).map((option) => (
                    <label className="checkbox-card compact" key={option.key}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={profile.communicationPreferences[option.key]}
                        onChange={(e) => updateCommunication(option.key, e.target.checked)}
                      />
                      <span className="checkbox-card-indicator" aria-hidden="true" />
                      <span className="checkbox-card-content">
                        <strong>{option.label}</strong>
                        <p>{option.hint}</p>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="preference-section">
                  <h3 className="section-heading">Assistive Technology</h3>

                  {COMMUNICATION_OPTIONS.filter(
                    (option) =>
                      option.key === 'screenReader' ||
                      option.key === 'voiceControl' ||
                      option.key === 'largeText',
                  ).map((option) => (
                    <label className="checkbox-card compact" key={option.key}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={profile.communicationPreferences[option.key]}
                        onChange={(e) => updateCommunication(option.key, e.target.checked)}
                      />
                      <span className="checkbox-card-indicator" aria-hidden="true" />
                      <span className="checkbox-card-content">
                        <strong>{option.label}</strong>
                        <p>{option.hint}</p>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => goToStep('accessibility')}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => goToStep('profile')}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Setup Step */}
        {currentStep === 'profile' && (
          <div className="onboarding-step profile-step">
            <div className="step-content">
              <h2>Tell us a bit about yourself</h2>
              <p className="step-description">
                Basic info to help people get to know you. You can add photos and more details
                later.
              </p>

              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  placeholder="Your first name"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  Age <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  value={Number.isFinite(profile.age) ? profile.age : ''}
                  onChange={(e) => updateProfile('age', Number(e.target.value))}
                  onBlur={() => setAgeTouched(true)}
                  placeholder="18"
                  min={18}
                  max={99}
                  required
                  aria-required="true"
                  aria-invalid={ageTouched && !ageIsValid}
                  aria-describedby={ageDescribedBy}
                />
                <p className="field-note" id="age-note">
                  Must be 18 or older
                </p>
                {ageTouched && !ageIsValid && (
                  <p className="field-error" id={ageErrorId} role="alert">
                    Please enter an age of 18 or older. Attune is an 18+ community.
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={profile.location}
                  onChange={(e) => updateProfile('location', e.target.value)}
                  placeholder="City, State"
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  placeholder="A few sentences about you..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="interests">Interests</label>
                <input
                  type="text"
                  id="interests"
                  value={interestsInput}
                  onChange={(e) => {
                    setInterestsInput(e.target.value);
                    updateProfile('interests', parseInterests(e.target.value));
                  }}
                  placeholder="Hiking, ASL poetry, board games"
                  aria-describedby="interests-note"
                />
                <p className="field-note" id="interests-note">
                  Separate interests with commas
                </p>
              </div>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => goToStep('communication')}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => goToStep('matching')}
                  disabled={!profileStepValid}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Matching Preferences Step */}
        {currentStep === 'matching' && (
          <div className="onboarding-step matching-step">
            <div className="step-content">
              <h2>Who would you like to meet?</h2>
              <p className="step-description">
                Set your matching preferences. You can adjust these anytime in settings.
              </p>

              <div className="form-group">
                <label htmlFor="age-min">Minimum age</label>
                <input
                  type="number"
                  id="age-min"
                  value={Number.isFinite(matchingPrefs.ageMin) ? matchingPrefs.ageMin : ''}
                  onChange={(e) => updateMatchingPrefs('ageMin', Number(e.target.value))}
                  onBlur={() => setMatchingTouched(true)}
                  min={18}
                  max={99}
                  aria-describedby="matching-age-note"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age-max">Maximum age</label>
                <input
                  type="number"
                  id="age-max"
                  value={Number.isFinite(matchingPrefs.ageMax) ? matchingPrefs.ageMax : ''}
                  onChange={(e) => updateMatchingPrefs('ageMax', Number(e.target.value))}
                  onBlur={() => setMatchingTouched(true)}
                  min={18}
                  max={99}
                  aria-describedby="matching-age-note"
                />
              </div>

              <div className="form-group">
                <label htmlFor="max-distance">Maximum distance (miles)</label>
                <input
                  type="number"
                  id="max-distance"
                  value={
                    Number.isFinite(matchingPrefs.maxDistanceMi) ? matchingPrefs.maxDistanceMi : ''
                  }
                  onChange={(e) => updateMatchingPrefs('maxDistanceMi', Number(e.target.value))}
                  onBlur={() => setMatchingTouched(true)}
                  min={1}
                  aria-describedby="matching-distance-note"
                />
                <p className="field-note" id="matching-distance-note">
                  How far away should we look for matches?
                </p>
              </div>

              <p className="field-note" id="matching-age-note">
                Age range must start at 18 or older, and the maximum can&apos;t be below the
                minimum.
              </p>
              {matchingTouched && !matchingStepValid && (
                <p className="field-error" role="alert">
                  Please fix the highlighted preferences: age range must be 18+ with the
                  maximum at or above the minimum, and distance must be at least 1 mile.
                </p>
              )}

              <fieldset className="checkbox-group">
                <legend className="sr-only">Who are you open to matching with?</legend>
                <h3 className="section-heading">I&apos;m open to</h3>

                {OPEN_TO_OPTIONS.map((option) => (
                  <label className="checkbox-card compact" key={option.label}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={matchingPrefs.openTo.includes(option.label)}
                      onChange={() => toggleOpenTo(option.label)}
                    />
                    <span className="checkbox-card-indicator" aria-hidden="true" />
                    <span className="checkbox-card-content">
                      <strong>{option.label}</strong>
                      <p>{option.hint}</p>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => goToStep('profile')}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => goToStep('safety')}
                  disabled={!matchingStepValid}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Safety Step */}
        {currentStep === 'safety' && (
          <div className="onboarding-step safety-step">
            <div className="step-content">
              <h2>Safety, honestly</h2>
              <p className="step-description">
                A few things worth knowing before you start matching.
              </p>

              <ul className="safety-list">
                <li>
                  <strong>ID verification isn&apos;t available in this prototype yet.</strong>{' '}
                  Profiles here are samples, not verified people.
                </li>
                <li>
                  Blocking and reporting are available — your blocks and reports are stored
                  locally in this prototype.
                </li>
                <li>
                  Your accessibility data stays private in your browser. It&apos;s never
                  uploaded or shared.
                </li>
                <li>
                  When you meet someone new, meet in a public place and let a friend know
                  where you&apos;ll be.
                </li>
              </ul>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => goToStep('matching')}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => goToStep('complete')}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <div className="onboarding-step complete-step">
            <div className="step-content">
              <div className="success-icon" aria-hidden="true">
                ✓
              </div>
              <h1>You&apos;re all set!</h1>
              <p className="complete-subtitle">
                Welcome to Attune, {profile.name}. Your personalized experience is ready.
              </p>

              <div className="profile-summary">
                <h3>Your Profile Summary</h3>

                <div className="summary-section">
                  <h4>Accessibility Needs</h4>
                  <div className="badge-list">
                    {accessibilityBadges
                      .filter((badge) => badge.flag)
                      .map((badge) => (
                        <span className="badge" key={badge.label}>
                          {badge.label}
                        </span>
                      ))}
                    {!accessibilityBadges.some((badge) => badge.flag) && (
                      <span className="badge-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Communication Preferences</h4>
                  <div className="badge-list">
                    {communicationBadges
                      .filter((badge) => badge.flag)
                      .map((badge) => (
                        <span className="badge" key={badge.label}>
                          {badge.label}
                        </span>
                      ))}
                    {!communicationBadges.some((badge) => badge.flag) && (
                      <span className="badge-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Matching Preferences</h4>
                  <p className="summary-text">
                    Ages {matchingPrefs.ageMin}&ndash;{matchingPrefs.ageMax} &bull; within{' '}
                    {matchingPrefs.maxDistanceMi} miles
                  </p>
                  <div className="badge-list">
                    {matchingPrefs.openTo.length > 0 ? (
                      matchingPrefs.openTo.map((label) => (
                        <span className="badge" key={label}>
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="badge-muted">No preference selected</span>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Basic Info</h4>
                  <p className="summary-text">
                    {profile.name}, {profile.age} &bull; {profile.location}
                  </p>
                  {profile.bio.trim().length > 0 && (
                    <p className="summary-text">{profile.bio}</p>
                  )}
                  {profile.interests.length > 0 && (
                    <div className="badge-list">
                      {profile.interests.map((interest) => (
                        <span className="badge" key={interest}>
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="complete-actions">
                <button className="btn-primary btn-large" onClick={() => navigate('/swipe')}>
                  Start Exploring Matches
                </button>
                <button className="btn-text" onClick={() => goToStep('accessibility')}>
                  Edit My Preferences
                </button>
              </div>

              <div className="next-steps">
                <h3>Next Steps</h3>
                <ul>
                  <li>✨ Add photos to your profile</li>
                  <li>🎥 Record a video introduction</li>
                  <li>🔍 Browse potential matches</li>
                  <li>💬 Start connecting!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
