import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-diary-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-parchment-200 border border-parchment-400/40 flex items-center justify-center text-diary-accent shadow-sm">
            <BookOpen className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-xl tracking-tight text-diary-ink">MemoAI</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                Phase 1
              </span>
            </div>
            <p className="text-[11px] text-diary-muted tracking-wide font-medium hidden sm:block">
              AI-Powered Digital Diary
            </p>
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <span className="text-xs text-diary-muted font-medium bg-parchment-100 px-3 py-1.5 rounded-full border border-diary-border">
            Foundation Ready
          </span>
        </nav>
      </div>
    </header>
  );
}
