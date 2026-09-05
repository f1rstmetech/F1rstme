/* F1RSTME TECH — shared site logic
   Data model: a single JSON object (devices, news, contact) is the source of truth.
   On GitHub Pages (a static host) there is no server, so the Admin panel saves
   changes to this browser's localStorage immediately, and offers an Export
   button that downloads an updated data.json — upload that file to the repo
   to make the change visible to every visitor. */

const DATA_KEY = 'f1rstme_data_v1';
const RSS_FEED = 'https://news.google.com/rss/search?q=smartphone+OR+%22mobile+phone%22+launch+OR+review&hl=en-IN&gl=IN&ceid=IN:en';
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

async function loadData() {
  const cached = localStorage.getItem(DATA_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { /* fall through */ }
  }
  const res = await fetch('data.json', { cache: 'no-store' });
  const json = await res.json();
  localStorage.setItem(DATA_KEY, JSON.stringify(json));
  return json;
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ---------------- Home page rendering ---------------- */

function renderNews(data) {
  const el = document.getElementById('news-manual');
  if (!el) return;
  if (!data.news || data.news.length === 0) {
    el.innerHTML = '<p class="news-empty">No posts yet. Add one from the Admin panel.</p>';
    return;
  }
  el.innerHTML = data.news.map(n => `
    <article class="news-card">
      <span class="news-date">${escapeHtml(n.date || '')}</span>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.summary || '')}</p>
      ${n.link ? `<a class="read" href="${escapeHtml(n.link)}" target="_blank" rel="noopener">Read more →</a>` : ''}
    </article>
  `).join('');
}

async function loadLiveFeed() {
  const el = document.getElementById('news-live');
  if (!el) return;
  el.innerHTML = '<p class="news-empty">Loading latest headlines…</p>';
  try {
    const res = await fetch(RSS_PROXY + encodeURIComponent(RSS_FEED));
    const json = await res.json();
    if (!json.items || !json.items.length) throw new Error('empty feed');
    el.innerHTML = json.items.slice(0, 6).map(item => {
      const d = new Date(item.pubDate);
      const dateStr = isNaN(d) ? '' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      // Google News titles are often "Headline - Source"; keep the headline, show source separately.
      const parts = item.title.split(' - ');
      const source = parts.length > 1 ? parts.pop() : (item.author || '');
      const headline = parts.join(' - ');
      return `
      <article class="news-card">
        <span class="news-date">${escapeHtml(dateStr)}${source ? ' · ' + escapeHtml(source) : ''}</span>
        <h3>${escapeHtml(headline)}</h3>
        <a class="read" href="${escapeHtml(item.link)}" target="_blank" rel="noopener">Read more →</a>
      </article>
    `;
    }).join('');
  } catch (e) {
    el.innerHTML = '<p class="news-empty">Live feed is unavailable right now — check back shortly, or browse the posts above.</p>';
  }
}

function renderDevices(data) {
  const grid = document.getElementById('device-grid');
  if (!grid) return;
  if (!data.devices || !data.devices.length) {
    grid.innerHTML = '<p class="news-empty">No devices added yet.</p>';
    return;
  }
  grid.innerHTML = data.devices.map(d => `
    <article class="device-card">
      ${d.image ? `<img src="${escapeHtml(d.image)}" alt="${escapeHtml(d.name)}" style="margin-bottom:6px;">` : ''}
      <span class="cat">${escapeHtml(d.category || '')} · ${escapeHtml(d.launch || '')}</span>
      <h3>${escapeHtml(d.name)}</h3>
      <span class="brand-line">${escapeHtml(d.brand || '')}</span>
      <span class="price">${escapeHtml(d.price || '')}</span>
      <ul class="spec-list">
        ${Object.entries(d.specs || {}).map(([k, v]) => `<li><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></li>`).join('')}
      </ul>
      ${d.review ? `<p class="review-text">"${escapeHtml(d.review)}"</p>` : ''}
    </article>
  `).join('');
}

function renderCompareOptions(data) {
  const a = document.getElementById('compare-a');
  const b = document.getElementById('compare-b');
  if (!a || !b) return;
  const options = '<option value="">Choose a device…</option>' +
    (data.devices || []).map(d => `<option value="${d.id}">${escapeHtml(d.name)}</option>`).join('');
  a.innerHTML = options;
  b.innerHTML = options;

  function renderTable() {
    const da = data.devices.find(d => d.id === a.value);
    const db = data.devices.find(d => d.id === b.value);
    const out = document.getElementById('compare-output');
    if (!da || !db) {
      out.innerHTML = '<p class="compare-empty">Pick two devices above to see them side by side.</p>';
      return;
    }
    const keys = [...new Set([...Object.keys(da.specs || {}), ...Object.keys(db.specs || {})])];
    out.innerHTML = `
      <table class="compare-table">
        <tr><th>Spec</th><th>${escapeHtml(da.name)}</th><th>${escapeHtml(db.name)}</th></tr>
        <tr><td>Price</td><td>${escapeHtml(da.price)}</td><td>${escapeHtml(db.price)}</td></tr>
        ${keys.map(k => {
          const va = (da.specs || {})[k] || '—';
          const vb = (db.specs || {})[k] || '—';
          const diff = va !== vb ? 'diff' : '';
          return `<tr><td>${escapeHtml(k)}</td><td class="${diff}">${escapeHtml(va)}</td><td class="${diff}">${escapeHtml(vb)}</td></tr>`;
        }).join('')}
      </table>`;
  }
  a.addEventListener('change', renderTable);
  b.addEventListener('change', renderTable);
}

function renderContactLinks(data) {
  const c = data.contact || {};
  document.querySelectorAll('[data-contact="instagram"]').forEach(el => el.href = c.instagram || '#');
  document.querySelectorAll('[data-contact="youtube"]').forEach(el => el.href = c.youtube || '#');
  document.querySelectorAll('[data-contact="email"]').forEach(el => el.href = c.email ? `mailto:${c.email}` : '#');
}

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

async function initHome() {
  initNav();
  const data = await loadData();
  renderNews(data);
  renderDevices(data);
  renderCompareOptions(data);
  renderContactLinks(data);
  loadLiveFeed();
  const refreshBtn = document.getElementById('refresh-news');
  if (refreshBtn) refreshBtn.addEventListener('click', loadLiveFeed);
}

if (document.body && document.body.dataset.page === 'home') {
  document.addEventListener('DOMContentLoaded', initHome);
}
