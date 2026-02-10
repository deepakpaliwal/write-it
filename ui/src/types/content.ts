export type DocumentType = 'ARTICLE' | 'BOOK';

export interface DocumentItem {
  id: number;
  title: string;
  type: DocumentType;
  content: string;
  userId: number;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface SnippetItem {
  id: number;
  title: string;
  content: string;
  userId: number;
}
