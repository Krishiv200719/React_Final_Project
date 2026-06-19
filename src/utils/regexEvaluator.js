
const MAX_EXEC_TIME_MS = 2000;
const MAX_MATCHES = 500;

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


export function evaluateRegex(pattern, flags, testText) {
  if (!pattern || !testText) {
    return { matches: [], error: null, executionTime: 0 };
  }

  
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

function findGroupIndex(text, matchStart, fullMatch, groupValue, groupNum) {
  if (groupValue === undefined) return undefined;

  
  try {
    
    const offset = fullMatch.indexOf(groupValue);
    if (offset !== -1) {
      return matchStart + offset;
    }
  } catch {
    
  }

  return matchStart;
}

export function validateRegex(pattern, flags = '') {
  return createSafeRegex(pattern, flags);
}
