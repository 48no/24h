let cart = {};

// ⚡ دوال مساعدة
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

// ⚡ التهيئة
async function init(){
  // ⚡ تحميل الإعدادات
  const cfg = await fetchJSON('data/config.json');
  document.title = cfg.brandName + ' — قهوة';
  $("#brandName").textContent = cfg.brandName;
  $("#tagline").textContent = cfg.tagline;
  $("#address").textContent = cfg.address || '';
  $("#hours").textContent = cfg.hours || '';
  $("#instagram").href = cfg.instagram;
  $("#instagram").textContent = 'اطلب عبر الإنستقرام';

  // ⚡ المنيو
  const menu = await fetchJSON('data/menu.json');
  const container = $("#menu-grid");
  container.innerHTML = '';

  menu.sections.forEach(sec=>{
    const card = create('div','menu-card');
    const h = create('h3',null,sec.name);
    card.appendChild(h);
    const ul = create('ul');

    sec.items.forEach(it=>{
      const li = create('li');

      // صورة صغيرة
      if(it.img){
        const img = document.createElement("img");
        img.src = it.img;
        img.alt = it.name;
        img.className = "menu-thumb";
        img.onclick = ()=> showImage(it.img);
        li.appendChild(img);
      }

      // اسم المشروب
      const name = create('span','',it.name);
      li.appendChild(name);

      // زر الإضافة للسلة
      const addBtn = create('button','btn-add-cart');
      addBtn.innerHTML = `أضف للسلة 🛒`;
      addBtn.onclick = ()=>{
        cart[it.name] ? cart[it.name]++ : cart[it.name] = 1;
        updateCart();
        showToast(`${it.name} تمت إضافته ✅`);
      };
      li.appendChild(addBtn);

      ul.appendChild(li);
    });

    card.appendChild(ul);
    container.appendChild(card);
  });

  // ⚡ الأسئلة الشائعة
  const faqData = await fetchJSON('data/faq.json');
  const faqContainer = $("#faq-container");
  faqContainer.innerHTML = "";
  faqData.questions.forEach(q=>{
    const item = create("div","faq-item");
    const question = create("div","faq-question",q.q);
    const answer = create("div","faq-answer",q.a);

    question.onclick = ()=>{
      answer.classList.toggle("open");
    };

    item.appendChild(question);
    item.appendChild(answer);
    faqContainer.appendChild(item);
  });

  // ⚡ أحداث السلة
  const cartBtn = $("#cart-button");
  const cartPanel = $("#cart-panel");
  cartBtn.onclick = ()=>{ 
    cartPanel.style.display = cartPanel.style.display==="flex"?"none":"flex"; 
  }
  $("#send-wa-btn").onclick = sendOrder;

  updateCart();
}

// ⚡ تحديث السلة
function updateCart(){
  const ul = $("#cart-items");
  const count = $("#cart-count");
  let totalItems = 0;
  for(let item in cart) totalItems += cart[item];
  count.textContent = totalItems;

  ul.innerHTML = "";
  if(totalItems===0){
    ul.innerHTML = "<li>السلة فارغة</li>";
    return;
  }

  for(let item in cart){
    const li = create('li');
    const name = create('span',null,`${item} x${cart[item]}`);
    const controls = create('span');
    const plus = create('button','btn-small','+');
    plus.onclick = ()=>{ cart[item]++; updateCart(); }
    const minus = create('button','btn-small','-');
    minus.onclick = ()=>{
      cart[item]--; if(cart[item]<=0) delete cart[item]; updateCart();
    };
    controls.appendChild(minus);
    controls.appendChild(plus);
    li.appendChild(name);
    li.appendChild(controls);
    ul.appendChild(li);
  }
}

// ⚡ إرسال الطلب عبر WhatsApp
function sendOrder(){
  const phoneNumber="963998411476";
  const address=$("#cart-address").value.trim();

  if(Object.keys(cart).length === 0){
    showToast("السلة فارغة! أضف بعض المنتجات أولاً ❌");
    return;
  }
  if(!address){
    showToast("يجب إدخال العنوان لإرسال الطلب 📍");
    return;
  }

  let message="طلب جديد:\n";
  for(let item in cart) message+=`${item} x${cart[item]}\n`;
  message += `الموقع: ${address}`;

  const link="https://wa.me/"+phoneNumber+"?text="+encodeURIComponent(message);
  window.open(link,"_blank");
}

// ⚡ Toast Notification
function showToast(msg="تمت الإضافة للسلة ✅") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>{ toast.classList.remove("show"); }, 2500);
}

// ⚡ عرض الصورة الكبيرة (Modal)
function showImage(src){
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = modal.querySelector(".close-modal");

  modal.style.display = "flex";
  modalImg.src = src;

  closeBtn.onclick = ()=> modal.style.display = "none";
  modal.onclick = (e)=>{ if(e.target === modal) modal.style.display="none"; };
}

// ⚡ Splash Screen
window.addEventListener('DOMContentLoaded',init);
window.addEventListener("load",()=>{
  const splash=document.getElementById("splash");
  setTimeout(()=>{splash.classList.add("hidden");},2000);
});

// ⚡ PWA / Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered', reg);
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showToast('نسخة جديدة متاحة. أعد تحميل الصفحة لتحديث.');
          }
        });
      });
    } catch (e) {
      console.warn('SW registration failed', e);
    }
  });
}

// ⚡ تثبيت التطبيق (Install PWA)
let deferredPrompt;
const installBtn = document.getElementById('btn-install');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.style.display = 'inline-block';
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('تم تثبيت التطبيق!');
      } else {
        showToast('تم إلغاء التثبيت');
      }
      deferredPrompt = null;
    });
  }
});
