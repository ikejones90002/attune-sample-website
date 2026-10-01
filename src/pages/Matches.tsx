import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAttuneStore } from '../lib/store';
import { SAMPLE_PROFILES } from '../data/profiles';
import type { SampleProfile } from '../lib/types';
import { Avatar } from '../components/Avatar';
import { DemoNote } from '../components/DemoNote';
import { EmptyState } from '../components/EmptyState';
import './Matches.css';
import '../components/ProfileModals.css';

interface MatchedEntry {
  profile: SampleProfile;
  matchedAt: string;
}

type ConfirmAction = 'unmatch' | 'block';

interface ConfirmDialogProps {
  profile: SampleProfile;
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmation dialog for Unmatch / Block, following the accessible modal
 *  pattern used by the profile dialogs: role="dialog", aria-modal, Esc
 *  closes, focus moves to Cancel on open and is restored on close. */
function MatchConfirmDialog({ profile, action, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus();
    };
  }, [onCancel]);

  const isBlock = action === 'block';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`match-confirm-title-${profile.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={`match-confirm-title-${profile.id}`} className="modal-title">
          {isBlock ? `Block ${profile.name}?` : `Unmatch ${profile.name}?`}
        </h2>
        {isBlock ? (
          <p className="modal-body">
            In this demo, blocking removes {profile.name} from your Matches and Discover
            and adds them to your blocked list in Settings, where you can unblock them
            anytime. Nothing is sent anywhere — the change is stored only in this browser.
          </p>
        ) : (
          <p className="modal-body">
            This removes your match with {profile.name}. In this demo the change is
            stored only in this browser, and the conversation preview goes away with
            the match. This cannot be undone except by resetting the demo.
          </p>
        )}
        <DemoNote text="Demo preview — matches are local to this browser in the prototype." />
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="btn-text" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary match-confirm-btn"
            onClick={onConfirm}
            aria-label={isBlock ? `Confirm block of ${profile.name}` : `Confirm unmatch of ${profile.name}`}
          >
            {isBlock ? 'Block' : 'Unmatch'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Matches() {
  const navigate = useNavigate();
  const [state, actions] = useAttuneStore();
  const [confirm, setConfirm] = useState<{ profile: SampleProfile; action: ConfirmAction } | null>(
    null,
  );

  const matched = useMemo<MatchedEntry[]>(
    () =>
      state.matches
        .map((m) => {
          const profile = SAMPLE_PROFILES.find((p) => p.id === m.profileId);
          return profile ? { profile, matchedAt: m.matchedAt } : null;
        })
        .filter((entry): entry is MatchedEntry => entry !== null),
    [state.matches],
  );

  function handleConfirm(): void {
    if (confirm === null) return;
    if (confirm.action === 'block') {
      actions.blockProfile(confirm.profile.id);
    } else {
      actions.unmatchProfile(confirm.profile.id);
    }
    setConfirm(null);
  }

  if (matched.length === 0) {
    return (
      <div className="matches-page">
        <EmptyState
          title="No matches yet"
          body="When someone you like likes you back, they'll appear here."
          actionLabel="Discover profiles"
          onAction={() => navigate('/swipe')}
        />
      </div>
    );
  }

  return (
    <div className="matches-page">
      <header className="page-header">
        <h1 className="page-title">Matches</h1>
        <p className="page-subtitle">People who liked you back — start the conversation.</p>
      </header>
      <ul className="matches-grid">
        {matched.map(({ profile: p, matchedAt }) => (
          <li key={p.id} className="match-item card">
            <Link to={`/messages/${p.id}`} className="match-card" aria-label={`Message ${p.name}`}>
              <Avatar name={p.name} gradient={p.gradient} photo={p.photo} size={72} />
              <h3 className="match-name">
                {p.name}, {p.age}
              </h3>
              <p className="match-location">{p.location}</p>
              <p className="match-date">
                Matched {new Date(matchedAt).toLocaleDateString()}
              </p>
            </Link>
            <div className="match-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirm({ profile: p, action: 'unmatch' })}
                aria-label={`Unmatch ${p.name}`}
              >
                Unmatch
              </button>
              <button
                type="button"
                className="btn-secondary match-block-btn"
                onClick={() => setConfirm({ profile: p, action: 'block' })}
                aria-label={`Block ${p.name}`}
              >
                Block
              </button>
            </div>
          </li>
        ))}
      </ul>

      {confirm !== null && (
        <MatchConfirmDialog
          profile={confirm.profile}
          action={confirm.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
