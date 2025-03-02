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
