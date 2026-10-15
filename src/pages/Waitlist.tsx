import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './Waitlist.css';

// The Formspree form ID for "Attune Beta Waitlist". This ID is public — it
// ships in the page HTML — and only routes submissions to the waitlist inbox.
// It is filled in at deploy time; while it still holds the placeholder, the
// page shows an honest "opening shortly" notice instead of a dead form.
const FORMSPREE_FORM_ID = 'xrperkvd';
const WAITLIST_CONFIGURED = !FORMSPREE_FORM_ID.startsWith('__');

type Status = 'idle' | 'submitting' | 'success' | 'error';

function Waitlist() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get('firstName') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      community: String(data.get('community') ?? ''),
      accessibilityNotes: String(data.get('accessibilityNotes') ?? '').trim(),
      _subject: 'Attune Beta Waitlist signup',
    };

    setStatus('submitting');
    setErrorMessage('');
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus('success');
        // Move focus to the confirmation so screen-reader users land on it.
        requestAnimationFrame(() => successHeadingRef.current?.focus());
      } else {
        const body = await response.json().catch(() => null);
        const detail =
          body?.errors?.map((e: { message?: string }) => e.message).filter(Boolean).join(' ') ?? '';
        setErrorMessage(
          detail ||
            'Something went wrong sending your signup. Please check your connection and try again.',
        );
        setStatus('error');
      }
    } catch {
      setErrorMessage(
        'Something went wrong sending your signup. Please check your connection and try again.',
      );
      setStatus('error');
    }
  }

  return (
    <div className="waitlist-page">
      <div className="waitlist-container">
        <h1 className="waitlist-title">
          Join the Attune <span className="gradient-text">beta waitlist</span>
        </h1>
        <p className="waitlist-intro">
          Attune is a dating app built from day one — not retrofitted — with and for
          Deaf, DeafBlind, hard-of-hearing, blind, and low-vision communities. Our beta
          testers will be the first to try it, and your feedback will shape what ships.
        </p>

        {status === 'success' ? (
          <div className="waitlist-card waitlist-success" role="status">
            <h2 tabIndex={-1} ref={successHeadingRef} className="waitlist-success-title">
              You&apos;re on the list 🎉
            </h2>
            <p>
              Thank you for joining. When your beta spot opens, we&apos;ll email you an
              invitation at the address you gave us. Until then, welcome to the
              community — we&apos;re glad you&apos;re here.
            </p>
          </div>
        ) : WAITLIST_CONFIGURED ? (
          <form className="waitlist-card waitlist-form" onSubmit={handleSubmit} noValidate={false}>
            {status === 'error' && (
              <div className="waitlist-error" role="alert">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="waitlist-field">
              <label htmlFor="waitlist-first-name">
                First name <span aria-hidden="true">*</span>
                <span className="waitlist-required-note"> (required)</span>
              </label>
              <input
                id="waitlist-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                aria-required="true"
              />
            </div>

            <div className="waitlist-field">
              <label htmlFor="waitlist-email">
                Email address <span aria-hidden="true">*</span>
                <span className="waitlist-required-note"> (required)</span>
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-describedby="waitlist-email-hint"
              />
              <p id="waitlist-email-hint" className="waitlist-hint">
                This is where your beta invitation will be sent.
              </p>
            </div>

            <div className="waitlist-field">
              <label htmlFor="waitlist-community">
                Which community are you part of? <span aria-hidden="true">*</span>
                <span className="waitlist-required-note"> (required)</span>
              </label>
              <select
                id="waitlist-community"
                name="community"
                required
                aria-required="true"
                defaultValue=""
              >
                <option value="" disabled>
                  Choose one
                </option>
                <option value="Deaf">Deaf</option>
                <option value="DeafBlind">DeafBlind</option>
                <option value="Hard of hearing">Hard of hearing</option>
                <option value="Blind">Blind</option>
                <option value="Low vision">Low vision</option>
                <option value="Ally / supporter">Ally / supporter</option>
                <option value="Other">Other</option>
              </select>
              <p className="waitlist-hint">
                This helps us invite a balanced mix of testers and prioritize the
                accessibility features each group needs first.
              </p>
            </div>

            <div className="waitlist-field">
              <label htmlFor="waitlist-notes">
                Anything we should know to make your beta experience accessible?
                <span className="waitlist-required-note"> (optional)</span>
              </label>
              <textarea id="waitlist-notes" name="accessibilityNotes" rows={4} />
            </div>

            <button
              type="submit"
              className="cta-primary waitlist-submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Joining…' : 'Join the Waitlist'}
            </button>

            <p className="waitlist-privacy">
              We&apos;ll only ever email you about the Attune beta — no spam, and we
              never sell or share your address.
            </p>
          </form>
        ) : (
          <div className="waitlist-card" role="note">
            <p>
              The waitlist is opening in just a moment. Please check back shortly —
              we can&apos;t wait to meet you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Waitlist;
