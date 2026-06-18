/**
 * Regex Tokenizer
 * Parses a raw regex string into discrete typed tokens for syntax highlighting.
 *
 * Token types:
 *   quantifier, charClass, group, anchor, alternation, escape, literal, error
 */

const TOKEN_TYPES = {
  QUANTIFIER: 'quantifier',
  CHAR_CLASS: 'charClass',
  GROUP_OPEN: 'groupOpen',
  GROUP_CLOSE: 'groupClose',
  ANCHOR: 'anchor',
  ALTERNATION: 'alternation',
  ESCAPE: 'escape',
  LITERAL: 'literal',
  BRACKET_OPEN: 'bracketOpen',
  BRACKET_CLOSE: 'bracketClose',
  BRACKET_CONTENT: 'bracketContent',
  DOT: 'dot',
  RANGE_QUANTIFIER: 'quantifier',
};

/**
 * Tokenize a raw regex pattern string into an array of token objects.
 * Each token: { type: string, value: string, index: number }
 */
export function tokenizeRegex(pattern) {
  const tokens = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    // --- Escape sequences ---
    if (ch === '\\' && i + 1 < pattern.length) {
      const next = pattern[i + 1];
      // Shorthand character classes
      if ('dDwWsStbnrfv0'.includes(next)) {
        tokens.push({ type: TOKEN_TYPES.CHAR_CLASS, value: '\\' + next, index: i });
        i += 2;
        continue;
      }
      // Any other escaped character
      tokens.push({ type: TOKEN_TYPES.ESCAPE, value: '\\' + next, index: i });
      i += 2;
      continue;
    }

    // --- Character class brackets [...] ---
    if (ch === '[') {
      let bracketStr = '[';
      let j = i + 1;
      // Handle negation
      if (j < pattern.length && pattern[j] === '^') {
        bracketStr += '^';
        j++;
      }
      // Handle ] as first char in class
      if (j < pattern.length && pattern[j] === ']') {
        bracketStr += ']';
        j++;
      }
      while (j < pattern.length && pattern[j] !== ']') {
        if (pattern[j] === '\\' && j + 1 < pattern.length) {
          bracketStr += pattern[j] + pattern[j + 1];
          j += 2;
        } else {
          bracketStr += pattern[j];
          j++;
        }
      }
      if (j < pattern.length) {
        bracketStr += ']';
        j++;
      }
      tokens.push({ type: TOKEN_TYPES.CHAR_CLASS, value: bracketStr, index: i });
      i = j;
      continue;
    }

    // --- Groups (...)  (?:...)  (?=...)  (?!...)  (?<=...)  (?<!...) ---
    if (ch === '(') {
      let groupPrefix = '(';
      let j = i + 1;
      if (j < pattern.length && pattern[j] === '?') {
        groupPrefix += '?';
        j++;
        if (j < pattern.length && ':=!<'.includes(pattern[j])) {
          if (pattern[j] === '<' && j + 1 < pattern.length && '=!'.includes(pattern[j + 1])) {
            groupPrefix += pattern[j] + pattern[j + 1];
            j += 2;
          } else {
            groupPrefix += pattern[j];
            j++;
          }
        }
      }
      tokens.push({ type: TOKEN_TYPES.GROUP_OPEN, value: groupPrefix, index: i });
      i = j;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: TOKEN_TYPES.GROUP_CLOSE, value: ')', index: i });
      i++;
      continue;
    }

    // --- Quantifiers ---
    if (ch === '*' || ch === '+' || ch === '?') {
      // Check for lazy modifier
      let val = ch;
      if (i + 1 < pattern.length && pattern[i + 1] === '?') {
        val += '?';
      }
      tokens.push({ type: TOKEN_TYPES.QUANTIFIER, value: val, index: i });
      i += val.length;
      continue;
    }

    // --- Range quantifiers {n}, {n,}, {n,m} ---
    if (ch === '{') {
      const rangeMatch = pattern.slice(i).match(/^\{(\d+)(,(\d+)?)?\}/);
      if (rangeMatch) {
        tokens.push({ type: TOKEN_TYPES.QUANTIFIER, value: rangeMatch[0], index: i });
        i += rangeMatch[0].length;
        continue;
      }
      // Not a valid quantifier — treat as literal
      tokens.push({ type: TOKEN_TYPES.LITERAL, value: ch, index: i });
      i++;
      continue;
    }

    // --- Anchors ---
    if (ch === '^' || ch === '$') {
      tokens.push({ type: TOKEN_TYPES.ANCHOR, value: ch, index: i });
      i++;
      continue;
    }

    // --- Dot (any character) ---
    if (ch === '.') {
      tokens.push({ type: TOKEN_TYPES.DOT, value: '.', index: i });
      i++;
      continue;
    }

    // --- Alternation ---
    if (ch === '|') {
      tokens.push({ type: TOKEN_TYPES.ALTERNATION, value: '|', index: i });
      i++;
      continue;
    }

    // --- Literal character ---
    tokens.push({ type: TOKEN_TYPES.LITERAL, value: ch, index: i });
    i++;
  }

  return tokens;
}

export { TOKEN_TYPES };
