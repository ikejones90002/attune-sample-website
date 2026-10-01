import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttuneStore } from '../lib/store';
import { SAMPLE_PROFILES } from '../data/profiles';
import type { SampleProfile } from '../lib/types';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import './Discover.css';

const DEFAULT_PREFS = { ageMin: 18, ageMax: 99, maxDistanceMi: 100 };

export function Discover() {
  const navigate = useNavigate();
  const [state, { like, pass, unpass }] = useAttuneStore();
  const [index, setIndex] = useState(0);
  const [matchedId, setMatchedId] = useState<string | null>(null);
  const [reviewingPasses, setReviewingPasses] = useState(false);

  const prefs = state.profile?.matchingPrefs ?? DEFAULT_PREFS;

  const deck = useMemo(
    () =>
      SAMPLE_PROFILES.filter(
        (p) =>
          p.age >= prefs.ageMin &&
          p.age <= prefs.ageMax &&
          p.distanceMi <= prefs.maxDistanceMi &&
          !state.likes.includes(p.id) &&
          !state.passes.includes(p.id),
      ),
    [prefs.ageMin, prefs.ageMax, prefs.maxDistanceMi, state.likes, state.passes],
  );

  // Keep the index valid as the deck shrinks after likes/passes.
  useEffect(() => {
    if (index > deck.length - 1) {
      setIndex(Math.max(deck.length - 1, 0));
    }
  }, [index, deck.length]);

  const current: SampleProfile | null = deck[index] ?? null;

  const handleLike = useCallback(() => {
    if (!current) return;
    if (like(current.id)) {
      setMatchedId(current.id);
    }
  }, [current, like]);

  const handlePass = useCallback(() => {
    if (!current) return;
    pass(current.id);
  }, [current, pass]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMatchedId(null);
        return;
      }
      if (matchedId) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleLike();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleLike, handlePass, matchedId]);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (matchedId) {
      dialogRef.current?.focus();
    }
  }, [matchedId]);

  const matchedProfile: SampleProfile | null = matchedId
    ? (SAMPLE_PROFILES.find((p) => p.id === matchedId) ?? null)
    : null;

  const passedProfiles = useMemo(
    () =>
      state.passes
        .map((id) => SAMPLE_PROFILES.find((p) => p.id === id))
        .filter((p): p is SampleProfile => p !== undefined),
    [state.passes],
  );

  if (reviewingPasses) {
    return (
      <div className="discover-page">
        <header className="page-header">
          <h1 className="page-title">Passed profiles</h1>
          <p className="page-subtitle">Second thoughts? Undo a pass to see someone again.</p>
        </header>
        {passedProfiles.length === 0 ? (
          <EmptyState
            title="No passed profiles"
            body="Profiles you pass on will show up here so you can revisit them."
            actionLabel="Back to Discover"
            onAction={() => setReviewingPasses(false)}
          />
        ) : (
          <>
            <ul className="pass-review-list">
              {passedProfiles.map((p) => (
                <li key={p.id} className="pass-row">
                  <span className="pass-row-info">
                    <Avatar name={p.name} gradient={p.gradient} size={48} />
                    <span>
                      {p.name}, {p.age}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => unpass(p.id)}
                    aria-label={`Undo pass on ${p.name}`}
                  >
                    Undo
                  </button>
                </li>
              ))}
            </ul>
            <div className="pass-review-back">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setReviewingPasses(false)}
              >
                Back to Discover
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="sr-only" aria-live="polite" key={current?.id ?? 'none'}>
        {current ? `Showing ${current.name}, ${current.age}` : 'No more profiles to show'}
      </div>

      <header className="page-header">
        <h1 className="page-title">Discover</h1>
        <p className="page-subtitle">Like or pass — a match happens when the feeling is mutual.</p>
      </header>

      {deck.length === 0 || !current ? (
        <EmptyState
          title="You've seen everyone"
          body="New profiles will appear here as they're added. You can revisit profiles you passed on."
          actionLabel="Review passed profiles"
          onAction={() => setReviewingPasses(true)}
        />
      ) : (
        <>
          <article className="deck-card" aria-labelledby={`deck-name-${current.id}`}>
            <div className="deck-avatar">
              <Avatar name={current.name} gradient={current.gradient} size={120} />
            </div>
            <h2 id={`deck-name-${current.id}`} className="deck-name">
              {current.name}, {current.age}
            </h2>
            <p className="deck-meta">
              {current.location} · {current.distanceMi} mi away
            </p>
            <p className="deck-bio">{current.bio}</p>

            <p className="deck-label" id={`deck-interests-${current.id}`}>
              Interests
            </p>
            <ul className="badge-list" aria-labelledby={`deck-interests-${current.id}`}>
              {current.interests.map((interest) => (
                <li key={interest} className="badge">
                  {interest}
                </li>
              ))}
            </ul>

            <p className="deck-label" id={`deck-comms-${current.id}`}>
              Communication
            </p>
            <ul className="badge-list" aria-labelledby={`deck-comms-${current.id}`}>
              {current.communication.map((mode) => (
                <li key={mode} className="badge badge-muted">
                  {mode}
                </li>
              ))}
            </ul>

            {current.access.length > 0 && (
              <>
                <p className="deck-label" id={`deck-access-${current.id}`}>
                  Access needs
                </p>
                <ul className="badge-list" aria-labelledby={`deck-access-${current.id}`}>
                  {current.access.map((need) => (
                    <li key={need} className="badge badge-muted">
                      {need}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <div className="deck-controls">
            <button
              type="button"
              className="btn-secondary"
              onClick={handlePass}
              aria-label={`Pass on ${current.name}`}
            >
              Pass
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleLike}
              aria-label={`Like ${current.name}`}
            >
              Like
            </button>
          </div>
          <p className="deck-hint">
            <kbd>←</kbd> / <kbd>→</kbd> arrow keys work too
          </p>
        </>
      )}

      {matchedProfile && (
        <div className="match-overlay" onClick={() => setMatchedId(null)}>
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="match-heading"
            className="match-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar name={matchedProfile.name} gradient={matchedProfile.gradient} size={120} />
            <h2 id="match-heading" className="match-title">
              It&apos;s a match!
            </h2>
            <p className="match-lead">You and {matchedProfile.name} liked each other.</p>
            <div className="match-actions">
              <button
                type="button"
                className="btn-primary btn-large"
                onClick={() => navigate(`/messages/${matchedProfile.id}`)}
              >
                Send a message
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMatchedId(null)}
              >
                Keep exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
