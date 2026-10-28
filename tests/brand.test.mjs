import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { company } from '../src/content/company.ts';
import { site } from '../src/content/site.ts';
import { homeValueConfig } from '../src/content/lps/home-value/config.ts';

test('the brand is REWORTH and the company is BuySell America, the same on every LP', () => {
  assert.equal(company.brand, 'REWORTH');
  assert.equal(company.legalName, 'BuySell America, Inc.');
  assert.equal(site.brand.name, 'REWORTH');
  assert.equal(site.company.name, 'BuySell America, Inc.');
  assert.equal(homeValueConfig.brand, 'REWORTH');
});

test('the logo files exist and the light one is for dark backgrounds', () => {
  for (const file of [company.logo.src, company.logo.srcLight]) assert(existsSync(new URL(`../public${file}`, import.meta.url)), file);
  assert.notEqual(company.logo.src, company.logo.srcLight);
  assert(company.logo.width > 0 && company.logo.height > 0);
});

test('no LP prints the old brand "BuySell"; only the company and the group keep that name', () => {
  const files = [
    'src/pages/silver.astro',
    'src/pages/home-value.astro',
    'src/content/lps/silver.ts',
    'src/content/lps/downsizing.ts',
    'src/content/lps/home-value/index.ts',
    ...readdirSync(new URL('../src/components', import.meta.url)).filter((f) => f.endsWith('.astro')).map((f) => `src/components/${f}`),
    ...readdirSync(new URL('../src/components/home-value', import.meta.url)).map((f) => `src/components/home-value/${f}`),
  ];
  for (const file of files) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').replace(/BuySell (Technologies|America|group)/g, '');
    assert.doesNotMatch(text, /buysell/i, file);
  }
});

test('the favicon files exist and every page head uses the shared favicon', () => {
  for (const file of Object.values(company.icon)) assert(existsSync(new URL(`../public${file}`, import.meta.url)), file);
  for (const file of ['src/layouts/Document.astro', 'src/layouts/LegalLayout.astro', 'src/pages/home-value.astro']) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(text, /<Favicon \/>/, file);
    assert.doesNotMatch(text, /rel="icon" href="data:,"/, file);
  }
});
