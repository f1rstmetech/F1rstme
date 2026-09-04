const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const defaults=[
{id:"s26-ultra",brand:"Samsung",name:"Galaxy S26 Ultra",price:139999,image:"",release:"2026",rating:9.3,specs:{display:"6.9-inch AMOLED",processor:"Snapdragon flagship",ram:"12GB",storage:"256GB",rearCamera:"200MP + 50MP",frontCamera:"12MP",battery:"5000mAh",charging:"65W",os:"Android",network:"5G"},pros:["Excellent display","Powerful performance","Versatile cameras"],cons:["Large and heavy"]},
{id:"iphone-18-pro",brand:"Apple",name:"iPhone 18 Pro",price:129900,image:"",release:"2026",rating:9.1,specs:{display:"6.3-inch OLED",processor:"A20 Pro",ram:"12GB",storage:"256GB",rearCamera:"48MP system",frontCamera:"12MP",battery:"All-day",charging:"Fast",os:"iOS",network:"5G"},pros:["Performance","Video quality","Long software support"],cons:["Premium price"]},
{id:"xiaomi-18-pro",brand:"Xiaomi",name:"Xiaomi 18 Pro",price:79999,image:"",release:"2026",rating:8.8,specs:{display:"6.7-inch AMOLED",processor:"Snapdragon flagship",ram:"12GB",storage:"256GB",rearCamera:"50MP system",frontCamera:"32MP",battery:"6000mAh",charging:"90W",os:"Android",network:"5G"},pros:["Battery","Fast charging","Value"],cons:["Software preference varies"]},
{id:"pixel-11-pro",brand:"Google",name:"Pixel 11 Pro",price:109999,image:"",release:"2026",rating:8.9,specs:{display:"6.3-inch OLED",processor:"Tensor",ram:"12GB",storage:"256GB",rearCamera:"50MP system",frontCamera:"12MP",battery:"5000mAh",charging:"Fast",os:"Android",network:"5G"},pros:["Clean Android","Computational photography"],cons:["Charging speed"]}];
let devices=JSON.parse(localStorage.f1_devices||"null")||defaults;
let reviews=JSON.parse(localStorage.f1_reviews||"null")||[
{title:"Galaxy S26 Ultra Review",model:"Galaxy S26 Ultra",rating:9.3,body:"A premium flagship focused on display, cameras, performance and productivity."},
{title:"iPhone 18 Pro Review",model:"iPhone 18 Pro",rating:9.1,body:"A polished Pro experience with strong performance, video and ecosystem integration."},
{title:"Xiaomi 18 Pro Review",model:"Xiaomi 18 Pro",rating:8.8,body:"An aggressive flagship package with a large battery and very fast charging."}];
let social=JSON.parse(localStorage.f1_social||"null")||{instagram:F1RSTME_CONFIG.INSTAGRAM_URL,youtube:F1RSTME_CONFIG.YOUTUBE_URL};
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN")}
function imageBlock(item,cls=""){return item.image?`<div class="${cls}"><img src="${esc(item.image)}" alt="${esc(item.name||"")}"></div>`:`<div class="${cls}">F1</div>`}
function renderDevices(limit=8){const grid=document.getElementById("deviceGrid");if(!grid)return;grid.innerHTML=devices.slice(0,limit).map(d=>`<article class="device-card"><a href="./product.html?id=${encodeURIComponent(d.id)}">${imageBlock(d,"device-image")}<small>${esc(d.brand)}</small><h3>${esc(d.name)}</h3><div class="price">${money(d.price)}</div><p>View full specifications →</p></a></article>`).join("")}
function renderReviews(){const g=document.getElementById("reviewGrid");if(!g)return;g.innerHTML=reviews.map(r=>`<article class="review-card"><small>F1RSTME REVIEW</small><h3>${esc(r.title)}</h3><b>${esc(r.rating)}/10</b><p>${esc(r.body)}</p><a href="./product.html?id=${encodeURIComponent((devices.find(d=>d.name===r.model)||{}).id||"")}">VIEW DEVICE →</a></article>`).join("")}
const sampleNews=[
["New smartphone launches to watch","A new wave of flagship and mid-range devices is changing the 2026 buying landscape."],
["AI becomes a bigger part of everyday devices","On-device AI is moving deeper into phones, laptops and consumer gadgets."],
["What to check before buying a new phone","Compare the processor, display, cameras, battery, software support and India price before you buy."]
];
function renderNews(){const g=document.getElementById("newsGrid");if(!g)return;g.innerHTML=sampleNews.map(n=>`<article class="news-card"><div class="news-image">F1</div><h3>${esc(n[0])}</h3><p>${esc(n[1])}</p><a href="#devices">READ MORE ↗</a></article>`).join("")}
function fillSelects(){const a=document.getElementById("compareA"),b=document.getElementById("compareB");if(!a||!b)return;const opts=devices.map((d,i)=>`<option value="${i}">${esc(d.name)}</option>`).join("");a.innerHTML=b.innerHTML=opts;b.selectedIndex=Math.min(1,devices.length-1)}
function compare(){const a=devices[+compareA.value],b=devices[+compareB.value];const keys=["display","processor","ram","storage","rearCamera","frontCamera","battery","charging","os","network"];compareResult.innerHTML=`<div class="spec-table"><div><b>SPEC</b></div><div><b>${esc(a.name)}</b></div><div><b>${esc(b.name)}</b></div>${keys.map(k=>`<div>${k}</div><div>${esc(a.specs?.[k]||"—")}</div><div>${esc(b.specs?.[k]||"—")}</div>`).join("")}<div>India price</div><div>${money(a.price)}</div><div>${money(b.price)}</div></div>`}
function renderProductPage(){const p=document.getElementById("productPage");if(!p)return;const id=new URLSearchParams(location.search).get("id");const d=devices.find(x=>x.id===id)||devices[0];if(!d){p.innerHTML="<section class='section'><h1>Device not found.</h1></section>";return}const keys=[["display","Display"],["processor","Processor"],["ram","RAM"],["storage","Storage"],["rearCamera","Rear camera"],["frontCamera","Front camera"],["battery","Battery"],["charging","Charging"],["os","Operating system"],["network","Network"]];p.innerHTML=`<section class="product-hero"><div class="product-photo">${d.image?`<img src="${esc(d.image)}" alt="${esc(d.name)}">`:"F1"}</div><div class="product-info"><small>${esc(d.brand)} / ${esc(d.release||"Latest")}</small><h1>${esc(d.name)}</h1><p>F1RSTME TECH rating: <b>${esc(d.rating||"—")}/10</b></p><div class="price">${money(d.price)}</div><a class="btn dark" href="index.html#compare">COMPARE THIS DEVICE ↗</a></div></section><section class="spec-section"><h2>Full specifications.</h2><div class="product-specs">${keys.map(k=>`<div><small>${k[1]}</small><br><b>${esc(d.specs?.[k[0]]||"—")}</b></div>`).join("")}</div><div class="proscons"><div><h3>Pros</h3><ul>${(d.pros||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div><h3>Cons</h3><ul>${(d.cons||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div></section>`}
async function loadAutoNews(){if(!F1RSTME_CONFIG.NEWS_ENDPOINT)return;try{const r=await fetch(F1RSTME_CONFIG.NEWS_ENDPOINT);const j=await r.json();if(!j.articles?.length)return;const g=document.getElementById("newsGrid");g.innerHTML=j.articles.slice(0,9).map(a=>`<article class="news-card">${a.image?`<div class="news-image"><img src="${esc(a.image)}" alt=""></div>`:`<div class="news-image">F1</div>`}<small>${esc(a.source||"TECH NEWS")}</small><h3>${esc(a.title)}</h3><p>${esc(a.description||"")}</p><a href="${esc(a.url)}" target="_blank" rel="noopener">READ SOURCE ↗</a></article>`).join("")}catch(e){}}
if(document.getElementById("deviceGrid")){
renderDevices();renderReviews();renderNews();fillSelects();
const compareNow=document.getElementById("compareNow"),refreshNews=document.getElementById("refreshNews"),
searchBtn=document.getElementById("searchBtn"),searchClose=document.getElementById("searchClose"),
menuBtn=document.getElementById("menuBtn"),menuClose=document.getElementById("menuClose"),
youtubeLink=document.getElementById("youtubeLink"),instagramLink=document.getElementById("instagramLink"),
searchInput=document.getElementById("searchInput"),searchResults=document.getElementById("searchResults"),
searchPanel=document.getElementById("searchPanel"),menuPanel=document.getElementById("menuPanel");
if(compareNow)compareNow.onclick=compare;
if(refreshNews)refreshNews.onclick=()=>{renderNews();loadAutoNews()};
if(searchBtn)searchBtn.onclick=()=>searchPanel?.classList.add("open");
if(searchClose)searchClose.onclick=()=>searchPanel?.classList.remove("open");
if(menuBtn)menuBtn.onclick=()=>menuPanel?.classList.add("open");
if(menuClose)menuClose.onclick=()=>menuPanel?.classList.remove("open");
if(youtubeLink)youtubeLink.href=social.youtube;
if(instagramLink)instagramLink.href=social.instagram;
if(searchInput)searchInput.oninput=()=>{
const q=searchInput.value.toLowerCase();
searchResults.innerHTML=devices.filter(d=>(d.name+" "+d.brand).toLowerCase().includes(q))
.map(d=>`<div class="search-item"><a href="./product.html?id=${encodeURIComponent(d.id)}"><b>${esc(d.name)}</b><br>${money(d.price)} →</a></div>`).join("")
};
loadAutoNews()
}
