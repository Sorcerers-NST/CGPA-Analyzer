import axios from "../config/axios";

const API_BASE_URL = "/api/v1/subjects";

export const createSubject = async (subjectData) => {
  const response = await axios.post(API_BASE_URL, subjectData);
  return response.data;
};

export const getSubjectsBySemester = async (semesterId) => {
  const response = await axios.get(`${API_BASE_URL}/semester/${semesterId}`);
  return response.data;
};

export const getSubjectById = async (subjectId) => {
  const response = await axios.get(`${API_BASE_URL}/${subjectId}`);
  return response.data;
};

export const updateSubject = async (subjectId, updateData) => {
  const response = await axios.put(`${API_BASE_URL}/${subjectId}`, updateData);
  return response.data;
};

export const deleteSubject = async (subjectId) => {
  const response = await axios.delete(`${API_BASE_URL}/${subjectId}`);
  return response.data;
};
