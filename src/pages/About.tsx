import './About.css';

function About() {
  return (
    <div className="about-page">
      <header className="page-header">
        <h2>About Attune</h2>
        <p className="page-subtitle">
          Accessibility-first, not accessibility-retrofitted.
        </p>
      </header>

      <section className="about-content">
        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            Attune exists to create authentic connections for people who've been underserved 
            by mainstream dating apps. We're building a platform where accessibility isn't 
            a checkbox or an afterthought—it's the foundation.
          </p>
          <p>
            Dating apps have historically treated accessibility as a retrofit: features added 
            after the core product is built, often incomplete and frustrating to use. We're 
            taking a different approach. Every feature, every interaction, every line of code 
            is built with our community's needs at the center.
          </p>
        </div>

        <div className="about-section">
          <h3>Who We Serve</h3>
          <p>
            Attune is designed for Deaf and Hard-of-Hearing individuals, as well as Blind and 
            Low-Vision users. We're starting with these communities because they have the most 
            specific accessibility needs that existing dating apps consistently fail to meet.
          </p>
          <p>
            But our vision extends beyond. We're building an extensible platform that can 
            eventually serve anyone who benefits from thoughtful, accessibility-first design.
          </p>
        </div>

        <div className="about-section">
          <h3>What Makes Us Different</h3>
          <div className="differentiator-grid">
            <div className="differentiator">
              <h4>Screen-Reader Native</h4>
              <p>
                Built with VoiceOver and TalkBack from day one. Every component has proper 
                ARIA labels, semantic HTML, and keyboard navigation before it ships.
              </p>
            </div>
            <div className="differentiator">
              <h4>Captioned Video First</h4>
              <p>
                Real-time captions on video profiles and calls using Deepgram and AssemblyAI. 
                Not an optional add-on—it's core infrastructure.
              </p>
            </div>
            <div className="differentiator">
              <h4>Sign Language Inclusive</h4>
              <p>
                ASL, BSL, and other sign languages are welcome and supported. High frame-rate 
                video, VRI partnerships, and eventually sign recognition research.
              </p>
            </div>
            <div className="differentiator">
              <h4>Safety First</h4>
              <p>
                ID verification, robust reporting, and dedicated moderation from day one. 
                Our community faces elevated harassment risks—we take that seriously.
              </p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>Our Principles</h3>
          <ul className="principles-list">
            <li>
              <strong>Accessibility is the default aesthetic.</strong> High contrast, clear 
              typography, and proper focus indicators aren't optional—they're the foundation 
              of our design system.
            </li>
            <li>
              <strong>Community-driven development.</strong> We're working with Deaf and blind 
              advisors to validate features, test usability, and ensure cultural sensitivity 
              (especially around sign language).
            </li>
            <li>
              <strong>Don't build what already exists.</strong> Partner with existing services 
              (interpreting, speech-to-text, ID verification) rather than reinventing the wheel.
            </li>
            <li>
              <strong>Real differentiation.</strong> We're not competing with Dateability, 
              Special Bridge, or Dottie by doing the same thing slightly better. We're solving 
              problems they haven't addressed.
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h3>Competitors & Positioning</h3>
          <p>
            Existing disability-focused dating apps (Dateability, Special Bridge, Dating4Disabled, 
            Udolly, Dottie) serve broad audiences but don't go deep on specific accessibility needs:
          </p>
          <ul className="competitor-list">
            <li>
              <strong>No screen-reader-native UI</strong> — most are barely usable with VoiceOver/TalkBack
            </li>
            <li>
              <strong>No captioned video infrastructure</strong> — video profiles exist but aren't accessible
            </li>
            <li>
              <strong>No sign language support</strong> — ASL/BSL users are an afterthought
            </li>
            <li>
              <strong>Generic safety features</strong> — don't account for elevated harassment risk
            </li>
          </ul>
          <p>
            Attune fills this gap. We're the first dating app built <em>for</em> these communities, 
            not adapted to them.
          </p>
        </div>

        <div className="about-section cta">
          <h3>Want to Learn More?</h3>
          <p>
            We're in active development and would love to hear from potential users, advisors, 
            and partners. Reach out to help shape the future of accessible dating.
          </p>
          <button className="cta-primary">Get in Touch</button>
        </div>
      </section>
    </div>
  );
}

export default About;
