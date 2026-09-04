const $=id=>document.getElementById(id);
let devices=JSON.parse(localStorage.f1_devices||"null")||[];
let reviews=JSON.parse(localStorage.f1_reviews||"null")||[];
let social=JSON.parse(localStorage.f1_social||"null")||{instagram:"https://instagram.com/",youtube:"https://youtube.com/"};
function save(){localStorage.f1_devices=JSON.stringify(devices);localStorage.f1_reviews=JSON.stringify(reviews);localStorage.f1_social=JSON.stringify(social)}
$("login").onclick=()=>{localStorage.f1_admin="1";$("loginCard").classList.add("hidden");$("dashboard").classList.remove("hidden")};
$("logout").onclick=()=>{localStorage.removeItem("f1_admin");location.reload()};
if(localStorage.f1_admin){$("loginCard").classList.add("hidden");$("dashboard").classList.remove("hidden")}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab-panel").forEach(x=>x.classList.add("hidden"));$(b.dataset.tab).classList.remove("hidden")});
$("saveModel").onclick=()=>{let specs={};try{specs=JSON.parse($("modelSpecs").value||"{}")}catch{alert("Specs JSON is invalid.");return}
let name=$("modelName").value.trim();if(!name){alert("Enter model name.");return}
devices.unshift({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now(),brand:$("modelBrand").value,name,price:+$("modelPrice").value||0,image:$("modelImage").value,release:$("modelRelease").value,rating:+$("modelRating").value||0,specs,pros:$("modelPros").value.split("\n").filter(Boolean),cons:$("modelCons").value.split("\n").filter(Boolean)});save();render();alert("Device saved.");};
$("saveReview").onclick=()=>{reviews.unshift({title:$("reviewTitle").value,model:$("reviewModel").value,rating:+$("reviewRating").value||0,body:$("reviewBody").value});save();render();alert("Review saved.")};
$("saveSocial").onclick=()=>{social={instagram:$("instagram").value,youtube:$("youtube").value};save();alert("Social links saved.")};
$("saveNews").onclick=()=>{localStorage.f1_news_endpoint=$("newsEndpoint").value;alert("Saved. Add this endpoint to config.js for the public site.")};
function render(){ $("modelList").innerHTML=devices.map((d,i)=>`<div class="list-item"><span><b>${d.brand||""} ${d.name}</b><br>₹${Number(d.price||0).toLocaleString("en-IN")}</span><button onclick="removeDevice(${i})">DELETE</button></div>`).join("");$("reviewList").innerHTML=reviews.map((r,i)=>`<div class="list-item"><span><b>${r.title}</b><br>${r.rating}/10</span><button onclick="removeReview(${i})">DELETE</button></div>`).join("")}
window.removeDevice=i=>{devices.splice(i,1);save();render()};window.removeReview=i=>{reviews.splice(i,1);save();render()};render();
