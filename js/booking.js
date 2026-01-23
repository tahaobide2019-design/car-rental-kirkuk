document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.step');
  const stepCards = document.querySelectorAll('.step-card');
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');

  let currentStep = 0;

  function showStep(index) {
    stepCards.forEach(card => card.classList.remove('active'));
    stepCards[index].classList.add('active');

    steps.forEach(step => step.classList.remove('active'));
    steps[index].classList.add('active');
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(currentStep < stepCards.length - 1){
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if(currentStep > 0){
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  showStep(currentStep);
});
