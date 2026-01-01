import { useCallback } from 'react';

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const loadRazorpayScript = (src = 'https://checkout.razorpay.com/v1/checkout.js') => {
    return new Promise<boolean>((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

type PayNowProps = {
    /** amount in currency subunits (e.g. paise) */
    amount?: number;
    orderId?: string;
};

export default function PayNow({ amount = 50000, orderId }: PayNowProps) {
    const openCheckout = useCallback(async () => {
        const ok = await loadRazorpayScript();
        if (!ok || !window.Razorpay) {
            alert('Razorpay SDK failed to load');
            return;
        }

        const options: any = {
            key: (import.meta as any).env.VITE_RAZORPAY_KEY || 'YOUR_KEY_ID',
            amount: amount, // amount in paise / currency subunits
            currency: 'INR',
            name: 'Acme Corp',
            description: 'Test Transaction',
            image: 'https://example.com/your_logo',
            order_id: orderId,
            handler: function (response: any) {
                // handle successful payment here
                console.log('Payment success', response);
                alert(`Payment successful: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: '',
                email: '',
                contact: '',
            },
            notes: {
                address: 'Razorpay Corporate Office',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
            console.error('Payment failed', response);
            alert('Payment failed. See console for details.');
        });
        rzp.open();
    }, []);

    return (
        <button onClick={openCheckout} className="rzp-button">
            Pay
        </button>
    );
};
