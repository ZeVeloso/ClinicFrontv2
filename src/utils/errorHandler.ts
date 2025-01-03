export const handleError = (error: any): string => {
  if (error.response) {
    // API response error
    return (
      error.response.data.message || "Something went wrong. Please try again."
    );
  }
  // Network or unknown error
  return "Network error. Please try again later.";
};
