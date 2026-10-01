import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAttuneStore } from '../lib/store';
import { SAMPLE_PROFILES } from '../data/profiles';
import type { SampleProfile } from '../lib/types';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import './Matches.css';

interface MatchedEntry {
  profile: SampleProfile;
  matchedAt: string;
}

export function Matches() {
  const navigate = useNavigate();
  const [state] = useAttuneStore();

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
          <li key={p.id}>
            <Link
              to={`/messages/${p.id}`}
              className="card match-card"
              aria-label={`Message ${p.name}`}
            >
              <Avatar name={p.name} gradient={p.gradient} size={72} />
              <h3 className="match-name">
                {p.name}, {p.age}
              </h3>
              <p className="match-location">{p.location}</p>
              <p className="match-date">
                Matched {new Date(matchedAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
