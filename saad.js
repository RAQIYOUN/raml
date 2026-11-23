/* ساعات سعد و نحس (ساعات کواکب) — نوار بالای صفحه و پنجره‌ی کامل ساعات
   برگرفته از برنامه‌ی «ساعات کواکب» (راقیون، محمود خاوری) */
(function(){
'use strict';
const D = Math.PI / 180;
function sunEvents(y, m, d, lat, lon){
    const jd = Date.UTC(y, m, d, 12) / 864e5 + 2440587.5, T = (jd - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360, M = 357.52911 + T * (35999.05029 - 0.0001537 * T), e = 0.016708634 - T * (0.000042037 + 1.267e-7 * T), Mr = M * D;
    const C = Math.sin(Mr) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * Mr) * (0.019993 - 0.000101 * T) + Math.sin(3 * Mr) * 0.000289;
    const om = 125.04 - 1934.136 * T, lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om * D);
    const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(om * D);
    const dec = Math.asin(Math.sin(eps * D) * Math.sin(lam * D)), y2 = Math.tan(eps * D / 2) ** 2, L = L0 * D;
    const eq = 4 * (y2 * Math.sin(2 * L) - 2 * e * Math.sin(Mr) + 4 * e * y2 * Math.sin(Mr) * Math.cos(2 * L) - 0.5 * y2 * y2 * Math.sin(4 * L) - 1.25 * e * e * Math.sin(2 * Mr)) / D;
    const ch = (Math.cos(90.833 * D) - Math.sin(lat * D) * Math.sin(dec)) / (Math.cos(lat * D) * Math.cos(dec));
    if(Math.abs(ch) > 1) return null;
    const H = Math.acos(ch) / D, noon = 720 - 4 * lon - eq, b = Date.UTC(y, m, d);
    return [b + (noon - 4 * H) * 6e4, b + (noon + 4 * H) * 6e4];
}
const CH = ['زحل', 'مشتری', 'مریخ', 'خورشید', 'زهره', 'عطارد', 'ماه'];
const LORD = ['خورشید', 'ماه', 'مریخ', 'عطارد', 'مشتری', 'زهره', 'زحل'];
/* k: g سعد، b نحس، m میانه */
const INFO = {
    'خورشید': { k: 'g', t: 'سعد اکبر', s: 'مناسب محبت و دوستی، درخواست از حاکمان و بزرگان، و طلب حاجت.', n: 'برای مطرح کردن خواسته‌ی مهم نزد افراد صاحب‌اختیار و پیگیری کار اداری فرصت خوبی است.' },
    'زهره': { k: 'g', t: 'سعد منقلب', s: 'مناسب محبت و آشتی، درخواست از حاکمان و طلب حاجت.', n: '«منقلب» یعنی سعدی که ممکن است برگردد؛ با نیت خیر و توکل شروع کنید و عجولانه تصمیم نگیرید.' },
    'عطارد': { k: 'm', t: 'میانه', s: 'برای هیچ کار نیکِ شاخصی شایسته نیست.', n: 'کارهای روزمره و سبک اشکالی ندارد؛ شروع کار مهم، قرارداد و تصمیم بزرگ را به ساعت سعد بسپارید.' },
    'ماه': { k: 'm', t: 'تابع شرایط', s: 'از انجام امور مهم صرف‌نظر کنید.', n: 'اثر این ساعت وابسته به شرایط است؛ کار مهم را آغاز نکنید و اگر ناچارید با مشورت و احتیاط پیش بروید.' },
    'زحل': { k: 'b', t: 'نحس اکبر', s: 'ساعت نفرت، طلاق، جدایی و تفرقه؛ برای کار خیر مناسب نیست.', n: 'از بحث و قهر، تصمیم جدایی و شروع کارهای مهم بپرهیزید. اگر ناچارید، صدقه بدهید و با آرامش عمل کنید.' },
    'مشتری': { k: 'g', t: 'سعد اکبر', s: 'برای هر کار خوبی مناسب است.', n: 'بهترین فرصت برای شروع کارهای مهم و خیر؛ کار اصلی روز را اگر می‌شود در همین ساعت انجام دهید.' },
    'مریخ': { k: 'b', t: 'نحس اصغر', s: 'مناسب تفرقه، دشمنی و کارهای پست است؛ برای کار نیک مناسب نیست.', n: 'از درگیری، خشم و تصمیم‌های پرخطر دوری کنید و کارهای حساس را به ساعت دیگری موکول کنید.' }
};
const FIG = { 'خورشید': [['نصره الخارج', '1122'], ['قبض الداخل', '2121']], 'ماه': [['بیاض', '2212'], ['طریق', '1111']], 'مریخ': [['حمره', '2122'], ['نقی الخد', '1211']], 'عطارد': [['اجتماع', '2112'], ['جماعت', '2222']], 'مشتری': [['لحیان', '1222'], ['نصره الداخل', '2211']], 'زهره': [['فرح', '1121'], ['عتبه الداخل', '2111']], 'زحل': [['انکیس', '2221'], ['عقله', '1221']] };
const ICO = { 'خورشید': '☉', 'ماه': '☾', 'مریخ': '♂', 'عطارد': '☿', 'مشتری': '♃', 'زهره': '♀', 'زحل': '♄' };
const CT = {
    'ایران': [['تهران', 35.6892, 51.389, 'Asia/Tehran'], ['مشهد', 36.2605, 59.6168, 'Asia/Tehran'], ['اصفهان', 32.6546, 51.668, 'Asia/Tehran'], ['شیراز', 29.5918, 52.5837, 'Asia/Tehran'], ['تبریز', 38.0962, 46.2738, 'Asia/Tehran'], ['اهواز', 31.3183, 48.6706, 'Asia/Tehran']],
    'افغانستان': [['کابل', 34.5553, 69.2075, 'Asia/Kabul'], ['هرات', 34.3529, 62.204, 'Asia/Kabul'], ['مزار شریف', 36.7069, 67.11, 'Asia/Kabul'], ['قندهار', 31.6289, 65.7372, 'Asia/Kabul']],
    'تاجیکستان': [['دوشنبه', 38.5598, 68.787, 'Asia/Dushanbe'], ['خجند', 40.2826, 69.622, 'Asia/Dushanbe']],
    'پاکستان': [['اسلام‌آباد', 33.6844, 73.0479, 'Asia/Karachi'], ['کراچی', 24.8607, 67.0011, 'Asia/Karachi'], ['لاهور', 31.5204, 74.3587, 'Asia/Karachi']],
    'ترکیه': [['آنکارا', 39.9334, 32.8597, 'Europe/Istanbul'], ['استانبول', 41.0082, 28.9784, 'Europe/Istanbul'], ['ازمیر', 38.4237, 27.1428, 'Europe/Istanbul']],
    'آلمان': [['برلین', 52.52, 13.405, 'Europe/Berlin'], ['مونیخ', 48.1351, 11.582, 'Europe/Berlin'], ['هامبورگ', 53.5511, 9.9937, 'Europe/Berlin'], ['فرانکفورت', 50.1109, 8.6821, 'Europe/Berlin']],
    'استرالیا': [['سیدنی', -33.8688, 151.2093, 'Australia/Sydney'], ['ملبورن', -37.8136, 144.9631, 'Australia/Melbourne'], ['بریزبن', -27.4698, 153.0251, 'Australia/Brisbane'], ['پرت', -31.9505, 115.8605, 'Australia/Perth']],
    'هند': [['دهلی نو', 28.6139, 77.209, 'Asia/Kolkata'], ['مومبای', 19.076, 72.8777, 'Asia/Kolkata'], ['کلکته', 22.5726, 88.3639, 'Asia/Kolkata'], ['بنگلور', 12.9716, 77.5946, 'Asia/Kolkata']],
    'روسیه': [['مسکو', 55.7558, 37.6173, 'Europe/Moscow'], ['سن‌پترزبورگ', 59.9343, 30.3351, 'Europe/Moscow'], ['یکاترینبورگ', 56.8389, 60.6057, 'Asia/Yekaterinburg'], ['نووسیبیرسک', 55.0084, 82.9357, 'Asia/Novosibirsk'], ['ولادی‌وستوک', 43.1155, 131.8855, 'Asia/Vladivostok']]
};
/* سعد و نحس روزهای ماه قمری — مکارم الاخلاق، فصل اختیارات ایام، از امام صادق (ع). k: g سعد، b نحس، m ممزوج */
const DAYS = [
['g', 'سعد است؛ برای ملاقات با امرا، درخواست نیازها، خرید و فروش، کشاورزی و سفر مناسب است.'],
['g', 'برای سفر و درخواست نیازها مناسب است.'],
['b', 'بد است و برای هیچ کاری مناسب نیست.'],
['g', 'برای ازدواج مناسب است؛ سفر در آن مکروه است.'],
['b', 'بد و نحس است.'],
['g', 'مبارک است؛ برای ازدواج و درخواست نیازها مناسب است.'],
['g', 'مبارک و مختار است؛ برای هر کاری که قصد دارید مناسب است.'],
['g', 'برای هر نیازی جز سفر مناسب است؛ سفر در آن مکروه است.'],
['g', 'مبارک است و برای هر خواسته‌ای مناسب است؛ کسی که در آن سفر کند مال به دست می‌آورد و در سفر خیر می‌بیند.'],
['g', 'برای هر نیازی جز رفتن نزد سلطان مناسب است؛ گمشده پیدا می‌شود، بیمار شفا می‌یابد و خرید و فروش خوب است. کسی که در این روز از سلطان بگریزد گرفتار می‌شود.'],
['g', 'برای خرید و فروش، همه‌ی نیازها و سفر مناسب است، جز رفتن نزد سلطان؛ پنهان شدن در آن مناسب است.'],
['g', 'روزی صالح و مبارک است؛ نیازهایتان را بخواهید و برایش تلاش کنید که برآورده می‌شود.'],
['b', 'نحس مستمر است؛ از انجام همه‌ی کارها در آن پرهیز کنید.'],
['g', 'برای نیازها و هر کاری خوب است.'],
['g', 'برای هر نیازی مناسب است؛ نیازهایتان را بخواهید که برآورده می‌شود.'],
['b', 'بد و مذموم است برای هر چیزی.'],
['g', 'صالح و مختار است؛ هر چه می‌خواهید بخواهید. ازدواج، خرید و فروش، کشاورزی، ساخت‌وساز و رفتن نزد سلطان برای نیازها مناسب است.'],
['g', 'مختار و مناسب سفر و درخواست نیازهاست؛ اگر در آن با دشمن دعوا کنید، به قدرت خدا بر او غلبه می‌کنید.'],
['g', 'مختار و صالح برای هر کاری است؛ کسی که در آن به دنیا بیاید مبارک خواهد بود.'],
['g', 'خوب و مختار برای نیازها، سفر، ساخت‌وساز، کاشت، عروسی و رفتن نزد سلطان؛ روزی مبارک به مشیت خداست.'],
['b', 'نحس مستمر است.'],
['g', 'مختار و صالح برای خرید و فروش، دیدار با سلطان، سفر و صدقه است.'],
['g', 'مختار و خوب است، به‌ویژه برای ازدواج، همه‌ی تجارت‌ها و رفتن نزد سلطان.'],
['b', 'نحس و شوم است.'],
['b', 'بد و مذموم است؛ باید از هر کاری در آن پرهیز کرد.'],
['g', 'برای هر نیازی جز ازدواج و سفر مناسب است؛ در آن صدقه بدهید که از آن بهره‌مند می‌شوید.'],
['g', 'خوب و مختار برای نیازها، هر خواسته‌ای و دیدار با سلطان.'],
['m', 'ممزوج است، یعنی سعد و نحس با هم آمیخته‌اند.'],
['g', 'مختار و خوب برای هر نیازی جز نویسندگی (برای کاتب مکروه است). بیمار زود شفا می‌یابد، مسافر مال زیادی به دست می‌آورد و فراری برمی‌گردد. اگر ضرورتی ندارد، در پی کار تازه نباشید.'],
['g', 'مختار و خوب برای هر چیز و هر نیازی از خرید و فروش، کشاورزی و ازدواج؛ بیمار زود شفا می‌یابد و مولود آن بردبار، مبارک، راستگو و باوفا خواهد بود.']];
const PR = ['لا حول ولا قوة إلا بالله افرج بها كل كربة ،', 'لا حول ولا قوة إلا بالله أحل بها كل عقدة.', 'لا حول ولا قوة إلا بالله أجلو بها كل ظلمة.', 'لا حول ولا قوة إلا بالله أفتح بها كل باب.', 'لا حول ولا قوة إلا بالله أستعين بها على كل شدة ومصيبة.', 'لا حول ولا قوة إلا بالله أستعين بها على كل أمر ينزل بي.', 'لا حول ولا قوة إلا بالله أعتصم بها من كل محذور أحاذره.', 'لا حول ولا قوة إلا بالله أستوجب بها العفو والعافية والرضا من الله.', 'لا حول ولا قوة إلا بالله تفرق أعداء الله وغلبت حجة الله وبقي وجه الله.', 'لا حول ولا قوة إلا بالله ،', 'اللهم رب الارواح الفانية ورب الاجساد البالية ورب الشعور المتمعطة', 'ورب الجلود الممزقة ورب العظام النخرة ورب الساعة القائمة أسألك', 'يا رب أن تصلي على محمد وأهل بيته الطاهرين', 'وافعل بي كذا بخفي لطفك يا ذا الجلال والاكرام آمين آمين يا رب العالمين.'];
const MN = ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی القعده', 'ذی حجه'];
const EV = [
[[1, 'آغاز سال قمری'], [9, 'تاسوعای حسینی (ع)'], [10, 'عاشورای حسینی (ع)'], [12, 'شهادت امام زین العابدین (ع) (سال ۹۵ قمری)'], [18, 'تغییر قبله از بیت المقدس به مکه (سال ۲ قمری)'], [25, 'شهادت امام زین العابدین (ع) به روایتی (سال ۹۵ قمری)']],
[[20, 'اربعین حسینی (ع)'], [28, 'رحلت پیامبر (ص) (سال ۱۱ قمری)، شهادت امام حسن مجتبی (ع) (سال ۵۰ قمری)'], [29, 'شهادت امام رضا (ع) (سال ۲۰۳ قمری)']],
[[1, 'هجرت پیامبر (ص) از مکه به مدینه (مبدا تاریخ هجری قمری)'], [8, 'شهادت امام حسن عسگری (ع) (سال ۲۶۹ قمری)'], [12, 'ولادت پیامبر (ص) به روایت اهل سنت (سال ۵۳ پیش از هجرت)'], [17, 'ولادت پیامبر (ص) به روایت شیعه (سال ۵۳ پیش از هجرت)، ولادت امام صادق (ع) (سال ۸۳ قمری)']],
[[8, 'ولادت امام حسن عسگری (ع) (سال ۲۳۲ قمری)'], [10, 'وفات حضرت معصومه (س) (سال ۲۰۱ قمری)']],
[[5, 'ولادت حضرت زینب (س) (سال ۵ قمری)'], [13, 'شهادت حضرت فاطمه (س) به روایتی (سال ۱۱ هجری)']],
[[3, 'شهادت حضرت فاطمه (س) به روایتی (سال ۱۱ هجری)'], [20, 'ولادت حضرت فاطمه (س) و روز زن (سال ۸ قبل از هجرت)']],
[[1, 'ولادت امام باقر (ع) (سال ۵۷ قمری)'], [3, 'شهادت امام هادی (ع) (سال ۲۵۴ قمری)'], [10, 'ولادت امام جواد (ع) (سال ۱۹۵ قمری)'], [13, 'ولادت امام علی (ع) (سال ۲۳ قبل از هجرت)', 'x'], [15, 'وفات حضرت زینب (س) (سال ۶۲ قمری)'], [25, 'شهادت امام موسی کاظم (ع) (سال ۱۸۳ قمری)'], [27, 'مبعث پیامبر (ص) (سال ۱۳ قبل از هجرت)']],
[[3, 'ولادت امام حسین (ع) (سال ۴ قمری)، روز پاسدار'], [4, 'ولادت حضرت ابوالفضل (ع) (سال ۲۶ قمری)، روز جانباز'], [5, 'ولادت امام زین العابدین (ع) (سال ۳۸ قمری)'], [7, 'ولادت امام علی (ع) بر اساس روایات'], [11, 'ولادت حضرت علی اکبر (ع) (سال ۳۳ قمری)'], [15, 'ولادت حضرت مهدی (عج) (سال ۲۵۵ قمری)']],
[[10, 'وفات حضرت خدیجه (س) (سال ۳ قبل از هجرت)'], [15, 'ولادت امام حسن (ع) (سال ۳ قمری)'], [18, 'شب قدر اول'], [19, 'ضربت خوردن امام علی (ع) (سال ۴۰ قمری)'], [20, 'شب قدر دوم'], [21, 'شهادت امام علی (ع) (سال ۴۰ قمری)'], [22, 'شب قدر سوم']],
[[1, 'عید فطر'], [21, 'فتح اندلس به دست مسلمانان'], [25, 'شهادت امام صادق (ع) (سال ۱۴۸ قمری)']],
[[1, 'ولادت حضرت معصومه (س) (سال ۱۷۳ قمری)'], [11, 'ولادت امام رضا (ع) (سال ۱۴۸ قمری)'], [29, 'شهادت امام جواد (ع) (سال ۲۲۰ قمری)']],
[[7, 'شهادت امام باقر (ع) (سال ۱۱۴ قمری)'], [10, 'عید قربان'], [15, 'ولادت امام هادی (ع) (سال ۲۱۲ قمری)'], [18, 'عید غدیر (سال ۱۰ قمری)']]];

/* ---------- محاسبه ---------- */
function sunWindow(ref, lat, lon){
    const R = [], S = [];
    for(let o = -2; o <= 2; o++){
        const t = new Date(ref + o * 864e5), ev = sunEvents(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), lat, lon);
        if(!ev) return null; R.push(ev[0]); S.push(ev[1]);
    }
    R.sort((a, b) => a - b); S.sort((a, b) => a - b);
    const r0 = R.filter(x => x <= ref).pop(), r1 = R.find(x => x > ref), s = S.find(x => x > r0);
    return { r0, r1, s };
}
const LS = 'niyat-saad-city';
function getCity(){
    let v = null; try{ v = localStorage.getItem(LS); }catch(e){}
    const [co, i] = (v || 'ایران|0').split('|');
    return CT[co] && CT[co][+i] ? { co, i: +i } : { co: 'ایران', i: 0 };
}
function setCity(co, i){ try{ localStorage.setItem(LS, co + '|' + i); }catch(e){} }
const fa = n => Number(n).toLocaleString('fa-IR');
const faT = s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

function compute(){
    const { co, i } = getCity(), c = CT[co][i], [name, lat, lon, tz] = c, ref = Date.now();
    const w = sunWindow(ref, lat, lon);
    if(!w) return { err: true, name };
    const tf = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz });
    const T = x => faT(tf.format(x));
    const kf = new Intl.DateTimeFormat('en-CA', { timeZone: tz }), wf = new Intl.DateTimeFormat('fa', { weekday: 'long', timeZone: tz });
    const wk = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz });
    const fm = (loc, o, t) => { const p = new Intl.DateTimeFormat(loc, { ...o, timeZone: tz }).formatToParts(t), g = k => (p.find(x => x.type === k) || {}).value || ''; return (g('weekday') ? g('weekday') + '، ' : '') + g('day') + ' ' + g('month') + ' ' + g('year'); };
    const lp = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', timeZone: tz }).formatToParts(w.r0);
    const ld = Math.min(30, +lp.find(x => x.type === 'day').value), lm = +lp.find(x => x.type === 'month').value;
    const day = DAYS[ld - 1];
    const dl = (w.s - w.r0) / 12, nl = (w.r1 - w.s) / 12, wi = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wk.format(w.r0));
    const st = CH.indexOf(LORD[wi]), base = kf.format(w.r0);
    const H = []; let cur = -1;
    for(let k = 0; k < 24; k++){
        const a = k < 12 ? w.r0 + k * dl : w.s + (k - 12) * nl, b = k < 12 ? w.r0 + (k + 1) * dl : w.s + (k - 11) * nl, p = CH[(st + k) % 7];
        const on = ref >= a && ref < b; if(on) cur = k;
        H.push({ k, a, b, p, on, f: INFO[p], other: kf.format(a) !== base ? wf.format(a) : '' });
    }
    return {
        dusk: ref >= w.s - DUSK * 6e4 && ref < w.s, name, co, ref, w, T, H, cur, ld, lm, day, wday: wf.format(w.r0),
        shamsi: fm('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, w.r0),
        qamari: fm('fa-IR-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }, w.r0),
        miladi: fm('fa-IR-u-ca-gregory', { day: 'numeric', month: 'long', year: 'numeric' }, w.r0),
        ev: (EV[lm - 1] || [])
    };
}

/* ---------- نما ---------- */
const CSS = `
.sn-bar{display:flex;align-items:center;gap:12px;margin:12px auto 0;max-width:var(--sn-max,980px);padding:10px 14px;border-radius:var(--r,16px);border:1px solid var(--line);background:var(--surface);box-shadow:var(--shadow-1);color:var(--ink);font:inherit;cursor:pointer;text-align:right;width:calc(100% - 32px);box-sizing:border-box}
.sn-bar:hover{border-color:var(--gold-2)}
.sn-bar:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.sn-bar .sn-ico{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:22px;line-height:1;background:var(--surface-2);border:1px solid var(--line-2)}
.sn-bar .sn-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.sn-bar .sn-t1{font-weight:800;font-size:15px;line-height:1.5}
.sn-bar .sn-t2{font-size:12.5px;color:var(--ink-2);line-height:1.6}
.sn-bar .sn-go{flex:none;font-size:12.5px;font-weight:700;color:var(--gold);white-space:nowrap}
.sn-bar.g .sn-ico{background:var(--good-soft);color:var(--good);border-color:transparent}
.sn-bar.m .sn-ico{background:var(--mid-soft);color:var(--mid);border-color:transparent}
.sn-bar.warn{background:var(--bad-soft);border-color:color-mix(in srgb,var(--bad) 45%,transparent)}
.sn-bar.warn .sn-ico{background:var(--bad);color:#fff;border-color:transparent}
.sn-bar.warn .sn-t1{color:var(--bad)}
.sn-bar.warn .sn-go{color:var(--bad)}
.sn-bar .sn-rule{display:block;margin-top:4px;font-weight:800;color:var(--bad)}
.sn-rulec{border-inline-start:4px solid var(--bad);font-size:14px;line-height:1.9;font-weight:700}
.sn-rulec small{display:block;font-weight:500;color:var(--muted);font-size:12px}
.sn-pill{display:inline-block;padding:1px 8px;border-radius:99px;font-size:11.5px;font-weight:700;vertical-align:1px;margin-inline-start:4px}
.sn-pill.g{background:var(--good-soft);color:var(--good)}.sn-pill.b{background:var(--bad-soft);color:var(--bad)}.sn-pill.m{background:var(--mid-soft);color:var(--mid)}
.sn-ov{position:fixed;inset:0;z-index:1000;background:rgba(10,14,24,.5);display:flex;align-items:flex-end;justify-content:center;animation:snf .15s ease}
@media (min-width:720px){.sn-ov{align-items:center;padding:24px}}
@keyframes snf{from{opacity:0}to{opacity:1}}
.sn-sh{background:var(--bg);color:var(--ink);width:100%;max-width:760px;max-height:92vh;overflow:auto;border-radius:20px 20px 0 0;box-shadow:var(--shadow-2);overscroll-behavior:contain}
@media (min-width:720px){.sn-sh{border-radius:20px;max-height:88vh}}
.sn-hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:14px 16px;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.sn-hd h2{margin:0;font-size:17px;font-weight:900;flex:1}
.sn-selw{display:flex;gap:6px}
@media (max-width:560px){.sn-hd{flex-wrap:wrap}.sn-selw{order:3;width:100%}.sn-selw select{flex:1;max-width:none}}
.sn-hd select{font:inherit;font-size:13px;padding:6px 8px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink);max-width:120px}
.sn-x{font:inherit;font-size:20px;line-height:1;width:36px;height:36px;border-radius:10px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.sn-bd{padding:14px 16px 22px;display:flex;flex-direction:column;gap:14px}
.sn-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r,16px);padding:14px;box-shadow:var(--shadow-1)}
.sn-dates{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
@media (max-width:520px){.sn-dates{gap:6px}.sn-dates div{padding:6px 8px}.sn-dates b{font-size:12px}.sn-dates small{font-size:10.5px}}
.sn-dates div{background:var(--surface-2);border:1px solid var(--line-2);border-radius:12px;padding:8px 10px}
.sn-dates small{display:block;color:var(--muted);font-size:11.5px}
.sn-dates b{font-size:13.5px}
.sn-lunar{border-inline-start:4px solid var(--good);}
.sn-lunar.b{border-inline-start-color:var(--bad);background:var(--bad-soft)}
.sn-lunar.m{border-inline-start-color:var(--mid);background:var(--mid-soft)}
.sn-lunar strong{display:block;margin-bottom:4px}
.sn-lunar p{margin:0;font-size:14px;line-height:1.9;color:var(--ink-2)}
.sn-src{margin-top:6px;font-size:11.5px;color:var(--muted)}
.sn-ev ul{margin:6px 0 0;padding-inline-start:18px;font-size:13.5px;line-height:1.9}
.sn-ev li.x{text-decoration:line-through;opacity:.6}
.sn-ev details summary{cursor:pointer;font-weight:700;font-size:13.5px}
.sn-ev li[data-t]{font-weight:800;color:var(--gold)}
.sn-now{display:flex;gap:14px;align-items:center;border-inline-start:4px solid var(--good)}
.sn-now.b{border-inline-start-color:var(--bad);background:var(--bad-soft)}
.sn-now.m{border-inline-start-color:var(--mid);background:var(--mid-soft)}
.sn-now .sn-nt{flex:1;min-width:0}
.sn-now h3{margin:2px 0 4px;font-size:20px;font-weight:900}
.sn-now p{margin:4px 0 0;font-size:13.5px;line-height:1.85;color:var(--ink-2)}
.sn-now small{color:var(--muted)}
.sn-figs{display:flex;gap:8px;flex:none}
.sn-fig{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;color:var(--ink-2)}
.sn-fig svg{fill:currentColor;color:var(--ink)}
.sn-sec h3{margin:0 0 8px;font-size:15px;font-weight:900;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
.sn-sec h3 span{font-size:12px;font-weight:600;color:var(--muted)}
.sn-cnt{display:flex;gap:10px;font-size:12px;color:var(--ink-2);margin-bottom:8px;flex-wrap:wrap}
.sn-cnt i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-inline-end:4px}
.sn-cnt .g i{background:var(--good)}.sn-cnt .b i{background:var(--bad)}.sn-cnt .m i{background:var(--mid)}
.sn-chips{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
@media (max-width:560px){.sn-chips{grid-template-columns:repeat(4,1fr)}}
@media (max-width:380px){.sn-chips{grid-template-columns:repeat(3,1fr)}}
.sn-chip{font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;padding:7px 4px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);min-width:0}
.sn-chip b{font-size:13px}
.sn-chip span{font-size:11px;color:var(--ink-2);direction:ltr}
.sn-chip small{font-size:10px;color:var(--muted)}
.sn-chip.g{background:var(--good-soft);border-color:color-mix(in srgb,var(--good) 30%,transparent)}
.sn-chip.b{background:var(--bad-soft);border-color:color-mix(in srgb,var(--bad) 30%,transparent)}
.sn-chip.m{background:var(--mid-soft);border-color:color-mix(in srgb,var(--mid) 30%,transparent)}
.sn-chip.cur{outline:2.5px solid var(--gold);outline-offset:1px}
.sn-rows{display:flex;flex-direction:column;gap:6px}
.sn-row{display:grid;grid-template-columns:92px 1fr auto;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--surface);border:1px solid var(--line);border-inline-start-width:4px}
.sn-row.g{border-inline-start-color:var(--good)}.sn-row.b{border-inline-start-color:var(--bad)}.sn-row.m{border-inline-start-color:var(--mid)}
.sn-row.cur{box-shadow:0 0 0 2px var(--gold)}
.sn-row .sn-tm{font-size:14px;font-weight:800;color:var(--ink);text-align:right;line-height:1.5}
.sn-row .sn-tm small{display:block;font-size:11.5px;font-weight:600;color:var(--muted)}
.sn-row .sn-tm i{display:block;font-style:normal;font-size:10.5px;color:var(--muted);direction:rtl}
.sn-row .sn-pl b{font-size:14.5px}
.sn-row .sn-ds{font-size:12.5px;color:var(--ink-2);line-height:1.8}
@media (max-width:520px){.sn-row{grid-template-columns:72px 1fr}.sn-row .sn-figs{display:none}}
.sn-div{display:flex;justify-content:space-between;font-size:12.5px;font-weight:800;color:var(--gold);padding:6px 2px 0}
.sn-alert{border-inline-start:4px solid var(--bad);background:var(--bad-soft)}
.sn-alert.m{border-inline-start-color:var(--mid);background:var(--mid-soft)}
.sn-alert h3{margin:0 0 6px;font-size:16px;font-weight:900;color:var(--bad)}
.sn-alert.m h3{color:var(--mid)}
.sn-alert p,.sn-alert li{font-size:13.5px;line-height:1.9;color:var(--ink-2)}
.sn-alert ul{margin:6px 0;padding-inline-start:18px}
.sn-pray{margin-top:10px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.sn-pray .ph{font-size:12px;color:var(--muted);margin-bottom:6px}
.sn-pray .tx{font-size:15px;line-height:2.1;font-family:inherit}
.sn-pray mark{background:var(--gold-soft);color:var(--gold);padding:0 4px;border-radius:4px}
.sn-note{font-size:11.5px;color:var(--muted);line-height:1.9;margin:0}
`;
const figSvg = (c, n) => { let s = '<div class="sn-fig"><svg width="24" height="32" viewBox="0 0 28 36" aria-hidden="true">';
    [...c].forEach((v, i) => { s += v === '1' ? `<circle cx="14" cy="${5 + i * 9}" r="3.2"/>` : `<circle cx="8" cy="${5 + i * 9}" r="3.2"/><circle cx="20" cy="${5 + i * 9}" r="3.2"/>`; });
    return s + `</svg>${n}</div>`; };
const figs = p => '<div class="sn-figs">' + FIG[p].map(f => figSvg(f[1], f[0])).join('') + '</div>';
const RULE = 'اگر در ساعت نحس یا روز نحس، یا هنگام طوفان، زلزله و سیل، یا دم غروب رمل بزنید، فقیر می‌شوید.';
const DUSK = 30;
const KT = { g: 'سعد', b: 'نحس', m: 'میانه' }, DKT = { g: 'روز سعد', b: 'روز نحس', m: 'روز ممزوج' };
const advice = '<ul><li>هنگام بیرون رفتن از خانه صدقه بدهید.</li><li>آیت‌الکرسی و سوره‌های ناس و فلق را بخوانید.</li><li>اگر ناچار به انجام کاری هستید، دعای زیر را بخوانید.</li></ul>';
const prayer = () => `<div class="sn-pray"><div class="ph">این دعا را در زمان ناچاری و اضطرار بخوانید. به جای «کذا» حاجت خود را برای رفع نحسی بیان کنید.</div><div class="tx" dir="rtl" lang="ar">${PR.join('<br>').replace('كذا', '<mark>كذا</mark>')}</div></div>`;

let bar = null, ov = null;
function mins(r, h){ return Math.max(1, Math.ceil((h.b - r.ref) / 6e4)); }
function renderBar(){
    if(!bar) return;
    const r = compute();
    if(r.err){ bar.className = 'sn-bar m'; bar.innerHTML = `<span class="sn-ico">🕰</span><span class="sn-tx"><span class="sn-t1">ساعات کواکب</span><span class="sn-t2">در ${r.name} امروز طلوع و غروب مشخصی ندارد.</span></span><span class="sn-go">ساعات ›</span>`; return; }
    const h = r.H[r.cur] || r.H[0], dk = r.day[0], hk = h.f.k;
    const warnDay = dk === 'b' || dk === 'm', warnHour = hk === 'b';
    let t1, t2, ico;
    if(dk === 'b'){ ico = '⚠️'; t1 = `هشدار: امروز نحس است (روز ${fa(r.ld)} ماه قمری)`; t2 = `${r.day[1]} برای کار مهم صبر کنید.`; }
    else if(r.dusk){ ico = '🌅'; t1 = `هشدار: دم غروب است (غروب ${r.T(r.w.s)})`; t2 = 'تا غروب آفتاب و کمی پس از آن رمل نزنید.'; }
    else if(warnHour){ ico = '⚠️'; t1 = `هشدار: اکنون ساعت ${h.p} است؛ ${h.f.t}`; t2 = `${h.f.s} ${fa(mins(r, h))} دقیقه تا پایان این ساعت.` + (dk === 'm' ? ' امروز هم ممزوج است.' : ''); }
    else if(dk === 'm'){ ico = '⚠️'; t1 = `هشدار: امروز ممزوج است (روز ${fa(r.ld)} ماه قمری)`; t2 = `سعد و نحس آمیخته است. اکنون ساعت ${h.p} (${h.f.t}) است.`; }
    else { ico = ICO[h.p]; t1 = `اکنون ساعت ${h.p}<span class="sn-pill ${hk}">${h.f.t}</span>`; t2 = `تا ${r.T(h.b)} (${fa(mins(r, h))} دقیقه) · روز ${fa(r.ld)} قمری سعد است · ${r.name}`; }
    const warn = warnDay || warnHour || r.dusk;
    if(warn) t2 += `<span class="sn-rule">⛔ ${RULE}</span>`;
    bar.className = 'sn-bar ' + (warn ? 'warn' : hk);
    bar.setAttribute('aria-label', 'ساعات سعد و نحس؛ ' + t1.replace(/<[^>]+>/g, ' '));
    bar.innerHTML = `<span class="sn-ico" aria-hidden="true">${ico}</span><span class="sn-tx"><span class="sn-t1">${t1}</span><span class="sn-t2">${t2}</span></span><span class="sn-go">ساعات ›</span>`;
}
function panelHtml(r){
    const sel = `<select id="snCo" aria-label="کشور">${Object.keys(CT).map(k => `<option${k === r.co ? ' selected' : ''}>${k}</option>`).join('')}</select><select id="snCi" aria-label="شهر">${CT[r.co].map((c, i) => `<option value="${i}"${c[0] === r.name ? ' selected' : ''}>${c[0]}</option>`).join('')}</select>`;
    let b = '';
    if(r.err){ return { sel, body: `<div class="sn-card">در ${r.name} امروز طلوع و غروب مشخصی وجود ندارد.</div>` }; }
    const dk = r.day[0];
    b += `<div class="sn-dates"><div><small>تاریخ شمسی</small><b>${r.shamsi}</b></div><div><small>تاریخ قمری</small><b>${r.qamari}</b></div><div><small>تاریخ میلادی</small><b>${r.miladi}</b></div></div>`;
    b += `<div class="sn-card sn-rulec">⛔ ${RULE}<small>طوفان و زلزله و سیل را خودتان در نظر بگیرید؛ ساعت و روز نحس و دم غروب را این صفحه نشان می‌دهد.</small></div>`;
    if(r.dusk) b += `<div class="sn-card sn-alert"><h3>🌅 دم غروب است</h3><p>غروب آفتاب ساعت ${r.T(r.w.s)} است. تا گذشتن غروب رمل نزنید.</p></div>`;
    b += `<div class="sn-card sn-lunar ${dk}"><strong>روز ${fa(r.ld)} ماه قمری · ${DKT[dk]}</strong><p>${r.day[1]}</p><div class="sn-src">مکارم الاخلاق، فصل اختیارات ایام، از امام صادق (ع). روز کوکبی از طلوع آفتاب شروع می‌شود.</div></div>`;
    const evH = e => `<li${e[2] ? ' class="x"' : ''}${e[0] === r.ld ? ' data-t="1"' : ''}><b>${fa(e[0])}</b> ${e[1]}</li>`;
    const today = r.ev.filter(e => e[0] === r.ld);
    if(r.ev.length) b += `<div class="sn-card sn-ev">${today.length ? `<strong>مناسبت امروز</strong><ul>${today.map(evH).join('')}</ul>` : ''}<details${today.length ? '' : ' open'}><summary>مناسبت‌های ${MN[r.lm - 1]}</summary><ul>${r.ev.map(evH).join('')}</ul></details></div>`;
    if(dk === 'b'){
        b += `<div class="sn-card sn-alert"><h3>امروز کلاً نحس است</h3><p>برای همین ساعت‌ها نمایش داده نمی‌شود. بهتر است کار مهمی شروع نکنید و با احتیاط رفتار کنید.</p>${advice}${prayer()}</div>`;
        return { sel, body: b };
    }
    if(dk === 'm') b += `<div class="sn-card sn-alert m"><h3>هشدار: امروز ممزوج است</h3><p>روز ممزوج یعنی سعد و نحس با هم آمیخته‌اند و گاهی از بدترین نحس هم بدتر است. با احتیاط کارهایتان را انجام دهید.</p>${advice}${prayer()}</div>`;
    if(r.cur >= 0){ const h = r.H[r.cur];
        b += `<div class="sn-card sn-now ${h.f.k}"><div class="sn-nt"><small>اکنون در ${r.name} · ${r.T(r.ref)}</small><h3>${ICO[h.p]} ساعت ${h.p} <span class="sn-pill ${h.f.k}">${h.f.t}</span></h3><p>${h.f.s}</p><p>${h.f.n}</p><p><small>${fa(mins(r, h))} دقیقه تا پایان این ساعت (${r.T(h.b)})</small></p></div>${figs(h.p)}</div>`; }
    const chips = (from, to, title, sub) => { const part = r.H.slice(from, to), n = { g: 0, b: 0, m: 0 }; part.forEach(h => n[h.f.k]++);
        return `<div class="sn-card sn-sec"><h3>${title}<span>${sub}</span></h3><div class="sn-cnt"><span class="g"><i></i>سعد ${fa(n.g)}</span><span class="b"><i></i>نحس ${fa(n.b)}</span><span class="m"><i></i>میانه ${fa(n.m)}</span></div><div class="sn-chips">` +
        part.map(h => `<button type="button" class="sn-chip ${h.f.k}${h.on ? ' cur' : ''}" data-i="${h.k}" aria-label="ساعت ${fa(h.k % 12 + 1)}: ${h.p}، ${h.f.t}"><small>${fa(h.k % 12 + 1)}</small><b>${h.p}</b><span>${r.T(h.a)}</span></button>`).join('') + '</div></div>'; };
    b += chips(0, 12, 'ساعات روز', `طلوع ${r.T(r.w.r0)} · غروب ${r.T(r.w.s)}`);
    b += chips(12, 24, 'ساعات شب', `تا طلوع بعدی ${r.T(r.w.r1)}`);
    let rows = '';
    r.H.forEach(h => {
        if(h.k === 0) rows += `<div class="sn-div"><span>ساعات روز</span><span>${r.wday}</span></div>`;
        if(h.k === 12) rows += `<div class="sn-div"><span>ساعات شب</span><span>غروب ${r.T(r.w.s)}</span></div>`;
        rows += `<div class="sn-row ${h.f.k}${h.on ? ' cur' : ''}" id="snh${h.k}"><div class="sn-tm">${r.T(h.a)}<small>تا ${r.T(h.b)}</small>${h.other ? `<i>${h.other}</i>` : ''}</div><div class="sn-pl"><b>${ICO[h.p]} ${h.p}</b><span class="sn-pill ${h.f.k}">${h.f.t}</span><div class="sn-ds">${h.f.s}</div></div>${figs(h.p)}</div>`;
    });
    b += `<div class="sn-rows">${rows}</div>`;
    b += '<p class="sn-note">ساعات روز و شب هر کدام به ۱۲ قسمت مساوی تقسیم شده‌اند، پس طول ساعت‌ها ثابت نیست. روز کوکبی از طلوع آغاز می‌شود و اولین ساعت آن به کوکب همان روز هفته تعلق دارد. تاریخ قمری بر پایه‌ی تقویم ام‌القری است و ممکن است با رؤیت هلال در ایران یک روز تفاوت داشته باشد. زمان طلوع و غروب محاسبه‌ای است و ممکن است یکی دو دقیقه با تقویم‌های دیگر تفاوت داشته باشد.</p>';
    return { sel, body: b };
}
let lastFocus = null;
function renderPanel(keepScroll){
    if(!ov) return;
    const r = compute(), p = panelHtml(r), sh = ov.querySelector('.sn-sh'), top = sh.scrollTop;
    ov.querySelector('.sn-selw').innerHTML = p.sel;
    ov.querySelector('.sn-bd').innerHTML = p.body;
    if(keepScroll) sh.scrollTop = top;
}
function openPanel(){
    if(ov) return;
    lastFocus = document.activeElement;
    ov = document.createElement('div'); ov.className = 'sn-ov';
    ov.innerHTML = `<div class="sn-sh" role="dialog" aria-modal="true" aria-labelledby="snTitle"><div class="sn-hd"><h2 id="snTitle">ساعات سعد و نحس</h2><span class="sn-selw"></span><button type="button" class="sn-x" aria-label="بستن">×</button></div><div class="sn-bd"></div></div>`;
    document.body.appendChild(ov); document.documentElement.style.overflow = 'hidden';
    renderPanel(false);
    const cur = ov.querySelector('.sn-row.cur'); if(cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 60);
    ov.querySelector('.sn-x').focus();
    ov.addEventListener('click', e => {
        if(e.target === ov || e.target.closest('.sn-x')) return closePanel();
        const c = e.target.closest('.sn-chip'); if(c){ const el = ov.querySelector('#snh' + c.dataset.i); if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    ov.addEventListener('change', e => {
        if(e.target.id === 'snCo'){ setCity(e.target.value, 0); }
        else if(e.target.id === 'snCi'){ setCity(getCity().co, +e.target.value); }
        else return;
        renderPanel(false); renderBar();
    });
    ov.addEventListener('keydown', e => { if(e.key === 'Escape') closePanel(); });
}
function closePanel(){ if(!ov) return; ov.remove(); ov = null; document.documentElement.style.overflow = ''; if(lastFocus && lastFocus.focus) lastFocus.focus(); }

function init(){
    const st = document.createElement('style'); st.id = 'sn-css'; st.textContent = CSS; document.head.appendChild(st);
    const main = document.querySelector('main'); if(!main) return;
    bar = document.createElement('button'); bar.type = 'button'; bar.id = 'snBar'; bar.className = 'sn-bar';
    main.insertBefore(bar, main.firstChild);
    bar.addEventListener('click', openPanel);
    renderBar();
    setInterval(() => { renderBar(); if(ov) renderPanel(true); }, 30000);
    document.addEventListener('visibilitychange', () => { if(!document.hidden) renderBar(); });
}
window.SAAD = { compute, open: openPanel };
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
