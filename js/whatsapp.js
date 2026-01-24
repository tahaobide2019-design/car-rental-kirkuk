// js/whatsapp.js

function processBooking() {
    // جلب معلومات السيارة من الرابط (URL)
    const params = new URLSearchParams(window.location.search);
    const carName = params.get('carName') || "سيارة غير محددة";
    const carPrice = params.get('carPrice') || "0";

    // 1. جمع الخدمات الإضافية (المرحلة 1)
    let selectedServices = [];
    let extraCost = 0;
    document.querySelectorAll('input[name="extra"]:checked').forEach(item => {
        selectedServices.push(item.parentElement.innerText.split('\n')[0]);
        extraCost += parseInt(item.value);
    });

    // 2. جمع بيانات العميل (المرحلة 2)
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;

    // 3. جمع بيانات التسليم (المرحلة 3)
    const location = document.getElementById('pickup-location').value;
    const pickupDate = document.getElementById('pickup-datetime').value;
    const returnDate = document.getElementById('return-datetime').value;

    if (!customerName || !customerPhone || !location || !pickupDate) {
        alert("يرجى ملء جميع البيانات المطلوبة قبل إرسال الطلب.");
        return;
    }

    // رقم شركة الحوت
    const companyPhone = "9647713225471";

    // تنسيق الرسالة الاحترافية
    const message = `
*🐋 طلب حجز جديد - شركة الحوت*
------------------------------
🚗 *السيارة:* ${carName}
💰 *السعر اليومي:* ${carPrice}$
------------------------------
👤 *العميل:* ${customerName}
📞 *الهاتف:* ${customerPhone}
------------------------------
📍 *موقع الاستلام:* ${location}
🗓️ *من:* ${pickupDate}
🔙 *إلى:* ${returnDate}
------------------------------
🛠️ *خدمات إضافية:*
${selectedServices.length > 0 ? selectedServices.join('\n') : 'لا يوجد'}
------------------------------
💵 *طريقة الدفع:* نقداً عند الاستلام
✅ *يرجى مراجعة المستندات المرفقة عند الوصول.*
    `;

    const whatsappURL = `https://wa.me/${companyPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}
