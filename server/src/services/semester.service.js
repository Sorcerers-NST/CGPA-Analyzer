import prisma from "../../db.config.js";

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

export const createSemester = async (semesterData) => {
  const { semesterNumber, userId, startDate, endDate } = semesterData;

  // Check if semester already exists for this user
  const existingSemester = await prisma.semester.findFirst({
    where: {
      userId: BigInt(userId),
      semesterNumber: parseInt(semesterNumber),
    },
  });

  if (existingSemester) {
    throw new Error("Semester already exists for this user");
  }

  // Create the semester
  const semester = await prisma.semester.create({
    data: {
      semesterNumber: parseInt(semesterNumber),
      userId: BigInt(userId),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
    include: {
      subjects: true,
    },
  });

  return convertBigIntToString(semester);
};

export const getUserSemesters = async (userId) => {
  const semesters = await prisma.semester.findMany({
    where: {
      userId: BigInt(userId),
    },
    include: {
      subjects: true,
    },
    orderBy: {
      semesterNumber: "asc",
    },
  });

  return convertBigIntToString(semesters);
};

export const getSemesterById = async (semesterId, userId) => {
  const semester = await prisma.semester.findFirst({
    where: {
      id: BigInt(semesterId),
      userId: BigInt(userId),
    },
    include: {
      subjects: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!semester) {
    throw new Error("Semester not found");
  }

  return convertBigIntToString(semester);
};

export const updateSemester = async (semesterId, userId, updateData) => {
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

  // Check if updating semester number would create a duplicate
  if (updateData.semesterNumber && updateData.semesterNumber !== semester.semesterNumber) {
    const duplicate = await prisma.semester.findFirst({
      where: {
        userId: BigInt(userId),
        semesterNumber: parseInt(updateData.semesterNumber),
        NOT: {
          id: BigInt(semesterId),
        },
      },
    });

    if (duplicate) {
      throw new Error("Semester number already exists for this user");
    }
  }

  // Prepare update data
  const data = {};
  if (updateData.semesterNumber) {
    data.semesterNumber = parseInt(updateData.semesterNumber);
  }
  if (updateData.startDate !== undefined) {
    data.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
  }
  if (updateData.endDate !== undefined) {
    data.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
  }

  // Update the semester
  const updatedSemester = await prisma.semester.update({
    where: {
      id: BigInt(semesterId),
    },
    data,
    include: {
      subjects: true,
    },
  });

  return convertBigIntToString(updatedSemester);
};

export const deleteSemester = async (semesterId, userId) => {
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

  // Delete all subjects first (cascade should handle this, but explicit is better)
  await prisma.subject.deleteMany({
    where: {
      semesterId: BigInt(semesterId),
    },
  });

  // Delete CGPA records related to this semester
  await prisma.cGPARecord.deleteMany({
    where: {
      semesterId: BigInt(semesterId),
    },
  });

  // Delete leaderboard entries related to this semester
  await prisma.leaderboard.deleteMany({
    where: {
      semesterId: BigInt(semesterId),
    },
  });

  // Delete the semester
  const deletedSemester = await prisma.semester.delete({
    where: {
      id: BigInt(semesterId),
    },
  });

  return convertBigIntToString(deletedSemester);
};

export const calculateSemesterCGPA = async (semesterId, userId) => {
  // Get semester with subjects
  const semester = await prisma.semester.findFirst({
    where: {
      id: BigInt(semesterId),
      userId: BigInt(userId),
    },
    include: {
      subjects: true,
    },
  });

  if (!semester) {
    throw new Error("Semester not found");
  }

  // Filter subjects that have gradePoint (completed subjects)
  const completedSubjects = semester.subjects.filter(
    (subject) => subject.gradePoint !== null && subject.gradePoint !== undefined
  );

  if (completedSubjects.length === 0) {
    return {
      semesterId: semester.id.toString(),
      sgpa: 0,
      totalCredits: 0,
      totalSubjects: semester.subjects.length,
      completedSubjects: 0,
      message: "No completed subjects with grades",
    };
  }

  // Calculate weighted sum and total credits
  let weightedSum = 0;
  let totalCredits = 0;

  completedSubjects.forEach((subject) => {
    weightedSum += subject.gradePoint * subject.credits;
    totalCredits += subject.credits;
  });

  // Calculate SGPA (Semester Grade Point Average)
  const sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  return {
    semesterId: semester.id.toString(),
    semesterNumber: semester.semesterNumber,
    sgpa: parseFloat(sgpa.toFixed(2)),
    totalCredits: parseFloat(totalCredits.toFixed(2)),
    totalSubjects: semester.subjects.length,
    completedSubjects: completedSubjects.length,
    subjects: completedSubjects.map((subject) => ({
      id: subject.id.toString(),
      name: subject.name,
      credits: subject.credits,
      grade: subject.grade,
      gradePoint: subject.gradePoint,
    })),
  };
};
