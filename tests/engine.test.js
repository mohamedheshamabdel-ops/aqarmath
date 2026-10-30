// Run: node tests/engine.test.js
const assert = require('assert');
const E = require('../engine.js');

const A = { bench: 'auto', bank: 19, inf: 13.9, fx: 54.58, dep: 8, gold: 15, rentG: 10, vac: 15, svc: 5, pg: 14, tax: true,
  saleFee: 2.5, resaleDisc: 10, transfer: 3, dispTax: false, sellM: 3, negot: 5 };
const base = { zone: 's90', finish: 'full', area: 100, price: 18000000, disc: 0, down: 100, dp2: 0, dp2m: 3, years: 0, freq: 4,
  delm: 0, delpay: 0, maint: 0, maintb: 6, fin: null, lease: null, cash: 0, dev: 'big', source: 'developer', afterDel: 'finish', grade: 'B', rent: 0 };
let pass = 0; const t = (name, fn) => { fn(); pass++; console.log('ok -', name); };

t('cash ready unit no longer breaks even in a few months', () => {
  const r = E.compute(base, A, { H: 5, scn: 'base' });
  assert(r.saleBeM > 6, `break-even month ${r.saleBeM}`);
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
t('an overpriced unit does not beat the certificate', () => {
  const r = E.compute({ ...base, price: 40000000 }, A, { H: 5, scn: 'base' });
  assert(r.npv < 0 && !r.beats);
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
t('remaining installments are valued at present value when selling', () => {
  const r = E.compute({ ...base, price: 8000000, down: 10, years: 8, delm: 36, maint: 8 }, A, { H: 3, scn: 'base' });
  assert(isFinite(r.irr), 'IRR exists for an early off-plan sale');
  assert(r.unpaidNominal(36) > 0);
});
t('estimated cash discount is capped at 30%', () => {
  const r = E.compute({ ...base, down: 5, years: 10 }, A, { H: 5, scn: 'base' });
  assert(r.cashValue >= r.net * 0.7 - 1);
});
t('base price growth follows the input, scenarios add offsets', () => {
  assert(Math.abs(E.compute(base, A, { H: 5, scn: 'base' }).pg - 0.14) < 1e-9);
  assert(Math.abs(E.compute(base, A, { H: 5, scn: 'low' }).pg - 0.08) < 1e-9);
  assert(Math.abs(E.compute(base, A, { H: 5, scn: 'high' }).pg - 0.22) < 1e-9);
});
t('cautious scenario delays delivery by a year', () => {
  const r = E.compute({ ...base, delm: 24 }, A, { H: 5, scn: 'low' });
  assert.strictEqual(r.delivery, 36);
});
t('a rent quote overrides the market rent', () => {
  const r = E.compute({ ...base, rent: 2000 }, A, { H: 5, scn: 'base' });
  assert(r.rentQuoted && r.rentM2 === 2000);
});
t('unrealistic yields are flagged', () => {
  assert(E.compute({ ...base, price: 3000000 }, A, { H: 5, scn: 'base' }).yieldWarn);
  assert(!E.compute(base, A, { H: 5, scn: 'base' }).yieldWarn);
});
t('long holds of a fair cash unit are close to the certificate', () => {
  const r = E.compute({ ...base, price: 17000000, source: 'resale' }, A, { H: 7, scn: 'base' });
  assert(Math.abs(r.real - r.benchReal) < 0.05, `real ${r.real} bench ${r.benchReal}`);
});
t('IRR of a known cash flow', () => {
  const r = E.bisect(x => -100 + 110 / (1 + x), -0.5, 1);
  assert(Math.abs(r - 0.1) < 1e-6);
});
t('rent starts 3 months after delivery by default', () => {
  const r = E.compute({ ...base, finish: 'semi', delm: 12 }, A, { H: 5, scn: 'base' });
  assert.strictEqual(r.rentStart, 15);
});
t('keeping the unit skips sale costs and reports income milestones', () => {
  const sell = E.compute(base, A, { H: 10, scn: 'base' });
  const keep = E.compute(base, A, { H: 10, scn: 'base', keep: true });
  assert(keep.irr > sell.irr && keep.keep);
  assert(keep.years[4].yoc > 0 && keep.years[4].certInc > 0);
});
console.log(`\n${pass} passed`);
