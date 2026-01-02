export type OrderItemRequest = {
  ProductId: number;
  Quantity: number;
};

export type PlaceOrderRequest = {
  CustomerName?: string | null;
  Email?: string | null;
  Items: OrderItemRequest[];
};

export type CreateOrderResponse = {
  id?: string; // razorpay order id
  orderId?: string;
};

export async function createOrder(payload: PlaceOrderRequest): Promise<string> {
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
    const id = data.id ?? data.orderId;
    if (!id) throw new Error('No order id returned from server');
    return id;
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
