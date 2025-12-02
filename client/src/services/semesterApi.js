import axios from "../config/axios";

const BASE_URL = "/api/v1/semesters";

export const getAllSemesters = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching semesters:", error);
    throw error;
  }
};

export const getSemesterById = async (semesterId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching semester:", error);
    throw error;
  }
};

export const createSemester = async (semesterData) => {
  try {
    const response = await axios.post(BASE_URL, semesterData);
    return response.data;
  } catch (error) {
    console.error("Error creating semester:", error);
    throw error;
  }
};

export const updateSemester = async (semesterId, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${semesterId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating semester:", error);
    throw error;
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting semester:", error);
    throw error;
  }
};

export const calculateSemesterCGPA = async (semesterId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${semesterId}/cgpa`);
    return response.data;
  } catch (error) {
    console.error("Error calculating CGPA:", error);
    throw error;
  }
};
