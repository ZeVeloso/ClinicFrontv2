import axiosInstance from "./axiosInstance";
import { Subscription, Plan } from "../types/subscription";
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

// Get subscription data
export const getSubscriptions = async (): Promise<{
  subscriptions: Subscription | null;
}> => {
  const response = await axiosInstance.get("/paddle/subscriptions");
  return response.data;
};

// Create checkout
export const createCheckout = async (priceId: string) => {
  const response = await axiosInstance.post("/paddle/checkout", {
    priceId,
  });
  return {
    transactionId: response.data.transactionId,
  };
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  const response = await axiosInstance.post(
    `/paddle/subscriptions/${subscriptionId}/cancel`
  );
  return response.data;
};

// Update subscription
export const updateSubscription = async (
  subscriptionId: string,
  priceId: string
) => {
  const response = await axiosInstance.patch(
    `/paddle/subscriptions/${subscriptionId}`,
    {
      priceId,
    }
  );
  return response.data;
};

// Get available plans
export const getPlans = async (): Promise<Plan[]> => {
  const response = await axiosInstance.get("/paddle/plans");
  return response.data.data;
};

// Resume subscription
export const resumeSubscription = async (subscriptionId: string) => {
  const response = await axiosInstance.post(
    `/paddle/subscriptions/${subscriptionId}/resume`
  );
  return response.data;
};

// Preview proration
export const previewProration = async (
  subscriptionId: string,
  priceId: string
) => {
  const response = await axiosInstance.post(
    `/paddle/subscriptions/${subscriptionId}/preview`,
    {
      priceId,
    }
  );
  return response.data;
};

// Get subscription invoices
export const getSubscriptionInvoices = async (subscriptionId: string) => {
  const response = await axiosInstance.get(
    `/paddle/subscriptions/${subscriptionId}/invoices`
  );
  return response.data;
};

// Exports
export { BILLING_CYCLES };
export type {
  BillingCycle,
  EffectiveFrom,
  CheckoutOptions,
  UpdateSubscriptionOptions,
};
