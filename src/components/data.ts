import type { KPI, Order, AvailableOrder, Vehicle } from './types';

export const COLORS = {
  bg: '#FFFFFF',
  cardBg: '#F5F6FA',
  green: '#00E676',
  greenDark: '#00C853',
  blue: '#2979FF',
  amber: '#FFB300',
  red: '#FF3D57',
  textDark: '#111827',
  textMid: '#374151',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  shadow: 'rgba(0,0,0,0.08)',
} as const;

export const BATTERY_LEVEL = 38;
export const RANGE_PER_PERCENT = 0.5;
export const AVAILABLE_RANGE = BATTERY_LEVEL * RANGE_PER_PERCENT;

export function getBatteryColor(level: number): string {
  if (level > 50) return COLORS.green;
  if (level > 20) return COLORS.amber;
  return COLORS.red;
}

export const VEHICLE_STATUS_COLOR: Record<string, string> = {
  idle: COLORS.green,
  enroute: COLORS.blue,
  lowbat: COLORS.amber,
  offline: COLORS.red,
};

export const kpis: KPI[] = [
  { label: 'Active Fleet', value: '18' },
  { label: 'Pending Orders', value: '6' },
  { label: 'In Transit', value: '9' },
  { label: 'Avg Assign', value: '2.3s' },
  { label: 'Utilization', value: '74%' },
];

export const vehicles: Vehicle[] = [
  { id: 'V-01', x: 28, y: 42, status: 'idle' },
  { id: 'V-02', x: 55, y: 30, status: 'enroute' },
  { id: 'V-03', x: 72, y: 58, status: 'enroute' },
  { id: 'V-04', x: 18, y: 65, status: 'lowbat' },
  { id: 'V-05', x: 84, y: 22, status: 'idle' },
  { id: 'V-06', x: 43, y: 72, status: 'offline' },
  { id: 'V-07', x: 62, y: 15, status: 'enroute' },
  { id: 'V-08', x: 90, y: 70, status: 'idle' },
];

export const orders: Order[] = [
  {
    id: 'ORD-00412',
    pickup: 'Terminal 3, Airport Rd',
    drop: '14 Marina Bay St',
    distance: '12.4 km',
    payout: '$18.50',
    status: 'Assigned',
  },
  {
    id: 'ORD-00413',
    pickup: 'Central Park Ave, N12',
    drop: 'Westfield Mall, W4',
    distance: '7.1 km',
    payout: '$11.00',
    status: 'Pending',
  },
  {
    id: 'ORD-00409',
    pickup: 'Harbor Dock Gate B',
    drop: 'Eastside Depot, E3',
    distance: '5.8 km',
    payout: '$9.75',
    status: 'Picked Up',
  },
  {
    id: 'ORD-00414',
    pickup: 'Union Station, Level 1',
    drop: 'Northgate Plaza, N8',
    distance: '9.2 km',
    payout: '$14.20',
    status: 'Pending',
  },
  {
    id: 'ORD-00410',
    pickup: 'Skyline Tower, S1',
    drop: 'Greenview Suburb, G7',
    distance: '16.3 km',
    payout: '$22.80',
    status: 'Assigned',
  },
  {
    id: 'ORD-00408',
    pickup: 'Riverside Market, RM2',
    drop: 'Old Town Square, OT5',
    distance: '3.5 km',
    payout: '$7.00',
    status: 'Picked Up',
  },
];

export const availableOrders: AvailableOrder[] = [
  {
    id: 'ORD-00420',
    payout: '$12.50',
    pickupKm: 2.4,
    deliveryKm: 4.1,
    pickupAddr: 'Central Station, Platform 3',
    dropAddr: 'Westfield Mall, Gate A',
  },
  {
    id: 'ORD-00421',
    payout: '$18.00',
    pickupKm: 5.2,
    deliveryKm: 9.8,
    pickupAddr: 'Harbor Dock Gate B',
    dropAddr: 'Tech Park East, E2',
  },
  {
    id: 'ORD-00422',
    payout: '$28.75',
    pickupKm: 8.5,
    deliveryKm: 12.3,
    pickupAddr: 'North Logistics Depot',
    dropAddr: 'Sunrise Suburb, Block 7',
  },
  {
    id: 'ORD-00423',
    payout: '$9.90',
    pickupKm: 3.1,
    deliveryKm: 7.2,
    pickupAddr: 'Airport Terminal 2',
    dropAddr: 'City Center, Main Sq',
  },
  {
    id: 'ORD-00424',
    payout: '$31.50',
    pickupKm: 6.8,
    deliveryKm: 14.5,
    pickupAddr: 'Marina Bay Warehouse',
    dropAddr: 'Greenview Hills, GH-14',
  },
];
