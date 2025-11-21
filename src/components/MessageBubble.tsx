import { memo, useMemo, useState } from 'react';
import type { ChatMessage } from '../types/chat';

type MessageBubbleProps = {
  message: ChatMessage;
};

const formatTime = (value: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return '';
  }
};

const AssistantGlyph = () => (
  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 shadow-glow ring-1 ring-white/10">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8h10M7 12h6m-1 8a9 9 0 1 1 8-8"
      />
    </svg>
  </span>
);

const UserGlyph = () => (
  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent-secondary/40 bg-accent-primary/20 text-accent-secondary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.688a8.25 8.25 0 0 1 15 0"
      />
    </svg>
  </span>
);

const MessageBubbleComponent = ({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const timestamp = useMemo(() => formatTime(message.createdAt), [message.createdAt]);

  const wrapperClass = isUser ? 'justify-end pl-16' : 'justify-start pr-16';
  const alignment = isUser ? 'items-end text-right' : 'items-start text-left';

  const bubbleClass = isUser
    ? 'bg-gradient-to-br from-accent-primary/95 via-accent-primary to-accent-secondary text-slate-50 shadow-glow'
    : 'bg-surface-elevated/95 text-slate-100 ring-1 ring-white/10 backdrop-blur-xl';

  const handleCopy = async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className={`flex w-full ${wrapperClass}`}>
      <div className={`flex max-w-[min(90%,38rem)] flex-col gap-2 ${alignment} animate-slide-up-fade`}>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
          {isUser ? <UserGlyph /> : <AssistantGlyph />}
          <span>{isUser ? 'You' : 'Assistant'}</span>
          {timestamp && (
            <time className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-white/35" dateTime={message.createdAt}>
              {timestamp}
            </time>
          )}
        </div>
        <div
          className={`group relative w-full overflow-hidden rounded-[1.9rem] px-6 py-5 shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow ${bubbleClass}`}
        >
          <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition duration-500 group-hover:opacity-100">
            <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_65%)]" />
            <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_bottom,_rgba(88,166,255,0.18),_transparent_65%)]" />
          </span>
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {message.content}
          </p>
          <button
            type="button"
            aria-label="Copy message"
            onClick={handleCopy}
            className={`absolute ${isUser ? '-left-5' : '-right-5'} top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-2 text-white/70 shadow-lg transition group-hover:flex group-hover:-translate-y-1/2 group-hover:items-center group-hover:justify-center hover:bg-white/20 hover:text-white`}
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 0 0-1.414 0L8.5 12.086l-2.793-2.793a1 1 0 0 0-1.414 1.414l3.5 3.5a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4m-2-8H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"
                />
              </svg>
            )}
          </button>
          {copied && (
            <span className={`absolute ${isUser ? 'right-6' : 'left-6'} -top-3 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-white/70 shadow-panel`}>Copied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const MessageBubble = memo(MessageBubbleComponent);
