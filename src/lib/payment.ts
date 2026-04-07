// Payment utilities and mock payment processing

import { Payment, PaymentStatus, Subscription, SubscriptionPlan } from "@/types/payment";

const MOCK_PAYMENT_DELAY = 1500; // ms to simulate processing

export const mockProcessPayment = async (
  userId: string,
  courseId: string | null,
  amount: number
): Promise<Payment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const payment: Payment = {
        id: `pay_${Date.now()}`,
        userId,
        courseId: courseId || undefined,
        amount,
        currency: "USD",
        status: Math.random() > 0.05 ? "completed" : "failed",
        method: "credit_card",
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      resolve(payment);
    }, MOCK_PAYMENT_DELAY);
  });
};

export const createMockSubscription = (
  userId: string,
  plan: SubscriptionPlan
): Subscription => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + (plan === "free" ? 0 : 1));

  return {
    id: `sub_${Date.now()}`,
    userId,
    plan,
    startDate: today.toISOString(),
    endDate: plan === "free" ? undefined : endDate.toISOString(),
    isActive: true,
    autoRenew: plan !== "free",
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  };
};

export const isSubscriptionActive = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  if (!subscription.isActive) return false;
  if (!subscription.endDate) return subscription.plan === "free";
  return new Date(subscription.endDate) > new Date();
};

export const canAccessPremium = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  return isSubscriptionActive(subscription) && subscription.plan !== "free";
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const calculateDiscount = (
  originalPrice: number,
  salePrice: number
): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};
