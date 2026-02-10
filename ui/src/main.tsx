import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import {
  aiVerify,
  createDocument,
  createSnippet,
  createSnapshot,
  exportDocument,
  getDocuments,
  getSnippets,
  publishKdp,
  publishMedium,
  seoSuggestions,
  spellCheck
} from './components/api';
import type { DocumentItem, SnippetItem } from './types/content';
import './main.css';

const userId = 1;
const editorMemoryKey = 'write-it.editor-memory.v1';
const themeKey = 'write-it.theme.v1';

type EditorMemory = {
  title: string;
  docType: 'ARTICLE' | 'BOOK';
  contentHtml: string;
  tags: string;
  category: string;
  updatedAt: string;
};

function HomePage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'ARTICLE' | 'BOOK'>('ARTICLE');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [status, setStatus] = useState('Welcome to Write It ✨');
  const navigate = useNavigate();

  const totalWords = useMemo(() => documents.reduce((sum, document) => sum + document.wordCount, 0), [documents]);

  async function refresh(query?: string, tag?: string) {
    setDocuments(await getDocuments(userId, query, tag));
    setSnippets(await getSnippets(userId));
  }

  useEffect(() => {
    refresh().catch(() => setStatus('Backend not reachable yet. You can still draft in the rich editor.'));
  }, []);

  async function onCreateDocument(event: FormEvent) {
    event.preventDefault();
    await createDocument({ title, type: docType, content, userId, tags, category });
    setTitle('');
    setContent('');
    setTags('');
    setCategory('');
    setStatus(`${docType === 'ARTICLE' ? 'Article' : 'Book'} created successfully.`);
    await refresh(searchQuery, searchTag);
  }

  async function onCreateSnippet(event: FormEvent) {
    event.preventDefault();
    await createSnippet({ title: snippetTitle, content: snippetContent, userId });
    setSnippetTitle('');
    setSnippetContent('');
    setStatus('Note captured. You can drag this into your next draft.');
    await refresh(searchQuery, searchTag);
  }

  async function onSnapshot(documentId: number) {
    const snapshot = await createSnapshot(documentId);
    setStatus(`Saved snapshot v${snapshot.versionNumber} for document ${documentId}.`);
  }

  async function onSearch(event: FormEvent) {
    event.preventDefault();
    await refresh(searchQuery, searchTag);
    setStatus('Search filters applied.');
  }

  return (
    <div className="layout">
      <header className="top-nav">
        <div className="brand"><div className="logo">W</div><span>Write It</span></div>
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
          <p>Now with writing tools, publishing stubs, search and tags support.</p>
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
        <h2>Search & Organization</h2>
        <form onSubmit={onSearch} className="forms-grid">
          <div className="panel">
            <label htmlFor="search-query">Search title</label>
            <input id="search-query" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="e.g. marketing plan" />
          </div>
          <div className="panel">
            <label htmlFor="search-tag">Search by tag</label>
            <input id="search-tag" value={searchTag} onChange={(event) => setSearchTag(event.target.value)} placeholder="e.g. seo" />
            <button className="btn btn-primary" type="submit">Apply Search</button>
          </div>
        </form>
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
            <label htmlFor="doc-tags">Tags (comma separated)</label>
            <input id="doc-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="seo, writing, product" />
            <label htmlFor="doc-category">Category</label>
            <input id="doc-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Technology" />
            <label htmlFor="doc-content">Draft</label>
            <textarea id="doc-content" value={content} onChange={(event) => setContent(event.target.value)} rows={8} />
            <button className="btn btn-primary" type="submit">Save Project</button>
          </form>

          <form onSubmit={onCreateSnippet} className="panel">
            <h3>Collect Notes</h3>
            <label htmlFor="snippet-title">Note title</label>
            <input id="snippet-title" value={snippetTitle} onChange={(event) => setSnippetTitle(event.target.value)} required />
            <label htmlFor="snippet-content">Note body</label>
            <textarea id="snippet-content" value={snippetContent} onChange={(event) => setSnippetContent(event.target.value)} rows={8} required />
            <button className="btn btn-primary" type="submit">Save Note</button>
          </form>
        </div>
      </section>

      <section className="section">
        <h2>Recent documents</h2>
        {documents.length === 0 && <p>No documents yet. Start an article or book above.</p>}
        {documents.map((document) => (
          <article key={document.id} className="list-item">
            <strong>{document.title}</strong> ({document.type}) • {document.wordCount} words • {document.readingTimeMinutes} min
            {document.tags && <div>Tags: {document.tags}</div>}
            {document.category && <div>Category: {document.category}</div>}
            <div>
              <Link className="link-action" to={`/editor/new?type=${document.type}`}>Open editor</Link>{' '}
              <button className="btn btn-secondary" onClick={() => onSnapshot(document.id)}>Create Snapshot</button>
            </div>
          </article>
        ))}
      </section>

      <section className="section about-contact">
        <article id="about" className="panel"><h3>About Us</h3><p>Write It supports drafting, verification and export workflows.</p></article>
        <article id="contact" className="panel"><h3>Contact Us</h3><p>Email: hello@writeit.app</p></article>
      </section>
      <p className="footer-note">Write It • Craft your next article or book with confidence.</p>
    </div>
  );
}

function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get('type') === 'BOOK' ? 'BOOK' : 'ARTICLE';
  const [docType, setDocType] = useState<'ARTICLE' | 'BOOK'>(typeParam);
  const [title, setTitle] = useState(typeParam === 'BOOK' ? 'Untitled Book' : 'Untitled Article');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Start writing...');
  const [toolOutput, setToolOutput] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [saving, setSaving] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<number | null>(null);
  const [memoryUpdatedAt, setMemoryUpdatedAt] = useState<string | null>(null);
  const [editorVersion, setEditorVersion] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = (window.localStorage.getItem(themeKey) as 'light' | 'dark' | null) ?? 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    window.localStorage.setItem(themeKey, theme);
  }, [theme]);

  useEffect(() => {
    const nextType = searchParams.get('type') === 'BOOK' ? 'BOOK' : 'ARTICLE';
    setDocType(nextType);
    setTitle(nextType === 'BOOK' ? 'Untitled Book' : 'Untitled Article');
  }, [searchParams]);

  useEffect(() => {
    const rawMemory = window.localStorage.getItem(editorMemoryKey);
    if (!rawMemory) return;
    try {
      const memory = JSON.parse(rawMemory) as EditorMemory;
      setTitle(memory.title || (memory.docType === 'BOOK' ? 'Untitled Book' : 'Untitled Article'));
      setDocType(memory.docType === 'BOOK' ? 'BOOK' : 'ARTICLE');
      setTags(memory.tags ?? '');
      setCategory(memory.category ?? '');
      setMemoryUpdatedAt(memory.updatedAt ?? null);
      if (editorRef.current && memory.contentHtml) editorRef.current.innerHTML = memory.contentHtml;
      setStatus('Draft restored from memory.');
    } catch {
      setStatus('Could not read saved memory draft.');
    }
  }, []);

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  function getEditorHtml() { return editorRef.current?.innerHTML ?? ''; }
  function getEditorText() { return editorRef.current?.innerText ?? ''; }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const created = await createDocument({ title, type: docType, content: getEditorHtml(), userId, tags, category });
      setLastSavedId(created.id);
      setStatus(`Saved ${docType.toLowerCase()} successfully.`);
    } catch {
      setStatus('Could not save right now. Please ensure backend is running.');
    } finally {
      setSaving(false);
    }
  }

  function saveDraftMemory() {
    const memory: EditorMemory = {
      title, docType, tags, category,
      contentHtml: getEditorHtml(),
      updatedAt: new Date().toISOString()
    };
    window.localStorage.setItem(editorMemoryKey, JSON.stringify(memory));
    setMemoryUpdatedAt(memory.updatedAt);
  }

  function restoreDraftMemory() {
    const rawMemory = window.localStorage.getItem(editorMemoryKey);
    if (!rawMemory) return setStatus('No memory draft found yet.');
    try {
      const memory = JSON.parse(rawMemory) as EditorMemory;
      setTitle(memory.title || (memory.docType === 'BOOK' ? 'Untitled Book' : 'Untitled Article'));
      setDocType(memory.docType === 'BOOK' ? 'BOOK' : 'ARTICLE');
      setTags(memory.tags ?? '');
      setCategory(memory.category ?? '');
      if (editorRef.current) editorRef.current.innerHTML = memory.contentHtml || '<p></p>';
      setMemoryUpdatedAt(memory.updatedAt ?? null);
      setEditorVersion((value) => value + 1);
      setStatus('Draft restored from memory.');
    } catch {
      setStatus('Could not restore draft memory.');
    }
  }

  function clearDraftMemory() {
    window.localStorage.removeItem(editorMemoryKey);
    setMemoryUpdatedAt(null);
    setStatus('Draft memory cleared.');
  }

  async function runSpellCheck() {
    const result = await spellCheck(getEditorText());
    setToolOutput(result.suggestions.length ? result.suggestions : ['No major spelling issues found.']);
  }

  async function runSeo() {
    const result = await seoSuggestions(title, getEditorText());
    setToolOutput([`Word count: ${result.wordCount}`, ...result.suggestions]);
  }

  async function runAiVerify() {
    const result = await aiVerify(getEditorText());
    setToolOutput([`Provider: ${result.provider}`, ...result.suggestions]);
  }

  async function handleExport(format: 'MARKDOWN' | 'HTML' | 'PDF' | 'EPUB') {
    if (!lastSavedId) return setStatus('Please save document before export.');
    const result = await exportDocument(lastSavedId, format);
    setStatus(`Export generated: ${result.fileName}`);
  }

  async function handlePublish(channel: 'MEDIUM' | 'KDP') {
    if (!lastSavedId) return setStatus('Please save document before publishing.');
    const result = channel === 'MEDIUM' ? await publishMedium(lastSavedId) : await publishKdp(lastSavedId);
    setStatus(`${result.channel} status: ${result.status}`);
  }

  const wordCount = useMemo(() => {
    const text = getEditorText().trim();
    return text.length === 0 ? 0 : text.split(/\s+/).length;
  }, [status, editorVersion]);

  return (
    <div className="layout">
      <header className="top-nav">
        <div className="brand"><div className="logo">W</div><span>Write It Editor</span></div>
        <nav className="menu">
          <Link to="/">Home</Link>
          <button className="btn btn-secondary" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>Theme: {theme}</button>
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
          <label htmlFor="doc-tags">Tags</label>
          <input id="doc-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="seo, writing" />
          <label htmlFor="doc-category">Category</label>
          <input id="doc-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Technology" />

          <div className="toolbar">
            <button type="button" onClick={() => exec('bold')}>Bold</button>
            <button type="button" onClick={() => exec('italic')}>Italic</button>
            <button type="button" onClick={() => exec('underline')}>Underline</button>
            <button type="button" onClick={() => exec('formatBlock', '<h2>')}>H2</button>
            <button type="button" onClick={() => exec('insertUnorderedList')}>Bullet</button>
            <button type="button" onClick={() => exec('insertOrderedList')}>Number</button>
            <button type="button" onClick={() => runSpellCheck()}>Spell Check</button>
            <button type="button" onClick={() => runSeo()}>SEO Suggest</button>
            <button type="button" onClick={() => runAiVerify()}>AI Verify</button>
          </div>

          <div
            ref={editorRef}
            className="rich-editor"
            contentEditable
            spellCheck
            suppressContentEditableWarning
            onInput={() => setStatus('Draft updated')}
          >
            <p>Start writing your {docType.toLowerCase()} here...</p>
          </div>

          {toolOutput.length > 0 && (
            <div className="section">
              <h3>Writing Tools Output</h3>
              <ul>{toolOutput.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}

          <div className="hero-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : `Save ${docType}`}</button>
            <button type="button" className="btn btn-secondary" onClick={saveDraftMemory}>Save Memory</button>
            <button type="button" className="btn btn-secondary" onClick={restoreDraftMemory}>Restore Memory</button>
            <button type="button" className="btn btn-secondary" onClick={clearDraftMemory}>Clear Memory</button>
            <button type="button" className="btn btn-secondary" onClick={() => handleExport('MARKDOWN')}>Export MD</button>
            <button type="button" className="btn btn-secondary" onClick={() => handleExport('HTML')}>Export HTML</button>
            <button type="button" className="btn btn-secondary" onClick={() => handleExport('PDF')}>Export PDF</button>
            <button type="button" className="btn btn-secondary" onClick={() => handlePublish('MEDIUM')}>Publish Medium</button>
            <button type="button" className="btn btn-secondary" onClick={() => handlePublish('KDP')}>Publish KDP</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
          </div>
          <p className="footer-note">Memory: {memoryUpdatedAt ? `saved at ${new Date(memoryUpdatedAt).toLocaleString()}` : 'not saved yet'}</p>
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
