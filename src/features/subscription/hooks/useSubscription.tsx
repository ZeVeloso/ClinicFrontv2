import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { Plan, PaddlePlan, Subscription } from "../types";
import {
  getPlans as fetchPaddlePlans,
  getSubscriptions,
  createCheckout as paddleCreateCheckout,
  cancelSubscription as paddleCancelSubscription,
  updateSubscription as paddleUpdateSubscription,
  resumeSubscription as paddleResumeSubscription,
  previewProration as paddlePreviewProration,
  initializePaddleClient,
} from "../../../api/paddle";

// Feature list for each plan
const PLAN_FEATURES = [
  "Patient Management",
  "Appointment Scheduling",
  "Patient Portal",
  "Analytics Dashboard",
];

// Feature access mapping by interval
const FEATURE_ACCESS_MAP: Record<string, string[]> = {
  month: PLAN_FEATURES,
  year: PLAN_FEATURES,
};

const transformPaddlePlan = (paddlePlan: PaddlePlan): Plan => {
  const isYearly = paddlePlan.interval === "year";

  return {
    ...paddlePlan,
    name: paddlePlan.name || "Unnamed Plan",
    description: paddlePlan.description || "No description available",
    features: PLAN_FEATURES,
    popular: isYearly,
    priceId: paddlePlan.id,
    trialPeriod: paddlePlan.trialPeriod,
  };
};

interface SubscriptionContextType {
  plans: Plan[];
  currentSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
  createCheckout: (priceId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
  updateSubscription: (
    subscriptionId: string,
    priceId: string
  ) => Promise<boolean>;
  resumeSubscription: (subscriptionId: string) => Promise<boolean>;
  refreshSubscriptionData: () => Promise<void>;
  hasActiveSubscription: () => boolean;
  hasFeatureAccess: (featureKey: string) => boolean;
  isSubscriptionExpired: () => boolean;
  getSubscriptionTier: () => string | null;
  previewProration: (subscriptionId: string, priceId: string) => Promise<any>;
  hasScheduledCancellation: () => boolean;
  getScheduledCancellationDate: () => string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paddleInstance, setPaddleInstance] = useState<any>(null);

  useEffect(() => {
    const initPaddle = async () => {
      const instance = await initializePaddleClient();
      setPaddleInstance(instance);
    };

    initPaddle();
  }, []);

  const fetchPlans = async () => {
    try {
      const plans = await fetchPaddlePlans();
      // Transform Paddle plans to our Plan type
      const transformedPlans = plans.map(transformPaddlePlan);
      setPlans(transformedPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
      showToast("Failed to load subscription plans", "error");
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    }
  };

  const fetchSubscriptionData = async () => {
    if (!accessToken) {
      setCurrentSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { subscriptions } = await getSubscriptions();
      setCurrentSubscription(subscriptions as Subscription);
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Failed to load subscription information");
      showToast("Failed to load subscription information", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeSubscription = async () => {
      await Promise.all([fetchPlans(), fetchSubscriptionData()]);
    };

    initializeSubscription();
  }, [accessToken]);

  const createCheckout = async (priceId: string) => {
    try {
      if (!paddleInstance) {
        throw new Error("Paddle is not initialized");
      }

      const { transactionId } = await paddleCreateCheckout(priceId);

      await paddleInstance.Checkout.open({
        transactionId: transactionId,
        customer: { email: user?.email || "" },
      });
    } catch (err) {
      console.error("Error creating checkout:", err);
      showToast("Failed to create checkout", "error");
      throw err;
    }
  };

  const hasScheduledCancellation = (): boolean => {
    return (
      !!currentSubscription?.scheduledChange &&
      currentSubscription.scheduledChange.action === "cancel"
    );
  };

  const getScheduledCancellationDate = (): string | null => {
    if (!hasScheduledCancellation()) {
      return null;
    }
    return currentSubscription?.scheduledChange?.effectiveAt || null;
  };

  const cancelSubscription = async (
    subscriptionId: string
  ): Promise<boolean> => {
    // Prevent cancellation if already scheduled for cancellation
    if (hasScheduledCancellation()) {
      showToast(
        `Subscription is already scheduled to end on ${new Date(
          getScheduledCancellationDate()!
        ).toLocaleDateString()}`,
        "info"
      );
      return false;
    }

    try {
      await paddleCancelSubscription(subscriptionId);
      await fetchSubscriptionData();
      showToast("Subscription cancelled successfully", "success");
      return true;
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
      await paddleUpdateSubscription(subscriptionId, priceId);
      await fetchSubscriptionData();
      showToast("Subscription updated successfully", "success");
      return true;
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
      await paddleResumeSubscription(subscriptionId);
      await fetchSubscriptionData();
      showToast("Subscription resumed successfully", "success");
      return true;
    } catch (err) {
      console.error("Error resuming subscription:", err);
      showToast("Failed to resume subscription", "error");
      return false;
    }
  };

  const previewProration = async (subscriptionId: string, priceId: string) => {
    try {
      return await paddlePreviewProration(subscriptionId, priceId);
    } catch (err) {
      console.error("Error previewing proration:", err);
      showToast("Failed to preview plan change", "error");
      throw err;
    }
  };

  const hasActiveSubscription = (): boolean => {
    return (
      !!currentSubscription &&
      (currentSubscription.status === "active" ||
        currentSubscription.status === "trialing") &&
      currentSubscription.items?.length > 0
    );
  };

  const getSubscriptionTier = (): string | null => {
    if (!currentSubscription || !currentSubscription.items[0]?.price.id) {
      return null;
    }

    const priceId = currentSubscription.items[0].price.id;
    const plan = plans.find((p) => p.id === priceId);
    return plan ? plan.interval : null;
  };

  const hasFeatureAccess = (featureKey: string): boolean => {
    if (!hasActiveSubscription()) {
      return false;
    }

    const tier = getSubscriptionTier();
    if (!tier) {
      return false;
    }

    return FEATURE_ACCESS_MAP[tier]?.includes(featureKey) || false;
  };

  const isSubscriptionExpired = (): boolean => {
    if (!currentSubscription) {
      return true;
    }

    if (currentSubscription.status === "canceled") {
      return true;
    }

    if (
      currentSubscription.scheduledChange?.action === "cancel" &&
      new Date(currentSubscription.scheduledChange.effectiveAt) <= new Date()
    ) {
      return true;
    }

    return false;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        currentSubscription,
        loading,
        error,
        createCheckout,
        cancelSubscription,
        updateSubscription,
        resumeSubscription,
        refreshSubscriptionData: fetchSubscriptionData,
        hasActiveSubscription,
        hasFeatureAccess,
        isSubscriptionExpired,
        getSubscriptionTier,
        previewProration,
        hasScheduledCancellation,
        getScheduledCancellationDate,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
