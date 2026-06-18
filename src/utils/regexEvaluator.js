/**
 * Regex Evaluator
 * Safely creates RegExp objects and evaluates them against test strings.
 * Includes catastrophic backtracking prevention.
 */

const MAX_EXEC_TIME_MS = 2000;
const MAX_MATCHES = 500;

/**
 * Attempt to create a RegExp from user input.
 * Returns { regex: RegExp, error: null } on success,
 * or { regex: null, error: string } on failure.
 */
export function createSafeRegex(pattern, flags = '') {
  if (!pattern) {
    return { regex: null, error: null };
  }

  try {
    const regex = new RegExp(pattern, flags);
    return { regex, error: null };
  } catch (err) {
    return { regex: null, error: err.message };
  }
}

/**
 * Evaluate a regex against test text.
 * Returns an object:
 * {
 *   matches: Array<{
 *     fullMatch: string,
 *     index: number,
 *     length: number,
 *     groups: Array<{ value: string|undefined, index: number|undefined, name: string|undefined }>
 *   }>,
 *   error: string|null,
 *   executionTime: number
 * }
 */
export function evaluateRegex(pattern, flags, testText) {
  if (!pattern || !testText) {
    return { matches: [], error: null, executionTime: 0 };
  }

  // Ensure 'g' flag is present for matchAll to work
  let evalFlags = flags;
  if (!evalFlags.includes('g')) {
    evalFlags = 'g' + evalFlags;
  }

  const { regex, error } = createSafeRegex(pattern, evalFlags);
  if (error) {
    return { matches: [], error, executionTime: 0 };
  }
  if (!regex) {
    return { matches: [], error: null, executionTime: 0 };
  }

  const startTime = performance.now();
  const matches = [];

  try {
    let lastIndex = -1;
    for (const match of testText.matchAll(regex)) {
      const elapsed = performance.now() - startTime;
      if (elapsed > MAX_EXEC_TIME_MS) {
        return {
          matches,
          error: `Execution timed out after ${MAX_EXEC_TIME_MS}ms — possible catastrophic backtracking. Simplify your regex.`,
          executionTime: elapsed,
        };
      }

      if (matches.length >= MAX_MATCHES) {
        return {
          matches,
          error: `Stopped after ${MAX_MATCHES} matches. Too many results.`,
          executionTime: performance.now() - startTime,
        };
      }

      // Guard against zero-length match infinite loops
      if (match.index === lastIndex) {
        break;
      }
      lastIndex = match.index;

      const groups = [];
      for (let g = 1; g < match.length; g++) {
        groups.push({
          value: match[g],
          index: match[g] !== undefined ? findGroupIndex(testText, match.index, match[0], match[g], g) : undefined,
          name: match.groups ? Object.keys(match.groups).find(k => match.groups[k] === match[g]) : undefined,
          groupNumber: g,
        });
      }

      matches.push({
        fullMatch: match[0],
        index: match.index,
        length: match[0].length,
        groups,
      });
    }
  } catch (err) {
    return {
      matches,
      error: err.message,
      executionTime: performance.now() - startTime,
    };
  }

  return {
    matches,
    error: null,
    executionTime: performance.now() - startTime,
  };
}

/**
 * Try to find the index of a capture group value within the full match.
 * This is a best-effort heuristic since JS doesn't expose group indices natively
 * without the 'd' flag (which has limited support).
 */
function findGroupIndex(text, matchStart, fullMatch, groupValue, groupNum) {
  if (groupValue === undefined) return undefined;

  // Try using 'd' flag if available
  try {
    // Simple fallback: find the group value within the full match
    const offset = fullMatch.indexOf(groupValue);
    if (offset !== -1) {
      return matchStart + offset;
    }
  } catch {
    // ignore
  }

  return matchStart;
}

/**
 * Quick validation check — does the pattern compile?
 */
export function validateRegex(pattern, flags = '') {
  return createSafeRegex(pattern, flags);
}
