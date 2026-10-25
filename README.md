# AqarMath — Real estate, by the numbers

موقع ثابت جاهز للنشر على Vercel (مفيش build).

## الملفات
- `index.html` — الداشبورد كاملة (إنجليزي + عربي).
- `favicon.svg` — أيقونة التبويب.
- `og.png` — الصورة اللي بتظهر لما اللينك يتشارك.
- `vercel.json` — إعداد بسيط.

## 1. احجز الدومين (5 دقايق)
1. ادخل https://dash.cloudflare.com واعمل حساب، ومن القايمة اختار **Domain Registration ← Register Domains**.
   (أو Namecheap.com لو حابب.)
2. دوّر على `aqarmath.com` واشتريه (حوالي 10–15 دولار في السنة).
3. اختياري: احجز `aqarmath.eg` من مسجّل مصري معتمد.

## 2. ارفع الموقع على GitHub
1. github.com/new ← اسم الريبو `aqarmath` ← Public ← Create.
2. "uploading an existing file" ← ارفع الأربع ملفات ← Commit changes.

## 3. انشر على Vercel
1. vercel.com ← Add New ← Project ← اختار `aqarmath` ← Import ← Framework: Other ← Deploy.
2. هيطلعلك لينك `aqarmath.vercel.app`.

## 4. اربط الدومين
1. في Vercel: المشروع ← Settings ← Domains ← اكتب `aqarmath.com` ← Add.
2. Vercel هيديك سجلات DNS (A أو CNAME). حطها في Cloudflare ← الدومين ← DNS.
3. خلال دقايق لساعات الموقع يشتغل على aqarmath.com.

أي تعديل بعد كده: يتعمل في الشات، يترفع على GitHub، وVercel ينشره لوحده.
