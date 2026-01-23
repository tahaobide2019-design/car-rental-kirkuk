// === عرض السيارات في manage-cars.html ===
async function loadCars() {
  const response = await fetch('../data/cars.json');
  const cars = await response.json();
  const container = document.getElementById('cars-table');
  if (!container) return;
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

// === عرض إحصائيات في dashboard.html ===
async function loadDashboard() {
  const carsResponse = await fetch('../data/cars.json');
  const cars = await carsResponse.json();
  document.getElementById('total-cars')?.innerText = cars.length;

  const bookingsResponse = await fetch('../data/bookings.json');
  const bookings = await bookingsResponse.json();
  document.getElementById('total-bookings')?.innerText = bookings.length;

  const table = document.getElementById('bookings-table');
  if (table) {
    table.innerHTML = '';
    bookings.slice(-5).forEach((b, i) => {
      table.innerHTML += `
        <tr>
          <td>HLT${i+1000}</td>
          <td>${b.customer.fullname}</td>
          <td>${b.customer.phone}</td>
          <td>${b.carId}</td>
          <td>${b.customer.pickup}</td>
          <td>${b.customer.return}</td>
        </tr>
      `;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCars();
  loadDashboard();
});
