import { supabase, isOfflineMode } from '../supabase';
import {
  Booking,
  BookingFormInput,
  BookingCalculation,
  BookingStatus,
  PaymentStatus,
  DepositStatus,
} from '@/types';
import { mockBookings, mockSpaces } from '@/data/mockData';

// ============================================
// OFFLINE MODE STORAGE
// ============================================

const USER_BOOKINGS_KEY = 'spacefindr_user_bookings';

// Get user-created bookings from localStorage
function getUserBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(USER_BOOKINGS_KEY);
    if (!stored) return [];
    const bookings = JSON.parse(stored);
    // Convert date strings back to Date objects
    return bookings.map((b: Booking) => ({
      ...b,
      startDate: new Date(b.startDate),
      endDate: new Date(b.endDate),
      createdAt: new Date(b.createdAt),
      updatedAt: b.updatedAt ? new Date(b.updatedAt) : undefined,
    }));
  } catch {
    return [];
  }
}

// Save user bookings to localStorage
function saveUserBookings(bookings: Booking[]): void {
  localStorage.setItem(USER_BOOKINGS_KEY, JSON.stringify(bookings));
}

// Add a user-created booking
function addUserBooking(booking: Booking): void {
  const bookings = getUserBookings();
  bookings.push(booking);
  saveUserBookings(bookings);
}

// Update a user-created booking
function updateUserBooking(id: string, updates: Partial<Booking>): Booking | null {
  const bookings = getUserBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date() };
  saveUserBookings(bookings);
  return bookings[index];
}

// Helper to extend mock bookings with required properties
function extendMockBooking(booking: typeof mockBookings[0]): Booking {
  return {
    ...booking,
    paymentStatus: (booking.status === 'confirmed' || booking.status === 'completed' ? 'paid' : 'pending') as PaymentStatus,
    depositStatus: (booking.status === 'confirmed' ? 'held' : booking.status === 'completed' ? 'released' : 'pending') as DepositStatus,
    rentAmount: booking.totalPrice * 0.9,
    depositAmount: booking.totalPrice * 0.1,
  };
}

// ============================================
// RAW DB ROW TYPES
// ============================================

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
  rent_amount: number | null;
  utilities_amount: number | null;
  cleaning_amount: number | null;
  deposit_amount: number | null;
  status: string;
  payment_status: string | null;
  deposit_status: string | null;
  payment_intent_id: string | null;
  message: string | null;
  created_at: string;
  updated_at: string | null;
}

// ============================================
// MAPPER
// ============================================

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
  rentAmount: row.rent_amount ? Number(row.rent_amount) : undefined,
  utilitiesAmount: row.utilities_amount ? Number(row.utilities_amount) : undefined,
  cleaningAmount: row.cleaning_amount ? Number(row.cleaning_amount) : undefined,
  depositAmount: row.deposit_amount ? Number(row.deposit_amount) : undefined,
  status: row.status as BookingStatus,
  paymentStatus: (row.payment_status || 'pending') as PaymentStatus,
  depositStatus: (row.deposit_status || 'pending') as DepositStatus,
  paymentIntentId: row.payment_intent_id ?? undefined,
  message: row.message ?? undefined,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// ============================================
// BOOKING SERVICE
// ============================================

export const bookingService = {
  // Fetch all bookings (admin)
  async fetchAll(): Promise<Booking[]> {
    if (isOfflineMode) {
      return mockBookings.map(extendMockBooking);
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapBooking);
  },

  // Fetch booking by ID
  async fetchById(id: string): Promise<Booking | null> {
    if (isOfflineMode) {
      const booking = mockBookings.find(b => b.id === id);
      return booking ? extendMockBooking(booking) : null;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapBooking(data) : null;
  },

  // Fetch bookings for tenant
  async fetchForTenant(tenantId: string): Promise<Booking[]> {
    if (isOfflineMode) {
      // Return only bookings created by this tenant
      const userBookings = getUserBookings().filter(b => b.tenantId === tenantId);
      return userBookings;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapBooking);
  },

  // Fetch bookings for landlord
  async fetchForLandlord(landlordId: string): Promise<Booking[]> {
    if (isOfflineMode) {
      // Return only bookings for this landlord's spaces
      const userBookings = getUserBookings().filter(b => b.landlordId === landlordId);
      return userBookings;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapBooking);
  },

  // Fetch bookings for a specific space
  async fetchForSpace(spaceId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('space_id', spaceId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapBooking);
  },

  // Calculate booking total
  async calculateTotal(
    spaceId: string,
    startDate: Date,
    endDate: Date
  ): Promise<BookingCalculation> {
    // Get space details
    const { data: space, error } = await supabase
      .from('spaces')
      .select('price_per_day, price_per_week, price_per_month, deposit_amount')
      .eq('id', spaceId)
      .single();

    if (error) throw error;

    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    let rentAmount: number;

    // Calculate rent based on duration
    if (days >= 30 && space.price_per_month) {
      rentAmount = (days / 30) * Number(space.price_per_month);
    } else if (days >= 7 && space.price_per_week) {
      rentAmount = (days / 7) * Number(space.price_per_week);
    } else {
      rentAmount = days * Number(space.price_per_day);
    }

    const depositAmount = space.deposit_amount
      ? Number(space.deposit_amount)
      : Number(space.price_per_day) * 2;

    return {
      totalDays: days,
      rentAmount: Math.round(rentAmount * 100) / 100,
      depositAmount: Math.round(depositAmount * 100) / 100,
      totalAmount: Math.round((rentAmount + depositAmount) * 100) / 100,
    };
  },

  // Check availability for booking
  async checkAvailability(
    spaceId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    let query = supabase
      .from('bookings')
      .select('id')
      .eq('space_id', spaceId)
      .in('status', ['confirmed', 'in_progress'])
      .lte('start_date', endDate.toISOString().split('T')[0])
      .gte('end_date', startDate.toISOString().split('T')[0]);

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data } = await query;
    return !data || data.length === 0;
  },

  // Create new booking
  async create(
    input: BookingFormInput,
    tenantId: string,
    tenantName: string,
    space: { id: string; title: string; images: string[]; ownerId: string; ownerName: string; pricePerDay: number }
  ): Promise<Booking> {
    if (isOfflineMode) {
      // Calculate days
      const days = Math.ceil(
        (input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      const rentAmount = days * space.pricePerDay;
      const depositAmount = space.pricePerDay * 2;
      const totalAmount = rentAmount + depositAmount;

      // Create booking in localStorage
      const newBooking: Booking = {
        id: `user-booking-${Date.now()}`,
        spaceId: input.spaceId,
        spaceName: space.title,
        spaceImage: space.images[0] || '/placeholder.svg',
        tenantId,
        tenantName,
        landlordId: space.ownerId,
        landlordName: space.ownerName,
        startDate: input.startDate,
        endDate: input.endDate,
        totalDays: days,
        totalPrice: totalAmount,
        rentAmount,
        depositAmount,
        status: 'requested',
        paymentStatus: 'pending',
        depositStatus: 'pending',
        message: input.message,
        createdAt: new Date(),
      };

      addUserBooking(newBooking);
      return newBooking;
    }

    // Check availability
    const isAvailable = await this.checkAvailability(
      input.spaceId,
      input.startDate,
      input.endDate
    );

    if (!isAvailable) {
      throw new Error('Die gewählten Daten sind nicht verfügbar');
    }

    // Calculate totals
    const calculation = await this.calculateTotal(
      input.spaceId,
      input.startDate,
      input.endDate
    );

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        space_id: input.spaceId,
        space_name: space.title,
        space_image: space.images[0] || '/placeholder.svg',
        tenant_id: tenantId,
        tenant_name: tenantName,
        landlord_id: space.ownerId,
        landlord_name: space.ownerName,
        start_date: input.startDate.toISOString().split('T')[0],
        end_date: input.endDate.toISOString().split('T')[0],
        total_days: calculation.totalDays,
        total_price: calculation.totalAmount,
        rent_amount: calculation.rentAmount,
        deposit_amount: calculation.depositAmount,
        status: 'requested',
        payment_status: 'pending',
        deposit_status: 'pending',
        message: input.message,
      })
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Update booking status
  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    if (isOfflineMode) {
      const updated = updateUserBooking(id, { status });
      if (!updated) throw new Error('Buchung nicht gefunden');
      return updated;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Update payment status
  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    paymentIntentId?: string
  ): Promise<Booking> {
    const updateData: Record<string, unknown> = { payment_status: paymentStatus };
    if (paymentIntentId) {
      updateData.payment_intent_id = paymentIntentId;
    }

    // If payment succeeded, also update booking status
    if (paymentStatus === 'paid') {
      updateData.status = 'confirmed';
      updateData.deposit_status = 'held';
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Update deposit status
  async updateDepositStatus(id: string, depositStatus: DepositStatus): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ deposit_status: depositStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Confirm booking (landlord action)
  async confirm(id: string): Promise<Booking> {
    return this.updateStatus(id, 'confirmed');
  },

  // Reject booking (landlord action)
  async reject(id: string): Promise<Booking> {
    return this.updateStatus(id, 'rejected');
  },

  // Cancel booking
  async cancel(id: string): Promise<Booking> {
    if (isOfflineMode) {
      const updated = updateUserBooking(id, { status: 'cancelled', depositStatus: 'released' });
      if (!updated) throw new Error('Buchung nicht gefunden');
      return updated;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        deposit_status: 'released',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Complete booking
  async complete(id: string): Promise<Booking> {
    return this.updateStatus(id, 'completed');
  },

  // Release deposit
  async releaseDeposit(id: string): Promise<Booking> {
    if (isOfflineMode) {
      const updated = updateUserBooking(id, { depositStatus: 'released' });
      if (!updated) throw new Error('Buchung nicht gefunden');
      return updated;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ deposit_status: 'released' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },

  // Withhold deposit (partial or full)
  async withholdDeposit(
    id: string,
    type: 'partial' | 'full'
  ): Promise<Booking> {
    const depositStatus: DepositStatus =
      type === 'full' ? 'withheld_full' : 'withheld_partial';

    if (isOfflineMode) {
      const updated = updateUserBooking(id, { depositStatus });
      if (!updated) throw new Error('Buchung nicht gefunden');
      return updated;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ deposit_status: depositStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapBooking(data);
  },
};
