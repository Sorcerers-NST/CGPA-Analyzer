import * as semesterService from "../services/semester.service.js";

/**
 * Controller to create a new semester
 * POST /api/v1/semesters/
 * Body: { semesterNumber, startDate?, endDate? }
 */
export const createSemester = async (req, res, next) => {
  try {
    console.log('=== CREATE SEMESTER REQUEST ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    
    const userId = req.user?.id; // From JWT middleware
    
    // Check if user ID exists (from JWT token)
    if (!userId) {
      console.log('ERROR: User ID is missing from JWT token');
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token. Please logout and login again.",
      });
    }
    
    const { semesterNumber, startDate, endDate } = req.body;

    // Validate required fields
    if (!semesterNumber) {
      console.log('ERROR: Semester number is missing');
      return res.status(400).json({
        success: false,
        error: "Semester number is required",
      });
    }

    console.log('Creating semester for userId:', userId, 'semesterNumber:', semesterNumber);

    // Create semester
    const semester = await semesterService.createSemester({
      semesterNumber,
      userId,
      startDate,
      endDate,
    });

    console.log('Semester created successfully:', semester);

    return res.status(201).json({
      success: true,
      data: semester,
      message: "Semester created successfully",
    });
  } catch (error) {
    console.error('ERROR creating semester:', error);
    
    // Handle specific errors
    if (error.message === "Semester already exists for this user") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * Controller to get all semesters for logged-in user
 * GET /api/v1/semesters/
 */
export const getAllSemesters = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const semesters = await semesterService.getUserSemesters(userId);

    return res.status(200).json({
      success: true,
      data: semesters,
      count: semesters.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a single semester by ID
 * GET /api/v1/semesters/:id
 */
export const getSemesterById = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Semester ID is required",
      });
    }

    const semester = await semesterService.getSemesterById(id, userId);

    return res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    if (error.message === "Semester not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * Controller to update semester data
 * PUT /api/v1/semesters/:id
 * Body: { semesterNumber?, startDate?, endDate? }
 */
export const updateSemester = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { id } = req.params;
    const updateData = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Semester ID is required",
      });
    }

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    const semester = await semesterService.updateSemester(id, userId, updateData);

    return res.status(200).json({
      success: true,
      data: semester,
      message: "Semester updated successfully",
    });
  } catch (error) {
    if (error.message === "Semester not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Semester number already exists for this user") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * Controller to delete a semester
 * DELETE /api/v1/semesters/:id
 */
export const deleteSemester = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Semester ID is required",
      });
    }

    await semesterService.deleteSemester(id, userId);

    return res.status(200).json({
      success: true,
      message: "Semester and all related data deleted successfully",
    });
  } catch (error) {
    if (error.message === "Semester not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * Controller to calculate CGPA/SGPA for a semester
 * GET /api/v1/semesters/:id/cgpa
 */
export const calculateSemesterCGPA = async (req, res, next) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Semester ID is required",
      });
    }

    const cgpaData = await semesterService.calculateSemesterCGPA(id, userId);

    return res.status(200).json({
      success: true,
      data: cgpaData,
    });
  } catch (error) {
    if (error.message === "Semester not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};
