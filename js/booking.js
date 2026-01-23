const steps = document.querySelectorAll(".step-card");
const indicators = document.querySelectorAll(".step");
let current = 0;
let basePrice = 70;
let total = basePrice;

function updateSteps() {
  steps.forEach((s,i)=>s.classList.toggle("active", i===current));
  indicators.forEach((s,i)=>s.classList.toggle("active", i<=current));
}

document.querySelectorAll(".next").forEach(btn=>{
  btn.onclick = ()=>{ current++; updateSteps(); }
});

document.querySelectorAll(".back").forEach(btn=>{
  btn.onclick = ()=>{ current--; updateSteps(); }
});

document.querySelectorAll(".addon input").forEach(cb=>{
  cb.onchange = ()=>{
    total = basePrice;
    document.querySelectorAll(".addon input:checked")
      .forEach(c=> total += +c.dataset.price);
    document.getElementById("total").innerText = total;
  };
});
