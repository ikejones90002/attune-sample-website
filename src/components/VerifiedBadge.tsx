import './VerifiedBadge.css';

/**
 * Demo-only verified chip for the signed-in user's own profile. The "(demo)"
 * suffix is deliberate: this badge reflects a simulated check stored in the
 * browser, never a real identity verification.
 */
export function VerifiedBadge() {
  return <span className="verified-badge">✓ ID verified (demo)</span>;
}
