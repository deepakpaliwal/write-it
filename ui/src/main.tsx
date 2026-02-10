import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { createDocument, createSnapshot, getDocuments, getSnippets } from './components/api';
import type { DocumentItem, SnippetItem } from './types/content';
import './main.css';

const userId = 1;

function HomePage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);
  const [status, setStatus] = useState('Welcome to Write It ✨');
  const navigate = useNavigate();

  const totalWords = useMemo(() => documents.reduce((sum, document) => sum + document.wordCount, 0), [documents]);

  async function refresh() {
    setDocuments(await getDocuments(userId));
    setSnippets(await getSnippets(userId));
  }

  useEffect(() => {
    refresh().catch(() => setStatus('Backend not reachable yet. You can still draft in the rich editor.'));
  }, []);

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
          <Link to="/editor/new?type=ARTICLE">Create Article</Link>
          <Link to="/editor/new?type=BOOK">Create Book</Link>
        </nav>
      </header>

      <section id="home" className="hero">
        <div>
          <h1>Build articles and books in one beautiful writing workspace.</h1>
          <p>
            Start a new writing project in our rich editor with headings, formatting, links, code blocks and structured content support.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('/editor/new?type=ARTICLE')}>Create Article</button>
            <button className="btn btn-secondary" onClick={() => navigate('/editor/new?type=BOOK')}>Create Book</button>
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
          <article className="feature-card"><h3>🖋️ Rich Editor</h3><p>Write with bold, italic, headings, lists, quotes, code and links in a dedicated editor screen.</p></article>
          <article className="feature-card"><h3>📚 Smart TOC & Structure</h3><p>Create chapters and sections for books and keep your outline organized.</p></article>
          <article className="feature-card"><h3>🗒️ Collect Notes</h3><p>Capture ideas as snippets and reuse them during article or chapter writing.</p></article>
        </div>
      </section>

      <section className="section">
        <h2>Recent documents</h2>
        {documents.length === 0 && <p>No documents yet. Start with Create Article or Create Book.</p>}
        {documents.map((document) => (
          <article key={document.id} className="list-item">
            <strong>{document.title}</strong> ({document.type}) • {document.wordCount} words • {document.readingTimeMinutes} min read
            <div>
              <Link className="link-action" to={`/editor/new?type=${document.type}`}>Open editor for new {document.type.toLowerCase()}</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section about-contact">
        <article id="about" className="panel">
          <h3>About Us</h3>
          <p>Write It is built for creators who publish articles and books with structured writing and snapshots.</p>
        </article>
        <article id="contact" className="panel">
          <h3>Contact Us</h3>
          <p>Email: hello@writeit.app</p>
          <p>Support: support@writeit.app</p>
        </article>
      </section>
    </div>
  );
}

function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get('type') === 'BOOK' ? 'BOOK' : 'ARTICLE';
  const [docType, setDocType] = useState<'ARTICLE' | 'BOOK'>(typeParam);
  const [title, setTitle] = useState(typeParam === 'BOOK' ? 'Untitled Book' : 'Untitled Article');
  const [status, setStatus] = useState('Start writing...');
  const [saving, setSaving] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextType = searchParams.get('type') === 'BOOK' ? 'BOOK' : 'ARTICLE';
    setDocType(nextType);
    setTitle(nextType === 'BOOK' ? 'Untitled Book' : 'Untitled Article');
  }, [searchParams]);

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function getEditorHtml() {
    return editorRef.current?.innerHTML ?? '';
  }

  function getEditorText() {
    return editorRef.current?.innerText ?? '';
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const created = await createDocument({
        title,
        type: docType,
        content: getEditorHtml(),
        userId
      });
      setLastSavedId(created.id);
      setStatus(`Saved ${docType.toLowerCase()} successfully.`);
    } catch {
      setStatus('Could not save right now. Please ensure backend is running.');
    } finally {
      setSaving(false);
    }
  }

  const wordCount = useMemo(() => {
    const text = getEditorText().trim();
    return text.length === 0 ? 0 : text.split(/\s+/).length;
  }, [status]);

  return (
    <div className="layout">
      <header className="top-nav">
        <div className="brand"><div className="logo">W</div><span>Write It Editor</span></div>
        <nav className="menu">
          <Link to="/">Home</Link>
          <button className="btn btn-secondary" onClick={() => navigate('/editor/new?type=ARTICLE')}>New Article</button>
          <button className="btn btn-secondary" onClick={() => navigate('/editor/new?type=BOOK')}>New Book</button>
        </nav>
      </header>

      <section className="section editor-shell">
        <div className="editor-head">
          <div>
            <h2>{docType === 'BOOK' ? 'Book Editor' : 'Article Editor'}</h2>
            <p>{status}</p>
          </div>
          <div className="editor-meta">Words: {wordCount} {lastSavedId && `• Last saved ID: ${lastSavedId}`}</div>
        </div>

        <form onSubmit={onSave}>
          <label htmlFor="doc-title">Title</label>
          <input id="doc-title" value={title} onChange={(event) => setTitle(event.target.value)} required />

          <div className="toolbar">
            <button type="button" onClick={() => exec('bold')}>Bold</button>
            <button type="button" onClick={() => exec('italic')}>Italic</button>
            <button type="button" onClick={() => exec('underline')}>Underline</button>
            <button type="button" onClick={() => exec('formatBlock', '<h2>')}>H2</button>
            <button type="button" onClick={() => exec('formatBlock', '<h3>')}>H3</button>
            <button type="button" onClick={() => exec('insertUnorderedList')}>Bullet List</button>
            <button type="button" onClick={() => exec('insertOrderedList')}>Number List</button>
            <button type="button" onClick={() => exec('formatBlock', '<blockquote>')}>Quote</button>
            <button type="button" onClick={() => exec('formatBlock', '<pre>')}>Code</button>
            <button
              type="button"
              onClick={() => {
                const link = window.prompt('Enter URL');
                if (link) exec('createLink', link);
              }}
            >
              Link
            </button>
            <button type="button" onClick={() => exec('removeFormat')}>Clear</button>
          </div>

          <div
            ref={editorRef}
            className="rich-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={() => setStatus('Draft updated')}
          >
            <p>Start writing your {docType.toLowerCase()} here...</p>
          </div>

          <div className="hero-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : `Save ${docType}`}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/new" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
