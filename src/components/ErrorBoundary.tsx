import { Component, ErrorInfo } from "react";

// Define the state type
interface State {
  hasError: boolean;
}

// Create the error boundary class
class ErrorBoundary extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  // This method is called when an error occurs
  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true }; // Update state to show the fallback UI
  }

  // This method is called after the error is logged
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Here, you can log the error to an external service (e.g., Sentry)
    console.error("Caught error:", error, errorInfo);
  }

  // Render the fallback UI
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500">
          <h1>Unexpected Application Error!</h1>
          <p>Something went wrong. Please try again later.</p>
        </div>
      );
    }

    return this.props.children; // Render the child components if no error
  }
}

export default ErrorBoundary;
