import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading memories...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-diary-muted">
      <Loader2 className="w-8 h-8 animate-spin text-amber-800 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
