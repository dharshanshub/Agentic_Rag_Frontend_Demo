import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { ChatEntry } from '../types';
import SourceCard from './SourceCard';

interface Props {
  entry: ChatEntry;
}

const NOT_FOUND_PHRASES = [
  'i could not find', 'could not find the answer',
  'no relevant information', "i don't have", 'i do not have',
];

function isNotFoundAnswer(answer: string) {
  const lower = answer.toLowerCase();
  return NOT_FOUND_PHRASES.some((p) => lower.includes(p));
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Custom renderers styled for the dark navy theme
const mdComponents: Components = {
  // Tables
  table: ({ ...props }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
      <table className="min-w-full text-sm" {...props} />
    </div>
  ),
  thead: ({ ...props }) => (
    <thead className="bg-white/[0.07]" {...props} />
  ),
  th: ({ ...props }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide border-b border-white/10" {...props} />
  ),
  td: ({ ...props }) => (
    <td className="px-4 py-2.5 text-slate-300 border-b border-white/5 last:border-0" {...props} />
  ),
  tr: ({ ...props }) => (
    <tr className="hover:bg-white/[0.03] transition-colors" {...props} />
  ),
  // Text elements
  p: ({ ...props }) => (
    <p className="text-sm leading-relaxed mb-3 last:mb-0" {...props} />
  ),
  strong: ({ ...props }) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: ({ ...props }) => (
    <em className="italic text-slate-400" {...props} />
  ),
  // Lists
  ul: ({ ...props }) => (
    <ul className="list-disc list-inside space-y-1 my-2 text-sm text-slate-300" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 text-sm text-slate-300" {...props} />
  ),
  li: ({ ...props }) => (
    <li className="leading-relaxed" {...props} />
  ),
  // Code
  code: ({ ...props }) => (
    <code className="bg-white/10 rounded px-1.5 py-0.5 text-xs font-mono text-coral-300" {...props} />
  ),
  // Headings
  h1: ({ ...props }) => <h1 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
  h2: ({ ...props }) => <h2 className="text-sm font-bold text-white mt-3 mb-1.5" {...props} />,
  h3: ({ ...props }) => <h3 className="text-sm font-semibold text-slate-200 mt-2 mb-1" {...props} />,
};

const ChatMessage = forwardRef<HTMLDivElement, Props>(({ entry }, ref) => {
  const noAnswer = isNotFoundAnswer(entry.response.answer);

  return (
    <div className="animate-slide-up space-y-4">
      {/* User question bubble */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-coral-500 px-4 py-3 text-sm text-white shadow-lg">
          <p className="leading-relaxed">{entry.question}</p>
          <p className="mt-1 text-right text-[10px] text-coral-200">{formatTime(entry.timestamp)}</p>
        </div>
      </div>

      {/* Answer + sources */}
      <div className="flex justify-start">
        <div className="max-w-[90%] w-full space-y-4">

          {/* Answer card */}
          <div
            ref={ref}
            className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.07] px-5 py-4 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-coral-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Answer</span>
            </div>

            {noAnswer ? (
              <p className="text-sm italic text-slate-500">{entry.response.answer}</p>
            ) : (
              <div className="text-slate-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {entry.response.answer}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Sources */}
          {entry.response.sources.length === 0 ? (
            <p className="text-xs text-slate-600 pl-1">No relevant sources found.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide pl-1">
                Sources — {entry.response.sources.length} document{entry.response.sources.length !== 1 ? 's' : ''}
              </p>
              {entry.response.sources.map((src, i) => (
                <SourceCard key={`${src.title}-${i}`} source={src} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
export default ChatMessage;
