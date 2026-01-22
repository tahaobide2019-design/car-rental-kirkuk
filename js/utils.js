function getSelectedCar() {
  return JSON.parse(localStorage.getItem("selectedCar"));
}

function saveSelectedCar(car) {
  localStorage.setItem("selectedCar", JSON.stringify(car));
}

function saveExtras(extras) {
  localStorage.setItem("extras", JSON.stringify(extras));
}
