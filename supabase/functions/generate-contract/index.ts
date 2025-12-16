// Supabase Edge Function: Generate Contract PDF
// This function generates a PDF contract from booking data
// Deploy with: supabase functions deploy generate-contract

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContractData {
  contractNumber: string;
  landlordName: string;
  landlordAddress: string;
  landlordEmail: string;
  tenantName: string;
  tenantAddress: string;
  tenantEmail: string;
  propertyAddress: string;
  propertyCity: string;
  propertyPostalCode: string;
  propertySize: number;
  propertyCategory: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  totalAmount: number;
  hardEndDate: boolean;
  restorationRequired: boolean;
  landlordAccessRights: boolean;
  tenantInsuranceRequired: boolean;
  lateReturnPenalty: number;
}

// Generate HTML contract from template
function generateContractHtml(data: ContractData): string {
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
    @page { size: A4; margin: 2cm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    h1 { text-align: center; font-size: 18pt; margin-bottom: 30px; color: #1a365d; }
    h2 { font-size: 13pt; margin-top: 25px; border-bottom: 2px solid #1a365d; padding-bottom: 5px; color: #1a365d; }
    .header { text-align: center; margin-bottom: 40px; }
    .contract-number { font-size: 10pt; color: #666; margin-top: 10px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .party { width: 45%; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .party h3 { margin: 0 0 10px 0; font-size: 11pt; color: #1a365d; }
    .clause { margin-bottom: 15px; text-align: justify; }
    .important { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
    .signature-block { margin-top: 60px; display: flex; justify-content: space-between; page-break-inside: avoid; }
    .signature { width: 40%; text-align: center; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 8px; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td, th { padding: 10px 12px; border: 1px solid #dee2e6; text-align: left; }
    th { background: #e9ecef; font-weight: 600; }
    td:first-child { font-weight: 500; width: 40%; background: #f8f9fa; }
    .footer { margin-top: 40px; font-size: 9pt; color: #666; text-align: center; border-top: 1px solid #dee2e6; padding-top: 15px; }
    .logo { text-align: center; margin-bottom: 20px; }
    .logo span { font-size: 24pt; font-weight: bold; color: #1a365d; }
  </style>
</head>
<body>
  <div class="logo">
    <span>Spacefindr</span>
  </div>

  <div class="header">
    <h1>ZWISCHENMIETVERTRAG</h1>
    <p class="contract-number">Vertragsnummer: ${data.contractNumber}</p>
  </div>

  <h2>§ 1 Vertragsparteien</h2>
  <div class="parties">
    <div class="party">
      <h3>Vermieter</h3>
      <p><strong>${data.landlordName}</strong><br>
      ${data.landlordAddress}<br>
      E-Mail: ${data.landlordEmail}</p>
    </div>
    <div class="party">
      <h3>Mieter</h3>
      <p><strong>${data.tenantName}</strong><br>
      ${data.tenantAddress}<br>
      E-Mail: ${data.tenantEmail}</p>
    </div>
  </div>

  <h2>§ 2 Mietobjekt</h2>
  <table>
    <tr><td>Adresse</td><td>${data.propertyAddress}, ${data.propertyPostalCode} ${data.propertyCity}</td></tr>
    <tr><td>Nutzfläche</td><td>${data.propertySize} m²</td></tr>
    <tr><td>Nutzungsart</td><td>${data.propertyCategory}</td></tr>
  </table>
  <p class="clause">Der Vermieter überlässt dem Mieter die oben genannte Gewerbefläche zur temporären Nutzung gemäß den Bestimmungen dieses Vertrages.</p>

  <h2>§ 3 Mietzeit</h2>
  <table>
    <tr><td>Mietbeginn</td><td>${formatDate(data.startDate)}</td></tr>
    <tr><td>Mietende</td><td>${formatDate(data.endDate)}</td></tr>
  </table>
  ${data.hardEndDate ? `
  <div class="important">
    <strong>Wichtiger Hinweis - Harte Endfrist:</strong> Das Mietverhältnis endet automatisch und unwiderruflich zum angegebenen Datum, ohne dass es einer Kündigung bedarf. Eine stillschweigende Verlängerung gemäß § 545 BGB ist ausgeschlossen.
  </div>
  ` : ''}

  <h2>§ 4 Miete und Nebenkosten</h2>
  <table>
    <tr><td>Grundmiete</td><td>${formatCurrency(data.rentAmount)}</td></tr>
    <tr><td>Kaution</td><td>${formatCurrency(data.depositAmount)}</td></tr>
    <tr><th>Gesamtbetrag</th><th>${formatCurrency(data.totalAmount)}</th></tr>
  </table>
  <p class="clause">Die Miete ist vor Mietbeginn vollständig zu entrichten. Die Kaution dient zur Sicherung sämtlicher Ansprüche des Vermieters aus dem Mietverhältnis und wird nach ordnungsgemäßer Rückgabe des Mietobjekts zurückerstattet, abzüglich eventueller berechtigter Abzüge für Schäden oder ausstehende Zahlungen.</p>

  <h2>§ 5 Besondere Bestimmungen</h2>

  ${data.restorationRequired ? `
  <p class="clause"><strong>5.1 Rückbaupflicht:</strong> Der Mieter ist verpflichtet, das Mietobjekt bei Beendigung des Mietverhältnisses im ursprünglichen Zustand zurückzugeben. Sämtliche vom Mieter vorgenommenen baulichen oder sonstigen Veränderungen sind auf dessen Kosten zu beseitigen, es sei denn, der Vermieter stimmt einem Verbleib ausdrücklich und schriftlich zu.</p>
  ` : ''}

  ${data.landlordAccessRights ? `
  <p class="clause"><strong>5.2 Zutrittsrecht:</strong> Der Vermieter oder dessen Beauftragte sind berechtigt, nach vorheriger Ankündigung von mindestens 24 Stunden das Mietobjekt zu betreten, um dessen Zustand zu überprüfen oder notwendige Arbeiten durchzuführen. In dringenden Fällen (Gefahr im Verzug) ist ein sofortiger Zutritt gestattet.</p>
  ` : ''}

  ${data.tenantInsuranceRequired ? `
  <p class="clause"><strong>5.3 Versicherungspflicht:</strong> Der Mieter ist verpflichtet, für die gesamte Mietdauer eine Betriebshaftpflichtversicherung mit einer Mindestdeckungssumme von 1.000.000 EUR für Personen- und Sachschäden abzuschließen und dem Vermieter auf Verlangen einen entsprechenden Nachweis vorzulegen.</p>
  ` : ''}

  ${data.lateReturnPenalty > 0 ? `
  <div class="important">
    <strong>5.4 Vertragsstrafe:</strong> Bei nicht fristgerechter Rückgabe des Mietobjekts ist der Mieter verpflichtet, für jeden angefangenen Tag der Verzögerung eine Vertragsstrafe in Höhe von ${formatCurrency(data.lateReturnPenalty)} zu zahlen. Dies gilt unbeschadet weitergehender Schadensersatzansprüche des Vermieters.
  </div>
  ` : ''}

  <h2>§ 6 Schlussbestimmungen</h2>
  <p class="clause">6.1 Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform. Dies gilt auch für die Aufhebung des Schriftformerfordernisses selbst.</p>
  <p class="clause">6.2 Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt. Die Parteien verpflichten sich, eine unwirksame Bestimmung durch eine wirksame zu ersetzen, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>
  <p class="clause">6.3 Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit gesetzlich zulässig, der Sitz des Vermieters.</p>
  <p class="clause">6.4 Es gilt das Recht der Bundesrepublik Deutschland.</p>

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

  <div class="footer">
    <p>Dieser Vertrag wurde über die Plattform Spacefindr erstellt.<br>
    Vertragsnummer: ${data.contractNumber} | Erstellungsdatum: ${new Date().toLocaleDateString('de-DE')}</p>
  </div>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contractId } = await req.json();

    if (!contractId) {
      throw new Error('Contract ID is required');
    }

    // Fetch contract with related data
    const { data: contract, error: contractError } = await supabaseClient
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      throw new Error('Contract not found');
    }

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('id', contract.booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Fetch space details
    const { data: space, error: spaceError } = await supabaseClient
      .from('spaces')
      .select('*')
      .eq('id', contract.space_id)
      .single();

    if (spaceError || !space) {
      throw new Error('Space not found');
    }

    // Fetch landlord details
    const { data: landlord } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', contract.landlord_id)
      .single();

    // Fetch tenant details
    const { data: tenant } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', contract.tenant_id)
      .single();

    // Build contract data
    const contractData: ContractData = {
      contractNumber: contract.contract_number,
      landlordName: landlord?.name || booking.landlord_name,
      landlordAddress: 'Adresse wird nachgereicht', // TODO: Add address field to users
      landlordEmail: landlord?.email || '',
      tenantName: tenant?.name || booking.tenant_name,
      tenantAddress: 'Adresse wird nachgereicht',
      tenantEmail: tenant?.email || '',
      propertyAddress: space.address,
      propertyCity: space.city,
      propertyPostalCode: space.postal_code,
      propertySize: space.size,
      propertyCategory: space.category,
      startDate: contract.start_date,
      endDate: contract.end_date,
      rentAmount: Number(contract.rent_amount),
      depositAmount: Number(contract.deposit_amount),
      totalAmount: Number(contract.total_amount),
      hardEndDate: contract.hard_end_date,
      restorationRequired: contract.restoration_required,
      landlordAccessRights: contract.landlord_access_rights,
      tenantInsuranceRequired: contract.tenant_insurance_required,
      lateReturnPenalty: Number(contract.late_return_penalty),
    };

    // Generate HTML
    const html = generateContractHtml(contractData);

    // For MVP: Return HTML directly
    // In production, you would use a PDF library like puppeteer or jspdf
    // to convert HTML to PDF

    // Store the HTML as a temporary solution
    const fileName = `${contract.contract_number}.html`;
    const storagePath = `contracts/${contract.id}/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('contracts')
      .upload(storagePath, html, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('contracts')
      .getPublicUrl(storagePath);

    // Update contract with PDF URL
    await supabaseClient
      .from('contracts')
      .update({
        pdf_url: urlData.publicUrl,
        pdf_storage_path: storagePath,
        status: 'generated',
      })
      .eq('id', contractId);

    return new Response(
      JSON.stringify({
        success: true,
        url: urlData.publicUrl,
        path: storagePath,
        html: html, // Include HTML for preview
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error generating contract:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to generate contract',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
