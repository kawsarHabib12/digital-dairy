import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No memories found',
  description = 'Start writing your first memory today.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white/70 border border-diary-border border-dashed my-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-parchment-100 flex items-center justify-center text-amber-800 mb-4 border border-diary-border">
        <BookOpen className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-serif font-semibold text-diary-ink mb-1">{title}</h3>
      <p className="text-sm text-diary-muted max-w-sm mx-auto mb-5">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-800 text-white text-sm font-medium hover:bg-amber-900 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
