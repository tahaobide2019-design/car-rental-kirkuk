// ===== الملف الرئيسي للوظائف =====
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الموقع
    initializeSite();
    
    // تحميل السيارات المميزة
    loadFeaturedCars();
    
    // تهيئة القوائم المتحركة
    initMobileMenu();
    
    // تهيئة تبديل اللغة
    initLanguageSwitcher();
    
    // تهيئة الأقسام التفاعلية
    initInteractiveSections();
    
    // تهيئة نظام الإشعارات
    initNotifications();
    
    // تهيئة نظام حفظ البيانات
    initAutoSave();
});

// ===== تهيئة الموقع =====
function initializeSite() {
    console.log('موقع الحوت لتأجير السيارات - جاهز');
    
    // إضافة السنة الحالية في الفوتر
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
    
    // تهيئة تاريخ اليوم في حقول التاريخ
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]:not([min])');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
    
    // تعيين الحد الأدنى لتاريخ الاستلام
    const pickupDateInputs = document.querySelectorAll('#pickupDate, #bookingPickupDate');
    pickupDateInputs.forEach(input => {
        input.min = today;
    });
}

// ===== تحميل السيارات المميزة =====
async function loadFeaturedCars() {
    try {
        const response = await fetch('data/cars.json');
        const cars = await response.json();
        
        // تصفية السيارات المميزة
        const featuredCars = cars.filter(car => car.featured).slice(0, 6);
        
        const container = document.getElementById('featuredCars');
        if (container) {
            container.innerHTML = '';
            
            featuredCars.forEach(car => {
                const carCard = createCarCard(car);
                container.appendChild(carCard);
            });
        }
    } catch (error) {
        console.error('خطأ في تحميل السيارات المميزة:', error);
        showError('تعذر تحميل السيارات المميزة. يرجى تحديث الصفحة.');
    }
}

// ===== إنشاء كارت السيارة =====
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.id = car.id;
    card.dataset.category = car.category;
    
    // تحويل السعر إلى صيغة مقروءة
    const formattedPrice = new Intl.NumberFormat('ar-IQ').format(car.price);
    
    card.innerHTML = `
        <div class="car-image">
            <img src="images/cars/${car.image}" alt="${car.name}" loading="lazy">
            ${car.popular ? '<div class="car-badge"><span class="badge popular"><i class="fas fa-fire"></i> الأكثر طلباً</span></div>' : ''}
            ${car.discount ? '<div class="car-badge"><span class="badge discount"><i class="fas fa-percentage"></i> خصم 15%</span></div>' : ''}
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
            </div>
            <div class="car-actions">
                <button class="btn btn-outline btn-sm view-details" data-id="${car.id}">
                    <i class="fas fa-eye"></i>
                    عرض التفاصيل
                </button>
                <button class="btn btn-primary btn-sm book-now" data-id="${car.id}">
                    <i class="fas fa-calendar-check"></i>
                    احجز الآن
                </button>
            </div>
        </div>
    `;
    
    // إضافة مستمعات الأحداث
    const viewBtn = card.querySelector('.view-details');
    const bookBtn = card.querySelector('.book-now');
    
    viewBtn.addEventListener('click', () => {
        window.location.href = `car-details.html?id=${car.id}`;
    });
    
    bookBtn.addEventListener('click', () => {
        // حفظ السيارة المختارة في localStorage
        localStorage.setItem('selectedCar', JSON.stringify(car));
        window.location.href = 'booking.html';
    });
    
    return card;
}

// ===== تهيئة القائمة المتحركة للجوال =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ===== تهيئة تبديل اللغة =====
function initLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langLinks = document.querySelectorAll('.lang-dropdown a');
    
    if (langToggle) {
        // تحميل اللغة المحفوظة
        const savedLang = localStorage.getItem('siteLanguage') || 'ar';
        setLanguage(savedLang);
        
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // تغيير اللغة
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.dataset.lang;
                setLanguage(lang);
                langDropdown.style.display = 'none';
            });
        });
        
        // إغلاق القائمة المنسدلة عند النقر خارجها
        document.addEventListener('click', () => {
            langDropdown.style.display = 'none';
        });
    }
}

// ===== تغيير اللغة =====
function setLanguage(lang) {
    localStorage.setItem('siteLanguage', lang);
    
    // تحديث الزر
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = lang === 'ar' ? 'العربية' : 'English';
        langToggle.querySelector('span').textContent = langText;
    }
    
    // تغيير اتجاه الصفحة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // تحميل النصوص المترجمة
    loadTranslations(lang);
    
    // إعادة تحميل السيارات إذا لزم الأمر
    if (window.location.pathname.includes('cars.html') || 
        window.location.pathname.includes('index.html')) {
        loadFeaturedCars();
    }
}

// ===== تحميل النصوص المترجمة =====
async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        const translations = await response.json();
        
        // تحديث النصوص في الصفحة
        updatePageTexts(translations);
    } catch (error) {
        console.error('خطأ في تحميل الترجمات:', error);
    }
}

// ===== تحديث نصوص الصفحة =====
function updatePageTexts(translations) {
    // عناصر تحتاج للترجمة
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    elementsToTranslate.forEach(element => {
        const key = element.dataset.translate;
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // تحديث عناوين الصفحات
    const pageTitle = document.querySelector('title');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (translations.pages && translations.pages[currentPage]) {
        pageTitle.textContent = translations.pages[currentPage];
    }
}

// ===== تهيئة الأقسام التفاعلية =====
function initInteractiveSections() {
    // فئات السيارات
    initCategoryCards();
    
    // البحث في الهيرو
    initHeroSearch();
    
    // العروض الخاصة
    initSpecialOffers();
    
    // نظام التقييم
    initRatingSystem();
}

// ===== فئات السيارات =====
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `cars.html?category=${category}`;
        });
    });
}

// ===== البحث في الهيرو =====
function initHeroSearch() {
    const searchBtn = document.querySelector('.hero-search .search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const location = document.getElementById('pickupLocation').value;
            const date = document.getElementById('pickupDate').value;
            const time = document.getElementById('pickupTime').value;
            
            if (!location) {
                showAlert('يرجى اختيار موقع الاستلام', 'warning');
                return;
            }
            
            // حفظ معايير البحث
            const searchCriteria = {
                location,
                date,
                time
            };
            
            localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
            window.location.href = 'cars.html';
        });
    }
}

// ===== العروض الخاصة =====
function initSpecialOffers() {
    const offerButtons = document.querySelectorAll('.offer-card .btn-outline');
    
    offerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // حفظ العرض المحدد
            const offerCard = button.closest('.offer-card');
            const offerTitle = offerCard.querySelector('h3').textContent;
            
            localStorage.setItem('selectedOffer', offerTitle);
            window.location.href = 'booking.html';
        });
    });
}

// ===== نظام التقييم =====
function initRatingSystem() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        const hiddenInput = rating.parentElement.querySelector('input[type="hidden"]');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const ratingValue = parseInt(star.dataset.rating);
                highlightStars(stars, ratingValue);
            });
            
            star.addEventListener('click', () => {
                const ratingValue = parseInt(star.dataset.rating);
                if (hiddenInput) {
                    hiddenInput.value = ratingValue;
                }
                highlightStars(stars, ratingValue);
                saveStarState(stars, ratingValue);
            });
        });
        
        rating.addEventListener('mouseleave', () => {
            const currentRating = hiddenInput ? parseInt(hiddenInput.value) : 0;
            highlightStars(stars, currentRating);
        });
    });
}

// ===== تلوين النجوم =====
function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            star.style.color = '#fbbf24';
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.color = '#d1d5db';
        }
    });
}

// ===== حفظ حالة النجوم =====
function saveStarState(stars, rating) {
    stars.forEach((star, index) => {
        star.dataset.state = index < rating ? 'active' : 'inactive';
    });
}

// ===== تهيئة نظام الإشعارات =====
function initNotifications() {
    // التحقق من صلاحيات الإشعارات
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            // يمكن طلب الإذن لاحقاً عند الحاجة
            console.log('يمكن طلب إذن الإشعارات لاحقاً');
        }
    }
    
    // إشعارات الواتساب
    initWhatsAppNotifications();
}

// ===== إشعارات الواتساب =====
function initWhatsAppNotifications() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-float, .btn-whatsapp');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('whatsapp-float')) {
                // زر الواتساب العائم
                e.preventDefault();
                sendWhatsAppMessage();
            }
        });
    });
}

// ===== إرسال رسالة واتساب =====
function sendWhatsAppMessage(customMessage = '') {
    const phoneNumber = '9647713225471';
    let message = customMessage;
    
    if (!message) {
        // رسالة افتراضية
        message = 'مرحباً، أرغب في الاستفسار عن تأجير سيارة من شركة الحوت.';
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// ===== تهيئة نظام حفظ البيانات =====
function initAutoSave() {
    // حفظ البيانات في النماذج
    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
        const formId = form.id || 'form_' + Math.random().toString(36).substr(2, 9);
        
        // تحميل البيانات المحفوظة
        loadFormData(form, formId);
        
        // حفظ البيانات عند التغيير
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                saveFormData(form, formId);
            });
            
            input.addEventListener('change', () => {
                saveFormData(form, formId);
            });
        });
    });
}

// ===== حفظ بيانات النموذج =====
function saveFormData(form, formId) {
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

// ===== تحميل بيانات النموذج =====
function loadFormData(form, formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = data[key] === 'on' || data[key] === 'true';
                    } else {
                        input.value = data[key];
                    }
                }
            });
            
            // إظهار رسالة أن البيانات تم تحميلها
            showToast('تم استعادة البيانات المحفوظة مسبقاً', 'info');
        } catch (error) {
            console.error('خطأ في تحميل البيانات المحفوظة:', error);
        }
    }
}

// ===== عرض رسائل الخطأ =====
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إضافة أنماط للزر
    const style = document.createElement('style');
    style.textContent = `
        .close-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            margin-right: auto;
            padding: 0.25rem;
        }
    `;
    document.head.appendChild(style);
    
    // إضافة الرسالة في بداية المحتوى الرئيسي
    const mainContent = document.querySelector('main') || document.querySelector('.container');
    if (mainContent) {
        mainContent.prepend(errorDiv);
        
        // إزالة الرسالة بعد 10 ثواني
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
}

// ===== عرض رسائل التنبيه =====
function showAlert(message, type = 'info') {
    // يمكن استخدام مكتبة خارجية مثل SweetAlert2
    // هنا نستخدم تنبيه بسيط
    alert(message);
}

// ===== عرض رسائل التوست =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInLeft 0.3s ease;
            max-width: 350px;
        }
        
        .toast-success {
            border-right: 4px solid var(--success-color);
        }
        
        .toast-error {
            border-right: 4px solid var(--danger-color);
        }
        
        .toast-info {
            border-right: 4px solid var(--info-color);
        }
        
        .toast-warning {
            border-right: 4px solid var(--warning-color);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .toast i {
            font-size: 1.25rem;
        }
        
        .toast-success i {
            color: var(--success-color);
        }
        
        .toast-error i {
            color: var(--danger-color);
        }
        
        .toast-info i {
            color: var(--info-color);
        }
        
        .toast-warning i {
            color: var(--warning-color);
        }
        
        @keyframes slideInLeft {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // إزالة التوست بعد 5 ثواني
    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.3s ease';
        
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutLeft {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: tra
