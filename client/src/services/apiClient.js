const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://cgpa-analyzer.onrender.com";

const apiClient = async (url, options = {}) => {
  // Prepend base URL if the URL is relative
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(fullUrl, config);

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
