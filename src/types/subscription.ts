export interface UnitPrice {
  amount: string;
  currencyCode: string;
}

export interface TrialPeriod {
  interval: "day" | "week" | "month" | "year";
  frequency: number;
}

export interface PaddlePlan {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  unitPrice: UnitPrice;
  interval: "month" | "year";
  intervalCount: number;
  trialPeriod: TrialPeriod;
}

export interface Plan extends PaddlePlan {
  features: string[];
  popular: boolean;
  priceId: string; // This is the same as id, kept for compatibility
}

export interface Subscription {
  id: string;
  status: "active" | "trialing" | "canceled" | "paused";
  customerId: string;
  addressId: string | null;
  businessId: string | null;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
  firstBilledAt: string;
  nextBilledAt: string | null;
  pausedAt: string | null;
  canceledAt: string | null;
  discount: null;
  collectionMode: string;
  billingDetails: null;
  currentBillingPeriod: {
    endsAt: string;
    startsAt: string;
  };
  billingCycle: {
    interval: "month" | "year";
    frequency: number;
  };
  scheduledChange?: {
    action: "cancel" | "pause" | "resume";
    effectiveAt: string;
  };
  managementUrls: {
    updatePaymentMethod: string;
    cancel: string;
  };
  items: Array<{
    status: "active" | "paused" | "canceled";
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
      type: string;
      description: string | null;
      taxCategory: string;
      imageUrl: string | null;
      customData: null;
      status: string;
      createdAt: string;
      updatedAt: string;
      importMeta: null;
      prices: null;
    };
  }>;
  customData: {
    userId: string;
  };
  importMeta: null;
  nextTransaction: null;
  recurringTransactionDetails: null;
}

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
