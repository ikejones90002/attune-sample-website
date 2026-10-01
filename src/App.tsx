import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { Logo } from './components/Logo';
import { ThemeToggle } from './components/ThemeToggle';
import { AttuneApiProvider } from './lib/api/AttuneApiProvider';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Roadmap from './pages/Roadmap';
import Architecture from './pages/Architecture';
import Onboarding from './pages/Onboarding';
import ProfileCreation from './pages/ProfileCreation';
import { Discover } from './pages/Discover';
import { Matches } from './pages/Matches';
import { Messages } from './pages/Messages';
import { Community } from './pages/Community';
import { Safety } from './pages/Safety';
import { Settings } from './pages/Settings';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} aria-current={isActive('/') ? 'page' : undefined} onClick={closeMobileMenu}>Home</Link>
        <Link to="/swipe" className={`nav-link ${isActive('/swipe') ? 'active' : ''}`} aria-current={isActive('/swipe') ? 'page' : undefined} onClick={closeMobileMenu}>Discover</Link>
        <Link to="/matches" className={`nav-link ${isActive('/matches') ? 'active' : ''}`} aria-current={isActive('/matches') ? 'page' : undefined} onClick={closeMobileMenu}>Matches</Link>
        <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`} aria-current={isActive('/messages') ? 'page' : undefined} onClick={closeMobileMenu}>Messages</Link>
        <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`} aria-current={isActive('/community') ? 'page' : undefined} onClick={closeMobileMenu}>Community</Link>
        <Link to="/safety" className={`nav-link ${isActive('/safety') ? 'active' : ''}`} aria-current={isActive('/safety') ? 'page' : undefined} onClick={closeMobileMenu}>Safety</Link>
        <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`} aria-current={isActive('/settings') ? 'page' : undefined} onClick={closeMobileMenu}>Settings</Link>
        <Link to="/onboarding" className={`nav-link ${isActive('/onboarding') ? 'active' : ''}`} aria-current={isActive('/onboarding') ? 'page' : undefined} onClick={closeMobileMenu}>Onboarding</Link>
        <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} aria-current={isActive('/profile') ? 'page' : undefined} onClick={closeMobileMenu}>Profile</Link>
      </nav>
    </>
  );
}

function App() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/onboarding' || location.pathname === '/profile';

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!hideHeaderFooter && (
        <header className="app-header">
          <div className="logo-header">
            <Link to="/" className="logo-link" aria-label="Attune home">
              <Logo size={150} className="main-logo" />
            </Link>
            <div className="header-text">
              <h1>Attune</h1>
              <p>A dating app built for how you actually connect.</p>
            </div>
            <ThemeToggle />
          </div>
          <Navigation />
        </header>
      )}
      <main id="main-content" className={`main-content ${location.pathname.replace('/', '')}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<ProfileCreation />} />
          <Route path="/swipe" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/community" element={<Community />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {!hideHeaderFooter && (
        <footer className="app-footer">
          <div className="footer-content">
            <nav className="footer-links" aria-label="Footer">
              <Link to="/features">Features</Link>
              <Link to="/about">About</Link>
              <Link to="/roadmap">Roadmap</Link>
              <Link to="/architecture">Architecture</Link>
            </nav>
            <p className="footer-copyright">© 2026 Attune · A 103 Software Solutions LLC prototype. All sample data is fictional.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router basename="/attune-sample-website">
      <AttuneApiProvider>
        <App />
      </AttuneApiProvider>
    </Router>
  );
}

export default AppWrapper;
