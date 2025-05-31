import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Plan, Subscription, SubscriptionContextType } from "../types";
import { SubscriptionService } from "../services/subscriptionService";

// Create context with undefined initial value
export const SubscriptionContext = createContext<
  SubscriptionContextType | undefined
>(undefined);

// Create the provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get necessary hooks
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();

  // Set up state
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create the service instance
  const subscriptionService = new SubscriptionService();

  // Initialize data
  useEffect(() => {
    const initSubscription = async () => {
      setLoading(true);

      try {
        // Initialize Paddle
        await subscriptionService.initializePaddle();

        // Fetch plans and subscription data in parallel
        const [plansData, subscriptionData] = await Promise.all([
          subscriptionService.fetchPlans(),
          subscriptionService.fetchSubscription(),
        ]);

        setPlans(plansData);
        setCurrentSubscription(subscriptionData);
        setError(null);
      } catch (err) {
        console.error("Error initializing subscription data:", err);
        setError("Failed to load subscription information");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when we have an access token
    if (accessToken) {
      initSubscription();
    } else {
      setCurrentSubscription(null);
      setLoading(false);
    }
  }, [accessToken]);

  // Actions
  const refreshSubscriptionData = async (): Promise<void> => {
    try {
      setLoading(true);
      const subscription = await subscriptionService.fetchSubscription();
      setCurrentSubscription(subscription);
    } catch (err) {
      console.error("Error refreshing subscription:", err);
      setError("Failed to refresh subscription data");
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (priceId: string): Promise<void> => {
    try {
      if (!user?.email) {
        throw new Error("User email is required for checkout");
      }

      await subscriptionService.createCheckout(priceId, user.email);

      // Refresh data after a delay to allow for processing
      setTimeout(() => refreshSubscriptionData(), 2000);

      showToast("Checkout process started", "info");
    } catch (err) {
      console.error("Error creating checkout:", err);
      showToast("Failed to start checkout process", "error");
    }
  };

  const cancelSubscription = async (
    subscriptionId: string
  ): Promise<boolean> => {
    try {
      // Prevent cancellation if already scheduled
      if (subscriptionService.hasScheduledCancellation(currentSubscription)) {
        const date =
          subscriptionService.getScheduledCancellationDate(currentSubscription);
        showToast(
          `Subscription is already scheduled to end on ${new Date(date!).toLocaleDateString()}`,
          "info"
        );
        return false;
      }

      const result =
        await subscriptionService.cancelSubscription(subscriptionId);

      if (result.success) {
        await refreshSubscriptionData();
        showToast(
          result.message || "Subscription cancelled successfully",
          "success"
        );
        return true;
      } else {
        showToast(result.message || "Failed to cancel subscription", "error");
        return false;
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      showToast("Failed to cancel subscription", "error");
      return false;
    }
  };

  const updateSubscription = async (
    subscriptionId: string,
    priceId: string
  ): Promise<boolean> => {
    try {
      const result = await subscriptionService.updateSubscription(
        subscriptionId,
        priceId
      );

      if (result.success) {
        await refreshSubscriptionData();
        showToast(
          result.message || "Subscription updated successfully",
          "success"
        );
        return true;
      } else {
        showToast(result.message || "Failed to update subscription", "error");
        return false;
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
      showToast("Failed to update subscription", "error");
      return false;
    }
  };

  const resumeSubscription = async (
    subscriptionId: string
  ): Promise<boolean> => {
    try {
      const result =
        await subscriptionService.resumeSubscription(subscriptionId);

      if (result.success) {
        await refreshSubscriptionData();
        showToast(
          result.message || "Subscription resumed successfully",
          "success"
        );
        return true;
      } else {
        showToast(result.message || "Failed to resume subscription", "error");
        return false;
      }
    } catch (err) {
      console.error("Error resuming subscription:", err);
      showToast("Failed to resume subscription", "error");
      return false;
    }
  };

  // Helpers
  const hasActiveSubscription = (): boolean => {
    return subscriptionService.isSubscriptionActive(currentSubscription);
  };

  const hasFeatureAccess = (featureKey: string): boolean => {
    console.log(featureKey);
    return subscriptionService.hasFeatureAccess(
      featureKey,
      currentSubscription,
      plans
    );
  };

  const hasScheduledCancellation = (): boolean => {
    return subscriptionService.hasScheduledCancellation(currentSubscription);
  };

  const getScheduledCancellationDate = (): string | null => {
    return subscriptionService.getScheduledCancellationDate(
      currentSubscription
    );
  };

  const getSubscriptionTier = (): string | null => {
    return subscriptionService.getSubscriptionTier(currentSubscription, plans);
  };

  const isSubscriptionExpired = (): boolean => {
    return !currentSubscription || currentSubscription.status === "canceled";
  };

  const previewProration = async (
    subscriptionId: string,
    priceId: string
  ): Promise<any> => {
    return await subscriptionService.previewProration(subscriptionId, priceId);
  };

  // Create the context value
  const contextValue = {
    // State
    loading,
    plans,
    currentSubscription,
    error,

    // Actions
    createCheckout,
    cancelSubscription,
    updateSubscription,
    resumeSubscription,
    refreshSubscriptionData,
    previewProration,

    // Helpers
    hasActiveSubscription,
    hasFeatureAccess,
    hasScheduledCancellation,
    getScheduledCancellationDate,
    getSubscriptionTier,
    isSubscriptionExpired,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};
