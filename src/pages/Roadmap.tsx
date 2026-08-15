import './Roadmap.css';

function Roadmap() {
  return (
    <div className="roadmap-page">
      <header className="page-header">
        <h2>Product Roadmap</h2>
        <p className="page-subtitle">
          From MVP to industry-leading innovation. Here's how we're building Attune.
        </p>
      </header>

      <section className="roadmap-content">
        <div className="phase-section phase-1">
          <div className="phase-header">
            <span className="phase-badge mvp">Phase 1</span>
            <h3>MVP — Launch</h3>
            <p className="phase-goal">
              Prove people will use an accessibility-first dating app. Ship something genuinely 
              better than competitors on accessibility depth alone.
            </p>
          </div>
          
          <ul className="roadmap-list">
            <li>Onboarding with accessibility-needs selection (deaf/HoH, blind/low-vision, other — extensible)</li>
            <li>Screen-reader-native UI across the entire app</li>
            <li>Profile creation: photo + short video intro + audio bio + text bio</li>
            <li>Basic swipe/browse matching</li>
            <li>Text chat with voice-to-text and text-to-voice toggle</li>
            <li>Video chat with live captions (Deepgram/AssemblyAI + video vendor)</li>
            <li>Reporting / blocking tools</li>
            <li>ID verification</li>
            <li>High-contrast, large-text theming (adjustable, on by default)</li>
          </ul>
        </div>

        <div className="phase-section phase-2">
          <div className="phase-header">
            <span className="phase-badge moderate">Phase 2</span>
            <h3>Moderate — Enhanced Matching</h3>
            <p className="phase-goal">
              Deepen matching quality and community features based on user feedback.
            </p>
          </div>
          
          <ul className="roadmap-list">
            <li>Compatibility filters by communication mode (ASL fluency, lip-reading comfort, screen-reader use, etc.)</li>
            <li>Auto-generated alt-text for photos (existing vision APIs)</li>
            <li>"Communication style" badges shown pre-match so expectations are clear upfront</li>
            <li>Community/events features (interest groups, virtual meetups — several competitors succeed partly on community, not just 1:1 matching)</li>
          </ul>
        </div>

        <div className="phase-section phase-3">
          <div className="phase-header">
            <span className="phase-badge harder">Phase 3</span>
            <h3>Harder — Advanced Features</h3>
            <p className="phase-goal">
              Professional-grade accessibility features through strategic partnerships.
            </p>
          </div>
          
          <ul className="roadmap-list">
            <li>On-demand human VRI (video relay interpreting) integration for calls — partner with an existing interpreting service rather than build one</li>
            <li>Fingerspelling/isolated-sign recognition for simple in-app phrases — clearly labeled as limited, not full translation</li>
            <li>Advanced captioning: speaker ID, non-speech sound labels (useful context for deaf users on calls)</li>
          </ul>
        </div>

        <div className="phase-section phase-4">
          <div className="phase-header">
            <span className="phase-badge research">Phase 4</span>
            <h3>Stretch / R&D Bet</h3>
            <p className="phase-goal">
              Long-term research investment, not a committed roadmap item.
            </p>
          </div>
          
          <ul className="roadmap-list">
            <li>Continuous ASL-to-text/speech translation — unsolved at the "fluent conversation" level industry-wide. Treat as long-term research investment, not a committed roadmap item. Likely path: partner with or license from existing sign-recognition research groups rather than building from scratch.</li>
          </ul>
        </div>

        <div className="risks-section">
          <h3>Key Risks / Things to Validate Early</h3>
          <div className="risk-grid">
            <div className="risk-card">
              <h4>🏷️ Name & Icon</h4>
              <p>
                Test "Attune" and the hand/heart mark with actual Deaf and blind users/advisors 
                before finalizing. Anything referencing a real ASL sign (e.g. ILY handshape) 
                especially needs community sign-off.
              </p>
            </div>
            
            <div className="risk-card">
              <h4>🎥 VRI Feature Demand</h4>
              <p>
                Before investing in Phase 3 interpreter integration, confirm the Deaf community 
                actually wants this vs. just wanting clean, reliable captioned video.
              </p>
            </div>
            
            <div className="risk-card">
              <h4>🛡️ Safety Infrastructure</h4>
              <p>
                This demographic reports elevated rates of online harassment; verification, 
                reporting, and moderation need to be solid at MVP, not bolted on later.
              </p>
            </div>
            
            <div className="risk-card">
              <h4>🌍 Sign Language Diversity</h4>
              <p>
                Sign language isn't universal — ASL, BSL, etc. are different languages; let users 
                specify which they use rather than assuming one.
              </p>
            </div>
          </div>
        </div>

        <div className="open-decisions">
          <h3>Open Decisions</h3>
          <ul className="decision-list">
            <li>Finalize icon concept (two-hands heart vs. ILY-hand vs. abstract)</li>
            <li>Backend: self-hosted Node/Express vs. Supabase for speed-to-launch</li>
            <li>Monetization model (freemium/subscription/credits — to be scoped separately)</li>
            <li>Domain/name availability check for "Attune" (dating context)</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Roadmap;
