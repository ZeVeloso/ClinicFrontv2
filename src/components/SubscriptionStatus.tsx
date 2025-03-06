import React from "react";
import { useSubscription } from "../contexts/SubscriptionContext";
import { format } from "date-fns";

interface SubscriptionStatusProps {
  onCancel?: (subscriptionId: string) => void;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  onCancel,
}) => {
  const {
    currentSubscription,
    hasScheduledCancellation,
    getScheduledCancellationDate,
    hasActiveSubscription,
  } = useSubscription();

  if (!currentSubscription || !hasActiveSubscription()) {
    return null;
  }

  const handleCancel = () => {
    if (onCancel && currentSubscription.id) {
      onCancel(currentSubscription.id);
    }
  };

  const renderStatus = () => {
    if (hasScheduledCancellation()) {
      const endDate = getScheduledCancellationDate();
      if (endDate) {
        const formattedDate = format(new Date(endDate), "MMMM dd, yyyy");
        return (
          <div className="rounded-lg bg-yellow-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Subscription Ending Soon
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Your subscription is scheduled to end on {formattedDate}.
                    You will have access to all features until then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Active Subscription
          </h3>
          <p className="text-sm text-gray-500">
            {currentSubscription.items?.[0]?.product?.name || "Standard Plan"}
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel Subscription
        </button>
      </div>
    );
  };

  return <div className="max-w-3xl mx-auto">{renderStatus()}</div>;
};
