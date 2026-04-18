import type { ChatRequest, ChatResponse, IngestionResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

// ---------- helpers ----------

function userFriendlyMessage(status: number): string {
  switch (status) {
    case 422: return 'Invalid request — please check your input.';
    case 502: return 'Service temporarily unavailable. Please try again shortly.';
    case 500: return 'Something went wrong on the server. Please try again.';
    default:  return `Unexpected error (HTTP ${status}). Please try again.`;
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json() as { detail?: string };
    if (body.detail) return body.detail;
  } catch {
    // fall through
  }
  return userFriendlyMessage(res.status);
}

// ---------- public API ----------

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health/live`, { signal: AbortSignal.timeout(5_000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendChatQuery(req: ChatRequest): Promise<ChatResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/v1/chat/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }

  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }

  return res.json() as Promise<ChatResponse>;
}

export async function runIngestion(): Promise<IngestionResult> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/v1/ingestion/process`);
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }

  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }

  return res.json() as Promise<IngestionResult>;
}
