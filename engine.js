/* AqarMath calculation engine.
   Pure functions, no DOM. Loaded in the browser as window.AQM and in Node via require().
   All money in EGP, all time in months from the contract date. */
(function (root) {
  'use strict';

  /* ---------- reference data ---------- */
  const ZONES = [
    { id: 's90',  en: 'South 90th St',    ar: 'التسعين الجنوبي' },
    { id: 'n90',  en: 'North 90th St',    ar: 'التسعين الشمالي' },
    { id: 'bank', en: 'Banking District', ar: 'المنطقة البنكية' },
    { id: 'd5',   en: 'Fifth District',   ar: 'الحي الخامس' }
  ];
  /* Rent by building grade, from Knight Frank Cairo office review Q2 2026 (USD/m²/year,
     converted at 54.58 EGP and divided by 12). Grade A business park ≈ $348, Grade B ≈ $283.5.
     Semi-finished and core & shell rents are assumed shares of the fitted rent. */
  const FX_REF = 54.58;
  const GRADES = {
    A: { en: 'Grade A business park', ar: 'بيزنس بارك Grade A', usdYr: 348.0 },
    B: { en: 'Grade B building', ar: 'مبنى Grade B', usdYr: 283.5 }
  };
  Object.values(GRADES).forEach(g => { g.full = Math.round(g.usdYr * FX_REF / 12 / 10) * 10; });
  const FIN_SHARE  = { full: 1, semi: 0.70, core: 0.50 };    // rent of a unit as is, vs fitted
  const FIN_COST   = { full: 0, semi: 12000, core: 25000 };  // EGP per m² to reach "fitted"
  const FIN_MONTHS = { full: 0, semi: 3, core: 5 };          // months of works after delivery
  const LEASE_UP   = { full: 6, semi: 8, core: 9 };          // months to find a tenant
  const YIELD_CHECK = 0.12;                                   // gross yields above this are flagged
  const CASH_DISC_MAX = 0.30;                                 // cap on the estimated cash discount
  /* pg is added to the base price-growth input; delay pushes delivery (and rent) back. */
  const SCN = {
    low:  { pg: -6, rf: 0.90, dep: +4, delay: 12 },
    base: { pg:  0, rf: 1.00, dep:  0, delay: 0 },
    high: { pg: +8, rf: 1.10, dep: -3, delay: 0 }
  };
  /* Bank certificates used as the safe alternative (NBE, 23 Oct 2026).
     nbe5: 14.25% paid monthly, reinvested -> effective yearly rate.
     nbe3: declining 22% / 17.5% / 13%, then rolls into the 5-year certificate. */
  const NBE5_EFF = Math.pow(1 + 0.1425 / 12, 12) - 1;
  function benchPath(A, H) {
    const yrs = 31, out = [];
    let mode = A.bench || 'auto';
    if (mode === 'auto') mode = H <= 3 ? 'nbe3' : 'nbe5';
    for (let y = 1; y <= yrs; y++) {
      if (mode === 'nbe3') out.push(y === 1 ? 0.22 : y === 2 ? 0.175 : y === 3 ? 0.13 : NBE5_EFF);
      else if (mode === 'nbe5') out.push(NBE5_EFF);
      else out.push((A.bank || 0) / 100);               // 'cbe' or 'custom' use the editable rate
    }
    return { mode, rates: out };
  }
  function benchMonthly(path) {
    return m => Math.pow(1 + path.rates[Math.min(path.rates.length, Math.max(1, Math.ceil(m / 12))) - 1], 1 / 12) - 1;
  }
  function benchAnnualised(path, H) {
    let g = 1; for (let y = 0; y < H; y++) g *= 1 + path.rates[y];
    return Math.pow(g, 1 / H) - 1;
  }
  function benchGrowth(path, years) {
    const v = [1]; let g = 1;
    for (let y = 0; y < years; y++) { g *= 1 + path.rates[y]; v.push(g); }
    return v;
  }

  /* ---------- helpers ---------- */
  function bisect(f, lo, hi) {
    let flo = f(lo);
    if (!isFinite(flo) || flo * f(hi) > 0) return NaN;
    for (let i = 0; i < 120; i++) {
      const m = (lo + hi) / 2, fm = f(m);
      if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; }
    }
    return (lo + hi) / 2;
  }
  function npvConst(cf, rm) { let s = 0, df = 1; for (let i = 0; i < cf.length; i++) { s += cf[i] / df; df *= 1 + rm; } return s; }
  function npvPath(cf, rmAt) { let s = 0, df = 1; for (let i = 0; i < cf.length; i++) { s += cf[i] / df; df *= 1 + rmAt(i + 1); } return s; }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---------- validation ---------- */
  const LIMITS = {
    price: [100000, 2e9], area: [10, 100000], down: [0, 100], years: [0, 15], disc: [0, 50],
    dp2: [0, 60], delpay: [0, 60], maint: [0, 20], cash: [0, 2e9], rent: [0, 20000]
  };
  function validate(u) {
    const errs = {};
    for (const k of Object.keys(LIMITS)) {
      const v = u[k], [lo, hi] = LIMITS[k];
      if ((k === 'cash' || k === 'rent') && (!v || v === 0)) continue;
      if (v === '' || v === null || !isFinite(v) || v < lo || v > hi) errs[k] = [lo, hi];
    }
    if (!errs.down && !errs.dp2 && !errs.delpay && (u.down + u.dp2 + u.delpay) > 100) errs.down = 'sum';
    if (!errs.cash && u.cash > 0 && !errs.price && u.cash > u.price * (1 - (u.disc || 0) / 100) * 1.0001) errs.cash = 'gt';
    return errs;
  }

  /* ---------- payment plan ---------- */
  function buildPlan(u) {
    const net = u.price * (1 - u.disc / 100), plan = [];
    const dp = net * u.down / 100; if (dp > 0.5) plan.push({ m: 0, k: 'dp', amt: dp });
    const dp2 = net * u.dp2 / 100; if (dp2 > 0.5) plan.push({ m: Math.max(1, u.dp2m), k: 'dp2', amt: dp2 });
    const del = net * u.delpay / 100; if (del > 0.5) plan.push({ m: u.delm, k: 'del', amt: del });
    const rem = net - dp - dp2 - del;
    const isCash = u.down >= 100 || u.years <= 0;
    const n = isCash ? 0 : Math.round(u.years * u.freq), step = 12 / u.freq;
    let inst = 0;
    if (rem > 0.5) {
      if (n > 0) { inst = rem / n; for (let k = 1; k <= n; k++) plan.push({ m: Math.round(k * step), k: 'inst', i: k, amt: inst }); }
      else plan.push({ m: 0, k: 'bal', amt: rem });
    }
    const maintAmt = net * u.maint / 100, maintM = Math.max(0, u.delm - u.maintb);
    if (maintAmt > 0.5) plan.push({ m: maintM, k: 'maint', amt: maintAmt });
    plan.sort((x, y) => x.m - y.m || (x.k === 'maint') - (y.k === 'maint'));
    const lastPay = plan.filter(p => p.k !== 'maint').reduce((a, p) => Math.max(a, p.m), 0);
    return { net, plan, dp, inst, n, isCash: plan.filter(p => p.k !== 'maint').every(p => p.m === 0), maintAmt, maintM, lastPay };
  }

  /* ---------- main ---------- */
  function compute(u, A, opts) {
    const H = opts.H, sc = SCN[opts.scn || 'base'], pg = opts.pg ?? ((A.pg ?? 14) + sc.pg) / 100;
    const MAXM = 12 * 30, HM = 12 * H;
    const P = buildPlan(u);
    const path = benchPath(A, H), rmAt = benchMonthly(path);

    // cash value today: entered, or the plan's present value at the certificate rate
    const pvPlan = P.plan.filter(p => p.k !== 'maint').reduce((s, p) => {
      let df = 1; for (let i = 1; i <= p.m; i++) df *= 1 + rmAt(i); return s + p.amt / df;
    }, 0);
    const cashEstimated = !(u.cash > 0) && !P.isCash;
    const cashCapped = cashEstimated && pvPlan < P.net * (1 - CASH_DISC_MAX);
    const cashValue = u.cash > 0 ? u.cash : (P.isCash ? P.net : Math.max(pvPlan, P.net * (1 - CASH_DISC_MAX)));
    const effDisc = P.net ? 1 - pvPlan / P.net : 0;
    const delivery = u.delm + (sc.delay || 0);              // cautious scenario: delivery slips

    // resale value: developer buyers start below their purchase price on the resale market
    const resaleDisc = u.source === 'resale' ? 0 : (A.resaleDisc || 0) / 100;
    const value = m => cashValue * (1 - resaleDisc) * Math.pow(1 + pg, m / 12);

    // finishing and rent
    const doFinish = u.finish !== 'full' && u.afterDel !== 'asis';
    const rentFinish = doFinish ? 'full' : u.finish;
    const finCost = doFinish ? (u.fin ?? FIN_COST[u.finish]) * u.area : 0;
    const leaseM = u.lease ?? (LEASE_UP[rentFinish] + (doFinish ? FIN_MONTHS[u.finish] : 0));
    const z = ZONES.find(x => x.id === u.zone) || ZONES[0];
    const grade = GRADES[u.grade] || GRADES.B;
    const rentQuoted = u.rent > 0;
    const rentM2 = rentQuoted ? u.rent * sc.rf : grade.full * FIN_SHARE[rentFinish] * sc.rf * (1 - (A.negot || 0) / 100);
    const opex = A.vac / 100 + A.svc / 100 + (A.tax ? 0.10 * (1 - 0.32) : 0);
    const rentStart = delivery + leaseM;

    const out = new Float64Array(MAXM + 1), rentN = new Float64Array(MAXM + 1), planPay = new Float64Array(MAXM + 1);
    P.plan.forEach(p => { if (p.m <= MAXM) { out[p.m] += p.amt; if (p.k === 'inst' || p.k === 'dp2' || p.k === 'del') planPay[p.m] += p.amt; } });
    if (finCost > 0 && delivery <= MAXM) out[delivery] += finCost;
    const grossAt = m => u.area * rentM2 * Math.pow(1 + A.rentG / 100, Math.floor((m - rentStart - 1) / 12));
    for (let m = rentStart + 1; m <= MAXM; m++) rentN[m] = grossAt(m) * (1 - opex);
    if (rentStart + 1 <= MAXM) out[rentStart + 1] += grossAt(rentStart + 1);       // leasing commission: one month
    const cf = new Float64Array(MAXM + 1), cum = new Float64Array(MAXM + 1);
    for (let m = 0; m <= MAXM; m++) { cf[m] = rentN[m] - out[m]; cum[m] = (m ? cum[m - 1] : 0) + cf[m]; }

    // a buyer who takes over the plan values the remaining installments at today's money (certificate rate)
    const unpaidAfter = m => P.plan.reduce((s, p) => {
      if (p.k === 'maint' || p.m <= m) return s;
      let df = 1; for (let i = m + 1; i <= p.m; i++) df *= 1 + rmAt(i);
      return s + p.amt / df;
    }, 0);
    const unpaidNominal = m => P.plan.reduce((s, p) => s + (p.k !== 'maint' && p.m > m ? p.amt : 0), 0);
    const feeAt = m => (A.saleFee + (A.dispTax ? 2.5 : 0) + ((m < delivery || m < P.lastPay) ? (A.transfer || 0) : 0)) / 100;
    const saleNet = m => value(m) * (1 - feeAt(m)) - unpaidAfter(m);
    const sellM = Math.max(0, Math.round(A.sellM || 0));

    // holding-period cash flows (sale closes at the end of the holding period)
    const cfH = Array.from(cf.slice(0, HM + 1)); cfH[HM] += saleNet(HM);
    const irrM = bisect(r => npvConst(cfH, r), -0.2, 0.2);
    const irr = isFinite(irrM) ? Math.pow(1 + irrM, 12) - 1 : NaN;
    const npv = npvPath(cfH, rmAt);
    let outH = 0, rentH = 0; for (let m = 0; m <= HM; m++) { outH += out[m]; rentH += rentN[m]; }
    const profit = cfH.reduce((s, x) => s + x, 0);
    const roi = outH ? profit / outH : NaN;
    const multiple = outH ? (rentH + saleNet(HM)) / outH : NaN;

    const g1 = u.area * rentM2 * 12, noi1 = g1 * (1 - opex);
    const allIn = cashValue + P.maintAmt + finCost;
    let paybackM = -1, saleBeM = -1;
    for (let m = 1; m <= MAXM; m++) {
      if (paybackM < 0 && cum[m] >= 0) paybackM = m;
      if (saleBeM < 0 && m >= sellM && cum[m] + saleNet(m) >= 0) saleBeM = m;
      if (paybackM >= 0 && saleBeM >= 0) break;
    }

    // yearly table
    const lastPlan = P.plan.length ? Math.max(...P.plan.map(p => p.m)) : 0;
    const Y = Math.min(15, Math.max(H, Math.ceil(lastPlan / 12), Math.ceil((rentStart + 1) / 12) + 1));
    const years = []; let coverY = -1;
    for (let y = 1; y <= Y; y++) {
      const m0 = y === 1 ? 0 : 12 * (y - 1) + 1, m1 = 12 * y;
      let paid = 0, rent = 0, ins = 0;
      for (let m = m0; m <= m1; m++) { paid += out[m]; rent += rentN[m]; ins += planPay[m]; }
      const cov = ins > 0 ? rent / ins : NaN;
      if (coverY < 0 && ins > 0 && rent >= ins) coverY = y;
      years.push({ y, paid, rent, netY: rent - paid, cum: cum[m1], val: value(m1), pos: cum[m1] + saleNet(m1), ins, cov });
    }

    // growth needed to match the certificate over H
    const beGrowth = bisect(g => {
      const c = Array.from(cf.slice(0, HM + 1));
      c[HM] += cashValue * (1 - resaleDisc) * Math.pow(1 + g, H) * (1 - feeAt(HM)) - unpaidAfter(HM);
      return npvPath(c, rmAt);
    }, -0.6, 1.5);

    // growth of 1M on a cash basis (for the alternatives chart)
    const line = [];
    for (let t = 0; t <= H; t++) {
      let cr = 0; for (let m = 1; m <= 12 * t; m++) cr += rentN[m];
      line.push(1e6 * (value(12 * t) + cr) / (allIn || 1));
    }

    const inf = A.inf / 100, dep = (A.dep + sc.dep) / 100;
    const real = (1 + irr) / (1 + inf) - 1;
    const benchAnn = benchAnnualised(path, H), benchReal = (1 + benchAnn) / (1 + inf) - 1;

    // score out of 100: return vs certificate 50, rent level 20, delivery 15, developer 15
    const sRet = clamp(25 + (real - benchReal) * 250, 0, 50);
    const sRent = clamp(20 * rentM2 / (grade.full * sc.rf), 0, 20);
    const sDel = delivery <= 0 ? 15 : delivery <= 12 ? 10 : delivery <= 24 ? 6 : 3;
    const sDev = { big: 15, mid: 9, new: 4 }[u.dev] ?? 8;
    let score = Math.round(sRet + sRent + sDel + sDev);
    if (!(npv >= 0)) score = Math.min(score, 49);

    let totalPlan = 0; P.plan.forEach(p => totalPlan += p.amt);
    const grossOnCash = g1 / cashValue, yieldWarn = grossOnCash > YIELD_CHECK;
    const beats = isFinite(real) && real >= benchReal;
    return {
      ...P, cashValue, cashEstimated, pvPlan, effDisc, resaleDisc, finCost, doFinish, rentFinish, leaseM, rentStart, rentM2,
      rentMonth: g1 / 12, g1, noi1, gross: g1 / P.net, netY: noi1 / allIn, cap: noi1 / value(0), grm: P.net / g1,
      saleH: value(HM), saleNetH: saleNet(HM), roi, multiple, irr, real, usd: (1 + irr) / (1 + dep) - 1, dep, npv,
      paybackM, saleBeM, coverY, lastPlan, beGrowth, years, cum, saleNet, feeAt, value, line, score, ppm: P.net / u.area,
      outH, totalPlan, allIn, bench: path, benchAnn, benchReal, sellM, opex, zone: z, grade, rentQuoted, cashCapped,
      delivery, delay: sc.delay || 0, pg, grossOnCash, yieldWarn, beats, unpaidNominal
    };
  }

  const api = { ZONES, GRADES, FIN_SHARE, FX_REF, YIELD_CHECK, CASH_DISC_MAX, FIN_COST, FIN_MONTHS, LEASE_UP, SCN, NBE5_EFF, benchPath, benchAnnualised, benchGrowth, validate, buildPlan, compute, bisect };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AQM = api;
})(typeof window !== 'undefined' ? window : globalThis);
