import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Save, 
  RotateCcw, 
  X, 
  ArrowLeft,
  Calendar,
  Heart,
  Feather,
  Edit3
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MOODS } from '../components/MoodBadge';

const REFLECTION_QUESTIONS = [
  {
    id: 'daySummary',
    heading: 'My Day',
    question: 'How was your day?',
    prompt: 'A few words on the general rhythm, tempo, and atmosphere of today...',
    icon: Calendar,
  },
  {
    id: 'bestMoment',
    heading: 'Best Moment',
    question: 'What was the best moment of your day?',
    prompt: 'A heartwarming conversation, a personal victory, a quiet breath, a good meal...',
    icon: Sparkles,
  },
  {
    id: 'challenges',
    heading: 'Challenges',
    question: 'What challenged you today?',
    prompt: 'Something that tested your patience, energy, courage, or resolve...',
    icon: Edit3,
  },
  {
    id: 'learned',
    heading: 'What I Learned',
    question: 'What did you learn today?',
    prompt: 'An unexpected insight about your project, work, relationships, or yourself...',
    icon: Feather,
  },
  {
    id: 'gratitude',
    heading: 'Gratitude',
    question: 'What are you grateful for today?',
    prompt: 'People, comforts, little moments of grace, or simple joys you appreciated...',
    icon: Heart,
  },
  {
    id: 'tomorrow',
    heading: 'Tomorrow',
    question: 'What would you like to do differently tomorrow?',
    prompt: 'A gentle intention, mindful adjustment, or peaceful goal for the day ahead...',
    icon: RotateCcw,
  },
];

const REFLECTION_MOODS = [
  'Happy',
  'Calm',
  'Excited',
  'Sad',
  'Anxious',
  'Grateful',
  'Tired',
  'Reflective',
];

export default function DailyReflectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Form State
  const [reflectionDate, setReflectionDate] = useState(todayStr);
  const [mood, setMood] = useState('Reflective');
  const [answers, setAnswers] = useState({
    daySummary: '',
    bestMoment: '',
    challenges: '',
    learned: '',
    gratitude: '',
    tomorrow: '',
  });

  // UI Flow State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [createdMemoryId, setCreatedMemoryId] = useState(null);

  // Unsaved changes check
  const hasUnsavedContent = Object.values(answers).some((val) => val.trim().length > 0);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedContent && !saveSuccess) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedContent, saveSuccess]);

  // Count answered questions
  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;
  const progressPercent = Math.round((answeredCount / REFLECTION_QUESTIONS.length) * 100);

  const handleAnswerChange = (id, text) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all your answers?')) {
      setAnswers({
        daySummary: '',
        bestMoment: '',
        challenges: '',
        learned: '',
        gratitude: '',
        tomorrow: '',
      });
    }
  };

  const generateCombinedEntry = () => {
    const sections = [];
    REFLECTION_QUESTIONS.forEach((q) => {
      const ans = answers[q.id]?.trim();
      if (ans) {
        sections.push(`### ${q.heading}\n${ans}`);
      }
    });

    const combinedText = sections.length > 0
      ? sections.join('\n\n')
      : 'A quiet reflection on today.';

    const defaultTitle = `Daily Reflection — ${new Date(reflectionDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;

    return {
      title: defaultTitle,
      content: combinedText,
    };
  };

  const handleOpenPreview = () => {
    if (answeredCount === 0) {
      alert('Please answer at least one question before previewing or saving your reflection.');
      return;
    }
    const { title, content } = generateCombinedEntry();
    setPreviewTitle(title);
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  const handleDirectSave = async () => {
    if (answeredCount === 0) {
      alert('Please write at least a sentence or answer one question before saving.');
      return;
    }
    const { title, content } = generateCombinedEntry();
    await submitMemory(title, content);
  };

  const handleSavePreview = async () => {
    await submitMemory(previewTitle, previewContent);
  };

  const submitMemory = async (titleToSave, contentToSave) => {
    if (saving) return; // Prevent duplicate submission
    setSaving(true);

    try {
      const payload = {
        title: titleToSave || `Daily Reflection — ${reflectionDate}`,
        content: contentToSave,
        memoryDate: reflectionDate,
        mood,
        entryType: 'reflection',
        reflectionAnswers: JSON.stringify(answers),
        tags: ['Daily Reflection', 'Reflection'],
      };

      const res = await api.post('/memories', payload);
      const savedId = res.data?.data?.id || 'new';

      setCreatedMemoryId(savedId);
      setSaveSuccess(true);
      setIsPreviewOpen(false);
    } catch (err) {
      console.error('Failed to save reflection', err);
      alert('Could not save your reflection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Back / Navigation button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (hasUnsavedContent && !saveSuccess) {
              if (window.confirm('You have unsaved reflection answers. Leave anyway?')) {
                navigate('/dashboard');
              }
            } else {
              navigate('/dashboard');
            }
          }}
          className="inline-flex items-center space-x-2 text-diary-muted hover:text-diary-ink transition-colors text-sm font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header section with calming aesthetic */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-emerald-900 text-xs sm:text-sm font-semibold mb-4 shadow-2xs">
          <Feather className="w-4 h-4 text-emerald-800" />
          <span>Mindful Daily Check-in</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-diary-ink tracking-tight mb-3">
          Take a Moment for Yourself
        </h1>
        <p className="text-base sm:text-lg text-diary-muted leading-relaxed">
          Reflect on your day, understand your feelings, and capture the moments that matter.
        </p>

        {/* Date & Greeting Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-diary-muted font-medium bg-parchment-100/80 px-4 py-2.5 rounded-2xl border border-diary-border inline-flex">
          <span className="font-semibold text-diary-ink">
            {user?.name ? `Hello, ${user.name}` : 'Welcome back'}
          </span>
          <span className="text-diary-muted/50">•</span>
          <span className="text-amber-900 font-serif italic">{formattedToday}</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="mb-10 bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center animate-in fade-in duration-300 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-emerald-900 mb-1">
            Reflection Saved Peacefully
          </h3>
          <p className="text-sm text-emerald-800 mb-5">
            Your reflection has been safely recorded into your personal diary.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/timeline')}
              className="px-5 py-2.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors shadow-xs"
            >
              View in Timeline
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="px-5 py-2.5 rounded-xl bg-white border border-diary-border text-diary-ink text-sm font-semibold hover:bg-parchment-100 transition-colors"
            >
              Open Calendar
            </button>
            <button
              onClick={() => {
                setSaveSuccess(false);
                setAnswers({
                  daySummary: '',
                  bestMoment: '',
                  challenges: '',
                  learned: '',
                  gratitude: '',
                  tomorrow: '',
                });
              }}
              className="px-4 py-2.5 rounded-xl text-diary-muted hover:text-diary-ink text-sm font-medium"
            >
              Write Another
            </button>
          </div>
        </div>
      )}

      {/* Main Form Body */}
      {!saveSuccess && (
        <div className="space-y-8">
          {/* Mood Selection Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-diary-border shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-diary-ink">
                  How are you feeling right now?
                </h2>
                <p className="text-xs sm:text-sm text-diary-muted mt-0.5">
                  Select the mood that best resonates with your overall day.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {REFLECTION_MOODS.map((moodName) => {
                const isSelected = mood.toLowerCase() === moodName.toLowerCase();
                const moodObj = MOODS.find((m) => m.name.toLowerCase() === moodName.toLowerCase()) || {
                  emoji: '✨',
                };
                return (
                  <button
                    key={moodName}
                    type="button"
                    onClick={() => setMood(moodName)}
                    className={`flex items-center space-x-2.5 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-100/70 border-amber-800 text-amber-950 ring-2 ring-amber-800/20 shadow-xs'
                        : 'bg-parchment-50 border-diary-border text-diary-ink hover:bg-parchment-100/80 hover:border-parchment-400'
                    }`}
                  >
                    <span className="text-xl">{moodObj.emoji}</span>
                    <span>{moodName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator Card */}
          <div className="bg-white/80 rounded-2xl px-6 py-4 border border-diary-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {answeredCount}/{REFLECTION_QUESTIONS.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-diary-ink">
                  {answeredCount === 0
                    ? 'Begin whenever you are ready'
                    : answeredCount === REFLECTION_QUESTIONS.length
                    ? 'All questions warmly completed!'
                    : `${answeredCount} of ${REFLECTION_QUESTIONS.length} questions answered`}
                </p>
                <p className="text-xs text-diary-muted">
                  Feel free to answer as few or as many as you like.
                </p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-28 sm:w-40 bg-parchment-200 h-2.5 rounded-full overflow-hidden shrink-0 ml-4">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Questions Grid */}
          <div className="space-y-6">
            {REFLECTION_QUESTIONS.map((q, index) => {
              const Icon = q.icon;
              const hasAnswer = answers[q.id]?.trim().length > 0;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all ${
                    hasAnswer
                      ? 'border-emerald-300/80 shadow-xs ring-1 ring-emerald-500/10'
                      : 'border-diary-border hover:border-parchment-400'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        hasAnswer
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-parchment-200 text-diary-muted'
                      }`}
                    >
                      <span>{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-diary-ink">
                        {q.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-diary-muted mt-0.5">
                        {q.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <textarea
                      rows={3}
                      value={answers[q.id]}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Write your thoughts freely here..."
                      className="w-full px-4 py-3 rounded-2xl bg-parchment-50/60 border border-diary-border text-base text-diary-ink placeholder:text-diary-muted/40 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all resize-y"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky/Fixed bottom action bar */}
          <div className="sticky bottom-6 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-diary-border shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={answeredCount === 0 || saving}
                className="px-4 py-2.5 rounded-xl border border-diary-border text-diary-muted hover:text-diary-ink hover:bg-parchment-100 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Clear Answers</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasUnsavedContent) {
                    if (window.confirm('Discard reflection answers?')) {
                      navigate('/dashboard');
                    }
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-diary-muted hover:text-rose-600 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleOpenPreview}
                disabled={answeredCount === 0 || saving}
                className="px-5 py-2.5 rounded-xl border border-amber-800 text-amber-900 bg-amber-50 hover:bg-amber-100 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center space-x-2 shadow-2xs"
              >
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Preview Entry</span>
              </button>

              <button
                type="button"
                onClick={handleDirectSave}
                disabled={answeredCount === 0 || saving}
                className="px-6 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center space-x-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Reflection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview and Edit Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-diary-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-diary-border flex items-center justify-between bg-parchment-50">
              <div className="flex items-center space-x-2">
                <Feather className="w-5 h-5 text-amber-800" />
                <h3 className="font-serif font-bold text-xl text-diary-ink">
                  Preview Your Reflection Entry
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-diary-muted hover:text-diary-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / Editable Preview */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs sm:text-sm text-diary-muted">
                Here is your formatted diary entry compiled from your reflection. You may polish or edit any words before saving.
              </p>

              <div>
                <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5">
                  Entry Title
                </label>
                <input
                  type="text"
                  value={previewTitle}
                  onChange={(e) => setPreviewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-diary-border font-serif font-bold text-lg text-diary-ink focus:outline-none focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-diary-muted uppercase tracking-wider mb-1.5">
                  Content (Formatted Entry)
                </label>
                <textarea
                  rows={10}
                  value={previewContent}
                  onChange={(e) => setPreviewContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-diary-border text-base text-diary-ink focus:outline-none focus:ring-2 focus:ring-amber-800/30 font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-diary-border bg-parchment-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl text-diary-muted hover:text-diary-ink text-sm font-semibold"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={handleSavePreview}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-sm font-semibold transition-colors disabled:opacity-50 inline-flex items-center space-x-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save to My Diary'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
