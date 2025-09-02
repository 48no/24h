let cart = []; // السلة

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
      more.onclick = () => openModal(sec, cfg);
      card.appendChild(ul);
      card.appendChild(more);
    } else {
      card.appendChild(ul);
    }

    container.appendChild(card);
  });
}

function openModal(section, cfg){
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

    // زر إضافة للسلة
    const addBtn = create('button','btn-primary','أضف للسلة');
    addBtn.onclick = () => {
      cart.push(it);
      updateCartPanel(cfg);
    };

    item.appendChild(name);
    item.appendChild(addBtn);
    list.appendChild(item);
  });
  panel.appendChild(list);

  // منطقة السلة + إرسال واتس
  const cartPanel = create('div','cart-panel');
  panel.appendChild(cartPanel);

  updateCartPanel(cfg); // تحديث أولي

  modal.style.display = 'flex';
  setTimeout(()=> modal.classList.add("show"), 10);
}

function updateCartPanel(cfg){
  const panel = $("#modal").querySelector('.panel');
  let cartPanel = panel.querySelector('.cart-panel');
  cartPanel.innerHTML = '';

  if(cart.length === 0){
    cartPanel.textContent = 'السلة فارغة';
    return;
  }

  const ul = create('ul');
  cart.forEach(item => {
    const li = create('li', null, item);
    ul.appendChild(li);
  });
  cartPanel.appendChild(ul);

  const sendBtn = create('button','btn-primary','أرسل الطلب عبر واتس');
  sendBtn.onclick = () => {
    const phoneNumber = "96565006690"; // رقمك
    let message = "طلب جديد:%0A";
    cart.forEach(it => {
      message += `${it}%0A`;
    });
    // إضافة الموقع من الصفحة
    const location = $("#address") ? $("#address").textContent : '';
    if(location) message += `الموقع: ${location}`;

    const encoded = encodeURIComponent(message);
    const link = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(link, "_blank");
  };
  cartPanel.appendChild(sendBtn);
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
