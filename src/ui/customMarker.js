import L from 'leaflet';

const iconMarker = L.icon({
  iconUrl: '/pass.svg',
  iconSize: [30, 50], // size of the icon
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

export { iconMarker };
