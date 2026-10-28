import test from 'node:test';
import assert from 'node:assert/strict';
import { serviceAreaZips, dallasFortWorthZips, houstonZips, serviceAreaCounties } from '../src/content/service-area-zips.ts';
import { site } from '../src/content/site.ts';
import { zipAreaMessage } from '../src/lib/zip-area.ts';
import { zipCheckCopy } from '../src/content/zip-check.ts';

const config = {
  zipPrefixes: site.serviceArea.zipPrefixes,
  zipMessages: { inArea: zipCheckCopy.inArea, outOfArea: zipCheckCopy.outOfArea, notConfigured: zipCheckCopy.notConfigured },
};

test('the list is made of unique, sorted, 5-digit Texas ZIP codes (Austin County, in the Houston area, has 789xx ZIP codes)', () => {
  assert(serviceAreaZips.length > 600);
  assert.equal(new Set(serviceAreaZips).size, serviceAreaZips.length);
  assert.deepEqual([...serviceAreaZips].sort(), serviceAreaZips);
  for (const zip of serviceAreaZips) assert.match(zip, /^7[5-8]\d{3}$/, zip);
});
test('the two areas are the counties we decided on, and their ZIP codes do not overlap', () => {
  assert.equal(serviceAreaCounties['Dallas–Fort Worth'].length, 11);
  assert.equal(serviceAreaCounties.Houston.length, 9);
  assert.equal(dallasFortWorthZips.filter((z) => houstonZips.includes(z)).length, 0);
  assert.equal(serviceAreaZips.length, dallasFortWorthZips.length + houstonZips.length);
});
test('well-known ZIP codes of the two areas are included', () => {
  const inArea = { Dallas: '75201', 'Fort Worth': '76102', Plano: '75024', Arlington: '76010', Houston: '77002', 'The Woodlands': '77380', 'Sugar Land': '77479', Galveston: '77550' };
  for (const [city, zip] of Object.entries(inArea)) assert(serviceAreaZips.includes(zip), `${city} ${zip}`);
});
test('ZIP codes of other Texas cities are not included', () => {
  const outside = { Austin: '78701', 'San Antonio': '78205', Denison: '75020', Lubbock: '79401', Tyler: '75701', 'El Paso': '79901' };
  for (const [city, zip] of Object.entries(outside)) assert(!serviceAreaZips.includes(zip), `${city} ${zip}`);
});
test('the site setting uses the list, so the ZIP box answers yes or no instead of showing the placeholder', () => {
  assert.equal(site.serviceArea.zipPrefixes, serviceAreaZips);
  assert.equal(zipAreaMessage('75201', config), zipCheckCopy.inArea);
  assert.equal(zipAreaMessage('77002-1234', config), zipCheckCopy.inArea);
  assert.equal(zipAreaMessage('78701', config), zipCheckCopy.outOfArea);
  assert.equal(zipAreaMessage('75020', config), zipCheckCopy.outOfArea);
});
test('a ZIP code is matched whole: a 5-digit ZIP is not a prefix of a different ZIP code', () => {
  const sample = serviceAreaZips[0];
  assert.equal(zipAreaMessage(sample, config), zipCheckCopy.inArea);
  // ZIP+4 of a listed ZIP is in the area; a different ZIP that merely starts like a listed one is not matched as a prefix
  assert.equal(zipAreaMessage(`${sample}-1234`, config), zipCheckCopy.inArea);
});
