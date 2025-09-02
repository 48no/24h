let cart = {};

async function fetchJSON(path) {
  const r = await fetch(path);
  return await r.json();
}

function $(sel) { return document.querySelector(sel); }
function create(tag, cls, txt) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (txt) el.textContent = txt;
  return el;
}

async function init() {
  // إعداد البيانات
  const cfg = await fetchJSON('data/config.json');
  document.title = cfg.brandName + ' — قهوة';
  $("#brandName").textContent = cfg.brandName;
  $("#tagline").textContent = cfg.tagline;
  $("#address").textContent = cfg.address || '';
  $("#hours").textContent = cfg.hours || '';
  $("#instagram").href = cfg.instagram;

  // بناء المنيو
  const menu = await fetchJSON('data/menu.json');
  const container = $("#menu-grid");
  container.innerHTML = '';

  menu.sections.forEach(sec => {
    const card = create('div', 'menu-card');
    const h = create('h3', null, sec.name);
    card.appendChild(h);
    const ul = create('ul');
    
    sec.items.forEach(it => {
      const li = create('li');
      const name = create('span', null, it);
      const addBtn = create('button', 'btn-add-cart');
      addBtn.innerHTML = `أضف للسلة <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1a1 1 0 0 1 1-1h1.27a1 1 0 0 1 .95.68L3.89 2H14a1 1 0 0 1 .95 1.32l-1.5 6A1 1 0 0 1 12.5 10H4a1 1 0 0 1-.95-.68L1.61 2.24 1.11 1H1a1 1 0 0 1-1-1zm3.14 3 1.25 5h7.71l1.25-5H3.14zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>`;
      addBtn.onclick = () => { cart[it] = (cart[it] || 0) + 1; updateCart(); };
      li.appendChild(name);
      li.appendChild(addBtn);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    container.appendChild(card);
  });

  // أحداث السلة
  const cartBtn = $("#cart-button");
  const cartPanel = $("#cart-panel");
  cartBtn.onclick = () => { cartPanel.style.display = cartPanel.style.display === "flex" ? "none" : "flex"; }
  $("#send-wa-btn").onclick = sendOrder;
  updateCart();
}

// تحديث السلة والعدد
function updateCart() {
  const ul = $("#cart-items");
  const count = $("#cart-count");
  let totalItems = 0;
  for (let item in cart) totalItems += cart[item];
  if (count) count.textContent = totalItems;

  ul.innerHTML = "";
  if (totalItems === 0) { ul.innerHTML = "<li>السلة فارغة</li>"; return; }

  for (let item in cart) {
    const li = create('li');
    const name = create('span', null, `${item} x${cart[item]}`);
    const controls = create('span');
    const plus = create('button', 'btn-small', '+');
    plus.onclick = () => { cart[item]++; updateCart(); };
    const minus = create('button', 'btn-small', '-');
    minus.onclick = () => { cart[item]--; if (cart[item] <= 0) delete cart[item]; updateCart(); };
    controls.appendChild(minus);
    controls.appendChild(plus);
    li.appendChild(name);
    li.appendChild(controls);
    ul.appendChild(li);
  }
}

// إرسال الطلب عبر واتس
function sendOrder() {
  const phoneNumber = "96565006690";
  let message = "طلب جديد:\n";
  for (let item in cart) message += `${item} x${cart[item]}\n`;
  const address = $("#cart-address").value.trim();
  if (address) message += `الموقع: ${address}`;
  const link = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
  window.open(link, "_blank");
}

// Splash Screen
window.addEventListener('DOMContentLoaded', init);
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  setTimeout(() => { splash.classList.add("hidden"); }, 2000);
});
