import type { FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import heroImage from './Assets/Images/OpenAI-ChatBot.jpg';
import { useChatApi } from './hooks/useChatApi';

const defaultCodeSnippet = `import pandas as pd  # widely_used_library_for_data_and_csv_file_processing

def preview_csv(file_path_parameter_that_points_to_a_specific_csv_document):
    df = pd.read_csv(file_path_parameter_that_points_to_a_specific_csv_document)
    print("Displaying the first structured five rows from the given dataset now")
    print(df.head())
    print("Verify that dataset contains necessary columns and correctly formatted values")

    print("Preview completed successfully for the provided CSV file input data")

preview_csv("data.csv_example_input_for_demonstration_purposes_in_this_context")`;

const tabs = ['c++', 'java', 'python'];
const seedLogs = [
  'Prepare NDA document',
  'Generating a Python Script to preview CSV files',
  'Troubleshoot CORS policy error',
  'Explain Transformer architecture',
  'Compare Python vs Go For Data Pipelines',
  'Create daily stand-up summary',
  'How does machine learning differ',
  'Draft email to client about project',
  'Ideas for push notifications campaign',
  'Summarize this 40-page PDF',
  'Transcribe and clean up this audio'
];

const bubbleBase = 'w-fit max-w-[min(70%,38rem)] rounded-3xl px-5 py-3 text-[0.95rem] leading-relaxed shadow-sm transition-all duration-300';
const quickActions = [
  'Draft a product launch announcement',
  'Explain transformers to a beginner',
  'Generate integration test cases',
  'Summarize meeting notes',
  'Create a migration checklist'
];
const knowledgeCards = [
  { title: 'API Reference', detail: 'Latest GPT endpoints, rate limits, and pricing tiers.' },
  { title: 'Brand Voice', detail: 'Tone guidelines, vocabulary, and compliance reminders.' },
  { title: 'Context Window', detail: 'You can include up to 128K tokens in extended mode.' }
];

function App() {
  const { messages, sendMessage, isLoading, error } = useChatApi();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('python');
  const [selectedLog, setSelectedLog] = useState(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const totalMessages = messages.length;
  const userMessages = messages.filter((item) => item.role === 'user');
  const assistantMessages = messages.filter((item) => item.role === 'assistant');

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  }, [messages, isLoading]);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }
    setInput('');
    await sendMessage(trimmed);
  };

  const assistantPreview = useMemo(() => {
    const latestAssistant = [...messages].reverse().find((item) => item.role === 'assistant');
    return latestAssistant?.content ?? defaultCodeSnippet;
  }, [messages]);

  const conversationLogs = useMemo(() => {
    const userPrompts = messages.filter((item) => item.role === 'user').map((item) => item.content.trim());
    if (!userPrompts.length) {
      return seedLogs;
    }
    return [...new Set([...userPrompts.slice(-seedLogs.length), ...seedLogs])].slice(0, seedLogs.length);
  }, [messages]);

  const stats = useMemo(
    () => [
      { label: 'Messages', value: totalMessages.toString() },
      { label: 'User prompts', value: userMessages.length.toString() },
      {
        label: 'Assistant replies',
        value: assistantMessages.length ? assistantMessages.length.toString() : '0'
      }
    ],
    [assistantMessages.length, totalMessages, userMessages.length]
  );

  const conversationStatus = useMemo(() => {
    if (isLoading) {
      return 'Assistant is composing a response.';
    }
    if (!messages.length) {
      return 'Start a new conversation or load a saved log to begin collaborating.';
    }
    return 'Ready for your next prompt.';
  }, [isLoading, messages.length]);

  const highlightedLog = useMemo(() => {
    if (selectedLog < 0 || selectedLog >= conversationLogs.length) {
      return undefined;
    }
    return conversationLogs[selectedLog];
  }, [conversationLogs, selectedLog]);

  const interactionsLabel = messages.length ? `${messages.length} interactions` : 'No history yet';

  const visibleLogs = useMemo(() => conversationLogs.slice(0, 6), [conversationLogs]);

  const backgroundStyle = { backgroundImage: `url(${heroImage})` };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" style={backgroundStyle} />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/92" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.35),transparent_65%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.28),transparent_65%)] opacity-60" />

      <main className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col gap-8 px-6 py-10 sm:px-8 lg:px-12">
        <header className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.9)] backdrop-blur-2xl md:flex-row md:items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live session
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-[2.1rem]">Aurora Chat Workspace</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Focus on the conversation. Keep track of key prompts, review the latest assistant output, and ship answers faster with an uncluttered layout.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
              {interactionsLabel}
            </span>
            <button
              type="button"
              className="rounded-full bg-linear-to-r from-indigo-500 via-sky-500 to-teal-400 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              New conversation
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex flex-col gap-6">
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Conversation timeline</h2>
                  <p className="text-sm text-slate-400">{conversationStatus}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold uppercase tracking-[0.3em]">
                    Active tab
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-white">{activeTab}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold uppercase tracking-[0.3em]">
                    Auto scroll
                    <span className="h-2 w-4 rounded-full bg-emerald-400" />
                  </span>
                </div>
              </div>

              <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/65">
                <div className="pointer-events-none absolute inset-x-8 top-0 h-32 bg-linear-to-b from-indigo-500/20 to-transparent blur-3xl" />
                <div ref={scrollRef} className="scrollbar-thin flex h-112 flex-col gap-4 overflow-y-auto p-6">
                  {messages.length === 0 && !isLoading && (
                    <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400">
                      <p>Nothing here yet. Try a quick prompt below or paste your context to get started.</p>
                    </div>
                  )}
                  {messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <div key={message.id} className={`flex flex-col ${isUser ? 'items-end text-right' : 'items-start text-left'} gap-2`}>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{isUser ? 'You' : 'Assistant'}</span>
                        <div
                          className={`${bubbleBase} ${isUser
                              ? 'ml-auto bg-linear-to-r from-indigo-500 via-sky-500 to-teal-400 text-white shadow-lg ring-1 ring-white/20 hover:-translate-y-0.5'
                              : 'mr-auto border border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur-xl hover:-translate-y-0.5'
                            }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex flex-col items-start gap-2 text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Assistant</span>
                      <div className={`${bubbleBase} mr-auto border border-white/10 bg-slate-950/80 text-slate-300 backdrop-blur-xl`}>Assistant is composing…</div>
                    </div>
                  )}
                  {error && <p className="text-center text-sm text-rose-300">{error}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Prompt shortcuts</h3>
                <span className="text-xs text-slate-500">Tap to fill the composer</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/25 hover:text-white"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label htmlFor="composer" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Message
                  </label>
                  <input
                    id="composer"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Share context, ask a question, or paste requirements"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
                  >
                    Mic
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
                  >
                    File
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex h-12 w-28 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 via-sky-500 to-teal-400 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Session snapshot</h3>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm text-slate-300">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">Recent prompts</h3>
                <button
                  type="button"
                  onClick={() => setSelectedLog(-1)}
                  className="text-xs text-slate-400 transition hover:text-slate-200"
                >
                  Clear
                </button>
              </div>
              <nav className="space-y-2">
                {visibleLogs.map((log, index) => (
                  <button
                    key={`${log}-${index}`}
                    type="button"
                    onClick={() => setSelectedLog(index)}
                    className={`w-full rounded-2xl border px-3 py-2 text-left text-[0.9rem] transition ${index === selectedLog
                        ? 'border-indigo-400/50 bg-indigo-500/25 text-white shadow-lg'
                        : 'border-white/5 bg-white/5 text-slate-300 hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white'
                      }`}
                  >
                    {log}
                  </button>
                ))}
              </nav>
              <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-200">Pinned preview</p>
                <p className="mt-2 text-sm">
                  {highlightedLog ?? 'Select a prompt above to pin it and reuse the context in the composer.'}
                </p>
                {highlightedLog && (
                  <button
                    type="button"
                    onClick={() => handleQuickAction(highlightedLog)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-sky-500 to-teal-400 px-4 py-2 text-xs font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                  >
                    Load into composer
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Assistant output</h3>
                  <p className="text-xs text-slate-400">Latest reply preview</p>
                </div>
                <div className="flex items-center gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] transition ${activeTab === tab ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-white/10'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-xs text-slate-200">
                <pre className="h-64 overflow-y-auto whitespace-pre-wrap leading-6">{assistantPreview}</pre>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white">Copy</button>
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white">Run code</button>
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white">Download .py</button>
                <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-indigo-400/40 hover:bg-indigo-500/20 hover:text-white">Improve</button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Knowledge packs</h3>
              <div className="mt-3 space-y-3 text-xs text-slate-300">
                {knowledgeCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-1 text-[13px] text-slate-300">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
