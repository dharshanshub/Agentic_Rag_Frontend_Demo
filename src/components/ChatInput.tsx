import { useState, useRef, useEffect } from 'react';

interface Props {
  onSubmit: (question: string, topK: number) => void;
  disabled: boolean;
}

export default function ChatInput({ onSubmit, disabled }: Props) {
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(5);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }, [question]);

  const canSubmit = question.trim().length > 0 && !disabled;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (canSubmit) submit(); }
  }

  function submit() {
    const trimmed = question.trim();
    if (!trimmed) return;
    onSubmit(trimmed, topK);
    setQuestion('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  return (
    <div className="flex-shrink-0 border-t border-navy-700 bg-navy-900/95 backdrop-blur-sm px-4 py-4">
      <div className="mx-auto max-w-3xl">
        {/* Sources row */}
        <div className="mb-2 flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500" htmlFor="topk-select">Sources</label>
          <select
            id="topk-select"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            disabled={disabled}
            className="rounded-lg border border-navy-600 bg-navy-800 px-2.5 py-1 text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-coral-500 disabled:opacity-50"
          >
            {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {/* Input */}
        <div className="flex items-end gap-3 rounded-2xl border border-navy-600 bg-navy-800/80 px-4 py-3 focus-within:border-coral-500 focus-within:ring-2 focus-within:ring-coral-500/20 transition backdrop-blur-sm">
          <textarea
            ref={textareaRef}
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask a question about your meeting minutes…"
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none disabled:opacity-50 leading-relaxed"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="flex-shrink-0 h-9 w-9 rounded-xl bg-coral-500 text-white flex items-center justify-center transition hover:bg-coral-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            aria-label="Send"
          >
            {disabled ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-[11px] text-slate-700">
            <kbd className="rounded bg-navy-700 px-1 py-0.5 font-mono text-[10px] text-slate-500">Enter</kbd> to send ·{' '}
            <kbd className="rounded bg-navy-700 px-1 py-0.5 font-mono text-[10px] text-slate-500">Shift+Enter</kbd> for new line
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-600 italic shrink-0">
            <svg className="h-3 w-3 text-slate-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Results are AI-generated and should be independently verified.
          </p>
        </div>
      </div>
    </div>
  );
}
