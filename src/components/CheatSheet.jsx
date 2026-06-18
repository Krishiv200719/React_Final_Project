import { useState } from 'react';

const CHEAT_SHEET_SECTIONS = [
  {
    title: 'Character Classes',
    items: [
      { token: '.', desc: 'Any character except newline' },
      { token: '\\d', desc: 'Digit (0-9)' },
      { token: '\\D', desc: 'Not a digit' },
      { token: '\\w', desc: 'Word character (a-z, A-Z, 0-9, _)' },
      { token: '\\W', desc: 'Not a word character' },
      { token: '\\s', desc: 'Whitespace (space, tab, newline)' },
      { token: '\\S', desc: 'Not whitespace' },
      { token: '[abc]', desc: 'Any of a, b, or c' },
      { token: '[^abc]', desc: 'Not a, b, or c' },
      { token: '[a-z]', desc: 'Character range a to z' },
    ],
  },
  {
    title: 'Anchors',
    items: [
      { token: '^', desc: 'Start of string / line' },
      { token: '$', desc: 'End of string / line' },
      { token: '\\b', desc: 'Word boundary' },
      { token: '\\B', desc: 'Not a word boundary' },
    ],
  },
  {
    title: 'Quantifiers',
    items: [
      { token: '*', desc: 'Zero or more' },
      { token: '+', desc: 'One or more' },
      { token: '?', desc: 'Zero or one (optional)' },
      { token: '{3}', desc: 'Exactly 3' },
      { token: '{3,}', desc: '3 or more' },
      { token: '{3,5}', desc: 'Between 3 and 5' },
      { token: '*?', desc: 'Zero or more (lazy)' },
      { token: '+?', desc: 'One or more (lazy)' },
    ],
  },
  {
    title: 'Groups & References',
    items: [
      { token: '(abc)', desc: 'Capturing group' },
      { token: '(?:abc)', desc: 'Non-capturing group' },
      { token: '(?=abc)', desc: 'Positive lookahead' },
      { token: '(?!abc)', desc: 'Negative lookahead' },
      { token: '(?<=abc)', desc: 'Positive lookbehind' },
      { token: '(?<!abc)', desc: 'Negative lookbehind' },
      { token: '|', desc: 'Alternation (OR)' },
    ],
  },
  {
    title: 'Escape Sequences',
    items: [
      { token: '\\n', desc: 'Newline' },
      { token: '\\t', desc: 'Tab' },
      { token: '\\r', desc: 'Carriage return' },
      { token: '\\.', desc: 'Escaped dot (literal .)' },
      { token: '\\\\', desc: 'Escaped backslash' },
    ],
  },
];

export default function CheatSheet({ onInject }) {
  const [openSections, setOpenSections] = useState(new Set([0]));

  function toggleSection(idx) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  return (
    <div className="cheat-sheet" id="cheat-sheet">
      <h3>Quick Reference</h3>
      <div className="accordion">
        {CHEAT_SHEET_SECTIONS.map((section, sIdx) => {
          const isOpen = openSections.has(sIdx);
          return (
            <div key={sIdx} className={`accordion-section ${isOpen ? 'open' : ''}`}>
              <button
                className="accordion-header"
                onClick={() => toggleSection(sIdx)}
                id={`cheat-section-${sIdx}`}
              >
                <span className={`chevron ${isOpen ? 'open' : ''}`}>▸</span>
                <span>{section.title}</span>
              </button>
              {isOpen && (
                <div className="accordion-body">
                  {section.items.map((item, iIdx) => (
                    <button
                      key={iIdx}
                      className="cheat-item"
                      onClick={() => onInject(item.token)}
                      title={`Click to insert: ${item.token}`}
                    >
                      <code className="cheat-token">{item.token}</code>
                      <span className="cheat-desc">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
