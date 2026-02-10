import type { DocumentItem, SnippetItem } from '../types/content';

const API_BASE = 'http://localhost:8080/api/v1';

export async function getDocuments(userId: number): Promise<DocumentItem[]> {
  const response = await fetch(`${API_BASE}/documents?userId=${userId}`);
  return response.json();
}

export async function createDocument(payload: {
  title: string;
  type: 'ARTICLE' | 'BOOK';
  content: string;
  userId: number;
}): Promise<DocumentItem> {
  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

export async function createSnapshot(documentId: number): Promise<{ versionNumber: number }> {
  const response = await fetch(`${API_BASE}/documents/${documentId}/snapshots`, { method: 'POST' });
  return response.json();
}

export async function getSnippets(userId: number): Promise<SnippetItem[]> {
  const response = await fetch(`${API_BASE}/snippets?userId=${userId}`);
  return response.json();
}

export async function createSnippet(payload: { title: string; content: string; userId: number }): Promise<SnippetItem> {
  const response = await fetch(`${API_BASE}/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}
