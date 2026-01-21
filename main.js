/**
 * main.js - التهيئة الرئيسية للنظام
 */

// تهيئة التطبيق
function initApp() {
    console.log('🚀 تهيئة نظام تأجير السيارات...');
    
    // التحقق من دعم المتصفح
    if (!checkBrowserSupport()) {
        showBrowserWarning();
        return;
    }
    
    // تهيئة المكونات
    initComponents();
    
    // تحميل البيانات الأولية
    loadInitialData();
    
    // إعداد التنقل
    setupNavigation();
    
    // إعداد نمط العرض
    setupTheme();
    
    // بدء مراقبة النظام
    startSystemMonitoring();
}

// التحقق من دعم المتصفح
function checkBrowserSupport() {
    // التحقق من دعم localStorage
    if (!window.localStorage) {
        console.error('المتصفح لا يدعم localStorage');
        return false;
    }
    
    // التحقق من دعم Fetch API
    if (!window.fetch) {
        console.error('المتصفح لا يدعم Fetch API');
        return false;
    }
    
    // التحقق من دعم ES6
    try {
        eval('class Test {}');
        eval('const arrow = () => {}');
        eval('let x = 1');
    } catch (e) {
        console.error('المتصفح لا يدعم ES6');
        return false;
    }
    
    return true;
}

// عرض تحذير المتصفح
function showBrowserWarning() {
    const warningHTML = `
        <div class="browser-warning">
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle warning-icon"></i>
                <h3>تحذير المتصفح</h3>
                <p>متصفحك قديم أو لا يدعم بعض الميزات المطلوبة.</p>
                <p>يرجى تحديث المتصفح أو استخدام أحد المتصفحات الحديثة:</p>
                <div class="browser-list">
                    <a href="https://www.google.com/chrome/" target="_blank" class="browser-item">
                        <i class="fab fa-chrome"></i>
                        <span>Chrome</span>
                    </a>
                    <a href="https://www.mozilla.org/firefox/" target="_blank" class="browser-item">
                        <i class="fab fa-firefox"></i>
                        <span>Firefox</span>
                    </a>
                    <a href="https://www.microsoft.com/edge" target="_blank" class="browser-item">
                        <i class="fab fa-edge"></i>
                        <span>Edge</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = warningHTML + document.body.innerHTML;
}

// تهيئة المكونات
function initComponents() {
    // تهيئة أزرار الإجراءات
    initActionButtons();
    
    // تهيئة النماذج
    initForms();
    
    // تهيئة الجداول
    initTables();
    
    // تهيئة التنبيهات
    initAlerts();
}

// تهيئة أزرار الإجراءات
function initActionButtons() {
    // معالجة أزرار الطباعة
    document.querySelectorAll('[data-action="print"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const elementId = this.getAttribute('data-target');
            app.printDocument(elementId);
        });
    });
    
    // معالجة أزرار التصدير
    document.querySelectorAll('[data-action="export"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            app.exportData(dataType);
        });
    });
    
    // معالجة أزرار الاستيراد
    document.querySelectorAll('[data-action="import"]').forEach(btn => {
        btn.addEventListener('change', function(e) {
            const dataType = this.getAttribute('data-type');
            const file = e.target.files[0];
            
            if (file) {
                modalManager.confirmDialog(
                    `هل تريد استيراد البيانات من الملف "${file.name}"؟`,
                    function() {
                        app.importData(dataType, file);
                    }
                );
            }
        });
    });
}

// تهيئة النماذج
function initForms() {
    // معالجة إرسال النماذج
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
    
    // التحقق من المدخلات أثناء الكتابة
    document.querySelectorAll('[data-validate]').forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

// معالجة إرسال النماذج
async function handleFormSubmit(form) {
    const formId = form.id || 'form';
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    // عرض حالة التحميل
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        submitBtn.disabled = true;
    }
    
    try {
        // جمع بيانات النموذج
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // التحقق من البيانات
        const validationResult = validateFormData(form, data);
        
        if (!validationResult.valid) {
            throw new Error(validationResult.errors.join(', '));
        }
        
        // تحديد الإجراء بناءً على ID النموذج
        let result;
        
        switch(formId) {
            case 'loginForm':
                result = await auth.login(data.email, data.password);
                break;
                
            case 'addCarForm':
                result = carsManager.addCar(data);
                break;
                
            case 'addBookingForm':
                result = await window.bookingManager?.addBooking(data);
                break;
                
            default:
                // للملفات الأخرى، استدعاء دالة معالجة مخصصة
                if (window[`handle${formId}`]) {
                    result = await window[`handle${formId}`](data);
                } else {
                    throw new Error('نموذج غير معروف');
                }
        }
        
        if (result.success) {
            // إظهار رسالة النجاح
            notificationManager.show(result.message, 'success');
            
            // إعادة تعيين النموذج إذا كان مطلوباً
            if (form.hasAttribute('data-reset')) {
                form.reset();
            }
            
            // إعادة التوجيه إذا كان مطلوباً
            if (result.redirect) {
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 1500);
            }
            
            // تحديث البيانات إذا كان مطلوباً
            if (result.refresh) {
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
            
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        notificationManager.show(error.message, 'error');
        
    } finally {
        // استعادة حالة الزر
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

// التحقق من بيانات النموذج
function validateFormData(form, data) {
    const errors = [];
    
    // التحقق من الحقول المطلوبة
    form.querySelectorAll('[required]').forEach(field => {
        if (!data[field.name] || data[field.name].toString().trim() === '') {
            const label = field.labels?.[0]?.textContent || field.name;
            errors.push(`حقل "${label}" مطلوب`);
            
            // إضافة فئة الخطأ
            field.classList.add('is-invalid');
        }
    });
    
    // التحقق من أنواع البيانات
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        
        if (field && field.type === 'email' && data[key]) {
            if (!validator.isEmail(data[key])) {
                errors.push(`البريد الإلكتروني "${data[key]}" غير صحيح`);
                field.classList.add('is-invalid');
            }
        }
        
        if (field && field.type === 'tel' && data[key]) {
            if (!validator.isIraqiPhone(data[key])) {
                errors.push(`رقم الهاتف "${data[key]}" غير صحيح`);
                field.classList.add('is-invalid');
            }
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// التحقق من المدخلات الفردية
function validateInput(input) {
    const value = input.value.trim();
    
    // إزالة فئات الخطأ السابقة
    input.classList.remove('is-invalid', 'is-valid');
    
    if (input.hasAttribute('required') && !value) {
        input.classList.add('is-invalid');
        return false;
    }
    
    // التحقق بناءً على نوع المدخل
    if (input.type === 'email' && value) {
        if (!validator.isEmail(value)) {
            input.classList.add('is-invalid');
            return false;
        }
    }
    
    if (input.type === 'tel' && value) {
        if (!validator.isIraqiPhone(value)) {
            input.classList.add('is-invalid');
            return false;
        }
    }
    
    if (input.dataset.min && value) {
        const min = parseFloat(input.dataset.min);
        if (parseFloat(value) < min) {
            input.classList.add('is-invalid');
            return false;
        }
    }
    
    if (input.dataset.max && value) {
        const max = parseFloat(input.dataset.max);
        if (parseFloat(value) > max) {
            input.classList.add('is-invalid');
            return false;
        }
    }
    
    input.classList.add('is-valid');
    return true;
}

// تهيئة الجداول
function initTables() {
    // إضافة البحث للجداول
    document.querySelectorAll('.data-table').forEach(table => {
        const searchInput = table.parentElement.querySelector('.table-search');
        
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
    });
    
    // إضافة التصفية للجداول
    document.querySelectorAll('.table-filter').forEach(filter => {
        filter.addEventListener('change', function() {
            const tableId = this.getAttribute('data-table');
            const column = this.getAttribute('data-column');
            const value = this.value;
            
            filterTable(tableId, column, value);
        });
    });
}

// تصفية الجداول
function filterTable(tableId, column, value) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cell = row.querySelector(`td[data-column="${column}"]`);
        const cellValue = cell?.textContent || cell?.dataset.value || '';
        
        if (!value || value === 'all' || cellValue === value) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// تهيئة التنبيهات
function initAlerts() {
    // إغلاق التنبيهات عند النقر على زر الإغلاق
    document.addEventListener('click', function(e) {
        if (e.target.closest('.alert-close')) {
            const alert = e.target.closest('.alert');
            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }
        }
    });
}

// تحميل البيانات الأولية
function loadInitialData() {
    // تحميل بيانات المستخدم إذا كان مسجلاً
    if (auth.isAuthenticated()) {
        const user = storage.get('currentUser');
        app.updateUIForUser(user);
    }
    
    // تحميل الإحصائيات إذا كانت الصفحة تحتوي على بطاقات إحصائية
    if (document.querySelector('.stats-grid')) {
        loadStats();
    }
    
    // تحميل الجداول إذا كانت موجودة
    if (document.querySelector('.data-table')) {
        loadTableData();
    }
}

// تحميل الإحصائيات
async function loadStats() {
    try {
        // جلب إحصائيات السيارات
        const carsStats = carsManager.getCarsStats();
        
        // جلب إحصائيات الحجوزات
        const bookingsStats = window.bookingManager?.getBookingsStats() || {};
        
        // تحديث بطاقات الإحصائيات
        updateStatCard('totalCars', carsStats.totalCars);
        updateStatCard('availableCars', carsStats.availableCars);
        updateStatCard('totalBookings', bookingsStats.totalBookings || 0);
        updateStatCard('totalRevenue', currencyFormatter.format(carsStats.totalRevenue));
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// تحديث بطاقة إحصائية
function updateStatCard(cardId, value) {
    const card = document.getElementById(cardId);
    if (card) {
        card.textContent = value;
    }
}

// تحميل بيانات الجداول
function loadTableData() {
    // تحديد نوع الجدول بناءً على الصفحة
    const path = window.location.pathname;
    
    if (path.includes('cars')) {
        loadCarsTable();
    } else if (path.includes('bookings')) {
        loadBookingsTable();
    } else if (path.includes('users')) {
        loadUsersTable();
    }
}

// تحميل جدول السيارات
function loadCarsTable() {
    const cars = carsManager.getAllCars();
    const tableBody = document.querySelector('#carsTable tbody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    cars.forEach(car => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <img src="${car.images?.[0] || 'images/cars/default.jpg'}" 
                     alt="${car.brand} ${car.model}" 
                     class="car-thumbnail">
            </td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.plateNumber}</td>
            <td>${currencyFormatter.format(car.dailyRate)}</td>
            <td>
                <span class="status-badge status-${car.status === 'متاحة' ? 'available' : car.status === 'محجوزة' ? 'booked' : 'maintenance'}">
                    ${car.status}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="action-btn view-btn" onclick="viewCar('${car.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editCar('${car.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCar('${car.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// إعداد التنقل
function setupNavigation() {
    // معالجة الروابط النشطة
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.endsWith(linkPath) || 
            (linkPath === 'index.html' && currentPath.endsWith('/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // معالجة زر القائمة المتنقلة
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('show');
            }
        });
    }
    
    // معالجة زر العودة للأعلى
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// إعداد نمط العرض
function setupTheme() {
    // التحقق من الوضع المظلم المحفوظ
    const savedTheme = storage.get('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = savedTheme;
    
    // إذا لم يكن هناك تفضيل محفوظ، استخدام تفضيل النظام
    if (!storage.get('theme') && prefersDark) {
        theme = 'dark';
    }
    
    // تطبيق الثيم
    setTheme(theme);
    
    // إعداد زر تبديل الثيم
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            setTheme(newTheme);
            storage.set('theme', newTheme);
        });
        
        // تحديث أيقونة الثيم
        updateThemeIcon(themeToggle, theme);
    }
}

// تطبيق الثيم
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
}

// تحديث أيقونة الثيم
function updateThemeIcon(button, theme) {
    const icon = button.querySelector('i');
    
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            button.setAttribute('title', 'الوضع المضيء');
        } else {
            icon.className = 'fas fa-moon';
            button.setAttribute('title', 'الوضع المظلم');
        }
    }
}

// بدء مراقبة النظام
function startSystemMonitoring() {
    // مراقبة الاتصال بالإنترنت
    window.addEventListener('online', function() {
        notificationManager.show('تم استعادة الاتصال بالإنترنت', 'success');
        
        // محاولة مزامنة البيانات
        syncOfflineData();
    });
    
    window.addEventListener('offline', function() {
        notificationManager.show('فقدان الاتصال بالإنترنت - العمل في الوضع المحلي', 'warning');
    });
    
    // مراقبة حجم النافذة
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // مراقبة نشاط المستخدم
    let idleTimeout;
    resetIdleTimer();
    
    ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, resetIdleTimer);
    });
}

// معالجة تغيير حجم النافذة
function handleResize() {
    const width = window.innerWidth;
    
    // تحديث فئة الجسم بناءً على حجم الشاشة
    document.body.classList.remove('screen-xs', 'screen-sm', 'screen-md', 'screen-lg', 'screen-xl');
    
    if (width < 576) {
        document.body.classList.add('screen-xs');
    } else if (width < 768) {
        document.body.classList.add('screen-sm');
    } else if (width < 992) {
        document.body.classList.add('screen-md');
    } else if (width < 1200) {
        document.body.classList.add('screen-lg');
    } else {
        document.body.classList.add('screen-xl');
    }
}

// إعادة ضبط مؤقت الخمول
function resetIdleTimer() {
    clearTimeout(idleTimeout);
    
    // 30 دقيقة من عدم النشاط
    idleTimeout = setTimeout(() => {
        const user =
