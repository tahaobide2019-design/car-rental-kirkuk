// إدارة السيارات في لوحة التحكم
async function loadCars() {
  const response = await fetch('../data/cars.json');
  const cars = await response.json();
  const container = document.getElementById('cars-table');
  container.innerHTML = '';
  cars.forEach(car => {
    container.innerHTML += `
      <tr>
        <td>${car.id}</td>
        <td>${car.name}</td>
        <td>${car.type}</td>
        <td>${car.price}</td>
        <td><button class="edit" data-id="${car.id}">تعديل</button></td>
        <td><button class="delete" data-id="${car.id}">حذف</button></td>
      </tr>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cars-table')) loadCars();
});
