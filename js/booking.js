let bookingData = {
  carId: null,
  extras: {},
  customer: {}
};

document.addEventListener('DOMContentLoaded', () => {
  // تحديد السيارة من URL
  const params = new URLSearchParams(window.location.search);
  const carId = params.get('car');
  if (carId) bookingData.carId = carId;

  const steps = Array.from(document.querySelectorAll('.step'));
  let currentStep = 0;

  function showStep(index) {
    steps.forEach(s => s.classList.remove('active'));
    steps[index].classList.add('active');
    currentStep = index;
  }

  // أزرار التنقل
  document.getElementById('next-to-step-2')?.addEventListener('click', () => showStep(1));
  document.getElementById('back-to-step-1')?.addEventListener('click', () => showStep(0));
  document.getElementById('next-to-step-3')?.addEventListener('click', () => {
    const extrasForm = document.getElementById('extras-form');
    bookingData.extras = {
      delivery: extrasForm.delivery.checked,
      childSeat: extrasForm['child-seat'].checked,
      gps: extrasForm.gps.checked,
      driver: extrasForm.driver.checked
    };
    showStep(2);
  });
  document.getElementById('back-to-step-2')?.addEventListener('click', () => showStep(1));

  // حفظ بيانات الزبون
  document.getElementById('customer-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    bookingData.customer = {
      fullname: form.fullname.value,
      phone: form.phone.value,
      id: form.id.files[0]?.name || '',
      license: form.license.files[0]?.name || '',
      pickup: form.pickup.value,
      return: form.return.value
    };
    // حفظ في bookings.json (محلي)
    console.log('تم الحجز:', bookingData);
    alert('تم تأكيد الحجز! رقم المرجع: HLT' + Math.floor(Math.random()*10000));
    form.reset();
    showStep(0);
  });
});
