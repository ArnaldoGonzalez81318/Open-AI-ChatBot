type SuggestionChipsProps = {
  suggestions: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export const SuggestionChips = ({ suggestions, onSelect, disabled = false }: SuggestionChipsProps) => {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:overflow-visible sm:pb-0">
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(suggestion)}
          className="group relative inline-flex shrink-0 snap-center items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-linear-to-br from-white/8 to-white/4 px-4 py-2 pr-5 text-sm font-semibold text-white/70 shadow-panel backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:-translate-y-0.5 hover:border-accent-secondary/60 hover:bg-linear-to-br hover:from-accent-secondary/20 hover:to-accent-secondary/10 hover:text-white hover:shadow-glow disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/0 disabled:text-white/30 disabled:hover:translate-y-0"
        >
          <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,166,255,0.3),transparent_70%)]" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-linear-to-br from-white/15 to-white/8 text-xs font-semibold uppercase tracking-[0.24em] text-white/65 shadow-panel backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-accent-secondary/50 group-hover:bg-linear-to-br group-hover:from-accent-secondary/30 group-hover:to-accent-secondary/20 group-hover:text-white group-hover:shadow-glow">
            {`${index + 1}`.padStart(2, '0')}
          </span>
          <span className="relative z-10 text-left leading-snug">{suggestion}</span>
        </button>
      ))}
    </div>
  );
};
