import test from 'node:test';
import assert from 'node:assert/strict';
import { zipAreaMessage } from '../src/lib/zip-area.ts';
import { zipCheckCopy } from '../src/content/zip-check.ts';
import { normalizeZip } from '../src/lib/contact-form.ts';

const messages = { inArea: 'IN', outOfArea: 'OUT', notConfigured: 'NOT SET' };
const houston = { zipPrefixes: ['770', '773'], zipMessages: messages };
const unset = { zipPrefixes: [], zipMessages: messages };

test('an incomplete or invalid ZIP code gets no answer (the page shows the prompt)', () => {
  for (const value of ['', '   ', '7520', 'abcde', '75201 1234', '752011', '77002x']) assert.equal(zipAreaMessage(value, houston), '', JSON.stringify(value));
});
test('a ZIP code is in the area when it starts with one of the prefixes', () => {
  for (const value of ['77002', ' 77002 ', '77301', '77002-1234', '770021234']) assert.equal(zipAreaMessage(value, houston), 'IN', value);
});
test('a ZIP code outside the prefixes is out of the area', () => {
  for (const value of ['75201', '78701', '75201-1234']) assert.equal(zipAreaMessage(value, houston), 'OUT', value);
});
test('while the list of ZIP codes is not configured, a valid ZIP code gets the placeholder, never a yes or no', () => {
  for (const value of ['77002', '75201']) assert.equal(zipAreaMessage(value, unset), 'NOT SET');
  assert.equal(zipAreaMessage('', unset), '');
});
test('the box and the contact form agree on what a ZIP code is', () => {
  for (const value of ['75201', '75201-1234', '752011234', '7520', '75201-12', 'ABCDE', ' 75201 ']) {
    assert.equal(zipAreaMessage(value, houston) !== '', normalizeZip(value) !== null, JSON.stringify(value));
  }
});
test('the shared copy has every answer the box can give', () => {
  for (const key of ['label', 'placeholder', 'button', 'prompt', 'inArea', 'outOfArea', 'notConfigured']) assert(zipCheckCopy[key].length > 0, key);
});
