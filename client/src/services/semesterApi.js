// Semester API Service
const BASE_URL = '/api/v1/semesters';

/**
 * Fetch all semesters for the logged-in user
 */
export const getAllSemesters = async () => {
  try {
    const response = await fetch(BASE_URL, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch semesters');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw error;
  }
};

/**
 * Fetch a single semester by ID
 */
export const getSemesterById = async (semesterId) => {
  try {
    const response = await fetch(`${BASE_URL}/${semesterId}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch semester');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching semester:', error);
    throw error;
  }
};

/**
 * Create a new semester
 */
export const createSemester = async (semesterData) => {
  try {
    console.log('API: Creating semester with data:', semesterData);
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(semesterData),
    });
    
    console.log('API: Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('API: Error response:', error);
      throw new Error(error.error || 'Failed to create semester');
    }
    
    const data = await response.json();
    console.log('API: Success response:', data);
    return data;
  } catch (error) {
    console.error('API: Error creating semester:', error);
    throw error;
  }
};

/**
 * Update an existing semester
 */
export const updateSemester = async (semesterId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/${semesterId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update semester');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating semester:', error);
    throw error;
  }
};

/**
 * Delete a semester
 */
export const deleteSemester = async (semesterId) => {
  try {
    const response = await fetch(`${BASE_URL}/${semesterId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete semester');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting semester:', error);
    throw error;
  }
};

/**
 * Calculate CGPA for a semester
 */
export const calculateSemesterCGPA = async (semesterId) => {
  try {
    const response = await fetch(`${BASE_URL}/${semesterId}/cgpa`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to calculate CGPA');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calculating CGPA:', error);
    throw error;
  }
};
