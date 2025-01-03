import React from 'react';

const RouteErrorBoundary: React.FC = () => {
  return (
    <div className="text-center text-red-500 p-4">
      <h1 className="text-2xl font-bold">Oops! Something went wrong.</h1>
      <p className="mt-2">We encountered an error while trying to load this page. Please try again later.</p>
    </div>
  );
};

export default RouteErrorBoundary;