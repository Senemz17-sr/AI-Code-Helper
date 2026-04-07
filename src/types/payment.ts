// Payment and Subscription Types

export type SubscriptionPlan = "free" | "premium" | "enterprise";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "mock";

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface PricingPlan {
  id: string;
  name: SubscriptionPlan;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  description: string;
}

export interface CoursePrice {
  courseId: string;
  amount: number;
  currency: string;
  discount?: number;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  courseId: string;
  purchasedAt: string;
  price: number;
  paymentId: string;
}
