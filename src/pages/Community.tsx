import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { DemoNote } from '../components/DemoNote';
import {
  COMMUNITY_EVENTS,
  COMMUNITY_RESOURCES,
  COMMUNITY_SPACES,
  COMMUNITY_THREADS,
} from '../data/community';
import type { CommunityThread, ThreadReply } from '../data/community';
import './Community.css';

const REPORT_REASONS = [
  'Spam or misleading',
  'Harassment or hate',
  'Inappropriate content',
  'Other',
];

const REPORTS_KEY = 'attune-reports';

function spaceName(spaceId: string): string {
  return COMMUNITY_SPACES.find((space) => space.id === spaceId)?.name ?? 'Community';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function ThreadDialog({
  thread,
  extraReplies,
  onPostReply,
  onClose,
}: {
  thread: CommunityThread;
  extraReplies: ThreadReply[];
  onPostReply: (threadId: string, reply: ThreadReply) => void;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [replyDraft, setReplyDraft] = useState('');

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const allReplies = [...thread.replies, ...extraReplies];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = replyDraft.trim();
    if (text === '') return;
    onPostReply(thread.id, { author: 'You', text, at: new Date().toISOString() });
    setReplyDraft('');
  }

  return (
    <div className="dialog-overlay">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thread-dialog-title"
      >
        <h2 id="thread-dialog-title" ref={headingRef} tabIndex={-1} className="dialog-title">
          {thread.title}
        </h2>
        <p className="thread-meta">
          {thread.author} · {formatDate(thread.createdAt)} · {spaceName(thread.spaceId)}
        </p>
        <p className="dialog-body">{thread.body}</p>
        <h3 className="replies-heading">
          Replies ({allReplies.length})
        </h3>
        {allReplies.length === 0 ? (
          <p className="thread-meta">No replies yet — be the first to share.</p>
        ) : (
          <ul className="reply-list">
            {allReplies.map((reply, index) => (
              <li key={`${reply.at}-${index}`} className="reply">
                <p className="reply-author">{reply.author}</p>
                <p className="reply-text">{reply.text}</p>
                <time className="thread-meta" dateTime={reply.at}>
                  {formatDate(reply.at)} · {formatTime(reply.at)}
                </time>
              </li>
            ))}
          </ul>
        )}
        <form className="reply-form" onSubmit={handleSubmit}>
          <label className="reply-label" htmlFor="reply-textarea">
            Write a reply
          </label>
          <textarea
            id="reply-textarea"
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.target.value)}
          />
          <button type="submit" className="btn-primary">
            Post reply
          </button>
        </form>
        <p className="thread-meta">Replies you post are kept for this session only.</p>
        <button type="button" className="btn-text" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function ReportDialog({
  threadId,
  threadTitle,
  onClose,
}: {
  threadId: string;
  threadTitle: string;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const raw = localStorage.getItem(REPORTS_KEY);
      const parsed: unknown = raw === null ? [] : JSON.parse(raw);
      const reports = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem(
        REPORTS_KEY,
        JSON.stringify([...reports, { threadId, reason, at: new Date().toISOString() }]),
      );
    } catch {
      // Prototype: storage errors still confirm so the demo flow never breaks.
    }
    setSubmitted(true);
  }

  return (
    <div className="dialog-overlay">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
      >
        <h2 id="report-dialog-title" ref={headingRef} tabIndex={-1} className="dialog-title">
          Report thread
        </h2>
        <p className="thread-meta">{threadTitle}</p>
        {submitted ? (
          <p>Thanks — your report was recorded.</p>
        ) : (
          <form className="reply-form" onSubmit={handleSubmit}>
            <label className="reply-label" htmlFor="report-reason">
              Reason
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {REPORT_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
        )}
        <DemoNote text="Demo preview — reports are stored only in this browser in the prototype." />
        <button type="button" className="btn-text" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export function Community() {
  const [selectedSpace, setSelectedSpace] = useState('all');
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [localReplies, setLocalReplies] = useState<Record<string, ThreadReply[]>>({});
  const [reportThreadId, setReportThreadId] = useState<string | null>(null);

  const visibleThreads = COMMUNITY_THREADS.filter(
    (thread) => selectedSpace === 'all' || thread.spaceId === selectedSpace,
  );
  const openThread = COMMUNITY_THREADS.find((thread) => thread.id === openThreadId);
  const reportThread = COMMUNITY_THREADS.find((thread) => thread.id === reportThreadId);

  function handlePostReply(threadId: string, reply: ThreadReply) {
    setLocalReplies((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), reply],
    }));
  }

  return (
    <div className="community-page">
      <header className="page-header">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">
          Spaces, conversations, events, and resources for the Attune community.
        </p>
      </header>

      <section aria-labelledby="spaces-heading">
        <h2 id="spaces-heading" className="section-heading">
          Spaces
        </h2>
        <div className="chip-row" role="group" aria-label="Filter threads by space">
          <button
            type="button"
            className="btn-secondary chip"
            aria-pressed={selectedSpace === 'all'}
            onClick={() => setSelectedSpace('all')}
          >
            All spaces
          </button>
          {COMMUNITY_SPACES.map((space) => (
            <button
              key={space.id}
              type="button"
              className="btn-secondary chip"
              aria-pressed={selectedSpace === space.id}
              onClick={() => setSelectedSpace(space.id)}
            >
              {space.name}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="threads-heading">
        <h2 id="threads-heading" className="section-heading">
          Discussions
        </h2>
        {visibleThreads.length === 0 ? (
          <p className="thread-meta">No threads in this space yet.</p>
        ) : (
          visibleThreads.map((thread) => {
            const replyCount = thread.replies.length + (localReplies[thread.id] ?? []).length;
            return (
              <article key={thread.id} className="card thread-card">
                <h3 className="thread-title">
                  <button
                    type="button"
                    className="thread-open"
                    aria-haspopup="dialog"
                    onClick={() => setOpenThreadId(thread.id)}
                  >
                    {thread.title}
                  </button>
                </h3>
                <p className="thread-meta">
                  {thread.author} · {formatDate(thread.createdAt)} · {replyCount}{' '}
                  {replyCount === 1 ? 'reply' : 'replies'}
                </p>
                <div className="thread-footer">
                  <span className="badge badge-muted">{spaceName(thread.spaceId)}</span>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setReportThreadId(thread.id)}
                  >
                    Report
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <section aria-labelledby="events-heading">
        <h2 id="events-heading" className="section-heading">
          Accessible events
        </h2>
        {COMMUNITY_EVENTS.map((event) => (
          <article key={event.id} className="card event-card">
            <h3 className="thread-title">{event.title}</h3>
            <p className="thread-meta">
              {event.date} · {event.location}
            </p>
            <p>{event.description}</p>
            <ul className="badge-list">
              {event.access.map((item) => (
                <li key={item}>
                  <span className="badge badge-muted">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="section-heading">
          Resources
        </h2>
        {COMMUNITY_RESOURCES.map((resource) => (
          <article key={resource.id} className="card resource-card">
            <h3 className="thread-title">{resource.title}</h3>
            <p>
              <span className="badge">{resource.kind}</span>
            </p>
            <p>{resource.description}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="guidelines-heading">
        <h2 id="guidelines-heading" className="section-heading">
          Community guidelines
        </h2>
        <ul className="guidelines-list">
          <li>Be kind and respectful — everyone here deserves a welcoming space.</li>
          <li>Respect privacy: never share someone&rsquo;s personal details without consent.</li>
          <li>Keep conversations accessible: describe images and avoid unexplained jargon.</li>
          <li>No harassment, hate speech, or spam of any kind.</li>
          <li>If something feels off, report it — every thread has a Report option.</li>
        </ul>
      </section>

      {openThread !== undefined && (
        <ThreadDialog
          thread={openThread}
          extraReplies={localReplies[openThread.id] ?? []}
          onPostReply={handlePostReply}
          onClose={() => setOpenThreadId(null)}
        />
      )}
      {reportThread !== undefined && (
        <ReportDialog
          threadId={reportThread.id}
          threadTitle={reportThread.title}
          onClose={() => setReportThreadId(null)}
        />
      )}
    </div>
  );
}
