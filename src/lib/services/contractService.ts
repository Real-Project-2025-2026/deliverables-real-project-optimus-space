import { supabase, isOfflineMode } from '../supabase';
import { Contract, ContractStatus, Booking } from '@/types';

// ============================================
// RAW DB ROW TYPES
// ============================================

interface ContractRow {
  id: string;
  booking_id: string;
  landlord_id: string;
  tenant_id: string;
  space_id: string;
  contract_number: string;
  contract_type: string;
  pdf_url: string | null;
  pdf_storage_path: string | null;
  start_date: string;
  end_date: string;
  rent_amount: number;
  deposit_amount: number;
  total_amount: number;
  hard_end_date: boolean;
  restoration_required: boolean;
  landlord_access_rights: boolean;
  tenant_insurance_required: boolean;
  late_return_penalty: number;
  status: string;
  tenant_signed_at: string | null;
  landlord_signed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ============================================
// MAPPER
// ============================================

const mapContract = (row: ContractRow): Contract => ({
  id: row.id,
  bookingId: row.booking_id,
  landlordId: row.landlord_id,
  tenantId: row.tenant_id,
  spaceId: row.space_id,
  contractNumber: row.contract_number,
  contractType: row.contract_type,
  pdfUrl: row.pdf_url ?? undefined,
  pdfStoragePath: row.pdf_storage_path ?? undefined,
  startDate: new Date(row.start_date),
  endDate: new Date(row.end_date),
  rentAmount: Number(row.rent_amount),
  depositAmount: Number(row.deposit_amount),
  totalAmount: Number(row.total_amount),
  hardEndDate: row.hard_end_date,
  restorationRequired: row.restoration_required,
  landlordAccessRights: row.landlord_access_rights,
  tenantInsuranceRequired: row.tenant_insurance_required,
  lateReturnPenalty: Number(row.late_return_penalty),
  status: row.status as ContractStatus,
  tenantSignedAt: row.tenant_signed_at ? new Date(row.tenant_signed_at) : undefined,
  landlordSignedAt: row.landlord_signed_at ? new Date(row.landlord_signed_at) : undefined,
  createdAt: new Date(row.created_at),
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// ============================================
// CONTRACT SERVICE
// ============================================

// Demo contracts for offline mode
const demoContracts: Contract[] = [];

export const contractService = {
  // Fetch all contracts (admin)
  async fetchAll(): Promise<Contract[]> {
    if (isOfflineMode) {
      return demoContracts;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapContract);
  },

  // Fetch contract by ID
  async fetchById(id: string): Promise<Contract | null> {
    if (isOfflineMode) {
      return demoContracts.find(c => c.id === id) || null;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapContract(data) : null;
  },

  // Fetch contract by booking ID
  async fetchByBookingId(bookingId: string): Promise<Contract | null> {
    if (isOfflineMode) {
      return demoContracts.find(c => c.bookingId === bookingId) || null;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapContract(data) : null;
  },

  // Fetch contracts for landlord
  async fetchForLandlord(landlordId: string): Promise<Contract[]> {
    if (isOfflineMode) {
      return demoContracts;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapContract);
  },

  // Fetch contracts for tenant
  async fetchForTenant(tenantId: string): Promise<Contract[]> {
    if (isOfflineMode) {
      return demoContracts;
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapContract);
  },

  // Generate contract number
  async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();

    // Count existing contracts this year
    const { count } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-01-01`)
      .lt('created_at', `${year + 1}-01-01`);

    const sequence = String((count || 0) + 1).padStart(6, '0');
    return `ZMV-${year}-${sequence}`;
  },

  // Create contract from booking
  async createFromBooking(
    booking: Booking,
    options?: {
      hardEndDate?: boolean;
      restorationRequired?: boolean;
      landlordAccessRights?: boolean;
      tenantInsuranceRequired?: boolean;
      lateReturnPenalty?: number;
    }
  ): Promise<Contract> {
    const contractNumber = await this.generateContractNumber();

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        booking_id: booking.id,
        landlord_id: booking.landlordId,
        tenant_id: booking.tenantId,
        space_id: booking.spaceId,
        contract_number: contractNumber,
        contract_type: 'zwischenmietvertrag',
        start_date: booking.startDate.toISOString().split('T')[0],
        end_date: booking.endDate.toISOString().split('T')[0],
        rent_amount: booking.rentAmount || booking.totalPrice - (booking.depositAmount || 0),
        deposit_amount: booking.depositAmount || 0,
        total_amount: booking.totalPrice,
        hard_end_date: options?.hardEndDate ?? true,
        restoration_required: options?.restorationRequired ?? true,
        landlord_access_rights: options?.landlordAccessRights ?? true,
        tenant_insurance_required: options?.tenantInsuranceRequired ?? true,
        late_return_penalty: options?.lateReturnPenalty ?? 0,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return mapContract(data);
  },

  // Update contract status
  async updateStatus(id: string, status: ContractStatus): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContract(data);
  },

  // Store generated PDF URL
  async storePdfUrl(
    id: string,
    pdfUrl: string,
    storagePath: string
  ): Promise<Contract> {
    const { data, error } = await supabase
      .from('contracts')
      .update({
        pdf_url: pdfUrl,
        pdf_storage_path: storagePath,
        status: 'generated',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContract(data);
  },

  // Record tenant signature
  async recordTenantSignature(id: string): Promise<Contract> {
    const contract = await this.fetchById(id);
    if (!contract) {
      throw new Error('Vertrag nicht gefunden');
    }

    const newStatus: ContractStatus = contract.landlordSignedAt
      ? 'signed_both'
      : 'signed_tenant';

    const { data, error } = await supabase
      .from('contracts')
      .update({
        tenant_signed_at: new Date().toISOString(),
        status: newStatus,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContract(data);
  },

  // Record landlord signature
  async recordLandlordSignature(id: string): Promise<Contract> {
    const contract = await this.fetchById(id);
    if (!contract) {
      throw new Error('Vertrag nicht gefunden');
    }

    const newStatus: ContractStatus = contract.tenantSignedAt
      ? 'signed_both'
      : 'generated'; // Keep as generated if tenant hasn't signed yet

    const { data, error } = await supabase
      .from('contracts')
      .update({
        landlord_signed_at: new Date().toISOString(),
        status: newStatus,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapContract(data);
  },

  // Activate contract
  async activate(id: string): Promise<Contract> {
    return this.updateStatus(id, 'active');
  },

  // Complete contract
  async complete(id: string): Promise<Contract> {
    return this.updateStatus(id, 'completed');
  },

  // Terminate contract
  async terminate(id: string): Promise<Contract> {
    return this.updateStatus(id, 'terminated');
  },

  // Generate contract PDF (calls Edge Function)
  async generatePdf(id: string): Promise<{ url: string; path: string }> {
    // Get contract details
    const contract = await this.fetchById(id);
    if (!contract) {
      throw new Error('Vertrag nicht gefunden');
    }

    // Call Edge Function to generate PDF
    // For now, we'll create a placeholder implementation
    // In production, this would call an actual Edge Function

    const fileName = `${contract.contractNumber}.pdf`;
    const storagePath = `contracts/${contract.id}/${fileName}`;

    // TODO: Implement actual PDF generation via Edge Function
    // For demo purposes, we'll just update the status
    const placeholderUrl = `/api/contracts/${id}/pdf`;

    await this.storePdfUrl(id, placeholderUrl, storagePath);

    return {
      url: placeholderUrl,
      path: storagePath,
    };
  },
};

// ============================================
// CONTRACT TEMPLATE (for PDF generation)
// ============================================

export interface ContractTemplateData {
  contractNumber: string;
  // Parties
  landlordName: string;
  landlordAddress: string;
  landlordEmail: string;
  tenantName: string;
  tenantAddress: string;
  tenantEmail: string;
  // Property
  propertyAddress: string;
  propertyCity: string;
  propertyPostalCode: string;
  propertySize: number;
  propertyCategory: string;
  // Terms
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  totalAmount: number;
  // Clauses
  hardEndDate: boolean;
  restorationRequired: boolean;
  landlordAccessRights: boolean;
  tenantInsuranceRequired: boolean;
  lateReturnPenalty: number;
}

export const generateContractHtml = (data: ContractTemplateData): string => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Zwischenmietvertrag ${data.contractNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; padding: 40px; }
    h1 { text-align: center; font-size: 18px; margin-bottom: 30px; }
    h2 { font-size: 14px; margin-top: 25px; border-bottom: 1px solid #000; padding-bottom: 5px; }
    .header { text-align: center; margin-bottom: 40px; }
    .contract-number { font-size: 10px; color: #666; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .party { width: 45%; }
    .party h3 { margin-bottom: 10px; font-size: 12px; }
    .clause { margin-bottom: 15px; }
    .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature { width: 40%; text-align: center; }
    .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td { padding: 8px; border: 1px solid #ddd; }
    td:first-child { font-weight: bold; width: 40%; background: #f5f5f5; }
  </style>
</head>
<body>
  <div class="header">
    <h1>ZWISCHENMIETVERTRAG</h1>
    <p class="contract-number">Vertragsnummer: ${data.contractNumber}</p>
  </div>

  <h2>1. Vertragsparteien</h2>
  <div class="parties">
    <div class="party">
      <h3>Vermieter:</h3>
      <p>${data.landlordName}<br>
      ${data.landlordAddress}<br>
      E-Mail: ${data.landlordEmail}</p>
    </div>
    <div class="party">
      <h3>Mieter:</h3>
      <p>${data.tenantName}<br>
      ${data.tenantAddress}<br>
      E-Mail: ${data.tenantEmail}</p>
    </div>
  </div>

  <h2>2. Mietobjekt</h2>
  <table>
    <tr><td>Adresse</td><td>${data.propertyAddress}, ${data.propertyPostalCode} ${data.propertyCity}</td></tr>
    <tr><td>Flaeche</td><td>${data.propertySize} m²</td></tr>
    <tr><td>Nutzungsart</td><td>${data.propertyCategory}</td></tr>
  </table>

  <h2>3. Mietzeit</h2>
  <table>
    <tr><td>Mietbeginn</td><td>${formatDate(data.startDate)}</td></tr>
    <tr><td>Mietende</td><td>${formatDate(data.endDate)}</td></tr>
  </table>
  ${data.hardEndDate ? '<p class="clause"><strong>Hinweis:</strong> Das Mietverhältnis endet automatisch zum angegebenen Datum ohne dass es einer Kündigung bedarf (harte Endfrist).</p>' : ''}

  <h2>4. Miete und Kaution</h2>
  <table>
    <tr><td>Miete (gesamt)</td><td>${formatCurrency(data.rentAmount)}</td></tr>
    <tr><td>Kaution</td><td>${formatCurrency(data.depositAmount)}</td></tr>
    <tr><td><strong>Gesamtbetrag</strong></td><td><strong>${formatCurrency(data.totalAmount)}</strong></td></tr>
  </table>
  <p class="clause">Die Kaution ist vor Mietbeginn zu zahlen und wird nach ordnungsgemäßer Rückgabe des Mietobjekts zurückerstattet.</p>

  <h2>5. Besondere Vereinbarungen</h2>

  ${data.restorationRequired ? '<p class="clause"><strong>Rückbaupflicht:</strong> Der Mieter ist verpflichtet, das Mietobjekt bei Mietende im ursprünglichen Zustand zurückzugeben. Alle vom Mieter vorgenommenen Veränderungen sind auf eigene Kosten zu beseitigen.</p>' : ''}

  ${data.landlordAccessRights ? '<p class="clause"><strong>Zutrittsrecht des Vermieters:</strong> Der Vermieter hat das Recht, das Mietobjekt nach vorheriger Ankündigung (mindestens 24 Stunden) zu besichtigen.</p>' : ''}

  ${data.tenantInsuranceRequired ? '<p class="clause"><strong>Versicherungspflicht:</strong> Der Mieter ist verpflichtet, eine Haftpflichtversicherung für die Mietdauer abzuschließen und auf Verlangen nachzuweisen.</p>' : ''}

  ${data.lateReturnPenalty > 0 ? `<p class="clause"><strong>Vertragsstrafe bei verspäteter Rückgabe:</strong> Bei nicht fristgerechter Rückgabe des Mietobjekts wird eine Vertragsstrafe in Höhe von ${formatCurrency(data.lateReturnPenalty)} pro Tag fällig.</p>` : ''}

  <h2>6. Schlussbestimmungen</h2>
  <p class="clause">Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform. Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt.</p>

  <div class="signature-block">
    <div class="signature">
      <div class="signature-line">
        Ort, Datum, Unterschrift Vermieter
      </div>
    </div>
    <div class="signature">
      <div class="signature-line">
        Ort, Datum, Unterschrift Mieter
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
