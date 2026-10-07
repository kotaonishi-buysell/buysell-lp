// Lists every unconfirmed business fact left in the content and scripts:
// {{TODO: ...}} markers in copy and "TODO:" comments.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const roots = ['src', 'astro.config.mjs'];
const files = [];
const walk = (path) => {
  if (statSync(path).isDirectory()) readdirSync(path).forEach((name) => walk(join(path, name)));
  else if (/\.(ts|astro|mjs)$/.test(path)) files.push(path);
};
roots.forEach(walk);

const markerPattern = /\{\{\s*(TODO[^}]*)\}\}|\/\/\s*(TODO:.*)$|^\s*\*\s*(TODO:.*)$/;
let count = 0;
for (const file of files) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (file.endsWith('list-todos.mjs')) return;
      const match = line.match(markerPattern);
      if (!match) return;
      const text = (match[1] ?? match[2] ?? match[3]).trim();
      if (text === 'TODO: ...') return; // documentation of the marker itself
      count += 1;
      console.log(`${relative(process.cwd(), file)}:${index + 1}  ${text}`);
    });
}
console.log(`\n${count} TODO item(s).`);
