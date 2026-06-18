import { useState } from 'react';
import { getSnippets, saveSnippet, deleteSnippet, renameSnippet } from '../utils/storageManager';

export default function SavedSnippets({ pattern, flags, testText, onLoad }) {
  const [snippets, setSnippets] = useState(() => getSnippets());
  const [saveName, setSaveName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  function handleSave() {
    if (!pattern) return;
    const name = saveName.trim() || `Pattern ${snippets.length + 1}`;
    saveSnippet({ name, pattern, flags, testText });
    setSnippets(getSnippets());
    setSaveName('');
    setShowSave(false);
  }

  function handleDelete(id) {
    const updated = deleteSnippet(id);
    setSnippets(updated);
  }

  function handleRename(id) {
    if (!editName.trim()) return;
    renameSnippet(id, editName.trim());
    setSnippets(getSnippets());
    setEditingId(null);
    setEditName('');
  }

  function handleLoad(snippet) {
    onLoad({
      pattern: snippet.pattern,
      flags: snippet.flags,
      testText: snippet.testText,
    });
  }

  return (
    <div className="saved-snippets" id="saved-snippets">
      <div className="snippets-header">
        <h3>Saved Patterns</h3>
        <button
          className="save-btn"
          onClick={() => setShowSave(!showSave)}
          disabled={!pattern}
          title={pattern ? 'Save current pattern' : 'Enter a pattern first'}
          id="save-pattern-btn"
        >
          <span>+</span> Save
        </button>
      </div>

      {showSave && (
        <div className="save-form">
          <input
            type="text"
            className="save-name-input"
            placeholder="Pattern name..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            id="save-name-input"
            autoFocus
          />
          <div className="save-actions">
            <button className="confirm-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setShowSave(false)}>Cancel</button>
          </div>
        </div>
      )}

      {snippets.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💾</span>
          <p className="empty-hint">No saved patterns yet. Save your regex to quickly reload it later.</p>
        </div>
      ) : (
        <div className="snippets-list">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="snippet-item">
              {editingId === snippet.id ? (
                <div className="rename-form">
                  <input
                    type="text"
                    className="rename-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(snippet.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                  />
                  <button className="confirm-btn small" onClick={() => handleRename(snippet.id)}>✓</button>
                  <button className="cancel-btn small" onClick={() => setEditingId(null)}>✕</button>
                </div>
              ) : (
                <>
                  <button className="snippet-load" onClick={() => handleLoad(snippet)}>
                    <span className="snippet-name">{snippet.name}</span>
                    <code className="snippet-pattern">/{snippet.pattern}/{snippet.flags}</code>
                  </button>
                  <div className="snippet-actions">
                    <button
                      className="snippet-action-btn"
                      onClick={() => { setEditingId(snippet.id); setEditName(snippet.name); }}
                      title="Rename"
                    >
                      ✎
                    </button>
                    <button
                      className="snippet-action-btn delete"
                      onClick={() => handleDelete(snippet.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
