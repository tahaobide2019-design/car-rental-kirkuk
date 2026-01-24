/**
 * Project: Al-Hout Car Rental - Booking Engine
 * Features: Multi-stage navigation, Live Price Calc, GPS Tracking, WhatsApp Integration
 */

let currentStep = 1;
const basePrice = 180; // سعر السيارة الافتراضي
let extras = 0;

// 1. وظيفة التنقل بين المراحل (Wizard Navigation)
function goTo(step) {
    // إخفاء جميع المراحل
    document.querySelectorAll('.booking-stage').forEach(stage => {
        stage.classList.remove('active');
    });
    
    // إظهار المرحلة المطلوبة
    document.getElementById(`stage${step}`).classList.add('active');
    
    // تحديث شكل شريط التقدم (Progress Bar)
    document.querySelectorAll('.step-item').forEach((item, idx) => {
        if (idx + 1 <= step) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    currentStep = step;
    // التمرير لأعلى الصفحة عند الانتقال
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. وظيفة حساب التكاليف الحية (Live Price Calculation)
function calc() {
    extras = 0;
    const checkboxes = document.querySelectorAll('input[name="srv"]:checked');
    
    checkboxes.forEach(cb => {
        if (cb.value === "سائق") extras += 50;
        if (cb.value === "توصيل") extras += 20;
    });
    
    // تحديث العناصر في واجهة المستخدم
    document.getElementById('extraCost').innerText = `$${extras}`;
    document.getElementById('totalCost').innerText = `$${basePrice + extras}`;
}

// 3. وظيفة جلب الموقع الجغرافي (GPS Geolocation)
function fetchLocation() {
    if (navigator.geolocation) {
        // إظهار حالة التحميل
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد موقعك...';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                document.getElementById('coords').value = `${lat},${lon}`;
                btn.innerHTML = '<i class="fas fa-check-circle"></i> تم تحديد الموقع بنجاح';
                btn.classList.replace('bg-whale', 'bg-green-600');
                alert("✅ رائع! تم التقاط إحداثيات موقعك بدقة، سيتم إرسالها مع طلبك.");
            },
            (err) => {
                btn.innerHTML = originalText;
                alert("❌ عذراً، لم نتمكن من الوصول للموقع. يرجى تفعيل الـ GPS في هاتفك أو كتابة العنوان يدوياً.");
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else {
        alert("المتصفح لا يدعم خاصية تحديد الموقع.");
    }
}

// 4. الوظيفة النهائية: إرسال الطلب إلى واتساب (WhatsApp Logic)
function sendToWhatsapp() {
    // جلب قيم المدخلات
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const coords = document.getElementById('coords').value;
    const pTime = document.getElementById('pTime').value;
    const rTime = document.getElementById('rTime').value;
    const fileInput = document.querySelector('input[type="file"]');

    // التحقق من الحقول الأساسية
    if (!name || !phone || !address) {
        alert("لطفاً، يجب إكمال بيانات الاسم، الهاتف، وعنوان التسليم قبل الإرسال.");
        return;
    }

    // تنبيه المستخدم بخصوص صور المستندات (لأن واتساب لا يدعم إرسالها عبر الرابط تلقائياً)
    let fileMessage = "لم يتم اختيار صور";
    if (fileInput.files.length > 0) {
        fileMessage = `تم تجهيز عدد (${fileInput.files.length}) صورة للمستندات`;
        alert("سيتم الآن فتح الواتساب لإرسال الطلب.\n\n⚠️ هام جداً: بعد إرسال النص، يرجى الضغط على زر المرفقات في واتساب وإرسال صور المستندات التي اخترتها.");
    }

    // بناء رابط الخريطة
    const mapLink = coords 
        ? `https://www.google.com/maps/search/?api=1&query=${coords}` 
        : "لم يتم تحديد إحداثيات (العنوان نصي فقط)";

    // بناء نص الرسالة الاحترافية
    const message = `*طلب حجز جديد - شركة الحوت* %0A` +
                    `----------------------------%0A` +
                    `👤 *العميل:* ${name}%0A` +
                    `📞 *الهاتف:* ${phone}%0A` +
                    `📍 *العنوان:* ${address}%0A` +
                    `🗺️ *موقع الخريطة:* ${mapLink}%0A` +
                    `----------------------------%0A` +
                    `🚗 *السيارة:* BMW M4 Competition%0A` +
                    `📅 *الاستلام:* ${pTime || "غير محدد"}%0A` +
                    `📅 *الإرجاع:* ${rTime || "غير محدد"}%0A` +
                    `💰 *الإجمالي النهائي:* ${basePrice + extras}$%0A` +
                    `----------------------------%0A` +
                    `📸 *المستندات:* ${fileMessage}%0A` +
                    `----------------------------%0A` +
                    `_ملاحظة: سأقوم بإرفاق الصور يدوياً الآن.._`;

    // رقم واتساب الشركة (يرجى التأكد من الصيغة الدولية بدون أصفار في البداية)
    const companyPhone = "9647713225471";
    const waURL = `https://wa.me/${companyPhone}?text=${message}`;

    // فتح الرابط في نافذة جديدة
    window.open(waURL, '_blank');
}
