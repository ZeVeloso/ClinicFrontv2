import { useContext } from "react";
import { SubscriptionContext } from "../providers/SubscriptionProvider";

/**
 * Hook for accessing subscription functionality
 * This hook provides access to all subscription state, actions, and helpers
 */
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }

  return context;
};
