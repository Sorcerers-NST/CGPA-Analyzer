const apiClient = async (url, options = {}) => {
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    // Auto-redirect to login on unauthorized access
    if (response.status === 401) {
      localStorage.removeItem("isAuthenticated");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("API request failed:", error);
    }
    throw error;
  }
};

export default apiClient;
