export interface SourceDocument {
  title: string;
  chunk: string;
  date: string | null;
  blob_url: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceDocument[];
  conversation_id: string;
}

export interface ChatRequest {
  question: string;
  top_k: number;
  conversation_id: string | null; // null on first message, string on follow-ups
}

export interface DocumentMetadata {
  filename: string;
  meeting_date: string | null;
  size_bytes: number;
  last_modified: string;
  content_type: string;
  chunks_indexed: number;
}

export interface IngestionResult {
  total: number;
  total_chunks: number;
  documents: DocumentMetadata[];
}

export interface ApiError {
  detail: string;
}

// A single Q&A pair stored in chat history
export interface ChatEntry {
  id: string;
  question: string;
  topK: number;
  response: ChatResponse;
  timestamp: Date;
}
