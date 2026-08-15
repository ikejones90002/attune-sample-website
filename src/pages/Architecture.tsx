import './Architecture.css';

function Architecture() {
  return (
    <div className="architecture-page">
      <header className="page-header">
        <h2>Technical Architecture</h2>
        <p className="page-subtitle">
          Built for scale, accessibility, and speed to market. Pre-revenue tech stack optimized 
          for a media-heavy, real-time dating platform.
        </p>
      </header>

      <section className="architecture-content">
        <div className="architecture-principle">
          <h3>Non-Negotiable Principle</h3>
          <p className="principle-statement">
            Screen-reader-native UI (VoiceOver/TalkBack) is built into the base component library 
            from day one — not retrofitted. Every custom button/card/input gets proper labels 
            before it ships.
          </p>
        </div>

        <div className="stack-grid">
          <div className="stack-item">
            <div className="stack-label">Frontend</div>
            <h4>React Native / Expo</h4>
            <p className="stack-why">
              Cross-platform mobile development. Matches existing team stack experience. 
              Excellent accessibility APIs for VoiceOver and TalkBack.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Backend</div>
            <h4>Node/Express or Supabase</h4>
            <p className="stack-why">
              Fast to stand up pre-revenue. Supabase gives auth + database + storage out of 
              the box. Node/Express offers more control if needed.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Database</div>
            <h4>Postgres</h4>
            <p className="stack-why">
              Relational model fits matching/preference logic well. Robust querying, indexing, 
              and performance at scale. Industry standard.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Media Storage</div>
            <h4>Cloudflare R2</h4>
            <p className="stack-why">
              S3-compatible but significantly cheaper. Critical for a video/photo/audio heavy 
              app. No egress fees.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Video Calling</div>
            <h4>Twilio Video / Agora / Daily.co</h4>
            <p className="stack-why">
              Don't build WebRTC in-house. All three support captioning hooks, high frame rates 
              for sign language, and have proven reliability.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Speech-to-Text</div>
            <h4>Deepgram or AssemblyAI</h4>
            <p className="stack-why">
              Real-time accuracy for live video captioning. Whisper (OpenAI) as fallback. 
              Critical for Deaf/HoH accessibility.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">Push Notifications</div>
            <h4>Firebase Cloud Messaging</h4>
            <p className="stack-why">
              Industry standard. Reliable, cross-platform, well-documented. Integrates 
              seamlessly with React Native.
            </p>
          </div>

          <div className="stack-item">
            <div className="stack-label">ID Verification</div>
            <h4>Persona or Veriff</h4>
            <p className="stack-why">
              Critical given elevated harassment risk in this demographic. Don't build 
              identity verification in-house — use proven vendors.
            </p>
          </div>
        </div>

        <div className="architecture-diagram">
          <h3>System Overview</h3>
          <div className="diagram-container">
            <div className="diagram-section">
              <h4>Client Layer</h4>
              <div className="diagram-box client">
                <p><strong>React Native / Expo</strong></p>
                <ul>
                  <li>iOS & Android apps</li>
                  <li>Screen reader native UI</li>
                  <li>High-contrast theming</li>
                  <li>Camera/mic access</li>
                </ul>
              </div>
            </div>

            <div className="diagram-arrow">↓</div>

            <div className="diagram-section">
              <h4>API Layer</h4>
              <div className="diagram-box api">
                <p><strong>Node/Express or Supabase</strong></p>
                <ul>
                  <li>RESTful API / GraphQL</li>
                  <li>Authentication (JWT)</li>
                  <li>Real-time subscriptions</li>
                  <li>Matching algorithms</li>
                </ul>
              </div>
            </div>

            <div className="diagram-arrow">↓</div>

            <div className="diagram-section">
              <h4>Data & Services</h4>
              <div className="services-grid">
                <div className="diagram-box service">
                  <p><strong>Postgres</strong></p>
                  <p className="service-detail">User data, matches, messages</p>
                </div>
                <div className="diagram-box service">
                  <p><strong>Cloudflare R2</strong></p>
                  <p className="service-detail">Media storage (video/photo/audio)</p>
                </div>
                <div className="diagram-box service">
                  <p><strong>Deepgram / AssemblyAI</strong></p>
                  <p className="service-detail">Real-time captioning</p>
                </div>
                <div className="diagram-box service">
                  <p><strong>Twilio / Agora / Daily</strong></p>
                  <p className="service-detail">Video calling infrastructure</p>
                </div>
                <div className="diagram-box service">
                  <p><strong>Persona / Veriff</strong></p>
                  <p className="service-detail">Identity verification</p>
                </div>
                <div className="diagram-box service">
                  <p><strong>Firebase</strong></p>
                  <p className="service-detail">Push notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="architecture-notes">
          <h3>Architecture Notes</h3>
          <ul className="notes-list">
            <li>
              <strong>Why not web-first?</strong> Dating apps require native camera/video APIs, 
              push notifications, and deep OS integration. React Native provides better UX 
              for these features than PWAs.
            </li>
            <li>
              <strong>Supabase vs. custom backend?</strong> Supabase accelerates MVP development 
              with built-in auth, real-time subscriptions, and storage. Custom Node/Express 
              gives more control but takes longer.
            </li>
            <li>
              <strong>Why Cloudflare R2 over S3?</strong> Zero egress fees make R2 dramatically 
              cheaper for media-heavy apps. S3-compatible API means easy migration if needed.
            </li>
            <li>
              <strong>Video vendor selection?</strong> All three (Twilio, Agora, Daily) support 
              the features we need. Final choice depends on pricing negotiations and caption 
              integration ease.
            </li>
            <li>
              <strong>Captioning strategy?</strong> Deepgram and AssemblyAI both offer real-time 
              speech-to-text with high accuracy. Whisper (OpenAI) is a strong fallback but 
              optimized for batch processing, not streaming.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Architecture;
