import { useEffect, useMemo, useRef, useState } from 'react';
import heroImage from './Assets/Images/OpenAI-ChatBot.jpg';
import { ChatInput } from './components/ChatInput';
import { MessageBubble } from './components/MessageBubble';
import { SuggestionChips } from './components/SuggestionChips';
import { useChatApi } from './hooks/useChatApi';

const formatClock = (value?: string) => {
  if (!value) {
    return '—';
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch (error) {
    return '—';
  }
};

const suggestionSeeds = [
  'Summarize the latest support conversations and list recurring themes.',
  'Draft a friendly release note for our next feature rollout.',
  'Generate onboarding tips for new teammates joining the AI squad.',
  'Explain how this chatbot can improve customer satisfaction metrics.'
];

const EmptyState = ({ onSelect }: { onSelect: (value: string) => void }) => (
  <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 px-10 py-12 text-center text-slate-200 shadow-panel backdrop-blur-2xl">
    <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_70%)]" />
    <div className="absolute inset-0 -z-10 animate-[float-slow_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_right,_rgba(86,233,255,0.35),_transparent_55%)]" />
    <div className="relative flex flex-col items-center gap-4">
      <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[0.63rem] font-semibold uppercase tracking-[0.32em] text-white/70">
        Enhanced AI Workspace
      </div>
      <h2 className="max-w-xl text-balance text-3xl font-semibold text-white sm:text-4xl">
        Your ideas, guided by an AI partner
      </h2>
      <p className="max-w-xl text-sm leading-relaxed text-white/60">
        Kick things off with a curated prompt or describe the insight you need. The assistant keeps the full context of your conversation, so every answer adapts to your goals.
      </p>
      <SuggestionChips suggestions={suggestionSeeds} onSelect={onSelect} />
    </div>
  </div>
);

const LoadingMessage = () => (
  <div className="flex w-full justify-start">
    <div className="relative flex max-w-[min(88%,38rem)] flex-col gap-3 rounded-3xl bg-surface-elevated/95 px-5 py-4 text-sm text-white/80 shadow-panel ring-1 ring-white/10 animate-slide-up-fade">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 shadow-glow ring-1 ring-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 4v6l3 3" />
          </svg>
        </span>
        Assistant
      </div>
      <div className="flex items-center gap-3 text-white/60">
        <span className="relative inline-flex h-2.5 w-10 overflow-hidden rounded-full bg-white/15">
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </span>
        Thinking…
      </div>
    </div>
  </div>
);

const ErrorBanner = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
    {message}
  </div>
);

function App() {
  const { messages, sendMessage, isLoading, error, resetConversation } = useChatApi();
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      setShowScrollToLatest(false);
      return;
    }

    const handleScroll = () => {
      const threshold = 120;
      const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
      const atBottom = distanceFromBottom < threshold;
      setShowScrollToLatest(!atBottom);
    };

    handleScroll();
    node.addEventListener('scroll', handleScroll);

    return () => {
      node.removeEventListener('scroll', handleScroll);
    };
  }, [messages.length, isLoading]);

  const conversationStats = useMemo(() => {
    const totalTurns = messages.length;
    const userTurns = messages.filter((item) => item.role === 'user').length;
    const assistantTurns = messages.filter((item) => item.role === 'assistant').length;

    return {
      totalTurns,
      userTurns,
      assistantTurns,
      metrics: [
        { label: 'Total turns', value: totalTurns },
        { label: 'You', value: userTurns },
        { label: 'Assistant', value: assistantTurns }
      ]
    };
  }, [messages]);

  const metrics = conversationStats.metrics;

  const assistantState = useMemo(() => {
    if (isLoading) {
      return {
        label: 'Generating response',
        helper: 'The assistant is crafting a reply for you.',
        badgeClass: 'border-accent-secondary/40 bg-accent-secondary/10 text-accent-secondary',
        dotClass: 'bg-accent-secondary animate-pulse-soft'
      };
    }

    if (error) {
      return {
        label: 'Needs attention',
        helper: error,
        badgeClass: 'border-red-400/40 bg-red-500/20 text-red-100',
        dotClass: 'bg-red-400 animate-pulse-soft'
      };
    }

    if (conversationStats.totalTurns > 0) {
      return {
        label: 'Ready for follow-ups',
        helper: 'Context synced from this session.',
        badgeClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
        dotClass: 'bg-emerald-300'
      };
    }

    return {
      label: 'Standing by',
      helper: 'Select a suggestion or write a custom prompt to get started.',
      badgeClass: 'border-white/10 bg-white/10 text-white/70',
      dotClass: 'bg-white/70'
    };
  }, [conversationStats.totalTurns, error, isLoading]);

  const insightPills = useMemo(() => {
    const total = conversationStats.totalTurns;
    const assistantShare = total > 0 ? Math.round((conversationStats.assistantTurns / total) * 100) : 0;
    const userShare = total > 0 ? Math.round((conversationStats.userTurns / total) * 100) : 0;
    const lastMessage = total > 0 ? messages[messages.length - 1] : null;

    return [
      {
        label: 'Conversation depth',
        value: total > 0 ? `${total} msgs` : 'No history',
        caption: total > 0 ? `${userShare}% prompts from you` : 'Start with a suggestion to move faster.'
      },
      {
        label: 'Assistant coverage',
        value: total > 0 ? `${assistantShare}%` : '—',
        caption: total > 0 ? 'Share of assistant responses' : 'Awaiting the first reply.'
      },
      {
        label: 'Last activity',
        value: formatClock(lastMessage?.createdAt),
        caption: isLoading ? 'Working on a new answer.' : total > 0 ? 'Context locked and ready.' : 'Idle until you ask something.'
      }
    ];
  }, [conversationStats, isLoading, messages]);

  const handleSuggestion = (value: string) => {
    void sendMessage(value);
  };

  const handleScrollToLatest = () => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
    setShowScrollToLatest(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden text-slate-100 lg:flex-row">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(86,233,255,0.14),_transparent_55%)]" />
      <aside className="relative hidden w-full max-w-sm flex-col border-r border-white/5 bg-white/5 px-9 py-12 shadow-panel backdrop-blur-3xl lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_65%)]" />
        <div className="relative z-10 flex flex-1 flex-col gap-12">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
              Control Room
            </span>
            <h1 className="text-3xl font-semibold text-white">
              Open AI Chatbot
            </h1>
            <p className="text-sm leading-relaxed text-white/60">
              A refreshed interface built with React, Vite, Tailwind, and TypeScript to help you craft better conversations faster.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
              Conversation metrics
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-5 text-center shadow-panel"
                >
                  <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-white/50">{metric.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{metric.value}</dd>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
              Quick ideas
            </h2>
            <SuggestionChips suggestions={suggestionSeeds} onSelect={handleSuggestion} disabled={isLoading} />
          </div>

          <div className="mt-auto overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-panel">
            <img
              src={heroImage}
              alt="Chatbot illustration"
              className="h-full w-full object-cover object-center opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </aside>

      <main className="relative flex w-full flex-1 flex-col gap-8 px-4 py-10 sm:px-10 lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/10 to-transparent" />
        <nav className="relative flex flex-col gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/80 shadow-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6l4 2-4 2v6m0-6-4-2 4-2" />
              </svg>
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Workspace</p>
              <p className="text-lg font-semibold text-white">Open AI Copilot Studio</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm text-white/60 sm:items-end">
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.32em] text-white/70">
                Beta
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.24em] ${assistantState.badgeClass}`}>
                <span className={`h-2 w-2 rounded-full ${assistantState.dotClass}`} />
                {assistantState.label}
              </span>
            </div>
            <p className="text-xs text-white/50 sm:text-right">{assistantState.helper}</p>
          </div>
        </nav>
        <header className="relative flex flex-col gap-5 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-7 shadow-panel backdrop-blur-2xl">
          <div className="absolute inset-y-0 right-12 hidden w-48 bg-[radial-gradient(circle,_rgba(86,233,255,0.18),_transparent_75%)] blur-3xl lg:block" />
          <button
            type="button"
            onClick={resetConversation}
            aria-label="Reset conversation"
            className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 shadow-panel transition hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4 4 6 6m0 0 6 6M10 10l6-6M10 10 4 16" />
            </svg>
            <span className="sr-only">Reset conversation</span>
          </button>
          <div className="flex flex-col gap-4 pr-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
                Session overview
              </p>
              <h2 className="max-w-2xl text-balance text-2xl font-semibold text-white sm:text-3xl">
                Let’s explore what your assistant can build for you
              </h2>
            </div>
          </div>
          {suggestionSeeds.length > 0 && (
            <SuggestionChips suggestions={suggestionSeeds} onSelect={handleSuggestion} disabled={isLoading} />
          )}
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {insightPills.map((item) => (
            <div key={item.label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(127,90,240,0.22),_transparent_70%)] opacity-70" />
              <div className="relative space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">{item.label}</p>
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="text-xs text-white/60">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-panel backdrop-blur-2xl">
          <div className="absolute inset-x-8 top-10 hidden h-32 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.22),_transparent_70%)] lg:block" />
          <div className="relative flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
            <div ref={scrollRef} className="flex h-full flex-col space-y-7 overflow-y-auto p-6 sm:p-10">
              {messages.length > 0 && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.63rem] font-semibold uppercase tracking-[0.32em] text-white/50 shadow-panel">
                    <span className="h-px w-8 bg-white/15" />
                    Conversation timeline · {conversationStats.totalTurns} {conversationStats.totalTurns === 1 ? 'message' : 'messages'}
                    <span className="h-px w-8 bg-white/15" />
                  </div>
                </div>
              )}
              {messages.length === 0 && !isLoading ? (
                <EmptyState onSelect={handleSuggestion} />
              ) : (
                messages.map((message) => <MessageBubble key={message.id} message={message} />)
              )}
              {isLoading && <LoadingMessage />}
              {error && <ErrorBanner message={error} />}
              <div ref={endRef} />
            </div>
          </div>
          {showScrollToLatest && (
            <button
              type="button"
              onClick={handleScrollToLatest}
              className="absolute bottom-[6.5rem] right-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/80 shadow-panel transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary animate-pulse-soft" />
              Back to latest
            </button>
          )}
          <div className="border-t border-white/10 bg-surface/80 p-4 sm:p-6">
            <ChatInput onSubmit={sendMessage} disabled={isLoading} isLoading={isLoading} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
