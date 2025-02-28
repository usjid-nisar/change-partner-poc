// const API_BASE_URL = "/api";
const API_BASE_URL = "http://localhost:3002/api";

export const uploadFile = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        JSON.stringify({
          type: data.type,
          message: data.message,
        })
      );
    }

    return data;
  } catch (error) {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
    } catch {
      errorData = {
        type: "NETWORK_ERROR",
        message: "Network error occurred while uploading file",
      };
    }
    throw new Error(JSON.stringify(errorData));
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    throw new Error("Server health check failed");
  }
};
