import { useState } from 'react';
import { runIngestion } from '../services/api';
import type { IngestionResult } from '../types';
import { Link } from 'react-router-dom';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(raw: string | null): string {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return raw; }
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IngestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRunIngestion() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await runIngestion());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="border-b border-navy-700 bg-navy-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Decision Insight</h1>
              <p className="text-[11px] text-slate-500 leading-tight">Admin · Ingestion Pipeline</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-navy-700 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Chat
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Ingestion Pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">
            Re-index all PDF documents from Azure Blob Storage. This downloads, embeds, and indexes every document.
          </p>
        </div>

        {/* Run button card */}
        <div className="rounded-2xl border border-navy-700 bg-navy-800 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center flex-shrink-0">
              <svg className="h-6 w-6 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Run Ingestion</p>
              <p className="text-sm text-slate-500">Fetch and index all documents in blob storage.</p>
            </div>
            <button
              onClick={handleRunIngestion}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Run Ingestion
                </>
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-900/50 px-4 py-3 text-sm text-slate-400 animate-fade-in">
              <svg className="h-4 w-4 text-brand-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Processing documents — this may take a few minutes…
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 flex items-start gap-3 mb-8 animate-fade-in">
            <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">Ingestion failed</p>
              <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-slide-up space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-5">
                <p className="text-3xl font-bold text-emerald-400">{result.total}</p>
                <p className="text-sm text-emerald-600 mt-1">Documents processed</p>
              </div>
              <div className="rounded-xl border border-brand-900/40 bg-brand-950/10 p-5">
                <p className="text-3xl font-bold text-brand-400">{result.total_chunks}</p>
                <p className="text-sm text-brand-600 mt-1">Total chunks indexed</p>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700 bg-navy-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-navy-700">
                <h3 className="font-semibold text-white">Indexed Documents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy-900/50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <th className="px-5 py-3">Filename</th>
                      <th className="px-5 py-3">Meeting Date</th>
                      <th className="px-5 py-3">File Size</th>
                      <th className="px-5 py-3">Chunks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-700">
                    {result.documents.map((doc) => (
                      <tr key={doc.filename} className="hover:bg-navy-700/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-200 max-w-xs truncate">{doc.filename}</td>
                        <td className="px-5 py-3 text-slate-400">{formatDate(doc.meeting_date)}</td>
                        <td className="px-5 py-3 text-slate-400">{formatBytes(doc.size_bytes)}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center rounded-full bg-brand-600/10 border border-brand-600/20 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
                            {doc.chunks_indexed}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
