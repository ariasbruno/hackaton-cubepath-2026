import React from 'react';

interface ModeFiltersProps {
  filters: string[];
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

export const ModeFilters: React.FC<ModeFiltersProps> = ({
  filters,
  activeFilter,
  onFilterClick,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar shrink-0">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterClick(filter)}
          className={`px-[14px] py-1.5 rounded-full font-bold text-[11px] uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
            activeFilter === filter
              ? 'bg-secondary text-white border-secondary shadow-hard-sm'
              : 'bg-white text-ink/40 border-ink/5 hover:border-ink/20'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
