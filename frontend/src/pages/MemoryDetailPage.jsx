import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Share2,
  Tag as TagIcon
} from 'lucide-react';
import api from '../services/api';
import MoodBadge from '../components/MoodBadge';
import TagBadge from '../components/TagBadge';
import LoadingState from '../components/LoadingState';

export default function MemoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/memories/${id}`)
      .then((res) => {
        setMemory(res.data.data);
      })
      .catch((err) => {
        setError('Memory not found or you do not have permission to view it.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    try {
      await api.delete(`/memories/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete memory');
    }
  };

  if (loading) return <LoadingState message="Reading your memory..." />;

  if (error || !memory) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-serif font-bold text-diary-ink mb-2">Notice</h2>
        <p className="text-sm text-diary-muted mb-6">{error || 'Memory could not be loaded.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formattedDate = new Date(memory.memoryDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-diary-border">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-diary-muted hover:text-diary-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/write?edit=${memory.id}`)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-diary-border bg-white text-xs font-semibold text-diary-ink hover:bg-parchment-100 transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Diary Page Reading Experience */}
      <article className="bg-white rounded-3xl border border-diary-border shadow-diary-lg p-6 sm:p-12 paper-texture relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-amber-800" />

        {/* Date and Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-diary-border/80">
          <div className="flex items-center space-x-2 text-xs font-medium text-diary-muted">
            <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            {memory.category && (
              <span
                className="text-xs font-semibold px-3 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${memory.category.color}15` || '#f3f4f6',
                  color: memory.category.color || '#374151',
                  borderColor: `${memory.category.color}30` || '#e5e7eb',
                }}
              >
                {memory.category.name}
              </span>
            )}
            <MoodBadge mood={memory.mood} size="lg" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-diary-ink leading-tight mb-8">
          {memory.title}
        </h1>

        {/* AI Summary Banner (if generated) */}
        {memory.aiAnalysis?.summary && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs sm:text-sm text-amber-900 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">AI Memory Digest</span>
              <p className="leading-relaxed">{memory.aiAnalysis.summary}</p>
            </div>
          </div>
        )}

        {/* Images Gallery */}
        {memory.images && memory.images.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memory.images.map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-diary-border shadow-sm max-h-72 bg-parchment-100">
                <img
                  src={img.imageUrl}
                  alt={`Memory photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Full Diary Content */}
        <div className="font-serif text-lg text-diary-ink leading-[1.8] whitespace-pre-wrap mb-10">
          {memory.content}
        </div>

        {/* Footer Metadata */}
        <div className="pt-6 border-t border-diary-border/80 flex flex-wrap items-center justify-between gap-4 text-xs text-diary-muted">
          {memory.locationName ? (
            <div className="flex items-center space-x-1.5 text-diary-muted">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span className="font-medium text-diary-ink">{memory.locationName}</span>
            </div>
          ) : (
            <div />
          )}

          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {memory.tags.map((t) => (
                <TagBadge key={t.id || t.name} name={t.name} />
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
