/**
 * booking.js - إدارة نظام الحجوزات لتأجير السيارات
 * تأجير سيارات كركوك
 */

// بيانات الحجوزات المخزنة محلياً (في تطبيق حقيقي، سيتم جلبها من قاعدة البيانات)
let bookings = JSON.parse(localStorage.getItem('carRentalBookings')) || [
    {
        id: 'BK001',
        carId: 'CAR001',
        carName: 'تويوتا كامري 2023',
        customerName: 'علي أحمد',
        customerPhone: '07701234567',
        customerEmail: 'ali.ahmed@example.com',
        startDate: '2023-11-01',
        endDate: '2023-11-05',
        totalDays: 4,
        dailyRate: 50000,
        totalAmount: 200000,
        paymentStatus: 'مدفوع',
        bookingStatus: 'نشطة',
        createdAt: '2023-10-25',
        notes: 'يحتاج إلى مقعد أطفال'
    },
    {
        id: 'BK002',
        carId: 'CAR002',
        carName: 'هيونداي سوناتا 2022',
        customerName: 'سارة محمد',
        customerPhone: '07707654321',
        customerEmail: 'sara.mohamed@example.com',
        startDate: '2023-11-10',
        endDate: '2023-11-15',
        totalDays: 5,
        dailyRate: 45000,
        totalAmount: 225000,
        paymentStatus: 'مدفوع جزئياً',
        bookingStatus: 'مؤكدة',
        createdAt: '2023-10-26',
        notes: ''
    },
    {
        id: 'BK003',
        carId: 'CAR003',
        carName: 'كيا سورينتو 2023',
        customerName: 'حسن كريم',
        customerPhone: '07709876543',
        customerEmail: 'hassan.kareem@example.com',
        startDate: '2023-11-03',
        endDate: '2023-11-08',
        totalDays: 5,
        dailyRate: 60000,
        totalAmount: 300000,
        paymentStatus: 'غير مدفوع',
        bookingStatus: 'قيد الانتظار',
        createdAt: '2023-10-27',
        notes: 'تأخير في الدفع'
    }
];

// بيانات السيارات
let cars = JSON.parse(localStorage.getItem('carRentalCars')) || [
    {
        id: 'CAR001',
        brand: 'تويوتا',
        model: 'كامري 2023',
        plateNumber: 'كركوك 1234 أ ب',
        color: 'أبيض',
        dailyRate: 50000,
        status: 'محجوزة'
    },
    {
        id: 'CAR002',
        brand: 'هيونداي',
        model: 'سوناتا 2022',
        plateNumber: 'كركوك 5678 ج د',
        color: 'أسود',
        dailyRate: 45000,
        status: 'محجوزة'
    },
    {
        id: 'CAR003',
        brand: 'كيا',
        model: 'سورينتو 2023',
        plateNumber: 'كركوك 9012 هـ و',
        color: 'رمادي',
        dailyRate: 60000,
        status: 'محجوزة'
    },
    {
        id: 'CAR004',
        brand: 'نيسان',
        model: 'صني 2023',
        plateNumber: 'كركوك 3456 ز ح',
        color: 'أزرق',
        dailyRate: 35000,
        status: 'متاحة'
    }
];

// ============================================
// وظائف إدارة الحجوزات
// ============================================

/**
 * تهيئة صفحة الحجوزات
 */
function initBookingsPage() {
    loadBookingsTable();
    updateStats();
    setupEventListeners();
    loadCarsForDropdown();
}

/**
 * تحميل جدول الحجوزات
 */
function loadBookingsTable(filter = 'all') {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    let filteredBookings = bookings;
    
    // تطبيق التصفية
    if (filter !== 'all') {
        filteredBookings = bookings.filter(booking => booking.bookingStatus === filter);
    }

    // البحث (إذا كان هناك حقل بحث)
    const searchInput = document.getElementById('bookingSearch');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredBookings = filteredBookings.filter(booking => 
            booking.customerName.toLowerCase().includes(searchTerm) ||
            booking.customerPhone.includes(searchTerm) ||
            booking.carName.toLowerCase().includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm)
        );
    }

    // الفرز (افترضياً حسب التاريخ الجديد أولاً)
    filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // تفريغ الجدول
    tableBody.innerHTML = '';

    // إضافة الصفوف
    if (filteredBookings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px;">
                    <i class="fas fa-calendar-times" style="font-size: 3rem; color: #94a3b8; margin-bottom: 15px; display: block;"></i>
                    <p style="color: #64748b; font-size: 1.1rem;">لا توجد حجوزات</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredBookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        
        // تحديد لون حالة الحجز
        let statusClass = '';
        let statusText = '';
        switch(booking.bookingStatus) {
            case 'نشطة':
                statusClass = 'status-active';
                statusText = 'نشطة';
                break;
            case 'مؤكدة':
                statusClass = 'status-confirmed';
                statusText = 'مؤكدة';
                break;
            case 'قيد الانتظار':
                statusClass = 'status-pending';
                statusText = 'قيد الانتظار';
                break;
            case 'ملغاة':
                statusClass = 'status-cancelled';
                statusText = 'ملغاة';
                break;
            case 'مكتملة':
                statusClass = 'status-completed';
                statusText = 'مكتملة';
                break;
        }

        // تحديد لون حالة الدفع
        let paymentClass = '';
        switch(booking.paymentStatus) {
            case 'مدفوع':
                paymentClass = 'status-paid';
                break;
            case 'مدفوع جزئياً':
                paymentClass = 'status-partial';
                break;
            case 'غير مدفوع':
                paymentClass = 'status-unpaid';
                break;
        }

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>
                <strong>${booking.carName}</strong><br>
                <small class="text-muted">${booking.carId}</small>
            </td>
            <td>
                <strong>${booking.customerName}</strong><br>
                <small class="text-muted">${booking.customerPhone}</small>
            </td>
            <td>${formatDate(booking.startDate)}</td>
            <td>${formatDate(booking.endDate)}</td>
            <td>${booking.totalDays} يوم</td>
            <td>${formatCurrency(booking.totalAmount)}</td>
            <td><span class="status-badge ${paymentClass}">${booking.paymentStatus}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formatDate(booking.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn view-btn" onclick="viewBookingDetails('${booking.id}')" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editBooking('${booking.id}')" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteBooking('${booking.id}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * تحديث الإحصائيات
 */
function updateStats() {
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.bookingStatus === 'نشطة').length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'قيد الانتظار').length;
    
    // حساب إجمالي الإيرادات من الحجوزات المدفوعة
    const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'مدفوع')
        .reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // تحديث عناصر HTML (إذا كانت موجودة)
    const totalBookingsEl = document.getElementById('totalBookingsCount');
    const activeBookingsEl = document.getElementById('activeBookingsCount');
    const revenueEl = document.getElementById('revenueCount');
    const pendingBookingsEl = document.getElementById('pendingBookingsCount');
    
    if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
    if (activeBookingsEl) activeBookingsEl.textContent = activeBookings;
    if (revenueEl) revenueEl.textContent = formatCurrency(totalRevenue);
    if (pendingBookingsEl) pendingBookingsEl.textContent = pendingBookings;
}

/**
 * إعداد مستمعي الأحداث
 */
function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('bookingSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadBookingsTable());
    }
    
    // التصفية
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            filterButtons.forEach(b => b.classList.remove('active'));
            // إضافة النشاط للزر المضغوط
            this.classList.add('active');
            // تحميل الجدول مع التصفية
            const filter = this.getAttribute('data-filter');
            loadBookingsTable(filter);
        });
    });
    
    // زر إضافة حجز جديد
    const addBookingBtn = document.getElementById('addBookingBtn');
    if (addBookingBtn) {
        addBookingBtn.addEventListener('click', showAddBookingModal);
    }
    
    // حاسبة السعر
    const calculatePriceBtn = document.getElementById('calculatePriceBtn');
    if (calculatePriceBtn) {
        calculatePriceBtn.addEventListener('click', calculateBookingPrice);
    }
    
    // تغيير السيارة في نموذج الحجز
    const carSelect = document.getElementById('bookingCar');
    if (carSelect) {
        carSelect.addEventListener('change', updateCarDetails);
    }
    
    // تغيير التواريخ في نموذج الحجز
    const startDateInput = document.getElementById('bookingStartDate');
    const endDateInput = document.getElementById('bookingEndDate');
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', updateTotalDays);
        endDateInput.addEventListener('change', updateTotalDays);
    }
}

/**
 * تحميل السيارات في القائمة المنسدلة
 */
function loadCarsForDropdown() {
    const carSelect = document.getElementById('bookingCar');
    if (!carSelect) return;
    
    // تصفية السيارات المتاحة فقط
    const availableCars = cars.filter(car => car.status === 'متاحة');
    
    carSelect.innerHTML = '<option value="">اختر سيارة</option>';
    
    availableCars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand} ${car.model} - ${car.plateNumber} (${formatCurrency(car.dailyRate)}/يوم)`;
        option.setAttribute('data-rate', car.dailyRate);
        carSelect.appendChild(option);
    });
}

/**
 * عرض تفاصيل الحجز
 */
function viewBookingDetails(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        alert('الحجز غير موجود');
        return;
    }
    
    // عرض تفاصيل الحجز في modal
    const modalContent = `
        <div class="modal-header">
            <h3>تفاصيل الحجز #${booking.id}</h3>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="booking-details">
                <div class="detail-section">
                    <h4><i class="fas fa-car"></i> معلومات السيارة</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">السيارة:</span>
                            <span class="detail-value">${booking.carName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">رقم السيارة:</span>
                            <span class="detail-value">${booking.carId}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-user"></i> معلومات العميل</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">اسم العميل:</span>
                            <span class="detail-value">${booking.customerName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">رقم الهاتف:</span>
                            <span class="detail-value">${booking.customerPhone}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">البريد الإلكتروني:</span>
                            <span class="detail-value">${booking.customerEmail || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-alt"></i> معلومات الحجز</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">تاريخ البدء:</span>
                            <span class="detail-value">${formatDate(booking.startDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">تاريخ الانتهاء:</span>
                            <span class="detail-value">${formatDate(booking.endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">عدد الأيام:</span>
                            <span class="detail-value">${booking.totalDays} يوم</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">السعر اليومي:</span>
                            <span class="detail-value">${formatCurrency(booking.dailyRate)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-money-bill-wave"></i> معلومات الدفع</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">المبلغ الإجمالي:</span>
                            <span class="detail-value">${formatCurrency(booking.totalAmount)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">حالة الدفع:</span>
                            <span class="status-badge ${booking.paymentStatus === 'مدفوع' ? 'status-paid' : booking.paymentStatus === 'مدفوع جزئياً' ? 'status-partial' : 'status-unpaid'}">
                                ${booking.paymentStatus}
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">حالة الحجز:</span>
                            <span class="status-badge ${booking.bookingStatus === 'نشطة' ? 'status-active' : booking.bookingStatus === 'مؤكدة' ? 'status-confirmed' : booking.bookingStatus === 'قيد الانتظار' ? 'status-pending' : 'status-cancelled'}">
                                ${booking.bookingStatus}
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">تاريخ الحجز:</span>
                            <span class="detail-value">${formatDate(booking.createdAt)}</span>
                        </div>
                    </div>
                </div>
                
                ${booking.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> ملاحظات إضافية</h4>
                    <div class="notes-box">
                        ${booking.notes}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إغلاق</button>
            <button class="btn btn-primary" onclick="printBooking('${booking.id}')">
                <i class="fas fa-print"></i> طباعة
            </button>
            ${booking.bookingStatus !== 'مكتملة' && booking.bookingStatus !== 'ملغاة' ? `
            <button class="btn btn-success" onclick="changeBookingStatus('${booking.id}', 'مكتملة')">
                <i class="fas fa-check-circle"></i> تم الاستلام
            </button>
            ` : ''}
        </div>
    `;
    
    showModal(modalContent);
}

/**
 * تعديل الحجز
 */
function editBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        alert('الحجز غير موجود');
        return;
    }
    
    // إنشاء نموذج التعديل
    const modalContent = `
        <div class="modal-header">
            <h3>تعديل الحجز #${booking.id}</h3>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="editBookingForm" onsubmit="updateBooking('${booking.id}'); return false;">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">حالة الحجز</label>
                        <select class="form-select" id="editBookingStatus" required>
                            <option value="قيد الانتظار" ${booking.bookingStatus === 'قيد الانتظار' ? 'selected' : ''}>قيد الانتظار</option>
                            <option value="مؤكدة" ${booking.bookingStatus === 'مؤكدة' ? 'selected' : ''}>مؤكدة</option>
                            <option value="نشطة" ${booking.bookingStatus === 'نشطة' ? 'selected' : ''}>نشطة</option>
                            <option value="مكتملة" ${booking.bookingStatus === 'مكتملة' ? 'selected' : ''}>مكتملة</option>
                            <option value="ملغاة" ${booking.bookingStatus === 'ملغاة' ? 'selected' : ''}>ملغاة</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">حالة الدفع</label>
                        <select class="form-select" id="editPaymentStatus" required>
                            <option value="غير مدفوع" ${booking.paymentStatus === 'غير مدفوع' ? 'selected' : ''}>غير مدفوع</option>
                            <option value="مدفوع جزئياً" ${booking.paymentStatus === 'مدفوع جزئياً' ? 'selected' : ''}>مدفوع جزئياً</option>
                            <option value="مدفوع" ${booking.paymentStatus === 'مدفوع' ? 'selected' : ''}>مدفوع</option>
                        </select>
                    </div>
                    
                    <div class="form-group full-width">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" id="editBookingNotes" placeholder="أدخل أي ملاحظات إضافية...">${booking.notes || ''}</textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">إلغاء</button>
            <button class="btn btn-primary" onclick="updateBooking('${booking.id}')">
                <i class="fas fa-save"></i> حفظ التغييرات
            </button>
        </div>
    `;
    
    showModal(modalContent);
}

/**
 * تحديث الحجز
 */
