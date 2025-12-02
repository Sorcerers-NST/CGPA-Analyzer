import apiClient from "./apiClient";

const API_BASE_URL = "/api/v1/subjects";

export const createSubject = async (subjectData) => {
  const response = await apiClient(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(subjectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create subject");
  }

  return data;
};

export const getSubjectsBySemester = async (semesterId) => {
  const response = await apiClient(`${API_BASE_URL}/semester/${semesterId}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch subjects");
  }

  return data;
};

export const getSubjectById = async (subjectId) => {
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch subject");
  }

  return data;
};

export const updateSubject = async (subjectId, updateData) => {
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update subject");
  }

  return data;
};

export const deleteSubject = async (subjectId) => {
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete subject");
  }

  return data;
};
