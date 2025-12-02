import * as subjectService from "../services/subject.service.js";

export const createSubject = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token.",
      });
    }

    const { name, credits, grade, gradePoint, semesterId } = req.body;

    // Validate required fields
    if (!name || !credits || !semesterId) {
      return res.status(400).json({
        success: false,
        error: "Subject name, credits, and semester ID are required",
      });
    }

    // Create subject
    const subject = await subjectService.createSubject({
      name,
      credits,
      grade,
      gradePoint,
      semesterId,
      userId,
    });

    return res.status(201).json({
      success: true,
      data: subject,
      message: "Subject created successfully",
    });
  } catch (error) {
    console.error("ERROR creating subject:", error);

    if (error.message === "Semester not found or you don't have permission to add subjects to it") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "A subject with this name already exists in this semester") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

export const getSubjectsBySemester = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { semesterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token.",
      });
    }

    const subjects = await subjectService.getSubjectsBySemester(semesterId, userId);

    return res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("ERROR fetching subjects:", error);

    if (error.message === "Semester not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token.",
      });
    }

    const subject = await subjectService.getSubjectById(id, userId);

    return res.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("ERROR fetching subject:", error);

    if (error.message === "Subject not found" || error.message === "You don't have permission to access this subject") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token.",
      });
    }

    const subject = await subjectService.updateSubject(id, userId, updateData);

    return res.json({
      success: true,
      data: subject,
      message: "Subject updated successfully",
    });
  } catch (error) {
    console.error("ERROR updating subject:", error);

    if (error.message === "Subject not found" || error.message === "You don't have permission to update this subject") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "A subject with this name already exists in this semester") {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication error: User ID not found in token.",
      });
    }

    const subject = await subjectService.deleteSubject(id, userId);

    return res.json({
      success: true,
      data: subject,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("ERROR deleting subject:", error);

    if (error.message === "Subject not found" || error.message === "You don't have permission to delete this subject") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};
