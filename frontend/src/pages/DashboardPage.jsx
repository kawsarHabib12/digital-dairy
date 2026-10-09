import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookHeart, 
  PenLine, 
  Sparkles, 
  MapPin, 
  Smile, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import MemoryCard from '../components/MemoryCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import MoodBadge from '../components/MoodBadge';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    placesVisited: 0,
    favoriteMood: 'Calm',
  });

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/memories');
      const list = res.data.data || [];
      setMemories(list);

      // Compute stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthCount = list.filter((m) => {
        const d = new Date(m.memoryDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      const uniquePlaces = new Set(
        list.map((m) => m.locationName).filter(Boolean)
      ).size;

      // Mood frequency
      const moodCounts = {};
      list.forEach((m) => {
        if (m.mood) moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      });
      let topMood = 'Calm';
      let maxCount = 0;
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topMood = mood;
        }
      });

      setStats({
        total: list.length,
        thisMonth: thisMonthCount,
        placesVisited: uniquePlaces,
        favoriteMood: list.length > 0 ? topMood : 'Ready to record',
      });
    } catch (err) {
      console.error('Failed to load memories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    try {
      await api.delete(`/memories/${id}`);
      fetchMemories();
    } catch (err) {
      alert('Failed to delete memory');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-3xl border border-diary-border p-6 sm:p-8 mb-8 shadow-diary relative overflow-hidden paper-texture">
        <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-amber-800" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 bg-parchment-200/80 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Today's Journal Entry Awaits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-diary-ink">
              Welcome back, {user?.name || 'Friend'} —{' '}
              <span className="text-amber-800 italic font-normal">Capture today's story.</span>
            </h1>
            <p className="text-sm text-diary-muted mt-1 max-w-xl">
              Every day holds moments worth remembering. Write your reflections, record your travels, or chat with past memories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/write"
              className="px-5 py-2.5 rounded-xl bg-amber-800 text-white font-medium text-xs sm:text-sm hover:bg-amber-900 shadow-sm flex items-center space-x-2 transition-colors"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Memory</span>
            </Link>
            <Link
              to="/ask"
              className="px-4 py-2.5 rounded-xl bg-parchment-100 border border-diary-border text-diary-ink font-medium text-xs sm:text-sm hover:bg-parchment-200 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Ask My Diary</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-diary-border shadow-diary flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <BookHeart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-diary-muted font-medium">Total Memories</p>
            <p className="text-2xl font-serif font-bold text-diary-ink">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-diary-border shadow-diary flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-diary-muted font-medium">This Month</p>
            <p className="text-2xl font-serif font-bold text-diary-ink">{stats.thisMonth}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-diary-border shadow-diary flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-diary-muted font-medium">Places Visited</p>
            <p className="text-2xl font-serif font-bold text-diary-ink">{stats.placesVisited}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-diary-border shadow-diary flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-diary-muted font-medium">Favorite Mood</p>
            <p className="text-lg font-serif font-bold text-diary-ink truncate max-w-[120px]">
              {stats.favoriteMood}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Memories + Sidebar Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Memories */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-diary-ink">Recent Memories</h2>
              <p className="text-xs text-diary-muted">Your latest reflections and stories</p>
            </div>
            <Link
              to="/timeline"
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingState />
          ) : memories.length === 0 ? (
            <EmptyState
              title="Your diary is waiting for its first entry"
              description="Capture your thoughts, travel memories, or university moments today."
              actionLabel="Write Your First Memory"
              onAction={() => navigate('/write')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.slice(0, 4).map((m) => (
                <MemoryCard
                  key={m.id}
                  memory={m}
                  onClick={() => navigate(`/memories/${m.id}`)}
                  onEdit={() => navigate(`/write?edit=${m.id}`)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Mini Timeline & Map Quick-Links */}
        <div className="space-y-6">
          {/* Mini Timeline Widget */}
          <div className="bg-white p-6 rounded-2xl border border-diary-border shadow-diary">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-diary-border">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-800" />
                <h3 className="font-serif font-bold text-base text-diary-ink">Chronicle Snippet</h3>
              </div>
              <Link to="/timeline" className="text-xs text-amber-800 hover:underline">
                Explore
              </Link>
            </div>

            {memories.length === 0 ? (
              <p className="text-xs text-diary-muted italic">No timeline entries yet.</p>
            ) : (
              <div className="space-y-4">
                {memories.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/memories/${m.id}`)}
                    className="cursor-pointer group flex items-start space-x-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-700 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                    <div>
                      <p className="text-diary-muted font-medium text-[11px]">
                        {new Date(m.memoryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="font-medium text-diary-ink group-hover:text-amber-800 transition-colors line-clamp-1">
                        {m.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Preview Banner */}
          <div className="bg-parchment-100 p-6 rounded-2xl border border-diary-border text-center">
            <div className="w-10 h-10 rounded-xl bg-white mx-auto flex items-center justify-center text-amber-800 mb-3 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-diary-ink mb-1">
              Explore Memory Map
            </h3>
            <p className="text-xs text-diary-muted mb-4">
              Pinpoint places you've visited and read entries pinned directly onto the map.
            </p>
            <Link
              to="/map"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-diary-border text-xs font-semibold text-diary-ink hover:bg-parchment-200 transition-colors"
            >
              Open Memory Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
