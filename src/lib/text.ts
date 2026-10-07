/*
 * Helpers for copy that may contain {{TODO: ...}} markers.
 */
const TODO_PATTERN = /\{\{\s*(TODO[^}]*)\}\}/g;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** HTML for visible copy: escapes the text and turns TODO markers into placeholders. */
export const rich = (value: string): string =>
  escapeHtml(value).replace(TODO_PATTERN, (_match, todo: string) => `<span class="todo">${todo.trim()}</span>`);

/** Plain text for attributes, meta tags and structured data. */
export const plain = (value: string): string => value.replace(TODO_PATTERN, (_match, todo: string) => todo.trim());

/** Replaces {name} tokens. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
