/* AqarMath UI. Depends on engine.js (window.AQM). */
(function () {
'use strict';
const E = window.AQM;

/* ================= content ================= */
const PHONE = '201145721501', PHONE_TXT = '011 45 72 1501';
const DESTS = [{id:'nc',en:'Fifth Settlement, New Cairo',ar:'التجمع الخامس',live:true},{id:'cap',en:'New Capital',ar:'العاصمة الإدارية'},{id:'zayed',en:'Sheikh Zayed',ar:'الشيخ زايد'},{id:'nco',en:'North Coast',ar:'الساحل الشمالي'}];
const TYPES = [{id:'office',en:'Office',ar:'مكتب إداري',live:true},{id:'apt',en:'Apartment',ar:'شقة سكنية'},{id:'svc',en:'Serviced apartment',ar:'شقة فندقية'},{id:'villa',en:'Villa / townhouse',ar:'فيلا / تاون هاوس'},{id:'retail',en:'Retail shop',ar:'محل تجاري'},{id:'clinic',en:'Clinic',ar:'عيادة'}];
const FIN = {full:{en:'Fitted',ar:'كامل التشطيب'}, semi:{en:'Semi-finished',ar:'نص تشطيب'}, core:{en:'Core & shell',ar:'Core & Shell'}};
/* Public rental listings for offices in New Cairo, read by hand and checked 30 Oct 2026. Asking rents. */
const EVID = [
  ['Property Finder','https://www.propertyfinder.eg/en/plp/commercial-rent/office-space-for-rent-cairo-new-cairo-city-the-5th-settlement-south-teseen-st-bank-center-street-8378168.html',{en:'South 90th, Bank Center St',ar:'التسعين الجنوبي، شارع البنوك'},350,472500,'full'],
  ['Aqarmap','https://aqarmap.com.eg/en/listing/6665385-for-rent-cairo-new-cairo-90th-street-south-teseen-st/',{en:'South 90th St',ar:'التسعين الجنوبي'},750,1312500,'full'],
  ['Aqarmap','https://aqarmap.com.eg/en/listing/6707600-for-rent/',{en:'El Choueifat St',ar:'شارع الشويفات'},148,264328,'full'],
  ['Aqarmap','https://aqarmap.com.eg/ar/listing/7109166-for-rent/',{en:'The Plateau, District 5',ar:'ذا بلاتوه، الحي الخامس'},136,159000,'full'],
  ['Aqarmap','https://aqarmap.com.eg/ar/listing/6969604-for-rent-cairo-new-cairo-compounds-district-5-the-plateau-district-5/',{en:'The Plateau, District 5',ar:'ذا بلاتوه، الحي الخامس'},74,88000,'full'],
  ['Aqarmap','https://aqarmap.com.eg/ar/listing/7105373-for-rent/',{en:'The Plateau, District 5',ar:'ذا بلاتوه، الحي الخامس'},59,65000,'full'],
  ['Aqarmap','https://aqarmap.com.eg/ar/listing/6956621-for-rent/',{en:'Eastwalk, Gamal Abdel Nasser Axis',ar:'إيست ووك، محور جمال عبد الناصر'},165,120000,'full'],
  ['Property Finder','https://www.propertyfinder.eg/en/plp/commercial-rent/office-space-for-rent-cairo-new-cairo-city-the-5th-settlement-5th-settlement-compounds-cairo-business-park-2Ptce1F0hdI.html',{en:'Cairo Business Park',ar:'كايرو بيزنس بارك'},345,258750,'semi']
];
const DEVS = [['Talaat Moustafa Group','مجموعة طلعت مصطفى',219],['Palm Hills Developments','بالم هيلز',94],['Mountain View','ماونتن فيو',63.7],['Emaar Misr','إعمار مصر',60.9],['Hyde Park Developments','هايد بارك',52.9],['Tatweer Misr','تطوير مصر',50.5],['Madaar Ras El Hekma','مدار رأس الحكمة',44],['G Developments','جي ديفلوبمنتس',30],['Madinet Masr','مدينة مصر',28.4],['La Vista Developments','لافيستا',26.5]];
const NEWS = [
  {d:'2026-10-23',c:'policy',src:'Banker',url:'https://banker.news/157318',
   en:['National Bank of Egypt certificates: 14.25% for five years, or 22% falling to 13% over three','The five-year certificate pays 14.25% monthly; the three-year Platinum pays 22%, then 17.5%, then 13%.','These are the certificates AqarMath now compares every unit against, matched to your holding period.'],
   ar:['شهادات البنك الأهلي: 14.25% لخمس سنين، أو 22% بتنزل لـ13% على تلات سنين','الشهادة الخمسية بعائد 14.25% بيتصرف شهري، والبلاتينية التلاتية 22% ثم 17.5% ثم 13%.','دي الشهادات اللي AqarMath بيقارن بيها كل وحدة دلوقتي، حسب مدة احتفاظك.']},
  {d:'2026-10-13',c:'economy',src:'Zawya',url:'https://www.zawya.com/en/economy/imf-lifts-egypts-growth-outlook-for-fy202627-to-4.7-1610116',
   en:['IMF raises Egypt growth forecast for FY2026/27 to 4.7%','The October World Economic Outlook lifts the forecast from 4.4% in July and sees inflation averaging 14.8% by June 2027.','Faster growth supports office demand, but inflation stays high, so judge returns after inflation.'],
   ar:['صندوق النقد يرفع توقع نمو مصر لعام 2026/27 إلى 4.7%','تقرير أكتوبر رفع التوقع من 4.4% في يوليو، ويتوقع تضخم حوالي 14.8% بحلول يونيو 2027.','نمو أعلى بيدعم الطلب على المكاتب، لكن التضخم لسه عالي، فاحكم على العائد بعد التضخم.']},
  {d:'2026-10-10',c:'economy',src:'Daily News Egypt',url:'https://www.dailynewsegypt.com/2026/10/10/egypts-annual-urban-inflation-eases-to-13-9-in-september/',
   en:['Urban inflation eases to 13.9% in September','Annual urban headline inflation fell from 14.5% in August, a seven-month low.','A five-year certificate now earns about 1% a year after inflation.'],
   ar:['التضخم في الحضر يتراجع لـ13.9% في سبتمبر','التضخم السنوي نزل من 14.5% في أغسطس، وده أقل مستوى في 7 شهور.','الشهادة الخمسية بقت بتكسب حوالي 1% في السنة بعد التضخم.']},
  {d:'2026-09-24',c:'policy',src:'Egypt Today',url:'https://www.egypttoday.com/Article/3/149692/CBE-holds-interest-rates-steady-keeps-deposit-rate-at-19',
   en:['Central Bank holds the deposit rate at 19%','The overnight deposit rate stays at 19% and the lending rate at 20%, a sixth hold in a row.','Policy rates set where certificate and loan rates go next.'],
   ar:['البنك المركزي يثبّت فايدة الإيداع عند 19%','عائد الإيداع لليلة واحدة فضل 19% والإقراض 20%، للمرة السادسة على التوالي.','سعر المركزي هو اللي بيحدد اتجاه عوائد الشهادات والقروض الجاية.']},
  {d:'2026-09-19',c:'realestate',src:'Masrawy',url:'https://www.masrawy.com/news/realestate-news/details/2026/9/19/3050259',
   en:['Developer transfer fees on resale range from 1% to 5%','A legal review of developer contracts found resale (assignment) fees between 1% and 5% of the unit value, sometimes labelled admin costs.','AqarMath now deducts a 3% transfer fee when you sell before delivery or before the last installment.'],
   ar:['رسوم التنازل عند إعادة البيع من 1% لـ5%','مراجعة قانونية لعقود المطورين لقت رسوم التنازل بين 1% و5% من قيمة الوحدة، وساعات بتتسمى مصاريف إدارية.','AqarMath بيخصم دلوقتي 3% رسوم تنازل لو بعت قبل الاستلام أو قبل آخر قسط.']},
  {d:'2026-08-19',c:'companies',src:'Zawya',url:'https://www.zawya.com/en/business/construction/top-10-egyptian-developers-sales-rise-to-13.26bln-in-h1-2026-460280',
   en:['Top 10 developers sell about EGP 670bn in H1 2026','The Board Consulting ranking puts combined sales at about $13.26bn. Talaat Moustafa leads with about EGP 219bn, then Palm Hills at EGP 94bn.','Sales are concentrating in large developers, which matters for delivery risk.'],
   ar:['أكبر 10 مطورين باعوا بحوالي 670 مليار جنيه في النص الأول 2026','ترتيب The Board Consulting بيقدّر المبيعات بحوالي 13.26 مليار دولار. طلعت مصطفى الأول بحوالي 219 مليار، وبعدها بالم هيلز بـ94 مليار.','المبيعات بتتركز عند المطورين الكبار، وده مهم لمخاطر التسليم.']},
  {d:'2026-07-08',c:'realestate',src:'EnterpriseAM',url:'https://enterpriseam.com/egypt/2026/07/08/cairo-office-rents-jump-20-as-demand-outpaces-supply-of-grade-a-space/',
   en:['Cairo office rents up 20% a year in EGP terms','Knight Frank\'s Q2 2026 review puts New Cairo Grade A business parks at about $348/m² a year, with mid-market office sale prices of EGP 182–184k/m².','These are the market levels this prototype\'s sample listings are calibrated to.'],
   ar:['إيجارات المكاتب في القاهرة زادت 20% في سنة بالجنيه','تقرير Knight Frank للربع التاني 2026: مكاتب Grade A في بيزنس باركات التجمع حوالي 348 دولار للمتر في السنة، وأسعار بيع المكاتب المتوسطة 182–184 ألف جنيه للمتر.','دي مستويات السوق اللي الإعلانات التجريبية متظبطة عليها.']},
  {d:'2026-06-09',c:'policy',src:'Egypt Telegraph',url:'https://www.egypttelegraph.com/article/251412/ضريبة-2-5-على-بيع-العقارات-من',
   en:['Draft law would tax property sales at 2.5% of the sale value','The proposal amends the income tax law; the seller pays within 30 days. It was still under discussion in parliament.','Not applied by default. Switch it on in the assumptions to see its effect.'],
   ar:['مشروع قانون بضريبة 2.5% على قيمة بيع العقار','المقترح بيعدّل قانون ضريبة الدخل، والبايع يدفع خلال 30 يوم. كان لسه في مناقشة البرلمان.','مش محسوبة افتراضياً. فعّلها من الافتراضات عشان تشوف تأثيرها.']},
  {d:'2026-05-13',c:'realestate',src:'EnterpriseAM',url:'https://enterpriseam.com/egypt/hardhats/cairos-rental-market-running-double-digit-increase-while-sales-stall/',
   en:['New Cairo rents rise 10% while resale prices rise 3.1%','JLL\'s Q1 2026 data shows asking rents growing much faster than secondary-market prices in New Cairo.','Rising rents with flat prices push yields up; this is the basis for the 10% rent-growth default.'],
   ar:['الإيجارات في التجمع تزيد 10% وأسعار إعادة البيع 3.1% بس','بيانات JLL للربع الأول 2026 بتبيّن إن الإيجارات بتزيد أسرع بكتير من أسعار إعادة البيع في التجمع.','إيجار بيزيد مع سعر ثابت يعني عائد أعلى، ودي أساس افتراض زيادة الإيجار 10%.']}
];
const CATS = {all:{en:'All',ar:'الكل'}, economy:{en:'Economy',ar:'اقتصاد'}, policy:{en:'Rates, tax & policy',ar:'فايدة وضرائب وسياسات'}, realestate:{en:'Real estate',ar:'عقارات'}, companies:{en:'Companies',ar:'شركات'}};
const GL = {
  irr:{en:['IRR (internal rate of return)','The single yearly return that accounts for when every payment goes out and every rent comes in. The fairest way to compare a cash unit with an installment unit.','the rate where the NPV of all cash flows = 0'],ar:['IRR (معدل العائد الداخلي)','نسبة العائد السنوي الواحدة اللي بتاخد في حسابها ميعاد كل قسط بتدفعه وكل إيجار بيدخلك. أعدل طريقة تقارن بيها وحدة كاش بوحدة تقسيط.','النسبة اللي تخلي صافي القيمة الحالية لكل التدفقات = صفر']},
  roi:{en:['ROI (return on investment)','Total profit over the whole holding period, as a share of everything you paid. It ignores how long it took.','(rent + net sale − money paid) ÷ money paid'],ar:['ROI (العائد على الاستثمار)','إجمالي الربح على مدة الاحتفاظ كلها كنسبة من كل اللي دفعته، من غير ما يفرق معاه المدة.','(الإيجار + صافي البيع − المدفوع) ÷ المدفوع']},
  npv:{en:['NPV (net present value)','All future money in and out, valued in today\'s money at the bank-certificate rate. Above zero means the unit beats a certificate.','Σ cash flow ÷ (1 + certificate rate)^time'],ar:['NPV (صافي القيمة الحالية)','كل الفلوس اللي هتدخل وتطلع محسوبة بقيمتها النهارده بعائد الشهادة. فوق الصفر معناه إن الوحدة أحسن من الشهادة.','مجموع (التدفق ÷ (1 + عائد الشهادة)^الزمن)']},
  cap:{en:['Cap rate','Net yearly rent divided by what the unit would sell for on the market today.','NOI ÷ market value'],ar:['Cap Rate (معدل الرسملة)','صافي الإيجار السنوي مقسوم على قيمة الوحدة في سوق إعادة البيع النهارده.','صافي الدخل ÷ القيمة السوقية']},
  grm:{en:['Rent multiple (GRM)','How many years of gross rent equal the price. Lower is cheaper relative to its rent.','price ÷ yearly rent'],ar:['مضاعف الإيجار (GRM)','كام سنة إيجار إجمالي تساوي سعر الوحدة. الأقل معناه إن الوحدة أرخص بالنسبة لإيجارها.','السعر ÷ الإيجار السنوي']},
  gross:{en:['Gross yield','Yearly rent before any cost, as a share of the price.','yearly rent ÷ price'],ar:['العائد الإجمالي','الإيجار السنوي قبل أي مصاريف كنسبة من السعر.','الإيجار السنوي ÷ السعر']},
  nety:{en:['Net yield','Yearly rent after vacancy, owner costs and property tax, as a share of the all-in cash cost (cash value + maintenance + finishing).','NOI ÷ all-in cash cost'],ar:['العائد الصافي','الإيجار السنوي بعد الشغور ومصاريف المالك والضريبة العقارية، كنسبة من التكلفة الكاملة (قيمة الكاش + الصيانة + التشطيب).','صافي الدخل ÷ التكلفة الكاملة']},
  noi:{en:['NOI (net operating income)','Rent minus vacancy, owner service costs and property tax. What actually reaches you each year.','rent − vacancy − costs − tax'],ar:['صافي دخل التشغيل','الإيجار ناقص الشغور ومصاريف المالك والضريبة العقارية. ده اللي بيوصلك فعلاً كل سنة.','الإيجار − الشغور − المصاريف − الضريبة']},
  multiple:{en:['Equity multiple','How many pounds come back for every pound you put in, counting rent and the sale.','(rent + net sale) ÷ money paid'],ar:['مضاعف رأس المال','كل جنيه دفعته رجعلك كام جنيه، بالإيجار والبيع.','(الإيجار + صافي البيع) ÷ المدفوع']},
  payback:{en:['Cash payback','When the rent you have collected equals everything you paid, without selling.','first month where Σ net rent ≥ Σ payments'],ar:['استرداد الكاش','إمتى الإيجار اللي جمعته يساوي كل اللي دفعته، من غير ما تبيع.','أول شهر مجموع الإيجار الصافي فيه ≥ مجموع المدفوع']},
  salebe:{en:['Break-even if sold','The first month a sale would return everything you paid: at resale-market value, after commission, transfer fee and the remaining installments, and no sooner than the usual time it takes to sell.','Σ rent + resale value × (1 − fees) − remaining installments ≥ Σ paid'],ar:['التعادل لو بعت','أول شهر البيع فيه يرجّعلك كل اللي دفعته: بسعر سوق إعادة البيع، بعد العمولة ورسوم التنازل والأقساط الباقية، ومش قبل المدة المعتادة للبيع.','الإيجار المتجمع + قيمة إعادة البيع × (1 − الرسوم) − الأقساط الباقية ≥ المدفوع']},
  coverage:{en:['Installment coverage','Net rent in a year divided by the installments due that year. At 100% or more, the unit pays its own installments.','net rent ÷ installments that year'],ar:['تغطية القسط','الإيجار الصافي في السنة مقسوم على أقساط نفس السنة. من 100% وطالع، الوحدة بتدفع أقساطها بنفسها.','الإيجار الصافي ÷ أقساط السنة']},
  real:{en:['Real return','Your yearly return after removing inflation. It shows whether your purchasing power actually grew.','(1 + IRR) ÷ (1 + inflation) − 1'],ar:['العائد الحقيقي','عائدك السنوي بعد خصم التضخم. بيوضح هل قدرتك الشرائية زادت فعلاً.','(1 + IRR) ÷ (1 + التضخم) − 1']},
  usd:{en:['Return in USD','Your return measured in dollars, after the expected decline of the pound in this scenario.','(1 + IRR) ÷ (1 + EGP decline) − 1'],ar:['العائد بالدولار','عائدك محسوب بالدولار، بعد التراجع المتوقع للجنيه في السيناريو ده.','(1 + IRR) ÷ (1 + تراجع الجنيه) − 1']},
  pv:{en:['Plan value today','What the installment plan is worth in today\'s money at the certificate rate. The gap to the price is the hidden discount of paying later.','down payment + Σ installment ÷ (1 + certificate rate)^time'],ar:['قيمة الخطة النهارده','خطة التقسيط تسوى كام بفلوس النهارده بعائد الشهادة. الفرق بينها وبين السعر هو الخصم المخفي إنك تدفع متأخر.','المقدم + مجموع (القسط ÷ (1 + عائد الشهادة)^الزمن)']},
  cash:{en:['Cash value','What the unit would cost if paid in full today. Growth and resale are measured from this, not from the installment price, so long plans do not look better just because the price is higher. If you leave it blank we estimate it as the plan\'s value today.','entered cash price, or plan value today'],ar:['قيمة الكاش','الوحدة كانت هتتكلف كام لو اتدفعت كاش النهارده. الزيادة وإعادة البيع بتتحسب من الرقم ده مش من سعر التقسيط، عشان الخطط الطويلة متبانش أحسن لمجرد إن سعرها أعلى. لو سبتها فاضية بنقدّرها بقيمة الخطة النهارده.','سعر الكاش اللي دخلته، أو قيمة الخطة النهارده']},
  bench:{en:['Bank certificate benchmark','The safe alternative we compare against: the National Bank of Egypt certificate that matches your holding period. 3 years: 22%, 17.5%, 13%. Otherwise the 5-year certificate at 14.25% paid monthly and reinvested (15.2% a year).',''],ar:['الشهادة اللي بنقارن بيها','البديل الآمن: شهادة البنك الأهلي المناسبة لمدة احتفاظك. 3 سنين: 22% ثم 17.5% ثم 13%. غير كده الشهادة الخمسية 14.25% بتتصرف شهري ويُعاد استثمارها (15.2% في السنة).','']},
  beats:{en:['Beats the certificate?','Yes when your yearly return after inflation is at least what the matching National Bank of Egypt certificate earns after inflation over the same holding period.','IRR after inflation ≥ certificate after inflation'],ar:['أحسن من الشهادة؟','أيوه لو عائدك السنوي بعد التضخم ≥ عائد شهادة البنك الأهلي المناسبة بعد التضخم على نفس المدة.','IRR بعد التضخم ≥ الشهادة بعد التضخم']},
  income:{en:['Rent beats certificate interest','The first year your net rent is more than the 5-year certificate (14.25% a year) would pay on all the money you have put in so far. After that the unit is the better income, and rent keeps growing while certificate interest stays flat.','net rent in the year ≥ money paid so far × 14.25%'],ar:['الإيجار أعلى من فايدة الشهادة','أول سنة الإيجار الصافي فيها أكتر من اللي الشهادة الخمسية (14.25% في السنة) كانت هتديهولك على كل الفلوس اللي دفعتها لحد دلوقتي. بعدها الوحدة دخلها أحسن، والإيجار بيزيد كل سنة والفايدة ثابتة.','الإيجار الصافي في السنة ≥ المدفوع لحد دلوقتي × 14.25%']},
  yoc:{en:['Yield on what you paid','Net rent in a year divided by all the money you have paid so far, including maintenance and finishing.','net rent ÷ money paid so far'],ar:['العائد على اللي دفعته','الإيجار الصافي في السنة مقسوم على كل الفلوس اللي دفعتها لحد دلوقتي، شامل الصيانة والتشطيب.','الإيجار الصافي ÷ المدفوع لحد دلوقتي']},
  rent:{en:['Market rent','Rent per m² per month from Knight Frank\'s Cairo office review (Q2 2026): Grade A business parks about $348/m²/year, Grade B about $283.5, converted at 54.58 EGP. Semi-finished units are assumed to rent at 70% of fitted, core & shell at 50%. We take 5% off for negotiation. If you have a real quote, enter it under More details.','fitted rent × finishing share × (1 − negotiation)'],ar:['الإيجار السوقي','الإيجار للمتر في الشهر من تقرير Knight Frank لمكاتب القاهرة (الربع التاني 2026): بيزنس بارك Grade A حوالي 348 دولار للمتر في السنة، وGrade B حوالي 283.5، بسعر 54.58 جنيه. النص تشطيب بنفترض إيجاره 70% من الكامل، والـCore 50%. بنخصم 5% للتفاوض. لو عندك عرض إيجار حقيقي دخّله في التفاصيل.','الإيجار كامل التشطيب × نسبة التشطيب × (1 − التفاوض)']},
  grow:{en:['Break-even price growth','The yearly growth in resale value the unit needs to match the certificate over your holding period.','growth where NPV at the certificate rate = 0'],ar:['نمو السعر اللازم','نسبة الزيادة السنوية في سعر إعادة البيع اللي الوحدة محتاجاها عشان تكسب زي الشهادة على مدة الاحتفاظ.','النمو اللي يخلي NPV بعائد الشهادة = صفر']}
};
const ICONS = {
  method:'<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h12M8 7h6M8 11h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  analyze:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  compare:'<path d="M8 3v18M16 3v18M3 8h5M16 16h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  market:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  news:'<path d="M4 5h13v14H6a2 2 0 0 1-2-2V5Zm13 4h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
};
const TABS = [['analyze','Analyze a unit','حلّل وحدة','Analyze','حلّل'],['compare','Compare','قارن','Compare','قارن'],['market','Market','السوق','Market','السوق'],['news','News','الأخبار','News','الأخبار'],['method','How we calculate','إزاي بنحسب','How','إزاي']];

/* ================= state ================= */
const today = new Date();
const BASE = {name:'',type:'office',dest:'nc',zone:'s90',grade:'B',finish:'full',area:100,price:18000000,disc:0,down:100,dp2:0,dp2m:3,years:0,freq:4,delm:0,delpay:0,maint:0,maintb:6,fin:null,lease:null,cash:0,rent:0,dev:'big',source:'resale',afterDel:'finish'};
const DEF_A = {bench:'auto',bank:19,inf:13.9,fx:54.58,dep:8,gold:15,egx:18,pg:14,rentG:10,vac:15,svc:5,tax:true,saleFee:2.5,resaleDisc:10,transfer:3,dispTax:false,sellM:3,negot:5};
const S = {
  lang:'en', cur:'EGP', scn:'base', exit:'sell', schedAll:false, hold:5, tab:'analyze', news:'all', moreK:false, moreS:false, broker:'', consent:false,
  contract: today.toISOString().slice(0,10),
  A:{...DEF_A},
  U:{ a:{...BASE, zone:'d5', finish:'semi', area:100, price:20000000, down:15, years:5, delm:12, maint:8, dev:'mid', source:'developer'},
      b:{...BASE} }
};
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};
function b64e(o){ return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function b64d(s){ s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4) s+='='; return JSON.parse(decodeURIComponent(escape(atob(s)))); }
function loadState(){
  const l = store.get('lang'); if (l==='ar'||l==='en') S.lang = l;
  let saved = null;
  try { const q = new URLSearchParams(location.search).get('u'); if (q) { saved = b64d(q); saved._fromLink = true; } } catch(e){}
  if (!saved) { try { saved = JSON.parse(store.get('aqm:v3') || 'null'); } catch(e){} }
  if (saved && typeof saved === 'object') {
    if (saved.a) S.U.a = {...BASE, ...saved.a};
    if (saved.b) S.U.b = {...BASE, ...saved.b};
    if (saved.A) S.A = {...DEF_A, ...saved.A};
    ['hold','scn','cur','broker','contract','exit'].forEach(k => { if (saved[k] !== undefined) S[k] = saved[k]; });
    if (saved.l === 'ar' || saved.l === 'en') S.lang = saved.l;
    S._fromLink = !!saved._fromLink;
  }
}
let saveT; function saveState(){ clearTimeout(saveT); saveT = setTimeout(() => store.set('aqm:v3', JSON.stringify({a:S.U.a,b:S.U.b,A:S.A,hold:S.hold,scn:S.scn,exit:S.exit,cur:S.cur,broker:S.broker,contract:S.contract})), 250); }

/* ================= helpers ================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const ar = () => S.lang === 'ar', tx = (e,a) => ar() ? a : e;
const zoneOf = id => E.ZONES.find(z => z.id === id) || E.ZONES[0];
const gradeName = g => { const x = E.GRADES[g] || E.GRADES.B; return ar() ? x.ar : x.en; };
const zoneName = id => { const z = zoneOf(id); return ar() ? z.ar : z.en; };
const unitName = k => S.U[k].name || tx(k==='a'?'Unit A':'Unit B', k==='a'?'الوحدة أ':'الوحدة ب');
const fmt = (n,d=0) => Number(n).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const pct = (n,d=1) => isFinite(n) ? fmt(n*100,d)+'%' : '—';
function compact(n){ const a=Math.abs(n); if(a>=1e9) return fmt(n/1e9,2)+tx('B',' مليار'); if(a>=1e6) return fmt(n/1e6,2)+tx('M',' مليون'); if(a>=1e4) return fmt(n/1e3,0)+tx('K',' ألف'); return fmt(n,0); }
const words = n => { const a=Math.abs(n); if(a>=1e9) return fmt(n/1e9,2)+tx(' billion EGP',' مليار جنيه'); if(a>=1e6) return fmt(n/1e6,2)+tx(' million EGP',' مليون جنيه'); if(a>=1e3) return fmt(n/1e3,0)+tx(' thousand EGP',' ألف جنيه'); return fmt(n,0)+tx(' EGP',' جنيه'); };
let R = {};
const fxAt = m => S.A.fx * Math.pow(1 + (R.a ? R.a.dep : S.A.dep/100), m/12);
const money = (egp,m=0) => S.cur==='USD' ? '$'+compact(egp/fxAt(m)) : (ar() ? compact(egp)+' ج' : 'EGP '+compact(egp));
const egp = v => ar() ? compact(v)+' ج' : 'EGP '+compact(v);
const full = v => ar() ? fmt(v)+' ج' : 'EGP '+fmt(v);
function addMonths(iso,m){ const d=new Date(iso+'T00:00:00'), day=d.getDate(); d.setMonth(d.getMonth()+m); if(d.getDate()!==day) d.setDate(0); return d; }
const dstr = d => `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
const dateAt = m => dstr(addMonths(S.contract, m));
const monthY = m => addMonths(S.contract, m).toLocaleDateString(ar()?'ar-EG-u-nu-latn':'en-GB',{month:'short',year:'numeric'});
const yrs = m => fmt(m/12,1)+tx(' years',' سنة');
const T = (key,label) => `<button type="button" class="term" data-term="${key}">${label ?? GL[key][S.lang][0]}</button>`;
const digits = s => String(s).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d.]/g,'');
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'),2200); }

/* ================= line chart ================= */
const NS='http://www.w3.org/2000/svg';
function niceTicks(min,max,n=4){ if(min===max){min-=1;max+=1;} const s0=(max-min)/n, mag=Math.pow(10,Math.floor(Math.log10(s0))), step=[1,2,2.5,5,10].map(x=>x*mag).find(x=>x>=s0); const o=[]; for(let v=Math.floor(min/step)*step; v<=Math.ceil(max/step)*step+step/2; v+=step) o.push(+v.toFixed(10)); return o; }
function lineChart(box,{labels,series,zero}){
  const W=box.clientWidth||600, H=box.clientHeight||300, rtl=ar(), padT=10, padB=28, pa=58, po=24, padR=rtl?pa:po, padL=rtl?po:pa;
  const pw=W-padR-padL, ph=H-padT-padB, n=labels.length, all=series.flatMap(s=>s.values).concat(zero?[0]:[]);
  const ticks=niceTicks(Math.min(...all),Math.max(...all)), y0=ticks[0], y1=ticks.at(-1), big=Math.max(Math.abs(y0),Math.abs(y1))>=1e6;
  const div=big?1e6:1e3, tk=v=>fmt(v/div, big&&(y1-y0)/div<5?2:0);
  const X=i=>rtl?W-padR-(n===1?0:i/(n-1)*pw):padL+(n===1?0:i/(n-1)*pw), Y=v=>padT+ph-(v-y0)/(y1-y0)*ph;
  let svg=`<svg xmlns="${NS}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  ticks.forEach(t=>{ svg+=`<line x1="${padL}" x2="${W-padR}" y1="${Y(t)}" y2="${Y(t)}" stroke="var(--grid)"/>`; svg+=rtl?`<text x="${W-padR+8}" y="${Y(t)+4}" text-anchor="start">${tk(t)}</text>`:`<text x="${padL-8}" y="${Y(t)+4}" text-anchor="end">${tk(t)}</text>`; });
  if(zero&&y0<0) svg+=`<line x1="${padL}" x2="${W-padR}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--ink2)" stroke-width="1.25"/>`;
  svg+=`<line x1="${padL}" x2="${W-padR}" y1="${padT+ph}" y2="${padT+ph}" stroke="var(--axis)"/>`;
  const every=Math.ceil(n/(W<420?4:8)); labels.forEach((l,i)=>{ if(i%every===0||i===n-1) svg+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle">${l}</text>`; });
  [...series].sort((a,b)=>(a.bold?1:0)-(b.bold?1:0)).forEach(s=>{ const d=s.values.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(''); svg+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.bold?2.5:2}" stroke-linejoin="round" stroke-linecap="round"/>`; });
  svg+=`<line class="cross" x1="0" x2="0" y1="${padT}" y2="${padT+ph}" stroke="var(--muted)" stroke-dasharray="3 3" opacity="0"/>`;
  series.forEach((s,k)=>svg+=`<circle class="hd" data-k="${k}" r="4.5" fill="${s.color}" stroke="var(--surface)" stroke-width="2" opacity="0"/>`);
  svg+=`<rect x="${padL}" y="${padT}" width="${pw}" height="${ph}" fill="transparent"/></svg><div class="tip"></div>`;
  box.innerHTML=svg;
  const el=box.querySelector('svg'), tip=box.querySelector('.tip'), cross=el.querySelector('.cross');
  const hide=()=>{ tip.style.opacity=0; cross.setAttribute('opacity',0); el.querySelectorAll('.hd').forEach(c=>c.setAttribute('opacity',0)); };
  const show=ev=>{ const r=el.getBoundingClientRect(), px=(ev.clientX-r.left)*(W/r.width); let i=Math.round((rtl?(W-padR-px):(px-padL))/pw*(n-1)); i=Math.max(0,Math.min(n-1,i));
    cross.setAttribute('x1',X(i)); cross.setAttribute('x2',X(i)); cross.setAttribute('opacity',1);
    el.querySelectorAll('.hd').forEach(c=>{ const v=series[+c.dataset.k].values[i]; c.setAttribute('cx',X(i)); c.setAttribute('cy',Y(v)); c.setAttribute('opacity',1); });
    tip.innerHTML=`<b>${labels[i]}</b>`+[...series].sort((a,b)=>b.values[i]-a.values[i]).map(s=>`<div><i style="background:${s.color}"></i>${s.label}: <span class="num">${s.fmt(s.values[i])}</span></div>`).join('');
    tip.style.opacity=1; const left=X(i)/W*r.width, tw=tip.offsetWidth; tip.style.left=Math.max(0,Math.min(r.width-tw,left<r.width/2?left+12:left-tw-12))+'px'; tip.style.top='8px'; };
  el.addEventListener('pointermove',show); el.addEventListener('pointerdown',show); el.addEventListener('pointerleave',hide);
  return big?tx('millions','بالمليون'):tx('thousands','بالألف');
}

/* ================= inputs ================= */
const opt = (v,l,cur,dis) => `<option value="${v}"${String(v)===String(cur)?' selected':''}${dis?' disabled':''}>${l}</option>`;
const sel = (id,opts,val) => `<select id="${id}">${opts.map(o=>opt(o[0],o[1],val,o[2])).join('')}</select>`;
const fld = (id,label,ctrl,hint,wide) => `<div class="f${wide?' wide':''}" id="f-${id}"><label for="${id}">${label}</label>${ctrl}${hint?`<span class="hint">${hint}</span>`:''}<span class="err" id="e-${id}" hidden></span></div>`;
const num = (id,v,step=1,min=0,max='') => `<input type="number" id="${id}" value="${v}" step="${step}" min="${min}" ${max!==''?`max="${max}"`:''} inputmode="decimal">`;
const mon = (id,v,ph) => `<input type="text" class="money" id="${id}" value="${v?fmt(v):''}" inputmode="numeric" autocomplete="off" ${ph?`placeholder="${ph}"`:''}><span class="money-read" id="w-${id}">${v?words(v):''}</span>`;
const ZO=()=>E.ZONES.map(z=>[z.id,ar()?z.ar:z.en]), FO=()=>Object.keys(FIN).map(k=>[k,FIN[k][S.lang]]);
const DO=()=>[[0,tx('Ready now','فوري')],[12,tx('In 1 year','بعد سنة')],[24,tx('In 2 years','بعد سنتين')],[36,tx('In 3 years','بعد 3 سنين')],[48,tx('In 4 years','بعد 4 سنين')]];
const VO=()=>[['big',tx('Major developer','مطوّر كبير')],['mid',tx('Mid-size','متوسط')],['new',tx('New / unknown','جديد / غير معروف')]];
const QO=()=>[[12,tx('Monthly','شهري')],[4,tx('Quarterly','ربع سنوي')],[2,tx('Semi-annual','نص سنوي')],[1,tx('Annual','سنوي')]];
const GO=()=>Object.keys(E.GRADES).map(g=>[g,gradeName(g)]);
const TO=()=>TYPES.map(t=>[t.id,(ar()?t.ar:t.en)+(t.live?'':tx(' (soon)',' (قريباً)')),!t.live]);
const DSO=()=>DESTS.map(d=>[d.id,(ar()?d.ar:d.en)+(d.live?'':tx(' (soon)',' (قريباً)')),!d.live]);
const SO=()=>[['developer',tx('From the developer','من المطوّر')],['resale',tx('Resale market','سوق إعادة البيع')]];
const AO=()=>[['finish',tx('Finish it, then rent as fitted','أشطبها وأأجرها كاملة التشطيب')],['asis',tx('Rent it as it is','أأجرها زي ما هي')]];
let moreOpen = false;
function buildInputs(){
  const u=S.U.a, p=id=>`u-a-${id}`, cashPlan = u.down>=100;
  $('#inputs').innerHTML = `
  <div class="group"><h3>${tx('The unit and the plan','الوحدة وخطة السداد')}</h3><div class="fg">
    ${fld(p('zone'),tx('Zone','المنطقة'),sel(p('zone'),ZO(),u.zone))}
    ${fld(p('grade'),tx('Building','المبنى'),sel(p('grade'),GO(),u.grade))}
    ${fld(p('finish'),tx('Finishing','التشطيب'),sel(p('finish'),FO(),u.finish))}
    ${fld(p('area'),tx('Area (m²)','المساحة (م²)'),num(p('area'),u.area,1,10))}
    ${fld(p('delm'),tx('Delivery','الاستلام'),sel(p('delm'),DO(),u.delm),'',true)}
    ${fld(p('price'),tx('Unit price (EGP)','سعر الوحدة (جنيه)'),mon(p('price'),u.price),'',true)}
    ${fld(p('down'),tx('Down payment %','المقدم %'),num(p('down'),u.down,1,0,100))}
    ${fld(p('years'),tx('Installment years','سنين التقسيط'),num(p('years'),cashPlan?0:u.years,1,0,15).replace('<input','<input'+(cashPlan?' disabled':'')),cashPlan?tx('Cash: no installments','كاش: مفيش أقساط'):'')}
  </div></div>
  <details class="group" id="moreGroup"${moreOpen?' open':''}><summary>${tx('More details','تفاصيل أكتر')}</summary><div class="fg" style="margin-top:10px">
    <div class="sublabel">${tx('Price','السعر')}</div>
    ${fld(p('cash'),tx('Cash price (if paid in full today)','سعر الكاش (لو اتدفعت كلها النهارده)'),mon(p('cash'),u.cash,tx('Leave blank to estimate','سيبها فاضية ونقدّرها')),tx('Ask the developer: it makes the result accurate','اسأل المطوّر: ده بيخلي النتيجة دقيقة'),true)}
    ${fld(p('source'),tx('Buying from','الشرا من'),sel(p('source'),SO(),u.source))}
    ${fld(p('disc'),tx('Discount %','الخصم %'),num(p('disc'),u.disc,0.25,0,50))}
    <div class="sublabel">${tx('Payment plan','خطة السداد')}</div>
    ${fld(p('freq'),tx('Paid','طريقة الدفع'),sel(p('freq'),QO(),u.freq).replace('<select','<select'+(cashPlan?' disabled':'')))}
    ${fld(p('delpay'),tx('Payment at delivery %','دفعة الاستلام %'),num(p('delpay'),u.delpay,1,0,60))}
    ${fld(p('dp2'),tx('2nd down payment %','مقدم تاني %'),num(p('dp2'),u.dp2,1,0,60))}
    ${fld(p('dp2m'),tx('…after (months)','…بعد (شهور)'),num(p('dp2m'),u.dp2m,1,1,24))}
    ${fld(p('maint'),tx('Maintenance deposit %','وديعة الصيانة %'),num(p('maint'),u.maint,0.5,0,20),tx('From the contract','من العقد'))}
    ${fld(p('maintb'),tx('Due before delivery (months)','قبل الاستلام بـ (شهور)'),num(p('maintb'),u.maintb,1,0,24))}
    ${fld('contract',tx('Contract date','تاريخ التعاقد'),`<input type="date" id="contract" value="${S.contract}">`,'',true)}
    <div class="sublabel">${tx('Rent','الإيجار')}</div>
    ${fld(p('rent'),tx('Rent quote (EGP/m²/month)','عرض إيجار (ج/م²/شهر)'),num(p('rent'),u.rent||'',10,0,20000),tx('From a broker or a similar listing; replaces the market rent','من بروكر أو إعلان مشابه؛ بيحل محل الإيجار السوقي'),true)}
    <div class="sublabel">${tx('After delivery','بعد الاستلام')}</div>
    ${u.finish!=='full' ? fld(p('afterDel'),tx('Plan for the unit','هتعمل إيه في الوحدة'),sel(p('afterDel'),AO(),u.afterDel),'',true) : ''}
    ${u.finish!=='full' && u.afterDel!=='asis' ? fld(p('fin'),tx('Finishing cost (EGP/m²)','تكلفة التشطيب (ج/م²)'),num(p('fin'),u.fin??E.FIN_COST[u.finish],500),tx('Assumption','افتراض')) : ''}
    ${fld(p('lease'),tx('Months to first rent','شهور لحد أول إيجار'),num(p('lease'),u.lease??'',1,0,24).replace('value=""',`placeholder="${E.LEASE_UP[u.finish]+(u.finish!=='full'&&u.afterDel!=='asis'?E.FIN_MONTHS[u.finish]:0)}"`),tx('After delivery; finishing and marketing at the same time','بعد الاستلام؛ التشطيب والتسويق في نفس الوقت'))}
    <div class="sublabel">${tx('About the unit','عن الوحدة')}</div>
    ${fld(p('name'),tx('Name (optional)','الاسم (اختياري)'),`<input id="${p('name')}" value="${(u.name||'').replace(/"/g,'&quot;')}" placeholder="${unitName('a')}">`,'',true)}
    ${fld(p('dest'),tx('Destination','الوجهة'),sel(p('dest'),DSO(),u.dest))}
    ${fld(p('type'),tx('Type','النوع'),sel(p('type'),TO(),u.type))}
    ${fld(p('dev'),tx('Developer','المطوّر'),sel(p('dev'),VO(),u.dev),'',true)}
  </div></details>`;
}
function buildAssume(){
  const A=S.A, f=(id,lab,v,step,h)=>fld('a-'+id,lab,num('a-'+id,v,step,-50),h);
  const BO=[['auto',tx('Match my holding period','حسب مدة الاحتفاظ')],['nbe5',tx('NBE 5-year · 14.25% monthly','الأهلي خمسية · 14.25% شهري')],['nbe3',tx('NBE 3-year · 22% → 13%','الأهلي تلاتية · 22% ← 13%')],['custom',tx('Custom rate','نسبة أدخلها')]];
  $('#assumeGrid').innerHTML=[
    fld('a-bench',T('bench',tx('Compare against','نقارن بـ')),sel('a-bench',BO,A.bench)),
    f('bank',tx('Custom certificate rate %','نسبة الشهادة المخصصة %'),A.bank,0.25,tx('Used only with “Custom rate”','بتستخدم مع “نسبة أدخلها” بس')),
    f('inf',tx('Inflation %','التضخم %'),A.inf,0.1,tx('Urban, Sep 2026','الحضر، سبتمبر 2026')),
    f('fx',tx('USD rate','سعر الدولار'),A.fx,0.01,tx('CBE, 21 Oct 2026','المركزي، 21 أكتوبر 2026')),
    f('dep',tx('EGP decline / yr % (base)','تراجع الجنيه سنوياً % (واقعي)'),A.dep,0.5,tx('Cautious +4, strong −3','المتشائم +4، المتفائل −3')),
    f('pg',tx('Resale price growth / yr % (base)','نمو سعر إعادة البيع سنوياً % (واقعي)'),A.pg,0.5,tx('About inflation; cautious −6 and a 12-month delivery delay, strong +8','قريب من التضخم؛ المتشائم −6 وتأخير استلام سنة، المتفائل +8')),
    f('rentG',tx('Rent growth / yr %','زيادة الإيجار سنوياً %'),A.rentG,0.5,tx('JLL: New Cairo +10% y/y','JLL: التجمع +10% سنوياً')),
    f('negot',tx('Rent below asking %','الإيجار أقل من المطلوب %'),A.negot,1,tx('Deals close below listings','الصفقات بتقفل أقل من الإعلان')),
    f('vac',tx('Vacancy %','الشغور %'),A.vac,1,tx('Strata offices 15–20%','المكاتب المفرّقة 15–20%')),
    f('svc',tx('Owner costs %','مصاريف المالك %'),A.svc,1,tx('Assumption','افتراض')),
    f('resaleDisc',tx('Resale below developer price %','إعادة البيع أقل من سعر المطوّر %'),A.resaleDisc,1,tx('Applies to developer purchases','للشرا من المطوّر')),
    f('transfer',tx('Developer transfer fee %','رسوم التنازل للمطوّر %'),A.transfer,0.5,tx('1–5% in contracts; before delivery or last installment','1–5% في العقود؛ قبل الاستلام أو آخر قسط')),
    f('saleFee',tx('Sale commission %','عمولة البيع %'),A.saleFee,0.25,tx('Market 1.5–2.5%','السوق 1.5–2.5%')),
    f('sellM',tx('Months to sell','شهور لحد ما تبيع'),A.sellM,1,tx('Earliest break-even','أقل مدة للتعادل')),
    f('gold',tx('Gold growth / yr %','نمو الدهب سنوياً %'),A.gold,0.5,tx('Assumption','افتراض')),
    f('egx',tx('EGX30 growth / yr %','نمو EGX30 سنوياً %'),A.egx,0.5,tx('Assumption','افتراض')),
    fld('a-tax',tx('Property tax','الضريبة العقارية'),sel('a-tax',[[1,tx('Included','محسوبة')],[0,tx('Excluded','مش محسوبة')]],A.tax?1:0),tx('10% after 32% deduction','10% بعد خصم 32%')),
    fld('a-dispTax',tx('2.5% sale tax (draft law)','ضريبة بيع 2.5% (مشروع قانون)'),sel('a-dispTax',[[0,tx('Not applied','مش محسوبة')],[1,tx('Apply','احسبها')]],A.dispTax?1:0),tx('Proposed June 2026, not yet in force','مقترحة يونيو 2026، لسه مش مطبقة'))
  ].join('');
}

/* ================= validation ================= */
const ERRTXT = (k,e) => e==='sum' ? tx('Down payments add up to more than 100%','المقدمات مجموعها أكتر من 100%')
  : e==='gt' ? tx('Cash price should be at or below the unit price','سعر الكاش لازم يكون أقل من أو يساوي سعر الوحدة')
  : tx(`Enter a value between ${compact(e[0])} and ${compact(e[1])}`,`دخّل رقم بين ${compact(e[0])} و${compact(e[1])}`);
function showErrors(k, errs){
  ['price','area','down','years','disc','dp2','delpay','maint','cash','rent'].forEach(f => {
    const box = $(`#f-u-${k}-${f}`), msg = $(`#e-u-${k}-${f}`); if (!box || !msg) return;
    const e = errs[f]; box.classList.toggle('bad', !!e); msg.hidden = !e; msg.textContent = e ? ERRTXT(f,e) : '';
  });
  const keys = Object.keys(errs);
  if (k==='a' && keys.some(f => !['price','area','down','years'].includes(f))) { const d=$('#moreGroup'); if (d && !d.open){ d.open = true; moreOpen = true; } }
}

/* ================= analyze ================= */
function setBar(html){ document.body.classList.toggle('has-bar', S.tab==='analyze' && !!html); $('#mbar').innerHTML = html || ''; }
function renderAnalyze(){
  const u=S.U.a, A=S.A, H=S.hold;
  const errs = E.validate(u); showErrors('a', errs);
  if (Object.keys(errs).length){
    $('#storyBadge').className='badge err'; $('#storyBadge').textContent=tx('Check the highlighted fields','راجع الخانات المعلّمة');
    $('#storyTitle').textContent=tx('Some numbers look off, so we paused the calculation.','فيه أرقام شكلها مش مظبوط، فوقفنا الحسبة لحد ما تتظبط.');
    $('#storyList').innerHTML=''; $('#cashNote').innerHTML=''; $('#storyBars').innerHTML=''; $('#storyWarn').innerHTML=''; $('#storyMore').hidden=true; $('#vchip').innerHTML=tx('Check the highlighted fields','راجع الخانات المعلّمة'); $('#vchip').className='vchip no-print err';
    setBar(`<span><span class="ml">${tx('Result','النتيجة')}</span><span class="mv">${tx('Check inputs','راجع الأرقام')}</span></span>`);
    return;
  }
  const r=R.a;
  const okI = isFinite(r.real), beats = okI && r.beats, gap = (r.real - r.benchReal)*100;
  $('#storyBadge').className = 'badge ' + (beats ? 'good' : 'warn');
  $('#storyBadge').innerHTML = beats ? `✓ ${tx('Beats the bank certificate','أحسن من الشهادة البنكية')}` : `! ${tx('Below the bank certificate','أقل من الشهادة البنكية')}`;
  const keep=S.exit==='keep';
  $('#storyTitle').innerHTML = keep && okI ? tx(
    `Kept for ${H} years, this unit earns <b>${pct(r.real)}</b> a year after inflation, counting rent and what the unit is worth (not sold). A ${T('bench','bank certificate')} earns <b>${pct(r.benchReal)}</b>.`,
    `لو احتفظت بيها ${H} سنة، الوحدة بتكسّبك <b>${pct(r.real)}</b> في السنة بعد التضخم، بحساب الإيجار وقيمة الوحدة (من غير بيع). ${T('bench','الشهادة البنكية')} بتكسب <b>${pct(r.benchReal)}</b>.`) : !okI ? tx(
    `If you sell after ${H} years, this unit does not get your money back in this scenario. A ${T('bench','bank certificate')} earns <b>${pct(r.benchReal)}</b> a year after inflation.`,
    `لو بعت بعد ${H} سنين، الوحدة دي مش بترجّع فلوسك في السيناريو ده. ${T('bench','الشهادة البنكية')} بتكسب <b>${pct(r.benchReal)}</b> في السنة بعد التضخم.`) : tx(
    `After inflation, this unit earns <b>${pct(r.real)}</b> a year over ${H} years. A ${T('bench','bank certificate')} earns <b>${pct(r.benchReal)}</b> — ${beats?`<b>${fmt(gap,1)} points less</b>`:`<b>${fmt(-gap,1)} points more</b>`}.`,
    `بعد التضخم، الوحدة دي بتكسّبك <b>${pct(r.real)}</b> في السنة على ${H} سنين. ${T('bench','الشهادة البنكية')} بتكسب <b>${pct(r.benchReal)}</b> — ${beats?`<b>أقل بـ${fmt(gap,1)} نقطة</b>`:`<b>أعلى بـ${fmt(-gap,1)} نقطة</b>`}.`);
  // paired bars: real vs real
  const bv=[[tx('This unit','الوحدة'),okI?r.real:NaN,'u'],[tx('Certificate','الشهادة'),r.benchReal,'c']], bm=Math.max(0.02,...bv.map(b=>isFinite(b[1])?Math.abs(b[1]):0));
  $('#storyBars').innerHTML=bv.map(([l,v,c])=>`<div class="sb ${c}"><span class="l">${l}</span><span class="track"><i class="${v<0?'neg':''}" style="width:${isFinite(v)?Math.max(2,Math.abs(v)/bm*100):0}%"></i></span><b class="num">${isFinite(v)?pct(v):'—'}</b></div>`).join('')+`<small>${tx('Yearly return after inflation · nominal IRR in the details','العائد السنوي بعد التضخم · الـIRR الاسمي في التفاصيل')}</small>`;
  // warnings
  const warns=[];
  if (r.yieldWarn) warns.push(tx(`The rent is ${pct(r.grossOnCash,0)} of the cash value a year. Office rents in New Cairo rarely pass 12%, so check the price or the rent.`,`الإيجار ${pct(r.grossOnCash,0)} من قيمة الكاش في السنة. إيجارات المكاتب في التجمع نادراً ما تعدّي 12%، فراجع السعر أو الإيجار.`));
  if (r.cashCapped) warns.push(tx(`This plan implies a cash discount above 30%. We capped it at 30%; ask the developer for the real cash price.`,`الخطة دي معناها خصم كاش أكتر من 30%. وقفناه عند 30%؛ اسأل المطوّر على سعر الكاش الحقيقي.`));
  if (r.delay) warns.push(tx(`Cautious scenario: delivery is ${r.delay} months late, so rent starts later.`,`السيناريو المتشائم: الاستلام متأخر ${r.delay} شهر، فالإيجار بيبدأ متأخر.`));
  $('#storyWarn').innerHTML=warns.map(w=>`<p>! ${w}</p>`).join('');
  $('#vchip').className='vchip no-print '+(beats?'good':'warn');
  $('#vchip').innerHTML=`<span>${beats?'✓ '+tx('Beats the certificate','أحسن من الشهادة'):'! '+tx('Below the certificate','أقل من الشهادة')}</span><b class="num">${okI?pct(r.real):'—'} <small>${tx('vs','قصاد')} ${pct(r.benchReal)}</small></b><span class="go">${tx('See why ↓','شوف ليه ↓')}</span>`;
  const items=[];
  items.push(r.n ? tx(`You pay ${egp(r.dp)} now, then ${r.n} installments of ${egp(r.inst)} until ${monthY(r.lastPay)}. Total plan: ${egp(r.totalPlan)}.`,`هتدفع ${egp(r.dp)} دلوقتي، وبعدها ${r.n} قسط كل واحد ${egp(r.inst)} لحد ${monthY(r.lastPay)}. إجمالي الخطة: ${egp(r.totalPlan)}.`)
                 : tx(`You pay ${egp(r.totalPlan)} in cash${r.maintAmt?', maintenance included':''}.`,`هتدفع ${egp(r.totalPlan)} كاش${r.maintAmt?'، شامل الصيانة':''}.`));
  items.push(tx(`First rent around ${monthY(r.rentStart+1)}: about ${egp(r.rentMonth)} a month (${fmt(r.rentM2)} EGP/m², ${T('rent',r.rentQuoted?'your quote':'market rent')}). ${T('noi','Net to you')}: ${egp(r.noi1/12)} a month.`,`أول إيجار حوالي ${monthY(r.rentStart+1)}: تقريباً ${egp(r.rentMonth)} في الشهر (${fmt(r.rentM2)} ج/م²، ${T('rent',r.rentQuoted?'عرضك':'الإيجار السوقي')}). ${T('noi','الصافي ليك')}: ${egp(r.noi1/12)} في الشهر.`));
  const yrH=r.inc[H-1];
  if (keep) items.push(r.incomeY>0 ? tx(`From year ${r.incomeY} your net rent is more than a certificate would pay on the same money (${T('income','rent beats certificate interest')}). By year ${yrH.y} it is about ${egp(yrH.rent/12)} a month, ${pct(yrH.yoc)} on what you paid.`,`من السنة ${r.incomeY} الإيجار الصافي بيبقى أكتر من فايدة الشهادة على نفس الفلوس (${T('income','الإيجار أعلى من فايدة الشهادة')}). في السنة ${yrH.y} بيبقى حوالي ${egp(yrH.rent/12)} في الشهر، يعني ${pct(yrH.yoc)} على اللي دفعته.`)
                         : tx(`Within 30 years the net rent stays below what a certificate would pay on the same money; by year ${yrH.y} it is about ${egp(yrH.rent/12)} a month (${pct(yrH.yoc)} on what you paid).`,`خلال 30 سنة الإيجار الصافي فاضل أقل من فايدة الشهادة على نفس الفلوس؛ في السنة ${yrH.y} بيبقى حوالي ${egp(yrH.rent/12)} في الشهر (${pct(yrH.yoc)} على اللي دفعته).`));
  if (!keep) items.push(r.saleBeM>0 ? tx(`If you sell, you get all your money back from ${monthY(r.saleBeM)} (${yrs(r.saleBeM)}), after resale discount and fees — the ${T('salebe','break-even if sold')}.`,`لو بعت، هترجع كل فلوسك من ${monthY(r.saleBeM)} (${yrs(r.saleBeM)})، بعد فرق إعادة البيع والرسوم — ده ${T('salebe','التعادل لو بعت')}.`)
                         : tx('Selling does not return your money within 30 years in this scenario.','البيع مش بيرجّع فلوسك خلال 30 سنة في السيناريو ده.'));
  if (r.doFinish) items.push(tx(`After delivery you finish it for about ${egp(r.finCost)} and rent it as fitted.`,`بعد الاستلام هتشطبها بحوالي ${egp(r.finCost)} وتأجرها كاملة التشطيب.`));
  if (r.n) items.push(r.coverY>0 ? tx(`From year ${r.coverY}, the rent ${T('coverage','covers the installments')}: the unit starts paying for itself.`,`من السنة ${r.coverY} الإيجار ${T('coverage','بيغطي الأقساط')}: الوحدة بتبدأ تصرف على نفسها.`)
                                : tx(`The rent does not ${T('coverage','cover the installments')} during the plan; you fund them yourself.`,`الإيجار مش ${T('coverage','بيغطي الأقساط')} خلال الخطة، فهتدفعها من جيبك.`));
  items.push(r.paybackM>0 ? tx(`Without selling, rent alone returns all your money by ${monthY(r.paybackM)} (${yrs(r.paybackM)}) — the ${T('payback','cash payback')}.`,`من غير بيع، الإيجار لوحده يرجّعلك كل فلوسك في ${monthY(r.paybackM)} (${yrs(r.paybackM)}) — ده ${T('payback','استرداد الكاش')}.`)
                          : tx('Rent alone does not return your money within 30 years.','الإيجار لوحده مش بيرجّع فلوسك خلال 30 سنة.'));
  items.push(isFinite(r.irr) ? tx(`Before inflation that is ${pct(r.irr)} a year (${T('irr','IRR')}), counting the date of every payment.`,`قبل التضخم ده ${pct(r.irr)} في السنة (${T('irr','IRR')})، بحساب ميعاد كل دفعة.`) : tx(`There is no positive yearly return (${T('irr','IRR')}) for a sale after ${H} years.`,`مفيش عائد سنوي موجب (${T('irr','IRR')}) لو بعت بعد ${H} سنين.`));
  if (!keep) items.push(tx(`Sell after ${H} years and every pound you paid comes back as ${fmt(r.multiple,2)} (${T('multiple','equity multiple')}).`,`لو بعت بعد ${H} سنين، كل جنيه دفعته بيرجعلك ${fmt(r.multiple,2)} (${T('multiple','مضاعف رأس المال')}).`));
  $('#storyList').innerHTML = items.map((t,i)=>`<li${i>=3&&!S.moreS?' hidden':''}><span class="n">${i+1}</span><span>${t}</span></li>`).join('');
  $('#storyMore').hidden = items.length<=3;
  $('#storyMore').textContent = S.moreS ? tx('Show less','اعرض أقل') : tx(`Read the full story (${items.length} points)`,`اقرا القصة كاملة (${items.length} نقط)`);
  $('#cashNote').innerHTML = r.cashEstimated
    ? tx(`We estimated the ${T('cash','cash value')} at ${egp(r.cashValue)} (${pct(r.effDisc,0)} below the price). <button class="linkbtn" type="button" data-focus="u-a-cash">Enter the developer's real cash price</button> for a more accurate result.`,
         `قدّرنا ${T('cash','قيمة الكاش')} بـ${egp(r.cashValue)} (أقل من السعر بـ${pct(r.effDisc,0)}). <button class="linkbtn" type="button" data-focus="u-a-cash">دخّل سعر الكاش الحقيقي من المطوّر</button> عشان النتيجة تبقى أدق.`) : '';

  setBar(`<span class="mchip ${beats?'good':'warn'}">${beats?'✓':'!'}</span><span class="mv num">${okI?pct(r.real):'—'}</span><span class="ml">${tx('vs certificate','قصاد الشهادة')} ${pct(r.benchReal)}</span><span class="mgo">${tx('Details ↑','التفاصيل ↑')}</span>`);

  // milestones
  const ms=[];
  if (r.rentStart+1<=360) ms.push([r.rentStart+1,tx('First rent','أول إيجار')]);
  if (r.n && r.lastPay>0) ms.push([r.lastPay,tx('Last installment','آخر قسط')]);
  if (r.coverY>0) ms.push([12*(r.coverY-1)+1,tx('Rent covers installments','الإيجار يغطي القسط')]);
  if (r.saleBeM>0) ms.push([r.saleBeM,tx('Break-even if sold','التعادل لو بعت')]);
  if (r.paybackM>0) ms.push([r.paybackM,tx('All cash back from rent','كل الكاش رجع من الإيجار')]);
  ms.sort((a,b)=>a[0]-b[0]);
  const end=Math.max(12*H,...ms.map(m=>m[0]))*1.04, pos=m=>(m/end*100).toFixed(2)+'%';
  const stepY=end/12>12?5:end/12>6?2:1, ticks=[]; for(let y=0;y*12<=end;y+=stepY) ticks.push(y);
  const ml=$('#mline'); ml.style.setProperty('--endside',ar()?'left':'right'); ml.style.setProperty('--be',r.saleBeM>0?pos(r.saleBeM):'100%');
  ml.innerHTML=`<div class="bar"></div>`+ticks.map(y=>`<span class="tick" style="inset-inline-start:${pos(12*y)}">${y===0?tx('Today','النهارده'):tx('Yr ','سنة ')+y}</span>`).join('')+`<span class="now" style="inset-inline-start:0"></span>`+ms.map((m,i)=>`<span class="mk" style="inset-inline-start:${pos(m[0])}" title="${m[1]} · ${monthY(m[0])}">${i+1}</span>`).join('');
  $('#mlist').innerHTML=ms.map((m,i)=>`<li><span class="n">${i+1}</span><span>${m[1]}</span><b class="num">${monthY(m[0])}</b></li>`).join('');
  $('#mlineNote').textContent=tx('Red: still below what you paid if you sold. Green: in profit.','الأحمر: لو بعت لسه تحت اللي دفعته. الأخضر: مكسب.');

  // kpis: 4 primary, the rest behind a toggle
  const k=(key,val,meta,cls='',neg=false)=>`<div class="kpi ${cls}"${cls.includes('extra')&&!S.moreK?' hidden':''}><div class="lab">${T(key)}</div><div class="val num${neg?' neg':''}">${val}</div><div class="meta">${meta||''}</div></div>`;
  $('#kpis').innerHTML=[
    k('real',pct(r.real),tx(`certificate ${pct(r.benchReal)}`,`الشهادة ${pct(r.benchReal)}`),'hi',r.real<0),
    k('beats',beats?tx('Yes','أيوه'):tx('No','لأ'),beats?tx(`by ${fmt(gap,1)} points`,`بفرق ${fmt(gap,1)} نقطة`):isFinite(gap)?tx(`short by ${fmt(-gap,1)} points`,`ناقص ${fmt(-gap,1)} نقطة`):'',beats?'':'',!beats),
    k('irr',pct(r.irr),tx('per year before inflation','سنوياً قبل التضخم'),'extra'),
    k('nety',pct(r.netY),tx(`gross ${pct(r.gross)}`,`الإجمالي ${pct(r.gross)}`)),
    keep ? k('income',r.incomeY>0?tx(`Year ${r.incomeY}`,`السنة ${r.incomeY}`):'—',tx('net rent vs 14.25% on money paid','الإيجار الصافي قصاد 14.25% على المدفوع'))
         : k('salebe',r.saleBeM>0?monthY(r.saleBeM):'—',r.saleBeM>0?yrs(r.saleBeM):''),
    keep ? k('salebe',r.saleBeM>0?monthY(r.saleBeM):'—',r.saleBeM>0?yrs(r.saleBeM):'','extra')
         : k('income',r.incomeY>0?tx(`Year ${r.incomeY}`,`السنة ${r.incomeY}`):'—',tx('net rent vs 14.25% on money paid','الإيجار الصافي قصاد 14.25% على المدفوع'),'extra'),
    k('usd',pct(r.usd),tx('per year in dollars','سنوياً بالدولار'),'extra',r.usd<0),
    k('roi',pct(r.roi,0),tx(`total over ${H} years`,`إجمالي على ${H} سنين`),'extra',r.roi<0),
    k('npv',money(r.npv),r.npv>=0?tx('beats the certificate','أحسن من الشهادة'):tx('below the certificate','أقل من الشهادة'),'extra',r.npv<0),
    k('cash',money(r.cashValue),r.cashEstimated?tx('estimated','تقديري'):tx('entered','مدخل'),'extra'),
    k('pv',money(r.pvPlan),tx(`hidden discount ${pct(r.effDisc)}`,`خصم مخفي ${pct(r.effDisc)}`),'extra'),
    k('cap',pct(r.cap),tx('NOI ÷ resale value','صافي الدخل ÷ قيمة إعادة البيع'),'extra'),
    k('grm',fmt(r.grm,1)+'×',tx('years of rent = price','سنين إيجار = السعر'),'extra'),
    k('multiple',fmt(r.multiple,2)+'×',tx(`if sold after ${H} yrs`,`لو بعت بعد ${H} سنين`),'extra'),
    k('grow',isFinite(r.beGrowth)?pct(r.beGrowth):'—',tx(`scenario assumes ${pct(r.pg,0)}`,`السيناريو ${pct(r.pg,0)}`),'extra'),
    k('payback',r.paybackM>0?yrs(r.paybackM):'—',tx('rent only','من الإيجار بس'),'extra')
  ].join('');
  const nK=$$('#kpis .kpi').length;
  $('#moreKpis').textContent = S.moreK ? tx('Show fewer metrics','اعرض مؤشرات أقل') : tx(`Show all ${nK} metrics`,`اعرض كل الـ${nK} مؤشر`);

  // position chart
  const ys=[0,...r.years.map(y=>y.y)], cumV=ys.map(y=>r.cum[12*y]), posV=ys.map(y=>r.cum[12*y]+r.saleNet(12*y));
  const fm=v=>(v<0?'−':'')+egp(Math.abs(v));
  const ser=[{label:tx('If you sell that year','لو بعت السنة دي'),color:'var(--s1)',bold:true,values:posV,fmt:fm},{label:tx('Rent only, no sale','إيجار بس من غير بيع'),color:'var(--s3)',values:cumV,fmt:fm}];
  const pu=lineChart($('#posChart'),{labels:ys.map(y=>y===0?tx('Today','النهارده'):tx('Yr ','سنة ')+y),series:ser,zero:true});
  $('#posLegend').innerHTML=ser.map(s=>`<span><i style="background:${s.color}"></i>${s.label}</span>`).join('')+`<span style="color:var(--muted)">${tx('EGP','جنيه')} ${pu}</span>`;

  // income if kept
  const iy=r.inc.filter(y=>y.rent>0), pickY=[...new Set([iy[0]&&iy[0].y, iy[1]&&iy[1].y, r.n?Math.ceil(r.lastPay/12)+1:0, 5, 10, 15, 20, r.incomeY>0?r.incomeY:0].filter(y=>y&&y<=20))].sort((a,b)=>a-b);
  const yLast=r.inc[19];
  $('#incSum').innerHTML=[
    [tx('Net rent, first full year','الإيجار الصافي أول سنة كاملة'),iy[1]?egp(iy[1].rent/12)+tx(' / mo',' / شهر'):'—'],
    [T('income'),r.incomeY>0?tx(`Year ${r.incomeY}`,`السنة ${r.incomeY}`):tx('Not within 30 years','مش خلال 30 سنة')],
    [T('payback'),r.paybackM>0?`${monthY(r.paybackM)} · ${yrs(r.paybackM)}`:tx('Not within 30 years','مش خلال 30 سنة')],
    [tx(`Net rent in year ${yLast.y}`,`الإيجار الصافي في السنة ${yLast.y}`),egp(yLast.rent/12)+tx(' / mo',' / شهر')]
  ].map(([l,v])=>`<div><small>${l}</small><b class="num">${v}</b></div>`).join('');
  $('#incTable').innerHTML=`<thead><tr><th>${tx('Year','السنة')}</th><th>${tx('Paid so far','المدفوع لحد دلوقتي')}</th><th>${tx('Net rent / month','الإيجار الصافي / شهر')}</th><th>${T('yoc',tx('On what you paid','على اللي دفعته'))}</th><th>${tx('Certificate / month','الشهادة / شهر')}</th></tr></thead><tbody>${
    pickY.map(y=>{ const d=r.inc[y-1], w=d.rent>=d.certInc; return `<tr><td>${y}</td><td class="v"><span class="num">${compact(d.paidCum)}</span></td><td class="v ${w?'win':''}"><span class="num">${compact(d.rent/12)}</span></td><td class="v">${pct(d.yoc)}</td><td class="v ${w?'':'win'}"><span class="num">${compact(d.certInc/12)}</span></td></tr>`; }).join('')}</tbody>`;
  $('#incNote').textContent=tx(`Certificate interest is 14.25% a year on the same money, paid monthly and fixed; rent grows ${A.rentG}% a year. The certificate gives back the same pounds at the end; the unit is still yours.`,`فايدة الشهادة 14.25% في السنة على نفس الفلوس، بتتصرف شهري وثابتة؛ والإيجار بيزيد ${A.rentG}% كل سنة. الشهادة في الآخر بترجعلك نفس الجنيهات؛ والوحدة بتفضل ملكك.`);

  // schedule
  const lbl=p=>({dp:tx('Down payment','المقدم'),dp2:tx('2nd down payment','مقدم تاني'),del:tx('Delivery payment','دفعة الاستلام'),bal:tx('Balance (cash)','الباقي كاش'),maint:tx('Maintenance deposit','وديعة الصيانة'),inst:tx(`Installment ${p.i}`,`قسط ${p.i}`)})[p.k];
  const rowsP=r.plan.filter(p=>p.k!=='maint'), tot=rowsP.reduce((a,p)=>a+p.amt,0), mp=r.plan.find(p=>p.k==='maint');
  const many=r.plan.length>8, full=S.schedAll||!many;
  let body;
  if (full) body=r.plan.map((p,i)=>`<tr><td class="v">${i+1}</td><td>${lbl(p)}</td><td class="v pc">${pct(p.amt/r.net,2)}</td><td class="v"><span class="num">${fmt(Math.round(p.amt))}</span></td><td class="v">${dateAt(p.m)}</td></tr>`).join('');
  else {
    const g={}; r.plan.forEach(p=>{ const y=Math.floor(p.m/12)+1; (g[y]=g[y]||[]).push(p); });
    const yr=Object.keys(g).map(y=>{ const ps=g[y], ins=ps.filter(p=>p.k==='inst'), oth=ps.filter(p=>p.k!=='inst'), sum=ps.reduce((a,p)=>a+p.amt,0);
      const desc=[...oth.map(lbl), ins.length?tx(`${ins.length} installments × ${compact(ins[0].amt)}`,`${ins.length} أقساط × ${compact(ins[0].amt)}`):''].filter(Boolean).join(' + ');
      return {y:+y,y2:+y,desc,sum,n:1,m0:ps[0].m,m1:ps[ps.length-1].m}; });
    const mg=[]; yr.forEach(x=>{ const l=mg[mg.length-1]; if(l&&l.desc===x.desc&&Math.abs(l.sum-x.sum)<1&&l.y2===x.y-1){ l.y2=x.y; l.n++; l.m1=x.m1; } else mg.push({...x}); });
    body=mg.map(x=>`<tr><td class="v">${tx('Yr ','سنة ')+x.y}${x.y2>x.y?'–'+x.y2:''}</td><td>${x.desc}${x.n>1?tx(' · each year',' · كل سنة'):''}</td><td class="v pc">${pct(x.sum*x.n/r.net,1)}</td><td class="v"><span class="num">${fmt(Math.round(x.sum))}</span>${x.n>1?`<small style="display:block;color:var(--muted)">${tx('per year','في السنة')}</small>`:''}</td><td class="v">${monthY(x.m0)}${x.m1>x.m0?' – '+monthY(x.m1):''}</td></tr>`).join('');
  }
  $('#schedTable').innerHTML=`<thead><tr><th>${full?'#':tx('Year','السنة')}</th><th>${tx('Item','البند')}</th><th class="pc">%</th><th>${tx('Amount','المبلغ')}</th><th>${tx('Due','الاستحقاق')}</th></tr></thead><tbody>${body}<tr class="total"><td></td><td>${tx('Unit price','سعر الوحدة')}</td><td class="v pc">100%</td><td class="v"><span class="num">${fmt(Math.round(tot))}</span></td><td></td></tr></tbody>`;
  $('#schedAll').hidden=!many;
  $('#schedAll').textContent=S.schedAll?tx('Group by year','اجمعها بالسنة'):tx(`Show all ${r.plan.length} payments`,`اعرض كل الـ${r.plan.length} دفعة`);

  // break-even
  const wh=m=>m<0?tx('Not within 30 years','مش خلال 30 سنة'):`${monthY(m)} · ${yrs(m)}`;
  const be=[[T('coverage'),r.n?(r.coverY>0?tx(`Year ${r.coverY}`,`السنة ${r.coverY}`):tx('Not during the plan','مش خلال الخطة')):tx('No installments','مفيش أقساط'),tx('Yearly net rent ≥ installments due that year.','الإيجار الصافي في السنة ≥ أقساط السنة.')],
            [T('payback'),wh(r.paybackM),tx('Total net rent = everything paid, without selling.','مجموع الإيجار الصافي = كل اللي دفعته، من غير بيع.')],
            [T('salebe'),wh(r.saleBeM),tx(`At resale value (${pct(r.resaleDisc,0)} below developer price), after ${A.saleFee}% commission${A.transfer?`, ${A.transfer}% transfer fee before delivery or last installment`:''}${A.dispTax?', 2.5% sale tax':''}; no sooner than ${A.sellM} months.`,`بسعر إعادة البيع (أقل من سعر المطوّر بـ${pct(r.resaleDisc,0)})، بعد عمولة ${A.saleFee}%${A.transfer?`، و${A.transfer}% رسوم تنازل قبل الاستلام أو آخر قسط`:''}${A.dispTax?'، و2.5% ضريبة بيع':''}؛ ومش قبل ${A.sellM} شهور.`)],
            [T('grow'),isFinite(r.beGrowth)?pct(r.beGrowth)+tx(' / yr',' سنوياً'):'—',tx(`Needed to match the certificate over ${H} years.`,`اللازم عشان تكسب زي الشهادة على ${H} سنين.`)]];
  $('#beList').innerHTML=be.map(([t,v,s])=>`<div class="be-row"><b>${t}</b><span class="val">${v}</span><small>${s}</small></div>`).join('');

  // cash flow
  const c=v=>`<td class="v ${v<0?'neg':''}"><span class="num">${(v<0?'−':'')+compact(Math.abs(v))}</span></td>`;
  $('#cfTable').innerHTML=`<thead><tr><th>${tx('Year','السنة')}</th><th>${tx('Paid out','المدفوع')}</th><th>${tx('Net rent','الإيجار الصافي')}</th><th>${tx('Net','صافي السنة')}</th><th>${tx('Cumulative','التراكمي')}</th><th>${T('coverage',tx('Coverage','التغطية'))}</th><th>${tx('Resale value','قيمة إعادة البيع')}</th><th>${keep?tx('What you own','اللي تملكه'):tx('If sold','لو بعت')}</th></tr></thead><tbody>${
    r.years.map(y=>`<tr><td>${y.y}</td>${c(-y.paid)}${c(y.rent)}${c(y.netY)}${c(y.cum)}<td class="v">${isFinite(y.cov)?`<span class="pill ${y.cov>=1?'good':'bad'}">${fmt(y.cov*100,0)}%</span>`:'—'}</td>${c(y.val)}${c(keep?y.own:y.pos)}</tr>`).join('')}</tbody>`;

  // alternatives (cash basis, per 1M)
  const yrsA=[...Array(H+1).keys()], bg=E.benchGrowth(r.bench,H).map(g=>1e6*g), alt=x=>yrsA.map(t=>1e6*Math.pow(1+x/100,t));
  const conv=arr=>S.cur==='USD'?arr.map((v,t)=>v/fxAt(12*t)):arr, mf=v=>(S.cur==='USD'?'$':'')+compact(v)+(S.cur==='USD'?'':tx('',' ج'));
  const aser=[{label:unitName('a'),color:'var(--s1)',bold:true,values:conv(r.line),fmt:mf},{label:tx('Bank certificate','شهادة بنكية'),color:'var(--s3)',values:conv(bg),fmt:mf},{label:tx('Gold','دهب'),color:'var(--s4)',values:conv(alt(A.gold)),fmt:mf},{label:'EGX30',color:'var(--s5)',values:conv(alt(A.egx)),fmt:mf}];
  $('#altLegend').innerHTML=aser.map(s=>`<span><i style="background:${s.color}"></i>${s.label}</span>`).join('');
  const un=lineChart($('#altChart'),{labels:yrsA.map(t=>t===0?tx('Today','النهارده'):tx('Yr ','سنة ')+t),series:aser});
  $('#chartCur').textContent=`${tx('Value in','القيمة')} ${un} ${S.cur==='USD'?tx('USD','دولار'):tx('EGP','جنيه')}`;
  $('#altNote').textContent=tx(`Each line starts with 1M paid in cash. The unit starts below 1M because resale value is ${pct(r.resaleDisc,0)} under the developer price and the cost includes maintenance and finishing; rent counts only after delivery.`,`كل خط بيبدأ بمليون مدفوع كاش. الوحدة بتبدأ أقل من مليون لأن قيمة إعادة البيع أقل من سعر المطوّر بـ${pct(r.resaleDisc,0)}، والتكلفة فيها الصيانة والتشطيب، والإيجار بيتحسب بعد الاستلام بس.`);

  // rent evidence
  const fl=f=>FIN[f][S.lang], gr=r.grade;
  $('#rentHint').textContent = r.rentQuoted ? tx('Using your rent quote','بنستخدم عرض الإيجار بتاعك') : `${gradeName(u.grade)} · ${fl(r.rentFinish)}`;
  const rrow=(l,v,src,cls='')=>`<tr class="${cls}"><td>${l}</td><td class="v"><span class="num">${v}</span></td><td>${src}</td></tr>`;
  const KF=`<a href="https://enterpriseam.com/egypt/2026/07/08/cairo-office-rents-jump-20-as-demand-outpaces-supply-of-grade-a-space/" target="_blank" rel="noopener">Knight Frank Q2 2026</a>`;
  $('#rentTable').innerHTML=`<thead><tr><th>${tx('Step','الخطوة')}</th><th>${tx('EGP/m²/month','ج/م²/شهر')}</th><th>${tx('Source','المصدر')}</th></tr></thead><tbody>${
    r.rentQuoted ? rrow(tx('Your rent quote','عرض الإيجار بتاعك'),fmt(u.rent),tx('Entered by you','إنت دخّلته'))+(S.scn!=='base'?rrow(tx('Scenario adjustment','تعديل السيناريو'),'× '+fmt(E.SCN[S.scn].rf,2),tx('Assumption','افتراض')):'')
    : rrow(tx(`Fitted ${gradeName(u.grade)}`,`${gradeName(u.grade)} كامل التشطيب`),fmt(gr.full),`${KF} · $${gr.usdYr}/m²/${tx('yr','سنة')} × ${E.FX_REF}`)
      + (r.rentFinish!=='full'?rrow(tx(`${fl(r.rentFinish)} share`,`نسبة ${fl(r.rentFinish)}`),'× '+fmt(E.FIN_SHARE[r.rentFinish]*100,0)+'%',tx('Assumption','افتراض')):'')
      + rrow(tx('Negotiation discount','خصم التفاوض'),'− '+fmt(A.negot,0)+'%',tx('Asking vs signed rent','المطلوب قصاد اللي بيتمضي'))
      + (S.scn!=='base'?rrow(tx('Scenario adjustment','تعديل السيناريو'),'× '+fmt(E.SCN[S.scn].rf,2),tx('Assumption','افتراض')):'')
  }${rrow(tx('Rent used','الإيجار المستخدم'),fmt(r.rentM2),tx(`× ${u.area} m² = ${egp(r.rentMonth)} / month`,`× ${u.area} م² = ${egp(r.rentMonth)} في الشهر`),'total')}</tbody>`;
  const ev=EVID.map(e=>({...e, pm:e[4]/e[3]})).sort((a,b)=>a.pm-b.pm), fitted=ev.filter(e=>e[5]==='full').map(e=>e.pm), med=fitted[Math.floor(fitted.length/2)];
  $('#rentTable').innerHTML += `<tbody><tr><td colspan="3" style="padding-top:18px"><b>${tx('Check it yourself: live listings in New Cairo','اتأكد بنفسك: إعلانات حقيقية في التجمع')}</b> · ${tx(`fitted median ${fmt(med)} EGP/m²`,`وسيط الكامل التشطيب ${fmt(med)} ج/م²`)}</td></tr>${
    ev.map(e=>`<tr><td>${e[2][S.lang]} · <span class="num">${e[3]} ${tx('m²','م²')}</span> · ${FIN[e[5]][S.lang]}</td><td class="v"><span class="num">${fmt(e.pm)}</span></td><td><a href="${e[1]}" target="_blank" rel="noopener">${e[0]} ↗</a> <span style="color:var(--muted)">${egp(e[4])}${tx('/mo','/شهر')}</span></td></tr>`).join('')}</tbody>`;
  $('#rentNote').innerHTML = tx(`Listings are asking rents, read by hand on 30 Oct 2026; an ad can be taken down after we check it. `,`الإعلانات دي أسعار مطلوبة، اتقرت يدوي يوم 30 أكتوبر 2026؛ وممكن الإعلان يتشال بعد ما راجعناه. `) + tx(`Knight Frank reports Grade A business parks at about $348/m²/year and Grade B at about $283.5. Single offices in strata buildings often rent below these averages. If a broker or a similar listing gives you a real number, <button class="linkbtn" type="button" data-focus="u-a-rent">enter your rent quote</button>.`,
    `Knight Frank بيقول إن البيزنس بارك Grade A حوالي 348 دولار للمتر في السنة، وGrade B حوالي 283.5. المكاتب المفرّقة في المباني الإدارية غالباً بتتأجر أقل من المتوسطات دي. لو معاك رقم حقيقي من بروكر أو إعلان مشابه، <button class="linkbtn" type="button" data-focus="u-a-rent">دخّل عرض الإيجار</button>.`);
  renderSources();
  updateLinks();
}

/* ================= share, WhatsApp, print ================= */
function shareLink(){ return location.origin + location.pathname + '?u=' + b64e({a:S.U.a,hold:S.hold,scn:S.scn,exit:S.exit,cur:S.cur,l:S.lang,contract:S.contract}); }
function unitLine(u){ return `${zoneName(u.zone)} · ${FIN[u.finish][S.lang]} · ${u.area} ${tx('m²','م²')} · ${full(u.price)} · ${u.down>=100?tx('cash','كاش'):`${u.down}% ${tx('down','مقدم')}, ${u.years} ${tx('years','سنين')}`}`; }
function updateLinks(){
  const r=R.a, u=S.U.a; if(!r) return;
  const msg = tx(
    `Hi Hesham, I analyzed a unit on AqarMath and would like a free consultation.\n• ${unitLine(u)}\n• After inflation ${pct(r.real)} vs certificate ${pct(r.benchReal)}\n${shareLink()}`,
    `أهلاً أستاذ هشام، حلّلت وحدة على AqarMath وعايز استشارة مجانية.\n• ${unitLine(u)}\n• العائد بعد التضخم ${pct(r.real)} قصاد الشهادة ${pct(r.benchReal)}\n${shareLink()}`);
  $('#waBtn').href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  $('#waBtn').setAttribute('aria-disabled', String(!S.consent)); $('#waBtn').classList.toggle('off', !S.consent);
  $('#consent').checked = !!S.consent;
}
function preparePrint(){
  const u=S.U.a;
  $('#printSub').textContent = (S.U.a.name ? S.U.a.name + ' · ' : '') + unitLine(u);
  $('#printDate').textContent = new Date().toLocaleDateString(ar()?'ar-EG-u-nu-latn':'en-GB',{day:'numeric',month:'long',year:'numeric'});
  $('#printFoot').innerHTML = `${S.broker?`<b>${tx('Prepared by','إعداد')} ${S.broker.replace(/</g,'&lt;')}</b> · `:''}${tx('Calculated with AqarMath · aqarmath.vercel.app','محسوب بـ AqarMath · aqarmath.vercel.app')}<br>${tx('Estimates for illustration, not investment advice. Assumptions and sources are on the website.','الأرقام تقديرية للتوضيح وليست نصيحة استثمارية. الافتراضات والمصادر موجودة على الموقع.')}<br>${tx('Free consultation','استشارة مجانية')}: ${tx('Hesham Rodiny','هشام روديني')} · ${PHONE_TXT}`;
}
async function copyShare(){
  const link=shareLink(); $('#shareInput').value=link; $('#shareOut').hidden=false;
  try { await navigator.clipboard.writeText(link); toast(tx('Link copied','اتنسخ اللينك')); }
  catch(e){ $('#shareInput').select(); toast(tx('Select the link and copy it','علّم على اللينك وانسخه')); }
}

/* ================= sources & method ================= */
const SRC=()=>[
  ['off',tx('Bank certificates (benchmark)','شهادات البنك (المقارنة)'),tx('5-yr 14.25% monthly · 3-yr 22/17.5/13%','خمسية 14.25% شهري · تلاتية 22/17.5/13%'),'23/10/2026','Banker','https://banker.news/157318'],
  ['off',tx('CBE overnight deposit rate','فايدة الإيداع للمركزي'),'19%','24/09/2026','Egypt Today','https://www.egypttoday.com/Article/3/149692/CBE-holds-interest-rates-steady-keeps-deposit-rate-at-19'],
  ['off',tx('Urban inflation','التضخم في الحضر'),`${S.A.inf}%`,'10/10/2026','Daily News Egypt','https://www.dailynewsegypt.com/2026/10/10/egypts-annual-urban-inflation-eases-to-13-9-in-september/'],
  ['off',tx('USD exchange rate','سعر الدولار'),`${S.A.fx}`,'21/10/2026','Banker (CBE rate)','https://banker.news/157053'],
  ['off',tx('Property tax','الضريبة العقارية'),tx('10% after 32% deduction','10% بعد خصم 32%'),tx('Law 196/2008','قانون 196/2008'),'Andersen Egypt','https://eg.andersen.com/property-tax/'],
  ['off',tx('Sale tax 2.5% (draft)','ضريبة البيع 2.5% (مشروع)'),S.A.dispTax?tx('applied','محسوبة'):tx('not applied','مش محسوبة'),'09/06/2026','Egypt Telegraph','https://www.egypttelegraph.com/article/251412/ضريبة-2-5-على-بيع-العقارات-من'],
  ['mkt',tx('Developer transfer fees','رسوم التنازل'),`${S.A.transfer}% (${tx('range 1–5%','المدى 1–5%')})`,'19/09/2026','Masrawy','https://www.masrawy.com/news/realestate-news/details/2026/9/19/3050259'],
  ['mkt',tx('Office rent by building grade','إيجار المكاتب حسب نوع المبنى'),tx(`A $348 · B $283.5 /m²/yr → ${fmt(E.GRADES.A.full)} · ${fmt(E.GRADES.B.full)} EGP/m²/mo`,`A ‏348$ · B ‏283.5$ للمتر/سنة → ${fmt(E.GRADES.A.full)} · ${fmt(E.GRADES.B.full)} ج/م²/شهر`),'08/07/2026','Knight Frank via EnterpriseAM','https://enterpriseam.com/egypt/2026/07/08/cairo-office-rents-jump-20-as-demand-outpaces-supply-of-grade-a-space/'],
  ['mkt',tx('Rent growth','زيادة الإيجار'),`${S.A.rentG}% / ${tx('yr','سنة')}`,'13/05/2026','JLL via EnterpriseAM','https://enterpriseam.com/egypt/hardhats/cairos-rental-market-running-double-digit-increase-while-sales-stall/'],
  ['mkt',tx('Sale / leasing commission','عمولة البيع / التأجير'),tx(`${S.A.saleFee}% · 1 month`,`${S.A.saleFee}% · إيجار شهر`),'—','Aqarmap','https://aqarmap.com.eg/ar/advice/?p=25458'],
  ['mkt',tx('Office rental listings, New Cairo','إعلانات إيجار مكاتب، التجمع'),tx('8 listings, hand-checked','8 إعلانات، متراجعة يدوي'),'30/10/2026','Property Finder · Aqarmap','https://aqarmap.com.eg/en/for-rent/office/cairo/new-cairo/'],
  ['asm',tx('Semi-finished / core & shell rent','إيجار النص تشطيب / الـCore'),'70% · 50%','—',tx('Assumption, share of fitted rent','افتراض، نسبة من الإيجار الكامل'),''],
  ['asm',tx('Finishing cost and lease-up','تكلفة التشطيب ومدة التأجير'),tx(`semi ${fmt(E.FIN_COST.semi)} · core ${fmt(E.FIN_COST.core)} EGP/m² · ${tx('first rent','أول إيجار')} ${E.LEASE_UP.full} ${tx('months after delivery','شهور بعد الاستلام')}`,`نص ${fmt(E.FIN_COST.semi)} · Core ${fmt(E.FIN_COST.core)} ج/م² · ${tx('first rent','أول إيجار')} ${E.LEASE_UP.full} ${tx('months after delivery','شهور بعد الاستلام')}`),'—',tx('Assumption','افتراض'),''],
  ['asm',tx('Cash discount cap','حد خصم الكاش'),'30%','—',tx('Assumption, when no cash price is entered','افتراض، لو مفيش سعر كاش'),''],
  ['ctr',tx('Cash price, maintenance and plan terms','سعر الكاش والصيانة وشروط الخطة'),tx('Per unit','حسب الوحدة'),'—',tx('Developer offer / contract','عرض المطوّر / العقد'),''],
  ['asm',tx('Price growth scenarios','سيناريوهات نمو السعر'),`${S.A.pg+E.SCN.low.pg}% · ${S.A.pg}% · ${S.A.pg+E.SCN.high.pg}%`,'—',tx('Assumption: base near inflation; cautious also delays delivery 12 months','افتراض: الواقعي قريب من التضخم؛ المتشائم كمان بيأخر الاستلام سنة'),''],
  ['asm',tx('Resale discount, vacancy, owner costs, rent negotiation','فرق إعادة البيع والشغور والمصاريف والتفاوض'),`${S.A.resaleDisc}% · ${S.A.vac}% · ${S.A.svc}% · ${S.A.negot}%`,'—',tx('Assumption; vacancy for strata offices 15–20%','افتراض؛ الشغور للمكاتب المفرّقة 15–20%'),''],
  ['asm',tx('Gold, EGX30, EGP decline','الدهب وEGX30 وتراجع الجنيه'),`${S.A.gold}% · ${S.A.egx}% · ${S.A.dep}%`,'—',tx('Assumption','افتراض'),'']
];
function renderSources(){
  const typ={off:tx('Official','رسمي'),mkt:tx('Market data','بيانات سوق'),ctr:tx('Contract','عقد'),asm:tx('Assumption','افتراض')};
  $('#srcTable').innerHTML=`<thead><tr><th>${tx('Input','الرقم')}</th><th>${tx('Value','القيمة')}</th><th>${tx('Type','النوع')}</th><th>${tx('Date','التاريخ')}</th><th>${tx('Source','المصدر')}</th></tr></thead><tbody>${
    SRC().map(([t,n,v,d,s,u])=>`<tr><td>${n}</td><td class="v"><span class="num">${v}</span></td><td><span class="pill ${t}">${typ[t]}</span></td><td class="v">${d}</td><td>${u?`<a href="${u}" target="_blank" rel="noopener">${s}</a>`:s}</td></tr>`).join('')}</tbody>`;
}
function renderMethod(){
  const order=['real','beats','irr','bench','rent','cash','pv','noi','gross','nety','cap','grm','salebe','payback','coverage','roi','multiple','npv','usd','grow'];
  $('#methodBody').innerHTML = `
  <div class="panel"><div class="ph"><h2>${tx('The order of the calculation','ترتيب الحسبة')}</h2></div><ul>
    <li>${tx('Your payment plan becomes a month-by-month cash flow: down payment, installments, delivery payment, maintenance deposit and finishing.','خطة السداد بتتحول لتدفق نقدي شهر بشهر: المقدم والأقساط ودفعة الاستلام ووديعة الصيانة والتشطيب.')}</li>
    <li>${tx('Rent starts after delivery plus the months needed to finish and find a tenant. It comes from Knight Frank\'s published rent for the building grade, adjusted for finishing and a negotiation discount, or from your own quote, then grows each year.','الإيجار بيبدأ بعد الاستلام + الشهور اللازمة للتشطيب وإيجاد مستأجر. بييجي من إيجار Knight Frank المنشور لنوع المبنى، متعدّل حسب التشطيب وخصم التفاوض، أو من عرض الإيجار بتاعك، وبعدين بيزيد كل سنة.')}</li>
    <li>${tx('Resale value starts from the cash value of the unit (estimated with a 30% cap if you do not enter it), below the developer price for developer purchases, and grows by the scenario rate.','قيمة إعادة البيع بتبدأ من قيمة الكاش للوحدة (متقدرة بحد أقصى 30% خصم لو مدخلتهاش)، وأقل من سعر المطوّر لو الشرا من المطوّر، وبتزيد بنسبة السيناريو.')}</li>
    <li>${tx('A sale pays commission, a developer transfer fee if before delivery or the last installment, optionally the draft 2.5% sale tax, and the remaining installments at their present value (the buyer takes them over).','البيع عليه عمولة، ورسوم تنازل للمطوّر لو قبل الاستلام أو آخر قسط، واختيارياً ضريبة البيع 2.5% المقترحة، والأقساط الباقية بقيمتها الحالية (المشتري بياخدها).')}</li>
    <li>${tx('Everything is compared with the National Bank of Egypt certificate that matches your holding period, after inflation.','كل ده بيتقارن بشهادة البنك الأهلي المناسبة لمدة احتفاظك، بعد التضخم.')}</li>
  </ul></div>
  <div class="panel"><div class="ph"><h2>${tx('Every metric','كل المؤشرات')}</h2></div><dl>${order.map(k=>{ const g=GL[k][S.lang]; return `<dt>${g[0]}</dt><dd>${g[1]}${g[2]?`<code>${g[2]}</code>`:''}</dd>`; }).join('')}</dl></div>
  <div class="panel"><div class="ph"><h2>${tx('What we do not know yet','اللي لسه مش عارفينه')}</h2></div><ul>
    <li>${tx('Rents are market averages by building grade, not prices for a specific building. A real quote from a broker is better.','الإيجارات متوسطات سوق حسب نوع المبنى، مش أسعار مبنى معيّن. عرض حقيقي من بروكر أحسن.')}</li>
    <li>${tx('Asking rents are higher than signed rents; the negotiation discount is an estimate.','الإيجار المطلوب أعلى من الإيجار اللي بيتمضي؛ نسبة التفاوض تقدير.')}</li>
    <li>${tx('Resale discount, vacancy and price growth vary by building; treat them as editable assumptions.','فرق إعادة البيع والشغور ونمو السعر بيختلفوا من مبنى للتاني؛ اعتبرهم افتراضات تقدر تعدّلها.')}</li>
    <li>${tx('Income tax on rent is not included yet.','ضريبة الدخل على الإيجار لسه مش محسوبة.')}</li>
  </ul></div>
  <div class="panel" id="disclosure"><div class="ph"><h2>${tx('Disclosure','الإفصاح')}</h2></div><p style="margin:0;color:var(--ink2)">${tx('AqarMath was founded by Hesham Rodiny, who works in real estate sales and may discuss units he earns a commission on. The calculations use the same formulas for every unit, whoever sells it. No developer pays to appear or to change a result, and the site does not list units for sale. Nothing here is investment advice.','AqarMath أسسها هشام روديني، وهو شغال في مبيعات العقارات وممكن يكلمك عن وحدات بياخد عليها عمولة. الحسابات بنفس المعادلات لكل وحدة مهما كان مين بيبيعها. محدش من المطورين بيدفع عشان يظهر أو عشان نتيجة تتغير، والموقع مش بيعرض وحدات للبيع. مفيش حاجة هنا نصيحة استثمارية.')}</p></div>
  <div class="panel" id="privacy"><div class="ph"><h2>${tx('Privacy','الخصوصية')}</h2></div><ul>
    <li>${tx('No sign-up. What you type stays in your browser on this device and is not sent to us.','مفيش تسجيل. اللي بتكتبه بيفضل في المتصفح على جهازك ومش بيتبعتلنا.')}</li>
    <li>${tx('WhatsApp opens only after you tick the consent box, and sends only the message you see before pressing send.','واتساب مش بيفتح غير بعد ما تعلّم على الموافقة، وبيبعت الرسالة اللي إنت شايفها بس قبل ما تدوس إرسال.')}</li>
    <li>${tx('We count anonymous page visits (Vercel Web Analytics) with no cookies and no personal data.','بنعدّ زيارات الصفحات من غير هوية (Vercel Web Analytics) من غير كوكيز ولا بيانات شخصية.')}</li>
    <li>${tx('To delete: use “Clear my data on this device” on the Analyze page, and reply “delete” on WhatsApp to remove the chat.','للمسح: استخدم «امسح بياناتي من الجهاز» في صفحة التحليل، وابعت «امسح» على واتساب عشان نمسح المحادثة.')}</li>
  </ul></div>
  <div class="panel"><div class="ph"><h2>${tx('Limitation','حدود المسؤولية')}</h2></div><p style="margin:0;color:var(--ink2)">${tx('Results are estimates from published averages and your inputs. Real rents, prices, fees and delivery dates differ by building and contract. Check the contract and get independent advice before you pay. AqarMath and Hesham Rodiny are not liable for decisions made from these estimates.','النتايج تقديرات من متوسطات منشورة والأرقام اللي دخّلتها. الإيجار والسعر والرسوم ومواعيد الاستلام الحقيقية بتختلف من مبنى لمبنى ومن عقد لعقد. راجع العقد وخد رأي مستقل قبل ما تدفع. AqarMath وهشام روديني مش مسؤولين عن قرارات مبنية على التقديرات دي.')}</p></div>
  <div class="panel"><div class="ph"><h2>${tx('Sources','المصادر')}</h2></div><div class="scroll"><table class="t" id="srcTable2"></table></div></div>`;
  renderSources(); $('#srcTable2').innerHTML = $('#srcTable').innerHTML;
}

/* ================= compare ================= */
function buildUnitB(){
  const card=k=>{ const u=S.U[k], p=id=>`u-${k}-${id}`;
    if (k==='a') return `<div class="panel unit"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span class="dot"></span><h2>${unitName('a')}</h2></div><p class="hint" style="margin:0 0 8px;color:var(--muted);font-size:13px">${unitLine(u)}</p><button class="linkbtn" type="button" data-tab="analyze">${tx('Edit on Analyze','عدّلها في صفحة التحليل')}</button></div>`;
    return `<div class="panel unit b"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span class="dot b"></span><h2>${unitName('b')}</h2></div><div class="fg">
      ${fld(p('zone'),tx('Zone','المنطقة'),sel(p('zone'),ZO(),u.zone))}${fld(p('grade'),tx('Building','المبنى'),sel(p('grade'),GO(),u.grade))}${fld(p('finish'),tx('Finishing','التشطيب'),sel(p('finish'),FO(),u.finish))}
      ${fld(p('area'),tx('Area (m²)','المساحة (م²)'),num(p('area'),u.area,1,10))}${fld(p('delm'),tx('Delivery','الاستلام'),sel(p('delm'),DO(),u.delm))}
      ${fld(p('price'),tx('Unit price (EGP)','سعر الوحدة (جنيه)'),mon(p('price'),u.price),'',true)}
      ${fld(p('down'),tx('Down payment %','المقدم %'),num(p('down'),u.down,1,0,100))}${fld(p('years'),tx('Installment years','سنين التقسيط'),num(p('years'),u.years,1,0,15))}
      ${fld(p('cash'),tx('Cash price (optional)','سعر الكاش (اختياري)'),mon(p('cash'),u.cash,tx('Estimate','تقدير')),'',true)}
      ${fld(p('source'),tx('Buying from','الشرا من'),sel(p('source'),SO(),u.source))}${fld(p('maint'),tx('Maintenance %','الصيانة %'),num(p('maint'),u.maint,0.5,0,20))}
      ${fld(p('rent'),tx('Rent quote (EGP/m²/mo)','عرض إيجار (ج/م²/شهر)'),num(p('rent'),u.rent||'',10,0,20000),'',true)}</div></div>`; };
  $('#unitCards').innerHTML = card('a') + card('b');
}
function renderCompare(){
  if (!$('#u-b-zone')) buildUnitB();
  const eb = E.validate(S.U.b); showErrors('b', eb);
  const ea = E.validate(S.U.a);
  $$('[data-name="a"]').forEach(e=>e.textContent=unitName('a')); $$('[data-name="b"]').forEach(e=>e.textContent=unitName('b'));
  if (Object.keys(ea).length || Object.keys(eb).length){ $('#vTitle').textContent=tx('Check the highlighted fields to compare.','راجع الخانات المعلّمة عشان نقارن.'); $('#vText').textContent=''; return; }
  const ra=R.a, rb=R.b, H=S.hold;
  const aw=(isFinite(ra.real)?ra.real:-9)>=(isFinite(rb.real)?rb.real:-9), W=aw?ra:rb, L=aw?rb:ra, wn=unitName(aw?'a':'b');
  $('#vBar').style.background=aw?'var(--s1)':'var(--s2)';
  $('#vTitle').textContent=!isFinite(W.real)?tx('Neither unit gets your money back if sold in this period.','ولا وحدة بترجّع فلوسك لو اتباعت في المدة دي.'):tx(`${wn} earns more: ${pct(W.real)} a year after inflation, against ${pct(L.real)}.`,`${wn} بتكسب أكتر: ${pct(W.real)} سنوياً بعد التضخم، مقابل ${pct(L.real)}.`);
  $('#vText').textContent=tx(`Bank certificate after inflation: ${pct(ra.benchReal)}. Holding period ${H} years.`,`الشهادة البنكية بعد التضخم: ${pct(ra.benchReal)}. مدة الاحتفاظ ${H} سنين.`);
  const dt=m=>m<0?'—':yrs(m);
  const rows=[
    [T('real'),pct(ra.real),pct(rb.real),ra.real,rb.real,'high'],[T('irr'),pct(ra.irr),pct(rb.irr),ra.irr,rb.irr,'high'],
    [T('salebe'),dt(ra.saleBeM),dt(rb.saleBeM),ra.saleBeM<0?1e9:ra.saleBeM,rb.saleBeM<0?1e9:rb.saleBeM,'low'],
    [T('nety'),pct(ra.netY),pct(rb.netY),ra.netY,rb.netY,'high'],[T('cash'),money(ra.cashValue),money(rb.cashValue),ra.cashValue/ra.net,rb.cashValue/rb.net,'low'],
    [tx('Price per m²','سعر المتر'),money(ra.ppm),money(rb.ppm),ra.ppm,rb.ppm,'low'],[tx('Monthly rent','الإيجار الشهري'),money(ra.rentMonth),money(rb.rentMonth),ra.rentMonth,rb.rentMonth,'high'],
    [T('usd'),pct(ra.usd),pct(rb.usd),ra.usd,rb.usd,'high'],[T('npv'),money(ra.npv),money(rb.npv),ra.npv,rb.npv,'high'],
    [T('payback'),dt(ra.paybackM),dt(rb.paybackM),ra.paybackM<0?1e9:ra.paybackM,rb.paybackM<0?1e9:rb.paybackM,'low'],[T('beats'),ra.beats?tx('Yes','أيوه'):tx('No','لأ'),rb.beats?tx('Yes','أيوه'):tx('No','لأ'),+ra.beats,+rb.beats,'high']];
  $('#cmpBody').innerHTML=rows.map(([k,va,vb,na,nb,dir])=>{ const ok=isFinite(na)&&isFinite(nb)&&Math.abs(na-nb)>1e-9, a2=ok&&(dir==='high'?na>nb:na<nb), b2=ok&&!a2;
    return `<tr><td class="k">${k}</td><td class="v ${a2?'win':''}"><span class="num">${va}</span></td><td class="v ${b2?'win':''}"><span class="num">${vb}</span></td></tr>`; }).join('');
  const Y=Math.max(ra.years.length,rb.years.length), ys=[...Array(Y+1).keys()], fm=v=>(v<0?'−':'')+egp(Math.abs(v));
  const ser=[{label:unitName('a'),color:'var(--s1)',bold:true,values:ys.map(y=>ra.cum[12*y]+ra.saleNet(12*y)),fmt:fm},{label:unitName('b'),color:'var(--s2)',bold:true,values:ys.map(y=>rb.cum[12*y]+rb.saleNet(12*y)),fmt:fm}];
  const cu=lineChart($('#cmpChart'),{labels:ys.map(y=>y===0?tx('Today','النهارده'):tx('Yr ','سنة ')+y),series:ser,zero:true});
  $('#cmpLegend').innerHTML=ser.map(s=>`<span><i style="background:${s.color}"></i>${s.label}</span>`).join('')+`<span style="color:var(--muted)">${tx('EGP','جنيه')} ${cu}</span>`;
}

/* ================= market / news ================= */
function renderMarket(){
  const t=(l,v,m)=>`<div class="tile"><div class="lab">${l}</div><div class="val num">${v}</div><div class="meta">${m}</div></div>`;
  $('#tiles').innerHTML=[t(tx('NBE 5-year certificate','شهادة الأهلي الخمسية'),'14.25%',tx('paid monthly · 23 Oct 2026','عائد شهري · 23 أكتوبر 2026')),
    t(tx('CBE deposit rate','فايدة البنك المركزي'),'19%',tx('6th hold · 24 Sep 2026','تثبيت سادس · 24 سبتمبر 2026')),
    t(tx('Urban inflation','التضخم في الحضر'),'13.9%',tx('Sep 2026','سبتمبر 2026')),
    t(tx('USD (CBE, sell)','الدولار (المركزي)'),'54.58',tx('21 Oct 2026','21 أكتوبر 2026')),
    t(tx('Cairo office rents','إيجارات المكاتب'),'+20%',tx('y/y in EGP · Knight Frank','سنوياً بالجنيه · Knight Frank'))].join('');
  const mx=DEVS[0][2];
  $('#devTable').innerHTML=`<thead><tr><th>#</th><th>${tx('Developer','المطوّر')}</th><th>${tx('Sales','المبيعات')}</th></tr></thead><tbody>${DEVS.map((d,i)=>`<tr><td class="v">${i+1}</td><td>${ar()?d[1]:d[0]}</td><td><div class="barcell"><i style="width:${Math.round(d[2]/mx*110)}px"></i><span class="num">${fmt(d[2],1)}</span></div></td></tr>`).join('')}</tbody>`;
  const box=$('#zoneChart'), W=box.clientWidth||500, rows=Object.keys(E.GRADES).flatMap(g=>['full','semi'].map(f=>[`${g} · ${FIN[f][S.lang]}`,E.GRADES[g].full*E.FIN_SHARE[f]])), max=Math.max(...rows.map(r=>r[1])), labW=130, valW=56, bh=22, gap=18, rtl=ar();
  const Hh=4+rows.length*(bh+gap), bw=v=>(W-labW-valW)*v/max; let svg=`<svg xmlns="${NS}" viewBox="0 0 ${W} ${Hh}" aria-hidden="true">`;
  rows.forEach(([nm,v],i)=>{ const y=4+i*(bh+gap), w=bw(v);
    svg+= rtl ? `<text x="${W}" y="${y+bh/2+4}" text-anchor="end" style="fill:var(--ink);font-size:13px">${nm}</text><rect x="${W-labW-w}" y="${y}" width="${w}" height="${bh}" rx="4" fill="var(--accent)"/><text x="${W-labW-w-8}" y="${y+bh/2+4}" text-anchor="end" style="fill:var(--ink);font-weight:600">${fmt(v)}</text>`
              : `<text x="0" y="${y+bh/2+4}" style="fill:var(--ink);font-size:13px">${nm}</text><rect x="${labW}" y="${y}" width="${w}" height="${bh}" rx="4" fill="var(--accent)"/><text x="${labW+w+8}" y="${y+bh/2+4}" style="fill:var(--ink);font-weight:600">${fmt(v)}</text>`; });
  box.style.height=Hh+'px'; box.innerHTML=svg+'</svg>';
  const inf=S.A.inf/100, y=E.GRADES.B.full*12*(1-S.A.negot/100)/182000*(1-S.A.vac/100-S.A.svc/100-0.068);
  const rr=[[tx('NBE 5-year certificate (15.2% a year reinvested)','شهادة الأهلي الخمسية (15.2% سنوياً بإعادة الاستثمار)'),(1+E.NBE5_EFF)/(1+inf)-1],[tx('Grade B office net rent yield (Knight Frank sale price)','العائد الإيجاري الصافي لمكتب Grade B (سعر Knight Frank)'),(1+y)/(1+inf)-1],[tx('Office total (rent + base price growth)','مكتب: إيجار + نمو السعر الواقعي'),(1+y+S.A.pg/100)/(1+inf)-1]];
  $('#realTable').innerHTML=`<tbody>${rr.map(([l,v])=>`<tr><td>${l}</td><td class="v ${v<0?'neg':''}"><span class="num">${pct(v)}</span></td></tr>`).join('')}</tbody>`;
}
function renderNews(){
  $('#newsFilter').innerHTML=Object.keys(CATS).map(c=>`<button class="chip" type="button" aria-pressed="${S.news===c}" data-cat="${c}">${CATS[c][S.lang]}</button>`).join('');
  const fd=iso=>new Date(iso+'T00:00:00').toLocaleDateString(ar()?'ar-EG-u-nu-latn':'en-GB',{day:'numeric',month:'short',year:'numeric'});
  $('#newsList').innerHTML=NEWS.filter(n=>S.news==='all'||n.c===S.news).map(n=>{ const t=n[S.lang]; return `<article class="panel news-item">
    <div class="news-meta"><span>${fd(n.d)}</span><span class="pill ctr">${CATS[n.c][S.lang]}</span></div>
    <div><h2>${t[0]}</h2><p>${t[1]}</p><div class="why"><b>${tx('What it means for you: ','يعني إيه بالنسبة لك: ')}</b>${t[2]}</div>
    <div class="src">${tx('Source:','المصدر:')} <a href="${n.url}" target="_blank" rel="noopener">${n.src}</a></div></div></article>`; }).join('');
}
/* ================= glossary popover ================= */
const pop=$('#pop');
function openTerm(btn){
  const g=GL[btn.dataset.term]; if(!g) return; const [t,d,f]=g[S.lang];
  pop.innerHTML=`<b>${t}</b>${d}${f?`<code>${f}</code>`:''}`; pop.hidden=false;
  const r=btn.getBoundingClientRect(), vw=document.documentElement.clientWidth, pw=Math.min(320,vw-32);
  pop.style.maxWidth=pw+'px';
  let left=r.left+window.scrollX; left=Math.max(16,Math.min(left,window.scrollX+vw-pw-16));
  pop.style.left=left+'px'; pop.style.top=(r.bottom+window.scrollY+8)+'px';
}

/* ================= tabs ================= */
function buildNav(){
  $('#tabs').innerHTML = TABS.map(([id,en,a])=>`<button role="tab" type="button" aria-selected="${S.tab===id}" data-tab="${id}">${ar()?a:en}</button>`).join('');
  $('#bnav').innerHTML = TABS.map(([id,,,se,sa])=>`<button type="button" aria-selected="${S.tab===id}" data-tab="${id}"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id]}</svg><span>${ar()?sa:se}</span></button>`).join('');
}

/* ================= render loop ================= */
function applyStatic(){
  const r=document.documentElement; r.lang=S.lang; r.dir=ar()?'rtl':'ltr';
  $$('[data-ar]').forEach(el=>{ if(!('en' in el.dataset)) el.dataset.en=el.textContent; el.textContent=ar()?el.dataset.ar:el.dataset.en; });
  $('#langBtn').textContent=ar()?'English':'العربية';
  document.title=ar()?'AqarMath · العقار بالأرقام':'AqarMath · Real estate, by the numbers';
  $('#broker').value = S.broker || '';
  $$('#curSeg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cur===S.cur));
  $$('#scnSeg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.scn===S.scn));
  $$('#exitSeg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.exit===S.exit));
  $('#holdLab').textContent = S.exit==='keep' ? tx('Keep for','هحتفظ بيها') : tx('Sell after','هبيع بعد');
  $('#hold').value = String(S.hold);
}
function renderAll(){
  const ok = k => !Object.keys(E.validate(S.U[k])).length;
  if (ok('a')) R.a = E.compute(S.U.a, S.A, {H:S.hold, scn:S.scn, keep:S.exit==='keep'});
  if (ok('b')) R.b = E.compute(S.U.b, S.A, {H:S.hold, scn:S.scn, keep:S.exit==='keep'});
  ({analyze:renderAnalyze, compare:renderCompare, market:renderMarket, news:renderNews, method:renderMethod})[S.tab]();
  if (S.tab!=='analyze') setBar('');
  saveState();
}
function rebuild(){ applyStatic(); buildNav(); buildInputs(); buildAssume(); $('#unitCards').innerHTML=''; renderAll(); }
function showTab(id){
  S.tab=id; buildNav();
  $$('.page').forEach(p=>p.hidden=p.id!==id); pop.hidden=true;
  renderAll(); window.scrollTo({top:0});
}

/* ================= events ================= */
const NUMK=['area','price','down','years','disc','dp2','dp2m','freq','delm','delpay','maint','maintb','fin','lease','cash','rent'];
const NULLABLE=['fin','lease'];
document.addEventListener('input',e=>{
  const el=e.target, id=el.id||''; let m;
  if (el.classList.contains('money')){
    const raw = digits(el.value), v = raw ? Math.round(+raw) : 0;
    el.value = raw ? fmt(v) : ''; try { el.setSelectionRange(el.value.length, el.value.length); } catch(_){}
    const w=$('#w-'+id); if (w) w.textContent = v ? words(v) : '';
  }
  if ((m=id.match(/^u-([ab])-(\w+)$/))){ const [,k,f]=m; let v=el.value;
    if (el.classList.contains('money')) v = digits(v) ? Math.round(+digits(v)) : 0;
    else if (NUMK.includes(f)) v = v==='' ? (NULLABLE.includes(f) ? null : ((f==='cash'||f==='rent')?0:'')) : +v;
    S.U[k][f]=v;
    if (f==='finish'){ S.U[k].fin=null; S.U[k].lease=null; }
    renderAll(); return; }
  if ((m=id.match(/^a-(\w+)$/))){ const f=m[1]; S.A[f] = (f==='tax'||f==='dispTax') ? el.value==='1' : f==='bench' ? el.value : (+el.value||0); renderAll(); return; }
  if (id==='hold'){ S.hold=+el.value; renderAll(); return; }
  if (id==='contract'){ if(el.value) S.contract=el.value; renderAll(); return; }
  if (id==='consent'){ S.consent=el.checked; updateLinks(); saveState(); return; }
  if (id==='broker'){ S.broker=el.value.slice(0,60); saveState(); }
});
document.addEventListener('change',e=>{
  const el=e.target;
  if (el.tagName==='SELECT' || (el.id||'').match(/^u-a-down$/)) el.dispatchEvent(new CustomEvent('input',{bubbles:true}));
  if ((el.id||'').match(/^u-a-(finish|afterDel|down)$/)){ moreOpen = !!($('#moreGroup')&&$('#moreGroup').open); const fid=el.id; buildInputs(); const n=document.getElementById(fid); if(n) n.focus(); renderAll(); }
  if ((el.id||'')==='u-b-finish') buildUnitB();
});
document.addEventListener('toggle',e=>{ if(e.target.id==='moreGroup') moreOpen=e.target.open; },true);
document.addEventListener('click',e=>{
  const term=e.target.closest('.term'); if(term){ e.preventDefault(); if(!pop.hidden&&pop.dataset.for===term.dataset.term){ pop.hidden=true; return; } pop.dataset.for=term.dataset.term; openTerm(term); return; }
  if(!e.target.closest('#pop')) pop.hidden=true;
  if (e.target.closest('#vchip')){ $('#story').scrollIntoView({behavior:'smooth',block:'start'}); return; }
  const wa=e.target.closest('#waBtn'); if (wa && !S.consent){ e.preventDefault(); toast(tx('Tick the consent box first','علّم على الموافقة الأول')); $('#consent').focus(); return; }
  if (e.target.closest('#mbar')){ $('#story').scrollIntoView({behavior:'smooth',block:'start'}); return; }
  const b=e.target.closest('button'); if(!b) return;
  if (b.dataset.focus){ const d=$('#moreGroup'); if(d){ d.open=true; moreOpen=true; } const n=document.getElementById(b.dataset.focus); if(n){ n.scrollIntoView({behavior:'smooth',block:'center'}); setTimeout(()=>n.focus(),300); } return; }
  if (b.dataset.tab) return showTab(b.dataset.tab);
  if (b.dataset.cur){ S.cur=b.dataset.cur; $$('#curSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b)); return renderAll(); }
  if (b.dataset.exit){ S.exit=b.dataset.exit; if(S.exit==='keep'&&S.hold<10){ S.hold=15; } applyStatic(); return renderAll(); }
  if (b.id==='schedAll'){ S.schedAll=!S.schedAll; return renderAnalyze(); }
  if (b.dataset.scn){ S.scn=b.dataset.scn; $$('#scnSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b)); return renderAll(); }
  if (b.dataset.cat){ S.news=b.dataset.cat; return renderNews(); }
  if (b.id==='moreKpis'){ S.moreK=!S.moreK; return renderAnalyze(); }
  if (b.id==='pdfBtn'){ preparePrint(); window.print(); return; }
  if (b.id==='shareBtn' || b.id==='shareCopy2'){ copyShare(); return; }
  if (b.id==='storyMore'){ S.moreS=!S.moreS; return renderAnalyze(); }
  if (b.id==='clearData'){ try{ localStorage.removeItem('aqm:v3'); localStorage.removeItem('aqm:v2'); localStorage.removeItem('lang'); }catch(_){} S.consent=false; S.broker=''; toast(tx('Cleared from this device','اتمسحت من الجهاز')); setTimeout(()=>location.replace(location.pathname),600); return; }
  if (b.id==='langBtn'){ S.lang=ar()?'en':'ar'; store.set('lang',S.lang); rebuild(); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') pop.hidden=true; });
window.addEventListener('beforeprint',()=>{ preparePrint(); });
let rz; window.addEventListener('resize',()=>{ clearTimeout(rz); rz=setTimeout(()=>{ pop.hidden=true; renderAll(); },150); });

/* ================= boot ================= */
loadState();
const h=(location.hash||'').slice(1); if(['analyze','compare','market','news','method'].includes(h)) S.tab=h;
rebuild(); showTab(S.tab);
if (S._fromLink) { try { history.replaceState(null,'',location.pathname+location.hash); } catch(e){} toast(tx('Loaded the shared unit','اتحمّلت الوحدة اللي اتبعتت')); }
})();
