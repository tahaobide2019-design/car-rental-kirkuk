// عند تحميل صفحة الحجز
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const date = params.get('date');
    const vehicle = params.get('vehicle');
    const price = params.get('price');

    // 1. تحديث التاريخ والخدمة في الواجهة
    if (date) document.getElementById('display-booking-date').innerText = date;
    
    const label = document.getElementById('display-service-type');
    const total = document.getElementById('totalCost');

    // 2. معالجة القفز المباشر لبيانات الزبون
    if (type === 'training') {
        label.innerText = "كورس تدريب قيادة";
        total.innerText = "100,000 د.ع";
        if(typeof goTo === 'function') goTo(3); // القفز لخانة البيانات
    } 
    else if (type === 'cargo') {
        label.innerText = `سيارة حمل (${vehicle})`;
        total.innerText = parseInt(price).toLocaleString() + " د.ع";
        if(typeof goTo === 'function') goTo(3); // القفز لخانة البيانات
    }
};

// وظيفة جلب الموقع GPS
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            document.getElementById('coords').value = `${lat},${lon}`;
            alert("✅ تم تحديد موقعك بدقة عبر الأقمار الصناعية.");
        }, () => {
            alert("❌ يرجى تفعيل الـ GPS أو كتابة العنوان يدوياً.");
        });
    }
}

// وظيفة إرسال الواتساب النهائية
function sendToWhatsapp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const addr = document.getElementById('address').value;
    const sType = document.getElementById('display-service-type').innerText;
    const date = document.getElementById('display-booking-date').innerText;
    const total = document.getElementById('totalCost').innerText;
    const coords = document.getElementById('coords').value;

    if (!name || !phone || !addr) {
        alert("⚠️ فضلاً، نحتاج اسمك ورقمك وعنوانك لإتمام الطلب.");
        return;
    }

    const map = coords ? `https://maps.google.com/maps?q=${coords}` : "مكتوب يدوياً";

    const msg = `*طلب حجز من موقع الحوت*%0A` +
                `----------------------------%0A` +
                `📦 *الخدمة:* ${sType}%0A` +
                `👤 *العميل:* ${name}%0A` +
                `📞 *الهاتف:* ${phone}%0A` +
                `📍 *الموقع:* ${addr}%0A` +
                `🗺️ *الخريطة:* ${map}%0A` +
                `📅 *التاريخ:* ${date}%0A` +
                `💰 *المبلغ:* ${total}%0A` +
                `----------------------------%0A` +
                `_يرجى التواصل لتأكيد الموعد_`;

    window.open(`https://wa.me/9647713225471?text=${msg}`, '_blank');
}
