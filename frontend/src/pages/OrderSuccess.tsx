import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, Home, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OrderSuccess = () => {
  const location = useLocation();
  const { tokenNumber, total, orderId, paymentStatus } = location.state || {};

  if (!tokenNumber) {
    return <Navigate to="/" replace />;
  }

  const copyToken = () => {
    navigator.clipboard.writeText(tokenNumber);
    toast({
      title: 'Copied!',
      description: 'Token number copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8 animate-fade-in-up animation-delay-100">
            Thank you for your order. Your delicious food is being prepared and will be delivered soon.
          </p>

          {/* Token Card */}
          <div className="bg-card rounded-2xl p-8 shadow-elevated mb-8 animate-fade-in-up animation-delay-200">
            <p className="text-sm text-muted-foreground mb-2">Your Token Number</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="font-display text-3xl font-bold text-primary">
                {tokenNumber}
              </span>
              <button
                onClick={copyToken}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Copy className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <Badge variant="secondary" className="mb-6">
              Status: {paymentStatus || 'Paid'}
            </Badge>

            <hr className="border-border mb-6" />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount Paid</span>
              {typeof total === 'number' ? (
                <span className="font-display text-2xl font-bold text-foreground">
                  ₹{Math.round(total)}
                </span>
              ) : null}
            </div>
          </div>

          {/* Info */}
          <div className="bg-accent/10 rounded-xl p-4 mb-8 text-left animate-fade-in-up animation-delay-300">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Please save your token number. 
              You'll need it to track your order and collect your food.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link to="/">
              <Button variant="outline" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg">
                <Receipt className="w-4 h-4 mr-2" />
                Order More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;