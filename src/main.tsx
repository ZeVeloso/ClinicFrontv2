import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";

import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <SubscriptionProvider>
          <AppRoutes />
        </SubscriptionProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
