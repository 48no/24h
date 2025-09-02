let cart = {}; // السلة: { "اسم المنتج": كمية }

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

  // عرض كل المنتجات مباشرة مع زر أضف للسلة
  menu.sections.forEach((sec) => {
    const card = create('div','menu-card');
    const h = create('h3', null, sec.name);
    card.appendChild(h);

    const ul = create('ul');
    sec.items.forEach(it => {
      const li = create('li', null, it);
      // زر إضافة للسلة
      const addBtn = create('button','btn-primary','أضف للسلة');
      addBtn.style.marginLeft = '8px';
      addBtn.onclick = () => {
        if(cart[it]) cart[it]++;
        else cart[it] = 1;
        updateCartPanel();
      };
      li.appendChild(addBtn);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    container.appendChild(card);
  });

  createCartPanel(); // إنشاء السلة أسفل المنتجات
}

function createCartPanel(){
  const container = $("#cart-panel");
  container.classList.add("cart-panel");

  // زر واتس في الأعلى يسار
  const sendBtn = create('button','btn-primary','أرسل الطلب عبر واتس');
  sendBtn.id = "send-wa-btn";
  sendBtn.onclick = sendOrder;

  // قائمة المنتجات في السلة
  const ul = create('ul');
  ul.id = "cart-items";

  // حقل العنوان
  const addressInput = create('input', 'cart-address');
  addressInput.id = "cart-address";
  addressInput.placeholder = "ضع عنوانك هنا";

  container.appendChild(sendBtn);
  container.appendChild(ul);
  container.appendChild(addressInput);

  updateCartPanel();
}

function updateCartPanel(){
  const ul = $("#cart-items");
  ul.innerHTML = '';
  if(Object.keys(cart).length === 0){
    ul.innerHTML = '<li>السلة فارغة</li>';
    return;
  }
  for(let item in cart){
    const li = create('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '6px';

    const name = create('span', null, `${item} x${cart[item]}`);

    const controls = create('span');
    const plus = create('button', 'btn-small','+');
    plus.onclick = () => { cart[item]++; updateCartPanel(); };
    const minus = create('button', 'btn-small','-');
    minus.onclick = () => {
      cart[item]--;
      if(cart[item]<=0) delete cart[item];
      updateCartPanel();
    };

    controls.appendChild(minus);
    controls.appendChild(plus);
    li.appendChild(name);
    li.appendChild(controls);
    ul.appendChild(li);
  }
}

function sendOrder(){
  const phoneNumber = "96565006690";
  let message = "طلب جديد:\n";
  for(let item in cart){
    message += `${item} x${cart[item]}\n`;
  }
  const address = $("#cart-address").value.trim();
  if(address) message += `الموقع: ${address}`;
  const link = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
  window.open(link, "_blank");
}

window.addEventListener('DOMContentLoaded', init);

// Splash Screen control
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2000);
});
