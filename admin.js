/* F1RSTME TECH — admin panel logic.
   NOTE ON HOW THIS WORKS: GitHub Pages only serves static files, there is no
   database. So "Save" here writes to THIS BROWSER's local storage right away
   (great for previewing), and "Export data.json" downloads the updated file.
   Upload that exported file to your GitHub repo (replacing data.json) to make
   the change visible to every visitor on the live site. */

const ADMIN_PASSWORD = 'f1rstme2026'; // change this, then update the value here
let specRowCount = 0;

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function checkLogin() {
  if (sessionStorage.getItem('f1rstme_admin_ok') === '1') {
    document.getElementById('admin-lock').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    initAdmin();
  }
}

function attemptLogin() {
  const val = document.getElementById('admin-pass').value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem('f1rstme_admin_ok', '1');
    checkLogin();
  } else {
    document.getElementById('lock-error').textContent = 'Wrong password. Try again.';
  }
}

function addSpecRow(key = '', value = '') {
  specRowCount++;
  const wrap = document.getElementById('spec-rows');
  const row = document.createElement('div');
  row.className = 'spec-row';
  row.dataset.id = specRowCount;
  row.innerHTML = `
    <input type="text" placeholder="Spec name (e.g. Display)" class="spec-key" value="${escapeHtml(key)}">
    <input type="text" placeholder="Value (e.g. 6.7 inch AMOLED)" class="spec-val" value="${escapeHtml(value)}">
    <button type="button" onclick="this.closest('.spec-row').remove()">✕</button>
  `;
  wrap.appendChild(row);
}

async function initAdmin() {
  const data = await loadData();
  renderDeviceList(data);
  fillContactForm(data);

  document.getElementById('add-spec-btn').addEventListener('click', () => addSpecRow());
  addSpecRow('Display', '');
  addSpecRow('Processor', '');
  addSpecRow('Camera', '');
  addSpecRow('Battery', '');

  document.getElementById('device-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const specs = {};
    document.querySelectorAll('.spec-row').forEach(row => {
      const k = row.querySelector('.spec-key').value.trim();
      const v = row.querySelector('.spec-val').value.trim();
      if (k && v) specs[k] = v;
    });
    const d = await loadData();
    d.devices = d.devices || [];
    d.devices.unshift({
      id: 'd' + Date.now(),
      name: document.getElementById('f-name').value.trim(),
      brand: document.getElementById('f-brand').value.trim(),
      category: document.getElementById('f-category').value.trim(),
      price: document.getElementById('f-price').value.trim(),
      launch: document.getElementById('f-launch').value.trim(),
      image: document.getElementById('f-image').value.trim(),
      review: document.getElementById('f-review').value.trim(),
      specs
    });
    saveData(d);
    toast('Device added — remember to export & upload data.json');
    e.target.reset();
    document.getElementById('spec-rows').innerHTML = '';
    addSpecRow('Display', ''); addSpecRow('Processor', ''); addSpecRow('Camera', ''); addSpecRow('Battery', '');
    renderDeviceList(d);
  });

  document.getElementById('news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = await loadData();
    d.news = d.news || [];
    d.news.unshift({
      title: document.getElementById('n-title').value.trim(),
      summary: document.getElementById('n-summary').value.trim(),
      date: document.getElementById('n-date').value || new Date().toISOString().slice(0, 10),
      link: document.getElementById('n-link').value.trim()
    });
    saveData(d);
    toast('Post added — remember to export & upload data.json');
    e.target.reset();
  });

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = await loadData();
    d.contact = {
      email: document.getElementById('c-email').value.trim(),
      instagram: document.getElementById('c-instagram').value.trim(),
      youtube: document.getElementById('c-youtube').value.trim(),
      whatsapp: document.getElementById('c-whatsapp').value.trim()
    };
    saveData(d);
    toast('Contact info saved — remember to export & upload data.json');
  });

  document.getElementById('export-btn').addEventListener('click', async () => {
    const d = await loadData();
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        saveData(json);
        toast('Imported — refreshing panel');
        setTimeout(() => location.reload(), 800);
      } catch (err) {
        toast('That file is not valid JSON');
      }
    };
    reader.readAsText(file);
  });
}

function renderDeviceList(data) {
  const list = document.getElementById('device-list');
  if (!data.devices || !data.devices.length) {
    list.innerHTML = '<p style="color:var(--steel-light);font-size:0.9rem;">No devices yet.</p>';
    return;
  }
  list.innerHTML = data.devices.map(d => `
    <div class="admin-list-item">
      <span>${escapeHtml(d.name)} — ${escapeHtml(d.price || '')}</span>
      <button class="del" data-id="${d.id}">Delete</button>
    </div>
  `).join('');
  list.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', async () => {
      const d = await loadData();
      d.devices = d.devices.filter(x => x.id !== btn.dataset.id);
      saveData(d);
      toast('Deleted — remember to export & upload data.json');
      renderDeviceList(d);
    });
  });
}

function fillContactForm(data) {
  const c = data.contact || {};
  document.getElementById('c-email').value = c.email || '';
  document.getElementById('c-instagram').value = c.instagram || '';
  document.getElementById('c-youtube').value = c.youtube || '';
  document.getElementById('c-whatsapp').value = c.whatsapp || '';
}

document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
  document.getElementById('login-btn').addEventListener('click', attemptLogin);
  document.getElementById('admin-pass').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
});
