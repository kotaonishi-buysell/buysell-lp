// Fails when a published page prints a TODO.
// Run after `npm run build` (dist/ holds only the published pages: Silver, the legal pages, 404).
// Open questions live in `// TODO:` comments, listed by `npm run todos`; they must never reach a visitor.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist';
const files = [];
const walk = (path) => {
  if (statSync(path).isDirectory()) readdirSync(path).forEach((name) => walk(join(path, name)));
  else if (path.endsWith('.html')) files.push(path);
};
walk(root);

// A TODO marker, the placeholder style it is rendered with, or a "TODO:" in any text, script or attribute.
const pattern = /TODO\b|class="todo"|\{\{\s*TODO/;
let found = 0;
for (const file of files) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line) => {
      const match = pattern.exec(line);
      if (!match) return;
      found += 1;
      const start = Math.max(0, match.index - 60);
      console.error(`${file}: ...${line.slice(start, match.index + 90).trim()}...`);
    });
}
if (found > 0) {
  console.error(`\n${found} line(s) with a TODO in the published pages. Hide the unconfirmed fact; keep the question as a // TODO: comment.`);
  process.exit(1);
}
console.log(`No TODO in ${files.length} published page(s).`);
