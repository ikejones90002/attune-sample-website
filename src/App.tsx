import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { Logo } from './components/Logo';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Roadmap from './pages/Roadmap';
import Architecture from './pages/Architecture';
import Onboarding from './pages/Onboarding';
import ProfileCreation from './pages/ProfileCreation';
import ProfileSwipe from './pages/ProfileSwipe';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="main-nav" aria-label="Main navigation">
      <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
      <Link to="/features" className={`nav-link ${isActive('/features') ? 'active' : ''}`} aria-current={isActive('/features') ? 'page' : undefined}>Features</Link>
      <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} aria-current={isActive('/about') ? 'page' : undefined}>About</Link>
      <Link to="/roadmap" className={`nav-link ${isActive('/roadmap') ? 'active' : ''}`} aria-current={isActive('/roadmap') ? 'page' : undefined}>Roadmap</Link>
      <Link to="/architecture" className={`nav-link ${isActive('/architecture') ? 'active' : ''}`} aria-current={isActive('/architecture') ? 'page' : undefined}>Architecture</Link>
      <Link to="/onboarding" className={`nav-link ${isActive('/onboarding') ? 'active' : ''}`} aria-current={isActive('/onboarding') ? 'page' : undefined}>Onboarding</Link>
      <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} aria-current={isActive('/profile') ? 'page' : undefined}>Profile</Link>
      <Link to="/swipe" className={`nav-link ${isActive('/swipe') ? 'active' : ''}`} aria-current={isActive('/swipe') ? 'page' : undefined}>Swipe</Link>
    </nav>
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
          </div>
          <Navigation />
        </header>
      )} 
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<ProfileCreation />} />
          <Route path="/swipe" element={<ProfileSwipe />} />
        </Routes>
      </main>
      {!hideHeaderFooter && (
        <footer>
          <div className="footer-content">
            <p className="footer-tagline">Accessibility-first dating for Deaf/HoH and Blind/Low-Vision communities.</p>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/features">Features</Link>
              <Link to="/about">About</Link>
              <Link to="/roadmap">Roadmap</Link>
              <Link to="/architecture">Architecture</Link>
              <Link to="/onboarding">Onboarding</Link>
              <Link to="/profile">Profile</Link>
            </div>
            <p className="footer-copyright">© 2024 Attune. Building accessibility-first, not accessibility-retrofitted.</p>
          </div>
        </footer>
      )} 
    </div>
  );
}

function AppWrapper() {
  return (
    <Router basename="/attune-sample-website">
      <App />
    </Router>
  );
}

export default AppWrapper;