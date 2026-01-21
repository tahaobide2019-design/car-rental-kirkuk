
fetch('data/cars.json').then(r=>r.json()).then(cars=>{
let c=document.getElementById('cars');
cars.forEach(car=>{
c.innerHTML+=`<div><h3>${car.name}</h3><p>${car.price}$/يوم</p><a href="booking.html">احجز</a></div>`
})
})
