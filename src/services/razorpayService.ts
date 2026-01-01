export type CreateOrderResponse = {
  id?: string; // razorpay order id
  orderId?: string;
};

export async function createOrder(amount: number): Promise<string> {
  // amount is expected in smallest currency unit (paise)
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }), // TODO: pass all product details as needed
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Create order failed: ${res.status} ${text}`);
    }

    const data: CreateOrderResponse = await res.json();
    // support both { id } and { orderId }
    const id = data.id ?? data.orderId;
    if (!id) throw new Error('No order id returned from server');
    return id;
  } catch (err) {
    console.error('createOrder error', err);
    throw err;
  }
}
