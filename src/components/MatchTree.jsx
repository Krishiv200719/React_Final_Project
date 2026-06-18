import { useState } from 'react';

export default function MatchTree({ matches }) {
  const [expandedMatches, setExpandedMatches] = useState(new Set());

  if (!matches || matches.length === 0) {
    return (
      <div className="match-tree empty" id="match-tree">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>No matches found</p>
          <p className="empty-hint">Enter a regex pattern and test text to see matches here.</p>
        </div>
      </div>
    );
  }

  function toggleMatch(idx) {
    setExpandedMatches((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedMatches(new Set(matches.map((_, i) => i)));
  }

  function collapseAll() {
    setExpandedMatches(new Set());
  }

  return (
    <div className="match-tree" id="match-tree">
      <div className="match-tree-header">
        <h3>Matches ({matches.length})</h3>
        <div className="tree-controls">
          <button onClick={expandAll} className="tree-btn" title="Expand all">
            <span>⊞</span>
          </button>
          <button onClick={collapseAll} className="tree-btn" title="Collapse all">
            <span>⊟</span>
          </button>
        </div>
      </div>

      <div className="match-list">
        {matches.map((match, idx) => {
          const isExpanded = expandedMatches.has(idx);
          return (
            <div key={idx} className={`match-item ${isExpanded ? 'expanded' : ''}`}>
              <button
                className="match-header"
                onClick={() => toggleMatch(idx)}
                id={`match-${idx}`}
              >
                <span className={`chevron ${isExpanded ? 'open' : ''}`}>▸</span>
                <span className="match-badge">Match {idx + 1}</span>
                <code className="match-value">"{match.fullMatch}"</code>
                <span className="match-index">@{match.index}</span>
              </button>

              {isExpanded && (
                <div className="match-details">
                  <div className="match-detail-row">
                    <span className="detail-label">Full match</span>
                    <code className="detail-value">"{match.fullMatch}"</code>
                  </div>
                  <div className="match-detail-row">
                    <span className="detail-label">Index</span>
                    <span className="detail-value">{match.index}</span>
                  </div>
                  <div className="match-detail-row">
                    <span className="detail-label">Length</span>
                    <span className="detail-value">{match.length}</span>
                  </div>

                  {match.groups.length > 0 && (
                    <div className="capture-groups">
                      <span className="groups-title">Capture Groups</span>
                      {match.groups.map((group, gIdx) => (
                        <div key={gIdx} className="group-row">
                          <span
                            className="group-badge"
                            style={{
                              backgroundColor: `var(--match-color-${group.groupNumber % 6})`,
                            }}
                          >
                            {group.name || `Group ${group.groupNumber}`}
                          </span>
                          <code className="group-value">
                            {group.value !== undefined ? `"${group.value}"` : 'undefined'}
                          </code>
                          {group.index !== undefined && (
                            <span className="group-index">@{group.index}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
