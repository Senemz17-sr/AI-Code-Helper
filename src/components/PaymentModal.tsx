import { useState } from "react";
import { AlertCircle, CreditCard, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Course } from "@/types/course";
import { formatPrice } from "@/lib/payment";
import { mockProcessPayment } from "@/lib/payment";

interface PaymentModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
  userId?: string;
}

export default function PaymentModal({
  isOpen,
  course,
  onClose,
  onSuccess,
  userId = "user_123",
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(value.slice(0, 19));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      setError("Please enter a valid 16-digit card number");
      return;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError("Please enter expiry date in MM/YY format");
      return;
    }
    if (!cvv.match(/^\d{3}$/)) {
      setError("Please enter a valid 3-digit CVV");
      return;
    }

    setIsProcessing(true);

    try {
      // Mock payment processing
      const payment = await mockProcessPayment(
        userId,
        course.id,
        course.price || 29.99
      );

      if (payment.status === "completed") {
        // Record purchase in storage
        const purchases = JSON.parse(localStorage.getItem("codetutor_purchases") || "[]");
        purchases.push({
          id: `purch_${Date.now()}`,
          userId,
          courseId: course.id,
          purchasedAt: new Date().toISOString(),
          price: course.price,
          paymentId: payment.id,
        });
        localStorage.setItem("codetutor_purchases", JSON.stringify(purchases));

        // Add enrollment
        const enrollments = JSON.parse(localStorage.getItem("codetutor_enrollments") || "[]");
        const exists = enrollments.some(
          (e: any) => e.userId === userId && e.courseId === course.id
        );
        if (!exists) {
          enrollments.push({
            userId,
            courseId: course.id,
            enrolledAt: new Date().toISOString(),
            isPaid: true,
          });
          localStorage.setItem("codetutor_enrollments", JSON.stringify(enrollments));
        }

        onSuccess();
        onClose();
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during payment processing. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're about to enroll in "{course.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-2 p-3 rounded-lg bg-muted">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Course</span>
              <span className="text-sm font-medium">{course.title}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-semibold">
                {formatPrice(course.price || 29.99)}
              </span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm">
                Card Number
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  disabled={isProcessing}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  disabled={isProcessing}
                  type="password"
                />
              </div>
            </div>

            {/* Demo Notice */}
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                This is a demo. Use any card details to proceed.
              </AlertDescription>
            </Alert>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isProcessing}
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Your payment information is secure. This is a demo payment system.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
