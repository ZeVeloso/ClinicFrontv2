/**
 * Unified subscription types - All subscription-related types in one place
 */

// Basic price information
export interface UnitPrice {
  amount: string;
  currencyCode: string;
}

// Trial period configuration
export interface TrialPeriod {
  interval: "day" | "week" | "month" | "year";
  frequency: number;
}

// Define billing intervals as a constant for consistent usage
export enum BillingInterval {
  Monthly = "month",
  Yearly = "year",
}

// Plan information from Paddle
export interface PaddlePlan {
  id: string;
  productId: string;
  name: string | null;
  description: string | null;
  unitPrice: UnitPrice;
  interval: BillingInterval | "month" | "year";
  intervalCount: number;
  trialPeriod?: TrialPeriod;
}

// Enhanced plan with application-specific properties
export interface Plan extends Omit<PaddlePlan, "name" | "description"> {
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  priceId: string; // Same as id, kept for compatibility
}

// Subscription status types
export type SubscriptionStatus = "active" | "trialing" | "canceled" | "paused";

// Subscription change action types
export type SubscriptionChangeAction = "cancel" | "pause" | "resume";

// Billing period information
export interface BillingPeriod {
  startsAt: string;
  endsAt: string;
}

// Billing cycle information
export interface BillingCycle {
  interval: "month" | "year";
  frequency: number;
}

// Management URLs for customer actions
export interface ManagementUrls {
  updatePaymentMethod: string;
  cancel: string;
}

// Subscription item details
export interface SubscriptionItem {
  status: SubscriptionStatus;
  quantity: number;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
  previouslyBilledAt: string;
  nextBilledAt: string;
  trialDates: null;
  price: {
    id: string;
    unitPrice: UnitPrice;
  };
  product: {
    id: string;
    name: string;
    type?: string;
    description?: string | null;
    taxCategory?: string;
    imageUrl?: string | null;
    customData?: any;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    importMeta?: any;
    prices?: any;
  };
}

// Subscription scheduled change information
export interface ScheduledChange {
  action: SubscriptionChangeAction;
  effectiveAt: string;
  resumeAt?: string | null;
}

// Main subscription model
export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  customerId: string;
  addressId?: string | null;
  businessId?: string | null;
  currencyCode: string;
  createdAt?: string;
  updatedAt?: string;
  startedAt?: string;
  firstBilledAt?: string;
  nextBilledAt: string | null;
  pausedAt?: string | null;
  canceledAt?: string | null;
  discount?: null;
  collectionMode?: string;
  billingDetails?: null;
  currentBillingPeriod?: BillingPeriod;
  billingCycle?: BillingCycle;
  scheduledChange?: ScheduledChange;
  managementUrls?: ManagementUrls;
  items: SubscriptionItem[];
  customData?: {
    userId: string;
  };
  importMeta?: any;
  nextTransaction?: any;
  recurringTransactionDetails?: any;
}

// Feature definition
export interface Feature {
  key: string;
  name: string;
  description?: string;
  requiredPlan: BillingInterval | "all" | "none";
}

// Response from subscription service operations
export interface SubscriptionActionResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Payment information for display
export interface PaymentInfo {
  title: string;
  date: string;
  amount: number;
  currency: string;
}

// Status info for UI display
export interface SubscriptionStatusInfo {
  label: string;
  color: "success" | "error" | "warning" | "info" | "primary";
  icon: React.ReactNode;
  message: string | null;
  bgColor?: string;
  borderColor?: string;
}

// Transaction/invoice history
export interface SubscriptionHistory {
  id: string;
  status: "completed" | "refunded" | "failed";
  customerId: string;
  addressId: string | null;
  businessId: string | null;
  currencyCode: string;
  origin: "web" | "api" | "subscription" | "manual";
  transactionId: string;
  invoiceNumber: string | null;
  createdAt: string;
  billedAt: string;
  items: Array<{
    price: {
      id: string;
      unitPrice: {
        amount: string;
        currency_code: string;
      };
    };
    quantity: number;
  }>;
  totals: {
    subtotal: string;
    tax: string;
    total: string;
    credit: string;
    balance: string;
    grand_total: string;
    fee: string | null;
    earnings: string | null;
    currency_code: string;
  };
}

// Context type for subscription
export interface SubscriptionContextType {
  // State
  loading: boolean;
  plans: Plan[];
  currentSubscription: Subscription | null;
  error: string | null;

  // Actions
  createCheckout: (priceId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
  updateSubscription: (
    subscriptionId: string,
    priceId: string
  ) => Promise<boolean>;
  resumeSubscription: (subscriptionId: string) => Promise<boolean>;
  refreshSubscriptionData: () => Promise<void>;
  previewProration: (subscriptionId: string, priceId: string) => Promise<any>;

  // Helpers
  hasActiveSubscription: () => boolean;
  hasFeatureAccess: (featureKey: string) => boolean;
  isSubscriptionExpired: () => boolean;
  hasScheduledCancellation: () => boolean;
  getScheduledCancellationDate: () => string | null;
  getSubscriptionTier: () => string | null;
}
