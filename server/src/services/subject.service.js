import prisma from "../../db.config.js";

/**
 * Helper function to convert BigInt fields to strings for JSON serialization
 */
const convertBigIntToString = (obj) => {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'bigint') {
        converted[key] = value.toString();
      } else if (Array.isArray(value)) {
        converted[key] = value.map(item => convertBigIntToString(item));
      } else if (value !== null && typeof value === 'object') {
        converted[key] = convertBigIntToString(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }
  
  return obj;
};

/**
 * Create a new subject for a semester
 * @param {Object} subjectData - Subject data including name, credits, grade, gradePoint, semesterId, userId
 * @returns {Promise<Object>} Created subject
 */
export const createSubject = async (subjectData) => {
  const { name, credits, grade, gradePoint, semesterId, userId } = subjectData;

  // Verify that the semester exists and belongs to the user
  const semester = await prisma.semester.findFirst({
    where: {
      id: BigInt(semesterId),
      userId: BigInt(userId),
    },
  });

  if (!semester) {
    throw new Error("Semester not found or you don't have permission to add subjects to it");
  }

  // Check if subject with same name already exists in this semester
  const existingSubject = await prisma.subject.findFirst({
    where: {
      semesterId: BigInt(semesterId),
      name: name.trim(),
    },
  });

  if (existingSubject) {
    throw new Error("A subject with this name already exists in this semester");
  }

  // Create the subject
  const subject = await prisma.subject.create({
    data: {
      name: name.trim(),
      credits: parseFloat(credits),
      grade: grade || null,
      gradePoint: gradePoint !== undefined ? parseFloat(gradePoint) : null,
      semesterId: BigInt(semesterId),
    },
  });

  return convertBigIntToString(subject);
};

/**
 * Get all subjects for a specific semester
 * @param {BigInt|String} semesterId - Semester ID
 * @param {BigInt|String} userId - User ID (for authorization)
 * @returns {Promise<Array>} Array of subjects
 */
export const getSubjectsBySemester = async (semesterId, userId) => {
  // Verify semester belongs to user
  const semester = await prisma.semester.findFirst({
    where: {
      id: BigInt(semesterId),
      userId: BigInt(userId),
    },
  });

  if (!semester) {
    throw new Error("Semester not found");
  }

  const subjects = await prisma.subject.findMany({
    where: {
      semesterId: BigInt(semesterId),
    },
    orderBy: {
      name: "asc",
    },
  });

  return convertBigIntToString(subjects);
};

/**
 * Get a single subject by ID
 * @param {BigInt|String} subjectId - Subject ID
 * @param {BigInt|String} userId - User ID (for authorization)
 * @returns {Promise<Object>} Subject
 */
export const getSubjectById = async (subjectId, userId) => {
  const subject = await prisma.subject.findFirst({
    where: {
      id: BigInt(subjectId),
    },
    include: {
      semester: true,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Verify the subject's semester belongs to the user
  if (subject.semester.userId.toString() !== userId.toString()) {
    throw new Error("You don't have permission to access this subject");
  }

  return convertBigIntToString(subject);
};

/**
 * Update subject data
 * @param {BigInt|String} subjectId - Subject ID
 * @param {BigInt|String} userId - User ID (for authorization)
 * @param {Object} updateData - Data to update (name, credits, grade, gradePoint)
 * @returns {Promise<Object>} Updated subject
 */
export const updateSubject = async (subjectId, userId, updateData) => {
  // Get subject with semester for authorization
  const subject = await prisma.subject.findFirst({
    where: {
      id: BigInt(subjectId),
    },
    include: {
      semester: true,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Verify the subject's semester belongs to the user
  if (subject.semester.userId.toString() !== userId.toString()) {
    throw new Error("You don't have permission to update this subject");
  }

  // Check if updating name would create a duplicate
  if (updateData.name && updateData.name.trim() !== subject.name) {
    const duplicate = await prisma.subject.findFirst({
      where: {
        semesterId: subject.semesterId,
        name: updateData.name.trim(),
        NOT: {
          id: BigInt(subjectId),
        },
      },
    });

    if (duplicate) {
      throw new Error("A subject with this name already exists in this semester");
    }
  }

  // Prepare update data
  const data = {};
  if (updateData.name !== undefined) {
    data.name = updateData.name.trim();
  }
  if (updateData.credits !== undefined) {
    data.credits = parseFloat(updateData.credits);
  }
  if (updateData.grade !== undefined) {
    data.grade = updateData.grade || null;
  }
  if (updateData.gradePoint !== undefined) {
    data.gradePoint = updateData.gradePoint !== null ? parseFloat(updateData.gradePoint) : null;
  }

  // Update the subject
  const updatedSubject = await prisma.subject.update({
    where: {
      id: BigInt(subjectId),
    },
    data,
  });

  return convertBigIntToString(updatedSubject);
};

/**
 * Delete a subject
 * @param {BigInt|String} subjectId - Subject ID
 * @param {BigInt|String} userId - User ID (for authorization)
 * @returns {Promise<Object>} Deleted subject
 */
export const deleteSubject = async (subjectId, userId) => {
  // Get subject with semester for authorization
  const subject = await prisma.subject.findFirst({
    where: {
      id: BigInt(subjectId),
    },
    include: {
      semester: true,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Verify the subject's semester belongs to the user
  if (subject.semester.userId.toString() !== userId.toString()) {
    throw new Error("You don't have permission to delete this subject");
  }

  // Delete the subject
  const deletedSubject = await prisma.subject.delete({
    where: {
      id: BigInt(subjectId),
    },
  });

  return convertBigIntToString(deletedSubject);
};
