import type { DocumentItem, SnippetItem } from '../types/content';

const API_BASE = 'http://localhost:8080/api/v1';

type PublishResponse = {
  channel: string;
  status: string;
  externalUrl: string;
  generatedAt: string;
};

type ExportResponse = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

async function ensureOk(response: Response) {
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed with status ${response.status}`);
  }
  return response;
}

export async function getDocuments(userId: number, query?: string, tag?: string): Promise<DocumentItem[]> {
  const params = new URLSearchParams({ userId: String(userId) });
  if (query) params.set('query', query);
  if (tag) params.set('tag', tag);
  const response = await ensureOk(await fetch(`${API_BASE}/documents?${params.toString()}`));
  return response.json();
}

export async function createDocument(payload: {
  title: string;
  type: 'ARTICLE' | 'BOOK';
  content: string;
  userId: number;
  tags?: string;
  category?: string;
}): Promise<DocumentItem> {
  const response = await ensureOk(await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }));
  return response.json();
}

export async function createSnapshot(documentId: number): Promise<{ versionNumber: number }> {
  const response = await ensureOk(await fetch(`${API_BASE}/documents/${documentId}/snapshots`, { method: 'POST' }));
  return response.json();
}

export async function getSnippets(userId: number): Promise<SnippetItem[]> {
  const response = await ensureOk(await fetch(`${API_BASE}/snippets?userId=${userId}`));
  return response.json();
}

export async function createSnippet(payload: { title: string; content: string; userId: number }): Promise<SnippetItem> {
  const response = await ensureOk(await fetch(`${API_BASE}/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }));
  return response.json();
}

export async function spellCheck(text: string): Promise<{ suggestions: string[] }> {
  const response = await ensureOk(await fetch(`${API_BASE}/writing-tools/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }));
  return response.json();
}

export async function seoSuggestions(title: string, content: string): Promise<{ wordCount: number; suggestions: string[] }> {
  const response = await ensureOk(await fetch(`${API_BASE}/writing-tools/seo-suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  }));
  return response.json();
}

export async function aiVerify(text: string): Promise<{ provider: string; suggestions: string[] }> {
  const response = await ensureOk(await fetch(`${API_BASE}/writing-tools/ai-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }));
  return response.json();
}

export async function exportDocument(documentId: number, format: 'MARKDOWN' | 'HTML' | 'PDF' | 'EPUB'): Promise<ExportResponse> {
  const response = await ensureOk(await fetch(`${API_BASE}/documents/${documentId}/export?format=${format}`));
  return response.json();
}

export async function publishMedium(documentId: number, tags: string[], canonicalUrl: string): Promise<PublishResponse> {
  const response = await ensureOk(await fetch(`${API_BASE}/publishing/medium`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, tags, canonicalUrl })
  }));
  return response.json();
}

export async function publishKdp(payload: {
  documentId: number;
  description: string;
  keywords: string[];
  categories: string[];
  coverUrl: string;
}): Promise<PublishResponse> {
  const response = await ensureOk(await fetch(`${API_BASE}/publishing/kdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }));
  return response.json();
}

export async function publishWriteIt(documentId: number): Promise<PublishResponse> {
  const response = await ensureOk(await fetch(`${API_BASE}/publishing/write-it`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId })
  }));
  return response.json();
}

export async function getBlogPosts(): Promise<DocumentItem[]> {
  const response = await ensureOk(await fetch(`${API_BASE}/blog/posts`));
  return response.json();
}

export async function spellCheck(text: string): Promise<{ suggestions: string[] }> {
  const response = await fetch(`${API_BASE}/writing-tools/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
}

export async function seoSuggestions(title: string, content: string): Promise<{ wordCount: number; suggestions: string[] }> {
  const response = await fetch(`${API_BASE}/writing-tools/seo-suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  return response.json();
}

export async function aiVerify(text: string): Promise<{ provider: string; suggestions: string[] }> {
  const response = await fetch(`${API_BASE}/writing-tools/ai-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
}

export async function exportDocument(documentId: number, format: 'MARKDOWN' | 'HTML' | 'PDF' | 'EPUB') {
  const response = await fetch(`${API_BASE}/documents/${documentId}/export?format=${format}`);
  return response.json();
}

export async function publishMedium(documentId: number) {
  const response = await fetch(`${API_BASE}/publishing/medium`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, tags: ['write-it'], canonicalUrl: '' })
  });
  return response.json();
}

export async function publishKdp(documentId: number) {
  const response = await fetch(`${API_BASE}/publishing/kdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, description: '', keywords: ['book'], categories: ['General'], coverUrl: '' })
  });
  return response.json();
}


export async function publishWriteIt(documentId: number) {
  const response = await fetch(`${API_BASE}/publishing/write-it`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId })
  });
  return response.json();
}

export async function getBlogPosts(): Promise<DocumentItem[]> {
  const response = await fetch(`${API_BASE}/blog/posts`);
  return response.json();
}
