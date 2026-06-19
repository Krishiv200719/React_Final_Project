import { useState, useRef, useEffect, useCallback } from 'react';
import { tokenizeRegex, TOKEN_TYPES } from '../utils/regexTokenizer';
import { validateRegex } from '../utils/regexEvaluator';

const TOKEN_CLASSNAMES = {
  [TOKEN_TYPES.QUANTIFIER]: 'tok-quantifier',
  [TOKEN_TYPES.CHAR_CLASS]: 'tok-charclass',
  [TOKEN_TYPES.GROUP_OPEN]: 'tok-group',
  [TOKEN_TYPES.GROUP_CLOSE]: 'tok-group',
  [TOKEN_TYPES.ANCHOR]: 'tok-anchor',
  [TOKEN_TYPES.ALTERNATION]: 'tok-alternation',
  [TOKEN_TYPES.ESCAPE]: 'tok-escape',
  [TOKEN_TYPES.DOT]: 'tok-dot',
  [TOKEN_TYPES.LITERAL]: 'tok-literal',
};

const FLAGS = [
  { key: 'g', label: 'Global', desc: 'Find all matches' },
  { key: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
  { key: 'm', label: 'Multiline', desc: '^/$ match line boundaries' },
  { key: 's', label: 'DotAll', desc: '. matches newlines' },
  { key: 'u', label: 'Unicode', desc: 'Enable Unicode support' },
];

export default function RegexInputBar({ pattern, onPatternChange, flags, onFlagsChange, onInjectToken }) {
  const inputRef = useRef(null);
  const highlightRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const tokens = tokenizeRegex(pattern);
  const { error } = validateRegex(pattern, flags);

  
  const handleScroll = useCallback(() => {
    if (highlightRef.current && inputRef.current) {
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, []);

  
  useEffect(() => {
    if (onInjectToken) {
      onInjectToken.current = (tokenStr) => {
        if (inputRef.current) {
          const start = inputRef.current.selectionStart;
          const end = inputRef.current.selectionEnd;
          const newPattern = pattern.slice(0, start) + tokenStr + pattern.slice(end);
          onPatternChange(newPattern);
          
          setTimeout(() => {
            inputRef.current.selectionStart = start + tokenStr.length;
            inputRef.current.selectionEnd = start + tokenStr.length;
            inputRef.current.focus();
          }, 0);
        }
      };
    }
  }, [pattern, onPatternChange, onInjectToken]);

  function toggleFlag(flag) {
    if (flags.includes(flag)) {
      onFlagsChange(flags.replace(flag, ''));
    } else {
      onFlagsChange(flags + flag);
    }
  }

  return (
    <div className="regex-input-bar" id="regex-input-bar">
      <div className="regex-input-wrapper">
        <span className="regex-delimiter">/</span>
        <div className={`regex-input-container ${error ? 'has-error' : ''} ${isFocused ? 'focused' : ''}`}>
          
          <div className="regex-highlight-overlay" ref={highlightRef} aria-hidden="true">
            {tokens.map((tok, i) => (
              <span key={i} className={TOKEN_CLASSNAMES[tok.type] || 'tok-literal'}>
                {tok.value}
              </span>
            ))}
            <span>&nbsp;</span>
          </div>
          <input
            ref={inputRef}
            id="regex-pattern-input"
            type="text"
            className="regex-input"
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            onScroll={handleScroll}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter regex pattern..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
        <span className="regex-delimiter">/</span>
        <span className="regex-flags-display">{flags || <span className="flags-placeholder">flags</span>}</span>
      </div>

      <div className="regex-flags" id="regex-flags">
        {FLAGS.map(({ key, label, desc }) => (
          <button
            key={key}
            className={`flag-toggle ${flags.includes(key) ? 'active' : ''}`}
            onClick={() => toggleFlag(key)}
            title={`${label}: ${desc}`}
            id={`flag-${key}`}
          >
            <span className="flag-key">{key}</span>
            <span className="flag-label">{label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="regex-error" id="regex-error">
          <span className="error-icon">⚠</span>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
}
