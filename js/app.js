let allCars = []; // لتخزين جميع السيارات التي تم جلبها

// دالة لجلب السيارات وعرضها
async function loadCars(containerId = 'featured-cars', isFilterable = false) {
    try {
        const response = await fetch('./data/cars.json');
        allCars = await response.json(); // حفظ جميع السيارات
        displayCars(allCars, containerId); // عرض جميع السيارات في البداية

        // إذا كانت الصفحة تدعم الفلترة، إعداد المستمعات
        if (isFilterable) {
            document.getElementById('price-range').addEventListener('input', updatePriceDisplay);
            updatePriceDisplay(); // تحديث عرض السعر الأولي
        }

    } catch (error) {
        console.error("خطأ في تحميل بيانات السيارات:", error);
    }
}

// دالة لعرض السيارات في حاوية معينة
function displayCars(carsToDisplay, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = carsToDisplay.map(car => `
        <div class="car-card animate-fade">
            <img src="${car.image}" alt="${car.name}" class="w-full h-48 object-cover rounded-lg mb-4">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-xl font-bold text-primary-blue">${car.name}</h3>
                <span class="bg-primary-blue/20 text-white px-3 py-1 rounded-full text-xs">${car.specs.fuel}</span>
            </div>
            <div class="text-gray-400 text-sm mb-4">
                <p>⚙️ ${car.specs.transmission} | 👥 ${car.specs.seats} مقاعد | نوع: ${getArabicCarType(car.type)}</p>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold">${car.price}$ <small class="text-sm text-gray-400">/يوم</small></span>
                <a href="booking.html?id=${car.id}&carName=${encodeURIComponent(car.name)}&carPrice=${car.price}" class="btn-premium py-2 px-5 text-sm">احجز الآن</a>
            </div>
        </div>
    `).join('');
}

// دالة لتحويل نوع السيارة الإنجليزي إلى عربي للعرض
function getArabicCarType(type) {
    switch(type) {
        case 'family': return 'عائلية';
        case 'sport': return 'رياضية';
        case 'economic': return 'اقتصادية';
        case 'luxury': return 'فاخرة';
        case 'suv': return 'دفع رباعي/SUV';
        case 'commercial': return 'تجارية';
        default: return type;
    }
}


// دالة لتحديث عرض السعر في شريط الفلترة
function updatePriceDisplay() {
    const priceRange =

      
