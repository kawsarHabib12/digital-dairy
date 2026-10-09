import React from 'react';

export default function TagBadge({ name, onClick }) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-parchment-100 text-diary-muted border border-diary-border hover:bg-parchment-200 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      #{name}
    </span>
  );
}
