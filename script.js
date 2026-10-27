const products = [
  {id:1,name:"Aurelius Gold",category:"watch",categoryName:"ЧАСЫ",price:24900,tag:"БЕСТСЕЛЛЕР",desc:"Классический силуэт, тёплое золото и циферблат цвета слоновой кости.",details:"Aurelius Gold — классические часы с выразительным золотистым корпусом и спокойным светлым циферблатом. Универсальный акцент для повседневного образа и особых случаев.",art:"art-watch art-gold",featured:1},
  {id:2,name:"Noir Minimal",category:"watch",categoryName:"ЧАСЫ",price:18900,tag:"НОВИНКА",desc:"Чистые линии и глубокий чёрный — ничего лишнего.",details:"Noir Minimal создан для тех, кто выбирает сдержанность. Тёмный циферблат, лаконичный корпус и минималистичный дизайн легко сочетаются с любым стилем.",art:"art-watch art-black",featured:2},
  {id:3,name:"Meridian Silver",category:"watch",categoryName:"ЧАСЫ",price:21900,tag:"ИЗБРАННОЕ",desc:"Холодный блеск металла и светлый циферблат.",details:"Meridian Silver сочетает современный металлический оттенок с классическими пропорциями. Сдержанный дизайн для тех, кто ценит точность формы.",art:"art-watch art-silver",featured:3},
  {id:4,name:"Studio Calendar",category:"calendar",categoryName:"КАЛЕНДАРЬ",price:3900,tag:"ДЛЯ РАБОЧЕГО СТОЛА",desc:"Настольный календарь, который помогает держать фокус.",details:"Studio Calendar — компактный настольный календарь с крупной типографикой и спокойной палитрой. Создан для рабочего стола, домашнего кабинета и творческого пространства.",art:"art-calendar art-calendar-dark",featured:4},
  {id:5,name:"Olive Perpetual",category:"calendar",categoryName:"КАЛЕНДАРЬ",price:4500,tag:"ДИЗАЙН-ОБЪЕКТ",desc:"Оливковый акцент и тактильные материалы.",details:"Olive Perpetual добавляет рабочему пространству природный оттенок. Лаконичная форма и контрастные детали делают календарь выразительным, но не отвлекающим.",art:"art-calendar art-calendar-olive",featured:5},
  {id:6,name:"Monochrome Desk",category:"calendar",categoryName:"КАЛЕНДАРЬ",price:4200,tag:"МИНИМАЛИЗМ",desc:"Графичная классика для собранного пространства.",details:"Monochrome Desk — минималистичный настольный календарь в монохромной гамме. Чёткая сетка и спокойный дизайн помогают организовать день.",art:"art-calendar art-calendar-black",featured:6}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB",maximumFractionDigits:0}).format(n);
let activeCategory = "all";
let sortMode = "featured";
let cart = loadCart();
let toastTimer;

function loadCart(){
  try {
    const parsed = JSON.parse(localStorage.getItem("chronoCart23") || "[]");
    return Array.isArray(parsed) ? parsed.filter(x => products.some(p => p.id === Number(x.id)) && Number(x.qty) > 0).map(x => ({id:Number(x.id),qty:Math.min(99,Math.floor(Number(x.qty)))})) : [];
  } catch { return []; }
}
function saveCart(){ try { localStorage.setItem("chronoCart23",JSON.stringify(cart)); } catch(e) { console.warn("Не удалось сохранить корзину",e); } }
function productArt(p){
  if(p.category === "watch"){
    const cls = p.art.includes("black") ? "art-black" : p.art.includes("silver") ? "art-silver" : "";
    const green = p.art.includes("green");
    return `<div class="product-art art-watch ${cls} ${green?"art-green":""}"><div class="mini-strap top"></div><div class="mini-strap bottom"></div><div class="mini-case"><div class="mini-dial"><i class="mini-pin"></i></div></div></div>`;
  }
  const month = p.id === 5 ? "MAY" : p.id === 6 ? "JUNE" : "APRIL";
  const days = Array.from({length:35},(_,i)=>`<span>${i<3?"":i-2}</span>`).join("");
  return `<div class="product-art ${p.art}"><div class="mini-calendar"><div class="calendar-top"><i></i><i></i></div><div class="calendar-paper"><div class="calendar-month">${month}</div><div class="calendar-days">${days}</div></div><div class="calendar-base"></div></div></div>`;
}
function renderProducts(){
  let list = products.filter(p => activeCategory === "all" || p.category === activeCategory);
  if(sortMode === "price-asc") list.sort((a,b)=>a.price-b.price);
  if(sortMode === "price-desc") list.sort((a,b)=>b.price-a.price);
  if(sortMode === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  if(sortMode === "featured") list.sort((a,b)=>a.featured-b.featured);
  $("#productGrid").innerHTML = list.map(p=>`<article class="product-card">
    <div class="product-visual" data-details="${p.id}" tabindex="0" role="button" aria-label="Подробнее о товаре ${p.name}">
      <span class="product-tag">${p.tag}</span>${productArt(p)}
      <button class="quick-view" data-details="${p.id}">СМОТРЕТЬ ПОДРОБНЕЕ ↗</button>
    </div>
    <div class="product-info"><div class="product-meta"><span class="category-mark">${p.categoryName}</span><span>№ 0${p.id}</span></div>
      <h3 class="product-name">${p.name}</h3><p class="product-desc">${p.desc}</p>
      <div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-button" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">+</button></div>
    </div></article>`).join("");
  $("#visibleCount").textContent = String(list.length).padStart(2,"0");
  $("#shownCount").textContent = String(list.length).padStart(2,"0");
}
function cartCount(){ return cart.reduce((sum,x)=>sum+x.qty,0); }
function cartTotal(){ return cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0); }
function renderCart(){
  $("#cartCount").textContent = cartCount();
  $("#cartHeadingCount").textContent = `(${cartCount()})`;
  $("#cartItems").innerHTML = cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-line"><div class="cart-thumb">${productArt(p)}</div><div class="cart-line-info"><h3>${p.name}</h3><small>${money(p.price)} / шт.</small><div class="qty-controls"><button data-qty="${p.id}" data-change="-1" aria-label="Уменьшить количество">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Увеличить количество">+</button></div></div><div class="cart-line-end"><strong>${money(p.price*item.qty)}</strong><button class="remove-item" data-remove="${p.id}">Удалить</button></div></div>`;
  }).join("");
  const empty = cart.length===0;
  $("#cartEmpty").hidden = !empty;
  $("#cartSummary").hidden = empty;
  $("#cartItems").hidden = empty;
  $("#cartTotal").textContent = money(cartTotal());
  $("#checkoutTotal").textContent = money(cartTotal());
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item){ if(item.qty>=99){showToast("Достигнуто максимальное количество");return;} item.qty++; }
  else cart.push({id,qty:1});
  saveCart();renderCart();showToast("Добавлено в корзину");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);if(item.qty>99)item.qty=99;
  saveCart();renderCart();
}
function showToast(message){
  const el=$("#toast");el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function openCart(){
  $("#overlay").hidden=false;$("#cartDrawer").hidden=false;document.body.classList.add("locked");renderCart();$("#closeCart").focus();
}
function closePanels(){
  $("#overlay").hidden=true;$("#cartDrawer").hidden=true;$("#productModal").hidden=true;$("#checkoutModal").hidden=true;document.body.classList.remove("locked");
}
function openProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  $("#modalContent").innerHTML=`<div class="product-modal-layout"><div class="modal-visual">${productArt(p)}</div><div class="modal-copy"><div class="section-kicker">${p.categoryName} / CHRONOSTYLE</div><h2 id="modalTitle">${p.name}</h2><p>${p.details}</p><div class="modal-price">${money(p.price)}</div><button class="button button-gold" data-modal-add="${p.id}">Добавить в корзину <span>↗</span></button></div></div>`;
  $("#overlay").hidden=false;$("#productModal").hidden=false;document.body.classList.add("locked");
}
function openCheckout(){
  if(cart.length===0){showToast("Сначала добавьте товары в корзину");return;}
  $("#cartDrawer").hidden=true;$("#checkoutTotal").textContent=money(cartTotal());$("#checkoutModal").hidden=false;$("#overlay").hidden=false;document.body.classList.add("locked");
}
$$(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
  activeCategory=btn.dataset.category;
  $$(".filter-btn").forEach(b=>b.classList.toggle("active",b===btn));renderProducts();
}));
$("#sortSelect").addEventListener("change",e=>{sortMode=e.target.value;renderProducts();});
$("#productGrid").addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return;}
  const details=e.target.closest("[data-details]");if(details)openProduct(Number(details.dataset.details));
});
$("#productGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".product-visual")){e.preventDefault();openProduct(Number(e.target.dataset.details));}});
$("#modalContent").addEventListener("click",e=>{const btn=e.target.closest("[data-modal-add]");if(btn){addToCart(Number(btn.dataset.modalAdd));closePanels();}});
$("#openCart").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closePanels);
$("#overlay").addEventListener("click",closePanels);
$("#continueShopping").addEventListener("click",()=>{closePanels();$("#catalog").scrollIntoView({behavior:"smooth"});});
$("#cartItems").addEventListener("click",e=>{
  const q=e.target.closest("[data-qty]");if(q){changeQty(Number(q.dataset.qty),Number(q.dataset.change));return;}
  const r=e.target.closest("[data-remove]");if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));saveCart();renderCart();showToast("Товар удалён");}
});
$("#checkoutButton").addEventListener("click",openCheckout);
$("#checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();if(!e.currentTarget.reportValidity())return;
  const orderNumber="CS-"+Date.now().toString().slice(-6);
  cart=[];saveCart();renderCart();closePanels();e.currentTarget.reset();
  showToast(`Демо-заказ ${orderNumber} оформлен. Оплата не производится.`);
});
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();if(!e.currentTarget.reportValidity())return;
  e.currentTarget.reset();showToast("Спасибо! Форма проверена в демонстрационном режиме.");
});
$$("[data-close-modal]").forEach(btn=>btn.addEventListener("click",closePanels));
$("#menuToggle").addEventListener("click",()=>{
  const opened=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(opened));
});
$$(".nav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanels();});
renderProducts();renderCart();
