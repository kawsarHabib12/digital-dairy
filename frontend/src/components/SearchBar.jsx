import React from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { MOODS } from './MoodBadge';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedMood,
  onMoodChange,
  onClearFilters,
}) {
  const hasActiveFilters = searchTerm || selectedCategory || selectedMood;

  return (
    <div className="bg-white rounded-2xl border border-diary-border p-4 shadow-diary mb-6 space-y-3">
      {/* Search Input Row */}
      <div className="relative">
        <Search className="w-4 h-4 text-diary-muted absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search memories by title, content, or place..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-diary-border bg-parchment-50/50 text-xs sm:text-sm text-diary-ink placeholder:text-diary-muted/60 focus:outline-none focus:ring-1 focus:ring-amber-800"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-diary-muted hover:text-diary-ink"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-diary-border/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-diary-muted font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-diary-border bg-parchment-50/50 text-diary-ink text-xs focus:outline-none focus:ring-1 focus:ring-amber-800 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Mood Dropdown */}
          <select
            value={selectedMood}
            onChange={(e) => onMoodChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-diary-border bg-parchment-50/50 text-diary-ink text-xs focus:outline-none focus:ring-1 focus:ring-amber-800 font-medium"
          >
            <option value="">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.name} value={m.name}>
                {m.emoji} {m.name}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-amber-800 hover:text-amber-900 font-medium hover:underline flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
