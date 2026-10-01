import { useState } from 'react';
import { DemoNote } from '../components/DemoNote';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { VerificationDialog } from '../components/VerificationDialog';
import { useAttune } from '../lib/api/AttuneApiProvider';
import './Safety.css';

export function Safety() {
  const [state, api] = useAttune();
  const [verificationOpen, setVerificationOpen] = useState(false);

  return (
    <div className="safety-page">
      <header className="page-header">
        <h1 className="page-title">Safety at Attune</h1>
        <p className="page-subtitle">
          Dating safely — especially when access needs are part of the picture.
        </p>
      </header>

      <section className="card safety-card" aria-labelledby="safety-basics">
        <h2 className="section-heading" id="safety-basics">Dating safety basics</h2>
        <ul className="safety-list">
          <li>Meet in a public place, and share your live location with a trusted contact.</li>
          <li>Tell a friend your plans — who you&apos;re meeting, where, and when you expect to be back.</li>
          <li>Keep personal info private early: no home address, financial details, or daily routine.</li>
          <li>Trust your instincts — pausing, slowing down, or leaving at any point is always okay.</li>
          <li>Arrange your own transport so you can leave on your own terms.</li>
          <li>Keep communication in-app until you&apos;re comfortable — text check-ins work if calls don&apos;t.</li>
        </ul>
      </section>

      <section className="card safety-card" aria-labelledby="safety-blocking">
        <h2 className="section-heading" id="safety-blocking">Blocking and reporting in this prototype</h2>
        <p>
          Blocking and reporting are simulated here: your block list and reports are stored only in
          this browser (localStorage) in the prototype. In a production app these would be enforced
          server-side and reviewed by a safety team.
        </p>
      </section>

      <section className="card safety-card" aria-labelledby="safety-verification">
        <h2 className="section-heading" id="safety-verification">Verification</h2>
        {state.idVerified ? (
          <>
            <p className="safety-verified-row">
              <VerifiedBadge />
            </p>
            <p>
              Your demo verification is complete. This badge is simulated — no document was
              checked — and your verified status is stored only in this browser. In production,
              verification would be confirmed by a provider such as Persona or Veriff before a
              badge like this appears.
            </p>
            <p className="safety-verified-action">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  void api.setIdVerified(false);
                }}
              >
                Remove demo verification
              </button>
            </p>
          </>
        ) : (
          <>
            <p>
              Every profile you see in this prototype is fictional sample data, so there&apos;s no
              real identity behind them to verify. In a production app, ID verification confirms a
              real person is behind a profile — one of the strongest trust signals there is.
            </p>
            <p>
              Try the simulated flow to see how it would feel. It&apos;s a demo: no document is
              uploaded or checked, and nothing leaves your browser.
            </p>
            <p className="safety-verified-action">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setVerificationOpen(true)}
              >
                Start ID verification (demo)
              </button>
            </p>
          </>
        )}
        <p className="safety-caution">
          Verified or not, real-world caution still applies: video-chat before meeting in person,
          and never send money to someone you haven&apos;t met.
        </p>
      </section>

      <section className="card safety-card" aria-labelledby="safety-help">
        <h2 className="section-heading" id="safety-help">If you need help now</h2>
        <div className="help-box">
          <p><strong>988 Suicide and Crisis Lifeline:</strong> call or text <strong>988</strong> (US).</p>
          <p><strong>Crisis Text Line:</strong> text <strong>HOME</strong> to <strong>741741</strong>.</p>
          <p>
            <strong>Emergency:</strong> call <strong>911</strong>. Text-to-911 availability varies by
            area — call if you can.
          </p>
        </div>
      </section>

      <DemoNote text="Demo preview — safety features in this prototype are simulated locally; nothing leaves your browser." />

      {verificationOpen && (
        <VerificationDialog
          selfName={state.profile?.name ?? ''}
          onClose={() => setVerificationOpen(false)}
          onComplete={() => {
            void api.setIdVerified(true);
          }}
        />
      )}
    </div>
  );
}
