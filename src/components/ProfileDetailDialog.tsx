import { useEffect, useRef } from 'react';
import { Avatar } from './Avatar';
import { DemoNote } from './DemoNote';
import type { CompatibilityResult } from '../lib/compatibility';
import type { SampleProfile } from '../lib/types';
import './ProfileModals.css';

interface ProfileDetailDialogProps {
  profile: SampleProfile;
  compatibility: CompatibilityResult;
  onClose: () => void;
}

/** Accessible profile-detail modal: full bio, badges, and the sample
 *  compatibility breakdown. Esc closes; focus is moved in and restored. */
export function ProfileDetailDialog({
  profile,
  compatibility,
  onClose,
}: ProfileDetailDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-title-${profile.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-profile-head">
          <Avatar name={profile.name} gradient={profile.gradient} photo={profile.photo} size={72} />
          <div>
            <h2 id={`detail-title-${profile.id}`} className="modal-title">
              {profile.name}, {profile.age}
            </h2>
            <p className="modal-meta">
              {profile.location} · {profile.distanceMi} mi away
            </p>
          </div>
        </div>

        <p className="modal-bio">{profile.bio}</p>

        <h3 className="modal-section-title">Interests</h3>
        <ul className="badge-list modal-badges">
          {profile.interests.map((interest) => (
            <li key={interest} className="badge">
              {interest}
            </li>
          ))}
        </ul>

        <h3 className="modal-section-title">Communication</h3>
        <ul className="badge-list modal-badges">
          {profile.communication.map((mode) => (
            <li key={mode} className="badge badge-muted">
              {mode}
            </li>
          ))}
        </ul>

        {profile.access.length > 0 && (
          <>
            <h3 className="modal-section-title">Access needs</h3>
            <ul className="badge-list modal-badges">
              {profile.access.map((need) => (
                <li key={need} className="badge badge-muted">
                  {need}
                </li>
              ))}
            </ul>
          </>
        )}

        <h3 className="modal-section-title">Sample compatibility</h3>
        <p className="compat-detail-score">{compatibility.score}% compatible</p>
        <ul className="compat-reason-list">
          {compatibility.reasons.map((reason) => (
            <li key={reason} className="compat-reason-item">
              <span aria-hidden="true" className="compat-check">
                ✓
              </span>
              {reason}
            </li>
          ))}
        </ul>
        <DemoNote text="Demo preview — this score is a simple estimate from your matching preferences and sample profile data, not a real compatibility prediction." />

        <div className="modal-actions">
          <button ref={closeRef} type="button" className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
