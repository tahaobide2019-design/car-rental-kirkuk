// Al-Hut Utility Functions
const AlHutUtils = {
    
    // تنسيق المبالغ المالية بصيغة الدينار العراقي
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            maximumFractionDigits: 0
        }).format(amount);
    },

    // جلب بيانات الرابط (URL Parameters) بسهولة
    getQueryParams: () => {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    },

    // التحقق من صحة رقم الهاتف العراقي
    isValidIraqiPhone: (phone) => {
        const regex = /^(077|078|075|079)\d{8}$/;
        return regex.test(phone.trim());
    },

    // حفظ آخر بحث للزبون في ذاكرة المتصفح
    saveLastSearch: (service, date) => {
        localStorage.setItem('last_alhut_search', JSON.stringify({ service, date }));
    }
};
