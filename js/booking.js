// تشغيل الكود بمجرد تحميل الصفحة
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('type');
    const bookingDate = params.get('date');
    const vehicle = params.get('vehicle');

    // تحديث التاريخ في واجهة الحجز
    if (bookingDate) {
        document.getElementById('display-booking-date').innerText = bookingDate;
        // ملئ حقل التاريخ المخفي في النموذج
        if(document.getElementById('pTime')) document.getElementById('pTime').value = bookingDate + "T09:00";
    }

    // معالجة نوع الخدمة في ملخص الحساب
    const label = document.getElementById('display-service-type');
    const total = document.getElementById('totalCost');

    if (serviceType === 'training') {
        label.innerText = "تعليم قيادة (تدريب)";
        total.innerText = "$25"; // سعر جلسة التدريب
        alert("🎓 لقد اخترت خدمة التدريب، سيتم توجيهك لبيانات التواصل والموقع.");
        goTo(3); // الانتقال فوراً للمرحلة الثالثة (الموقع والبيانات)
    } 
    else if (serviceType === 'cargo') {
        label.innerText = `سيارة حمل (${vehicle})`;
        total.innerText = (vehicle === 'ستوتة') ? "$15" : "$45";
        alert("🚛 لقد اخترت خدمة النقل، سيتم توجيهك لبيانات الموقع.");
        goTo(3); // توجيه مباشر للموقع
    }
};

// وظيفة إرسال الواتساب (المعدلة لتشمل الأقسام الجديدة)
function sendToWhatsapp() {
    const sType = document.getElementById('display-service-type').innerText;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const date = document.getElementById('display-booking-date').innerText;
    const coords = document.getElementById('coords').value;
    const total = document.getElementById('totalCost').innerText;

    if (!name || !phone || !address) {
        alert("يرجى إكمال الاسم، الهاتف، والموقع.");
        return;
    }

    const mapLink = coords ? `https://www.google.com/maps?q=${coords}` : "مكتوب يدوياً";

    const message = `*طلب حجز - الحوت لخدمات النقل*%0A` +
                    `----------------------------%0A` +
                    `📦 *نوع الخدمة:* ${sType}%0A` +
                    `👤 *العميل:* ${name}%0A` +
                    `📞 *الهاتف:* ${phone}%0A` +
                    `📅 *التاريخ:* ${date}%0A` +
                    `📍 *الموقع:* ${address}%0A` +
                    `🗺️ *رابط GPS:* ${mapLink}%0A` +
                    `💰 *السعر:* ${total}%0A` +
                    `----------------------------%0A` +
                    `_تم الإرسال من موقع الحوت_`;

    window.open(`https://wa.me/9647713225471?text=${message}`, '_blank');
}
