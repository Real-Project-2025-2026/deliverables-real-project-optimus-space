import { supabase } from './supabase';
import { Amenity, Booking, BookingStatus, Space, SpaceCategory } from '@/types';

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
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapSpace);
}

export async function fetchSpaceById(id: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSpace(data) : null;
}

export async function fetchBookingsForTenant(tenantId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBooking);
}

export async function fetchBookingsForLandlord(landlordId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapBooking);
}
