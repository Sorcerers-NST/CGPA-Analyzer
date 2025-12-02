import apiClient from "./apiClient";

const BASE_URL = "/api/v1/semesters";

export const getAllSemesters = async () => {
  try {
    const response = await apiClient(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch semesters");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching semesters:", error);
    throw error;
  }
};

export const getSemesterById = async (semesterId) => {
  try {
    const response = await apiClient(`${BASE_URL}/${semesterId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch semester");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching semester:", error);
    throw error;
  }
};

export const createSemester = async (semesterData) => {
  try {
    const response = await apiClient(BASE_URL, {
      method: "POST",
      body: JSON.stringify(semesterData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create semester");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating semester:", error);
    throw error;
  }
};

export const updateSemester = async (semesterId, updateData) => {
  try {
    const response = await apiClient(`${BASE_URL}/${semesterId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update semester");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating semester:", error);
    throw error;
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const response = await apiClient(`${BASE_URL}/${semesterId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete semester");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting semester:", error);
    throw error;
  }
};

export const calculateSemesterCGPA = async (semesterId) => {
  try {
    const response = await apiClient(`${BASE_URL}/${semesterId}/cgpa`);

    if (!response.ok) {
      throw new Error("Failed to calculate CGPA");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calculating CGPA:", error);
    throw error;
  }
};
