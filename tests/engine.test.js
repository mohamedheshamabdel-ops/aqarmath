// Run: node tests/engine.test.js
const assert = require('assert');
const E = require('../engine.js');

const A = { bench: 'auto', bank: 19, inf: 13.9, fx: 54.58, dep: 8, gold: 15, egx: 18, rentG: 10, vac: 8, svc: 5, tax: true,
  saleFee: 2.5, resaleDisc: 10, transfer: 3, dispTax: false, sellM: 3, negot: 5 };
const base = { zone: 's90', finish: 'full', area: 100, price: 18000000, disc: 0, down: 100, dp2: 0, dp2m: 3, years: 0, freq: 4,
  delm: 0, delpay: 0, maint: 0, maintb: 6, fin: null, lease: null, cash: 0, dev: 'big', source: 'developer', afterDel: 'finish' };
let pass = 0; const t = (name, fn) => { fn(); pass++; console.log('ok -', name); };

t('cash ready unit no longer breaks even in a few months', () => {
  const r = E.compute(base, A, { H: 5, scn: 'base' });
  assert(r.saleBeM > 9, `break-even month ${r.saleBeM}`);
});
t('resale-market purchase has no resale discount', () => {
  const r = E.compute({ ...base, source: 'resale' }, A, { H: 5, scn: 'base' });
  assert.strictEqual(r.resaleDisc, 0);
});
t('installment plan uses estimated cash value, not list price', () => {
  const r = E.compute({ ...base, down: 10, years: 6 }, A, { H: 5, scn: 'base' });
  assert(r.cashEstimated && r.cashValue < r.net * 0.85, `cash ${r.cashValue} vs net ${r.net}`);
});
t('installments no longer beat cash just by deferring payment', () => {
  const cash = E.compute(base, A, { H: 5, scn: 'base' });
  const inst = E.compute({ ...base, down: 10, years: 6 }, A, { H: 5, scn: 'base' });
  assert(Math.abs(inst.real - cash.real) < 0.06, `cash ${cash.real} inst ${inst.real}`);
});
t('finishing a semi unit earns fitted rent', () => {
  const r = E.compute({ ...base, finish: 'semi' }, A, { H: 5, scn: 'base' });
  assert.strictEqual(r.rentFinish, 'full'); assert(r.finCost > 0);
  const asis = E.compute({ ...base, finish: 'semi', afterDel: 'asis' }, A, { H: 5, scn: 'base' });
  assert.strictEqual(asis.rentFinish, 'semi'); assert.strictEqual(asis.finCost, 0);
});
t('alternatives line starts rent only after delivery', () => {
  const r = E.compute({ ...base, delm: 24 }, A, { H: 5, scn: 'base' });
  const v1 = r.value(12) / r.allIn * 1e6;
  assert(Math.abs(r.line[1] - v1) < 1, 'no rent in year 1 for a unit delivered in year 2');
});
t('transfer fee applies before delivery only', () => {
  const r = E.compute({ ...base, delm: 24 }, A, { H: 5, scn: 'base' });
  assert(r.feeAt(12) > r.feeAt(36));
});
t('benchmark: 5-year certificate for 5-year hold, declining for 3-year hold', () => {
  assert.strictEqual(E.benchPath(A, 5).mode, 'nbe5');
  assert.strictEqual(E.benchPath(A, 3).mode, 'nbe3');
  assert(Math.abs(E.NBE5_EFF - 0.1524) < 0.001);
});
t('negative NPV caps the score below 50', () => {
  const r = E.compute({ ...base, price: 40000000 }, A, { H: 5, scn: 'base' });
  assert(r.npv < 0 && r.score <= 49, `npv ${r.npv} score ${r.score}`);
});
t('validation rejects zero price, zero area and plan over 100%', () => {
  assert(E.validate({ ...base, price: 0 }).price);
  assert(E.validate({ ...base, area: 0 }).area);
  assert(E.validate({ ...base, down: 60, dp2: 30, delpay: 20 }).down);
  assert.deepStrictEqual(E.validate(base), {});
});
t('100% down ignores installment years', () => {
  const p = E.buildPlan({ ...base, down: 100, years: 5 });
  assert.strictEqual(p.n, 0); assert(p.isCash);
});
t('coverage ignores the down payment', () => {
  const r = E.compute(base, A, { H: 5, scn: 'base' });
  assert(r.years.every(y => !isFinite(y.cov)), 'cash unit has no installment coverage');
});
t('IRR of a known cash flow', () => {
  const r = E.bisect(x => -100 + 110 / (1 + x), -0.5, 1);
  assert(Math.abs(r - 0.1) < 1e-6);
});
console.log(`\n${pass} passed`);
