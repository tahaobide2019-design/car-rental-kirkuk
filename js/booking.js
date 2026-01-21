// ملف js/booking.js
class BookingSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }
    
    bindEvents() {
        // التعامل مع زر احجز الآن
        $(document).on('click', '.book-btn', (e) => this.handleBookClick(e));
        
        // إغلاق المودال
        $(document).on('click', '.close-modal', () => this.closeModal());
        $(document).on('click', '#bookingModal', (e) => {
            if (e.target.id === 'bookingModal') this.closeModal();
        });
        
        // إرسال نموذج الحجز
        $(document).on('submit', '#bookingForm', (e) => this.handleBookingSubmit(e));
    }
    
    checkLoginStatus() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                          sessionStorage.getItem('isLoggedIn') === 'true';
    }
    
    handleBookClick(e) {
        e.preventDefault();
        
        // منع التكرار
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        if (!this.isLoggedIn) {
            alert('يرجى تسجيل الدخول أولاً لحجز الموعد');
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        
        const $btn = $(e.currentTarget);
        const bookingData = {
            serviceId: $btn.data('service-id') || 1,
            serviceName: $btn.data('service-name') || 'خدمة عامة',
            doctorId: $btn.data('doctor-id') || 1,
            doctorName: $btn.data('doctor-name') || 'طبيب عام',
            price: $btn.data('price') || 0
        };
        
        this.openBookingForm(bookingData);
        
        // إعادة تفعيل الزر بعد ثانية
        setTimeout(() => {
            this.isProcessing = false;
        }, 1000);
    }
    
    openBookingForm(data) {
        // إنشاء المودال إذا لم يكن موجوداً
        if ($('#bookingModal').length === 0) {
            this.createModal();
        }
        
        // ملء البيانات
        $('#bookingServiceId').val(data.serviceId);
        $('#bookingServiceName').val(data.serviceName);
        $('#bookingDoctorId').val(data.doctorId);
        $('#bookingDoctorName').val(data.doctorName);
        
        // إظهار المودال
        $('#bookingModal').fadeIn();
        $('body').addClass('modal-open');
    }
    
    createModal() {
        const modalHTML = `
            <div id="bookingModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3><i class="fas fa-calendar-check"></i> حجز موعد</h3>
                    <form id="bookingForm">
                        <input type="hidden" id="bookingServiceId">
                        <input type="hidden" id="bookingDoctorId">
                        
                        <div class="form-group">
                            <label>الخدمة المطلوبة</label>
                            <input type="text" id="bookingServiceName" readonly class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label>اسم الطبيب</label>
                            <input type="text" id="bookingDoctorName" readonly class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label>التاريخ المطلوب</label>
                            <input type="date" id="bookingDate" required class="form-control" 
                                   min="${this.getTomorrowDate()}">
                        </div>
                        
                        <div class="form-group">
                            <label>الوقت المفضل</label>
                            <select id="bookingTime" required class="form-control">
                                <option value="">اختر الوقت</option>
                                <option value="09:00">09:00 صباحاً</option>
                                <option value="10:00">10:00 صباحاً</option>
                                <option value="11:00">11:00 صباحاً</option>
                                <option value="12:00">12:00 ظهراً</option>
                                <option value="13:00">01:00 ظهراً</option>
                                <option value="14:00">02:00 عصراً</option>
                                <option value="15:00">03:00 عصراً</option>
                                <option value="16:00">04:00 عصراً</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>ملاحظات إضافية (اختياري)</label>
                            <textarea id="bookingNotes" rows="3" class="form-control"></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> تأكيد الحجز
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        this.addModalStyles();
    }
    
    addModalStyles() {
        if ($('#modalStyles').length === 0) {
            const styles = `
                <style id="modalStyles">
                    .modal {
                        display: none;
                        position: fixed;
                        top: 0;
                        right: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.7);
                        z-index: 9999;
                        overflow-y: auto;
                    }
                    
                    .modal-content {
                        background: white;
                        margin: 50px auto;
                        padding: 30px;
                        width: 95%;
                        max-width: 500px;
                        border-radius: 10px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        animation: modalSlide 0.3s ease;
                    }
                    
                    @keyframes modalSlide {
                        from { transform: translateY(-50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    
                    .close-modal {
                        position: absolute;
                        left: 20px;
                        top: 15px;
                        font-size: 28px;
                        cursor: pointer;
                        color: #666;
                    }
                    
                    .close-modal:hover { color: #333; }
                    
                    .modal-open { overflow: hidden; }
                    
                    .form-control {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        margin-top: 5px;
                    }
                    
                    .form-group { margin-bottom: 20px; }
                    
                    .form-actions {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 30px;
                    }
                    
                    .btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    
                    .btn-primary {
                        background: #007bff;
                        color: white;
                    }
                    
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                </style>
            `;
            $('head').append(styles);
        }
    }
    
    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    closeModal() {
        $('#bookingModal').fadeOut();
        $('body').removeClass('modal-open');
    }
    
    handleBookingSubmit(e) {
        e.preventDefault();
        
        const bookingData = {
            serviceId: $('#bookingServiceId').val(),
            doctorId: $('#bookingDoctorId').val(),
            date: $('#bookingDate').val(),
            time: $('#bookingTime').val(),
            notes: $('#bookingNotes').val()
        };
        
        if (!this.validateBooking(bookingData)) return;
        
        this.submitBooking(bookingData);
    }
    
    validateBooking(data) {
        if (!data.date) {
            alert('يرجى اختيار تاريخ للحجز');
            return false;
        }
        
        if (!data.time) {
            alert('يرجى اختيار وقت للحجز');
            return false;
        }
        
        return true;
    }
    
    submitBooking(data) {
        // عرض حالة التحميل
        const $submitBtn = $('#bookingForm button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.html('<i class="fas fa-spinner fa-spin"></i> جاري الحجز...');
        $submitBtn.prop('disabled', true);
        
        // محاكاة إرسال البيانات (استبدلها بـ API حقيقي)
        setTimeout(() => {
            // هنا ضع كود الاتصال بالخادم
            console.log('Booking data:', data);
            
            alert('تم حجز الموعد بنجاح! سيتم التواصل معك لتأكيد الحجز.');
            this.closeModal();
            
            // إعادة تعيين الزر
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
        }, 1500);
    }
}

// تهيئة النظام عند تحميل الصفحة
$(document).ready(function() {
    window.bookingSystem = new BookingSystem();
    console.log('Booking system initialized');
});
