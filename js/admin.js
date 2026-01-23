// ===== نظام إدارة لوحة التحكم =====
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (!checkAdminLogin()) {
        redirectToLogin();
        return;
    }
    
    // تهيئة لوحة التحكم
    initializeAdminDashboard();
    
    // تحميل البيانات
    loadDashboardData();
    
    // تهيئة القائمة الجانبية
    initSidebar();
    
    // تهيئة نظام البحث
    initAdminSearch();
    
    // تهيئة إشعارات لوحة التحكم
    initAdminNotifications();
    
    // تهيئة الرسوم البيانية
    initCharts();
    
    // تهيئة الجداول
    initDataTables();
});

// ===== التحقق من تسجيل الدخول =====
function checkAdminLogin() {
    // في الواقع، يجب التحقق من الجلسة أو التوكن
    // هنا نستخدم localStorage للتوضيح
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const adminToken = localStorage.getItem('adminToken');
    
    return adminLoggedIn === 'true' && adminToken;
}

// ===== إعادة التوجيه لصفحة تسجيل الدخول =====
function redirectToLogin() {
    // في الواقع، يجب إعادة التوجيه لصفحة تسجيل دخول منفصلة
    window.location.href = 'index.html';
}

// ===== تهيئة لوحة التحكم =====
function initializeAdminDashboard() {
    console.log('لوحة تحكم الحوت - جاهزة');
    
    // تحديث المعلومات في الشريط الجانبي
    updateAdminInfo();
    
    // تحديث الإحصائيات
    updateStatsBadges();
    
    // إضافة مستمعات الأحداث للأزرار
    initAdminButtons();
    
    // إضافة مستمعات للقوائم
    initSectionNavigation();
}

// ===== تحديث معلومات المدير =====
function updateAdminInfo() {
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    
    // تحديث الاسم في الشريط الجانبي
    const userNameElement = document.querySelector('.user-info h4');
    if (userNameElement && adminData.name) {
        userNameElement.textContent = adminData.name;
    }
    
    // تحديث الصورة
    const userAvatar = document.querySelector('.user-avatar img');
    if (userAvatar && adminData.avatar) {
        userAvatar.src = adminData.avatar;
    }
}

// ===== تحديث شارات الإحصائيات =====
function updateStatsBadges() {
    // يمكن تحميل هذه البيانات من الخادم
    const stats = {
        bookings: 12,
        cars: 25,
        customers: 48,
        pendingDocs: 3
    };
    
    // تحديث الشارات
    document.getElementById('bookingsCount').textContent = stats.bookings;
    document.getElementById('carsCount').textContent = stats.cars;
    document.getElementById('customersCount').textContent = stats.customers;
    document.getElementById('pendingDocs').textContent = stats.pendingDocs;
}

// ===== تهيئة القائمة الجانبية =====
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && adminSidebar) {
        // تبديل القائمة الجانبية
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها (للأجهزة المحمولة)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                if (!adminSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    adminSidebar.classList.remove('active');
                }
            }
        });
        
        // إغلاق القائمة عند تغيير الحجم
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                adminSidebar.classList.remove('active');
            }
        });
    }
    
    // التنقل بين الأقسام
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            
            // إزالة النشاط من جميع الروابط
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // إضافة النشاط للرابط الحالي
            link.classList.add('active');
            
            // تغيير القسم
            switchSection(sectionId);
            
            // تحديث عنوان الصفحة
            updatePageTitle(sectionId);
            
            // إغلاق القائمة الجانبية على الأجهزة المحمولة
            if (window.innerWidth <= 991) {
                adminSidebar.classList.remove('active');
            }
        });
    });
}

// ===== التبديل بين الأقسام =====
function switchSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // تحميل بيانات القسم إذا لزم الأمر
        loadSectionData(sectionId);
    }
}

// ===== تحديث عنوان الصفحة =====
function updatePageTitle(sectionId) {
    const titles = {
        dashboard: 'لوحة التحكم',
        bookings: 'إدارة الحجوزات',
        cars: 'إدارة السيارات',
        customers: 'إدارة العملاء',
        documents: 'المستندات',
        reports: 'التقارير والإحصاءات',
        pricing: 'إدارة الأسعار',
        offers: 'العروض والتخفيضات',
        settings: 'الإعدادات'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || 'لوحة التحكم';
    }
}

// ===== تحميل بيانات القسم =====
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'bookings':
            loadBookingsData();
            break;
        case 'cars':
            loadCarsData();
            break;
        case 'customers':
            loadCustomersData();
            break;
        case 'documents':
            loadDocumentsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'pricing':
            loadPricingData();
            break;
        case 'offers':
            loadOffersData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// ===== تهيئة نظام البحث =====
function initAdminSearch() {
    const searchInput = document.getElementById('adminSearch');
    const searchBtn = document.querySelector('.search-box .search-btn');
    
    if (searchInput && searchBtn) {
        // البحث عند الضغط على زر البحث
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // البحث أثناء الكتابة مع تأخير
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(searchInput.value);
            }, 500);
        });
    }
}

// ===== تنفيذ البحث =====
function performSearch(query) {
    if (!query.trim()) {
        // إذا كان البحث فارغاً، إعادة تحميل البيانات العادية
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            loadSectionData(activeSection.id);
        }
        return;
    }
    
    // البحث بناءً على القسم النشط
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const sectionId = activeSection.id;
    
    switch(sectionId) {
        case 'bookings':
            searchBookings(query);
            break;
        case 'cars':
            searchCars(query);
            break;
        case 'customers':
            searchCustomers(query);
            break;
        case 'documents':
            searchDocuments(query);
            break;
    }
}

// ===== تهيئة إشعارات لوحة التحكم =====
function initAdminNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.querySelector('.notification-dropdown-content');
    
    if (notificationBtn && notificationDropdown) {
        // عرض/إخفاء قائمة الإشعارات
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.style.display = 
                notificationDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // تحميل الإشعارات
        loadNotifications();
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', () => {
            notificationDropdown.style.display = 'none';
        });
        
        // تحديد الكل كمقروء
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
        }
    }
}

// ===== تحميل الإشعارات =====
async function loadNotifications() {
    try {
        // محاكاة جلب الإشعارات من الخادم
        const notifications = await fetchAdminNotifications();
        
        const container = document.querySelector('.notification-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="notification-item">
                    <div class="notification-content">
                        <p>لا توجد إشعارات جديدة</p>
                    </div>
                </div>
            `;
            return;
        }
        
        notifications.forEach(notification => {
            const notificationElement = createNotificationElement(notification);
            container.appendChild(notificationElement);
        });
        
        // تحديث عداد الإشعارات
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
    } catch (error) {
        console.error('خطأ في تحميل الإشعارات:', error);
    }
}

// ===== جلب إشعارات المدير =====
async function fetchAdminNotifications() {
    // محاكاة جلب البيانات من الخادم
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    type: 'booking',
                    title: 'حجز جديد',
                    message: 'تم إضافة حجز جديد من قبل محمد أحمد',
                    time: 'منذ 5 دقائق',
                    read: false,
                    icon: 'calendar-check'
                },
                {
                    id: 2,
                    type: 'document',
                    title: 'مستند جديد',
                    message: 'تم رفع مستندات جديدة تحتاج للمراجعة',
                    time: 'منذ ساعة',
                    read: false,
                    icon: 'file-alt'
                },
                {
                    id: 3,
                    type: 'car',
                    title: 'سيارة بحاجة صيانة',
                    message: 'سيارة تويوتا كامري بحاجة للصيانة الدورية',
                    time: 'منذ 3 ساعات',
                    read: true,
                    icon: 'car'
                },
                {
                    id: 4,
                    type: 'customer',
                    title: 'تقييم جديد',
                    message: 'قام عميل جديد بتقييم خدمتنا بـ 5 نجوم',
                    time: 'منذ يوم',
                    read: true,
                    icon: 'star'
                }
            ]);
        }, 500);
    });
}

// ===== إنشاء عنصر إشعار =====
function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = `notification-item ${notification.read ? '' : 'unread'}`;
    div.dataset.id = notification.id;
    
    div.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <h5>${notification.title}</h5>
            <p>${notification.message}</p>
            <span class="notification-time">${notification.time}</span>
        </div>
        ${!notification.read ? '<button class="mark-read" title="تحديد كمقروء"><i class="fas fa-check"></i></button>' : ''}
    `;
    
    // إضافة مستمع حدث لتحديد كمقروء
    if (!notification.read) {
        const markReadBtn = div.querySelector('.mark-read');
        markReadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            markNotificationAsRead(notification.id);
            div.classList.remove('unread');
            markReadBtn.remove();
            
            // تحديث العداد
            updateNotificationCount();
        });
    }
    
    // إضافة مستمع حدث للانتقال للإشعار
    div.addEventListener('click', () => {
        handleNotificationClick(notification);
    });
    
    return div;
}

// ===== تحديد الإشعار كمقروء =====
function markNotificationAsRead(notificationId) {
    // محاكاة إرسال طلب للخادم
    console.log(`تم تحديد الإشعار ${notificationId} كمقروء`);
    
    // تحديث localStorage إذا لزم الأمر
}

// ===== تحديد جميع الإشعارات كمقروءة =====
function markAllNotificationsAsRead() {
    const notificationItems = document.querySelectorAll('.notification-item.unread');
    
    notificationItems.forEach(item => {
        item.classList.remove('unread');
        const markReadBtn = item.querySelector('.mark-read');
        if (markReadBtn) {
            markReadBtn.remove();
        }
    });
    
    // تحديث العداد
    updateNotificationCount();
    
    // محاكاة إرسال طلب للخادم
    console.log('تم تحديد جميع الإشعارات كمقروءة');
}

// ===== تحديث عداد الإشعارات =====
function updateNotificationCount() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// ===== التعامل مع النقر على الإشعار =====
function handleNotificationClick(notification) {
    switch(notification.type) {
        case 'booking':
            switchSection('bookings');
            break;
        case 'document':
            switchSection('documents');
            break;
        case 'car':
            switchSection('cars');
            break;
        case 'customer':
            switchSection('customers');
            break;
    }
}

// ===== تهيئة الرسوم البيانية =====
function initCharts() {
    // إعدادات عامة للرسوم البيانية
    Chart.defaults.font.family = 'Cairo, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#4b5563';
    
    // إنشاء الرسوم البيانية
    createRevenueChart();
    createPopularCarsChart();
    createPerformanceChart();
}

// ===== إنشاء مخطط الإيرادات =====
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
            datasets: [{
                label: 'الإيرادات',
                data: [4500000, 5200000, 4900000, 6100000, 5800000, 6500000, 7200000],
                borderColor: '#1a365d',
                backgroundColor: 'rgba(26, 54, 93, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `الإيرادات: ${new Intl.NumberFormat('ar-IQ').format(context.parsed.y)} دينار`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('ar-IQ').format(value);
                        }
                    }
                }
            }
        }
    });
    
    // حفظ المرجع للتحديث لاحقاً
    window.revenueChart = chart;
}

// ===== إنشاء مخطط السيارات الأكثر طلباً =====
function createPopularCarsChart() {
    const ctx = document.getElementById('popularCarsChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['تويوتا كامري', 'هيونداي النترا', 'كيا سيراتو', 'نيسان صني', 'شفروليه كابتيفا'],
            datasets: [{
                label: 'عدد الحجوزات',
                data: [45, 38, 32, 28, 24],
                backgroundColor: [
                    '#1a365d',
                    '#2c5282',
                    '#4a7eb9',
                    '#6ba3e0',
                    '#8dc6ff'
                ],
                borderColor: [
                    '#0f2541',
                    '#1a3a5f',
                    '#2a5588',
                    '#3a72b1',
                    '#4a8fda'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `الحجوزات: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10
                    }
                }
            }
        }
    });
    
    window.popularCarsChart = chart;
}

// ===== إنشاء مخطط الأداء =====
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
            datasets: [
                {
                    label: 'الحجوزات',
                    data: [65, 78, 82, 90],
                    borderColor: '#1a365d',
                    backgroundColor: 'rgba(26, 54, 93, 0.1)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'الإيرادات',
                    data: [4500000, 5200000, 6100000, 7200000],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text:
