const CFG = window.TURATH_CONFIG;
const H = k => ({ 'Content-Type': 'application/json', 'x-api-key': CFG.API_KEY });
const H_ADMIN = () => ({ ...H(), 'x-admin-pass': sessionStorage.getItem('turathAdmin') || '' });

const $ = s => document.querySelector(s);
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
  document.querySelectorAll('.delBtn').forEach(b => b.style.display = on ? 'inline-block' : 'none');
}

// ---------- manuscripts ----------
async function loadM() {
  const q = $('#mSearch').value.trim();
  const url = `${CFG.API_BASE}/api/manuscripts?q=${encodeURIComponent(q)}&language=${encodeURIComponent($('#mLanguage').value)}&subject=${encodeURIComponent($('#mSubject').value)}&region=${encodeURIComponent($('#mRegion').value)}&page=${mState.page}`;
  const r = await fetch(url, { headers: H() });
  const d = await r.json();
  mState.data = d;
  renderM(d);
}
function renderM(d) {
  $('#mStats').textContent = `${d.total} manuscript${d.total === 1 ? '' : 's'} found — page ${d.page}`;
  $('#mGrid').innerHTML = d.manuscripts.map(m => `
    <div class="card" onclick="showM(${m.id})">
      <div class="thumb">${m.imageUrl ? `<img src="${esc(m.imageUrl)}" alt="" loading="lazy">` : '📜'}</div>
      <div class="cbody">
        <h3>${esc(m.title)}</h3>
        <div class="meta">${esc(m.author || 'Unknown')}${m.century ? ' · ' + m.century + 'th c. AH' : ''}</div>
        <div class="desc">${esc(m.description)}</div>
        <div>${['language','subject','region'].filter(f => m[f]).map(f => `<span class="chip">${esc(m[f])}</span>`).join('')}</div>
      </div>
    </div>`).join('') || '<p class="statline">No manuscripts match your search.</p>';
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
async function showM(id) {
  const r = await fetch(`${CFG.API_BASE}/api/manuscripts/${id}`, { headers: H() });
  const d = await r.json();
  const m = d.manuscript;
  $('#modalContent').innerHTML = `
    <div class="detail">
      ${m.imageUrl ? `<img class="heroImg" src="${esc(m.imageUrl)}" alt="">` : ''}
      <h2>${esc(m.title)}</h2>
      <div class="meta">${esc(m.author || 'Unknown author')}${m.date_written ? ' · ' + esc(m.date_written) : ''}</div>
      ${m.description ? `<p>${esc(m.description)}</p>` : ''}
      <p>${[['Language', m.language], ['Script', m.script], ['Subject', m.subject], ['Region', m.region], ['Century (AH)', m.century], ['Held at', m.holding]].filter(([,v]) => v).map(([k,v]) => `<span class="chip"><b>${k}:</b> ${esc(v)}</span>`).join('')}</p>
      ${m.digital_url ? `<p><a href="${esc(m.digital_url)}" target="_blank" rel="noopener">View digitized copy / catalog entry →</a></p>` : ''}
    </div>`;
  $('#modal').hidden = false;
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
  const r = await fetch(url, { headers: H() });
  const d = await r.json();
  eState.data = d;
  renderE(d);
}
function renderE(d) {
  $('#eStats').textContent = `${d.total} event${d.total === 1 ? '' : 's'} — page ${d.page}`;
  $('#eList').innerHTML = d.events.map(ev => `
    <div class="tevent">
      <span class="year">${ev.year_gregorian ? ev.year_gregorian + ' CE' : ''}${ev.year_hijri ? ' / ' + ev.year_hijri + ' AH' : ''}</span>
      <h3>${esc(ev.title)}</h3>
      <p>${esc(ev.description)}</p>
      <div>${[ev.category, ev.region].filter(Boolean).map(v => `<span class="chip">${esc(v)}</span>`).join('')}</div>
      ${ev.source_url ? `<a href="${esc(ev.source_url)}" target="_blank" rel="noopener">Source →</a>` : ''}
    </div>`).join('') || '<p class="statline">No events match your search.</p>';
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

// ---------- init ----------
applyAdmin();
loadM();
loadE();
