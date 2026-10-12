import { useEffect, useState, useRef } from 'react';
import '../App.css';
import './ProfileCreation.css';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { useAttune } from '../lib/api/AttuneApiProvider';
import type {
  AccessibilityNeeds,
  CommunicationPrefs,
  MatchingPrefs,
  UserProfile,
} from '../lib/types';

interface ProfileData {
  name: string;
  age: string;
  bio: string;
  photos: File[];
  videoIntro: File | null;
  audioBio: File | null;
}

const DEFAULT_ACCESSIBILITY_NEEDS: AccessibilityNeeds = {
  deafHoH: false,
  blindLowVision: false,
  mobility: false,
  cognitive: false,
  other: false,
  otherDetails: '',
};

const DEFAULT_COMMUNICATION_PREFS: CommunicationPrefs = {
  asl: false,
  bsl: false,
  otherSignLanguage: '',
  lipReading: false,
  captions: false,
  screenReader: false,
  voiceControl: false,
  largeText: false,
};

const DEFAULT_MATCHING_PREFS: MatchingPrefs = {
  ageMin: 18,
  ageMax: 99,
  maxDistanceMi: 50,
  openTo: [],
};

export default function ProfileCreation() {
  const [storeState, api] = useAttune();
  const existingProfile = storeState.profile;
  const isEditMode = existingProfile !== null;

  const [step, setStep] = useState(1);
  // Step heading ref: only one step renders at a time, so a single ref works.
  // Focus moves here on every step change so screen-reader users don't lose
  // their place when the Next/Back button they activated unmounts.
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step]);
  // Media blobs (photos/video/audio) are session-only and cannot be restored
  // from persisted storage; name/age/bio rehydrate when editing.
  const [form, setForm] = useState<ProfileData>(() => ({
    name: existingProfile?.name ?? '',
    age: existingProfile ? String(existingProfile.age) : '',
    bio: existingProfile?.bio ?? '',
    photos: [],
    videoIntro: null,
    audioBio: null,
  }));

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPrev, setVideoPrev] = useState<string>('');
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  // Inline, announced errors (role="alert") replace native alert() calls.
  const [mediaError, setMediaError] = useState<string | null>(null);
  // Announced confirmation after save (role="status").
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  // Screen-reader announcements for recording state changes (M4).
  const [videoAnnouncement, setVideoAnnouncement] = useState('');
  const [audioAnnouncement, setAudioAnnouncement] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).slice(0, 6 - form.photos.length);
    const newPreviews = newPhotos.map(file => URL.createObjectURL(file));

    setForm(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Video Recording
  const startVideoRecording = async () => {
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], 'video-intro.webm', { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        setForm(prev => ({ ...prev, videoIntro: file }));
        setVideoPrev(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
      setVideoAnnouncement('Recording video…');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setMediaError('Could not access camera. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
      setVideoAnnouncement('Video recording stopped.');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, videoIntro: file }));
      setVideoPrev(URL.createObjectURL(file));
    }
  };

  // Audio Recording
  const startAudioRecording = async () => {
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'audio-bio.webm', { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        setForm(prev => ({ ...prev, audioBio: file }));
        setAudioPreview(url);

        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setAudioAnnouncement('Recording audio…');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setMediaError('Could not access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      setAudioAnnouncement('Audio recording stopped.');
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, audioBio: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const parsedAge = parseInt(form.age, 10);
    const profileToSave: UserProfile = {
      name: form.name.trim(),
      age: Number.isNaN(parsedAge) ? 18 : parsedAge,
      location: existingProfile?.location ?? '',
      bio: form.bio.trim(),
      interests: existingProfile?.interests ?? [],
      accessibilityNeeds: existingProfile?.accessibilityNeeds ?? { ...DEFAULT_ACCESSIBILITY_NEEDS },
      communicationPreferences: existingProfile?.communicationPreferences ?? { ...DEFAULT_COMMUNICATION_PREFS },
      matchingPrefs: existingProfile?.matchingPrefs ?? { ...DEFAULT_MATCHING_PREFS },
      onboardingComplete: true,
    };
    void api.saveProfile(profileToSave);
    setSaveMessage(
      isEditMode
        ? 'Profile updated successfully!'
        : 'Profile created successfully! (Media uploads would sync to your backend in production)'
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return form.name && form.age && parseInt(form.age) >= 18;
      case 2:
        return form.photos.length >= 1;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return form.bio.length >= 20;
      default:
        return false;
    }
  };

  return (
    <div className="profile-creation">
      <div className="profile-creation-container">
        {/* Progress Bar */}
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label="Profile creation progress"
        >
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <p className="step-counter" aria-live="polite">Step {step} of 5</p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="step-content slide-in">
            <h1 ref={stepHeadingRef} tabIndex={-1}>{isEditMode ? 'Edit profile' : 'Create profile'}</h1>
            <p className="step-description">Tell us a bit about yourself</p>

            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required" aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </label>
              <input
                type="text"
                id="name"
                required
                aria-required="true"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Age <span className="required" aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </label>
              <input
                type="text"
                id="age"
                required
                aria-required="true"
                value={form.age}
                onChange={(e) => setForm(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Bio <span className="required" aria-hidden="true">*</span><span className="sr-only">(required)</span>
              </label>
              <textarea
                id="bio"
                required
                aria-required="true"
                value={form.bio}
                onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            <div className="button-group">
              <button type="button" onClick={() => setStep(step + 1)} disabled={!canProceed()}>Next</button>
            </div>
          </div>
        )}

        {/* Step 2: Photos Upload */}
        {step === 2 && (
          <div className="step-content slide-in">
            <h1 ref={stepHeadingRef} tabIndex={-1}>Upload Photos</h1>
            <p className="step-description">Share some photos of yourself!</p>

            <label htmlFor="photo-upload">Upload photos (up to 6)</label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              ref={fileInputRef}
            />

            <div className="photo-grid">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="photo-preview">
                  <img src={preview} alt={`Uploaded preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
              <button type="button" onClick={() => setStep(step + 1)} disabled={form.photos.length === 0}>Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Video Intro */}
        {step === 3 && (
          <div className="step-content slide-in">
            <h1 ref={stepHeadingRef} tabIndex={-1}>Record a Video Introduction</h1>
            <p className="step-description">Show us your personality!</p>

            {mediaError && (
              <p className="form-error" role="alert">
                {mediaError}
              </p>
            )}

            <video ref={videoRef} autoPlay muted aria-label="Camera preview"></video>

            {/* Announced recording status for screen-reader users (M4). */}
            <p className="sr-only" role="status">
              {videoAnnouncement}
            </p>

            {isRecordingVideo ? (
              <div className="button-group">
                <button type="button" onClick={stopVideoRecording}>Stop Recording</button>
              </div>
            ) : (
              <div className="button-group">
                <button type="button" onClick={startVideoRecording}>Start Recording</button>
                <label htmlFor="video-upload">Or upload a video file</label>
                <input id="video-upload" type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoUpload} />
              </div>
            )}

            {videoPrev && <video src={videoPrev} controls></video>}

            <div className="button-group">
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
              <button type="button" onClick={() => setStep(step + 1)} disabled={!videoPrev && !form.videoIntro}>Next</button>
            </div>
          </div>
        )}

        {/* Step 4: Audio Bio */}
        {step === 4 && (
          <div className="step-content slide-in">
            <h1 ref={stepHeadingRef} tabIndex={-1}>Record an Audio Bio</h1>
            <p className="step-description">Introduce yourself in your own voice!</p>

            {mediaError && (
              <p className="form-error" role="alert">
                {mediaError}
              </p>
            )}

            {/* Announced recording status for screen-reader users (M4). */}
            <p className="sr-only" role="status">
              {audioAnnouncement}
            </p>

            {isRecordingAudio ? (
              <div className="button-group">
                <button type="button" onClick={stopAudioRecording}>Stop Recording</button>
              </div>
            ) : (
              <div className="button-group">
                <button type="button" onClick={startAudioRecording}>Start Recording</button>
                <label htmlFor="audio-upload">Or upload an audio file</label>
                <input id="audio-upload" type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioUpload} />
              </div>
            )}

            {audioPreview && <audio src={audioPreview} controls></audio>}

            <div className="button-group">
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
              <button type="button" onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="step-content slide-in">
            <h1 ref={stepHeadingRef} tabIndex={-1}>Review Your Profile</h1>
            <p className="step-description">Time to submit your profile!</p>

            <div className="profile-summary">
              <h3>{form.name}</h3>
              {storeState.idVerified && (
                <p>
                  <VerifiedBadge />
                </p>
              )}
              <p>Age: {form.age}</p>
              <p>Bio: {form.bio}</p>
              <p>Photos: {form.photos.length} uploaded</p>
              <p>Video Intro: {form.videoIntro ? 'Recorded' : 'Not recorded'}</p>
              <p>Audio Bio: {form.audioBio ? 'Recorded' : 'Not recorded'}</p>
            </div>

            <div className="button-group">
              <button type="button" onClick={handleSubmit}>{isEditMode ? 'Save profile' : 'Submit profile'}</button>
              <button type="button" onClick={() => setStep(step - 1)}>Back</button>
            </div>

            {saveMessage && (
              <p className="form-success" role="status">
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
