
async function fetchJSON(path){ const r = await fetch(path); return await r.json(); }
function $(sel){ return document.querySelector(sel); }
function create(tag, cls, txt){ const el = document.createElement(tag); if(cls) el.className = cls; if(txt) el.textContent = txt; return el; }

async function init(){
  const cfg = await fetchJSON('data/config.json');
  document.title = cfg.brandName + ' — قهوة';
  document.getElementById('brandName').textContent = cfg.brandName;
  document.getElementById('tagline').textContent = cfg.tagline;
  document.getElementById('address').textContent = cfg.address || '';
  document.getElementById('hours').textContent = cfg.hours || '';
  document.getElementById('instagram').href = cfg.instagram;
  document.getElementById('instagram').textContent = 'اطلب عبر الإنستقرام';

  const menu = await fetchJSON('data/menu.json');
  const container = document.getElementById('menu-grid');
  menu.sections.forEach((sec, idx) => {
    const card = create('div','menu-card');
    const h = create('h3', null, sec.name);
    card.appendChild(h);
    const ul = create('ul');
    sec.items.slice(0,5).forEach(it => {
      const li = create('li', null, it);
      ul.appendChild(li);
    });
    if(sec.items.length > 5){
      const more = create('div','more', 'عرض الكل');
      more.style.marginTop = '8px';
      more.style.cursor = 'pointer';
      more.style.color = 'var(--primary)';
      more.onclick = () => openModal(sec);
      card.appendChild(ul);
      card.appendChild(more);
    } else {
      card.appendChild(ul);
    }
    container.appendChild(card);
  });
}

function openModal(section){
  const modal = $('#modal');
  modal.style.display = 'flex';
  const panel = modal.querySelector('.panel');
  panel.innerHTML = '';
  const close = create('div','close','إغلاق ✖');
  close.onclick = () => modal.style.display = 'none';
  panel.appendChild(close);
  const title = create('h2', null, section.name);
  panel.appendChild(title);
  const list = create('div','item-list');
  section.items.forEach(it => {
    const item = create('div','item');
    const name = create('div', null, it);
    const order = create('a', 'btn-primary', 'اطلب عبر إنستقرام');
    order.href = document.getElementById('instagram').href;
    order.target = '_blank';
    item.appendChild(name);
    item.appendChild(order);
    list.appendChild(item);
  });
  panel.appendChild(list);
  const row = create('div', null);
  row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.marginTop='12px';
  const note = create('div', null, 'اطلب عبر حساب الإنستقرام أو امسح QR');
  note.style.color = 'var(--muted)';
  const qr = create('div','qr');
  qr.innerHTML = '<img src="assets/img/hero.jpg" alt="QR" style="width:100%;height:100%;object-fit:cover;border-radius:6px">';
  panel.appendChild(row);
  row.appendChild(note);
  row.appendChild(qr);
}

window.addEventListener('DOMContentLoaded', init);
