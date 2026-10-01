import { DemoNote } from '../components/DemoNote';
import './Safety.css';

export function Safety() {
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
        <p>
          ID verification isn&apos;t available in this prototype yet. Every profile you see here is
          fictional sample data, so there&apos;s nothing to verify — but treat real-world profiles
          with care: video-chat before meeting, and never send money.
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
    </div>
  );
}
