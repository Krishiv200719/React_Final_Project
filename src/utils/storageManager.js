/**
 * Storage Manager
 * Manages saved regex snippets in localStorage.
 * Each snippet: { id, name, pattern, flags, testText, createdAt, updatedAt }
 */

const STORAGE_KEY = 'regex_sandbox_snippets';

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(snippets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Get all saved snippets.
 */
export function getSnippets() {
  return getAll();
}

/**
 * Save a new snippet.
 */
export function saveSnippet({ name, pattern, flags, testText }) {
  const snippets = getAll();
  const snippet = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    name: name || 'Untitled',
    pattern,
    flags,
    testText,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  snippets.unshift(snippet);
  saveAll(snippets);
  return snippet;
}

/**
 * Update an existing snippet by ID.
 */
export function updateSnippet(id, updates) {
  const snippets = getAll();
  const index = snippets.findIndex(s => s.id === id);
  if (index === -1) return null;
  snippets[index] = {
    ...snippets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveAll(snippets);
  return snippets[index];
}

/**
 * Delete a snippet by ID.
 */
export function deleteSnippet(id) {
  const snippets = getAll().filter(s => s.id !== id);
  saveAll(snippets);
  return snippets;
}

/**
 * Rename a snippet.
 */
export function renameSnippet(id, newName) {
  return updateSnippet(id, { name: newName });
}
