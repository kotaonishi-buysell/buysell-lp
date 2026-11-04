import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const script = new URL('../scripts/check-public-todos.mjs', import.meta.url).pathname;
const run = (html) => {
  const dir = mkdtempSync(join(tmpdir(), 'public-todos-'));
  try {
    writeFileSync(join(dir, 'page.html'), html);
    return spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test('the public-page guard passes a page with no TODO', () => {
  assert.equal(run('<p>Texas registration pending nothing here</p>').status, 0);
});

test('the guard fails on a rendered TODO marker, its placeholder style, or a TODO in a script', () => {
  assert.equal(run('<span class="todo">TODO: state registration number</span>').status, 1);
  assert.equal(run('<span class="todo">anything</span>').status, 1);
  assert.equal(run('<script>var m="{{TODO: x}}"</script>').status, 1);
});
