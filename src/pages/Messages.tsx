import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { DemoNote } from '../components/DemoNote';
import { EmptyState } from '../components/EmptyState';
import { SAMPLE_PROFILES } from '../data/profiles';
import { SAMPLE_REPLIES } from '../data/replies';
import { loadStore, useAttuneStore } from '../lib/store';
import type { ChatMessage, SampleProfile } from '../lib/types';
import './Messages.css';

type Profile = SampleProfile;

function lastMessage(messages: ChatMessage[] | undefined): ChatMessage | undefined {
  if (messages === undefined || messages.length === 0) return undefined;
  return messages[messages.length - 1];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function ThreadList() {
  const [state] = useAttuneStore();
  const navigate = useNavigate();

  const threads = state.matches
    .map((match) => SAMPLE_PROFILES.find((p) => p.id === match.profileId))
    .filter((p): p is Profile => p !== undefined);

  return (
    <div className="messages-page">
      <header className="page-header">
        <h1 className="page-title">Messages</h1>
      </header>
      {threads.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          body="Match with someone to start chatting."
          actionLabel="Discover profiles"
          onAction={() => navigate('/swipe')}
        />
      ) : (
        <ul className="thread-list">
          {threads.map((profile) => {
            const last = lastMessage(state.messages[profile.id]);
            const preview =
              last === undefined
                ? 'Say hello to start chatting'
                : `${last.from === 'me' ? 'You' : profile.name}: ${last.text}`;
            return (
              <li key={profile.id}>
                <Link to={`/messages/${profile.id}`} className="thread-row">
                  <Avatar name={profile.name} gradient={profile.gradient} size={56} />
                  <span className="thread-text">
                    <span className="thread-name">{profile.name}</span>
                    <span className="thread-preview">{preview}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ThreadView({ threadId }: { threadId: string }) {
  const [state, actions] = useAttuneStore();
  const profile = SAMPLE_PROFILES.find((p) => p.id === threadId);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  const messages = state.messages[threadId] ?? [];

  useEffect(() => {
    const el = listRef.current;
    if (el !== null) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    replyTimer.current = undefined;
    return () => {
      window.clearTimeout(replyTimer.current);
    };
  }, [threadId]);

  if (profile === undefined) {
    return (
      <div className="messages-page">
        <EmptyState title="Conversation not found" body="This conversation does not exist." />
        <p>
          <Link to="/messages" className="back-link">
            ← All conversations
          </Link>
        </p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed === '') return;
    actions.sendMessage(threadId, trimmed, 'me');
    setDraft('');
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const bank = SAMPLE_REPLIES[threadId] ?? [];
      if (bank.length === 0) return;
      const fresh = loadStore();
      const theirCount = (fresh.messages[threadId] ?? []).filter((m) => m.from === 'them').length;
      actions.sendMessage(threadId, bank[theirCount % bank.length], 'them');
    }, 1200);
  }

  return (
    <div className="messages-page">
      <header className="chat-header">
        <Link to="/messages" className="back-link">
          ← All conversations
        </Link>
        <Avatar name={profile.name} gradient={profile.gradient} size={48} />
        <h1 className="page-title">{profile.name}</h1>
      </header>
      <DemoNote text="Demo preview — conversations are simulated in your browser; nothing is sent anywhere." />
      <div
        ref={listRef}
        className="chat-window"
        role="log"
        aria-live="polite"
        aria-label={`Conversation with ${profile.name}`}
      >
        {messages.length === 0 ? (
          <p className="chat-empty">Say hello to start chatting.</p>
        ) : (
          <ol className="chat-list">
            {messages.map((message) => (
              <li
                key={message.id}
                className={message.from === 'me' ? 'msg msg-me' : 'msg msg-them'}
              >
                <span className="visually-hidden">
                  {message.from === 'me' ? 'You said' : `${profile.name} said`}:
                </span>
                <span>{message.text}</span>
                <time className="msg-time" dateTime={message.at}>
                  {formatTime(message.at)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </div>
      <form className="composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-label={`Message ${profile.name}`}
          placeholder={`Message ${profile.name}…`}
        />
        <button type="submit" className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}

export function Messages() {
  const { id } = useParams();
  return id === undefined ? <ThreadList /> : <ThreadView threadId={id} />;
}
