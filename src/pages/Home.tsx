import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h2 className="hero-title">
          Dating built for <span className="gradient-text">how you actually connect</span>
        </h2>
        <p className="hero-subtitle">
          An accessibility-first dating platform designed with and for Deaf/Hard-of-Hearing 
          and Blind/Low-Vision communities. Not retrofitted. Built right from day one.
        </p>
        <div className="cta-buttons">
          <button className="cta-primary">Join the Waitlist</button>
          <Link to="/features">
            <button className="cta-secondary">Explore Features</button>
          </Link>
        </div>
      </section>
      <section className="features-preview">
        <article className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3>Accessibility First</h3>
          <p>
            Built from the ground up with screen readers, high contrast, 
            and keyboard navigation in mind—not retrofitted.
          </p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Multi-Modal Communication</h3>
          <p>
            Express yourself through video, audio, text, and sign language. 
            Connect the way that works for you.
          </p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Authentic Connections</h3>
          <p>
            Match with people who understand your communication style 
            and share your values.
          </p>
        </article>
      </section>
      <section className="value-prop">
        <h2>Why Attune?</h2>
        <div className="value-grid">
          <div className="value-item">
            <h3>Screen-reader native UI</h3>
            <p>Every component built with VoiceOver and TalkBack from day one</p>
          </div>
          <div className="value-item">
            <h3>Captioned video profiles</h3>
            <p>Real-time captions powered by Deepgram and AssemblyAI</p>
          </div>
          <div className="value-item">
            <h3>Sign language support</h3>
            <p>ASL, BSL, and other sign languages welcomed and supported</p>
          </div>
          <div className="value-item">
            <h3>Safety-first approach</h3>
            <p>ID verification, robust reporting, and moderation built-in</p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <h2>Ready to connect authentically?</h2>
        <p>Join our community and help shape the future of accessible dating.</p>
        <button className="cta-primary">Get Early Access</button>
      </section>
    </div>
  );
}

export default Home;
