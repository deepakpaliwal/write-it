import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createDocument, createSnippet, createSnapshot, getDocuments, getSnippets } from './components/api';
import type { DocumentItem, SnippetItem } from './types/content';
import './main.css';

const userId = 1;

function ContentManagementPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'ARTICLE' | 'BOOK'>('ARTICLE');
  const [content, setContent] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [status, setStatus] = useState('Welcome to Write It ✨');

  const totalWords = useMemo(() => documents.reduce((sum, document) => sum + document.wordCount, 0), [documents]);

  async function refresh() {
    setDocuments(await getDocuments(userId));
    setSnippets(await getSnippets(userId));
  }

  useEffect(() => {
    refresh().catch(() => setStatus('Backend not reachable yet. You can still explore UI and draft text.'));
  }, []);

  async function onCreateDocument(event: FormEvent) {
    event.preventDefault();
    await createDocument({ title, type: docType, content, userId });
    setTitle('');
    setContent('');
    setStatus(`${docType === 'ARTICLE' ? 'Article' : 'Book'} created successfully.`);
    await refresh();
  }

  async function onCreateSnippet(event: FormEvent) {
    event.preventDefault();
    await createSnippet({ title: snippetTitle, content: snippetContent, userId });
    setSnippetTitle('');
    setSnippetContent('');
    setStatus('Note captured. You can drag this into your next draft.');
    await refresh();
  }

  async function onSnapshot(documentId: number) {
    const snapshot = await createSnapshot(documentId);
    setStatus(`Saved snapshot v${snapshot.versionNumber} for document ${documentId}.`);
  }

  function startNewProject(type: 'ARTICLE' | 'BOOK') {
    setDocType(type);
    setTitle(type === 'ARTICLE' ? 'My new article' : 'My new book');
    setContent('');
    document.getElementById('project-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="layout">
      <header className="top-nav">
        <div className="brand">
          <div className="logo">W</div>
          <span>Write It</span>
        </div>
        <nav className="menu">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="#project-studio">Start Project</a>
        </nav>
      </header>

      <section id="home" className="hero">
        <div>
          <h1>Build articles and books in one beautiful writing workspace.</h1>
          <p>
            Plan with notes, shape chapters with sections, generate a Table of Contents, and keep version history while your
            team focuses on storytelling.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => startNewProject('ARTICLE')}>Start New Article</button>
            <button className="btn btn-secondary" onClick={() => startNewProject('BOOK')}>Start New Book</button>
          </div>
        </div>
        <div className="hero-cards">
          <div className="stat-card"><strong>{documents.length}</strong> active documents</div>
          <div className="stat-card"><strong>{snippets.length}</strong> collected notes</div>
          <div className="stat-card"><strong>{totalWords}</strong> total words drafted</div>
          <div className="stat-card">Status: {status}</div>
        </div>
      </section>

      <section className="section">
        <h2>What Write It helps you do</h2>
        <div className="grid-3">
          <article className="feature-card"><h3>📚 Smart TOC & Structure</h3><p>Create chapters and sections for books and keep your outline organized.</p></article>
          <article className="feature-card"><h3>🗒️ Collect Notes</h3><p>Capture ideas as snippets and reuse them during article or chapter writing.</p></article>
          <article className="feature-card"><h3>🕒 Version History</h3><p>Create snapshots before major edits so you can review and restore confidently.</p></article>
        </div>
      </section>

      <section className="section">
        <h2>Product in action</h2>
        <p>From ideation to publish-ready manuscript, Write It is designed for long-form content creation.</p>
        <div className="product-images">
          <img alt="Writers collaborating on content planning" src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" />
          <img alt="Notebook and laptop for writing notes" src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80" />
          <img alt="Books and publishing workflow" src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80" />
        </div>
      </section>

      <section id="project-studio" className="section">
        <h2>Project Studio</h2>
        <div className="forms-grid">
          <form onSubmit={onCreateDocument} className="panel">
            <h3>Create Article / Book</h3>
            <label htmlFor="doc-title">Title</label>
            <input id="doc-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project title" required />
            <label htmlFor="doc-type">Type</label>
            <select id="doc-type" value={docType} onChange={(event) => setDocType(event.target.value as 'ARTICLE' | 'BOOK')}>
              <option value="ARTICLE">Article</option>
              <option value="BOOK">Book</option>
            </select>
            <label htmlFor="doc-content">Draft</label>
            <textarea id="doc-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Start writing your first paragraph..." rows={8} />
            <button className="btn btn-primary" type="submit">Save Project</button>
          </form>

          <form onSubmit={onCreateSnippet} className="panel">
            <h3>Collect Notes</h3>
            <label htmlFor="snippet-title">Note title</label>
            <input id="snippet-title" value={snippetTitle} onChange={(event) => setSnippetTitle(event.target.value)} placeholder="Idea / quote / scene" required />
            <label htmlFor="snippet-content">Note body</label>
            <textarea id="snippet-content" value={snippetContent} onChange={(event) => setSnippetContent(event.target.value)} placeholder="Capture your thought before you lose it..." rows={8} required />
            <button className="btn btn-primary" type="submit">Save Note</button>
          </form>
        </div>
      </section>

      <section className="section">
        <h2>Documents</h2>
        {documents.length === 0 && <p>No documents yet. Start an article or book above.</p>}
        {documents.map((document) => (
          <article key={document.id} className="list-item">
            <strong>{document.title}</strong> ({document.type}) • {document.wordCount} words • {document.readingTimeMinutes} min read
            <div>
              <button className="btn btn-secondary" onClick={() => onSnapshot(document.id)}>Create Snapshot</button>
            </div>
          </article>
        ))}
      </section>

      <section className="section">
        <h2>Collected Notes</h2>
        {snippets.length === 0 && <p>No notes yet. Capture ideas in the Project Studio.</p>}
        {snippets.map((snippet) => (
          <article key={snippet.id} className="list-item">
            <strong>{snippet.title}</strong>
            <p>{snippet.content}</p>
          </article>
        ))}
      </section>

      <section className="section about-contact">
        <article id="about" className="panel">
          <h3>About Us</h3>
          <p>
            Write It is built for creators who publish articles and books. We combine structured writing workflows,
            note capture, and versioning so your ideas ship faster.
          </p>
        </article>
        <article id="contact" className="panel">
          <h3>Contact Us</h3>
          <p>Email: hello@writeit.app</p>
          <p>Support: support@writeit.app</p>
          <p>Location: Remote-first team, global writers welcome.</p>
        </article>
      </section>

      <p className="footer-note">Write It • Craft your next article or book with confidence.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
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
