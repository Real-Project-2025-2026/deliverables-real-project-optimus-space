import { supabase, isOfflineMode } from './supabase';
import { Amenity, Booking, BookingStatus, Space, SpaceCategory, DepositStatus, PaymentStatus, UsageType, CancellationPolicy } from '@/types';
import { mockSpaces, mockBookings } from '@/data/mockData';

// ============================================
// SHARED OFFLINE STORAGE (same keys as spaceService)
// ============================================

const SPACE_EDITS_KEY = 'spacefindr_space_edits';
const SPACE_IMAGES_KEY = 'spacefindr_space_images';
const USER_SPACES_KEY = 'spacefindr_user_spaces';

interface SpaceEdit {
  [spaceId: string]: Partial<Space>;
}

interface SpaceImages {
  [spaceId: string]: string[];
}

function getStoredEdits(): SpaceEdit {
  try {
    const stored = localStorage.getItem(SPACE_EDITS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function getStoredImages(): SpaceImages {
  try {
    const stored = localStorage.getItem(SPACE_IMAGES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Get user-created spaces from localStorage
function getUserSpaces(): Space[] {
  try {
    const stored = localStorage.getItem(USER_SPACES_KEY);
    if (!stored) return [];
    const spaces = JSON.parse(stored);
    // Convert date strings back to Date objects
    return spaces.map((s: Space) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

// Helper to extend mock spaces with stored edits and images
function extendMockSpaceWithStorage(space: typeof mockSpaces[0]): Space {
  const edits = getStoredEdits();
  const storedImages = getStoredImages();
  const spaceEdit = edits[space.id] || {};
  const customImages = storedImages[space.id];

  const baseSpace: Space = {
    ...space,
    allowedUsageTypes: ['popup_store', 'office', 'event'] as UsageType[],
    minRentalDays: 1,
    maxRentalDays: 30,
    depositRequired: true,
    depositAmount: space.pricePerDay * 2,
    cancellationPolicy: 'flexible' as CancellationPolicy,
    instantBooking: false,
  };

  // Apply stored edits
  const mergedSpace = {
    ...baseSpace,
    ...spaceEdit,
  };

  // Apply stored images if any
  if (customImages && customImages.length > 0) {
    mergedSpace.images = customImages;
  }

  return mergedSpace;
}

// Raw DB row types
interface SpaceRow {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  price_per_day: number;
  size: number;
  category: string;
  amenities: string[];
  images: string[] | null;
  owner_id: string;
  owner_name: string;
  rating: number | null;
  review_count: number | null;
  is_active: boolean;
  created_at: string;
}

interface BookingRow {
  id: string;
  space_id: string;
  space_name: string;
  space_image: string;
  tenant_id: string;
  tenant_name: string;
  landlord_id: string;
  landlord_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  status: string;
  message: string | null;
  created_at: string;
}

const mapSpace = (row: SpaceRow): Space => ({
  id: row.id,
  title: row.title,
  description: row.description,
  address: row.address,
  city: row.city,
  postalCode: row.postal_code,
  latitude: row.latitude,
  longitude: row.longitude,
  pricePerDay: Number(row.price_per_day),
  size: row.size,
  category: row.category as SpaceCategory,
  amenities: (row.amenities || []) as Amenity[],
  images: row.images && row.images.length > 0 ? row.images : ['/placeholder.svg'],
  ownerId: row.owner_id,
  ownerName: row.owner_name,
  rating: row.rating ?? undefined,
  reviewCount: row.review_count ?? undefined,
  isActive: row.is_active,
  createdAt: new Date(row.created_at),
});

const mapBooking = (row: BookingRow): Booking => ({
  id: row.id,
  spaceId: row.space_id,
  spaceName: row.space_name,
  spaceImage: row.space_image ?? '/placeholder.svg',
  tenantId: row.tenant_id,
  tenantName: row.tenant_name,
  landlordId: row.landlord_id,
  landlordName: row.landlord_name,
  startDate: new Date(row.start_date),
  endDate: new Date(row.end_date),
  totalDays: row.total_days,
  totalPrice: Number(row.total_price),
  status: row.status as BookingStatus,
  message: row.message ?? undefined,
  createdAt: new Date(row.created_at),
});

export async function fetchSpaces(): Promise<Space[]> {
  if (isOfflineMode) {
    // Return mock data with stored edits and images for offline/demo mode
    // Also include user-created spaces
    const mockExtended = mockSpaces.map(extendMockSpaceWithStorage);
    const storedImages = getStoredImages();
    const userCreated = getUserSpaces()
      .filter(s => s.isActive !== false)
      .map(space => {
        // Apply stored images if any
        const images = storedImages[space.id];
        if (images && images.length > 0) {
          return { ...space, images };
        }
        return space;
      });
    return [...userCreated, ...mockExtended];
  }

  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapSpace);
}

export async function fetchSpaceById(id: string): Promise<Space | null> {
  if (isOfflineMode) {
    // Check user-created spaces first
    const storedImages = getStoredImages();
    const userSpace = getUserSpaces().find(s => s.id === id);
    if (userSpace) {
      const images = storedImages[id];
      if (images && images.length > 0) {
        return { ...userSpace, images };
      }
      return userSpace;
    }
    // Then check mock spaces
    const space = mockSpaces.find(s => s.id === id);
    if (!space) return null;
    return extendMockSpaceWithStorage(space);
  }

  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSpace(data) : null;
}

// Helper to extend mock bookings with required properties
function extendMockBooking(booking: typeof mockBookings[0]): Booking {
  return {
    ...booking,
    paymentStatus: (booking.status === 'confirmed' ? 'paid' : 'pending') as PaymentStatus,
    depositStatus: (booking.status === 'confirmed' ? 'held' : 'pending') as DepositStatus,
    rentAmount: booking.totalPrice * 0.9,
    depositAmount: booking.totalPrice * 0.1,
  };
}

export async function fetchBookingsForTenant(tenantId: string): Promise<Booking[]> {
  if (isOfflineMode) {
    return mockBookings
      .filter(b => b.tenantId === tenantId || tenantId === '11111111-1111-1111-1111-111111111111')
      .map(extendMockBooking);
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBooking);
}

export async function fetchBookingsForLandlord(landlordId: string): Promise<Booking[]> {
  if (isOfflineMode) {
    return mockBookings
      .filter(b => b.landlordId === landlordId || landlordId === '22222222-2222-2222-2222-222222222222')
      .map(extendMockBooking);
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBooking);
}
