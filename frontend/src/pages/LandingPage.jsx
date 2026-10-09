import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookHeart, 
  Sparkles, 
  Compass, 
  MapPin, 
  Brain, 
  Lock, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-diary-cream flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-parchment-200 border border-parchment-400/40 text-xs font-semibold text-amber-900 mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>The Modern AI-Powered Digital Journal</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-diary-ink tracking-tight leading-[1.15] mb-6">
          Your memories. Your story. <br />
          <span className="text-amber-800 italic">One intelligent diary.</span>
        </h1>

        <p className="text-base sm:text-xl text-diary-muted max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          A personal digital diary that remembers with you. Record your daily thoughts, travels, moods, and photos in a soothing paper-like aesthetic — and let private AI help you rediscover them.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-800 text-white font-semibold text-sm hover:bg-amber-900 shadow-diary-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Your Diary Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white border border-diary-border text-diary-ink font-semibold text-sm hover:bg-parchment-100 shadow-diary transition-all"
          >
            Sign In to Existing Journal
          </Link>
        </div>

        {/* Paper Canvas Showcase Graphic */}
        <div className="relative mx-auto max-w-3xl bg-white rounded-3xl border border-diary-border shadow-diary-lg p-6 sm:p-8 paper-texture text-left">
          <div className="flex items-center justify-between pb-4 border-b border-diary-border/70 mb-4">
            <div className="flex items-center space-x-2 text-xs font-medium text-diary-muted">
              <Calendar className="w-4 h-4 text-amber-800" />
              <span>October 8, 2026 • 7:45 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                😊 Happy
              </span>
              <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                University
              </span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-diary-ink mb-2">
            My First Software Engineering Project Presentation
          </h2>
          <p className="text-sm sm:text-base text-diary-muted leading-relaxed font-sans mb-4">
            Today our team presented MemoAI to the faculty panel. The presentation went beyond our expectations! We demonstrated the timeline, the interactive memory map, and asked the diary about our first brainstorming session. Everything clicked together.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-diary-muted">
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#milestone</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#teamwork</span>
            <span className="bg-parchment-100 px-2.5 py-1 rounded-md border border-diary-border">#presentation</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-parchment-100/50 border-y border-diary-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-diary-ink mb-3">How MemoAI Works</h2>
            <p className="text-sm sm:text-base text-diary-muted">Three simple ways your memories come alive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-diary-border shadow-diary">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center font-serif font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-serif font-semibold text-lg text-diary-ink mb-2">Write with Emotion</h3>
              <p className="text-sm text-diary-muted leading-relaxed">
                Record your daily thoughts with paper-like writing, photos, location tags, and mood tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-diary-border shadow-diary">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 border border-purple-200/60 flex items-center justify-center font-serif font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-serif font-semibold text-lg text-diary-ink mb-2">Chronicle & Map</h3>
              <p className="text-sm text-diary-muted leading-relaxed">
                Experience your memories along an elegant timeline and see all the places you visited mapped out.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-diary-border shadow-diary">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center font-serif font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-serif font-semibold text-lg text-diary-ink mb-2">Ask Your Memories</h3>
              <p className="text-sm text-diary-muted leading-relaxed">
                Chat with your diary using private AI. Ask questions like "What were my happiest days last month?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Commitment */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/60 text-amber-800 flex items-center justify-center mb-4 border border-amber-200/60">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-diary-ink mb-3">
          100% Private. Strictly Isolated.
        </h2>
        <p className="text-sm sm:text-base text-diary-muted leading-relaxed max-w-xl mx-auto mb-8">
          Your personal diary entries belong only to you. Our architecture enforces strict cryptographic JWT user-level isolation across all queries, searches, and AI conversations.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-amber-800 text-white font-medium text-sm hover:bg-amber-900 transition-colors shadow-sm"
        >
          Create Your Private Diary Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-diary-border bg-white/70 py-6 text-center text-xs text-diary-muted">
        MemoAI — Academic Full-Stack Software Engineering Digital Diary Project
      </footer>
    </div>
  );
}
