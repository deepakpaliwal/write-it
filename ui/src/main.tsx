import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function Home() {
  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Write It</h1>
      <p>A writing workspace for articles and books.</p>
      <ul>
        <li>Document management</li>
        <li>AI verification</li>
        <li>Export and publish workflows</li>
      </ul>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem' }}>
        <Link to="/">Home</Link>
        <a href="http://localhost:8080/swagger-ui/index.html">API Docs</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
