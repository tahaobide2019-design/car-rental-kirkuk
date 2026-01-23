// مثال خرائط لتحديد التسليم
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    center: { lat: 33.3128, lng: 44.3615 },
    zoom: 6
  });

  const marker = new google.maps.Marker({
    position: { lat: 33.3128, lng: 44.3615 },
    map: map,
    draggable: true
  });
}
