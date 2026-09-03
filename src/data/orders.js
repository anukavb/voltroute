export const START_LOCATION = {
  id: 'start',
  label: 'Current Position',
  latitude: 12.9165,
  longitude: 79.1325,
};

export const ORDERS = [
  { id: 'ORD-00420', homeLabel: 'Katpadi Junction', latitude: 12.9165, longitude: 79.1370, distanceKm: 3.2, payout: 320 },
  { id: 'ORD-00421', homeLabel: 'VIT Main Gate', latitude: 12.9698, longitude: 79.1559, distanceKm: 6.8, payout: 540 },
  { id: 'ORD-00422', homeLabel: 'Sathuvachari', latitude: 12.8990, longitude: 79.1180, distanceKm: 11.5, payout: 890 },
  { id: 'ORD-00423', homeLabel: 'Vellore Market', latitude: 12.9180, longitude: 79.1300, distanceKm: 1.4, payout: 210 },
  { id: 'ORD-00424', homeLabel: 'Gandhi Nagar', latitude: 12.9320, longitude: 79.1390, distanceKm: 18.5, payout: 1450 },
];

export const SWAP_STATIONS = [
  { id: 'swap_1', label: 'BaaS Kiosk - Katpadi Rd', latitude: 12.9200, longitude: 79.1360 },
  { id: 'swap_2', label: 'BaaS Kiosk - Gandhi Nagar', latitude: 12.9320, longitude: 79.1390 },
  { id: 'swap_3', label: 'BaaS Kiosk - VIT Main Gate', latitude: 12.9698, longitude: 79.1559 },
];

export function toAvailableOrder(order) {
  return {
    id: order.id,
    payout: `₹${order.payout.toLocaleString('en-IN')}`,
    pickupKm: 0,
    deliveryKm: order.distanceKm,
    pickupAddr: 'Current Location',
    dropAddr: order.homeLabel,
  };
}

export const availableOrders = ORDERS.map(toAvailableOrder);