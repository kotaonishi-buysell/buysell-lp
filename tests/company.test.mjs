import test from 'node:test';
import assert from 'node:assert/strict';
import { company, isCallablePhone } from '../src/content/company.ts';
import { buildSite, site } from '../src/content/site.ts';
import { buildHomeValueConfig, homeValueConfig } from '../src/content/lps/home-value/config.ts';

const confirmed = {
  brand: 'BuySell',
  legalName: 'BuySell Texas LLC',
  group: { name: 'BuySell Technologies Co. Ltd.' },
  address: '100 Main St, Dallas, TX 75201',
  phone: { display: '(214) 555-0123', e164: '+12145550123' },
  hours: 'Mon–Fri, 9 a.m.–5 p.m.',
  timeZone: 'Central Time',
  occc: { registrationNumber: 'OCCC-12345', regulatorNotice: 'OCCC notice text' },
};
const unconfirmed = { ...confirmed, legalName: null, address: null, phone: null, hours: null, occc: { registrationNumber: null, regulatorNotice: null } };

test('the checked-in company facts are either unconfirmed or well formed', () => {
  if (company.phone !== null) {
    assert.ok(isCallablePhone(company.phone), 'company.phone must be a valid U.S. number');
  }
  for (const key of ['legalName', 'address', 'hours']) assert.notEqual(company[key]?.trim?.(), '', `${key} must be null or text`);
});

test('a phone number whose display and e164 disagree is not callable', () => {
  assert.equal(isCallablePhone(confirmed.phone), true);
  assert.equal(isCallablePhone({ display: '1 (214) 555-0123', e164: '+12145550123' }), true);
  assert.equal(isCallablePhone({ display: '(214) 555-0199', e164: '+12145550123' }), false);
  assert.equal(isCallablePhone({ display: '(800) 000-0000', e164: '+18000000000' }), false);
  assert.equal(isCallablePhone(null), false);
});

test('confirmed company facts reach Downsizing/Silver and Home Value from the one source', () => {
  const legacy = buildSite(confirmed);
  const hv = buildHomeValueConfig(confirmed);
  assert.equal(legacy.company.name, 'BuySell Texas LLC');
  assert.equal(legacy.company.address, '100 Main St, Dallas, TX 75201');
  assert.equal(legacy.company.registration.value, 'OCCC-12345');
  assert.equal(legacy.company.hours, 'Mon–Fri, 9 a.m.–5 p.m., Central Time');
  assert.equal(legacy.regulator.value, 'OCCC notice text');
  assert.equal(legacy.phone.e164, '+12145550123');
  assert.equal(hv.phone.e164, legacy.phone.e164);
  assert.equal(hv.phone.display, legacy.phone.display);
  assert.equal(hv.hours, 'Mon–Fri, 9 a.m.–5 p.m. (Central Time)');
  assert.deepEqual(hv.localOperator, { name: 'BuySell Texas LLC', address: '100 Main St, Dallas, TX 75201', contact: '(214) 555-0123' });
});

test('unconfirmed facts: legacy LPs show TODO placeholders, Home Value shows nothing and no dummy number', () => {
  const legacy = buildSite(unconfirmed);
  const hv = buildHomeValueConfig(unconfirmed);
  assert.match(legacy.company.address, /^\{\{TODO:/);
  assert.match(legacy.company.registration.value, /^\{\{TODO:/);
  assert.match(legacy.regulator.value, /^\{\{TODO:/);
  assert.match(legacy.company.hours, /^\{\{TODO: days and hours\}\}, Central Time$/);
  assert.equal(hv.phone, null);
  assert.equal(hv.hours, null);
  assert.equal(hv.localOperator, null);
});

test('Home Value needs both the entity name and address before showing a local operator', () => {
  assert.equal(buildHomeValueConfig({ ...confirmed, address: null }).localOperator, null);
  assert.equal(buildHomeValueConfig({ ...confirmed, legalName: null }).localOperator, null);
  assert.equal(buildHomeValueConfig({ ...confirmed, phone: null }).localOperator.contact, null);
});

test('the exported site and Home Value config are built from the checked-in company facts', () => {
  assert.deepEqual(site, buildSite(company));
  assert.deepEqual(homeValueConfig, buildHomeValueConfig(company));
});
