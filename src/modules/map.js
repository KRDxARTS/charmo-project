import L from 'leaflet';

export function initMap(containerId = 'campus-map', coords = [51.505, -0.09]) {
  const map = L.map(containerId).setView(coords, 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.marker(coords)
   .addTo(map)
   .bindPopup('Main Building')
   .openPopup();

  return map;
}