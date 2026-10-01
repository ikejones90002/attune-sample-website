import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { DemoNote } from './DemoNote';
import './ProfileModals.css';

const PROFILE_REPORT_REASONS = [
  'Spam or misleading',
  'Harassment or hate',
  'Inappropriate content',
  'Other',
];

interface ProfileReportDialogProps {
  profileId: string;
  profileName: string;
  onReport: (id: string) => void;
  onClose: () => void;
}

/** Accessible report modal for a Discover profile. Records the profile id
 *  and timestamp in the local store; nothing is sent anywhere. */
export function ProfileReportDialog({
  profileId,
  profileName,
  onReport,
  onClose,
}: ProfileReportDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [reason, setReason] = useState(PROFILE_REPORT_REASONS[0]);
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onReport(profileId);
    setSubmitted(true);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-report-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="profile-report-title" className="modal-title">
          Report profile
        </h2>
        <p className="modal-meta">Reporting {profileName}.</p>
        {submitted ? (
          <p className="modal-body">
            Thanks — your report was recorded. Demo reports are stored only in this
            browser and nothing is sent anywhere.
          </p>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="modal-label" htmlFor="profile-report-reason">
              Reason
            </label>
            <select
              id="profile-report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {PROFILE_REPORT_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary">
              Submit report
            </button>
          </form>
        )}
        <DemoNote text="Demo preview — reports are stored only in this browser in the prototype." />
        <div className="modal-actions">
          <button ref={closeRef} type="button" className="btn-text" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
