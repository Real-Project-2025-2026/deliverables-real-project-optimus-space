import { Space, Booking, User } from '@/types';

// Import images from assets
import halle1_1 from '@/assets/spaces/Halle_1/6d11cd3d-90ba-4d78-91c6-e5141bc8b3a5-1893024248.webp';
import halle1_2 from '@/assets/spaces/Halle_1/490e2692-9623-42c5-89f5-905ec8610d8c-1893024252.webp';
import halle1_3 from '@/assets/spaces/Halle_1/54cade36-fd36-42b9-bb86-54e6abf07620-1893024258.webp';
import halle1_4 from '@/assets/spaces/Halle_1/a19f8bbc-971c-4ba4-a7ed-93ef352be58a-1893024269.webp';
import halle1_5 from '@/assets/spaces/Halle_1/51db9027-3cb0-4c7f-abad-7bb6026b77d8-1893024583.webp';
import halle1_6 from '@/assets/spaces/Halle_1/8678a10f-3567-4c40-85b3-bd0522eb4146-1931271764.webp';
import halle1_7 from '@/assets/spaces/Halle_1/ae58a0e6-83b0-4fba-8eec-3cdd00c87f4c-1931271776.webp';

import halle2_1 from '@/assets/spaces/Halle_2/29948b11-ca40-4e81-816d-aff96decc056-1938084383.webp';
import halle2_2 from '@/assets/spaces/Halle_2/114e05b9-ba32-48a1-964c-53a398346116-1938084384.webp';
import halle2_3 from '@/assets/spaces/Halle_2/1ef332a2-1708-4ea6-b08f-cb0c217b9c30-1938084385.webp';
import halle2_4 from '@/assets/spaces/Halle_2/4e6058b5-629d-4f2b-98fe-ac468fa3c334-1938084387.webp';
import halle2_5 from '@/assets/spaces/Halle_2/33af011f-60fa-4b78-9abe-d4612d38a129-1938084388.webp';
import halle2_6 from '@/assets/spaces/Halle_2/11c0ccc1-5dd0-4087-8434-87eadfc66d7c-1938084390.webp';
import halle2_7 from '@/assets/spaces/Halle_2/abca8606-f538-4267-a562-3d4c0d2b8926-1938084391.webp';
import halle2_8 from '@/assets/spaces/Halle_2/fe13e4bb-b444-4014-a75b-ea03d1c354c8-1938084393.webp';
import halle2_9 from '@/assets/spaces/Halle_2/bbac7ed1-04c5-4e2d-9184-8bbba95fdca6-1938084394.webp';
import halle2_10 from '@/assets/spaces/Halle_2/30eda79a-d6e8-4688-970a-a69e16d36198-1938084396.webp';

import hamburg_1 from '@/assets/spaces/Hamburg/GalleryRoom3.jpg';
import hamburg_2 from '@/assets/spaces/Hamburg/GalleryRoom12_Fotor.jpg';
import hamburg_3 from '@/assets/spaces/Hamburg/GalleryRoom21_Fotor.jpg';
import hamburg_4 from '@/assets/spaces/Hamburg/kitchen.jpg';
import hamburg_5 from '@/assets/spaces/Hamburg/hallway2.jpg';
import hamburg_6 from '@/assets/spaces/Hamburg/bathroom.jpg';
import hamburg_7 from '@/assets/spaces/Hamburg/Bildschirmfoto-2024-04-17-um-15.32.14.jpg';

import munich1_1 from '@/assets/spaces/Munich_1/IMG_1946.jpg';
import munich1_2 from '@/assets/spaces/Munich_1/IMG_1950.jpg';
import munich1_3 from '@/assets/spaces/Munich_1/IMG_1961_Fotor.jpg';
import munich1_4 from '@/assets/spaces/Munich_1/IMG_1969.jpg';
import munich1_5 from '@/assets/spaces/Munich_1/3ccfacaf-17eb-46e1-a363-347eb972c17e.jpg';

import munich2_1 from '@/assets/spaces/Munich_2/60ee14652cdd694e16e6a21f_Blick-von-oben-1030x688.jpg';
import munich2_2 from '@/assets/spaces/Munich_2/615a9d1af704378bd68f502d_2109_WF_0020-1030x688.jpg';
import munich2_3 from '@/assets/spaces/Munich_2/615ac78a7ef1bac4fc2d9200_1-1-1030x688.jpg';
import munich2_4 from '@/assets/spaces/Munich_2/615ac78a84d11f532e31f994_087-1-1030x687.jpg';
import munich2_5 from '@/assets/spaces/Munich_2/615ac78aec944a2c7b68a777__1.jpg';
import munich2_6 from '@/assets/spaces/Munich_2/615adcf60f7bc44c1262aeaa_Halle-2-Fotostudio-1030x688.jpg';
import munich2_7 from '@/assets/spaces/Munich_2/60ee15d0d79753bd7c98c26a_Grundriss-Westerham_Factory-1030x714.jpg';

export const mockSpaces: Space[] = [
  {
    id: '1',
    title: 'Kompakte Gewerbefläche im Erdgeschoss',
    description: 'Helle, renovierte Gewerbefläche mit Fliesenboden und Nebenräumen. Ideal als kleines Büro, Praxis oder für Dienstleistungen. Große Fensterfront zur Straße, WC vorhanden. Sofort bezugsfertig und flexibel nutzbar.',
    address: 'Leipziger Straße 42',
    city: 'Halle (Saale)',
    postalCode: '06108',
    latitude: 51.4969,
    longitude: 11.9688,
    pricePerDay: 85,
    size: 45,
    category: 'office',
    amenities: ['electricity', 'water', 'heating'],
    images: [halle1_1, halle1_2, halle1_3, halle1_4, halle1_5, halle1_6, halle1_7],
    ownerId: 'owner1',
    ownerName: 'Immobilien Schmidt',
    rating: 4.5,
    reviewCount: 12,
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Ladenfläche mit großer Schaufensterfront',
    description: 'Attraktive Einzelhandelsfläche in guter Lage mit großen Schaufenstern und viel Tageslicht. Moderner Bodenbelag, Nebenräume und WC vorhanden. Perfekt für Pop-up Stores, Showrooms oder als temporäres Ladengeschäft.',
    address: 'Große Ulrichstraße 15',
    city: 'Halle (Saale)',
    postalCode: '06108',
    latitude: 51.4825,
    longitude: 11.9705,
    pricePerDay: 120,
    size: 75,
    category: 'popup',
    amenities: ['wifi', 'electricity', 'heating', 'accessible'],
    images: [halle2_1, halle2_2, halle2_3, halle2_4, halle2_5, halle2_6, halle2_7, halle2_8, halle2_9, halle2_10],
    ownerId: 'owner2',
    ownerName: 'Retail Spaces Halle',
    rating: 4.7,
    reviewCount: 23,
    isActive: true,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    title: 'Stilvolle Altbauwohnung für Shootings',
    description: 'Wunderschöne Altbauwohnung mit hohen Decken, Stuck und echtem Dielenboden. Perfekt für Foto- und Videoproduktionen, Interviews oder kreative Projekte. Mehrere charaktervolle Räume mit viel Tageslicht, voll ausgestattete Küche und elegantes Bad.',
    address: 'Eppendorfer Weg 89',
    city: 'Hamburg',
    postalCode: '20259',
    latitude: 53.5834,
    longitude: 9.9614,
    pricePerDay: 280,
    size: 120,
    category: 'studio',
    amenities: ['wifi', 'electricity', 'water', 'heating'],
    images: [hamburg_1, hamburg_2, hamburg_3, hamburg_4, hamburg_5, hamburg_6, hamburg_7],
    ownerId: 'owner3',
    ownerName: 'Hamburg Locations',
    rating: 4.95,
    reviewCount: 52,
    isActive: true,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    title: 'Galerie & Showroom in Bestlage',
    description: 'Eleganter Galerieraum mit professioneller Beleuchtung und Schaufenster zur Straße. Hochwertige Ausstattung mit Holzboden und moderner Lichtschiene. Ideal für Kunstausstellungen, Produktpräsentationen, Pop-up Stores oder als exklusiver Showroom.',
    address: 'Maximilianstraße 72',
    city: 'München',
    postalCode: '80336',
    latitude: 48.1351,
    longitude: 11.5540,
    pricePerDay: 350,
    size: 85,
    category: 'retail',
    amenities: ['wifi', 'electricity', 'heating', 'ac', 'accessible'],
    images: [munich1_1, munich1_2, munich1_3, munich1_4, munich1_5],
    ownerId: 'owner4',
    ownerName: 'Munich Gallery Spaces',
    rating: 4.9,
    reviewCount: 31,
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    title: 'Westerham Factory - Industrielles Fotostudio',
    description: 'Beeindruckendes Fotostudio in historischer Fabrikhalle mit industriellem Charme. Hohe Decken, Betonboden und authentische Fabriklampen. Großzügige Fläche mit Galerie-Ebene, ideal für Werbekampagnen, Modeproduktionen, Filmaufnahmen und große Events.',
    address: 'Am Alten Werk 8',
    city: 'Westerham bei München',
    postalCode: '83620',
    latitude: 47.9486,
    longitude: 11.9378,
    pricePerDay: 690,
    size: 420,
    category: 'studio',
    amenities: ['wifi', 'electricity', 'water', 'parking', 'heating', 'security'],
    images: [munich2_1, munich2_2, munich2_3, munich2_4, munich2_5, munich2_6, munich2_7],
    ownerId: 'owner5',
    ownerName: 'Westerham Factory GmbH',
    rating: 4.98,
    reviewCount: 67,
    isActive: true,
    createdAt: new Date('2024-04-01'),
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    spaceId: '1',
    spaceName: 'Kompakte Gewerbefläche im Erdgeschoss',
    spaceImage: halle1_1,
    tenantId: 'tenant1',
    tenantName: 'Max Mustermann',
    landlordId: 'owner1',
    landlordName: 'Immobilien Schmidt',
    startDate: new Date('2025-01-10'),
    endDate: new Date('2025-01-15'),
    totalDays: 6,
    totalPrice: 510,
    status: 'confirmed',
    message: 'Temporäres Büro für Projektarbeit.',
    createdAt: new Date('2024-11-28'),
  },
  {
    id: 'b2',
    spaceId: '3',
    spaceName: 'Stilvolle Altbauwohnung für Shootings',
    spaceImage: hamburg_1,
    tenantId: 'tenant1',
    tenantName: 'Max Mustermann',
    landlordId: 'owner3',
    landlordName: 'Hamburg Locations',
    startDate: new Date('2025-01-20'),
    endDate: new Date('2025-01-21'),
    totalDays: 2,
    totalPrice: 560,
    status: 'pending',
    message: 'Fotoshooting für Lifestyle-Magazin.',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'b3',
    spaceId: '5',
    spaceName: 'Westerham Factory - Industrielles Fotostudio',
    spaceImage: munich2_1,
    tenantId: 'tenant2',
    tenantName: 'Kreativ Agentur GmbH',
    landlordId: 'owner5',
    landlordName: 'Westerham Factory GmbH',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-17'),
    totalDays: 3,
    totalPrice: 2070,
    status: 'confirmed',
    message: 'Werbekampagne für Automobilhersteller.',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'b4',
    spaceId: '2',
    spaceName: 'Ladenfläche mit großer Schaufensterfront',
    spaceImage: halle2_1,
    tenantId: 'tenant3',
    tenantName: 'Fashion Startup UG',
    landlordId: 'owner2',
    landlordName: 'Retail Spaces Halle',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-14'),
    totalDays: 14,
    totalPrice: 1680,
    status: 'completed',
    message: 'Pop-up Store für unsere neue Herbstkollektion.',
    createdAt: new Date('2024-10-15'),
  },
];

export const mockUsers: User[] = [
  {
    id: 'tenant1',
    email: 'max@example.com',
    name: 'Max Mustermann',
    role: 'tenant',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'owner1',
    email: 'berlin@spaces.de',
    name: 'Berlin Spaces GmbH',
    role: 'landlord',
    createdAt: new Date('2023-11-15'),
  },
  {
    id: 'admin1',
    email: 'admin@spacefindr.de',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
  },
];

export const categoryLabels: Record<string, string> = {
  office: 'Büro',
  warehouse: 'Lager',
  popup: 'Pop-up',
  event: 'Event',
  retail: 'Einzelhandel',
  studio: 'Studio',
};

export const amenityLabels: Record<string, string> = {
  water: 'Wasser',
  electricity: 'Strom',
  wifi: 'WLAN',
  parking: 'Parkplatz',
  heating: 'Heizung',
  ac: 'Klimaanlage',
  security: 'Sicherheit',
  accessible: 'Barrierefrei',
};
