import type { Order } from './types';
import { ORDERS } from '../data/orders';

export function toQueueOrder(
  order: typeof ORDERS[number],
  status: 'Pending' | 'Assigned' | 'Picked Up'
): Order {
  return {
    id: order.id,
    pickup: 'Current Location',
    drop: order.homeLabel,
    distance: `${order.distanceKm} km`,
    payout: `₹${order.payout.toLocaleString('en-IN')}`,
    status,
  };
}