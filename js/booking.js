let selectedCar = null;
let totalPrice = 0;

function goToPhase(phaseNum) {
    document.querySelectorAll('.booking-phase').forEach(p => p.classList.add('hidden'));
    document.getElementById('phase' + phaseNum).classList.remove('hidden');
    
    // تحديث شريط التقدم
    document.querySelectorAll('.step').forEach((s, idx) => {
        if(idx < phaseNum) s.classList.add('active');
    });
}

function selectCar(name, price) {
    selectedCar = name;
    totalPrice = price;
    document.getElementById('total-price').innerText = totalPrice;
    goToPhase(2);
}

function sendToWhatsApp() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const companyPhone = "+9647713225471";
    
    const message = `طلب حجز من موقع الحوت 🐋%0A
---------------------------%0A
الاسم: ${name}%0A
الهاتف: ${phone}%0A
السيارة: ${selectedCar}%0A
الإجمالي: ${totalPrice} IQD%0A
طريقة الدفع: نقداً عند الاستلام`;

    window.open(`https://wa.me/${companyPhone}?text=${message}`, '_blank');
}

// محاكاة بيانات السيارات
const cars = [
    {name: "رينج روفر (فاخرة)", price: 150000, img: "car1.jpg"},
    {name: "تويوتا كورولا (اقتصادية)", price: 50000, img: "car2.jpg"}
];

// عرض السيارات عند التحميل
const carList = document.getElementById('car-list');
cars.forEach(car => {
    carList.innerHTML += `
        <div class="car-card">
            <h3>${car.name}</h3>
            <p>السعر اليومي: ${car.price} IQD</p>
            <button onclick="selectCar('${car.name}', ${car.price})" class="btn-gold">احجز الآن</button>
        </div>
    `;
});
