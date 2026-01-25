// prices.js - لوحة تحكم الأسعار المركزية لشركة الحوت 🐋
const AL_HUT_DATA = {
    // أسطول السيارات
    fleet: [
        { id: "corolla", name: "تويوتا كورولا 2025", engine: "hybrid", cat: "economy", price: 45000, img: "Cars/corolla.jpg" },
        { id: "charger", name: "دودج جارجر SRT", engine: "auto", cat: "luxury", price: 85000, img: "Cars/charger.jpg" },
        { id: "tucson",  name: "هيونداي توسان", engine: "auto", cat: "family", price: 60000, img: "Cars/tucson.jpg" },
        { id: "mercedes", name: "مرسيدس S-Class", engine: "auto", cat: "luxury", price: 150000, img: "Cars/mercedes.jpg" },
        { id: "sunny",    name: "نيسان صني", engine: "auto", cat: "economy", price: 35000, img: "Cars/sunny.jpg" }
    ],

    // أسعار الإضافات (يتم استدعاؤها في صفحة addons.html)
    addons: {
        baby_seat: 15000,
        delivery: 10000,
        driver: 40000,
        wedding_convoy: 250000
    }
};

