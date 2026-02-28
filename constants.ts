
import { Shipment, ShipmentStatus } from './types';

export const getServiceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('air') || t.includes('freight')) return 'fa-plane-lock';
  if (t.includes('protection') || t.includes('asset')) return 'fa-user-shield';
  if (t.includes('courier') || t.includes('express')) return 'fa-bolt-lightning';
  if (t.includes('ghost')) return 'fa-mask';
  if (t.includes('vault')) return 'fa-vault';
  if (t.includes('ocean')) return 'fa-ship';
  if (t.includes('ground') || t.includes('truck')) return 'fa-truck-shield';
  return 'fa-box-open';
};

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    trackingNumber: '5LWVJGX73I',
    senderName: 'Jason Sharon',
    senderPhone: '+44 7700 900077',
    receiverName: 'Damjana Aupic',
    receiverPhone: '+49 151 23456789',
    origin: 'Leicester City, United Kingdom',
    destination: 'Alzbrunnen 6, 74861 Neudenau, Germany',
    currentLocation: 'Portugal Sector',
    weight: '37 kg',
    dimensions: '45x45x40 cm',
    serviceType: 'Secure Air Freight',
    status: ShipmentStatus.DELAYED,
    progress: 45,
    estimatedDelivery: '2025-08-01',
    createdAt: '2025-07-28',
    updates: [
      {
        timestamp: 'Tue, 29 Jul 2025 11:56:26 +0000',
        location: 'Portugal Customs Node',
        description: 'Security Protocol: Deep Inspection in Progress',
        status: ShipmentStatus.DELAYED
      },
      {
        timestamp: 'Tue, 29 Jul 2025 08:55:34 +0000',
        location: 'Portugal Transit Hub',
        description: 'Asset arrived in Portugal Sector',
        status: ShipmentStatus.IN_TRANSIT
      },
      {
        timestamp: 'Mon, 28 Jul 2025 16:25:25 +0000',
        location: 'UK Secure Facility',
        description: 'Transit Authorization Confirmed',
        status: ShipmentStatus.IN_TRANSIT
      },
      {
        timestamp: 'Mon, 28 Jul 2025 09:55:31 +0000',
        location: 'UK Command HQ',
        description: 'Initial Manifest Protocol Established',
        status: ShipmentStatus.PENDING
      }
    ]
  },
  {
    id: '2',
    trackingNumber: 'FG5T3Y3F5T',
    senderName: 'Tech Logistics Corp',
    senderPhone: '+65 6789 1234',
    receiverName: 'Global Distro Ltd',
    receiverPhone: '+49 30 9876543',
    origin: 'Singapore Secure Hub',
    destination: 'Berlin, Germany',
    currentLocation: 'Berlin Terminal',
    weight: '12.5 kg',
    dimensions: '30x30x30 cm',
    serviceType: 'Asset Protection',
    status: ShipmentStatus.OUT_FOR_DELIVERY,
    progress: 85,
    estimatedDelivery: '2025-07-30',
    createdAt: '2025-07-26',
    updates: [
      {
        timestamp: 'Wed, 30 Jul 2025 08:15:00 +0000',
        location: 'Berlin, Germany',
        description: 'Dispatched for local security drop',
        status: ShipmentStatus.OUT_FOR_DELIVERY
      },
      {
        timestamp: 'Tue, 29 Jul 2025 21:30:00 +0000',
        location: 'Berlin Terminal',
        description: 'Asset secured at destination terminal',
        status: ShipmentStatus.IN_TRANSIT
      }
    ]
  }
];

export const PRICING_PLANS = [
  {
    name: 'Secure-X',
    price: '$149',
    icon: 'fa-shield-halved',
    features: ['Insured Delivery', 'Standard Armed Escort', 'Encrypted Tracking', 'Max 25kg']
  },
  {
    name: 'Zentriq Prime',
    price: '$499',
    icon: 'fa-user-shield',
    features: ['Armored Air/Ground', '24/7 Intelligence Support', 'Real-time GPS Telemetry', 'Multi-Node Protection'],
    isPopular: true
  },
  {
    name: 'Ghost Protocol',
    price: 'Custom',
    icon: 'fa-mask',
    features: ['Stealth Transit', 'Tier-1 Response Team', 'Undisclosed Routing', 'Full Asset Invisibility']
  }
];

export const SERVICES = [
  {
    slug: 'asset-protection',
    title: 'Asset Protection',
    icon: 'fa-user-shield',
    description: 'Elite security personnel and armored transport units for high-value global transit.',
    features: [
      { text: 'Armed Tactical Escort', icon: 'fa-person-military-pointing' },
      { text: 'Class-A Armored Units', icon: 'fa-truck-front' },
      { text: 'Biometric Handover', icon: 'fa-fingerprint' },
      { text: 'Full Asset Insurance', icon: 'fa-file-shield' }
    ],
    technicalSpecs: {
      securityLevel: 'Tier 1 / Alpha',
      responseTime: '< 15 mins Global',
      encryption: 'AES-256-GCM',
      personnel: 'Ex-Special Forces',
      capacity: 'Unlimited Value'
    }
  },
  {
    slug: 'secure-air-freight',
    title: 'Secure Air Freight',
    icon: 'fa-plane-lock',
    description: 'Priority airborne cargo protocols with dedicated security sweeps and end-to-end monitoring.',
    features: [
      { text: 'Priority Hangar Access', icon: 'fa-warehouse' },
      { text: 'Airborne Monitoring', icon: 'fa-satellite' },
      { text: 'Rapid Customs Release', icon: 'fa-passport' },
      { text: 'Temp-Controlled holds', icon: 'fa-snowflake' }
    ],
    technicalSpecs: {
      securityLevel: 'Sky-Gate Elite',
      avgTransit: '24-48 Hours Global',
      fleet: 'Lockheed / Boeing Custom',
      surveillance: 'Continuous Thermal',
      maxAltitude: '45,000 ft Protected'
    }
  },
  {
    slug: 'ghost-logistics',
    title: 'Ghost Logistics',
    icon: 'fa-mask',
    description: 'Low-visibility transport solutions for sensitive enterprise intelligence and assets.',
    features: [
      { text: 'Non-Standard Routing', icon: 'fa-route' },
      { text: 'Unmarked Transports', icon: 'fa-car-side' },
      { text: 'Digital Trace Scrubbing', icon: 'fa-eraser' },
      { text: 'Deep Cover Handlers', icon: 'fa-user-secret' }
    ],
    technicalSpecs: {
      securityLevel: 'Black-Op Zero',
      visibility: 'Near-Zero Signature',
      tracking: 'Intermittent Pulsar',
      redundancy: 'Quad-Path Routing',
      protocol: 'Ghost-Sync 4.0'
    }
  },
  {
    slug: 'vault-infrastructure',
    title: 'Vault Infrastructure',
    icon: 'fa-vault',
    description: 'Tier-5 underground storage facilities with biometrically encrypted access points.',
    features: [
      { text: 'Underground Facilities', icon: 'fa-mountain' },
      { text: '24/7 Kinetic Defense', icon: 'fa-gun' },
      { text: 'EMP Shielding', icon: 'fa-bolt-lightning' },
      { text: 'Atomic Time Stamping', icon: 'fa-clock' }
    ],
    technicalSpecs: {
      securityLevel: 'Omega Core',
      structural: 'Reinforced Tungsten',
      airSupply: 'Closed-Loop Bio',
      access: 'Multi-Sig Biometric',
      location: 'Undisclosed Geocodes'
    }
  }
];
