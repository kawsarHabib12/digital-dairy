import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  ArrowRight, 
  Loader2,
  Calendar,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';
import MoodBadge from '../components/MoodBadge';

export default function AskDiaryPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your personal diary companion. Ask me anything about what you've written, where you've visited, or how your moods have changed over time.",
      sources: [],
    },
  ]);

  const sampleQuestions = [
    "What were some of my happiest memories?",
    "When did I visit Cox's Bazar?",
    "What did I write about my university or studies?",
    "Summarize what I did recently",
  ];

  const handleSend = async (qToSend) => {
    const query = qToSend || question;
    if (!query.trim() || loading) return;

    // Add user message
    const newChat = [...chatHistory, { sender: 'user', text: query.trim(), sources: [] }];
    setChatHistory(newChat);
    setQuestion('');
    setLoading(true);

    try {
      const res = await api.post('/ask', { question: query.trim() });
      const data = res.data.data;
      setChatHistory([
        ...newChat,
        {
          sender: 'ai',
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setChatHistory([
        ...newChat,
        {
          sender: 'ai',
          text: "I encountered an issue retrieving your memories. Please try asking again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-diary-border flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-900 bg-purple-100/70 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>AI Memory Recall & RAG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-diary-ink">
            Ask My Diary
          </h1>
          <p className="text-xs text-diary-muted">
            Ask questions grounded strictly in your personal journal entries.
          </p>
        </div>
      </div>

      {/* Suggested prompts row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-xs bg-white hover:bg-parchment-100 border border-diary-border text-diary-muted hover:text-amber-900 px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Canvas */}
      <div className="flex-1 bg-white rounded-3xl border border-diary-border shadow-diary p-4 sm:p-6 overflow-y-auto space-y-6 paper-texture mb-4">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                msg.sender === 'user'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-purple-100 text-purple-800 border border-purple-200 shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-800 text-white font-medium rounded-tr-none'
                  : 'bg-parchment-50 border border-diary-border text-diary-ink rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Source memory references if available */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-diary-border/60">
                  <span className="text-[11px] font-semibold text-diary-muted block mb-2">
                    Source Memories:
                  </span>
                  <div className="space-y-2">
                    {msg.sources.map((src) => (
                      <div
                        key={src.id}
                        onClick={() => navigate(`/memories/${src.id}`)}
                        className="p-2.5 rounded-xl border border-diary-border bg-white hover:bg-amber-50/60 cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="truncate mr-2">
                          <p className="font-semibold text-diary-ink text-xs group-hover:text-amber-900 truncate">
                            {src.title}
                          </p>
                          <p className="text-[10px] text-diary-muted">
                            {new Date(src.memoryDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <MoodBadge mood={src.mood} />
                          <ArrowRight className="w-3.5 h-3.5 text-diary-muted group-hover:text-amber-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-parchment-50 border border-diary-border text-diary-muted rounded-2xl rounded-tl-none p-4 text-xs flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
              <span>Searching your memories and reasoning...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your diary..."
          className="flex-1 px-4 py-3 rounded-2xl border border-diary-border bg-white text-xs sm:text-sm text-diary-ink focus:outline-none focus:ring-2 focus:ring-amber-800/30 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-5 py-3 rounded-2xl bg-amber-800 text-white text-xs sm:text-sm font-semibold hover:bg-amber-900 shadow-sm disabled:opacity-50 transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
