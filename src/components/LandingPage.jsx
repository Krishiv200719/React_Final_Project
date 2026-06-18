import { useState } from 'react';

const FEATURES = [
  {
    icon: '🎨',
    title: 'Syntax Highlighting',
    desc: 'Color-coded regex tokens — quantifiers, groups, anchors, character classes — all visually distinct at a glance.',
  },
  {
    icon: '🔍',
    title: 'Live Match Testing',
    desc: 'Paste your test text and watch matches light up in real time with per-capture-group coloring.',
  },
  {
    icon: '📖',
    title: 'Plain-English Explanations',
    desc: 'Every regex is automatically translated into a step-by-step human-readable breakdown.',
  },
  {
    icon: '💾',
    title: 'Save & Reload',
    desc: 'Store your favorite patterns in the browser. Name them, reload them, and never lose a regex again.',
  },
  {
    icon: '📋',
    title: 'Quick Reference',
    desc: 'Built-in cheat sheet with click-to-inject — look up any token and insert it instantly.',
  },
  {
    icon: '🛡️',
    title: 'Safe Evaluation',
    desc: 'Backtracking guard and error handling keep the app responsive even with complex patterns.',
  },
];

export default function LandingPage({ onEnter }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="landing" id="landing-page">
      {/* Decorative background blobs */}
      <div className="landing-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="nav-logo-icon">.*</div>
          <span>Regex Sandbox</span>
        </div>
        <button className="nav-cta" onClick={onEnter}>
          Open Sandbox →
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="landing-hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Frontend-Only • No Backend Required
        </div>
        <h1 className="hero-title">
          Build, Test & <span className="hero-highlight">Understand</span> Regular Expressions
        </h1>
        <p className="hero-subtitle">
          A powerful regex syntax highlighter and sandbox that runs entirely in your browser.
          Color-coded patterns, real-time match visualization, and plain-English explanations.
        </p>
        <div className="hero-actions">
          <button
            className="hero-btn primary"
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id="hero-cta"
          >
            <span>Launch Sandbox</span>
            <span className={`hero-btn-arrow ${isHovered ? 'moved' : ''}`}>→</span>
          </button>
        </div>

        {/* Animated regex demo */}
        <div className="hero-demo">
          <div className="demo-window">
            <div className="demo-titlebar">
              <span className="demo-dot dot-red"></span>
              <span className="demo-dot dot-yellow"></span>
              <span className="demo-dot dot-green"></span>
              <span className="demo-title">regex-sandbox</span>
            </div>
            <div className="demo-body">
              <div className="demo-line">
                <span className="demo-prompt">/</span>
                <span className="demo-tok-group">(</span>
                <span className="demo-tok-escape">\w</span>
                <span className="demo-tok-quantifier">+</span>
                <span className="demo-tok-group">)</span>
                <span className="demo-tok-literal">@</span>
                <span className="demo-tok-group">(</span>
                <span className="demo-tok-escape">\w</span>
                <span className="demo-tok-quantifier">+</span>
                <span className="demo-tok-group">)</span>
                <span className="demo-tok-escape">\.</span>
                <span className="demo-tok-group">(</span>
                <span className="demo-tok-escape">\w</span>
                <span className="demo-tok-quantifier">+</span>
                <span className="demo-tok-group">)</span>
                <span className="demo-prompt">/</span>
                <span className="demo-flag">g</span>
              </div>
              <div className="demo-divider"></div>
              <div className="demo-line demo-text">
                Contact us at <span className="demo-match">hello<span className="demo-group1">@</span>example<span className="demo-group2">.</span>com</span> today
              </div>
              <div className="demo-line demo-result">
                <span className="demo-result-badge">✓ 1 match</span>
                <span className="demo-result-groups">3 capture groups</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="landing-features">
        <h2 className="features-title">Everything You Need</h2>
        <p className="features-subtitle">A complete regex development environment in your browser</p>
        <div className="features-grid">
          {FEATURES.map((feat, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="feature-icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom-cta">
        <h2>Ready to build your regex?</h2>
        <p>No sign-up, no install — just open and start writing.</p>
        <button className="hero-btn primary" onClick={onEnter}>
          Open Sandbox →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Regex Sandbox • Built with React & Vite • ITM Skills University</p>
      </footer>
    </div>
  );
}
