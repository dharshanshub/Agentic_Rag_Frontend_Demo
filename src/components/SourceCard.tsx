import { useState } from 'react';
import type { SourceDocument } from '../types';
import PdfViewerModal from './PdfViewerModal';

interface Props { source: SourceDocument; index: number; }

function formatDate(raw: string | null): string {
  if (!raw) return 'Date unknown';
  try {
    return new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return raw; }
}

const EXCERPT_LENGTH = 200;

export default function SourceCard({ source, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const needsTruncation = source.chunk.length > EXCERPT_LENGTH;
  const displayText = expanded || !needsTruncation
    ? source.chunk
    : source.chunk.slice(0, EXCERPT_LENGTH) + '…';

  return (
    <>
      <div className="rounded-xl border border-navy-700 bg-navy-800/60 p-4 transition hover:border-navy-600 hover:bg-navy-800 animate-fade-in backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-coral-500/15 text-coral-500 text-xs font-semibold flex items-center justify-center border border-coral-500/30">
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-slate-200 truncate" title={source.title}>
              {source.title}
            </p>
          </div>

          <button
            onClick={() => setViewerOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-coral-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-coral-600 transition-colors shadow-md"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            View Source
          </button>
        </div>

        <p className="mt-1.5 ml-7 text-xs text-slate-600">{formatDate(source.date)}</p>

        <div className="mt-3 ml-7">
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap break-words">{displayText}</p>
          {needsTruncation && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-1 text-xs font-medium text-coral-500 hover:text-coral-400 transition-colors"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      {viewerOpen && (
        <PdfViewerModal
          pdfUrl={source.blob_url}
          searchText={source.chunk}
          title={source.title}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
