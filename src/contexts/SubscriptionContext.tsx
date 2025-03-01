import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import axios from "axios";

// Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  priceId: string;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  status: "active" | "paused" | "cancelled" | "past_due";
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  nextPayment?: {
    amount: number;
    currency: string;
    date: string;
  };
}

export interface SubscriptionHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "completed" | "refunded" | "failed";
}

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

// Add Paddle type definition
declare global {
  interface Window {
    Paddle?: {
      Setup: (config: { vendor: number; eventCallback?: Function }) => void;
      Checkout: {
        open: (config: any) => void;
      };
      Environment: {
        set: (environment: string) => void;
      };
    };
  }
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

const apiUrl = import.meta.env.VITE_API_URL;
const PADDLE_VENDOR_ID = import.meta.env.VITE_PADDLE_VENDOR_ID || 12345; // Replace with your actual vendor ID
const IS_PADDLE_SANDBOX = import.meta.env.VITE_PADDLE_SANDBOX === "true";

// Sample plans - replace with your actual plans
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

  // Configure axios with auth token
  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Initialize Paddle.js
  useEffect(() => {
    // Load Paddle.js script
    const loadPaddleJs = () => {
      if (window.Paddle) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/paddle.js";
        script.async = true;
        script.onload = () => {
          if (window.Paddle) {
            // Initialize Paddle
            window.Paddle.Setup({ vendor: Number(PADDLE_VENDOR_ID) });

            // Set environment (sandbox or production)
            if (IS_PADDLE_SANDBOX) {
              window.Paddle.Environment.set("sandbox");
            }

            resolve();
          } else {
            reject(new Error("Paddle.js failed to load"));
          }
        };
        script.onerror = () => reject(new Error("Failed to load Paddle.js"));
        document.head.appendChild(script);
      });
    };

    loadPaddleJs().catch((err) => {
      console.error("Error loading Paddle.js:", err);
      showToast("Failed to load payment processor", "error");
    });
  }, []);

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
      const { data } = await api.get("/paddle/subscriptions");

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
      if (!window.Paddle) {
        throw new Error("Payment processor not loaded");
      }

      const { data } = await api.post("/paddle/checkout", { priceId });

      // Open Paddle checkout
      window.Paddle.Checkout.open({
        product: priceId,
        email: data.email, // If your API returns the user's email
        successCallback: () => {
          // Handle successful checkout
          showToast("Subscription created successfully!", "success");
          fetchSubscriptionData();
          // Redirect to success page if needed
          window.location.href = "/app/checkout/success";
        },
        closeCallback: () => {
          // Handle checkout close
          console.log("Checkout closed");
        },
      });
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
      await api.post(`/paddle/subscriptions/${subscriptionId}/cancel`);
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
      await api.post(`/paddle/subscriptions/${subscriptionId}/update`, {
        priceId,
      });
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
