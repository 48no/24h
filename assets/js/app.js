let cart={};

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

  menu.sections.forEach(sec=>{
    const card=create('div','menu-card');
    const h=create('h3',null,sec.name);
    card.appendChild(h);
    const ul=create('ul');
    sec.items.forEach(it=>{
      const li=create('li',null,it);
      const addBtn=create('button','btn-primary','أضف للسلة');
      addBtn.onclick=()=>{cart[it]?cart[it]++:cart[it]=1;updateCart();}
      li.appendChild(addBtn);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    container.appendChild(card);
  });

  // أحداث السلة
  const cartBtn=$("#cart-button");
  const cartPanel=$("#cart-panel");
  cartBtn.onclick=()=>{cartPanel.style.display=cartPanel.style.display==="flex"?"none":"flex";}
  $("#send-wa-btn").onclick=sendOrder;
  updateCart();
}

function updateCart(){
  const ul = $("#cart-items");
  ul.innerHTML = "";

  const count = $("#cart-count");
  let totalItems = 0;
  for(let item in cart) totalItems += cart[item];
  count.textContent = totalItems;

  if(totalItems === 0){
    ul.innerHTML = "<li>السلة فارغة</li>";
    return;
  }

  for(let item in cart){
    const li = create('li');
    const name = create('span', null, `${item} x${cart[item]}`);
    const controls = create('span');
    const plus = create('button','btn-small','+');
    plus.onclick = () => { cart[item]++; updateCart(); };
    const minus = create('button','btn-small','-');
    minus.onclick = () => { cart[item]--; if(cart[item]<=0) delete cart[item]; updateCart(); };
    controls.appendChild(minus);
    controls.appendChild(plus);
    li.appendChild(name);
    li.appendChild(controls);
    ul.appendChild(li);
  }
}
}

function sendOrder(){
  const phoneNumber="96565006690";
  let message="طلب جديد:\n";
  for(let item in cart) message+=`${item} x${cart[item]}\n`;
  const address=$("#cart-address").value.trim();
  if(address) message+=`الموقع: ${address}`;
  const link="https://wa.me/"+phoneNumber+"?text="+encodeURIComponent(message);
  window.open(link,"_blank");
}

window.addEventListener('DOMContentLoaded',init);
window.addEventListener("load",()=>{
  const splash=document.getElementById("splash");
  setTimeout(()=>{splash.classList.add("hidden");},2000);
});
