import React from "react";
import AppRoutes from "./routes";
import ErrorBoundary from "./components/ErrorBoundary"; // Import the ErrorBoundary component

const App: React.FC = () => {
  return (
    <div>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
};

export default App;
