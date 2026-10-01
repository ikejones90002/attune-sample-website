import { useCallback, useEffect, useRef, useState } from 'react';
import { DemoNote } from './DemoNote';
import { VerifiedBadge } from './VerifiedBadge';
import './ProfileModals.css';
import './VerificationDialog.css';

interface VerificationDialogProps {
  /** Signed-in user's display name, used for the selfie placeholder initials. */
  selfName: string;
  onClose: () => void;
  onComplete: () => void;
}

const STEP_TITLES = ['Why verify', 'Your document', 'Selfie check', "You're verified"];
const STEP_COUNT = STEP_TITLES.length;
const ID_TYPES = ["Driver's license", 'Passport', 'State ID card'];
const SIMULATED_MS = 1500;

type CapturePhase = 'idle' | 'working' | 'done';

/**
 * Simulated ID-verification wizard (roadmap step 9, mock only). No document
 * is uploaded or photographed, no camera is opened, and nothing is checked or
 * sent anywhere — completing the flow only flips a demo flag in the local
 * store so the verified badge can be previewed.
 */
export function VerificationDialog({ selfName, onClose, onComplete }: VerificationDialogProps) {
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [docPhase, setDocPhase] = useState<CapturePhase>('idle');
  const [selfiePhase, setSelfiePhase] = useState<CapturePhase>('idle');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearPending = useCallback((): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Focus capture on open, focus restore on close; Escape cancels at any step.
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        clearPending();
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearPending();
      restoreRef.current?.focus();
    };
  }, [onClose, clearPending]);

  // Move focus to the step heading whenever the step changes (including mount).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function handleClose(): void {
    clearPending();
    onClose();
  }

  function goToStep(next: number): void {
    clearPending();
    // Leaving a step mid-simulation resets that capture to "not started".
    if (docPhase === 'working') {
      setDocPhase('idle');
    }
    if (selfiePhase === 'working') {
      setSelfiePhase('idle');
    }
    setStep(next);
  }

  function runSimulated(setPhase: (phase: CapturePhase) => void): void {
    clearPending();
    setPhase('working');
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setPhase('done');
    }, SIMULATED_MS);
  }

  function handleDone(): void {
    onComplete();
    onClose();
  }

  const displayName = selfName.trim() === '' ? 'You' : selfName.trim();
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal verification-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="verification-title" className="modal-title">
          ID verification (demo)
        </h2>

        <p className="verification-progress-text" aria-hidden="true">
          Step {step} of {STEP_COUNT} — {STEP_TITLES[step - 1]}
        </p>
        <div
          className="verification-progress"
          role="progressbar"
          aria-label="Verification progress"
          aria-valuemin={1}
          aria-valuemax={STEP_COUNT}
          aria-valuenow={step}
          aria-valuetext={STEP_TITLES[step - 1]}
        >
          <div
            className="verification-progress-fill"
            style={{ width: `${(step / STEP_COUNT) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="verification-step-title">
              Why verify your ID
            </h3>
            <p className="modal-body">
              Verifying your ID helps other people trust that you&apos;re a real person and the
              person in your photos. It&apos;s one of the strongest safety signals on a dating app.
            </p>
            <p className="modal-body">
              Demo preview — this is a simulation. No document is uploaded, photographed, or
              checked, and nothing leaves your browser. In a production app this step would hand
              off to a verification provider such as Persona or Veriff.
            </p>
            <div className="verification-actions">
              <button type="button" className="btn-text" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={() => goToStep(2)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="verification-step-title">
              Your document (simulated)
            </h3>
            <fieldset className="verification-fieldset">
              <legend className="modal-label">Choose your ID type</legend>
              {ID_TYPES.map((option) => (
                <label key={option} className="verification-radio">
                  <input
                    type="radio"
                    name="verification-id-type"
                    value={option}
                    checked={idType === option}
                    onChange={(event) => setIdType(event.target.value)}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
            <div
              className={`verification-doc-frame${docPhase === 'working' ? ' verification-doc-frame--scanning' : ''}`}
              role="img"
              aria-label={`Document preview (simulated) — ${idType}`}
            >
              {docPhase === 'working' && <span className="verification-scan-bar" aria-hidden="true" />}
              <span className="verification-doc-label">Document preview (simulated)</span>
            </div>
            <p className="verification-status" role="status">
              {docPhase === 'idle' && 'No document captured yet (simulated).'}
              {docPhase === 'working' && 'Scanning… (simulated)'}
              {docPhase === 'done' && (
                <span className="verification-status-done">✓ Document captured (simulated)</span>
              )}
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => runSimulated(setDocPhase)}
              disabled={docPhase !== 'idle'}
            >
              Simulate document scan
            </button>
            <div className="verification-actions">
              <button type="button" className="btn-text" onClick={() => goToStep(1)}>
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => goToStep(3)}
                disabled={docPhase !== 'done'}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="verification-step-title">
              Selfie check (simulated)
            </h3>
            <div
              className="verification-selfie-frame"
              role="img"
              aria-label="Camera preview (simulated)"
            >
              <span className="verification-selfie-initials" aria-hidden="true">
                {initials}
              </span>
            </div>
            <p className="modal-body">
              Center your face in the oval — this demo never opens your camera.{' '}
              {displayName === 'You' ? 'Your' : `${displayName}'s`} live selfie would be compared
              with the document photo here (simulated).
            </p>
            <p className="verification-status" role="status">
              {selfiePhase === 'idle' && 'No selfie checked yet (simulated).'}
              {selfiePhase === 'working' && 'Checking liveness… (simulated)'}
              {selfiePhase === 'done' && (
                <span className="verification-status-done">✓ Selfie matched (simulated)</span>
              )}
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => runSimulated(setSelfiePhase)}
              disabled={selfiePhase !== 'idle'}
            >
              Simulate selfie check
            </button>
            <div className="verification-actions">
              <button type="button" className="btn-text" onClick={() => goToStep(2)}>
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => goToStep(4)}
                disabled={selfiePhase !== 'done'}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 ref={headingRef} tabIndex={-1} className="verification-step-title">
              You&apos;re verified — demo
            </h3>
            <p className="verification-badge-row">
              <VerifiedBadge />
            </p>
            <p className="modal-body">
              In this prototype your verified status is stored only in this browser. In production,
              verification would be confirmed by the provider before this badge appears.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={handleDone}>
                Done
              </button>
            </div>
          </div>
        )}

        <DemoNote text="Demo preview — ID verification here is simulated; nothing is uploaded, photographed, or checked." />
      </div>
    </div>
  );
}
