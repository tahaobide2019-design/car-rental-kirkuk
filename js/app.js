/**
 * نظام إدارة سيارات "الحوت" - الإصدار الاحترافي
 * وظائف الملف: جلب البيانات، الفلترة المتقدمة، وحفظ تفاصيل الحجز
 */

let allCars = []; // مخزن مؤقت لكافة السيارات

// 1. دالة جلب البيانات من ملف JSON
async function loadCarsData(containerId = 'featured-cars', isFilterable = false) {
    try {
        const response = await fetch('./data/cars.json');
        if (!response.ok) throw new Error('تعذر تحميل بيانات السيارات');
        
        allCars = await response.json();

        // إذا كنا في الصفحة الرئيسية (نعرض أول 3 أو 6 سيارات فقط)
        if (containerId === 'featured-cars') {
            displayCars(allCars.slice(0, 6), containerId);
        } else {
            // عرض الكل في صفحة البحث
            displayCars(allCars, containerId);
        }

        // تفعيل المستمعات إذا كانت صفحة فلترة
        if (isFilterable) {
            setupFilterListeners();
        }

    } catch (error) {
        console.error("خطأ:", error);
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = `<p class="text-red-500 text-center col-span-full">عذراً، فشل تحميل السيارات. تأكد من ملف data/cars.json</p>`;
    }
}

// 2. دالة عرض الكروت بتصميم أزرق وأبيض (Premium)
function displayCars(carsToDisplay, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (carsToDisplay.length === 0) {
        container.innerHTML = `<p class="text-center col-span-full text-gray-400 py-10">لا توجد سيارات مطابقة لبحثك حالياً.</p>`;
        return;
    }

    container.innerHTML = carsToDisplay.map(car => `
        <div class="car-card animate-fade group">
            <div class="relative overflow-hidden rounded-lg mb-4">
                <img src="${car.image}" alt="${car.name}" class="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-2 left-2 bg-primary-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ${car.price}$ / يوم
                </div>
            </div>

            <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-white group-hover:text-primary-blue transition-colors">${car.name}</h3>
                <span class="text-[10px] border border-primary-blue text-primary-blue px-2 py-0.5 rounded">${getArabicCarType(car.type)}</span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-gray-400 text-xs mb-5">
                <div class="flex items-center gap-1">⚙️ <span>${car.specs.transmission}</span></div>
                <div class="flex items-center gap-1">⛽ <span>${car.specs.fuel}</span></div>
                <div class="flex items-center gap-1">👥 <span>${car.specs.seats} مقاعد</span></div>
                <div class="flex items-center gap-1">📅 <span>2024</span></div>
            </div>

            <button onclick="navigateToBooking(${car.id}, '${car.name}', ${car.price})" class="btn-premium w-full text-sm">
                احجز هذه السيارة
            </button>
        </div>
    `).join('');
}

// 3. دالة التنقل لصفحة الحجز مع تمرير البيانات عبر URL
function navigateToBooking(id, name, price) {
    const query = `id=${id}&carName=${encodeURIComponent(name)}&carPrice=${price}`;
    window.location.href = `booking.html?${query}`;
}

// 4. نظام الفلترة المتقدم
function setupFilterListeners() {
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');

    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', () => {
            priceDisplay.innerText = priceRange.value;
            applyFilters(); // فلترة فورية عند تحريك السعر
        });
    }

    // ربط باقي القوائم بالفلترة التلقائية
    ['car-type', 'seats', 'transmission'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const type = document.getElementById('car-type')?.value || "";
    const seats = document.getElementById('seats')?.value || "";
    const transmission = document.getElementById('transmission')?.value || "";
    const maxPrice = document.getElementById('price-range')?.value || 1000;

    const filtered = allCars.filter(car => {
        const matchType = type === "" || car.type === type;
        const matchSeats = seats === "" || car.specs.seats >= parseInt(seats);
        const matchTrans = transmission === "" || car.specs.transmission === transmission;
        const matchPrice = car.price <= parseInt(maxPrice);
        
        return matchType && matchSeats && matchTrans && matchPrice;
    });

    displayCars(filtered, 'all-cars-list');
}

// 5. مساعدات اللغة
function getArabicCarType(type) {
    const types = {
        'family': 'عائلية',
        'sport': 'رياضية',
        'economic': 'اقتصادية',
        'luxury': 'فاخرة',
        'suv': 'دفع رباعي',
        'commercial': 'تجارية'
    };
    return types[type] || type;
}

// 6. تشغيل النظام عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    // تحديد الصفحة الحالية لتشغيل الوظيفة المناسبة
    if (document.getElementById('featured-cars')) {
        loadCarsData('featured-cars', false);
    } 
    else if (document.getElementById('all-cars-list')) {
        loadCarsData('all-cars-list', true);
    }
});
