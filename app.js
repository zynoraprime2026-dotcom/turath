const CFG = window.TURATH_CONFIG;
function bootErr(msg) {
  const el = document.getElementById('mStats');
  if (el) el.innerHTML = '<span style="color:#e08080">⚠ ' + msg + '</span>';
}
const H = k => ({ 'Content-Type': 'application/json', 'x-api-key': CFG.API_KEY });
const H_ADMIN = () => ({ ...H(), 'x-admin-pass': sessionStorage.getItem('turathAdmin') || '' });

const $ = s => document.querySelector(s);
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const I18N = {
  en: { manuscripts: 'Library', history: 'History', about: 'About', devs: 'Developers', search: 'Search', lang: 'عربي', heroM: 'Islamic Manuscripts Digital Library', heroP: 'Browse a curated archive of historic manuscripts — Quran, Hadith, Fiqh, science, medicine and more — with author, era, script, holding institution, chain of transmission and sources.', heroE: 'Islamic History Timeline', heroEP: 'Key events across 14 centuries — from the revelation era to the modern Islamic world.', found: 'found', page: 'Page', chain: 'Chain of transmission', sources: 'Sources', held: 'Held at', viewCopy: 'View manuscript scan (library website)', readText: 'Download the full text (free)', readNow: 'Read in the library', addM: '+ Add manuscript (admin)', addE: '+ Add event (admin)', century: 'c. AH', noMatchM: 'No manuscripts match your search.', noMatchE: 'No events match your search.', suggest: '✉ Suggest a manuscript', suggHead: 'Suggest a manuscript', suggP: 'Know a manuscript that belongs in this collection? Tell us — our curators review every suggestion.', suggTitle: 'Title *', suggAuthor: 'Author', suggLang: 'Language', suggSubj: 'Subject', suggRegion: 'Region', suggDesc: 'Why it matters / description', suggName: 'Your name (optional)', suggSend: 'Send suggestion', suggThx: 'JazakAllah khayran! Your suggestion was received and will be reviewed.', suggAdmin: '+ Visitor suggestions (admin)', approve: 'Approve & add', reject: 'Reject', del: 'Delete', none: 'No suggestions yet.', cite: 'Copy citation', copied: 'Copied ✓', share: '⇪ Share', shareCopied: 'Link copied ✓', daily: 'Manuscript of the Day', open: 'View', upload: 'Upload image', uploading: 'Uploading…', suggBy: 'Suggested by', pending: 'pending', stories: 'Stories', quranFrom: 'From the Quran', sunnahFrom: 'From the Sunnah', verses: 'verses', hadiths: 'hadith', ayahRef: 'Quran', grade: 'Grade' },
  ar: { manuscripts: 'المكتبة', history: 'التاريخ', about: 'عن المشروع', devs: 'للمطورين', search: 'بحث', lang: 'English', heroM: 'المكتبة الرقمية للمخطوطات الإسلامية', heroP: 'تصفح مجموعة منتقاة من المخطوطات التاريخية — القرآن والحديث والفقه والعلوم والطب — مع المؤلف والعصر والخط وجهة الحفظ وسند النقل والمصادر.', heroE: 'الخط الزمني للتاريخ الإسلامي', heroEP: 'أحداث رئيسية عبر أربعة عشر قرنا — من عصر النبوة إلى العالم الإسلامي الحديث.', found: 'نتيجة', page: 'صفحة', chain: 'سند النقل', sources: 'المصادر', held: 'محفوظ في', viewCopy: 'عرض المخطوط على موقع المكتبة', readText: 'تنزيل النص الكامل (مجانا)', readNow: 'اقرأ في المكتبة', addM: '+ إضافة مخطوط (مشرف)', addE: '+ إضافة حدث (مشرف)', century: 'هـ', noMatchM: 'لا توجد مخطوطات مطابقة لبحثك.', noMatchE: 'لا توجد أحداث مطابقة لبحثك.', suggest: '✉ اقترح مخطوطا', suggHead: 'اقترح مخطوطا', suggP: 'تعرف مخطوطا يستحق أن يكون في هذه المجموعة؟ أخبرنا — يراجع المشرفون كل اقتراح.', suggTitle: 'العنوان *', suggAuthor: 'المؤلف', suggLang: 'اللغة', suggSubj: 'الموضوع', suggRegion: 'المنطقة', suggDesc: 'لماذا يهم / الوصف', suggName: 'اسمك (اختياري)', suggSend: 'إرسال الاقتراح', suggThx: 'جزاك الله خيرا! وصل اقتراحك وسيتم مراجعته.', suggAdmin: '+ اقتراحات الزوار (مشرف)', approve: 'موافقة وإضافة', reject: 'رفض', del: 'حذف', none: 'لا توجد اقتراحات بعد.', cite: 'نسخ الاقتباس', copied: 'تم النسخ ✓', share: '⇪ مشاركة', shareCopied: 'تم نسخ الرابط ✓', daily: 'مخطوط اليوم', open: 'عرض', upload: 'رفع صورة', uploading: 'جارٍ الرفع…', suggBy: 'اقترحه', pending: 'قيد المراجعة', stories: 'القصص', quranFrom: 'من القرآن', sunnahFrom: 'من السنة', verses: 'آيات', hadiths: 'أحاديث', ayahRef: 'قرآن', grade: 'الدرجة' }};
let LANG = localStorage.getItem('turathLang') || 'en';
const T = k => I18N[LANG][k];
function applyLang() {
  document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = LANG;
  $('#langBtn').textContent = T('lang');
  document.querySelector('[data-tab="manuscripts"]').textContent = T('manuscripts');
  document.querySelector('[data-tab="events"]').textContent = T('history');
  document.querySelector('[data-tab="about"]').textContent = T('about');
  document.querySelector('[data-tab="devs"]').textContent = T('devs');
  document.querySelector('[data-tab="stories"]').textContent = T('stories');
  $('#tab-manuscripts h1').textContent = T('heroM');
  $('#tab-manuscripts .hero p').textContent = T('heroP');
  $('#tab-events h1').textContent = T('heroE');
  $('#tab-events .hero p').textContent = T('heroEP');
  $('#mSearchBtn').textContent = T('search');
  $('#eSearchBtn').textContent = T('search');
  $('#suggestBtn').textContent = T('suggest');
  $('#suggBox summary').textContent = T('suggAdmin');
  $('#mSearch').placeholder = LANG === 'ar' ? 'ابحث في العنوان أو المؤلف أو الوصف…' : 'Search title, author, description…';
  $('#eSearch').placeholder = LANG === 'ar' ? 'ابحث في الأحداث…' : 'Search events…';
  if (mState.data) renderM(mState.data);
  if (eState.data) renderE(eState.data);
}
$('#langBtn').addEventListener('click', () => { LANG = LANG === 'en' ? 'ar' : 'en'; localStorage.setItem('turathLang', LANG); applyLang(); });

let mState = { page: 1, data: null };
let eState = { page: 1, data: null };

// ---------- tabs ----------
document.querySelectorAll('nav [data-tab]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('nav [data-tab]').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  $('#tab-' + b.dataset.tab).classList.add('active');
}));

// ---------- admin mode ----------
$('#adminBtn').addEventListener('click', () => {
  const cur = sessionStorage.getItem('turathAdmin');
  const pass = prompt(cur ? 'Admin mode is ON. Leave empty to turn off, or enter the admin passcode:' : 'Enter the admin passcode:', cur || '');
  if (pass === null) return;
  if (pass === '') { sessionStorage.removeItem('turathAdmin'); }
  else sessionStorage.setItem('turathAdmin', pass);
  applyAdmin();
});
function applyAdmin() {
  const on = !!sessionStorage.getItem('turathAdmin');
  $('#mForm').style.display = on ? 'block' : 'none';
  $('#eForm').style.display = on ? 'block' : 'none';
  $('#suggBox').style.display = on ? 'block' : 'none';
  document.querySelectorAll('.delBtn').forEach(b => b.style.display = on ? 'inline-block' : 'none');
  if (on) loadSugg();
}

// ---------- visitor suggestions ----------
async function loadSugg() {
  if (!sessionStorage.getItem('turathAdmin')) return;
  const r = await fetch(`${CFG.API_BASE}/api/suggestions`, { headers: H_ADMIN() });
  const d = await r.json();
  if (!r.ok) return;
  const list = (d.suggestions || []);
  $('#suggBox summary').textContent = `${T('suggAdmin').replace('+ ','+ ')} (${list.filter(x => x.status === 'pending').length} ${T('pending')})`;
  $('#suggList').innerHTML = list.length ? list.map(x => `
    <div class="sugg ${x.status}" style="margin:12px 0;padding:12px;border:1px solid #3a4a3a;border-radius:10px">
      <b>${esc(x.title)}</b> ${x.author ? '· ' + esc(x.author) : ''} <span class="chip">${x.status}</span>
      ${x.submitter ? `<div class="small">${T('suggBy')}: ${esc(x.submitter)}</div>` : ''}
      ${[x.language, x.subject, x.region].filter(Boolean).map(v => `<span class="chip">${esc(v)}</span>`).join('')}
      ${x.description ? `<p class="small">${esc(x.description)}</p>` : ''}
      ${x.status === 'pending' ? `<button class="primary" onclick="suggAct(${x.id},'approved')">${T('approve')}</button>
      <button class="ghost" onclick="suggAct(${x.id},'rejected')">${T('reject')}</button>` : ''}
      <button class="ghost" onclick="suggAct(${x.id},'delete')">${T('del')}</button>
    </div>`).join('') : `<p class="small">${T('none')}</p>`;
}
window.suggAct = async (id, action) => {
  const opts = action === 'delete'
    ? { method: 'DELETE', headers: H_ADMIN() }
    : { method: 'PUT', headers: H_ADMIN(), body: JSON.stringify({ status: action }) };
  const r = await fetch(`${CFG.API_BASE}/api/suggestions?id=${id}`, opts);
  if (r.ok) { loadSugg(); loadM(); }
};
window.openSuggest = () => {
  $('#modalContent').innerHTML = `
    <div class="detail">
      <h2>${T('suggHead')}</h2>
      <p class="small">${T('suggP')}</p>
      <form id="suggForm" onsubmit="return submitSugg(event)">
        <input name="title" placeholder="${T('suggTitle')}" required maxlength="200">
        <input name="author" placeholder="${T('suggAuthor')}" maxlength="200">
        <input name="language" placeholder="${T('suggLang')}">
        <input name="subject" placeholder="${T('suggSubj')}">
        <input name="region" placeholder="${T('suggRegion')}">
        <input name="submitter" placeholder="${T('suggName')}" maxlength="100">
        <textarea name="description" rows="3" placeholder="${T('suggDesc')}"></textarea>
        <button class="primary" type="submit">${T('suggSend')}</button>
        <span class="formMsg"></span>
      </form>
    </div>`;
  $('#modal').hidden = false;
  if (curM) history.replaceState(null, '', '#m/' + curM.id);
};
window.submitSugg = async e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = {}; f.forEach((v, k) => body[k] = v);
  const r = await fetch(`${CFG.API_BASE}/api/suggestions`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
  const d = await r.json();
  e.target.querySelector('.formMsg').textContent = r.ok ? T('suggThx') : (d.error || 'Error');
  if (r.ok) e.target.reset();
  return false;
};
$('#suggestBtn').addEventListener('click', openSuggest);

// ---------- manuscripts ----------
async function loadM() {
  const q = $('#mSearch').value.trim();
  const url = `${CFG.API_BASE}/api/manuscripts?q=${encodeURIComponent(q)}&language=${encodeURIComponent($('#mLanguage').value)}&subject=${encodeURIComponent($('#mSubject').value)}&region=${encodeURIComponent($('#mRegion').value)}&page=${mState.page}`;
  let d;
  try {
    const r = await fetch(url, { headers: H() });
    d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || ('HTTP ' + r.status));
  } catch (e) {
    $('#mStats').innerHTML = `<span style="color:#e08080">⚠ ${esc(e.message || 'API unreachable')} — ${LANG === 'ar' ? 'اضغط بحث للمحاولة مجددا' : 'tap Search to retry'}</span>`;
    return;
  }
  mState.data = d;
  renderM(d);
}
function renderM(d) {
  $('#mStats').textContent = `${d.total} ${LANG === 'ar' ? 'نتيجة' : 'manuscripts found'} — ${T('page')} ${d.page}`;
  $('#mGrid').innerHTML = d.manuscripts.map(m => `
    <div class="card" onclick="showM(${m.id})">
      <div class="thumb">${m.imageUrl ? `<img src="${esc(m.imageUrl)}" alt="" loading="lazy">` : '📜'}</div>
      <div class="cbody">
        <h3>${esc(LANG === 'ar' && m.titleAr ? m.titleAr : m.title)}</h3>
        ${m.titleAr && LANG !== 'ar' ? `<div class="arTitle">${esc(m.titleAr)}</div>` : ''}
        <div class="meta">${esc(m.author || 'Unknown')}${m.century ? ' · ' + m.century + ' ' + (LANG === 'ar' ? 'هـ' : 'th c. AH') : ''}</div>
        <div class="desc">${esc(LANG === 'ar' && m.descriptionAr ? m.descriptionAr : m.description)}</div>
        <div>${['language','subject','region'].filter(f => m[f]).map(f => `<span class="chip">${esc(m[f])}</span>`).join('')}</div>
      </div>
    </div>`).join('') || T('noMatchM');
  $('#mPage').textContent = `Page ${d.page} of ${Math.max(1, Math.ceil(d.total / d.per))}`;
  $('#mPrev').disabled = d.page <= 1;
  $('#mNext').disabled = d.page * d.per >= d.total;
  // facets
  for (const [sel, facet] of [['#mLanguage','languages'],['#mSubject','subjects'],['#mRegion','regions']]) {
    const el = $(sel); const cur = el.value;
    const first = el.options[0].textContent;
    el.innerHTML = `<option value="">${first}</option>` + (d.facets[facet] || []).map(f => `<option value="${esc(f.language || f.subject || f.region)}">${esc(f.language || f.subject || f.region)} (${f.n})</option>`).join('');
    el.value = cur;
  }
  applyAdmin();
}
let curM = null;
function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#5a1f1f;color:#f3d9d9;padding:10px 18px;border-radius:10px;z-index:99;font-size:.9rem;max-width:85vw;text-align:center';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}
async function showM(id) {
  let d;
  try {
    const r = await fetch(`${CFG.API_BASE}/api/manuscripts/${id}`, { headers: H() });
    d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || ('HTTP ' + r.status));
    renderDetail(d.manuscript);
  } catch (e) { toast('⚠ ' + (e.message || 'API unreachable')); console.error('showM failed:', e); }
}
async function randomM() {
  const r = await fetch(`${CFG.API_BASE}/api/manuscripts/random`, { headers: H() });
  if (!r.ok) { alert('No manuscripts available'); return; }
  const d = await r.json();
  renderDetail(d.manuscript);
}
$('#randomBtn').addEventListener('click', randomM);
window.copyCitation = () => {
  const m = curM; if (!m) return;
  const bits = [m.author || 'Unknown author', `${m.title}${m.titleAr ? ' [' + m.titleAr + ']' : ''}.`];
  if (m.date_written) bits.push(m.date_written + '.');
  if (m.language) bits.push(`${m.language}${m.script ? ', written in ' + m.script : ''}.`);
  if (m.holding) bits.push(`Held at: ${m.holding}.`);
  bits.push(`Turath — Islamic Manuscripts Database, https://turath-green.vercel.app (accessed ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).`);
  const cite = bits.join(' ');
  const done = ok => { const b = $('#citeBtn'); if (b) { b.textContent = ok ? T('copied') : T('cite'); setTimeout(() => { if ($('#citeBtn')) $('#citeBtn').textContent = T('cite'); }, 2000); } };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(cite).then(() => done(true)).catch(() => fallbackCopy(cite, done));
  else fallbackCopy(cite, done);
};
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(true); } catch (e) { done(false); }
  document.body.removeChild(ta);
}
window.uploadImg = async input => {
  const file = input.files && input.files[0]; if (!file) return;
  const m = curM; if (!m) return;
  const btn = $('#mImgUploadBtn'); if (btn) btn.textContent = T('uploading');
  const fd = new FormData(); fd.append('image', file);
  const r = await fetch(`${CFG.API_BASE}/api/manuscripts/${m.id}/image`, { method: 'POST', headers: { 'x-api-key': CFG.API_KEY, 'x-admin-pass': sessionStorage.getItem('turathAdmin') || '' }, body: fd });
  const d = await r.json();
  if (r.ok) { showM(m.id); loadM(); } else { if (btn) btn.textContent = d.error || 'Error'; }
};
function renderDetail(m) {
  curM = m;
  const chain = Array.isArray(m.chain) ? m.chain : [];
  $('#modalContent').innerHTML = `
    <div class="detail">
      ${m.imageUrl ? `<img class="heroImg" src="${esc(m.imageUrl)}" alt="">` : ''}
      <h2>${esc(m.title)}</h2>
      ${m.titleAr ? `<div class="arTitle big">${esc(m.titleAr)}</div>` : ''}
      <div class="meta">${esc(m.author || 'Unknown author')}${m.date_written ? ' · ' + esc(m.date_written) : ''}</div>
      ${m.description ? `<p>${esc(m.description)}</p>` : ''}
      ${m.descriptionAr ? `<p dir="rtl" class="arText">${esc(m.descriptionAr)}</p>` : ''}
      ${chain.length ? `<h3>${T('chain')}</h3><ol class="chain">${chain.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}
      <p>${[['Language', m.language], ['Script', m.script], ['Subject', m.subject], ['Region', m.region], ['Century (AH)', m.century], [T('held'), m.holding]].filter(([,v]) => v).map(([k,v]) => `<span class="chip"><b>${k}:</b> ${esc(v)}</span>`).join('')}</p>
      ${m.sources ? `<h3>${T('sources')}</h3><p class="sources">${esc(m.sources)}</p>` : ''}
      ${(m.digitalUrl || m.digital_url) ? `<p><a href="${esc(m.digitalUrl || m.digital_url)}" target="_blank" rel="noopener">${T('viewCopy')} →</a></p>` : ''}
      ${(m.readUrl || m.read_url) ? `<p><button class="ghost" id="readBtn" onclick="openReader(this)" data-url="${esc(m.readUrl || m.read_url)}">📖 ${T('readNow')}</button> <a href="${esc(m.readUrl || m.read_url)}" target="_blank" rel="noopener">${T('readText')} ↗</a></p><div id="readerBox" hidden></div>` : ''}
      <div class="modalActions">
        <button id="citeBtn" class="ghost" onclick="copyCitation()">${T('cite')}</button>
        <button id="shareBtn" class="ghost" onclick="shareM()">${T('share')}</button>
        ${sessionStorage.getItem('turathAdmin') ? `<span><input type="file" id="mImgInput" accept="image/jpeg,image/png,image/webp" onchange="uploadImg(this)" style="display:none">
        <button id="mImgUploadBtn" class="ghost" onclick="document.getElementById('mImgInput').click()">⬆ ${T('upload')}</button></span>` : ''}
      </div>
    </div>`;
  $('#modal').hidden = false;
}
function openReader(btn){
  const box = document.getElementById('readerBox');
  if (!box.hidden) { box.hidden = true; return; }
  const idm = (btn.dataset.url || '').match(/archive\.org\/details\/([^\/?#]+)/);
  if (!idm) { window.open(btn.dataset.url, '_blank'); return; }
  box.hidden = false;
  box.innerHTML = `<iframe class="reader" src="https://archive.org/embed/${idm[1]}" allowfullscreen loading="lazy"></iframe>`;
}
$('#mSearchBtn').addEventListener('click', () => { mState.page = 1; loadM(); });
$('#mSearch').addEventListener('keydown', e => { if (e.key === 'Enter') { mState.page = 1; loadM(); } });
$('#mLanguage').addEventListener('change', () => { mState.page = 1; loadM(); });
$('#mSubject').addEventListener('change', () => { mState.page = 1; loadM(); });
$('#mRegion').addEventListener('change', () => { mState.page = 1; loadM(); });
$('#mPrev').addEventListener('click', () => { if (mState.page > 1) { mState.page--; loadM(); } });
$('#mNext').addEventListener('click', () => { mState.page++; loadM(); });

$('#mAdd').addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = {}; f.forEach((v, k) => body[k] = v);
  const r = await fetch(`${CFG.API_BASE}/api/manuscripts`, { method: 'POST', headers: H_ADMIN(), body: JSON.stringify(body) });
  const d = await r.json();
  e.target.querySelector('.formMsg').textContent = r.ok ? 'Saved ✓' : (d.error || 'Error');
  if (r.ok) { e.target.reset(); loadM(); }
});

// ---------- events ----------
async function loadE() {
  const q = $('#eSearch').value.trim();
  const url = `${CFG.API_BASE}/api/events?q=${encodeURIComponent(q)}&category=${encodeURIComponent($('#eCategory').value)}&region=${encodeURIComponent($('#eRegion').value)}&page=${eState.page}`;
  let d;
  try {
    const r = await fetch(url, { headers: H() });
    d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || ('HTTP ' + r.status));
  } catch (e) { $('#eStats').innerHTML = `<span style="color:#e08080">⚠ ${esc(e.message || 'API unreachable')}</span>`; return; }
  eState.data = d;
  renderE(d);
}
function renderE(d) {
  $('#eStats').textContent = `${d.total} event${d.total === 1 ? '' : 's'} — page ${d.page}`;
  let lastC = null;
  $('#eList').innerHTML = d.events.map(ev => {
    const c = ev.year_hijri ? Math.floor((ev.year_hijri - 1) / 100) + 1 : null;
    let divider = '';
    if (c && c !== lastC && d.page === 1) {
      lastC = c;
      const suf = (c % 100 % 10 === 1 && c % 100 !== 11) ? 'st' : (c % 100 % 10 === 2 && c % 100 !== 12) ? 'nd' : (c % 100 % 10 === 3 && c % 100 !== 13) ? 'rd' : 'th';
      divider = `<div class="cdiv">— ${c}${suf} century AH —</div>`;
    }
    return divider + `
    <div class="tevent">
      <span class="year">${ev.year_gregorian ? ev.year_gregorian + ' CE' : ''}${ev.year_hijri ? ' / ' + ev.year_hijri + ' AH' : ''}</span>
      <h3><a class="evTitle" href="/e/${ev.id}" target="_blank" rel="noopener">${esc(LANG === 'ar' && ev.titleAr ? ev.titleAr : ev.title)}</a></h3>
      <p>${esc(LANG === 'en' || !ev.descriptionAr ? ev.description : ev.descriptionAr)}</p>
      ${ev.titleAr && LANG !== 'ar' ? `<div class="arTitle">${esc(ev.titleAr)}</div>` : ''}
      ${ev.sources ? `<div class="srcLine">📚 ${esc(ev.sources)}</div>` : ''}
      <div>${[ev.category, ev.region].filter(Boolean).map(v => `<span class="chip">${esc(v)}</span>`).join('')} <button class="chip shareChip" onclick="shareEvent(${ev.id})" title="Share">⇪</button></div>
      <div><a class="evPageLink" href="/e/${ev.id}" target="_blank" rel="noopener">🔗 Share page</a> ${ev.source_url ? `· <a href="${esc(ev.source_url)}" target="_blank" rel="noopener">Source →</a>` : ''}</div>
    </div>`;}).join('') || T('noMatchE');
  $('#ePage').textContent = `Page ${d.page} of ${Math.max(1, Math.ceil(d.total / d.per))}`;
  $('#ePrev').disabled = d.page <= 1;
  $('#eNext').disabled = d.page * d.per >= d.total;
  for (const [sel, facet] of [['#eCategory','categories'],['#eRegion','regions']]) {
    const el = $(sel); const cur = el.value;
    const first = el.options[0].textContent;
    el.innerHTML = `<option value="">${first}</option>` + (d.facets[facet] || []).map(f => `<option value="${esc(f.category || f.region)}">${esc(f.category || f.region)} (${f.n})</option>`).join('');
    el.value = cur;
  }
}
$('#eSearchBtn').addEventListener('click', () => { eState.page = 1; loadE(); });
$('#eSearch').addEventListener('keydown', e => { if (e.key === 'Enter') { eState.page = 1; loadE(); } });
$('#eCategory').addEventListener('change', () => { eState.page = 1; loadE(); });
$('#eRegion').addEventListener('change', () => { eState.page = 1; loadE(); });
$('#ePrev').addEventListener('click', () => { if (eState.page > 1) { eState.page--; loadE(); } });
$('#eNext').addEventListener('click', () => { eState.page++; loadE(); });

$('#eAdd').addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = {}; f.forEach((v, k) => body[k] = v);
  const r = await fetch(`${CFG.API_BASE}/api/events`, { method: 'POST', headers: H_ADMIN(), body: JSON.stringify(body) });
  const d = await r.json();
  e.target.querySelector('.formMsg').textContent = r.ok ? 'Saved ✓' : (d.error || 'Error');
  if (r.ok) { e.target.reset(); loadE(); }
});

// ---------- modal ----------
$('#modalClose').addEventListener('click', () => $('#modal').hidden = true);
$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) $('#modal').hidden = true; });

// ---------- share & deep links ----------
window.shareM = () => {
  const m = curM; if (!m) return;
  const url = `https://turath-green.vercel.app/#m/${m.id}`;
  const t = LANG === 'ar' && m.titleAr ? m.titleAr : m.title;
  const d = LANG === 'ar' && m.descriptionAr ? m.descriptionAr : (m.description || '');
  const who = [m.author || '', m.date_written || ''].filter(Boolean).join(' · ');
  const text = `${t}\n${m.titleAr && t !== m.titleAr ? m.titleAr + '\n' : ''}${who}\n${d.slice(0, 400)}${d.length > 400 ? '…' : ''}\n\nRead it in Turath → ${url}`;
  const done = ok => { const b = $('#shareBtn'); if (b) { b.textContent = ok ? T('shareCopied') : T('share'); setTimeout(() => { if ($('#shareBtn')) $('#shareBtn').textContent = T('share'); }, 2000); } };
  const viaHash = () => { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true)).catch(() => fallbackCopy(text, done)); else fallbackCopy(text, done); };
  if (navigator.share) navigator.share({ title: m.title, text, url }).then(() => done(true)).catch(() => viaHash());
  else viaHash();
};
const clearHash = () => { if (location.hash.startsWith('#m/')) history.replaceState(null, '', location.pathname); };
$('#modalClose').addEventListener('click', clearHash);

// ---------- manuscript of the day ----------
async function loadDaily() {
  try {
    const r = await fetch(`${CFG.API_BASE}/api/manuscripts/daily`, { headers: H() });
    if (!r.ok) return;
    const d = await r.json();
    const m = d.manuscript;
    const box = $('#dailyBox'); if (!box) return;
    box.innerHTML = `
      <div class="dailyHead">✦ ${T('daily')}</div>
      <div class="dailyBody" onclick="showM(${m.id})">
        <div class="dailyMain">
          <h3>${esc(LANG === 'ar' && m.titleAr ? m.titleAr : m.title)}</h3>
          <p>${esc((LANG === 'ar' && m.descriptionAr ? m.descriptionAr : m.description || '').slice(0, 160))}${(m.description || '').length > 160 ? '…' : ''}</p>
          <div class="dailyMeta">${esc(m.author || 'Unknown author')}${m.century ? ' · ' + m.century + ' ' + (LANG === 'ar' ? 'هـ' : 'th c. AH') : ''}</div>
        </div>
        ${m.imageUrl ? `<img class="dailyImg" src="${esc(m.imageUrl)}" alt="" loading="lazy">` : '<div class="dailyImg dailyEmoji">📜</div>'}
      </div>`;
    box.hidden = false;
  } catch (e) { /* daily card is decorative — never block the page */ }
}

// ---------- event share ----------
window.shareEvent = async id => {
  const url = `https://turath-green.vercel.app/e/${id}`;
  const done = ok => { toast(ok ? T('shareCopied') : (T('share') + '?')); };
  let text = `Turath — Islamic history\n${url}`;
  try {
    const r = await fetch(`${CFG.API_BASE}/api/events/${id}`, { headers: H() });
    if (r.ok) {
      const e = (await r.json()).event;
      const t = LANG === 'ar' && e.titleAr ? e.titleAr : e.title;
      const d = LANG === 'ar' && e.descriptionAr ? e.descriptionAr : (e.description || '');
      const when = [e.yearGregorian ? e.yearGregorian + ' CE' : '', e.yearHijri ? e.yearHijri + ' AH' : ''].filter(Boolean).join(' / ');
      text = `${t}\n${when}\n${d.slice(0, 400)}${d.length > 400 ? '…' : ''}\n\n${url}`;
    }
  } catch (err) { /* fall back to plain link text */ }
  const viaHash = () => { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true)).catch(() => fallbackCopy(text, done)); else fallbackCopy(text, done); };
  if (navigator.share) navigator.share({ title: 'Turath — Islamic history', text, url }).then(() => done(true)).catch(() => viaHash());
  else viaHash();
};

// ---------- init ----------
if (!CFG || !CFG.API_BASE || !CFG.API_KEY) { bootErr('Config missing — API not reachable. Reload the page.'); }
applyAdmin();
applyLang();
loadM();
loadE();
loadDaily();
// deep link: #m/<id> opens that manuscript
const deep = location.hash.match(/^#m\/(\d+)$/);
if (deep) showM(parseInt(deep[1]));


// ---------- prophetic stories (Qasas) — powered by the Ilm API ----------
const qasasState = { parts: null, index: null, part: 'beginning', loaded: false };

async function loadQasas() {
  if (qasasState.loaded) { renderQasas(); return; }
  $('#qasasStats').textContent = LANG === 'ar' ? 'جارٍ التحميل…' : 'Loading…';
  try {
    const res = await fetch(CFG.ILM_API_BASE + '/v1/stories', { headers: { 'x-api-key': CFG.ILM_API_KEY } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'load failed');
    qasasState.parts = data.parts;
    qasasState.index = data.stories;
    qasasState.loaded = true;
    renderQasas();
  } catch (e) {
    $('#qasasStats').textContent = (LANG === 'ar' ? 'تعذر تحميل القصص: ' : 'Could not load stories: ') + e.message;
  }
}

function renderQasas() {
  const parts = qasasState.parts, idx = qasasState.index;
  $('#qasasParts').innerHTML = parts.map(p =>
    `<button class="qchip${p.id === qasasState.part ? ' on' : ''}" data-part="${p.id}">
       <span class="qchip-ar">${p.name_arabic}</span>${LANG === 'ar' ? '' : esc(p.name_english)}
     </button>`).join('');
  document.querySelectorAll('#qasasParts .qchip').forEach(b =>
    b.addEventListener('click', () => { qasasState.part = b.dataset.part; renderQasas(); }));
  const list = idx.filter(s => s.part === qasasState.part).sort((x, y) => x.order - y.order);
  const partMeta = parts.find(p => p.id === qasasState.part);
  $('#qasasStats').textContent = `${list.length} ${LANG === 'ar' ? 'مدخل' : 'entries'} — ${LANG === 'ar' ? esc(partMeta.name_english) + ' · ' + partMeta.name_arabic : esc(partMeta.name_english) + ' · ' + partMeta.name_arabic}`;
  $('#qasasList').innerHTML = list.map(s => `
    <div class="tevent qstory" data-id="${s.id}" style="cursor:pointer">
      <span class="qorder">${String(s.order).padStart(2, '0')}</span>
      <h3>${esc(s.name_english)} <span class="arTitle" style="display:inline;margin-inline-start:8px">${s.name_arabic}</span></h3>
      <div class="qera">${esc(s.title_english)}</div>
      <div class="qmeta">${esc(s.era)} · ${s.ayah_count} ${T('verses')} · ${s.hadith_count} ${T('hadiths')}</div>
    </div>`).join('');
  document.querySelectorAll('#qasasList .qstory').forEach(el =>
    el.addEventListener('click', () => showStory(el.dataset.id)));
}

async function showStory(id) {
  $('#modalContent').innerHTML = '<p style="color:var(--mut)">…</p>';
  $('#modal').hidden = false;
  try {
    const res = await fetch(CFG.ILM_API_BASE + '/v1/stories/' + encodeURIComponent(id), { headers: { 'x-api-key': CFG.ILM_API_KEY } });
    const s = await res.json();
    if (!res.ok) throw new Error(s.error || 'load failed');
    const partName = (qasasState.parts || []).find(p => p.id === s.part);
    $('#modalContent').innerHTML = `
      <div class="detail">
        <h2 style="text-align:center">${s.name_arabic}</h2>
        <div style="text-align:center;color:var(--gold);font-weight:600">${esc(s.name_english)}</div>
        <div style="text-align:center;color:var(--mut);font-size:.9rem;margin-top:2px">${esc(s.title_english)}</div>
        <p style="text-align:center;margin-top:8px"><span class="chip">${esc(s.era)}</span>${partName ? `<span class="chip">${esc(partName.name_english)}</span>` : ''}</p>
        ${s.summary.map(p => `<p>${esc(p)}</p>`).join('')}
        ${s.ayat.length ? `<h3>${T('quranFrom')} · القرآن</h3>
          ${s.ayat.map(a => `
            <div class="qayah">
              <span class="qref">${esc(a.reference)}</span>
              <div class="arText">${a.text_arabic}</div>
              <div class="qtr">${esc(a.translation)}</div>
            </div>`).join('')}` : ''}
        ${s.hadith.length ? `<h3>${T('sunnahFrom')} · السنة</h3>
          ${s.hadith.map(h => `
            <div class="qayah">
              <div class="chipline"><span class="chip">${esc(h.source)}</span>${h.grade ? `<span class="chip">${T('grade')}: ${esc(h.grade)}</span>` : ''}</div>
              <div class="qtr">${esc(h.text_english)}</div>
              ${h.text_arabic ? `<div class="arText">${h.text_arabic}</div>` : ''}
            </div>`).join('')}` : ''}
      </div>`;
  } catch (e) {
    $('#modalContent').innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
  }
}

// lazy-load the first time the Stories tab is opened
document.querySelector('[data-tab="stories"]').addEventListener('click', loadQasas);
