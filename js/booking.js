window.onload = function() {
    // 1. قراءة البيانات من الرابط
    const params = new URLSearchParams(window.location.search);
    const serviceType = params.get('type');
    const bookingDate = params.get('date');
    const vehicle = params.get('vehicle');
    const price = params.get('price');

    // 2. تحديث التاريخ والخدمة في ملخص الحساب
    if (bookingDate) {
        document.getElementById('display-booking-date').innerText = bookingDate;
    }

    const label = document.getElementById('display-service-type');
    const totalDisplay = document.getElementById('totalCost');

    // 3. التحقق من نوع الخدمة للقفز المباشر للخطوة الثالثة
    if (serviceType === 'training' || serviceType === 'cargo') {
        
        // تحديث النصوص والأسعار
        if (serviceType === 'training') {
            label.innerText = "كورس تعليم قيادة";
            totalDisplay.innerText = "100,000 د.ع";
        } else {
            label.innerText = `خدمة نقل (${vehicle})`;
            totalDisplay.innerText = parseInt(price).toLocaleString() + " د.ع";
        }

        // --- الجزء السحري: القفز للخطوة الثالثة ---
        
        // إخفاء كل المراحل
        document.querySelectorAll('.booking-stage').forEach(s => s.classList.remove('active'));
        
        // إظهار المرحلة الثالثة (بيانات الزبون والموقع)
        const stage3 = document.getElementById('stage3') || document.getElementById('stage-3');
        if (stage3) {
            stage3.classList.add('active');
            stage3.style.display = 'block'; // للتأكيد إذا كان هناك CSS يمنع الظهور
        }

        // تحديث شريط التقدم ليكون واصلاً للنقطة الثالثة
        document.querySelectorAll('.step-item').forEach((item, idx) => {
            if (idx <= 2) item.classList.add('active');
        });

        console.log("تم التوجيه التلقائي للمرحلة الثالثة بنجاح");
    }
};

// وظيفة جلب الموقع GPS
function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            document.getElementById('coords').value = `${lat},${lon}`;
            alert("✅ تم تحديد موقعك بنجاح!");
        }, () => {
            alert("❌ يرجى تفعيل الموقع يدوياً.");
        });
    }
}

// إرسال الطلب للواتساب
function sendToWhatsapp() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const addr = document.getElementById('address').value;
    const sType = document.getElementById('display-service-type').innerText;
    const date = document.getElementById('display-booking-date').innerText;
    const total = document.getElementById('totalCost').innerText;
    const coords = document.getElementById('coords').value;

    if (!name || !phone || !addr) {
        alert("⚠️ يرجى ملء بياناتك وموقعك أولاً");
        return;
    }

    const map = coords ? `https://www.google.com/maps?q=${coords}` : "مكتوب يدوياً";

    const msg = `*طلب حجز - شركة الحوت*%0A` +
                `----------------------------%0A` +
                `📦 *الخدمة:* ${sType}%0A` +
                `👤 *العميل:* ${name}%0A` +
                `📞 *الهاتف:* ${phone}%0A` +
                `📍 *الموقع:* ${addr}%0A` +
                `🗺️ *الخريطة:* ${map}%0A` +
                `📅 *التاريخ:* ${date}%0A` +
                `💰 *المبلغ:* ${total}%0A` +
                `----------------------------%0A` +
                `_يرجى التواصل لتأكيد الحجز_`;

    window.open(`https://wa.me/9647713225471?text=${msg}`, '_blank');
}
