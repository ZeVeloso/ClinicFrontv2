import axiosInstance from "./axiosInstance";
import { Subscription, Plan } from "@features/subscription/types";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

// Constants
const BILLING_CYCLES = {
  MONTHLY: "month",
  ANNUAL: "year",
} as const;

// Types
type BillingCycle = (typeof BILLING_CYCLES)[keyof typeof BILLING_CYCLES];
type EffectiveFrom = "next_billing_period" | "immediately";

interface CheckoutOptions {
  priceId: string;
  billingCycle?: BillingCycle;
  quantity?: number;
}

interface UpdateSubscriptionOptions {
  subscriptionId: string;
  priceId: string;
  effectiveFrom?: EffectiveFrom;
}

// Initialize Paddle
export const initializePaddleClient = async (): Promise<Paddle | null> => {
  try {
    const IS_PADDLE_SANDBOX = import.meta.env.VITE_PADDLE_SANDBOX === "true";
    const paddleInstance = await initializePaddle({
      environment: IS_PADDLE_SANDBOX ? "sandbox" : "production",
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
    });

    return paddleInstance || null;
  } catch (error) {
    console.error("Error initializing Paddle:", error);
    return null;
  }
};

// Get subscription data with improved error handling
export const getSubscriptions = async (): Promise<{
  subscriptions: Subscription | null;
}> => {
  try {
    const response = await axiosInstance.get("/paddle/subscriptions");

    // Validate response format
    if (!response.data || typeof response.data !== "object") {
      console.error("Invalid subscription data format received");
      return { subscriptions: null };
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);

    // Provide clear error messages based on error type
    if (error.response?.status === 401) {
      throw new Error("Authentication expired. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to access subscription data.");
    }

    // Return null subscription data on error
    return { subscriptions: null };
  }
};

// Create checkout with input validation
export const createCheckout = async (priceId: string) => {
  // Validate price ID
  if (!priceId || typeof priceId !== "string") {
    throw new Error("Invalid price ID provided");
  }

  try {
    const response = await axiosInstance.post("/paddle/checkout", {
      priceId,
    });

    // Validate response
    if (!response.data || !response.data.transactionId) {
      throw new Error("Invalid response from checkout API");
    }

    return {
      transactionId: response.data.transactionId,
    };
  } catch (error: any) {
    console.error("Checkout creation error:", error);

    // Provide clear error messages based on error type
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to perform this action.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "Invalid checkout request."
      );
    } else if (error.response) {
      throw new Error(
        `Server error (${error.response.status}). Please try again later.`
      );
    }

    throw error;
  }
};

// Cancel subscription with enhanced security
export const cancelSubscription = async (subscriptionId: string) => {
  // Validate subscription ID
  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new Error("Invalid subscription ID provided");
  }

  try {
    const response = await axiosInstance.post(
      `/paddle/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`
    );

    // Validate response data
    if (!response.data) {
      throw new Error("Invalid response from cancellation API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Subscription cancellation error:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to cancel this subscription.");
    } else if (error.response?.status === 404) {
      throw new Error(
        "Subscription not found. It may have been already canceled."
      );
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "Invalid cancellation request."
      );
    }

    throw new Error("Failed to cancel subscription. Please try again later.");
  }
};

// Update subscription with enhanced security
export const updateSubscription = async (
  subscriptionId: string,
  priceId: string
) => {
  // Validate parameters
  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new Error("Invalid subscription ID provided");
  }

  if (!priceId || typeof priceId !== "string") {
    throw new Error("Invalid price ID provided");
  }

  try {
    const response = await axiosInstance.patch(
      `/paddle/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        priceId,
      }
    );

    // Validate response
    if (!response.data) {
      throw new Error("Invalid response from update API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Subscription update error:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to update this subscription.");
    } else if (error.response?.status === 404) {
      throw new Error("Subscription not found.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "Invalid update request."
      );
    }

    throw new Error("Failed to update subscription. Please try again later.");
  }
};

// Get available plans with enhanced security
export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await axiosInstance.get("/paddle/plans");

    // Validate response format
    if (
      !response.data ||
      !response.data.data ||
      !Array.isArray(response.data.data)
    ) {
      console.error("Invalid plan data format received");
      return [];
    }

    // Further validate each plan item
    const validatedPlans = response.data.data.filter((plan: any) => {
      if (!plan || typeof plan !== "object" || !plan.id) {
        console.error("Filtered out invalid plan:", plan);
        return false;
      }
      return true;
    });

    return validatedPlans;
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);

    // Provide clear error messages based on error type
    if (error.response?.status === 401) {
      throw new Error("Authentication expired. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to access plan data.");
    }

    // Return empty array on error
    return [];
  }
};

// Resume subscription with enhanced security
export const resumeSubscription = async (subscriptionId: string) => {
  // Validate subscription ID
  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new Error("Invalid subscription ID provided");
  }

  try {
    const response = await axiosInstance.post(
      `/paddle/subscriptions/${encodeURIComponent(subscriptionId)}/resume`
    );

    // Validate response data
    if (!response.data) {
      throw new Error("Invalid response from resume API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Subscription resume error:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to resume this subscription.");
    } else if (error.response?.status === 404) {
      throw new Error("Subscription not found.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message ||
          "Invalid resume request. The subscription may not be in a canceled state."
      );
    }

    throw new Error("Failed to resume subscription. Please try again later.");
  }
};

// Preview proration with enhanced security
export const previewProration = async (
  subscriptionId: string,
  priceId: string
) => {
  // Validate parameters
  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new Error("Invalid subscription ID provided");
  }

  if (!priceId || typeof priceId !== "string") {
    throw new Error("Invalid price ID provided");
  }

  try {
    const response = await axiosInstance.post(
      `/paddle/subscriptions/${encodeURIComponent(subscriptionId)}/preview`,
      {
        priceId,
      }
    );

    // Validate response
    if (!response.data) {
      throw new Error("Invalid response from proration preview API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Proration preview error:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to preview this proration.");
    } else if (error.response?.status === 404) {
      throw new Error("Subscription not found.");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "Invalid proration preview request."
      );
    }

    throw new Error("Failed to preview plan change. Please try again later.");
  }
};

// Get subscription invoices with enhanced security
export const getSubscriptionInvoices = async (subscriptionId: string) => {
  // Validate subscription ID
  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new Error("Invalid subscription ID provided");
  }

  try {
    const response = await axiosInstance.get(
      `/paddle/subscriptions/${encodeURIComponent(subscriptionId)}/invoices`
    );

    // Validate response
    if (!response.data) {
      throw new Error("Invalid response from invoices API");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription invoices:", error);

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to access these invoices.");
    } else if (error.response?.status === 404) {
      throw new Error("Subscription not found.");
    }

    throw new Error("Failed to retrieve invoices. Please try again later.");
  }
};

// Exports
export { BILLING_CYCLES };
export type {
  BillingCycle,
  EffectiveFrom,
  CheckoutOptions,
  UpdateSubscriptionOptions,
};
