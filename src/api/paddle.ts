import axiosInstance from "./axiosInstance";
import { Subscription, SubscriptionHistory, Plan } from "../types/subscription";
import { initializePaddle, Paddle } from "@paddle/paddle-js";

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
  subscriptions: Subscription[];
  history: SubscriptionHistory[];
}> => {
  const response = await axiosInstance.get("/paddle/subscriptions");
  return response.data;
};

// Create checkout
export const createCheckout = async (priceId: string) => {
  const response = await axiosInstance.post("/paddle/checkout", {
    priceId,
  });
  return response.data;
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
  const response = await axiosInstance.post(
    `/paddle/subscriptions/${subscriptionId}/update`,
    {
      priceId,
    }
  );
  return response.data;
};

// Get available plans
export const getPlans = async (): Promise<Plan[]> => {
  const response = await axiosInstance.get("/paddle/plans");
  return response.data;
};
