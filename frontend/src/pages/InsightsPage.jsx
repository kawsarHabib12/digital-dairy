import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Smile, 
  Tag, 
  MapPin, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import { MOODS } from '../components/MoodBadge';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/insights')
      .then((res) => setData(res.data.data))
      .catch((err) => console.error('Failed to load insights', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Analyzing your journal reflections..." />;

  const {
    totalMemories = 0,
    moodDistribution = {},
    categoryDistribution = {},
    topLocations = [],
    aiInsights = [],
  } = data || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-900 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Personal Analytics & Reflections</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-diary-ink">
          Personal Journal Insights
        </h1>
        <p className="text-xs sm:text-sm text-diary-muted">
          Discover patterns in your moods, topics, habits, and AI-synthesized life trends.
        </p>
      </div>

      {/* AI Trend Reflections Banner */}
      {aiInsights.length > 0 && (
        <div className="bg-white rounded-3xl border border-diary-border p-6 sm:p-8 shadow-diary relative overflow-hidden paper-texture">
          <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-amber-800" />
          <div className="flex items-center space-x-2 text-amber-800 font-semibold text-xs tracking-wider uppercase mb-3">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>AI Life Synthesizer</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-diary-ink mb-4">
            Recent Mindfulness & Growth Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-parchment-100/80 border border-diary-border text-xs sm:text-sm text-diary-ink leading-relaxed flex items-start space-x-3"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  {idx + 1}
                </div>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Mood Distribution */}
        <div className="bg-white rounded-2xl border border-diary-border p-6 shadow-diary">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-diary-border">
            <Smile className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif font-bold text-base text-diary-ink">Mood Distribution</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(moodDistribution).length === 0 ? (
              <p className="text-xs text-diary-muted italic">No mood records yet.</p>
            ) : (
              Object.entries(moodDistribution).map(([mood, count]) => {
                const moodObj = MOODS.find((m) => m.name.toLowerCase() === mood.toLowerCase()) || MOODS[7];
                const percentage = totalMemories > 0 ? Math.round((count / totalMemories) * 100) : 0;
                return (
                  <div key={mood} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-diary-ink">
                      <span>
                        {moodObj.emoji} {mood}
                      </span>
                      <span className="text-diary-muted">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-parchment-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-700 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 2: Categories Breakdown */}
        <div className="bg-white rounded-2xl border border-diary-border p-6 shadow-diary">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-diary-border">
            <Layers className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif font-bold text-base text-diary-ink">Topic Categories</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryDistribution).length === 0 ? (
              <p className="text-xs text-diary-muted italic">No categorised entries yet.</p>
            ) : (
              Object.entries(categoryDistribution).map(([cat, count]) => {
                const percentage = totalMemories > 0 ? Math.round((count / totalMemories) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-diary-ink">
                      <span>{cat}</span>
                      <span className="text-diary-muted">{count} entries</span>
                    </div>
                    <div className="w-full bg-parchment-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-700 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 3: Visited Locations */}
        <div className="bg-white rounded-2xl border border-diary-border p-6 shadow-diary">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-diary-border">
            <MapPin className="w-4 h-4 text-amber-800" />
            <h3 className="font-serif font-bold text-base text-diary-ink">Top Places Visited</h3>
          </div>

          <div className="space-y-3">
            {topLocations.length === 0 ? (
              <p className="text-xs text-diary-muted italic">No location memories recorded.</p>
            ) : (
              topLocations.map((loc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-parchment-50 border border-diary-border text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-bold text-amber-800">#{idx + 1}</span>
                    <span className="font-semibold text-diary-ink truncate">{loc.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white font-bold text-amber-900 border border-diary-border text-[11px] shrink-0">
                    {loc.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
