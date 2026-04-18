import { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatQuery } from '../services/api';
import type { ChatEntry } from '../types';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';

function ThinkingSkeleton() {
  return (
    <div className="flex justify-start animate-pulse">
      <div className="max-w-[90%] w-full rounded-2xl rounded-tl-sm border border-navy-700 bg-navy-800/80 px-5 py-4 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-navy-700" />
          <div className="h-3 w-20 rounded bg-navy-700" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-navy-700" />
          <div className="h-3 w-5/6 rounded bg-navy-700" />
          <div className="h-3 w-3/6 rounded bg-navy-700" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // sessionStorage keeps the ID alive for the tab session and clears on tab close.
  // useRef avoids stale-closure issues inside useCallback — the ref always holds
  // the latest value without needing to be listed as a dependency.
  const SESSION_KEY = 'di_conversation_id';
  const conversationIdRef = useRef<string | null>(sessionStorage.getItem(SESSION_KEY));

  const bottomRef       = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLDivElement>(null);

  // Scroll to skeleton while waiting
  useEffect(() => {
    if (loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loading]);

  // Scroll so AI answer is at the top of viewport when response arrives
  useEffect(() => {
    if (history.length > 0 && !loading) {
      setTimeout(() => latestAnswerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [history.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async (question: string, topK: number) => {
    setLoading(true);
    setError(null);
    setPendingQuestion(question);
    try {
      const response = await sendChatQuery({ question, top_k: topK, conversation_id: conversationIdRef.current });
      conversationIdRef.current = response.conversation_id;
      sessionStorage.setItem(SESSION_KEY, response.conversation_id);
      setHistory(prev => [...prev, {
        id: crypto.randomUUID(), question, topK, response, timestamp: new Date(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setPendingQuestion(null);
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col" style={{ background: 'linear-gradient(135deg, #0d1a3e 0%, #0a1628 55%, #0e1c3a 100%)' }}>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-navy-700/60 bg-navy-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          {/* Logo + app name */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-coral-500 flex items-center justify-center shadow-lg">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Decision Insight</h1>
              <p className="text-[11px] text-slate-500 leading-tight">Meeting Minutes Q&amp;A</p>
            </div>
          </div>

          {/* User greeting */}
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 leading-tight">Welcome back</p>
              <p className="text-sm font-semibold text-white leading-tight">Hi, User 👋</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-8">

          {/* Empty state */}
          {history.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
              <div className="h-16 w-16 rounded-2xl bg-navy-800/80 border border-navy-700 flex items-center justify-center mb-5 shadow-lg">
                <svg className="h-8 w-8 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Ask anything about your meetings</h2>
              <p className="text-sm text-slate-500 max-w-sm">
                Query your meeting minutes using natural language. I'll find the relevant documents and generate a precise answer.
              </p>
            </div>
          )}

          {/* Q&A history */}
          {history.map((entry, idx) => (
            <ChatMessage
              key={entry.id}
              entry={entry}
              ref={idx === history.length - 1 ? latestAnswerRef : undefined}
            />
          ))}

          {/* Pending question shown immediately + skeleton */}
          {loading && pendingQuestion && (
            <div className="space-y-4 animate-slide-up">
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-coral-500 px-4 py-3 text-sm text-white shadow-lg">
                  <p className="leading-relaxed">{pendingQuestion}</p>
                </div>
              </div>
              <ThinkingSkeleton />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-coral-800/40 bg-coral-950/20 px-4 py-3 flex items-start gap-3 animate-fade-in">
              <svg className="h-5 w-5 text-coral-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-coral-400">Error</p>
                <p className="text-sm text-coral-400/80 mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-coral-500 hover:text-coral-300 transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <ChatInput onSubmit={handleSubmit} disabled={loading} />
    </div>
  );
}
