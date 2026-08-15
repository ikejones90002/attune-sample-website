import { useState } from 'react';
import './Features.css';

function Features() {
  const [activeCaptionDemo, setActiveCaptionDemo] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'normal' | 'high-contrast'>('normal');
  const [fontSize, setFontSize] = useState(100);

  const toggleCaptions = () => {
    setActiveCaptionDemo(!activeCaptionDemo);
  };

  return (
    <div className="features-page">
      <header className="page-header">
        <h2>Features Built for How You Actually Connect</h2>
        <p className="page-subtitle">
          Every feature designed with accessibility at its core, not as an afterthought.
        </p>
      </header>

      {/* Hero Feature - Screen Reader Native */}
      <section className="hero-feature">
        <div className="hero-feature-content">
          <div className="feature-badge mvp">Core Foundation</div>
          <h3>Screen-Reader Native from Day One</h3>
          <p>
            Unlike other dating apps that retrofit accessibility, Attune is built with VoiceOver 
            and TalkBack as primary design constraints. Every button, card, and input gets proper 
            ARIA labels and semantic HTML before it ships.
          </p>
          
          <div className="accessibility-demo">
            <div className="demo-card" role="region" aria-label="Profile card example">
              <div className="demo-header">
                <img
                  src="/attune-sample-website/image.png"
                  alt="Profile photo of Alex Chen, smiling outdoors"
                  className="demo-avatar"
                />
                <div className="demo-info">
                  <h4>Alex Chen</h4>
                  <p>28 · San Francisco · ASL fluent</p>
                </div>
              </div>
              <p className="demo-bio">
                "Love hiking, photography, and deep conversations. Looking for someone who 
                appreciates visual storytelling and sign language poetry."
              </p>
              <div className="demo-actions">
                <button 
                  className="demo-btn pass" 
                  aria-label="Pass on Alex's profile"
                >
                  Pass
                </button>
                <button 
                  className="demo-btn like" 
                  aria-label="Like Alex's profile. Alex is 28, lives in San Francisco, and is ASL fluent"
                >
                  Like
                </button>
              </div>
            </div>
            
            <div className="accessibility-checklist">
              <h4>✓ Accessibility Features:</h4>
              <ul>
                <li>Descriptive alt text on profile photo</li>
                <li>Proper heading hierarchy (h4 for name)</li>
                <li>ARIA labels with full context on buttons</li>
                <li>Semantic HTML structure</li>
                <li>Keyboard navigable (try Tab key)</li>
                <li>Focus indicators on all elements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Caption Demo */}
      <section className="interactive-feature">
        <div className="feature-content-split">
          <div className="feature-text">
            <div className="feature-badge mvp">MVP Feature</div>
            <h3>Live Captioned Video Chat</h3>
            <p>
              Crystal-clear video calls with real-time captions powered by Deepgram and AssemblyAI. 
              Sign language users get the high frame-rate video they need, while captions ensure 
              accessibility for everyone.
            </p>
            
            <div className="feature-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🎯</span>
                <div>
                  <strong>Real-time accuracy</strong>
                  <p>Speech-to-text with &lt;1 second latency</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">📹</span>
                <div>
                  <strong>High frame-rate video</strong>
                  <p>60fps for clear sign language visibility</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">⚙️</span>
                <div>
                  <strong>Customizable captions</strong>
                  <p>Adjust size, position, and background</p>
                </div>
              </div>
            </div>

            <button 
              className="demo-toggle-btn"
              onClick={toggleCaptions}
              aria-pressed={activeCaptionDemo}
            >
              {activeCaptionDemo ? 'Hide' : 'Show'} Live Caption Demo
            </button>
          </div>

          <div className="feature-visual">
            <div className="video-chat-mockup">
              <div className="video-frame">
                <div className="video-placeholder">
                  <span className="video-icon">📹</span>
                  <p>Video Call Window</p>
                </div>
                {activeCaptionDemo && (
                  <div className="live-captions" role="region" aria-live="polite" aria-label="Live captions">
                    <p className="caption-text typing-animation">
                      So I've been learning ASL for about two years now...
                    </p>
                  </div>
                )}
              </div>
              <div className="video-controls">
                <button aria-label="Mute microphone" className="control-btn">🎤</button>
                <button aria-label="Turn off camera" className="control-btn">📹</button>
                <button aria-label="Toggle captions" className="control-btn active">CC</button>
                <button aria-label="End call" className="control-btn danger">📞</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Customization Demo */}
      <section className="interactive-feature theme-demo-section">
        <div className="feature-content-split reverse">
          <div className="feature-visual">
            <div className={`theme-preview ${activeTheme}`}>
              <div className="theme-controls">
                <label htmlFor="theme-toggle">
                  <strong>Theme:</strong>
                </label>
                <div className="theme-buttons">
                  <button 
                    id="theme-toggle"
                    className={activeTheme === 'normal' ? 'active' : ''}
                    onClick={() => setActiveTheme('normal')}
                    aria-pressed={activeTheme === 'normal'}
                  >
                    Standard
                  </button>
                  <button 
                    className={activeTheme === 'high-contrast' ? 'active' : ''}
                    onClick={() => setActiveTheme('high-contrast')}
                    aria-pressed={activeTheme === 'high-contrast'}
                  >
                    High Contrast
                  </button>
                </div>
              </div>

              <div className="theme-controls">
                <label htmlFor="font-size-slider">
                  <strong>Font Size: {fontSize}%</strong>
                </label>
                <input 
                  id="font-size-slider"
                  type="range" 
                  min="100" 
                  max="200" 
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  aria-valuemin={100}
                  aria-valuemax={200}
                  aria-valuenow={fontSize}
                  aria-label="Adjust font size percentage"
                />
              </div>

              <div className="preview-content" style={{ fontSize: `${fontSize}%` }}>
                <h4>Preview</h4>
                <p className="preview-text">
                  This is how text will appear at your selected size and contrast level. 
                  Attune ensures readability for low-vision users with adjustable sizing up to 200%.
                </p>
                <button className="preview-button">Sample Button</button>
              </div>
            </div>
          </div>

          <div className="feature-text">
            <div className="feature-badge mvp">MVP Feature</div>
            <h3>High-Contrast Theming & Adjustable Text</h3>
            <p>
              Beautiful design that doesn't sacrifice accessibility. High-contrast mode meets 
              WCAG AAA standards by default, with adjustable text sizing and spacing for 
              low-vision users.
            </p>
            
            <ul className="feature-list">
              <li>WCAG AAA contrast ratios (7:1 minimum)</li>
              <li>Font sizes adjustable from 100% to 200%</li>
              <li>Increased spacing between interactive elements</li>
              <li>No reliance on color alone for information</li>
              <li>Dark mode optimized for reduced eye strain</li>
              <li>Customizable caption backgrounds</li>
            </ul>

            <div className="stat-callout">
              <p className="stat-number">7:1</p>
              <p className="stat-label">Minimum contrast ratio (WCAG AAA)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Modal Profiles */}
      <section className="feature-showcase">
        <div className="feature-badge mvp">MVP Feature</div>
        <h3>Multi-Modal Profiles</h3>
        <p className="feature-intro">
          Express yourself the way that feels natural. Create rich profiles with photos, video 
          intros, audio bios, and text—all fully accessible.
        </p>

        <div className="profile-modes-grid">
          <div className="mode-card">
            <div className="mode-icon">📸</div>
            <h4>Photo Profiles</h4>
            <p>Upload photos with auto-generated alt-text powered by vision AI</p>
            <span className="mode-tag">Accessible to all</span>
          </div>

          <div className="mode-card">
            <div className="mode-icon">🎥</div>
            <h4>Video Intros</h4>
            <p>30-60 second video introductions with live captions</p>
            <span className="mode-tag">ASL friendly</span>
          </div>

          <div className="mode-card">
            <div className="mode-icon">🎙️</div>
            <h4>Audio Bios</h4>
            <p>Voice recordings with automatic transcription</p>
            <span className="mode-tag">Screen-reader ready</span>
          </div>

          <div className="mode-card">
            <div className="mode-icon">✍️</div>
            <h4>Text Descriptions</h4>
            <p>Rich text bios with semantic formatting</p>
            <span className="mode-tag">Universal access</span>
          </div>
        </div>
      </section>

      {/* Communication Styles */}
      <section className="feature-showcase alt-bg">
        <div className="feature-badge phase-2">Phase 2</div>
        <h3>Communication Style Matching</h3>
        <p className="feature-intro">
          Filter and match based on communication preferences. Find people who share your 
          preferred methods—whether that's ASL fluency, lip-reading, or screen-reader use.
        </p>

        <div className="comm-styles-grid">
          <div className="comm-style-card">
            <h4>🤟 Sign Language</h4>
            <ul>
              <li>ASL fluency level</li>
              <li>BSL, LSF, and other languages</li>
              <li>Learning vs. native signer</li>
            </ul>
          </div>

          <div className="comm-style-card">
            <h4>👄 Lip Reading</h4>
            <ul>
              <li>Comfort level indicator</li>
              <li>Lighting preferences</li>
              <li>Speed adjustments</li>
            </ul>
          </div>

          <div className="comm-style-card">
            <h4>🔊 Audio Preferences</h4>
            <ul>
              <li>Voice chat comfort</li>
              <li>Preferred volume levels</li>
              <li>Background noise tolerance</li>
            </ul>
          </div>

          <div className="comm-style-card">
            <h4>📱 Assistive Tech</h4>
            <ul>
              <li>Screen reader usage</li>
              <li>Voice control</li>
              <li>Switch control</li>
            </ul>
          </div>
        </div>

        <div className="matching-example">
          <p className="example-label">Example Profile Badges:</p>
          <div className="badge-showcase">
            <span className="profile-badge">ASL Fluent</span>
            <span className="profile-badge">Screen Reader User</span>
            <span className="profile-badge">Lip Reading Comfortable</span>
            <span className="profile-badge">Captions Preferred</span>
          </div>
        </div>
      </section>

      {/* Safety & Verification */}
      <section className="feature-showcase">
        <div className="feature-badge mvp">MVP Feature</div>
        <h3>Safety-First Architecture</h3>
        <p className="feature-intro">
          Your safety is paramount. Robust ID verification, comprehensive reporting tools, and 
          effective blocking features protect our community from day one.
        </p>

        <div className="safety-grid">
          <div className="safety-feature">
            <div className="safety-icon">🆔</div>
            <h4>ID Verification</h4>
            <p>
              Identity verification via Persona or Veriff ensures real people with verified 
              profiles. Critical given elevated harassment risk in this demographic.
            </p>
          </div>

          <div className="safety-feature">
            <div className="safety-icon">🚫</div>
            <h4>One-Tap Blocking</h4>
            <p>
              Instantly block users with a single tap. Blocked users cannot see your profile, 
              message you, or appear in your matches.
            </p>
          </div>

          <div className="safety-feature">
            <div className="safety-icon">📢</div>
            <h4>Detailed Reporting</h4>
            <p>
              Report inappropriate behavior with context. Screenshots, message history, and 
              timestamped incidents help our trust & safety team act quickly.
            </p>
          </div>

          <div className="safety-feature">
            <div className="safety-icon">👥</div>
            <h4>Dedicated Moderation</h4>
            <p>
              Human moderators trained in disability awareness review reports and enforce 
              community guidelines with understanding and empathy.
            </p>
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="future-features">
        <h3>On the Horizon</h3>
        <p className="section-intro">
          Features we're actively developing or researching for future releases.
        </p>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-badge phase-2">Phase 2</div>
            <div className="timeline-content">
              <h4>Auto-Generated Alt Text</h4>
              <p>
                Leveraging existing vision APIs to automatically generate descriptive alt-text 
                for all photos, making visual content accessible to blind and low-vision users.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge phase-2">Phase 2</div>
            <div className="timeline-content">
              <h4>Community & Events</h4>
              <p>
                Join interest groups, attend virtual meetups, and participate in community events 
                designed for meaningful connections beyond 1:1 matching.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge phase-3">Phase 3</div>
            <div className="timeline-content">
              <h4>Video Relay Interpreting (VRI)</h4>
              <p>
                On-demand human interpreters available for video calls through partnership with 
                professional interpreting services.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge phase-3">Phase 3</div>
            <div className="timeline-content">
              <h4>Advanced Captioning</h4>
              <p>
                Speaker identification and non-speech sound labels (e.g., "[laughter]", "[door knock]") 
                for richer context during calls.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge research">Phase 4 R&D</div>
            <div className="timeline-content">
              <h4>Sign Language Recognition</h4>
              <p>
                Long-term research investment into continuous ASL-to-text/speech translation. 
                Partnership with research institutions to advance the field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="features-cta">
        <h3>Ready to Experience Accessible Dating?</h3>
        <p>
          Join our waitlist and be among the first to try Attune when we launch.
        </p>
        <button className="cta-primary">Join the Waitlist</button>
      </section>
    </div>
  );
}

export default Features;