export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export type SpaceCategory = 'office' | 'warehouse' | 'popup' | 'event' | 'retail' | 'studio';

export type Amenity = 'water' | 'electricity' | 'wifi' | 'parking' | 'heating' | 'ac' | 'security' | 'accessible';

export interface Space {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  pricePerDay: number;
  size: number; // in square meters
  category: SpaceCategory;
  amenities: Amenity[];
  images: string[];
  ownerId: string;
  ownerName: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  spaceImage: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  status: BookingStatus;
  message?: string;
  createdAt: Date;
}

export type DayStatus = 'available' | 'booked' | 'blocked';

export interface CalendarDay {
  date: Date;
  status: DayStatus;
  bookingId?: string;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  category?: SpaceCategory;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  amenities?: Amenity[];
  startDate?: Date;
  endDate?: Date;
}
