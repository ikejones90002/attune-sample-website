import { useState } from 'react';
import './Onboarding.css';

interface AccessibilityNeeds {
  deafHoH: boolean;
  blindLowVision: boolean;
  mobility: boolean;
  cognitive: boolean;
  other: boolean;
  otherDetails: string;
}

interface CommunicationPreferences {
  asl: boolean;
  bsl: boolean;
  otherSignLanguage: string;
  lipReading: boolean;
  captions: boolean;
  screenReader: boolean;
  voiceControl: boolean;
  largeText: boolean;
}

interface UserProfile {
  name: string;
  age: string;
  location: string;
  accessibilityNeeds: AccessibilityNeeds;
  communicationPreferences: CommunicationPreferences;
}

type OnboardingStep = 'welcome' | 'accessibility' | 'communication' | 'profile' | 'complete';

function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    location: '',
    accessibilityNeeds: {
      deafHoH: false,
      blindLowVision: false,
      mobility: false,
      cognitive: false,
      other: false,
      otherDetails: ''
    },
    communicationPreferences: {
      asl: false,
      bsl: false,
      otherSignLanguage: '',
      lipReading: false,
      captions: false,
      screenReader: false,
      voiceControl: false,
      largeText: false
    }
  });

  const updateAccessibilityNeed = (key: keyof AccessibilityNeeds, value: boolean | string) => {
    setProfile(prev => ({
      ...prev,
      accessibilityNeeds: {
        ...prev.accessibilityNeeds,
        [key]: value
      }
    }));
  };

  const updateCommunicationPref = (key: keyof CommunicationPreferences, value: boolean | string) => {
    setProfile(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [key]: value
      }
    }));
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepNumber = (step: OnboardingStep): number => {
    const steps: OnboardingStep[] = ['welcome', 'accessibility', 'communication', 'profile', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const totalSteps = 5;

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="progress-bar-container" role="progressbar" aria-valuenow={getStepNumber(currentStep)} aria-valuemin={1} aria-valuemax={totalSteps}>
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
              <img 
                src="/attune-sample-website/logo.png" 
                alt="Attune logo" 
                className="welcome-logo"
              />
              <h1>Welcome to Attune</h1>
              <p className="welcome-subtitle">
                We're excited to help you connect authentically. This quick setup will help us 
                personalize your experience based on how you communicate.
              </p>

              <div className="welcome-features">
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">🔒</span>
                  <div>
                    <h3>Your Privacy Matters</h3>
                    <p>Your accessibility needs are private and secure</p>
                  </div>
                </div>
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">⚙️</span>
                  <div>
                    <h3>Fully Customizable</h3>
                    <p>Change your preferences anytime in settings</p>
                  </div>
                </div>
                <div className="welcome-feature">
                  <span className="feature-icon" aria-hidden="true">🤝</span>
                  <div>
                    <h3>Better Matches</h3>
                    <p>Connect with people who share your communication style</p>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary btn-large"
                onClick={() => goToStep('accessibility')}
              >
                Get Started
              </button>

              <p className="welcome-note">
                Takes about 2-3 minutes
              </p>
            </div>
          </div>
        )}

        {/* Accessibility Needs Step */}
        {currentStep === 'accessibility' && (
          <div className="onboarding-step accessibility-step">
            <div className="step-content">
              <h2>How do you experience the world?</h2>
              <p className="step-description">
                Select all that apply. This helps us provide the best experience and connect 
                you with people who understand your needs.
              </p>

              <fieldset className="checkbox-group">
                <legend className="sr-only">Select your accessibility needs</legend>
                
                <div className="checkbox-card">
                  <input
                    type="checkbox"
                    id="deaf-hoh"
                    checked={profile.accessibilityNeeds.deafHoH}
                    onChange={(e) => updateAccessibilityNeed('deafHoH', e.target.checked)}
                  />
                  <label htmlFor="deaf-hoh">
                    <div className="checkbox-card-icon" aria-hidden="true">🦻</div>
                    <div className="checkbox-card-content">
                      <h3>Deaf or Hard of Hearing</h3>
                      <p>I use captions, sign language, or other communication methods</p>
                    </div>
                    <div className="checkbox-indicator" aria-hidden="true">
                      {profile.accessibilityNeeds.deafHoH && <span>✓</span>}
                    </div>
                  </label>
                </div>

                <div className="checkbox-card">
                  <input
                    type="checkbox"
                    id="blind-low-vision"
                    checked={profile.accessibilityNeeds.blindLowVision}
                    onChange={(e) => updateAccessibilityNeed('blindLowVision', e.target.checked)}
                  />
                  <label htmlFor="blind-low-vision">
                    <div className="checkbox-card-icon" aria-hidden="true">👁️</div>
                    <div className="checkbox-card-content">
                      <h3>Blind or Low Vision</h3>
                      <p>I use screen readers, high contrast, or large text</p>
                    </div>
                    <div className="checkbox-indicator" aria-hidden="true">
                      {profile.accessibilityNeeds.blindLowVision && <span>✓</span>}
                    </div>
                  </label>
                </div>

                <div className="checkbox-card">
                  <input
                    type="checkbox"
                    id="mobility"
                    checked={profile.accessibilityNeeds.mobility}
                    onChange={(e) => updateAccessibilityNeed('mobility', e.target.checked)}
                  />
                  <label htmlFor="mobility">
                    <div className="checkbox-card-icon" aria-hidden="true">♿</div>
                    <div className="checkbox-card-content">
                      <h3>Mobility or Motor Differences</h3>
                      <p>I use assistive devices or alternative input methods</p>
                    </div>
                    <div className="checkbox-indicator" aria-hidden="true">
                      {profile.accessibilityNeeds.mobility && <span>✓</span>}
                    </div>
                  </label>
                </div>

                <div className="checkbox-card">
                  <input
                    type="checkbox"
                    id="cognitive"
                    checked={profile.accessibilityNeeds.cognitive}
                    onChange={(e) => updateAccessibilityNeed('cognitive', e.target.checked)}
                  />
                  <label htmlFor="cognitive">
                    <div className="checkbox-card-icon" aria-hidden="true">🧠</div>
                    <div className="checkbox-card-content">
                      <h3>Cognitive or Neurodivergent</h3>
                      <p>I benefit from clear layouts and reduced complexity</p>
                    </div>
                    <div className="checkbox-indicator" aria-hidden="true">
                      {profile.accessibilityNeeds.cognitive && <span>✓</span>}
                    </div>
                  </label>
                </div>

                <div className="checkbox-card">
                  <input
                    type="checkbox"
                    id="other-needs"
                    checked={profile.accessibilityNeeds.other}
                    onChange={(e) => updateAccessibilityNeed('other', e.target.checked)}
                  />
                  <label htmlFor="other-needs">
                    <div className="checkbox-card-icon" aria-hidden="true">➕</div>
                    <div className="checkbox-card-content">
                      <h3>Other</h3>
                      <p>I have other accessibility needs not listed above</p>
                    </div>
                    <div className="checkbox-indicator" aria-hidden="true">
                      {profile.accessibilityNeeds.other && <span>✓</span>}
                    </div>
                  </label>
                </div>

                {profile.accessibilityNeeds.other && (
                  <div className="other-details-field">
                    <label htmlFor="other-details">
                      Please describe (optional):
                    </label>
                    <textarea
                      id="other-details"
                      value={profile.accessibilityNeeds.otherDetails}
                      onChange={(e) => updateAccessibilityNeed('otherDetails', e.target.value)}
                      placeholder="Tell us more about your accessibility needs..."
                      rows={4}
                    />
                  </div>
                )}
              </fieldset>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => goToStep('welcome')}
                >
                  Back
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => goToStep('communication')}
                >
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

                {/* Sign Language Section */}
                <div className="preference-section">
                  <h3 className="section-heading">Sign Language</h3>
                  
                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="asl"
                      checked={profile.communicationPreferences.asl}
                      onChange={(e) => updateCommunicationPref('asl', e.target.checked)}
                    />
                    <label htmlFor="asl">
                      <div className="checkbox-card-icon" aria-hidden="true">🤟</div>
                      <div className="checkbox-card-content">
                        <h4>American Sign Language (ASL)</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.asl && <span>✓</span>}
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="bsl"
                      checked={profile.communicationPreferences.bsl}
                      onChange={(e) => updateCommunicationPref('bsl', e.target.checked)}
                    />
                    <label htmlFor="bsl">
                      <div className="checkbox-card-icon" aria-hidden="true">🤟</div>
                      <div className="checkbox-card-content">
                        <h4>British Sign Language (BSL)</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.bsl && <span>✓</span>}
                      </div>
                    </label>
                  </div>

                  <div className="text-field-inline">
                    <label htmlFor="other-sign-language">
                      Other sign language:
                    </label>
                    <input
                      type="text"
                      id="other-sign-language"
                      value={profile.communicationPreferences.otherSignLanguage}
                      onChange={(e) => updateCommunicationPref('otherSignLanguage', e.target.value)}
                      placeholder="e.g., LSF, Auslan, JSL..."
                    />
                  </div>
                </div>

                {/* Visual Communication */}
                <div className="preference-section">
                  <h3 className="section-heading">Visual Communication</h3>
                  
                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="lip-reading"
                      checked={profile.communicationPreferences.lipReading}
                      onChange={(e) => updateCommunicationPref('lipReading', e.target.checked)}
                    />
                    <label htmlFor="lip-reading">
                      <div className="checkbox-card-icon" aria-hidden="true">👄</div>
                      <div className="checkbox-card-content">
                        <h4>Lip Reading</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.lipReading && <span>✓</span>}
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="captions"
                      checked={profile.communicationPreferences.captions}
                      onChange={(e) => updateCommunicationPref('captions', e.target.checked)}
                    />
                    <label htmlFor="captions">
                      <div className="checkbox-card-icon" aria-hidden="true">📝</div>
                      <div className="checkbox-card-content">
                        <h4>Captions / Subtitles</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.captions && <span>✓</span>}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Assistive Technology */}
                <div className="preference-section">
                  <h3 className="section-heading">Assistive Technology</h3>
                  
                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="screen-reader"
                      checked={profile.communicationPreferences.screenReader}
                      onChange={(e) => updateCommunicationPref('screenReader', e.target.checked)}
                    />
                    <label htmlFor="screen-reader">
                      <div className="checkbox-card-icon" aria-hidden="true">🔊</div>
                      <div className="checkbox-card-content">
                        <h4>Screen Reader (VoiceOver, TalkBack, JAWS)</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.screenReader && <span>✓</span>}
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="voice-control"
                      checked={profile.communicationPreferences.voiceControl}
                      onChange={(e) => updateCommunicationPref('voiceControl', e.target.checked)}
                    />
                    <label htmlFor="voice-control">
                      <div className="checkbox-card-icon" aria-hidden="true">🎙️</div>
                      <div className="checkbox-card-content">
                        <h4>Voice Control / Voice Commands</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.voiceControl && <span>✓</span>}
                      </div>
                    </label>
                  </div>

                  <div className="checkbox-card compact">
                    <input
                      type="checkbox"
                      id="large-text"
                      checked={profile.communicationPreferences.largeText}
                      onChange={(e) => updateCommunicationPref('largeText', e.target.checked)}
                    />
                    <label htmlFor="large-text">
                      <div className="checkbox-card-icon" aria-hidden="true">🔍</div>
                      <div className="checkbox-card-content">
                        <h4>Large Text / High Contrast</h4>
                      </div>
                      <div className="checkbox-indicator" aria-hidden="true">
                        {profile.communicationPreferences.largeText && <span>✓</span>}
                      </div>
                    </label>
                  </div>
                </div>
              </fieldset>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => goToStep('accessibility')}
                >
                  Back
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => goToStep('profile')}
                >
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
                Basic info to help people get to know you. You can add photos and more details later.
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
                  value={profile.age}
                  onChange={(e) => updateProfile('age', e.target.value)}
                  placeholder="18"
                  min="18"
                  max="99"
                  required
                  aria-required="true"
                />
                <p className="field-note">Must be 18 or older</p>
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

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => goToStep('communication')}
                >
                  Back
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => goToStep('complete')}
                  disabled={!profile.name || !profile.age || !profile.location}
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === 'complete' && (
          <div className="onboarding-step complete-step">
            <div className="step-content">
              <div className="success-icon" aria-hidden="true">✓</div>
              <h1>You're all set!</h1>
              <p className="complete-subtitle">
                Welcome to Attune, {profile.name}. Your personalized experience is ready.
              </p>

              <div className="profile-summary">
                <h3>Your Profile Summary</h3>
                
                <div className="summary-section">
                  <h4>Accessibility Needs</h4>
                  <div className="badge-list">
                    {profile.accessibilityNeeds.deafHoH && <span className="badge">Deaf/HoH</span>}
                    {profile.accessibilityNeeds.blindLowVision && <span className="badge">Blind/Low Vision</span>}
                    {profile.accessibilityNeeds.mobility && <span className="badge">Mobility</span>}
                    {profile.accessibilityNeeds.cognitive && <span className="badge">Cognitive/Neurodivergent</span>}
                    {profile.accessibilityNeeds.other && <span className="badge">Other</span>}
                    {!Object.values(profile.accessibilityNeeds).some(v => v === true) && (
                      <span className="badge-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Communication Preferences</h4>
                  <div className="badge-list">
                    {profile.communicationPreferences.asl && <span className="badge">ASL</span>}
                    {profile.communicationPreferences.bsl && <span className="badge">BSL</span>}
                    {profile.communicationPreferences.otherSignLanguage && (
                      <span className="badge">{profile.communicationPreferences.otherSignLanguage}</span>
                    )}
                    {profile.communicationPreferences.lipReading && <span className="badge">Lip Reading</span>}
                    {profile.communicationPreferences.captions && <span className="badge">Captions</span>}
                    {profile.communicationPreferences.screenReader && <span className="badge">Screen Reader</span>}
                    {profile.communicationPreferences.voiceControl && <span className="badge">Voice Control</span>}
                    {profile.communicationPreferences.largeText && <span className="badge">Large Text</span>}
                    {!Object.values(profile.communicationPreferences).some(v => !!v) && (
                      <span className="badge-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Basic Info</h4>
                  <p className="summary-text">
                    {profile.name}, {profile.age} • {profile.location}
                  </p>
                </div>
              </div>

              <div className="complete-actions">
                <button className="btn-primary btn-large">
                  Start Exploring Matches
                </button>
                <button 
                  className="btn-text"
                  onClick={() => goToStep('accessibility')}
                >
                  Edit My Preferences
                </button>
              </div>

              <div className="next-steps">
                <h3>Next Steps</h3>
                <ul>
                  <li>✨ Add photos and a bio to your profile</li>
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