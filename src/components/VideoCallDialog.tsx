import { useEffect, useMemo, useRef, useState } from 'react';
import { CALL_SCRIPTS, DEFAULT_CALL_SCRIPT } from '../data/callScripts';
import { isReadAloudSupported, speakText, stopSpeaking } from '../lib/voice';
import type { SampleProfile } from '../lib/types';
import './VideoCall.css';

interface VideoCallDialogProps {
  profile: SampleProfile;
  selfName: string;
  onClose: () => void;
}

type CallPhase = 'connecting' | 'in-call' | 'ended';

const CONNECT_DELAY_MS = 1200;
const WORD_INTERVAL_MS = 180;
const LINE_PAUSE_MS = 1500;

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Simulated video call with live captions. Everything is fake: the remote
 *  "video" is the profile's photo, the captions are scripted lines revealed
 *  word by word, and nothing is recorded, sent, or connected anywhere.
 *  Esc ends the call (showing the summary); Esc again closes. */
export function VideoCallDialog({ profile, selfName, onClose }: VideoCallDialogProps) {
  const [phase, setPhase] = useState<CallPhase>('connecting');
  const [elapsed, setElapsed] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [readAloudOn, setReadAloudOn] = useState(false);

  const [captionText, setCaptionText] = useState('');
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const readAloudSupported = useMemo(() => isReadAloudSupported(), []);
  const script = useMemo(
    () => CALL_SCRIPTS[profile.id] ?? DEFAULT_CALL_SCRIPT,
    [profile.id],
  );
  const firstName = profile.name.split(' ')[0] ?? profile.name;
  const trimmedSelfName = selfName.trim();
  const displaySelfName = trimmedSelfName === '' ? 'You' : trimmedSelfName;
  const selfInitials = displaySelfName
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  const endCallRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const readAloudRef = useRef(false);
  const transcriptListRef = useRef<HTMLOListElement>(null);

  function endCall() {
    stopSpeaking();
    setReadAloudOn(false);
    setPhase('ended');
  }

  // Move focus into the dialog on open; restore it on close.
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    endCallRef.current?.focus();
    return () => {
      restoreRef.current?.focus();
    };
  }, []);

  // Focus the summary's action when the call ends.
  useEffect(() => {
    if (phase === 'ended') {
      backRef.current?.focus();
    }
  }, [phase]);

  // Esc ends the call first, then closes from the summary.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') {
        return;
      }
      if (phase === 'ended') {
        onClose();
      } else {
        endCall();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [phase, onClose]);

  // "Connecting…" then in-call.
  useEffect(() => {
    if (phase !== 'connecting') {
      return;
    }
    const id = window.setTimeout(() => setPhase('in-call'), CONNECT_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [phase]);

  // Elapsed call timer; freezes when the call ends.
  useEffect(() => {
    if (phase !== 'in-call') {
      return;
    }
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [phase]);

  // Keep a ref of the read-aloud toggle so the caption engine can check it
  // without restarting when the toggle flips.
  useEffect(() => {
    readAloudRef.current = readAloudOn;
  }, [readAloudOn]);

  // Caption engine: reveals each script line word by word, like live
  // captioning. Runs only while in-call; every timer is cleared on cleanup.
  useEffect(() => {
    if (phase !== 'in-call') {
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    const revealLine = (lineIndex: number) => {
      if (cancelled) {
        return;
      }
      const line = script[lineIndex];
      if (line === undefined) {
        setSpeaking(false);
        return;
      }
      const words = line.split(/\s+/).filter((word) => word !== '');
      let shown = 0;
      setSpeaking(true);
      const step = () => {
        if (cancelled) {
          return;
        }
        shown += 1;
        setCaptionText(words.slice(0, shown).join(' '));
        if (shown < words.length) {
          timer = window.setTimeout(step, WORD_INTERVAL_MS);
        } else {
          setSpeaking(false);
          setTranscriptLines((prev) => [...prev, line]);
          if (readAloudRef.current) {
            speakText(line);
          }
          timer = window.setTimeout(() => revealLine(lineIndex + 1), LINE_PAUSE_MS);
        }
      };
      timer = window.setTimeout(step, WORD_INTERVAL_MS);
    };

    revealLine(0);
    return () => {
      cancelled = true;
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [phase, script]);

  // Never leave speech running after the dialog unmounts.
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Keep the newest transcript line in view.
  useEffect(() => {
    const el = transcriptListRef.current;
    if (el !== null) {
      el.scrollTop = el.scrollHeight;
    }
  }, [transcriptLines, transcriptOpen]);

  function toggleReadAloud() {
    if (readAloudOn) {
      stopSpeaking();
    }
    setReadAloudOn(!readAloudOn);
  }

  const titleId = `video-call-title-${profile.id}`;

  return (
    <div
      className="call-overlay"
      onClick={phase === 'ended' ? onClose : undefined}
    >
      <div
        className="call-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="call-banner">
          Demo preview — simulated call. No real video, audio, or connection is
          made.
        </p>

        <div className="call-head">
          <h2 id={titleId} className="call-title">
            {phase === 'ended' ? 'Call ended' : `Video call with ${profile.name}`}
          </h2>
          {phase !== 'ended' && (
            <p
              className="call-timer"
              aria-label={
                phase === 'connecting'
                  ? 'Connecting'
                  : `Call time ${formatDuration(elapsed)}`
              }
            >
              {phase === 'connecting' ? 'Connecting…' : formatDuration(elapsed)}
            </p>
          )}
        </div>

        {phase === 'ended' ? (
          <div className="call-summary">
            <p className="call-summary-time">
              Call ended · {formatDuration(elapsed)}
            </p>
            <p className="call-summary-note">
              This was a simulated demo call — no real video, audio, or
              connection took place, and nothing was recorded or sent anywhere.
            </p>
            <button
              ref={backRef}
              type="button"
              className="btn-primary"
              onClick={onClose}
            >
              Back to messages
            </button>
          </div>
        ) : (
          <>
            <div className="call-stage">
              <img
                className="call-remote-img"
                src={profile.photo}
                alt=""
                draggable={false}
              />
              <div className="call-remote-top">
                <span className="call-name-tag">{profile.name}</span>
                <span className="call-chip">Simulated video</span>
                {speaking && (
                  <span className="call-speaking" aria-hidden="true">
                    <span className="call-speaking-dot" />
                    Speaking
                  </span>
                )}
              </div>
              {phase === 'connecting' && (
                <div className="call-connecting" role="status">
                  Connecting…
                </div>
              )}
              <div
                className="call-self"
                aria-label={`Your preview, ${displaySelfName}`}
              >
                {cameraOn ? (
                  <span className="call-self-initials" aria-hidden="true">
                    {selfInitials}
                  </span>
                ) : (
                  <span className="call-self-off">Camera off</span>
                )}
                <span className="call-self-label">
                  {displaySelfName} · {micOn ? 'Mic on' : 'Mic muted'}
                </span>
              </div>
              {captionsOn && captionText !== '' && (
                <div className="call-captions">
                  <p className="call-caption-text">
                    <span className="call-caption-speaker">{firstName}:</span>{' '}
                    {captionText}
                  </p>
                </div>
              )}
            </div>

            {transcriptOpen && (
              <aside className="call-transcript" aria-label="Call transcript">
                <h3 className="call-transcript-title">Transcript · simulated</h3>
                {transcriptLines.length === 0 ? (
                  <p className="call-transcript-empty">
                    No captions yet — they will appear here as {firstName}{' '}
                    talks.
                  </p>
                ) : (
                  <ol
                    ref={transcriptListRef}
                    className="call-transcript-list"
                    role="log"
                    aria-live="polite"
                    aria-label="Completed caption lines"
                  >
                    {transcriptLines.map((line, index) => (
                      <li
                        key={`${index}-${line}`}
                        className="call-transcript-item"
                      >
                        <span className="call-transcript-speaker">
                          {firstName}:
                        </span>{' '}
                        {line}
                      </li>
                    ))}
                  </ol>
                )}
              </aside>
            )}

            <div className="call-controls" role="group" aria-label="Call controls">
              <button
                type="button"
                className="btn-secondary call-control"
                aria-pressed={micOn}
                onClick={() => setMicOn(!micOn)}
              >
                <span aria-hidden="true">{micOn ? '🎙' : '🔇'}</span>
                Mic
              </button>
              <button
                type="button"
                className="btn-secondary call-control"
                aria-pressed={cameraOn}
                onClick={() => setCameraOn(!cameraOn)}
              >
                <span aria-hidden="true">{cameraOn ? '📹' : '📷'}</span>
                Camera
              </button>
              <button
                type="button"
                className="btn-secondary call-control"
                aria-pressed={captionsOn}
                onClick={() => setCaptionsOn(!captionsOn)}
              >
                <span aria-hidden="true" className="call-cc">
                  CC
                </span>
                Captions
              </button>
              <button
                type="button"
                className="btn-secondary call-control"
                aria-pressed={transcriptOpen}
                onClick={() => setTranscriptOpen(!transcriptOpen)}
              >
                <span aria-hidden="true">📄</span>
                Transcript
              </button>
              {readAloudSupported && (
                <button
                  type="button"
                  className="btn-secondary call-control"
                  aria-pressed={readAloudOn}
                  onClick={toggleReadAloud}
                >
                  <span aria-hidden="true">🔊</span>
                  Read aloud
                </button>
              )}
              <button
                ref={endCallRef}
                type="button"
                className="btn-secondary call-end"
                onClick={endCall}
              >
                <span aria-hidden="true">📞</span>
                End call
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
