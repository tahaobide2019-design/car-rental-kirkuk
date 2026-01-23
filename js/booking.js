// ===== نظام الحجز ثلاثي المراحل =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الحجز
    initializeBookingSystem();
    
    // تحميل السيارات المتاحة
    loadAvailableCars();
    
    // تهيئة المراحل
    initBookingStages();
    
    // تهيئة الخريطة
    initDeliveryMap();
    
    // تهيئة رفع المستندات
    initDocumentUpload();
    
    // تهيئة نظام التكلفة
    initCostCalculator();
});

// ===== تهيئة نظام الحجز =====
let bookingData = {
    stage: 1,
    car: null,
    services: {
        delivery: false,
        childSeat: false,
        gps: false,
        driver: false,
        insurance: true
    },
    servicesDetails: {},
    personalInfo: {},
    documents: {},
    dates: {},
    cost: {
        carRent: 0,
        services: 0,
        taxes: 0,
        insurance: 0,
        total: 0
    }
};

function initializeBookingSystem() {
    // تحميل البيانات المحفوظة
    loadBookingData();
    
    // تحديث واجهة المستخدم بناءً على البيانات المحفوظة
    updateUIFromBookingData();
}

// ===== تحميل البيانات المحفوظة =====
function loadBookingData() {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            bookingData = { ...bookingData, ...parsedData };
            
            // تحديث المرحلة الحالية
            setBookingStage(bookingData.stage);
            
            // إظهار رسالة
            if (parsedData.car) {
                showToast('تم استعادة بيانات الحجز السابقة', 'info');
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات الحجز:', error);
        }
    }
}

// ===== حفظ بيانات الحجز =====
function saveBookingData() {
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
}

// ===== تحميل السيارات المتاحة =====
async function loadAvailableCars() {
    try {
        const response = await fetch('data/cars.json');
        const cars = await response.json();
        
        // تطبيق الفلاتر
        const filteredCars = filterCars(cars);
        
        // عرض السيارات
        displayAvailableCars(filteredCars);
        
        // إذا كانت هناك سيارة محفوظة مسبقاً، إظهارها
        if (bookingData.car) {
            displaySelectedCarPreview(bookingData.car);
        }
    } catch (error) {
        console.error('خطأ في تحميل السيارات:', error);
        showError('تعذر تحميل السيارات المتاحة. يرجى تحديث الصفحة.');
    }
}

// ===== تصفية السيارات =====
function filterCars(cars) {
    const category = document.getElementById('bookingCategory').value;
    const pickupDate = document.getElementById('bookingPickupDate').value;
    const returnDate = document.getElementById('bookingReturnDate').value;
    
    let filtered = cars;
    
    // فلترة حسب الفئة
    if (category) {
        filtered = filtered.filter(car => car.category === category);
    }
    
    // فلترة حسب التاريخ (يمكن إضافة منطق التحقق من التوفر)
    if (pickupDate && returnDate) {
        bookingData.dates = {
            pickup: pickupDate,
            return: returnDate
        };
        saveBookingData();
    }
    
    return filtered;
}

// ===== عرض السيارات المتاحة =====
function displayAvailableCars(cars) {
    const container = document.getElementById('availableCars');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cars.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-car-crash"></i>
                <h3>لا توجد سيارات متاحة</h3>
                <p>حاول تغيير معايير البحث أو تواريخ الحجز</p>
            </div>
        `;
        return;
    }
    
    cars.forEach(car => {
        const carCard = createBookingCarCard(car);
        container.appendChild(carCard);
    });
}

// ===== إنشاء كارت سيارة للحجز =====
function createBookingCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card selectable';
    card.dataset.id = car.id;
    
    // تحويل السعر إلى صيغة مقروءة
    const formattedPrice = new Intl.NumberFormat('ar-IQ').format(car.price);
    
    // حساب السعر الإجمالي
    const days = bookingData.dates.pickup && bookingData.dates.return ? 
        calculateDaysBetween(bookingData.dates.pickup, bookingData.dates.return) : 1;
    const totalPrice = car.price * days;
    const formattedTotal = new Intl.NumberFormat('ar-IQ').format(totalPrice);
    
    card.innerHTML = `
        <div class="car-image">
            <img src="images/cars/${car.image}" alt="${car.name}" loading="lazy">
            ${car.available ? '' : '<div class="car-badge"><span class="badge unavailable"><i class="fas fa-times-circle"></i> غير متاحة</span></div>'}
        </div>
        <div class="car-content">
            <div class="car-header">
                <div class="car-title">
                    <h4>${car.name}</h4>
                </div>
                <div class="car-price">
                    <span class="price">${formattedPrice}</span>
                    <span class="currency">دينار/يوم</span>
                </div>
            </div>
            <div class="car-specs">
                <span><i class="fas fa-user-friends"></i> ${car.capacity} أشخاص</span>
                <span><i class="fas fa-cogs"></i> ${car.transmission === 'automatic' ? 'أوتوماتيك' : 'عادي'}</span>
                <span><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
                <span><i class="fas fa-calendar"></i> ${car.year}</span>
            </div>
            <div class="car-details">
                <p>${car.description || 'سيارة مريحة ومناسبة للرحلات'}</p>
            </div>
            <div class="car-selection">
                <div class="total-price">
                    <span>الإجمالي ${days} أيام:</span>
                    <span class="price">${formattedTotal} دينار</span>
                </div>
                <button class="btn btn-primary select-car-btn" data-id="${car.id}" ${!car.available ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                    ${bookingData.car && bookingData.car.id === car.id ? 'محددة' : 'اختيار'}
                </button>
            </div>
        </div>
    `;
    
    // إضافة مستمع الأحداث
    const selectBtn = card.querySelector('.select-car-btn');
    selectBtn.addEventListener('click', () => {
        selectCar(car);
    });
    
    // إذا كانت السيارة محددة مسبقاً
    if (bookingData.car && bookingData.car.id === car.id) {
        card.classList.add('selected');
        selectBtn.innerHTML = '<i class="fas fa-check"></i> محددة';
        selectBtn.classList.add('selected');
    }
    
    return card;
}

// ===== اختيار السيارة =====
function selectCar(car) {
    bookingData.car = car;
    
    // تحديث واجهة المستخدم
    displaySelectedCarPreview(car);
    
    // تمكين زر التالي
    document.getElementById('nextToStage2').disabled = false;
    
    // حفظ البيانات
    saveBookingData();
    
    // إظهار رسالة
    showToast(`تم اختيار ${car.name}`, 'success');
}

// ===== عرض معاينة السيارة المختارة =====
function displaySelectedCarPreview(car) {
    const preview = document.getElementById('selectedCarPreview');
    if (!preview) return;
    
    // تحويل السعر إلى صيغة مقروءة
    const formattedPrice = new Intl.NumberFormat('ar-IQ').format(car.price);
    
    // حساب السعر الإجمالي
    const days = bookingData.dates.pickup && bookingData.dates.return ? 
        calculateDaysBetween(bookingData.dates.pickup, bookingData.dates.return) : 1;
    const totalPrice = car.price * days;
    const formattedTotal = new Intl.NumberFormat('ar-IQ').format(totalPrice);
    
    // تحديث محتوى المعاينة
    document.getElementById('previewCarImage').src = `images/cars/${car.image}`;
    document.getElementById('previewCarImage').alt = car.name;
    document.getElementById('previewCarName').textContent = car.name;
    document.getElementById('previewCapacity').textContent = car.capacity;
    document.getElementById('previewTransmission').textContent = car.transmission === 'automatic' ? 'أوتوماتيك' : 'عادي';
    document.getElementById('previewFuel').textContent = car.fuel;
    document.getElementById('previewTotalPrice').textContent = formattedTotal;
    
    // إظهار المعاينة
    preview.style.display = 'block';
    
    // تمرير لأسفل لرؤية المعاينة
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== تهيئة مراحل الحجز =====
function initBookingStages() {
    // أزرار التنقل بين المراحل
    const nextToStage2 = document.getElementById('nextToStage2');
    const nextToStage3 = document.getElementById('nextToStage3');
    const backToStage1 = document.getElementById('backToStage1');
    const backToStage2 = document.getElementById('backToStage2');
    const completeBooking = document.getElementById('completeBooking');
    
    // إضافة مستمعات الأحداث
    if (nextToStage2) {
        nextToStage2.addEventListener('click', () => setBookingStage(2));
    }
    
    if (nextToStage3) {
        nextToStage3.addEventListener('click', () => setBookingStage(3));
    }
    
    if (backToStage1) {
        backToStage1.addEventListener('click', () => setBookingStage(1));
    }
    
    if (backToStage2) {
        backToStage2.addEventListener('click', () => setBookingStage(2));
    }
    
    if (completeBooking) {
        completeBooking.addEventListener('click', completeBookingProcess);
    }
    
    // مستمعات لتغيير التواريخ
    const pickupDate = document.getElementById('bookingPickupDate');
    const returnDate = document.getElementById('bookingReturnDate');
    
    if (pickupDate && returnDate) {
        pickupDate.addEventListener('change', updateCarPrices);
        returnDate.addEventListener('change', updateCarPrices);
    }
    
    // زر تغيير السيارة
    const changeCarBtn = document.getElementById('changeCarBtn');
    if (changeCarBtn) {
        changeCarBtn.addEventListener('click', () => {
            document.getElementById('selectedCarPreview').style.display = 'none';
            bookingData.car = null;
            document.getElementById('nextToStage2').disabled = true;
            saveBookingData();
        });
    }
}

// ===== تغيير مرحلة الحجز =====
function setBookingStage(stage) {
    bookingData.stage = stage;
    
    // تحديث شريط التقدم
    updateProgressBar(stage);
    
    // إخفاء جميع المراحل
    document.querySelectorAll('.booking-stage').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار المرحلة الحالية
    const currentStage = document.getElementById(`stage${stage}`);
    if (currentStage) {
        currentStage.classList.add('active');
        
        // إذا كانت المرحلة الثالثة، تحميل الملخص
        if (stage === 3) {
            loadFinalSummary();
        }
    }
    
    // حفظ البيانات
    saveBookingData();
    
    // التمرير لأعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== تحديث شريط التقدم =====
function updateProgressBar(stage) {
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.progress-steps .step');
    
    // حساب عرض شريط التقدم
    const progressWidth = ((stage - 1) / 2) * 100;
    progressFill.style.width = `${progressWidth}%`;
    
    // تحديث حالة الخطوات
    steps.forEach((step, index) => {
        if (index + 1 <= stage) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ===== تحديث أسعار السيارات بناءً على التواريخ =====
function updateCarPrices() {
    const pickupDate = document.getElementById('bookingPickupDate').value;
    const returnDate = document.getElementById('bookingReturnDate').value;
    
    if (!pickupDate || !returnDate) {
        showAlert('يرجى اختيار تاريخي الاستلام والإرجاع', 'warning');
        return;
    }
    
    const days = calculateDaysBetween(pickupDate, returnDate);
    
    if (days <= 0) {
        showAlert('تاريخ الإرجاع يجب أن يكون بعد تاريخ الاستلام', 'warning');
        return;
    }
    
    // حفظ التواريخ
    bookingData.dates = { pickup: pickupDate, return: returnDate };
    
    // تحديث أسعار الكروت
    document.querySelectorAll('.car-card').forEach(card => {
        const priceElement = card.querySelector('.total-price .price');
        const dailyPrice = parseInt(card.dataset.dailyPrice) || 50000;
        const totalPrice = dailyPrice * days;
        const formattedTotal = new Intl.NumberFormat('ar-IQ').format(totalPrice);
        
        if (priceElement) {
            priceElement.textContent = `${formattedTotal} دينار`;
        }
        
        // تحديث نص المدة
        const daysText = card.querySelector('.total-price span:first-child');
        if (daysText) {
            daysText.textContent = `الإجمالي ${days} أيام:`;
        }
    });
    
    // إذا كانت هناك سيارة محددة، تحديث معاينتها
    if (bookingData.car) {
        displaySelectedCarPreview(bookingData.car);
    }
    
    // تحديث التكلفة الإجمالية
    calculateTotalCost();
}

// ===== تهيئة الخريطة =====
function initDeliveryMap() {
    const deliveryService = document.getElementById('deliveryService');
    const deliveryOptions = document.getElementById('deliveryOptions');
    const mapContainer = document.getElementById('deliveryMap');
    
    if (deliveryService && deliveryOptions && mapContainer) {
        deliveryService.addEventListener('change', function() {
            if (this.checked) {
                deliveryOptions.style.display = 'block';
                initMap(mapContainer);
                bookingData.services.delivery = true;
            } else {
                deliveryOptions.style.display = 'none';
                bookingData.services.delivery = false;
            }
            calculateTotalCost();
            saveBookingData();
        });
        
        // تحديد الموقع الحالي
        const locateMeBtn = document.getElementById('locateMeBtn');
        if (locateMeBtn) {
            locateMeBtn.addEventListener('click', locateUserOnMap);
        }
        
        // تحديث العنوان يدوياً
        const addressInput = document.getElementById('deliveryAddress');
        if (addressInput) {
            addressInput.addEventListener('change', function() {
                bookingData.servicesDetails.deliveryAddress = this.value;
                saveBookingData();
            });
        }
    }
}

// ===== تهيئة الخريطة =====
function initMap(container) {
    // استخدام خرائط جوجل (يجب إضافة API key)
    const mapOptions = {
        center: { lat: 35.4681, lng: 44.3922 }, // إحداثيات كركوك
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
    };
    
    // إذا كان API متاحاً
    if (typeof google !== 'undefined') {
        const map = new google.maps.Map(container, mapOptions);
        
        // إضافة علامة
        const marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            draggable: true,
            title: 'موقع التسليم'
        });
        
        // تحديث الموقع عند سحب العلامة
        marker.addListener('dragend', function() {
            const position = marker.getPosition();
            bookingData.servicesDetails.deliveryLocation = {
                lat: position.lat(),
                lng: position.lng()
            };
            saveBookingData();
        });
        
        // حفظ المرجع للاستخدام لاحقاً
        window.bookingMap = map;
        window.bookingMarker = marker;
    } else {
        // رسالة بديلة إذا لم يكن API متاحاً
        container.innerHTML = `
            <div class="map-fallback">
                <i class="fas fa-map-marker-alt"></i>
                <p>خريطة تحديد موقع التسليم</p>
                <p>يرجى إدخال العنوان يدوياً في الحقل أدناه</p>
            </div>
        `;
    }
}

// ===== تحديد الموقع الحالي =====
function locateUserOnMap() {
    if (!navigator.geolocation) {
        showAlert('متصفحك لا يدعم تحديد الموقع', 'warning');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            bookingData.servicesDetails.deliveryLocation = userLocation;
            
            // تحديث الخريطة إذا كانت متاحة
            if (window.bookingMap && window.bookingMarker) {
                window.bookingMap.setCenter(userLocation);
                window.bookingMarker.setPosition(userLocation);
                
                // عكس الجغرافيا للحصول على العنوان
                if (typeof google !== 'undefined') {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: userLocation }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            const addressInput = document.getElementById('deliveryAddress');
                            if (addressInput) {
                                addressInput.value = results[0].formatted_address;
                                bookingData.servicesDetails.deliveryAddress = results[0].formatted_address;
                                saveBookingData();
                            }
                        }
                    });
                }
            }
            
            showToast('تم تحديد موقعك بنجاح', 'success');
        },
        (error) => {
            console.error('خطأ في تحديد الموقع:', error);
            showAlert('تعذر تحديد موقعك. يرجى المحاولة مرة أخرى أو إدخال العنوان يدوياً.', 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// ===== تهيئة رفع المستندات =====
function initDocumentUpload() {
    // الهوية الوطنية
    initDocumentUploader('nationalId', 'uploadNationalId', 'cameraNationalId', 'nationalIdPreview');
    
    // جواز السفر
    initDocumentUploader('passport', 'uploadPassport', 'cameraPassport', 'passportPreview');
    
    // رخصة القيادة
    initDocumentUploader('driverLicense', 'uploadLicense', 'cameraLicense', 'licensePreview');
    
    // عرض/إخفاء قسم جواز السفر بناءً على الجنسية
    const nationalitySelect = document.getElementById('nationality');
    if (nationalitySelect) {
        nationalitySelect.addEventListener('change', function() {
            const passportSection = document.getElementById('passportSection');
            const nationalIdSection = document.querySelector('.document-item:first-child');
            
            if (this.value === 'foreign') {
                passportSection.style.display = 'flex';
                if (nationalIdSection) {
                    nationalIdSection.querySelector('h4').textContent = 'وثيقة السفر *';
                    nationalIdSection.querySelector('p').textContent = 'للمقيمين والأجانب';
                }
            } else {
                passportSection.style.display = 'none';
                if (nationalIdSection) {
                    nationalIdSection.querySelector('h4').textContent = 'الهوية الوطنية *';
                    nationalIdSection.querySelector('p').textContent = 'للمواطنين العراقيين فقط';
                }
            }
            
            bookingData.personalInfo.nationality = this.value;
            saveBookingData();
        });
    }
}

// ===== تهيئة رفع مستند معين =====
function initDocumentUploader(inputId, uploadBtnId, cameraBtnId, previewId) {
    const fileInput = document.getElementById(inputId);
    const uploadBtn = document.getElementById(uploadBtnId);
    const cameraBtn = document.getElementById(cameraBtnId);
    const preview = document.getElementById(previewId);
    
    if (!fileInput || !uploadBtn) return;
    
    // رفع ملف
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    })
