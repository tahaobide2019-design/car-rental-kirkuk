document.addEventListener('DOMContentLoaded', () => {
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const steps = document.querySelectorAll('.step-card');

  // بيانات الحجز
  const bookingData = {
    car: null,
    addons: [],
    fullName: '',
    phone: '',
    pickup: '',
    return: '',
    location: {lat: null, lng: null},
    price: 0
  };

  let currentStep = 0;

  function updateSummary() {
    const carSpan = document.getElementById('summary-car');
    const addonsSpan = document.getElementById('summary-addons');
    const nameSpan = document.getElementById('summary-name');
    const phoneSpan = document.getElementById('summary-phone');
    const priceSpan = document.getElementById('summary-price');

    if(carSpan) carSpan.textContent = bookingData.car || '---';
    if(addonsSpan) addonsSpan.textContent = bookingData.addons.length ? bookingData.addons.join(', ') : '---';
    if(nameSpan) nameSpan.textContent = bookingData.fullName || '---';
    if(phoneSpan) phoneSpan.textContent = bookingData.phone || '---';
    if(priceSpan) priceSpan.textContent = bookingData.price + '$';
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(currentStep === 0){
        // احصل على السيارة المختارة
        const selectedCar = document.querySelector('input[name="selected-car"]:checked');
        if(!selectedCar){
          alert('الرجاء اختيار سيارة');
          return;
        }
        bookingData.car = selectedCar.value;
        // احسب السعر الأساسي حسب السيارة
        const priceText = selectedCar.closest('.car-card').querySelector('.price').textContent;
        bookingData.price = parseInt(priceText.replace('$',''));
      }

      if(currentStep === 1){
        // احصل على الخدمات
        bookingData.addons = Array.from(document.querySelectorAll('input[name="addon"]:checked')).map(a => a.value);
        // أضف تكلفة الخدمات (مثال: GPS=20$, كرسي=10$, سائق=50$, توصيل=15$)
        let addonsPrice = 0;
        bookingData.addons.forEach(addon => {
          if(addon==='GPS') addonsPrice+=20;
          if(addon==='ChildSeat') addonsPrice+=10;
          if(addon==='Driver') addonsPrice+=50;
          if(addon==='Delivery') addonsPrice+=15;
        });
        bookingData.price += addonsPrice;

        // احصل على بيانات الزبون
        bookingData.fullName = document.querySelector('input[name="fullName"]').value;
        bookingData.phone = document.querySelector('input[name="phone"]').value;
        bookingData.pickup = document.querySelector('input[name="pickup"]').value;
        bookingData.return = document.querySelector('input[name="return"]').value;

        // تحقق من البيانات
        if(!bookingData.fullName || !bookingData.phone || !bookingData.pickup || !bookingData.return){
          alert('الرجاء تعبئة جميع البيانات المطلوبة');
          return;
        }
      }

      // انتقل للخطوة التالية
      if(currentStep < steps.length -1){
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');

        if(currentStep === 2){
          updateSummary();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(currentStep > 0){
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
      }
    });
  });

  // حفظ موقع الزبون من الخريطة
  window.setCustomerLocation = function(lat, lng){
    bookingData.location.lat = lat;
    bookingData.location.lng = lng;
    console.log('موقع الزبون:', lat, lng);
  }
});
