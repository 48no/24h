async function fetchJSON(path){
  const r = await fetch(path);
  return await r.json();
}
function $(sel){ return document.querySelector(sel); }
function create(tag, cls, txt){
  const el = document.createElement(tag);
  if(cls) el.className = cls;
  if(txt) el.textContent = txt;
  return el;
}

async function init(){
  const cfg = await fetchJSON('data/config.json');
  document.title = cfg.brandName + ' — قهوة';
  $("#brandName").textContent = cfg.brandName;
  $("#tagline").textContent = cfg.tagline;
  $("#address").textContent = cfg.address || '';
  $("#hours").textContent = cfg.hours || '';
  $("#instagram").href = cfg.instagram;
  $("#instagram").textContent = 'اطلب عبر الإنستقرام';

  const menu = await fetchJSON('data/menu.json');
  const container = $("#menu-grid");
  container.innerHTML = '';

  if(!menu.sections || menu.sections.length === 0){
    container.innerHTML = "<p style='color:#aaa'>لا توجد عناصر حالياً</p>";
    return;
  }

  menu.sections.forEach((sec) => {
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
  const modal = $("#modal");
  const panel = modal.querySelector('.panel');
  panel.innerHTML = '';

  const close = create('div','close','✖ إغلاق');
  close.onclick = () => closeModal();
  panel.appendChild(close);

  const title = create('h2', null, section.name);
  panel.appendChild(title);

  const list = create('div','item-list');
  section.items.forEach(it => {
    const item = create('div','item');
    const name = create('div', null, it);
    const order = create('a', 'btn-primary', 'اطلب عبر إنستقرام');
    order.href = $("#instagram").href;
    order.target = '_blank';
    item.appendChild(name);
    item.appendChild(order);
    list.appendChild(item);
  });
  panel.appendChild(list);

  const row = create('div', null);
  row.style.display = 'flex';
  row.style.justifyContent = 'space-between';
  row.style.marginTop = '12px';

  const note = create('div', null, 'اطلب عبر حساب الإنستقرام أو امسح QR');
  note.style.color = 'var(--muted)';

  const qr = create('div','qr');
  qr.innerHTML = '<img src="assets/img/hero.jpg" alt="QR">';

  row.appendChild(note);
  row.appendChild(qr);
  panel.appendChild(row);

  modal.style.display = 'flex';
  setTimeout(()=> modal.classList.add("show"), 10);
}

function closeModal(){
  const modal = $("#modal");
  modal.classList.remove("show");
  setTimeout(()=> modal.style.display = 'none', 250);
}

window.addEventListener('DOMContentLoaded', init);

// إغلاق المودال عند الضغط على الخلفية
$("#modal").addEventListener("click", e=>{
  if(e.target.id === "modal"){ closeModal(); }
});

// Splash Screen control
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2000); // 2 ثواني وتختفي
});
