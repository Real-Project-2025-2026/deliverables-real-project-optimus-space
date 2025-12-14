// ============================================
// USER TYPES
// ============================================

export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// ============================================
// SPACE TYPES
// ============================================

export type SpaceCategory = 'office' | 'warehouse' | 'popup' | 'event' | 'retail' | 'studio';

export type Amenity = 'water' | 'electricity' | 'wifi' | 'parking' | 'heating' | 'ac' | 'security' | 'accessible';

export type UsageType = 'popup_store' | 'office' | 'warehouse' | 'event' | 'photo_studio' | 'workshop' | 'showroom' | 'other';

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';

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
  pricePerWeek?: number;
  pricePerMonth?: number;
  size: number; // in square meters
  category: SpaceCategory;
  amenities: Amenity[];
  allowedUsageTypes: UsageType[];
  images: string[];
  ownerId: string;
  ownerName: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  minRentalDays: number;
  maxRentalDays: number;
  depositRequired: boolean;
  depositAmount?: number;
  cancellationPolicy: CancellationPolicy;
  instantBooking: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SpaceAvailability {
  id: string;
  spaceId: string;
  startDate: Date;
  endDate: Date;
  availabilityType: 'available' | 'blocked' | 'maintenance';
  notes?: string;
  createdAt: Date;
}

// ============================================
// BOOKING TYPES
// ============================================

export type BookingStatus = 'requested' | 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed' | 'in_progress';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';

export type DepositStatus = 'pending' | 'held' | 'released' | 'withheld_partial' | 'withheld_full';

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
  rentAmount?: number;
  utilitiesAmount?: number;
  cleaningAmount?: number;
  depositAmount?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  depositStatus: DepositStatus;
  paymentIntentId?: string;
  message?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BookingCalculation {
  totalDays: number;
  rentAmount: number;
  depositAmount: number;
  totalAmount: number;
}

// ============================================
// CONTRACT TYPES
// ============================================

export type ContractStatus = 'draft' | 'generated' | 'sent' | 'signed_tenant' | 'signed_both' | 'active' | 'completed' | 'terminated';

export interface Contract {
  id: string;
  bookingId: string;
  landlordId: string;
  tenantId: string;
  spaceId: string;
  contractNumber: string;
  contractType: string;
  pdfUrl?: string;
  pdfStoragePath?: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  depositAmount: number;
  totalAmount: number;
  // Contract clauses
  hardEndDate: boolean;
  restorationRequired: boolean;
  landlordAccessRights: boolean;
  tenantInsuranceRequired: boolean;
  lateReturnPenalty: number;
  status: ContractStatus;
  tenantSignedAt?: Date;
  landlordSignedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// CHECK-IN / CHECK-OUT TYPES
// ============================================

export type RoomArea = 'entrance' | 'main_room' | 'bathroom' | 'kitchen' | 'storage' | 'outdoor' | 'other';

export type DamageSeverity = 'none' | 'minor' | 'moderate' | 'severe';

export interface CheckinPhoto {
  id: string;
  bookingId: string;
  uploadedBy: string;
  imageUrl: string;
  storagePath: string;
  description?: string;
  roomArea?: RoomArea;
  createdAt: Date;
}

export interface CheckoutPhoto {
  id: string;
  bookingId: string;
  uploadedBy: string;
  imageUrl: string;
  storagePath: string;
  description?: string;
  roomArea?: RoomArea;
  hasDamage: boolean;
  damageDescription?: string;
  damageSeverity?: DamageSeverity;
  createdAt: Date;
}

export type DamageReportStatus = 'reported' | 'under_review' | 'resolved' | 'disputed';

export interface DamageReport {
  id: string;
  bookingId: string;
  reportedBy: string;
  description: string;
  severity: DamageSeverity;
  estimatedCost?: number;
  checkoutPhotoIds: string[];
  status: DamageReportStatus;
  resolutionNotes?: string;
  deductedFromDeposit: number;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// VACANCY REPORT TYPES (Leerstand melden)
// ============================================

export type VacancyReportStatus = 'submitted' | 'under_review' | 'verified' | 'rejected' | 'converted_to_space' | 'duplicate';

export type RewardStatus = 'pending' | 'eligible' | 'paid' | 'not_eligible';

export type VacancyDuration = 'weeks' | 'months' | 'years' | 'unknown';

export interface VacancyReport {
  id: string;
  // Reporter info
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  tosAccepted: boolean;
  // Object info
  objectAddress: string;
  objectCity: string;
  objectZip: string;
  objectCountry: string;
  locationLat?: number;
  locationLng?: number;
  objectDescription?: string;
  estimatedSizeSqm?: number;
  vacancyDuration?: VacancyDuration;
  ownerContactInfo?: string;
  // Photos
  photoUrl?: string;
  photoStoragePath?: string;
  additionalPhotos: string[];
  // Status
  status: VacancyReportStatus;
  rewardStatus: RewardStatus;
  rewardAmount: number;
  rewardPaidAt?: Date;
  relatedSpaceId?: string;
  // Admin
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface VacancyReportSubmission {
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  tosAccepted: boolean;
  objectAddress: string;
  objectCity: string;
  objectZip: string;
  objectCountry?: string;
  objectDescription?: string;
  estimatedSizeSqm?: number;
  vacancyDuration?: VacancyDuration;
  ownerContactInfo?: string;
}

// ============================================
// PAYMENT TYPES (Dummy Payment Module)
// ============================================

export type PaymentIntentStatus = 'created' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  provider: string;
  providerIntentId?: string;
  description?: string;
  metadata: Record<string, unknown>;
  errorMessage?: string;
  errorCode?: string;
  createdAt: Date;
  processedAt?: Date;
  updatedAt?: Date;
}

export interface PaymentResult {
  success: boolean;
  intentId: string;
  status: PaymentIntentStatus;
  errorMessage?: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payment_failed'
  | 'checkin_reminder'
  | 'checkout_reminder'
  | 'contract_ready'
  | 'damage_reported'
  | 'deposit_released'
  | 'vacancy_verified';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// ============================================
// CALENDAR & SEARCH TYPES
// ============================================

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
  usageTypes?: UsageType[];
  startDate?: Date;
  endDate?: Date;
  instantBooking?: boolean;
}

// ============================================
// FORM INPUT TYPES
// ============================================

export interface SpaceFormInput {
  title: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  size: number;
  category: SpaceCategory;
  amenities: Amenity[];
  allowedUsageTypes: UsageType[];
  minRentalDays?: number;
  maxRentalDays?: number;
  depositRequired?: boolean;
  depositAmount?: number;
  cancellationPolicy?: CancellationPolicy;
  instantBooking?: boolean;
}

export interface BookingFormInput {
  spaceId: string;
  startDate: Date;
  endDate: Date;
  message?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
