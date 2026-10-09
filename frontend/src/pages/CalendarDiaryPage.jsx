import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  PenLine, 
  Feather, 
  Clock, 
  MapPin, 
  Filter, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Smile
} from 'lucide-react';
import api from '../services/api';
import MoodBadge, { MOODS } from '../components/MoodBadge';
import LoadingState from '../components/LoadingState';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarDiaryPage() {
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Calendar view navigation state
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Filters state
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEntryType, setSelectedEntryType] = useState('All');

  // Data state
  const [categories, setCategories] = useState([]);
  const [monthData, setMonthData] = useState({});
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data?.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch calendar month data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams({
      year: currentYear.toString(),
      month: currentMonth.toString(),
    });

    if (selectedMood !== 'All') params.append('mood', selectedMood);
    if (selectedCategory !== 'All') params.append('categoryId', selectedCategory);
    if (selectedEntryType !== 'All') params.append('entryType', selectedEntryType);

    api.get(`/memories/calendar?${params.toString()}`)
      .then((res) => {
        if (isMounted) {
          setMonthData(res.data?.data?.days || res.data?.days || {});
        }
      })
      .catch((err) => {
        console.warn('Falling back to local month filtering', err);
        // Fallback: fetch all memories and group client-side
        api.get('/memories')
          .then((res) => {
            if (!isMounted) return;
            const memories = res.data?.data || [];
            const daysMap = {};
            memories.forEach((m) => {
              const d = m.memoryDate;
              if (!daysMap[d]) {
                daysMap[d] = { count: 0, moods: [], entries: [] };
              }
              daysMap[d].count++;
              if (m.mood && !daysMap[d].moods.includes(m.mood)) {
                daysMap[d].moods.push(m.mood);
              }
              daysMap[d].entries.push(m);
            });
            setMonthData(daysMap);
          })
          .catch((e) => console.error(e));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentYear, currentMonth, selectedMood, selectedCategory, selectedEntryType]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Jump to today
  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    setSelectedDate(todayStr);
  };

  // Compute calendar matrix (including previous and next month boundary cells)
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0-6
    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    const cells = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevY = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Leading days from next month to fill grid row
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextY = currentMonth === 12 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Entries for currently selected date
  const selectedDateEntries = useMemo(() => {
    return monthData[selectedDate]?.entries || [];
  }, [monthData, selectedDate]);

  // Formatted month and year header string
  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-parchment-200 border border-diary-border text-amber-900 text-xs sm:text-sm font-semibold mb-2.5">
            <CalendarIcon className="w-4 h-4 text-amber-800" />
            <span>Memory Journey</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-diary-ink tracking-tight">
            Your Diary Calendar
          </h1>
          <p className="text-base sm:text-lg text-diary-muted mt-1">
            Every day has a story. Navigate through your days and cherish each moment.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/reflection')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-diary-border text-diary-ink hover:bg-parchment-100 text-sm font-semibold transition-colors shadow-2xs"
          >
            <Feather className="w-4 h-4 text-emerald-800" />
            <span>Daily Reflection</span>
          </button>
          <button
            onClick={() => navigate(`/write?date=${selectedDate}`)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-sm font-semibold transition-colors shadow-sm"
          >
            <PenLine className="w-4 h-4" />
            <span>Write a Memory</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-diary-border shadow-xs mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 text-diary-muted font-semibold text-xs sm:text-sm uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-800" />
          <span>Filters:</span>
        </div>

        {/* Mood Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-diary-muted font-medium">Mood:</span>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-diary-border bg-parchment-50 text-xs sm:text-sm font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="All">All Moods</option>
            {MOODS.map((m) => (
              <option key={m.name} value={m.name}>
                {m.emoji} {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-diary-muted font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-diary-border bg-parchment-50 text-xs sm:text-sm font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-diary-muted font-medium">Type:</span>
          <select
            value={selectedEntryType}
            onChange={(e) => setSelectedEntryType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-diary-border bg-parchment-50 text-xs sm:text-sm font-medium text-diary-ink focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="All">All Entries</option>
            <option value="regular">Regular Diary</option>
            <option value="reflection">Daily Reflection</option>
          </select>
        </div>

        {(selectedMood !== 'All' || selectedCategory !== 'All' || selectedEntryType !== 'All') && (
          <button
            onClick={() => {
              setSelectedMood('All');
              setSelectedCategory('All');
              setSelectedEntryType('All');
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Grid: Calendar Grid (Left) + Selected Date Details Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Side (col-span-7 or 8) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-diary-border shadow-xs">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-diary-border">
            <div className="flex items-center space-x-3">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-diary-ink">
                {monthName}
              </h2>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-3 py-1 rounded-full text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 transition-colors border border-amber-300/60"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                title="Previous month"
                className="p-2 rounded-xl text-diary-muted hover:text-diary-ink hover:bg-parchment-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                title="Next month"
                className="p-2 rounded-xl text-diary-muted hover:text-diary-ink hover:bg-parchment-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-bold text-xs sm:text-sm text-diary-muted uppercase tracking-wider mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Month Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell) => {
              const dayData = monthData[cell.dateStr];
              const entryCount = dayData?.count || 0;
              const hasEntries = entryCount > 0;
              const isSelected = selectedDate === cell.dateStr;
              const isToday = todayStr === cell.dateStr;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[4rem] sm:min-h-[5.25rem] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-start text-left border transition-all relative group ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-800/30'
                      : isToday
                      ? 'bg-amber-50/70 border-amber-400/80 text-diary-ink hover:bg-amber-100/50'
                      : cell.isCurrentMonth
                      ? 'bg-white border-diary-border/80 text-diary-ink hover:bg-parchment-50 hover:border-parchment-400'
                      : 'bg-parchment-50/50 border-transparent text-diary-muted/40 hover:bg-parchment-100/50'
                  }`}
                >
                  {/* Day Number and Today Indicator */}
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isSelected
                          ? 'text-white'
                          : isToday
                          ? 'text-amber-900 font-extrabold'
                          : cell.isCurrentMonth
                          ? 'text-diary-ink'
                          : 'text-diary-muted/50'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Today Badge */}
                    {isToday && !isSelected && (
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-amber-200 text-[10px] font-bold text-amber-900">
                        Today
                      </span>
                    )}

                    {/* Entry Count Badge */}
                    {hasEntries && (
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {entryCount}
                      </span>
                    )}
                  </div>

                  {/* Mood dots preview */}
                  <div className="w-full mt-1 flex flex-wrap items-center gap-1">
                    {hasEntries && (
                      <div className="flex items-center space-x-1">
                        {dayData.moods?.slice(0, 3).map((m, idx) => {
                          const moodObj = MOODS.find((md) => md.name.toLowerCase() === m?.toLowerCase());
                          return (
                            <span
                              key={idx}
                              title={m}
                              className="text-xs sm:text-sm leading-none"
                            >
                              {moodObj?.emoji || '•'}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel (Right Side, col-span-5 or 4) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-diary-border shadow-xs sticky top-24">
          <div className="flex items-start justify-between pb-4 border-b border-diary-border">
            <div>
              <span className="text-xs font-semibold text-diary-muted uppercase tracking-wider block mb-1">
                Selected Day
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-diary-ink">
                {formattedSelectedDate}
              </h3>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-parchment-200 border border-diary-border text-xs font-bold text-diary-ink">
                {selectedDateEntries.length}{' '}
                {selectedDateEntries.length === 1 ? 'Entry' : 'Entries'}
              </span>
            </div>
          </div>

          {/* List of Entries for Selected Date */}
          <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {selectedDateEntries.length > 0 ? (
              selectedDateEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => navigate(`/memories/${entry.id}`)}
                  className="group p-5 rounded-2xl bg-parchment-50 border border-diary-border hover:border-amber-700/60 hover:bg-parchment-100 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <MoodBadge mood={entry.mood} size="sm" />
                      {entry.category && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: `${entry.category.color}15` || '#f3f4f6',
                            color: entry.category.color || '#374151',
                            borderColor: `${entry.category.color}30` || '#e5e7eb',
                          }}
                        >
                          {entry.category.name}
                        </span>
                      )}
                      {entry.entryType === 'reflection' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Reflection
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-serif font-bold text-base sm:text-lg text-diary-ink group-hover:text-amber-900 transition-colors line-clamp-1 mb-1.5">
                    {entry.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-diary-muted line-clamp-2 leading-relaxed mb-3">
                    {entry.contentPreview || entry.content || 'No preview available.'}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:translate-x-0.5 transition-transform">
                    <span>Read memory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 px-4 bg-parchment-50/70 rounded-2xl border border-dashed border-diary-border">
                <BookOpen className="w-10 h-10 text-diary-muted/50 mx-auto mb-3" />
                <h4 className="font-serif font-bold text-lg text-diary-ink mb-1">
                  No entries for this day yet.
                </h4>
                <p className="text-xs sm:text-sm text-diary-muted mb-5 leading-relaxed">
                  Capture the story of this date or record a peaceful evening reflection.
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => navigate(`/write?date=${selectedDate}`)}
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>Write About This Day</span>
                  </button>

                  <button
                    onClick={() => navigate('/reflection')}
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-diary-border text-diary-ink hover:bg-parchment-100 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Feather className="w-4 h-4 text-emerald-800" />
                    <span>Start Daily Reflection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
