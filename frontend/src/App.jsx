import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { 
  Sparkles, 
  BookHeart, 
  Compass, 
  Search, 
  MapPin, 
  BrainCircuit, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';
import api from './services/api';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then(res => {
        setBackendStatus('connected');
        setBackendData(res.data);
      })
      .catch(() => {
        setBackendStatus('ready-to-connect');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-diary-cream">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-parchment-200 text-amber-900 border border-parchment-400/40 text-xs font-medium mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Phase 1 Initialized — Project Foundation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-diary-ink tracking-tight leading-tight mb-4">
            Your memories. Your story. <br />
            <span className="text-amber-800 italic">One intelligent diary.</span>
          </h1>

          <p className="text-base sm:text-lg text-diary-muted font-normal leading-relaxed">
            A personal digital diary that remembers with you. Beautiful paper-like writing, chronological timelines, 
            memory maps, and private AI-assisted recall.
          </p>
        </div>

        {/* Foundation Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Frontend */}
          <div className="p-6 bg-white rounded-2xl border border-diary-border shadow-diary transition-all hover:shadow-diary-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center mb-4">
              <BookHeart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-diary-ink mb-1.5">Frontend Client</h3>
            <p className="text-sm text-diary-muted mb-4">
              React + Vite with custom Tailwind digital diary palette, typography, and component structure.
            </p>
            <div className="flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Vite & Tailwind Active
            </div>
          </div>

          {/* Card 2: Backend */}
          <div className="p-6 bg-white rounded-2xl border border-diary-border shadow-diary transition-all hover:shadow-diary-lg">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-diary-ink mb-1.5">Backend Service</h3>
            <p className="text-sm text-diary-muted mb-4">
              NestJS modular architecture with TypeScript, DTO validation, and standard REST API foundation.
            </p>
            <div className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-lg w-fit border ${
              backendStatus === 'connected' 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
                : 'text-amber-700 bg-amber-50 border-amber-200/60'
            }`}>
              <Activity className="w-3.5 h-3.5 mr-1 animate-pulse" />
              {backendStatus === 'connected' ? 'API Connected (/api/health)' : 'Backend Initialized'}
            </div>
          </div>

          {/* Card 3: Architecture & Security */}
          <div className="p-6 bg-white rounded-2xl border border-diary-border shadow-diary transition-all hover:shadow-diary-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/60 flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-diary-ink mb-1.5">Privacy & AI Ready</h3>
            <p className="text-sm text-diary-muted mb-4">
              Strict user-isolated architecture, provider-agnostic abstractions, and pgvector-ready design.
            </p>
            <div className="flex items-center text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg w-fit border border-purple-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-purple-600" />
              Isolation Blueprint Ready
            </div>
          </div>
        </div>

        {/* Paper-like Preview Note */}
        <div className="bg-white rounded-2xl border border-diary-border shadow-diary p-8 relative overflow-hidden paper-texture">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-600/70" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-diary-border/80">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-800">
                Phase 1 Preview Note
              </span>
              <h2 className="text-xl font-serif font-bold text-diary-ink">
                Welcome to MemoAI Development
              </h2>
            </div>
            <div className="text-xs text-diary-muted font-mono bg-parchment-100 px-3 py-1.5 rounded-lg border border-diary-border">
              Env: development • Port: 5173
            </div>
          </div>
          <p className="text-diary-muted text-sm sm:text-base leading-relaxed mb-4">
            Phase 1 sets up the workspace foundation. In Phase 2, we will configure the PostgreSQL schema, 
            migrations, and seeds for categories and tags. Phases 3 to 5 establish the NestJS backend foundation 
            and diary CRUD before adding UI timeline, interactive maps, and AI insights.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-diary-muted">
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#react</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#vite</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#tailwindcss</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#nestjs</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#postgresql</span>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-diary-border bg-white/50 py-6 text-center text-xs text-diary-muted">
        MemoAI — Academic Full-Stack Software Engineering Project • Phase 1
      </footer>
    </div>
  );
}
