// دالة لتحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل القائمة المتنقلة للجوال
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
            });
        });
    }
    
    // زر العودة للأعلى
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // تفعيل نماذج البحث
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const location = document.getElementById('location').value;
            
            if (!location) {
                alert('يرجى اختيار موقع الاستلام في كركوك');
                return;
            }
            
            // هنا يمكنك إضافة منطق البحث
            console.log('بحث عن سيارة في:', location);
        });
    }
    
    // تفعيل نموذج النشرة البريدية
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                alert(`شكراً على اشتراكك! سيتم إرسال العروض إلى ${email}`);
                emailInput.value = '';
            }
        });
    }
    
    // تعيين التاريخ الافتراضي في نماذج البحث
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    
    if (pickupDate && returnDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        pickupDate.min = todayStr;
        pickupDate.value = todayStr;
        returnDate.min = tomorrowStr;
        returnDate.value = tomorrowStr;
    }
});

// دالة لتحميل السيارات المميزة
function loadFeaturedCars(carsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = carsData.map(car => `
        <div class="car-card">
            <div class="car-image">
                <img src="${car.image}" alt="${car.name}" loading="lazy">
                <span class="car-type ${car.type.includes('فاخرة') ? 'type-luxury' : car.type.includes('عائلية') ? 'type-suv' : 'type-economy'}">${car.type}</span>
            </div>
            <div class="car-details">
                <h3>${car.name}</h3>
                <div class="car-features">
                    ${car.features.map(feat => `<span>${feat}</span>`).join('')}
                </div>
                <div class="car-price">${car.price} دينار/يوم</div>
                <a href="booking.html?id=${car.id}" class="btn btn-primary">احجز الآن</a>
            </div>
        </div>
    `).join('');
        }
