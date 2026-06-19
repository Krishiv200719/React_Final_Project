
import { TOKEN_TYPES } from './regexTokenizer';

const SHORTHAND_MAP = {
  '\\d': 'any digit (0-9)',
  '\\D': 'any non-digit character',
  '\\w': 'any word character (letter, digit, or underscore)',
  '\\W': 'any non-word character',
  '\\s': 'any whitespace character (space, tab, newline)',
  '\\S': 'any non-whitespace character',
  '\\b': 'a word boundary',
  '\\B': 'a non-word boundary',
  '\\t': 'a tab character',
  '\\n': 'a newline character',
  '\\r': 'a carriage return',
  '\\f': 'a form feed character',
  '\\v': 'a vertical tab character',
  '\\0': 'a null character',
};

function explainQuantifier(value) {
  const lazy = value.endsWith('?') && value.length > 1;
  const base = lazy ? value.slice(0, -1) : value;
  let desc = '';

  if (base === '*') {
    desc = 'zero or more times';
  } else if (base === '+') {
    desc = 'one or more times';
  } else if (base === '?') {
    desc = 'zero or one time (optional)';
  } else {
    
    const rangeMatch = base.match(/^\{(\d+)(,(\d+)?)?\}$/);
    if (rangeMatch) {
      const min = rangeMatch[1];
      const hasComma = rangeMatch[2] !== undefined;
      const max = rangeMatch[3];
      if (!hasComma) {
        desc = `exactly ${min} time${min === '1' ? '' : 's'}`;
      } else if (max === undefined) {
        desc = `${min} or more times`;
      } else {
        desc = `between ${min} and ${max} times`;
      }
    }
  }

  if (lazy) {
    desc += ' (lazy — as few as possible)';
  }

  return desc;
}

function explainCharClass(value) {
  if (SHORTHAND_MAP[value]) {
    return `Match ${SHORTHAND_MAP[value]}`;
  }

  
  if (value.startsWith('[')) {
    const inner = value.slice(1, -1);
    if (inner.startsWith('^')) {
      return `Match any character NOT in the set: ${inner.slice(1)}`;
    }
    return `Match any character in the set: ${inner}`;
  }

  return `Match ${value}`;
}

function explainGroupOpen(value) {
  if (value === '(') return 'Start capturing group';
  if (value === '(?:') return 'Start non-capturing group';
  if (value === '(?=') return 'Start positive lookahead';
  if (value === '(?!') return 'Start negative lookahead';
  if (value === '(?<=') return 'Start positive lookbehind';
  if (value === '(?<!') return 'Start negative lookbehind';
  return `Start group: ${value}`;
}

export function explainRegex(tokens) {
  const steps = [];
  let prevWasQuantifiable = false;
  let lastQuantifiableDesc = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let desc = '';

    switch (token.type) {
      case TOKEN_TYPES.ANCHOR:
        if (token.value === '^') desc = 'Assert position at the start of the line';
        else if (token.value === '$') desc = 'Assert position at the end of the line';
        prevWasQuantifiable = false;
        break;

      case TOKEN_TYPES.CHAR_CLASS:
        desc = explainCharClass(token.value);
        prevWasQuantifiable = true;
        lastQuantifiableDesc = desc;
        break;

      case TOKEN_TYPES.ESCAPE:
        if (SHORTHAND_MAP[token.value]) {
          desc = `Match ${SHORTHAND_MAP[token.value]}`;
        } else {
          const escaped = token.value.slice(1);
          desc = `Match the literal character "${escaped}"`;
        }
        prevWasQuantifiable = true;
        lastQuantifiableDesc = desc;
        break;

      case TOKEN_TYPES.DOT:
        desc = 'Match any character (except newline)';
        prevWasQuantifiable = true;
        lastQuantifiableDesc = desc;
        break;

      case TOKEN_TYPES.LITERAL:
        desc = `Match the character "${token.value}" literally`;
        prevWasQuantifiable = true;
        lastQuantifiableDesc = desc;
        break;

      case TOKEN_TYPES.QUANTIFIER: {
        const quantDesc = explainQuantifier(token.value);
        if (prevWasQuantifiable && steps.length > 0) {
          
          steps[steps.length - 1].text += `, ${quantDesc}`;
        } else {
          desc = `Repeat previous ${quantDesc}`;
        }
        prevWasQuantifiable = false;
        break;
      }

      case TOKEN_TYPES.GROUP_OPEN:
        desc = explainGroupOpen(token.value);
        prevWasQuantifiable = false;
        break;

      case TOKEN_TYPES.GROUP_CLOSE:
        desc = 'End group';
        prevWasQuantifiable = true;
        lastQuantifiableDesc = desc;
        break;

      case TOKEN_TYPES.ALTERNATION:
        desc = 'OR';
        prevWasQuantifiable = false;
        break;

      default:
        desc = `"${token.value}"`;
        prevWasQuantifiable = false;
    }

    if (desc) {
      steps.push({ text: desc, tokenIndex: i });
    }
  }

  return steps;
}
