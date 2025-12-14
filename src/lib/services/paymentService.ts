import { supabase } from '../supabase';
import { PaymentIntent, PaymentIntentStatus, PaymentResult } from '@/types';

// ============================================
// RAW DB ROW TYPES
// ============================================

interface PaymentIntentRow {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  provider_intent_id: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  error_message: string | null;
  error_code: string | null;
  created_at: string;
  processed_at: string | null;
  updated_at: string | null;
}

// ============================================
// MAPPER
// ============================================

const mapPaymentIntent = (row: PaymentIntentRow): PaymentIntent => ({
  id: row.id,
  bookingId: row.booking_id,
  amount: Number(row.amount),
  currency: row.currency,
  status: row.status as PaymentIntentStatus,
  provider: row.provider,
  providerIntentId: row.provider_intent_id ?? undefined,
  description: row.description ?? undefined,
  metadata: row.metadata ?? {},
  errorMessage: row.error_message ?? undefined,
  errorCode: row.error_code ?? undefined,
  createdAt: new Date(row.created_at),
  processedAt: row.processed_at ? new Date(row.processed_at) : undefined,
  updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
});

// ============================================
// PAYMENT PROVIDER INTERFACE (for future real implementations)
// ============================================

export interface PaymentProvider {
  name: string;
  createIntent(amount: number, currency: string, metadata?: Record<string, unknown>): Promise<{ intentId: string }>;
  processPayment(intentId: string): Promise<PaymentResult>;
  cancelPayment(intentId: string): Promise<void>;
  refundPayment(intentId: string, amount?: number): Promise<void>;
}

// ============================================
// DUMMY PAYMENT PROVIDER
// ============================================

class DummyPaymentProvider implements PaymentProvider {
  name = 'dummy';

  // Simulate payment intent creation
  async createIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, unknown>
  ): Promise<{ intentId: string }> {
    // Simulate a delay
    await this.simulateDelay(500);

    // Generate a dummy intent ID
    const intentId = `dummy_pi_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log(`[DummyPayment] Created intent: ${intentId} for ${amount} ${currency}`, metadata);

    return { intentId };
  }

  // Simulate payment processing
  async processPayment(intentId: string): Promise<PaymentResult> {
    // Simulate processing delay (1-2 seconds)
    await this.simulateDelay(1000 + Math.random() * 1000);

    // 95% success rate for demo
    const success = Math.random() > 0.05;

    console.log(`[DummyPayment] Processing ${intentId}: ${success ? 'SUCCESS' : 'FAILED'}`);

    if (success) {
      return {
        success: true,
        intentId,
        status: 'succeeded',
      };
    } else {
      return {
        success: false,
        intentId,
        status: 'failed',
        errorMessage: 'Demo: Simulierter Zahlungsfehler',
      };
    }
  }

  // Simulate payment cancellation
  async cancelPayment(intentId: string): Promise<void> {
    await this.simulateDelay(300);
    console.log(`[DummyPayment] Cancelled: ${intentId}`);
  }

  // Simulate refund
  async refundPayment(intentId: string, amount?: number): Promise<void> {
    await this.simulateDelay(500);
    console.log(`[DummyPayment] Refunded: ${intentId}${amount ? ` (${amount})` : ''}`);
  }

  // Force success (for testing)
  async forceSuccess(intentId: string): Promise<PaymentResult> {
    await this.simulateDelay(500);
    console.log(`[DummyPayment] Forced success: ${intentId}`);
    return {
      success: true,
      intentId,
      status: 'succeeded',
    };
  }

  // Force failure (for testing)
  async forceFailure(intentId: string, errorMessage?: string): Promise<PaymentResult> {
    await this.simulateDelay(500);
    console.log(`[DummyPayment] Forced failure: ${intentId}`);
    return {
      success: false,
      intentId,
      status: 'failed',
      errorMessage: errorMessage || 'Demo: Simulierter Zahlungsfehler',
    };
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================
// PAYMENT SERVICE
// ============================================

// Current provider (can be swapped for real implementation)
const currentProvider: PaymentProvider = new DummyPaymentProvider();

export const paymentService = {
  // Get current provider name
  getProviderName(): string {
    return currentProvider.name;
  },

  // Fetch payment intent by ID
  async fetchById(id: string): Promise<PaymentIntent | null> {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapPaymentIntent(data) : null;
  },

  // Fetch payment intent by booking ID
  async fetchByBookingId(bookingId: string): Promise<PaymentIntent | null> {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? mapPaymentIntent(data) : null;
  },

  // Create payment intent for booking
  async createPaymentIntent(
    bookingId: string,
    amount: number,
    description?: string
  ): Promise<PaymentIntent> {
    // Create intent with provider
    const { intentId } = await currentProvider.createIntent(amount, 'EUR', {
      bookingId,
      description,
    });

    // Store in database
    const { data, error } = await supabase
      .from('payment_intents')
      .insert({
        booking_id: bookingId,
        amount,
        currency: 'EUR',
        status: 'created',
        provider: currentProvider.name,
        provider_intent_id: intentId,
        description,
        metadata: { bookingId },
      })
      .select()
      .single();

    if (error) throw error;
    return mapPaymentIntent(data);
  },

  // Process payment (simulate payment flow)
  async processPayment(intentId: string): Promise<PaymentResult> {
    // Get the payment intent
    const intent = await this.fetchById(intentId);
    if (!intent) {
      throw new Error('Payment intent nicht gefunden');
    }

    // Update status to processing
    await supabase
      .from('payment_intents')
      .update({ status: 'processing' })
      .eq('id', intentId);

    // Process with provider
    const result = await currentProvider.processPayment(intent.providerIntentId || intentId);

    // Update database with result
    const updateData: Record<string, unknown> = {
      status: result.status,
      processed_at: new Date().toISOString(),
    };

    if (!result.success && result.errorMessage) {
      updateData.error_message = result.errorMessage;
      updateData.error_code = 'PAYMENT_FAILED';
    }

    await supabase
      .from('payment_intents')
      .update(updateData)
      .eq('id', intentId);

    // Update booking payment status
    const { bookingService } = await import('./bookingService');
    await bookingService.updatePaymentStatus(
      intent.bookingId,
      result.success ? 'paid' : 'failed',
      intentId
    );

    return {
      ...result,
      intentId,
    };
  },

  // Simulate successful payment (for demo)
  async simulateSuccess(intentId: string): Promise<PaymentResult> {
    const intent = await this.fetchById(intentId);
    if (!intent) {
      throw new Error('Payment intent nicht gefunden');
    }

    const provider = currentProvider as DummyPaymentProvider;
    const result = await provider.forceSuccess(intent.providerIntentId || intentId);

    // Update database
    await supabase
      .from('payment_intents')
      .update({
        status: 'succeeded',
        processed_at: new Date().toISOString(),
      })
      .eq('id', intentId);

    // Update booking
    const { bookingService } = await import('./bookingService');
    await bookingService.updatePaymentStatus(intent.bookingId, 'paid', intentId);

    return {
      ...result,
      intentId,
    };
  },

  // Simulate failed payment (for demo)
  async simulateFailure(intentId: string, errorMessage?: string): Promise<PaymentResult> {
    const intent = await this.fetchById(intentId);
    if (!intent) {
      throw new Error('Payment intent nicht gefunden');
    }

    const provider = currentProvider as DummyPaymentProvider;
    const result = await provider.forceFailure(
      intent.providerIntentId || intentId,
      errorMessage
    );

    // Update database
    await supabase
      .from('payment_intents')
      .update({
        status: 'failed',
        processed_at: new Date().toISOString(),
        error_message: result.errorMessage,
        error_code: 'SIMULATED_FAILURE',
      })
      .eq('id', intentId);

    // Update booking
    const { bookingService } = await import('./bookingService');
    await bookingService.updatePaymentStatus(intent.bookingId, 'failed', intentId);

    return {
      ...result,
      intentId,
    };
  },

  // Cancel payment intent
  async cancelPayment(intentId: string): Promise<void> {
    const intent = await this.fetchById(intentId);
    if (!intent) {
      throw new Error('Payment intent nicht gefunden');
    }

    await currentProvider.cancelPayment(intent.providerIntentId || intentId);

    await supabase
      .from('payment_intents')
      .update({ status: 'cancelled' })
      .eq('id', intentId);
  },

  // Refund payment
  async refundPayment(intentId: string, amount?: number): Promise<void> {
    const intent = await this.fetchById(intentId);
    if (!intent) {
      throw new Error('Payment intent nicht gefunden');
    }

    await currentProvider.refundPayment(intent.providerIntentId || intentId, amount);

    await supabase
      .from('payment_intents')
      .update({ status: 'refunded' })
      .eq('id', intentId);

    // Update booking
    const { bookingService } = await import('./bookingService');
    await bookingService.updatePaymentStatus(intent.bookingId, 'refunded', intentId);
  },
};
