import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Sparkles, PenLine } from 'lucide-react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import MemoryCard from '../components/MemoryCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function TimelinePage() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch memories with active filters
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedMood) params.mood = selectedMood;

      const res = await api.get('/memories', { params });
      setMemories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load timeline', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMemories();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, selectedMood]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMood('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    try {
      await api.delete(`/memories/${id}`);
      fetchMemories();
    } catch (err) {
      alert('Failed to delete memory');
    }
  };

  // Group memories by Month Year
  const groupedMemories = memories.reduce((acc, mem) => {
    const date = new Date(mem.memoryDate);
    const monthYear = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(mem);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 bg-parchment-200/80 px-3 py-1 rounded-full mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Chronological Memories</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-diary-ink">
            Your Diary Timeline
          </h1>
          <p className="text-xs sm:text-sm text-diary-muted">
            Relive your life experiences, thoughts, and milestones across time.
          </p>
        </div>

        <button
          onClick={() => navigate('/write')}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-800 text-white text-xs sm:text-sm font-semibold hover:bg-amber-900 shadow-sm transition-colors self-start sm:self-auto"
        >
          <PenLine className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMood={selectedMood}
        onMoodChange={setSelectedMood}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline Content */}
      {loading ? (
        <LoadingState message="Organizing your timeline..." />
      ) : memories.length === 0 ? (
        <EmptyState
          title="No memories found in timeline"
          description={
            searchTerm || selectedCategory || selectedMood
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Start by recording your first story.'
          }
          actionLabel={
            searchTerm || selectedCategory || selectedMood
              ? 'Reset All Filters'
              : 'Write a Memory'
          }
          onAction={
            searchTerm || selectedCategory || selectedMood
              ? handleClearFilters
              : () => navigate('/write')
          }
        />
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedMemories).map(([monthYear, items]) => (
            <div key={monthYear} className="relative">
              {/* Month Group Header */}
              <div className="sticky top-20 z-10 mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-parchment-200/90 backdrop-blur-md border border-diary-border text-xs sm:text-sm font-serif font-bold text-amber-900 shadow-xs">
                  {monthYear}
                </span>
              </div>

              {/* Timeline Spine Line */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-parchment-300 ml-4 space-y-6">
                {items.map((mem) => (
                  <div key={mem.id} className="relative">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full bg-amber-800 border-4 border-white shadow-xs" />

                    {/* Memory Card */}
                    <MemoryCard
                      memory={mem}
                      onClick={() => navigate(`/memories/${mem.id}`)}
                      onEdit={() => navigate(`/write?edit=${mem.id}`)}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
