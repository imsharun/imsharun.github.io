export type OrderItemRequest = {
  ProductId: string;
  Quantity: number;
};

export type PlaceOrderRequest = {
  CustomerName?: string | null;
  Email?: string | null;
  Items: OrderItemRequest[];
};

export type CreateOrderResponse = {
  razorpayOrderId?: string; // 
  orderId?: string;
};

export async function createOrder(payload: PlaceOrderRequest): Promise<CreateOrderResponse> {
  try {
    const rawBase = (import.meta as any).env.VITE_API_BASE_URL || '';
    const base = rawBase.replace(/\/$/, '');
    const endpoint = base ? `${base}/api/orders` : '/api/orders';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create order failed: ${res.status} ${text}`);
    }

    const data: CreateOrderResponse = await res.json();
    return data;
  } catch (err) {
    console.error('createOrder error', err);
    throw err;
  }
}

// Backend expects: PaymentVerificationRequest(string PaymentId, string Signature)
export type PaymentVerificationRequest = {
  PaymentId: string;
  Signature: string;
};

export async function verifyPayment(orderId: string, payload: PaymentVerificationRequest): Promise<boolean> {
  try {
    const rawBase = (import.meta as any).env.VITE_API_BASE_URL || '';
    const base = rawBase.replace(/\/$/, '');
    const endpoint = base ? `${base}/api/orders/${orderId}/verify-payment` : `/orders/${orderId}/verify-payment`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('verifyPayment failed', res.status, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error('verifyPayment error', err);
    return false;
  }
}
