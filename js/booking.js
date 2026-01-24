let currentStep = 1;
const basePrice = 180;
let extras = 0;

// التنقل بين المراحل
function goTo(step) {
    // إخفاء الكل وإظهار الهدف
    document.querySelectorAll('.booking-stage').forEach(s => s.classList.remove('active'));
    document.getElementById(`stage${step}`).classList.add('active');
    
    // تحديث شريط التقدم
    document.querySelectorAll('.step-item').forEach((item, idx) => {
        if (idx + 1 <= step) item.classList.add('active');
        else item.classList.remove('active');
    });
    
    currentStep = step;
}

// حساب التكاليف
function calc() {
    extras = 0;
    const checks = document.querySelectorAll('input[name="srv"]:checked');
    checks.forEach(c => {
        if (c.value === "سائق") extras += 50;
        if (c.value === "توصيل") extras += 20;
    });
    
    document.getElementById('extraCost').innerText = `$${extras}`;
    document.getElementById('totalCost').innerText = `$${basePrice + extras}`;
}

// جلب الموقع الجغرافي GPS
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                document.getElementById('coords').value = `${lat},${lon}`;
                alert("✅ تم التقاط موقعك الجغرافي بنجاح!");
            },
            (err) => {
                alert("❌ فشل تحديد الموقع، يرجى تفعيل الـ GPS أو كتابة العنوان يدوياً.");
            }
        );
    } else {
        alert("متصفحك لا يدعم تحديد الموقع.");
    }
}

// إرسال البيانات للواتساب
function sendToWhatsapp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const coords = document.getElementById('coords').value;
    const pTime = document.getElementById('pTime').value;
    const rTime = document.getElementById('rTime').value;

    if (!name || !phone || !address) {
        alert("لطفاً، أكمل بياناتك وعنوانك أولاً.");
        return;
    }

    // بناء رابط الخريطة إذا توفرت الإحداثيات
    const mapLink = coords ? `https://www.google.com/maps?q=${coords}` : "لم يتم التحديد (العنوان نصي)";

    const message = `*طلب حجز جديد - شركة الحوت* %0A` +
                    `----------------------------%0A` +
                    `👤 *العميل:* ${name}%0A` +
                    `📞 *الهاتف:* ${phone}%0A` +
                    `📍 *العنوان:* ${address}%0A` +
                    `🗺️ *موقع GPS:* ${mapLink}%0A` +
                    `----------------------------%0A` +
                    `🚗 *السيارة:* BMW M4 Competition%0A` +
                    `📅 *الاستلام:* ${pTime}%0A` +
                    `📅 *الإرجاع:* ${rTime}%0A` +
                    `💰 *الإجمالي:* ${basePrice + extras}$%0A` +
                    `----------------------------%0A` +
                    `_يرجى مراجعة المستندات عند التسليم_`;

    const waURL = `https://wa.me/9647713225471?text=${message}`;
    window.open(waURL, '_blank');
}
