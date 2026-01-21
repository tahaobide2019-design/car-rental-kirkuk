
let price=40;
function calc(){
let days=document.getElementById('days').value;
document.getElementById('total').innerText='السعر الكلي: '+(days*price)+'$';
}
function send(){
let name=document.getElementById('name').value;
let phone=document.getElementById('phone').value;
let msg=`طلب حجز سيارة%0Aالاسم: ${name}%0Aالهاتف: ${phone}`;
window.location.href=`https://wa.me/9647713225471?text=${msg}`;
}
