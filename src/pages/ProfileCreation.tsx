import { useState, useRef } from 'react';
import '../App.css';

interface ProfileData {
  name: string;
  age: string;
  bio: string;
  photos: File[];
  videoIntro: File | null;
  audioBio: File | null;
}

export default function ProfileCreation() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    age: '',
    bio: '',
    photos: [],
    videoIntro: null,
    audioBio: null,
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPrev, setVideoPrev] = useState<string>('');
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

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

    const newPhotos = Array.from(files).slice(0, 6 - profile.photos.length);
    const newPreviews = newPhotos.map(file => URL.createObjectURL(file));

    setProfile(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setProfile(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Video Recording
  const startVideoRecording = async () => {
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
        
        setProfile(prev => ({ ...prev, videoIntro: file }));
        setVideoPrev(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, videoIntro: file }));
      setVideoPrev(URL.createObjectURL(file));
    }
  };

  // Audio Recording
  const startAudioRecording = async () => {
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
        
        setProfile(prev => ({ ...prev, audioBio: file }));
        setAudioPreview(url);
        
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, audioBio: file }));
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log('Profile Data:', profile);
    alert('Profile created successfully! (This would upload to your backend in production)');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return profile.name && profile.age && parseInt(profile.age) >= 18;
      case 2:
        return profile.photos.length >= 1;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return profile.bio.length >= 20;
      default:
        return false;
    }
  };

  return (
    <div className="profile-creation">
      <div className="profile-creation-container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <p className="step-counter" aria-live="polite">Step {step} of 5</p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="step-content slide-in">
            <h1>Let's start with the basics</h1>
            <p className="step-description">Tell us a bit about yourself</p>

            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Age <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="age"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
              />
            </div> 

            <div className="form-group">
              <label htmlFor="bio">
                Bio <span className="required">*</span>
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            <div className="button-group">
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}>Next</button>
            </div>
          </div>
        )}

        {/* Step 2: Photos Upload */}
        {step === 2 && (
          <div className="step-content slide-in">
            <h1>Upload Photos</h1>
            <p className="step-description">Share some photos of yourself!</p>

            <input
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
                  <button onClick={() => removePhoto(index)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button onClick={() => setStep(step - 1)}>Back</button>
              <button onClick={() => setStep(step + 1)} disabled={profile.photos.length === 0}>Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Video Intro */}
        {step === 3 && (
          <div className="step-content slide-in">
            <h1>Record a Video Introduction</h1>
            <p className="step-description">Show us your personality!</p>

            <video ref={videoRef} autoPlay muted></video>

            {isRecordingVideo ? (
              <div className="button-group">
                <button onClick={stopVideoRecording}>Stop Recording</button>
              </div>
            ) : (
              <div className="button-group">
                <button onClick={startVideoRecording}>Start Recording</button>
                <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoUpload} />
              </div>
            )}

            {videoPrev && <video src={videoPrev} controls></video>}

            <div className="button-group">
              <button onClick={() => setStep(step - 1)}>Back</button>
              <button onClick={() => setStep(step + 1)} disabled={!videoPrev && !profile.videoIntro}>Next</button>
            </div>
          </div>
        )}

        {/* Step 4: Audio Bio */}
        {step === 4 && (
          <div className="step-content slide-in">
            <h1>Record an Audio Bio</h1>
            <p className="step-description">Introduce yourself in your own voice!</p>

            {isRecordingAudio ? (
              <div className="button-group">
                <button onClick={stopAudioRecording}>Stop Recording</button>
              </div>
            ) : (
              <div className="button-group">
                <button onClick={startAudioRecording}>Start Recording</button>
                <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioUpload} />
              </div>
            )}

            {audioPreview && <audio src={audioPreview} controls></audio>}

            <div className="button-group">
              <button onClick={() => setStep(step - 1)}>Back</button>
              <button onClick={() => setStep(step + 1)}>Next</button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="step-content slide-in">
            <h1>Review Your Profile</h1>
            <p className="step-description">Time to submit your profile!</p>

            <div className="profile-summary">
              <h3>{profile.name}</h3>
              <p>Age: {profile.age}</p>
              <p>Bio: {profile.bio}</p>
              <p>Photos: {profile.photos.length} uploaded</p>
              <p>Video Intro: {profile.videoIntro ? 'Recorded' : 'Not recorded'}</p>
              <p>Audio Bio: {profile.audioBio ? 'Recorded' : 'Not recorded'}</p>
            </div>

            <div className="button-group">
              <button onClick={handleSubmit}>Submit Profile</button>
              <button onClick={() => setStep(step - 1)}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}