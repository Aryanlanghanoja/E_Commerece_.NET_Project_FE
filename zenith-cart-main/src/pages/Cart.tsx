import { Minus, Plus, Trash2, ShoppingBag, Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateOrder } from '@/hooks/useOrders';
import { useInitiatePayment } from '@/hooks/usePayments';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const paymentModes = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'NetBanking', label: 'Net Banking', icon: Building2 },
  { id: 'CashOnDelivery', label: 'Cash on Delivery', icon: CreditCard },
];

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;
  
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('UPI');
  
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const createOrder = useCreateOrder();
  const initiatePayment = useInitiatePayment();

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      const orderResponse = await createOrder.mutateAsync({
        addressId: selectedAddressId,
        items: items.map((item) => ({
          productId: parseInt(item.product.id),
          quantity: item.quantity,
        })),
      });

      if (orderResponse.success) {
        const paymentResponse = await initiatePayment.mutateAsync({
          orderId: orderResponse.data.id,
          paymentMode: selectedPaymentMode as 'UPI' | 'NetBanking' | 'CashOnDelivery',
        });

        if (paymentResponse.success) {
          clearCart();
          toast.success('Order placed successfully!');
          navigate('/orders');
        }
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mt-1 mb-6">Add some products to get started</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">{items.length} item{items.length !== 1 && 's'}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-destructive hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-card rounded-xl border border-border p-4 shadow-sm"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">{product.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                <p className="text-lg font-bold mt-2">${(product.price * quantity).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 border border-border rounded-lg">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 hover:bg-muted rounded-l-lg transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 hover:bg-muted rounded-r-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-sm h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-success font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">Free shipping on orders over $100</p>
            )}
            <div className="border-t border-border pt-3 flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            onClick={() => setShowCheckout(true)} 
            className="w-full mt-5 h-11 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Button>
          <Link
            to="/products"
            className="block text-center text-sm text-accent hover:underline mt-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order by selecting address and payment method.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Delivery Address</Label>
              {addressesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium">{addr.line1}</p>
                        <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-xs text-muted-foreground">{addr.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No addresses found. Please add an address in Settings.</p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Payment Method</Label>
              <div className="space-y-2">
                {paymentModes.map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPaymentMode === mode.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentMode === mode.id}
                      onChange={() => setSelectedPaymentMode(mode.id)}
                    />
                    <mode.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={createOrder.isPending || initiatePayment.isPending || !selectedAddressId}
            >
              {(createOrder.isPending || initiatePayment.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
