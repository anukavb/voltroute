// src/data/mockData.js

export const START_LOCATION = {
  id: 'start',
  label: 'Current Position',
  latitude: 12.9165,
  longitude: 79.1325,
};

export const DELIVERY_DESTINATIONS = [
  {
    id: 'order_1',
    label: 'Order #VR-1042',
    latitude: 12.9245,
    longitude: 79.1330,
    distanceKm: 1.1,
    payout: 65,
  },
  {
    id: 'order_2',
    label: 'Order #VR-1043',
    latitude: 12.9410,
    longitude: 79.1420,
    distanceKm: 3.2,
    payout: 145,
  },
];

export const SWAP_STATIONS = [
  {
    id: 'swap_1',
    label: 'BaaS Kiosk - Katpadi Rd',
    latitude: 12.9200,
    longitude: 79.1360,
  },
  {
    id: 'swap_2',
    label: 'BaaS Kiosk - Gandhi Nagar',
    latitude: 12.9320,
    longitude: 79.1390,
  },
];