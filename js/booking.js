// js/booking.js
let currentStep = 1;
const carPriceDay = parseInt(new URLSearchParams(window.location.search).get('carPrice')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    updatePrice();
    
    // مستمعات التغيير لحساب السعر فوراً
    document.querySelectorAll('.extra-service, #dateStart, #dateEnd').forEach(el => {
        el.addEventListener('change', updatePrice);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if(currentStep < 3) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateUI();
        } else {
            processBooking(); // من ملف whatsapp.js
        }
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateUI();
    });
});

function updatePrice() {
    const start = new Date(document.getElementById('dateStart').value);
    const end = new Date(document.getElementById('dateEnd').value);
    
    let days = 1;
    if (start && end && end > start) {
        const diff = end - start;
        days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    let extraTotal = 0;
    document.querySelectorAll('.extra-service:checked').forEach(s => {
        extraTotal += parseInt(s.value);
    });

    const total = (carPriceDay * days) + extraTotal;
    document.getElementById('totalDisplay').innerText = `${total}$`;
}

function updateUI() {
    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').innerText = currentStep === 3 ? 'إرسال عبر الواتساب' : 'التالي';
    
    // تحديث الدوائر والخط
    for(let i=1; i<=3; i++) {
        document.getElementById(`c${i}`).classList.toggle('active', i <= currentStep);
    }
    document.getElementById('line-fill').style.width = ((currentStep-1) / 2 * 100) + '%';
}
