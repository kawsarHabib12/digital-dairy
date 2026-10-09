import React from 'react';

export const MOODS = [
  { name: 'Happy', emoji: '😊', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { name: 'Calm', emoji: '😌', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { name: 'Excited', emoji: '🤩', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { name: 'Sad', emoji: '😢', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { name: 'Anxious', emoji: '😰', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { name: 'Grateful', emoji: '🙏', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { name: 'Tired', emoji: '😴', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { name: 'Reflective', emoji: '🌿', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { name: 'Neutral', emoji: '😐', color: 'bg-stone-100 text-stone-800 border-stone-300' },
  { name: 'Angry', emoji: '😠', color: 'bg-red-100 text-red-800 border-red-300' },
  { name: 'Nostalgic', emoji: '☕', color: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export default function MoodBadge({ mood = 'Neutral', size = 'sm' }) {
  const currentMood = MOODS.find(m => m.name.toLowerCase() === mood?.toLowerCase()) || MOODS[7];

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1 text-sm' 
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${currentMood.color} ${sizeClasses}`}
    >
      <span>{currentMood.emoji}</span>
      <span>{currentMood.name}</span>
    </span>
  );
}
