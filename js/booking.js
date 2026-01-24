document.addEventListener('DOMContentLoaded', () => {
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const steps = document.querySelectorAll('.step-card');

  let currentStep = 0;

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(currentStep < steps.length - 1){
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
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
});
