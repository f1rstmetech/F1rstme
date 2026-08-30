// ===== Settings (social links, contact) =====
async function loadSettings() {
  const { data, error } = await supabaseClient.from('site_settings').select('*').eq('id', 1).single();
  if (error || !data) return;

  document.querySelectorAll('#ig-link, #ig-link-2').forEach(el => { if (data.instagram_url) el.href = data.instagram_url; });
  document.querySelectorAll('#yt-link, #yt-link-2').forEach(el => { if (data.youtube_url) el.href = data.youtube_url; });

  const emailEl = document.getElementById('footer-email');
  if (emailEl && data.contact_email) emailEl.textContent = data.contact_email;
}

// ===== Ticker =====
async function loadTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;
  const { data: phones, error } = await supabaseClient.from('phones').select('*').order('created_at', { ascending: false }).limit(8);
  if (error || !phones || phones.length === 0) {
    ticker.textContent = 'Add your first phone from the Admin panel to see it here.';
    return;
  }
  const items = phones.map(p =>
    `<span><b>${p.name}</b> · ${p.chipset || '—'} · ${p.battery ? p.battery + 'mAh' : ''}</span>`
  ).join('');
  ticker.innerHTML = items + items;
}

// ===== News cards =====
function postCardHTML(post) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `
    <div class="card">
      <div class="card-tag">${post.tag || 'News'}</div>
      <h3>${post.title}</h3>
      <p>${post.excerpt || ''}</p>
      <div class="card-date">${date}</div>
    </div>`;
}

async function loadNews(limit, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  let query = supabaseClient.from('news_posts').select('*').order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    el.innerHTML = '<div class="empty-state">No news posted yet. Add one from the Admin panel.</div>';
    return;
  }
  el.innerHTML = data.map(postCardHTML).join('');
}

// ===== Phone cards =====
function phoneCardHTML(p) {
  return `
    <div class="card">
      <div class="card-score">Score: ${p.score ?? '—'}/100</div>
      <h3>${p.name}</h3>
      <p>${p.brand || ''} ${p.price ? '· ₹' + Number(p.price).toLocaleString('en-IN') : ''}</p>
      <p>${p.review ? p.review.slice(0, 110) + (p.review.length > 110 ? '…' : '') : 'Review coming soon.'}</p>
    </div>`;
}

async function loadPhones(limit, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  let query = supabaseClient.from('phones').select('*').order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    el.innerHTML = '<div class="empty-state">No phones added yet. Add one from the Admin panel.</div>';
    return;
  }
  el.innerHTML = data.map(phoneCardHTML).join('');
}

// ===== Compare tool =====
async function initCompare() {
  const wrap = document.getElementById('compare-wrap');
  if (!wrap) return;

  const { data: phones, error } = await supabaseClient.from('phones').select('*').order('name');
  if (error || !phones || phones.length < 2) {
    wrap.innerHTML = '<div class="empty-state">Add at least two phones from the Admin panel to use the comparison tool.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="compare-picker">
      <select id="phone-a"></select>
      <div class="vs-mark">VS</div>
      <select id="phone-b"></select>
    </div>
    <div id="compare-headers" class="spec-row" style="border-bottom: 1px solid var(--line); padding-bottom: 20px;"></div>
    <div id="compare-table"></div>
  `;

  const selA = document.getElementById('phone-a');
  const selB = document.getElementById('phone-b');
  phones.forEach((p, i) => {
    selA.innerHTML += `<option value="${p.id}" ${i === 0 ? 'selected' : ''}>${p.name}</option>`;
    selB.innerHTML += `<option value="${p.id}" ${i === 1 ? 'selected' : ''}>${p.name}</option>`;
  });

  const specDefs = [
    { key: 'display', label: 'Display', numeric: false },
    { key: 'chipset', label: 'Chipset', numeric: false },
    { key: 'ram', label: 'RAM', numeric: true, unit: 'GB' },
    { key: 'storage', label: 'Storage', numeric: true, unit: 'GB' },
    { key: 'battery', label: 'Battery', numeric: true, unit: 'mAh' },
    { key: 'camera', label: 'Main Cam', numeric: true, unit: 'MP' },
    { key: 'price', label: 'Price', numeric: true, unit: '', invert: true },
    { key: 'score', label: 'Our Score', numeric: true, unit: '/100' }
  ];

  function render() {
    const a = phones.find(p => p.id === selA.value);
    const b = phones.find(p => p.id === selB.value);

    document.getElementById('compare-headers').innerHTML = `
      <div></div>
      <div class="phone-header">${a.name} <span class="card-score">${a.score ?? '—'}</span></div>
      <div class="phone-header">${b.name} <span class="card-score">${b.score ?? '—'}</span></div>
    `;

    document.getElementById('compare-table').innerHTML = specDefs.map(def => {
      const va = a[def.key];
      const vb = b[def.key];

      if (!def.numeric) {
        return `
          <div class="spec-row">
            <div class="spec-label">${def.label}</div>
            <div class="spec-value">${va || '—'}</div>
            <div class="spec-value">${vb || '—'}</div>
          </div>`;
      }

      const na = Number(va) || 0;
      const nb = Number(vb) || 0;
      const higherIsBetter = !def.invert;
      const aWins = na && nb && (higherIsBetter ? na > nb : na < nb);
      const bWins = na && nb && (higherIsBetter ? nb > na : nb < na);
      const max = Math.max(na, nb) || 1;
      const fmt = v => !v ? '—' : (def.unit === '' ? `₹${Number(v).toLocaleString('en-IN')}` : `${v}${def.unit}`);

      return `
        <div class="spec-row">
          <div class="spec-label">${def.label}</div>
          <div>
            <div class="spec-value ${aWins ? 'winner' : ''}">${fmt(va)}</div>
            <div class="spec-bar-track"><div class="spec-bar-fill ${aWins ? '' : 'lower'}" style="width:${(na/max)*100}%"></div></div>
          </div>
          <div>
            <div class="spec-value ${bWins ? 'winner' : ''}">${fmt(vb)}</div>
            <div class="spec-bar-track"><div class="spec-bar-fill ${bWins ? '' : 'lower'}" style="width:${(nb/max)*100}%"></div></div>
          </div>
        </div>`;
    }).join('');
  }

  selA.addEventListener('change', render);
  selB.addEventListener('change', render);
  render();
}

// ===== Page router =====
loadSettings();
loadTicker();
loadNews(3, 'post-grid');
loadNews(null, 'post-grid-full');
loadPhones(3, 'phone-grid');
loadPhones(null, 'phone-grid-full');
initCompare();
