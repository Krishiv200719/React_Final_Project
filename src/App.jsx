import { useState, useMemo, useRef, useCallback } from 'react';
import { tokenizeRegex } from './utils/regexTokenizer';
import { explainRegex } from './utils/regexExplainer';
import { evaluateRegex } from './utils/regexEvaluator';
import LandingPage from './components/LandingPage';
import RegexInputBar from './components/RegexInputBar';
import TestInputCard from './components/TestInputCard';
import MatchTree from './components/MatchTree';
import ExplanationPanel from './components/ExplanationPanel';
import CheatSheet from './components/CheatSheet';
import SavedSnippets from './components/SavedSnippets';

const DEFAULT_TEST_TEXT = `Hello World! The quick brown fox jumps over the lazy dog.
Email: user@example.com, admin@domain.org
Phone: 123-456-7890, (555) 867-5309
IP: 192.168.1.1, 10.0.0.255
Date: 2025-06-18, 12/31/2024
URL: https://www.example.com/path?q=test&page=1`;

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(DEFAULT_TEST_TEXT);
  const [activeTab, setActiveTab] = useState('matches');

  // Ref for inject callback from CheatSheet -> RegexInputBar
  const injectRef = useRef(null);

  // Tokenize for explanation
  const tokens = useMemo(() => tokenizeRegex(pattern), [pattern]);

  // Generate explanation
  const explanations = useMemo(() => explainRegex(tokens), [tokens]);

  // Evaluate regex against test text
  const evalResult = useMemo(
    () => evaluateRegex(pattern, flags, testText),
    [pattern, flags, testText]
  );

  const handleInject = useCallback((tokenStr) => {
    if (injectRef.current) {
      injectRef.current(tokenStr);
    }
  }, []);

  const handleLoadSnippet = useCallback(({ pattern: p, flags: f, testText: t }) => {
    setPattern(p);
    setFlags(f);
    setTestText(t);
  }, []);

  const sidebarTabs = [
    { key: 'matches', label: 'Matches' },
    { key: 'explain', label: 'Explain' },
    { key: 'reference', label: 'Reference' },
    { key: 'saved', label: 'Saved' },
  ];

  // Show landing page
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app" id="app">
      {/* Header */}
      <header className="app-header" id="app-header">
        <div className="app-logo">
          <button className="back-btn" onClick={() => setShowLanding(true)} title="Back to home">
            ←
          </button>
          <div className="app-logo-icon">.*</div>
          <div>
            <h1>Regex Sandbox</h1>
            <span className="subtitle">Syntax Highlighter & Tester</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main" id="app-main">
        {/* Regex Input Bar — full width */}
        <div className="input-section">
          <RegexInputBar
            pattern={pattern}
            onPatternChange={setPattern}
            flags={flags}
            onFlagsChange={setFlags}
            onInjectToken={injectRef}
          />
          {evalResult.error && (
            <div className="regex-error" style={{ marginTop: '8px' }}>
              <span className="error-icon">⚠</span>
              <span className="error-text">{evalResult.error}</span>
            </div>
          )}
        </div>

        {/* Left: Test workspace */}
        <div className="workspace-area">
          <TestInputCard
            testText={testText}
            onTestTextChange={setTestText}
            matches={evalResult.matches}
            executionTime={evalResult.executionTime}
          />
        </div>

        {/* Right: Sidebar with tabs */}
        <div className="sidebar-area">
          <div className="sidebar-tabs">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.key}
                className={`sidebar-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="sidebar-content">
            {activeTab === 'matches' && (
              <MatchTree matches={evalResult.matches} />
            )}
            {activeTab === 'explain' && (
              <ExplanationPanel explanations={explanations} pattern={pattern} />
            )}
            {activeTab === 'reference' && (
              <CheatSheet onInject={handleInject} />
            )}
            {activeTab === 'saved' && (
              <SavedSnippets
                pattern={pattern}
                flags={flags}
                testText={testText}
                onLoad={handleLoadSnippet}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
