import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { Paddle } from "@paddle/paddle-js";
import * as paddleApi from "../api/paddle";
import { Plan, Subscription, SubscriptionHistory } from "../types/subscription";

interface SubscriptionContextType {
  plans: Plan[];
  currentSubscription: Subscription | null;
  subscriptionHistory: SubscriptionHistory[];
  loading: boolean;
  error: string | null;
  createCheckout: (priceId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
  updateSubscription: (
    subscriptionId: string,
    priceId: string
  ) => Promise<boolean>;
  refreshSubscriptionData: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

// Sample plans - replace with your actual plans from API when available
const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for small practices",
    price: 10,
    currency: "EUR",
    interval: "monthly",
    features: [
      "Up to 50 patients",
      "Appointment scheduling",
      "Basic patient records",
      "Email support",
    ],
    priceId: "pri_01jn9kqc66yks3k5h7ges42cc3",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing practices",
    price: 25,
    currency: "EUR",
    interval: "monthly",
    features: [
      "Unlimited patients",
      "Advanced scheduling",
      "Complete medical records",
      "Patient portal",
      "Priority support",
    ],
    priceId: "pri_professional_monthly",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For established clinics",
    price: 50,
    currency: "EUR",
    interval: "monthly",
    features: [
      "Multiple practitioners",
      "Custom branding",
      "Advanced analytics",
      "API access",
      "Dedicated account manager",
      "24/7 support",
    ],
    priceId: "pri_enterprise_monthly",
  },
];

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [plans] = useState<Plan[]>(SUBSCRIPTION_PLANS);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    SubscriptionHistory[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  // Initialize Paddle.js
  useEffect(() => {
    const loadPaddle = async () => {
      try {
        const paddleInstance = await paddleApi.initializePaddleClient();
        if (paddleInstance) {
          console.log("Paddle initialized successfully");
          setPaddle(paddleInstance);
        } else {
          throw new Error("Failed to initialize Paddle");
        }
      } catch (err) {
        console.error("Error initializing Paddle:", err);
        showToast("Failed to initialize payment processor", "error");
      }
    };

    loadPaddle();
  }, [showToast]);

  const fetchSubscriptionData = async () => {
    if (!accessToken) {
      setCurrentSubscription(null);
      setSubscriptionHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await paddleApi.getSubscriptions();

      if (data.subscriptions && data.subscriptions.length > 0) {
        setCurrentSubscription(data.subscriptions[0]);
      } else {
        setCurrentSubscription(null);
      }

      if (data.history) {
        setSubscriptionHistory(data.history);
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Failed to load subscription information");
      showToast("Failed to load subscription information", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount and when auth token changes
  useEffect(() => {
    fetchSubscriptionData();
  }, [accessToken]);

  const createCheckout = async (priceId: string): Promise<void> => {
    try {
      console.log("Starting checkout process for price ID:", priceId);

      if (!paddle) {
        throw new Error("Payment processor not initialized");
      }

      // Get checkout data from your backend
      const data = await paddleApi.createCheckout(priceId);
      console.log("Backend response:", data);

      // Check if we have a transaction ID from the backend
      if (data.transactionId) {
        console.log("Using transaction ID from backend:", data.transactionId);
        // Open checkout with transaction ID
        paddle.Checkout.open({
          transactionId: data.transactionId,
        });
      } else {
        // Open checkout with items list
        console.log("Opening checkout with price ID:", priceId);
        paddle.Checkout.open({
          items: [
            {
              priceId: priceId,
              quantity: 1,
            },
          ],
        });
      }

      console.log("Paddle checkout opened");
    } catch (err) {
      console.error("Error creating checkout:", err);
      showToast("Failed to create checkout", "error");
      throw err;
    }
  };

  const cancelSubscription = async (
    subscriptionId: string
  ): Promise<boolean> => {
    try {
      await paddleApi.cancelSubscription(subscriptionId);
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
      await paddleApi.updateSubscription(subscriptionId, priceId);
      await fetchSubscriptionData();
      showToast("Subscription updated successfully", "success");
      return true;
    } catch (err) {
      console.error("Error updating subscription:", err);
      showToast("Failed to update subscription", "error");
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        currentSubscription,
        subscriptionHistory,
        loading,
        error,
        createCheckout,
        cancelSubscription,
        updateSubscription,
        refreshSubscriptionData: fetchSubscriptionData,
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
