import React, { FormEvent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { createDocument, createSnapshot, createSnippet, getDocuments, getSnippets } from './components/api';
import type { DocumentItem, SnippetItem } from './types/content';

const userId = 1;

function ContentManagementPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'ARTICLE' | 'BOOK'>('ARTICLE');
  const [content, setContent] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [status, setStatus] = useState('Ready');

  async function refresh() {
    setDocuments(await getDocuments(userId));
    setSnippets(await getSnippets(userId));
  }

  useEffect(() => {
    refresh().catch(() => setStatus('Backend not reachable yet.'));
  }, []);

  async function onCreateDocument(event: FormEvent) {
    event.preventDefault();
    await createDocument({ title, type: docType, content, userId });
    setTitle('');
    setContent('');
    setStatus('Document created.');
    await refresh();
  }

  async function onCreateSnippet(event: FormEvent) {
    event.preventDefault();
    await createSnippet({ title: snippetTitle, content: snippetContent, userId });
    setSnippetTitle('');
    setSnippetContent('');
    setStatus('Snippet created.');
    await refresh();
  }

  async function onSnapshot(documentId: number) {
    const snapshot = await createSnapshot(documentId);
    setStatus(`Snapshot v${snapshot.versionNumber} created for document ${documentId}.`);
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem', fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>Write It — Content Management</h1>
      <p>{status}</p>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <form onSubmit={onCreateDocument} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <h2>Create Document</h2>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Document title" required />
          <select value={docType} onChange={(event) => setDocType(event.target.value as 'ARTICLE' | 'BOOK')}>
            <option value="ARTICLE">Article</option>
            <option value="BOOK">Book</option>
          </select>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start writing..." rows={8} />
          <button type="submit">Save document</button>
        </form>

        <form onSubmit={onCreateSnippet} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
          <h2>Capture Snippet</h2>
          <input value={snippetTitle} onChange={(event) => setSnippetTitle(event.target.value)} placeholder="Snippet title" required />
          <textarea value={snippetContent} onChange={(event) => setSnippetContent(event.target.value)} placeholder="Quick note" rows={8} required />
          <button type="submit">Save snippet</button>
        </form>
      </section>

      <section>
        <h2>Documents</h2>
        {documents.map((document) => (
          <article key={document.id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
            <strong>{document.title}</strong> ({document.type}) • {document.wordCount} words • {document.readingTimeMinutes} min read
            <div>
              <button onClick={() => onSnapshot(document.id)}>Create snapshot</button>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2>Snippets</h2>
        {snippets.map((snippet) => (
          <article key={snippet.id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
            <strong>{snippet.title}</strong>
            <p>{snippet.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem' }}>
        <Link to="/">Content Management</Link>
        <a href="http://localhost:8080/swagger-ui/index.html">API Docs</a>
      </nav>
      <Routes>
        <Route path="/" element={<ContentManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
