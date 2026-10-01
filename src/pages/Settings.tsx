import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAttune } from '../lib/api/AttuneApiProvider';
import { SAMPLE_PROFILES } from '../data/profiles';
import type { MatchingPrefs, SampleProfile, UserProfile } from '../lib/types';
import { ThemeToggle } from '../components/ThemeToggle';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import './Settings.css';

const OPEN_TO_OPTIONS: ReadonlyArray<string> = [
  'Women',
  'Men',
  'Nonbinary people',
  'Everyone',
];

interface PrefsErrors {
  ageMin?: string;
  ageMax?: string;
  maxDistance?: string;
}

function defaultPrefs(): MatchingPrefs {
  return { ageMin: 18, ageMax: 99, maxDistanceMi: 25, openTo: ['Everyone'] };
}

function MatchingPrefsForm({ profile }: { profile: UserProfile }) {
  const [, api] = useAttune();
  const [edits, setEdits] = useState<MatchingPrefs>(() => ({
    ...(profile.matchingPrefs ?? defaultPrefs()),
  }));
  const [errors, setErrors] = useState<PrefsErrors>({});
  const [saved, setSaved] = useState(false);

  function update(patch: Partial<MatchingPrefs>): void {
    setEdits((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }

  function toggleOpenTo(option: string): void {
    const openTo: ReadonlyArray<string> = edits.openTo as ReadonlyArray<string>;
    update({
      openTo: (openTo.includes(option)
        ? openTo.filter((o) => o !== option)
        : [...openTo, option]) as MatchingPrefs['openTo'],
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const nextErrors: PrefsErrors = {};
    if (edits.ageMin < 18) {
      nextErrors.ageMin = 'Minimum age must be 18 or older.';
    }
    if (edits.ageMin > edits.ageMax) {
      nextErrors.ageMax = 'Maximum age must be at least the minimum age.';
    }
    if (edits.maxDistanceMi < 1) {
      nextErrors.maxDistance = 'Maximum distance must be at least 1 mile.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }
    void api.saveProfile({ ...profile, matchingPrefs: edits });
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      <div className="form-group">
        <label htmlFor="prefs-age-min">Minimum age</label>
        <input
          id="prefs-age-min"
          type="number"
          min={18}
          max={99}
          value={edits.ageMin}
          aria-describedby={errors.ageMin ? 'prefs-age-min-error' : undefined}
          onChange={(event) => update({ ageMin: Number(event.target.value) })}
        />
        {errors.ageMin ? (
          <p className="form-error" id="prefs-age-min-error" role="alert">
            {errors.ageMin}
          </p>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="prefs-age-max">Maximum age</label>
        <input
          id="prefs-age-max"
          type="number"
          min={18}
          max={99}
          value={edits.ageMax}
          aria-describedby={errors.ageMax ? 'prefs-age-max-error' : undefined}
          onChange={(event) => update({ ageMax: Number(event.target.value) })}
        />
        {errors.ageMax ? (
          <p className="form-error" id="prefs-age-max-error" role="alert">
            {errors.ageMax}
          </p>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="prefs-max-distance">Maximum distance (miles)</label>
        <input
          id="prefs-max-distance"
          type="number"
          min={1}
          max={500}
          value={edits.maxDistanceMi}
          aria-describedby={errors.maxDistance ? 'prefs-max-distance-error' : undefined}
          onChange={(event) => update({ maxDistanceMi: Number(event.target.value) })}
        />
        {errors.maxDistance ? (
          <p className="form-error" id="prefs-max-distance-error" role="alert">
            {errors.maxDistance}
          </p>
        ) : null}
      </div>

      <fieldset className="form-group">
        <legend>Open to</legend>
        <div className="open-to-grid">
          {OPEN_TO_OPTIONS.map((option) => (
            <label key={option} className="checkbox-card compact">
              <input
                type="checkbox"
                className="sr-only"
                checked={(edits.openTo as ReadonlyArray<string>).includes(option)}
                onChange={() => toggleOpenTo(option)}
              />
              <span className="checkbox-card-indicator" aria-hidden="true" />
              <span className="checkbox-card-content">
                <strong>{option}</strong>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {saved ? (
        <p className="form-success" role="status">
          Preferences saved.
        </p>
      ) : null}

      <button type="submit" className="btn-primary">
        Save preferences
      </button>
    </form>
  );
}

interface ManagedProfileListProps {
  ids: string[];
  headingId: string;
  heading: string;
  emptyText: string;
  actionLabel: string;
  actionVerb: string;
  onAction: (id: string) => void;
}

/** List of sample profiles (hidden or blocked) with a restore action. */
function ManagedProfileList({
  ids,
  headingId,
  heading,
  emptyText,
  actionLabel,
  actionVerb,
  onAction,
}: ManagedProfileListProps) {
  const profiles: SampleProfile[] = ids
    .map((id) => SAMPLE_PROFILES.find((p) => p.id === id))
    .filter((p): p is SampleProfile => p !== undefined);

  return (
    <section className="card settings-card" aria-labelledby={headingId}>
      <h2 className="section-heading" id={headingId}>
        {heading}
      </h2>
      {profiles.length === 0 ? (
        <p className="field-note">{emptyText}</p>
      ) : (
        <ul className="managed-profile-list">
          {profiles.map((p) => (
            <li key={p.id} className="managed-profile-row">
              <span className="managed-profile-info">
                <Avatar name={p.name} gradient={p.gradient} photo={p.photo} size={40} />
                <span>
                  {p.name}, {p.age} · {p.location}
                </span>
              </span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onAction(p.id)}
                aria-label={`${actionVerb} ${p.name}`}
              >
                {actionLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="field-note">
        Demo preview — this list is stored only in this browser; nothing is sent anywhere.
      </p>
    </section>
  );
}

export function Settings() {
  const [state, api] = useAttune();
  const navigate = useNavigate();

  function handleReset(): void {
    if (
      window.confirm(
        'Reset all Attune demo data? Your profile, likes, matches, and messages will be cleared.',
      )
    ) {
      void api.resetDemo();
      window.location.reload();
    }
  }

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <section className="card settings-card" aria-labelledby="settings-appearance">
        <h2 className="section-heading" id="settings-appearance">Appearance</h2>
        <div className="settings-row">
          <ThemeToggle />
        </div>
        <p className="field-note">
          Switch between dark and light mode. Your choice is saved in this browser.
        </p>
      </section>

      <section className="card settings-card" aria-labelledby="settings-matching">
        <h2 className="section-heading" id="settings-matching">Matching preferences</h2>
        {state.profile === null ? (
          <EmptyState
            title="No profile yet"
            body="Complete onboarding to set your matching preferences."
            actionLabel="Start onboarding"
            onAction={() => navigate('/onboarding')}
          />
        ) : (
          <MatchingPrefsForm profile={state.profile} />
        )}
      </section>

      <ManagedProfileList
        ids={state.hiddenIds}
        headingId="settings-hidden"
        heading="Hidden profiles"
        emptyText="You haven't hidden any profiles. Profiles you hide from Discover will show up here so you can bring them back."
        actionLabel="Unhide"
        actionVerb="Unhide"
        onAction={api.unhideProfile}
      />

      <ManagedProfileList
        ids={state.blockedIds}
        headingId="settings-blocked"
        heading="Blocked profiles"
        emptyText="You haven't blocked any profiles. Blocking from Matches removes someone here, where you can undo it."
        actionLabel="Unblock"
        actionVerb="Unblock"
        onAction={api.unblockProfile}
      />

      <section className="card settings-card" aria-labelledby="settings-account">
        <h2 className="section-heading" id="settings-account">Account</h2>
        <div className="settings-row">
          <Link className="btn-secondary" to="/onboarding">
            Redo onboarding
          </Link>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset demo data
          </button>
        </div>
      </section>

      <section className="card settings-card" aria-labelledby="settings-about">
        <h2 className="section-heading" id="settings-about">About</h2>
        <p>
          Attune prototype — everything runs locally in your browser. Profiles, messages, and
          community content are fictional samples; nothing is sent to a server.
        </p>
      </section>
    </div>
  );
}
