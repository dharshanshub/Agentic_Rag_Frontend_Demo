import { useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { searchPlugin } from '@react-pdf-viewer/search';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

const PDFJS_WORKER_URL =
  'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js';

interface Props {
  pdfUrl: string;
  searchText: string;
  title: string;
  onClose: () => void;
}

/**
 * Extract 6 continuous words from the exact centre of the chunk.
 * Short enough to match a single PDF text line; positioned in the middle
 * so the scroll lands in the heart of the relevant paragraph.
 */
function toSearchPhrase(chunk: string): string {
  const words = chunk
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter((w) => w.length > 0);

  if (words.length <= 6) return words.join(' ');

  const mid = Math.floor(words.length / 2);
  const start = Math.max(mid - 3, 0);
  return words.slice(start, start + 6).join(' ');
}

function toProxyUrl(blobUrl: string): string {
  try {
    const url = new URL(blobUrl);
    return `/blob-proxy${url.pathname}${url.search}`;
  } catch {
    return blobUrl;
  }
}

export default function PdfViewerModal({ pdfUrl, searchText, title, onClose }: Props) {
  const phrase = toSearchPhrase(searchText);
  const proxiedUrl = toProxyUrl(pdfUrl);

  const searchPluginInstance = searchPlugin({
    keyword: { keyword: phrase, matchCase: false },
    onHighlightKeyword: (props) => {
      const el = props.highlightEle as HTMLElement;
      el.style.backgroundColor = 'rgba(251, 191, 36, 0.45)';
      el.style.borderRadius = '3px';
      el.style.outline = '1.5px solid rgba(217, 119, 6, 0.55)';
      el.style.boxShadow = 'inset 3px 0 0 rgba(217, 119, 6, 0.8)';
      el.style.padding = '1px 2px';
    },
  });

  const { highlight, jumpToNextMatch, jumpToPreviousMatch } = searchPluginInstance;

  function handleDocumentLoad() {
    [700, 1800, 3500].forEach((delay) => {
      setTimeout(() => {
        highlight({ keyword: phrase, matchCase: false });
        setTimeout(() => jumpToNextMatch(), 300);
      }, delay);
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col w-full max-w-5xl h-[92vh] rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="h-5 w-5 text-brand-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-slate-800 truncate">{title}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Prev / Next match navigation */}
            <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => jumpToPreviousMatch()}
                title="Previous match"
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors border-r border-slate-200 flex items-center gap-1"
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Prev
              </button>
              <button
                onClick={() => jumpToNextMatch()}
                title="Next match"
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                Next
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Open in new tab
            </a>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Search banner ── */}
        <div className="flex items-start gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex-shrink-0">
          <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Highlighting passage: </span>
              <span className="italic">&ldquo;{phrase}&rdquo;</span>
            </p>
            <p className="text-[11px] text-amber-500 mt-0.5">
              Matched phrase highlighted in amber · use Prev / Next to navigate
            </p>
          </div>
        </div>

        {/* ── PDF viewer ── */}
        <div className="flex-1 overflow-hidden">
          <Worker workerUrl={PDFJS_WORKER_URL}>
            <Viewer
              fileUrl={proxiedUrl}
              plugins={[searchPluginInstance]}
              onDocumentLoad={handleDocumentLoad}
              renderError={() => (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <svg className="h-12 w-12 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-700">Failed to load PDF</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">
                      The document could not be loaded inline.
                    </p>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                  >
                    Open PDF in new tab
                  </a>
                </div>
              )}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
