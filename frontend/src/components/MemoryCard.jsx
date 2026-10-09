import React from 'react';
import { Calendar, MapPin, Tag, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import MoodBadge from './MoodBadge';
import TagBadge from './TagBadge';

export default function MemoryCard({
  memory,
  onClick,
  onEdit,
  onDelete,
}) {
  const formattedDate = new Date(memory.memoryDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-diary-border p-5 shadow-diary hover:shadow-diary-lg transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 text-xs font-medium text-diary-muted">
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            {memory.category && (
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${memory.category.color}15` || '#f3f4f6',
                  color: memory.category.color || '#374151',
                  borderColor: `${memory.category.color}30` || '#e5e7eb',
                }}
              >
                {memory.category.name}
              </span>
            )}
            <MoodBadge mood={memory.mood} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-lg text-diary-ink group-hover:text-amber-900 transition-colors line-clamp-1 mb-2">
          {memory.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-diary-muted line-clamp-3 leading-relaxed mb-4">
          {memory.content}
        </p>

        {/* Image Thumbnail preview if available */}
        {memory.images && memory.images.length > 0 && (
          <div className="mb-4 rounded-xl overflow-hidden h-36 w-full bg-parchment-100 border border-diary-border">
            <img
              src={memory.images[0].imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Footer Details & Actions */}
      <div className="pt-3 border-t border-diary-border/60 flex items-center justify-between text-xs text-diary-muted">
        <div className="flex items-center space-x-3 overflow-hidden">
          {memory.locationName && (
            <span className="flex items-center space-x-1 truncate max-w-[140px] text-diary-muted">
              <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">{memory.locationName}</span>
            </span>
          )}

          {memory.tags && memory.tags.length > 0 && (
            <div className="flex items-center space-x-1 truncate">
              {memory.tags.slice(0, 2).map((t) => (
                <TagBadge key={t.id || t.name} name={t.name} />
              ))}
              {memory.tags.length > 2 && (
                <span className="text-xs text-diary-muted font-medium">
                  +{memory.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              onClick={() => onEdit(memory)}
              title="Edit memory"
              className="p-1.5 rounded-lg hover:bg-parchment-100 text-diary-muted hover:text-diary-ink transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(memory.id)}
              title="Delete memory"
              className="p-1.5 rounded-lg hover:bg-rose-50 text-diary-muted hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
