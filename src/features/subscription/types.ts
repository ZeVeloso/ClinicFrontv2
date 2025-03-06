export interface Plan {
  id: string;
  name: string;
  description: string;
  interval: string;
  features: string[];
  popular: boolean;
  priceId: string;
  unitPrice: {
    amount: string;
    currencyCode: string;
  };
  trialPeriod?: {
    interval: string;
    frequency: number;
  };
}

export interface PaddlePlan {
  id: string;
  name: string | null;
  description: string | null;
  interval: string;
  unitPrice: {
    amount: string;
    currencyCode: string;
  };
  trialPeriod?: {
    interval: string;
    frequency: number;
  };
  intervalCount?: number;
  productId?: string;
}

export interface Subscription {
  id: string;
  status: "active" | "canceled" | "paused" | "trialing";
  customerId: string;
  currencyCode: string;
  nextBilledAt: string | null;
  items: Array<{
    status: "active" | "canceled" | "paused";
    quantity: number;
    recurring: boolean;
    createdAt: string;
    updatedAt: string;
    previouslyBilledAt: string;
    nextBilledAt: string;
    trialDates: null;
    price: {
      id: string;
      unitPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    product: {
      id: string;
      name: string;
    };
  }>;
  scheduledChange?: {
    action: string;
    effectiveAt: string;
    resumeAt: string | null;
  };
}
