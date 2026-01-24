let currentStage = 1;
const carPrice = 120; // ثابت كمثال
let extrasTotal = 0;

function nextStage(stage) {
    // إخفاء المرحلة الحالية
    document.querySelectorAll('.booking-stage').forEach(s => s.classList.remove('active'));
    // تحديث شريط التقدم
    document.querySelectorAll('.step-item').forEach((item, index) => {
        if(index + 1 <= stage) item.classList.add('active');
        else item.classList.remove('active');
    });
    // إظهار المرحلة الجديدة
    document.getElementById(`stage-${stage}`).classList.add('active');
    currentStage = stage;
}

function updateTotal() {
    extrasTotal = 0;
    const checkboxes = document.querySelectorAll('input[name="extra"]:checked');
    checkboxes.forEach(cb => {
        if(cb.value === 'delivery') extrasTotal += 20;
        if(cb.value === 'driver') extrasTotal += 50;
    });
    
    document.getElementById('summary-extras').innerText = `$${extrasTotal}`;
    document.getElementById('total-price').innerText = `$${carPrice + extrasTotal}`;
}

function finalizeBooking() {
    const name = document.getElementById('cust_name').value;
    const phone = document.getElementById('cust_phone').value;
    
    if(!name || !phone) {
        alert("يرجى ملء البيانات الشخصية أولاً");
        return;
    }

    const message = `*طلب حجز جديد من موقع الحوت*%0A` +
                    `--------------------------%0A` +
                    `*الاسم:* ${name}%0A` +
                    `*الهاتف:* ${phone}%0A` +
                    `*السيارة:* شيفروليه كورفيت 2024%0A` +
                    `*الإضافات:* ${extrasTotal}$%0A` +
                    `*الإجمالي النهائي:* ${carPrice + extrasTotal}$%0A` +
                    `--------------------------%0A` +
                    `يرجى تأكيد الحجز لاستلام المستندات.`;

    const whatsappUrl = `https://wa.me/9647713225471?text=${message}`;
    window.open(whatsappUrl, '_blank');
}
