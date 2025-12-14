import { supabase, isOfflineMode } from '../supabase';
import {
  CheckinPhoto,
  CheckoutPhoto,
  DamageReport,
  RoomArea,
  DamageSeverity,
  DamageReportStatus,
} from '@/types';

// ============================================
// RAW DB ROW TYPES
// ============================================

interface CheckinPhotoRow {
  id: string;
  booking_id: string;
  uploaded_by: string;
  image_url: string;
  storage_path: string;
  description: string | null;
  room_area: string | null;
  created_at: string;
}

interface CheckoutPhotoRow {
  id: string;
  booking_id: string;
  uploaded_by: string;
  image_url: string;
  storage_path: string;
  description: string | null;
  room_area: string | null;
  has_damage: boolean;
  damage_description: string | null;
  damage_severity: string | null;
  created_at: string;
}

interface DamageReportRow {
  id: string;
  booking_id: string;
  reported_by: string;
  description: string;
  severity: string;
  estimated_cost: number | null;
  checkout_photo_ids: string[] | null;
  status: string;
  resolution_notes: string | null;
  deducted_from_deposit: number;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string | null;
}

// ============================================
// MAPPERS
// ============================================

const mapCheckinPhoto = (row: CheckinPhotoRow): CheckinPhoto => ({
  id: row.id,
  bookingId: row.booking_id,
  uploadedBy: row.uploaded_by,
  imageUrl: row.image_url,
  storagePath: row.storage_path,
  description: row.description ?? undefined,
  roomArea: row.room_area as RoomArea | undefined,
  createdAt: new Date(row.created_at),
});

const mapCheckoutPhoto = (row: CheckoutPhotoRow): CheckoutPhoto => ({
  id: row.id,
  bookingId: row.booking_id,
  uploadedBy: row.uploaded_by,
  imageUrl: row.image_url,
  storagePath: row.storage_path,
  description: row.description ?? undefined,
  roomArea: row.room_area as RoomArea | undefined,
  hasDamage: row.has_damage,
  damageDescription: row.damage_description ?? undefined,
  damageSeverity: row.damage_severity as DamageSeverity | undefined,
  createdAt: new Date(row.created_at),
});

const mapDamageReport = (row: DamageReportRow): DamageReport => ({
  id: row.id,
  bookingId: row.booking_id,
  reportedBy: row.reported_by,
  description: row.description,
  severity: row.severity as DamageSeverity,
  estimatedCost: row.estimated_cost ?? undefined,
  checkoutPhotoIds: row.checkout_photo_ids ?? [],
  status: row.status as DamageReportStatus,
  resolutionNotes: row.resolution_notes ?? undefined,
  deductedFromDeposit: Number(row.deducted_from_deposit),
  resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
  resolvedBy: row.resolved_by ?? undefined,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// ============================================
// ROOM AREA LABELS
// ============================================

export const roomAreaLabels: Record<RoomArea, string> = {
  entrance: 'Eingangsbereich',
  main_room: 'Hauptraum',
  bathroom: 'Badezimmer',
  kitchen: 'Küche',
  storage: 'Lager/Abstellraum',
  outdoor: 'Außenbereich',
  other: 'Sonstiges',
};

export const damageSeverityLabels: Record<DamageSeverity, string> = {
  none: 'Kein Schaden',
  minor: 'Geringfügig',
  moderate: 'Mittel',
  severe: 'Schwer',
};

// ============================================
// CHECK-IN SERVICE
// ============================================

export const checkinService = {
  // Fetch check-in photos for booking
  async fetchPhotos(bookingId: string): Promise<CheckinPhoto[]> {
    if (isOfflineMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('checkin_photos')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapCheckinPhoto);
  },

  // Upload check-in photo
  async uploadPhoto(
    bookingId: string,
    uploadedBy: string,
    file: File,
    options?: {
      description?: string;
      roomArea?: RoomArea;
    }
  ): Promise<CheckinPhoto> {
    // In offline mode, use base64 data URL
    if (isOfflineMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;
          const photo: CheckinPhoto = {
            id: `demo-checkin-${Date.now()}`,
            bookingId,
            uploadedBy,
            imageUrl: base64Url,
            storagePath: `local/${bookingId}/${Date.now()}`,
            description: options?.description,
            roomArea: options?.roomArea,
            createdAt: new Date(),
          };
          resolve(photo);
        };
        reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
        reader.readAsDataURL(file);
      });
    }

    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('checkin-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('checkin-photos')
      .getPublicUrl(fileName);

    // Create database record
    const { data, error } = await supabase
      .from('checkin_photos')
      .insert({
        booking_id: bookingId,
        uploaded_by: uploadedBy,
        image_url: urlData.publicUrl,
        storage_path: fileName,
        description: options?.description,
        room_area: options?.roomArea,
      })
      .select()
      .single();

    if (error) throw error;
    return mapCheckinPhoto(data);
  },

  // Delete check-in photo
  async deletePhoto(id: string): Promise<void> {
    // Get photo to find storage path
    const { data: photo } = await supabase
      .from('checkin_photos')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (photo?.storage_path) {
      await supabase.storage.from('checkin-photos').remove([photo.storage_path]);
    }

    const { error } = await supabase
      .from('checkin_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update photo description
  async updatePhoto(
    id: string,
    updates: { description?: string; roomArea?: RoomArea }
  ): Promise<CheckinPhoto> {
    const updateData: Record<string, unknown> = {};
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.roomArea !== undefined) updateData.room_area = updates.roomArea;

    const { data, error } = await supabase
      .from('checkin_photos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCheckinPhoto(data);
  },
};

// ============================================
// CHECK-OUT SERVICE
// ============================================

export const checkoutService = {
  // Fetch check-out photos for booking
  async fetchPhotos(bookingId: string): Promise<CheckoutPhoto[]> {
    if (isOfflineMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('checkout_photos')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapCheckoutPhoto);
  },

  // Upload check-out photo
  async uploadPhoto(
    bookingId: string,
    uploadedBy: string,
    file: File,
    options?: {
      description?: string;
      roomArea?: RoomArea;
      hasDamage?: boolean;
      damageDescription?: string;
      damageSeverity?: DamageSeverity;
    }
  ): Promise<CheckoutPhoto> {
    // In offline mode, use base64 data URL
    if (isOfflineMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;
          const photo: CheckoutPhoto = {
            id: `demo-checkout-${Date.now()}`,
            bookingId,
            uploadedBy,
            imageUrl: base64Url,
            storagePath: `local/${bookingId}/${Date.now()}`,
            description: options?.description,
            roomArea: options?.roomArea,
            hasDamage: options?.hasDamage ?? false,
            damageDescription: options?.damageDescription,
            damageSeverity: options?.damageSeverity,
            createdAt: new Date(),
          };
          resolve(photo);
        };
        reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
        reader.readAsDataURL(file);
      });
    }

    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('checkout-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('checkout-photos')
      .getPublicUrl(fileName);

    // Create database record
    const { data, error } = await supabase
      .from('checkout_photos')
      .insert({
        booking_id: bookingId,
        uploaded_by: uploadedBy,
        image_url: urlData.publicUrl,
        storage_path: fileName,
        description: options?.description,
        room_area: options?.roomArea,
        has_damage: options?.hasDamage ?? false,
        damage_description: options?.damageDescription,
        damage_severity: options?.damageSeverity,
      })
      .select()
      .single();

    if (error) throw error;
    return mapCheckoutPhoto(data);
  },

  // Delete check-out photo
  async deletePhoto(id: string): Promise<void> {
    const { data: photo } = await supabase
      .from('checkout_photos')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (photo?.storage_path) {
      await supabase.storage.from('checkout-photos').remove([photo.storage_path]);
    }

    const { error } = await supabase
      .from('checkout_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update photo with damage info
  async updatePhoto(
    id: string,
    updates: {
      description?: string;
      roomArea?: RoomArea;
      hasDamage?: boolean;
      damageDescription?: string;
      damageSeverity?: DamageSeverity;
    }
  ): Promise<CheckoutPhoto> {
    const updateData: Record<string, unknown> = {};
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.roomArea !== undefined) updateData.room_area = updates.roomArea;
    if (updates.hasDamage !== undefined) updateData.has_damage = updates.hasDamage;
    if (updates.damageDescription !== undefined) updateData.damage_description = updates.damageDescription;
    if (updates.damageSeverity !== undefined) updateData.damage_severity = updates.damageSeverity;

    const { data, error } = await supabase
      .from('checkout_photos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCheckoutPhoto(data);
  },

  // Mark photo as having damage
  async markDamage(
    id: string,
    damageDescription: string,
    damageSeverity: DamageSeverity
  ): Promise<CheckoutPhoto> {
    return this.updatePhoto(id, {
      hasDamage: true,
      damageDescription,
      damageSeverity,
    });
  },
};

// ============================================
// DAMAGE REPORT SERVICE
// ============================================

export const damageReportService = {
  // Fetch damage reports for booking
  async fetchForBooking(bookingId: string): Promise<DamageReport[]> {
    const { data, error } = await supabase
      .from('damage_reports')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDamageReport);
  },

  // Fetch damage report by ID
  async fetchById(id: string): Promise<DamageReport | null> {
    const { data, error } = await supabase
      .from('damage_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapDamageReport(data) : null;
  },

  // Create damage report
  async create(
    bookingId: string,
    reportedBy: string,
    description: string,
    severity: DamageSeverity,
    options?: {
      estimatedCost?: number;
      checkoutPhotoIds?: string[];
    }
  ): Promise<DamageReport> {
    const { data, error } = await supabase
      .from('damage_reports')
      .insert({
        booking_id: bookingId,
        reported_by: reportedBy,
        description,
        severity,
        estimated_cost: options?.estimatedCost,
        checkout_photo_ids: options?.checkoutPhotoIds || [],
        status: 'reported',
        deducted_from_deposit: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return mapDamageReport(data);
  },

  // Update damage report status
  async updateStatus(
    id: string,
    status: DamageReportStatus,
    resolutionNotes?: string
  ): Promise<DamageReport> {
    const updateData: Record<string, unknown> = { status };

    if (resolutionNotes !== undefined) {
      updateData.resolution_notes = resolutionNotes;
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('damage_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDamageReport(data);
  },

  // Resolve with deposit deduction
  async resolveWithDeduction(
    id: string,
    deductedAmount: number,
    resolvedBy: string,
    resolutionNotes: string
  ): Promise<DamageReport> {
    const { data, error } = await supabase
      .from('damage_reports')
      .update({
        status: 'resolved',
        deducted_from_deposit: deductedAmount,
        resolution_notes: resolutionNotes,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDamageReport(data);
  },

  // Link checkout photos to damage report
  async linkPhotos(id: string, photoIds: string[]): Promise<DamageReport> {
    const { data, error } = await supabase
      .from('damage_reports')
      .update({ checkout_photo_ids: photoIds })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapDamageReport(data);
  },
};
