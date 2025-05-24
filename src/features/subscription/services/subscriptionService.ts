/**
 * Subscription service - Handles all subscription-related API interactions
 */
import {
  BillingInterval,
  Feature,
  Plan,
  PaddlePlan,
  Subscription,
  SubscriptionActionResponse,
} from "../types";

import {
  getPlans,
  getSubscriptions,
  createCheckout as paddleCreateCheckout,
  cancelSubscription as paddleCancelSubscription,
  updateSubscription as paddleUpdateSubscription,
  resumeSubscription as paddleResumeSubscription,
  previewProration as paddlePreviewProration,
  initializePaddleClient,
} from "@/api/paddle";

// Feature definitions with clear requirements
export const FEATURES: Feature[] = [
  {
    key: "patient-management",
    name: "Patient Management",
    description: "Create and manage patient records",
    requiredPlan: "all", // Available in all plans
  },
  {
    key: "appointment-scheduling",
    name: "Appointment Scheduling",
    description: "Schedule and manage appointments",
    requiredPlan: "all", // Available in all plans
  },
  {
    key: "patient-portal",
    name: "Patient Portal",
    description: "Allow patients to access their information",
    requiredPlan: "all", // Available in all plans
  },
  {
    key: "analytics-dashboard",
    name: "Analytics Dashboard",
    description: "View comprehensive clinic analytics",
    requiredPlan: BillingInterval.Yearly, // Premium feature
  },
];

// Feature map by plan type
const FEATURE_MAP: Record<BillingInterval, string[]> = {
  [BillingInterval.Monthly]: FEATURES.filter(
    (f) =>
      f.requiredPlan === "all" || f.requiredPlan === BillingInterval.Monthly
  ).map((f) => f.key),
  [BillingInterval.Yearly]: FEATURES.filter(
    (f) => f.requiredPlan === "all" || f.requiredPlan === BillingInterval.Yearly
  ).map((f) => f.key),
};

/**
 * Transform a Paddle plan into our application Plan model
 */
export function transformPaddlePlan(paddlePlan: PaddlePlan): Plan {
  const isYearly = paddlePlan.interval === BillingInterval.Yearly;

  return {
    ...paddlePlan,
    name: paddlePlan.name || "Unnamed Plan",
    description: paddlePlan.description || "No description available",
    features: FEATURES.filter(
      (f) => f.requiredPlan === "all" || f.requiredPlan === paddlePlan.interval
    ).map((f) => f.name),
    popular: isYearly, // Make yearly plan popular
    priceId: paddlePlan.id,
  };
}

/**
 * Main subscription service class
 */
export class SubscriptionService {
  private paddleInstance: any = null;

  /**
   * Initialize the Paddle client
   */
  async initializePaddle(): Promise<void> {
    this.paddleInstance = await initializePaddleClient();
    return this.paddleInstance;
  }

  /**
   * Fetch all available subscription plans
   */
  async fetchPlans(): Promise<Plan[]> {
    try {
      const paddlePlans = await getPlans();
      return paddlePlans.map(transformPaddlePlan);
    } catch (error) {
      console.error("Error fetching plans:", error);
      return [];
    }
  }

  /**
   * Fetch the current user's subscription
   */
  async fetchSubscription(): Promise<Subscription | null> {
    try {
      const { subscriptions } = await getSubscriptions();
      return subscriptions;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }

  /**
   * Create a checkout session for a new subscription
   */
  async createCheckout(
    priceId: string,
    email: string
  ): Promise<{ transactionId: string }> {
    if (!this.paddleInstance) {
      await this.initializePaddle();
    }

    // Create the checkout
    const { transactionId } = await paddleCreateCheckout(priceId);

    // Open the checkout UI
    if (this.paddleInstance) {
      await this.paddleInstance.Checkout.open({
        transactionId,
        customer: { email },
        successUrl: `${window.location.origin}/checkout/success`,
      });
    }

    return { transactionId };
  }

  /**
   * Cancel an existing subscription
   */
  async cancelSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResponse> {
    try {
      await paddleCancelSubscription(subscriptionId);
      return {
        success: true,
        message: "Subscription cancelled successfully",
      };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      return {
        success: false,
        message: "Failed to cancel subscription",
      };
    }
  }

  /**
   * Update an existing subscription to a new plan
   */
  async updateSubscription(
    subscriptionId: string,
    priceId: string
  ): Promise<SubscriptionActionResponse> {
    try {
      await paddleUpdateSubscription(subscriptionId, priceId);
      return {
        success: true,
        message: "Subscription updated successfully",
      };
    } catch (error) {
      console.error("Error updating subscription:", error);
      return {
        success: false,
        message: "Failed to update subscription",
      };
    }
  }

  /**
   * Resume a paused or cancelled subscription
   */
  async resumeSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResponse> {
    try {
      await paddleResumeSubscription(subscriptionId);
      return {
        success: true,
        message: "Subscription resumed successfully",
      };
    } catch (error) {
      console.error("Error resuming subscription:", error);
      return {
        success: false,
        message: "Failed to resume subscription",
      };
    }
  }

  /**
   * Get a preview of proration charges when changing plans
   */
  async previewProration(
    subscriptionId: string,
    priceId: string
  ): Promise<any> {
    return await paddlePreviewProration(subscriptionId, priceId);
  }

  /**
   * Check if a subscription is active
   */
  isSubscriptionActive(subscription: Subscription | null): boolean {
    return Boolean(
      subscription &&
        ["active", "trialing"].includes(subscription.status) &&
        subscription.items?.length > 0
    );
  }

  /**
   * Check if a subscription has a scheduled cancellation
   */
  hasScheduledCancellation(subscription: Subscription | null): boolean {
    return Boolean(
      subscription?.scheduledChange &&
        subscription.scheduledChange.action === "cancel"
    );
  }

  /**
   * Get the cancellation date for a subscription
   */
  getScheduledCancellationDate(
    subscription: Subscription | null
  ): string | null {
    return this.hasScheduledCancellation(subscription) &&
      subscription?.scheduledChange
      ? subscription.scheduledChange.effectiveAt
      : null;
  }

  /**
   * Get the subscription tier/interval (monthly/yearly)
   */
  getSubscriptionTier(
    subscription: Subscription | null,
    plans: Plan[]
  ): BillingInterval | null {
    if (!subscription) {
      return null;
    }

    // First approach: try to match by price ID in our plans list
    if (subscription.items?.[0]?.price?.id) {
      const priceId = subscription.items[0].price.id;
      const plan = plans.find((p) => p.id === priceId);

      if (
        plan?.interval === BillingInterval.Monthly ||
        plan?.interval === BillingInterval.Yearly
      ) {
        return plan.interval as BillingInterval;
      }
    }

    // Second approach: check the subscription's billing cycle directly
    if (subscription.billingCycle?.interval) {
      const interval = subscription.billingCycle.interval;
      if (
        interval === BillingInterval.Monthly ||
        interval === BillingInterval.Yearly
      ) {
        return interval as BillingInterval;
      }
    }

    // Third approach: for custom or legacy plans, try to determine from item details
    if (subscription.items?.[0]?.recurring) {
      // If we can't determine the interval but the subscription is active and recurring,
      // default to monthly as the most basic tier to ensure they have access
      return BillingInterval.Monthly;
    }

    return null;
  }

  /**
   * Check if user has access to a specific feature
   */
  hasFeatureAccess(
    featureKey: string,
    subscription: Subscription | null,
    plans: Plan[]
  ): boolean {
    console.log("Checking feature access for:", featureKey);
    if (!this.isSubscriptionActive(subscription)) {
      return false;
    }
    console.log("Subscription is active");
    const tier = this.getSubscriptionTier(subscription, plans);
    if (!tier) {
      return false;
    }
    console.log("Subscription tier:", tier);
    // Check if tier is a valid BillingInterval
    if (tier === BillingInterval.Monthly || tier === BillingInterval.Yearly) {
      return (
        FEATURE_MAP[tier as BillingInterval]?.includes(featureKey) || false
      );
    }

    return false;
  }

  /**
   * Check if a subscription is expired
   */
  isSubscriptionExpired(subscription: Subscription | null): boolean {
    if (!subscription) {
      return true;
    }

    if (subscription.status === "canceled") {
      return true;
    }

    if (
      subscription.scheduledChange?.action === "cancel" &&
      new Date(subscription.scheduledChange.effectiveAt) <= new Date()
    ) {
      return true;
    }

    return false;
  }
}
