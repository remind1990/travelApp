import L from 'leaflet';

// const iconPerson = new L.Icon({
//   iconUrl: require('../../public/travel.svg'),
//   iconRetinaUrl: require('../../public/travel.svg'),
//   iconAnchor: null,
//   popupAnchor: null,
//   shadowUrl: null,
//   shadowSize: null,
//   shadowAnchor: null,
//   iconSize: new L.Point(60, 75),
//   className: 'leaflet-div-icon',
// });

const iconMarker = L.icon({
  iconUrl: '../../public/pass.svg',
  iconSize: [40, 60], // size of the icon
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

export { iconMarker };
