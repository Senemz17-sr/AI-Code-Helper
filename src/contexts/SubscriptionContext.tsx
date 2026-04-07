import React, { createContext, useContext, useEffect, useState } from "react";
import type { Subscription } from "@/types/payment";
import { createMockSubscription, isSubscriptionActive } from "@/lib/payment";
import { getEnrollments, addEnrollment, isEnrolled } from "@/lib/storage";

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  canAccessPremium: boolean;
  isEnrolledInCourse: (courseId: string) => boolean;
  enrollCourse: (courseId: string, isPaid: boolean) => void;
  upgradeToPremium: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user from localStorage (from auth context)
  useEffect(() => {
    try {
      const authUser = localStorage.getItem("codetutor_user");
      if (authUser) {
        const user = JSON.parse(authUser);
        setUserId(user.id);
      }
    } catch {
      console.error("Failed to get user");
    }
  }, []);

  // Load subscription on mount and when userId changes
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setSubscription(null);
      return;
    }

    const loadSubscription = async () => {
      try {
        // Check localStorage for existing subscription
        const stored = localStorage.getItem(`codetutor_subscription_${userId}`);
        if (stored) {
          const sub = JSON.parse(stored);
          setSubscription(sub);
        } else {
          // Create free subscription by default
          const freeSub = createMockSubscription(userId, "free");
          localStorage.setItem(`codetutor_subscription_${userId}`, JSON.stringify(freeSub));
          setSubscription(freeSub);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [userId]);

  const canAccessPremium = subscription ? isSubscriptionActive(subscription) && subscription.plan !== "free" : false;

  const isEnrolledInCourse = (courseId: string): boolean => {
    if (!userId) return false;
    return isEnrolled(userId, courseId);
  };

  const enrollCourse = (courseId: string, isPaid: boolean): void => {
    if (!userId) return;
    addEnrollment({
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      isPaid,
    });
  };

  const upgradeToPremium = (): void => {
    if (!userId || !subscription) return;
    
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 1);

    const premiumSub: Subscription = {
      ...subscription,
      plan: "premium",
      endDate: endDate.toISOString(),
      autoRenew: true,
      updatedAt: today.toISOString(),
    };

    localStorage.setItem(`codetutor_subscription_${userId}`, JSON.stringify(premiumSub));
    setSubscription(premiumSub);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        canAccessPremium,
        isEnrolledInCourse,
        enrollCourse,
        upgradeToPremium,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}
