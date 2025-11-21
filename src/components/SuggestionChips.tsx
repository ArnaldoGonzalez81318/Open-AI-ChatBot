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
          className="group inline-flex shrink-0 snap-center items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-5 text-sm font-semibold text-white/70 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:border-accent-secondary/60 hover:bg-accent-secondary/10 hover:text-white disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/0 disabled:text-white/30"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold uppercase tracking-[0.24em] text-white/65 transition group-hover:border-accent-secondary/50 group-hover:bg-accent-secondary/20 group-hover:text-white">
            {`${index + 1}`.padStart(2, '0')}
          </span>
          <span className="text-left leading-snug">{suggestion}</span>
        </button>
      ))}
    </div>
  );
};
