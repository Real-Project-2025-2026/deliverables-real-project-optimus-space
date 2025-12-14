import { supabase, isOfflineMode } from '../supabase';
import {
  Space,
  SpaceFormInput,
  SpaceAvailability,
  SpaceCategory,
  Amenity,
  CancellationPolicy,
  UsageType,
} from '@/types';
import { mockSpaces } from '@/data/mockData';

// Helper to extend mock spaces with required properties
function extendMockSpace(space: typeof mockSpaces[0]): Space {
  return {
    ...space,
    allowedUsageTypes: ['popup_store', 'office', 'event'] as UsageType[],
    minRentalDays: 1,
    maxRentalDays: 30,
    depositRequired: true,
    depositAmount: space.pricePerDay * 2,
    cancellationPolicy: 'flexible' as CancellationPolicy,
    instantBooking: false,
  };
}

// ============================================
// RAW DB ROW TYPES
// ============================================

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
  price_per_week: number | null;
  price_per_month: number | null;
  size: number;
  category: string;
  amenities: string[];
  allowed_usage_types: string[] | null;
  images: string[] | null;
  owner_id: string;
  owner_name: string;
  rating: number | null;
  review_count: number | null;
  is_active: boolean;
  min_rental_days: number | null;
  max_rental_days: number | null;
  deposit_required: boolean | null;
  deposit_amount: number | null;
  cancellation_policy: string | null;
  instant_booking: boolean | null;
  created_at: string;
  updated_at: string | null;
}

interface SpaceAvailabilityRow {
  id: string;
  space_id: string;
  start_date: string;
  end_date: string;
  availability_type: string;
  notes: string | null;
  created_at: string;
}

// ============================================
// MAPPERS
// ============================================

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
  pricePerWeek: row.price_per_week ? Number(row.price_per_week) : undefined,
  pricePerMonth: row.price_per_month ? Number(row.price_per_month) : undefined,
  size: row.size,
  category: row.category as SpaceCategory,
  amenities: (row.amenities || []) as Amenity[],
  allowedUsageTypes: (row.allowed_usage_types || []) as UsageType[],
  images: row.images && row.images.length > 0 ? row.images : ['/placeholder.svg'],
  ownerId: row.owner_id,
  ownerName: row.owner_name,
  rating: row.rating ?? undefined,
  reviewCount: row.review_count ?? undefined,
  isActive: row.is_active,
  minRentalDays: row.min_rental_days ?? 1,
  maxRentalDays: row.max_rental_days ?? 365,
  depositRequired: row.deposit_required ?? true,
  depositAmount: row.deposit_amount ? Number(row.deposit_amount) : undefined,
  cancellationPolicy: (row.cancellation_policy || 'flexible') as CancellationPolicy,
  instantBooking: row.instant_booking ?? false,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

const mapSpaceAvailability = (row: SpaceAvailabilityRow): SpaceAvailability => ({
  id: row.id,
  spaceId: row.space_id,
  startDate: new Date(row.start_date),
  endDate: new Date(row.end_date),
  availabilityType: row.availability_type as 'available' | 'blocked' | 'maintenance',
  notes: row.notes ?? undefined,
  createdAt: new Date(row.created_at),
});

// ============================================
// SPACE SERVICE
// ============================================

export const spaceService = {
  // Fetch all active spaces
  async fetchAll(): Promise<Space[]> {
    if (isOfflineMode) {
      return mockSpaces.map(extendMockSpace);
    }

    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapSpace);
  },

  // Fetch space by ID
  async fetchById(id: string): Promise<Space | null> {
    if (isOfflineMode) {
      const space = mockSpaces.find(s => s.id === id);
      return space ? extendMockSpace(space) : null;
    }

    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapSpace(data) : null;
  },

  // Fetch spaces by owner (landlord)
  async fetchByOwner(ownerId: string): Promise<Space[]> {
    if (isOfflineMode) {
      // Return some spaces for demo landlord
      return mockSpaces.slice(0, 3).map(extendMockSpace);
    }

    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapSpace);
  },

  // Create new space
  async create(input: SpaceFormInput, ownerId: string, ownerName: string): Promise<Space> {
    const { data, error } = await supabase
      .from('spaces')
      .insert({
        title: input.title,
        description: input.description,
        address: input.address,
        city: input.city,
        postal_code: input.postalCode,
        latitude: input.latitude ?? 0,
        longitude: input.longitude ?? 0,
        price_per_day: input.pricePerDay,
        price_per_week: input.pricePerWeek,
        price_per_month: input.pricePerMonth,
        size: input.size,
        category: input.category,
        amenities: input.amenities,
        allowed_usage_types: input.allowedUsageTypes,
        owner_id: ownerId,
        owner_name: ownerName,
        min_rental_days: input.minRentalDays ?? 1,
        max_rental_days: input.maxRentalDays ?? 365,
        deposit_required: input.depositRequired ?? true,
        deposit_amount: input.depositAmount,
        cancellation_policy: input.cancellationPolicy ?? 'flexible',
        instant_booking: input.instantBooking ?? false,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return mapSpace(data);
  },

  // Update space
  async update(id: string, input: Partial<SpaceFormInput>): Promise<Space> {
    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.address !== undefined) updateData.address = input.address;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.postalCode !== undefined) updateData.postal_code = input.postalCode;
    if (input.latitude !== undefined) updateData.latitude = input.latitude;
    if (input.longitude !== undefined) updateData.longitude = input.longitude;
    if (input.pricePerDay !== undefined) updateData.price_per_day = input.pricePerDay;
    if (input.pricePerWeek !== undefined) updateData.price_per_week = input.pricePerWeek;
    if (input.pricePerMonth !== undefined) updateData.price_per_month = input.pricePerMonth;
    if (input.size !== undefined) updateData.size = input.size;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.amenities !== undefined) updateData.amenities = input.amenities;
    if (input.allowedUsageTypes !== undefined) updateData.allowed_usage_types = input.allowedUsageTypes;
    if (input.minRentalDays !== undefined) updateData.min_rental_days = input.minRentalDays;
    if (input.maxRentalDays !== undefined) updateData.max_rental_days = input.maxRentalDays;
    if (input.depositRequired !== undefined) updateData.deposit_required = input.depositRequired;
    if (input.depositAmount !== undefined) updateData.deposit_amount = input.depositAmount;
    if (input.cancellationPolicy !== undefined) updateData.cancellation_policy = input.cancellationPolicy;
    if (input.instantBooking !== undefined) updateData.instant_booking = input.instantBooking;

    const { data, error } = await supabase
      .from('spaces')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapSpace(data);
  },

  // Deactivate space (soft delete)
  async deactivate(id: string): Promise<void> {
    const { error } = await supabase
      .from('spaces')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Activate space
  async activate(id: string): Promise<void> {
    const { error } = await supabase
      .from('spaces')
      .update({ is_active: true })
      .eq('id', id);

    if (error) throw error;
  },

  // Update space images
  async updateImages(id: string, images: string[]): Promise<void> {
    const { error } = await supabase
      .from('spaces')
      .update({ images })
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================
  // AVAILABILITY MANAGEMENT
  // ============================================

  // Fetch availability for a space
  async fetchAvailability(spaceId: string): Promise<SpaceAvailability[]> {
    const { data, error } = await supabase
      .from('space_availability')
      .select('*')
      .eq('space_id', spaceId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapSpaceAvailability);
  },

  // Add availability period
  async addAvailability(
    spaceId: string,
    startDate: Date,
    endDate: Date,
    type: 'available' | 'blocked' | 'maintenance',
    notes?: string
  ): Promise<SpaceAvailability> {
    const { data, error } = await supabase
      .from('space_availability')
      .insert({
        space_id: spaceId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        availability_type: type,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return mapSpaceAvailability(data);
  },

  // Remove availability period
  async removeAvailability(id: string): Promise<void> {
    const { error } = await supabase
      .from('space_availability')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Check if dates are available for booking
  async checkAvailability(
    spaceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    // Check for blocked periods
    const { data: blockedPeriods } = await supabase
      .from('space_availability')
      .select('*')
      .eq('space_id', spaceId)
      .in('availability_type', ['blocked', 'maintenance'])
      .lte('start_date', endDate.toISOString().split('T')[0])
      .gte('end_date', startDate.toISOString().split('T')[0]);

    if (blockedPeriods && blockedPeriods.length > 0) {
      return false;
    }

    // Check for existing confirmed bookings
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('space_id', spaceId)
      .in('status', ['confirmed', 'in_progress'])
      .lte('start_date', endDate.toISOString().split('T')[0])
      .gte('end_date', startDate.toISOString().split('T')[0]);

    return !existingBookings || existingBookings.length === 0;
  },

  // ============================================
  // IMAGE UPLOAD
  // ============================================

  // Upload image to storage
  async uploadImage(spaceId: string, file: File): Promise<string> {
    // In offline mode, use base64 data URL
    if (isOfflineMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${spaceId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('space-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('space-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  // Delete image from storage
  async deleteImage(imageUrl: string): Promise<void> {
    // Extract path from URL
    const urlParts = imageUrl.split('/space-images/');
    if (urlParts.length !== 2) return;

    const { error } = await supabase.storage
      .from('space-images')
      .remove([urlParts[1]]);

    if (error) throw error;
  },
};
