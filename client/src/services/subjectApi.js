import apiClient from './apiClient';

const API_BASE_URL = '/api/v1/subjects';

/**
 * Create a new subject
 * @param {Object} subjectData - { name, credits, grade, gradePoint, semesterId }
 * @returns {Promise<Object>}
 */
export const createSubject = async (subjectData) => {
  console.log('Creating subject:', subjectData);
  
  const response = await apiClient(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(subjectData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create subject');
  }

  console.log('Subject created:', data);
  return data;
};

/**
 * Get all subjects for a semester
 * @param {string} semesterId - Semester ID
 * @returns {Promise<Object>}
 */
export const getSubjectsBySemester = async (semesterId) => {
  console.log('Fetching subjects for semester:', semesterId);
  
  const response = await apiClient(`${API_BASE_URL}/semester/${semesterId}`, {
    method: 'GET',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch subjects');
  }

  console.log('Subjects fetched:', data);
  return data;
};

/**
 * Get a single subject by ID
 * @param {string} subjectId - Subject ID
 * @returns {Promise<Object>}
 */
export const getSubjectById = async (subjectId) => {
  console.log('Fetching subject:', subjectId);
  
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: 'GET',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch subject');
  }

  console.log('Subject fetched:', data);
  return data;
};

/**
 * Update a subject
 * @param {string} subjectId - Subject ID
 * @param {Object} updateData - { name?, credits?, grade?, gradePoint? }
 * @returns {Promise<Object>}
 */
export const updateSubject = async (subjectId, updateData) => {
  console.log('Updating subject:', subjectId, updateData);
  
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update subject');
  }

  console.log('Subject updated:', data);
  return data;
};

/**
 * Delete a subject
 * @param {string} subjectId - Subject ID
 * @returns {Promise<Object>}
 */
export const deleteSubject = async (subjectId) => {
  console.log('Deleting subject:', subjectId);
  
  const response = await apiClient(`${API_BASE_URL}/${subjectId}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete subject');
  }

  console.log('Subject deleted:', data);
  return data;
};

