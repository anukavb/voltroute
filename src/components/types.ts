export type OrderStatus = 'Pending' | 'Assigned' | 'Picked Up';
export type VehicleStatus = 'idle' | 'enroute' | 'lowbat' | 'offline';
export type NavTab = 'home' | 'fleet' | 'history' | 'analytics';
export type AppScreen = 'home' | 'driver-profile' | 'history' | 'analytics';

export interface Order {
  id: string;
  pickup: string;
  drop: string;
  distance: string;
  payout: string;
  status: OrderStatus;
}

export interface AvailableOrder {
  id: string;
  payout: string;
  pickupKm: number;
  deliveryKm: number;
  pickupAddr: string;
  dropAddr: string;
}

export interface Vehicle {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  status: VehicleStatus;
}

export interface KPI {
  label: string;
  value: string;
}
