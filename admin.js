const loginBox = document.getElementById('login-box');
const dashboard = document.getElementById('dashboard');

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.innerHTML = `<div class="msg ${type}">${text}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

// ===== Auth =====
async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    loginBox.style.display = 'none';
    dashboard.style.display = 'block';
    loadPhoneList();
    loadNewsList();
    loadSettingsForm();
  } else {
    loginBox.style.display = 'block';
    dashboard.style.display = 'none';
  }
}

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    showMsg('login-msg', error.message, 'error');
  } else {
    checkSession();
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  checkSession();
});

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== Phones =====
async function loadPhoneList() {
  const { data, error } = await supabaseClient.from('phones').select('*').order('created_at', { ascending: false });
  const el = document.getElementById('phone-list');
  if (error || !data || data.length === 0) {
    el.innerHTML = '<div class="empty-state">No phones yet.</div>';
    return;
  }
  el.innerHTML = data.map(p => `
    <div class="admin-list-item">
      <div>
        <strong>${p.name}</strong>
        <div class="meta">${p.brand || ''} · Score ${p.score ?? '—'}</div>
      </div>
      <button class="btn btn-danger" onclick="deletePhone('${p.id}')">Delete</button>
    </div>
  `).join('');
}

document.getElementById('add-phone-btn').addEventListener('click', async () => {
  const payload = {
    name: document.getElementById('p-name').value.trim(),
    brand: document.getElementById('p-brand').value.trim(),
    price: Number(document.getElementById('p-price').value) || null,
    image_url: document.getElementById('p-image').value.trim(),
    display: document.getElementById('p-display').value.trim(),
    chipset: document.getElementById('p-chipset').value.trim(),
    ram: Number(document.getElementById('p-ram').value) || null,
    storage: Number(document.getElementById('p-storage').value) || null,
    battery: Number(document.getElementById('p-battery').value) || null,
    camera: Number(document.getElementById('p-camera').value) || null,
    score: Number(document.getElementById('p-score').value) || null,
    review: document.getElementById('p-review').value.trim()
  };
  if (!payload.name) { showMsg('phone-msg', 'Phone name is required.', 'error'); return; }

  const { error } = await supabaseClient.from('phones').insert(payload);
  if (error) {
    showMsg('phone-msg', error.message, 'error');
  } else {
    showMsg('phone-msg', 'Phone added.', 'success');
    ['p-name','p-brand','p-price','p-image','p-display','p-chipset','p-ram','p-storage','p-battery','p-camera','p-score','p-review']
      .forEach(id => document.getElementById(id).value = '');
    loadPhoneList();
  }
});

async function deletePhone(id) {
  if (!confirm('Delete this phone?')) return;
  const { error } = await supabaseClient.from('phones').delete().eq('id', id);
  if (error) { showMsg('phone-msg', error.message, 'error'); } else { loadPhoneList(); }
}

// ===== News =====
async function loadNewsList() {
  const { data, error } = await supabaseClient.from('news_posts').select('*').order('created_at', { ascending: false });
  const el = document.getElementById('news-list');
  if (error || !data || data.length === 0) {
    el.innerHTML = '<div class="empty-state">No posts yet.</div>';
    return;
  }
  el.innerHTML = data.map(p => `
    <div class="admin-list-item">
      <div>
        <strong>${p.title}</strong>
        <div class="meta">${p.tag || ''} · ${new Date(p.created_at).toLocaleDateString()}</div>
      </div>
      <button class="btn btn-danger" onclick="deleteNews('${p.id}')">Delete</button>
    </div>
  `).join('');
}

document.getElementById('add-news-btn').addEventListener('click', async () => {
  const payload = {
    title: document.getElementById('n-title').value.trim(),
    tag: document.getElementById('n-tag').value.trim(),
    excerpt: document.getElementById('n-excerpt').value.trim(),
    body: document.getElementById('n-body').value.trim()
  };
  if (!payload.title) { showMsg('news-msg', 'Title is required.', 'error'); return; }

  const { error } = await supabaseClient.from('news_posts').insert(payload);
  if (error) {
    showMsg('news-msg', error.message, 'error');
  } else {
    showMsg('news-msg', 'Post published.', 'success');
    ['n-title','n-tag','n-excerpt','n-body'].forEach(id => document.getElementById(id).value = '');
    loadNewsList();
  }
});

async function deleteNews(id) {
  if (!confirm('Delete this post?')) return;
  const { error } = await supabaseClient.from('news_posts').delete().eq('id', id);
  if (error) { showMsg('news-msg', error.message, 'error'); } else { loadNewsList(); }
}

// ===== Settings =====
async function loadSettingsForm() {
  const { data, error } = await supabaseClient.from('site_settings').select('*').eq('id', 1).single();
  if (error || !data) return;
  document.getElementById('s-instagram').value = data.instagram_url || '';
  document.getElementById('s-youtube').value = data.youtube_url || '';
  document.getElementById('s-email').value = data.contact_email || '';
  document.getElementById('s-phone').value = data.contact_phone || '';
}

document.getElementById('save-settings-btn').addEventListener('click', async () => {
  const payload = {
    id: 1,
    instagram_url: document.getElementById('s-instagram').value.trim(),
    youtube_url: document.getElementById('s-youtube').value.trim(),
    contact_email: document.getElementById('s-email').value.trim(),
    contact_phone: document.getElementById('s-phone').value.trim()
  };
  const { error } = await supabaseClient.from('site_settings').upsert(payload);
  if (error) {
    showMsg('settings-msg', error.message, 'error');
  } else {
    showMsg('settings-msg', 'Saved.', 'success');
  }
});

checkSession();
