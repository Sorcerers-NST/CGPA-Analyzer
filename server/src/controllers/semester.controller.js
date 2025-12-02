import * as semesterService from "../services/semester.service.js";

export const createSemester = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error:
          "Authentication error: User ID not found in token. Please logout and login again.",
      });
    }

    const { semesterNumber, startDate, endDate } = req.body;

    if (!semesterNumber) {
      return res.status(400).json({
        success: false,
        error: "Semester number is required",
      });
    }

    const semester = await semesterService.createSemester({
      semesterNumber,
      userId,
      startDate,
      endDate,
    });

    return res.status(201).json({
      success: true,
      data: semester,
      message: "Semester created successfully",
    });
  } catch (error) {
    console.error("ERROR creating semester:", error);

    if (error.message === "Semester already exists for this user") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

export const getAllSemesters = async (req, res, next) => {
  try {
    const userId = req.user.id;
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

export const getSemesterById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

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

export const updateSemester = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Semester ID is required",
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No data provided for update",
      });
    }

    const semester = await semesterService.updateSemester(
      id,
      userId,
      updateData
    );

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

export const deleteSemester = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

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

export const calculateSemesterCGPA = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

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
