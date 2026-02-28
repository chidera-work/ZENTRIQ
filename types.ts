
export enum ShipmentStatus {
  PENDING = 'Pending',
  IN_TRANSIT = 'In Transit',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  DELAYED = 'Delayed',
  CANCELLED = 'Cancelled'
}

export interface ShipmentUpdate {
  timestamp: string;
  location: string;
  description: string;
  status: ShipmentStatus;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  origin: string;
  destination: string;
  currentLocation: string;
  weight: string;
  dimensions: string;
  serviceType: string;
  status: ShipmentStatus;
  progress: number; // Percentage level 0-100
  estimatedDelivery: string;
  createdAt: string;
  updates: ShipmentUpdate[];
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  avatar: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  icon: string;
  features: string[];
  isPopular?: boolean;
}
