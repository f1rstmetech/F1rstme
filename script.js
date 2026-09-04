const menu=document.getElementById('menuPanel'), overlay=document.getElementById('overlay'), cart=document.getElementById('cart');
document.getElementById('menuBtn').onclick=()=>{menu.classList.add('open');overlay.classList.add('show')};
document.getElementById('closeMenu').onclick=()=>{menu.classList.remove('open');overlay.classList.remove('show')};
document.getElementById('cartBtn').onclick=()=>{cart.classList.add('open');overlay.classList.add('show')};
document.getElementById('closeCart').onclick=()=>{cart.classList.remove('open');overlay.classList.remove('show')};
overlay.onclick=()=>{menu.classList.remove('open');cart.classList.remove('open');overlay.classList.remove('show')};
document.querySelectorAll('.menu-panel a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');overlay.classList.remove('show')});

let bag=[];
document.querySelectorAll('.add-btn,.quick-add').forEach(btn=>btn.onclick=()=>{
  const card=btn.closest('.product'); addToBag(card.dataset.name,Number(card.dataset.price));
});
function addToBag(name,price){bag.push({name,price});renderBag();cart.classList.add('open');overlay.classList.add('show')}
function renderBag(){
  document.getElementById('cartCount').textContent=bag.length;
  const el=document.getElementById('cartItems');
  if(!bag.length){el.innerHTML='<p class="empty">Your bag is empty.</p>'}
  else el.innerHTML=bag.map((x,i)=>`<div class="cart-row"><div>${x.name}<small>₹${x.price.toLocaleString('en-IN')}</small></div><button onclick="removeItem(${i})" style="border:0;background:none;cursor:pointer">×</button></div>`).join('');
  document.getElementById('cartTotal').textContent='₹'+bag.reduce((s,x)=>s+x.price,0).toLocaleString('en-IN');
}
function removeItem(i){bag.splice(i,1);renderBag()}
function checkout(){if(!bag.length)return alert('Your bag is empty.');alert('Demo checkout — connect your payment gateway and WhatsApp/order system here.')}
function subscribe(e){e.preventDefault();document.getElementById('formNote').textContent='Thank you — you are on the list.';document.getElementById('email').value='';return false}
