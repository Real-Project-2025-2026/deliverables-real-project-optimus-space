import { supabase, isOfflineMode } from '../supabase';
import {
  VacancyReport,
  VacancyReportSubmission,
  VacancyReportStatus,
  RewardStatus,
} from '@/types';

// ============================================
// RAW DB ROW TYPES
// ============================================

interface VacancyReportRow {
  id: string;
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string | null;
  tos_accepted: boolean;
  object_address: string;
  object_city: string;
  object_zip: string;
  object_country: string;
  location_lat: number | null;
  location_lng: number | null;
  object_description: string | null;
  estimated_size_sqm: number | null;
  vacancy_duration: string | null;
  owner_contact_info: string | null;
  photo_url: string | null;
  photo_storage_path: string | null;
  additional_photos: string[] | null;
  status: string;
  reward_status: string;
  reward_amount: number;
  reward_paid_at: string | null;
  related_space_id: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ============================================
// MAPPER
// ============================================

const mapVacancyReport = (row: VacancyReportRow): VacancyReport => ({
  id: row.id,
  reporterName: row.reporter_name,
  reporterEmail: row.reporter_email,
  reporterPhone: row.reporter_phone ?? undefined,
  tosAccepted: row.tos_accepted,
  objectAddress: row.object_address,
  objectCity: row.object_city,
  objectZip: row.object_zip,
  objectCountry: row.object_country,
  locationLat: row.location_lat ?? undefined,
  locationLng: row.location_lng ?? undefined,
  objectDescription: row.object_description ?? undefined,
  estimatedSizeSqm: row.estimated_size_sqm ?? undefined,
  vacancyDuration: row.vacancy_duration as VacancyReport['vacancyDuration'],
  ownerContactInfo: row.owner_contact_info ?? undefined,
  photoUrl: row.photo_url ?? undefined,
  photoStoragePath: row.photo_storage_path ?? undefined,
  additionalPhotos: row.additional_photos ?? [],
  status: row.status as VacancyReportStatus,
  rewardStatus: row.reward_status as RewardStatus,
  rewardAmount: Number(row.reward_amount),
  rewardPaidAt: row.reward_paid_at ? new Date(row.reward_paid_at) : undefined,
  relatedSpaceId: row.related_space_id ?? undefined,
  adminNotes: row.admin_notes ?? undefined,
  reviewedBy: row.reviewed_by ?? undefined,
  reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// ============================================
// VACANCY REPORT SERVICE
// ============================================

// Demo vacancy reports for offline mode
const demoVacancyReports: VacancyReport[] = [];

export const vacancyReportService = {
  // Fetch all vacancy reports (admin)
  async fetchAll(): Promise<VacancyReport[]> {
    if (isOfflineMode) {
      return demoVacancyReports;
    }

    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapVacancyReport);
  },

  // Fetch vacancy report by ID
  async fetchById(id: string): Promise<VacancyReport | null> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapVacancyReport(data) : null;
  },

  // Fetch reports by status
  async fetchByStatus(status: VacancyReportStatus): Promise<VacancyReport[]> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapVacancyReport);
  },

  // Fetch reports by reporter email (for user to see their own submissions)
  async fetchByReporterEmail(email: string): Promise<VacancyReport[]> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('*')
      .eq('reporter_email', email.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapVacancyReport);
  },

  // Check if address already exists (for duplicate prevention)
  async checkDuplicate(
    address: string,
    city: string,
    zip: string,
    country: string = 'Deutschland'
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('id')
      .ilike('object_address', address.trim())
      .ilike('object_city', city.trim())
      .eq('object_zip', zip.trim())
      .ilike('object_country', country.trim())
      .not('status', 'in', '("rejected","duplicate")')
      .limit(1);

    if (error) {
      // If it's a unique constraint error, that's expected
      console.error('Duplicate check error:', error);
      return false;
    }

    return data !== null && data.length > 0;
  },

  // Submit new vacancy report (public, no auth required)
  async submit(
    submission: VacancyReportSubmission,
    photoUrl?: string,
    photoStoragePath?: string
  ): Promise<VacancyReport> {
    // Validate required fields
    if (!submission.tosAccepted) {
      throw new Error('Die Nutzungsbedingungen müssen akzeptiert werden');
    }

    if (!submission.reporterName || !submission.reporterEmail) {
      throw new Error('Name und E-Mail sind erforderlich');
    }

    if (!submission.objectAddress || !submission.objectCity || !submission.objectZip) {
      throw new Error('Vollständige Adresse ist erforderlich');
    }

    // In offline mode, create a local demo report
    if (isOfflineMode) {
      const demoReport: VacancyReport = {
        id: `demo-${Date.now()}`,
        reporterName: submission.reporterName,
        reporterEmail: submission.reporterEmail.toLowerCase(),
        reporterPhone: submission.reporterPhone,
        tosAccepted: submission.tosAccepted,
        objectAddress: submission.objectAddress.trim(),
        objectCity: submission.objectCity.trim(),
        objectZip: submission.objectZip.trim(),
        objectCountry: submission.objectCountry?.trim() || 'Deutschland',
        objectDescription: submission.objectDescription,
        estimatedSizeSqm: submission.estimatedSizeSqm,
        vacancyDuration: submission.vacancyDuration,
        ownerContactInfo: submission.ownerContactInfo,
        photoUrl: photoUrl,
        photoStoragePath: photoStoragePath,
        additionalPhotos: [],
        status: 'submitted',
        rewardStatus: 'pending',
        rewardAmount: 20,
        createdAt: new Date(),
      };
      // Store in demo reports array
      demoVacancyReports.push(demoReport);
      console.log('Demo vacancy report created:', demoReport);
      return demoReport;
    }

    // Check for duplicate
    const isDuplicate = await this.checkDuplicate(
      submission.objectAddress,
      submission.objectCity,
      submission.objectZip,
      submission.objectCountry || 'Deutschland'
    );

    if (isDuplicate) {
      throw new Error('Dieser Leerstand wurde bereits gemeldet');
    }

    const { data, error } = await supabase
      .from('vacancy_reports')
      .insert({
        reporter_name: submission.reporterName,
        reporter_email: submission.reporterEmail.toLowerCase(),
        reporter_phone: submission.reporterPhone,
        tos_accepted: submission.tosAccepted,
        object_address: submission.objectAddress.trim(),
        object_city: submission.objectCity.trim(),
        object_zip: submission.objectZip.trim(),
        object_country: submission.objectCountry?.trim() || 'Deutschland',
        object_description: submission.objectDescription,
        estimated_size_sqm: submission.estimatedSizeSqm,
        vacancy_duration: submission.vacancyDuration,
        owner_contact_info: submission.ownerContactInfo,
        photo_url: photoUrl,
        photo_storage_path: photoStoragePath,
        status: 'submitted',
        reward_status: 'pending',
        reward_amount: 20.00,
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        throw new Error('Dieser Leerstand wurde bereits gemeldet');
      }
      throw error;
    }

    return mapVacancyReport(data);
  },

  // Update status (admin)
  async updateStatus(
    id: string,
    status: VacancyReportStatus,
    reviewedBy: string,
    adminNotes?: string
  ): Promise<VacancyReport> {
    const updateData: Record<string, unknown> = {
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    };

    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    // Update reward status based on status
    if (status === 'verified' || status === 'converted_to_space') {
      updateData.reward_status = 'eligible';
    } else if (status === 'rejected' || status === 'duplicate') {
      updateData.reward_status = 'not_eligible';
    }

    const { data, error } = await supabase
      .from('vacancy_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapVacancyReport(data);
  },

  // Link to created space
  async linkToSpace(id: string, spaceId: string): Promise<VacancyReport> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .update({
        related_space_id: spaceId,
        status: 'converted_to_space',
        reward_status: 'eligible',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapVacancyReport(data);
  },

  // Mark reward as paid (admin)
  async markRewardPaid(id: string): Promise<VacancyReport> {
    const { data, error } = await supabase
      .from('vacancy_reports')
      .update({
        reward_status: 'paid',
        reward_paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapVacancyReport(data);
  },

  // Upload photo for vacancy report
  async uploadPhoto(file: File): Promise<{ url: string; path: string }> {
    // In offline mode, convert to base64 data URL
    if (isOfflineMode) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;
          const fileName = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          resolve({
            url: base64Url,
            path: fileName,
          });
        };
        reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('vacancy-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('vacancy-photos')
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      path: fileName,
    };
  },

  // Get statistics (admin dashboard)
  async getStatistics(): Promise<{
    total: number;
    submitted: number;
    underReview: number;
    verified: number;
    converted: number;
    pendingRewards: number;
    paidRewards: number;
  }> {
    if (isOfflineMode) {
      return {
        total: 0,
        submitted: 0,
        underReview: 0,
        verified: 0,
        converted: 0,
        pendingRewards: 0,
        paidRewards: 0,
      };
    }

    const { data, error } = await supabase
      .from('vacancy_reports')
      .select('status, reward_status');

    if (error) throw error;

    const reports = data || [];

    return {
      total: reports.length,
      submitted: reports.filter((r) => r.status === 'submitted').length,
      underReview: reports.filter((r) => r.status === 'under_review').length,
      verified: reports.filter((r) => r.status === 'verified').length,
      converted: reports.filter((r) => r.status === 'converted_to_space').length,
      pendingRewards: reports.filter((r) => r.reward_status === 'eligible').length,
      paidRewards: reports.filter((r) => r.reward_status === 'paid').length,
    };
  },
};
