import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

type ChatInputProps = {
  onSubmit: (value: string) => Promise<void> | void;
  disabled?: boolean;
  isLoading?: boolean;
};

export const ChatInput = ({ onSubmit, disabled = false, isLoading = false }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) {
        return;
      }
      setValue('');
      await onSubmit(trimmed);
    },
    [disabled, onSubmit, value]
  );

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit]
  );

  const hintText = useMemo(
    () => (isLoading ? 'Generating response…' : 'Press Enter • Shift+Enter for newline'),
    [isLoading]
  );

  const showHint = value.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative w-full overflow-hidden rounded-[2.25rem] border border-white/5 bg-white/5 p-5 shadow-panel backdrop-blur-xl transition-all duration-300 focus-within:border-white/10 focus-within:bg-white/10 focus-within:shadow-glow"
    >
      <div className="pointer-events-none absolute inset-x-8 -top-14 h-28 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_65%)] opacity-0 transition-opacity duration-500 group-focus-within:opacity-80" />
      <div className="mb-3 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/45">
        <span>Compose Message</span>
        <span>{hintText}</span>
      </div>
      <textarea
        name="prompt"
        aria-label="Send a message"
        placeholder="Summarize a customer transcript, generate release notes, or plan a demo script…"
        value={value}
        ref={textareaRef}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="max-h-52 min-h-[3.25rem] w-full resize-none bg-transparent pr-32 text-base leading-relaxed text-slate-100 placeholder:text-slate-400 focus:outline-none"
      />
      <div className="absolute bottom-5 right-5 flex items-center gap-3">
        <span
          className={`flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.32em] text-white/45 transition ${showHint ? 'opacity-100' : 'opacity-0 group-focus-within:opacity-100'}`}
        >
          {isLoading ? <LoadingDots /> : <HintIcon />}
          {isLoading ? 'Working' : 'Press Enter'}
        </span>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary via-accent-primary to-accent-secondary text-white shadow-lg ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? <LoadingDots /> : <SendIcon />}
        </button>
      </div>
    </form>
  );
};

const HintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10h10m0 0-3-3m3 3-3 3" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 13-7-4.5 7 4.5 7-13-7zm0 0h7" />
  </svg>
);

const LoadingDots = () => (
  <span className="flex items-center gap-1">
    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white/70" />
    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white/70 [animation-delay:120ms]" />
    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white/70 [animation-delay:240ms]" />
  </span>
);
