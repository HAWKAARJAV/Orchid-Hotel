import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Wallet, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(50),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    instructions: '',
  });

  // Billing calculations
  const gst = subtotal * 0.18; // 18% GST
  const serviceCharge = subtotal * 0.05; // 5% Service Charge
  const total = subtotal + gst + serviceCharge;
  const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';
  const normalizedApiBase = rawApiBase.replace(/\/$/, '');
  const ordersEndpoint = normalizedApiBase.endsWith('/api')
    ? `${normalizedApiBase}/orders`
    : `${normalizedApiBase}/api/orders`;

  const isCod = paymentMethod === 'cod';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    try {
      checkoutSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      const response = await fetch(ordersEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_phone: formData.phone,
          total_amount: total,
          payment_status: isCod ? 'COD' : 'SUCCESS',
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Order creation failed');
      }

      const orderData = await response.json();

      if (!orderData?.token_number) {
        throw new Error('Token was not generated for this order');
      }

      await clearCart();
      navigate('/order-success', {
        state: {
          tokenNumber: orderData.token_number,
          total,
          orderId: orderData.id,
          paymentStatus: orderData.payment_status,
        },
      });
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold text-primary-foreground text-center">
            Checkout
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Details */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-card-foreground mb-6">
                  Contact Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-card-foreground mb-6">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      placeholder="123 Main Street" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="Mumbai" 
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input 
                        id="pincode" 
                        placeholder="400001" 
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                    <Input 
                      id="instructions" 
                      placeholder="Any special instructions..." 
                      value={formData.instructions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-card-foreground mb-6">
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
                  <div className="space-y-3">
                    <label
                      htmlFor="card"
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Credit / Debit Card</p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, RuPay
                        </p>
                      </div>
                    </label>

                    <label
                      htmlFor="upi"
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="upi" id="upi" />
                      <Wallet className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-muted-foreground">
                          GPay, PhonePe, Paytm
                        </p>
                      </div>
                    </label>

                    <label
                      htmlFor="netbanking"
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Building className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Net Banking</p>
                        <p className="text-sm text-muted-foreground">
                          All major banks supported
                        </p>
                      </div>
                    </label>

                    <label
                      htmlFor="cod"
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Wallet className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-28">
                <h2 className="font-display text-xl font-bold text-card-foreground mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {items.map((item) => {
                    const discountedPrice = item.discountPercentage
                      ? item.price * (1 - item.discountPercentage / 100)
                      : item.price;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{Math.round(discountedPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <hr className="border-border mb-4" />

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{Math.round(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">₹{Math.round(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Charge (5%)</span>
                    <span className="font-medium">₹{Math.round(serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-display text-xl font-bold text-foreground">
                      ₹{Math.round(total)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isCod ? 'Place COD Order' : `Pay ₹${Math.round(total)}`}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;