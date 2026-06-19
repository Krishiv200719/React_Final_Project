import { useMemo, useRef, useEffect } from 'react';


const MATCH_COLORS = [
  'var(--match-color-0)',
  'var(--match-color-1)',
  'var(--match-color-2)',
  'var(--match-color-3)',
  'var(--match-color-4)',
  'var(--match-color-5)',
];

function buildHighlightedSegments(text, matches) {
  if (!matches || matches.length === 0) {
    return [{ text, isMatch: false }];
  }

  
  const ranges = [];
  matches.forEach((m, mIdx) => {
    ranges.push({
      start: m.index,
      end: m.index + m.length,
      matchIndex: mIdx,
      groupNumber: 0, 
      priority: 0,
    });
    m.groups.forEach((g) => {
      if (g.value !== undefined && g.index !== undefined) {
        ranges.push({
          start: g.index,
          end: g.index + g.value.length,
          matchIndex: mIdx,
          groupNumber: g.groupNumber,
          priority: g.groupNumber,
        });
      }
    });
  });

  
  ranges.sort((a, b) => a.start - b.start || b.priority - a.priority);

  
  const fullMatchRanges = ranges.filter(r => r.groupNumber === 0);
  const segments = [];
  let cursor = 0;

  for (const range of fullMatchRanges) {
    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), isMatch: false });
    }

    
    const matchGroups = ranges.filter(
      r => r.matchIndex === range.matchIndex && r.groupNumber > 0
    );

    if (matchGroups.length === 0) {
      segments.push({
        text: text.slice(range.start, range.end),
        isMatch: true,
        matchIndex: range.matchIndex,
        groupNumber: 0,
      });
    } else {
      
      let innerCursor = range.start;
      const sortedGroups = [...matchGroups].sort((a, b) => a.start - b.start);

      for (const gRange of sortedGroups) {
        if (gRange.start > innerCursor) {
          segments.push({
            text: text.slice(innerCursor, gRange.start),
            isMatch: true,
            matchIndex: range.matchIndex,
            groupNumber: 0,
          });
        }
        segments.push({
          text: text.slice(gRange.start, gRange.end),
          isMatch: true,
          matchIndex: range.matchIndex,
          groupNumber: gRange.groupNumber,
        });
        innerCursor = gRange.end;
      }

      if (innerCursor < range.end) {
        segments.push({
          text: text.slice(innerCursor, range.end),
          isMatch: true,
          matchIndex: range.matchIndex,
          groupNumber: 0,
        });
      }
    }

    cursor = range.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return segments;
}

export default function TestInputCard({ testText, onTestTextChange, matches, executionTime }) {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const segments = useMemo(
    () => buildHighlightedSegments(testText, matches),
    [testText, matches]
  );

  
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (!textarea || !highlight) return;

    const syncScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, []);

  const matchCount = matches ? matches.length : 0;

  return (
    <div className="test-input-card" id="test-input-card">
      <div className="card-header">
        <h3>Test String</h3>
        <div className="match-stats">
          {matchCount > 0 ? (
            <>
              <span className="match-count">{matchCount}</span>
              <span className="match-label">match{matchCount !== 1 ? 'es' : ''}</span>
              {executionTime > 0 && (
                <span className="exec-time">{executionTime.toFixed(1)}ms</span>
              )}
            </>
          ) : (
            <span className="no-match">No matches</span>
          )}
        </div>
      </div>

      <div className="test-input-container">
        <div className="highlight-layer" ref={highlightRef} aria-hidden="true">
          {segments.map((seg, i) =>
            seg.isMatch ? (
              <mark
                key={i}
                className={`match-highlight group-${seg.groupNumber}`}
                style={{
                  backgroundColor: MATCH_COLORS[seg.groupNumber % MATCH_COLORS.length],
                }}
              >
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </div>

        <textarea
          ref={textareaRef}
          id="test-text-input"
          className="test-textarea"
          value={testText}
          onChange={(e) => onTestTextChange(e.target.value)}
          placeholder="Paste or type your test text here..."
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
